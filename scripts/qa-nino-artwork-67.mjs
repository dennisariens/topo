import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),out=new URL('docs/qa/nino-v2-closure-67/',root);
mkdirSync(out,{recursive:true});
const before='/private/tmp/topo-67-before.html';
writeFileSync(before,execFileSync('git',['show','1bf86b3e1c69319bed8ef877243070a64d97a12e:index.html'],{cwd:root,maxBuffer:20e6}));
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
const result={role:'exporter/integrator verification; NOT independent QA',browser:await browser.version(),browserPlugin:'not available; installed Playwright fallback',runs:[],artwork:[]};
try{
 for(const [label,url] of [['before',pathToFileURL(before)],['after',new URL('output/html/TOPO-NINO-Computer-Release.html',root)]]){
  const context=await browser.newContext({offline:true,viewport:{width:1500,height:1000},reducedMotion:'reduce'}),p=await context.newPage();
  const errors=[],external=[],consoleErrors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});
  await p.goto(url.href);await p.waitForTimeout(200);
  assert((await p.title()).length>0);assert((await p.locator('body').innerText()).length>100);
  const inventory=await p.evaluate(async()=>{
   await Promise.all([...document.images].map(i=>i.decode()));
   const icons=[...document.querySelectorAll('link[rel="icon"]')].map(i=>({href:i.href,sizes:i.sizes.value}));
   const sources=[...new Set([...document.documentElement.outerHTML.matchAll(/data:image\/(?:webp|png);base64,[A-Za-z0-9+/=]+/g)].map(m=>m[0]))];
   const decoded=await Promise.all(sources.map(async src=>{const im=new Image();im.src=src;await im.decode();return [im.naturalWidth,im.naturalHeight]}));
   return {items:ITEMS.map(i=>({id:i.id,shape:i.shape,px:i.px,py:i.py})),chapters:ROUTE_CHAPTERS.map(c=>({id:c.id,itemIds:c.itemIds})),images:[...document.images].map(i=>({width:i.naturalWidth,height:i.naturalHeight,ok:i.complete&&i.naturalWidth>0})),icons,embeddedDecoded:decoded.length};
  });
  assert.equal(inventory.items.length,45);assert.equal(inventory.chapters.length,11);assert(inventory.images.every(i=>i.ok));
  if(label==='after'){
   assert.equal(inventory.icons.length,3);assert(inventory.icons.every(i=>i.href.startsWith('data:')));
   assert.deepEqual(inventory.items,result.runs[0].inventory.items);assert.deepEqual(inventory.chapters,result.runs[0].inventory.chapters);
  }
  await p.screenshot({path:new URL(label+'-desktop.png',out).pathname});
  await p.setViewportSize({width:800,height:900});await p.screenshot({path:new URL(label+'-compact.png',out).pathname});
  await p.setViewportSize({width:1500,height:1000});
  if(label==='after'){
   await p.locator('[data-mode="write"]').click();
   for(let i=0;i<24;i++){
    await p.locator('#answer').fill(await p.evaluate(()=>state.current.name));await p.locator('#check').click();
    if(i===7||i===23){
     const reward=await p.evaluate(()=>({pizzas:state.pizzas,slices:state.slices,trips:state.trips}));
     assert.deepEqual(reward,{pizzas:i===7?1:3,slices:0,trips:i===7?0:1});
     await p.screenshot({path:new URL(i===7?'one-pizza.png':'three-pizzas-one-trip.png',out).pathname});
    }
    if(i<23)await p.locator('#next').click();
   }
   const save=await p.evaluate(()=>localStorage.getItem('topo-italie-v3'));await p.reload();
   assert.deepEqual(JSON.parse(await p.evaluate(()=>localStorage.getItem('topo-italie-v3'))),JSON.parse(save));
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(consoleErrors,[]);
  result.runs.push({label,url:url.href,offline:true,sha256:createHash('sha256').update(readFileSync(url)).digest('hex'),inventory,errors,external,consoleErrors});
  await context.close();
 }
 // Asset sheet is QA only: it is not a passport, an award, or a second app.
 const manifest=JSON.parse(readFileSync(new URL('artwork-manifest.json',out)));
 const files=manifest.assets.filter(a=>a.delivery_present&&/\/exports\//.test(a.path)&&a.dimensions);
 const context=await browser.newContext({offline:true,viewport:{width:1536,height:1024}}),p=await context.newPage();
 const errors=[],external=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});
 for(const asset of files){
  await p.goto(new URL(asset.path,root).href);
  const decoded=await p.locator('img').evaluate(async im=>{await im.decode();return [im.naturalWidth,im.naturalHeight]});
  assert.deepEqual(decoded,asset.dimensions);result.artwork.push({path:asset.path,decoded});
 }
 for(const asset of manifest.assets.filter(a=>/chapter-icons\/exports\//.test(a.path)||/characters\//.test(a.path))){
  const bytes=asset.delivery_present?readFileSync(new URL(asset.path,root)):execFileSync('git',['cat-file','blob',asset.git_blob],{cwd:root,maxBuffer:20e6});
  const sourceFile='/private/tmp/topo-67-source-'+asset.git_blob+'.'+asset.format.toLowerCase();
  writeFileSync(sourceFile,bytes);await p.goto(pathToFileURL(sourceFile).href);
  const decoded=await p.locator('img').evaluate(async im=>{await im.decode();return [im.naturalWidth,im.naturalHeight]});
  assert.deepEqual(decoded,asset.dimensions);result.artwork.push({path:asset.path,gitBlob:asset.git_blob,decoded,scope:'pinned source blob; not integrated'});
 }
 for(const [name,path] of [['venezia-native','assets/nino/travel-passport/postcards/exports/postcard-04-venezia-scalloped-full.png'],['gold-chapter-native','assets/nino/travel-passport/gold/exports/gold-chapter-seal-v2-native.png'],['gold-final-native','assets/nino/travel-passport/gold/exports/gold-esploratore-doro-native.png'],['static-pisa-fallback','assets/nino/rewards/pizza/exports/pizza-box-open-pisa-margherita.webp']]){
  await p.setViewportSize({width:1600,height:1600});
  await p.goto(new URL(path,root).href);await p.locator('img').evaluate(im=>im.decode());
  const size=await p.locator('img').evaluate(im=>({natural:[im.naturalWidth,im.naturalHeight],painted:[im.getBoundingClientRect().width,im.getBoundingClientRect().height]}));
  assert.deepEqual(size.natural,size.painted);result.artwork.push({path,nativeScreenshot:name+'.png',...size});
  await p.screenshot({path:new URL(name+'.png',out).pathname});
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);result.assetErrors=errors;result.assetExternal=external;
 result.limits=['No passport component exists in PR61; raw asset decoding/captures are not earned-passport UI acceptance.','Static Pisa fallback inspected as approved file; PR61 currently uses its existing pizza wedges, not the Pisa box.','No native Safari, physical device, OS favicon cache or owner acceptance claimed.'];
 await context.close();writeFileSync(new URL('browser-results.json',out),JSON.stringify(result,null,2)+'\n');
 console.log('PASS file:// before/after, embedded and export image decoding, no external requests, 8 slices/pizza, 3 pizzas/trip, reload; independent QA pending');
}finally{await browser.close()}
