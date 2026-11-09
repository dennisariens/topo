/* TOPO V3 — Reis / hoofdstukkeuze (v3b: sidebar · chapter list · real map · one action).
   Presentation layer over the V2 app. Reads canonical state (state.route, ROUTE_CHAPTERS, TopoRoute) and never
   writes it. Every action presses the existing V2 control, so the intro offer, Reis → Verder restore,
   confirmations and lesson start behave exactly as in V2. The map is a clone of the live #map: same paths,
   same coordinates; only paint differs. */
(function setupV3Reis(){
 'use strict';
 const art=NINO_V2_ART,nino=window.TOPO_NINO_ART_DATA?.assets||{},$=s=>document.querySelector(s);
 const SVGNS='http://www.w3.org/2000/svg';
 const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const img=(a,cls)=>{const i=make('img',cls);i.src=a.src;i.width=a.width;i.height=a.height;i.alt='';i.decoding='async';return i;};
 const btn=(text,fn,cls='v3Btn')=>{const b=make('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;};
 const STAGE={discover:'Ontdekken',point:'Aanwijzen',write:'Namen schrijven'};
 const KIND={...STAGE,gold:'Gouden proef',review:'Opfrissen',smart:'Slim rondje'};
 // V3 handles the event, then presses the original V2 control.
 const press=find=>e=>{e.stopPropagation();const b=find();if(b&&!b.disabled)b.click();};
 const v2Card=id=>$('#routeCards article[data-chapter="'+id+'"]');
 const v2Nav=label=>[...document.querySelectorAll('.ninoNav button')].find(b=>b.textContent.trim()===label);
 const icon=name=>{const s=document.createElementNS(SVGNS,'svg');s.setAttribute('viewBox',name==='vespa'?'0 0 72 48':'0 0 32 32');s.setAttribute('aria-hidden','true');s.classList.add('v3Icon');const u=document.createElementNS(SVGNS,'use');u.setAttribute('href','#topo-'+name);s.append(u);return s;};
 const range=t=>{const f=document.createDocumentFragment();t.split(/(\d+–\d+)/).forEach(p=>{if(!p)return;if(/^\d+–\d+$/.test(p))f.append(make('span','nw',p));else f.append(p);});return f;};
 const ui={selected:null,relief:false};
 // One extra symbol in the existing sprite: a gear for settings.
 const defs=document.querySelector('#topoIconSprite defs');
 if(defs&&!document.getElementById('topo-v3gear')){const g=document.createElementNS(SVGNS,'symbol');g.id='topo-v3gear';g.setAttribute('viewBox','0 0 32 32');g.innerHTML='<circle cx="16" cy="16" r="4.5"/><path d="M16 3v4m0 18v4M3 16h4m18 0h4M6.8 6.8l2.8 2.8m12.8 12.8 2.8 2.8M6.8 25.2l2.8-2.8m12.8-12.8 2.8-2.8"/>';defs.append(g);}

 function model(){
  const chapters=ROUTE_CHAPTERS.map((c,index)=>{const r=TopoRoute.record(state.route,c.id);return {...c,index,r,open:TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,c.id),done:r.stage===3,gold:r.goldAt>0};});
  const next=chapters.find(c=>c.r.stage<3)||null,active=state.route.active&&!state.route.active.done?state.route.active:null;
  const due=TopoRoute.due(state.route,ROUTE_CHAPTERS);
  return {chapters,next,active,due,done:chapters.filter(c=>c.done).length};
 }
 const stateOf=(c,m)=>!c.open?'locked':c.gold?'gold':c.done?'done':c===m.next?'now':'open';

 /* Shell (built once) */
 const root=make('div','v3 v3Reis');root.dataset.v3='reis';
 const side=make('nav','v3Side');side.setAttribute('aria-label','Hoofdnavigatie');
 const brand=make('div','v3Brand');brand.append(make('b',null,'Topo'),make('i','v3Flag'));
 const portrait=make('div','v3Portrait');if(nino.guide)portrait.append(img(nino.guide));
 const navItem=(label,glyph,fn,current)=>{const b=btn('',fn,'v3Btn v3NavItem');b.append(icon(glyph),make('span',null,label));if(current)b.setAttribute('aria-current','page');return b;};
 const nav=make('div','v3NavList');
 nav.append(navItem('Reis','vespa',e=>e.stopPropagation(),true),navItem('Oefenen','point',press(()=>v2Nav('Oefenen'))),navItem('Beloningen','gold',e=>{e.stopPropagation();window.TopoBook?.open(e.currentTarget);}));
 const settings=navItem('Instellingen','v3gear',press(()=>$('.ninoSettingsButton')));settings.classList.add('v3Settings');
 side.append(brand,portrait,nav,settings);
 const list=make('section','v3List');list.setAttribute('aria-labelledby','v3ListTitle');
 const listTitle=make('h2',null,'Hoofdstukken');listTitle.id='v3ListTitle';const rows=make('ol','v3Rows');list.append(listTitle,rows);
 const main=make('section','v3Main');main.setAttribute('aria-labelledby','v3Title');
 const top=make('div','v3Top'),panel=make('div','v3Panel'),stage=make('div','v3MapStage');
 main.append(top,stage,panel);
 root.append(side,list,main);

 /* Map: clone of the live map, ids prefixed so references stay valid and nothing duplicates. */
 let mapClone=null;
 function cloneMap(){
  const live=$('#map');if(!live||!live.querySelector('[data-id]'))return null;
  const svg=live.cloneNode(true),ids=new Map();
  svg.querySelectorAll('[id]').forEach(n=>{ids.set(n.id,'v3m-'+n.id);n.id='v3m-'+n.id;});
  svg.removeAttribute('id');
  svg.querySelectorAll('*').forEach(n=>{for(const a of [...n.attributes]){if(a.value.includes('#')){const v=a.value.replace(/url\(#([^)]+)\)/g,(m,k)=>ids.has(k)?'url(#'+ids.get(k)+')':m).replace(/^#(.+)$/,(m,k)=>ids.has(k)?'#'+ids.get(k):m);if(v!==a.value)n.setAttribute(a.name,v);}}});
  svg.querySelectorAll('[class]').forEach(n=>n.classList.remove('activeTarget','selected','correct','wrong','highlight'));
  svg.querySelectorAll('#v3m-nameLayer>*,.nameLabel').forEach(n=>n.remove());
  // Decorative copy: no focus stops, no accessible duplicates of the live targets.
  svg.querySelectorAll('[tabindex],[role],[aria-label]').forEach(n=>{n.removeAttribute('tabindex');n.removeAttribute('role');n.removeAttribute('aria-label');});
  svg.querySelectorAll('a,button,foreignObject').forEach(n=>n.remove());
  svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.removeAttribute('role');svg.classList.add('v3Map');
  return svg;
 }
 function paintMap(c){
  if(!mapClone){mapClone=cloneMap();if(mapClone){stage.prepend(mapClone);
   // Outside the 890×1235 canvas the real land continues; the canvas sea colour fills behind it.
   const sea=mapClone.querySelector('.sea');if(sea)mapClone.style.background=getComputedStyle(sea).fill;}}
  if(!mapClone)return;
  mapClone.dataset.relief=ui.relief?'on':'off';
  const set=new Set(c?c.itemIds:[]);
  mapClone.querySelectorAll('[data-id]').forEach(n=>n.classList.toggle('v3Hit',set.has(n.getAttribute('data-id'))));
  mapClone.dataset.focus=c?(c.itemIds[0]?.startsWith('city')?'points':'areas'):'';
  fit(mapClone);
 }
 // Frame Italy and the chapter's places with a generous margin, then widen the frame to the stage's shape
 // inside the map canvas (890×1235), so neighbouring countries, seas and islands stay visible as reference.
 const CANVAS={w:890,h:1235},MARGIN=.14;
 function fit(svg){
  try{
   const parts=[...svg.querySelectorAll('.italy,.v3Hit')];if(!parts.length)return;
   let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
   for(const p of parts){const b=p.getBBox();if(!b.width&&!b.height&&p.tagName!=='circle')continue;x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x+b.width);y1=Math.max(y1,b.y+b.height);}
   if(!isFinite(x0))return;
   const pad=Math.max(x1-x0,y1-y0)*MARGIN;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(CANVAS.w,x1+pad);y1=Math.min(CANVAS.h,y1+pad);
   // Match the stage aspect ratio by growing the shorter side, centred and clamped to the canvas.
   const box=svg.getBoundingClientRect(),aspect=box.width>0&&box.height>0?box.width/box.height:0;
   const grow=(a0,a1,len,max)=>{len=Math.min(len,max);let c=(a0+a1)/2,s=c-len/2;s=Math.max(0,Math.min(max-len,s));return [s,s+len];};
   if(aspect){const w=x1-x0,h=y1-y0;if(w/h<aspect)[x0,x1]=grow(x0,x1,h*aspect,CANVAS.w);else [y0,y1]=grow(y0,y1,w/aspect,CANVAS.h);}
   svg.setAttribute('viewBox',[x0,y0,x1-x0,y1-y0].map(v=>Math.round(v)).join(' '));
  }catch{}
 }
 // The stage size changes with the layout (rotation, sidebar width): refit on resize.
 if('ResizeObserver' in window)new ResizeObserver(()=>{if(mapClone)fit(mapClone);}).observe(stage);

 function renderTop(m){
  const bar=make('div','v3Steps');bar.setAttribute('role','img');bar.setAttribute('aria-label',m.done+' van 11 hoofdstukken afgerond');
  m.chapters.forEach(c=>{const i=make('i');if(c.done)i.className='on';bar.append(i);});
  const cycle=(state.pizzas%3)*8+state.slices,key=TopoPizza.flavor(state.pizzas),n=['margherita','salami','quattro-formaggi'].indexOf(key);
  const pz=make('span','v3Count');pz.setAttribute('aria-label',cycle+' van 24 pizzapunten tot de volgende Vespa-rit');
  pz.append(img(art['favorite'+Math.max(0,n)],'v3Mini'),make('b',null,cycle+' / 24'));
  const trip=make('span','v3Count');trip.setAttribute('aria-label',state.trips+' Vespa-ritten');trip.append(icon('vespa'),make('b',null,String(state.trips)));
  top.replaceChildren(bar,make('span','v3Frac',m.done+' / 11'),pz,trip);
 }

 function renderRows(m){
  rows.replaceChildren(...m.chapters.map(c=>{
   const st=stateOf(c,m),li=make('li'),b=make('button','v3Row');b.type='button';b.dataset.chapter=c.id;b.dataset.state=st;
   b.setAttribute('aria-pressed',String(ui.selected===c.id));if(st==='now')b.setAttribute('aria-current','step');
   const num=make('span','v3Num',String(c.index+1)),name=make('span','v3Name');name.append(range(c.title));
   const end=make('span','v3End');
   if(st==='gold'){end.append(img(art.chapterGold,'v3Seal'));end.setAttribute('aria-label','goud');}
   else if(st==='done'){end.append(make('span','v3Check','✓'));end.setAttribute('aria-label','afgerond');}
   else if(st==='locked'){end.append(icon('lock'));end.setAttribute('aria-label','op slot');}
   else{const segs=make('span','v3Segs');for(let i=0;i<3;i++){const s=make('i');if(i<c.r.stage)s.className='on';segs.append(s);}end.append(segs);end.setAttribute('aria-label',c.r.stage+' van 3 lessen');}
   b.append(num,name,end);
   b.addEventListener('click',e=>{e.stopPropagation();ui.selected=c.id;render();
    // Phone: the chosen chapter appears at the top, so bring it into view; elsewhere keep focus on the list.
    if(matchMedia('(max-width:767px)').matches)main.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
    else root.querySelector('.v3Row[data-chapter="'+c.id+'"]')?.focus();});
   li.append(b);return li;
  }));
 }

 function renderPanel(m,c){
  panel.replaceChildren();if(!c)return;
  const st=stateOf(c,m),h=make('h1');h.id='v3Title';
  h.append(make('small',null,'Hoofdstuk '+(c.index+1)),range(c.title));panel.append(h);
  const segs=make('div','v3StageBar');segs.setAttribute('role','list');
  TopoRoute.STAGES.forEach((s,n)=>{const d=make('span',n<c.r.stage?'on':n===c.r.stage&&c.open&&!c.done?'now':'');d.setAttribute('role','listitem');d.setAttribute('aria-label',STAGE[s]+(n<c.r.stage?', klaar':n===c.r.stage&&c.open?', nu':''));segs.append(d);});
  panel.append(segs);
  const actions=make('div','v3Actions');
  const isActive=m.active&&m.active.chapterId===c.id;
  if(!c.open){panel.append(make('p','v3Locked','Opent na '+m.chapters[c.index-1].title));return;}
  if(isActive){actions.append(btn('Ga verder · '+KIND[m.active.kind],press(()=>$('#routeContinue')),'v3Btn primary'));}
  else if(!c.done){
   const s=TopoRoute.STAGES[c.r.stage];
   const viaContinue=!m.active&&c===m.next;
   actions.append(btn(STAGE[s],press(()=>viaContinue?$('#routeContinue'):v2Card(c.id)?.querySelectorAll('.routeStep')[c.r.stage]),'v3Btn primary'));
  }else{
   const due=m.due.some(d=>d.id===c.id);
   if(!c.gold)actions.append(btn('★ Verdien goud',press(()=>v2Card(c.id)?.querySelector('.goldButton')),'v3Btn primary'));
   else actions.append(btn(due?'Opfrissen':'★ Goud nog eens',press(()=>due?v2Card(c.id)?.querySelector('.routeActions button:not(.goldButton)'):v2Card(c.id)?.querySelector('.goldButton')),'v3Btn primary'));
  }
  panel.append(actions);
  // Replays: quiet, only for lessons already done.
  if(c.r.stage>0){const again=make('div','v3Again');TopoRoute.STAGES.forEach((s,n)=>{if(n<c.r.stage)again.append(btn('↻ '+STAGE[s],press(()=>v2Card(c.id)?.querySelectorAll('.routeStep')[n])));});panel.append(again);}
 }

 function renderSwitch(){
  let sw=stage.querySelector('.v3Switch');
  if(!sw){sw=make('div','v3Switch');sw.setAttribute('role','group');sw.setAttribute('aria-label','Kaartstijl');
   for(const [k,label] of [[false,'Schoolkaart'],[true,'Reliëf']]){const b=btn(label,e=>{e.stopPropagation();ui.relief=k;render();});b.dataset.relief=String(k);sw.append(b);}
   stage.append(sw);}
  sw.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.relief===String(ui.relief))));
 }

 function render(){
  const home=$('#routeHome');if(!home)return;
  if(root.parentNode!==home)home.prepend(root);
  root.dataset.theme=window.TOPO_V3_THEME||'italia';
  const m=model();
  if(!ui.selected||!m.chapters.some(c=>c.id===ui.selected))ui.selected=(m.active&&m.chapters.find(c=>c.id===m.active.chapterId)||m.next||m.chapters.at(-1)).id;
  const c=m.chapters.find(x=>x.id===ui.selected);
  renderTop(m);renderRows(m);renderPanel(m,c);renderSwitch();paintMap(c);
 }
 // V2 chrome steps aside while Reis is shown; lessons and other screens keep V2 as is.
 function chrome(){const on=!$('#journeyScreen')?.classList.contains('hidden')&&!$('#routeHome')?.classList.contains('hidden');document.body.classList.toggle('v3Home',on);}
 new MutationObserver(chrome).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
 const base=renderRouteHome;
 renderRouteHome=function(...a){const out=base.apply(this,a);try{render();chrome();}catch(e){console.error('V3 Reis',e);}return out;};
 document.body.classList.add('v3On');
 window.TOPO_V3={render,model,ui};
 if(!$('#journeyScreen')?.classList.contains('hidden')){render();chrome();}
})();
