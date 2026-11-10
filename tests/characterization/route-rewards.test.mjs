import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {boot,NOW,seeded,plain} from './support.mjs';
let a,R,C;
before(async()=>{a=await boot(null,{v3:false});R=a.w.TopoRoute;C=a.json('ROUTE_CHAPTERS');});
after(()=>{a.close();assert.deepEqual(a.errors,[]);});
function finish(data,kind,{wrongAt=-1,now=NOW}={}){
 assert.equal(R.start(data,C,'city1',kind,now,seeded(17)),true);
 let n=0,rewards=0,firstWrong=null,seen=[];
 while(R.current(data)){
  const task=plain(R.current(data));seen.push(task);if(n===wrongAt)firstWrong=task;
  const r=R.answer(data,C,n!==wrongAt,now,seeded(4));rewards+=+r.reward;
  assert.equal(R.answer(data,C,true,now).ignored,true,'double submit ignored');
  data=R.restore(plain(data),C);assert.equal(data.active.answered,true,'answered save restored');
  R.advance(data,C,now);assert.ok(++n<100);
 }
 return {data,n,rewards,firstWrong,seen,result:plain(data.active.result)};
}

test('locks, stage order, delayed repair, completion and reward-safe stage replay',()=>{
 let d=R.fresh();assert.equal(R.start(d,C,'city2','discover',NOW),false);assert.equal(R.start(d,C,'city1','write',NOW),false);
 assert.equal(R.start(d,C,'city1','gold',NOW),false);
 let r=finish(d,'discover');d=r.data;assert.equal(r.rewards,0);assert.equal(R.record(d,'city1').stage,1);
 r=finish(d,'point',{wrongAt:0});d=r.data;
 assert.ok(r.n>6);assert.equal(r.rewards,6,'fillers and correction cannot mint extra rewards');
 const retry=r.seen.findIndex((task,index)=>index>0&&task.id===r.firstWrong.id);assert.ok(retry>=3,'at least two intervening places');
 assert.equal(R.record(d,'city1').stage,2);assert.equal(R.unlocked(d,C,'city2'),false);
 r=finish(d,'write');d=r.data;assert.equal(r.rewards,6);assert.equal(r.result.newlyCompleted,true);
 assert.equal(R.record(d,'city1').stage,3);assert.equal(R.unlocked(d,C,'city2'),true);
 assert.equal(R.record(d,'city1').nextReviewAt,NOW+R.DAY);
 const tokens=[...d.rewardTokens].sort();r=finish(d,'point');assert.equal(r.rewards,0);assert.equal(R.record(r.data,'city1').stage,3);
 assert.deepEqual([...r.data.rewardTokens].sort(),tokens);
});

test('gold requires every point and name correct; retry/replay and legacy saves never duplicate rewards',()=>{
 let d=R.fresh();for(const kind of R.STAGES)d=finish(d,kind).data;
 let r=finish(d,'gold',{wrongAt:0});d=r.data;assert.equal(r.n,12);assert.equal(r.result.passed,false);assert.equal(R.record(d,'city1').goldAt,0);assert.equal(r.rewards,11);
 assert.deepEqual([...new Set(r.seen.map(t=>t.mode))],['point','write']);
 r=finish(d,'gold');d=r.data;assert.equal(r.result.goldEarned,true);assert.equal(R.record(d,'city1').goldAt,NOW);assert.equal(r.rewards,1,'only the previously missed token is new');
 r=finish(d,'gold');assert.equal(r.result.goldEarned,false);assert.equal(r.rewards,0);
 const missedReplay=finish(r.data,'gold',{wrongAt:0});assert.equal(missedReplay.result.passed,false);assert.equal(R.record(missedReplay.data,'city1').goldAt,NOW,'earned gold is never revoked');
 const legacy=plain(r.data);legacy.schema=1;legacy.chapters.city1.stage=4;delete legacy.rewardTokens;legacy.active=null;
 const restored=R.restore(legacy,C);assert.equal(restored.schema,2);assert.equal(restored.chapters.city1.stage,3);
 for(const kind of ['point','write','gold'])assert.equal(finish(restored,kind).rewards,0,kind+' legacy replay');
});

