import pathlib,asyncio,json
from playwright.async_api import async_playwright
OUT=pathlib.Path(__file__).parent;ROOT=pathlib.Path('/Users/dennisariens/projects/topo-v3-app-1a42590');HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
ns={'__file__':str(OUT/'independent.py')};exec((OUT/'independent.py').read_text().replace('asyncio.run(main())',''),ns)
async def main():
 result={}
 async with async_playwright() as pw:
  for engine in ['chromium','webkit']:
   b=await getattr(pw,engine).launch();p=await b.new_page(viewport={'width':820,'height':1180});await p.goto(HTML.as_uri()+'#afgerond');await ns['settle'](p)
   await p.locator('.v3Row[data-chapter=islands]').click();await p.locator('.v3Switch button[data-relief=false]').click();await ns['settle'](p)
   box=await p.evaluate('''()=>{const n=document.querySelector('.v3Map [data-id="area-a"]'),s=document.querySelector('.v3Switch'),r=n.getBoundingClientRect();document.body.append(s);s.style.cssText='position:fixed;z-index:9999;bottom:auto;right:auto;left:'+(r.left+r.width/2-80)+'px;top:'+(r.top+r.height/2-20)+'px';let b=s.getBoundingClientRect();return b.toJSON()}''')
   await p.screenshot(path=str(OUT/f'paint-negative-control-{engine}.png'))
   await p.evaluate("document.querySelector('.v3Switch').style.visibility='hidden'");ap=await p.screenshot(path=str(OUT/f'paint-a-{engine}.png'));a=ns['rgb_png'](ap)
   await p.evaluate("document.querySelectorAll('.v3Map .v3Hit').forEach(e=>e.style.visibility='hidden')");zp=await p.screenshot(path=str(OUT/f'paint-z-{engine}.png'));z=ns['rgb_png'](zp)
   x0,y0=max(0,int(box['x'])),max(0,int(box['y']));x1,y1=min(820,int(box['right'])),min(1180,int(box['bottom']))
   pixels=sum(max(abs(a[y][x*3+k]-z[y][x*3+k]) for k in range(3))>10 for y in range(y0,y1) for x in range(x0,x1));print(engine,box,'pixels',pixels,'probe',a[960][620*3:620*3+3],z[960][620*3:620*3+3]);assert pixels>0
   result[engine]={'injected':'style switch moved over Sicily in disposable DOM only','selectedPaintPixelsDetected':pixels,'rect':box};await b.close()
 result['sourceUnchanged']=ns['BEFORE']=={str(p):ns['digest'](p) for p in ns['FILES']};assert result['sourceUnchanged'];(OUT/'paint-negative-control.json').write_text(json.dumps(result,indent=2));print(result)
asyncio.run(main())
