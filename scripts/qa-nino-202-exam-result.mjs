// NINO 2.0.2: the exam-result illustration must stay inside its own box, keep its aspect ratio, and leave the score,
// group, encouragement and actions free. The real learner route: Oefenen → Steden 1–6 → Toets → Alleen namen schrijven,
// six questions, five correct. Measured after all animations finish, in Chrome and WebKit, at 1300×950 and 768×1024.
// Usage: PLAYWRIGHT_MODULE=/path/playwright/index.mjs node scripts/qa-nino-202-exam-result.mjs <label>=<html> ... --out <dir>
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const args=process.argv.slice(2),outIndex=args.indexOf('--out'),out=resolve(outIndex>=0?args.splice(outIndex,2)[1]:'docs/qa/nino-2.0.2/exam-result');
const runs=args.map(a=>{const i=a.indexOf('=');return {label:a.slice(0,i),file:resolve(a.slice(i+1))};});
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const engines=[['chrome',()=>chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'})],['webkit',()=>webkit.launch()]];
const report={route:'Oefenen → Steden 1–6 → Toets → Alleen namen schrijven, 1 fout en 5 goed',runs:[]};
for(const {label,file} of runs)for(const [engine,launch] of engines){
 const browser=await launch(),context=await browser.newContext({offline:true,viewport:{width:1300,height:950}}),page=await context.newPage();
 const errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!/^(file|data|blob):/.test(r.url()))external.push(r.url())});
 await page.goto(pathToFileURL(file).href);
 await page.getByRole('button',{name:'Overslaan',exact:true}).click();
 await page.getByRole('button',{name:'Oefenen',exact:true}).click();
 await page.locator('#groupSelect').selectOption('city1');
 await page.locator('[data-mode="exam"]').click();
 await page.locator('#testFormat').selectOption('write');
 let answers=0,correct=0;
 while(!await page.evaluate(()=>state.examEnded)){
  const name=await page.evaluate(()=>state.current.name),right=answers>0;
  await page.locator('#answer').fill(right?name:'Onjuist');await page.locator('#check').click();answers++;if(right)correct++;
  await page.locator('#next').click();assert(answers<=7,'unexpected exam length');
 }
 const dialog=page.locator('.ninoExamResult');await dialog.waitFor({state:'visible'});
 const sizes=[];
 for(const viewport of [{width:1300,height:950},{width:768,height:1024}]){
  await page.setViewportSize(viewport);
  await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
  await page.waitForTimeout(1500);
  const g=await dialog.evaluate(d=>{
   const r=n=>{const b=n.getBoundingClientRect();return {left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height};};
   const img=d.querySelector('.examArt img'),box=r(img),nat=img.naturalWidth/img.naturalHeight,fit=getComputedStyle(img).objectFit;
   // The drawn picture: object-fit contain letterboxes inside the element box.
   let drawn=box;if(fit==='contain'){const w=Math.min(box.width,box.height*nat),h=w/nat;drawn={left:box.left+(box.width-w)/2,top:box.top+(box.height-h)/2,width:w,height:h};drawn.right=drawn.left+w;drawn.bottom=drawn.top+h;}
   const text=Object.fromEntries([['title','h2'],['score','.examScore'],['group','.examGroup'],['message','.examMessage'],['actions','.examActions']].map(([k,s])=>[k,r(d.querySelector(s))]));
   return {artBox:r(d.querySelector('.examArt')),imgBox:box,drawn,objectFit:fit,naturalRatio:nat,drawnRatio:drawn.width/drawn.height,text,
    score:d.querySelector('.examScore').textContent,buttons:[...d.querySelectorAll('.examActions :is(button,a)')].filter(b=>b.offsetParent).map(b=>b.textContent),
    runningAnimations:document.getAnimations().filter(a=>a.playState==='running').length};
  });
  const hit=(a,b)=>a.left<b.right-.5&&a.right>b.left+.5&&a.top<b.bottom-.5&&a.bottom>b.top+.5;
  const inside=(a,b)=>a.left>=b.left-.5&&a.right<=b.right+.5&&a.top>=b.top-.5&&a.bottom<=b.bottom+.5;
  g.checks={drawnInsideArtBox:inside(g.drawn,g.artBox),imgElementInsideArtBox:inside(g.imgBox,g.artBox),aspectKept:Math.abs(g.drawnRatio-g.naturalRatio)<.01,
   overlaps:Object.fromEntries(Object.entries(g.text).map(([k,v])=>[k,hit(g.drawn,v)])),noRunningAnimations:g.runningAnimations===0};
  g.pass=g.checks.drawnInsideArtBox&&g.checks.imgElementInsideArtBox&&g.checks.aspectKept&&!Object.values(g.checks.overlaps).some(Boolean);
  const shot=`${label}-${engine}-${viewport.width}.png`;mkdirSync(out,{recursive:true});await page.screenshot({path:resolve(out,shot)});
  sizes.push({viewport,geometry:g,screenshot:shot});
 }
 report.runs.push({label,file,engine,version:browser.version(),answers,correct,errors,external,sizes,pass:sizes.every(s=>s.geometry.pass)&&errors.length===0&&external.length===0&&correct===5&&answers===6});
 console.log(label,engine,browser.version(),answers+' vragen, '+correct+' goed',sizes.map(s=>s.viewport.width+':'+(s.geometry.pass?'PASS':'FAIL')+' score='+s.geometry.score+' overlap='+JSON.stringify(s.geometry.checks.overlaps)).join(' | '));
 await browser.close();
}
writeFileSync(resolve(out,'exam-result.json'),JSON.stringify(report,null,2)+'\n');
