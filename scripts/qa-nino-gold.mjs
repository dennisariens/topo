// Gold round in Chrome: ★ Goudronde above every Aanwijzen and Namen schrijven question, the outcome on the result, none in a normal lesson.
// usage: PLAYWRIGHT_MODULE=… node scripts/qa-nino-gold.mjs <html> <outdir>
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const [html,out]=process.argv.slice(2);const b=await chromium.launch({channel:'chrome'});const at=Date.UTC(2026,10,6);
const save=JSON.stringify({schema:3,good:30,pizzas:0,slices:0,trips:0,mistakes:[],route:{schema:2,chapters:{city1:{stage:3,completedAt:at,goldAt:0,nextReviewAt:0,reviews:0}},items:{},rewardTokens:[],active:null},daily:{date:'2026-11-06',correct:0}});
const res={};
for(const [name,w,h] of [['desktop',1366,768],['tel320',320,640]]){
 const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,hasTouch:w<1300,isMobile:w<800});
 await c.addInitScript(s=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s',1);localStorage.setItem('topo-nino-intro-v1','done');localStorage.setItem('topo-nino-profile-v1',JSON.stringify({schema:1,name:'Ada',coverColor:'riviera',favoritePizza:'salami'}));localStorage.setItem('topo-italie-v3',s)},save);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(new URL(html,'file://'+process.cwd()+'/').href);await p.waitForTimeout(1200);
 await p.getByRole('button',{name:'Reis',exact:true}).click();await p.waitForTimeout(300);
 const g=p.getByRole('button',{name:'★ Verdien goud'});let via='ui';if(await g.count()){await g.first().scrollIntoViewIfNeeded();await g.first().click();}else{via='eval';await p.evaluate(()=>startRouteLesson('city1','gold'));}
 await p.waitForTimeout(600);const r=[];
 for(let n=0;n<14;n++){const fin=p.locator('#finishScreen button.primary');if(await p.evaluate(()=>state.route.active?.done))break;if(await p.locator('#finishScreen').count()){await p.screenshot({path:`${out}/${name}-pause.png`});await fin.first().click();await p.waitForTimeout(400);continue;}
  const info=await p.evaluate(()=>{const h=document.querySelector('.ninoGoldHead'),r=h.getBoundingClientRect(),pr=document.querySelector('#prompt').getBoundingClientRect();const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {mode:state.questionMode,visible:!h.hidden&&r.height>0&&r.top>=0&&r.bottom<=innerHeight&&h.contains(hit),above:r.bottom<=pr.top+1,text:h.textContent}});
  r.push(info);if(n===0||(info.mode==='write'&&!r.slice(0,-1).some(x=>x.mode==='write')))await p.screenshot({path:`${out}/${name}-${info.mode}.png`});
  if(info.mode==='write'){const ans=await p.evaluate(()=>state.current.name);await p.locator('#answer').fill(ans);await p.locator('#check').click();}
  else await p.evaluate(()=>routeGrade(true));
  await p.waitForTimeout(250);for(let k=0;k<6&&await p.locator('#pizzaCelebration[open]').count();k++){const v=p.locator('#pizzaCelebration[open] button:visible').last();await v.click().catch(()=>{});await p.waitForTimeout(500);}if(await p.locator('#next').isVisible()&&!(await p.evaluate(()=>state.route.active?.done)))await p.locator('#next').click();await p.waitForTimeout(250);}
 await p.waitForTimeout(500);for(const d of await p.locator('dialog[open]').all()){await p.keyboard.press('Escape');await p.waitForTimeout(300);}
 await p.screenshot({path:`${out}/${name}-result.png`});
 const result=await p.evaluate(()=>(document.querySelector('#finishTitle')||document.querySelector('#prompt')).textContent+' | '+((document.querySelector('#finishTitle+p')||document.querySelector('#help')).textContent));
 await p.evaluate(()=>startRouteLesson('city1','review'));await p.waitForTimeout(500);const normal=await p.evaluate(()=>({kind:state.route.active.kind,label:!document.querySelector('.ninoGoldHead').hidden}));await p.screenshot({path:`${out}/${name}-normal.png`});
 res[name]={via,questions:r.map(x=>x.mode+(x.visible&&x.above?' ✓':' ✗ '+JSON.stringify(x))).join(', '),result,normal,errs};await c.close();}
console.log(JSON.stringify(res,null,1));await b.close();
