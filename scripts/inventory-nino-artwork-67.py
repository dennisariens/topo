#!/usr/bin/env python3
"""Measure actual files and compare actual pinned Git blobs, not PR prose."""
import base64
import csv
import hashlib
import io
import re
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT/'docs/qa/nino-v2-closure-67'
def git(*args):
    return subprocess.check_output(['git',*args],cwd=ROOT)
def sha(data):
    return hashlib.sha256(data).hexdigest()
refs = {
 '1bf86b3e1c69319bed8ef877243070a64d97a12e':'codex/topo-nino-computer-release-20261030 / PR61',
 '8a704cb23da97baf7197635df7fa12f06b864a24':'art/nino-travel-stamps-v2-20261026',
 'bf91fb3fa6ac553f78b33169efa9f2bf60e215ca':'art/nino-pizza-rewards-20261024 / PR63 base',
 '5cfcbc37eb6b0266d76d2c05404d993908611410':'art/nino-micro-icons-v2-20261030 / PR65',
 'cec9fd26ac858bdbcbdf03b5ee6b0ea246e3e02f':'art/nino-venezia-scalloped-20261031 / PR66'}
sources = {}
for commit,branch in refs.items():
    for line in git('ls-tree','-r',commit,'assets/nino','output/art').decode().splitlines():
        meta,path=line.split('\t'); blob=meta.split()[2]
        sources.setdefault(path,[]).append(dict(commit=commit,branch=branch,blob=blob))
review=json.loads(git('show','9e58e756f124:docs/qa/artwork-20261029/hermes-final/final-asset-ledger.json'))
approvals={r['path']:r for r in review['assets']}
exports=json.loads((OUT/'export-verification.json').read_text())['exports']
derived={r['path']:r for r in exports}
html=(ROOT/'index.html').read_text()
runtime=json.loads((ROOT/'assets/nino/runtime-manifest.json').read_text())
used={a['path']:role for role,a in runtime['assets'].items()}
used.update({'output/art/nino-op-de-scooter.webp':'original scooter portrait/CSS',
             'output/art/topo-italie-avontuur.webp':'original route panorama'})
v2=re.search(r'const NINO_V2_ART=(\{[^\n]+\});',html)
if v2:
    used.update({a['path']:'NINO V2 '+key+'; read-only earned-state presentation' for key,a in json.loads(v2.group(1)).items()})
