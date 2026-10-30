import assert from 'node:assert/strict';import{writeFileSync,mkdirSync}from'node:fs';
const{chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),out=new URL(process.env.QA_OUTPUT||'../docs/visual/map-picker-58/',import.meta.url);mkdirSync(out,{recursive:true});
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),records=[],errors=[],external=[];
try{for(const mode of['point','exam','gold'])for(const random of[0,.99999])for(const correct of[true,false]){
 const c=await browser.newContext({viewport:{width:1180,height:820},offline:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});p.on('dialog',d=>d.accept());await p.goto(new URL('output/html/TOPO-Italie-Computer.html',root).href);
 if(mode==='gold'){
  await p.evaluate(()=>{mode('route');state.route=TopoRoute.fresh();for(const ch of ROUTE_CHAPTERS)TopoRoute.record(state.route,ch.id).stage=3;startRouteLesson('city2','gold')});
  for(let n=0;n<30;n++){
   if(await p.evaluate(()=>state.current?.id==='city-9'&&state.questionMode==='point'))break;
   if(await p.evaluate(()=>roundPaused)){await p.locator('#finishScreen .primary').click();continue;}
   if(await p.evaluate(()=>state.questionMode==='write')){await p.fill('#answer',await p.evaluate(()=>state.current.name));await p.locator('#check').click();}
   else await p.evaluate(()=>elements[state.current.id].dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})));
   await p.locator('#next:visible,#routeDockNext:visible').first().press('Enter');
  }
  assert.equal(await p.evaluate(()=>state.current.id),'city-9');assert.equal(await p.evaluate(()=>state.questionMode),'point');
 }else await p.evaluate(m=>{mode(m);state.current=byId['city-9'];state.questionMode='point';state.answered=false;clearActive()},mode);
 await p.evaluate(r=>mapChoiceRandom=()=>r,random);
 // Keyboard opens the same shared chooser and retains its invoker on cancellation.
 await p.locator('#pointLayer .microHit').last().focus();const saved=await p.evaluate(()=>JSON.stringify({route:state.route,good:state.good,answered:state.answered}));await p.locator('#pointLayer .microHit').last().press('Enter');assert(await p.locator('.pickerCancel').evaluate(n=>n===document.activeElement));const initialOrder=await p.locator('[data-map-choice]').evaluateAll(bs=>bs.map(b=>b.dataset.mapChoice));await p.setViewportSize({width:390,height:844});await p.waitForTimeout(100);assert.deepEqual(await p.locator('[data-map-choice]').evaluateAll(bs=>bs.map(b=>b.dataset.mapChoice)),initialOrder);assert(await p.locator('.pickerCancel').evaluate(n=>n===document.activeElement));await p.setViewportSize({width:1180,height:820});await p.waitForTimeout(100);await p.keyboard.press('Escape');await p.waitForTimeout(30);assert.equal(await p.evaluate(()=>JSON.stringify({route:state.route,good:state.good,answered:state.answered})),saved);assert(await p.locator('#pointLayer .microHit').last().evaluate(n=>n===document.activeElement));
 await p.locator('#pointLayer .microHit').last().press('Enter');const buttons=p.locator('[data-map-choice]'),order=await buttons.evaluateAll(bs=>bs.map(b=>b.dataset.mapChoice));assert.deepEqual(order,random===0?['area-o','city-9']:['city-9','area-o']);assert(!/Rome|Vaticaan/.test(await p.locator('#mapPicker').textContent()));
 const before=await p.evaluate(()=>state.good),selected=correct?'city-9':'area-o';await p.locator('[data-map-choice="'+selected+'"]').press('Enter');assert.equal(await p.locator('#message').evaluate(n=>n.classList.contains('good')),correct);const after=await p.evaluate(()=>state.good);assert(after>=before&&after<=before+(correct?1:0));assert(await p.evaluate(()=>state.answered));
 await p.evaluate(()=>chooseMapPlace(byId['city-9']));assert.equal(await p.evaluate(()=>state.good),after);
 if(mode==='gold'){const active=await p.evaluate(()=>JSON.stringify(state.route.active));await p.reload();assert.equal(await p.evaluate(()=>JSON.stringify(state.route.active)),active);assert.equal(await p.evaluate(()=>state.good),after);assert(await p.evaluate(()=>state.answered));}
 records.push({mode,random,order,correct,goodBefore:before,goodAfter:after,cancelPreservesSession:true,resizePreservesOrderAndFocus:true,focusRestored:true,noDuplicateCredit:true,reload:mode==='gold'});await c.close();
 }assert.deepEqual(errors,[]);assert.deepEqual(external,[]);writeFileSync(new URL('session-results.json',out),JSON.stringify({browser:await browser.version(),transport:'file:// offline:true',records,errors,external},null,2)+'\n');console.log('PASS '+records.length+' Point/Test/real Gold sessions, both orders, correct/wrong, cancel/focus/reload/duplicate guards');
}finally{await browser.close()}
