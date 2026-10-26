#!/usr/bin/env python3
"""No-reward original-art placement proof. Never imported by app/build."""
import json,math
from pathlib import Path
from typing import Any, Dict
from PIL import Image,ImageDraw,ImageFont
import numpy as np
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/qa/artwork-45';OUT.mkdir(parents=True,exist_ok=True)
M=json.loads((ROOT/'assets/nino/travel-passport/manifest.json').read_text());IDS=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','countries','seas','rivers']
F='/System/Library/Fonts/Supplemental/Arial.ttf'
def ft(n):return ImageFont.truetype(F,n)
def h32(text):
 h=2166136261
 for b in text.encode('utf-8'):h=((h^b)*16777619)&0xffffffff
 return h

def pick(seed,lane,values,weights):
 n=h32(seed+'\0'+lane)%sum(weights)
 for v,w in zip(values,weights):
  if n<w:return v
  n-=w
 raise ValueError('Invalid weighted preset')

def pose(key: str) -> Dict[str,Any]:
 seed=json.dumps(['topo-stamp-v1','chapter',key,''],separators=(',',':'));a=pick(seed,'rotation',[0,-1.5,1.5,-4.5,4.5],[3,3,3,1,1]);x=pick(seed,'x',[-10,-5,0,5,10],[1,2,8,2,1]);y=pick(seed,'y',[-6,-3,0,3,6],[1,2,8,2,1]);r=math.radians(a);w=112*abs(math.cos(r))+96*abs(math.sin(r));hh=112*abs(math.sin(r))+96*abs(math.cos(r));mx=80-12-w/2;my=76-12-hh/2;x=max(-mx,min(mx,x));y=max(-my,min(my,y));return dict(key=key,seed=seed,angle=a,x=x,y=y,pressure=pick(seed,'pressure',['even','left-heavy','right-heavy','lower-edge-heavy'],[6,2,2,1]),clearanceX=(160-w)/2-abs(x),clearanceY=(152-hh)/2-abs(y))
def impression(path,p,size=160):
 s=Image.open(path).convert('RGBA');s=s.crop(s.getchannel('A').getbbox());s.thumbnail((112*size//160,96*size//160),Image.Resampling.LANCZOS)
 # Deliberately only 2% pressure difference: no protected-text mask was supplied.
 arr=np.array(s).copy();w,h=s.size;v=np.linspace(.98,1,w);mode=p['pressure'];v=np.ones(w)if mode=='even'else v[::-1]if mode=='left-heavy'else v
 if mode=='lower-edge-heavy':arr[:,:,3]=(arr[:,:,3]*np.linspace(.98,1,h)[:,None]).round().astype('uint8')
 else:arr[:,:,3]=(arr[:,:,3]*v[None,:]).round().astype('uint8')
 s=Image.fromarray(arr).rotate(-p['angle'],resample=Image.Resampling.BICUBIC,expand=True);return s
if __name__=='__main__':
 poses=[pose(k)for k in IDS];assert poses==[pose(k)for k in IDS];assert len({(p['angle'],p['x'],p['y'])for p in poses})>3;assert all(min(p['clearanceX'],p['clearanceY'])>=12-1e-8 for p in poses)
 (OUT/'placement-poses.json').write_text(json.dumps({'fixture':'NO-REWARD MOCKUP, not earned state','version':'topo-stamp-v1','poses':poses,'sourcePressureAlphaRange':[.98,1],'gold':'BLOCKED: final seal missing'},indent=2)+'\n')
 board=Image.new('RGB',(1600,1250),'#f5f2e9');d=ImageDraw.Draw(board);d.text((20,12),'MOCKUP / ART QA ONLY - NOT A PASSPORT IMPLEMENTATION OR EARNED REWARDS',font=ft(23),fill='#8b302c')
 for j,(a,p)in enumerate(zip(M['stamps'],poses)):
  x=25+(j%6)*260;y=65+(j//6)*220;tile=Image.new('RGBA',(240,190),'#f5f2e9');dr=ImageDraw.Draw(tile);dr.rectangle((12,5,228,180),outline='#c8bc9f');s=impression(ROOT/a['qa_candidate'],p,240);tile.alpha_composite(s,(int(120+p['x']*1.5-s.width/2),int(92+p['y']*1.5-s.height/2)));board.paste(tile.convert('RGB'),(x,y));d.text((x,y+190),f'{j+1:02d} {p["key"]}: {p["angle"]} deg / {p["x"]:.1f},{p["y"]:.1f}',font=ft(13),fill='#203c35')
 d.text((20,505),'SOURCE BOOK BACKGROUNDS / PROPOSED POSITIONS ONLY - Isole retained here for QA, not approved for release',font=ft(19),fill='#8b302c')
 cover=Image.open(ROOT/M['book'][0]['path']).convert('RGBA');cover.thumbnail((500,640),Image.Resampling.LANCZOS);board.paste(cover,(20,550),cover)
 book=Image.open(ROOT/M['book'][1]['path']).convert('RGBA')
 centers=[(920,246),(1092,224),(1266,206),(924,410),(1094,394),(1278,374),(934,572),(1108,562),(1290,548),(940,740),(1116,738)]
 for a,p,(cx,cy)in zip(M['stamps'],poses,centers):
  s=impression(ROOT/a['qa_candidate'],p,165);book.alpha_composite(s,(round(cx+p['x']-s.width/2),round(cy+p['y']-s.height/2)))
 book.thumbnail((1000,650),Image.Resampling.LANCZOS);board.paste(book,(550,560),book)
 d.text((560,1195),'12th printed circle/compass left empty. No Gold seal or arrival art invented.',font=ft(17),fill='#203c35');board.save(OUT/'placement-book-mockup.png')
 # Five design references, fifth is explicitly blocked instead of substituting Nino character art.
 refs=[(0,dict(angle=0,x=0,y=0,pressure='even'),'Nearly perfect'),(1,dict(angle=-1.5,x=-5,y=3,pressure='even'),'Light tilt'),(2,dict(angle=1.5,x=10,y=-6,pressure='even'),'Off center'),(5,dict(angle=-1.5,x=-10,y=0,pressure='left-heavy'),'Left-heavy (2% only)')]
 b=Image.new('RGB',(1400,365),'#f5f2e9');d=ImageDraw.Draw(b);d.text((15,10),'ORIGINAL-ART REFERENCE CASES / NO-REWARD QA MOCKUP',font=ft(21),fill='#203c35')
 for j,(i,p,label)in enumerate(refs):
  cx=135+280*j;cy=165;s=impression(ROOT/M['stamps'][i]['qa_candidate'],p,280);b.paste(s,(round(cx+p['x']*1.75-s.width/2),round(cy+p['y']*1.75-s.height/2)),s);d.text((15+280*j,285),label,font=ft(17),fill='#203c35');d.text((15+280*j,310),f'{p["angle"]} deg / x {p["x"]} / y {p["y"]}',font=ft(15),fill='#203c35')
 d.text((1135,120),'GOLD: BLOCKED',font=ft(20),fill='#8b302c');d.text((1135,155),'Original final seal',font=ft(17),fill='#203c35');d.text((1135,180),'not supplied.',font=ft(17),fill='#203c35');b.save(OUT/'placement-five-references.png');print('11 deterministic poses: repeated output equal; bounds >=12; original-art boards rendered.')