rows=[]
paths=set(sources)|{f.relative_to(ROOT).as_posix() for f in (ROOT/'assets/nino').rglob('*') if f.is_file()}
for path in sorted(paths):
    file=ROOT/path
    if file.suffix.lower() not in ['.png','.webp','.svg','.ico','.jpg','.jpeg']:
        continue
    present=file.is_file()
    data=file.read_bytes() if present else git('cat-file','blob',sources[path][-1]['blob'])
    blob=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
    provenance=[s for s in sources.get(path,[]) if s['blob']==blob]
    row=dict(path=path,delivery_present=present,bytes=len(data),sha256=sha(data),git_blob=blob,
             provenance=provenance or [{'commit':'delivery commit containing this manifest','branch':'codex/nino-v2-artwork-closure-67','recipe':derived.get(path,'PR66 recipe for Venezia')}],
             dimensions=None,format=file.suffix[1:].upper(),mode=None,alpha=None,color_profile=None,
             visual_approval='Owner-approved package per issue67; exact derivative independent QA pending',
             export_readiness='source only',runtime_usage='NOT INTEGRATED',missing_dependencies=[])
    row['intended_runtime_placement']='Preserved source/reference; no new placement authorized'
    for fragment,placement in [('/chapter-icons/','Existing chapter scene slot; exact canonical chapter only'),('/stamps/','Future passport: exact completed chapter with live caption'),('/gold/','Future passport: chapter goldAt>0; final only all11 goldAt>0; live labels'),('/book/','Future shared passport folio shell; no fixed concept-page backgrounds'),('/postcards/','Future earned cultural souvenir holder; no ownership invented'),('/arrivo/','Future passport: actual Vespa journey only'),('/pizza/','Approved static open-box fallback; no hinged-lid frames'),('/micro-v2/','Small favicon; preserve separately approved large icon'),('/characters/','Existing Nino pose policy only')]:
        if fragment in path:row['intended_runtime_placement']=placement
    if file.suffix!='.svg':
        im=Image.open(io.BytesIO(data));im.load();rgba=im.convert('RGBA');alpha=rgba.getchannel('A')
        row.update(dimensions=list(im.size),format=im.format,mode=im.mode,
                   alpha=dict(range=list(alpha.getextrema()),transparent_pixels=alpha.histogram()[0],partial_pixels=sum(alpha.histogram()[1:255]),opaque_pixels=alpha.histogram()[255]),
                   color_profile={'icc':bool(im.info.get('icc_profile')),'gamma':im.info.get('gamma'),'srgb':im.info.get('srgb')},decoded_RGBA_sha256=sha(rgba.tobytes()))
        if im.format=='ICO':row['ico_sizes']=sorted([list(s) for s in im.info['sizes']])
    if path in approvals:
        a=approvals[path]; assert a['sha256']==row['sha256'],path
        row['visual_approval']={'review':'9e58e756f124ff37d47b4ebcfd274684125d8aeb','artwork':a['artwork_verdict'],'qa':a['qa_verdict'],'notes':a['notes']}
    if '/chapter-icons/' in path:
        row['visual_approval']='Owner design GO; PR48 exact exports previously accepted; warm-paper/live-label scope retained'
    if '/micro-v2/' in path:row['visual_approval']='Owner approved PR65; runtime/browser acceptance pending'
    archival = path.endswith('/book/masters/passport-open-book.png') or (isinstance(row['visual_approval'],dict) and row['visual_approval'].get('artwork') in ['ARCHIVAL REFERENCE','REWORK','REJECTED'])
    if archival or '/concepts/' in path or '/qa/' in path or ('stamp-05-isole' in path and '/rework/' not in path and '/exports/' not in path):
        row['status']='OPTIONAL DEFERRED';row['export_readiness']='concept/rejected/diagnostic; never activate from this ledger'
    elif path in used:
        assert base64.b64encode(data).decode() in html,path
        row.update(status='READY',runtime_usage='embedded data URI: '+used[path],export_readiness='existing verified runtime bytes')
    elif '/exports/' in path or '/micro-v2/' in path:
        row.update(status='INTEGRATION PENDING',export_readiness='actual export present; independent delivery QA pending')
    else:
        row['status']='READY' if '/masters/' in path or '/characters/' in path else 'EXPORT PENDING'
    if '/micro-v2/' in path and file.name in ['favicon.ico','topo-nino-italy-only-16.png','topo-nino-scooter-italy-32.png']:
        assert base64.b64encode(data).decode() in html,path
        row.update(status='READY',runtime_usage='embedded favicon data URI; independent browser/owner acceptance pending',export_readiness='exact PR65 binary')
    if not present:
        row['export_readiness']+='; audited at pinned source Git blob, intentionally not duplicated into integration tree'
    if archival:
        row['intended_runtime_placement']='ARCHIVAL / REWORK reference only; baked historical content; excluded from production passport'
        row['missing_dependencies']=['Not a blank folio; no production integration authorized']
    elif '/book/' in path:
        row['missing_dependencies'].append('Native1086x1448; runtime <=543 CSS px/page at DPR2; final owner visual acceptance pending; no higher-native-resolution approval')
    if path not in used and ('/gold/' in path or '/stamps/' in path or '/postcards/' in path or '/arrivo/' in path):
        row['missing_dependencies'].append('Export available; not wired into NINO V2 runtime presentation')
    if 'venezia-scalloped' in path:
        row['missing_dependencies'].append('exact owner-reviewed raster matte/ZIP unavailable at a documented repository path; PR66 572-point reconstruction requires independent edge acceptance')
    row['source_availability']='pinned Git blob' if provenance else 'delivery derivative'
    row['delivery_state']='export/file present' if present else 'source only; not delivered'
    row['runtime_state']='integrated' if row['runtime_usage'].startswith('embedded') else 'not integrated'
    rows.append(row)
result=dict(baseCommit=next(iter(refs)),sourceRefs=refs,reviewCommit='9e58e756f124ff37d47b4ebcfd274684125d8aeb',count=len(rows),
            note='Status is scoped per row. Source availability, delivery and runtime totals are separate; none self-approve independent QA.',
            availability_totals={field:{value:sum(r[field]==value for r in rows) for value in sorted(set(r[field] for r in rows))} for field in ['source_availability','delivery_state','runtime_state']},assets=rows)
(OUT/'artwork-manifest.json').write_text(json.dumps(result,indent=2)+'\n')
with (OUT/'artwork-manifest.csv').open('w') as f:
    writer=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');writer.writeheader()
    for row in rows:writer.writerow({k:json.dumps(v) if isinstance(v,(list,dict)) else v for k,v in row.items()})
print('Measured and provenance-checked',len(rows),'actual artwork files')
