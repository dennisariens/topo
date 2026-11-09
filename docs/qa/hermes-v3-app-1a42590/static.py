from pathlib import Path
from PIL import Image
import json,subprocess,hashlib,re,base64
R=Path('/Users/dennisariens/projects/topo-v3-app-1a42590');O=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-app-1a42590/static');O.mkdir(parents=True,exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest(); art='05ab1d0808aa20a18b99fea81950a6284539bf03';relief='2a7b0cf';rows=[]
source=json.loads(subprocess.check_output(['git','-C',str(R),'show',art+':assets/v3/render/manifest.json']));candidate=json.loads((R/'assets/v3/render/manifest.json').read_text());assert candidate==source
for a in source['assets']:
 def visit(obj,role=''):
  if isinstance(obj,dict):
   if 'path'in obj and'sha256'in obj:
    if not role.split('.')[0].startswith('export'):return
    p=R/obj['path'];b=p.read_bytes();original=subprocess.check_output(['git','-C',str(R),'show',art+':'+obj['path']]);im=Image.open(p);actual={'sha256':sha(b),'bytes':len(b),'size':list(im.size),'alpha':im.convert('RGBA').getchannel('A').getextrema()[0]<255};rows.append({'id':a['id'],'role':role,'path':obj['path'],'actual':actual,'expected':obj,'matchesArtGit':b==original,'matchesManifest':all(actual[k]==obj[k]for k in actual)})
   else:
    for k,v in obj.items():visit(v,role+'.'+k if role else k)
 visit(a)
p=json.loads((R/'assets/discovery/terrain-z8-render-provenance.json').read_text());layers={'terrain':p['output'],**{a['role']:a for a in p['pipeline']['decorative_layers']}};layerRows=[]
for role,a in layers.items():
 b=(R/a['path']).read_bytes();ref=subprocess.check_output(['git','-C',str(R),'show',relief+':'+a['path']]);im=Image.open(R/a['path']);layerRows.append({'role':role,'path':a['path'],'sha256':sha(b),'expected':a['sha256'],'bytes':len(b),'size':list(im.size),'mode':im.mode,'matchesProvenance':sha(b)==a['sha256']and len(b)==a['bytes'],'matchesPinnedReliefGit':b==ref})
blob=(R/'output/html/TOPO-V3-Reis-Preview.html').read_bytes();uris=re.findall(rb'data:image/[a-zA-Z0-9.+-]+;base64,([A-Za-z0-9+/=]+)',blob);embedded={sha(base64.b64decode(u))for u in uris};used=[r for r in rows if r['actual']['sha256']in embedded];unused=[r['path']for r in rows if r['actual']['sha256']not in embedded]
assert len(rows)==23 and all(r['matchesArtGit']and r['matchesManifest']for r in rows);assert all(r['matchesProvenance']and r['matchesPinnedReliefGit']for r in layerRows);assert len(used)==17 and len(unused)==6 and all('-48.webp'in s for s in unused)
nov9=[s for s in re.split(r'(?=^## )',(R/'docs/DECISIONS.md').read_text(),flags=re.M)if s.startswith('## 2026-11-09')];(O/'DECISIONS-Nov09.md').write_text('\n'.join(nov9));newhead=subprocess.check_output(['git','-C',str(R),'rev-parse','origin/codex/topo-v3'],text=True).strip();(O/'newer-head-docs-only.diff').write_bytes(subprocess.check_output(['git','-C',str(R),'diff','1a42590',newhead]));result={'appPin':subprocess.check_output(['git','-C',str(R),'rev-parse','HEAD'],text=True).strip(),'artPin':art,'reliefPin':subprocess.check_output(['git','-C',str(R),'rev-parse',relief],text=True).strip(),'manifestEqualToArt':candidate==source,'runtimeFiles':rows,'runtimeFileCount':len(rows),'embeddedArtFiles':len(used),'notEmbedded48pxVariants':unused,'reliefLayers':layerRows,'preview':{'sha256':sha(blob),'bytes':len(blob)},'indexSHA256':sha((R/'index.html').read_bytes()),'acceptedCoastDeviation':'<=2.84SVGpx for V3.0, no reopening','newerHead':newhead,'newerHeadTested':False,'upstreamSourceDEMTilesRebuilt':False};(O/'results.json').write_text(json.dumps(result,indent=2));print(json.dumps({'artFiles':len(rows),'embeddedArt':len(used),'reliefLayers':len(layerRows),'allMatch':True,'preview':result['preview'],'newerHead':newhead},indent=2))
