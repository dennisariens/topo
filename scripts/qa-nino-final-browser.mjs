const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const out=resolve('docs/qa/nino-artwork-final');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];
try {
  for(const viewport of [{width:1500,height:1000},{width:820,height:1180}]){
    for(const reducedMotion of ['no-preference','reduce']){
      const context=await browser.newContext({viewport,reducedMotion,offline:true});
      const page=await context.newPage();const errors=[],external=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
      page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url())});
      await page.goto(pathToFileURL(resolve('assets/nino/rewards/pizza/hinge-review/review.html')).href);
      await page.locator('h1').waitFor();
      await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()))});
      const visible=await page.locator(reducedMotion==='reduce'?'.static':'.motion').count();
      await page.getByRole('button',{name:'Speel Margherita opnieuw'}).focus();
      const before=await page.locator('.motion').first().getAttribute('src');
      await page.keyboard.press('Enter');
      const after=await page.locator('.motion').first().getAttribute('src');
      await page.waitForTimeout(1500);
      const state=await page.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),decoded:i.complete&&i.naturalWidth>0,visible:getComputedStyle(i).display!=='none'}))}));
      const screenshot=`pisa-${viewport.width}-${reducedMotion}.png`;
      await page.screenshot({path:resolve(out,screenshot),fullPage:true});
      if(errors.length||external.length||state.overflow||visible!==3||before===after||state.images.some(i=>!i.decoded))throw Error(JSON.stringify({errors,external,state}));
      if(reducedMotion==='reduce'&&state.images.some(i=>i.src.startsWith('motion/')&&i.visible))throw Error('Motion visible under reduced motion');
      results.push({viewport,reducedMotion,errors,external,state,keyboardReplay:true,screenshot});
      await context.close();
    }
  }
}finally{await browser.close()}
await writeFile(resolve(out,'browser-qa.json'),JSON.stringify({browserPlugin:'Absent; installed Playwright fallback',flow:'file preview → all flavors decode → keyboard replay → static reduced-motion fallback',results},null,2)+'\n');
console.log('PASS offline preview, desktop/iPad viewports, keyboard replay and reduced motion');
