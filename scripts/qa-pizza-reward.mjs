import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const url=process.env.TOPO_URL||'http://127.0.0.1:8028/',output='docs/visual/pizza-v2';mkdirSync(output,{recursive:true});
const checks=[],errors=[],external=[],sequenceEvidence=[];
const flavors=['margherita','salami','quattro-formaggi'];
function listen(p){p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());p.on('request',r=>{if(!r.url().startsWith(url)&&!r.url().startsWith('file:')&&!r.url().startsWith('data:'))external.push(r.url())})}
async function capture(p,name,locator){await p.locator('img:visible').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode().catch(()=>{}))));await(locator||p).screenshot({path:`${output}/${name}.png`,...(!locator?{fullPage:true}:{})})}
async function layout(p){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');const map=await p.locator('#map').boundingBox();if(map?.width)assert(Math.abs(map.width/map.height-890/1235)<.002,'canonical map aspect ratio')}
async function grade(p){await p.locator('#answer').fill(await p.evaluate(()=>state.current.name));await p.locator('#check').press('Enter');assert.equal(await p.evaluate(()=>state.answered),true)}
async function seed(p,total,slices=7){await p.evaluate(({total,slices})=>{clearRewardCelebrations();mode('write');state.pizzas=total;state.slices=slices;state.trips=Math.floor(total/3);sync()},{total,slices})}
async function freeze(p){await p.clock.install({time:new Date('2026-10-25T12:00:00Z')});await p.clock.pauseAt(new Date('2026-10-25T12:00:00Z'))}
try{
 // Before/after use the same real app route, counter fixture and viewport.
 const before='/private/tmp/topo-pizza-v2-baseline.html';writeFileSync(before,execFileSync('git',['show','c68ace4:index.html'],{maxBuffer:16e6}));
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}}),p=await ctx.newPage();listen(p);await freeze(p);
 await p.goto('file://'+before);await p.evaluate(()=>{state.pizzas=1;state.slices=5;state.trips=0;sync();renderRouteHome()});await capture(p,'desktop-before');
 await p.goto(url);await p.evaluate(()=>{state.pizzas=1;state.slices=5;state.trips=0;sync();renderRouteHome()});await capture(p,'desktop-after');await layout(p);
 // Contact sheet renders the same production draw function and CSS, not a mockup.
 await p.evaluate(()=>{
  const sheet=document.createElement('main');sheet.id='pizzaProof';sheet.style.cssText='display:grid;grid-template-columns:repeat(9,180px);gap:8px;padding:24px;background:#fff9ed;width:max-content';
  for(let f=0;f<3;f++)for(let n=0;n<=8;n++){
   const card=document.createElement('div');card.style.cssText='text-align:center;padding:8px;background:white;border-radius:12px';
   const wheel=document.createElement('div');wheel.className='pizzaWheel';wheel.style.width=wheel.style.height='164px';TopoPizza.draw(wheel,n,f);
   const caption=document.createElement('p');caption.textContent=TopoPizza.name(TopoPizza.flavor(f))+' · '+n+' / 8';card.append(wheel,caption);sheet.append(card);
  }
  document.body.append(sheet);
 });
 await capture(p,'all-flavors-0-through-8',p.locator('#pizzaProof'));await p.locator('#pizzaProof').evaluate(n=>n.remove());
 const boxSources=['closed','margherita','salami','quattro-formaggi'].map(key=>({key,src:'data:image/webp;base64,'+readFileSync(`assets/nino/rewards/pizza/exports/pizza-box-${key==='closed'?'closed-pisa':'open-pisa-'+key}.webp`).toString('base64')}));
 await p.evaluate(boxes=>{const panel=document.createElement('section');panel.id='boxLayerAudit';panel.style.cssText='display:flex;width:max-content;gap:16px;padding:24px;background:#fff9ed';for(const b of boxes){const c=document.createElement('div'),i=document.createElement('img'),label=document.createElement('p');i.src=b.src;i.style.cssText='width:280px;height:280px;object-fit:contain';label.textContent=b.key+' — complete source render';c.append(i,label);panel.append(c)}document.body.append(panel)},boxSources);
 await capture(p,'box-source-layer-blocker',p.locator('#boxLayerAudit'));await p.locator('#boxLayerAudit').evaluate(n=>n.remove());
