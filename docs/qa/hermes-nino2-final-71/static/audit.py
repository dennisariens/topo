#!/usr/bin/env python3
"""Read-only independent static QA. Writes only sibling measurements.json. Needs Pillow.
Run: /path/to/pillow-python docs/qa/hermes-nino2-final-71/static/audit.py
No npm, browser, export generators, implementation writes, or Git mutation.
"""
from pathlib import Path
from collections import Counter
import base64, hashlib, io, json, re, subprocess
from PIL import Image
ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
HEAD = '2c52f121b853d1d8a46555d725ef79c97e0bf85b'
BASE = '2a9dda3d3d8ec567687bc3b61bf9cbde645c752c'
EVIDENCE = '827ebaf313509dde70a2c79ace4cbf3e9cb3ccdc'
def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)
def sha(b):
    return hashlib.sha256(b).hexdigest()
def read(p):
    return (ROOT/p).read_bytes()
assert git('rev-parse','HEAD').decode().strip() == HEAD
html = read('index.html'); text = html.decode()
manifest = json.loads(read('docs/qa/nino-v2-closure-67/artwork-manifest.json'))
oldmanifest = json.loads(git('show', BASE+':docs/qa/nino-v2-closure-67/artwork-manifest.json'))
rows = manifest['assets']
assert len(rows) == len({a['path'] for a in rows}) == manifest['count']
v2 = json.loads(re.search(r'// BEGIN NINO V2\nconst NINO_V2_ART=(\{[^\n]+\});\n', text)[1])
errors=[]; measured=[]
for a in rows:
    path=a['path']; present=(ROOT/path).is_file()
    b=read(path) if present else git('cat-file','blob',a['git_blob'])
    actual={'path':path,'present':present,'bytes':len(b),'sha256':sha(b),
            'blob':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),
            'status':a['status'],'embedded_base64_occurrences':text.count(base64.b64encode(b).decode())}
    for key,want in [('bytes',a['bytes']),('sha256',a['sha256']),('blob',a['git_blob']),('present',a['delivery_present'])]:
        if actual[key]!=want: errors.append([path,key,actual[key],want])
    if not path.endswith('.svg'):
        im=Image.open(io.BytesIO(b)); im.load(); rgba=im.convert('RGBA'); hist=rgba.getchannel('A').histogram()
        actual.update(dimensions=list(im.size),format=im.format,mode=im.mode,decoded_RGBA_sha256=sha(rgba.tobytes()),
                      alpha={'range':list(rgba.getchannel('A').getextrema()),'transparent_pixels':hist[0],'partial_pixels':sum(hist[1:255]),'opaque_pixels':hist[255]})
        for key in ['dimensions','format','mode','decoded_RGBA_sha256','alpha']:
            if actual[key]!=a.get(key):errors.append([path,key,actual[key],a.get(key)])
    claimed=a['runtime_state']=='integrated'; actual['runtime_claim']=claimed
    # Source-only aliases can share identical bytes with an explicitly embedded export.
    if claimed and not actual['embedded_base64_occurrences']:errors.append([path,'claimed integrated but bytes absent'])
    if not claimed and actual['embedded_base64_occurrences']:
        actual['embedded_via_identical_export_alias']=[r['path'] for r in rows if r['runtime_state']=='integrated' and r['sha256']==a['sha256']]
        if not actual['embedded_via_identical_export_alias']:errors.append([path,'unclaimed embedding without export alias'])
    measured.append(actual)
# Independent exact bounded normalization, not production audit helper.
normal=text
style='<style>/* BEGIN NINO V2 CSS */'+read('scripts/nino-v2.css').decode()+'/* END NINO V2 CSS */</style>'
script='// BEGIN NINO V2\nconst NINO_V2_ART='+json.dumps(v2,separators=(',',':'),ensure_ascii=False)+';\n'+read('scripts/nino-v2.js').decode()+'// END NINO V2\n'
for block in [style,script]:
    assert normal.count(block)==1
    normal=normal.replace(block,'',1)
