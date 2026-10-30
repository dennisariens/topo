import{assertPreserved,restoreApprovedArea}from'./ipad-update-source.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
import{execFileSync}from'node:child_process';
import{JSDOM,VirtualConsole}from'jsdom';
import{restoreLegacyMapHit}from'./map-hit-source.mjs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const html=read('index.html').toString(),baseline=execFileSync('git',['show','f67027d:index.html'],{cwd:root,maxBuffer:32e6}).toString();
function boot(){const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(html,{url:'https://hit.test',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false}}});const w=dom.window;return{w,d:w.document,ev:s=>w.eval(s),errors,close:()=>w.close()}}
test('the only canonical app delta is the bounded resolver; engines, geography, schoolblad and atlas remain exact',()=>{
 assert.equal(restoreLegacyMapHit(html,baseline),baseline);
 for(const path of['scripts/learning-engine.js','scripts/route-engine.js','scripts/schoolblad.js','scripts/schoolblad.css','scripts/discovery-map.js','scripts/discovery-map.css','assets/discovery/terrain.webp','geography/lakes/projected-manifest.json','print.html','output/pdf/topo-italie-printboek.pdf','package-lock.json'])assertPreserved(path,read(path),execFileSync('git',['show','f67027d:'+path],{cwd:root,maxBuffer:32e6}));
 assert(html.includes(read('scripts/map-hit.js')));
 for(const path of['output/html/topo-italie-interactief.html','output/html/topo-italie-duolingo.html'])assert.equal(read(path).toString(),html);
});
test('all 45 stable IDs have semantic classes: 27 points and independent polygons/river corridors',()=>{
 const a=boot();try{assert.deepEqual(JSON.parse(a.ev('JSON.stringify(ITEMS.reduce((out,i)=>{const c=mapFeatureClass(i);out[c]=(out[c]||0)+1;return out},{}))')),{point:27,islands:2,mountains:2,regions:2,countries:5,sea:5,river:2});assert.equal(a.ev("mapFeatureClass(byId['area-g'])"),'regions');assert.equal(a.ev("mapFeatureClass(byId['area-h'])"),'regions');assert.equal(a.ev("mapFeatureClass(byId['water-G'])"),'river');assert.equal(a.ev("mapFeatureClass(byId['area-o'])"),'point');assert.deepEqual(a.errors,[])}finally{a.close()}
});
test('neutral display order is not distance or expected-answer order, and never mutates candidates',()=>{
 const a=boot();try{for(const n of[2,3,6,27]){const candidates=Array.from({length:n},(_,i)=>({id:'place-'+i}));const before=JSON.stringify(candidates);const first=a.w.neutralMapOrder(candidates,()=>0);const last=a.w.neutralMapOrder(candidates,()=>.99999);assert.equal(JSON.stringify(candidates),before);assert.notDeepEqual(first.map(i=>i.id),last.map(i=>i.id));assert.deepEqual([...first.map(i=>i.id)].sort(),candidates.map(i=>i.id).sort())}}finally{a.close()}
});
test('real Rome/Vatican keyboard chooser grades stable IDs with both first/second correct and wrong cases',()=>{
 const a=boot();try{
  const positions=new Set();
  for(const random of[0,.99999])for(const expected of['city-9','area-o']){
   a.ev(`mode('point');state.current=byId['${expected}'];state.questionMode='point';state.answered=false;clearActive();mapChoiceRandom=()=>${random}`);
   const before=a.ev('state.good');a.ev('romeHit.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}))');
   const dialog=a.d.querySelector('#mapPicker');assert(dialog.open);assert(!/Rome|Vaticaan/.test(dialog.textContent));
   const buttons=[...dialog.querySelectorAll('[data-map-choice]')],position=buttons.findIndex(b=>b.dataset.mapChoice===expected);positions.add(position);
   const order=buttons.map(b=>b.dataset.mapChoice);assert.deepEqual(order,random===0?['area-o','city-9']:['city-9','area-o']);
   buttons[0].click();assert(a.ev('state.answered'));assert.equal(a.d.querySelector('#message').classList.contains('good'),position===0);assert.equal(a.ev('state.good'),before+(position===0?1:0));
  }
  assert.deepEqual([...positions].sort(),[0,1]);assert.deepEqual(a.errors,[]);
 }finally{a.close()}
});
test('every point pair keeps its exact source anchors and answer-independent regional framing',()=>{
 const a=boot();try{
  const report=a.ev(`(()=>{const points=ITEMS.filter(i=>mapFeatureClass(i)==='point'),failures=[];const sets=[];for(let a=0;a<points.length;a++)for(let b=a+1;b<points.length;b++)sets.push([points[a],points[b]]);sets.push(points);for(const width of[160,220,280,420])for(const set of sets){const panels=mapPickerPointPanels(set,width);if(panels.flatMap(p=>p.items).length!==set.length)failures.push('missing item');if(JSON.stringify(panels)!==JSON.stringify(mapPickerPointPanels(set.slice().reverse(),width)))failures.push('answer-order framing');for(const p of panels)for(const m of p.marks){const i=byId[m.id];if(Math.abs(p.x+m.x*p.side/width-i.px)>1e-8||Math.abs(p.y+m.y*p.side/width-i.py)>1e-8)failures.push('moved anchor');}}return failures})()`);
  assert.deepEqual(JSON.parse(JSON.stringify(report)),[]);
 }finally{a.close()}
});
test('all recorded point collision sets keep noncrossing leaders at compact and wide sizes',()=>{
 const a=boot();try{
  const rows=JSON.parse(read('docs/visual/map-picker-58/collision-results.json')).records.filter(r=>r.kind==='point');
  const sets=[...new Map(rows.map(r=>[r.ids.join(','),r.ids])).values()];a.w.__sets=sets;
  const failures=a.ev(`(()=>{const out=[],turn=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);for(const ids of window.__sets)for(const width of[136,180,220,280,420,594]){const p=mapPickerPointPanels(ids.map(id=>byId[id]),width)[0];for(let a=0;a<p.marks.length;a++)for(let b=a+1;b<p.marks.length;b++){const x=p.marks[a],y=p.marks[b],u={x:x.lx,y:x.ly},v={x:y.lx,y:y.ly};if(turn(x,u,y)*turn(x,u,v)<0&&turn(y,v,x)*turn(y,v,u)<0)out.push({ids,width});}}return out})()`);
  assert.deepEqual(JSON.parse(JSON.stringify(failures)),[]);
 }finally{a.close()}
});
test('Vatican is illustrated inside Rome with two different noncrossing endpoint targets',()=>{
 const a=boot();try{Object.defineProperty(a.d.querySelector('#mapPicker'),'clientWidth',{value:304});for(const random of[0,.99999]){
  a.ev(`mode('point');mapChoiceRandom=()=>${random};openMapPicker([byId['city-9'],byId['area-o']])`);
  const svg=a.d.querySelector('[data-picker-panel]'),area=svg.querySelector('[data-picker-city-area]');assert(area);
  const city=svg.querySelector('[data-picker-endpoint="city-9"]'),vatican=svg.querySelector('[data-picker-endpoint="area-o"]');
  const x=n=>+n.getAttribute('cx'),y=n=>+n.getAttribute('cy');
  assert(Math.hypot(x(city)-x(vatican),y(city)-y(vatican))+5<+area.getAttribute('r'));
  assert(Math.hypot(x(city)-x(vatican),y(city)-y(vatican))>24);
  for(const endpoint of[city,vatican]){const line=svg.querySelector('[data-picker-leader="'+endpoint.dataset.pickerEndpoint+'"]');assert.equal(+line.getAttribute('x1'),x(endpoint));assert.equal(+line.getAttribute('y1'),y(endpoint));}
  assert.equal(svg.querySelector('[data-picker-symbol="area-o"]').dataset.symbolKind,'microstate');assert(svg.querySelector('[data-picker-locator]'));
  assert(!/Rome|Vaticaan/.test(a.d.querySelector('#mapPicker').textContent));
 }}finally{a.close()}
});
test('regional choosers retain distinct volcano/city/state glyphs and source context',()=>{
 const a=boot();try{for(const ids of[['city-6','area-e'],['city-15','area-f'],['city-2','city-20'],['city-5','city-13'],['city-3','area-n']]){
  a.ev(`mode('point');openMapPicker(${JSON.stringify(ids)}.map(id=>byId[id]))`);
  const svg=a.d.querySelector('[data-picker-panel]');assert(svg.querySelector('svg path'));assert(svg.querySelector('[data-picker-north]'));
  for(const id of ids.filter(id=>['area-e','area-f'].includes(id)))assert(svg.querySelector('[data-picker-volcano-plume="'+id+'"]'),'volcano retains a visible plume');
  assert([...a.d.querySelectorAll('[data-map-choice]')].every(n=>n.textContent.startsWith('Plek ')));
  for(const id of ids){const symbol=svg.querySelector('[data-picker-symbol="'+id+'"]');assert.equal(symbol.dataset.symbolKind,id==='area-e'||id==='area-f'?'volcano':id==='area-n'?'microstate':'city');assert(svg.querySelector('[data-picker-badge="'+id+'"]'));}
 }}finally{a.close()}
});
test('picker rendering does not read expected answer and names containment only in Discover',()=>{
 const source=read('scripts/map-hit.js').toString();const renderer=source.slice(source.indexOf('function mapPickerPointPanels'),source.indexOf("$('#map').addEventListener('click'"));assert(!/state\.current|state\.route|activeTarget'\)/.test(renderer.replace("n.classList.remove('activeTarget')",'')));assert(renderer.includes("state.mode==='learn'&&hits.some"));assert(renderer.includes('cancel.autofocus=true'));assert(renderer.includes("pick.addEventListener('close'"));
});
