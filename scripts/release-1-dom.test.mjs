import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const legacy={schema:3,good:241,pizzas:30,slices:1,trips:10,mistakes:['area-o'],daily:{date:'2000-01-01',correct:99},route:{schema:1,chapters:{city1:{stage:4,completedAt:123,goldAt:456,nextReviewAt:789,reviews:2},city2:{stage:3}},items:{'city-1':{correct:12,wrong:3,streak:2,lastSeen:777}},active:{chapterId:'city2',kind:'codes',queue:[{id:'city-7',mode:'codeName'}]}}};
const dom=new JSDOM(html,{url:'https://topo.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
 w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};
 w.localStorage.setItem('topo-italie-v3',JSON.stringify(legacy));
}});
const w=dom.window,d=w.document,q=id=>d.getElementById(id),ev=s=>w.eval(s);
assert.equal(ev('state.pizzas'),30);assert.equal(ev('state.trips'),10);assert.equal(ev('state.good'),241);
assert.equal(ev('state.route.chapters.city1.stage'),3);assert.equal(ev('state.route.chapters.city1.goldAt'),456);assert.equal(ev('state.route.chapters.city2.stage'),3);
assert.equal(ev('state.route.active'),null,'obsolete code exercise closes without removing writing completion');
assert.equal(ev('state.route.items["city-1"].correct'),12);assert.equal(ev('Object.keys(state.route.items["city-1"].skills).length'),0,'legacy aggregate is not invented as two skill scores');
q('smartStart').click();let before=ev('state.good');
for(let n=0;n<6;n++){
 const ok=n<2,mode=ev('state.questionMode');
 if(mode==='point')ev(`grade(${ok},state.current)`);
 else{q('answer').value=ok?ev('state.current.name'):'geen antwoord';q('check').click()}
 q('next').click();
}
assert.equal(ev('state.good'),before+2);
assert.equal(ev('state.daily.correct'),2,'new local day starts at zero independently of lifetime rewards');
assert.equal(d.querySelector('.finishStats b').textContent,'2','round result is not lifetime good total');
assert.match(d.querySelector('.finishStats').textContent,/4oefenmomenten/);
assert.equal(ev('state.route.chapters.city2.stage'),3,'adaptive work preserves route locks and completions');
ev('state.route.active.answers=[];renderJourneyFinish(false)');assert.equal(d.querySelector('.finishStats b').textContent,'—','missing legacy round history is never reported as zero');assert.match(q('finishScreen').textContent,/Hele les: 2 goed/);
ev("mode('write')");
for(const id of ['area-n','area-o']){
 ev(`state.current=byId['${id}'];state.questionMode='write';state.answered=false;highlight(state.current)`);
 const ring=d.querySelector('.microLocator circle');assert.equal(+ring.getAttribute('cx'),ev('state.current.px'));assert.equal(+ring.getAttribute('cy'),ev('state.current.py'));
 assert.equal(q('microZoom').hidden,false);q('check').disabled=false;q('answer').value=ev('state.current.name');q('check').click();assert.equal(ev('state.answered'),true);
 assert.equal(ev(`state.route.items['${id}'].skills.write.correct`),1);
 assert.equal(ev(`state.route.items['${id}'].skills.point`),undefined,'writing does not mark pointing mastered');
}
ev("mode('point');state.current=byId['area-o'];state.answered=false;state.questionMode='point'");
ev('romeHit.dispatchEvent(new MouseEvent("click",{bubbles:true}))');
assert(q('mapPicker').hasAttribute('open'));assert(!/Rome|Vaticaan/.test(q('mapPicker').textContent));
assert(q('romeLens').classList.contains('hidden'));
q('mapPicker').querySelector('[data-map-choice="area-o"]').click();assert(q('message').classList.contains('good'));
for(const id of ['water-F','water-G']){
 const hit=d.querySelector('[data-hit-id="'+id+'"]');assert.equal(hit.getAttribute('stroke-width'),'44');assert.equal(hit.getAttribute('vector-effect'),'non-scaling-stroke');
 assert.equal(hit.getAttribute('d'),ev(`byId['${id}'].shape`));
}
for(const id of ['area-n','area-o']){
 ev(`state.current=byId['${id}'];state.questionMode='point';state.answered=false`);
 const mark=d.querySelector('.microstate[data-id="'+id+'"]');assert.equal(mark.getAttribute('tabindex'),'0');
 mark.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 assert.equal(ev('state.answered'),true,'visible microstate is keyboard actionable');assert(q('message').classList.contains('good'));
}
const daily=ev('state.daily.correct');q('resetPizza').click();assert.equal(ev('state.daily.correct'),daily);assert.equal(ev('state.route.chapters.city1.goldAt'),456);
q('resetAll').click();assert.equal(ev('state.daily.correct'),0);assert.equal(ev('state.good'),0);assert.equal(ev('state.route.rewardTokens.length'),0);assert.equal(ev('Object.keys(state.route.items).length'),0);
assert.deepEqual(errors,[]);dom.window.close();console.log('Legacy saves, skill isolation, round/lifetime scores, neutral keyboard picker, microstate highlights, river tolerance and daily reset: OK');
