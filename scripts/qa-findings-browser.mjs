import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const option=name=>process.argv.find(a=>a.startsWith('--'+name+'='))?.split('=').slice(1).join('=');
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||option('playwright-module')||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||option('chrome')||undefined});
try{
 const context=await browser.newContext({viewport:{width:1366,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[];let confirmations=0;
 page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async dialog=>{confirmations++;await dialog.accept()});
 const url=process.env.TOPO_URL||'http://127.0.0.1:8014/';
 const output=process.env.QA_OUTPUT||'docs/visual/release-1-qa-fixes';mkdirSync(output,{recursive:true});
 const progress=()=>page.evaluate(()=>({daily:state.daily.correct,rewards:[state.good,state.pizzas,state.slices,state.trips],skills:state.route.items}));
 async function home(){await page.locator('#finishScreen .button').last().click()}
 async function start(kind){const card=page.locator('#routeCards .routeCard').first();const n=['discover','point','write'].indexOf(kind);if(n>=0)await card.locator('.routeStep').nth(n).click();else await card.locator('.goldButton').click()}
 async function complete(reload=false){
  let answered=0;
  while(!await page.evaluate(()=>state.route.active.done)){
   if(await page.evaluate(()=>roundPaused)){await page.locator('#finishScreen .button').first().click();continue}
   const task=await page.evaluate(()=>({id:state.current.id,name:state.current.name,mode:state.questionMode}));
   if(task.mode==='discover'){await page.locator('#next').click();answered++;continue}
   if(task.mode==='point')await page.locator(`[data-id="${task.id}"][tabindex="0"]`).first().press('Enter');
   else{await page.locator('#answer').fill(task.name);await page.locator('#check').click()}
   assert.equal(await page.evaluate(()=>state.route.active.lastAnswer?.ok),true);
   const accepted=await progress();
   if(task.mode==='point')await page.locator(`[data-id="${task.id}"][tabindex="0"]`).first().press('Enter');
   else await page.locator('#check').evaluate(n=>n.click());
   assert.deepEqual(await progress(),accepted,'resubmission does not count twice');
   if(reload&&answered===0){
    await page.reload();await page.locator('#routeContinue').click();
    assert.deepEqual(await progress(),accepted,'answered feedback reload does not count twice');
    if(task.mode==='point')await page.locator(`[data-id="${task.id}"][tabindex="0"]`).first().press('Enter');
    else await page.locator('#check').evaluate(n=>n.click());
    assert.deepEqual(await progress(),accepted,'resubmission after reload does not count twice');
   }
   await page.locator('#next').click();answered++;
  }
  return answered;
 }
 await page.goto(url);await page.locator('#routeContinue').click();await complete();assert.equal((await progress()).daily,0);
 await home();await start('point');assert.equal(await complete(),6);const first=await progress();assert.equal(first.daily,6);
 await home();await start('point');assert.equal(await complete(true),6);const replay=await progress();assert.equal(replay.daily,12);assert.deepEqual(replay.rewards,first.rewards);
 await home();await page.screenshot({path:output+'/stage-replay-daily.png',fullPage:true});
 await start('write');await complete();await home();await start('gold');assert.equal(await complete(),12);const gold=await progress();assert.equal(gold.daily,30);
 await home();await start('gold');assert.equal(await complete(true),12);const goldReplay=await progress();assert.equal(goldReplay.daily,42);assert.deepEqual(goldReplay.rewards,gold.rewards);
 await home();await page.screenshot({path:output+'/gold-replay-daily.png',fullPage:true});
 const valid=await page.evaluate(()=>({app:'topo-italie',version:1,progress:progressSnapshot()}));
 async function importBackup(data){
  await page.locator('#backupStatus').evaluate(n=>n.textContent='pending');
  await page.locator('#backupFile').setInputFiles({name:'qa-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await page.waitForFunction(()=>document.querySelector('#backupStatus').textContent!=='pending');
 }
 const malformed=[{schema:999},[],{schema:2,chapters:{},items:{}},{...valid.progress.route,chapters:[]},{...valid.progress.route,items:{'city-1':{skills:[]}}},{...valid.progress.route,active:{...valid.progress.route.active,queue:{}}}];
 for(const route of malformed){
  const before=await page.evaluate(()=>({memory:JSON.stringify(state),storage:localStorage.getItem('topo-italie-v3')})),count=confirmations;
  await importBackup({...valid,progress:{...valid.progress,route}});
  assert.match(await page.locator('#backupStatus').textContent(),/Terugzetten lukte niet/);
  assert.deepEqual(await page.evaluate(()=>({memory:JSON.stringify(state),storage:localStorage.getItem('topo-italie-v3')})),before,'invalid import preserves exact memory/storage');
  assert.equal(confirmations,count,'invalid backup is rejected before confirmation');
 }
 await page.screenshot({path:output+'/invalid-backup-preserved.png',fullPage:true});
 for(const schema of [1,2]){
  const data=structuredClone(valid);data.progress.route.schema=schema;if(schema===1)data.progress.route.chapters.city1.stage=4;
  await importBackup(data);assert.match(await page.locator('#backupStatus').textContent(),/Je voortgang is teruggezet/);
  assert.equal(await page.evaluate(()=>state.route.schema),2);assert.equal(await page.evaluate(()=>state.route.chapters.city1.stage),3);
  assert.equal(await page.evaluate(()=>state.route.chapters.city1.goldAt),valid.progress.route.chapters.city1.goldAt);
 }
 assert.deepEqual(errors,[]);
 const result={browser:await browser.version(),url,QA1:{initialDaily:first.daily,stageReplayDaily:replay.daily,initialRewards:first.rewards,stageReplayRewards:replay.rewards,goldDaily:gold.daily,goldReplayDaily:goldReplay.daily,goldRewards:gold.rewards,goldReplayRewards:goldReplay.rewards,reloadAndResubmission:'PASS'},QA2:{negativeImports:malformed.length,memoryAndStorageByteEquivalent:true,rejectedBeforeConfirmation:true,validSchemas:[1,2]},errors,physicalIPadSafari:'not tested'};
 writeFileSync(output+'/browser-results.json',JSON.stringify(result,null,2)+'\n');
 console.log('QA-1 Chrome: 6 → 12 stage replay; 30 → 42 gold replay; unchanged pizza rewards; reload/resubmit PASS');
 console.log('QA-2 Chrome: six malformed file imports preserve memory/storage before confirmation; schema 1/2 imports PASS');
}finally{await browser.close()}
