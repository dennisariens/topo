import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import test from 'node:test';
import {JSDOM, VirtualConsole} from 'jsdom';

// Run with: npx --yes --package=node@24.15.0 node --test scripts/nino-art.test.mjs
// Read-only comparison with the exact Release 1.1 integration base; no checkout/build needed.
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const html = read('index.html').toString();
const base = 'a481317b33f5f6f55c179ee0fbfe6b211663be7b';
const gitFile = path => execFileSync('git', ['show', `${base}:${path}`], {cwd: root, maxBuffer: 16 * 1024 * 1024});
const baseline = gitFile('index.html').toString();
const scripts = text => [...text.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = JSON.parse(read('assets/nino/runtime-manifest.json'));
const context = {};
runInNewContext(read('scripts/nino-art.js').toString(), context);
const roleFor = context.TopoArt.roleFor;

function boot(source = html, saved) {
  const errors = [], timers = [], vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(source, {
    url: 'https://nino-art.test/', runScripts: 'dangerously', virtualConsole: vc,
    beforeParse(w) {
      const NativeDate = w.Date;
      w.Date = class extends NativeDate {
        constructor(...args) { super(...(args.length ? args : [1792756800000])); }
        static now() { return 1792756800000; }
      };
      let seed = 20261024;
      w.Math.random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      // Deterministic celebration timers: inspect the existing 1500ms dismissal without sleeping.
      w.setTimeout = (fn, delay) => { timers.push({fn, delay}); return timers.length; };
      w.clearTimeout = () => {};
      w.confirm = () => true;
      w.HTMLElement.prototype.scrollIntoView = () => {};
      if (saved) w.localStorage.setItem('topo-italie-v3', saved);
    }
  });
  const w = dom.window;
  assert.deepEqual(errors, [], 'app boots without script errors');
  return {w, d: w.document, errors, timers, ev: code => w.eval(code), q: id => w.document.getElementById(id),
    saved: () => w.localStorage.getItem('topo-italie-v3'), close: () => dom.window.close()};
}
const normalized = text => {
  const value = JSON.parse(text);
  if (value.route?.rewardTokens) value.route.rewardTokens.sort();
  return value;
};
const snapshot = app => normalized(app.ev('JSON.stringify(progressSnapshot())'));
const role = (app, selector) => app.d.querySelector(selector)?.dataset.artRole ?? null;

// Explicit inputs are deliberate: a reward-shaped/truthy value is not an actual trip.
test('pure role policy: strict Gold, real success, exam suppression and genuine trip only', () => {
  const cases = [
    [{phase:'entry', event:'ENTRY.FIRST'}, 'welcome'],
    ...['ENTRY.RETURN','ENTRY.RESUME','ENTRY.COMPLETE', undefined].map(event => [{phase:'entry',event}, null]),
    [{phase:'task',kind:'discover',index:9}, 'guide'],
    [{phase:'task',kind:'point',index:0}, 'guide'],
    [{phase:'task',kind:'point',index:1}, null],
    [{phase:'task',kind:'point',answered:true,ok:false}, 'encourage'],
    [{phase:'task',kind:'point',answered:true,ok:true}, null],
    [{phase:'answer',ok:false}, 'encourage'], [{phase:'answer',ok:true}, null],
    [{phase:'summary',kind:'gold',passed:true,goldEarned:true}, 'gold'],
    [{phase:'summary',kind:'gold',passed:true,goldEarned:false}, 'success'],
    [{phase:'summary',kind:'gold',passed:false,goldEarned:true}, 'encourage'],
    [{phase:'summary',kind:'gold',passed:true,goldEarned:true,pause:true}, 'guide'],
    [{phase:'summary',kind:'discover',known:true,right:6,wrong:0,total:6}, 'guide'],
    [{phase:'summary',kind:'write',newlyCompleted:true,wrong:2}, 'success'],
    [{phase:'summary',kind:'point',known:true,right:6,wrong:0,total:6}, 'success'],
    [{phase:'summary',kind:'point',passed:true,known:false,right:6,wrong:0,total:6}, 'guide'],
    [{phase:'summary',kind:'point',passed:true,known:true,right:0,wrong:0,total:0}, 'guide'],
    [{phase:'summary',kind:'point',passed:true,known:true,right:5,wrong:1,total:6}, 'encourage'],
    [{phase:'summary',kind:'point',passed:true,known:true,right:5,wrong:0,total:6}, 'guide'],
    [{phase:'arrival',reward:{trip:true}}, 'arrival'],
    ...[{}, {pizza:true}, {trip:false}, {trip:1}, {trip:'true'}].map(reward => [{phase:'arrival',reward}, null]),
    [{phase:'arrival',mode:'exam',reward:{trip:true}}, 'arrival'],
    [{phase:'unknown'}, null]
  ];
  for (const [input, expected] of cases) assert.equal(roleFor(input), expected, JSON.stringify(input));
  for (const phase of ['entry','task','answer','summary']) {
    assert.equal(roleFor({phase, mode:'exam', event:'ENTRY.FIRST', kind:'gold', index:0,
      answered:true, ok:false, passed:true, goldEarned:true, newlyCompleted:true, known:true,
      right:6,wrong:0,total:6}), null, `exam ${phase}`);
  }
});

test('all six local exports equal manifest hashes and canonical embedded WebP bytes', () => {
  const app = boot();
  try {
    assert.equal(scripts(html).length, 3, 'self-contained app retains three scripts');
    assert(html.includes(read('scripts/nino-art.js').toString()), 'embedded policy matches source');
    assert(html.includes(read('scripts/nino-art-ui.js').toString()), 'embedded UI matches source');
    const embedded = app.w.TOPO_NINO_ART_DATA;
    const roles = ['arrival','encourage','gold','guide','success','welcome'];
    assert.deepEqual(Object.keys(manifest.assets).sort(), roles);
    assert.deepEqual(Object.keys(embedded.assets).sort(), roles);
    assert.deepEqual(readdirSync(new URL('assets/nino/exports/', root)).filter(p => p.endsWith('.webp')).sort(),
      roles.map(r => `nino-${r}.webp`).sort());
    for (const name of roles) {
      const expected = manifest.assets[name], bytes = read(expected.path), asset = embedded.assets[name];
      assert.equal(hash(bytes), expected.sha256, `${name}: exported hash`);
      assert.equal(bytes.length, expected.bytes, `${name}: byte count`);
      assert.equal(bytes.toString('ascii',0,4), 'RIFF');
      assert.equal(bytes.toString('ascii',8,12), 'WEBP');
      assert.equal(asset.width, expected.width); assert.equal(asset.height, expected.height);
      assert.match(asset.src, /^data:image\/webp;base64,/);
      const inline = Buffer.from(asset.src.split(',')[1], 'base64');
      assert.deepEqual(inline, bytes, `${name}: embedded bytes`);
      assert.equal(hash(inline), expected.sha256);
    }
  } finally { app.close(); }
});

test('pending scenes/postcards stay locked or empty; missing and failed art falls back safely', () => {
  const app = boot();
  try {
    const api = app.w.TopoArt, before = snapshot(app), saved = app.saved();
    assert.equal(Object.keys(manifest.chapters).length, 11);
    assert.deepEqual(Object.values(manifest.chapters), Array(11).fill(null));
    assert.deepEqual(manifest.postcards, {});
    assert.equal(app.q('chapterScene').hidden, true);
    for (const chapter of Object.keys(manifest.chapters)) {
      for (const unlocked of [false, true]) {
        const request = {kind:'chapter',chapter,unlocked};
        assert.equal(api.resolve(request), null);
        const slot = api.create(app.d, request, 'scene');
        assert.equal(slot.hidden, true); assert.equal(slot.querySelector('img'), null);
      }
    }
    for (const unlocked of [false,true]) {
      assert.equal(api.resolve({kind:'postcard',postcard:'rome',unlocked, fallbackRole:'success'}), null);
    }
    assert.equal(api.resolve({kind:'chapter',chapter:'city1',unlocked:false,fallbackRole:'guide'}), null);
    assert.equal(api.resolve({kind:'chapter',chapter:'city1',unlocked:true,fallbackRole:'guide'}).role, 'guide');
    assert.equal(api.resolve({role:'nonexistent'}), null);
    const slot = api.create(app.d,{role:'guide'}), image = slot.querySelector('img');
    assert.equal(slot.getAttribute('aria-hidden'),'true'); assert.equal(image.alt,'');
    image.dispatchEvent(new app.w.Event('error'));
    assert.equal(slot.querySelector('img'), null, 'no broken-image glyph or retry');
    assert.equal(slot.dataset.fallback, 'original-nino');
    assert(slot.querySelector('.ninoPortrait'));
    image.dispatchEvent(new app.w.Event('error'));
    assert.equal(slot.children.length,1, 'error handler is one-shot');
    api.update(slot,{role:'success'});
    assert.equal(slot.dataset.fallback,undefined); assert(!slot.classList.contains('artFallback'));
    image.dispatchEvent(new app.w.Event('error'));
    assert.equal(slot.dataset.artRole,'success','stale error cannot replace newer artwork');
    api.update(slot,{role:'missing'});
    assert.equal(slot.hidden,true); assert.equal(slot.children.length,0); assert.equal(slot.dataset.artRole,undefined);
    assert.deepEqual(snapshot(app),before); assert.equal(app.saved(),saved,'art does not write persistence');
    assert.deepEqual(app.errors,[]);
  } finally { app.close(); }
});

test('canonical engines, geometry, original artwork and print artifacts equal pinned base', () => {
  assert.deepEqual(scripts(html).slice(0,2), scripts(baseline).slice(0,2), 'embedded learning/route engines unchanged');
  const feedback=read('scripts/nino-feedback.js').toString();
  const discoverPause="  'ROUND.DISCOVER_PAUSE':'Tijd voor een kleine pauze.',\n";
  assert(feedback.includes(discoverPause),'approved neutral Discover pause correction is explicit');
  assert.equal(feedback.replace(discoverPause,''),gitFile('scripts/nino-feedback.js').toString(),'all other feedback, including formal exams, unchanged');
  for (const file of ['scripts/learning-engine.js','scripts/route-engine.js',
    'print.html','output/pdf/print-source.sha256','output/pdf/topo-italie-printboek.pdf']) {
    assert.deepEqual(read(file),gitFile(file),`${file} unchanged`);
  }
  const originals = source => [...source.matchAll(/data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/=]+/g)].map(m => hash(m[0]));
  const current = new Set(originals(html));
  for (const digest of originals(baseline)) assert(current.has(digest),'original embedded artwork retained');
  const a = boot(), b = boot(baseline);
  try {
    for (const expression of ['ITEMS','CONTEXT_LAND','NAME_ANCHORS']) {
      assert.deepEqual(JSON.parse(a.ev(`JSON.stringify(${expression})`)),JSON.parse(b.ev(`JSON.stringify(${expression})`)),expression);
    }
    assert.equal(a.ev('ITEMS.length'),45);
    // Existing target/context geometry stays exact. Release 1.2 adds only the six
    // separately pinned background polygons covered by geography/lakes.test.mjs.
    const geometry = app => [...app.d.querySelectorAll('#map path, #map circle, #map polygon, #map polyline')]
      .filter(n => !n.closest('#lakeGeometry'))
      .map(n => [...n.attributes].filter(a => ['d','cx','cy','r','points','viewBox'].includes(a.name)).map(a => [a.name,a.value]));
    assert(geometry(a).length > 45, 'map geometry comparison is not empty');
    assert.deepEqual(geometry(a),geometry(b));
  } finally { a.close(); b.close(); }
});