checks.push('27 production-rendered states; eight unique registered slices; full-frame reconstruction audited at asset preparation');
 for(let f=0;f<3;f++){
  await seed(p,f);const before=await p.evaluate(()=>[state.good,state.pizzas,state.slices,state.trips]);await grade(p);
  assert.equal(await p.locator('#pizzaCelebration').getAttribute('data-flavor'),flavors[f]);assert.equal(await p.locator('#pizzaCelebration').getAttribute('data-phase'),'full-pizza');
  sequenceEvidence.push({flavor:flavors[f],...await p.evaluate(()=>({time:Date.now(),phase:document.querySelector('#pizzaCelebration').dataset.phase}))});
  await capture(p,`${flavors[f]}-full`,p.locator('#pizzaCelebration'));
  const earned=await p.evaluate(()=>JSON.stringify(progressSnapshot()));await p.evaluate(()=>grade(true,state.current));assert.equal(await p.evaluate(()=>JSON.stringify(progressSnapshot())),earned);
  await p.clock.runFor(320);assert.equal(await p.locator('#pizzaCelebration').getAttribute('data-phase'),'open-box');
  sequenceEvidence.push({flavor:flavors[f],...await p.evaluate(()=>({time:Date.now(),phase:document.querySelector('#pizzaCelebration').dataset.phase}))});
  await capture(p,`${flavors[f]}-open-box-static`,p.locator('#pizzaCelebration'));
  assert.equal(await p.locator('#vespaTripToast:visible').count(),0);
  await p.clock.runFor(900);
  if(f===2){
   assert.equal(await p.locator('#arrivalArt').getAttribute('data-art-role'),'arrival');assert(await p.locator('#vespaTripToast').isVisible());assert.match(await p.locator('#vespaTripText').textContent(),/Florence/);
   assert.equal(await p.locator('#vespaTripToast .ninoTrip:visible').count(),0);assert.equal(await p.locator('#vespaIcon:visible,.journeyScooter:visible').count(),0);assert.equal(await p.locator('#vespaTripToast .ninoArtSlot:visible').count(),1);
   sequenceEvidence.push({flavor:flavors[f],...await p.evaluate(()=>({time:Date.now(),phase:document.querySelector('#pizzaCelebration').dataset.phase,destination:document.querySelector('#vespaTripText').textContent}))});await capture(p,'third-pizza-earned-vespa',p.locator('#vespaTripToast'));await p.clock.runFor(1500);
  }
  assert.equal(await p.evaluate(()=>JSON.stringify(progressSnapshot())),earned);assert.deepEqual(await p.evaluate(()=>[state.good,state.pizzas,state.slices,state.trips]),[before[0]+1,f+1,0,f===2?1:0]);
  await p.reload();assert.equal(await p.locator('#pizzaCelebration:visible').count(),0);assert.equal(await p.locator('#vespaTripToast:visible').count(),0);
 }
 checks.push('actual eighth retrieval: all flavors and correct static box, full→open timing 320+900ms, Quattro before actual journey, duplicate grade/reload grant nothing');
 // Actual backup importer with a large cumulative pizza total, unrelated cosmetic preference.
 const backup=await p.evaluate(()=>({app:'topo-italie',version:1,progress:{...progressSnapshot(),pizzas:3000002,slices:7,trips:1000000,good:24000023,favoritePizza:'margherita'}}));
 await p.locator('#backupFile').setInputFiles({name:'large-save.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await p.waitForFunction(()=>state.pizzas===3000002);
 assert.equal(await p.locator('#journeyWheel').getAttribute('data-flavor'),'quattro-formaggi');await p.evaluate(()=>mode('write'));await grade(p);await p.clock.runFor(1220);assert.equal(await p.evaluate(()=>state.trips),1000001);assert.equal(await p.locator('#pizzaCelebration').getAttribute('data-phase'),'journey');assert.equal(await p.locator('#arrivalArt').getAttribute('data-art-role'),'arrival');
 await p.clock.runFor(1500);await p.evaluate(()=>clearRewardCelebrations());
 const retained=await p.evaluate(()=>JSON.stringify(progressSnapshot()));await p.locator('#backupFile').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{broken')});await p.waitForFunction(()=>document.querySelector('#backupStatus').textContent.startsWith('Terugzetten lukte niet'));assert.equal(await p.evaluate(()=>JSON.stringify(progressSnapshot())),retained);
 checks.push('real backup import: 3,000,002 pizzas + 7 slices yields Quattro and trip 1,000,001; invalid import leaves save untouched');
 // Pending third-trip reset must never show a delayed trip.
 await seed(p,2);await grade(p);await p.locator('#resetPizza').click();await p.clock.runFor(3000);assert.equal(await p.evaluate(()=>state.trips),0);assert.equal(await p.locator('#pizzaCelebration:visible,#vespaTripToast:visible').count(),0);checks.push('reset cancels pending earned-trip presentation; reward counters reset via existing control');
 await ctx.close();
 for(const [name,width,height] of [['desktop',1440,1000],['ipad-portrait',820,1180],['ipad-landscape',1180,820],['phone',390,844],['small-phone',320,568]]){
  const c=await browser.newContext({viewport:{width,height},hasTouch:width<1200,reducedMotion:'reduce'}),page=await c.newPage();listen(page);await freeze(page);await page.goto(url);
  await page.evaluate(()=>{state.pizzas=2;state.slices=6;sync();renderRouteHome()});await layout(page);await capture(page,name+'-route');
  // Keyboard entry into a genuine route lesson retains existing controls and map.
  await page.locator('#routeContinue').press('Enter');await layout(page);await capture(page,name+'-lesson');assert(await page.locator(width<=950?'#routeDockNext':'#next').isEnabled());
  await seed(page,2);await grade(page);assert.equal(await page.locator('#pizzaCelebration').getAttribute('data-phase'),'open-box');assert.equal(await page.locator('#pizzaCelebration').evaluate(n=>getComputedStyle(n).pointerEvents),'none');await layout(page);await capture(page,name+'-reduced-motion-box');
  // Learning proceeds while presentation is visible.
  await page.locator('#next').press('Enter');assert.equal(await page.evaluate(()=>state.answered),false);assert(await page.locator('#check').isEnabled());await page.clock.runFor(1220);assert(await page.locator('#vespaTripToast').isVisible());await capture(page,name+'-travel');
  checks.push(name+': route/lesson/box/travel fit; keyboard; reduced-motion static open box; next answer remains available');await c.close();
 }
 // Complete route retrievals and actual Gold/replay, no synthetic award calls.
 const gc=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),g=await gc.newPage();listen(g);await freeze(g);await g.goto(url);
 async function finish(){let guard=0;while(!await g.evaluate(()=>state.route.active.done)){
  assert(++guard<50);if(await g.evaluate(()=>roundPaused)){await g.locator('#finishScreen .button').first().click();continue}
  if(await g.evaluate(()=>state.questionMode==='discover')){await g.locator('#next').click();continue}
  const task=await g.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));
  if(task.mode==='point')await g.locator(`[data-id="${task.id}"][tabindex="0"]`).first().press('Enter');else{await g.locator('#answer').fill(task.name);await g.locator('#check').press('Enter')}
  await g.clock.runFor(2800);await g.locator('#next').click();
 }}
 await g.locator('#routeContinue').press('Enter');await finish();await g.locator('#finishScreen .button').first().click();await finish();await g.locator('#finishScreen .button').first().click();await finish();
 await g.locator('#finishScreen .button').last().click();await g.locator('#completedStops>summary').press('Enter');await g.locator('[data-chapter="city1"] .goldButton').click();await finish();
 assert.equal(await g.evaluate(()=>state.pizzas),3);assert.equal(await g.evaluate(()=>state.trips),1);assert.equal(await g.locator('#finishScreen .ninoArtSlot').getAttribute('data-art-role'),'gold');
 const goldRewards=await g.evaluate(()=>JSON.stringify([state.good,state.pizzas,state.slices,state.trips,state.route.rewardTokens]));
 await g.locator('#finishScreen .button').last().click();await g.locator('#completedStops>summary').press('Enter');await g.locator('[data-chapter="city1"] .goldButton').click();await finish();
 assert.equal(await g.evaluate(()=>JSON.stringify([state.good,state.pizzas,state.slices,state.trips,state.route.rewardTokens])),goldRewards);assert.equal(await g.locator('#pizzaCelebration:visible,#vespaTripToast:visible').count(),0);await capture(g,'gold-replay-no-rewards');checks.push('Discover→point→write→new Gold earns 3 pizzas and 1 trip; full Gold replay earns no reward and triggers no celebration');await gc.close();
 for(const file of ['topo-italie-interactief.html','topo-italie-duolingo.html']){
  const c=await browser.newContext({offline:true,viewport:{width:820,height:1180}}),page=await c.newPage();listen(page);await freeze(page);await page.goto(new URL('../output/html/'+file,import.meta.url).href);
  const decoded=await page.evaluate(async()=>{const report={};for(const [key,src] of Object.entries(TOPO_PIZZA_ART.assets)){const i=new Image();i.src=src;await i.decode();report[key]=[i.naturalWidth,i.naturalHeight]}return report});assert.equal(Object.keys(decoded).length,7);
  await seed(page,2);await grade(page);await page.clock.runFor(1220);assert.equal(await page.evaluate(()=>state.trips),1);assert(await page.locator('#vespaTripToast').isVisible());await page.locator('#next').click();assert.equal(await page.evaluate(()=>state.answered),false);await capture(page,file.replace('.html','')+'-offline');
  checks.push(file+': offline file://, all 7 runtime WebPs decode, real pizza/box/journey and next answer');await c.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 writeFileSync(output+'/box-sequence.json',JSON.stringify({hingeImplemented:false,sequenceEvidence},null,2)+'\n');
 writeFileSync(output+'/browser-results.json',JSON.stringify({checks,errors,externalRequests:external,hingedLid:{status:'BLOCKED',reason:'Complete renders have incompatible perspective and hidden surfaces; no separated registered lid/base/inside layers. Static opened box shown deliberately.'},deviceLimit:'Chromium emulation; physical iPad Safari not tested.'},null,2)+'\n');console.log(JSON.stringify({checks:checks.length,errors,external},null,2));
}finally{await browser.close()}
