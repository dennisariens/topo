from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageStat,ImageFilter
import json,hashlib,subprocess,math
R=Path('/Users/dennisariens/projects/topo-v3-art-independent-qa');O=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-art-908b4a4');O.mkdir(parents=True,exist_ok=True)
manifest=json.loads((R/'assets/v3/render/manifest.json').read_text());rows=[]
def walk(a,obj,prefix=''):
 if isinstance(obj,dict):
  if 'path'in obj and 'sha256'in obj:
   p=R/obj['path'];b=p.read_bytes();im=Image.open(p);im.load();rgba=im.convert('RGBA');alpha=rgba.getchannel('A');extrema=alpha.getextrema();bbox=alpha.getbbox();actual={'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b),'size':list(im.size),'alpha':extrema[0]<255};checks={k:actual[k]==obj[k]for k in actual};edges=[alpha.crop(box)for box in[(0,0,im.width,1),(0,im.height-1,im.width,im.height),(0,0,1,im.height),(im.width-1,0,im.width,im.height)]]
   rec={'asset':a['id'],'role':prefix,'path':obj['path'],'expected':obj,'actual':actual,'checks':checks,'mode':im.mode,'alphaExtrema':extrema,'alphaBBox':bbox,'edgeAlphaMax':[e.getextrema()[1]for e in edges]}
   role=prefix.split('.')[0];budget=None
   if a['id'].startswith('BG-')and role=='export':budget=450000
   if a['id']=='NINO-PORTRET'and role=='export':budget=120000
   if role=='export_kop':budget=400000
   if role=='export_mini':budget=40000
   if budget:rec['budget']={'basis':'decimal KB (brief); bytes also supplied for KiB interpretation','limitBytes':budget,'actualBytes':len(b),'withinDecimal':len(b)<=budget,'withinBinaryKiB':len(b)<=int(budget/1000)*1024}
   rows.append(rec)
  else:
   for k,v in obj.items():walk(a,v,prefix+'.'+k if prefix else k)
for a in manifest['assets']:walk(a,{k:v for k,v in a.items()if isinstance(v,dict)})
(O/'inventory.json').write_text(json.dumps({'target':'908b4a498199ece40a047f19efb2e80fe62812b8','logicalAssets':len(manifest['assets']),'records':rows,'uniquePaths':len({r['path']for r in rows}),'failures':[r for r in rows if not all(r['checks'].values())]},indent=2))
refs=O/'references';refs.mkdir(exist_ok=True);referenceRows=[]
for p in sorted((R/'assets/nino/exports').glob('nino-*.webp')):
 b=p.read_bytes();q=refs/p.name;q.write_bytes(b);referenceRows.append({'source':str(p.relative_to(R)),'commit':'908b4a498199ece40a047f19efb2e80fe62812b8','evidence':str(q.relative_to(O)),'sha256':hashlib.sha256(b).hexdigest()})
commit='8a704cb23da97baf7197635df7fa12f06b864a24'
for name in['topo-steden-firenze','topo-eilanden-v2','topo-bergen-dolomieten','topo-vulkanen-etna','topo-streken-toscana','topo-landen-italie-slovenie','topo-zeeen-amalfi','topo-rivieren-po']:
 source='assets/nino/scenes/'+name+'.png';b=subprocess.check_output(['git','-C',str(R),'show',commit+':'+source]);q=refs/(name+'.png');q.write_bytes(b);referenceRows.append({'source':source,'commit':commit,'evidence':str(q.relative_to(O)),'sha256':hashlib.sha256(b).hexdigest()})
(O/'reference-manifest.json').write_text(json.dumps(referenceRows,indent=2))
font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',17)
def board(items,name,cw=420,ch=300,cols=3):
 canvas=Image.new('RGB',(cols*cw,math.ceil(len(items)/cols)*ch),'#ede8dc');draw=ImageDraw.Draw(canvas)
 for idx,(label,path)in enumerate(items):
  im=Image.open(path).convert('RGBA');im.thumbnail((cw-20,ch-44),Image.Resampling.LANCZOS);x=(idx%cols)*cw+(cw-im.width)//2;y=(idx//cols)*ch+35;canvas.paste(im,(x,y),im);draw.text(((idx%cols)*cw+10,(idx//cols)*ch+7),label,fill='#153d34',font=font)
 canvas.save(O/name)
board([(p.name,p)for p in sorted(refs.glob('nino-*.webp'))],'canonical-nino.png',cw=240,ch=360,cols=7)
board([(p.stem,p)for p in sorted(refs.glob('topo-*.png'))],'scene75-reference-board.png',cw=500,ch=320,cols=2)
selected=[]
for a in manifest['assets']:
 for k in['export','export_kop']:
  if k in a:selected.append((a['id'],R/a[k]['path']))
board(selected,'candidate-overview.png',cw=480,ch=320,cols=3)
print(json.dumps({'assets':len(manifest['assets']),'records':len(rows),'uniquePaths':len({r['path']for r in rows}),'manifestFailures':[r['path']for r in rows if not all(r['checks'].values())],'decimalBudgetFailures':[(r['asset'],r['actual']['bytes'])for r in rows if r.get('budget',{}).get('withinDecimal')is False]},indent=2))
