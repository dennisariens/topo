import {chromium,webkit} from 'file:///Users/dennisariens/.hermes/cache/scratch/nino-201-public/sdk/node_modules/playwright/index.mjs';
import fs from 'node:fs';import assert from 'node:assert/strict';
const OUT='/Users/dennisariens/.hermes/cache/scratch/hermes-v3-afb32d1/flows', URL='file:///Users/dennisariens/projects/topo-v3-independent-qa/output/html/TOPO-V3-Reis-Preview.html#nieuw';
const rows=[];const save=()=>fs.writeFileSync(OUT+'/gameplay.json',JSON.stringify(rows,null,2));
for(const [engine,type]of Object.entries({chromium,webkit})){
 const b=await type.launch();const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce',offline:true});
 p.on('dialog',d=>d.accept());p.on('pageerror',e=>{rows.push({engine,type:'pageerror',error:String(e)});save()});
 try{
 await p.goto(URL);await p.locator('.v3Actions button').click();
 for(const kind of ['discover','point','write','gold']){
  let count=0;
  while(true){
   const s=await p.evaluate(()=>({done:state.route.active.done,current:state.current,task:TopoRoute.current(state.route),index:state.route.active.index,answered:state.answered,finish:document.querySelector('.layout').classList.contains('finishLayout')}));
   if(s.done)break;
   if(s.finish){await p.getByRole('button',{name:'Volgende ronde →',exact:true}).click();continue;}
   if(kind==='write'&&count===0){
    await p.locator('#answer').fill('Florxyzence');await p.locator('#answer').evaluate(n=>n.setSelectionRange(2,7,'backward'));
    const snap=()=>p.evaluate(()=>({id:state.current?.id,mode:state.mode,task:TopoRoute.current(state.route),value:document.querySelector('#answer').value,start:document.querySelector('#answer').selectionStart,end:document.querySelector('#answer').selectionEnd,direction:document.querySelector('#answer').selectionDirection}));
    const before=await snap();await p.locator('.ninoNav').getByRole('button',{name:'Reis',exact:true}).click();await p.screenshot({path:OUT+`/${engine}-real-writing-reis.png`});
    await p.locator('.v3Actions button').click();const after=await snap();assert.deepEqual(after,before);rows.push({engine,type:'real-continuity',pass:true,before,after});save();
    await p.screenshot({path:OUT+`/${engine}-real-writing-restored.png`});
   }
   if(s.task.mode==='discover')await p.locator('#next').click();
   else {
    if(s.task.mode==='write'){await p.locator('#answer').fill(s.current.name);await p.locator('#check').click();}
    else{
     // Canonical map target activated with real keyboard events; no grader calls.
     const target=p.locator(`#map [data-id="${s.current.id}"][tabindex]`).first();await target.press('Enter');
     const choice=p.locator(`[data-map-choice="${s.current.id}"]`);if(await choice.isVisible())await choice.click();
    }
    const answer=await p.evaluate(()=>({answered:state.answered,last:state.route.active.lastAnswer}));assert(answer.answered&&answer.last?.ok);rows.push({engine,type:'real-answer',kind,id:s.current.id,mode:s.task.mode,index:s.index,pass:true,answer});save();while(await p.locator('#pizzaCelebration[open]').isVisible())await p.locator('#pizzaCelebration button').click();if(await p.locator('.vespaRide[open]').isVisible()){await p.locator('.vespaRide').getByRole('button',{name:'Verder',exact:true}).click();}await p.locator('#next').click();
   }
   count++;if(count>40)throw Error('unexpected loop');
  }
  const completion=await p.evaluate(()=>({active:state.route.active,record:TopoRoute.record(state.route,'city1'),good:state.good,pizzas:state.pizzas,slices:state.slices,trips:state.trips}));
  assert.equal(completion.active.wrong,0);assert(completion.active.done);rows.push({engine,type:'real-stage-complete',kind,count,pass:true,completion});save();await p.screenshot({path:OUT+`/${engine}-real-${kind}-complete.png`});
  if(kind==='discover'||kind==='point')await p.getByRole('button',{name:'Volgende les →',exact:true}).click();
  else if(kind==='write'){await p.locator('.ninoNav').getByRole('button',{name:'Reis',exact:true}).click();await p.locator('.v3Row[data-chapter="city1"]').click();await p.locator('.v3Actions button').click();}
 }
 await p.locator('.ninoNav').getByRole('button',{name:'Reis',exact:true}).click();
 const final=await p.evaluate(()=>({city1:document.querySelector('.v3Row[data-chapter="city1"]').dataset.state,city2:document.querySelector('.v3Row[data-chapter="city2"]').dataset.state,stage:TopoRoute.record(state.route,'city1').stage,gold:TopoRoute.record(state.route,'city1').goldAt}));assert.equal(final.city1,'gold');assert.equal(final.city2,'now');rows.push({engine,type:'real-final',pass:true,final});save();await p.screenshot({path:OUT+`/${engine}-real-gold-home.png`});
 }catch(e){rows.push({engine,type:'failure',pass:false,error:String(e),stack:e.stack});save();await p.screenshot({path:OUT+`/${engine}-real-failure.png`});console.log(engine,e.message)}
 await b.close();
}
console.log(JSON.stringify({rows:rows.length,failed:rows.filter(r=>r.pass===false)},null,2));
