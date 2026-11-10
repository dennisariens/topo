import test from 'node:test';
import assert from 'node:assert/strict';
import {boot,answer,NOW,plain} from './support.mjs';

test('Reis → Verder preserves the route question, draft and backward selection',async t=>{
 const a=await boot(t);
 assert.equal(a.q('.v3Row[data-chapter="city1"]').dataset.state,'now');
 for(const row of a.d.querySelectorAll('.v3Row:not([data-chapter="city1"])'))assert.equal(row.dataset.state,'locked');
 a.ev("TopoRoute.record(state.route,'city1').stage=2;renderRouteHome()");a.w.TOPO_V3.render();a.q('.v3Panel .v3Actions button').click();await a.flush();
 assert.equal(a.ev('state.mode'),'route');assert.equal(a.ev('state.questionMode'),'write');
 const input=a.q('#answer');input.value='Nog niet af';input.focus();input.setSelectionRange(2,7,'backward');const before=a.snapshot();
 for(let n=0;n<2;n++){
  a.w.TOPO_V3.go('reis');await a.flush();a.q('.v3Panel .v3Actions button').click();await a.flush();
  assert.deepEqual(a.snapshot(),before);assert.equal(a.w.TOPO_V3.currentTab(),'reis');
  assert.equal(a.w.TOPO_V3.shell.atHome(),false);assert.equal(a.q('#quiz').classList.contains('hidden'),false);assert.equal(a.q('.layout').classList.contains('routeLessonLayout'),true);
 }
});

test('Oefenen → Reis → Oefenen preserves question, text, selection and saved progress',async t=>{
 const a=await boot(t);a.w.TOPO_V3.shell.practice('write','city2');await a.flush();
 const input=a.q('#answer');input.value='Vene';input.focus();input.setSelectionRange(1,3,'backward');const before=a.snapshot(),saved=a.w.localStorage.getItem('topo-italie-v3');
 for(let n=0;n<2;n++){
  a.w.TOPO_V3.go('reis');await a.flush();a.w.TOPO_V3.go('oefenen');await a.flush();
  assert.deepEqual(a.snapshot(),before);assert.equal(a.w.localStorage.getItem('topo-italie-v3'),saved);assert.equal(a.w.TOPO_V3.currentTab(),'oefenen');assert.equal(a.w.TOPO_V3.shell.atHome(),false);assert.equal(a.q('#quiz').classList.contains('hidden'),false);
 }
});

test('completed pointing replay gives daily credit once per accepted answer, but no new reward',async t=>{
 const a=await boot(t);a.ev("TopoRoute.record(state.route,'city1').stage=2;state.route=TopoRoute.restore(state.route,ROUTE_CHAPTERS);startRouteLesson('city1','point')");
 const before=a.json('[state.good,state.pizzas,state.slices,state.trips,state.route.rewardTokens]');
 for(let n=0;n<6;n++){
  answer(a);const after=a.w.localStorage.getItem('topo-italie-v3');a.ev('routeGrade(true)');assert.equal(a.w.localStorage.getItem('topo-italie-v3'),after);
  a.q('#next').click();
 }
 assert.equal(a.ev('state.daily.correct'),6);assert.deepEqual(a.json('[state.good,state.pizzas,state.slices,state.trips,state.route.rewardTokens]'),before);
 assert.equal(a.ev('state.route.chapters.city1.stage'),2);
 const saved=a.storage();const b=await boot(t,{storage:saved});assert.equal(b.ev('state.daily.correct'),6);
 b.clock.advance(86400000);b.ev('renderDailyGoal()');assert.equal(b.q('#dailyProgress').value,0,'new day shows zero without losing lifetime rewards');
});

test('knowledge passport and V3 mastery use both streaks >=3 and a strictly future due time',async t=>{
 const a=await boot(t);
 a.ev(`for(const mode of ['point','write'])for(let n=0;n<3;n++)TopoRoute.track(state.route,'city-1',mode,true,Date.now());
  for(const mode of ['point','write'])for(let n=0;n<(mode==='point'?2:3);n++)TopoRoute.track(state.route,'city-2',mode,true,Date.now());
  for(const mode of ['point','write']){TopoRoute.track(state.route,'city-3',mode,true,Date.now());state.route.items['city-3'].skills[mode].streak=3;state.route.items['city-3'].skills[mode].due=Date.now();}
  state.route.items['city-4']={correct:10,wrong:0,streak:10,lastSeen:Date.now(),lastWrong:0};
  TopoRoute.record(state.route,'city1').stage=3;TopoRoute.record(state.route,'city1').goldAt=Date.now();`);
 a.w.TOPO_V3.go('voortgang');await a.flush();
 const passport=()=>a.json('TOPO_V3.voortgang.passport().map(p=>({id:p.item.id,find:p.find,name:p.name,status:p.status}))');
 const rows=passport();assert.equal(rows.length,45);
 assert.deepEqual(rows.slice(0,4),[
  {id:'city-1',find:'Goed onthouden',name:'Goed onthouden',status:'beheerst'},
  {id:'city-2',find:'Op weg',name:'Goed onthouden',status:'bezig'},
  {id:'city-3',find:'Opfrissen',name:'Opfrissen',status:'bezig'},
  {id:'city-4',find:'Nog oefenen',name:'Nog oefenen',status:'nog'}]);
 assert.equal(a.q('.v3VgCount strong').textContent,'1 / 45');
 assert.equal(a.d.querySelectorAll('#masteryGrid tbody tr').length,45);assert.equal(a.d.querySelectorAll('.v3VgChapters li').length,11);
 assert.equal(a.q('.v3VgChapters [data-chapter="city1"] .v3VgGold').textContent,'★');
 a.clock.advance(7*86400000-1);assert.equal(passport()[0].status,'beheerst');a.clock.advance(1);assert.equal(passport()[0].status,'bezig','due == now needs refresh');
});

