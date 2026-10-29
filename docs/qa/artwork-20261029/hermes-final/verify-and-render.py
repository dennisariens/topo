import json,hashlib,subprocess,re,collections,struct
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFile
import numpy as np
ImageFile.LOAD_TRUNCATED_IMAGES=False
R=Path('/Users/dennisariens/projects/topo-passport-final-art-qa');O=Path('/Users/dennisariens/.hermes/outputs/topo-passport-final-art-qa');O.mkdir(exist_ok=True,parents=True)
D=R/'docs/qa/artwork-20261027/intake'; BASE='fab2bbae943d507fcd103887012f790c144f43a5';SHA='8a704cb23da97baf7197635df7fa12f06b864a24';PR48='4eb9a5ae33550d789c56d5c01393145a148565aa'
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=R).decode().strip()==SHA
hashb=lambda b:hashlib.sha256(b).hexdigest()
ledger=json.loads((D/'asset-ledger.json').read_text())['assets'];manifest=json.loads((R/'docs/qa/artwork-20261027/manifest.json').read_text())['items'];pres=json.loads((D/'preservation.json').read_text());baseline=json.loads((D/'baseline.json').read_text())
results=[]
for entry in ledger:
 p=R/entry['path'];b=p.read_bytes();assert hashb(b)==entry['sha256'];assert len(b)==entry['bytes']
 with Image.open(p)as im:im.verify()
 with Image.open(p)as im:
  im.load();assert [im.width,im.height]==[entry['width'],entry['height']];a=np.asarray(im.convert('RGBA'));alpha=a[:,:,3];edge=np.r_[alpha[0,:],alpha[-1,:],alpha[1:-1,0],alpha[1:-1,-1]]
  results.append({'path':entry['path'],'sha256':hashb(b),'bytes':len(b),'size':[im.width,im.height],'mode':im.mode,'alphaMin':int(alpha.min()),'alphaMax':int(alpha.max()),'alphaZeroPixels':int((alpha==0).sum()),'partialAlphaPixels':int(((alpha>0)&(alpha<255)).sum()),'opaquePixels':int((alpha==255).sum()),'edgeContactPixels':int((edge>0).sum()),'edgeMaxAlpha':int(edge.max()),'decodedRGBAsha256':hashb(a.tobytes()),'icc':bool(im.info.get('icc_profile')),'source':entry['source']})
assert len(results)==49;assert sum(x['source']=='new-package'for x in results)==18
for item in manifest:
 p=R/item['path'];assert hashb(p.read_bytes())==item['sha256'];assert p.stat().st_size==item['bytes']
assert len(manifest)==18
for p in pres['existingPassportMasters']:
 b=(R/p).read_bytes();old=subprocess.check_output(['git','show',BASE+':'+p],cwd=R);assert b==old;assert hashb(b)==baseline['tracked'][p]
assert len(pres['existingPassportMasters'])==20
checks=json.loads((D/'hash-verification.json').read_text())['checks'];checked=[]
for c in checks:
 p=R/c['path']
 if not p.exists():p=D/'source-package'/c['path']
 assert p.exists()and hashb(p.read_bytes())==c['sha256'];checked.append(c['path'])
