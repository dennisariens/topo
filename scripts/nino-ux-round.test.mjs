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

const FULL=()=>{const ids=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','countries','seas','rivers'];return JSON.stringify({schema:3,good:168,pizzas:21,slices:0,trips:7,mistakes:[],route:{schema:2,chapters:Object.fromEntries(ids.map(id=>[id,{stage:3,completedAt:1,goldAt:1,nextReviewAt:0,reviews:0}])),items:{},rewardTokens:[],active:null},daily:{date:'2026-11-06',correct:0}});};
test('four postcard backs carry Nino’s message on the reverse art and turn within the same card',async()=>{const a=boot({storage:{'topo-nino-intro-v1':'done','topo-italie-v3':FULL()}});try{await settle();
 const expected={'Sicilia, souvenir van je eilandenles':'Ciao dalla Sicilia!Vanaf het eiland zie je de Etna, een van de actiefste vulkanen van Europa.Groetjes, Nino','Sardegna, souvenir van je eilandenles':'Ciao dalla Sardegna!Langs de kust vind je baaien met helderblauw water. Welke zou jij willen ontdekken?Groetjes, Nino','Venetië, je derde Vespa-rit':'Ciao da Venezia!Hier varen gondels door de stad. Kijk maar eens hoeveel bruggetjes je kunt tellen.Groetjes, Nino','Napels, je zesde Vespa-rit':'Ciao da Napoli!De stad staat bekend om haar pizza. Welke zou jij hier bestellen?Groetjes, Nino'};
 button(a,'Reisboekje').click();const book=a.d.getElementById('travelBook'),next=button(a,'Volgende',book.querySelector('.bookFooter')),seen={};
 for(let n=0;n<12;n++){for(const fig of book.querySelectorAll('.earnedPostcard')){const label=fig.querySelector('figcaption').textContent,face=fig.querySelector('.postcardFace'),flip=fig.querySelector('.bookLink'),front=face.querySelector('.postcardFront'),back=face.querySelector('.postcardBack');
   assert.equal(face.children.length,2,'front and back share one box');assert(!front.hidden&&back.hidden);assert.equal(flip.textContent,'Bekijk achterkant');
   flip.click();assert(front.hidden&&!back.hidden);assert.equal(flip.textContent,'Bekijk voorkant');assert.equal(flip.getAttribute('aria-pressed'),'true');assert.equal(back.querySelector('img').src,a.ev('NINO_V2_ART.reverse.src'),'existing reverse artwork');
   seen[label]=back.querySelector('.postcardMessage').textContent;flip.click();assert(!front.hidden&&back.hidden);assert.equal(flip.textContent,'Bekijk achterkant');}
  if(next.disabled)break;next.click();}
 assert.deepEqual(seen,expected);assert.deepEqual(a.errors,[]);
 }finally{a.close()}});

test('design preview is a separate file: in-memory states, direct choices and a ride preview that changes nothing',async()=>{
 assert(!html.includes('NINO_DESIGN_PREVIEW')&&!html.includes('Speel Vespa-rit af'),'regular app has no demo interface');
 const preview=readFileSync(new URL('../output/html/NINO-2-Ontwerppreview-2026-11-07-r2.html',import.meta.url),'utf8');
 assert.equal(preview.replace(/<head>\n<script>\n[\s\S]*?<\/script>\n<style>[^<]*<\/style>/,'<head>').replace('<title>Ontwerppreview · ','<title>'),html,'preview = app + preview layer only');
 for(const [hash,stops,trips] of [['steden-7-12',1,0],['eilanden',4,0],['volledig',11,7]]){const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(preview,{url:'https://preview.test/#'+hash,runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=()=>{};w.matchMedia=()=>({matches:true,addEventListener(){}});w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};w.__real=w.localStorage}});const w=dom.window,d=w.document;
  try{await settle();const bar=d.querySelector('.ninoPreviewBar');assert.deepEqual([...bar.querySelectorAll('a,button')].map(n=>n.textContent),['Steden 7–12','Eilanden','Alles vrijgespeeld','Speel Vespa-rit af']);
   assert.equal(w.eval('ROUTE_CHAPTERS.filter(c=>state.route.chapters[c.id]?.stage===3).length'),stops);assert.equal(w.eval('state.trips'),trips);assert(!d.querySelector('.ninoProfile'),'no onboarding in the design preview');
   const before=w.eval('localStorage.getItem("topo-italie-v3")');[...bar.querySelectorAll('button')].find(b=>b.textContent==='Speel Vespa-rit af').click();const ride=d.querySelector('.vespaRide');assert(ride.open);assert.equal(ride.dataset.phase,'arrived','reduced motion: direct arrival');
   [...ride.querySelectorAll('button')].find(b=>b.textContent==='Verder').click();assert(!ride.open);assert.equal(w.eval('state.trips'),trips,'no trip awarded');assert.equal(w.eval('localStorage.getItem("topo-italie-v3")'),before,'no progress change');assert.equal(w.__real.length,0,'real browser storage untouched');assert.deepEqual(errors,[]);
  }finally{w.close()}}});

