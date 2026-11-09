import asyncio,json,hashlib,pathlib
from playwright.async_api import async_playwright
ROOT=pathlib.Path('/Users/dennisariens/projects/topo-v3-ge01-6934799');OUT=pathlib.Path(__file__).parent/'parent-repro';OUT.mkdir(exist_ok=True);H=ROOT/'output/html/TOPO-V3-Reis-Preview.html';EXPECTED='71c2f49bf65ae04e9a1908bd7661cf8889562c0af4b3f582fd9cacfdfc4131d4';assert hashlib.sha256(H.read_bytes()).hexdigest()==EXPECTED
LEDGER="""(() => {window.__events=[];for(const k of ['keydown','keyup','click','close'])document.addEventListener(k,e=>{const r={type:k,key:e.key,repeat:e.repeat,detail:e.detail,trusted:e.isTrusted,target:e.target.id||e.target.textContent?.trim().slice(0,45)};__events.push(r);setTimeout(()=>r.prevented=e.defaultPrevented)},true)})()"""
SNAP="""() => ({good:state.good,pizzas:state.pizzas,slices:state.slices,trips:state.trips,current:state.current?.id,mode:state.questionMode,dialogs:[...document.querySelectorAll('dialog[open]')].map(n=>n.id),focus:{id:document.activeElement?.id,text:document.activeElement?.textContent.trim().slice(0,45),inPizza:!!document.activeElement?.closest('#pizzaCelebration')},events:__events})"""
async def case(browser,engine,method,reduce,pointspace=False,hold=False):
 key=f'{engine}-'+('point-Space'if pointspace else'held-Enter'if hold else method)+('-reduce'if reduce else'-motion');c=await browser.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce'if reduce else'no-preference',offline=True);await c.add_init_script(LEDGER);p=await c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)));http=[];p.on('request',lambda r:http.append(r.url)if r.url.startswith(('http:','https:'))else None)
 async def click(s):await p.locator(s).filter(visible=True).first.click();await p.wait_for_timeout(130)
 async def target(k):
  id=await p.evaluate('state.current.id');await p.locator('#map [data-id="'+id+'"][tabindex="0"]').first.press(k);await p.wait_for_timeout(150)
 await p.goto(H.as_uri()+('#bezig'if pointspace else'#nieuw'));await p.wait_for_function("document.querySelector('.v3Actions .primary')?.getBoundingClientRect().width>0");await p.wait_for_timeout(350);initial=await p.evaluate(SNAP);await click('.v3Actions .primary')
 if pointspace:
  await target('Enter');await click('#next')
 else:
  for _ in range(6):await click('#next')
  await click('#finishScreen .primary')
  for _ in range(6):await target('Enter');await click('#next')
  await click('#finishScreen .primary');await p.locator('#answer').fill(await p.evaluate('state.current.name'));await click('#check');await click('#next')
 before=await p.evaluate(SNAP);await p.evaluate('__events.length=0')
 if pointspace:await target('Space')
 else:
  await p.locator('#answer').fill(await p.evaluate('state.current.name'))
  if hold:
   await p.keyboard.down('Enter');await p.wait_for_timeout(250);await p.keyboard.down('Enter');await p.wait_for_timeout(250)
  elif method=='Enter':await p.locator('#answer').press('Enter')
  else:await click('#check')
 await p.wait_for_timeout(700);opened=await p.evaluate(SNAP);assert opened['dialogs']==['pizzaCelebration'],(key,'pizza did not remain open',opened);assert opened['pizzas']==before['pizzas']+1 and opened['slices']==0 and opened['trips']==before['trips'],(key,'wrong reward');assert opened['focus']['inPizza'],(key,'focus outside reward');await p.screenshot(path=str(OUT/(key+'-open.png')))
 if hold:await p.keyboard.up('Enter');await p.wait_for_timeout(100);assert(await p.evaluate(SNAP))['dialogs']==['pizzaCelebration']
 follow='Space'if method=='click'or pointspace else'Enter';await p.keyboard.press(follow);await p.wait_for_timeout(300);after=await p.evaluate(SNAP);assert not after['dialogs'],(key,'new intentional key blocked',after);assert[after[k]for k in['good','pizzas','slices','trips']]==[opened[k]for k in['good','pizzas','slices','trips']],(key,'duplicate reward');assert not errors and not http,(key,errors,http);await c.close();return{'case':key,'engine':engine,'motion':'reduce'if reduce else'normal','trigger':'map Space'if pointspace else'held/repeated Enter'if hold else method,'baseline':'#bezig fixture imports1pizza6slices; only next2point answers earned'if pointspace else'#nieuw startszero;8correct answers genuinely earned via UI','initial':initial,'before':before,'opened':opened,'intentionalNextKey':follow,'after':after,'errors':errors,'outbound':http,'pass':True}
async def main():
 data={'target':'6934799454441582b953ed455d54ca3b0e2db722','sha256':EXPECTED,'scope':'Own original reproduction plus fresh-key, Space and held-key controls; actual UI, no grade/state injection','runs':[]}
 async with async_playwright()as pw:
  for engine in['chromium','webkit']:
   b=await getattr(pw,engine).launch()
   for reduce in[True,False]:
    for method in['Enter','click']:
     r=await case(b,engine,method,reduce);data['runs'].append(r);(OUT/'results.json').write_text(json.dumps(data,indent=2));print(r['case'],'PASS',flush=True)
    r=await case(b,engine,'Space',reduce,pointspace=True);data['runs'].append(r);(OUT/'results.json').write_text(json.dumps(data,indent=2));print(r['case'],'PASS',flush=True)
   r=await case(b,engine,'Enter',True,hold=True);data['runs'].append(r);(OUT/'results.json').write_text(json.dumps(data,indent=2));print(r['case'],'PASS',flush=True);await b.close()
 assert len(data['runs'])==14 and len({r['case']for r in data['runs']})==14;data['summary']={'cases':len(data['runs']),'passed':sum(r['pass']for r in data['runs']),'noCurrencyDuplication':True,'legitimateNextEnterAndSpaceWork':True};(OUT/'results.json').write_text(json.dumps(data,indent=2));print(data['summary'])
asyncio.run(main())
