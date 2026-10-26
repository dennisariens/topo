#!/usr/bin/env python3
"""Generate only area-c from sourced mountain anchors + pinned registered DEM.
Educational corridor, not a surveyed range boundary. Requires numpy/shapely.
"""
import json,re,math,heapq,hashlib,subprocess
from pathlib import Path
import numpy as np
from shapely.geometry import Polygon,Point,LineString
from shapely.ops import unary_union
R=Path(__file__).resolve().parents[2];C=Path('/Users/dennisariens/.hermes/outputs/topo-ipad-update-qa');O=R/'docs/geography';dem=np.load(C/'registered-dem.npy')
source=json.loads((R/'docs/geography/apennines-anchor-source-en.json').read_text());sourceIt=json.loads((R/'docs/geography/apennines-anchor-source-it.json').read_text());pages={p['title']:p for d in [source,sourceIt]for p in d['query']['pages'].values()}
names=['Colle di Cadibona','Monte Beigua','Monte Antola','Monte Maggiorasca','Cisa Pass','Monte Cimone','Monte Falterona','Monte Catria','Monte Vettore','Corno Grande','Maiella','Monte Miletto','Monte Cervialto','Massiccio del Sirino','Pollino','Monte Botte Donato','Monte Pecoraro','Montalto (Aspromonte)']
h=(R/'index.html').read_text();items=json.loads(re.search(r'const ITEMS=(\[.*?\]);\nconst \$',h,re.S).group(1));italy=re.search(r'const italy="([^"]+)";',h).group(1)
t=re.findall(r'[MLZ]|-?\d+(?:\.\d+)?',italy);rings=[];p=[];i=0
while i<len(t):
 c=t[i];i+=1
 if c in ['M','L']:p.append((float(t[i]),float(t[i+1])));i+=2
 elif c=='Z':rings.append(Polygon(p));p=[]
land=max(rings,key=lambda p:p.area);inland=land.buffer(-2)
anchors=[]
for name in names:
 p=pages[name];c=p['coordinates'][0];x=55*c['lon']-225.5;y=3830.75-77*c['lat'];assert land.covers(Point(x,y)),name
 anchors.append(dict(name=name,lat=c['lat'],lon=c['lon'],x=x,y=y,pageid=p['pageid'],url=('https://it.wikipedia.org/?curid='if name in ['Monte Vettore','Monte Miletto','Monte Cervialto','Massiccio del Sirino','Monte Botte Donato','Monte Pecoraro']else'https://en.wikipedia.org/?curid=')+str(p['pageid'])))
# Grid routes stay within 22 source pixels of the referenced segment; elevation biases the ridge.
route=[]
for a,b in zip(anchors,anchors[1:]):
 start=(round(a['x']),round(a['y']));end=(round(b['x']),round(b['y']));seg=LineString([(a['x'],a['y']),(b['x'],b['y'])]);xmin=max(0,min(start[0],end[0])-24);xmax=min(889,max(start[0],end[0])+24);ymin=max(0,min(start[1],end[1])-24);ymax=min(1234,max(start[1],end[1])+24)
 cost={};valid=set()
 for y in range(ymin,ymax+1):
  for x in range(xmin,xmax+1):
   lateral=seg.distance(Point(x,y))
   if lateral<=22 and land.covers(Point(x,y)):
    valid.add((x,y));cost[x,y]=1+2*(1-min(1800,max(0,dem[y,x]))/1800)+.8*(lateral/22)**2
 assert start in valid and end in valid,(a['name'],b['name'])
 dist={start:0};previous={};queue=[(0,start)]
 while queue:
  d,u=heapq.heappop(queue)
  if u==end:break
  if d!=dist.get(u):continue
  for dx,dy in [(1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)]:
   v=(u[0]+dx,u[1]+dy)
   if v not in valid:continue
   n=d+math.hypot(dx,dy)*(cost[u]+cost[v])/2
   if n<dist.get(v,float('inf')):dist[v]=n;previous[v]=u;heapq.heappush(queue,(n,v))
 assert end in dist,'No route';leg=[end]
 while leg[-1]!=start:leg.append(previous[leg[-1]])
 route.extend(list(reversed(leg))[0 if not route else 1:])
line=LineString(route).simplify(1.2,preserve_topology=True);region=line.buffer(10,resolution=8,join_style=1).intersection(inland)
assert region.is_valid and region.geom_type=='Polygon','Range must remain connected'
# Conservative inward rounding margin remains >1.8 source units at the coastline.
pts=[(round(x,2),round(y,2))for x,y in region.exterior.coords];region=Polygon(pts);assert region.is_valid and region.difference(land).area<1e-6
path='M '+' L '.join(f'{x:.2f} {y:.2f}'for x,y in pts[:-1])+' Z';old=next(i['shape']for i in items if i['id']=='area-c');assert h.count(old)==2,'static/live copies only';h=h.replace(old,path);(R/'index.html').write_text(h)
manifest=json.loads((O/'map-manifest.json').read_text());digest=hashlib.sha256(path.encode()).hexdigest()
for item in manifest:
 if item['id']=='area-c':item['shape_sha256']=digest;item['reference']='Sourced mountain anchors + pinned Terrarium DEM ridge routing; 10 SVG-unit educational corridor, 2-unit mainland inset. Not a surveyed range boundary.'
(O/'map-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
record={'purpose':'reproducible educational Apennines mainland corridor, not geodetic boundary','anchors':anchors,'anchor_source_api':['https://en.wikipedia.org/w/api.php?action=query&prop=coordinates','https://it.wikipedia.org/w/api.php?action=query&prop=coordinates'],'dem_provenance':'assets/discovery/terrain-provenance.json; 63 original hashes checked by qa-apennines.py','routing':{'neighbors':8,'reference_segment_max_distance_svg':22,'elevation_clamp_m':1800,'cost':'1 + 2*(1-clamp(height,0,1800)/1800) + .8*(lateral/22)^2','line_simplification_svg':1.2,'corridor_radius_svg':10,'mainland_inset_svg':2},'path_sha256':digest,'vertices':len(pts)-1,'filled_area':region.area,'off_mainland_area':region.difference(land).area,'source_ridge_elevation_m':{'median':float(np.median([dem[y,x]for x,y in route])),'min':float(min(dem[y,x]for x,y in route))},'authoritative_extent_reference':'https://www.treccani.it/enciclopedia/appennino/','other44_records':'preserved verbatim; verified independently by QA'}
(O/'apennines-provenance.json').write_text(json.dumps(record,indent=2,ensure_ascii=False)+'\n');print(json.dumps({k:record[k]for k in ['path_sha256','vertices','filled_area','off_mainland_area','source_ridge_elevation_m']},indent=2))
