import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const html=read('index.html').toString(),hash=b=>createHash('sha256').update(b).digest('hex');
const base='assets/nino/rewards/pizza/';
function boot(saved){
 const timers=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://pizza.test',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;
  w.setTimeout=(fn,delay)=>{const t={fn,delay,ran:false,cancelled:false};timers.push(t);return timers.length};w.clearTimeout=id=>{if(timers[id-1])timers[id-1].cancelled=true};
  if(saved)w.localStorage.setItem('topo-italie-v3',saved);
 }});
 const w=dom.window,q=s=>w.document.querySelector(s),ev=s=>w.eval(s);
 const tick=delay=>{const t=timers.find(t=>t.delay===delay&&!t.ran&&!t.cancelled);assert(t,'timer '+delay);t.ran=true;t.fn()};
 assert.deepEqual(errors,[]);
 return {w,q,ev,tick,errors,close:()=>dom.window.close()};
}
test('all original sources/masters and runtime images are checksum pinned and embedded',()=>{
 const source=JSON.parse(read(base+'manifest.json'));assert.equal(Object.keys(source.files).length,85);
 for(const [path,meta] of Object.entries(source.files)){const b=read(base+path);assert.equal(b.length,meta.bytes,path);assert.equal(hash(b),meta.sha256,path)}
 for(const f of source.flavor_order){const path=base+`masters/pizza-${f}.png`;assert.deepEqual(read(path),execFileSync('git',['show',`15ce46fb556d4e05734d72787b054125f5869cba:${path}`],{maxBuffer:8e6,cwd:root}))}
 const runtime=JSON.parse(read(base+'runtime-manifest.json'));
 for(const proof of Object.values(runtime.assembly)){assert.equal(proof.sourceMaxChannelDifference,0);assert.equal(proof.overlappingPixels,0)}
 const app=boot();try{for(const [key,meta] of Object.entries(runtime.assets)){const b=read(base+meta.path);assert.equal(hash(b),meta.sha256);if(key!=='closed')assert.equal(app.w.TOPO_PIZZA_ART.assets[key],'data:image/webp;base64,'+b.toString('base64'))}}finally{app.close()}
 assert(html.includes(read('scripts/pizza-reward.js')));assert(html.includes(read('scripts/pizza-reward.css')));
 for(const p of ['scripts/learning-engine.js','scripts/route-engine.js','print.html'])assert.deepEqual(read(p),execFileSync('git',['show',`c68ace4:${p}`],{maxBuffer:16e6,cwd:root}));
});
test('each flavor and every 0–8 state use unique registered sectors; profile never selects reward',()=>{
 const a=boot();try{
  const flavors=['margherita','salami','quattro-formaggi'];
  for(const total of [0,1,2,3,37,3000002]){
   for(let n=0;n<=8;n++){
    a.ev(`state.pizzas=${total};state.slices=${Math.min(n,7)};state.favoritePizza='salami';sync()`);
    const snapshot=a.ev('JSON.stringify(progressSnapshot())');
    a.w.TopoPizza.draw(a.q('#journeyWheel'),n,total);
    assert.equal(a.q('#journeyWheel').dataset.flavor,flavors[total%3]);
    assert.equal(a.q('#journeyWheel').querySelectorAll('.earned').length,n);
    assert.equal(a.q('.pizzaPixels').style.backgroundPosition,`${n%3*50}% ${Math.floor(n/3)*50}%`);
    assert.equal(a.ev('JSON.stringify(progressSnapshot())'),snapshot,'presentation never mutates rewards');
   }
   a.ev('renderRewardHub()');assert.match(a.q('#journeySliceCount').textContent,/7 \/ 8/);
  }
  assert.equal(a.w.TopoPizza.flavor(3000003,true),'quattro-formaggi');
  assert.equal(a.w.TopoPizza.flavor(NaN),'margherita');
 }finally{a.close()}
});
test('actual eighth answer captures completed flavor before reset; trip follows Quattro box exactly once',()=>{
 for(const total of [0,1,2,3000002]){
  const a=boot();try{
   a.ev(`mode('write');state.pizzas=${total};state.slices=7;state.trips=Math.floor(${total}/3);sync()`);
   a.q('#answer').value=a.ev('state.current.name');a.q('#check').click();
   assert.equal(a.ev('state.pizzas'),total+1);assert.equal(a.ev('state.slices'),0);
   const key=a.w.TopoPizza.flavor(total+1,true),panel=a.q('#pizzaCelebration');
   assert.equal(panel.dataset.flavor,key);assert.equal(panel.dataset.phase,'full-pizza');
   assert.equal(panel.querySelector('.pizzaWheel').dataset.slices,'8');
   assert.equal(a.q('#rewardPizzaVisual').dataset.flavor,a.w.TopoPizza.flavor(total+1));
   const saved=a.ev('JSON.stringify(progressSnapshot())');a.ev('grade(true,state.current)');assert.equal(a.ev('JSON.stringify(progressSnapshot())'),saved);
   assert(a.q('#vespaTripToast').classList.contains('hidden'),'no journey before pizza');
   a.tick(320);assert.equal(panel.dataset.phase,'open-box');assert.equal(panel.querySelector('img').src,a.w.TOPO_PIZZA_ART.assets['box-'+key]);
   a.tick(900);
   if((total+1)%3===0){assert(!a.q('#vespaTripToast').classList.contains('hidden'));assert.equal(a.q('#arrivalArt').dataset.artRole,'arrival');assert.match(a.q('#vespaTripText').textContent,new RegExp(a.ev('TopoLearning.journey(state.trips).to')));a.tick(1500);a.tick(1500)}
   else assert(a.q('#vespaTripToast').classList.contains('hidden'));
   assert.equal(a.ev('JSON.stringify(progressSnapshot())'),saved,'animation grants nothing');
   const resumed=boot(saved);try{assert(resumed.q('#pizzaCelebration').hidden);assert(resumed.q('#vespaTripToast').classList.contains('hidden'));assert.equal(resumed.ev('state.pizzas'),total+1)}finally{resumed.close()}
   assert.deepEqual(a.errors,[]);
  }finally{a.close()}
 }
});
test('queued celebrations retain flavors; reset cancels pending trip without changing token ledger',()=>{
 const a=boot();try{
  a.ev("mode('write');state.pizzas=2;state.slices=7;sync()");a.q('#answer').value=a.ev('state.current.name');a.q('#check').click();
  const tokens=a.ev('JSON.stringify(state.route.rewardTokens)');a.q('#resetPizza').click();
  assert(a.q('#pizzaCelebration').hidden);assert(a.q('#vespaTripToast').classList.contains('hidden'));assert.equal(a.ev('state.pizzas'),0);assert.equal(a.ev('JSON.stringify(state.route.rewardTokens)'),tokens);
  a.ev("celebrateReward({pizza:true});state.pizzas=1;celebrateReward({pizza:true});state.pizzas=2;celebrateReward({pizza:true})");
  // First call has zero pizzas and cannot produce a celebration.
  assert.equal(a.q('#pizzaCelebration').dataset.flavor,'margherita');a.tick(320);a.tick(900);assert.equal(a.q('#pizzaCelebration').dataset.flavor,'salami');a.tick(320);a.tick(900);assert(a.q('#pizzaCelebration').hidden);
 }finally{a.close()}
});
test('corrupt save recovers safely and never fabricates a completion animation',()=>{
 for(const save of ['{broken',JSON.stringify({schema:3,pizzas:-100,slices:99,trips:'bad',good:null})]){
  const a=boot(save);try{assert(a.q('#pizzaCelebration').hidden);assert(a.q('#vespaTripToast').classList.contains('hidden'));assert(Number.isSafeInteger(a.ev('state.slices')));assert(a.ev('state.slices')<8);assert.deepEqual(a.errors,[])}finally{a.close()}
 }
});
