#!/usr/bin/env python3
"""Recolour the pinned z8 measured DEM; no geographic edits or AI imagery.
Requires NumPy and Pillow; pass the original cached dem-z8-dpr2-render.npy with --dem.
"""
import argparse,hashlib,importlib.util,json,pathlib
import numpy as np
from PIL import Image,__version__ as pillow_version
ROOT=pathlib.Path(__file__).resolve().parents[2]
STOPS=[0,100,250,500,800,1200,1700,2200,2500,3400,5000]
COLORS=['#A8C25A','#A8C25A','#A3B85B','#9AAA52','#929B4A','#9A7A46','#8A5A3A','#B6A386','#F7F8F6','#FFFFFF','#FFFFFF']
def main(path):
 source=ROOT/'assets/discovery/terrain-z8-render-provenance.json';prov=json.loads(source.read_text())
 dem=np.load(path,allow_pickle=False);digest=hashlib.sha256(dem.astype('<f8').tobytes()).hexdigest()
 assert digest==prov['pipeline']['raw_dem_float64_le_sha256'] and dem.shape==(2470,1780)
 spec=importlib.util.spec_from_file_location('terrain',ROOT/'scripts/geography/generate-terrain.py');base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
 scale=2;height=base.smooth(np.maximum(dem,0),.55*scale);dy,dx=np.gradient(height)
 lat=(3830.75-(np.arange(dem.shape[0])[:,None]+.5)/scale)/77
 dx/=6371008.8*np.cos(np.radians(lat))*np.radians(1/(55*scale));dy/=6371008.8*np.radians(1/(77*scale))
 nx,ny=-dx*4.5,dy*4.5;norm=np.sqrt(nx*nx+ny*ny+1);shade=np.zeros_like(height)
 for azimuth,weight in [(315,.65),(270,.20),(45,.15)]:
  az,alt=np.radians(azimuth),np.radians(40);shade+=weight*np.clip((nx*np.sin(az)*np.cos(alt)+ny*np.cos(az)*np.cos(alt)+np.sin(alt))/norm,0,1)
 target=np.array([[int(c[i:i+2],16) for i in (1,3,5)] for c in COLORS],dtype=float)
 # Store the inverse of the final 1.3 SVG contrast, so flat-light display colours match the approved palette.
 palette=(target+.15*255)/1.3
 color=np.stack([np.interp(height,STOPS,palette[:,c]) for c in range(3)],axis=-1)
 texture=np.clip((height-base.smooth(height,3*scale))/1500,-.035,.035)
 lighting=np.clip(.62+.62*shade+texture,.48,1.12)
 color=color*lighting[...,None]+(1-lighting[...,None])*np.array([13,5,-3])
 image=Image.fromarray(np.uint8(np.clip(color,0,255)),'RGB');out=ROOT/'assets/v3/relief-r2.webp';image.save(out,'WEBP',quality=90,method=6)
 data=out.read_bytes();meta={'source':str(source.relative_to(ROOT)),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'rawDemSha256':digest,'registration':'unchanged; source z8 DPR2 pixel centres, original SVG clip','output':{'path':str(out.relative_to(ROOT)),'size':list(image.size),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()},'displayPalette':[{'elevation_m':h,'color':c} for h,c in zip(STOPS,COLORS)],'basePaletteRgb':palette.tolist(),'contrast':1.3,'hillshade':prov['pipeline']['hillshade'],'lighting':{'ambient':.62,'diffuse':.62,'minimum':.48,'maximum':1.12},'encoder':{'numpy':np.__version__,'pillow':pillow_version,'webpQuality':90,'method':6}}
 (ROOT/'assets/v3/relief-r2-provenance.json').write_text(json.dumps(meta,indent=2)+'\n');print(meta['output'])
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--dem',required=True,type=pathlib.Path);main(p.parse_args().dem)
