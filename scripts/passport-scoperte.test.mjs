import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import { scoperteView } from './passport-scoperte.mjs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const titles = runInNewContext(`(${html.match(/const ROUTE_TITLES=(\{[^\n]+\});/)[1]})`);
const chapters = Object.entries(titles).map(([id, title]) => ({ id, title, itemIds: [id + '-fixture'] }));
const box = {};
runInNewContext(readFileSync(new URL('./route-engine.js', import.meta.url), 'utf8'), box);
const R = box.TopoRoute;
const rows = data => scoperteView(data, chapters).flatMap(page => page.chapters);
const snapshot = value => JSON.stringify(value);
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };

test('fresh canonical state stays empty and read-only; titles and page mapping come from the app', () => {
  const route = freeze(R.fresh()), before = snapshot(route);
  const view = scoperteView(route, chapters);
  assert.deepEqual(view.map(p => [p.number, p.side, p.title]), [[3, 'left', 'SCOPERTE I'], [4, 'right', 'SCOPERTE II']]);
  assert.deepEqual(rows(route).map(r => r.id), ['city1', 'city2', 'city3', 'city4', 'islands', 'mountains']);
  for (const row of rows(route)) {
    assert.equal(row.title, titles[row.id]);
    assert.equal(row.completed, false); assert.equal(row.gold, false);
    assert.equal(row.stampState, 'unearned'); assert.equal(row.action, 'learn');
  }
  assert.equal(snapshot(route), before);
});

function finish(route, id, kind, wrong = false) {
  assert.ok(R.start(route, chapters, id, kind, 1800000000000, () => 0.5));
  let n = 0;
  while (R.current(route)) {
    assert.ok(++n < 40, 'bounded real route run');
    R.answer(route, chapters, !(wrong && n === 1), 1800000000001, () => 0.5);
    R.advance(route, chapters, 1800000000002);
  }
}

test('actual engine completion, failed Gold, genuine Gold, replay and reload project without awards', () => {
  const route = R.fresh();
  for (const stage of ['discover', 'point', 'write']) finish(route, 'city1', stage);
  assert.equal(rows(route).filter(r => r.completed).length, 1);
  assert.equal(rows(route)[0].gold, false);
  finish(route, 'city1', 'gold', true);
  assert.equal(rows(route)[0].gold, false);
  finish(route, 'city1', 'gold');
  const goldAt = route.chapters.city1.goldAt;
  assert.ok(goldAt > 0); assert.equal(rows(route)[0].gold, true);
  finish(route, 'city1', 'gold');
  assert.equal(route.chapters.city1.goldAt, goldAt);
  const restored = R.restore(JSON.parse(snapshot(route)), chapters);
  const before = snapshot(restored);
  for (let n = 0; n < 10; n++) assert.deepEqual(rows(restored), rows(route));
  assert.equal(snapshot(restored), before);
});

test('all six completed, selective and multiple Gold; Isole completion has no approved image claim', () => {
  const route = R.fresh();
  const ids = ['city1', 'city2', 'city3', 'city4', 'islands', 'mountains'];
  for (const id of ids) for (const stage of ['discover', 'point', 'write']) finish(route, id, stage);
  assert.equal(rows(route).filter(r => r.completed).length, 6);
  assert.equal(rows(route).filter(r => r.gold).length, 0);
  for (const id of ['city2', 'islands', 'mountains']) finish(route, id, 'gold');
  const before = snapshot(route);
  assert.deepEqual(rows(freeze(route)).filter(r => r.gold).map(r => r.id), ['city2', 'islands', 'mountains']);
  assert.equal(rows(route).find(r => r.id === 'islands').stampState, 'awaiting-corrected-art');
  assert.equal(snapshot(route), before);
  const allGold = R.restore(JSON.parse(before), chapters);
  for (const id of ['city1', 'city3', 'city4']) finish(allGold, id, 'gold');
  assert.equal(rows(allGold).filter(r => r.gold).length, 6);
  assert.equal(rows(R.fresh()).filter(r => r.completed || r.gold).length, 0);
});

test('stale Gold on incomplete state never displays Gold; no coercion or extra chapters', () => {
  for (const stage of [0, 1, 2, 4, '3', undefined]) {
    const route = { chapters: { city1: { stage, goldAt: 10 } } };
    assert.equal(rows(route)[0].gold, false); assert.equal(rows(route)[0].completed, false);
  }
  assert.throws(() => scoperteView(R.fresh(), chapters.filter(c => c.id !== 'islands')), /Missing canonical passport chapter: islands/);
});
