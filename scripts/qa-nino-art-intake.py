#!/usr/bin/env python3
"""Issue45 pinned art preflight; diagnostic renders only, never rewrites source."""
import json,hashlib,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'docs/qa/artwork-45'; OUT.mkdir(parents=True,exist_ok=True)
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
def font(n):return ImageFont.truetype(FONT,n)
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def metrics(path,expected=None):
 p=ROOT/path
 with Image.open(p)as im:im.verify()
 with Image.open(p)as im:
  im.load();rgba=im.convert('RGBA');a=np.asarray(rgba)[:,:,3];rgb=np.asarray(rgba)[:,:,:3];bbox=rgba.getchannel('A').getbbox();icc=im.info.get('icc_profile');edge=np.concatenate([a[0],a[-1],a[:,0],a[:,-1]])
  return dict(path=path,bytes=p.stat().st_size,sha256=digest(p),expected_sha256=expected,hash_match=(digest(p)==expected if expected else None),dimensions=list(im.size),mode=im.mode,format=im.format,icc_bytes=len(icc)if icc else 0,icc_sha256=hashlib.sha256(icc).hexdigest()if icc else None,alpha_min=int(a.min()),alpha_max=int(a.max()),transparent_pixels=int((a==0).sum()),partial_alpha_pixels=int(((a>0)&(a<255)).sum()),opaque_pixels=int((a==255).sum()),alpha_bbox=bbox,nontransparent_border_pixels=int((edge>0).sum()),partial_neutral_pixels=int((((a>0)&(a<255))&(rgb.max(2)-rgb.min(2)<15)).sum()))
def bg(size,kind):
 w,h=size
 if kind!='checker':return Image.new('RGBA',size,{'paper':'#f5f2e9','teal':'#103f3b','white':'#ffffff'}[kind])
 im=Image.new('RGBA',size,'white');d=ImageDraw.Draw(im)
 for y in range(0,h,12):
  for x in range(0,w,12):
   if(x//12+y//12)%2:d.rectangle([x,y,x+11,y+11],fill='#000000')
 return im

def thumb(im,size):
 im=im.convert('RGBA').copy();im.thumbnail((size,size),Image.Resampling.LANCZOS);return im

def place(board,im,x,y,size,kind):
 tile=bg((size,size),kind);s=thumb(im,size);tile.alpha_composite(s,((size-s.width)//2,(size-s.height)//2));board.paste(tile.convert('RGB'),(x,y))

if __name__=='__main__':
 icons=json.loads((ROOT/'assets/nino/chapter-icons/manifest.json').read_text());passport=json.loads((ROOT/'assets/nino/travel-passport/manifest.json').read_text());rows=[]
 for a in icons['assets']:
  rows.append(metrics(a['png_path'],a['png_sha256']));rows.append(metrics(a['webp_512_path'],a['webp_512_sha256']))
 for a in passport['stamps']:
  rows.append(metrics(a['master'],a['source_sha256']));rows.append(metrics(a['qa_candidate']))
 for a in passport['book']:rows.append(metrics(a['path'],a['sha256']))
 assert len(rows)==46
 (OUT/'binary-inventory.json').write_text(json.dumps({'source_sha':'367b875c83a4e8b77c1f1d09523c20c96364f178','files':rows,'count':len(rows)},indent=2)+'\n')
 for batch,start in enumerate(range(0,11,4),1):
  stamps=passport['stamps'][start:start+4]
  for scale in [1,2]:
   board=Image.new('RGB',(1240*scale,(80+205*len(stamps))*scale),'#f5f2e9');d=ImageDraw.Draw(board)
   def txt(x,y,s,n=14):d.text((x*scale,y*scale),s,font=font(n*scale),fill='#203c35')
   txt(14,8,f'ISSUE45 / SOURCE vs CANDIDATE / {scale}x raster - diagnostic only, NOT approved exports',18)
   for x,title in [(14,'Source master / paper'),(195,'Candidate / paper'),(375,'Candidate / dark'),(555,'Candidate / checker'),(742,'48px paper/dark'),(858,'96px paper'),(970,'96px dark'),(1085,'96px checker')]:txt(x,43,title,12)
   for j,a in enumerate(stamps):
    y=80+j*205;master=Image.open(ROOT/a['master']);cand=Image.open(ROOT/a['qa_candidate']);txt(14,y-17,f'{a["chapter"]:02d} {a["slug"]}',14)
    for x,im,k in [(14,master,'paper'),(195,cand,'paper'),(375,cand,'teal'),(555,cand,'checker')]:place(board,im,x*scale,y*scale,160*scale,k)
    place(board,cand,742*scale,y*scale,48*scale,'paper');place(board,cand,798*scale,y*scale,48*scale,'teal')
    for x,k in [(858,'paper'),(970,'teal'),(1085,'checker')]:place(board,cand,x*scale,y*scale,96*scale,k)
   board.save(OUT/f'stamps-batch-{batch}-{scale}x.png')
 # Source book backgrounds, no invented rewards or stamp cleanup.
 board=Image.new('RGB',(1500,900),'#f5f2e9');d=ImageDraw.Draw(board);d.text((20,12),'BOOK SOURCE INSPECTION - original art, no dynamic earned-state claim',font=font(22),fill='#203c35')
 for x,a in zip([20,720],passport['book']):
  im=Image.open(ROOT/a['path']);im.thumbnail((680,760),Image.Resampling.LANCZOS);tile=bg((700,790),'teal');tile.alpha_composite(im.convert('RGBA'),((700-im.width)//2,20));board.paste(tile.convert('RGB'),(x,70));d.text((x,48),a['name'],font=font(18),fill='#203c35')
 board.save(OUT/'book-source-contact.png')
 print('Inventory:',len(rows),'files;',sum(r['hash_match']is True for r in rows),'declared hashes match;',sum(r['hash_match']is False for r in rows),'mismatch. Diagnostic sheets rendered.')
