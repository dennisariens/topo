// Owner UX round, 7 November 2026: Reis tab, second introduction, Schoolkaart only, one pizza meter, ride button, book keys.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {JSDOM,VirtualConsole} from 'jsdom';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function boot({storage={},width=1500,height=1000,discovery=false}={}){const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(html,{url:'https://ux.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.innerWidth=width;w.innerHeight=height;w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=()=>{};w.confirm=()=>true;w.matchMedia=()=>({matches:true,addEventListener(){}});w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};for(const [k,v]of Object.entries(storage))w.localStorage.setItem(k,v);if(discovery)w.NINO_DISCOVERY_MAP=true}});return {w:dom.window,d:dom.window.document,ev:s=>dom.window.eval(s),close:()=>dom.window.close(),errors};}
const settle=()=>new Promise(r=>setTimeout(r,20));
const button=(a,text,root=a.d)=>[...root.querySelectorAll('button')].find(b=>b.textContent===text);
const tab=a=>[...a.d.querySelectorAll('.ninoNav button')].filter(b=>b.getAttribute('aria-current')==='page').map(b=>b.textContent).join();
const dump=a=>{const out={};for(let i=0;i<a.w.localStorage.length;i++){const k=a.w.localStorage.key(i);out[k]=a.w.localStorage.getItem(k);}return out;};
const lesson=a=>a.d.querySelector('.layout').classList.contains('routeLessonLayout');

test('skipped introduction is offered once at the first route lesson; Start meteen opens it under Reis; never again after reload',async()=>{
 const a=boot();let saved;try{await settle();assert(a.d.querySelector('.ninoProfile').open);a.d.querySelector('.ninoProfile [data-profile-cancel]').click();
  assert.equal(a.w.localStorage.getItem('topo-nino-intro-v1'),'skipped');assert.equal(tab(a),'Reis');
  a.d.getElementById('routeContinue').click();const offer=a.d.querySelector('.ninoIntroOffer');assert(offer?.open,'second offer');assert.equal(a.ev('state.route.active'),null,'the lesson waits for the choice');
  assert(button(a,'Maak kennis met Nino',offer)&&button(a,'Start meteen',offer));assert.equal(a.w.localStorage.getItem('topo-nino-intro-v1'),'offered');
  button(a,'Start meteen',offer).click();await settle();assert(!a.d.querySelector('.ninoIntroOffer'));assert(lesson(a));assert.equal(tab(a),'Reis');assert.equal(a.ev('state.mode'),'route');
  for(let n=0;n<14&&a.ev('state.questionMode')!=='point';n++){(a.d.querySelector('#finishScreen button.primary')||a.d.getElementById('next')).click();await settle();}assert.equal(a.ev('state.questionMode'),'point','Ontdekken has no answers; Aanwijzen follows');assert.equal(tab(a),'Reis');
  const id=a.ev('state.current.id');a.ev('routeGrade(true)');await settle();assert.equal(a.ev('state.good'),1);
  assert.match(a.d.querySelector('#ninoMeter .ninoMeterPoints').textContent,/^1 van 8/);saved=dump(a);assert.equal(a.ev('state.current.id'),id);assert.deepEqual(a.errors,[]);
 }finally{a.close()}
 const b=boot({storage:saved});try{await settle();assert(!b.d.querySelector('.ninoProfile'),'no onboarding after reload');b.d.getElementById('routeContinue').click();await settle();assert(!b.d.querySelector('.ninoIntroOffer'),'not offered again');assert(lesson(b));assert.equal(tab(b),'Reis');
  // Name and favourite stay editable from the book.
  button(b,'Reisboekje').click();button(b,'Pas mijn boekje aan').click();const dialog=b.d.querySelector('.ninoProfile');assert(dialog.open);assert.equal(button(b,'Annuleren',dialog).textContent,'Annuleren');dialog.querySelector('[name="name"]').value='Mila';dialog.querySelector('[value="salami"]').checked=true;dialog.querySelector('form').dispatchEvent(new b.w.Event('submit',{cancelable:true}));assert.equal(b.ev('TopoProfile.current().name'),'Mila');assert.equal(b.ev('TopoProfile.current().favoritePizza'),'salami');assert.deepEqual(b.errors,[]);
 }finally{b.close()}});

