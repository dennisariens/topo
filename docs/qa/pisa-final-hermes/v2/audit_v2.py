#!/usr/bin/env python3
"""Independent Reviewv2 ZIP audit, actual pixels vs pinned PR72 CI; no exporter imports."""
import json,hashlib,zipfile
from pathlib import Path
from PIL import Image,ImageChops,ImageDraw,ImageFont
HERE=Path(__file__).resolve().parent;HERE.mkdir(parents=True,exist_ok=True)
V=Path.home()/'.hermes/cache/scratch/pisa-review-v2/NINO_PISA_FINAL_ARTWORK_REVIEW_v2'
CI=Path.home()/'.hermes/cache/scratch/pisa72-ci/package/pisa-hinge-original-art'
ZIP=Path.home()/'Downloads/NINO_PISA_FINAL_ARTWORK_REVIEW_v2.zip'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
manifest=json.loads((V/'manifest.json').read_text());rows=[]
for r in manifest['files']:
 p=V/r['path'];rows.append({'path':r['path'],'sha256':sha(p),'bytes':p.stat().st_size,'manifestMatches':sha(p)==r['sha256']and p.stat().st_size==r['bytes']})
assert len(rows)==len({r['path']for r in rows}) and all(r['manifestMatches']for r in rows)
files=[p for p in V.rglob('*')if p.is_file()];assert len(files)==32
comparisons=[]
def counterpart(rel):
 s=str(rel).replace('front-rim-occlusion.png','front-rim.png').replace('tray-empty-corrected.png','tray.png').replace('motion/pisa-open-','motion/pisa-')
 if s.startswith('proof/')and s.endswith('deg.png'):
  name,idx,angle=Path(s).stem.rsplit('-',2);s='proof/'+name+'-'+str(int(idx))+'-angle'+angle[:-3]+'.png'
 return CI/s
def decoded(p):
 im=Image.open(p);frames=[];durations=[]
 for i in range(getattr(im,'n_frames',1)):
  im.seek(i);frames.append(im.convert('RGBA'));durations.append(im.info.get('duration',0))
 return im,frames,durations
def differences(a,b):
 if a.size!=b.size:return{'sameDimensions':False}
 d=ImageChops.difference(a,b);rgb=d.convert('RGB');maxrgb=ImageChops.lighter(ImageChops.lighter(rgb.getchannel('R'),rgb.getchannel('G')),rgb.getchannel('B'));mask=maxrgb.point(lambda v:255 if v else 0);alpha=d.getchannel('A').point(lambda v:255 if v else 0);anymask=ImageChops.lighter(mask,alpha);visible=ImageChops.lighter(a.getchannel('A'),b.getchannel('A')).point(lambda v:255 if v else 0)
 return {'sameDimensions':True,'decodedEqual':not anymask.getbbox(),'changedRGBPixels':sum(mask.histogram()[1:]),'changedAlphaPixels':sum(alpha.histogram()[1:]),'changedVisibleRGBA':sum(ImageChops.multiply(anymask,visible).histogram()[1:]),'differenceBBox':anymask.getbbox()}
for p in files:
 if p.suffix.lower()not in['.png','.webp']:continue
 rel=p.relative_to(V);q=counterpart(rel);im,frames,durations=decoded(p);a=frames[0].getchannel('A');edge=[a.crop((0,0,a.width,1)),a.crop((0,a.height-1,a.width,a.height)),a.crop((0,0,1,a.height)),a.crop((a.width-1,0,a.width,a.height))]
 row={'path':str(rel),'bytes':p.stat().st_size,'sha256':sha(p),'dimensions':list(im.size),'frames':len(frames),'durationMs':sum(durations),'durations':durations,'loop':im.info.get('loop'),'alphaRange':a.getextrema(),'firstAlphaBBox':a.getbbox(),'edgeAlphaContact':any(e.getbbox()for e in edge),'ciPath':str(q.relative_to(CI)) if q.exists()else None}
 if q.exists():
  old,oldframes,olddurations=decoded(q);row['bytesEqualCI']=p.read_bytes()==q.read_bytes();row['rgbaCompareFirst']=differences(frames[0],oldframes[0]);row['allDecodedFramesEqualCI']=len(frames)==len(oldframes)and all(differences(x,y).get('decodedEqual',False)for x,y in zip(frames,oldframes));row['durationsEqualCI']=durations==olddurations
 comparisons.append(row)
