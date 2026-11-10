import test from 'node:test';
import assert from 'node:assert/strict';
import {boot,startExam,finishExam,plain,PROFILE,NOW} from './support.mjs';
const KEY='topo-v3-toetsen-v1';
const button=(a,text,scope=a.d)=>[...scope.querySelectorAll('button')].find(b=>b.textContent.trim()===text);

test('V3 exam: real score, wrong/skipped list, share text and daily credit, with no points/pizza/ride/gold',async t=>{
 const a=await boot(t);a.ev('Object.assign(state,{good:23,pizzas:2,slices:7,trips:0});sync()');
 const before=a.json('[state.good,state.pizzas,state.slices,state.trips,state.route.chapters,state.route.rewardTokens]');
 const chapters=a.json('ROUTE_CHAPTERS.map(c=>c.id)');
 await startExam(a,{chapters,form:'both',length:10});
 const wrong=new Set();
 const r=await finishExam(a,(n,mode)=>{if(n===9)return {skip:true};if(!wrong.has(mode)){wrong.add(mode);return {ok:false,given:'x'.repeat(100)};}return {ok:true};});
 assert.equal(r.total,10);assert.equal(r.correct,7);assert.equal(r.items.length,10);assert.equal(r.at,new Date(NOW).toISOString());
 assert.deepEqual([...new Set(r.items.map(i=>i.mode))].sort(),['point','write']);
 assert.deepEqual(a.json('[state.good,state.pizzas,state.slices,state.trips,state.route.chapters,state.route.rewardTokens]'),before);
 assert.equal(a.ev('state.daily.correct'),7);assert.equal(a.q('#dailyProgress').value,7);
 assert.equal(a.q('#v3ToetsScore').textContent,'7 / 10');assert.equal(a.q('dialog.ninoExamResult').open,false);
 assert.equal(a.w.TopoBook.element.open,false);
 const missed=r.items.filter(i=>!i.ok),rows=[...a.d.querySelectorAll('.v3ToetsFouten li')];
 assert.deepEqual(a.json('state.mistakes').sort(),missed.map(i=>i.id).sort());assert.equal(rows.length,3);
 for(const [n,item] of missed.entries()){
  const name=a.ev(`byId[${JSON.stringify(item.id)}].name`);
  if(!item.given)assert.equal(rows[n].textContent,name+'overgeslagen');
  else if(item.mode==='point')assert.equal(rows[n].textContent,name,'wrong clicked name stays off the result');
  else{assert.equal(item.given.length,80);assert.equal(rows[n].textContent,name+'x'.repeat(80));}
 }
 button(a,'Kopieer').click();await a.flush();
 const text='Ik heb de NINO-toets Topografie Italië gemaakt.\nOnderwerp: Alles\nScore: 7 van 10 goed.';
 assert.equal(a.clipboard.at(-1),text);
 const mail=a.q('.v3ToetsMail').href;assert.equal(new URL(mail).searchParams.get('body'),text);
 assert.deepEqual(plain(a.w.TOPO_V3.toets.load()),[r]);
 const store=JSON.parse(a.w.localStorage.getItem(KEY));assert.equal(store.schema,1);assert.deepEqual(store.results,[r]);
 button(a,'Oefen deze fouten').click();await a.flush();assert.equal(a.q('#groupSelect').value,'mistakes');assert.equal(a.ev('state.mode'),'point');
 assert.deepEqual(a.json('groupItems().map(i=>i.id)').sort(),missed.map(i=>i.id).sort());
});

test('last ten exams, newest first; schema, IDs, scores, answer-length and corrupt reads are bounded',async t=>{
 const a=await boot(t);const made=[];
 for(let n=0;n<11;n++){a.clock.advance(60000);await startExam(a,{form:'write'});made.push(await finishExam(a));}
 const records=plain(a.w.TOPO_V3.toets.load());assert.equal(records.length,10);assert.deepEqual(records,made.slice(1).reverse());
 const valid={schema:1,results:records};assert.equal(a.w.TOPO_V3.toets.KEY,KEY);assert.equal(a.w.TOPO_V3.toets.valid(valid),true);
 for(const mutate of [d=>d.schema=2,d=>d.results.push(records[0]),d=>d.results[0].at='bad',d=>d.results[0].items[0].id='unknown',d=>d.results[0].correct=0,d=>d.results[0].items[0].given='x'.repeat(81)]){
  const bad=structuredClone(valid);mutate(bad);assert.equal(a.w.TOPO_V3.toets.valid(bad),false);
  a.w.localStorage.setItem(KEY,JSON.stringify(bad));assert.deepEqual(plain(a.w.TOPO_V3.toets.load()),[]);
 }
 a.w.localStorage.setItem(KEY,'{bad json');assert.deepEqual(plain(a.w.TOPO_V3.toets.load()),[]);
});

