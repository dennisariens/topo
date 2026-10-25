import assert from 'node:assert/strict';
import{readFileSync,writeFileSync,mkdirSync}from'node:fs';
import{execFileSync}from'node:child_process';
const{chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),out='docs/visual/map-hit-hotfix';mkdirSync(out,{recursive:true});
const url=process.env.TOPO_URL||'http://127.0.0.1:8036/';
const browser=await chromium.launch({headless:true}),errors=[],external=[],runs=[],routes=[],orderProof=[];
const before='/private/tmp/topo-map-hit-before.html';writeFileSync(before,execFileSync('git',['show','f67027d:index.html'],{maxBuffer:32e6}));
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());p.on('request',r=>{if(!r.url().startsWith(url)&&!r.url().startsWith('file:')&&!r.url().startsWith('data:'))external.push(r.url())})}
async function shot(p,name){await p.screenshot({path:`${out}/${name}.png`,fullPage:true})}
async function theme(p,value){const menu=p.locator('.atlasOptions:visible').first();if(!await menu.evaluate(n=>n.open))await menu.locator('summary').click();await menu.locator(`input[value="${value}"]`).check();if(await menu.evaluate(n=>n.open))await menu.locator('summary').click();assert.equal(await p.evaluate(()=>document.body.dataset.mapTheme),value)}
async function screen(p,x,y){
 await p.locator('.atlasViewport').scrollIntoViewIfNeeded();
 return p.evaluate(({x,y})=>{const map=document.querySelector('#map'),area=map.closest('.atlasViewport');let p=new DOMPoint(x,y).matrixTransform(map.getScreenCTM()),r=area.getBoundingClientRect();area.scrollLeft+=p.x-(r.left+r.width/2);area.scrollTop+=p.y-(r.top+r.height/2);p=new DOMPoint(x,y).matrixTransform(map.getScreenCTM());return[p.x,p.y]},{x,y});
}
async function tap(p,x,y){const xy=await screen(p,x,y);const top=await p.evaluate(([x,y])=>(()=>{const n=document.elementFromPoint(x,y);return{tag:n?.tagName,feature:n?.getAttribute('data-id'),hit:n?.getAttribute('data-hit-id')}})(),xy);await p.touchscreen.tap(...xy);return{xy,top}}
async function fixture(p,id,mode='point'){
 await p.evaluate(({id,mode})=>{if(document.querySelector('#mapPicker').open)document.querySelector('#mapPicker').close();window.mode(mode);state.current=byId[id];state.questionMode='point';state.answered=false;clearActive();hideLens()},{id,mode});
}
async function answerTap(p,id,x,y,{ok=true,expectPicker=false}={}){
 const before=await p.evaluate(()=>state.good);const trace=await tap(p,x,y);const picker=await p.locator('#mapPicker').isVisible();
 if(expectPicker)assert(picker,'real overlap must show a neutral chooser');
 if(picker){assert(!/Toscane|Povlakte|Vaticaan|Rome|Marino|Po\b|Zee/.test(await p.locator('#mapPicker').textContent()),'no answer names');await p.locator(`#mapPicker [data-map-choice="${id}"]`).press('Enter')}
 assert(await p.evaluate(()=>state.answered),JSON.stringify({id,x,y,trace,context:await p.evaluate(()=>({mode:state.mode,current:state.current.id,scale:TopoAtlas.scale,theme:document.body.dataset.mapTheme}))}));assert.equal(await p.locator('#message').evaluate(n=>n.classList.contains('good')),ok);const after=await p.evaluate(()=>state.good),route=await p.evaluate(()=>state.mode==='route');if(!ok||!route)assert.equal(after,before+(ok?1:0));else assert(after>=before&&after<=before+1,'eligible route token at most once');
 return{picker,trace,candidates:await p.evaluate(([x,y])=>mapTapCandidates(x,y,mapFeatureClass(state.current)).map(i=>i.id),trace.xy),feedback:await p.locator('#message').textContent()};
}
async function next(p){await p.locator('#next:visible,#routeDockNext:visible').first().press('Enter')}
async function routeFixture(p,chapter,kind='point'){
 await p.evaluate(({chapter,kind})=>{mode('route');state.route=TopoRoute.fresh();state.good=state.pizzas=state.slices=state.trips=0;state.mistakes=[];for(const c of ROUTE_CHAPTERS){if(c.id===chapter)break;TopoRoute.record(state.route,c.id).stage=3}TopoRoute.record(state.route,chapter).stage=kind==='gold'?3:1;state.current=null;state.answered=true;renderRouteHome()},{chapter,kind});
 const card=p.locator(`[data-chapter="${chapter}"]`);
 if(kind==='gold'){await p.locator('#completedStops>summary').press('Enter');await card.locator('.goldButton').click()}
 else await card.getByRole('button',{name:'Aanwijzen',exact:true}).click();
 assert.equal(await p.evaluate(()=>state.route.active.chapterId),chapter);assert.equal(await p.evaluate(()=>state.route.active.kind),kind);
}
const regionPoints={'area-g':[335,375],'area-h':[380,485]};
try{
 // Immutable before build: real route, not a forced grading result.
 const bc=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true}),bp=await bc.newPage();watch(bp);await bp.goto('file://'+before);
 const baselineRoute=[];
 for(const requested of['area-g','area-h']){
  await routeFixture(bp,'regions');while(await bp.evaluate(()=>state.current.id)!==requested){await bp.evaluate(()=>elements[state.current.id].dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})));await next(bp)}
  await bp.evaluate(z=>TopoAtlas.zoom(z),requested==='area-g'?2:1);const [x,y]=regionPoints[requested];const point=await screen(bp,x,y);
  const native=await bp.evaluate(([x,y])=>{const n=document.elementFromPoint(x,y);return{id:n?.getAttribute('data-id'),hit:n?.getAttribute('data-hit-id')}},point);await bp.touchscreen.tap(...point);
  baselineRoute.push({requested,x,y,native,...await bp.evaluate(()=>({answered:state.answered,picker:document.querySelector('#mapPicker').open,feedback:document.querySelector('#message').textContent,wrong:state.route.active.wrong,pending:state.route.active.pending}))});await shot(bp,'before-route-'+requested);
 }
 writeFileSync(out+'/before-route.json',JSON.stringify({baseline:'f67027d42202d1bd2a78f1d82dd02aa7fba41a91',actualLearnerBuild:'not supplied; reproduced on reported PR30 baseline',baselineRoute},null,2)+'\n');
 assert.equal(baselineRoute[0].native.hit,'water-G');assert.equal(baselineRoute[0].answered,true);assert.match(baselineRoute[0].feedback,/Po/);assert(baselineRoute[0].wrong>0);assert(baselineRoute[1].picker||baselineRoute[1].wrong>0);
 await bp.evaluate(()=>{const original=openMapPicker;openMapPicker=candidates=>{window.beforeCandidates=candidates.map(i=>i.id);original(candidates)}});
 await bp.evaluate(()=>TopoAtlas.zoom(1));const baselinePoints=await bp.evaluate(()=>ITEMS.filter(i=>i.kind==='city'||['area-e','area-f','area-n','area-o'].includes(i.id)).map(i=>({id:i.id,x:i.px,y:i.py}))),baselineOrder=[];
 for(const point of baselinePoints){await fixture(bp,point.id);await tap(bp,point.x,point.y);if(await bp.locator('#mapPicker').isVisible()){const order=await bp.evaluate(()=>window.beforeCandidates);baselineOrder.push({id:point.id,order,correctIndex:order.indexOf(point.id)})}}
 assert(baselineOrder.length>0);assert(baselineOrder.some(r=>r.correctIndex===0),'measure legacy nearest-first ordering; subpixel touch rounding can reverse Rome/Vatican');
 writeFileSync(out+'/before-dot-order.json',JSON.stringify({baseline:'f67027d42202d1bd2a78f1d82dd02aa7fba41a91',viewport:{width:1180,height:820},pointAnchors:baselinePoints.length,ambiguousExactAnchorCases:baselineOrder,firstIsCorrect:baselineOrder.filter(r=>r.correctIndex===0).length},null,2)+'\n');await bc.close();
 const ac=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true}),ap=await ac.newPage();watch(ap);await ap.goto(url);
 for(const requested of['area-g','area-h']){await routeFixture(ap,'regions');while(await ap.evaluate(()=>state.current.id)!==requested){const id=await ap.evaluate(()=>state.current.id);await answerTap(ap,id,...regionPoints[id]);await next(ap)}await theme(ap,'school');await ap.evaluate(z=>TopoAtlas.zoom(z),requested==='area-g'?2:1);await answerTap(ap,requested,...regionPoints[requested]);await shot(ap,'after-repro-route-'+requested)}await ac.close();
 // Real hit/grading handlers, both paints, fit and zoom/pan, at iPad touch sizes.
 for(const[name,width,height]of[['ipad-landscape',1180,820],['ipad-portrait',820,1180],['desktop',1440,1000],['phone',390,844]]){
  const c=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'}),p=await c.newPage();watch(p);await p.goto(url);
  for(const style of['school','discovery'])for(const zoom of[1,2]){
   await fixture(p,'area-h');await theme(p,style);await p.evaluate(z=>TopoAtlas.zoom(z),zoom);
   for(const [x,y]of[[350,450],[380,485],[420,500]]){await fixture(p,'area-h');const r=await answerTap(p,'area-h',x,y);assert.equal(r.picker,false,'Tuscany is an area, not a dot');}
   // On the actual source Po and away from its visible stroke, inside the Po Plain.
   const po=await p.evaluate(()=>{const path=elements['water-G'],v=path.getPointAtLength(path.getTotalLength()*.7);return[v.x,v.y]});
   for(const[x,y]of[po,[335,340],[335,375]]){await fixture(p,'area-g');assert(await p.evaluate(({x,y})=>elements['area-g'].isPointInFill(new DOMPoint(x,y)),{x,y}));const r=await answerTap(p,'area-g',x,y);assert(!r.picker)}
   await fixture(p,'water-G');await answerTap(p,'water-G',...po);
   // Same coordinates + same class => same geographic candidates, even when the asked answer differs.
   const targetIndependent=[];for(const id of['area-g','area-h']){await fixture(p,id);const xy=await screen(p,380,485);targetIndependent.push(await p.evaluate(([x,y])=>mapTapCandidates(x,y,mapFeatureClass(state.current)).map(i=>i.id),xy));}
   assert.deepEqual(targetIndependent,[['area-h'],['area-h']]);
   await fixture(p,'area-g');await answerTap(p,'area-h',380,485,{ok:false});
   await fixture(p,'water-F');await answerTap(p,'water-G',...po,{ok:false});
   await fixture(p,'area-c');await answerTap(p,'area-c',490,560); // Existing mountain corridor, no geometry change.
   await fixture(p,'area-n');await answerTap(p,'area-n',458.8,447.67);
   for(const id of['city-9','area-o']){await fixture(p,id);await answerTap(p,id,459.44,604.2,{expectPicker:true})}
   runs.push({name,style,zoom,tuscanyPoints:3,poPlainPoints:3,river:true,wrongSameClass:true,apenninesInteraction:true,sanMarino:true,romeVatican:true,questionIndependentCandidates:true});
  }
  // A real two-region stage, one deliberately wrong location, then the normal spaced repair.
  await routeFixture(p,'regions');await theme(p,'discovery');await p.evaluate(()=>TopoAtlas.zoom(2));
  const first=await p.evaluate(()=>state.current.id),other=first==='area-g'?'area-h':'area-g';await answerTap(p,other,...regionPoints[other],{ok:false});assert.equal(await p.evaluate(()=>state.route.active.wrong),1);await next(p);
  let guard=0;const answered=[];
  while(!await p.evaluate(()=>state.route.active.done)){
   assert(++guard<15,'wrong→Next→repair is finite');if(await p.evaluate(()=>roundPaused)){await p.locator('#finishScreen .button').first().click();continue}
   const id=await p.evaluate(()=>state.current.id);const hit=await answerTap(p,id,...regionPoints[id]);answered.push({asked:id,...hit});
   const saved=await p.evaluate(()=>localStorage.getItem('topo-italie-v3'));await p.evaluate(()=>routeGrade(true));assert.equal(await p.evaluate(()=>localStorage.getItem('topo-italie-v3')),saved,'duplicate submit grants nothing');
   await shot(p,name+'-after-route-'+id);await next(p);
  }
  assert.equal(await p.evaluate(()=>state.route.active.result.passed),true);assert.equal(await p.evaluate(()=>state.route.chapters.regions.stage),2);assert.equal(await p.evaluate(()=>state.good),2);assert.equal(await p.evaluate(()=>state.slices),2);assert.equal(await p.evaluate(()=>state.route.active.wrong),1);
  routes.push({name,passed:true,wrong:1,good:2,slices:2,answered});await shot(p,name+'-stage-complete-after-repair');await c.close();
 }
 // Enumerate every true point anchor; verify displayed order independently of prompts.
 const oc=await browser.newContext({viewport:{width:820,height:1180},hasTouch:true}),op=await oc.newPage();watch(op);await op.goto(url);await fixture(op,'city-9');
 const points=await op.evaluate(()=>ITEMS.filter(i=>mapFeatureClass(i)==='point').map(i=>({id:i.id,x:i.px,y:i.py})));
 for(const point of points){
  await fixture(op,point.id);await op.evaluate(()=>{mapChoiceRandom=()=>0});await tap(op,point.x,point.y);
  if(await op.locator('#mapPicker').isVisible()){
   const order=await op.locator('[data-map-choice]').evaluateAll(ns=>ns.map(n=>n.dataset.mapChoice));const correctIndex=order.indexOf(point.id);assert(correctIndex>=0);orderProof.push({id:point.id,order,correctIndex});await op.locator(`[data-map-choice="${point.id}"]`).press('Enter');assert(await op.locator('#message').evaluate(n=>n.classList.contains('good')));
  }else assert(await op.locator('#message').evaluate(n=>n.classList.contains('good')));
 }
 assert(orderProof.some(r=>r.correctIndex===0));assert(orderProof.some(r=>r.correctIndex>0));
 for(const random of[0,.999999]){
  const promptOrders=[];
  for(const expected of['city-9','area-o']){
   await fixture(op,expected);await op.evaluate(r=>{mapChoiceRandom=()=>r},random);await tap(op,459.44,604.2);const order=await op.locator('[data-map-choice]').evaluateAll(ns=>ns.map(n=>n.dataset.mapChoice));promptOrders.push(order);
   const snapshot=await op.evaluate(()=>JSON.stringify(progressSnapshot()));await op.waitForTimeout(80);assert.deepEqual(await op.locator('[data-map-choice]').evaluateAll(ns=>ns.map(n=>n.dataset.mapChoice)),order,'order never jumps while open');assert.equal(await op.evaluate(()=>JSON.stringify(progressSnapshot())),snapshot);
   const before=await op.evaluate(()=>state.good);await op.locator('[data-map-choice]').first().press('Enter');assert.equal(await op.locator('#message').evaluate(n=>n.classList.contains('good')),order[0]===expected);assert.equal(await op.evaluate(()=>state.good),before+(order[0]===expected?1:0));
  }
  assert.deepEqual(promptOrders[0],promptOrders[1],'correct ID does not affect candidates or order');
 }
 await shot(op,'neutral-picker-wrong-is-rejected');
 // Genuine sea-area overlap uses outlines, never city-dot wording.
 const sea=await op.evaluate(()=>{for(let y=520;y<=570;y+=2)for(let x=335;x<=365;x+=2){const p=new DOMPoint(x,y).matrixTransform(document.querySelector('#map').getScreenCTM());const ids=mapTapCandidates(p.x,p.y,'sea').map(i=>i.id);if(ids.length>1)return{x,y,ids}}});assert(sea,'existing sea polygons overlap');
 await fixture(op,sea.ids[0]);await tap(op,sea.x,sea.y);assert(await op.locator('#mapPicker').isVisible());assert.match(await op.locator('#mapPickerTitle').textContent(),/gebied/);await shot(op,'neutral-overlapping-sea-areas');await op.locator(`[data-map-choice="${sea.ids[1]}"]`).press('Enter');assert(await op.locator('#message').evaluate(n=>n.classList.contains('bad')));
 // Free Point and actual formal-Test handlers use identical region/river resolution.
 for(const style of['school','discovery'])for(const mode of['point','exam'])for(const id of['area-g','area-h','water-G']){
  await fixture(op,id,mode);await theme(op,style);
  await fixture(op,id,mode);if(id==='water-G'){const xy=await op.evaluate(()=>{const p=elements['water-G'].getPointAtLength(elements['water-G'].getTotalLength()*.7);return[p.x,p.y]});await answerTap(op,id,...xy)}else await answerTap(op,id,...regionPoints[id]);
 }
 const polygonPoints=await op.evaluate(()=>ITEMS.filter(i=>!['point','river'].includes(mapFeatureClass(i))).map(i=>{const b=elements[i.id].getBBox(),left=Math.max(0,b.x),right=Math.min(890,b.x+b.width),top=Math.max(0,b.y),bottom=Math.min(1235,b.y+b.height);const inside=(x,y)=>{const p=new DOMPoint(x,y).matrixTransform(document.querySelector('#map').getScreenCTM());return mapTapCandidates(p.x,p.y,mapFeatureClass(i)).some(c=>c.id===i.id)};let pt=[(left+right)/2,(top+bottom)/2];if(!inside(...pt)){pt=null;for(let y=1;y<20&&!pt;y++)for(let x=1;x<20&&!pt;x++){const q=[left+(right-left)*x/20,top+(bottom-top)*y/20];if(inside(...q))pt=q}}return{id:i.id,point:pt}}));
 for(const {id,point}of polygonPoints){assert(point,'visible polygon interior '+id);await fixture(op,id);await answerTap(op,id,...point)}
 await fixture(op,'area-h');const overlayState=await op.evaluate(()=>JSON.stringify(progressSnapshot()));await op.locator('.mapTools .schoolbladButton').click();assert(await op.locator('#schoolbladDialog').isVisible());await op.keyboard.press('Escape');assert.equal(await op.evaluate(()=>JSON.stringify(progressSnapshot())),overlayState);assert.equal(await op.evaluate(()=>state.current.id),'area-h');await answerTap(op,'area-h',420,500);
 const inlandSea=await op.evaluate(()=>{for(let y=350;y<850;y+=10)for(let x=200;x<700;x+=10){const p=new DOMPoint(x,y).matrixTransform(document.querySelector('#map').getScreenCTM());const sea=ITEMS.find(i=>i.kind==='water'&&elements[i.id].isPointInFill(new DOMPoint(x,y)));if(sea&&[...document.querySelector('#landLayer').children].some(n=>mapFillContains(n,p.x,p.y)))return{id:sea.id,x,y}}});assert(inlandSea,'source sea fill is occluded by source land');await fixture(op,inlandSea.id);await tap(op,inlandSea.x,inlandSea.y);assert(await op.locator('#message').evaluate(n=>n.classList.contains('bad')),'land is never a correct sea selection');
 await op.evaluate(()=>mode('learn'));const learnBefore=await op.evaluate(()=>JSON.stringify(progressSnapshot()));await tap(op,420,500);if(await op.locator('#mapPicker').isVisible())await op.locator('[data-map-choice="area-h"]').press('Enter');assert.equal(await op.locator('#learnPrompt').textContent(),'Toscane');assert.equal(await op.evaluate(()=>JSON.stringify(progressSnapshot())),learnBefore,'Learn selection grants no score or reward');
 // Actual Gold point+write stage, then its complete replay: no duplicated reward grants.
 await routeFixture(op,'regions','gold');await theme(op,'school');
 async function finishGold(){let count=0;while(!await op.evaluate(()=>state.route.active.done)){assert(++count<15);const task=await op.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));if(task.mode==='point')await answerTap(op,task.id,...regionPoints[task.id]);else{await op.locator('#routeDockAnswer:visible,#answer:visible').first().fill(task.name);await op.locator('#routeDockCheck:visible,#check:visible').first().press('Enter');assert(await op.locator('#message').evaluate(n=>n.classList.contains('good')))}await next(op)}}
 await finishGold();assert.equal(await op.evaluate(()=>state.route.active.result.passed),true);const gold=await op.evaluate(()=>JSON.stringify([state.good,state.pizzas,state.slices,state.trips,state.route.rewardTokens,state.route.chapters.regions.goldAt]));await op.evaluate(()=>startRouteLesson('regions','gold'));await theme(op,'discovery');await finishGold();assert.equal(await op.evaluate(()=>JSON.stringify([state.good,state.pizzas,state.slices,state.trips,state.route.rewardTokens,state.route.chapters.regions.goldAt])),gold);await shot(op,'gold-replay-no-duplicate-reward');await oc.close();
 for(const file of['topo-italie-interactief.html','topo-italie-duolingo.html']){
  const c=await browser.newContext({offline:true,viewport:{width:820,height:1180},hasTouch:true}),p=await c.newPage();watch(p);await p.goto(new URL('../output/html/'+file,import.meta.url).href);
  for(const style of['school','discovery']){await fixture(p,'area-g');await theme(p,style);await p.evaluate(()=>TopoAtlas.zoom(2));await answerTap(p,'area-g',335,375);await fixture(p,'area-h');await answerTap(p,'area-h',420,500);await fixture(p,'water-G');const pt=await p.evaluate(()=>{const q=elements['water-G'].getPointAtLength(elements['water-G'].getTotalLength()*.7);return[q.x,q.y]});await answerTap(p,'water-G',...pt)}
  await fixture(p,'area-o');await answerTap(p,'area-o',459.44,604.2,{expectPicker:true});await shot(p,file.replace('.html','')+'-offline');await c.close();
 }
 let pizza=execFileSync('git',['show','dcc474e:index.html'],{maxBuffer:32e6}).toString();const begin=pizza.indexOf('// Neutral location picker:'),end=pizza.indexOf('// Separate 44-screen-pixel river targets',begin);assert(begin>=0&&end>begin);pizza=pizza.slice(0,begin)+'// BEGIN MAP HIT\n'+readFileSync('scripts/map-hit.js','utf8')+'// END MAP HIT\n\n'+pizza.slice(end);writeFileSync('/private/tmp/topo-map-hit-pizza-compat.html',pizza);
 const pc=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true,offline:true}),pp=await pc.newPage();watch(pp);await pp.goto('file:///private/tmp/topo-map-hit-pizza-compat.html');await fixture(pp,'area-g');await pp.evaluate(()=>{state.pizzas=2;state.slices=7;state.trips=0;sync()});const location=await pp.evaluate(()=>{let p=new DOMPoint(335,375).matrixTransform(document.querySelector('#map').getScreenCTM());window.scrollBy(0,p.y-innerHeight/2);p=new DOMPoint(335,375).matrixTransform(document.querySelector('#map').getScreenCTM());return[p.x,p.y]});await pp.touchscreen.tap(...location);assert(await pp.locator('#message').evaluate(n=>n.classList.contains('good')));assert.equal(await pp.evaluate(()=>state.pizzas),3);assert.equal(await pp.evaluate(()=>state.trips),1);assert.equal(await pp.locator('#pizzaCelebration').getAttribute('data-flavor'),'quattro-formaggi');assert.equal(await pp.locator('#rewardPizzaVisual').getAttribute('data-flavor'),'margherita');await pc.close();
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 writeFileSync(out+'/browser-results.json',JSON.stringify({baseline:'f67027d42202d1bd2a78f1d82dd02aa7fba41a91',runs,routes,pointAnchorsTested:points.length,polygonInteriorsTested:polygonPoints.length,schoolblad:'same task/progress after open/Escape',orderProof,seaOverlap:sea,inlandSeaRejected:inlandSea,learnSelection:'Tuscany via the same tap; progress unchanged',pizzaPR29Compatibility:'read-only HTML overlay of resolver on dcc474e; true eighth-answer Quattro completion and existing third trip PASS; PR29 untouched',goldReplay:'exact counters, tokens and goldAt unchanged',offline:'both downloads, both themes, zoomed region/river and neutral microstate grading PASS',errors,externalRequests:external,physicalIPad:'PENDING; Chromium touch emulation is not Safari device acceptance'},null,2)+'\n');
 console.log(JSON.stringify({viewportStyleZoomRuns:runs.length,completedRepairRoutes:routes.length,pointAnchors:points.length,ambiguousPointCases:orderProof.length,correctFirst:orderProof.filter(r=>r.correctIndex===0).length,correctNonFirst:orderProof.filter(r=>r.correctIndex>0).length,errors,external},null,2));
}finally{await browser.close()}
