import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
D=pathlib.Path(__file__).parent;H=pathlib.Path('/Users/dennisariens/projects/topo-v3-app-1a42590/output/html/TOPO-V3-Reis-Preview.html')
async def main():
 async with async_playwright() as p:
  b=await getattr(p,sys.argv[1]).launch();r=[]
  for method in ['click','Enter']:
   c=await b.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce');g=await c.new_page();await g.goto(H.as_uri()+'#nieuw');await g.wait_for_timeout(1200)
   async def click(s):await g.locator(s).filter(visible=True).first.click();await g.wait_for_timeout(200)
   await click('.v3Actions .primary')
   for _ in range(6):await click('#next')
   await click('#finishScreen .primary')
   for _ in range(6):
    id=await g.evaluate('state.current.id');await g.locator('#map [data-id="'+id+'"][tabindex="0"]').first.press('Enter');await g.wait_for_timeout(150);await click('#next')
   await click('#finishScreen .primary');await g.locator('#answer').fill(await g.evaluate('state.current.name'));await click('#check');await click('#next')
   await g.evaluate("""() => {window.__events=[]; for(const k of ['keydown','keyup','click','close'])document.addEventListener(k,e=>__events.push({type:k,key:e.key,target:e.target.id||e.target.textContent.slice(0,60)}),true)}""")
   await g.locator('#answer').fill(await g.evaluate('state.current.name'))
   if method=='click':await click('#check')
   else:await g.locator('#answer').press('Enter')
   await g.wait_for_timeout(700);await g.screenshot(path=str(D/(sys.argv[1]+'-pizza-'+method+'.png')))
   r.append({'method':method,**await g.evaluate("""({slices:state.slices,pizzas:state.pizzas,dialogs:[...document.querySelectorAll('dialog[open]')].map(n=>n.id),phase:document.querySelector('#pizzaCelebration').dataset.phase,events:__events,message:message.textContent})""".replace('message:message.textContent','message:document.querySelector(\'#message\').textContent'))});await c.close()
  await b.close();(D/(sys.argv[1]+'-pizza-probe.json')).write_text(json.dumps(r,indent=2));print(r)
asyncio.run(main())
