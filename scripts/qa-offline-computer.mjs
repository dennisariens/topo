import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const file=new URL(process.env.TOPO_OFFLINE_FILE||'../output/html/TOPO-Italie-Computer.html',import.meta.url);
const out=new URL('../docs/visual/offline-computer/',import.meta.url);mkdirSync(out,{recursive:true});
const browser=await chromium.launch();const context=await browser.newContext({offline:true,viewport:{width:1500,height:1000}});
const page=await context.newPage(),errors=[],external=[],consoleErrors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});page.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});page.on('dialog',d=>d.accept());
try {
 await page.goto(file.href);await page.waitForTimeout(250);
 const inventory=await page.evaluate(()=>({items:ITEMS.length,chapters:ROUTE_CHAPTERS.map(c=>({id:c.id,items:c.itemIds})),images:[...document.images].map(i=>({ok:i.complete&&i.naturalWidth>0,src:i.src.slice(0,35)}))}));
 assert.equal(inventory.items,45);assert.equal(inventory.chapters.length,11);assert.equal(new Set(inventory.chapters.flatMap(c=>c.items)).size,45);assert.equal(inventory.chapters.reduce((n,c)=>n+c.items.length,0),45);assert(inventory.images.every(i=>i.ok));
 await page.locator('[data-mode="learn"]').click();await page.locator('[data-mode="write"]').click();
 await page.fill('#answer','zeker fout');await page.locator('#check').click();assert.equal(await page.evaluate(()=>state.good),0);
 await page.locator('#next').click();await page.fill('#answer',await page.evaluate(()=>state.current.name));await page.locator('#check').click();assert.equal(await page.evaluate(()=>state.good),1);
 const saved=await page.evaluate(()=>localStorage.getItem('topo-italie-v3'));assert(saved);await page.reload();assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('topo-italie-v3'))),JSON.parse(saved));assert.equal(await page.evaluate(()=>state.good),1);
 await page.locator('[data-mode="write"]').click();
 for(const selector of await page.locator('#resetPizza').evaluate(n=>{const a=[];for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')a.unshift(p.id?'#'+p.id:'details:has(#resetPizza)');return a})) {const d=page.locator(selector).first();if(!await d.evaluate(n=>n.open))await d.locator(':scope > summary').click();}
 await page.locator('#resetPizza').click();assert.equal(await page.evaluate(()=>state.pizzas+state.slices+state.trips),0);
 await page.locator('#resetAll').click();assert.equal(await page.evaluate(()=>state.good),0);
 await page.screenshot({path:new URL('desktop-file-offline.png',out).pathname});
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(consoleErrors,[]);
 const bytes=readFileSync(file);writeFileSync(new URL('desktop-results.json',out),JSON.stringify({platform:process.platform,browser:await browser.version(),file:file.href,transport:'file://',offline:true,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),inventory,correctWrongGrading:true,persistedAcrossReload:true,resets:true,errors,consoleErrors,external,physicalIPad:'not tested'},null,2)+'\n');
 console.log('Desktop local file offline: inventory/assets/grading/reload/pizza reset/full reset PASS');
}finally{await browser.close()}
