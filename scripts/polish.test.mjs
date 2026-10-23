import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{url:'https://topo.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=()=>{}}});
const w=dom.window,d=w.document,ev=s=>w.eval(s),q=id=>d.getElementById(id);
assert.equal(d.querySelectorAll('.routeCard').length,11);
assert.equal(d.querySelectorAll('.chapterIcon').length,11);
for(const icon of d.querySelectorAll('.chapterIcon')){
 const reference=icon.querySelector('use').getAttribute('href');assert.notEqual(reference,'#topo-point','registered chapter never needs fallback');
 assert(d.querySelector(reference)?.querySelector('path,circle,rect'),'defined nonempty chapter symbol: '+icon.dataset.chapter);
}
assert.equal(d.querySelector('[data-chapter="islands"] .chapterIcon use').getAttribute('href'),'#topo-island');
assert.equal(q('futureStops').open,false,'future stops collapse by default');assert.equal(d.querySelectorAll('.routeCard.nextPreview').length,1);
assert.equal(d.querySelector('[aria-current="step"]').dataset.chapter,'city1');
for(const button of d.querySelectorAll('nav .tab'))assert.equal(button.getAttribute('aria-pressed'),String(button.dataset.mode==='route'));
assert.equal(q('routeIntro').dataset.event,'ENTRY.FIRST');assert.equal(q('routeContinue').textContent,'Start mijn reis');
assert(!q('smartStart').classList.contains('primary'),'fresh learner has one primary hero action');
assert(!html.includes('5 goede antwoorden = 1 pizza'),'static preview contains no stale reward rule');
assert.match(d.querySelector('.badge').textContent,/8 pizzapunten = 1 pizza/);
assert.equal(q('mapAbout').tagName,'DETAILS');assert.equal(q('mapAbout').open,false);assert.equal(q('mapAbout').querySelector('summary').textContent,'Over de kaart');assert.match(q('mapAbout').textContent,/Natural Earth/);
const N=w.TopoNino;
assert.equal(new Set(Array.from({length:3},()=>N.answer({ok:true,mode:'point',place:'Rome'}))).size,3,'common feedback varies without persisting learner data');
assert.equal(N.resolve('CHAPTER.POSTCARD'),'', 'NEXT content cannot be resolved');assert.equal(N.resolve('PROMPT.TYPO_RETRY'),'');assert.equal(N.resolve('ANSWER.WRONG_WITH_HINT'),'');
assert.equal(N.answer({ok:false,mode:'point',place:'Oostenrijk',chosen:'Slovenië'}),'Dat was Slovenië. Gezocht: Oostenrijk.');
assert(!/pizza|rit/.test(N.answer({ok:true,mode:'point',place:'Rome',earned:false})),'replay cannot claim a reward');
assert.match(N.answer({ok:true,mode:'write',reward:{pizza:true}}),/pizza compleet/);
assert.match(N.answer({ok:true,mode:'point',reward:{trip:true,pizza:true,to:'Florence'}}),/Florence/);
assert(!/hint|probeer/.test(N.answer({ok:true,mode:'exam',place:'Rome',reward:{pizza:true}})),'no new formal-test assistance promises');
assert.match(N.answer({ok:true,mode:'exam',place:'Rome',reward:{pizza:true}}),/pizza verdiend/,'existing exam reward feedback remains truthful');
q('routeContinue').click();assert.equal(q('routeLessonIntro').dataset.event,'DISCOVER.OPEN');
while(!ev('state.route.active.done'))q('next').click();
assert.equal(q('finishScreen').dataset.event,'ROUND.RESULT_NO_RETRIEVAL');assert(!/goed in dit rondje/.test(q('finishTitle').textContent));
q('routeBack').click();assert.equal(q('routeIntro').dataset.event,'ENTRY.RETURN');
ev("startRouteLesson('city1','point')");
const current=ev('state.current.name'),chosen=ev('ITEMS.find(i=>i.id!==state.current.id)');
ev(`grade(false,byId[${JSON.stringify(chosen.id)}])`);
assert.equal(q('message').textContent,'Dat was '+chosen.name+'. Gezocht: '+current+'.','route preserves actual wrong selected ID');
const checkpoint=w.localStorage.getItem('topo-italie-v3');q('routeBack').click();assert.equal(q('routeIntro').dataset.event,'ENTRY.RESUME');assert.match(q('routeContinue').textContent,/Ga verder/);
// Stable current/next grouping moves with the existing chapter state, without unlocking later stops.
ev("state.route.active=null;TopoRoute.record(state.route,'city1').stage=3;TopoRoute.record(state.route,'city1').goldAt=123;renderRouteHome()");
assert.equal(d.querySelector('[aria-current="step"]').dataset.chapter,'city2');assert.equal(q('completedStops').open,false);
assert(q('completedStops').querySelector('.goldButton'),'Gold and stage replay remain reachable');assert.equal(q('completedStops').querySelectorAll('.routeStep').length,3);
assert.equal(d.querySelector('.nextPreview').dataset.chapter,'city3');
ev("document.getElementById('topo-island').remove();renderRouteHome()");assert.equal(d.querySelector('[data-chapter="islands"] .chapterIcon use').getAttribute('href'),'#topo-point','missing symbols have a visible fallback');
// True engine outcomes, not six-question pauses, select chapter/gold celebrations.
ev("for(const c of ROUTE_CHAPTERS)TopoRoute.record(state.route,c.id).stage=3;state.route.active=null;TopoRoute.start(state.route,ROUTE_CHAPTERS,'countries','gold');mode('route');renderRouteTask()");
for(let n=0;n<6;n++){ev('routeGrade(true)');q('next').click()}
assert.equal(q('finishScreen').dataset.event,'ROUND.PAUSE');assert(!/Goud verdiend/.test(q('finishTitle').textContent));assert.equal(ev('state.route.chapters.countries.goldAt'),0);
function finishGold(){
 while(!ev('state.route.active.done')){
  if(ev('roundPaused')){q('finishScreen').querySelector('.button').click();continue}
  ev('routeGrade(true)');q('next').click();
 }
}
finishGold();assert.equal(q('finishScreen').dataset.event,'CHAPTER.GOLD');
const rewards=ev('JSON.stringify([state.good,state.pizzas,state.slices,state.trips])');ev("startRouteLesson('countries','gold')");finishGold();
assert.equal(q('finishScreen').dataset.event,'CHAPTER.GOLD_REPLAY');assert.equal(ev('JSON.stringify([state.good,state.pizzas,state.slices,state.trips])'),rewards);
ev("startRouteLesson('countries','gold');routeGrade(false);routeNext()");finishGold();assert.equal(q('finishScreen').dataset.event,'CHAPTER.GOLD_MISSED');
q('routeBack').click();assert.equal(q('routeIntro').dataset.event,'ENTRY.COMPLETE');assert.equal(d.querySelectorAll('.routeCard').length,11);
assert.deepEqual(errors,[]);assert(checkpoint);dom.window.close();
console.log('Release 1.1: eleven icon references/fallback, route disclosures, eight-slice copy, NOW gating and truthful Nino outcomes: PASS');
