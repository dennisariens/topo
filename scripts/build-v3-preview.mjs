// TOPO V3 owner preview: the V2.0.2 app (index.html, unchanged) + the V3 layers (Reis, les) + labelled demo states.
// Demo states live in memory only; the real browser storage is never read or written.
// index.html itself never contains V3 or preview code.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {project} from './geography/lakes.mjs';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const html=read('index.html');
if(html.includes('NINO_DESIGN_PREVIEW')||html.includes('TOPO_V3'))throw Error('index.html must not contain preview or V3 code');
// Demo skill history per place (V3.0 Voortgang reads the V2 kennis-paspoort): the item ids per chapter come from
// index.html (ITEMS, GROUPS) with the V2 chapter rule; completed chapters read "Goed onthouden", started ones "Op weg".
const canonicalItems=JSON.parse(html.match(/const ITEMS=(\[[\s\S]*?\]);/)[1]);
const CHAPTER_ITEMS=(()=>{const items=canonicalItems,groups=eval('('+html.match(/const GROUPS=(\{[\s\S]*?\});/)[1]+')');
 const ids=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','countries','seas','rivers'];
 return Object.fromEntries(ids.map(id=>[id,items.filter(i=>id.startsWith('city')?i.kind==='city'&&Number(i.code)>(Number(id.slice(-1))-1)*6&&Number(i.code)<=Number(id.slice(-1))*6:(groups[id]||[]).includes(i.id)).map(i=>i.id)]));})();
