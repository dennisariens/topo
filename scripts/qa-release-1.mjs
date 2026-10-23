import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
const option=name=>process.argv.find(a=>a.startsWith('--'+name+'='))?.split('=').slice(1).join('=');
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||option('playwright-module')||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||option('chrome')||undefined});
try {
const destination=process.env.QA_OUTPUT||'docs/visual/release-1';mkdirSync(destination,{recursive:true});
const context=await browser.newContext({viewport:{width:1366,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=process.env.TOPO_URL||'http://127.0.0.1:8000/';
await page.goto(url);await page.locator('#routeCards .routeCard').last().waitFor();
assert.equal(await page.locator('.routeStep').count(),33);
await page.screenshot({path:destination+'/desktop-route.png',fullPage:true});
await page.locator('#smartStart').click();
for(let n=0;n<6;n++){
 const task=await page.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));
 if(task.mode==='point')await page.locator(`[data-id="${task.id}"]`).first().press('Enter');
 else{await page.locator('#answer').fill(task.name);await page.locator('#check').click()}
 assert.equal(await page.evaluate(()=>state.answered),true);
 const good=await page.evaluate(()=>state.good);
 await page.reload();await page.locator('#routeContinue').click();
 assert.equal(await page.evaluate(()=>state.good),good);
 await page.locator('#next').click();
}
assert.equal(await page.locator('#finishScreen').getAttribute('data-event'),'ROUND.RESULT_PERFECT');
assert.equal(await page.locator('.finishStats b').first().textContent(),'6');
await page.screenshot({path:destination+'/adaptive-finish.png',fullPage:true});
await page.locator('#finishScreen .button').last().click();
await page.locator('[data-mode="write"]').click();
await page.selectOption('#groupSelect','countries');
for(const id of ['area-n','area-o']){
 await page.evaluate(id=>{state.current=byId[id];state.questionMode='write';highlight(state.current)},id);
 const ring=await page.locator('.microLocator circle').first().evaluate(n=>({x:+n.getAttribute('cx'),y:+n.getAttribute('cy')}));
 const anchor=await page.evaluate(id=>({x:byId[id].px,y:byId[id].py}),id);assert.deepEqual(ring,anchor);
 await page.screenshot({path:destination+'/'+id+'-highlight.png',fullPage:true});
}
await page.locator('[data-mode="point"]').click();
await page.evaluate(()=>{state.current=byId['area-o'];state.questionMode='point';state.answered=false;clearActive()});
const point=await page.evaluate(()=>{const p=new DOMPoint(byId['area-o'].px,byId['area-o'].py).matrixTransform(document.querySelector('#map').getScreenCTM());return {x:p.x,y:p.y}});
await page.mouse.click(point.x,point.y);await page.locator('#mapPicker[open]').waitFor();
assert(!/Rome|Vaticaan/.test(await page.locator('#mapPicker').innerText()),'picker never names the answer');
await page.screenshot({path:destination+'/rome-vatican-picker.png',fullPage:true});
const index=await page.evaluate(()=>{const matrix=document.querySelector('#map').getScreenCTM(),p=new DOMPoint(byId['area-o'].px,byId['area-o'].py).matrixTransform(matrix);return ITEMS.filter(i=>i.kind==='city'||['area-e','area-f','area-n','area-o'].includes(i.id)).map(i=>({i,d:Math.hypot(p.x-new DOMPoint(i.px,i.py).matrixTransform(matrix).x,p.y-new DOMPoint(i.px,i.py).matrixTransform(matrix).y)})).filter(v=>v.d<=22).sort((a,b)=>a.d-b.d).findIndex(v=>v.i.id==='area-o')});
await page.locator('#mapPicker .pickerActions button').nth(index).click();
assert.equal(await page.evaluate(()=>state.answered),true);assert.match(await page.locator('#message').getAttribute('class'),/good/);
for(const [name,width,height] of [['tablet',820,1180],['phone',390,844]]){
 await page.setViewportSize({width,height});await page.locator('[data-mode="route"]').click();await page.locator('#smartStart').click();
 const map=await page.locator('#map').boundingBox();assert(Math.abs(map.width/map.height-890/1235)<.002,'fixed map aspect');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no page overflow');
 await page.screenshot({path:destination+'/'+name+'-lesson.png',fullPage:true});
 await page.locator('#routeBack').click();
}
await page.locator('.mastery summary').click();await page.locator('#masteryGrid tbody tr').last().waitFor();assert.equal(await page.locator('#masteryGrid tbody tr').count(),45);
await page.setViewportSize({width:1366,height:1000});
await page.evaluate(()=>{for(const c of ROUTE_CHAPTERS){const r=TopoRoute.record(state.route,c.id);r.stage=3;r.goldAt=0}state.route.active=null;mode('route')});
await page.locator('#completedStops').evaluate(n=>n.open=true);await page.locator('#routeCards .routeCard').filter({hasText:'9. Landen'}).getByRole('button',{name:'Verdien goud',exact:false}).click();
let goldAnswers=0;
while(!await page.evaluate(()=>state.route.active.done)){
 if(await page.evaluate(()=>roundPaused)){await page.locator('#finishScreen .button').first().click();continue}
 const task=await page.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));
 if(task.mode==='point')await page.locator(`[data-id="${task.id}"]`).first().press('Enter');
 else{await page.locator('#answer').fill(task.name);await page.locator('#check').click()}
 assert(await page.evaluate(()=>state.answered));
 const feedback=await page.evaluate(()=>({ok:state.route.active.lastAnswer?.ok,message:document.querySelector('#message').textContent,mode:state.questionMode,id:state.current.id}));assert.equal(feedback.ok,true,JSON.stringify(feedback));goldAnswers++;
 await page.locator('#next').click();
}
assert.equal(goldAnswers,14);assert(await page.evaluate(()=>state.route.chapters.countries.goldAt>0));
await page.screenshot({path:destination+'/countries-gold.png',fullPage:true});
await page.goto(url+'print.html');await page.selectOption('#format','name');
assert.equal(await page.locator('.answers .blank').count(),6);
await page.screenshot({path:destination+'/print-name.png',fullPage:true});
await page.selectOption('#format','locate');assert(!/schrijf de code/i.test(await page.locator('#pages').innerText()));
await page.screenshot({path:destination+'/print-locate.png',fullPage:true});
await page.selectOption('#group','countries');await page.selectOption('#format','name');await page.screenshot({path:destination+'/print-countries.png',fullPage:true});
assert.deepEqual(errors,[]);
writeFileSync(destination+'/browser-results.json',JSON.stringify({browser:await browser.version(),url,checks:['33 stages; original Nino','six adaptive correct answers, reload per answer and round result','canonical microstate highlight rings','neutral Rome/Vatican pointer picker and correct grading','tablet and phone aspect ratio, no overflow','45-place passport','14-task countries gold across six-question pauses','name/locate print exercise rendering','reduced-motion context','no page errors'],physicalIPadSafari:'not tested',errors},null,2)+'\n');
} finally { await browser.close(); }
console.log('Release 1 browser QA: PASS');
