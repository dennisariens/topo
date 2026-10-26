#!/usr/bin/env python3
"""Read-only filled-area/registered DEM proof for #37, requires Pillow/numpy/shapely."""
import re,json,math,hashlib,subprocess,importlib.util
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageFont
from shapely.geometry import Polygon
from shapely.ops import unary_union
R=Path(__file__).resolve().parents[2];O=R/'docs/visual/ipad-update-47';O.mkdir(parents=True,exist_ok=True)
BASE='71b33fd973c7b650c63e7921af3e7bf6aab5f79f'
def parse(text):return json.loads(re.search(r'const ITEMS=(\[.*?\]);\nconst \$',text,re.S).group(1))
def poly(path):
 rings=[];pts=[];t=re.findall(r'[MLQZ]|-?\d+(?:\.\d+)?',path);i=0
 while i<len(t):
  c=t[i];i+=1
  if c in ['M','L']:pts.append((float(t[i]),float(t[i+1])));i+=2
  elif c=='Q':
   start=np.array(pts[-1]);control=np.array([float(t[i]),float(t[i+1])]);end=np.array([float(t[i+2]),float(t[i+3])]);i+=4
   for u in np.linspace(0,1,201)[1:]:pts.append(tuple((1-u)**2*start+2*(1-u)*u*control+u*u*end))
  elif c=='Z':rings.append(Polygon(pts));pts=[]
  else:raise ValueError(c)
 assert not pts
 g=unary_union(rings);assert g.is_valid;return g
h=(R/'index.html').read_text();b=subprocess.check_output(['git','show',BASE+':index.html'],cwd=R).decode();items=parse(h);oldItems=parse(b);land=poly(re.search(r'const italy="([^"]+)";',h).group(1));p=poly(next(x['shape']for x in items if x['id']=='area-c'));old=poly(next(x['shape']for x in oldItems if x['id']=='area-c'));land=max(list(land.geoms),key=lambda z:z.area)if land.geom_type=='MultiPolygon'else land
# Reconstruct exact native registration using immutable cached provenance tiles.
spec=importlib.util.spec_from_file_location('terrain',R/'scripts/geography/generate-terrain.py');g=importlib.util.module_from_spec(spec);spec.loader.exec_module(g)
pr=json.loads((R/'assets/discovery/terrain-provenance.json').read_text());tiles=pr['data']['tiles'];xs=[t['tile'][1]for t in tiles];ys=[t['tile'][2]for t in tiles];minx,miny=min(xs),min(ys);m=np.empty(((max(ys)-miny+1)*256,(max(xs)-minx+1)*256));cache=Path('/Users/dennisariens/.hermes/cache/scratch/topo-discovery-terrain/downloads')
for t in tiles:
 z,x,y=t['tile'];path=cache/f'{z}-{x}-{y}.png';data=path.read_bytes();assert hashlib.sha256(data).hexdigest()==t['sha256'];rgb=np.asarray(Image.open(path).convert('RGB'),dtype=float);m[(y-miny)*256:(y-miny+1)*256,(x-minx)*256:(x-minx+1)*256]=rgb[:,:,0]*256+rgb[:,:,1]+rgb[:,:,2]/256-32768
lon=(np.arange(890)[None,:]+.5+225.5)/55;lat=(3830.75-np.arange(1235)[:,None]-.5)/77;wx,wy=g.world(lon,lat);dem=g.bilinear(m,wx-minx*256-.5,wy-miny*256-.5);np.save(Path('/Users/dennisariens/.hermes/outputs/topo-ipad-update-qa/registered-dem.npy'),dem)
result={'baseline':BASE,'mainlandMask':'largest connected canonical Italy polygon','oldCurveFlatteningSegments':200,'tiles_verified':len(tiles),'projection':'x=55*lon-225.5; y=3830.75-77*lat','units':'SVG projected square units, not geodesic km2','polygons':{}}
for name,a in [('before',old),('current',p)]:
 outside=a.difference(land).area;result['polygons'][name]={'valid':a.is_valid,'connected':a.geom_type=='Polygon','area':a.area,'outsideMainlandArea':outside,'outsidePercent':100*outside/a.area,'bounds':a.bounds,'centroid':list(a.centroid.coords)[0]}
result['other44_records_exact']=all(x==next(i for i in oldItems if i['id']==x['id'])for x in items if x['id']!='area-c');assert result['other44_records_exact']
# Registered source material clipped only through canonical mainland.
mask=Image.new('L',(890,1235));d=ImageDraw.Draw(mask)
for r in ([land]if land.geom_type=='Polygon'else land.geoms):d.polygon(list(r.exterior.coords),fill=255)
im=Image.new('RGB',(890,1235),'#c8e2ed');im.paste(Image.open(R/'assets/discovery/terrain.webp'),(0,0),mask);dr=ImageDraw.Draw(im);dr.line(list(land.exterior.coords),fill='#384b3b',width=1);dr.line(list(old.exterior.coords),fill='#cf3a3a',width=3);dr.line(list(p.exterior.coords),fill='#005cdd',width=2)
markers=json.loads((R/'docs/geography/apennines-provenance.json').read_text())['anchors']
for marker in [markers[0],markers[-1]]:
 xy=(marker['x'],marker['y']);dr.ellipse((xy[0]-4,xy[1]-4,xy[0]+4,xy[1]+4),fill='white',outline='black',width=2)
view=im.crop((155,300,805,970)).resize((975,1005));board=Image.new('RGB',(1000,1080),'#fff9ec');board.paste(view,(12,55));t=ImageDraw.Draw(board);font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',18);t.text((12,10),'#37 RED = PR40 / BLUE = candidate / immutable registered DEM',font=font,fill='#203c35');board.save(O/'apennines-dem-overlay.png');(O/'apennines-filled-area.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
