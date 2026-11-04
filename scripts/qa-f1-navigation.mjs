// Fresh-profile, real UI regression. No injected questions/progress or DOM-only selection setup.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root=new URL('../',import.meta.url),out=new URL(process.env.QA_F1_DIR||'docs/qa/f1-71/',root);
mkdirSync(out,{recursive:true});
const file=process.env.QA_F1_HTML?pathToFileURL(process.env.QA_F1_HTML):new URL('output/html/TOPO-NINO-Computer-Release.html',root);
const api=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),engine=process.env.QA_BROWSER||'chrome';
const browser=await(engine==='webkit'?api.webkit:api.chromium).launch(engine==='webkit'?{}:{executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const runs=[],errors=[],network=[];
const snapshot=p=>p.evaluate(()=>({question:state.current?.id??null,mode:state.mode,questionMode:state.questionMode,answered:state.answered,quizSession:state.quizSession,learnSession:state.learnSession,progress:progressSnapshot(),disk:Object.fromEntries(Object.entries(localStorage)),draft:document.querySelector('#answer').value,caret:[answer.selectionStart,answer.selectionEnd,answer.selectionDirection],prompt:document.querySelector('#prompt').textContent}));
const nav=(p,name)=>p.getByRole('button',{name,exact:true}).click();
async function choose(p,mode){const menu=p.locator('#focusMenu');if(await menu.isVisible()&&!await menu.evaluate(n=>n.open))await menu.locator(':scope > summary').click();await p.locator('[data-mode="'+mode+'"]').click();}
async function selection(p,start,end,direction){const input=p.locator('#answer');await input.fill('Navigatieconcept');for(let i=0;i<'Navigatieconcept'.length;i++)await input.press('ArrowLeft');for(let i=0;i<(direction==='backward'?end:start);i++)await input.press('ArrowRight');for(let i=start;i<end;i++)await input.press(direction==='backward'?'Shift+ArrowLeft':'Shift+ArrowRight');}
try{
 for(const width of [1500,768,320]){
  const context=await browser.newContext({offline:true,viewport:{width,height:width===1500?1000:width===768?1024:740},deviceScaleFactor:2,hasTouch:width!==1500,reducedMotion:'reduce'}),p=await context.newPage();
  p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('request',r=>{if(!/^(file:|data:|blob:)/.test(r.url()))network.push(r.url())});
  await p.goto(file.href);if(await p.locator('.ninoProfile[open]').count())await p.getByRole('button',{name:'Begin zonder invullen',exact:true}).click();assert.match(await p.title(),/NINO/);await nav(p,'Oefenen');await choose(p,'write');
  // Exact Hermes reproduction first, with no played or injected progress.
  for(const [start,end,direction]of [[3,10,'backward'],[5,5,'none'],[2,8,'forward']]){
   await selection(p,start,end,direction);const before=await snapshot(p);assert.deepEqual(before.caret,[start,end,direction]);
   if(direction==='backward')await p.screenshot({path:new URL(engine+'-'+width+'-'+direction+'-before.png',out).pathname});
   for(let n=0;n<2;n++){
    await nav(p,'Reis');assert(await p.locator('.layout').evaluate(n=>n.classList.contains('routeHomeLayout')));assert.deepEqual(await snapshot(p),before,'Reis must preserve live state');
    await nav(p,'Oefenen');assert.deepEqual(await snapshot(p),before,'Oefenen must resume exact context');assert(await p.locator('#quiz').isVisible());assert(await p.locator('#answer').isVisible());
   }
   await nav(p,'Reisboekje');const next=p.getByRole('button',{name:'Volgende',exact:true});if(await next.isEnabled())await next.click();else await p.getByRole('button',{name:'Vorige',exact:true}).click();await nav(p,'Sluit boekje');assert.deepEqual(await snapshot(p),before,'book preserves active exercise');
   await nav(p,'Reis');await nav(p,'Reisboekje');await nav(p,'Sluit boekje');await nav(p,'Oefenen');assert.deepEqual(await snapshot(p),before,'book on Reis preserves suspended exercise');
   if(direction==='backward')await p.screenshot({path:new URL(engine+'-'+width+'-'+direction+'-after.png',out).pathname});runs.push({width,selection:[start,end,direction],before,after:await snapshot(p),fixture:false});
  }
  // A canceled reset must leave the suspended draft intact.
  const canceled=await snapshot(p);await nav(p,'Reis');p.once('dialog',d=>d.dismiss());await p.locator('#routeReset').click();await nav(p,'Oefenen');assert.deepEqual(await snapshot(p),canceled);
  // Earn a score through a genuine answer, then check navigation against nonempty progress/save.
  await p.locator('#answer').fill(await p.evaluate(()=>state.current.name));await p.locator('#check').click();assert.equal(await p.evaluate(()=>state.good),1);
  const earned=await snapshot(p);await nav(p,'Reis');await nav(p,'Oefenen');assert.deepEqual(await snapshot(p),earned);
  for(const mode of ['point','exam','learn']){await choose(p,mode);const before=await snapshot(p);await nav(p,'Reis');await nav(p,'Oefenen');assert.deepEqual(await snapshot(p),before,mode);assert(!await p.locator('.layout').evaluate(n=>n.classList.contains('routeHomeLayout')));}
  await choose(p,'write');await nav(p,'Reis');await p.locator('#routeContinue').click();assert.equal(await p.evaluate(()=>state.mode),'route');
  const route=await snapshot(p);assert(route.question);await nav(p,'Reis');p.once('dialog',d=>d.dismiss());await p.locator('#smartStart').click();await nav(p,'Oefenen');assert.deepEqual(await snapshot(p),route);assert(await p.locator('#quiz').isVisible());
  for(let i=0;i<30&&!await p.locator('#finishScreen').count();i++)await p.locator('#next').click();
  assert(await p.locator('#finishScreen').isVisible());const result=await snapshot(p);
  await nav(p,'Reis');assert(await p.locator('#journeyScreen').isVisible());assert(!await p.locator('#finishScreen').isVisible());
  await nav(p,'Oefenen');assert(await p.locator('#finishScreen').isVisible());assert.deepEqual(await snapshot(p),result);
  await p.getByRole('button',{name:'Terug naar de route',exact:true}).click();assert(await p.locator('#journeyScreen').isVisible());assert.equal(await p.locator('#finishScreen').count(),0);
  runs.push({width,resultScreenResumeAndDefaultExit:'PASS',earnedProgress:earned.progress,modeChecks:['point','exam','learn'],explicitRouteStartAndResume:'PASS',fixture:false});await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
}finally{
 writeFileSync(new URL(engine+'-navigation.json',out),JSON.stringify({browser:await browser.version(),htmlSHA256:createHash('sha256').update(readFileSync(file)).digest('hex'),file:file.href,scope:'Offline generated HTML; clean profiles; keyboard direction selection; no injected progress; genuine one-answer score',runs,errors,network},null,2)+'\n');await browser.close();
}
console.log(engine+': F1 navigation, selections, book, saved progress and explicit route start PASS at 1500/768/320px');
