// TOPO V3 owner preview: the V2.0.2 app (index.html, unchanged) + the V3 layers (Reis, les) + labelled demo states.
// Demo states live in memory only; the real browser storage is never read or written.
// index.html itself never contains V3 or preview code.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const html=read('index.html');
if(html.includes('NINO_DESIGN_PREVIEW')||html.includes('TOPO_V3'))throw Error('index.html must not contain preview or V3 code');
const states=`(function(){
 'use strict';
 const IDS=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','countries','seas','rivers'];
 const at=Date.UTC(2026,10,6,14,36);
 const ch=(spec)=>Object.fromEntries(IDS.map((id,i)=>{const s=spec[i]||{};return [id,{stage:s.stage||0,completedAt:s.stage===3?at:0,goldAt:s.gold?at:0,nextReviewAt:s.due?at:0,reviews:0}];}));
 const make=(title,spec,r)=>({title,progress:{schema:3,good:r.good||0,pizzas:r.pizzas||0,slices:r.slices||0,trips:r.trips||0,mistakes:[],route:{schema:2,chapters:ch(spec),items:{},rewardTokens:[],active:null},daily:{date:'2026-11-09',correct:0}},profile:{schema:1,name:'Demo',coverColor:'riviera',favoritePizza:'margherita'}});
 const S={
  'nieuw':make('Nieuw profiel',[],{}),
  'bezig':make('Halte bezig',[{stage:3},{stage:1}],{good:14,pizzas:1,slices:6}),
  'afgerond':make('Haltes afgerond',[{stage:3,gold:1,due:1},{stage:3,gold:1},{stage:3},{stage:3}],{good:61,pizzas:7,slices:3,trips:2}),
  'alles':make('Alles af',IDS.map(()=>({stage:3,gold:1})),{good:168,pizzas:21,trips:7})
 };
 const [raw0,theme]=location.hash.slice(1).split('/'),raw=raw0||'',side=raw.startsWith('naast-'),key=side?raw.slice(6):raw,chosen=S[key]||S.bezig,th=theme==='viola'?'viola':'italia';
 window.TOPO_V3_THEME=th;const tail=th==='viola'?'/viola':'';
 // Side-by-side: stop loading this copy and show two live frames of the same file (desktop and phone).
 if(side){
  window.stop();addEventListener('hashchange',()=>location.reload());
  const page=location.href.split('#')[0],k=S[key]?key:'bezig';
  const links=Object.entries(S).map(([id,s])=>'<a href="#naast-'+id+tail+'"'+(id===k?' aria-current="page"':'')+'>'+s.title+'</a>').join('');
  document.documentElement.innerHTML='<head><meta charset="utf-8"><title>V3-preview · naast elkaar</title><style>body{margin:0;background:#e9e3d6;font:600 13px/1.2 -apple-system,system-ui,sans-serif;color:#073f3b}nav{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#073f3b;color:#f8f3e8;flex-wrap:wrap}nav a{color:#f8f3e8;text-decoration:none;padding:9px 12px;border-radius:9px;box-shadow:inset 0 0 0 1px #f8f3e855}nav a[aria-current]{background:#f8f3e8;color:#073f3b}main{display:flex;gap:32px;align-items:flex-start;justify-content:center;padding:24px}figure{margin:0;display:grid;gap:8px}.d{width:1024px;height:640px;overflow:hidden;border-radius:12px;box-shadow:0 8px 30px #0003;background:#fff}.d iframe{width:1440px;height:900px;border:0;transform:scale(.7111);transform-origin:0 0}.p iframe{width:390px;height:844px;border:0;border-radius:28px;box-shadow:0 8px 30px #0003;background:#fff}</style></head><body><nav><strong>V3-preview · naast elkaar · demo</strong>'+links+'<a href="#'+k+'">Alleen deze stand openen</a></nav><main><figure class="d"><iframe title="Desktop 1440×900" src="'+page+'#'+k+tail+'"></iframe></figure><figure class="p"><iframe title="Telefoon 390×844" src="'+page+'#'+k+tail+'"></iframe></figure></main></body>';
  return;
 }
 const entries=new Map([['topo-italie-v3',JSON.stringify(chosen.progress)],['topo-nino-profile-v1',JSON.stringify(chosen.profile)],['topo-nino-intro-v1','done']]);
 const memory={get length(){return entries.size},key:i=>[...entries.keys()][i]??null,getItem:k=>entries.has(String(k))?entries.get(String(k)):null,setItem:(k,v)=>{entries.set(String(k),String(v))},removeItem:k=>{entries.delete(String(k))},clear:()=>entries.clear()};
 Object.defineProperty(window,'localStorage',{configurable:true,value:memory});
 window.TOPO_V3_PREVIEW={state:S[key]?key:'bezig',storage:entries};
 addEventListener('hashchange',()=>location.reload());
 addEventListener('DOMContentLoaded',()=>{
  const bar=document.createElement('nav');bar.className='v3PreviewBar';bar.setAttribute('aria-label','Demostanden');
  const label=document.createElement('strong');label.textContent='V3-preview · demo · niets wordt bewaard';bar.append(label);
  for(const [id,s] of Object.entries(S)){const a=document.createElement('a');a.href='#'+id+tail;a.textContent=s.title;if(s===chosen)a.setAttribute('aria-current','page');bar.append(a);}
  for(const t of ['italia','viola']){const a=document.createElement('a');a.href='#'+(S[key]?key:'bezig')+(t==='viola'?'/viola':'');a.textContent=t==='viola'?'Viola':'Italia';if(t===th)a.setAttribute('aria-current','page');a.className='v3Theme';bar.append(a);}
  const side=document.createElement('a');side.href='#naast-'+(S[key]?key:'bezig')+tail;side.textContent='Naast elkaar: desktop + telefoon';bar.append(side);
  if(window.top!==window)bar.hidden=true;
  document.body.prepend(bar);
 });
})();`;
const barCss='.v3PreviewBar[hidden]{display:none!important}.v3PreviewBar{display:flex;align-items:center;gap:8px;padding:8px 12px;overflow-x:auto;white-space:nowrap;background:#073f3b;color:#f8f3e8;font:600 13px/1.2 -apple-system,system-ui,sans-serif}.v3PreviewBar strong{margin-right:4px}.v3PreviewBar a{display:inline-flex;align-items:center;min-height:36px;padding:0 12px;border-radius:9px;color:#f8f3e8;text-decoration:none;box-shadow:inset 0 0 0 1px #f8f3e855}.v3PreviewBar a[aria-current]{background:#f8f3e8;color:#073f3b}@media print{.v3PreviewBar{display:none}}.v3PreviewBar .v3Theme{margin-left:auto}.v3PreviewBar .v3Theme+.v3Theme{margin-left:0}body:has(.v3PreviewBar:not([hidden])) :is(.v3Reis,.v3LesSideWrap){--v3-bar:52px}body:has(.v3PreviewBar:not([hidden])).v3Les{--v3-bar:52px}body.v3Home .v3PreviewBar{position:static!important}body.v3Home{padding-bottom:0!important}body[data-focus-shell=true] .v3PreviewBar{position:fixed;left:0;right:0;bottom:0;z-index:70;padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}body[data-focus-shell=true]:has(.v3PreviewBar:not([hidden])){padding-bottom:64px}body[data-focus-mode=true] .v3PreviewBar{display:none}';
const css=read('scripts/v3/tokens.css')+read('scripts/v3/reis.css')+read('scripts/v3/les.css')+barCss;
const head='<head>\n<script>\n'+states+'\n</script>\n<style>/* BEGIN TOPO V3 */'+css+'/* END TOPO V3 */</style>';
const last=html.lastIndexOf('</body>');if(last<0||html.indexOf('<head>')<0)throw Error('Unexpected index.html shape');
let out=html.replace('<head>',()=>head);
const end=out.lastIndexOf('</body>');
out=out.slice(0,end)+'<script>\n// BEGIN TOPO V3\n'+read('scripts/v3/reis.js')+'\n'+read('scripts/v3/les.js')+'\n// END TOPO V3\n</script>\n'+out.slice(end);
out=out.replace(/<title>([^<]*)<\/title>/,(m,t)=>'<title>V3-preview Reis · '+t+'</title>');
const file='output/html/TOPO-V3-Reis-Preview.html';
writeFileSync(new URL(file,root),out);
const sha=s=>createHash('sha256').update(s).digest('hex');
console.log(file+'\n  sha256 '+sha(out)+'\n  base index.html sha256 '+sha(html));