test('review and per-skill due boundaries use 1/3/7/14 days; wrong answers reset, smart deck respects locks',()=>{
 const d=R.fresh();
 for(const [index,days] of [1,3,7,14,14].entries()){
  const skill=R.track(d,'city-1','point',true,NOW+index);assert.equal(skill.due,NOW+index+days*R.DAY);
 }
 assert.equal(d.items['city-1'].skills.write,undefined);
 assert.equal(R.track(d,'city-1','point',false,NOW).due,NOW);assert.equal(d.items['city-1'].skills.point.streak,0);
 let completed=R.fresh();for(const kind of R.STAGES)completed=finish(completed,kind).data;
 assert.equal(R.due(completed,C,NOW+R.DAY-1).length,0);assert.equal(R.due(completed,C,NOW+R.DAY).length,1);
 for(const days of [3,7,14,14]){completed=finish(completed,'review').data;assert.equal(completed.chapters.city1.nextReviewAt,NOW+days*R.DAY);}
 completed=finish(completed,'review',{wrongAt:0}).data;assert.equal(completed.chapters.city1.nextReviewAt,NOW+R.DAY);
 const deck=plain(R.smartDeck(completed,C,NOW));assert.equal(deck.length,6);assert.equal(new Set(deck.map(t=>t.id)).size,6);
 assert.ok(deck.every(t=>[...C[0].itemIds,...C[1].itemIds].includes(t.id)),'only completed and first open chapter');
 assert.deepEqual(plain(R.smartDeck(completed,C,NOW)),deck,'no nondeterministic scheduling');
});

test('8 retrieval points per pizza, every third pizza a ride; favorite is cosmetic and flavor rollover truthful',()=>{
 const L=a.w.TopoLearning,P=a.w.TopoPizza,p={good:0,pizzas:0,slices:0,trips:0};
 assert.equal(L.SLICES_PER_PIZZA,8);assert.equal(L.PIZZAS_PER_TRIP,3);
 for(let n=1;n<=48;n++){
  const reward=L.award(p);assert.equal(p.good,n);assert.equal(p.pizzas,Math.floor(n/8));assert.equal(p.slices,n%8);assert.equal(p.trips,Math.floor(n/24));
  assert.equal(reward.pizza,n%8===0);assert.equal(reward.trip,n%24===0);
 }
 assert.deepEqual([0,1,2,3].map(n=>P.flavor(n)),['margherita','salami','quattro-formaggi','margherita']);
 assert.equal(P.flavor(3,true),'quattro-formaggi','zero rollover shows just-earned pizza');
 const before=JSON.stringify(p);const host=a.d.createElement('div');host.className='pizzaWheel';P.draw(host,3,p.pizzas);assert.equal(JSON.stringify(p),before);
 a.w.TopoProfile.importProfile({schema:1,name:'Ada',coverColor:'riviera',favoritePizza:'salami'});assert.equal(P.flavor(0),'margherita');
});

test('all eleven chapters require all three stages; next chapter opens only after writing',()=>{
 const d=R.fresh();
 for(let n=0;n<C.length;n++){
  assert.equal(R.unlocked(d,C,C[n].id),true);
  if(n+1<C.length)assert.equal(R.unlocked(d,C,C[n+1].id),false);
  for(const kind of R.STAGES){
   assert.equal(R.start(d,C,C[n].id,kind,NOW,seeded(19)),true);
   assert.deepEqual([...d.active.queue.map(t=>t.id)].sort(),[...C[n].itemIds].sort());
   while(R.current(d)){R.answer(d,C,true,NOW);R.advance(d,C,NOW);}
   assert.equal(d.active.result.passed,true);
   if(kind!=='write'&&n+1<C.length)assert.equal(R.unlocked(d,C,C[n+1].id),false);
  }
  assert.equal(R.record(d,C[n].id).stage,3);
 }
 assert.equal(C.filter(c=>R.record(d,c.id).stage===3).length,11);
});