test('Maak kennis met Nino runs the introduction, then the chosen lesson',async()=>{const a=boot();try{await settle();a.d.querySelector('.ninoProfile [data-profile-cancel]').click();
 a.d.getElementById('smartStart').click();button(a,'Maak kennis met Nino').click();const dialog=a.d.querySelector('.ninoProfile');assert(dialog.open);assert.equal(dialog.querySelector('[type="submit"]').textContent,'Andiamo!');assert(!lesson(a),'introduction first');
 dialog.querySelector('[name="name"]').value='Ada';dialog.querySelector('[value="margherita"]').checked=true;dialog.querySelector('form').dispatchEvent(new a.w.Event('submit',{cancelable:true}));await settle();
 assert(lesson(a));assert.equal(a.ev('state.route.active.kind'),'smart','the lesson the learner chose');assert.equal(a.ev('TopoProfile.current().name'),'Ada');assert.equal(a.w.localStorage.getItem('topo-nino-intro-v1'),'done');assert.equal(tab(a),'Reis');assert.deepEqual(a.errors,[]);
 }finally{a.close()}});

test('completed introduction, legacy saves and existing journey progress go straight to the lesson',async()=>{
 for(const storage of [{'topo-nino-intro-v1':'done'},{'topo-nino-profile-v1':JSON.stringify({schema:1,name:'',coverColor:'riviera',favoritePizza:null})}]){const a=boot({storage});try{await settle();if(a.d.querySelector('.ninoProfile'))a.d.querySelector('.ninoProfile [type="submit"]').click();a.d.getElementById('routeContinue').click();await settle();assert(!a.d.querySelector('.ninoIntroOffer'));assert(lesson(a))}finally{a.close()}}
 const a=boot();try{await settle();a.d.querySelector('.ninoProfile [data-profile-cancel]').click();a.ev("state.route.chapters.city1.stage=1;persist()");a.d.getElementById('routeContinue').click();await settle();assert(!a.d.querySelector('.ninoIntroOffer'),'existing journey progress');assert(lesson(a));assert.equal(a.w.localStorage.getItem('topo-nino-intro-v1'),'skipped')}finally{a.close()}});

test('Oefenen marks free practice; route lessons from Reis never mark Oefenen',async()=>{const a=boot({storage:{'topo-nino-intro-v1':'done'}});try{await settle();
 a.d.getElementById('routeContinue').click();await settle();assert.equal(tab(a),'Reis');
 button(a,'Oefenen').click();await settle();assert.equal(tab(a),'Oefenen');assert.equal(a.ev('state.mode'),'learn');
 a.d.querySelector('[data-mode="write"]').click();await settle();assert.equal(tab(a),'Oefenen');
 button(a,'Reis').click();await settle();assert.equal(tab(a),'Reis');a.d.getElementById('routeContinue').click();await settle();assert.equal(tab(a),'Reis');assert(lesson(a));
 button(a,'Reis').click();button(a,'Oefenen').click();await settle();assert.equal(a.ev('state.mode'),'write','returns to the last free exercise');assert.equal(tab(a),'Oefenen');assert.deepEqual(a.errors,[]);
 }finally{a.close()}});

test('only the Schoolkaart is offered; a saved Ontdekkingskaart preference falls back without touching lesson or progress',async()=>{
 const a=boot({storage:{'topo-ui-map-style-v1':'discovery','topo-nino-intro-v1':'done'}});try{await settle();assert(a.d.body.classList.contains('ninoSchoolMapOnly'));assert(a.d.querySelector('.atlasOptions'),'atlas code stays available');
  for(const m of ['learn','point','write','exam']){a.ev('mode('+JSON.stringify(m)+')');await settle();assert.equal(a.d.body.dataset.mapTheme,'school',m)}
  a.ev("mode('route')");a.d.getElementById('routeContinue').click();await settle();assert.equal(a.ev('state.questionMode'),'discover');assert.equal(a.d.body.dataset.mapTheme,'school','route discovery uses the Schoolkaart');
  assert.equal(a.w.localStorage.getItem('topo-ui-map-style-v1'),'discovery','stored preference kept for a later version');assert.deepEqual(a.errors,[]);
 }finally{a.close()}
 const b=boot({discovery:true,storage:{'topo-nino-intro-v1':'done'}});try{await settle();b.ev("mode('learn')");await settle();assert.equal(b.d.body.dataset.mapTheme,'discovery','switch re-enables the Discovery code');assert(!b.d.body.classList.contains('ninoSchoolMapOnly'))}finally{b.close()}});

