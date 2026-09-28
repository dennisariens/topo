import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';

// Execute the ENTIRE v6-derived app, including its boot code and button handlers.
// This minimal DOM exercises logic, not browser layout or touch geometry.
class Node {
  constructor() {
    this.children = []; this.events = {}; this.attrs = {}; this.dataset = {};
    this.value = ''; this.textContent = ''; this.disabled = false; this.style = { setProperty(name,value) { this[name] = value; } };
    this.classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(name => this.classes.add(name)), remove: (...names) => names.forEach(name => this.classes.delete(name)),
      toggle: (name, force) => {
        const add = force === undefined ? !this.classes.has(name) : force;
        if (add) this.classes.add(name); else this.classes.delete(name);
        return add;
      }, contains: name => this.classes.has(name)
    };
  }
  set innerHTML(value) {
    this.html = value;
    if (this.id === 'romeLens') this.children = ['city-9','area-o'].map(choice => {
      const button = new Node(); button.dataset.choice = choice; return button;
    });
  }
  get innerHTML() { return this.html || ''; }
  append(...children) { this.children.push(...children); }
  prepend(...children) { this.children.unshift(...children); }
  after() {}
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attrs[name] = value; }
  getAttribute(name) { return this.attrs[name]; }
  addEventListener(name, handler) { (this.events[name] ||= []).push(handler); }
  querySelectorAll(selector) { return selector === 'button' ? this.children : []; }
  querySelector(selector) { return selector === 'button' ? this.children[0] : null; }
  focus() {}
  click() {
    if(this.disabled)return;
    const event = { target:this, stopPropagation() {}, preventDefault() {} };
    this.onclick?.(event);
    for (const handler of this.events.click || []) handler(event);
  }
}

