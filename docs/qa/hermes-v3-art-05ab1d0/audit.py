from pathlib import Path
import json,subprocess,hashlib,csv,re
from PIL import Image,ImageDraw,ImageFont
R=Path('/Users/dennisariens/projects/topo-v3-art-05ab1d0');O=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-art-05ab1d0');O.mkdir(parents=True,exist_ok=True)
target=subprocess.check_output(['git','-C',str(R),'rev-parse','HEAD'],text=True).strip();baseline='908b4a498199ece40a047f19efb2e80fe62812b8';ids={'NINO-PORTRET','SCENE-ROMA','SCENE-NAPOLI'};manifest=json.loads((R/'assets/v3/render/manifest.json').read_text());rows=[];selected=[a for a in manifest['assets']if a['id']in ids]
def walk(id,obj,role=''):
 if isinstance(obj,dict):
  if'path'in obj and'sha256'in obj:
   b=(R/obj['path']).read_bytes();im=Image.open(R/obj['path']);im.load();alpha=im.convert('RGBA').getchannel('A');actual={'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b),'size':list(im.size),'alpha':alpha.getextrema()[0]<255};rows.append({'id':id,'role':role,'path':obj['path'],'expected':obj,'actual':actual,'checks':{k:actual[k]==obj[k]for k in actual}})
  else:
   for k,v in obj.items():walk(id,v,role+'.'+k if role else k)
for a in selected:walk(a,a)
changed=subprocess.check_output(['git','-C',str(R),'diff','--name-only',baseline,target],text=True).splitlines();expected={r['path']for r in rows}|{'assets/v3/render/manifest.json'};assert set(changed)==expected,(changed,expected);assert len(selected)==3 and len(rows)==9 and all(all(r['checks'].values())for r in rows)
old=json.loads(subprocess.check_output(['git','-C',str(R),'show',baseline+':assets/v3/render/manifest.json']));unreviewed=[]
for a in manifest['assets']:
 if a['id']not in ids:
  prior=next(x for x in old['assets']if x['id']==a['id']);assert {k:v for k,v in a.items()if k!='status'}=={k:v for k,v in prior.items()if k!='status'};unreviewed.append(a['id'])
(O/'inventory.json').write_text(json.dumps({'target':target,'baseline':baseline,'assets':sorted(ids),'records':rows,'recordsCount':len(rows),'changedPaths':changed,'outOfScopeNotRetested':unreviewed,'changedOnlyScopedFiles':True},indent=2))
with(O/'file-checks.csv').open('w',newline='')as f:
 w=csv.writer(f);w.writerow(['asset','role','path','bytes','width','height','effectiveAlpha','sha256','manifestMatch'])
 for r in rows:
  a=r['actual'];w.writerow([r['id'],r['role'],r['path'],a['bytes'],*a['size'],a['alpha'],a['sha256'],all(r['checks'].values())])
refrev=subprocess.check_output(['git','-C',str(R),'rev-parse','origin/codex/topo-v3'],text=True).strip();text=subprocess.check_output(['git','-C',str(R),'show',refrev+':docs/DECISIONS.md'],text=True);sections=re.split(r'(?=^## )',text,flags=re.M);selectedDecisions=[s for s in sections if'visuele kwaliteit'in s.lower()or'hetzelfde shirt'in s.lower()];assert len(selectedDecisions)==2;(O/'DECISIONS-excerpt.md').write_text('# Toegepaste eigenaarbesluiten\n\nBron `codex/topo-v3@'+refrev+'`, `docs/DECISIONS.md`. Niet aanwezig in de artpin; rechtstreeks gelezen uit deze gepinde documentatiecommit, aangevuld door de expliciete opdracht van de eigenaar.\n\n'+'\n'.join(selectedDecisions));(O/'decisions-provenance.json').write_text(json.dumps({'sourceCommit':refrev,'path':'docs/DECISIONS.md','wholeFileSHA256':hashlib.sha256(text.encode()).hexdigest(),'candidateContainsNamedSections':False,'currentUserExplicitExceptions':['BG01..03 no retest','portrait head/shoulder crop accepted','portrait light hair fringe accepted'],'shirtRule':'Second decision supersedes cut-variation allowance: closed blue collared buttoned work shirt without white undershirt everywhere'},indent=2))
F=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',18)
def tile(im,size,bg='#f5eddd'):
 c=Image.new('RGBA',size,bg);im=im.convert('RGBA');im.thumbnail(size,Image.Resampling.LANCZOS);c.alpha_composite(im,((size[0]-im.width)//2,(size[1]-im.height)//2));return c.convert('RGB')
# Nearest canonical torso from actual old immutable evidence, byte-identical to original refs.
refsrc=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-art-908b4a4/references');refdir=O/'references';refdir.mkdir(exist_ok=True)
for name in['nino-guide.webp','topo-steden-firenze.png']:(refdir/name).write_bytes((refsrc/name).read_bytes())
refMeta=json.loads(Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-art-908b4a4/reference-manifest.json').read_text());(O/'reference-manifest.json').write_text(json.dumps([a for a in refMeta if Path(a['evidence']).name in['nino-guide.webp','topo-steden-firenze.png']],indent=2))
regions={'NINO-PORTRET':(210,1040,940,1402),'SCENE-ROMA':(370,335,625,540),'SCENE-NAPOLI':(300,260,570,490)};crops=[]
ref=Image.open(refdir/'topo-steden-firenze.png');refRect=(290,300,520,525)
for a in selected:
 id=a['id'];master=Image.open(R/a['master']['path']);region=regions[id];board=Image.new('RGB',(1200,770),'#ede6d9');d=ImageDraw.Draw(board)
 for col,(label,im)in enumerate([('908b4a4 - OLD',Image.open(__import__('io').BytesIO(subprocess.check_output(['git','-C',str(R),'show',baseline+':'+a['master']['path']]))).crop(region)),('05ab1d0 - NEW',master.crop(region)),('#75 canonical - closed shirt',ref.crop(refRect))]):
  d.text((col*400+10,8),label,font=F,fill='#173f36');board.paste(tile(im,(380,330)),(col*400+10,40))
 d.text((10,390),'Full candidate master (fit-to-board, not native-size proof)',font=F,fill='#173f36');board.paste(tile(master,(650,340)),(10,420));crops.append({'asset':id,'masterPath':a['master']['path'],'shirtCrop':list(region),'referenceCommit':'8a704cb23da97baf7197635df7fa12f06b864a24','referencePath':'assets/nino/scenes/topo-steden-firenze.png','referenceCrop':list(refRect),'boardTransforms':'Crop + fit; old/new proof only, no source edits'});board.save(O/(id+'-shirt-comparison.png'));master.crop(region).save(O/(id+'-shirt-native.png'))
 if id.startswith('SCENE'):
  # Whole runtime export and miniature retained verbatim as evidence.
  for role in['export_kop','export_mini']:(O/(id+'-'+role+'.webp')).write_bytes((R/a[role]['path']).read_bytes())
portrait=Image.open(R/'assets/v3/render/exports/NINO-PORTRET-512.webp').convert('RGBA');c=Image.new('RGB',(1024,550),'#ede6d9')
for i,bg in enumerate(['#fff8e9','#073f3b']):
 t=Image.new('RGBA',(512,512),bg);t.alpha_composite(portrait);c.paste(t.convert('RGB'),(i*512,35));ImageDraw.Draw(c).text((i*512+8,6),'Accepted crop/fringe; model check only',font=F,fill='#173f36')
c.save(O/'portrait-runtime-light-dark.png');(O/'crop-manifest.json').write_text(json.dumps(crops,indent=2));print(json.dumps({'target':target,'logicalAssets':len(selected),'files':len(rows),'manifestFailures':sum(not all(r['checks'].values())for r in rows),'changedPaths':changed,'decisionsSource':refrev},indent=2))
