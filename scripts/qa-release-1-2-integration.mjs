import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdirSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {source, lakePath} from './geography/lakes.mjs';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const root = new URL('../',import.meta.url), output = new URL('docs/visual/release-1-2-integration/',root);
mkdirSync(output,{recursive:true});
const errors = [], network = [], checks = [];
const normalized = value => {const copy=structuredClone(value);copy.route.rewardTokens.sort();return copy;};
try {
  for (const [file,width,height] of [['output/html/topo-italie-interactief.html',390,844],['output/html/topo-italie-duolingo.html',320,568],['dist/index.html',1440,1000]]) {
    const ctx=await browser.newContext({offline:true,viewport:{width,height},reducedMotion:'reduce',acceptDownloads:true});
    const p=await ctx.newPage();
    p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!/^(file:|data:|blob:)/.test(r.url()))network.push(r.url());});p.on('dialog',d=>d.accept());
    await p.goto(new URL(file,root).href);
    const images=await p.evaluate(async()=>{const out=[];for(const [role,a] of Object.entries(TOPO_NINO_ART_DATA.assets)){const i=new Image();i.src=a.src;await i.decode();out.push({role,width:i.naturalWidth,height:i.naturalHeight});}return out;});
    assert.equal(images.length,6);
    assert.deepEqual(await p.locator('#lakeGeometry path').evaluateAll(ns=>ns.map(n=>[n.dataset.lake,n.getAttribute('d')])),source.features.map(f=>[f.id,lakePath(f)]));
    assert.equal(await p.locator('#welcomeArt').getAttribute('data-art-role'),'welcome');
    await p.locator('#routeContinue').press('Enter');
    assert.equal(await p.locator('#lessonArt').getAttribute('data-art-role'),'guide');
    const next=p.locator(width<=950?'#routeDockNext':'#next');
    for(let i=0;i<6;i++)await next.click();
    await p.locator('#finishScreen .button').first().click();
    const target=await p.evaluate(()=>state.current.id);
    await p.locator(`[data-id="${target}"][tabindex="0"]`).first().press('Enter');
    assert.equal(await p.evaluate(()=>state.route.active.lastAnswer.ok),true);
    const snapshot=await p.evaluate(()=>progressSnapshot());
    const downloading=p.waitForEvent('download');await p.locator('#exportProgress').click();const download=await downloading;
    const backupPath=join(mkdtempSync(join(tmpdir(),'topo-combined-backup-')),'progress.json');await download.saveAs(backupPath);
    const backup=JSON.parse(readFileSync(backupPath));assert.deepEqual(normalized(backup.progress),normalized(snapshot));
    await p.locator('[data-mode="point"]').click();await p.locator('#resetAll').click();assert.equal(await p.evaluate(()=>state.good),0);
    await p.locator('#backupFile').setInputFiles(backupPath);
    await p.waitForFunction(()=>document.querySelector('#backupStatus').textContent.includes('Je voortgang is teruggezet'));
    assert.deepEqual(normalized(await p.evaluate(()=>progressSnapshot())),normalized(snapshot));
    await p.reload();await p.locator('#routeContinue').click();
    assert.deepEqual(normalized(await p.evaluate(()=>progressSnapshot())),normalized(snapshot));
    assert.equal(await p.locator('#areaLayer use[data-context-layer="lakes"]').count(),1);
    await p.screenshot({path:new URL(`offline-${width}-restored.png`,output).pathname,fullPage:true});
    // Neutral keyboard modal on the combined map. This fixture only selects an
    // existing task; grading still goes through the actual numbered UI button.
    await p.evaluate(()=>{mode('point');state.current=byId['area-o'];state.answered=false;state.questionMode='point';highlight(state.current);});
    await p.getByRole('button',{name:'Kies Rome of Vaticaanstad',exact:true}).press('Enter');
    assert(await p.locator('#mapPicker').isVisible());assert(!/Rome|Vaticaan/.test(await p.locator('#mapPicker').textContent()));
    assert.equal(await p.locator('#mapPicker use[data-context-layer="lakes"]').count(),1);
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await p.screenshot({path:new URL(`offline-${width}-keyboard-picker.png`,output).pathname,fullPage:true});
    await p.locator('#mapPicker .pickerActions button').nth(1).press('Enter');
    assert(await p.locator('#message').evaluate(n=>n.classList.contains('good')));
    checks.push({file,width,height,images,lakes:6,backup:'actual download → reset → file restore → reload: exact progress',keyboardPicker:'neutral, real answer graded',offline:true});
    await ctx.close();
  }
  assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
  writeFileSync(new URL('combined-offline.json',output),JSON.stringify({browser:await browser.version(),checks,errors,externalRequests:network},null,2)+'\n');
  console.log('Combined offline: both downloads + dist, six decoded images + six lakes, real backup round-trip and keyboard picker: PASS');
} finally {await browser.close();}