test('one pizza meter in lessons: points, saved pizzas and the last-pizza announcement; legacy meters hidden',async()=>{const a=boot({storage:{'topo-nino-intro-v1':'done'}});try{await settle();
 a.ev("state.pizzas=2;state.slices=7;state.good=23;sync()");a.d.getElementById('routeContinue').click();await settle();
 const meters=a.d.querySelectorAll('#ninoMeter');assert.equal(meters.length,1);const meter=meters[0];assert(a.d.getElementById('quiz').contains(meter));
 for(const id of ['lessonReward','pizzaRow','pizzaCaption'])assert(a.d.getElementById(id).classList.contains('ninoLegacyMeter'),id);
 assert(a.d.getElementById('pizzaRow').previousElementSibling.classList.contains('ninoLegacyMeter'),'old Pizza meter heading');assert(!a.d.getElementById('resetPizza').classList.contains('ninoLegacyMeter'),'reset stays available');
 assert.match(meter.querySelector('.ninoMeterPoints').textContent,/^7 van 8 punten voor Quattro Formaggi$/);assert.equal(meter.querySelector('.ninoMeterGoal').textContent,'Nog één pizza tot je Vespa-rit');
 assert.equal(meter.querySelector('.ninoMeterWheel').dataset.slices,'7');assert.equal(meter.querySelectorAll('.ninoMeterSaved .pizzaWheel').length,2);
 a.ev("state.pizzas=1;state.slices=0;sync()");assert.equal(meter.querySelector('.ninoMeterGoal').textContent,'Nog twee pizza’s tot je Vespa-rit');
 a.ev("state.pizzas=3;sync()");assert.equal(meter.querySelector('.ninoMeterGoal').textContent,'Nog drie pizza’s tot je Vespa-rit');assert.equal(meter.querySelectorAll('.ninoMeterSaved .pizzaWheel').length,0);
 a.ev('Object.defineProperty(document.documentElement,"clientWidth",{configurable:true,get:()=>820});window.innerWidth=820;window.innerHeight=1180;TopoFocus.apply()');await settle();assert.equal(a.d.body.dataset.focusMode,'true');assert.equal(meter.parentNode,a.d.getElementById('focusAnswerSheet'),'tablet/phone: in the answer sheet');
 a.ev('Object.defineProperty(document.documentElement,"clientWidth",{configurable:true,get:()=>1500});window.innerWidth=1500;window.innerHeight=1000;TopoFocus.apply()');await settle();assert.notEqual(a.d.body.dataset.focusMode,'true');assert.equal(meter.previousElementSibling,a.d.getElementById('routeLessonBar'));assert.deepEqual(a.errors,[]);
 }finally{a.close()}});

test('after Bewaar and Annuleren in profile editing, arrow keys page the book again',async()=>{const a=boot({storage:{'topo-nino-intro-v1':'done'},width:1500});try{await settle();if(a.d.querySelector('.ninoProfile'))a.d.querySelector('.ninoProfile [data-profile-cancel]').click();
 const book=a.d.getElementById('travelBook'),label=()=>book.querySelector('.bookFooter .micro').textContent,key=k=>a.d.activeElement.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:k,bubbles:true}));
 button(a,'Reisboekje').click();assert(book.open);
 for(const finish of ['save','cancel']){
  button(a,'Pas mijn boekje aan').click();const dialog=a.d.querySelector('.ninoProfile');assert(dialog.open);
  if(finish==='save')dialog.querySelector('form').dispatchEvent(new a.w.Event('submit',{cancelable:true}));else button(a,'Annuleren',dialog).click();
  assert(book.contains(a.d.activeElement),finish+': focus returns inside the book');assert.equal(a.d.activeElement.textContent,'Pas mijn boekje aan');
  const before=label();key('ArrowRight');const second=label();assert.notEqual(second,before,finish+': ArrowRight pages');key('ArrowRight');assert.notEqual(label(),second,finish+': a second ArrowRight keeps paging');key('ArrowLeft');key('ArrowLeft');assert.equal(label(),before,finish+': ArrowLeft pages back');assert(book.contains(a.d.activeElement));
 }
 assert.deepEqual(a.errors,[]);
 }finally{a.close()}});

test('a free question on the same place as a suspended route question never restores the route view',async()=>{const a=boot({storage:{'topo-nino-intro-v1':'done'}});try{await settle();
 a.d.getElementById('routeContinue').click();await settle();a.ev("state.questionMode='point'");const item=a.ev('state.current.id');
 button(a,'Oefenen').click();await settle();a.ev('state.current=byId['+JSON.stringify(item)+']');
 button(a,'Reis').click();await settle();a.d.getElementById('routeContinue').click();await settle();
 assert.equal(a.ev('state.mode'),'route','route lesson resumes in route mode');assert.equal(tab(a),'Reis');assert(lesson(a));assert.deepEqual(a.errors,[]);
 }finally{a.close()}});
