import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const url=process.env.TOPO_DOWNLOAD_URL;assert(url,'TOPO_DOWNLOAD_URL is required');
const root=new URL('../',import.meta.url),source=readFileSync(new URL('output/html/TOPO-NINO-Computer-Release.html',root));
const sha=b=>createHash('sha256').update(b).digest('hex'),dir=process.env.QA_DOWNLOAD_DIR||'/private/tmp/topo-nino-computer-download';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
try{
 const online=await browser.newContext({acceptDownloads:true}),p=await online.newPage();
 const waiting=p.waitForEvent('download');await p.goto(url).catch(e=>{if(!e.message.includes('Download is starting'))throw e});
 const download=await waiting;assert.equal(download.suggestedFilename(),'TOPO-NINO-Computer-Release.html');
 const path=dir+'/'+download.suggestedFilename();await download.saveAs(path);const bytes=readFileSync(path);assert(bytes.equals(source),'downloaded release bytes equal committed candidate artifact');await online.close();
 const offline=await browser.newContext({offline:true,viewport:{width:1500,height:1000}}),page=await offline.newPage(),errors=[],consoleErrors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});page.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});
 await page.goto(pathToFileURL(path).href);assert.equal(await page.evaluate(()=>ITEMS.length),45);assert.equal(await page.evaluate(()=>ROUTE_CHAPTERS.length),11);
 await page.locator('[data-mode="write"]').click();await page.locator('#answer').fill(await page.evaluate(()=>state.current.name));await page.locator('#check').click();assert(await page.locator('#message').evaluate(n=>n.classList.contains('good')));
 await page.locator('[data-mode="point"]').click();await page.evaluate(()=>{state.current=byId['area-o'];state.questionMode='point';state.answered=false;clearActive()});
 await page.locator('#pointLayer .microHit').last().press('Enter');assert(await page.locator('#mapPicker').evaluate(n=>n.open));await page.locator('[data-map-choice="area-o"]').click();assert(await page.locator('#message').evaluate(n=>n.classList.contains('good')));
 await page.screenshot({path:dir+'/downloaded-offline.png',fullPage:true});
 assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);assert.deepEqual(external,[]);
 writeFileSync(dir+'/verification.json',JSON.stringify({url,filename:download.suggestedFilename(),bytes:bytes.length,sha256:sha(bytes),browser:await browser.version(),file:pathToFileURL(path).href,offline:true,writingCorrect:true,vaticanChooserCorrect:true,errors,consoleErrors,external},null,2)+'\n');
 console.log('PASS actual browser release download, byte equality, offline file startup, writing and Vatican grading');await offline.close();
}finally{await browser.close()}
