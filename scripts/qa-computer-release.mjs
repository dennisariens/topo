import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),file=new URL(process.env.TOPO_RELEASE_FILE||'output/html/TOPO-NINO-Computer-Release.html',root);
const out=new URL('docs/qa/computer-release-20261030/integrity/',root);mkdirSync(out,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex'),bytes=readFileSync(file);
const manifest=JSON.parse(readFileSync(new URL('docs/geography/map-manifest.json',root)));
const points=JSON.parse(readFileSync(new URL('docs/geography/points.json',root)));
const browser=await chromium.launch(),errors=[],consoleErrors=[],external=[],ledger=[];
const context=await browser.newContext({offline:true,viewport:{width:1500,height:1100},reducedMotion:'reduce'}),p=await context.newPage();
p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});p.on('dialog',d=>d.accept());p.setDefaultTimeout(10000);
async function fixture(id,mode='point'){
 await p.evaluate(({id,modeName})=>{if(pick.open)pick.close();mode(modeName);state.current=byId[id];state.questionMode=modeName==='write'?'write':'point';state.answered=false;clearActive();hideLens();}, {id,modeName:mode});
}
const rewards=()=>p.evaluate(()=>[state.good,state.pizzas,state.slices,state.trips]);
async function screen(point){
 return p.evaluate(([x,y])=>{const map=$('#map'),area=map.closest('.atlasViewport');let q=new DOMPoint(x,y).matrixTransform(map.getScreenCTM()),r=area.getBoundingClientRect();area.scrollLeft+=q.x-r.left-r.width/2;area.scrollTop+=q.y-r.top-r.height/2;q=new DOMPoint(x,y).matrixTransform(map.getScreenCTM());return[q.x,q.y]},point);
}
async function tap(point,selectedId,ok){
 const xy=await screen(point);assert(await p.evaluate(([x,y])=>!!document.elementFromPoint(x,y)?.closest('.atlasViewport'),xy),'pointer must actually reach map');
 const candidates=await p.evaluate(([x,y])=>mapTapCandidates(x,y,mapFeatureClass(state.current)).map(i=>i.id),xy);
 await p.mouse.click(...xy);let order=[];
 if(await p.locator('#mapPicker').evaluate(n=>n.open)){order=await p.locator('[data-map-choice]').evaluateAll(ns=>ns.map(n=>n.dataset.mapChoice));assert(order.includes(selectedId));await p.locator(`[data-map-choice="${selectedId}"]`).click()}
 assert.equal(await p.evaluate(()=>state.answered),true);assert.equal(await p.locator('#message').evaluate(n=>n.classList.contains('good')),ok,JSON.stringify({point,xy,selectedId,candidates,order,current:await p.evaluate(()=>state.current.id),feedback:await p.locator('#message').textContent()}));
 return{sourcePoint:point,screenPoint:xy,candidates,order,selectedId,correct:ok};
}
try{
 await p.goto(file.href);await p.locator('.routeCard').last().waitFor({state:'attached'});
 const items=await p.evaluate(()=>ITEMS.map(i=>({...i,featureClass:mapFeatureClass(i),chapter:groupForItem(i)})));
 assert.equal(items.length,45);assert.equal(await p.evaluate(()=>ROUTE_CHAPTERS.length),11);
 await fixture(items[0].id);await p.evaluate(()=>TopoAtlas.zoom(1));
 const samples=await p.evaluate(()=>Object.fromEntries(ITEMS.map(i=>{
  const kind=mapFeatureClass(i),node=elements[i.id];let samples=[];
  if(kind==='point')samples=[[i.px,i.py],[i.px+2,i.py]];
  else if(kind==='river')samples=[.35,.7].map(f=>{const q=node.getPointAtLength(node.getTotalLength()*f);return[q.x,q.y]});
  else{const b=node.getBBox();for(let yi=1;yi<20&&samples.length<2;yi++)for(let xi=1;xi<20&&samples.length<2;xi++){
   const x=Math.max(0,b.x)+Math.min(890,b.width)*xi/20,y=Math.max(0,b.y)+Math.min(1235,b.height)*yi/20;
   if(x>890||y>1235)continue;const q=new DOMPoint(x,y).matrixTransform($('#map').getScreenCTM());
   if([[0,0],[-2,0],[2,0],[0,-2],[0,2]].every(([dx,dy])=>mapTapCandidates(q.x+dx,q.y+dy,kind).some(c=>c.id===i.id))&&(!samples.length||Math.hypot(x-samples[0][0],y-samples[0][1])>8))samples.push([x,y]);
  }}return[i.id,samples];})));
 for(const item of items){
  assert.equal(samples[item.id].length,2,'two addressable samples '+item.id);
  const ref=manifest.find(r=>r.id===item.id);assert(ref);assert.equal(sha(item.shape||''),ref.shape_sha256);assert.equal(item.px,ref.px);assert.equal(item.py,ref.py);
  const point=points.find(r=>r.id===item.id);
  if(point){assert(Math.abs(item.px-(55*point.lon-225.5))<.02);assert(Math.abs(item.py-(3830.75-77*point.lat))<.02)}
  const row={id:item.id,name:item.name,kind:item.kind,featureClass:item.featureClass,chapter:item.chapter,source:ref.reference,geometrySha256:ref.shape_sha256,geographyStatus:point?'SOURCE PROJECTION VERIFIED':/schematic|schematisch|approx/i.test(ref.reference)?'SCHEMATIC — extent not independently certified':'SOURCE BASELINE VERIFIED — not fresh GIS certification',runs:[]};
  for(const style of ['school','discovery']){
   await fixture(item.id);await p.evaluate(s=>document.querySelector('.atlasOptions input[value="'+s+'"]').click(),style);
   const wrongPoint=await p.evaluate(({samples,id})=>{const target=byId[id],kind=mapFeatureClass(target);const pool=ITEMS.filter(i=>i.id!==id&&mapFeatureClass(i)===kind).flatMap(i=>samples[i.id].map(pt=>({id:i.id,pt})));pool.push({id:null,pt:[0,0]},{id:null,pt:[350,500]});for(const v of pool){const q=new DOMPoint(...v.pt).matrixTransform($('#map').getScreenCTM()),ids=mapTapCandidates(q.x,q.y,kind).map(i=>i.id);if(!ids.includes(id))return{...v,ids}}return null},{samples,id:item.id});assert(wrongPoint);
   const before=await rewards(),wrong=await tap(wrongPoint.pt,wrongPoint.ids[0],false);assert.deepEqual(await rewards(),before,'wrong pointer earns no reward '+item.id);
   const correct=[];for(const sample of samples[item.id]){await fixture(item.id);correct.push(await tap(sample,item.id,true))}
   await fixture(item.id,'write');const beforeWrite=await rewards();await p.locator('#answer').fill('zeker verkeerd antwoord');await p.locator('#check').click();assert(await p.locator('#message').evaluate(n=>n.classList.contains('bad')));assert.deepEqual(await rewards(),beforeWrite);
   await fixture(item.id,'write');await p.locator('#answer').fill(item.name);await p.locator('#check').click();assert(await p.locator('#message').evaluate(n=>n.classList.contains('good')));
   const earned=await rewards();assert(await p.locator('#check').isDisabled(),'answered check is disabled');await p.locator('#answer').press('Enter');assert.deepEqual(await rewards(),earned,'duplicate submission');
   row.runs.push({style,wrong,correct,writing:{wrongRejected:true,nameAccepted:true,duplicateCreditBlocked:true}});
  }
  row.status='PASS executed pointer/writing fixtures in both themes';ledger.push(row);writeFileSync(new URL('ledger.json',out),JSON.stringify(ledger,null,2)+'\n');console.log(item.id+' '+item.name+' PASS');
 }
 // Real route queue, seeded completed prerequisites only. One wrong answer must
 // prevent Gold even when every remaining answer is correct.
 await p.evaluate(()=>{mode('route');state.route=TopoRoute.fresh();const r=TopoRoute.record(state.route,'city1');r.stage=3;r.completedAt=Date.now();r.nextReviewAt=Date.now()+TopoRoute.DAY;state.route=TopoRoute.restore(state.route,ROUTE_CHAPTERS);startRouteLesson('city1','gold')});
 let count=0,wrongInjected=false;
 while(!await p.evaluate(()=>state.route.active.done)){
  assert(++count<40);
  if(await p.evaluate(()=>roundPaused)){await p.locator('#finishScreen .button').first().click();continue}
  const task=await p.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));
  if(task.mode==='point'){
   if(!wrongInjected){const candidate=items.find(i=>i.featureClass==='point'&&Math.hypot(i.px-items.find(t=>t.id===task.id).px,i.py-items.find(t=>t.id===task.id).py)>100);await tap(samples[candidate.id][0],candidate.id,false);wrongInjected=true}
   else await tap(samples[task.id][0],task.id,true);
  }else{await p.locator('#answer').fill(task.name);await p.locator('#check').click()}
  await p.locator('#next:visible,#routeDockNext:visible').first().click();
 }
 assert(wrongInjected);assert.equal(await p.evaluate(()=>state.route.active.result.passed),false);assert.equal(await p.evaluate(()=>state.route.chapters.city1.goldAt),0);
 const saved=JSON.parse(await p.evaluate(()=>localStorage.getItem('topo-italie-v3')));await p.reload();assert.deepEqual(JSON.parse(await p.evaluate(()=>localStorage.getItem('topo-italie-v3'))),saved,'reload preserves all data; object key order is not state');
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);assert.deepEqual(external,[]);
 writeFileSync(new URL('summary.json',out),JSON.stringify({artifact:file.href,bytes:bytes.length,sha256:sha(bytes),browser:await browser.version(),transport:'file:// offline:true',objects:ledger.length,styles:2,correctPointerTrials:180,wrongPointerTrials:90,writingTrials:180,coverage:'Explicit per-item current-question fixtures with actual mouse/buttons and writing; not a full natural-route all-45 playthrough. Existing DOM suite covers all eleven route chapters. Geography compares pinned source baselines, not a fresh independent survey.',goldWrongCannotPass:true,reloadExact:true,errors,consoleErrors,external,physicalSafari:'NOT TESTED'},null,2)+'\n');
 console.log('PASS all45 pointer/writing ledger, wrong-Gold gate and reload');
}finally{await browser.close()}