font=ImageFont.load_default(size=20);playback=[];closedChecks=[]
for f in ['margherita','salami','quattro-formaggi']:
 im,frames,durations=decoded(V/f'motion/pisa-open-{f}.webp');times=[];t=0
 for dur in durations:times.append([t,t+dur]);t+=dur
 indexes=[next(i for i,(s,e)in enumerate(times)if s<=min(round(t*p),t-1)<e)for p in [0,.25,.5,.75,1]]
 for bg in ['light','dark','ivory','checker']:
  sheet=Image.new('RGB',(1800,425),(246,238,222));d=ImageDraw.Draw(sheet)
  for col,(pct,idx)in enumerate(zip([0,25,50,75,100],indexes)):
   base=Image.new('RGBA',frames[idx].size,{'light':(255,255,255,255),'dark':(28,33,40,255),'ivory':(246,238,222,255),'checker':(220,220,220,255)}[bg])
   if bg=='checker':
    dr=ImageDraw.Draw(base)
    for y in range(0,base.height,24):
     for x in range(0,base.width,24):
      if(x//24+y//24)%2:dr.rectangle((x,y,x+23,y+23),fill=(170,170,170,255))
   tile=Image.alpha_composite(base,frames[idx]).convert('RGB').resize((350,350),Image.Resampling.LANCZOS);sheet.paste(tile,(col*360,40));d.text((col*360+4,6),f'REVIEWv2 {f} TIME{pct}%',fill=(30,30,30));d.text((col*360+4,398),f'frame{idx} {times[idx][0]}-{times[idx][1]}ms',fill=(30,30,30))
  sheet.save(HERE/f'v2-{f}-{bg}.png')
 closed=Image.open(V/f'proof/{f}-00-0deg.png').convert('RGBA');rim=Image.open(V/'layers/front-rim-occlusion.png').convert('RGBA');pizza=Image.open(V/f'layers/pizza-{f}.png').convert('RGBA');lid=Image.open(V/'layers/lid-exterior-closed-registered.png').convert('RGBA');opaque=lambda im:im.getchannel('A').point(lambda x:255 if x>=245 else 0)
 overlap=ImageChops.multiply(ImageChops.multiply(opaque(rim),opaque(pizza)),opaque(lid));d=ImageChops.difference(rim.convert('RGB'),pizza.convert('RGB'));mx=ImageChops.lighter(ImageChops.lighter(d.getchannel('R'),d.getchannel('G')),d.getchannel('B')).point(lambda x:255 if x>30 else 0);mismatch=ImageChops.multiply(overlap,mx)
 closedChecks.append({'flavor':f,'opaqueRimPizzaClosedLidOverlap':sum(overlap.histogram()[1:]),'bbox':overlap.getbbox(),'rimVsFlavorRGBgt30':sum(mismatch.histogram()[1:]),'mismatchBBox':mismatch.getbbox()})
 a=Image.alpha_composite(Image.new('RGBA',closed.size,(246,238,222,255)),closed).convert('RGB');draw=ImageDraw.Draw(a);draw.text((24,24),'REVIEW v2 ACTUAL CLOSED PROOF - QA ONLY - '+f,font=font,fill=(160,0,0));draw.text((24,120),'P1 visible crust / common Margherita foreground',font=font,fill=(160,0,0));draw.line((460,148,540,990),fill=(220,20,20),width=4);draw.text((24,210),'P1 lid overhangs; plane is not seated on tray',font=font,fill=(160,0,0));draw.line((450,240,120,900),fill=(220,20,20),width=4);draw.rectangle((310,810,850,1050),outline=(220,20,20),width=4);a.save(HERE/f'v2-{f}-closed-annotated.png')
 playback.append({'flavor':f,'frames':len(frames),'durationMs':t,'loop':im.info.get('loop'),'sampleIndexes':indexes,'sampleTimes':[times[i]for i in indexes]})
result={'reviewV2Zip':{'filename':ZIP.name,'sha256':sha(ZIP),'bytes':ZIP.stat().st_size,'files':len(files)},'manifestRows':rows,'images':comparisons,'actualPlayback':playback,'closedOcclusion':closedChecks,'readmeAngleConflict':{'README':105,'manifestAndProof':70},'sourceCodeInZip':any(p.suffix=='.py'for p in files),'note':'Actual v2 compared independently to pinned CI bytes. Matching source hash declarations alone do not prove v2 regenerated from that Git commit.'}
(HERE/'v2-audit.json').write_text(json.dumps(result,indent=2)+'\n');(HERE/'V2-SHA256SUMS.txt').write_text('\n'.join(sha(p)+'  '+str(p.relative_to(V))for p in sorted(files))+'\n')
print(json.dumps({'zip':result['reviewV2Zip'],'manifestRowsVerified':len(rows),'images':len(comparisons),'sameByteImages':sum(r.get('bytesEqualCI',False)for r in comparisons),'sameDecodedImages':sum(r.get('allDecodedFramesEqualCI',False)for r in comparisons),'closed':closedChecks,'playback':playback,'sourceCodeInZip':result['sourceCodeInZip']},indent=2))
