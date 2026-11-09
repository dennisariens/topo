from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageStat
import json,math
R=Path('/Users/dennisariens/projects/topo-v3-art-independent-qa');O=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-art-908b4a4');M=json.loads((R/'assets/v3/render/manifest.json').read_text());F=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',16)
icons=[a for a in M['assets']if a['id'].startswith('IC-')and'exports'in a]
bgs=[('#fff8e9','light'),('#073f3b','dark'),(None,'checker')]
def bg(size,color):
 if color:return Image.new('RGBA',size,color)
 im=Image.new('RGBA',size,'#ffffff');d=ImageDraw.Draw(im)
 for y in range(0,size[1],12):
  for x in range(0,size[0],12):
   if (x//12+y//12)%2:d.rectangle((x,y,x+11,y+11),fill='#bcbcbc')
 return im
# Native24/48 CSS-pixel proofs, no enlargement. Source48 for24,source96 for48 (DPR2-aware alternate also included).
sheet=Image.new('RGB',(1000,len(icons)*130),'#e8e4d9');d=ImageDraw.Draw(sheet)
records=[]
for row,a in enumerate(icons):
 d.text((8,row*130+8),a['id'],font=F,fill='#173d36')
 for col,(color,label)in enumerate(bgs):
  cell=bg((270,105),color);cd=ImageDraw.Draw(cell);cd.text((8,3),label,font=F,fill='#fff8e9'if color=='#073f3b'else'#173d36')
  for n,(size,source)in enumerate([(24,a['exports']['48']),(48,a['exports']['96'])]):
   im=Image.open(R/source['path']).convert('RGBA').resize((size,size),Image.Resampling.LANCZOS);cell.alpha_composite(im,(20+n*110,37));cd.text((52+n*110,80),str(size)+'px',font=F,fill='#fff8e9'if color=='#073f3b'else'#173d36')
   records.append({'asset':a['id'],'background':label,'nativePixels':size,'source':source['path']})
  sheet.paste(cell.convert('RGB'),(180+col*270,row*130+23))
sheet.save(O/'icons-native-24-48.png')
# Detail boards, source master not substituted for runtime quality.
for i in range(0,len(icons),3):
 page=Image.new('RGB',(1200,760),'#e8e4d9');pd=ImageDraw.Draw(page)
 for j,a in enumerate(icons[i:i+3]):
  for k,(color,label)in enumerate(bgs[:2]):
   cell=bg((390,340),color);im=Image.open(R/a['master']['path']).convert('RGBA');im.thumbnail((320,290));cell.alpha_composite(im,((390-im.width)//2,35));ImageDraw.Draw(cell).text((10,8),a['id']+' '+label,font=F,fill='white'if color=='#073f3b'else'#173d36');page.paste(cell.convert('RGB'),(j*400,k*380))
 page.save(O/('icons-detail-'+str(i//3+1)+'.png'))
portrait=Image.open(R/'assets/v3/render/exports/NINO-PORTRET-512.webp').convert('RGBA');comp=Image.new('RGB',(1536,550),'#e8e4d9')
for i,(color,label)in enumerate(bgs):
 c=bg((512,512),color);c.alpha_composite(portrait);comp.paste(c.convert('RGB'),(i*512,35));ImageDraw.Draw(comp).text((i*512+8,5),'Portrait512 '+label,font=F,fill='#173d36')
comp.save(O/'portrait-alpha-composites.png')
# Full background exports are native 2x frames for a 1440x900 CSS viewport. Crops retain source pixels.
metrics=[]
for a in M['assets']:
 if not a['id'].startswith('BG-'):continue
 im=Image.open(R/a['export']['path']).convert('RGB');w,h=im.size;center=im.crop((int(.3*w),int(.3*h),int(.7*w),int(.7*h)));stat=ImageStat.Stat(center.convert('L'));box=(int(.35*w),int(.35*h),int(.35*w)+720,int(.35*h)+480);im.crop(box).save(O/(a['id']+'-dpr2-native-crop.png'));metrics.append({'asset':a['id'],'exportSize':list(im.size),'sourceSize':a['master']['size'],'cssAtDPR2':[w/2,h/2],'nativeSourceCSSLimitDPR2':[a['master']['size'][0]/2,a['master']['size'][1]/2],'centralLumaMean':stat.mean[0],'centralLumaStddev':stat.stddev[0],'cropCoordinates':list(box),'note':'No-resize crop from actual export; full export is Lanczos upscale, not new native detail'})
(O/'display-proof.json').write_text(json.dumps({'iconCases':records,'backgrounds':metrics},indent=2));print('icons',len(icons),'native proof cells',len(records),'BG metrics',json.dumps(metrics,indent=2))
