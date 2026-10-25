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
 for(const path of['scripts/learning-engine.js','scripts/route-engine.js','scripts/schoolblad.js','scripts/schoolblad.css','scripts/discovery-map.js','scripts/discovery-map.css','assets/discovery/terrain.webp','geography/lakes/projected-manifest.json','print.html','output/pdf/topo-italie-printboek.pdf','package-lock.json'])assert.deepEqual(read(path),execFileSync('git',['show','f67027d:'+path],{cwd:root,maxBuffer:32e6}),path);
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
