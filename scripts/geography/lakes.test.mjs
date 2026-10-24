import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM, VirtualConsole} from 'jsdom';
import {hash, project, source, provenance, lakePath, lakeMarkup, lakeManifest} from './lakes.mjs';

const root = new URL('../../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const html = read('index.html').toString();
const manifest = JSON.parse(read('geography/lakes/projected-manifest.json'));
assert.equal(provenance.revision, 'ace5fed0eaf3c6c03c951e75b439ba8fffbc218e');
assert.equal(provenance.license, 'public domain');
assert.equal(hash(read('geography/lakes/source.geojson')), provenance.excerptSha256);
assert.deepEqual(lakeManifest(), manifest, 'Immutable projected geometry/position hashes');
assert.deepEqual(project([12, 42]), [434.5, 596.75], 'Existing affine projection, no translation or zoom');
assert.deepEqual(source.features.map(f => f.id), ['garda', 'maggiore', 'como', 'lugano', 'bolsena', 'geneva']);
const expected = {
  garda: [352.64, 296.79, 372.34, 331.15], maggiore: [241.61, 275.53, 261.2, 310.14],
  como: [273.21, 275.28, 292.21, 302.66], lugano: [263.23, 285.57, 276.2, 295.47],
  bolsena: [426.95, 545.96, 434.25, 554.95], geneva: [111.83, 248.53, 155.95, 272.99]
};
for (const f of source.features) {
  assert.equal(f.geometry.type, 'Polygon');
  const m = manifest.find(m => m.id === f.id);
  assert.deepEqual(m.boundsProjected, expected[f.id], f.id + ' exact map envelope');
  assert.equal(hash(lakePath(f)), m.pathSha256);
  for (const ring of f.geometry.coordinates) {
    assert.deepEqual(ring[0], ring.at(-1), f.id + ' closed source ring');
    assert(ring.length >= 15, 'Real shoreline, not an approximate box/ellipse');
    assert(ring.every(p => p.every(Number.isFinite)));
    const area = ring.slice(1).reduce((sum, p, i) => sum + ring[i][0] * p[1] - p[0] * ring[i][1], 0) / 2;
    assert(Math.abs(area) > 0.001, 'Nondegenerate polygon');
  }
  assert.equal((lakePath(f).match(/[ML]/g) || []).length, m.vertices, 'Every upstream vertex retained');
}
const inside = (ring, [x, y]) => {
  let odd = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) odd = !odd;
  }
  return odd;
};
const como = source.features.find(f => f.id === 'como').geometry.coordinates[0];
assert(inside(como, [9.095, 45.85]), 'Como southwest arm remains water');
assert(inside(como, [9.38, 45.87]), 'Como southeast/Lecco arm remains water');
assert(!inside(como, [9.25, 45.93]), 'Land peninsula between Como forks stays dry');
assert.equal(source.features.find(f => f.id === 'maggiore').properties.sourceProperties.name, 'Lago di Como', 'Retain erroneous upstream name transparently');
assert.notEqual(manifest.find(m => m.id === 'maggiore').ne_id, manifest.find(m => m.id === 'como').ne_id);

// Keep this contract local to lakes; future illustration changes must not be frozen here.
const entrypoint = "el('use',{href:'#lakeGeometry','data-context-layer':'lakes','aria-hidden':'true','pointer-events':'none'},$('#areaLayer'));\n";
assert.equal(html.split(entrypoint).length, 2, 'Exactly one isolated runtime composition call');
const items = JSON.parse(html.match(/const ITEMS=(\[.*?\]);/)[1]);
assert.equal(items.length, 45);
assert(!items.some(i => source.features.some(f => i.id === f.id || i.id === 'lake-' + f.id)), 'Lakes never enter the curriculum');
assert(html.includes(lakeMarkup()), 'Generated canonical inline lake definitions are current');
const errors = [], vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(e.message));
const live = new JSDOM(html, {url: 'https://topo.test/', runScripts: 'dangerously', virtualConsole: vc,
  beforeParse(w) {w.HTMLElement.prototype.scrollIntoView = () => {};}});
const fallback = new JSDOM(html);
for (const dom of [live, fallback]) {
  const d = dom.window.document, geometry = d.querySelector('#lakeGeometry');
  assert.equal(geometry.children.length, 6);
  for (const f of source.features) assert.equal(geometry.querySelector(`[data-lake="${f.id}"]`).getAttribute('d'), lakePath(f));
  assert.equal(geometry.getAttribute('pointer-events'), 'none');
  assert.equal(geometry.getAttribute('aria-hidden'), 'true');
  assert.equal(geometry.querySelectorAll('[tabindex], [data-id], text, title, a').length, 0, 'No lake learning/click/focus/label targets');
  const use = d.querySelector(dom === live ? '#areaLayer > use[data-context-layer="lakes"]' : '#previewMap > use[data-context-layer="lakes"]');
  assert.equal(use.getAttribute('href'), '#lakeGeometry');
  assert.equal(use.getAttribute('pointer-events'), 'none');
  if (dom === live) {
    assert.equal(d.querySelector('#areaLayer').lastElementChild, use, 'Lakes above all schematic zones');
    const layers = [...d.querySelector('#map').children];
    assert(layers.indexOf(d.querySelector('#areaLayer')) < layers.indexOf(d.querySelector('#riverLayer')), 'Lakes below rivers and point targets');
  }
  if (dom === fallback) {
    const preview = d.querySelector('#previewMap');
    assert.equal(preview.querySelector('[data-context-layer="lakes"]').getAttribute('href'), '#lakeGeometry');
    assert(preview.querySelector('[data-context-layer="lakes"]').compareDocumentPosition(preview.querySelector('[data-reference-id="water-F"]')) & 4, 'Static lake layer below river marks');
  } else assert.equal(d.querySelector('#previewMap'), null, 'Runtime replaces fallback without removing canonical lakes');
  dom.window.close();
}
assert.deepEqual(errors, []);
for (const file of ['output/html/topo-italie-interactief.html', 'output/html/topo-italie-duolingo.html']) assert.equal(read(file).toString(), html, 'Standalone inline geometry parity');
console.log('Six pinned lake polygons, exact projection/envelopes/hashes, Como forks, live/static/offline parity and noninteractive background contract: OK');
