import {chromium,webkit} from 'file:///Users/dennisariens/.hermes/cache/scratch/nino-201-public/sdk/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const OUT='/Users/dennisariens/.hermes/cache/scratch/hermes-v3-afb32d1/flows';
const URL='file:///Users/dennisariens/projects/topo-v3-independent-qa/output/html/TOPO-V3-Reis-Preview.html';
const results=[];function save(){fs.writeFileSync(OUT+'/matrix.json',JSON.stringify(results,null,2));}
for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page.on('dialog',d=>d.accept());
 for(const hash of ['nieuw','bezig','afgerond','alles']){
  await page.goto('about:blank');await page.goto(URL+'#'+hash);await page.waitForSelector('.v3Row');
  const baseline=await page.evaluate(()=>ROUTE_CHAPTERS.map((c,i)=>({id:c.id,index:i,record:TopoRoute.record(state.route,c.id),open:TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,c.id),due:TopoRoute.due(state.route,ROUTE_CHAPTERS).some(d=>d.id===c.id)})));
  for(const c of baseline){
   await page.locator(`.v3Row[data-chapter="${c.id}"]`).click();
   const row=await page.evaluate(id=>{let r=document.querySelector(`.v3Row[data-chapter="${id}"]`);return {status:r.dataset.state,label:r.querySelector('.v3End').getAttribute('aria-label'),segments:[...document.querySelectorAll('.v3StageBar span')].map(x=>({class:x.className,label:x.getAttribute('aria-label')})),actions:[...document.querySelectorAll('.v3Actions button,.v3Again button')].map(b=>b.textContent)}},c.id);
   const expected=!c.open?'locked':c.record.goldAt?'gold':c.record.stage===3?'done':baseline.find(x=>x.record.stage<3)?.id===c.id?'now':'open';
   const statusPass=row.status===expected&&row.segments.every((s,i)=>s.class===(i<c.record.stage?'on':i===c.record.stage&&c.open&&c.record.stage<3?'now':''))&&(!c.open?row.actions.length===0:true);
   results.push({engine,hash,chapter:c.id,type:'fixture-status',fixture:true,pass:statusPass,expected,observed:row});save();
  }
  await page.screenshot({path:OUT+`/${engine}-${hash}.png`,fullPage:true});
  const actions=baseline.flatMap(c=>!c.open?[]:[{chapter:c.id,kind:c.record.stage<3?['discover','point','write'][c.record.stage]:c.record.goldAt&&c.due?'review':'gold',index:0},...['discover','point','write'].slice(0,c.record.stage).map((kind,i)=>({chapter:c.id,kind,index:i+1}))]);
  for(const a of actions){
   await page.goto('about:blank');await page.goto(URL+'#'+hash);await page.waitForSelector('.v3Row');await page.locator(`.v3Row[data-chapter="${a.chapter}"]`).click();
   await page.locator('.v3Actions button,.v3Again button').nth(a.index).click();
   const observed=await page.evaluate(()=>({chapter:state.route.active?.chapterId,kind:state.route.active?.kind,question:TopoRoute.current(state.route),visible:document.querySelector('#routeHome').classList.contains('hidden')}));
   results.push({engine,hash,type:'fixture-action',fixture:true,...a,observed,pass:observed.chapter===a.chapter&&observed.kind===a.kind&&observed.visible});save();
  }
 }
 await browser.close();
}
console.log(JSON.stringify({cases:results.length,failed:results.filter(x=>!x.pass)},null,2));
