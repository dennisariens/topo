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
test('every pair and broad point cluster retains exact anchors, >=32px endpoint spacing and noncrossing connectors',()=>{
 const a=boot();try{
  const report=a.ev(`(()=>{const points=ITEMS.filter(i=>mapFeatureClass(i)==='point'),failures=[];const sets=[];for(let a=0;a<points.length;a++)for(let b=a+1;b<points.length;b++)sets.push([points[a],points[b]]);sets.push(points);for(const width of[160,220,280,420])for(const set of sets){const panels=mapPickerPointPanels(set,width);if(panels.flatMap(p=>p.items).length!==set.length)failures.push('missing item');for(const p of panels){for(const m of p.marks){const i=byId[m.id];if(Math.abs(p.x+m.x*p.side/width-i.px)>1e-8||Math.abs(p.y+m.y*p.side/width-i.py)>1e-8)failures.push('moved anchor');}for(let a=0;a<p.marks.length;a++)for(let b=a+1;b<p.marks.length;b++){const u=p.marks[a],v=p.marks[b];if(Math.hypot(u.x-v.x,u.y-v.y)<32)failures.push('indistinguishable endpoints');}}}return failures})()`);
  assert.deepEqual(JSON.parse(JSON.stringify(report)),[]);
 }finally{a.close()}
});
test('picker rendering does not read expected answer and names containment only in Discover',()=>{
 const source=read('scripts/map-hit.js').toString();const renderer=source.slice(source.indexOf('function mapPickerPointPanels'),source.indexOf("$('#map').addEventListener('click'"));assert(!/state\.current|state\.route|activeTarget'\)/.test(renderer.replace("n.classList.remove('activeTarget')",'')));assert(renderer.includes("state.mode==='learn'&&hits.some"));assert(renderer.includes('cancel.autofocus=true'));assert(renderer.includes("pick.addEventListener('close'"));
});

test('Rome/Vatican symbolic view keeps the city and enclave nested, with leaders ending inside their subjects',()=>{
 const a=boot();try{
  for(const random of[0,.99999]){
   a.ev("mode('point');state.current=byId['area-o'];state.questionMode='point';state.answered=false;mapChoiceRandom=()=>"+random);
   a.ev("openMapPicker([byId['city-9'],byId['area-o']])");
   const picker=a.d.querySelector('#mapPicker'),graphic=picker.querySelector('svg.pickerRomeVaticanDiagram');
   assert(graphic,'special nested view rendered');
   assert(!/Rome|Vaticaan/i.test(picker.textContent),'no named answer leakage in assessment');
   const cityLine=graphic.querySelector('path[d="M 70 48 H 119 L 226 90"]');
   const enclaveLine=graphic.querySelector('path[d="M 70 168 H 111 L 170 94"]');
   assert(cityLine&&enclaveLine,'independent noncrossing leaders');
   assert(Math.hypot(226-204,90-108)<75-7,'Rome line ends well inside the dashed circle');
   assert(graphic.querySelector('path[d^="M 152 90"]'),'small enclave is drawn inside city');
   const marks=[...graphic.querySelectorAll('text')].filter(t=>t.getAttribute('x')==='54');
   assert.equal(marks.length,2);
   assert.equal(marks[0].textContent,random===0?'2':'1','Rome number follows neutral shuffle');
   assert.equal(marks[1].textContent,random===0?'1':'2','Vatican number follows neutral shuffle');
   assert.deepEqual([...picker.querySelectorAll('[data-map-choice]')].map(b=>b.dataset.mapChoice),random===0?['area-o','city-9']:['city-9','area-o']);
   picker.close();
  }
  a.ev("openMapPicker([byId['city-2'],byId['city-20']])");
  assert(!a.d.querySelector('.pickerRomeVaticanDiagram'),'all other collisions keep true-anchor generic chooser');
  assert.deepEqual(a.errors,[]);
 }finally{a.close()}
});
