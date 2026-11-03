#!/usr/bin/env python3
"""Independent QA renderings of actual package pixels; never generates/replaces artwork."""
import json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent/'visual';OUT.mkdir(parents=True,exist_ok=True)
PKG=Path.home()/'.hermes/cache/scratch/pisa72-ci/package/pisa-hinge-original-art'
FLAVORS=['margherita','salami','quattro-formaggi']
BACKGROUND={'light':(255,255,255,255),'dark':(28,33,40,255),'ivory':(246,238,222,255),'checker':None}
def backdrop(size,name):
 im=Image.new('RGBA',size,BACKGROUND[name]or(225,225,225,255))
 if name=='checker':
  d=ImageDraw.Draw(im)
  for y in range(0,size[1],24):
   for x in range(0,size[0],24):
    if(x//24+y//24)%2:d.rectangle((x,y,x+23,y+23),fill=(175,175,175,255))
 return im
records=[]
for flavor in FLAVORS:
 im=Image.open(PKG/f'motion/pisa-{flavor}.webp');frames=[];times=[];t=0
 for i in range(im.n_frames):
  im.seek(i);f=im.convert('RGBA');duration=im.info.get('duration',0);frames.append(f);times.append((t,t+duration));t+=duration
 indexes=[next((i for i,(start,end)in enumerate(times)if start<=min(round(t*f),t-1)<end),len(frames)-1)for f in[0,.25,.5,.75,1]]
 for name in BACKGROUND:
  sheet=Image.new('RGB',(1800,430),(240,235,224));d=ImageDraw.Draw(sheet)
  for col,(pct,idx)in enumerate(zip([0,25,50,75,100],indexes)):
   f=frames[idx];tile=Image.alpha_composite(backdrop(f.size,name),f).convert('RGB').resize((350,350),Image.Resampling.LANCZOS);sheet.paste(tile,(col*360,45));d.text((col*360+5,8),f'{flavor}: TIME {pct}% frame{idx}',fill=(30,30,30));d.text((col*360+5,400),f'{times[idx][0]}-{times[idx][1]}ms /{t}ms',fill=(30,30,30))
  sheet.save(OUT/f'time-{flavor}-{name}.png')
 # Native 0% and100% actual animated decoded frames, not static angle proofs.
 for label,idx in [('closed',indexes[0]),('open',indexes[-1])]:
  Image.alpha_composite(backdrop(frames[idx].size,'ivory'),frames[idx]).convert('RGB').save(OUT/f'{flavor}-{label}-actual-native.png')
 # Annotate actual closed-frame exposed pizza/overhang area without modifying candidate.
 f=frames[0];annotated=Image.alpha_composite(backdrop(f.size,'ivory'),f).convert('RGB');d=ImageDraw.Draw(annotated)
 font=ImageFont.load_default(size=22)
 d.text((30,30),f'PR72 {flavor} ACTUAL DECODED FRAME 0 (0-54ms) - QA ANNOTATIONS ONLY',font=font,fill=(140,15,15))
 for box,text,label,endpoint in [((700,810,890,1050),'D1: Pizza/crust visible while closed',(30,150),(820,900)),((80,840,700,1220),'D2: Printed lid overshoots tray',(30,230),(120,900)),((240,900,690,1100),'D3: Foreground rim crosses printed face',(30,310),(460,970))]:
  d.rectangle(box,outline=(215,25,25),width=4);d.text(label,text,font=font,fill=(170,10,10));d.line((label[0]+350,label[1]+25,endpoint[0],endpoint[1]),fill=(215,25,25),width=3)
 annotated.save(OUT/f'{flavor}-closed-annotated.png')
 records.append({'flavor':flavor,'actualFrames':len(frames),'duration_ms':t,'loop':im.info.get('loop'),'sampleIndexes':indexes,'sampleTimes':[[times[i][0],times[i][1]]for i in indexes],'frameHashes':[hashlib.sha256(f.tobytes()).hexdigest()for f in frames]})
# Full native-frame comparison: static "closed" proofs must not vary by flavor.
closed={k:Image.open(PKG/f'proof/{k}-0-angle0.png').convert('RGBA')for k in FLAVORS}
a=closed['margherita'];diffs=[]
for k in FLAVORS[1:]:
 b=closed[k];mask=Image.new('L',a.size);values=[];n=0;xs=[];ys=[]
 for i,(p,q)in enumerate(zip(a.getdata(),b.getdata())):
  yes=(max(p[3],q[3])>8 and max(abs(p[j]-q[j])for j in range(3))>12);values.append(255 if yes else 0)
  if yes:n+=1;xs.append(i%a.width);ys.append(i//a.width)
 mask.putdata(values);mask.save(OUT/f'closed-visible-flavor-diff-{k}.png');diffs.append({'versus':k,'visibleDifferentPixelsRGBgt12AlphaGT8':n,'bbox':None if not n else[min(xs),min(ys),max(xs)+1,max(ys)+1]})
(OUT/'actual-time-sampling.json').write_text(json.dumps({'target':'8414319186c834cad091231d6c9beed6068b5876','package':'CI original-art, NOT Reviewv2','records':records,'closedFlavorDifferences':diffs,'note':'Time samples select decoded frames by cumulative actual duration. Static angle0/18/35/53/70 proofs are NOT time quartiles. Annotations are QA overlays only.'},indent=2)+'\n')
print(json.dumps({'records':records,'closedFlavorDifferences':diffs},indent=2))
