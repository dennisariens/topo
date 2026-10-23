import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';
const html=readFileSync(new URL('../output/html/topo-italie-duolingo.html',import.meta.url),'utf8');
function boot(saved=null,blocked=false){
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',error=>errors.push(error.message));
 const dom=new JSDOM(html,{url:'https://topo.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
   w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;w.print=()=>{};
   if(blocked)Object.defineProperty(w,'localStorage',{value:{getItem(){return null},setItem(){throw Error('storage disabled')}}});
   else if(saved!==null)w.localStorage.setItem('topo-italie-v3',saved);
 }});
 const {window:w}=dom,d=w.document;
 assert.deepEqual(errors,[],'complete HTML boot has no runtime errors');
 assert.equal(w.eval('state.mode'),'route','the learning route is the landing screen');
 const q=id=>{const element=d.getElementById(id);assert.ok(element,'real markup contains '+id);return element};
 return {dom,w,d,q,errors,state:()=>w.eval('state')};
}
// Resolve the actual badge/stage references, not just the number of <use> nodes.
const icons=boot();
for(const status of ['locked','complete','gold']){
 if(status!=='locked')icons.w.eval(`for(const chapter of ROUTE_CHAPTERS){const record=TopoRoute.record(state.route,chapter.id);record.stage=3;record.goldAt=${status==='gold'?123:0}}renderRouteHome()`);
 const badges=[...icons.d.querySelectorAll('#routeCards .routeBadge svg use')];
 assert.equal(badges.length,status==='locked'?10:11,status+': all category badges are represented');
 for(const use of icons.d.querySelectorAll('#routeCards svg use')){
  const target=icons.d.querySelector(use.getAttribute('href'));
  assert.ok(target,status+': defined SVG symbol for '+use.getAttribute('href'));
  assert.equal(target.localName,'symbol');
  assert.ok(target.querySelector('path,circle,rect,ellipse,polygon,polyline,line'),status+': nonempty icon artwork');
 }
}
icons.dom.window.close();
assert.doesNotMatch(html,/5 goede antwoorden\s*=\s*1 pizza/,'standalone markup never advertises the obsolete five-answer reward');
assert.match(html,/8 goede antwoorden\s*=\s*1 pizza/,'standalone markup explains the existing eight-answer reward');
let app=boot(),{q,w,d}=app;
assert.equal(q('journeyScreen').classList.contains('hidden'),false,'dedicated route screen is shown on arrival');
assert.equal(d.querySelectorAll('#routeCards .routeCard').length,11,'all future stops are visible');
assert.equal(d.querySelectorAll('#routeCards .routeStep').length,33,'three stages are shown per stop');
assert.equal(d.querySelectorAll('#journeyWheel .wheelSlice').length,8,'the reward draws eight distinct earned wedges');
assert.equal(d.querySelectorAll('#routeCards .routeBadge svg use').length,10,'completed and future chapters keep their category icon');
assert.equal(d.querySelectorAll('#routeCards .routeBadge.ninoBadge').length,1,'Nino travels to the current stop');
assert.equal(d.querySelectorAll('#routeCards .routeStep svg use').length,33,'each stage has an actionable visual icon');
assert.match(d.querySelector('.routeScene img').getAttribute('src'),/^data:image\/webp;base64,/,'the new original panorama works as one-file HTML');
assert.ok(d.querySelector('.brandMark'),'Nino appears in the app header');
assert.equal(d.querySelectorAll('#routeCards .routeCard.locked .routeStep:not([disabled])').length,0,'future lessons are locked');
assert.equal(d.querySelectorAll('#routeCards .routeCard.current .routeStep:not([disabled])').length,1);
d.querySelector('[data-mode="route"]').click();q('routeContinue').click();
assert.equal(q('journeyScreen').classList.contains('hidden'),true,'map replaces the overview during a lesson');
assert.equal(app.state().questionMode,'discover');
q('next').click();
let checkpoint=w.localStorage.getItem('topo-italie-v3');
const index=app.state().route.active.index;app.dom.window.close();
app=boot(checkpoint);({q,w,d}=app);
d.querySelector('[data-mode="route"]').click();q('routeContinue').click();
assert.equal(app.state().route.active.index,index,'page reload resumes lesson card');
while(!app.state().route.active.done)q('next').click();
q('next').click();
assert.equal(app.state().questionMode,'point');
const target=app.state().current.id;d.querySelector('[data-id="'+target+'"]').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
assert.equal(app.state().answered,true,'SVG click works with real DOM event propagation');
assert.equal(d.querySelectorAll('#rewardPizzaVisual .wheelSlice.earned').length,app.state().slices,'earned pizza art follows actual reward state');
const good=app.state().good;
checkpoint=w.localStorage.getItem('topo-italie-v3');app.dom.window.close();
app=boot(checkpoint);({q,w,d}=app);
d.querySelector('[data-mode="route"]').click();q('routeContinue').click();
assert.equal(app.state().answered,true);assert.equal(app.state().good,good);
q('check').click();assert.equal(app.state().good,good,'reloading the feedback cannot earn another slice');
q('next').click();q('routeBack').click();
assert.equal(q('routeHome').classList.contains('hidden'),false,'overview back button works');
assert.equal(q('journeyScreen').classList.contains('hidden'),false);
assert.equal(d.querySelectorAll('#journeyWheel .wheelSlice.earned').length,app.state().slices,'route reward artwork reflects earned slices after return');
assert.equal(d.querySelectorAll('#routeCards .routeCard.current .routeStep.done').length,1,'completed lesson is offered again');
d.querySelector('#routeCards .routeCard.current .routeStep.done').click();
assert.equal(app.state().questionMode,'discover','finished stage can be replayed');
q('routeBack').click();
d.querySelector('[data-mode="learn"]').click();
assert.ok(d.querySelector('#learn .ninoCoach'),'the free Learn mode includes the same guide');
q('groupSelect').value='countries';q('groupSelect').dispatchEvent(new w.Event('change'));
const lensTrigger=d.querySelector('[aria-controls="romeLens"]');lensTrigger.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
assert.match(q('romeLens').textContent,/helemaal omsloten door de stad Rome/);
q('romeLens').querySelector('[data-choice="area-o"]').click();
assert.equal(q('learnPrompt').textContent,'Vaticaanstad');
const actualIds=[...d.querySelectorAll('[id]')].map(node=>node.id);
assert.equal(new Set(actualIds).size,actualIds.length,'all actual DOM IDs are unique');
assert.deepEqual(app.errors,[]);app.dom.window.close();
const corrupt=boot('null');assert.ok(corrupt.q('learnPrompt').textContent);corrupt.dom.window.close();
const blocked=boot(null,true);assert.equal(blocked.q('storageNote').classList.contains('hidden'),false,'storage failure is explained without disabling lessons');blocked.dom.window.close();
console.log('Real HTML DOM: controls, SVG events, reload, atomic rewards, unique IDs, enclave and storage failure: OK');

const meter=boot();
for(let k=0;k<100;k++){
 meter.w.eval(`state.pizzas=${k};state.slices=${k%8};state.trips=${Math.floor(k/3)};sync()`);
 assert.equal(meter.d.querySelectorAll('#journeyWheel .earned').length,k%8);
 assert.equal(meter.q('journeyTripDots').textContent,(k%3)+' / 3 pizza’s voor de volgende rit');
}
meter.dom.window.close();
