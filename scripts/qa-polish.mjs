import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {JSDOM,VirtualConsole} from 'jsdom';
const option=name=>process.argv.find(a=>a.startsWith('--'+name+'='))?.split('=').slice(1).join('=');
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||option('playwright-module')||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||option('chrome')||undefined});
const url=process.env.TOPO_URL||'http://127.0.0.1:8014/',output=process.env.QA_OUTPUT||'docs/visual/release-1-1';mkdirSync(output,{recursive:true});
const baseline='9df498919cd6fa1a07aadd6a15e973b496a8b0fd';
try{
 const source=readFileSync(new URL('../index.html',import.meta.url),'utf8'),oldSource=execFileSync('git',['show',baseline+':index.html'],{encoding:'utf8'});
 for(const pattern of [/const ITEMS=(\[.*?\]);/,/const CONTEXT_LAND=(\{[^;]+\});/,/const italy="([^"]+)";/,/const NAME_ANCHORS=(\{[\s\S]*?\});/])assert.equal(source.match(pattern)[1],oldSource.match(pattern)[1],'canonical map data equals integration baseline');
 // Create an interrupted, answered save using the reviewed Release 1 code itself.
 const baseErrors=[],baseVC=new VirtualConsole();baseVC.on('jsdomError',e=>baseErrors.push(e.message));
 const old=new JSDOM(oldSource,{url:'https://topo.test/',runScripts:'dangerously',virtualConsole:baseVC,beforeParse(w){w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=()=>{}}});
 old.window.eval("const r=TopoRoute.record(state.route,'city1');r.stage=3;r.goldAt=r.completedAt=123;r.nextReviewAt=1;TopoRoute.record(state.route,'city2').stage=1;state.route=TopoRoute.restore(state.route,ROUTE_CHAPTERS);state.good=2407;state.pizzas=300;state.trips=100;state.slices=7;startRouteLesson('city2','point');routeGrade(true)");
 const saved=old.window.localStorage.getItem('topo-italie-v3');const expected=JSON.parse(old.window.eval('JSON.stringify(progressSnapshot())'));old.window.close();assert.deepEqual(baseErrors,[]);
 const errors=[],network=[],viewports=[];
 function listen(page){page.on('pageerror',e=>errors.push(e.message));page.on('request',request=>{if(!request.url().startsWith(url)&&!request.url().startsWith('data:')&&!request.url().startsWith('file:'))network.push(request.url())});page.on('dialog',dialog=>dialog.accept())}
 function normalized(value){value.route.rewardTokens.sort();return value}
 async function mapCheck(page){
  const result=await page.evaluate(()=>{
   const map=document.querySelector('#map'),b=map.getBoundingClientRect(),matrix=map.getScreenCTM();
   const points=ITEMS.filter(i=>i.kind==='city'||['area-e','area-f','area-n','area-o'].includes(i.id));
   return {ratio:b.width/b.height,count:ITEMS.length,maxDrift:Math.max(...points.map(i=>{const p=new DOMPoint(i.px,i.py).matrixTransform(matrix);return Math.hypot(p.x-(b.x+i.px*b.width/890),p.y-(b.y+i.py*b.height/1235))})),width:b.width};
  });
  assert.equal(result.count,45);assert(Math.abs(result.ratio-890/1235)<.002);assert(result.maxDrift<.1,'markers stay at projected positions');return result;
 }
 for(const [name,width,height] of [['desktop',1440,1000],['ipad-portrait',820,1180],['ipad-landscape',1180,820],['phone',390,844],['small-phone',320,568]]){
  const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<1200,reducedMotion:'reduce'}),page=await ctx.newPage();listen(page);await page.goto(url);
  assert.equal(await page.locator('#routeIntro').getAttribute('data-event'),'ENTRY.FIRST');
  await page.locator('.routeScene img').evaluate(async img=>{await img.decode();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))});
  assert.equal(await page.locator('.routeScene img').evaluate(img=>img.naturalWidth),1680,'original panorama decodes before visual inspection');
  assert.equal(await page.locator('.routeCard').count(),11);assert.equal(await page.locator('#futureStops').getAttribute('open'),null);
  assert.equal(await page.locator('.routeCard[aria-current="step"]').getAttribute('data-chapter'),'city1');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no page horizontal overflow');
  const nav=await page.locator('body>nav .tab').evaluateAll(nodes=>nodes.map(n=>({name:n.textContent,rect:{x:n.getBoundingClientRect().x,right:n.getBoundingClientRect().right},width:n.clientWidth,scroll:n.scrollWidth})));
  for(const n of nav){assert(n.rect.x>=0&&n.rect.right<=width+1,'all five modes fit without clipping');assert(n.scroll<=n.width+1,'mode label does not overflow')}
  await page.screenshot({path:output+'/'+name+'-route.png',fullPage:true});
  await page.locator('#futureStops>summary').focus();await page.keyboard.press('Enter');
  const icons=await page.locator('.chapterIcon').evaluateAll(nodes=>nodes.map(svg=>({chapter:svg.dataset.chapter,reference:svg.querySelector('use').getAttribute('href'),box:svg.getBBox().width,screenWidth:svg.getBoundingClientRect().width,exists:!!document.querySelector(svg.querySelector('use').getAttribute('href'))})));
  assert.equal(icons.length,11);assert(icons.every(i=>i.exists&&i.reference!=='#topo-point'&&i.box>0&&i.screenWidth>=20),'all eleven chapter symbols actually render');
  assert.equal(icons.find(i=>i.chapter==='islands').reference,'#topo-island');
  if(name==='desktop'||name==='phone')await page.locator('#futureStops').screenshot({path:output+'/'+name+'-future-icons.png'});
  await page.locator('#futureStops>summary').press('Enter');
  for(const mode of ['learn','point','write','exam','route']){await page.locator('[data-mode="'+mode+'"]').click();assert.equal(await page.evaluate(()=>state.mode),mode);assert.equal(await page.locator('[data-mode="'+mode+'"]').getAttribute('aria-pressed'),'true')}
  await page.locator('#routeContinue').click();
  const map=await mapCheck(page);await page.screenshot({path:output+'/'+name+'-lesson.png',fullPage:true});
  await page.locator('#mapAbout>summary').focus();await page.keyboard.press('Enter');assert(await page.locator('#mapAbout p').isVisible());
  await page.locator('#mapAbout>summary').press('Enter');assert.equal(await page.locator('#mapAbout').getAttribute('open'),null);await mapCheck(page);
  // Load the old interrupted save in a separate context; no learner data is overwritten.
  const oldCtx=await browser.newContext({viewport:{width,height},hasTouch:width<1200,reducedMotion:'reduce'});
  await oldCtx.addInitScript(value=>{if(!localStorage.getItem('topo-italie-v3'))localStorage.setItem('topo-italie-v3',value)},saved);
  const restored=await oldCtx.newPage();listen(restored);await restored.goto(url);
  assert.deepEqual(normalized(await restored.evaluate(()=>progressSnapshot())),normalized(structuredClone(expected)),'earned progress and interrupted answer survive from PR #3');
  assert.equal(await restored.locator('#routeIntro').getAttribute('data-event'),'ENTRY.RESUME');
  assert.equal(await restored.locator('.routeCard[aria-current="step"]').getAttribute('data-chapter'),'city2');
  await restored.locator('#routeContinue').click();await mapCheck(restored);
  const task=await restored.evaluate(()=>state.current.id);await restored.locator(`[data-id="${task}"][tabindex="0"]`).first().press('Enter');
  assert.deepEqual(normalized(await restored.evaluate(()=>progressSnapshot())),normalized(structuredClone(expected)),'answered resubmit does not change rewards or daily credit');
  await restored.reload();await restored.locator('#routeContinue').click();assert.deepEqual(normalized(await restored.evaluate(()=>progressSnapshot())),normalized(structuredClone(expected)),'answered page reload preserves prior progress');
  await restored.locator('#routeBack').click();await restored.locator('#completedStops>summary').focus();await restored.keyboard.press('Enter');
  assert(await restored.locator('[data-chapter="city1"] .goldButton').isVisible());
  if(name==='desktop'){
   await restored.screenshot({path:output+'/desktop-returning.png',fullPage:true});
   await restored.locator('[data-chapter="city1"] .goldButton').click();
   assert.equal(await restored.locator('#routeLessonIntro').getAttribute('data-event'),'PROMPT.GOLD_OPEN');
   let answers=0;
   while(!await restored.evaluate(()=>state.route.active.done)){
    if(await restored.evaluate(()=>roundPaused)){assert.equal(await restored.locator('#finishScreen').getAttribute('data-event'),'ROUND.PAUSE');await restored.locator('#finishScreen .button').first().click();continue}
    const task=await restored.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));
    if(task.mode==='point')await restored.locator(`[data-id="${task.id}"][tabindex="0"]`).first().press('Enter');
    else{await restored.locator('#answer').fill(task.name);await restored.locator('#check').click()}
    assert.equal(await restored.evaluate(()=>state.route.active.lastAnswer?.ok),true);
    assert(!/pizza|Andiamo/.test(await restored.locator('#message').textContent()),'completed gold replay never claims a fresh reward');
    await restored.locator('#next').click();answers++;
   }
   assert.equal(answers,12);assert.equal(await restored.locator('#finishScreen').getAttribute('data-event'),'CHAPTER.GOLD_REPLAY');
   assert.deepEqual(await restored.evaluate(()=>[state.good,state.pizzas,state.slices,state.trips]),[expected.good,expected.pizzas,expected.slices,expected.trips]);
   await restored.screenshot({path:output+'/gold-replay.png',fullPage:true});
   await restored.locator('#finishScreen .button').last().click();await restored.locator('#completedStops>summary').click();await restored.locator('[data-chapter="city1"]').getByRole('button',{name:'Opfrissen',exact:true}).click();
   assert.equal(await restored.locator('#routeLessonIntro').getAttribute('data-event'),'PROMPT.DUE');
   await restored.screenshot({path:output+'/review-start.png',fullPage:true});
   await restored.locator('#routeBack').click();await restored.locator('#smartStart').click();
   for(let n=0;n<6;n++){
    const task=await restored.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));
    if(n<2){if(task.mode==='point')await restored.locator(`[data-id="${task.id}"][tabindex="0"]`).first().press('Enter');else{await restored.locator('#answer').fill(task.name);await restored.locator('#check').click()}}
    else await restored.locator('#next').click();
    await restored.locator('#next').click();
   }
   assert.equal(await restored.locator('#finishScreen').getAttribute('data-event'),'ROUND.RESULT_MIXED');
   assert.deepEqual((await restored.locator('.finishStats b').allTextContents()).slice(0,2),['2','4']);
   await restored.screenshot({path:output+'/mixed-round.png',fullPage:true});
   await restored.locator('#finishScreen .button').last().click();await restored.locator('[data-mode="point"]').click();
   const wrong=await restored.evaluate(()=>{const chosen=ITEMS.find(i=>i.kind==='city'&&i.id!==state.current.id);return {id:chosen.id,name:chosen.name,target:state.current.name}});
   await restored.locator(`[data-id="${wrong.id}"][tabindex="0"]`).first().press('Enter');
   assert.equal(await restored.locator('#message').textContent(),'Dat was '+wrong.name+'. Gezocht: '+wrong.target+'.');
   await restored.screenshot({path:output+'/wrong-point.png',fullPage:true});
  }
  viewports.push({name,width,height,navModes:nav.map(n=>n.name),renderedChapterIcons:icons.length,map,oldSave:'PASS'});
  await oldCtx.close();await ctx.close();
 }
 const allContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),allPage=await allContext.newPage();listen(allPage);await allPage.goto(url);
 await allPage.evaluate(()=>{for(const c of ROUTE_CHAPTERS)TopoRoute.record(state.route,c.id).stage=3;renderRouteHome()});
 await allPage.locator('#completedStops>summary').press('Enter');
 assert.equal(await allPage.locator('.chapterIcon').count(),11);assert(await allPage.locator('.chapterIcon').evaluateAll(nodes=>nodes.every(svg=>svg.getBBox().width>0)),'all unlocked icons render');
 await allPage.locator('[data-chapter="islands"] .routeStep').first().click();assert.equal(await allPage.locator('#routeLessonIntro').getAttribute('data-event'),'DISCOVER.ISLANDS');
 await allPage.screenshot({path:output+'/islands-discover.png',fullPage:true});await allContext.close();
 const fileContext=await browser.newContext({viewport:{width:1366,height:1000}}),filePage=await fileContext.newPage();listen(filePage);
 await filePage.goto(new URL('../output/html/topo-italie-interactief.html',import.meta.url).href);await filePage.locator('#routeContinue').click();assert.equal(await filePage.evaluate(()=>state.questionMode),'discover');await fileContext.close();
 for(const file of ['print.html','output/pdf/topo-italie-printboek.pdf'])assert(readFileSync(new URL('../'+file,import.meta.url)).equals(execFileSync('git',['show',baseline+':'+file],{maxBuffer:8*1024*1024})),'print asset unchanged: '+file);
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
 writeFileSync(output+'/browser-results.json',JSON.stringify({browser:await browser.version(),baseline,url,viewports,errors,externalRequests:network,standaloneOffline:'PASS',printAssets:'byte-identical to integration baseline',feedback:['2/6 mixed round','wrong chosen/target after grading','Gold replay retains gold without reward claim','review start','islands start; no NEXT assistance'],allUnlockedIcons:'PASS (desktop)',physicalIPadSafari:'not tested',artwork:'existing original artwork; no new assets'},null,2)+'\n');
 console.log('Release 1.1 Chrome: five viewports, eleven rendered icons, accessible disclosures/nav, baseline save/replay and map parity: PASS');
}finally{await browser.close()}
