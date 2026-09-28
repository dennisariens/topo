import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const box={};runInNewContext(readFileSync(new URL('./route-engine.js',import.meta.url),'utf8'),box);
const R=box.TopoRoute, chapters=[{id:'one',itemIds:['a','b','c']},{id:'two',itemIds:['d','e']}];
const seed=n=>()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);
const now=1800000000000;
let data=R.fresh();
assert.equal(R.start(data,chapters,'two','discover'),false,'later chapter is locked');
assert.equal(R.start(data,chapters,'one','write'),false,'stages cannot be skipped');
const firsts=new Set();
for(let i=1;i<=30;i++){const d=R.fresh();R.start(d,chapters,'one','discover',now,seed(i));firsts.add(R.current(d).id)}
assert.ok(firsts.size>1,'new route does not always start with a fixed city');
function finish(kind,wrongAt=-1){
 assert.ok(R.start(data,chapters,'one',kind,now,seed(17)));
 let answers=0,rewards=0,previous=null;
 while(R.current(data)){
  const task=R.current(data);assert.notEqual(task.id,previous,'no adjacent place repeat');previous=task.id;
  const ok=answers!==wrongAt;
  const result=R.answer(data,chapters,ok,now,seed(4));rewards+=result.reward?1:0;
  assert.equal(R.answer(data,chapters,true,now).reward,false,'double tap never earns twice');
  data=R.restore(JSON.parse(JSON.stringify(data)),chapters);
  assert.equal(data.active.answered,true,'answered state resumes without repeating a reward');
  R.advance(data,chapters,now);answers++;
  assert.ok(answers<100,'every run is bounded');
 }
 return {answers,rewards,result:data.active.result};
}
assert.equal(finish('discover').rewards,0,'looking is not counted as independent recall');
assert.equal(data.chapters.one.stage,1);
const repaired=finish('point',1);
assert.ok(repaired.answers>3,'mistake returns after other cards');
assert.equal(repaired.rewards,3,'correction fillers do not farm extra slices');
assert.equal(data.chapters.one.stage,2);
finish('write');finish('codes');
assert.equal(data.chapters.one.stage,4);
assert.equal(R.unlocked(data,chapters,'two'),true);
assert.equal(R.due(data,chapters,now).length,0);
assert.equal(R.due(data,chapters,now+R.DAY+1).length,1);
assert.equal(finish('gold',2).result.passed,false,'one incorrect answer prevents gold');
assert.equal(data.chapters.one.goldAt,0);
assert.equal(finish('gold').result.goldEarned,true);
assert.equal(finish('gold').result.goldEarned,false,'gold is earned only once');
assert.equal(data.chapters.one.goldAt,now);
finish('review');assert.equal(data.chapters.one.nextReviewAt,now+3*R.DAY);
finish('review',0);assert.equal(data.chapters.one.nextReviewAt,now+R.DAY);
assert.equal(data.chapters.one.goldAt,now,'earned gold survives a later mistake');
assert.equal(R.restore({schema:1,active:{chapterId:'one',kind:'point',queue:[{id:'unknown',mode:'point'}]}},chapters).active,null);
assert.equal(R.restore(null,chapters).schema,1);
data=R.fresh();R.start(data,chapters,'one','discover',now);while(R.current(data)){R.answer(data,chapters,true,now);R.advance(data,chapters,now)}
R.start(data,chapters,'one','point',now);
let attempts=0;while(R.current(data)){R.answer(data,chapters,false,now);R.advance(data,chapters,now);attempts++;assert.ok(attempts<100)}
assert.equal(data.active.result.passed,false,'persistent mistakes produce a retry result, not a false pass');
assert.equal(data.chapters.one.stage,1,'failed practice does not unlock next phase');
console.log('Route locks, stages, repair spacing, gold, persistence, rewards and scheduled review: OK');
