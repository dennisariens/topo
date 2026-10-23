const fs=require('fs'),vm=require('vm'),assert=require('assert');
const h=fs.readFileSync('index.html','utf8');const scripts=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);scripts.forEach(s=>new vm.Script(s));
const c={};vm.createContext(c);vm.runInContext(scripts[0]+scripts[1],c);
let s=c.TopoLearning.migrate({},{}),pizza=0,trip=0;
for(let k=1;k<=168;k++){const r=c.TopoLearning.award(s);pizza+=+r.pizza;trip+=+r.trip;assert.equal(s.slices,k%8);assert.equal(s.pizzas,Math.floor(k/8));assert.equal(s.trips,Math.floor(k/24));assert.equal(r.pizza,k%8===0);assert.equal(r.trip,k%24===0);const restored=c.TopoLearning.migrate(JSON.parse(JSON.stringify(s)),{});assert.equal(restored.slices,s.slices);assert.equal(restored.trips,s.trips)}
assert.equal(pizza,21);assert.equal(trip,7);
const app=scripts.at(-1);
const chapters=[{id:'test',itemIds:['a','b','c']}],r=c.TopoRoute.fresh();c.TopoRoute.record(r,'test').stage=1;c.TopoRoute.start(r,chapters,'test','point');let answer=c.TopoRoute.answer(r,chapters,true);assert(answer.reward);assert(c.TopoRoute.answer(r,chapters,true).ignored);
console.log('PASS: JavaScript syntax; 168 correct answers → 21 pizzas / 7 trips; every 8/24 rollover; reload preserves rewards; duplicate answer cannot earn twice.');
// A six-question pause must not truncate twelve-task gold lessons.
const course=[{id:'six',itemIds:['a','b','c','d','e','f']}],progress=c.TopoRoute.fresh();
for(const stage of ['discover','point','write','gold']){
 assert(c.TopoRoute.start(progress,course,'six',stage));let total=0;
 while(!progress.active.done){assert(c.TopoRoute.current(progress));c.TopoRoute.answer(progress,course,true);c.TopoRoute.advance(progress,course);total++;if(total===6&&!progress.active.done){const resumed=c.TopoRoute.restore(JSON.parse(JSON.stringify(progress)),course);assert.equal(resumed.active.index,6);assert.equal(resumed.active.queue.length,progress.active.queue.length)}}
 assert.equal(total,stage==='gold'?12:6);
}
assert.equal(c.TopoRoute.record(progress,'six').stage,3);assert(c.TopoRoute.record(progress,'six').goldAt);
// Actual accepted-retrieval day counter: count a fresh day without losing lifetime rewards.
const dayContext={TopoLearning:{award:c.TopoLearning.award},state:{...s},previousV3:{daily:{date:'2000-01-01',correct:9}},$:()=>null};vm.createContext(dayContext);
const dailyCode=app.slice(app.indexOf('function localDay()'),app.indexOf('function exitFinish()'));vm.runInContext(dailyCode,dayContext);
const before=dayContext.state.pizzas;dayContext.recordDailyCorrect();assert.equal(dayContext.state.daily.correct,1);assert(dayContext.state.pizzas>=before);
console.log('PASS: six-question breaks retain full gold coverage; halfway save/restore; daily goal resets independently of lifetime rewards.');
// Adaptive session: separate skills, exact six tasks, restore, no chapter unlock side effect.
const adaptive=c.TopoRoute.fresh();const now=1800000000000;
c.TopoRoute.track(adaptive,'a','point',false,now-1000);c.TopoRoute.track(adaptive,'a','write',true,now-1000);
assert.equal(adaptive.items.a.skills.point.streak,0);assert.equal(adaptive.items.a.skills.write.streak,1);
const deck=c.TopoRoute.smartDeck(adaptive,course,now);assert.equal(deck.length,6);assert.equal(new Set(deck.map(t=>t.id)).size,6);assert(deck.some(t=>t.id==='a'&&t.mode==='point'));
assert(c.TopoRoute.start(adaptive,course,'smart','smart',now));
for(let k=0;k<6;k++){c.TopoRoute.answer(adaptive,course,k%2===0,now+k);c.TopoRoute.advance(adaptive,course,now+k)}
assert(adaptive.active.done);assert.equal(adaptive.active.answers.length,6);assert.equal(adaptive.active.correct,3);assert.equal(adaptive.active.wrong,3);assert.equal(c.TopoRoute.record(adaptive,'six').stage,0);
const reload=c.TopoRoute.restore(JSON.parse(JSON.stringify(adaptive)),course);assert(reload.active.done);assert.equal(reload.items.a.skills.point.wrong,1);
const legacy=c.TopoRoute.restore({schema:1,chapters:{},items:{a:{correct:50,wrong:3,streak:20,lastSeen:now}},active:null},course);assert.equal(Object.keys(legacy.items.a.skills).length,0);
// Canonical geography checks: source-projected points and committed geometry baseline.
const items=JSON.parse(app.match(/const ITEMS=(\[.*?\]);/)[1]),by=Object.fromEntries(items.map(i=>[i.id,i]));
const refs=JSON.parse(fs.readFileSync('docs/geography/points.json','utf8')),manifest=JSON.parse(fs.readFileSync('docs/geography/map-manifest.json','utf8')),crypto=require('crypto');
assert.equal(items.length,45);assert.equal(new Set(items.map(i=>i.id)).size,45);
for(const r of refs){const i=by[r.id];assert(Math.abs(i.px-(55*r.lon-225.5))<.011);assert(Math.abs(i.py-(3830.75-77*r.lat))<.011);assert.equal(i.px,r.px);assert.equal(i.py,r.py)}
for(const r of manifest){const i=by[r.id];assert.equal(i.code,r.code);assert.equal(crypto.createHash('sha256').update(i.shape||'').digest('hex'),r.shape_sha256)}
assert(by['area-e'].px>by['city-6'].px,'Vesuvius must be east of Naples');assert(by['area-f'].py<by['city-15'].py,'Etna must be north of Catania');assert(Math.hypot(by['area-o'].px-by['city-9'].px,by['area-o'].py-by['city-9'].py)<3,'Rome and Vatican must share actual location, not invented offset');
for(const i of items.filter(i=>i.kind==='city'||['area-n','area-o'].includes(i.id))){const tag=h.match(new RegExp('<circle data-reference-id="'+i.id+'"[^>]+>'))[0];assert(tag.includes('cx="'+i.px+'"'));assert(tag.includes('cy="'+i.py+'"'))}
console.log('PASS: adaptive six-task session, skill isolation, restore and legacy migration; 27 source-projected locations; 45 geometry/code baselines; fallback matches live coordinates.');

// Removing code lessons preserves completed writing and removes legacy code queues.
const oldCodes={schema:1,chapters:{six:{stage:3}},items:{},active:{chapterId:'six',kind:'codes',queue:[{id:'a',mode:'nameCode'}]}};
const migrated=c.TopoRoute.restore(oldCodes,course);assert.equal(migrated.schema,2);assert.equal(migrated.chapters.six.stage,3);assert.equal(migrated.active,null);
assert(!c.TopoRoute.start(migrated,course,'six','codes'));
for(const task of c.TopoRoute.smartDeck(migrated,course))assert(['point','write'].includes(task.mode));
assert(!h.includes('Schoolcodes'));assert(!h.includes('<option value="codeName">'));assert(!h.includes('<option value="nameCode">'));
console.log('PASS: three-stage migration preserves writing completion; code sessions removed; tests and adaptive rounds use pointing/writing only.');
