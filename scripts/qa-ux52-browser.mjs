/* UX #52 browser acceptance: real standalone HTML, both responsive owners, no fake geography. */
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=resolve(process.env.UX52_QA_DIR||'docs/visual/ux52');
mkdirSync(output,{recursive:true});
const html=pathToFileURL(resolve(process.env.UX52_HTML||'output/html/TOPO-NINO-UX52-Computer-Preview.html')).href;
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),results=[],pageErrors=[],network=[];
async function open(name,width,height,coarse=false){
 const context=await browser.newContext({viewport:{width,height},offline:true,reducedMotion:'reduce',hasTouch:coarse,isMobile:false});
 const page=await context.newPage();
 page.on('pageerror',error=>pageErrors.push(name+': '+error.message));
 page.on('request',request=>{if(!/^(file:|data:)/.test(request.url()))network.push(name+': '+request.url());});
 page.on('dialog',dialog=>dialog.accept());
 await page.goto(html);await page.waitForTimeout(130);
 return{context,page};
}
async function snap(page,name){await page.screenshot({path:resolve(output,name+'.png'),fullPage:true});}
try{
 for(const [name,width,height,coarse] of [
  ['desktop-1728',1728,1080,false],['desktop-1440',1440,900,false],
  ['desktop-1280',1280,800,false],['tablet-1180',1180,820,true],
  ['tablet-portrait',820,1180,true],['phone-390',390,844,true],['phone-320',320,568,true]
 ]){
  const{context,page}=await open(name,width,height,coarse);
  const desktop=width>1180&&!coarse;
  const active=await page.locator('body').getAttribute('data-ux52-desktop');
  assert.equal(active,String(desktop),name+': wrong desktop/focus ownership');
  assert.equal(await page.locator('#answer').count(),1,name+': duplicate canonical input');
  assert.equal(await page.locator('#check').count(),1,name+': duplicate canonical grader');
  if(desktop){
   assert.equal(await page.locator('.ux52Context:visible').count(),1);
   assert.equal(await page.locator('.ux52Gold:visible').count(),1);
   assert.equal(await page.locator('#ux52Gold').isDisabled(),true,'Gold must start locked');
   assert.equal(await page.locator('nav.tabs .tab[data-mode="learn"]:visible').count(),1);
   const gold=page.locator('#ux52Gold');
   assert.equal(await gold.isEnabled(),false);
   await page.evaluate(()=>mode('learn'));
   await page.waitForTimeout(70);await snap(page,name+'-discover');
   await page.evaluate(()=>mode('point'));
   await page.waitForTimeout(70);await snap(page,name+'-point');
   await page.evaluate(()=>mode('write'));
   await page.waitForTimeout(70);await snap(page,name+'-write');
   await page.locator('.ux52MenuToggle').click();
   await page.locator('.ux52MenuItem').filter({hasText:'Vrije toets'}).click();
   await page.waitForTimeout(70);
   assert.equal(await page.evaluate(()=>state.mode),'exam');
   await snap(page,name+'-test');
  }else{
   assert.equal(await page.locator('#ux52Gold:visible').count(),0,'Gold double-nav in Focus');
   await page.evaluate(()=>mode('write'));
   await page.waitForTimeout(50);await snap(page,name+'-focus-write');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,name+': horizontal overflow '+overflow);
  results.push({name,width,height,desktop,overflow,ok:true});
  await context.close();
 }
 // Real live Focus <-> desktop crossing must preserve the *one* real input.
 const{context,page}=await open('breakpoint',1500,950,false);
 await page.evaluate(()=>mode('write'));
 await page.locator('#answer').fill('Roma');
 await page.locator('#answer').evaluate(el=>{el.focus();el.setSelectionRange(1,3,'backward')});
 for(const width of[1100,1500,1024,1500]){
  await page.setViewportSize({width,height:950});await page.waitForTimeout(180);
  const check=await page.locator('#answer').evaluate(el=>({value:el.value,start:el.selectionStart,end:el.selectionEnd,dir:el.selectionDirection}));
  assert.equal(check.value,'Roma');assert.equal(check.start,1);assert.equal(check.end,3);assert.equal(check.dir,'backward');
  assert.equal(await page.locator('#answer').count(),1);
 }
 await snap(page,'breakpoint-return');
 await context.close();
 assert.deepEqual(pageErrors,[],'Page errors');
 assert.deepEqual(network,[],'External requests (must work file:// offline)');
 writeFileSync(resolve(output,'results.json'),JSON.stringify({html,results,pageErrors,network,breakpoint:'PASS'},null,2));
 console.log('UX52 real browser checks PASS, '+results.length+' responsive layouts, no external requests');
}finally{await browser.close();}
