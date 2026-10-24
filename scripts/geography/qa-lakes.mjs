import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdirSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {source, lakePath} from './lakes.mjs';

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROME_PATH || undefined});
const root = new URL('../../', import.meta.url);
const baseline = 'a481317b33f5f6f55c179ee0fbfe6b211663be7b';
const output = process.env.QA_OUTPUT ? pathToFileURL(resolve(process.env.QA_OUTPUT) + '/') : new URL('../../docs/visual/lakes/', import.meta.url);
mkdirSync(output, {recursive: true});
const before = join(mkdtempSync(join(tmpdir(), 'topo-lakes-before-')), 'index.html');
writeFileSync(before, execFileSync('git', ['show', baseline + ':index.html'], {maxBuffer: 10 * 1024 * 1024}));
const errors = [], requests = [], results = [];
function listen(page) {
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => {if (!/^(file:|data:)/.test(r.url())) requests.push(r.url());});
  page.on('dialog', d => d.accept());
}
async function focusScreenshot(page, name, frame) {
  // Evidence-only camera crop of an exact SVG clone, clear of the responsive sidebar.
  await page.locator('#map').evaluate((map, box) => {
    const wrapper = document.createElement('div'); wrapper.id = 'qaMapFocus';
    wrapper.style.cssText = 'position:absolute;top:0;left:0;width:1100px;z-index:99999;background:#c8e2ed';
    const copy = map.cloneNode(true); copy.removeAttribute('id'); copy.setAttribute('viewBox',box);
    copy.style.cssText = 'width:1100px;height:auto;max-width:none';
    wrapper.append(copy); document.body.append(wrapper);
  }, frame);
  await page.locator('#qaMapFocus').screenshot({path: new URL(name + '.png', output).pathname});
  await page.locator('#qaMapFocus').evaluate(n => n.remove());
}
try {
  for (const [name, width, height] of [['desktop',1440,1000], ['ipad-landscape',1180,820], ['ipad-portrait',820,1180], ['phone-390',390,844], ['phone-320',320,568]]) {
    const pair = {};
    for (const phase of ['before', 'after']) {
      const context = await browser.newContext({viewport: {width, height}, hasTouch: width < 1200, reducedMotion: 'reduce', offline: true});
      await context.addInitScript(() => {Math.random = () => 0.42;});
      const page = await context.newPage(); listen(page);
      await page.goto(phase === 'before' ? pathToFileURL(before).href : new URL('index.html', root).href);
      await page.locator('[data-mode="learn"]').click();
      await page.selectOption('#groupSelect', 'all');
      const measured = await page.evaluate(() => {
        const map = document.querySelector('#map'), b = map.getBoundingClientRect(), matrix = map.getScreenCTM();
        const points = ITEMS.filter(i => i.kind === 'city' || ['area-e','area-f','area-n','area-o'].includes(i.id));
        return {ratio: b.width / b.height, width: b.width, count: ITEMS.length,
          overflow: document.documentElement.scrollWidth > innerWidth,
          maxDrift: Math.max(...points.map(i => {const p = new DOMPoint(i.px,i.py).matrixTransform(matrix);return Math.hypot(p.x-(b.x+i.px*b.width/890),p.y-(b.y+i.py*b.height/1235));})),
          anchors: points.map(i => [i.id,i.px,i.py]),
          paths: [...document.querySelectorAll('#lakeGeometry path')].map(p => [p.dataset.lake, p.getAttribute('d')])};
      });
      assert.equal(measured.count, 45); assert(!measured.overflow);
      assert(Math.abs(measured.ratio - 890 / 1235) < 0.002);
      assert(measured.maxDrift < 0.1);
      pair[phase] = measured;
      if (phase === 'after') {
        assert.deepEqual(measured.anchors, pair.before.anchors);
        assert.equal(measured.width, pair.before.width, 'No responsive map size change');
        assert.deepEqual(measured.paths, source.features.map(f => [f.id, lakePath(f)]));
        assert.equal(await page.locator('#areaLayer > use[data-context-layer="lakes"]').evaluate(n => getComputedStyle(n).pointerEvents), 'none');
        assert.equal(await page.locator('#previewMap').count(), 0);
        // An actual pointer at Garda reaches existing geography, never a lake target.
        await page.locator('#map').scrollIntoViewIfNeeded();
        const hit = await page.evaluate(() => {
          const map = document.querySelector('#map');
          const p = new DOMPoint(55 * 10.7 - 225.5,3830.75 - 77 * 45.6).matrixTransform(map.getScreenCTM());
          const e = document.elementFromPoint(p.x,p.y);
          return {tag: e?.tagName, lake: !!e?.closest('#lakeGeometry,[data-context-layer="lakes"]')};
        });
        assert(hit.tag, 'Pointer probe must be in the visible viewport');
        assert(!hit.lake, 'Lake must not intercept pointer picking');
      }
      await page.screenshot({path: new URL(`${name}-${phase}.png`, output).pathname, fullPage: true});
      if (name === 'desktop') {
        await focusScreenshot(page, `switzerland-${phase}`, '95 235 310 115');
        await focusScreenshot(page, `lazio-${phase}`, '395 520 100 115');
      }
      if (phase === 'after') {
        for (const mode of ['point','write','exam','route']) {
          await page.locator(`[data-mode="${mode}"]`).click();
          assert.equal(await page.evaluate(() => state.mode), mode);
          assert.equal(await page.locator('#areaLayer > use[data-context-layer="lakes"]').count(), 1);
        }
        await page.locator('#routeContinue').click();
        await page.screenshot({path: new URL(`${name}-lesson.png`, output).pathname, fullPage: true});
      }
      await context.close();
    }
    results.push({name,width,height,before:pair.before,after:pair.after});
  }
  // Real browser with scripting disabled: same reusable paths, beneath all tested marks.
  const staticContext = await browser.newContext({javaScriptEnabled: false, offline: true, viewport: {width:1440,height:1000}});
  const staticPage = await staticContext.newPage(); listen(staticPage);
  await staticPage.goto(new URL('index.html', root).href);
  assert.equal(await staticPage.locator('#previewMap use[data-context-layer="lakes"]').getAttribute('href'), '#lakeGeometry');
  assert.equal(await staticPage.locator('use[data-context-layer="lakes"]').count(), 1);
  assert.deepEqual(await staticPage.locator('#lakeGeometry path').evaluateAll(nodes => nodes.map(p => [p.dataset.lake,p.getAttribute('d')])), source.features.map(f => [f.id,lakePath(f)]));
  await staticPage.locator('#map').screenshot({path:new URL('static-fallback.png',output).pathname});
  await staticContext.close();
  for (const file of ['output/html/topo-italie-interactief.html','output/html/topo-italie-duolingo.html','dist/index.html']) {
    assert(readFileSync(new URL(file,root)).equals(readFileSync(new URL('index.html',root))));
    const context = await browser.newContext({offline:true}), page = await context.newPage(); listen(page);
    await page.goto(new URL(file,root).href);
    await page.locator('#routeContinue').click();
    assert.equal(await page.evaluate(() => state.questionMode),'discover');
    assert.equal(await page.locator('#lakeGeometry path').count(),6);
    assert.equal(await page.locator('#areaLayer > use[data-context-layer="lakes"]').count(),1);
    await context.close();
  }
  assert.deepEqual(errors,[]); assert.deepEqual(requests,[]);
  writeFileSync(new URL('browser-results.json',output), JSON.stringify({baseline,browser:await browser.version(),transport:'file:// with browser context offline:true',viewports:results,staticFallback:'PASS, scripting disabled',offlineDownloads:'PASS, both standalone files and dist/index.html',errors,externalRequests:requests,physicalIPadSafari:'not tested'},null,2)+'\n');
  console.log('Lake browser QA: five responsive sizes, before/after anchors, map ratio, noninteractive layers, static fallback and all three offline builds: PASS');
} finally {await browser.close();}