test('controls: the learn bar carries its layout class; Ik weet het nog niet/Overslaan stay secondary until answered',async()=>{const a=boot({storage:{'topo-nino-intro-v1':'done','topo-nino-profile-v1':JSON.stringify({schema:1,name:'Ada',coverColor:'riviera',favoritePizza:'salami'})}});try{await settle();
 assert(a.d.getElementById('focusLearnBar').classList.contains('focusLearnBar'),'learn bar is laid out as a fixed bar, not in the page flow');
 a.ev('mode("write")');await settle();const next=a.d.getElementById('next');
 assert.equal(a.ev('state.answered'),false);assert(next.classList.contains('ninoQuiet'),'way out is quiet before answering: '+next.textContent);
 a.d.getElementById('answer').value='Nergensland';a.d.getElementById('check').click();await settle();
 assert.equal(a.ev('state.answered'),true);assert.match(next.textContent,/Volgende/);assert(!next.classList.contains('ninoQuiet'),'Volgende is the main action');
 next.click();await settle();assert(next.classList.contains('ninoQuiet'),'quiet again on the next question');
 assert.deepEqual(a.errors,[]);
}finally{a.close()}});

test('gold round: ★ Goudronde with the real question count above every gold question, never in a normal lesson; one outcome at the end',async()=>{
 const at=Date.UTC(2026,10,6),save=(gold=0)=>JSON.stringify({schema:3,good:30,pizzas:0,slices:0,trips:0,mistakes:[],route:{schema:2,chapters:{city1:{stage:3,completedAt:at,goldAt:gold,nextReviewAt:0,reviews:0}},items:{},rewardTokens:[],active:null},daily:{date:'2026-11-06',correct:0}});
 const base={'topo-nino-intro-v1':'done','topo-nino-profile-v1':JSON.stringify({schema:1,name:'Ada',coverColor:'riviera',favoritePizza:'salami'})};
 const head=a=>a.d.querySelector('.ninoGoldHead'),shown=a=>!!head(a)&&!head(a).hidden&&!!head(a).closest('#quiz')&&head(a).nextElementSibling===a.d.getElementById('prompt');
 async function play(a,wrongAt=-1){const seen=new Set();let n=a.ev("state.route.active.index");for(let guard=0;guard<60&&!a.ev('state.route.active?.done');guard++){const f=a.d.querySelector('#finishScreen button.primary');if(f&&a.d.querySelector('#finishScreen')){assert.equal(a.d.querySelector('#finishScreen .ninoGoldBadge')?.textContent,'★ Goudronde','pause screen keeps the label');f.click();await settle();continue;}
   assert(shown(a),'label above question '+n);const total=a.ev('state.route.active.originalTotal');assert.equal(a.d.getElementById('routeLessonCount').textContent,'Vraag '+(n+1)+' van '+total+' · Alles goed = goud');
   assert.equal([...a.d.querySelectorAll('*')].filter(e=>e.children.length===0&&/Vraag \d+ (van|\/) \d+/.test(e.textContent)).length,1,'one counter');seen.add(a.ev('state.questionMode'));a.ev('routeGrade('+(n!==wrongAt)+')');n++;await settle();if(!a.ev('state.route.active.done')&&!a.d.querySelector('#finishScreen')){a.d.getElementById('next').click();await settle();}}
  return seen;}
 const title=a=>(a.d.querySelector('#finishScreen #finishTitle')||a.d.getElementById('prompt')).textContent,body=a=>(a.d.querySelector('#finishScreen #finishTitle+p')||a.d.getElementById('help')).textContent;
 let a=boot({storage:{...base,'topo-italie-v3':save()}});try{await settle();
  a.ev('mode("route")');a.ev('startRouteLesson("city1","gold")');await settle();assert.equal(a.ev('state.route.active.kind'),'gold');
  const seen=await play(a);assert.deepEqual([...seen].sort(),['point','write'],'Aanwijzen and Namen schrijven');
  assert.equal(title(a),'Goud verdiend');assert.match(body(a),/^12 van 12 goed\./);assert(!shown(a),'no label on the result');
  a.ev('startRouteLesson("city1","gold")');await settle();await play(a,3);assert.equal(title(a),'Je goud blijft staan');assert.match(body(a),/^11 van 12 goed\. Je eerder verdiende goud blijft bewaard\./);
  a.ev('startRouteLesson("city1","review")');await settle();assert.notEqual(a.ev('state.route.active.kind'),'gold');assert(!shown(a)&&!a.d.body.classList.contains('ninoGoldRound'),'a normal lesson on a gold stop has no label');
  assert(a.d.getElementById('routeLessonCount').closest('#routeLessonBar'),'progress line back in place');assert.deepEqual(a.errors,[]);
 }finally{a.close()}
 a=boot({storage:{...base,'topo-italie-v3':save()}});let mid;try{await settle();a.ev('mode("route")');a.ev('startRouteLesson("city1","gold")');await settle();for(const ok of [false,true]){a.ev('routeGrade('+ok+')');await settle();a.d.getElementById('next').click();await settle();}
  mid=dump(a);await play(a,-1);assert.equal(title(a),'Nog geen goud');assert.match(body(a),/^11 van 12 goed\. Voor goud moet alles goed zijn/);assert.equal(a.ev('state.route.chapters.city1.goldAt'),0);assert.deepEqual(a.errors,[]);
 }finally{a.close()}
 a=boot({storage:mid});try{await settle();a.d.getElementById('routeContinue').click();await settle();assert(shown(a),'label returns after resuming');assert.match(a.d.getElementById('routeLessonCount').textContent,/^Vraag 3 van 12 · Alles goed = goud$/);assert.deepEqual(a.errors,[]);}finally{a.close()}
});

