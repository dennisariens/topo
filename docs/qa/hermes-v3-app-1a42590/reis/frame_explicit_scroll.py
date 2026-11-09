import pathlib,asyncio,json
from playwright.async_api import async_playwright
ROOT=pathlib.Path('/Users/dennisariens/projects/topo-v3-app-1a42590');OUT=pathlib.Path(__file__).parent;HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
src=(ROOT/'scripts/qa-v3-reis.py').read_text().replace('asyncio.run(main())','')
# Independent frame diagnosis only: WebKit centers SVG scrollIntoView at an offscreen location.
# Keep original feature picking and >=80% contrast checks; center by measured HTML viewport coordinates.
src=src.replace("document.querySelector('.v3Map')?.scrollIntoView({block:'center',behavior:'instant'})","(()=>{const r=document.querySelector('.v3Map').getBoundingClientRect();scrollTo({top:scrollY+r.top-(innerHeight-r.height)/2,behavior:'instant'})})()")
ns={'__file__':str(ROOT/'scripts/qa-v3-reis.py')};exec(src,ns)
async def main():
 out={}
 async with async_playwright() as pw:
  for engine in ['chromium','webkit']:
   b=await getattr(pw,engine).launch()
   for w,h in [(390,844),(320,640),(820,1180)]:
    for st in ['nieuw','bezig','afgerond','alles']:
     ctx=await b.new_context(viewport={'width':w,'height':h},is_mobile=w<768,has_touch=True);p=await ctx.new_page();await p.goto(HTML.as_uri()+'#'+st);await ns['settle'](p)
     f=await ns['sample_frame'](p);out[f'{engine}/{w}x{h}/{st}']=f
     (OUT/'frame-explicit-scroll.json').write_text(json.dumps(out,indent=2,ensure_ascii=False));await ctx.close()
   await b.close()
 failures={k:v for k,v in out.items() if set(ns['MUST_SEE'])-set(v['visible']) or sum(n.startswith('zee') for n in v['visible'])<3}
 print(json.dumps({'cases':len(out),'failures':failures},ensure_ascii=False));(OUT/'frame-explicit-scroll-summary.json').write_text(json.dumps({'cases':len(out),'failures':failures},ensure_ascii=False,indent=2))
asyncio.run(main())
