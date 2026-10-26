import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)?.[1];
assert.ok(script, 'inline app script exists');
const items = JSON.parse(script.match(/const ITEMS=(\[.*?\]);\nconst \$/s)?.[1] ?? 'null');
const byId = new Map(items.map(item => [item.id, item]));
assert.equal(items.length, 45, 'worksheet has 45 distinct targets');
assert.equal(byId.size, items.length, 'unique item IDs');

const italyPath = script.match(/const italy="([^"]+)";/)?.[1];
assert.ok(italyPath, 'Italy drawing exists');

function polygons(path) {
  const tokens = path.match(/[MLZ]|-?\d+(?:\.\d+)?/g);
  assert.ok(tokens?.length, 'nonempty SVG path');
  const parts = [];
  let ring = [];
  for (let p = 0; p < tokens.length;) {
    const command = tokens[p++];
    if (command === 'M' || command === 'L') {
      ring.push([Number(tokens[p++]), Number(tokens[p++])]);
    } else if (command === 'Z') {
      if (ring.length) parts.push(ring);
      ring = [];
    } else {
      throw new Error(`Unsupported SVG token ${command}; update validator for new path syntax`);
    }
  }
  return parts;
}
function contains(ring, [x, y]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const italyLand = polygons(italyPath);
const onItalianLand = point => italyLand.some(ring => contains(ring, point));
const apennines = polygons(byId.get('area-c').shape);
assert.equal(apennines.length,1,'the Apennines zone is one continuous educational land corridor');
assert.ok(apennines[0].length >= 100,'the restored Apennines corridor is smooth enough to follow the mainland');
for (let i=0;i<apennines[0].length;i++) {
 const start=apennines[0][i],end=apennines[0][(i+1)%apennines[0].length];
 for (let j=0;j<=20;j++) {
  const t=j/20,p=[start[0]*(1-t)+end[0]*t,start[1]*(1-t)+end[1]*t];
  assert.ok(onItalianLand(p),'Apennines visible edge must remain on mapped Italian land: '+p);
 }
}

for (const item of items.filter(i => i.kind === 'city')) {
  assert.ok(item.reference && Number.isFinite(item.lon) && Number.isFinite(item.lat), `${item.name} has source coordinates; coastal points are never nudged inland`);
}
for (const id of ['area-n', 'area-o', 'area-e', 'area-f', 'area-d']) {
  const { name, px, py } = byId.get(id);
  assert.ok(onItalianLand([px, py]), `${name} marker on Italian land`);
}
const distance = (a, b) => Math.hypot(a.px - b.px, a.py - b.py);
assert.ok(distance(byId.get('area-o'), byId.get('city-9')) < 20, 'Vatican remains beside Rome');
assert.ok(distance(byId.get('area-n'), byId.get('city-2')) > 40, 'San Marino remains distinct from Bologna');
assert.match(script, /i\.id==='area-o'\?2\.7:4\.5/, 'Vatican uses tiny visible point');
assert.match(script, /const romeHit=el\('circle',[^;]*class:'microHit'/, 'Rome/Vatican have a separate transparent hit circle');
assert.match(script, /data-choice="city-9"[\s\S]*data-choice="area-o"/, 'lens keeps two distinct targets');
assert.ok(byId.get('water-G').reference, 'Po has sourced river geometry');
const anchorsLiteral = script.match(/const NAME_ANCHORS=(\{[\s\S]*?\});/)?.[1];
assert.ok(anchorsLiteral, 'learning label anchors exist');
const anchors = runInNewContext(`(${anchorsLiteral})`);
assert.deepEqual(Object.keys(anchors).sort(), items.filter(i => i.kind !== 'city').map(i => i.id).sort(), 'all non-city labels exist');
assert.ok(onItalianLand(anchors['area-a']), 'Sicily label on island');
assert.ok(onItalianLand(anchors['area-d']), 'Dolomites label on Italy');
for (const item of items) {
  assert.ok(item.name && item.code && Array.isArray(item.aliases), `${item.id} required fields`);
  assert.ok(Number.isFinite(item.px) && Number.isFinite(item.py), `${item.id} map coordinates`);
  if (item.kind !== 'city') assert.ok(item.shape, `${item.id} has visual or quiz geometry`);
}
assert.equal(items.filter(i => i.kind === 'city').length, 23);
assert.ok(items.some(i => i.name === 'Ligurische Zee'), 'Ligurian Sea included');
assert.ok(html.includes('id="resetPizza"') && html.includes('id="resetAll"'), 'both reset controls exist');
console.log('45 content entries, anchors, coastal markers, microstates, selected land checks: OK');
console.log('Limit: drawn Italy polygon is not an independent geographic ground truth');

for(const i of items){
 const tag=html.match(new RegExp('<(?:circle|path) data-reference-id="'+i.id+'"[^>]+>'))?.[0];
 assert.ok(tag,'static preview contains '+i.id);
 if(i.kind==='city'||['area-n','area-o'].includes(i.id)){
  assert(tag.includes('cx="'+i.px+'"'));assert(tag.includes('cy="'+i.py+'"'));
 }else assert(tag.includes('d="'+i.shape+'"'),'static and live geometry agree for '+i.id);
}