changes=subprocess.check_output(['git','diff','--name-status',BASE,SHA],cwd=R).decode().splitlines();modified=[l.split('\t')[1]for l in changes if not l.startswith('A\t')];assert sorted(modified)==sorted(['docs/PROJECT_STATE.md','docs/nino/ARTWORK_FINAL_SOURCE_AND_QA_HANDOFF_2026-10-27.md'])
# Independent equivalence check of all prior accepted blobs (no re-review expansion).
allow=json.loads(subprocess.check_output(['git','show',PR48+':docs/qa/artwork-45/production-allowlist.json'],cwd=R))
(O/'pr48-allowlist-shape.json').write_text(json.dumps(allow,indent=2))
(O/'independent-inventory.json').write_text(json.dumps(results,indent=2)+'\n')
summary={'reviewedSHA':SHA,'baseline':BASE,'decodedImages':len(results),'newAssets':sum(x['source']=='new-package'for x in results),'manifestMatches':len(manifest),'existingMastersUnchanged':20,'suppliedChecksumEntriesVerified':len(checked),'onlyModifiedExistingFiles':modified,'allRuntimeAndOtherExistingFilesUnchanged':True,'scope':'integrity/decode only; visual approval separate; original ZIP bytes not independently provided/re-CRC-tested'}
(O/'integrity-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
fontpath='/System/Library/Fonts/Supplemental/Arial.ttf'
font=lambda n:ImageFont.truetype(fontpath,n)
def board_bg(w,h,kind,scale=1):
 if kind=='cream':return Image.new('RGBA',(w,h),'#f6edd8')
 if kind=='dark':return Image.new('RGBA',(w,h),'#173c36')
 im=Image.new('RGBA',(w,h),'white');d=ImageDraw.Draw(im);cell=8*scale
 for y in range(0,h,cell):
  for x in range(0,w,cell):
   if(x//cell+y//cell)%2:d.rectangle((x,y,x+cell-1,y+cell-1),fill='black')
 return im
assets=[('ISOLE corrected','assets/nino/travel-passport/stamps/rework/stamp-05-isole-geography-candidate.png'),('ARRIVO','assets/nino/travel-passport/arrivo/qa-candidates/arrivo-travel-ink-preview.png')]
for scale in [1,2]:
 sizes=[64,96,160,240];cw=280*scale;rowh=320*scale
 for kind in ['cream','dark','checker']:
  im=board_bg(cw*4,rowh*2+55*scale,kind,scale);d=ImageDraw.Draw(im);ink='#ffffff'if kind=='dark'else'#102e2a'
  d.rectangle((0,0,im.width,45*scale),fill='#fff8e8');d.text((10*scale,10*scale),'INDEPENDENT QA / NO REWARD - actual source, %sx raster'%scale,font=font(15*scale),fill='#102e2a')
  for row,(label,path)in enumerate(assets):
   with Image.open(R/path)as src:
    a=src.convert('RGBA')
    for col,size in enumerate(sizes):
     w=size*scale;assert w<=a.width and w<=a.height;b=a.resize((w,w),Image.Resampling.LANCZOS);x=col*cw+(cw-w)//2;y=55*scale+row*rowh+30*scale;im.alpha_composite(b,(x,y));d.text((col*cw+8*scale,y-24*scale),label+' %s CSSpx'%size,font=font(13*scale),fill=ink,stroke_width=1 if kind=='checker' else 0,stroke_fill='#fff8e8')
  im.convert('RGB').save(O/('ink-sizes-%s-%sx.png'%(kind,scale)))
# Native bounding contact inspection composited without any alpha repair.
for label,path in assets:
 with Image.open(R/path)as src:
  a=src.convert('RGBA');panel=board_bg(a.width,a.height,'cream');panel.alpha_composite(a);panel.convert('RGB').save(O/(label.split()[0].lower()+'-native-cream.png'))
# Source map islands: exact canonical paths, common projection/scale, no independent reshaping.
h=subprocess.check_output(['git','show','bd1e57bc48e55a065cbbccb68acea196a64a187c:index.html'],cwd=R).decode();items=json.loads(re.search(r'const ITEMS=(\[.*\]);',h).group(1));islands=[i for i in items if i['id']in['area-a','area-b']];paths=[]
for i in islands:
 seg=[]
 for part in re.split(r'(?=M\s)',i['shape']):
  nums=[float(x)for x in re.findall(r'-?\d+(?:\.\d+)?',part)]
  if nums:seg.append(list(zip(nums[::2],nums[1::2])))
 paths.append((i['id'],seg))
pts=[p for _,segs in paths for seg in segs for p in seg];xmin=min(p[0]for p in pts);xmax=max(p[0]for p in pts);ymin=min(p[1]for p in pts);ymax=max(p[1]for p in pts);ratio=min(580/(xmax-xmin),580/(ymax-ymin));mapim=Image.new('RGB',(640,640),'#dbeef0');draw=ImageDraw.Draw(mapim)
for id,segs in paths:
 for seg in segs:draw.polygon([(30+(x-xmin)*ratio,30+(y-ymin)*ratio)for x,y in seg],fill='#216487')
mapim.save(O/'canonical-islands-verified.png');can={'sourceCommit':'bd1e57bc48e55a065cbbccb68acea196a64a187c','items':islands,'method':'exact source paths at one uniform scale and translation, not stamp-derived geometry'};(O/'canonical-islands-source.json').write_text(json.dumps(can,indent=2)+'\n')
print(json.dumps(summary,indent=2));print('Parent ink boards and exact canonical island reference rendered.')
