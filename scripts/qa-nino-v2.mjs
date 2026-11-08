import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),out=new URL('docs/qa/nino-v2-integration/browser/',root);mkdirSync(out,{recursive:true});
const engine=process.env.QA_BROWSER==='webkit'?webkit:chromium;
const browser=await engine.launch(engine===chromium?{executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{}),results=[];
try{
 for(const [width,height]of [[1500,1000],[1024,768],[768,1024],[390,844],[320,740]]){
  const context=await browser.newContext({offline:true,viewport:{width,height},reducedMotion:'reduce',deviceScaleFactor:2,hasTouch:width<1100}),p=await context.newPage(),errors=[],external=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});
  await p.goto(new URL('output/html/TOPO-NINO-Computer-Release.html',root).href);await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()))});
  assert.equal(await p.evaluate(()=>ITEMS.length),45);assert.equal(await p.evaluate(()=>ROUTE_CHAPTERS.length),11);
  assert(await p.locator('.ninoNav').isVisible());assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await p.screenshot({path:new URL((engine===webkit?'webkit':'chrome')+'-'+width+'-journey.png',out).pathname});
  if(width<1100)await p.getByRole('button',{name:'Reisboekje',exact:true}).tap();else await p.getByRole('button',{name:'Reisboekje',exact:true}).click();assert(await p.locator('#travelBook').evaluate(n=>n.open));
  for(const paper of await p.locator('.folioPaper').all()){await paper.evaluate(i=>i.decode());if(await paper.isVisible()){const r=await paper.boundingBox();assert(r.width<=543);assert(Math.abs(r.width/r.height-1086/1448)<.001);}}
  assert(await p.locator('#travelBook').evaluate(d=>d.scrollWidth<=d.clientWidth));
  const firstLabel=await p.locator('.bookFooter span').textContent();await p.keyboard.press('ArrowRight');assert.notEqual(await p.locator('.bookFooter span').textContent(),firstLabel);await p.keyboard.press('ArrowLeft');assert.equal(await p.locator('.bookFooter span').textContent(),firstLabel);
  await p.screenshot({path:new URL((engine===webkit?'webkit':'chrome')+'-'+width+'-folio.png',out).pathname});
  assert.equal(await p.locator('#travelBook .stampArt').count(),0);await p.getByRole('button',{name:'Volgende',exact:true}).click();if(width<=650)await p.getByRole('button',{name:'Volgende',exact:true}).click();assert.equal(await p.locator('.bookStamp').count(),11);assert.equal(await p.locator('#travelBook .stampArt').count(),0);assert.equal(await p.locator('#travelBook .chapterSeal').count(),0);
  await p.screenshot({path:new URL((engine===webkit?'webkit':'chrome')+'-'+width+'-passport.png',out).pathname});
  await p.keyboard.press('Escape');assert.equal(await p.locator('#travelBook').evaluate(n=>n.open),false);assert.equal(await p.evaluate(()=>document.activeElement.textContent),'Reisboekje');
  await p.locator('.ninoNav button').filter({hasText:'Oefenen'}).click();
  // Use the original controls; on Focus devices they live in the contextual Menu.
  const menu=p.locator('#focusMenu');if(await menu.isVisible())await menu.locator(':scope > summary').click();
  await p.locator('[data-mode="write"]').click();if(await menu.isVisible())await menu.evaluate(n=>n.open=false);
  await p.locator('#answer').fill('Mijn antwoord');await p.locator('#answer').evaluate(n=>n.setSelectionRange(2,6));const snapshot=await p.evaluate(()=>({save:localStorage.getItem('topo-italie-v3'),current:state.current.id,mode:state.mode,draft:document.querySelector('#answer').value,caret:[document.querySelector('#answer').selectionStart,document.querySelector('#answer').selectionEnd],route:JSON.stringify(state.route)}));
  await p.getByRole('button',{name:'Reisboekje',exact:true}).click();await p.getByRole('button',{name:'Sluit boekje',exact:true}).click();
  assert.deepEqual(await p.evaluate(()=>({save:localStorage.getItem('topo-italie-v3'),current:state.current.id,mode:state.mode,draft:document.querySelector('#answer').value,caret:[document.querySelector('#answer').selectionStart,document.querySelector('#answer').selectionEnd],route:JSON.stringify(state.route)})),snapshot);
  await p.screenshot({path:new URL((engine===webkit?'webkit':'chrome')+'-'+width+'-practice.png',out).pathname});
  if(width===320){
   await p.evaluate(()=>{ROUTE_CHAPTERS.forEach(c=>{state.route.chapters[c.id]={stage:3,completedAt:1,goldAt:1,nextReviewAt:0,reviews:0}})});
   await p.getByRole('button',{name:'Reisboekje',exact:true}).click();
   while(!await p.getByRole('button',{name:'Vorige',exact:true}).isDisabled())await p.getByRole('button',{name:'Vorige',exact:true}).click();
   await p.getByRole('button',{name:'Volgende',exact:true}).click();
   assert((await p.locator('.bookFinalGold').boundingBox()).width>=240);
   assert(await p.locator('#travelBook').evaluate(d=>d.scrollWidth<=d.clientWidth));
   await p.getByRole('button',{name:'Sluit boekje',exact:true}).click();
  }
  if(width===1500){
   // Explicit projection fixtures: these are not claims of naturally earned play.
   for(const fixture of [{completed:0,gold:0,trips:0},{completed:1,gold:0,trips:1},{completed:11,gold:1,trips:2},{completed:11,gold:1,trips:3},{completed:11,gold:11,trips:8}]){
    await p.evaluate(f=>{state.route=TopoRoute.fresh();ROUTE_CHAPTERS.forEach((c,i)=>{state.route.chapters[c.id]={stage:i<f.completed?3:0,completedAt:i<f.completed?1:0,goldAt:i<f.gold?1:0,nextReviewAt:0,reviews:0}});state.trips=f.trips;state.pizzas=f.trips*3;state.slices=0;},fixture);
    const before=await p.evaluate(()=>JSON.stringify({route:state.route,pizzas:state.pizzas,trips:state.trips}));
    await p.getByRole('button',{name:'Reisboekje',exact:true}).click();
    while(!await p.getByRole('button',{name:'Vorige',exact:true}).isDisabled())await p.getByRole('button',{name:'Vorige',exact:true}).click();
    for(const n of await p.locator('.illustratedFolio').all()){const bounds=await n.boundingBox();assert(bounds.width<=543);assert.equal(await n.locator('.folioPaper').evaluate(async i=>{await i.decode();return i.naturalWidth}),1086);assert((await n.locator('.folioPaper').boundingBox()).width<=543);}
    if(fixture.trips===0)await p.screenshot({path:new URL('chrome-native-folio-spread.png',out).pathname});
    assert.equal(await p.locator('.bookFinalGold').count(),fixture.gold===11?1:0);
    await p.getByRole('button',{name:'Volgende',exact:true}).click();
    assert.equal(await p.locator('.stampArt').count(),fixture.completed);if(fixture.completed){await p.locator('.stampInspect').first().click();assert(await p.locator('.stampZoom').evaluate(n=>n.open));assert((await p.locator('.stampLarge').boundingBox()).width>=160);await p.getByRole('button',{name:'Sluit stempel',exact:true}).click();}assert.equal(await p.locator('.chapterSeal').count(),fixture.gold);
    await p.getByRole('button',{name:'Volgende',exact:true}).click();
    assert.equal(await p.locator('.destinationList li').count(),Math.min(7,fixture.trips));
    assert.equal(await p.locator('.earnedPostcard').count(),(fixture.completed>=5?2:0)+(fixture.trips>=3?1:0)+(fixture.trips>=6?1:0));
    if(fixture.trips===3){await p.locator('.earnedPostcard img').last().evaluate(i=>i.decode());await p.locator('.earnedPostcard').last().scrollIntoViewIfNeeded();await p.screenshot({path:new URL('chrome-earned-venezia-fixture.png',out).pathname});}
    if(fixture.trips===8){assert((await p.locator('.destinationList').innerText()).includes('Florence · 2×'));await p.locator('.earnedPostcard button').first().click();assert.equal(await p.locator('.earnedPostcard button').first().textContent(),'Bekijk voorkant');}
    assert.equal(await p.evaluate(()=>JSON.stringify({route:state.route,pizzas:state.pizzas,trips:state.trips})),before);
    await p.getByRole('button',{name:'Sluit boekje',exact:true}).click();
   }
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);results.push({width,height,deviceScaleFactor:2,errors,external,passportPreservesQuestionAndSave:true,unearnedArtworkHidden:true});await context.close();
 }
 writeFileSync(new URL((engine===webkit?'webkit':'chrome')+'-results.json',out),JSON.stringify({browser:await browser.version(),physicalSafari:false,sha256:createHash('sha256').update(readFileSync(new URL('index.html',root))).digest('hex'),results},null,2)+'\n');
}finally{await browser.close()}