test('real backup export/import: V3 → old V2 → V3 and new V3 → V3 keep compatible schemas and profile',async t=>{
 const a=await boot(t);await startExam(a,{form:'write'});await finishExam(a);
 const newer=a.exportBackup();assert.equal(newer.app,'topo-italie');assert.equal(newer.version,1);
 assert.equal(newer.progress.schema,3);assert.equal(newer.progress.route.schema,2);assert.equal(newer.profile.schema,1);assert.equal(newer.v3Toetsen.schema,1);
 assert.deepEqual(Object.keys(newer.profile).sort(),['coverColor','favoritePizza','name','schema']);
 const old=await boot(t,{v3:false});await old.importBackup(newer);
 assert.match(old.q('#backupStatus').textContent,/^Je voortgang is teruggezet/);
 assert.deepEqual(old.json('progressSnapshot()'),newer.progress);assert.deepEqual(plain(old.w.TopoProfile.current()),PROFILE);
 const older=old.exportBackup();assert.equal('v3Toetsen' in older,false);
 const kept=a.w.localStorage.getItem(KEY);await a.importBackup(older);
 assert.equal(a.w.localStorage.getItem(KEY),kept,'old copy without v3Toetsen retains local exam results');
 assert.deepEqual(a.json('progressSnapshot()'),older.progress);
 const target=await boot(t);await target.importBackup(newer);assert.deepEqual(plain(target.w.TOPO_V3.toets.load()),newer.v3Toetsen.results);
 const invalidExtra={...newer,v3Toetsen:{schema:99,results:[]}};await target.importBackup(invalidExtra);
 assert.match(target.q('#backupStatus').textContent,/^Je voortgang is teruggezet/);assert.deepEqual(plain(target.w.TOPO_V3.toets.load()),newer.v3Toetsen.results);
 const snapshot=target.snapshot(),store=target.storage();const invalid=structuredClone(newer);invalid.progress.route.schema=999;invalid.v3Toetsen.results=[];
 await target.importBackup(invalid);assert.match(target.q('#backupStatus').textContent,/Terugzetten lukte niet/);
 assert.deepEqual(target.snapshot(),snapshot);assert.deepEqual(target.storage(),store,'bad progress cannot import exam extra');
});

test('backup storage failure rolls profile back and leaves active progress/results unchanged',async t=>{
 const a=await boot(t);const copy=a.exportBackup();copy.profile.name='Andere naam';copy.progress.good=77;
 const before=a.snapshot(),store=a.storage(),set=a.w.Storage.prototype.setItem;
 a.w.Storage.prototype.setItem=function(key,value){if(key==='topo-italie-v3')throw new Error('quota');return set.call(this,key,value);};
 await a.importBackup(copy);a.w.Storage.prototype.setItem=set;
 assert.match(a.q('#backupStatus').textContent,/Terugzetten lukte niet/);assert.deepEqual(a.snapshot(),before);assert.deepEqual(a.storage(),store);
 assert.deepEqual(plain(a.w.TopoProfile.current()),PROFILE);
});

test('observed quirk: cancelled import after an earlier success can still replace v3Toetsen (not a desired contract)',async t=>{
 const a=await boot(t);await startExam(a);await finishExam(a);
 const copy=a.exportBackup();await a.importBackup(copy);assert.equal(a.w.TOPO_V3.toets.load().length,1);
 const before=a.json('progressSnapshot()');const cancelled=structuredClone(copy);cancelled.progress.good=999;cancelled.v3Toetsen.results=[];
 a.w.confirm=()=>false;await a.importBackup(cancelled);
 assert.deepEqual(a.json('progressSnapshot()'),before,'V2 progress respects cancel');
 assert.deepEqual(plain(a.w.TOPO_V3.toets.load()),[],'CURRENT BUG: stale success status lets V3 replace results after cancel');
});

test('Wis voortgang retains profile/results; Begin helemaal opnieuw also clears profile, intro and exam history',async t=>{
 const a=await boot(t);await startExam(a);await finishExam(a);a.ev('Object.assign(state,{good:24,pizzas:3,slices:0,trips:1});sync()');
 const results=a.w.localStorage.getItem(KEY),profile=a.w.localStorage.getItem('topo-nino-profile-v1');
 a.q('#resetAll').click();await a.flush();assert.equal(a.ev('state.good+state.pizzas+state.slices+state.trips'),0);
 assert.deepEqual(a.json('state.mistakes'),[]);assert.deepEqual(a.json('state.route.rewardTokens'),[]);assert.deepEqual(a.json('state.route.items'),{});
 assert.equal(a.w.localStorage.getItem('topo-nino-profile-v1'),profile);assert.equal(a.w.localStorage.getItem(KEY),results,'exam history is separate from progress reset');
 a.expectReload();a.q('.ninoResetDanger').click();await a.flush();
 assert.equal(a.w.localStorage.getItem(KEY),null);assert.equal(a.w.localStorage.getItem('topo-nino-profile-v1'),null);assert.equal(a.w.localStorage.getItem('topo-nino-intro-v1'),null);
 assert.equal(a.reloads(),1);
 const reload=await boot(t,{storage:{...a.storage(),'topo-nino-profile-v1':null,'topo-nino-intro-v1':null}});
 assert.equal(reload.w.TopoProfile.current(),null);assert.equal(reload.ev('state.good+state.pizzas+state.trips+state.slices'),0);
 assert.deepEqual(plain(reload.w.TOPO_V3.toets.load()),[]);assert.equal(reload.q('dialog.ninoProfile').open,true);
 assert.equal(reload.q('[data-profile-cancel]').textContent,'Start meteen');
});

test('fixed seed and clock reproduce exam order, modes, result and saved progress across isolated boots',async t=>{
 const runs=[];
 for(let n=0;n<2;n++){
  const a=await boot(t);await startExam(a,{chapters:a.json('ROUTE_CHAPTERS.map(c=>c.id)'),length:10});
  const result=await finishExam(a,index=>({ok:index!==3,skip:index===7}));
  runs.push({result,progress:a.json('progressSnapshot()'),stored:a.w.localStorage.getItem(KEY)});a.close();
 }
 assert.deepEqual(runs[0],runs[1]);
});
