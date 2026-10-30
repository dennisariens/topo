const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const out=new URL('../docs/visual/map-picker-58/before/',import.meta.url);mkdirSync(out,{recursive:true});
const pinned='/private/tmp/topo-picker-before-58.html';writeFileSync(pinned,execFileSync('git',['show','bd1e57bc48e55a065cbbccb68acea196a64a187c:index.html'],{maxBuffer:32e6}));
const b=await chromium.launch();const records=[];
for(const [name,width,height]of[['desktop',1500,1000],['landscape',1180,820],['portrait',820,1180],['phone',390,844]]){
const c=await b.newContext({viewport:{width,height},hasTouch:true,offline:true}),p=await c.newPage();await p.goto('file://'+pinned);
await p.evaluate(()=>{mode('point');state.current=byId['city-9'];state.questionMode='point';state.answered=false;mapChoiceRandom=()=>.99999});
await p.locator('#pointLayer .microHit').last().press('Enter');await p.screenshot({path:new URL(name+'-rome-vatican.png',out).pathname});
const r=await p.evaluate(()=>{const s=document.querySelector('#mapPicker svg'),m=s.getScreenCTM(),a=new DOMPoint(460.97,604.61).matrixTransform(m),b=new DOMPoint(459.44,604.2).matrixTransform(m);return{distancePx:Math.hypot(a.x-b.x,a.y-b.y),viewBox:s.getAttribute('viewBox'),labels:document.querySelector('#mapPicker').textContent}});records.push({name,width,height,...r});await c.close();}
writeFileSync(new URL('results.json',out),JSON.stringify({source:'bd1e57bc48e55a065cbbccb68acea196a64a187c',transport:'file:// offline:true',browser:await b.version(),records},null,2)+'\n');await b.close();