const states=`(function(){
 'use strict';
 const IDS=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','countries','seas','rivers'];
 const at=Date.UTC(2026,10,6,14,36);
 const ch=(spec)=>Object.fromEntries(IDS.map((id,i)=>{const s=spec[i]||{};return [id,{stage:s.stage||0,completedAt:s.stage===3?at:0,goldAt:s.gold?at:0,nextReviewAt:s.due?at:0,reviews:0}];}));
 const CI=${JSON.stringify(CHAPTER_ITEMS)},later=Date.UTC(2030,0,1),sk=(streak)=>({correct:streak,wrong:0,streak,lastSeen:at,due:later});
 const its=(spec)=>{const out={};IDS.forEach((id,i)=>{const st=spec[i]?.stage||0;if(!st)return;for(const it of CI[id])out[it]={correct:st===3?6:1,wrong:0,streak:st===3?3:1,lastSeen:at,lastWrong:0,skills:st===3?{point:sk(3),write:sk(3)}:{point:sk(1)}};});return out;};
 const make=(title,spec,r)=>({title,progress:{schema:3,good:r.good||0,pizzas:r.pizzas||0,slices:r.slices||0,trips:r.trips||0,mistakes:[],route:{schema:2,chapters:ch(spec),items:its(spec),rewardTokens:[],active:null},daily:{date:'2026-11-09',correct:0}},profile:{schema:1,name:'Demo',coverColor:'riviera',favoritePizza:'margherita'}});
 const S={
  'welkom':{...make('Kennismaking',[],{}),profile:null,intro:null},
  'nieuw':make('Nieuw profiel',[],{}),
  'bezig':make('Halte bezig',[{stage:3},{stage:1}],{good:14,pizzas:1,slices:6}),
  'afgerond':make('Haltes afgerond',[{stage:3,gold:1,due:1},{stage:3,gold:1},{stage:3},{stage:3}],{good:61,pizzas:7,slices:3,trips:2}),
  'alles':make('Alles af',IDS.map(()=>({stage:3,gold:1})),{good:168,pizzas:21,trips:7})
 };
 const [raw0,...opts]=location.hash.slice(1).split('/'),theme=opts.includes('italia')?'italia':'viola',bgKey=opts.find(o=>/^bg0[123]$/.test(o))||'bg03',raw1=raw0||'',pair=/^thema-(ipad-)?/.exec(raw1),raw=pair?raw1.slice(pair[0].length):raw1,side=raw.startsWith('naast-'),key=side?raw.slice(6):raw,chosen=S[key]||S.bezig,th=theme==='viola'?'viola':'italia';
 window.TOPO_V3_THEME=th;window.TOPO_V3_BG=bgKey;const tail=(th==='italia'?'/italia':'')+(bgKey!=='bg03'?'/'+bgKey:'');
 // Theme pair (stijlbeeld): Italia and Viola side by side, desktop 1440×900 or iPad landscape 1180×820, two live frames.
 if(pair){
  window.stop();document.documentElement.classList.remove('v3Boot');addEventListener('hashchange',()=>location.reload());
  const page=location.href.split('#')[0],k=S[key]?key:'bezig',ipad=!!pair[1],w=ipad?1180:1440,h=ipad?820:900,sc=ipad?.57:.465;
  const links=Object.entries(S).map(([id,s])=>'<a href="#'+pair[0]+id+'"'+(id===k?' aria-current="page"':'')+'>'+s.title+'</a>').join('')+'<a href="#thema-'+k+'"'+(ipad?'':' aria-current="page"')+'>Desktop</a><a href="#thema-ipad-'+k+'"'+(ipad?' aria-current="page"':'')+'>iPad liggend</a>';
  const fr=t=>'<figure><figcaption>'+t[0].toUpperCase()+t.slice(1)+'</figcaption><div class="f" style="width:'+Math.round(w*sc)+'px;height:'+Math.round(h*sc)+'px"><iframe title="'+t+'" style="width:'+w+'px;height:'+h+'px;transform:scale('+sc+')" src="'+page+'#'+k+(t==='italia'?'/italia':'')+'"></iframe></div></figure>';
  document.documentElement.innerHTML='<head><meta charset="utf-8"><title>V3-preview · Italia en Viola</title><style>body{margin:0;background:#e9e3d6;font:600 13px/1.2 -apple-system,system-ui,sans-serif;color:#073f3b}nav{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#073f3b;color:#f8f3e8;flex-wrap:wrap}nav a{color:#f8f3e8;text-decoration:none;padding:9px 12px;border-radius:9px;box-shadow:inset 0 0 0 1px #f8f3e855}nav a[aria-current]{background:#f8f3e8;color:#073f3b}main{display:flex;gap:24px;justify-content:center;padding:24px;flex-wrap:wrap}figure{margin:0;display:grid;gap:8px}figcaption{font-size:15px}.f{overflow:hidden;border-radius:12px;box-shadow:0 8px 30px #0003}.f iframe{border:0;transform-origin:0 0}</style></head><body><nav><strong>V3-preview · Italia en Viola · demo</strong>'+links+'</nav><main>'+fr('italia')+fr('viola')+'</main></body>';
  return;
 }
 // Side-by-side: stop loading this copy and show two live frames of the same file (desktop and phone).
 if(side){
  window.stop();document.documentElement.classList.remove('v3Boot');addEventListener('hashchange',()=>location.reload());
  const page=location.href.split('#')[0],k=S[key]?key:'bezig';
  const links=Object.entries(S).map(([id,s])=>'<a href="#naast-'+id+tail+'"'+(id===k?' aria-current="page"':'')+'>'+s.title+'</a>').join('');
  document.documentElement.innerHTML='<head><meta charset="utf-8"><title>V3-preview · naast elkaar</title><style>body{margin:0;background:#e9e3d6;font:600 13px/1.2 -apple-system,system-ui,sans-serif;color:#073f3b}nav{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#073f3b;color:#f8f3e8;flex-wrap:wrap}nav a{color:#f8f3e8;text-decoration:none;padding:9px 12px;border-radius:9px;box-shadow:inset 0 0 0 1px #f8f3e855}nav a[aria-current]{background:#f8f3e8;color:#073f3b}main{display:flex;gap:32px;align-items:flex-start;justify-content:center;padding:24px}figure{margin:0;display:grid;gap:8px}.d{width:1024px;height:640px;overflow:hidden;border-radius:12px;box-shadow:0 8px 30px #0003;background:#fff}.d iframe{width:1440px;height:900px;border:0;transform:scale(.7111);transform-origin:0 0}.p iframe{width:390px;height:844px;border:0;border-radius:28px;box-shadow:0 8px 30px #0003;background:#fff}</style></head><body><nav><strong>V3-preview · naast elkaar · demo</strong>'+links+'<a href="#'+k+'">Alleen deze stand openen</a></nav><main><figure class="d"><iframe title="Desktop 1440×900" src="'+page+'#'+k+tail+'"></iframe></figure><figure class="p"><iframe title="Telefoon 390×844" src="'+page+'#'+k+tail+'"></iframe></figure></main></body>';
  return;
 }
 // #welkom: a first visit (no profile, no introduction yet), so V2 opens the kennismaking.
const entries=new Map([['topo-italie-v3',JSON.stringify(chosen.progress)],...(chosen.profile?[['topo-nino-profile-v1',JSON.stringify(chosen.profile)]]:[]),...(chosen.intro===null?[]:[['topo-nino-intro-v1','done']])]);
 const memory={get length(){return entries.size},key:i=>[...entries.keys()][i]??null,getItem:k=>entries.has(String(k))?entries.get(String(k)):null,setItem:(k,v)=>{entries.set(String(k),String(v))},removeItem:k=>{entries.delete(String(k))},clear:()=>entries.clear()};
 Object.defineProperty(window,'localStorage',{configurable:true,value:memory});
 window.TOPO_V3_PREVIEW={state:S[key]?key:'bezig',storage:entries};
 addEventListener('hashchange',()=>location.reload());
 addEventListener('DOMContentLoaded',()=>{
  const bar=document.createElement('nav');bar.className='v3PreviewBar';bar.setAttribute('aria-label','Demostanden');
  const label=document.createElement('strong');label.textContent='V3-preview · demo · niets wordt bewaard';bar.append(label);
  for(const [id,s] of Object.entries(S)){const a=document.createElement('a');a.href='#'+id+tail;a.textContent=s.title;if(s===chosen)a.setAttribute('aria-current','page');bar.append(a);}
  for(const t of ['italia','viola']){const a=document.createElement('a');a.href='#'+(S[key]?key:'bezig')+(t==='italia'?'/italia':'')+(bgKey!=='bg03'?'/'+bgKey:'');a.textContent=t==='viola'?'Viola':'Italia';if(t===th)a.setAttribute('aria-current','page');a.className='v3Theme';bar.append(a);}
  // Background (render assets): BG-03 standard, BG-01 and BG-02 as alternatives.
  for(const [k,label] of [['bg01','BG-01 Toscane'],['bg02','BG-02 Meer'],['bg03','BG-03 Kust']]){const a=document.createElement('a');a.href='#'+(S[key]?key:'bezig')+(th==='italia'?'/italia':'')+(k!=='bg03'?'/'+k:'');a.textContent=label;if(k===bgKey)a.setAttribute('aria-current','page');a.className='v3Bg';bar.append(a);}
  const side=document.createElement('a');side.href='#naast-'+(S[key]?key:'bezig')+tail;side.textContent='Naast elkaar: desktop + telefoon';bar.append(side);
  const pairA=document.createElement('a');pairA.href='#thema-'+(S[key]?key:'bezig');pairA.textContent='Italia + Viola';bar.append(pairA);
  if(window.top!==window)bar.hidden=true;
  document.body.prepend(bar);
 });
})();`;
const barCss='.v3PreviewBar[hidden]{display:none!important}.v3PreviewBar{display:flex;align-items:center;gap:8px;padding:8px 12px;overflow-x:auto;white-space:nowrap;background:#073f3b;color:#f8f3e8;font:600 13px/1.2 -apple-system,system-ui,sans-serif}.v3PreviewBar strong{margin-right:4px}.v3PreviewBar a{display:inline-flex;align-items:center;min-height:36px;padding:0 12px;border-radius:9px;color:#f8f3e8;text-decoration:none;box-shadow:inset 0 0 0 1px #f8f3e855}.v3PreviewBar a[aria-current]{background:#f8f3e8;color:#073f3b}@media print{.v3PreviewBar{display:none}}.v3PreviewBar .v3Theme{margin-left:auto}.v3PreviewBar .v3Theme+.v3Theme{margin-left:0}body:has(.v3PreviewBar:not([hidden])) :is(.v3Reis,.v3ShellNav){--v3-bar:52px}body:has(.v3PreviewBar:not([hidden])).v3Les{--v3-bar:52px}body.v3Home .v3PreviewBar{position:relative!important;z-index:2}body.v3Home{padding-bottom:0!important}body[data-focus-shell=true] .v3PreviewBar{position:fixed;left:0;right:0;bottom:0;z-index:70;padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}body[data-focus-shell=true]:has(.v3PreviewBar:not([hidden])){padding-bottom:64px}body[data-focus-mode=true] .v3PreviewBar{display:none}';
// Chapter miniatures (stijlbeeld): from assets/v3/scenes/manifest.json, checked against their SHA256, embedded as data URIs.
const uri=(e,what)=>{const b=readFileSync(new URL(e.path,root));if(createHash('sha256').update(b).digest('hex')!==e.sha256)throw Error(what+' differs from manifest: '+e.path);return 'data:image/webp;base64,'+b.toString('base64');};
// #75 scenes: miniature and full scene as chapter header (assets/v3/scenes/manifest.json).
const sceneManifest=JSON.parse(read('assets/v3/scenes/manifest.json')),scenes={};
for(const [id,e] of Object.entries(sceneManifest.chapters))scenes[id]={mini:uri(e.mini,'Scene miniature'),kop:uri(e.scene,'Scene')};
// V3 render assets (art/v3-render-assets @ 908b4a4, assets/v3/render/manifest.json): exports only, byte-checked.
const render=JSON.parse(read('assets/v3/render/manifest.json')),A=Object.fromEntries(render.assets.map(a=>[a.id,a]));
for(const id of ['SCENE-ROMA','SCENE-VENEZIA','SCENE-NAPOLI'])scenes[A[id].chapter]={mini:uri(A[id].export_mini,id),kop:uri(A[id].export_kop,id)};
const v3art={bg:{bg01:uri(A['BG-01'].export,'BG-01'),bg02:uri(A['BG-02'].export,'BG-02'),bg03:uri(A['BG-03'].export,'BG-03')},portrait:uri(A['NINO-PORTRET'].export,'NINO-PORTRET'),poses:Object.fromEntries(render.assets.filter(a=>a.universalMaster && !['NINO-PASPOORT','VESPA-ZIJ','VESPA-ICOON','NINO-DENKT','NINO-WIJST-RECHTS'].includes(a.id)).map(a=>[a.id,{src:uri(a.export,a.id),size:a.export.size}])),vespa:uri(A['VESPA-ZIJ'].export,'VESPA-ZIJ'),
 icons:Object.fromEntries(['slice','pizza','vespa','gold','stamp','postcard'].map(k=>[k,k==='vespa'?uri(A['VESPA-ICOON'].export,'VESPA-ICOON'):uri(A['IC-'+k].exports['96'],'IC-'+k)]))};
