from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageChops
import json
R=Path('/Users/dennisariens/projects/topo-v3-art-independent-qa');O=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-art-908b4a4');F=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',16)
rects={'SCENE-ROMA':(520,400,760,690),'SCENE-VENEZIA':(560,430,820,720),'SCENE-NAPOLI':(600,440,800,690),'IC-postcard':(0,0,1254,1254),'IC-stamp':(0,0,1244,1244)}
records=[]
for name,rect in rects.items():
 folder='icons/'if name.startswith('IC-')else'';p=R/('assets/v3/render/masters/'+folder+name+'.png');im=Image.open(p).convert('RGBA');crop=im.crop(rect);crop.save(O/(name+'-mark-crop.png'));records.append({'asset':name,'source':str(p.relative_to(R)),'rect':list(rect),'file':name+'-mark-crop.png','resized':False})
# Checked originals, expose only actual changed pixels of inpaint; no re-edit of asset.
a=Image.open(R/'assets/v3/render/masters/SCENE-VENEZIA-origineel.png').convert('RGB');b=Image.open(R/'assets/v3/render/masters/SCENE-VENEZIA.png').convert('RGB');diff=ImageChops.difference(a,b);bounds=diff.getbbox();rect=(bounds[0]-50,bounds[1]-50,bounds[2]+50,bounds[3]+50);canvas=Image.new('RGB',((rect[2]-rect[0])*2,rect[3]-rect[1]+32),'#ede8dc');d=ImageDraw.Draw(canvas)
for i,(label,im)in enumerate([('ARCHIVE original',a),('CANDIDATE retouched',b)]):
 d.text((i*(rect[2]-rect[0])+4,4),label,font=F,fill='#153d34');canvas.paste(im.crop(rect),(i*(rect[2]-rect[0]),32))
canvas.save(O/'Venezia-inpaint-original-vs-candidate.png');records.append({'asset':'SCENE-VENEZIA','RGBDifferenceBBox':list(bounds),'comparisonCrop':list(rect),'file':'Venezia-inpaint-original-vs-candidate.png','note':'Archive logo is not the runtime export'})
# Portrait transparency true composites: native crop, plus explicitly enlarged diagnostic.
im=Image.open(R/'assets/v3/render/exports/NINO-PORTRET-512.webp').convert('RGBA');back=Image.new('RGBA',im.size,'#073f3b');back.alpha_composite(im);crop=back.crop((10,230,135,395)).convert('RGB');crop.save(O/'portrait-hair-native-crop.png');crop.resize((500,660),Image.Resampling.NEAREST).save(O/'portrait-hair-4x-diagnostic.png');records.append({'asset':'NINO-PORTRET','source':'assets/v3/render/exports/NINO-PORTRET-512.webp','rect':[10,230,135,395],'native':'portrait-hair-native-crop.png','enlargedDiagnostic':'portrait-hair-4x-diagnostic.png','scale':4})
# Archive tool shown on real composites, so raw PNG hidden RGB is not mistaken for visible halo.
im=Image.open(R/'assets/v3/render/masters/icons/IC-stamp-tool.png').convert('RGBA');im.thumbnail((600,600));board=Image.new('RGB',(1200,640),'#ede8dc')
for i,color in enumerate(['#fff8e9','#073f3b']):
 c=Image.new('RGBA',(600,600),color);c.alpha_composite(im,((600-im.width)//2,(600-im.height)//2));board.paste(c.convert('RGB'),(i*600,35))
board.save(O/'stamp-tool-archive-composites.png')
(O/'crop-manifest.json').write_text(json.dumps(records,indent=2));print('Venezia RGB changed bbox',bounds,'diagnostic crops',len(records))
