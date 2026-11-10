import test from 'node:test';
import assert from 'node:assert/strict';
import {boot,read,sha,INDEX_SHA} from './support.mjs';
const baseline=JSON.parse(read('tests/characterization/baseline.json'));

test('45 stable places, 11 ordered chapters, groups and source-pinned geometry',async t=>{
 const a=await boot(t,{v3:false});
 assert.equal(sha(read('index.html')),INDEX_SHA,'owner-frozen V2 reference');
 const items=a.json('ITEMS'),chapters=a.json('ROUTE_CHAPTERS');
 assert.equal(items.length,45);assert.equal(new Set(items.map(i=>i.id)).size,45);
 assert.equal(chapters.length,11);
 assert.deepEqual(chapters.map(c=>c.id),baseline.chapter_ids);
 assert.deepEqual(chapters.map(c=>c.itemIds.length),[6,6,6,5,2,2,2,2,7,5,2]);
 assert.deepEqual([...chapters.flatMap(c=>c.itemIds)].sort(),items.map(i=>i.id).sort());
 assert.equal(sha(JSON.stringify(chapters)),baseline.chapters_sha256);
 assert.equal(sha(a.ev('JSON.stringify(ITEMS.map(({id,name,kind,code,px,py,aliases,shape})=>({id,name,kind,code,px,py,aliases,shape:shape||"",group:groupForItem(byId[id])})))')),baseline.items_sha256);
 const manifest=JSON.parse(read('docs/geography/map-manifest.json'));
 for(const item of items){const expected=manifest.find(i=>i.id===item.id);assert.ok(expected,item.id);
  assert.deepEqual([item.name,item.code,item.px,item.py],[expected.name,expected.code,expected.px,expected.py]);
  assert.equal(sha(item.shape||''),expected.shape_sha256,item.id+' geometry from MAP_SYSTEM provenance');
 }
 assert.equal(sha(a.ev('italy')),baseline.italy_sha256);assert.equal(sha(a.ev('JSON.stringify(CONTEXT_LAND)')),baseline.context_sha256);
 assert.equal(sha(a.ev('JSON.stringify(NAME_ANCHORS)')),baseline.name_anchors_sha256);
 assert.equal(a.q('#map').getAttribute('viewBox'),'0 0 890 1235');
});

test('name grading accepts normalization and declared aliases, never fuzzy spelling or worksheet codes',async t=>{
 const a=await boot(t);
 const cases=[['area-a','  SICILIE!  ',true],['city-9','rome',true],['city-9','Rom',false],['city-9','9',false],['area-a','a',false],['area-a','Sicillie',false]];
 for(const item of a.json('ITEMS'))for(const alias of item.aliases)cases.push([item.id,alias,true]);
 for(const [id,text,expected] of cases){
  a.ev(`mode('write');state.current=byId[${JSON.stringify(id)}];state.questionMode='write';state.answered=false;$('#answer').disabled=false;$('#check').disabled=false;`);
  const before=a.ev('state.daily.correct');a.q('#answer').value=text;a.q('#check').click();
  assert.equal(a.ev('state.answered'),true,text);assert.equal(a.q('#message').classList.contains('good'),expected,text);
  assert.equal(a.ev('state.daily.correct'),before+(expected?1:0),text);
  const save=a.w.localStorage.getItem('topo-italie-v3');a.q('#check').click();assert.equal(a.w.localStorage.getItem('topo-italie-v3'),save,'answered submission is idempotent');
 }
 a.ev("state.answered=false;$('#check').disabled=false;$('#answer').disabled=false");a.q('#answer').value='   ';a.q('#check').click();assert.equal(a.ev('state.answered'),false,'blank is not a submitted answer');
});

test('point tolerance is 22 CSS px at zoom/pan; river corridor and visible geometry stay separate',async t=>{
 const a=await boot(t,{v3:false});
 // Only the browser CTM/DOMPoint primitive is supplied: the real mapTapCandidates
 // performs class filtering, the distance check and CSS-pixel conversion.
 a.w.DOMPoint=class{constructor(x,y){this.x=x;this.y=y;}matrixTransform(m){return {x:m.a*this.x+m.c*this.y+m.e,y:m.b*this.x+m.d*this.y+m.f};}};
 for(const [zoom,pan] of [[1,0],[2,37],[.5,-100]]){
  a.q('#map').getScreenCTM=()=>({a:zoom,b:0,c:0,d:zoom,e:pan,f:19});
  const p=a.json("byId['city-1']"),x=p.px*zoom+pan,y=p.py*zoom+19;
  for(const [distance,inside] of [[0,true],[21.99,true],[22,true],[22.01,false]]){
   assert.equal(a.ev(`mapTapCandidates(${x+distance},${y},'point').some(i=>i.id==='city-1')`),inside,`zoom ${zoom}, distance ${distance}`);
  }
 }
 for(const id of ['water-F','water-G']){const hit=a.q(`[data-hit-id="${id}"]`);
  assert.equal(hit.getAttribute('stroke-width'),'44');assert.equal(hit.getAttribute('vector-effect'),'non-scaling-stroke');
  assert.equal(hit.getAttribute('d'),a.ev(`byId['${id}'].shape`));
 }
 a.ev("mode('point');state.current=byId['city-9'];state.questionMode='point';state.answered=false;chooseMapPlace(byId['area-o'])");
 assert.equal(a.q('#message').classList.contains('bad'),true,'nearby Vatican is not Rome');
 a.ev("state.answered=false;chooseMapPlace(byId['city-9'])");assert.equal(a.q('#message').classList.contains('good'),true);
});
