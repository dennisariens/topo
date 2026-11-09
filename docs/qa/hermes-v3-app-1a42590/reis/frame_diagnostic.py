import asyncio,json,pathlib
from playwright.async_api import async_playwright
OUT=pathlib.Path(__file__).parent;ROOT=pathlib.Path('/Users/dennisariens/projects/topo-v3-app-1a42590');HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
ns={'__file__':str(ROOT/'scripts/qa-v3-reis.py')};exec((ROOT/'scripts/qa-v3-reis.py').read_text().replace('asyncio.run(main())',''),ns)
async def main():
 results={}
 async with async_playwright() as pw:
  for engine in ['chromium','webkit']:
   b=await getattr(pw,engine).launch();ctx=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);p=await ctx.new_page();await p.goto(HTML.as_uri()+'#afgerond');await p.wait_for_timeout(1800)
   results[engine]={}
   for scroll in ['top','center']:
    if scroll=='center':await p.evaluate("document.querySelector('.v3Map').scrollIntoView({block:'center',behavior:'instant'})")
    await p.wait_for_timeout(500)
    results[engine][scroll]=await p.evaluate('''()=>{let s=document.querySelector('.v3Map'),m=s.getScreenCTM(),p=s.createSVGPoint(),n=s.querySelector('[data-id="area-a"]'),b=n.getBBox();p.x=b.x+b.width/2;p.y=b.y+b.height/2;let q=p.matrixTransform(m);return {scrollY,visual:visualViewport&&{offsetTop:visualViewport.offsetTop,pageTop:visualViewport.pageTop,scale:visualViewport.scale},rect:s.getBoundingClientRect().toJSON(),ctm:[m.a,m.b,m.c,m.d,m.e,m.f],islandRect:n.getBoundingClientRect().toJSON(),projectedCenter:{x:q.x,y:q.y},centerFill:n.isPointInFill(p)}}''')
    results[engine][scroll]['maintainedSamples']=await p.evaluate(ns['MAP_SAMPLE_JS'])
    await p.screenshot(path=str(OUT/f'frame-diagnostic-{engine}-{scroll}.png'))
   await b.close()
 (OUT/'frame-diagnostic.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
asyncio.run(main())