const landmarks=JSON.parse(read('assets/v3/landmarks/manifest.json'));
const activeLandmarks=landmarks.items.filter(a=>a.ui);
if(activeLandmarks.map(a=>a.id).join(',')!==Array.from({length:10},(_,i)=>'TOPO_'+String(i+1).padStart(2,'0')).join(','))throw Error('Expected only TOPO_01–10 in UI');
v3art.landmarks={source:landmarks.source,items:activeLandmarks.map(a=>{
 const item=a.location.canonicalItemId&&canonicalItems.find(i=>i.id===a.location.canonicalItemId);
 const coordinates=item?[item.lon,item.lat]:a.location.coordinates;
 if(!coordinates?.every(Number.isFinite))throw Error('Missing geographic point: '+a.id);
 return {id:a.id,label:a.label,paintSize:a.paintSize,coordinates,point:project(coordinates),exports:Object.fromEntries(Object.entries(a.exports).map(([size,e])=>[size,{...e,src:uri(e,a.id+' '+size)}]))};
})};
if(Object.keys(scenes).length!==11)throw Error('Expected 11 chapter scenes, found '+Object.keys(scenes).length);
// Relief z8 render layers (v3/relief-z8 @ 2a7b0cf), checked against their provenance SHA256, embedded as data URIs.
const prov=JSON.parse(read('assets/discovery/terrain-z8-render-provenance.json')),reliefFiles={terrain:JSON.parse(read('assets/v3/relief-r2-provenance.json')).output,...Object.fromEntries(prov.pipeline.decorative_layers.map(l=>[l.role,l]))},relief={};
for(const [role,e] of Object.entries(reliefFiles)){const b=readFileSync(new URL(e.path,root));if(createHash('sha256').update(b).digest('hex')!==e.sha256)throw Error('Relief layer differs from provenance: '+e.path);relief[role]='data:image/webp;base64,'+b.toString('base64');}
if(Object.keys(relief).sort().join()!=='coast,sea,shadow,terrain')throw Error('Relief layers incomplete');
const sceneJs='window.TOPO_V3_SCENES='+JSON.stringify(scenes)+';window.TOPO_V3_RELIEF='+JSON.stringify(relief)+';window.TOPO_V3_ART='+JSON.stringify(v3art)+';';
// UI font (fase B): the embedded rounded fallback, checked against its manifest (SF Pro Rounded wins where present).
const fontM=JSON.parse(read('assets/v3/font/manifest.json')),fontB=readFileSync(new URL(fontM.path,root));
if(createHash('sha256').update(fontB).digest('hex')!==fontM.sha256)throw Error('UI font differs from manifest: '+fontM.path);
const fontCss='@font-face{font-family:"Topo Rounded";src:url(data:font/woff2;base64,'+fontB.toString('base64')+') format("woff2");font-weight:200 1000;font-style:normal;font-display:swap}';
const css=fontCss+read('scripts/v3/tokens.css')+read('scripts/v3/reis.css')+read('scripts/v3/les.css')+read('scripts/v3/shell.css')+read('scripts/v3/glas.css')+read('scripts/v3/stijl.css')+read('scripts/v3/reis-ijk.css')+read('scripts/v3/oefenen-ijk.css')+read('scripts/v3/les-ijk.css')+read('scripts/v3/toets-ijk.css')+read('scripts/v3/beloningen-ijk.css')+read('scripts/v3/voortgang-ijk.css')+read('scripts/v3/afwerking.css')+read('scripts/v3/ronde2.css')+read('scripts/v3/ronde3.css')+read('scripts/v3/ronde4.css')+barCss;
const head='<head>\n<style>html.v3Boot body{visibility:hidden}html.v3Ready body{animation:v3Ready .16s ease-out}@keyframes v3Ready{from{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){html.v3Ready body{animation:none}}</style><script>document.documentElement.classList.add("v3Boot");</script>\n<script>\n'+states+'\n'+sceneJs+'\n</script>\n<style>/* BEGIN TOPO V3 */'+css+'/* END TOPO V3 */</style>';
const last=html.lastIndexOf('</body>');if(last<0||html.indexOf('<head>')<0)throw Error('Unexpected index.html shape');
let out=html.replace('<head>',()=>head);
const end=out.lastIndexOf('</body>');
out=out.slice(0,end)+'<script>\n// BEGIN TOPO V3\n'+read('scripts/v3/iconen.js')+'\n'+read('scripts/v3/landmarks.js')+'\n'+read('scripts/v3/reis.js')+'\n'+read('scripts/v3/master-assets.js')+'\n'+read('scripts/v3/les.js')+'\n'+read('scripts/v3/shell.js')+'\n'+read('scripts/v3/schoolblad.js')+'\n'+read('scripts/v3/toets.js')+'\n'+read('scripts/v3/voortgang.js')+'\n'+read('scripts/v3/boek.js')+'\n'+read('scripts/v3/kennismaking.js')+'\n'+read('scripts/v3/keuze.js')+'\nrequestAnimationFrame(()=>{document.documentElement.classList.replace("v3Boot","v3Ready");});\n// END TOPO V3\n</script>\n'+out.slice(end);
out=out.replace(/<title>([^<]*)<\/title>/,(m,t)=>'<title>V3-preview Reis · '+t+'</title>');
// Assetdieet (docs/v3/ASSETDIEET.md): replace images in this output only, by the source bytes' sha256, from
// assets/v3/dieet/manifest.json (made by scripts/v3-assets-export.py). index.html and the masters stay unchanged.
const dietFile=new URL('assets/v3/dieet/manifest.json',root);
let diet=null;if(!process.env.TOPO_V3_NODIET)try{diet=JSON.parse(readFileSync(dietFile,'utf8'));}catch{}  // TOPO_V3_NODIET=1: the undieted output (inventory)
if(diet){
 const cache=new Map(),stats={placeholder:0,scale:0};
 out=out.replace(/data:(image\/[a-z0-9+.-]+);base64,([A-Za-z0-9+/=]+)/g,(m,mime,b64)=>{
  if(cache.has(b64))return cache.get(b64);
  const e=diet.images[createHash('sha256').update(Buffer.from(b64,'base64')).digest('hex')];let r=m;
  if(e?.action==='placeholder'){r=diet.placeholder;stats.placeholder++;}
  else if(e?.action==='scale'){const b=readFileSync(new URL(e.path,root));if(createHash('sha256').update(b).digest('hex')!==e.sha256)throw Error('Diet export differs from manifest: '+e.path);r='data:'+e.mime+';base64,'+b.toString('base64');stats.scale++;}
  cache.set(b64,r);return r;
 });
 console.log('  assetdieet: '+stats.placeholder+' placeholders, '+stats.scale+' scaled');
}
const file='output/html/TOPO-V3-Reis-Preview.html';
writeFileSync(new URL(file,root),out);
const sha=s=>createHash('sha256').update(s).digest('hex');
console.log(file+'\n  sha256 '+sha(out)+'\n  base index.html sha256 '+sha(html));