test('favicon: exactly the owner-supplied NINO N at 16 and 32 px, embedded offline; the old PR65 icons are gone',()=>{
 const links=[...html.matchAll(/<link rel="icon"[^>]*>/g)].map(m=>m[0]);assert.equal(links.length,2);
 for(const size of [16,32]){const bytes=readFileSync(new URL('../assets/nino/app-icon/favicon-n/NINO-favicon-'+size+'.png',import.meta.url));
  assert.equal(links.filter(l=>l==='<link rel="icon" type="image/png" sizes="'+size+'x'+size+'" href="data:image/png;base64,'+bytes.toString('base64')+'">').length,1,size+' px');}
 assert(!/image\/x-icon|apple-touch-icon|rel="shortcut icon"/.test(html),'no other favicon references');
 for(const old of ['favicon.ico','topo-nino-italy-only-16.png','topo-nino-scooter-italy-32.png'])assert(!html.includes(readFileSync(new URL('../assets/nino/app-icon/micro-v2/'+old,import.meta.url)).toString('base64')),'old icon embedded: '+old);
});

test('2.0.2 exam result: the illustration is bounded by its own box (browser geometry: qa-nino-202-exam-result.mjs)',async()=>{
 const css=readFileSync(new URL('nino-exam-result.css',import.meta.url),'utf8');
 assert.match(css,/\.ninoExamResult \.examArt\{[^}]*overflow:hidden/);assert.match(css,/\.ninoExamResult \.examArt>\.ninoArtSlot\{[^}]*height:100%/);assert.match(css,/\.examArt img\{[^}]*object-fit:contain/);
 assert(html.includes(css),'the embedded HTML carries the fixed exam-result CSS');
 // The art slot that TopoArt puts in the box is the element the rule above sizes.
 const a=boot({storage:{'topo-nino-intro-v1':'done'}});try{await settle();const slot=a.w.TopoArt.create(a.d,{role:'encourage'},'exam-result');
  assert.equal(slot.tagName,'FIGURE');assert(slot.classList.contains('ninoArtSlot'));assert(slot.querySelector('img'));}finally{a.close()}
});

test('2.0.2 installers: native Mac launcher, unchanged install script, Windows script pinned to the built HTML',()=>{
 const c=readFileSync(new URL('../installers/macos/launcher.c',import.meta.url),'utf8'),sh=readFileSync(new URL('../installers/macos/launch.sh',import.meta.url),'utf8');
 assert.match(c,/execv\("\/bin\/sh"/);assert.match(c,/Resources\/launch\.sh/);assert.match(sh,/^#!\/bin\/sh\n/);assert.match(sh,/--install-only/);
 const cmd=readFileSync(new URL('../installers/windows/Installeer NINO.cmd.template',import.meta.url),'utf8');
 assert.equal(cmd.match(/\{\{HTML_SHA256\}\}/g).length,1);assert.equal(cmd.match(/\{\{VERSION\}\}/g).length,1);
 const pkg=readFileSync(new URL('package-installers.mjs',import.meta.url),'utf8');assert.match(pkg,/'-arch','arm64','-arch','x86_64'/);assert.match(pkg,/installers\/macos\/launcher\.c/);
});
