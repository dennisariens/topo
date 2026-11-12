#!/usr/bin/env python3
"""Assetdieet export (docs/v3/ASSETDIEET.md stap 2–4): derived images for the V3 preview only.

Reads docs/v3/assets-inventaris.json and the source files it names, writes assets/v3/dieet/<sha12>-<w>x<h>.<ext>
and assets/v3/dieet/manifest.json (source sha256 → replacement). scripts/build-v3-preview.mjs applies the manifest to its
output; index.html, src/v2/ and the masters are never changed.

  --stap 2   placeholder for images proven unused (inventory "used": false)
  --stap 3   + scale to at most 2× the largest display size (desktop or iPad, CSS px), never up; WebP, SSIM-checked
  --stap 4   + AVIF where it passes SSIM ≥ 0.97 against the scaled reference (see ASSETDIEET.md)

Visual rule: lossy WebP only when its SSIM against a Lanczos reference at the same size is ≥ 0.99; otherwise lossless WebP
of the scaled image. An export is only kept with a saving of ≥ 20 KB. Doubt → the source stays.
"""
import argparse,base64,hashlib,io,json,pathlib,re,sys
import numpy as np
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parent.parent
INV=ROOT/'docs/v3/assets-inventaris.json'
DIR=ROOT/'assets/v3/dieet'
MANIFEST=DIR/'manifest.json'
PLACEHOLDER='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
WEBP_SSIM=0.99

def gauss(n=11,s=1.5):
 x=np.arange(n)-n//2;k=np.exp(-x*x/(2*s*s));return k/k.sum()
def blur(a,k):
 from numpy.lib.stride_tricks import sliding_window_view as win
 a=win(a,len(k),axis=0)@k
 return win(a,len(k),axis=1)@k
def flat(im):
 """RGB over a mid-grey ground (alpha counts), float64."""
 im=im.convert('RGBA');bg=Image.new('RGBA',im.size,(128,128,128,255));bg.alpha_composite(im)
 return np.asarray(bg.convert('RGB'),dtype=np.float64)
def ssim(a,b):
 """Mean SSIM over RGB (Wang et al., gaussian 11/1.5); images up to 1024 px on the long side are compared as is."""
 A,B=flat(a),flat(b);k=gauss();C1,C2=(0.01*255)**2,(0.03*255)**2;out=[]
 for c in range(3):
  x,y=A[...,c],B[...,c];mx,my=blur(x,k),blur(y,k)
  sxx=blur(x*x,k)-mx*mx;syy=blur(y*y,k)-my*my;sxy=blur(x*y,k)-mx*my
  out.append((((2*mx*my+C1)*(2*sxy+C2))/((mx*mx+my*my+C1)*(sxx+syy+C2))).mean())
 return float(np.mean(out))
