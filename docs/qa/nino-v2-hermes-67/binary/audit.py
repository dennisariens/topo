#!/usr/bin/env python3
"""Independent read-only binary QA; run with Python + Pillow 10.4.0.
Only writes evidence beside this file. Never imports/runs the production exporters.
Usage: python docs/qa/nino-v2-hermes-67/binary/audit.py
Pinned Git objects must be available locally. All sources read via git cat-file/show.
"""
import collections
import hashlib
import io
import json
import math
import platform
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
import PIL
from PIL import Image, ImageChops, ImageDraw

TARGET = '2a9dda3d3d8ec567687bc3b61bf9cbde645c752c'
ART = '8a704cb23da97baf7197635df7fa12f06b864a24'
BASELINE = 'fab2bbae943d507fcd103887012f790c144f43a5'
PR66 = 'cec9fd26ac858bdbcbdf03b5ee6b0ea246e3e02f'
OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
PREFIX = 'assets/nino/travel-passport/'

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)

def sha(data):
    return hashlib.sha256(data).hexdigest()

def blob(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()

def at(commit, path):
    return git('show', commit + ':' + path)

def tree(commit):
    return {p.decode(): oid.decode() for line in git('ls-tree', '-r', '-z', commit).split(b'\0') if line for meta,p in [line.split(b'\t',1)] for mode,kind,oid in [meta.split()] if kind == b'blob'}

def image(data):
    return Image.open(io.BytesIO(data)).convert('RGBA')

def dump(name, data):
    (OUT/name).write_text(json.dumps(data, indent=2, sort_keys=True)+'\n')

def metrics(data):
    if data.lstrip().startswith((b'<svg', b'<?xml')):
        node = ET.fromstring(data)
        assert node.tag.endswith('svg')
        return dict(dimensions=None, format='SVG', mode=None, alpha=None, color_profile=None)
    im = Image.open(io.BytesIO(data))
    im.load()
    rgba = im.convert('RGBA')
    a = rgba.getchannel('A')
    h = a.histogram()
    result = dict(dimensions=list(im.size), format=im.format, mode=im.mode,
        decoded_RGBA_sha256=sha(rgba.tobytes()),
        alpha=dict(range=list(a.getextrema()), transparent_pixels=h[0], partial_pixels=sum(h[1:255]), opaque_pixels=h[255]),
        color_profile=dict(icc=bool(im.info.get('icc_profile')), gamma=im.info.get('gamma'), srgb=im.info.get('srgb')))
    # Supplement manifest with meaningful alpha/edge evidence, not just bounding boxes.
    w, ht = im.size
    edges = bytes(a.crop((0,0,w,1)).tobytes()+a.crop((0,ht-1,w,ht)).tobytes()+a.crop((0,1,1,ht-1)).tobytes()+a.crop((w-1,1,w,ht-1)).tobytes()) if ht>1 and w>1 else a.tobytes()
    result['alpha_diagnostics'] = dict(nonzero_bbox=a.getbbox(), histogram=h,
        edge_pixels=len(edges), edge_nonzero=sum(v>0 for v in edges), edge_above_2=sum(v>2 for v in edges), edge_opaque=edges.count(255), edge_max=max(edges))
    if im.format == 'ICO':
        result['ico_sizes'] = [list(s) for s in sorted(im.ico.sizes())]
        result['ico_frame_RGBA_sha256'] = {str(s):sha(im.ico.getimage(s).convert('RGBA').tobytes()) for s in sorted(im.ico.sizes())}
    return result

def compare(a, b):
    if a.size != b.size:
        return dict(equal=False, size_a=list(a.size), size_b=list(b.size))
    aa, bb = a.tobytes(), b.tobytes()
    changed = visible = alpha = rgb = 0
    # Explicit channel comparisons: RGBA getbbox alone hides invisible RGB differences.
    for i in range(0,len(aa),4):
        x,y=aa[i:i+4],bb[i:i+4]
        if x != y:
            changed += 1
            rgb += x[:3] != y[:3]
            alpha += x[3] != y[3]
            visible += (x[3]>0 or y[3]>0)
    return dict(size=list(a.size), decoded_RGBA_equal=aa==bb, changed_RGBA_pixels=changed,
        changed_RGB_pixels=rgb, changed_alpha_pixels=alpha, changed_visible_RGBA_pixels=visible,
        invisible_RGB_only_changed_pixels=changed-visible, alpha_equal=alpha==0, visible_RGBA_equal=visible==0)


def background(size, kind):
    colors={'warm':(246,239,221,255),'dark':(27,34,40,255)}
    if kind in colors:
        return Image.new('RGBA',size,colors[kind])
    bg=Image.new('RGBA',size,(245,245,245,255)); d=ImageDraw.Draw(bg)
    for y in range(0,size[1],12):
        for x in range(0,size[0],12):
            if (x//12+y//12)%2:
                d.rectangle((x,y,x+11,y+11),fill=(187,187,187,255))
    return bg


def composite(im,kind):
    return Image.alpha_composite(background(im.size,kind),im).convert('RGB')


def main():
    assert git('rev-parse', 'HEAD').decode().strip()==TARGET, 'Run in exact pinned evidence worktree'
    manifest_bytes=at(TARGET,'docs/qa/nino-v2-closure-67/artwork-manifest.json')
    manifest=json.loads(manifest_bytes)
    rows=manifest['assets']
    assert len(rows)==manifest['count']==239
    assert len({r['path'] for r in rows})==239
    target_tree=tree(TARGET)
    bypath={r['path']:r for r in rows}
    results=[]; issues=[]
    for index,r in enumerate(rows):
        p=r['path']; data=git('cat-file','blob',r['git_blob'])
        present=p in target_tree
        actual=metrics(data)
        actual.update(bytes=len(data),sha256=sha(data),git_blob=blob(data),delivery_present=present)
        discrepancies=[]
        for key in ('bytes','sha256','git_blob','delivery_present','dimensions','format','mode','alpha','color_profile','decoded_RGBA_sha256','ico_sizes'):
            if key in r and actual.get(key)!=r[key]:
                discrepancies.append(dict(field=key,expected=r[key],actual=actual.get(key)))
        provenance=[]
        for source in r['provenance']:
            declared_commit=source['commit']
            resolved_commit=TARGET if declared_commit=='delivery commit containing this manifest' else declared_commit
            if not re.fullmatch(r'[0-9a-f]{40}', resolved_commit):
                discrepancies.append(dict(field='provenance_commit',expected='40 lowercase hexadecimal characters or documented delivery self-reference',actual=declared_commit))
                continue
            st=tree(resolved_commit)
            # Recipe records do not declare a source blob; verify destination membership here,
            # and independently measure source equivalence in export-equivalence.json.
            reference_blob=source.get('blob',r['git_blob'])
            source_paths=sorted(q for q,oid in st.items() if oid==reference_blob)
            src=git('cat-file','blob',reference_blob)
            check=dict(commit=declared_commit,resolved_commit=resolved_commit,source_paths=source_paths,actual_blob=blob(src),declared_blob=source.get('blob'),reference_blob=reference_blob,same_as_inventory=src==data,kind='source blob' if 'blob' in source else 'recipe destination membership')
            check['match']=bool(source_paths) and check['actual_blob']==reference_blob and check['same_as_inventory']
            provenance.append(check)
            if not check['match']: discrepancies.append(dict(field='provenance',details=check))
        filecheck=dict(exists=(ROOT/p).is_file())
        if present:
            delivered=git('cat-file','blob',target_tree[p])
            filecheck.update(target_blob=target_tree[p],target_equals_inventory=delivered==data,
                working_file_sha256=sha((ROOT/p).read_bytes()) if filecheck['exists'] else None,
                working_file_equals_target=filecheck['exists'] and (ROOT/p).read_bytes()==delivered)
            if not filecheck['target_equals_inventory'] or not filecheck['working_file_equals_target']:
                discrepancies.append(dict(field='delivery_bytes',details=filecheck))
        elif filecheck['exists']:
            discrepancies.append(dict(field='unexpected_working_file',details=filecheck))
        entry=dict(index=index,path=p,actual=actual,provenance=provenance,delivery=filecheck,mismatches=discrepancies,pass_all_measured_fields=not discrepancies)
        results.append(entry)
        if discrepancies: issues.append(dict(path=p,mismatches=discrepancies))
        if index%40==0: print('inventoried',index+1,flush=True)
    dump('inventory-results.json',dict(target=TARGET,manifest_sha256=sha(manifest_bytes),rows=results,mismatches=issues))

    def data_for(path):
        return git('cat-file','blob',bypath[path]['git_blob'])
    def im_for(path): return image(data_for(path))
    relations=[]
    def relation(source,dest,width=None,byte_required=False):
        a,b=data_for(source),data_for(dest)
        expected=image(a)
        if width: expected=expected.resize((width,width),Image.Resampling.LANCZOS)
        c=compare(expected,image(b))
        c.update(source=source,destination=dest,reference='native source' if not width else 'independent Pillow RGBA LANCZOS directly from master',bytes_equal=a==b)
        c['pass']=c.get('decoded_RGBA_equal',False) and (not byte_required or a==b)
        relations.append(c)
    for name,widths in [('gold-chapter-seal-v2',[None,64,128]),('gold-esploratore-doro',[None,240,480])]:
        for w in widths:
            for ext in ('png','webp'):
                relation(PREFIX+'gold/masters/'+name+'.png',PREFIX+'gold/exports/'+name+'-'+(str(w) if w else 'native')+'.'+ext,w)
    relation(PREFIX+'stamps/rework/stamp-05-isole-geography-candidate.png',PREFIX+'stamps/exports/stamp-05-isole.webp')
    relation(PREFIX+'arrivo/qa-candidates/arrivo-travel-ink-preview.png',PREFIX+'arrivo/exports/arrivo-travel.webp')
    for p in sorted(bypath):
        if '/stamps/qa-candidates/' in p and 'stamp-05-' not in p:
            dest=p.replace('/qa-candidates/','/exports/').replace('-ink-preview','')
            if dest in bypath: relation(p,dest,byte_required=True)
        if '/book/qa-candidates/' in p:
            dest=p.replace('/qa-candidates/','/exports/')
            if dest in bypath: relation(p,dest,byte_required=True)
        if '/postcards/masters/' in p and 'venezia' not in p:
            dest=p.replace('/masters/','/exports/').replace('.png','.webp')
            if dest in bypath: relation(p,dest)
    assert len(relations)==30, len(relations)
    dump('export-equivalence.json',dict(target=TARGET,comparisons=relations,failures=[r for r in relations if not r['pass']]))

    # Independently enumerate old masters from the baseline tree, not the author's PASS file.
    baseline_tree=tree(BASELINE)
    masters=sorted(p for p in baseline_tree if p.startswith(PREFIX) and '/masters/' in p and p.endswith('.png'))
    assert len(masters)==20, len(masters)
    mt=[]
    for p in masters:
        old=at(BASELINE,p)
        versions=[]
        for ref in (ART,PR66,TARGET):
            t=tree(ref)
            present=p in t
            versions.append(dict(commit=ref,present=present,blob=t.get(p),unchanged=t.get(p)==baseline_tree[p] if present else None,
                note=None if present else 'Source-only master intentionally absent from target delivery'))
        mt.append(dict(path=p,baseline_blob=baseline_tree[p],baseline_sha256=sha(old),inventory_blob=bypath[p]['git_blob'],inventory_equals_baseline=data_for(p)==old,versions=versions))
    dump('master-preservation.json',dict(baseline=BASELINE,masters=mt,count=len(mt),note='Absent target source-only masters are not a claim that the target contains twenty files. ART/PR66 plus inventory preserve all twenty.'))

    vp=PREFIX+'postcards/exports/postcard-04-venezia-scalloped-'
    orig=im_for(PREFIX+'postcards/masters/postcard-04-venezia-front.png')
    full=im_for(vp+'full.png'); tight=im_for(vp+'tight.png')
    rgbdiff=ImageChops.difference(orig.convert('RGB'),full.convert('RGB'))
    vc=dict(full_RGB_source_exact=rgbdiff.getbbox() is None,
        tight_crop_half_open=[23,26,1520,999],tight_equals_full_crop=compare(full.crop((23,26,1520,999)),tight),
        full_png_webp=compare(full,im_for(vp+'full.webp')),
        tight_png_webp=compare(tight,im_for(vp+'tight.webp')),
        full_alpha_values=[i for i,v in enumerate(full.getchannel('A').histogram()) if v],
        full_nonzero_alpha_bbox=full.getchannel('A').getbbox(),
        approved_owner_matte_comparison=dict(status='BLOCKED',reason='No exact owner-reviewed raster matte binary/path/blob supplied; reconstructed export inspection cannot establish equality or independently reproduce historical 0.1264% tolerance.'))
    dump('venezia-comparison.json',vc)

    # True alpha composites. Each contact tile is composited at native resolution first,
    # then thumbnailed for the overview. Native diagnostic sheets are never rescaled.
    sheets=[]
    def save_sheet(items,name,thumb=180):
        cellw=thumb*3+24; cellh=thumb+65; cols=2
        canvas=Image.new('RGB',(cellw*cols,cellh*math.ceil(len(items)/cols)), 'white'); d=ImageDraw.Draw(canvas)
        for i,p in enumerate(items):
            im=im_for(p); x=(i%cols)*cellw; y=(i//cols)*cellh
            label=p.rsplit('/',1)[-1]
            d.text((x+4,y+3),label,fill='black'); d.text((x+4,y+18),str(im.size)+' warm / dark / checker',fill='black')
            for j,kind in enumerate(('warm','dark','checker')):
                c=composite(im,kind); c.thumbnail((thumb,thumb),Image.Resampling.LANCZOS)
                canvas.paste(c,(x+8+j*(thumb+2),y+40))
        path='contacts-'+name+'.png'; canvas.save(OUT/path); sheets.append(dict(path=path,assets=items,native=False))
    groups=collections.defaultdict(list)
    for r in rows:
        p=r['path']
        if not r['delivery_present'] or r['format']=='SVG': continue
        if '/micro-v2/' in p: cat='micro'
        elif '/rewards/pizza/' in p: cat='pizza'
        elif '/travel-passport/' in p: cat=p.split('/travel-passport/')[1].split('/')[0]
        else: cat='characters-and-runtime-art'
        groups[cat].append(p)
    for cat,items in sorted(groups.items()): save_sheet(items,cat)
    icons=[p for p in bypath if '/chapter' in p and '/exports/' in p]
    if icons: save_sheet(icons,'source-chapter-icons')
    native=[p for p in bypath if bypath[p]['delivery_present'] and (('/gold/exports/' in p and p.endswith('.png')) or p.endswith('stamp-05-isole.webp') or p.endswith('arrivo-travel.webp') or (p.startswith(vp) and p.endswith('.png')) or '/book/exports/' in p)]
    for p in native:
        im=im_for(p); canvas=Image.new('RGB',(im.width*3,im.height+24),'white'); d=ImageDraw.Draw(canvas)
        for j,k in enumerate(('warm','dark','checker')):
            d.text((j*im.width+2,4),k,fill='black'); canvas.paste(composite(im,k),(j*im.width,24))
        name='native-'+p.rsplit('/',1)[-1]+'.png'; canvas.save(OUT/name); sheets.append(dict(path=name,assets=[p],native=True,painted_pixels=list(im.size)))
    tiny=[]
    for p in groups['micro']:
        if bypath[p]['format']=='ICO':
            ico=Image.open(io.BytesIO(data_for(p)))
            tiny.extend((p+' '+str(s),ico.ico.getimage(s).convert('RGBA')) for s in sorted(ico.ico.sizes()))
        else: tiny.append((p,im_for(p)))
    tinycanvas=Image.new('RGB',(1900,sum(max(150,im.height*8+55) for _,im in tiny)), 'white'); d=ImageDraw.Draw(tinycanvas); y=0
    for label,im in tiny:
        d.text((5,y+3),label,fill='black')
        x=5
        for k in ('warm','dark','checker'):
            d.text((x,y+20),k+' native | 8x NEAREST',fill='black')
            tinycanvas.paste(composite(im,k),(x,y+40))
            tinycanvas.paste(composite(im,k).resize((im.width*8,im.height*8),Image.Resampling.NEAREST),(x+75,y+40)); x+=630
        y+=max(150,im.height*8+55)
    tinycanvas.save(OUT/'tiny-native-and-8x-nearest.png')
    dump('contact-sheets.json',dict(sheets=sheets,tiny='tiny-native-and-8x-nearest.png',delivered_raster_count=sum(len(v) for v in groups.values()),source_chapter_icon_count=len(icons),note='Visual review aids only; not owner visual acceptance. SVG sources byte/XML-validated, not rasterized.'))
    summary=dict(target=TARGET,python=platform.python_version(),pillow=PIL.__version__,script_sha256=sha(Path(__file__).read_bytes()),
        manifest_count=len(rows),unique_paths=len(bypath),unique_blobs=len(set(r['git_blob'] for r in rows)),
        delivered=sum(r['delivery_present'] for r in rows),source_only=sum(not r['delivery_present'] for r in rows),
        decoded_rasters=sum(r['format']!='SVG' for r in rows),svg_count=sum(r['format']=='SVG' for r in rows),
        manifest_mismatch_rows=len(issues),export_comparison_count=len(relations),export_failures=sum(not r['pass'] for r in relations),
        old_master_count=len(mt),old_masters_inventory_unchanged=sum(r['inventory_equals_baseline'] for r in mt),
        old_master_present_in_target=sum(r['versions'][-1]['present'] for r in mt),
        old_masters_changed_in_ART_or_PR66=sum(v['unchanged'] is False for r in mt for v in r['versions'][:2]),
        venezia=vc,scope='Independent binary measurements, not final visual/runtime approval. Owner matte comparison BLOCKED.')
    dump('summary.json',summary)
    print(json.dumps(summary,indent=2))
    return 1 if issues or any(not r['pass'] for r in relations) else 0

if __name__=='__main__':
    sys.exit(main())
