import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),out=new URL(process.env.QA_FIDELITY_DIR||'docs/qa/approved-artwork-20261030/fidelity/',root);mkdirSync(out,{recursive:true});
const artifact=new URL('output/html/TOPO-NINO-Computer-Release.html',root),asset=new URL('assets/map-selection/TOPO-Rome-Vaticaanstad-approved-refined.svg',root);
const hash=b=>createHash('sha256').update(b).digest('hex'),browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),errors=[],external=[],consoleErrors=[],records=[];
try{
 const c=await browser.newContext({offline:true,viewport:{width:1500,height:1000}}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});p.on('dialog',d=>d.accept());
 await p.setViewportSize({width:1500,height:1000});await p.setContent('<!doctype html><html><head><style>body{margin:0}svg{display:block;width:340px;height:212px}</style></head><body>'+readFileSync(asset,'utf8')+'</body></html>');const original=await p.evaluate(()=>{
  const svg=document.querySelector('svg');return {drawing:[...svg.querySelectorAll('rect,circle,path')].map(n=>[n.tagName,...['d','cx','cy','r','fill','stroke','stroke-width','opacity'].map(k=>n.getAttribute(k))]),font:svg.getAttribute('font-family')};
 });await p.locator('svg').screenshot({path:new URL('owner-original.png',out).pathname});await p.setViewportSize({width:1500,height:1000});await p.goto(artifact.href);
 for(const modeName of ['learn','point','exam','gold'])for(const random of[0,.99999]){
  await p.evaluate(({modeName,random})=>{if(pick.open)pick.close();if(modeName==='gold'){mode('route');state.route=TopoRoute.fresh();for(const chapter of ROUTE_CHAPTERS)TopoRoute.record(state.route,chapter.id).stage=3;state.route=TopoRoute.restore(state.route,ROUTE_CHAPTERS);startRouteLesson('city2','gold')}else mode(modeName);state.current=byId['city-9'];state.questionMode='point';state.answered=false;mapChoiceRandom=()=>random;openMapPicker([byId['city-9'],byId['area-o']]);},{modeName,random});
  const actual=await p.locator('#mapPicker [data-approved-artwork]').evaluate(svg=>({drawing:[...svg.querySelectorAll('rect,circle,path')].map(n=>[n.tagName,...['d','cx','cy','r','fill','stroke','stroke-width','opacity'].map(k=>n.getAttribute(k))]),font:svg.getAttribute('font-family'),digits:[...svg.querySelectorAll('text')].map(n=>n.textContent)}));
  assert.deepEqual(actual.drawing,original.drawing);assert.equal(actual.font,original.font);assert.deepEqual(actual.digits,random===0?['2','1']:['1','2']);
  if(modeName!=='learn')assert(!/Rome|Vaticaan/.test(await p.locator('#mapPicker').textContent()));
  assert(await p.locator('.pickerCancel').evaluate(n=>n===document.activeElement));
  await p.locator('#mapPicker').screenshot({path:new URL(modeName+'-'+(random===0?'swapped':'original')+'.png',out).pathname});
  records.push({mode:modeName,random,drawingAndTypographyExact:true,digits:actual.digits});await p.keyboard.press('Escape');
 }
 for(const[name,width,height]of[['desktop',1500,1000],['small-phone',320,568]]){
  await p.setViewportSize({width,height});await p.evaluate(()=>{mode('point');state.current=byId['area-o'];state.questionMode='point';state.answered=false;mapChoiceRandom=()=>0;openMapPicker(['area-e','area-o','city-21','city-6','city-9'].map(id=>byId[id]))});
  assert.equal(await p.locator('#mapPicker [data-map-choice]').count(),5);assert.equal(await p.locator('#mapPicker [data-approved-artwork]').count(),1);assert(!/Rome|Vaticaan|Napels|Vesuvius/.test(await p.locator('#mapPicker').textContent()));await p.locator('#mapPicker').screenshot({path:new URL(name+'-multiway.png',out).pathname});await p.keyboard.press('Escape');
 }
 await p.setViewportSize({width:1500,height:1000});await p.evaluate(()=>{mode('learn');showLesson(byId['area-o']);showLens()});
 assert(await p.locator('#romeLens').isVisible());const lens=await p.locator('#romeLens [data-approved-artwork]').evaluate(svg=>[...svg.querySelectorAll('rect,circle,path')].map(n=>[n.tagName,...['d','cx','cy','r','fill','stroke','stroke-width','opacity'].map(k=>n.getAttribute(k))]));assert.deepEqual(lens,original.drawing);await p.locator('#romeLens').screenshot({path:new URL('discover-lens.png',out).pathname});
 await p.evaluate(()=>{hideLens();mode('write')});assert(!await p.locator('#romeLens').isVisible(),'no named diagram leakage in writing assessment');
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);assert.deepEqual(external,[]);
 writeFileSync(new URL('results.json',out),JSON.stringify({assetSha256:hash(readFileSync(asset)),artifactSha256:hash(readFileSync(artifact)),browser:await browser.version(),transport:'file:// offline:true',records,discoverLensUsesSameArtwork:true,writingHasNoNamedLens:true,coverage:'Shared-component mode fixtures; Gold scoring separately tested through route queues',errors,consoleErrors,external},null,2)+'\n');
 console.log('PASS exact owner SVG drawing/font in Learn, Point, Test, Gold and Discover lens; both unbiased number orders');await c.close();
}finally{await browser.close()}
