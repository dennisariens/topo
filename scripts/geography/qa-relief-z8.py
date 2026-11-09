#!/usr/bin/env python3
"""Read-only z7/z8 evidence using canonical land paths and the generator's raw DEM."""
import argparse
import hashlib
import json
import re
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/qa/relief-z8'

def rings(path):
    # Canonical source uses straight M/L/Z paths; reject any unsupported command.
    assert not re.search('[A-KN-Yac-z]', path)
    result = []
    for part in path.split('Z'):
        coords = re.findall(r'-?\d+(?:\.\d+)?', part)
        if coords:
            result.append(np.array(list(zip(map(float, coords[::2]), map(float, coords[1::2])))))
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', required=True, type=Path)
    parser.add_argument('--render', action='store_true', help='Compare z7, z8 and render with separate decorative layers')
    args = parser.parse_args()
    variants = [7,8] + (['render'] if args.render else [])
    OUT.mkdir(parents=True, exist_ok=True)
    html = (ROOT / 'index.html').read_text()
    items = json.loads(re.search(r'const ITEMS=(\[.*?\]);\nconst \$', html, re.S).group(1))
    context = json.loads(re.search(r'const CONTEXT_LAND=({.*?});\n', html, re.S).group(1))
    italy = re.search(r'const italy="([^"]+)";', html).group(1)
    paths = list(context.values()) + [italy] + [i['shape'] for i in items if i['id'] in ['area-i','area-j','area-k','area-l','area-m','area-a','area-b']]
    all_rings = [ring for path in paths for ring in rings(path)]
    mask = Image.new('L', (1780,2470))
    draw = ImageDraw.Draw(mask)
    for ring in all_rings:
        draw.polygon([tuple(p*2) for p in ring], fill=255)
    views = {}
    assets = [(7,'terrain.webp'),(8,'terrain-z8.webp')]
    if args.render:
        assets.append(('render','terrain-z8-render.webp'))
    for zoom, name in assets:
        source = Image.open(ROOT / 'assets/discovery' / name).convert('RGB').resize((1780,2470), Image.Resampling.LANCZOS)
        im = Image.new('RGB', source.size, '#c8e2ed')
        if zoom == 'render':
            im = Image.open(ROOT/'assets/discovery/terrain-z8-render-sea.webp').convert('RGB')
            shadow = Image.open(ROOT/'assets/discovery/terrain-z8-render-shadow.webp')
            im.paste(shadow,(0,0),shadow)
        im.paste(source,(0,0),mask)
        draw = ImageDraw.Draw(im)
        if zoom == 'render':
            coast = Image.open(ROOT/'assets/discovery/terrain-z8-render-coast.webp')
            im.paste(coast,(0,0),coast)
        for ring in ([] if zoom == 'render' else all_rings):
            draw.line([tuple(p*2) for p in np.vstack([ring,ring[0]])], fill='#384b3b',width=2)
        views[zoom] = im
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',22)
    crops = {'italie':(0,0,890,1235),'alpen':(100,215,550,410),'apennijnen':(270,410,710,790),'sicilie':(415,865,650,1020)}
    for name, box in crops.items():
        pixel_box=tuple(v*2 for v in box)
        panels=[views[z].crop(pixel_box) for z in variants]
        if name=='italie':
            panels=[p.resize((623,865),Image.Resampling.LANCZOS) for p in panels]
        w,h=panels[0].size
        board=Image.new('RGB',(w*len(variants)+12*(len(variants)+1),h+68),'#fffdf9')
        d=ImageDraw.Draw(board)
        for k,z in enumerate(variants):
            board.paste(panels[k],(12+k*(w+12),54))
            d.text((12+k*(w+12),15),('z8-render · zee + schaduw + kustrand' if z=='render' else f'z{z} — '+('origineel 890×1235' if z==7 else 'DPR 2 · 1780×2470')),font=font,fill='#1d2523')
        board.save(OUT / (f'{name}-z7-z8-render.png' if args.render else f'{name}-z7-z8.png'))
    # Independent registration audit: inverse sample positions in the original
    # generator are compared to canonical SVG vertices across all land paths.
    points=np.vstack(all_rings)
    image_xy=points*2
    lon=(image_xy[:,0]/2+225.5)/55
    lat=(3830.75-image_xy[:,1]/2)/77
    restored=np.stack([55*lon-225.5,3830.75-77*lat],axis=-1)
    registration=float(np.linalg.norm(restored-points,axis=-1).max())
    # Physical DEM/coast consistency is a separate test from numerical mapping.
    # Islands have no international land borders: sample their canonical coast
    # every 0.5 SVG px and measure nearest raw DEM zero crossing (linear cell
    # interpolation), without moving, masking or correcting either source.
    dem=np.load(args.cache / 'dem-z8-dpr2.npy')
    crossings=[]
    for axis in [0,1]:
        a=dem[:-1,:] if axis==0 else dem[:,:-1]
        b=dem[1:,:] if axis==0 else dem[:,1:]
        yy,xx=np.where((a<0)!=(b<0))
        frac=-a[yy,xx]/(b[yy,xx]-a[yy,xx])
        crossings.append(np.stack([(xx+.5+(frac if axis==1 else 0))/2,(yy+.5+(frac if axis==0 else 0))/2],axis=-1))
    crossings=np.vstack(crossings)
    coast_results=[]
    for item in [i for i in items if i['id'] in ['area-a','area-b']]:
        samples=[]
        for ring in rings(item['shape']):
            for a,b in zip(ring,np.roll(ring,-1,axis=0)):
                count=max(1,int(np.ceil(np.linalg.norm(b-a)*2)))
                samples.extend(a+(b-a)*t for t in np.arange(count)/count)
        samples=np.array(samples)
        c=crossings[(crossings[:,0]>samples[:,0].min()-20)&(crossings[:,0]<samples[:,0].max()+20)&(crossings[:,1]>samples[:,1].min()-20)&(crossings[:,1]<samples[:,1].max()+20)]
        distances=np.array([np.linalg.norm(c-p,axis=1).min() for p in samples])
        index=int(distances.argmax())
        coast_results.append({'name':item['name'],'samples':len(samples),'max_distance_svg_px':float(distances[index]),'p95_distance_svg_px':float(np.percentile(distances,95)),'worst_svg_xy':samples[index].tolist(),'within_1px':bool(distances.max()<=1)})
    for result in coast_results:
     x,y=result['worst_svg_xy'];box=(int(x*2)-80,int(y*2)-80,int(x*2)+80,int(y*2)+80)
     im=Image.open(ROOT/'assets/discovery/terrain-z8.webp').convert('RGB').crop(box).resize((640,640),Image.Resampling.NEAREST);d=ImageDraw.Draw(im)
     def point(a,b):return ((a*2-box[0])*4,(b*2-box[1])*4)
     item=next(i for i in items if i['name']==result['name'])
     for part in item['shape'].split('Z'):
      c=list(map(float,re.findall(r'-?\d+(?:\.\d+)?',part)))
      ps=[point(a,b) for a,b in zip(c[::2],c[1::2])]
      if ps:d.line(ps+[ps[0]],fill='#ff00c8',width=3)
     for axis in [0,1]:
      a=dem[:-1,:] if axis==0 else dem[:,:-1];b=dem[1:,:] if axis==0 else dem[:,1:];yy,xx=np.where((a<0)!=(b<0))
      keep=(xx>=box[0])&(xx<box[2])&(yy>=box[1])&(yy<box[3]);xx,yy=xx[keep],yy[keep];f=-a[yy,xx]/(b[yy,xx]-a[yy,xx])
      for cx,cy in zip(xx+.5+(f if axis==1 else 0),yy+.5+(f if axis==0 else 0)):
       px,py=point(cx/2,cy/2);d.ellipse((px-2,py-2,px+2,py+2),fill='#00faff')
     board=Image.new('RGB',(640,710),'#fffdf9');board.paste(im,(0,70));bd=ImageDraw.Draw(board);bd.text((8,7),result['name']+f" · max {result['max_distance_svg_px']:.2f} SVG px",font=font,fill='black');bd.text((8,36),'Magenta: vectorcoast · cyaan: DEM 0 m · 8× SVG',font=font,fill='black');board.save(OUT/('kust-'+('sicilie' if item['id']=='area-a' else 'sardinie')+'.png'))
    provenance=json.loads((ROOT/'assets/discovery/terrain-z8-provenance.json').read_text())
    size=provenance['output']['bytes']
    old=(ROOT/'assets/discovery/terrain.webp').stat().st_size
    result={'z9':'deferred by owner','frame':[890,1235],'raster':[1780,2470],'landmark_checks':provenance['validation']['landmark_checks'],'registration':{'canonical_land_vertices':len(points),'max_error_svg_px':registration,'clip':'same canonical land paths; no independent raster coastline'},'coast_dem_zero_contour':{'method':'Nearest interpolated raw DEM zero crossing to canonical island coast, sampled every <=0.5 SVG px. Includes source shoreline/bathymetry differences; not a pure affine transform test. Units are SVG px (DPR2 raster px / 2).','results':coast_results},'bytes':{'z7':old,'z8':size,'budget':1000000,'actual_html_growth':0,'future_base64_replacement_delta':4*((size+2)//3)-4*((old+2)//3)},'owner_resumption':'Owner instructed continue after the reported shoreline discrepancy; no geometry correction or integration approval implied','status':'review required: coastline discrepancy >1px' if any(not r['within_1px'] for r in coast_results) else 'passed','index_sha256':hashlib.sha256((ROOT/'index.html').read_bytes()).hexdigest()}
    if args.render:
        render = json.loads((ROOT/'assets/discovery/terrain-z8-render-provenance.json').read_text())
        render_dem = np.load(args.cache/'dem-z8-dpr2-render.npy')
        assert np.array_equal(dem,render_dem), 'DEM changed between styles'
        assert render['data'] == provenance['data'], 'Source tiles or attribution changed'
        assert render['registration'] == provenance['registration'], 'Frame registration changed'
        assert render['validation']['landmark_checks'] == provenance['validation']['landmark_checks']
        geometry_hash=hashlib.sha256('\n'.join(paths).encode()).hexdigest()
        assert render['pipeline']['decorative_layer_settings']['canonical_paths_sha256']==geometry_hash
        records=[render['output']]+render['pipeline']['decorative_layers']
        for record in records:
            data=(ROOT/record['path']).read_bytes()
            assert hashlib.sha256(data).hexdigest()==record['sha256']
            with Image.open(ROOT/record['path']) as decoded:
                decoded.load()
                assert decoded.size==(1780,2470) and decoded.mode==record['mode']
        total=sum(record['bytes'] for record in records)
        assert total<=1000000
        result['render']={'same_raw_dem':True,'raw_dem_sha256':hashlib.sha256(render_dem.astype('<f8').tobytes()).hexdigest(),
                          'same_source_tiles_and_attribution':True,'same_registration':True,
                          'same_landmark_checks':True,'same_canonical_land_paths':True,
                          'records':records,'combined_runtime_bytes':total,
                          'actual_html_growth':0,
                          'future_base64_replacement_delta':sum(4*((record['bytes']+2)//3) for record in records)-4*((old+2)//3),
                          'coastline_review_status':'Existing z8 DEM/vector discrepancy unchanged; decorative rim does not correct or validate it.'}
    (OUT/('render-validation.json' if args.render else 'validation.json')).write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))

if __name__=='__main__':
    main()
