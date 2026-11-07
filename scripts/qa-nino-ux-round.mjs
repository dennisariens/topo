/* Owner UX round 7 November 2026: the two requested play routes on the generated offline HTML, plus the book-key check.
   Real Chrome, file://, offline. The only state reads are for assertions and to know where the correct answer is. */
import assert from 'node:assert/strict';import {mkdirSync,readFileSync,writeFileSync,readdirSync,renameSync,rmSync} from 'node:fs';import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),previewFile=new URL('output/html/NINO-2-Ontwerppreview-2026-11-07-r2.html',root),out=new URL('docs/qa/ux-20261107-r2/',root),file=new URL(process.env.QA_HTML||'output/html/NINO-2-Proefversie-2026-11-07-r2.html',root),demo=new URL('output/demo/NINO-2-DEMO-vlak-voor-derde-pizza.json',root).pathname;
mkdirSync(new URL('video/',out),{recursive:true});
const api=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),engine=process.env.QA_BROWSER||'chrome';
const browser=await(engine==='webkit'?api.webkit:api.chromium).launch(engine==='webkit'?{}:{executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const errors=[],network=[],log=[],say=(step,data={})=>{log.push({step,...data});console.log(step,JSON.stringify(data));};
const shot=(p,name)=>p.screenshot({path:new URL(engine+'-'+name+'.png',out).pathname});
async function open({width=1180,height=820,reducedMotion='no-preference',video,storage}={}){const c=await browser.newContext({offline:true,viewport:{width,height},deviceScaleFactor:width<800?2:1,hasTouch:width<1200,reducedMotion,recordVideo:video?{dir:new URL('video/',out).pathname,size:{width,height}}:undefined});if(storage)await c.addInitScript(s=>{if(!sessionStorage.getItem('seeded')){for(const [k,v]of Object.entries(s))localStorage.setItem(k,v);sessionStorage.setItem('seeded','1')}},storage);const p=await c.newPage();p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('request',r=>{if(!/^(file:|data:|blob:)/.test(r.url()))network.push(r.url())});p.on('dialog',d=>d.accept());await p.goto(file.href);return {c,p};}
const tab=p=>p.evaluate(()=>[...document.querySelectorAll('.ninoNav button')].filter(b=>b.getAttribute('aria-current')==='page').map(b=>b.textContent).join());
const meter=p=>p.evaluate(()=>{const m=document.querySelector('#ninoMeter'),r=m?.getBoundingClientRect();const visible=[...document.querySelectorAll('#ninoMeter,#lessonReward,#pizzaRow,#rewardPizzaVisual,.ninoLegacyMeter')].filter(n=>{const b=n.getBoundingClientRect();return b.width>0&&b.height>0&&getComputedStyle(n).visibility!=='hidden'}).map(n=>n.id||n.className);return {visible,points:m?.querySelector('.ninoMeterPoints').textContent,goal:m?.querySelector('.ninoMeterGoal').textContent,saved:m?.querySelectorAll('.ninoMeterSaved .pizzaWheel').length,rect:r&&[r.x,r.y,r.width,r.height].map(Math.round),inView:!!r&&r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth,clipped:!!m&&[...m.querySelectorAll('p,strong')].some(n=>n.scrollWidth>n.clientWidth+1),minFont:m?Math.min(...[...m.querySelectorAll('p,strong')].map(n=>parseFloat(getComputedStyle(n).fontSize))):0,wheel:m?.querySelector('.ninoMeterWheel').getBoundingClientRect().width}});
async function point(p,id){await p.evaluate(id=>{const i=byId[id],s=document.querySelector('#map'),a=document.querySelector('.atlasViewport'),r=a.getBoundingClientRect(),q=new DOMPoint(i.px,i.py).matrixTransform(s.getScreenCTM());a.scrollLeft+=q.x-r.left-r.width/2;a.scrollTop+=q.y-r.top-r.height/2;},id);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const xy=await p.evaluate(id=>{const i=byId[id],q=new DOMPoint(i.px,i.py).matrixTransform(document.querySelector('#map').getScreenCTM());return[q.x,q.y]},id);await p.mouse.click(...xy);if(await p.locator('#mapPicker').evaluate(n=>n.open))await p.locator('#mapPicker [data-map-choice="'+id+'"]').click();}
async function importDemo(p){await p.locator('#backupFile').setInputFiles(demo);await p.waitForFunction(()=>document.querySelector('#backupStatus').textContent.includes('teruggezet'));}
const rewards=p=>p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('topo-italie-v3'));return {good:s.good,pizzas:s.pizzas,slices:s.slices,trips:s.trips};});
const sha=b=>createHash('sha256').update(b).digest('hex');
try{
 const htmlHash=sha(readFileSync(file));say('candidate',{file:file.pathname.split('/').pop(),sha256:htmlHash,engine,version:browser.version()});

 // A. Empty profile: skip onboarding, Reis -> Verder, Start meteen, a real correct answer.
 {const {c,p}=await open();await p.locator('.ninoProfile[open]').waitFor();await shot(p,'A1-onboarding');await p.getByRole('button',{name:'Overslaan',exact:true}).click();
  assert.equal(await tab(p),'Reis');await p.locator('#routeContinue').click();await p.locator('.ninoIntroOffer[open]').waitFor();await shot(p,'A2-second-offer');
  assert(await p.getByRole('button',{name:'Maak kennis met Nino'}).isVisible());await p.getByRole('button',{name:'Start meteen'}).click();await p.waitForTimeout(300);
  assert.equal(await tab(p),'Reis','Reis stays active in the lesson');say('A start meteen',{tab:await tab(p),mode:await p.evaluate(()=>state.mode+'/'+state.questionMode),map:await p.evaluate(()=>document.body.dataset.mapTheme)});
  await shot(p,'A3-discover-under-reis');
  // Ontdekken has no answers to give: look at each place, then start Aanwijzen from the result screen.
  for(let n=0;n<16&&await p.evaluate(()=>state.questionMode)!=='point';n++){const result=p.locator('#finishScreen button.primary');if(await result.count()&&await result.first().isVisible())await result.first().click();else await p.locator('#focusAnswerSheet #next, #next').first().click();await p.waitForTimeout(120);}
  assert.equal(await p.evaluate(()=>state.questionMode),'point');assert.equal(await tab(p),'Reis');
  const before=await meter(p);await shot(p,'A4-point-before');const id=await p.evaluate(()=>state.current.id);await point(p,id);await p.waitForTimeout(500);
  assert(await p.locator('#message').evaluate(n=>n.classList.contains('good')),'a correct answer');const after=await meter(p);await shot(p,'A5-point-correct-meter');
  assert.match(after.points,/^1 van 8/);assert.deepEqual(after.visible,['ninoMeter'],'exactly one meter is visible');assert.equal(await tab(p),'Reis');
  say('A correct answer',{item:id,before:before.points,after:after.points,goal:after.goal,visible:after.visible,tab:await tab(p),rewards:await rewards(p)});
  await p.reload();await p.waitForTimeout(500);assert.equal(await p.locator('.ninoProfile').count(),0,'no onboarding after reload');
  await p.locator('#routeContinue').click();await p.waitForTimeout(300);assert.equal(await p.locator('.ninoIntroOffer').count(),0,'no second offer after reload');assert.equal(await tab(p),'Reis');
  say('A reload',{intro:await p.evaluate(()=>localStorage.getItem('topo-nino-intro-v1')),onboarding:0,offer:0,tab:await tab(p),rewards:await rewards(p)});await shot(p,'A6-after-reload-lesson');
  // Profile stays editable in the Reisboekje; arrow keys page after Bewaar and after Annuleren (Hermes finding).
  await p.getByRole('button',{name:'Reisboekje',exact:true}).click();await p.locator('#travelBook[open]').waitFor();const label=()=>p.locator('#travelBook .bookFooter .micro').textContent();
  const keys={};
  for(const finish of ['Bewaar mijn boekje','Annuleren']){
   await p.getByRole('button',{name:'Pas mijn boekje aan'}).click();await p.locator('.ninoProfile[open]').waitFor();
   if(finish==='Bewaar mijn boekje'){await p.locator('.ninoProfile input[name="name"]').fill('Mila');await p.locator('.ninoProfile input[value="salami"]').check();await shot(p,'A7-profile-edit');}
   await p.getByRole('button',{name:finish,exact:true}).click();await p.locator('.ninoProfile').waitFor({state:'detached'});
   const start=await label();await p.keyboard.press('ArrowRight');const one=await label();await p.keyboard.press('ArrowRight');const two=await label();await p.keyboard.press('ArrowLeft');await p.keyboard.press('ArrowLeft');const back=await label();
   keys[finish]={start,one,two,back,focus:await p.evaluate(()=>document.activeElement.textContent)};assert.notEqual(one,start);assert.notEqual(two,one);assert.equal(back,start);
  }
  assert.equal(await p.evaluate(()=>TopoProfile.current().name),'Mila');await shot(p,'A8-book-after-edit');say('A book keys',{keys,profile:await p.evaluate(()=>TopoProfile.current())});
  await p.keyboard.press('Escape');await c.close();}

 // B. Demosave: two pizzas and 7/8 points. Announcement, one real correct answer, Start de Vespa-rit, recorded.
 {const {c,p}=await open({video:true});const video=p.video();await p.getByRole('button',{name:'Overslaan',exact:true}).click();await importDemo(p);
  assert.deepEqual(await rewards(p),{good:23,pizzas:2,slices:7,trips:0});await p.locator('#routeContinue').click();await p.waitForTimeout(300);
  assert.equal(await p.locator('.ninoIntroOffer').count(),0,'existing journey progress goes straight on');assert.equal(await tab(p),'Reis');
  const m=await meter(p);assert.equal(m.goal,'Nog één pizza tot je Vespa-rit');assert.match(m.points,/^7 van 8/);assert.equal(m.saved,2);await shot(p,'B1-announcement');say('B announcement',m);
  const name=await p.evaluate(()=>state.current.name);await p.locator('#answer').fill(name);await p.locator('#check').click();await p.locator('#pizzaCelebration[open]').waitFor();
  assert.deepEqual(await rewards(p),{good:24,pizzas:3,slices:0,trips:1});await shot(p,'B2-third-pizza');
  await p.locator('#pizzaCelebration[data-phase="open-box"]').waitFor();const more=p.locator('#pizzaCelebration .button');assert.equal(await more.textContent(),'Start de Vespa-rit');await shot(p,'B3-box-start-ride');
  await more.click();await p.locator('.vespaRide[open]').waitFor();const phases=[];for(let t=0;t<8000;t+=100){const ph=await p.locator('.vespaRide').getAttribute('data-phase');if(phases.at(-1)!==ph){phases.push(ph);await shot(p,'B4-ride-'+ph);}if(ph==='arrived')break;await p.waitForTimeout(100);}
  assert.deepEqual(phases,['depart','ride','arrived']);assert(await p.getByRole('button',{name:'Bekijk in Reisboekje'}).isVisible());assert.match(await p.locator('#vespaRideTitle').textContent(),/Aangekomen in Florence!/);
  await p.waitForTimeout(800);await shot(p,'B4-ride-arrived-settled');await p.getByRole('button',{name:'Verder',exact:true}).click();await p.waitForTimeout(300);const back=await meter(p);await shot(p,'B5-back-in-lesson');
  assert.equal(back.goal,'Nog drie pizza’s tot je Vespa-rit');say('B ride',{phases,after:back.points,goal:back.goal,rewards:await rewards(p),tab:await tab(p)});
  await p.reload();await p.waitForTimeout(800);assert.equal(await p.locator('.vespaRide[open],#pizzaCelebration[open]').count(),0,'reload replays nothing');assert.deepEqual(await rewards(p),{good:24,pizzas:3,slices:0,trips:1});
  await p.getByRole('button',{name:'Reisboekje',exact:true}).click();await p.waitForTimeout(200);await p.keyboard.press('Escape');assert.deepEqual(await rewards(p),{good:24,pizzas:3,slices:0,trips:1},'viewing the book awards nothing');say('B reload',{rewards:await rewards(p)});
  await c.close();const path=await video.path();renameSync(path,new URL('video/'+engine+'-vespa-overgang.webm',out).pathname);}

 // C. Reduced motion: the ride goes straight to the static arrival.
 {const {c,p}=await open({reducedMotion:'reduce',width:768,height:1024});await p.getByRole('button',{name:'Overslaan',exact:true}).click();await importDemo(p);await p.locator('#routeContinue').click();
  const name=await p.evaluate(()=>state.current.name);await p.locator('#answer').fill(name);await p.locator('#check').click();await p.locator('#pizzaCelebration[open]').waitFor();
  assert.equal(await p.locator('#pizzaCelebration').getAttribute('data-phase'),'open-box');assert.equal(await p.locator('#pizzaCelebration .button').textContent(),'Start de Vespa-rit');
  await p.locator('#pizzaCelebration .button').click();assert.equal(await p.locator('.vespaRide').getAttribute('data-phase'),'arrived');await shot(p,'C1-reduced-motion-arrival');say('C reduced motion',{phase:'arrived'});await c.close();}

 // D. Skip during the ride, then back to the same question.
 {const {c,p}=await open({width:1180,height:820});await p.getByRole('button',{name:'Overslaan',exact:true}).click();await importDemo(p);await p.locator('#routeContinue').click();
  const name=await p.evaluate(()=>state.current.name);await p.locator('#answer').fill(name);await p.locator('#check').click();await p.locator('#pizzaCelebration[data-phase="open-box"]').waitFor();await p.locator('#pizzaCelebration .button').click();
  await p.locator('.vespaRide[data-phase="depart"]').waitFor();await p.getByRole('button',{name:'Overslaan',exact:true}).click();assert.equal(await p.locator('.vespaRide').getAttribute('data-phase'),'arrived');
  const q=await p.evaluate(()=>state.current.id);await p.getByRole('button',{name:'Verder',exact:true}).click();assert.equal(await p.evaluate(()=>state.current.id),q);say('D skip',{ok:true});await c.close();}

 // E. One meter, readable on phone, iPad and desktop, with the demo announcement.
 const sizes={};for(const [w,h] of [[320,740],[390,844],[768,1024],[1024,768],[1180,820],[1500,950]]){const {c,p}=await open({width:w,height:h});await p.getByRole('button',{name:'Overslaan',exact:true}).click();await importDemo(p);await p.locator('#routeContinue').click();await p.waitForTimeout(400);
  const m=await meter(p);assert.deepEqual(m.visible,['ninoMeter'],w+': one meter');assert(!m.clipped,w+': no clipped text');assert(m.minFont>=12,w+': font');assert.equal(m.goal,'Nog één pizza tot je Vespa-rit');
  if(w<1300)assert(m.inView,w+': meter visible without scrolling');sizes[w+'x'+h]=m;await shot(p,'E-meter-'+w);await c.close();}
 say('E sizes',sizes);

 // F. F1 in Chrome: Oefenen -> Reis -> Oefenen keeps the same question, draft and backward selection.
 {const {c,p}=await open({width:1366,height:768,storage:{'topo-nino-intro-v1':'done','topo-nino-profile-v1':JSON.stringify({schema:1,name:'',coverColor:'riviera',favoritePizza:null})}});
  await p.getByRole('button',{name:'Oefenen',exact:true}).click();await p.locator('nav.practiceModes [data-mode="write"]').click();await p.waitForTimeout(200);
  const q=await p.evaluate(()=>state.current.id);await p.locator('#answer').fill('Navigatieconcept');await p.locator('#answer').evaluate(n=>{n.focus();n.setSelectionRange(3,10,'backward')});
  await p.getByRole('button',{name:'Reis',exact:true}).click();assert.equal(await tab(p),'Reis');await shot(p,'F1-reis-from-practice');await p.getByRole('button',{name:'Oefenen',exact:true}).click();await p.waitForTimeout(200);
  const r=await p.evaluate(()=>({id:state.current.id,mode:state.mode,value:document.querySelector('#answer').value,sel:[document.querySelector('#answer').selectionStart,document.querySelector('#answer').selectionEnd,document.querySelector('#answer').selectionDirection]}));
  assert.deepEqual(r,{id:q,mode:'write',value:'Navigatieconcept',sel:[3,10,'backward']});assert.equal(await tab(p),'Oefenen');await shot(p,'F2-practice-restored');say('F F1',{...r,tab:await tab(p)});await c.close();}

 // G. Design preview: three direct states, every book page and both sides of all four postcards fit without inner scrollbars.
 const book={};for(const [w,h] of [[1500,950],[1366,768],[1180,820],[820,1180],[768,1024],[390,844],[375,667],[320,568]]){
  const c=await browser.newContext({offline:true,viewport:{width:w,height:h},deviceScaleFactor:w<800?2:1,hasTouch:w<1200}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!/^(file:|data:|blob:)/.test(r.url()))network.push(r.url())});
  await p.goto(previewFile.href+'#volledig');await p.waitForTimeout(2500);await p.getByRole('button',{name:'Reisboekje',exact:true}).click();await p.locator('#travelBook[open]').waitFor();
  const next=p.locator('#travelBook .bookFooter button',{hasText:'Volgende'}),pages=[],backs=[];
  const check=()=>p.evaluate(()=>{const d=document.querySelector('#travelBook'),o=[],vh=innerHeight,vw=innerWidth;if(d.scrollHeight>d.clientHeight+1||d.scrollWidth>d.clientWidth+1)o.push('book scrolls');
   for(const f of d.querySelectorAll('.folioWriting')){if(f.scrollHeight>f.clientHeight+1||f.scrollWidth>f.clientWidth+1)o.push('page overflow '+f.closest('section').getAttribute('aria-label'));const fr=f.getBoundingClientRect();for(const b of f.querySelectorAll('button')){const q=b.getBoundingClientRect();if(q.bottom>fr.bottom+1||q.top<fr.top-1||q.bottom>vh||q.right>vw||q.height<43.5)o.push('button '+b.textContent)}for(const t of f.querySelectorAll('p,h3,h4,li,figcaption')){const q=t.getBoundingClientRect();if(q.height&&(q.bottom>fr.bottom+1||q.right>fr.right+2))o.push('text out '+t.textContent.slice(0,20))}}
   for(const m of d.querySelectorAll('.postcardMessage'))if(!m.closest('[hidden]')&&(m.scrollHeight>m.clientHeight+1))o.push('message overflow');
   for(const b of d.querySelectorAll('.bookFooter button,.bookHeader button')){const q=b.getBoundingClientRect();if(q.bottom>vh||q.top<0)o.push('nav out '+b.textContent)}
   return {label:d.querySelector('.bookFooter .micro').textContent,zoom:[...d.querySelectorAll('.folioWriting>*')].map(n=>n.style.zoom).filter(Boolean)[0]||'1',fonts:[...d.querySelectorAll('.postcardMessage')].filter(m=>!m.closest('[hidden]')).map(m=>parseFloat(m.style.fontSize)),o}});
  for(let n=0;n<20;n++){const r=await check();assert.deepEqual(r.o,[],w+'x'+h+' '+r.label);pages.push(r.label+(r.zoom!=='1'?' (zoom '+r.zoom+')':''));
   if([1366,820,390].includes(w))await shot(p,'G-book-'+w+'-'+String(n+1).padStart(2,'0'));
   for(const flip of await p.locator('#travelBook .earnedPostcard .bookLink').all()){const fig=flip.locator('xpath=ancestor::figure'),box=await fig.boundingBox();await flip.click();const rb=await check();assert.deepEqual(rb.o,[],w+' back '+rb.label);assert.deepEqual(await fig.boundingBox(),box,'same card space');backs.push({label:await fig.locator('figcaption').textContent(),font:rb.fonts.map(f=>f.toFixed(1)).join()});if([1366,820,390].includes(w))await shot(p,'G-back-'+w+'-'+backs.length);await flip.click();}
   if(await next.isDisabled())break;await next.click();await p.waitForTimeout(80);}
  assert.equal(backs.length,4,w+': all four postcard backs');book[w+'x'+h]={pages,backs};await c.close();}
 say('G book fit',book);
 {const {c,p}=await open({width:1180,height:820});await p.goto(previewFile.href+'#eilanden');await p.waitForTimeout(500);await shot(p,'G-preview-eilanden');await p.goto(previewFile.href+'#steden-7-12');await p.waitForTimeout(500);await shot(p,'G-preview-steden-7-12');
  const before=await p.evaluate(()=>localStorage.getItem('topo-italie-v3'));await p.getByRole('button',{name:'Speel Vespa-rit af'}).click();const phases=[];for(let t=0;t<8000;t+=100){const ph=await p.locator('.vespaRide').getAttribute('data-phase');if(phases.at(-1)!==ph){phases.push(ph);await shot(p,'G-ride-preview-'+ph);}if(ph==='arrived')break;await p.waitForTimeout(100);}
  assert.deepEqual(phases,['depart','ride','arrived']);await p.getByRole('button',{name:'Verder',exact:true}).click();assert.equal(await p.evaluate(()=>localStorage.getItem('topo-italie-v3')),before);assert.equal(await p.evaluate(()=>state.trips),0);
  say('G ride preview',{phases,unchanged:true});await c.close();}
 {const {c,p}=await open({width:768,height:1024,reducedMotion:'reduce'});await p.goto(previewFile.href+'#volledig');await p.waitForTimeout(500);await p.getByRole('button',{name:'Speel Vespa-rit af'}).click();assert.equal(await p.locator('.vespaRide').getAttribute('data-phase'),'arrived');await shot(p,'G-ride-preview-reduced');say('G ride preview reduced',{phase:'arrived',trips:await p.evaluate(()=>state.trips)});await c.close();}
}finally{
 await browser.close();
 say('errors',{errors,network});
 writeFileSync(new URL(engine+'-ux-round.json',out),JSON.stringify({log,errors,network},null,1));
}
assert.deepEqual(errors,[]);assert.deepEqual(network,[]);console.log('PASS');