// Differential real-DOM run uses only pre-existing controls/functions on the base.
// Assertions for new artwork are made exclusively against the current app.
test('DOM grade/resubmit/reload, chapter completion, Gold/replay/miss preserve base progress and rewards', () => {
  let app = boot(), old = boot(baseline);
  const both = fn => { fn(app); fn(old); };
  const equal = label => assert.deepEqual(snapshot(app),snapshot(old),label);
  const summaryRole = () => role(app,'#finishScreen .ninoArtSlot');
  const start = kind => both(a => a.ev(`startRouteLesson('city1',${JSON.stringify(kind)})`));
  function complete({missFirst=false,reload=false} = {}) {
    let count=0;
    while (!app.ev('state.route.active.done')) {
      assert(count<50,'finite lesson');
      if (app.ev('roundPaused')) {
        assert.equal(summaryRole(),'guide','six-question pause is not Gold/success');
        both(a => a.q('finishScreen').querySelector('.button').click());
        continue;
      }
      const mode=app.ev('state.questionMode');
      if (mode==='discover') { both(a=>a.q('next').click()); count++; equal('discover progress'); continue; }
      const ok=!(missFirst&&count===0);
      both(a => {
        if (!ok) { a.q('answer').value='zeker onjuist'; a.ev('routeGrade(false)'); }
        else if (mode==='point') a.ev('elements[state.current.id].dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}))');
        else { a.q('answer').value=a.ev('state.current.name'); a.q('check').click(); }
      });
      assert.equal(role(app,'#lessonArt'),ok?null:'encourage','graded answer illustration');
      equal('accepted grade has identical progress/rewards');
      const accepted=snapshot(app);
      both(a => a.ev('routeGrade(true)'));
      assert.deepEqual(snapshot(app),accepted,'resubmit cannot mutate progress/rewards'); equal('resubmit matches base');
      if (reload&&count===0) {
        const save=app.saved(), prior=old.saved(); app.close(); old.close(); app=boot(html,save); old=boot(baseline,prior);
        both(a=>a.q('routeContinue').click());
        assert.deepEqual(snapshot(app),accepted,'answered reload retains exact progress');
        assert.equal(role(app,'#lessonArt'),ok?null:'encourage','answered reload illustration');
        both(a=>a.ev('routeGrade(true)')); equal('reload resubmit matches base');
        assert.deepEqual(snapshot(app),accepted,'reload/resubmit cannot re-award');
      }
      both(a=>a.q('next').click()); count++; equal('next progress');
    }
    return count;
  }
  try {
    assert.equal(role(app,'#welcomeArt'),'welcome'); equal('initial progress');
    both(a=>a.q('routeContinue').click()); assert.equal(role(app,'#lessonArt'),'guide');
    complete(); assert.equal(summaryRole(),'guide','discover is not retrieval success');
    start('point'); complete({missFirst:true,reload:true});
    start('write'); complete(); assert.equal(summaryRole(),'success','new chapter completion');
    start('gold'); assert.equal(complete({reload:true}),12); assert.equal(summaryRole(),'gold','first genuine Gold');
    assert.equal(app.ev('state.route.active.result.goldEarned'),true);
    const rewards = a => a.ev('JSON.stringify([state.good,state.pizzas,state.slices,state.trips,[...state.route.rewardTokens].sort()])');
    const earned=rewards(app), daily=app.ev('state.daily.correct');
    start('gold'); complete({reload:true}); assert.equal(summaryRole(),'success','Gold replay never Gold art');
    assert.equal(rewards(app),earned,'Gold replay mints no duplicate rewards');
    assert.equal(app.ev('state.daily.correct'),daily+12,'accepted replay retrieval still earns daily credit');
    start('gold'); complete({missFirst:true}); assert.equal(summaryRole(),'encourage','Gold miss is not Gold or success');
    equal('final full learning history/rewards'); assert.deepEqual(app.errors,[]); assert.deepEqual(old.errors,[]);
  } finally { app.close(); old.close(); }
});

