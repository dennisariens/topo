#!/usr/bin/env python3
"""Fresh Reviewv2 source/provenance/rebuild comparison, not a replay of delegated reports."""
import subprocess,hashlib,json
from pathlib import Path
from PIL import Image,ImageChops
R=Path(__file__).resolve().parents[4];O=Path(__file__).resolve().parent
V=Path.home()/'.hermes/cache/scratch/pisa-review-v2/NINO_PISA_FINAL_ARTWORK_REVIEW_v2';B=Path.home()/'.hermes/cache/scratch/pisa-v2-source-repro/out/pisa-hinge-original-art'
PIN='8414319186c834cad091231d6c9beed6068b5876';BASE='bf91fb3fa6ac553f78b33169efa9f2bf60e215ca';PR29='dcc474e8a9d1bc97559a3207b0a330423e128558'
def git(*a):return subprocess.check_output(['git',*a],cwd=R)
def tree(ref):
 d={}
 for line in git('ls-tree','-r',ref,'--','assets/nino/rewards/pizza').decode().splitlines():
  head,path=line.split('\t',1)
  if path.endswith(('.png','.webp')):d[path]=head.split()[2]
 return d
a,b,c=tree(PIN),tree(BASE),tree(PR29);sources=[]
for path,blob in a.items():sources.append({'path':path,'blob':blob,'approvedBaseBlob':b.get(path),'PR29Blob':c.get(path),'equalBase':blob==b.get(path),'equalPR29':blob==c.get(path)})
assert sources and all(r['equalBase']and r['equalPR29']for r in sources)
m=json.loads((V/'manifest.json').read_text());expected=m['approved_sources'];sourceHashes=[]
for name,h in expected.items():
 data=(R/'assets/nino/rewards/pizza/exports'/name).read_bytes();real=hashlib.sha256(data).hexdigest();assert real==h;sourceHashes.append({'path':name,'sha256':real,'matchesV2Declaration':True})
src=R/'scripts/build_pisa_source_preserving_qa.py';assert src.read_bytes()==git('show',PIN+':scripts/build_pisa_source_preserving_qa.py')
def frames(p):
 im=Image.open(p);f=[]
 for i in range(getattr(im,'n_frames',1)):im.seek(i);f.append(im.convert('RGBA'))
 return f
rows=[];audit=json.loads((O/'v2-audit.json').read_text())
for row in audit['images']:
 if not row['ciPath']:continue
 p=V/row['path'];q=B/row['ciPath'];x,y=frames(p),frames(q);rows.append({'v2':row['path'],'localRebuild':row['ciPath'],'bytesEqual':p.read_bytes()==q.read_bytes(),'allFramesRGBAEqual':len(x)==len(y)and all(i.size==j.size and ImageChops.difference(i,j).getextrema()==((0,0),)*4 for i,j in zip(x,y))})
edges=[]
for p in V.rglob('*'):
 if p.suffix.lower()not in['.png','.webp']:continue
 if 'textures'in p.parts or p.name=='contact-sheet.png':continue
 for i,f in enumerate(frames(p)):
  alpha=f.getchannel('A');w,h=f.size;hit=any(alpha.crop(box).getbbox()for box in [(0,0,w,1),(0,h-1,w,h),(0,0,1,h),(w-1,0,w,h)])
  if hit:edges.append({'path':str(p.relative_to(V)),'frame':i})
result={'targetPR72':PIN,'approvedSourceBase':BASE,'PR29':PR29,'currentSourceImageCount':len(sources),'sources':sources,'fourDeclaredSourceHashes':sourceHashes,'sourcePreservingGeneratorUnchanged':True,'localBuildCommandExit':0,'localBuildEnvironment':{'python':'3.12.13','Pillow':'13.0.0','numpy':'2.5.4','opencv':'5.0.0','platform':'macOS arm64'},'v2VsLocalRebuild':rows,'sameByteImages':sum(r['bytesEqual']for r in rows),'sameDecodedImages':sum(r['allFramesRGBAEqual']for r in rows),'allV2CompositingImagesAndMotionFramesEdgeContacts':edges,'v2SourceGeneratorInArchive':False,'limits':'Local reproducibility only; platform-dependent codec/numeric differences are not themselves proof of redesign. No exact v2 source commit/generator was supplied. Source integrity does not repair closed-lid geometry.'}
(O/'v2-source-and-rebuild.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:result[k]for k in ['currentSourceImageCount','sourcePreservingGeneratorUnchanged','localBuildCommandExit','sameByteImages','sameDecodedImages','allV2CompositingImagesAndMotionFramesEdgeContacts']},indent=2))
