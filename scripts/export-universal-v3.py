#!/usr/bin/env python3
"""Deterministic technical WebP derivatives of the owner-approved universal masters.
Run with Python + Pillow. No crop, repaint, generation or geometry changes.
"""
import hashlib, io, json, pathlib, subprocess
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
PIN = '339c4207e6d4b212cda4073862b5df42c8d95474'
NINO = ['nino-welkom', 'nino-schrijft', 'nino-aanmoediging', 'nino-juicht', 'nino-gold', 'nino-denkt', 'nino-wijst', 'nino-wijst-rechts', 'nino-paspoort']
VESPA = ['vespa-rijdend', 'vespa-bagage', 'vespa-zij', 'vespa-icoon']
def entry(p):
 b=p.read_bytes()
 with Image.open(p) as im:
  return {'path':str(p.relative_to(ROOT)), 'bytes':len(b), 'sha256':hashlib.sha256(b).hexdigest(), 'size':list(im.size), 'alpha':im.mode=='RGBA' or 'transparency' in im.info}
p=ROOT/'assets/v3/render/manifest.json';manifest=json.loads(p.read_text())
manifest['assets']=[a for a in manifest['assets'] if not a.get('universalMaster')]
for name in NINO+VESPA:
 group='nino' if name in NINO else 'vespa'
 source=f'assets/art/masters/universal/{group}/{name}.png'
 data=subprocess.check_output(['git','show',f'{PIN}:{source}'],cwd=ROOT)
 master=ROOT/f'assets/v3/render/masters/universal/{name}.png';master.parent.mkdir(parents=True,exist_ok=True);master.write_bytes(data)
 with Image.open(io.BytesIO(data)) as original:
  im=original.convert('RGBA')
  assert im.getextrema()[3][0]==0 and im.getextrema()[3][1]>=250, name+' needs real alpha'
  maxsize=(800,1200) if group=='nino' else (1200,800)
  im.thumbnail(maxsize,Image.Resampling.LANCZOS)
  export=ROOT/f'assets/v3/render/exports/{name}-v3.webp';export.parent.mkdir(parents=True,exist_ok=True)
  im.save(export,'WEBP',quality=92,method=6,exact=True)
 manifest['assets'].append({'id':name.upper(),'universalMaster':True,'status':'eigenaar akkoord, Hermes open','source':{'repository':'dennisariens/topo','ref':'origin/art/master','commit':PIN,'path':source,'sha256':hashlib.sha256(data).hexdigest()},'note':'Technical Lanczos downscale; full frame and alpha preserved. No passport cover/interior.','master':entry(master),'export':entry(export)})
p.write_text(json.dumps(manifest,ensure_ascii=False,indent=1)+'\n')
print('13 masters and exports with SHA256, source and owner/Hermes status')