test('TopoBook and Schoolblad preserve progress; Schoolblad returns the draft and is blocked in exam/gold',async t=>{
 const a=await boot(t);const before=a.json('progressSnapshot()');
 a.w.TopoBook.open(a.q('.v3Panel'),'stamps');assert.equal(a.w.TopoBook.element.open,true);a.w.TopoBook.element.close();await a.flush();assert.deepEqual(a.json('progressSnapshot()'),before);
 a.w.TOPO_V3.shell.practice('write','city1');await a.flush();const input=a.q('#answer');input.value='Floren';input.focus();input.setSelectionRange(1,4,'backward');const snap=a.snapshot();
 a.w.TOPO_V3.schoolblad.open(null,input);assert.equal(a.q('#schoolbladDialog').open,true);a.q('#schoolbladDialog').close();await a.flush();assert.deepEqual(a.snapshot(),snap);
 a.ev("state.mode='exam'");assert.equal(a.w.TOPO_V3.schoolblad.blocked(),true);a.w.TOPO_V3.schoolblad.open(null,input);assert.equal(a.q('#schoolbladDialog').open,false);
 a.ev("state.mode='route';document.body.dataset.v3Kind='gold'");assert.equal(a.w.TOPO_V3.schoolblad.blocked(),true);
});

test('gold keeps all twelve tasks across the six-question pause; answered reload cannot award twice',async t=>{
 let a=await boot(t);a.ev("TopoRoute.record(state.route,'city1').stage=3;state.route=TopoRoute.restore(state.route,ROUTE_CHAPTERS);startRouteLesson('city1','gold')");
 let answered=0,pauses=0;
 while(!a.ev('state.route.active.done')){
  if(a.ev('roundPaused')){pauses++;assert.equal(answered,6);assert.equal(a.ev('state.route.active.queue.length'),12);a.ev('routeNext()');continue;}
  answer(a);answered++;
  if(answered===1){
   const saved=a.storage(),before=a.json('progressSnapshot()'),id=a.ev('state.current.id');a.close();a=await boot(t,{storage:saved});a.q('#routeContinue').click();await a.flush();
   assert.equal(a.ev('state.current.id'),id);assert.equal(a.ev('state.answered'),true);a.ev('routeGrade(true)');assert.deepEqual(a.json('progressSnapshot()'),before);
  }
  a.q('#next').click();
 }
 assert.equal(answered,12);assert.equal(pauses,1);assert.equal(a.ev('state.daily.correct'),12);
 assert.equal(a.ev('state.good'),12);assert.equal(a.ev('state.route.chapters.city1.goldAt'),NOW);
});

test('startup migration keeps legacy rewards; skipped introduction is offered once before the first lesson',async t=>{
 const legacy=await boot(t,{storage:{'topo-italie-v3':null,'topo-italie-v2':{good:17,pizzas:7,pizzaSteps:3,mistakes:['area-a']}}});
 assert.deepEqual(legacy.json('[state.good,state.pizzas,state.slices,state.trips,state.mistakes]'),[17,7,4,2,['area-a']]);
 const a=await boot(t,{storage:{'topo-nino-profile-v1':null,'topo-nino-intro-v1':null}});
 assert.equal(a.q('dialog.ninoProfile').dataset.v3,'welkom');a.q('[data-profile-cancel]').click();await a.flush();
 assert.equal(a.w.localStorage.getItem('topo-nino-intro-v1'),'skipped');assert.equal(a.w.TOPO_V3.ui.selected,'city1');
 a.q('.v3Panel .v3Actions button').click();await a.flush();const offer=a.q('dialog.ninoIntroOffer');assert.equal(offer.open,true);
 [...offer.querySelectorAll('button')].find(b=>b.textContent==='Start meteen').click();await a.flush();assert.equal(a.ev('state.mode'),'route');assert.notEqual(a.ev('state.current'),null);
 a.w.TOPO_V3.go('reis');await a.flush();a.q('.v3Panel .v3Actions button').click();await a.flush();assert.equal(a.q('dialog.ninoIntroOffer'),null,'one-time offer does not recur');
});