test('free practice wrong-only art, exam suppression, and arrival only at real reward threshold', () => {
  const app=boot(), old=boot(baseline);
  const both=fn=>{fn(app);fn(old);};
  try {
    both(a=>a.ev("mode('write')"));
    both(a=>{a.q('answer').value='verkeerd';a.q('check').click();});
    assert.equal(role(app,'#practiceArt'),'encourage');
    both(a=>a.q('next').click()); assert.equal(role(app,'#practiceArt'),null);
    both(a=>a.ev('state.pizzas=0;state.slices=7;state.trips=0;sync()'));
    both(a=>{a.q('answer').value=a.ev('state.current.name');a.q('check').click();});
    assert.equal(role(app,'#practiceArt'),null,'free correct answer is not a perfect-round celebration');
    assert.equal(app.ev('state.pizzas'),1);
    assert.equal(role(app,'#arrivalArt'),null,'pizza without trip earns no arrival');
    assert(app.q('vespaTripToast').classList.contains('hidden'));
    both(a=>a.ev("mode('exam')"));
    both(a=>a.ev('grade(false,null,true)')); assert.equal(role(app,'#practiceArt'),null);
    assert.deepEqual(snapshot(app),snapshot(old),'exam wrong grading matches base');
    both(a=>a.q('next').click()); both(a=>a.ev('grade(true,state.current)'));
    assert.equal(role(app,'#practiceArt'),null,'exam correct answer has no artwork');
    assert.deepEqual(snapshot(app),snapshot(old),'exam correct grading matches base');
    both(a=>a.ev("mode('write');state.pizzas=2;state.slices=7;state.trips=0;sync()"));
    assert.equal(role(app,'#arrivalArt'),null,'no arrival for an almost-earned trip');
    both(a=>{a.q('answer').value=a.ev('state.current.name');a.q('check').click();});
    assert.equal(app.ev('state.trips'),1); assert.equal(role(app,'#arrivalArt'),'arrival');
    assert(!app.q('vespaTripToast').classList.contains('hidden'));
    assert.deepEqual(snapshot(app),snapshot(old),'trip threshold does not change reward rules');
    const dismiss=app.timers.find(t=>t.delay===1500); assert(dismiss,'existing 1.5 second trip timer retained');
    dismiss.fn(); assert(app.q('vespaTripToast').classList.contains('hidden'));
    assert.deepEqual(app.errors,[]); assert.deepEqual(old.errors,[]);
  } finally {app.close();old.close();}
});