const elements = new Map();
const get = selector => {
  if (!elements.has(selector)) {
    const element = new Node(); element.id = selector.slice(1);
    elements.set(selector, element);
  }
  return elements.get(selector);
};
get('#groupSelect').value = 'city1';
get('#testFormat').value = 'both';
const tabs = ['learn','point','write','exam','route'].map(mode => {
  const tab = new Node(); tab.dataset.mode = mode; return tab;
});
const document = {
  querySelector: get,
  querySelectorAll: selector => selector === '.tab' ? tabs
    : selector === '#learnList button' ? get('#learnList').children : [],
  createElement: () => new Node(), createElementNS: () => new Node(),
  addEventListener() {}
};
const stored = new Map();
const context = createContext({
  document, print() {},
  localStorage: { getItem: key => stored.get(key) || null, setItem: (key,value) => stored.set(key,value) },
  confirm: () => true, setTimeout: () => 1,
  MouseEvent: class { constructor(type) { this.type = type; } }
});
context.window = context; // Browser window and global object are the same object.
const html = readFileSync(new URL('../output/html/topo-italie-interactief.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 3, 'standalone HTML loads its complete logic internally');
scripts.forEach((match, index) => runInContext(match[1], context, { filename:`standalone-${index}.js` }));
const inspect = expression => runInContext(expression, context);
assert.equal(inspect('state.mode'),'route','new learners see the journey first');
tabs[0].click();

assert.equal(get('#groupCount').textContent, '6 namen in deze groep');
assert.ok(get('#learnPrompt').textContent, 'learn mode booted with a visible name');
get('#learnNext').click();
get('#groupSelect').value = 'countries'; get('#groupSelect').onchange();
assert.equal(get('#groupCount').textContent, '7 namen in deze groep');
get('#nameToggle').onchange();
get('#schoolToggle').onchange({ target:{ checked:true } });
assert.equal(get('#school').classList.contains('hidden'), false);
get('#printMap').click(); // The in-app reference map is printable without navigation.
inspect('romeHit.click()');
assert.equal(inspect('lens.classList.contains("hidden")'), false, 'Rome/Vatican selector opens on a tap');
inspect('lens.querySelectorAll("button")[1].click()');
assert.equal(get('#learnPrompt').textContent, 'Vaticaanstad', 'magnified selector can pick Vatican City');
assert.equal(get('#groupSelect').value, 'countries', 'selecting a map item updates its learning group');

tabs[1].click();
assert.equal(get('#groupCount').textContent, '7 namen in deze groep', 'pointing uses the selected group');
get('#groupSelect').value='city1';get('#groupSelect').onchange();
assert.ok(Number(inspect('state.current.code'))>=1 && Number(inspect('state.current.code'))<=6, 'pointing can practice cities 1–6');
get('#groupSelect').value='seas';get('#groupSelect').onchange();
assert.equal(get('#groupCount').textContent, '5 namen in deze groep');
assert.equal(inspect('state.current.kind'), 'water', 'pointing can practice only seas');
assert.match(get('#prompt').textContent, /^Waar ligt /);
inspect('elements[state.current.id].click()');
assert.equal(Number(get('#good').textContent), 1, 'pointing awards a correct answer');
inspect('state.slices=7;state.pizzas=2;state.trips=0;next()');
inspect('elements[state.current.id].click()');
assert.equal(inspect('state.pizzas'), 3, 'eight slices form another pizza');
assert.equal(inspect('state.trips'), 1, 'three pizzas advance the Vespa');
assert.match(get('#vespaTripText').textContent,/Nino rijdt van /,'the earned milestone names the character and destination');
get('#next').click();
const skipped = inspect('state.current.id');
get('#next').click();
assert.equal(inspect('state.answered'), true, 'first Next on an unanswered question shows its answer');
assert.ok(inspect('state.mistakes').includes(skipped), 'skipped question enters the review list');
get('#next').click();
const revealed = inspect('state.current.id');
get('#reveal').click();
assert.ok(inspect('state.mistakes').includes(revealed), 'revealed question enters the review list');
get('#next').click();

tabs[2].click();
assert.equal(get('#inputWrap').classList.contains('hidden'), false);
get('#groupSelect').value='city2';get('#groupSelect').onchange();
assert.ok(Number(inspect('state.current.code'))>=7 && Number(inspect('state.current.code'))<=12, 'writing can practice cities 7–12');
get('#answer').value = inspect('state.current.name');
get('#check').click();
assert.equal(Number(get('#good').textContent), 3, 'typing a correct name works');

tabs[3].click();
assert.equal(get('#testSetup').classList.contains('hidden'), false);
get('#groupSelect').value='countries';get('#groupSelect').onchange();
assert.equal(get('#groupCount').textContent, '7 namen in deze toets');
get('#testFormat').value = 'nameCode';get('#testFormat').onchange();
assert.match(get('#prompt').textContent, /^Welke /);
get('#answer').value = inspect('state.current.code'); get('#check').click();
assert.ok(Number(get('#good').textContent)>=3, 'worksheet-code answer works');
get('#testFormat').value='codeName';get('#testFormat').onchange();
assert.match(get('#prompt').textContent, /^Welke naam hoort bij /);
get('#answer').value=inspect('state.current.name');get('#check').click();
assert.match(get('#message').textContent, /^Goed!/, 'reverse worksheet-code answer works');
get('#groupSelect').value = 'city1'; get('#groupSelect').onchange();
assert.equal(get('#groupCount').textContent, '6 namen in deze toets');
get('#resetPizza').click();get('#resetAll').click();
assert.equal(Number(get('#good').textContent), 0, 'reset button clears progress');
assert.match(get('#prompt').textContent, /^Welke /, 'test remains usable after reset');
console.log('Full standalone boot and learn/point/write/exam/reset button flow: OK');

// Drive every chapter through the visible controls, including both enclave choices.
tabs[4].click();
assert.equal(get('#routeHome').classList.contains('hidden'),false);
assert.equal(get('#routeCards').children.length,11);
assert.equal(inspect('TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,"city2")'),false);
get('#routeContinue').click();
assert.equal(inspect('state.questionMode'),'discover');
get('#next').click();
const resumeIndex=inspect('state.route.active.index');
tabs[0].click();tabs[4].click();get('#routeContinue').click();
assert.equal(inspect('state.route.active.index'),resumeIndex,'switching away resumes the same card');
assert.equal(get('#routeMapDock').classList.contains('hidden'),false,'small-screen dock available in route lesson');
let deliberatelyWrong=false,routeActions=0;
function answerRouteTask(useDock=false){
 const mode=inspect('state.questionMode'),id=inspect('state.current?.id');
 if(mode==='discover'){get('#next').click();return}
 if(!deliberatelyWrong&&mode==='point'){
   deliberatelyWrong=true;get('#next').click();
   assert.equal(inspect('state.route.active.wrong'),1);
 }else if(mode==='point'){
   if(id==='area-o'||id==='city-9'){
     inspect('romeHit.click()');
     inspect(`lens.querySelectorAll('button')[${id==='city-9'?0:1}].click()`);
   }else if(id==='area-n')inspect('sanHit.click()');
   else inspect('elements[state.current.id].click()');
 }else{
   const answer=inspect(mode==='nameCode'?'state.current.code':'state.current.name');
   if(useDock){get('#routeDockAnswer').value=answer;get('#routeDockCheck').click()}
   else{get('#answer').value=answer;get('#check').click()}
 }
 assert.equal(inspect('state.answered'),true,'route answer accepted through its control');
 const good=inspect('state.good');get('#check').click();assert.equal(inspect('state.good'),good,'disabled check cannot duplicate a slice');
 if(useDock)get('#routeDockNext').click();else get('#next').click();
}
const chapterIds=inspect('ROUTE_CHAPTERS.map(c=>c.id)');
for(const chapterId of chapterIds){
 if(chapterId!=='city1'){
   assert.equal(get('#routeCards').children.filter(card=>card.children[0]?.classes.has('ninoBadge')).length,1,'Nino moves to the next available chapter');
   get('#routeContinue').click();
 }
 while(inspect(`TopoRoute.record(state.route,${JSON.stringify(chapterId)}).stage`)<4){
   if(inspect('state.route.active.done'))get('#next').click();
   else answerRouteTask(++routeActions%2===0);
   assert.ok(routeActions<650,'route cannot silently loop forever');
 }
 assert.equal(inspect('state.route.active.result.newlyCompleted'),true);
 get('#routeExtra').click();
 assert.equal(inspect('state.route.active.kind'),'gold');
 while(!inspect('state.route.active.done'))answerRouteTask(++routeActions%2===0);
 assert.ok(inspect(`TopoRoute.record(state.route,${JSON.stringify(chapterId)}).goldAt`)>0,'gold earned after point and write coverage');
 get('#next').click();
}
assert.match(get('#routeSummary').textContent,/11 \/ 11.*11 goud/);
assert.ok(JSON.parse(stored.get('topo-italie-v3')).route.chapters.rivers.goldAt>0,'last chapter and gold persisted');
const beforeReset=inspect('state.pizzas');
get('#routeReset').click();
assert.equal(inspect('state.pizzas'),beforeReset,'route-only reset preserves earned pizzas');
assert.equal(inspect('TopoRoute.record(state.route,"city1").stage'),0);
tabs[1].click();get('#resetAll').click();
assert.equal(inspect('state.good'),0);
assert.equal(inspect('Object.keys(state.route.chapters).length'),0,'full reset removes route progress');
console.log('All 11 route chapters and gold tests, dock controls, mode switch, resume and reset: OK');