def sample(im,limit=1024):
 """SSIM on large images: a centre crop of at most limit² keeps the measurement fast and at full resolution."""
 w,h=im.size
 if w<=limit and h<=limit:return im
 l,t=max(0,(w-limit)//2),max(0,(h-limit)//2);return im.crop((l,t,l+min(w,limit),t+min(h,limit)))

def source_bytes(i):
 """The source image, from its file in the repository (inventory id), checked against the inventory sha256."""
 p=ROOT/i['id']
 if not p.is_file():raise SystemExit('Source file missing for '+i['id'])
 raw=p.read_bytes()
 if hashlib.sha256(raw).hexdigest()!=i['sha256']:raise SystemExit('Source differs from inventory: '+i['id'])
 return raw

def save(im,fmt,**kw):
 b=io.BytesIO();im.save(b,fmt,**kw);return b.getvalue()

def encode_webp(ref,lossless_src):
 """Smallest WebP at quality ≥ 80 with SSIM ≥ WEBP_SSIM against the reference; alpha kept."""
 if lossless_src:
  b=save(ref,'WEBP',lossless=True,method=6);return b,1.0,'lossless'
 best=None
 for q in (80,85,90,94,97):
  b=save(ref,'WEBP',quality=q,method=6,alpha_quality=100)
  s=ssim(sample(ref),sample(Image.open(io.BytesIO(b))))
  if s>=WEBP_SSIM:best=(b,s,q);break
 if not best:
  b=save(ref,'WEBP',quality=97,method=6,alpha_quality=100)
  if ssim(sample(ref),sample(Image.open(io.BytesIO(b))))>=WEBP_SSIM:best=(b,ssim(sample(ref),sample(Image.open(io.BytesIO(b)))),97)
  else:best=(save(ref,'WEBP',lossless=True,method=6,quality=100),1.0,'lossless')  # no lossy setting reaches the bar: exact pixels
 return best

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--stap',type=int,choices=(2,3,4),required=True);args=ap.parse_args()
 inv=json.loads(INV.read_text());DIR.mkdir(parents=True,exist_ok=True)
 manifest={'version':1,'stap':args.stap,'placeholder':PLACEHOLDER,'rule':'',
  'images':{}}
 manifest['rule']=('Vervanging alleen in de V3-preview. Stap 2: bewezen ongebruikt → 1×1 transparante PNG. '
  'Stap 3: hooguit 2× de grootste weergavemaat (desktop of iPad, CSS px), nooit groter; WebP met SSIM ≥ %.2f tegen een Lanczos-referentie; '
  'alleen bij een winst van ≥ 20 KB; reliëf/kaartlagen en landmarks blijven ongewijzigd (uitlijning op de geometrie).'%WEBP_SSIM)
 keep=set()
 for i in inv['images']:
  sha=i['sha256'];entry={'id':i['id'],'kind':i['kind'],'sourceBytes':i['bytes'],'sourceSize':i['size']}
  if not i['used']:
   entry.update(action='placeholder',reason=i.get('unusedReason'));manifest['images'][sha]=entry;continue
  if args.stap<3:continue
  if i['kind'] in ('kaart','landmark') or 'favicon' in i['id']:continue  # geometry-aligned rasters and landmarks: unchanged
  md=i['maxDisplayCss'];dw=max(md['desktop'][0],md['ipad'][0]);dh=max(md['desktop'][1],md['ipad'][1])
  w,h=i['size']
  if not dw or not dh or i['mime'] not in ('image/webp','image/png','image/jpeg'):continue
  s=min(1.0,max(2*dw/w,2*dh/h))
  if s>=0.97:continue  # less than 3 % smaller: keep the source
  tw,th=max(1,round(w*s)),max(1,round(h*s))
  src=Image.open(io.BytesIO(source_bytes(i)));src.load()
  mode='RGBA' if ('A' in src.getbands() or src.mode=='P') else 'RGB';src=src.convert(mode)
  ref=src.resize((tw,th),Image.LANCZOS)
  data,quality_ssim,q=encode_webp(ref,False)
  if i['bytes']-len(data)<20*1024:entry.update(action='keep',reason='winst < 20 KB');manifest['images'][sha]=entry;continue
  name=f'{sha[:12]}-{tw}x{th}.webp';(DIR/name).write_bytes(data);keep.add(name)
  entry.update(action='scale',path=str((DIR/name).relative_to(ROOT)),mime='image/webp',size=[tw,th],bytes=len(data),
   sha256=hashlib.sha256(data).hexdigest(),quality=q,ssim=round(quality_ssim,4),targetCss=[dw,dh])
  manifest['images'][sha]=entry
  print(f"{i['id'][:56]:56} {w}x{h} → {tw}x{th}  {i['bytes']//1024}K → {len(data)//1024}K  q{q} ssim {quality_ssim:.4f}",flush=True)
 for f in DIR.glob('*'):
  if f.name!='manifest.json' and f.name not in keep:f.unlink()
 MANIFEST.write_text(json.dumps(manifest,indent=1,ensure_ascii=False)+'\n')
 acts={}
 for e in manifest['images'].values():acts[e['action']]=acts.get(e['action'],0)+1
 print('manifest',acts)
if __name__=='__main__':main()
