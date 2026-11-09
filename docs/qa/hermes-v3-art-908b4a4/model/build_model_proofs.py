from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import json, hashlib
R=Path('/Users/dennisariens/projects/topo-v3-art-independent-qa')
B=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-art-908b4a4')
O=B/'model'; O.mkdir(exist_ok=True)
font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',17)
small=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',14)
refs={'guide':B/'references/nino-guide.webp','travel':B/'references/nino-travel.webp','firenze':B/'references/topo-steden-firenze.png'}
crops={
'NINO-PORTRET':{'candidate':[0,0,512,512],'reference':[200,70,660,650],'face':[40,15,470,440]},
'SCENE-ROMA':{'candidate':[255,120,825,920],'reference':[110,100,690,940],'face':[350,125,650,570]},
'SCENE-VENEZIA':{'candidate':[250,100,865,910],'reference':[110,100,690,940],'face':[335,105,685,570]},
'SCENE-NAPOLI':{'candidate':[155,40,850,925],'reference':[110,100,690,940],'face':[265,45,590,550]}}
notes={
'NINO-PORTRET':['REWORK: frontaal, geen driekwart naar links.','Export: hoofd afgesneden van borst/shirt; geen borstportret.','Master: open blauw overshirt + wit ondershirt.','Haar/helm/bril/sjaal herkenbaar; gezicht ronder.','Broek, schoenen, Vespa: N/A (buiten portret).'],
'SCENE-ROMA':['REWORK: open donkerblauw overshirt + wit ondershirt.','Canon: gesloten blauw werkshirt met knopen.','Gezicht wat ronder/grotere ogen; identiteit herkenbaar.','Rugzak, cargozak, hoge bruine sneakers: passend.','Rode Vespa gladder/nieuwer; mini zonder Nino: PASS.'],
'SCENE-VENEZIA':['PASS model: blauw knoopshirt met opgerolde mouwen.','Gezicht, bruin krulhaar, groene helm/bril herkenbaar.','Rode sjaal, bruine rugzak, cargo en schoenen passend.','Vespa gladder/nieuwer: stijlvariatie, geen modelblokkade.','Mini: uitsluitend landschap, zonder Nino: PASS.'],
'SCENE-NAPOLI':['REWORK: open overshirt met groot wit ondershirt.','Canoniek: gesloten blauw werkshirt; geen wit middenvlak.','Cargo niet omgeslagen; been op grond i.p.v. voetplank.','Haar/helm/bril/sjaal/rugzak/schoenen herkenbaar.','Vespa rood/klassiek; mini zonder Nino: PASS.']}
manifest=json.loads((R/'assets/v3/render/manifest.json').read_text())
assets=[a for a in manifest['assets'] if a['id'] in crops]
ledger=[]
def get(path,box=None):
 im=Image.open(path).convert('RGBA')
 if box: im=im.crop(box)
 bg=Image.new('RGBA',im.size,'#eee8d9'); bg.alpha_composite(im)
 return bg.convert('RGB')
def panel(canvas,path,box,x,y,w,h,label):
 im=get(path,box); im.thumbnail((w,h),Image.Resampling.LANCZOS)
 canvas.paste(im,(x+(w-im.width)//2,y))
 d=ImageDraw.Draw(canvas); d.text((x,y+h+4),label,fill='#202020',font=small)
for a in assets:
 aid=a['id']; p=R/a.get('export',a.get('export_kop'))['path']; c=crops[aid]
 ref=refs['guide'] if aid=='NINO-PORTRET' else refs['firenze']
 board=Image.new('RGB',(1600,1150),'#f4f0e7'); d=ImageDraw.Draw(board)
 d.text((20,15),aid+' | onafhankelijke model-QA | pin 908b4a4',font=font,fill='black')
 panel(board,ref,c['reference'],20,55,490,610,'CANON '+ref.name+' | crop '+str(c['reference']))
 panel(board,p,c['candidate'],550,55,490,610,'KANDIDAAT '+p.name+' | '+str(c['candidate']))
 panel(board,p,c['face'],1080,55,490,610,'DETAIL | '+str(c['face']))
 for j,n in enumerate(notes[aid]): d.text((25,705+29*j),n,font=font,fill='#a12323' if j==0 and 'REWORK' in n else '#142830')
 d.text((25,875),'Broncoordinaten: halfopen [links,boven,rechts,onder], native pixels; uitsluitend crop/schaal/compositie.',font=small,fill='black')
 d.text((25,900),'Vergelijking: 7 canonieke exports + alle 8 gepinde #75-scenes op contactboards; geen eigenaarstatus als QA.',font=small,fill='black')
 if 'export_mini' in a:
  mp=R/a['export_mini']['path']; panel(board,mp,None,1090,730,480,270,'MINI volledig 480x270 | geen Nino of Vespa zichtbaar')
 # source locator shows exact crop against full candidate (non destructive)
 full=get(p); scale=min(1000/full.width,190/full.height); full=full.resize((round(full.width*scale),round(full.height*scale)))
 loc=ImageDraw.Draw(full); box=c['face']; loc.rectangle(tuple(round(v*scale) for v in box),outline='#e00000',width=3)
 board.paste(full,(25,945)); d.text((25+full.width+12,980),'Rood kader = detail rechtsboven',font=small,fill='#a12323')
 out=O/(aid+'-comparison.png'); board.save(out)
 # Master shirt/bust detail, explicitly not exported portrait
 if aid=='NINO-PORTRET':
  more=Image.new('RGB',(1400,850),'#f4f0e7'); md=ImageDraw.Draw(more)
  md.text((20,15),'PORTRET | master versus export versus canon | pose en shirt',font=font,fill='black')
  panel(more,R/a['master']['path'],None,20,50,440,600,'MASTER volledig 1122x1402')
  panel(more,p,None,480,50,440,600,'EXPORT volledig 512x512')
  panel(more,refs['guide'],[140,440,650,970],940,50,440,600,'CANON shirt | [140,440,650,970]')
  md.text((20,705),'Master heeft borst maar frontale pose en wit ondershirt; export houdt alleen hoofd/sjaal/schouderrand over.',font=font,fill='#a12323')
  md.text((20,740),'Export: borst/shirt-details niet toetsbaar (N/A), geen BLOCKED voor onzichtbare broek/schoenen/Vespa.',font=font,fill='black')
  more.save(O/'NINO-PORTRET-master-export-proof.png')
 ledger.append({'id':aid,'proof':str(out),'candidate_path':str(p),'candidate_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'reference_path':str(ref),'crop_coordinates_native_halfopen':c})
(O/'proof-manifest.json').write_text(json.dumps(ledger,indent=2))
print(json.dumps({'proof_count':len(ledger),'ids':[x['id'] for x in ledger],'files':[str(p) for p in O.glob('*.png')]},indent=2))
