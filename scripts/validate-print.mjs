import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const app = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const printable = readFileSync(new URL('../print.html', import.meta.url), 'utf8');
const appItems = JSON.parse(app.match(/const ITEMS=(\[.*?\]);\nconst \$/s)?.[1] ?? 'null');
const source = JSON.parse(printable.match(/const DATA=(\{.*?\});\nconst byId=/s)?.[1] ?? 'null');
assert.equal(source.items.length, 45);
assert.deepEqual(source.items,appItems,'print uses canonical geometry and content exactly');
assert.equal(source.photo.length > 100_000, true, 'original school worksheet embedded');
assert.ok(source.context && source.italy && source.anchors, 'map geometry and label anchors copied from executable map');
const cityGroup = source.groups.find(group => group.key === 'city1');
assert.deepEqual(cityGroup.ids, ['city-1','city-2','city-3','city-4','city-5','city-6']);
assert.equal(source.groups.find(group => group.key === 'all').ids.length, 45);
assert.equal(source.groups.find(group => group.key === 'rivers').ids.length, 2);
const dots=source.items.filter(item=>item.kind==='city'||['area-e','area-f','area-n','area-o'].includes(item.id));
for(const group of source.groups.filter(group=>group.key!=='all')){
  const labels=group.ids.filter(id=>dots.some(d=>d.id===id)).map(id=>{
    const dot=dots.find(item=>item.id===id),[x,y]=source.printLabels[group.key][id];
    const w=50,h=42;
    const box={left:x-w/2,right:x+w/2,top:y-h/2,bottom:y+h/2};
    assert.ok(Math.hypot(x-dot.px,y-dot.py)>=70,`${dot.name}: code separated from city dot`);
    for(const other of dots){
      const gap=Math.hypot(Math.max(box.left-other.px,0,other.px-box.right),Math.max(box.top-other.py,0,other.py-box.bottom));
      assert.ok(gap>=15,`${dot.name}: printed code must not cover ${other.name}'s dot`);
    }
    return {id,box};
  });
  for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
    const a=labels[i].box,b=labels[j].box;
    assert.ok(a.right+8<=b.left||b.right+8<=a.left||a.bottom+8<=b.top||b.bottom+8<=a.top,`${labels[i].id}/${labels[j].id}: printed codes must not overlap`);
  }
}
assert.match(printable, /@page\{size:A4 portrait/);
assert.match(printable, /<option value="name">/);
assert.match(printable, /<option value="locate">/);
const controls = new Map();
for (const selector of ['#group','#format','#mapStyle','#pages','#print']) {
  controls.set(selector, { value: selector === '#format' ? 'learn' : selector === '#mapStyle' ? 'clean' : '', innerHTML: '', addEventListener() {} });
}
const printedScript = printable.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const printContext = { document: { querySelector: selector => controls.get(selector) }, window: { print() {} } };
runInNewContext(`${printedScript}\nthis.renderSheet=render;`, printContext);
assert.equal((controls.get('#pages').innerHTML.match(/class="sheet"/g) || []).length, 1, 'initial print page renders');
assert.ok(controls.get('#pages').innerHTML.includes('Bologna'), 'learning sheet contains the name');
controls.get('#format').value = 'name';
printContext.renderSheet();
assert.ok(controls.get('#pages').innerHTML.includes('class="blank"'), 'code-to-name page has answer lines');
controls.get('#format').value = 'locate';
printContext.renderSheet();
assert.ok(controls.get('#pages').innerHTML.includes('class="name"'), 'name-to-code page has names');
controls.get('#group').value = 'all';
printContext.renderSheet();
assert.equal((controls.get('#pages').innerHTML.match(/class="sheet"/g) || []).length, 11, 'all groups split into printable sheets');
console.log('Printable A4 groups, school photo and all 45 worksheet mappings: OK');

assert.ok(!printable.includes('schrijf de code'));assert.ok(printable.includes('tijdelijke vraagnummers'));

const {createHash}=await import('node:crypto');
assert.equal(createHash('sha256').update(printable).digest('hex'),readFileSync(new URL('../output/pdf/print-source.sha256',import.meta.url),'utf8').trim(),'PDF source is fresh');
const pdf=readFileSync(new URL('../output/pdf/topo-italie-printboek.pdf',import.meta.url),'latin1');
assert(pdf.startsWith('%PDF-'));assert.match(pdf,/\/Count 35/,'35 A4 pages including original photo appendix');
