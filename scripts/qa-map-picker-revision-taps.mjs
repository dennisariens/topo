import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {metrics,check} from './map-picker-visibility.mjs';
const{chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),out=new URL('../docs/visual/map-picker-58-revision/',import.meta.url);
const rows=JSON.parse(readFileSync(new URL('docs/visual/map-picker-58/collision-results.json',root),'utf8')).records;
const b=await chromium.launch(),records=process.env.QA_REVISION_RESUME?JSON.parse(readFileSync(new URL('physical-checkpoint.json',out),'utf8')).records:[],errors=[],external=[];
const settle=p=>p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
try{for(const name of ['desktop','landscape','portrait','phone','small-phone']){
 if(process.env.QA_REVISION_RESUME&&records.filter(r=>r.name===name).length===rows.filter(r=>r.name===name).length)continue;
 const row0=rows.find(r=>r.name===name&&r.width),c=await b.newContext({viewport:{width:row0.width,height:row0.height},offline:true,reducedMotion:'reduce'}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});await p.goto(new URL('output/html/TOPO-Italie-Computer.html',root).href);await p.evaluate(()=>mode('point'));
 for(const [index,row]of rows.filter(r=>r.name===name).entries()){
  await p.evaluate(r=>{state.current=byId[r.ids[0]];state.questionMode='point';state.answered=false;clearActive();hideLens();TopoAtlas.zoom(r.zoom||({overview:1,chapter:2,pan:3}[r.camera]));document.querySelector('.atlasOptions input[value="'+r.style+'"]').click();},row);
  const toggle=p.locator('#focusSheetToggle');if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')==='true')await toggle.click();await settle(p);
  await p.evaluate(({x,y})=>{const a=document.querySelector('.atlasViewport'),q=new DOMPoint(x,y).matrixTransform($('#map').getScreenCTM()),r=a.getBoundingClientRect();a.scrollLeft+=q.x-r.left-r.width/2;a.scrollTop+=q.y-r.top-r.height/2},row);await settle(p);
  const xy=await p.evaluate(r=>{const q=new DOMPoint(r.x,r.y).matrixTransform($('#map').getScreenCTM());for(let radius=0;radius<=24;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==radius)continue;const x=Math.round(q.x)+dx,y=Math.round(q.y)+dy;if(document.elementFromPoint(x,y)?.closest('.atlasViewport')&&mapTapCandidates(x,y,r.kind).map(i=>i.id).sort().join(',')===r.ids.join(','))return[x,y]}return null},row);
  if(!xy){records.push({name,camera:row.camera,style:row.style,kind:row.kind,ids:row.ids,status:'NO ADDRESSABLE INTEGER-PIXEL TAP after layout settled; not a pass'});continue}
  const orders=[];
  for(const requested of row.ids.slice(0,2)){
   await p.evaluate(id=>{state.current=byId[id];state.questionMode='point';state.answered=false;clearActive();mapChoiceRandom=()=>0;$('#prompt').textContent='Waar ligt '+state.current.name+'?';message('Klik op de plek of de vorm op de kaart.');},requested);
   // Focus deliberately reopens for a different question. Settle that observer,
   // then collapse the sheet for BOTH targets before repeating the identical tap.
   await settle(p);if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')==='true')await toggle.click();await settle(p);
   await p.mouse.click(...xy);assert(await p.locator('#mapPicker').evaluate(n=>n.open),name+' pointer '+row.ids);const order=await p.locator('[data-map-choice]').evaluateAll(ns=>ns.map(n=>n.dataset.mapChoice));orders.push(order);assert.deepEqual(order.slice().sort(),row.ids);
   const m=await metrics(p);check(m,row.ids,name+'/'+row.camera+'/'+row.ids);await p.locator('[data-map-choice="'+row.ids[0]+'"]').press('Enter');assert.equal(await p.locator('#message').evaluate(n=>n.classList.contains('good')),requested===row.ids[0]);
  }
  assert.deepEqual(orders[0],orders[1]);records.push({name,camera:row.camera,style:row.style,kind:row.kind,ids:row.ids,xy,orders,status:'PASS physical same-tap target-independent candidates, correct/wrong grading and initial visibility'});
  if(index%50===0)console.log(name+' '+index+'/'+rows.filter(r=>r.name===name).length);
 }
 await c.close();console.log(name+' complete');writeFileSync(new URL('physical-checkpoint.json',out),JSON.stringify({records,errors,external},null,2)+'\n');}
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);writeFileSync(new URL('physical-results.json',out),JSON.stringify({browser:await b.version(),transport:'file:// offline:true',method:'Retest all 799 previously enumerated resolver cells after double animation-frame layout/pan settling. NOT a new enumeration of continuous space. Two identical physical taps per addressable cell with different requested targets.',records,errors,external},null,2)+'\n');console.log('PASS physical matrix '+records.filter(r=>r.status.startsWith('PASS')).length+'/'+records.length);
}finally{await b.close()}