css=read('scripts/nino-cplus.css').decode()
cplus='<style>/* BEGIN NINO CPLUS */\n'+css+'/* END NINO CPLUS */\n</style>'
assert normal.count(cplus)==1
normal=normal.replace(cplus,'',1).replace('<title>NINO · La Grande Avventura · Topografie Italië</title>','<title>Topo Italië · leer de kaart</title>')
assert normal.encode()==git('show',BASE+':index.html')
assert sha(read('scripts/nino-cplus.css'))=='6ae57c87df8c452643768e6be3878aca226b937d79da26800d30949b632cd3d9'
assert sha(read('scripts/nino-v2.css'))=='e2aef015134ea16b432a69ffe6e77b2289b360723110b28ed1a30a086ca59f88'
assert sha(read('scripts/nino-v2.js'))=='380d1b2396ef8810217de16c0469f2c80df78be0bfcdc8dc821f7401536ead80'
for key,a in v2.items():
    b=read(a['path']); im=Image.open(io.BytesIO(b));
    assert sha(b)==a['sha256'] and [a['width'],a['height']]==list(im.size)
    assert a['src']=='data:image/webp;base64,'+base64.b64encode(b).decode()
archival=next(a for a in measured if a['path'].endswith('/book/masters/passport-open-book.png'))
assert archival['dimensions']==[1586,992] and archival['status']=='OPTIONAL DEFERRED' and not archival['embedded_base64_occurrences']
assert not any(a['status']=='READY' and isinstance(a['visual_approval'],dict) and a['visual_approval'].get('artwork') in ['ARCHIVAL REFERENCE','REWORK','REJECTED'] for a in rows)
# Check all old art entries against same named Git objects; no assumed trust in current ledger.
oldchanges=[]
for a in oldmanifest['assets']:
    n=next(r for r in rows if r['path']==a['path'])
    if n['sha256']!=a['sha256'] or n['git_blob']!=a['git_blob']:oldchanges.append(a['path'])
assert oldchanges==[]
basefiles=git('ls-tree','-r','--name-only',BASE).decode().splitlines()
protected=[p for p in basefiles if p.startswith(('assets/','output/art/','output/pdf/')) or p in ['print.html','package.json','package-lock.json'] or (p.startswith('scripts/') and (p.endswith('.test.mjs') or p in ['scripts/learning-engine.js','scripts/route-engine.js','scripts/map-hit.js','scripts/focus-mode.js','scripts/schoolblad.js','scripts/discovery-map.js']))]
protected_changed=[p for p in protected if git('rev-parse',BASE+':'+p)!=git('rev-parse',HEAD+':'+p)]
assert protected_changed==[]
aliases={p:sha(read(p)) for p in ['index.html','output/html/TOPO-NINO-Computer-Release.html','output/html/TOPO-Italie-Computer.html','output/html/topo-italie-interactief.html','output/html/topo-italie-duolingo.html']}
assert len(set(aliases.values()))==1
# dist is ignored/generated, so report local availability without treating it as pinned Git evidence.
dist=ROOT/'dist/index.html'
counts={field:dict(Counter(a[field] for a in rows)) for field in ['status','source_availability','delivery_state','runtime_state']}
for field in manifest['availability_totals']: assert counts[field]==manifest['availability_totals'][field]
review=git('show',EVIDENCE+':docs/qa/nino-v2-hermes-67/README.md')
result={'tested_sha':HEAD,'baseline_sha':BASE,'prior_evidence_sha':EVIDENCE,'prior_evidence_readme_sha256':sha(review),'artifact_bytes':len(html),'artifact_sha256':sha(html),'aliases_sha256':aliases,'local_dist_parity':dist.exists() and dist.read_bytes()==html,'independent_exact_normalization_equals_PR70':True,'protected_file_count':len(protected),'protected_changes':protected_changed,'old_art_rows_unchanged':len(oldmanifest['assets']),'counts':counts,'ready_source_only':sum(a['status']=='READY' and not a['delivery_present'] for a in rows),'actual_embedded_manifest_paths':sum(bool(a['embedded_base64_occurrences']) for a in measured),'v2_art_keys':len(v2),'v2_roles':{k:{x:v for x,v in a.items() if x!='src'} for k,a in v2.items()},'archival_open_book':archival,'measurement_errors':errors,'assets':measured,'limitations':['Static/binary audit only; no npm/browser/runtime acceptance','Historical approvals are scoped source decisions, not independent runtime approval','Owner folio-native-resolution and Venezia-reconstructed-matte acceptance remain separate']}
(OUT/'measurements.json').write_text(json.dumps(result,indent=2)+'\n')
assert not errors, errors
print(json.dumps({k:v for k,v in result.items() if k not in ['assets','v2_roles']},indent=2))
