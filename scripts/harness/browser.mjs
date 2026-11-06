import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const WIDTHS=[1500,768,320], ENGINES=['chromium','webkit'];
export async function runBrowserChecks({root,out,modulePath=process.env.PLAYWRIGHT_MODULE}={}) {
 root=resolve(root||'.');out=resolve(out||'.harness/browser');await mkdir(out,{recursive:true});
 const result={status:'FAIL',requiredEngines:ENGINES,widths:WIDTHS,transport:'file:// offline:true',runs:[],limitations:['Development Chromium/WebKit; physical Safari not tested.','One genuine writing answer per fresh context; no full natural route playthrough.']};
 let active,timedOut=false;const timeout=setTimeout(()=>{timedOut=true;active?.close().catch(()=>{});},290000);
 try {
  const moduleFile=modulePath?(modulePath.startsWith('file:')?fileURLToPath(modulePath):resolve(modulePath)):join(root,'.harness/tooling/node_modules/playwright/index.mjs');
  const pkg=JSON.parse(await readFile(join(dirname(moduleFile),'package.json'),'utf8'));assert.equal(pkg.name,'playwright');assert.equal(pkg.version,'1.64.1','required Playwright pin');
  const api=await import(pathToFileURL(moduleFile).href);result.playwright=pkg.version;
  const artifact=join(root,'output/html/TOPO-NINO-Computer-Release.html');result.artifactSha256=createHash('sha256').update(await readFile(artifact)).digest('hex');
  for(const engine of ENGINES) {
   assert(!timedOut,'browser global timeout');
   const engineResult={engine,status:'FAIL',contexts:[]};result.runs.push(engineResult); console.log(`BROWSER ${engine}: START`);
   let browser;
   try {browser=await api[engine].launch();active=browser;engineResult.version=browser.version();
    for(const width of WIDTHS) {
     assert(!timedOut,'browser global timeout');
     const row={width,status:'FAIL',errors:[],external:[]};engineResult.contexts.push(row);
     const context=await browser.newContext({offline:true,viewport:{width,height:1100},reducedMotion:'reduce',acceptDownloads:true});
     try {
      const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>row.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')row.errors.push(m.text());});page.on('request',r=>{if(!/^(file:|data:|blob:)/.test(r.url()))row.external.push(r.url());});page.on('dialog',d=>d.accept());
      await page.goto(pathToFileURL(artifact).href);
      await page.getByRole('button',{name:'Begin zonder invullen',exact:true}).click();
      const invariants=await page.evaluate(()=>({objects:ITEMS.length,chapters:ROUTE_CHAPTERS.length,stages:TopoRoute.STAGES,codeMode:!!document.querySelector('[data-mode="codes"]'),styles:[...new Set([...document.querySelectorAll('.atlasOptions input')].map(n=>n.value))],codes:ITEMS.filter(i=>i.code!=null).length}));
      assert.equal(invariants.objects,45);assert.equal(invariants.chapters,11);assert.deepEqual(invariants.stages,['discover','point','write']);assert.equal(invariants.codeMode,false);assert(invariants.codes>0,'school codes remain reference metadata');assert.deepEqual(invariants.styles.sort(),['discovery','school']);row.invariants=invariants;
      await page.getByRole('button',{name:'Oefenen',exact:true}).click();
      // Test map styles in Discover before opening the responsive writing sheet.
      // Its intentional overlay can cover map options on narrow WebKit viewports.
      for(const style of ['school','discovery']) {const option=page.locator(`.atlasOptions input[value="${style}"]:visible`);if(!await option.isVisible())await page.locator('.atlasOptions summary:visible').click();await option.check();assert(await page.locator(`.atlasOptions input[value="${style}"]`).first().isChecked());}
      if(!await page.locator('[data-mode="write"]').isVisible())await page.locator('#focusMenu > summary').click();await page.locator('[data-mode="write"]').click();
      const input=page.locator('#answer');await input.fill('Navigatieconcept');for(let i=0;i<20;i++)await input.press('ArrowLeft');for(let i=0;i<10;i++)await input.press('ArrowRight');for(let i=0;i<7;i++)await input.press('Shift+ArrowLeft');
      const selection=()=>input.evaluate(n=>[n.selectionStart,n.selectionEnd,n.selectionDirection]);assert.deepEqual(await selection(),[3,10,'backward']);
      const snapshot=()=>page.evaluate(()=>({current:state.current,answered:state.answered,mode:state.mode,questionMode:state.questionMode,progress:progressSnapshot(),disk:Object.fromEntries(Object.entries(localStorage))}));
      const before=await snapshot();await page.getByRole('button',{name:'Reis',exact:true}).click();await page.getByRole('button',{name:'Oefenen',exact:true}).click();assert.deepEqual(await snapshot(),before);assert.equal(await input.inputValue(),'Navigatieconcept');assert.deepEqual(await selection(),[3,10,'backward']);assert(await page.locator('#quiz').isVisible());row.navigation=true;
      await page.getByRole('button',{name:'Reisboekje',exact:true}).click();const book=page.locator('#travelBook');assert(await book.isVisible());
      for(let i=0;i<24;i++) {assert.equal(await book.locator('.earned,.bookPizza,.bookFinalGold,.stampLarge').count(),0,'no unearned reward artwork');const next=book.getByRole('button',{name:'Volgende',exact:true});if(await next.isDisabled())break;assert(i<23,'bounded book page count');await next.click();}
      await book.getByRole('button',{name:'Sluit boekje',exact:true}).click();assert.deepEqual(await snapshot(),before);assert.equal(await input.inputValue(),'Navigatieconcept');assert.deepEqual(await selection(),[3,10,'backward']);row.book=true;
      const answer=await page.evaluate(()=>state.current.name);await input.fill(answer);await page.locator('#check').click();assert(await page.locator('#message').evaluate(n=>n.classList.contains('good')));
      const earned=await snapshot();assert.equal(earned.progress.good,before.progress.good+1);assert.equal(earned.progress.slices,before.progress.slices+1);assert(await page.locator('#check').isDisabled());await input.press('Enter');assert.deepEqual(await snapshot(),earned);row.genuineAnswer=true;
      const saved=earned.disk;await page.reload();assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),saved);row.reload=true;
      await page.screenshot({path:join(out,`${engine}-${width}.png`),fullPage:true});
      // Reset/backup controls are available in the desktop presentation; the
      // writing/navigation/book workflow above ran at the requested width.
      await page.setViewportSize({width:1500,height:1100});
      const downloadPromise=page.waitForEvent('download');await page.locator('#exportProgress').click();const download=await downloadPromise;const backup=join(out,`${engine}-${width}-backup.json`);await download.saveAs(backup);
      await page.getByRole('button',{name:'Oefenen',exact:true}).click();if(!await page.locator('[data-mode="write"]').isVisible())await page.locator('#focusMenu > summary').click();await page.locator('[data-mode="write"]').click();await page.locator('#resetAll').click();assert.equal(await page.evaluate(()=>state.good),0);
      await page.locator('#backupFile').setInputFiles(backup);await page.waitForFunction(()=>document.querySelector('#backupStatus').textContent.includes('teruggezet'));assert.deepEqual(await page.evaluate(()=>progressSnapshot()),earned.progress);row.transfer=true;
      assert.deepEqual(row.errors,[]);assert.deepEqual(row.external,[]);row.status='PASS';console.log(`BROWSER ${engine} ${width}: PASS`);
     } catch(error) {row.error=error.stack||String(error);throw error;} finally {await context.close();}
    } engineResult.status='PASS';
   }catch(error){engineResult.error=error.stack||String(error);console.error(`BROWSER ${engine}: FAIL ${error.message}`);}finally{await browser?.close();active=null;await writeFile(join(out,`${engine}.json`),JSON.stringify(engineResult,null,2)+'\n');}
  }
  assert(result.runs.length===2&&result.runs.every(r=>r.status==='PASS'),'all required browser engines must pass');result.status='PASS';
 }catch(error){result.error=error.stack||String(error);}finally{clearTimeout(timeout);await writeFile(join(out,'summary.json'),JSON.stringify(result,null,2)+'\n');}
 if(result.status!=='PASS')throw new Error(`Browser checks failed: ${result.error}; evidence: ${out}`);return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const args=process.argv.slice(2),options={};try {assert.equal(args.length,4,'usage: browser.mjs --root PATH --out PATH');for(let i=0;i<args.length;i+=2){assert(['--root','--out'].includes(args[i]));assert(!options[args[i].slice(2)]);options[args[i].slice(2)]=args[i+1];}await runBrowserChecks(options);}catch(e){console.error(e.stack);process.exitCode=1;}
}
