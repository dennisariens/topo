import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';

import { JSDOM, VirtualConsole } from 'jsdom';
const presentationTimers=[];
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const dom=new JSDOM(html,{url:'https://topo.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.setTimeout=(fn,delay)=>{presentationTimers.push({fn,delay});return presentationTimers.length};w.clearTimeout=id=>{if(presentationTimers[id-1])presentationTimers[id-1].cancelled=true};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};w.confirm=()=>true;w.print=()=>{}}});
const w=dom.window,document=w.document;
const get=selector=>document.querySelector(selector);
const tabs=['learn','point','write','exam','route'].map(m=>get('[data-mode="'+m+'"]'));
const inspect=expression=>w.eval(expression);
const stored={get:key=>w.localStorage.getItem(key)};
assert.deepEqual(errors,[],'complete app boots without errors');
assert.equal(inspect('state.mode'),'route','new learners see the journey first');
tabs[0].click();

assert.equal(get('#groupCount').textContent, '6 namen in deze groep');
assert.ok(get('#learnPrompt').textContent, 'learn mode booted with a visible name');
get('#learnNext').click();
get('#groupSelect').value = 'countries'; get('#groupSelect').onchange();
assert.equal(get('#groupCount').textContent, '7 namen in deze groep');
get('#nameToggle').onchange();
get('#schoolToggle').onchange({ target:{ checked:true } });
assert.equal(get('#school').classList.contains('hidden'), false);
get('#printMap').click(); // The in-app reference map is printable without navigation.
inspect('romeHit.dispatchEvent(new MouseEvent("click",{bubbles:true}))');
assert.equal(inspect('lens.classList.contains("hidden")'), false, 'Rome/Vatican selector opens on a tap');
inspect('lens.querySelectorAll("button")[1].click()');
assert.equal(get('#learnPrompt').textContent, 'Vaticaanstad', 'magnified selector can pick Vatican City');
assert.equal(get('#groupSelect').value, 'countries', 'selecting a map item updates its learning group');

tabs[1].click();
assert.equal(get('#groupCount').textContent, '7 namen in deze groep', 'pointing uses the selected group');
get('#groupSelect').value='city1';get('#groupSelect').onchange();
assert.ok(Number(inspect('state.current.code'))>=1 && Number(inspect('state.current.code'))<=6, 'pointing can practice cities 1–6');
get('#groupSelect').value='seas';get('#groupSelect').onchange();
assert.equal(get('#groupCount').textContent, '5 namen in deze groep');
assert.equal(inspect('state.current.kind'), 'water', 'pointing can practice only seas');
assert.match(get('#prompt').textContent, /^Waar ligt /);
inspect('elements[state.current.id].dispatchEvent(new MouseEvent("click",{bubbles:true}))');
assert.equal(Number(get('#good').textContent), 1, 'pointing awards a correct answer');
inspect('state.slices=7;state.pizzas=2;state.trips=0;next()');
inspect('elements[state.current.id].dispatchEvent(new MouseEvent("click",{bubbles:true}))');
assert.equal(inspect('state.pizzas'), 3, 'eight slices form another pizza');
assert.equal(inspect('state.trips'), 1, 'three pizzas advance the Vespa');
for(const delay of [320,900])presentationTimers.find(t=>t.delay===delay&&!t.cancelled).fn(); // Pizza/box precedes travel.
assert.match(get('#vespaTripText').textContent,/Nino rijdt naar /,'the earned milestone names the character and destination');
get('#next').click();
const skipped = inspect('state.current.id');
get('#next').click();
assert.equal(inspect('state.answered'), true, 'first Next on an unanswered question shows its answer');
assert.ok(inspect('state.mistakes').includes(skipped), 'skipped question enters the review list');
get('#next').click();
const revealed = inspect('state.current.id');
get('#reveal').click();
assert.ok(inspect('state.mistakes').includes(revealed), 'revealed question enters the review list');
get('#next').click();

tabs[2].click();
assert.equal(get('#inputWrap').classList.contains('hidden'), false);
get('#groupSelect').value='city2';get('#groupSelect').onchange();
assert.ok(Number(inspect('state.current.code'))>=7 && Number(inspect('state.current.code'))<=12, 'writing can practice cities 7–12');
get('#answer').value = inspect('state.current.name');
get('#check').click();
assert.equal(Number(get('#good').textContent), 3, 'typing a correct name works');

tabs[3].click();
assert.equal(get('#testSetup').classList.contains('hidden'), false);
get('#groupSelect').value='countries';get('#groupSelect').onchange();
assert.equal(get('#groupCount').textContent, '7 namen in deze toets');
get('#testFormat').value='point';get('#testFormat').onchange();
assert.match(get('#prompt').textContent,/^Waar ligt /);
inspect("elements[state.current.id].dispatchEvent(new MouseEvent('click',{bubbles:true}))");
get('#testFormat').value='write';get('#testFormat').onchange();
assert.match(get('#prompt').textContent,/Wat is dit/);
get('#answer').value=inspect('state.current.name');get('#check').click();
assert(get('#message').classList.contains('good'));
get('#groupSelect').value = 'city1'; get('#groupSelect').onchange();
assert.equal(get('#groupCount').textContent, '6 namen in deze toets');
get('#resetPizza').click();get('#resetAll').click();
assert.equal(Number(get('#good').textContent), 0, 'reset button clears progress');
assert.match(get('#prompt').textContent, /Wat is dit/, 'test remains usable after reset');
console.log('Full standalone boot and learn/point/write/exam/reset button flow: OK');

// Drive every chapter through the visible controls, including both enclave choices.
tabs[4].click();
assert.equal(get('#routeHome').classList.contains('hidden'),false);
assert.equal(document.querySelectorAll('#routeCards .routeCard').length,11);
assert.equal(inspect('TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,"city2")'),false);
get('#routeContinue').click();
assert.equal(inspect('state.questionMode'),'discover');
get('#next').click();
const resumeIndex=inspect('state.route.active.index');
tabs[0].click();tabs[4].click();get('#routeContinue').click();
assert.equal(inspect('state.route.active.index'),resumeIndex,'switching away resumes the same card');
assert.equal(get('#routeMapDock').classList.contains('hidden'),false,'small-screen dock available in route lesson');
let deliberatelyWrong=false,routeActions=0;
function answerRouteTask(useDock=false){
 if(inspect('roundPaused')){get('#finishScreen .button').click();return}
 const mode=inspect('state.questionMode'),id=inspect('state.current?.id');
 if(mode==='discover'){get('#next').click();return}
 if(!deliberatelyWrong&&mode==='point'){
   deliberatelyWrong=true;get('#next').click();
   assert.equal(inspect('state.route.active.wrong'),1);
 }else if(mode==='point'){
   if(id==='area-o'||id==='city-9'){
     inspect('romeHit.dispatchEvent(new MouseEvent("click",{bubbles:true}))');
     document.querySelectorAll('#mapPicker .pickerActions button')[id==='city-9'?0:1].click();
   }else if(id==='area-n')inspect('sanHit.dispatchEvent(new MouseEvent("click",{bubbles:true}))');
   else inspect('elements[state.current.id].dispatchEvent(new MouseEvent("click",{bubbles:true}))');
 }else{
   const answer=inspect(mode==='nameCode'?'state.current.code':'state.current.name');
   if(useDock){get('#routeDockAnswer').value=answer;get('#routeDockCheck').click()}
   else{get('#answer').value=answer;get('#check').click()}
 }
 assert.equal(inspect('state.answered'),true,'route answer accepted through its control');
 const good=inspect('state.good');get('#check').click();assert.equal(inspect('state.good'),good,'disabled check cannot duplicate a slice');
 if(useDock)get('#routeDockNext').click();else get('#next').click();
}
const chapterIds=inspect('ROUTE_CHAPTERS.map(c=>c.id)');
for(const chapterId of chapterIds){
 if(chapterId!=='city1'){
   assert.equal(document.querySelectorAll('#routeCards .ninoBadge').length,1,'Nino moves to the next available chapter');
   get('#routeContinue').click();
 }
 while(inspect(`TopoRoute.record(state.route,${JSON.stringify(chapterId)}).stage`)<3){
   if(inspect('state.route.active.done'))get('#next').click();
   else answerRouteTask(++routeActions%2===0);
   assert.ok(routeActions<650,'route cannot silently loop forever');
 }
 assert.equal(inspect('state.route.active.result.newlyCompleted'),true);
 get('#routeExtra').click();
 assert.equal(inspect('state.route.active.kind'),'gold');
 while(!inspect('state.route.active.done'))answerRouteTask(++routeActions%2===0);
 assert.ok(inspect(`TopoRoute.record(state.route,${JSON.stringify(chapterId)}).goldAt`)>0,'gold earned after point and write coverage');
 get('#next').click();
}
assert.match(get('#routeSummary').textContent,/11 \/ 11.*11 goud/);
assert.ok(JSON.parse(stored.get('topo-italie-v3')).route.chapters.rivers.goldAt>0,'last chapter and gold persisted');
const beforeReset=inspect('state.pizzas');
get('#routeReset').click();
assert.equal(inspect('state.pizzas'),beforeReset,'route-only reset preserves earned pizzas');
assert.equal(inspect('TopoRoute.record(state.route,"city1").stage'),0);
tabs[1].click();get('#resetAll').click();
assert.equal(inspect('state.good'),0);
assert.equal(inspect('Object.keys(state.route.chapters).length'),0,'full reset removes route progress');
console.log('All 11 route chapters and gold tests, dock controls, mode switch, resume and reset: OK');

assert.deepEqual(errors,[]);dom.window.close();
