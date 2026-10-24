import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const root=new URL('../',import.meta.url),output=new URL('docs/visual/schoolblad/',root);mkdirSync(output,{recursive:true});
const base='c68ace4e44a6e797f536ec1a8d6b517d29167320',before=join(mkdtempSync(join(tmpdir(),'topo-schoolblad-before-')),'index.html');
writeFileSync(before,execFileSync('git',['show',base+':index.html'],{maxBuffer:24*1024*1024}));
const errors=[],network=[],results=[];
function listen(p){p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!/^(file:|data:|blob:)/.test(r.url()))network.push(r.url());});p.on('dialog',d=>d.accept());}
const snapshot=p=>p.evaluate(()=>JSON.stringify({state,storage:localStorage.getItem('topo-italie-v3'),answer:document.querySelector('#answer').value,dockAnswer:document.querySelector('#routeDockAnswer').value,map:document.querySelector('#map').outerHTML}));
const sheet=p=>p.locator('#schoolbladDialog');
async function open(p){await p.locator('.schoolbladButton:visible').first().click();await p.locator('#school').evaluate(i=>i.decode());assert(await sheet(p).isVisible());}
async function visibleControls(p){await sheet(p).evaluate(async d=>{await Promise.all(d.getAnimations().map(a=>a.finished.catch(()=>{})));});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const info=await sheet(p).evaluate(d=>{const r=d.getBoundingClientRect(),c=d.querySelector('.schoolbladClose').getBoundingClientRect(),v=d.querySelector('.schoolbladViewport').getBoundingClientRect(),i=d.querySelector('img').getBoundingClientRect();return {dialog:r.toJSON(),close:c.toJSON(),viewport:v.toJSON(),image:i.toJSON(),ratio:i.width/i.height,natural:[d.querySelector('img').naturalWidth,d.querySelector('img').naturalHeight]};});assert(info.dialog.x>=0&&info.dialog.right<=p.viewportSize().width+1);assert(info.close.y>=0&&info.close.bottom<=p.viewportSize().height+1);assert(Math.abs(info.ratio-890/1235)<.001);return info;}
try{
 for(const [name,width,height] of [['desktop',1440,1000],['ipad-portrait',820,1180],['ipad-landscape',1180,820],['phone-390',390,844],['phone-320',320,568]]){
  const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<1200,reducedMotion:'reduce',offline:true}),p=await ctx.newPage();listen(p);
  await p.goto(pathToFileURL(before).href);await p.locator('[data-mode="learn"]').click();await p.screenshot({path:new URL(name+'-before.png',output).pathname,fullPage:true});
  await p.goto(new URL('index.html',root).href);await p.locator('[data-mode="learn"]').click();
  const modes=[];
  for(const mode of ['learn','point','write','exam']){
   await p.locator(`[data-mode="${mode}"]`).click();
   if(mode==='write')await p.locator('#answer').fill('Floren');
   const protectedBefore=await snapshot(p),opener=p.locator('.schoolbladButton:visible').first();await opener.scrollIntoViewIfNeeded();await opener.focus();const scroll=await p.evaluate(()=>[scrollX,scrollY]);await open(p);assert.equal(await snapshot(p),protectedBefore,mode+' open does not change state');
   const info=await visibleControls(p);assert(info.image.x>=info.viewport.x-1&&info.image.right<=info.viewport.right+1&&info.image.y>=info.viewport.y-1&&info.image.bottom<=info.viewport.bottom+1,'entire uncropped photograph fits by default');
   assert.equal(await sheet(p).evaluate(d=>getComputedStyle(d).animationName),'none');
   if(mode==='write'){
    await p.screenshot({path:new URL(name+'-fit.png',output).pathname});
    const close=sheet(p).locator('.schoolbladClose'),view=sheet(p).locator('.schoolbladViewport');
    await close.focus();await p.keyboard.press('Shift+Tab');assert(await view.evaluate(n=>n===document.activeElement));await p.keyboard.press('Tab');assert(await close.evaluate(n=>n===document.activeElement));
    for(let i=0;i<8;i++){await p.keyboard.press('Tab');assert(await sheet(p).evaluate(d=>d.contains(document.activeElement)),'no modal focus leakage');}
    await sheet(p).locator('[data-zoom="in"]').click();await sheet(p).locator('[data-zoom="in"]').click();assert.equal(await sheet(p).locator('output').textContent(),'200%');
    await view.focus();await p.keyboard.press('ArrowDown');assert(await view.evaluate(n=>n.scrollTop>0));
    // Real pointer movement pans the enlarged photograph, never the underlying map.
    const v=await view.boundingBox();const initial=await view.evaluate(n=>n.scrollTop);
    await p.mouse.move(v.x+v.width*.5,v.y+v.height*.6);await p.mouse.down();await p.mouse.move(v.x+v.width*.5,v.y+v.height*.4,{steps:5});await p.mouse.up();assert(await view.evaluate((n,old)=>n.scrollTop>old,initial));
    await p.screenshot({path:new URL(name+'-zoom.png',output).pathname});
    await sheet(p).locator('[data-zoom="fit"]').click();assert.equal(await sheet(p).locator('output').textContent(),'100%');
   }
   await p.keyboard.press('Escape');assert(!await sheet(p).isVisible());assert.equal(await snapshot(p),protectedBefore,mode+' close preserves state');
   await p.waitForFunction(expected=>scrollX===expected[0]&&Math.abs(scrollY-expected[1])<1,scroll);
   assert(await p.locator('.mapTools .schoolbladButton').evaluate(n=>n===document.activeElement));
   modes.push(mode);
  }
  // Pointer opening from an unfinished editor restores its caret, not just the opener.
  await p.locator('[data-mode="write"]').click();await p.locator('#answer').fill('Floren');await p.locator('#answer').evaluate(n=>{n.focus();n.setSelectionRange(2,5,'backward');});
  const editorBefore=await snapshot(p);await open(p);await sheet(p).locator('.schoolbladClose').click();
  await p.waitForFunction(()=>document.activeElement===document.querySelector('#answer'));
  assert.deepEqual(await p.locator('#answer').evaluate(n=>[n===document.activeElement,n.value,n.selectionStart,n.selectionEnd,n.selectionDirection]),[true,'Floren',2,5,'backward']);assert.equal(await snapshot(p),editorBefore);
  // Actual correct submitted feedback remains answered and keeps its score.
  const answer=await p.evaluate(()=>state.current.name);await p.locator('#answer').fill(answer);await p.locator('#check').click();assert(await p.evaluate(()=>state.answered));
  const graded=await snapshot(p);await open(p);await p.keyboard.press('Escape');assert.equal(await snapshot(p),graded);
  await p.locator('[data-mode="route"]').click();await open(p);await p.keyboard.press('Escape');
  await p.locator('#routeContinue').click();const routeBefore=await snapshot(p);await open(p);await p.keyboard.press('Escape');assert.equal(await snapshot(p),routeBefore,'mobile dock/route lesson preserved');
  // Gold fixture selects a pre-existing session. The overlay itself never grades it.
  await p.evaluate(()=>{TopoRoute.record(state.route,'city1').stage=3;startRouteLesson('city1','gold');});
  const gold=await snapshot(p);await open(p);await p.keyboard.press('Escape');assert.equal(await snapshot(p),gold);
  await p.screenshot({path:new URL(name+'-returned.png',output).pathname,fullPage:true});
  if(name.startsWith('ipad')){
   await open(p);
   const view=sheet(p).locator('.schoolbladViewport'),box=await view.boundingBox(),cdp=await ctx.newCDPSession(p),cx=box.x+box.width/2,cy=box.y+box.height/2;
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-30,y:cy,id:1},{x:cx+30,y:cy,id:2}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-90,y:cy,id:1},{x:cx+90,y:cy,id:2}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   assert(parseInt(await sheet(p).locator('output').textContent())>100,'two-finger touch pinch magnifies the original sheet');
   await p.screenshot({path:new URL(name+'-pinch.png',output).pathname});await sheet(p).locator('[data-zoom="fit"]').click();
   await p.addStyleTag({content:'html{font-size:200%} .schoolbladDialog button{font-size:1rem}'});await visibleControls(p);await p.screenshot({path:new URL(name+'-large-text.png',output).pathname});
   await p.setViewportSize({width:height,height:width});await visibleControls(p);await sheet(p).locator('[data-zoom="fit"]').click();await p.screenshot({path:new URL(name+'-rotated.png',output).pathname});
  }
  results.push({name,width,height,modes,routeAndGold:'PASS',answeredAndUnanswered:'PASS',caretAndFocus:'PASS',fitZoomPan:'PASS',escapeAndTabContainment:'PASS',largeTextAndOrientation:name.startsWith('ipad')?'PASS':'covered on iPad'});await ctx.close();
 }
 for(const file of ['output/html/topo-italie-interactief.html','output/html/topo-italie-duolingo.html','dist/index.html']){
  assert(readFileSync(new URL(file,root)).equals(readFileSync(new URL('index.html',root))));
  const ctx=await browser.newContext({viewport:{width:820,height:1180},offline:true}),p=await ctx.newPage();listen(p);await p.goto(new URL(file,root).href);await p.locator('#routeContinue').click();const old=await snapshot(p);await open(p);await visibleControls(p);await p.keyboard.press('Escape');assert.equal(await snapshot(p),old);await ctx.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
 writeFileSync(new URL('browser-results.json',output),JSON.stringify({base,browser:await browser.version(),transport:'file://; offline:true',viewports:results,artifacts:'both downloads + dist PASS',errors,externalRequests:network,physicalIPadSafari:'not tested',VoiceOver:'semantics inspected; physical VoiceOver not tested'},null,2)+'\n');
 console.log('Schoolblad: five viewports, all modes + Gold, answered/unanswered, caret/focus, keyboard modal, zoom/pan, iPad text/orientation and both offline downloads: PASS');
}finally{await browser.close();}
