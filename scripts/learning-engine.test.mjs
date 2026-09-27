import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const context = {};
runInNewContext(readFileSync(new URL('./learning-engine.js', import.meta.url), 'utf8'), context);
const E = context.TopoLearning;
const cards = Array.from({length:45},(_,n)=>({id:`city-${n+1}`}));
function rng(seed) {
  let x = seed;
  return () => { x = (Math.imul(x,1664525) + 1013904223) >>> 0; return x / 4294967296; };
}

const first = new Set();
for (let seed=1;seed<=24;seed++) {
  const random=rng(seed), session=E.session(cards,random);
  const sequence=Array.from({length:45},()=>E.draw(session,cards,[],random).id);
  first.add(sequence[0]);
  assert.equal(new Set(sequence).size,45,'one full shuffled set covers each item once');
  assert.ok(sequence.every((id,index)=>index===0||id!==sequence[index-1]),'no adjacent repeated card');
}
assert.ok(first.size>=3,'starting question varies across sessions');
assert.ok(first.size>1&&!([...first].length===1&&first.has('city-1')),'Bari cannot be permanent first card');

const random=rng(11), review=E.session(cards,random);
const shown=Array.from({length:52},()=>E.draw(review,cards,['city-2'],random).id);
assert.ok(shown.filter(id=>id==='city-2').length>=2,'mistakes receive another review');
assert.ok(shown.every((id,index)=>index===0||id!==shown[index-1]),'review cannot immediately repeat');

const old=E.migrate(null,{good:19,pizzas:2,pizzaSteps:4,mistakes:['city-2']});
assert.equal(old.pizzas,2,'legacy pizzas preserved');
assert.equal(old.slices,6,'partial legacy pizza scaled to eight slices');
assert.equal(old.good,19);

const progress=E.migrate(null,null);
for(let i=1;i<=48;i++){
  const result=E.award(progress);
  assert.equal(result.pizza,i%8===0);
  assert.equal(result.trip,i%24===0);
  if(i===24)assert.equal(`${result.from} → ${result.to}`,'Rome → Florence');
  if(i===48)assert.equal(`${result.from} → ${result.to}`,'Florence → Bologna');
}
assert.equal(progress.good,48);assert.equal(progress.pizzas,6);assert.equal(progress.trips,2);
console.log('Shuffle, coverage, spaced mistake review, legacy migration and Vespa cadence: OK');
