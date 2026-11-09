import asyncio,json,pathlib,sys,ast,hashlib,traceback
from playwright.async_api import async_playwright
ROOT=pathlib.Path('/Users/dennisariens/projects/topo-v3-app-1a42590'); OUT=pathlib.Path(__file__).parent; HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
def constants(file,names):
 tree=ast.parse((ROOT/file).read_text()); return {n.targets[0].id:ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id in names}
STATE=constants('scripts/qa-v3-les.py',['STATE_JS'])['STATE_JS']
SNAP="""() => ({route:state.route,good:state.good,slices:state.slices,pizzas:state.pizzas,trips:state.trips,daily:state.daily,storage:[...TOPO_V3_PREVIEW.storage]})"""
DRAFT="""() => ({id:state.current?.id,mode:state.questionMode,kind:state.route.active?.kind,value:answer.value,start:answer.selectionStart,end:answer.selectionEnd,direction:answer.selectionDirection,focus:document.activeElement===answer})"""
async def run(engine):
 out=OUT/('independent-'+engine);out.mkdir(exist_ok=True); ledger={'engine':engine,'sha256':hashlib.sha256(HTML.read_bytes()).hexdigest(),'baseline':'#nieuw: 0 rewards, no completion; all later gameplay earned by UI','events':[],'checks':{},'errors':[]}
 async with async_playwright() as pw:
  browser=await getattr(pw,engine).launch();ledger['version']=browser.version
  ctx=await browser.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce'); pg=await ctx.new_page();pg.on('pageerror',lambda e:ledger['errors'].append(str(e)))
  async def settle(): await pg.wait_for_timeout(260)
  async def click(s): await pg.locator(s).filter(visible=True).first.click();await settle()
  async def st():return await pg.evaluate(STATE)
  async def snap():return await pg.evaluate(SNAP)
  async def shot(n):await pg.screenshot(path=str(out/(n+'.png')))
  async def dialogs():
   for i in range(12):
    ds=pg.locator('dialog[open]');
    if not await ds.count():return
    d=ds.last; did=await d.get_attribute('id');buttons=d.locator('button').filter(visible=True);labels=await buttons.all_text_contents();ledger['events'].append({'dialog':did,'state':await st(),'buttons':labels});await shot('reward-'+str(len(ledger['events'])))
    preferred=buttons.filter(has_text=__import__('re').compile('Verder|Start de Vespa-rit|Overslaan|Sluiten'))
    await (preferred.first if await preferred.count() else buttons.last).click();await pg.wait_for_timeout(650)
   raise Exception('dialog loop')
  async def book(tag):
   await pg.wait_for_timeout(450);assert await pg.evaluate('TopoBook.element.open');await shot(tag+'-book');before=await snap();seen=set();counts={'stamps':0,'gold':0,'postcards':0};pages=[]
   counts['initialPages']=await pg.evaluate("[...TopoBook.element.querySelectorAll('section.bookPage')].map(s=>s.getAttribute('aria-label'))")
   # V2 remembers its last spread across opens: rewind through actual controls before enumerating.
   for _ in range(40):
    prev=pg.locator('dialog[open] button').get_by_text('Vorige',exact=True)
    if not await prev.count() or await prev.first.is_disabled():break
    await prev.first.click();await pg.wait_for_timeout(130)
   for i in range(40):
    rows=await pg.evaluate("""() => [...TopoBook.element.querySelectorAll('section.bookPage')].map(s=>({key:s.getAttribute('aria-label')+'|'+s.className,stamps:s.querySelectorAll('.stampInspect').length,gold:s.querySelectorAll('.chapterSeal').length,postcards:s.querySelectorAll('.earnedPostcard').length}))""")
    for r in rows:
     if r['key'] not in seen:
      seen.add(r['key']);pages.append(r)
      for k in ('stamps','gold','postcards'):counts[k]+=r[k]
    nx=pg.locator('dialog[open] button').get_by_text('Volgende',exact=True)
    if not await nx.count() or await nx.first.is_disabled():break
    await nx.first.click();await pg.wait_for_timeout(130)
   counts['pages']=pages;counts['readOnly']=before==await snap();await pg.keyboard.press('Escape');await settle();counts['closed']=not await pg.evaluate('TopoBook.element.open');counts['focusAfter']=await pg.evaluate('({id:document.activeElement.id,text:document.activeElement.textContent,connected:document.activeElement.isConnected})');return counts
  async def rewards(tag,from_lesson=False):
   before=await snap();await pg.evaluate("""() => { window.__storageWrites=[]; if(!window.__storageObserved){const original=localStorage.setItem.bind(localStorage);localStorage.setItem=(k,v)=>{window.__storageWrites.push({key:k,value:v});return original(k,v)};window.__storageObserved=true;} }""");await click(('.v3LesSideWrap' if from_lesson else '.v3Reis')+' [data-nav=rewards]');await shot(tag+'-rewards-focus')
   info=await pg.evaluate("""() => ({focus:document.activeElement.id,view:document.querySelector('.v3Reis').dataset.view,tiles:[...document.querySelectorAll('.v3Tile b')].map(n=>n.textContent),ride:document.querySelector('.v3Ride>b').textContent,cycle:document.querySelectorAll('.v3RideSteps .on').length,slices:state.slices,pizzas:state.pizzas,trips:state.trips})""")
   info['viewReadOnly']=before==await snap();info['keyboardTrail']=[]
   # Actual keyboard navigation from heading; no focus() to hide an unreachable control.
   for i in range(30):
    await pg.keyboard.press('Alt+Tab' if engine=='webkit' else 'Tab')
    f=await pg.evaluate("({text:document.activeElement.textContent.trim(),cls:document.activeElement.className})");info['keyboardTrail'].append(f)
    if f['text']=='Open Reisboekje':break
   info['keyboardReachesBook']=f['text']=='Open Reisboekje'
   if info['keyboardReachesBook']:await shot(tag+'-book-button-focus');await pg.keyboard.press('Enter')
   else:await click('.v3Rewards .v3Book .primary')
   info['sameV2Book']=await pg.evaluate("TopoBook.element === document.querySelector('dialog[open]')")
   info['book']=await book(tag)
   values=[int(v.split()[0]) for v in info['tiles']];b=info['book'];info['countsMatch']=values==[info['slices'],b['stamps'],b['gold'],b['postcards']] and int(info['ride'])==info['trips'] and info['cycle']==info['pizzas']%3
   info['storageWrites']=await pg.evaluate('window.__storageWrites');info['allReadOnly']=before==await snap();await click('.v3Reis [data-nav=reis]');info['returnReis']=await pg.evaluate("document.querySelector('.v3Reis').dataset.view==='reis'");return info
  async def tap(id):
   loc=pg.locator('#map [data-id="'+id+'"]');q=await loc.first.bounding_box();assert q
   x=q['x']+q['width']/2;y=q['y']+q['height']/2
   await pg.mouse.click(x,y);await settle()
   if not (await st())['answered']:
    choice=pg.locator('[data-map-choice="'+id+'"]').filter(visible=True)
    if await choice.count():await choice.first.click();await settle()
   return {'requested':[x,y],'answered':(await st())['answered']}
  async def continuity():
   await pg.locator('#answer').fill('Rome concept');await pg.locator('#answer').press('End');await pg.keyboard.down('Shift');await pg.keyboard.press('ArrowLeft');await pg.keyboard.press('ArrowLeft');await pg.keyboard.press('ArrowLeft');await pg.keyboard.up('Shift');before=await pg.evaluate(DRAFT)
   await click('.v3LesSideWrap [data-nav=reis], .v3LesBack');await click('.v3Actions .primary');after=await pg.evaluate(DRAFT)
   ledger['checks']['reisResume']={'before':before,'after':after,'equal':{k:v for k,v in before.items() if k!='focus'}=={k:v for k,v in after.items() if k!='focus'}}
   b=await snap();ledger['checks']['lessonRewardsContinuity']=await rewards('lesson-draft',True);await click('.v3Actions .primary');end=await pg.evaluate(DRAFT)
   ledger['checks']['rewardsResume']={'before':before,'after':end,'equal':{k:v for k,v in before.items() if k!='focus'}=={k:v for k,v in end.items() if k!='focus'},'progressSame':b==await snap()};await shot('resumed-backward-selection')
  async def play(kind,wrong=True,continuity_check=False):
   wrongdone=not wrong;steps=0
   while True:
    s=await st()
    if s['done']:return
    if s['paused']:await shot(kind+'-pause');await click('#finishScreen .button.primary');continue
    steps+=1;assert steps<50
    before=await snap()
    if kind=='discover':
     if steps==1:await shot('beat3-discover')
     await click('#next');continue
    if s['mode']=='write' and continuity_check:
     continuity_check=False;await continuity()
    incorrect=not wrongdone;wrongdone=True
    if s['mode']=='point':
     if incorrect:
      other=await pg.evaluate("[...document.querySelectorAll('#map [data-id][tabindex=\"0\"]')].map(n=>n.dataset.id).find(i=>i!==state.current.id&&i.startsWith('city'))")
      await pg.locator('#map [data-id="'+other+'"][tabindex="0"]').first.press('Enter');await settle();via={'via':'keyboard actual map target','id':other}
     else:via={'via':'pointer','id':s['id'],**await tap(s['id'])}
    else:
     await pg.locator('#answer').fill('Parijs' if incorrect else s['name']);await pg.locator('#answer').press('Enter');await settle();via={'via':'input Enter'}
    a=await st();assert a['answered'];assert bool(a['last']['ok']) != incorrect
    ledger['events'].append({'kind':kind,'wrong':incorrect,'via':via,'before':before,'after':await snap(),'feedback':a});
    if steps<=2:await shot(kind+('-wrong-feedback' if incorrect else '-correct-feedback'))
    await dialogs();await click('#next')
  try:
   await pg.goto(HTML.as_uri()+'#nieuw');await pg.wait_for_timeout(1400);ledger['initial']=await snap()
   await click('.v3Actions .primary');await play('discover');await shot('discover-finish');await click('#finishScreen .button.primary');await play('point');await shot('point-finish');await click('#finishScreen .button.primary');await play('write',continuity_check=True);await dialogs();await shot('earned-stamp-finish');ledger['earned']=await snap()
   await click('#finishScreen .earnedMoment .button.primary');ledger['checks']['earnedBook']=await book('finish-earned');await click('#finishScreen > button.primary');ledger['checks']['earnedRewards']=await rewards('earned')
   # Actual replay of completed pointing; canonical persistent tokens must prevent additional pizza currency.
   await click('.v3Row[data-chapter=city1]');await click('.v3Again button:nth-child(2)');before=await snap();await play('point',wrong=False);after=await snap();ledger['checks']['replayNoCurrency']={'before':[before[k] for k in ('slices','pizzas','trips')],'after':[after[k] for k in ('slices','pizzas','trips')],'ok':all(before[k]==after[k] for k in ('slices','pizzas','trips'))}
   await click('.v3LesSideWrap [data-nav=reis], .v3LesBack');ledger['checks']['reopenAfterReplay']=await rewards('replayed');ledger['beforeReload']=await snap();await pg.reload();await pg.wait_for_timeout(1300);ledger['afterReload']=await snap();ledger['checks']['reloadSemantics']='#nieuw deliberately reloads demo baseline; persistence of earned state cannot be asserted on this preview';ledger['checks']['reloadNoMint']=all(ledger['afterReload'][k]==0 for k in ('slices','pizzas','trips'))
   ledger['demos']={}
   for demo in ['nieuw','bezig','afgerond','alles']:
    await pg.goto(HTML.as_uri()+'#'+demo);await pg.wait_for_timeout(1500);ledger['demos'][demo]=await rewards('demo-'+demo)
  except Exception as e:
   ledger['failure']=traceback.format_exc();await shot('failure');print(ledger['failure'],flush=True)
  finally:
   (out/'ledger.json').write_text(json.dumps(ledger,indent=2,ensure_ascii=False));await browser.close()
 print(engine, 'complete',list(ledger['checks']), 'failure' in ledger,flush=True)
asyncio.run(run(sys.argv[1]))
