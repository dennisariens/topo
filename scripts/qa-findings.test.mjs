import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
const html=readFileSync(process.env.QA_HTML||new URL('../index.html',import.meta.url),'utf8');
function boot(saved){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 let confirmations=0;
 const dom=new JSDOM(html,{url:'https://topo-qa.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  w.confirm=()=>{confirmations++;return true};w.HTMLElement.prototype.scrollIntoView=()=>{};
  if(saved)w.localStorage.setItem('topo-italie-v3',saved);
 }});
 const w=dom.window,d=w.document;
 assert.deepEqual(errors,[]);
 return {w,d,ev:s=>w.eval(s),q:id=>d.getElementById(id),errors,confirmations:()=>confirmations,close:()=>dom.window.close()};
}
let app=boot();
function snapshot(){return app.ev('JSON.stringify(progressSnapshot())')}
function normalized(text){const value=JSON.parse(text);value.route.rewardTokens.sort();return value}
function daily(){return app.ev('state.daily.correct')}
function rewards(){return app.ev('JSON.stringify([state.good,state.pizzas,state.slices,state.trips,[...state.route.rewardTokens].sort()])')}
function start(kind){app.q('routeBack').click();const n=['discover','point','write'].indexOf(kind);if(n>=0)app.d.querySelectorAll('.routeCard .routeStep')[n].click();else app.d.querySelector('.routeCard .goldButton').click()}
function complete({reload=false}={}){
 let answers=0;
 while(!app.ev('state.route.active.done')){
  if(app.ev('roundPaused')){app.q('finishScreen').querySelector('.button').click();continue}
  const mode=app.ev('state.questionMode');
  if(mode==='discover'){app.q('next').click();answers++;continue}
  if(mode==='point')app.ev('elements[state.current.id].dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}))');
  else{app.q('answer').value=app.ev('state.current.name');app.q('check').click()}
  assert(app.ev('state.answered'));
  const accepted=snapshot();app.ev('routeGrade(true)');assert.equal(snapshot(),accepted,'resubmission changes neither daily credit nor rewards/history');
  if(reload&&answers===0){
   const saved=app.w.localStorage.getItem('topo-italie-v3');app.close();app=boot(saved);app.q('routeContinue').click();
   assert.deepEqual(normalized(snapshot()),normalized(accepted),'reload of answered feedback does not count again');
   app.ev('routeGrade(true)');assert.deepEqual(normalized(snapshot()),normalized(accepted),'resubmit after reload is ignored');
  }
  app.q('next').click();answers++;
 }
 return answers;
}
app.q('routeContinue').click();complete();assert.equal(daily(),0,'discover is not retrieval');
start('point');assert.equal(complete(),6);assert.equal(daily(),6);
const beforeStage=rewards();start('point');assert.equal(complete({reload:true}),6);
assert.equal(daily(),12,'QA-1 completed pointing replay earns six daily credits');assert.equal(rewards(),beforeStage,'point replay mints no duplicate reward');
start('write');complete();assert.equal(daily(),18);
start('gold');assert.equal(complete(),12);assert.equal(daily(),30);
const beforeGold=rewards();start('gold');assert.equal(complete({reload:true}),12);
assert.equal(daily(),42,'QA-1 gold replay counts every accepted point/write retrieval');assert.equal(rewards(),beforeGold,'gold replay mints no duplicate reward');
assert.deepEqual(app.errors,[]);
const valid=JSON.parse(snapshot());
const envelope=route=>JSON.stringify({app:'topo-italie',version:1,progress:{...valid,route}});
async function importText(text){await app.q('backupFile').onchange({target:{files:[{size:text.length,text:async()=>text}],value:'backup.json'}})}
const invalid=[
 ['unsupported schema',{schema:999}],['missing schema',{chapters:{},items:{},active:null}],['array',[]],['null',null],
 ['missing chapters',{schema:2,items:{},active:null}],['array chapters',{schema:2,chapters:[],items:{},active:null}],
 ['missing items',{schema:2,chapters:{},active:null}],['array items',{schema:2,chapters:{},items:[],active:null}],
 ['missing active',{schema:2,chapters:{},items:{}}],['invalid chapter record',{...valid.route,chapters:{city1:{stage:3}}}],
 ['invalid item record',{...valid.route,items:{'city-1':[]}}],
 ['invalid skills',{...valid.route,items:{'city-1':{correct:1,wrong:0,streak:1,lastSeen:1,lastWrong:0,skills:{point:[]}}}}],
 ['invalid reward ledger',{...valid.route,rewardTokens:{}}],
 ['invalid active queue',{...valid.route,active:{...valid.route.active,queue:{}}}],
 ['unsupported task mode',{...valid.route,active:{...valid.route.active,queue:[{id:'city-1',mode:'unknown'}]}}],
 ['invalid answer history',{...valid.route,active:{...valid.route.active,answers:[{ok:'yes'}]}}],
 ['invalid pending',{...valid.route,active:{...valid.route.active,pending:{}}}],
 ['invalid result',{...valid.route,active:{...valid.route.active,result:{passed:'yes'}}}],
 ['negative counter',{...valid.route,active:{...valid.route.active,correct:-1}}]
];
for(const [label,route] of invalid){
 const memory=app.ev('JSON.stringify(state)'),storage=app.w.localStorage.getItem('topo-italie-v3'),prompts=app.confirmations();
 await importText(envelope(route));
 assert.match(app.q('backupStatus').textContent,/Terugzetten lukte niet/,label);
 assert.equal(app.ev('JSON.stringify(state)'),memory,label+': memory byte-equivalent');
 assert.equal(app.w.localStorage.getItem('topo-italie-v3'),storage,label+': storage byte-equivalent');
 assert.equal(app.confirmations(),prompts,label+': rejected before confirmation');
}
// Both current interrupted saves and legacy completed/code sessions remain importable.
await importText(envelope(valid.route));assert.match(app.q('backupStatus').textContent,/Je voortgang is teruggezet/);
assert.equal(app.ev('state.route.chapters.city1.goldAt'),valid.route.chapters.city1.goldAt);
const legacy=structuredClone(valid.route);legacy.schema=1;delete legacy.rewardTokens;legacy.chapters.city1.stage=4;legacy.active=null;
await importText(envelope(legacy));assert.match(app.q('backupStatus').textContent,/Je voortgang is teruggezet/);
assert.equal(app.ev('state.route.schema'),2);assert.equal(app.ev('state.route.chapters.city1.goldAt'),valid.route.chapters.city1.goldAt);
app.ev("state.route.active=null;startRouteLesson('city1','point')");
app.ev('elements[state.current.id].dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}))');
const active=JSON.parse(app.ev('JSON.stringify(state.route)'));
await importText(envelope(active));assert.match(app.q('backupStatus').textContent,/Je voortgang is teruggezet/);assert.equal(app.ev('state.route.active.kind'),'point');assert.equal(app.ev('state.route.active.answered'),true,'valid answered session survives import');
const oldCodes=structuredClone(active);oldCodes.schema=1;oldCodes.chapters.city1.stage=4;oldCodes.active.kind='codes';oldCodes.active.queue=oldCodes.active.queue.map(t=>({...t,mode:'nameCode'}));oldCodes.active.pending=oldCodes.active.queue.map(t=>t.id+':'+t.mode);oldCodes.active.awarded=[];
await importText(envelope(oldCodes));assert.match(app.q('backupStatus').textContent,/Je voortgang is teruggezet/);assert.equal(app.ev('state.route.active'),null,'valid obsolete schema-1 code session migrates safely');
assert.deepEqual(app.errors,[]);app.close();
console.log('QA-1: stage/gold replay daily credit, reload/resubmit idempotence and pizza ledger: PASS');
console.log('QA-2: 19 malformed imports preserve exact memory/storage before confirmation; valid schemas 1/2 and interrupted/code migrations: PASS');
