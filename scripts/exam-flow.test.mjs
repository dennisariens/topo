import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source, 'app script present');
const examCode = source.slice(source.indexOf('function worksheetCode('), source.indexOf('function revealItem('));
assert.ok(examCode.includes('function finishExam('), 'finite exam result exists');
const engineContext = {};
runInNewContext(readFileSync(new URL('./learning-engine.js', import.meta.url), 'utf8'), engineContext);

const items = [
  { id: 'area-a', name: 'Sicilië', code: 'a', kind: 'area', aliases: [] },
  { id: 'water-A', name: 'Middellandse Zee', code: 'A', kind: 'water', aliases: [] },
  { id: 'city-9', name: 'Rome', code: '9', kind: 'city', aliases: [] }
];
const nodes = new Map();
function node(key) {
  if (!nodes.has(key)) nodes.set(key, {
    value: '', textContent: '', disabled: false, placeholder: '',
    classList: { add() {}, toggle() {} }, setAttribute() {}, focus() {}
  });
  return nodes.get(key);
}
const state = {
  mode: 'exam', current: null, answered: true, examPool: [], examTotal: 0,
  examAnswered: 0, examCorrect: 0, examEnded: false, examModes: [], examModeIndex: 0,
  good: 0, pizzas: 0, slices: 0, trips: 0, streak: 0, mistakes: []
};
const context = {
  state, ITEMS: items, TopoLearning: engineContext.TopoLearning,
  $: node, groupItems: () => items, clearActive() {}, highlight() {}, sync() {},
  message: (text) => { node('#message').textContent = text; },
  hideLens() {}, showLens() {}, isRomeArea: () => false, celebrateTrip() {},
  norm: value => (value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
};
runInNewContext(`${examCode}\nthis.exam={resetExam,next,check,grade};`, context);
const E = context.exam;

node('#testFormat').value = 'codeName';
E.resetExam();
assert.equal(state.examTotal, 3);
assert.equal(state.questionMode, 'codeName');
assert.match(node('#prompt').textContent, /welke naam/i);
node('#answer').value = state.current.name;
E.check();
assert.equal(state.examCorrect, 1);
assert.equal(state.examAnswered, 1);
E.next();
assert.equal(state.examAnswered, 1);
E.grade(false, null, true);
assert.equal(state.examAnswered, 2, 'skipped questions count as answered');
E.next();
E.grade(false, null, true);
E.next();
assert.equal(state.examEnded, true);
assert.equal(node('#prompt').textContent, '1 van 3 goed');
E.next();
assert.equal(state.examAnswered, 0, 'restart resets finite score');

node('#testFormat').value = 'nameCode';
E.resetExam();
assert.equal(state.questionMode, 'nameCode');
while (state.examAnswered < state.examTotal) {
  const correct = state.current.code;
  node('#answer').value = correct === 'a' ? 'A' : correct === 'A' ? 'a' : correct;
  E.check();
  assert.equal(state.answered, true);
  if (correct !== '9') {
    assert.match(node('#message').textContent, /juiste antwoord is (kleine letter a|hoofdletter A)/);
  }
  if (state.examAnswered < state.examTotal) E.next();
}
assert.equal(state.examCorrect, 1, 'uppercase and lowercase codes cannot be swapped');
E.next();
assert.equal(node('#prompt').textContent, '1 van 3 goed');

node('#testFormat').value = 'both';
E.resetExam();
const directions = new Set();
for (let i = 0; i < 3; i++) {
  directions.add(state.questionMode);
  E.grade(false, null, true);
  if (i < 2) E.next();
}
assert.ok(directions.has('codeName') && directions.has('nameCode'), 'default test uses both directions');
assert.match(html, /id="groupPicker"/, 'worksheet groups remain selectable');
assert.match(html, /id="testFormat"/, 'test format selector present');
console.log('Finite worksheet test, both directions, scoring, restart and letter case: OK');
