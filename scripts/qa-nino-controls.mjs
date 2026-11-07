// Owner controls round: every visible control in the regular offline app must be clickable, inside the screen, unclipped and not overlapping.
// Flows: home, Reis → Verder (with answer), Oefenen → Namen schrijven (with answer), the opened menu, Oefenen, Reisboekje; desktop, iPad portrait/landscape, phone 390/320.
// usage: PLAYWRIGHT_MODULE=… node scripts/qa-nino-controls.mjs <html> <outdir> [shots]
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const [html,out,shots]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const demo=JSON.parse(fs.readFileSync(new URL('../output/demo/NINO-2-DEMO-vlak-voor-derde-pizza.json',import.meta.url),'utf8'));
const VIEWS={desktop:[1366,768],ipadStaand:[820,1180],ipadLiggend:[1180,820],tel390:[390,844],tel320:[320,640]};
const b=await chromium.launch({channel:'chrome'});const report={};let total=0;
const scan=p=>p.evaluate(async()=>{
 const vis=n=>{const r=n.getBoundingClientRect();if(!r.width||!r.height)return false;const s=getComputedStyle(n);if(s.visibility==='hidden'||s.display==='none'||+s.opacity===0)return false;for(let a=n.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS'&&!a.open&&!(n.tagName==='SUMMARY'&&n.parentElement===a))return false;const menu=document.querySelector('#focusMenu[open]');if(menu&&!menu.contains(n))return false;const d=n.closest('dialog');if(d&&!d.open)return false;const top=document.querySelector('dialog[open]');if(top&&!top.contains(n))return false;return true};
 const name=n=>(n.id?'#'+n.id+' ':'')+'"'+(n.getAttribute('aria-label')||n.textContent||n.value||n.placeholder||'').trim().replace(/\s+/g,' ').slice(0,28)+'"';
 const ctl=[...document.querySelectorAll('button,a[href],input:not([type=hidden]):not([type=file]),select,textarea,summary')].filter(vis);
 const issues=[];
 for(const n of ctl){
  n.scrollIntoView({block:'center',inline:'nearest'});await new Promise(r=>requestAnimationFrame(r));
  const r=n.getBoundingClientRect();
  if(r.right>innerWidth+1||r.left<-1)issues.push(['offscreen',name(n),Math.round(r.left)+'..'+Math.round(r.right)]);
  const pts=[[.5,.5],[.15,.5],[.85,.5],[.5,.2],[.5,.8]].map(([x,y])=>[r.left+r.width*x,r.top+r.height*y]).filter(([x,y])=>x>0&&y>0&&x<innerWidth&&y<innerHeight);
  const blocked=pts.map(([x,y])=>document.elementFromPoint(x,y)).filter(e=>e&&!n.contains(e)&&!e.contains(n)&&!(n.labels&&[...n.labels].some(l=>l.contains(e))));
  if(blocked.length)issues.push([blocked.length>=3||!pts.length?'blocked':'partly-covered',name(n),blocked[0].tagName+'.'+String(blocked[0].className?.baseVal??blocked[0].className).slice(0,24)+(blocked[0].id?'#'+blocked[0].id:'')+' in '+(n.closest('[id]')?.id||'')]);
  if(n.matches('button,a,summary')&&(n.scrollWidth>n.clientWidth+1||n.scrollHeight>n.clientHeight+2))issues.push(['text-clipped',name(n),n.scrollWidth+'/'+n.clientWidth]);
  if(n.matches('button,summary,select,input:not([type=checkbox]):not([type=radio]),a.button')&&r.height<40&&innerWidth<1300)issues.push(['small',name(n),Math.round(r.height)+'px']);
 }
 window.scrollTo(0,0);
 const R=ctl.map(n=>[n,n.getBoundingClientRect()]).map(([n,r])=>[n,{l:r.left+scrollX,t:r.top+scrollY,r:r.right+scrollX,b:r.bottom+scrollY}]);
 for(let i=0;i<R.length;i++)for(let j=i+1;j<R.length;j++){const [a,A]=R[i],[c,C]=R[j];if(a.contains(c)||c.contains(a))continue;if(getComputedStyle(a).position==='fixed'||getComputedStyle(c).position==='fixed')continue;
  const ox=Math.min(A.r,C.r)-Math.max(A.l,C.l),oy=Math.min(A.b,C.b)-Math.max(A.t,C.t);
  if(ox>1&&oy>1)issues.push(['overlap',name(a)+' × '+name(c),Math.round(ox)+'x'+Math.round(oy)]);
  else if(ox>-6&&oy>-6&&(ox>4||oy>4))issues.push(['tight',name(a)+' × '+name(c),'gap '+Math.round(Math.max(-ox,-oy))]);}
 return issues;});
async function ctx(w,h,progress){const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:w<800?2:1,hasTouch:w<1300,isMobile:w<800});
 await c.addInitScript(pr=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s',1);localStorage.setItem('topo-nino-intro-v1','done');localStorage.setItem('topo-nino-profile-v1',JSON.stringify({schema:1,name:'Lotte',coverColor:'riviera',favoritePizza:'salami'}));if(pr)localStorage.setItem('topo-italie-v3',JSON.stringify(pr));},progress||null);
 const p=await c.newPage();p.on('pageerror',e=>console.log('PAGEERROR',e.message));await p.goto(new URL(html,'file://'+process.cwd()+'/').href);await p.waitForTimeout(1200);return {c,p};}
const btn=(p,t)=>p.getByRole('button',{name:t,exact:true}).first();
const flows={
 home:async p=>{},
 reisVerder:async p=>{await btn(p,'Reis').click();await p.locator('#routeContinue').click();await p.waitForTimeout(700);},
 reisVerderAntwoord:async p=>{await btn(p,'Reis').click();await p.locator('#routeContinue').click();await p.waitForTimeout(700);const a=p.locator('#answer');if(await a.isVisible())await a.fill('Venetië');},
 schrijven:async p=>{await btn(p,'Oefenen').click();await p.waitForTimeout(300);const m=p.locator('nav.practiceModes [data-mode="write"]');if(!await m.isVisible())await p.locator('#focusMenu>summary').click();await m.click();await p.waitForTimeout(600);},
 schrijvenAntwoord:async p=>{await btn(p,'Oefenen').click();await p.waitForTimeout(300);const m=p.locator('nav.practiceModes [data-mode="write"]');if(!await m.isVisible())await p.locator('#focusMenu>summary').click();await m.click();await p.waitForTimeout(600);await p.locator('#answer').fill('Napels');await p.locator('#check').click();await p.waitForTimeout(500);},
 menu:async p=>{await btn(p,'Oefenen').click();await p.waitForTimeout(300);if(await p.locator('#focusMenu>summary').isVisible())await p.locator('#focusMenu>summary').click();await p.waitForTimeout(300);},
 oefenmenu:async p=>{await btn(p,'Oefenen').click();await p.waitForTimeout(500);},
 reisboekje:async p=>{await btn(p,'Reisboekje').click();await p.locator('#travelBook[open]').waitFor();await p.waitForTimeout(300);}
};
for(const [vn,[w,h]] of Object.entries(VIEWS))for(const [fn,f] of Object.entries(flows)){
 const {c,p}=await ctx(w,h,demo.progress);let issues;
 try{await f(p);issues=await scan(p);}catch(e){issues=[['flow-failed',e.message.split('\n')[0]]];}
 if(shots){await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:out+'/'+vn+'-'+fn+'.png'});}
 const tag=vn+' '+fn;report[tag]=issues;total+=issues.filter(i=>i[0]!=='tight').length;await c.close();}
await b.close();
fs.writeFileSync(out+'/scan.json',JSON.stringify(report,null,1));
for(const [k,v] of Object.entries(report))if(v.length)console.log(k+'\n  '+v.map(i=>i.join(' | ')).join('\n  '));
console.log('TOTAL non-tight issues',total);
