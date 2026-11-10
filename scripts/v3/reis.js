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
 // Stijlbeeld (renderniveau): relief is the default map style; Schoolkaart stays one tap away.
 const ui={selected:null,relief:true,view:'reis'};
 // Reis map variant (fase B, owner 10-11): (a) "eiland" = Italy floating as land, neighbours as soft silhouettes, the
 // sea transparent on the wash (the default until the owner chooses); (b) "kaart" = the map as a rounded glass card.
 ui.kaart=window.TOPO_V3_KAART==='kaart'?'kaart':'eiland';
 // Chapter scenes {mini, kop}: the 8 #75 scenes (assets/v3/scenes) and Roma, Venezia, Napoli (assets/v3/render);
 // a chapter without a scene keeps its chapter icon. Render assets: background, portrait, icons, VE-01.
 const scenes=window.TOPO_V3_SCENES||{},V3ART=window.TOPO_V3_ART||null;
 const pic=(src,cls,w,h)=>{const i=make('img',cls);i.src=src;i.alt='';i.decoding='async';if(w){i.width=w;i.height=h;}return i;};
 // Line icons: iconen.js adds the V3 set to the V2 sprite (fase B).

 function model(){
  const chapters=ROUTE_CHAPTERS.map((c,index)=>{const r=TopoRoute.record(state.route,c.id);return {...c,index,r,open:TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,c.id),done:r.stage===3,gold:r.goldAt>0};});
  const next=chapters.find(c=>c.r.stage<3)||null,active=state.route.active&&!state.route.active.done?state.route.active:null;
  const due=TopoRoute.due(state.route,ROUTE_CHAPTERS);
  return {chapters,next,active,due,done:chapters.filter(c=>c.done).length};
 }
 const stateOf=(c,m)=>!c.open?'locked':c.gold?'gold':c.done?'done':c===m.next?'now':'open';

 /* Shell (built once) */
 const root=make('div','v3 v3Reis');root.dataset.v3='reis';
 // Sidebar: one component for Reis and the lesson. Inside a lesson, Reis returns to Reis through the V2 nav.
 // Navigation (V3.0, docs/v3/V3_0_REST.md § 1): six tabs on every screen. The shell (shell.js) routes each tab;
 // the current tab follows the route the learner chose (DECISIONS 7-11).
 const TABS=[['reis','Reis','v3map'],['oefenen','Oefenen','v3cap'],['toets','Toets','v3test'],['rewards','Beloningen','v3trophy'],['voortgang','Voortgang','v3progress']];
 const go=tab=>e=>{e?.stopPropagation?.();window.TOPO_V3?.go?.(tab,e?.currentTarget);};
 function makeSide(){
  const side=make('nav','v3Side');side.setAttribute('aria-label','Hoofdnavigatie');
  const brand=make('div','v3Brand');brand.append(make('b',null,'Topo'),make('i','v3Flag'));
  // Nino portrait (render asset NINO-PORTRET); the guide cut-out only when the portrait is missing.
  const portrait=make('div','v3Portrait');if(V3ART?.portrait){portrait.classList.add('v3PortraitArt');portrait.append(pic(V3ART.portrait,null,512,512));}else if(nino.guide)portrait.append(img(nino.guide));
  const navItem=(tab,label,glyph)=>{const b=btn('',go(tab),'v3Btn v3NavItem');b.append(icon(glyph),make('span',null,label));b.dataset.nav=tab;return b;};
  const nav=make('div','v3NavList');nav.append(...TABS.map(t=>navItem(...t)));
  const settings=navItem('instellingen','Instellingen','v3gear');settings.classList.add('v3Settings');
  side.append(brand,portrait,nav,settings);markNav(side);return side;
 }
 // aria-current on every sidebar copy (Reis window and lesson shell).
 function markNav(scope=document){const cur=window.TOPO_V3?.currentTab?.()||(ui.view==='rewards'?'rewards':'reis');scope.querySelectorAll('.v3Side [data-nav]').forEach(b=>{if(b.dataset.nav===cur)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}
 const side=makeSide();
 const list=make('section','v3List');list.setAttribute('aria-labelledby','v3ListTitle');
 // One title per screen (R-reis-ijk): the screen title "Reis"; the list heading stays for screen readers only.
 const screenTitle=make('h1','v3ScreenTitle','Reis');screenTitle.id='v3ReisTitle';screenTitle.tabIndex=-1;
 const listTitle=make('h2','v3SrOnly','Hoofdstukken');listTitle.id='v3ListTitle';const rows=make('ol','v3Rows');list.append(screenTitle,listTitle,rows);
 const main=make('section','v3Main');main.setAttribute('aria-labelledby','v3Title');
 const top=make('div','v3Top'),panel=make('div','v3Panel'),stage=make('div','v3MapStage');
 main.append(top,stage,panel);
 // Beloningen (richting B): a calm frame around the rich Reisboekje; counts come from the V2 state.
 const rewardsView=make('section','v3Rewards');rewardsView.setAttribute('aria-labelledby','v3RewardsTitle');
 // Further V3 views (Oefenen, Toets, Voortgang) share this window; shell.js fills them.
 const views={rewards:rewardsView},renderers={};
 function addView(name,label,fn){const v=make('section','v3View v3View-'+name);v.setAttribute('aria-label',label);views[name]=v;renderers[name]=fn;root.append(v);return v;}
 root.append(side,list,main,rewardsView);

 /* Map: clone of the live map, ids prefixed so references stay valid and nothing duplicates. */
 let mapClone=null;
 function cloneMap(prefix='v3m-',cls='v3Map'){
  const live=$('#map');if(!live||!live.querySelector('[data-id]'))return null;
  const svg=live.cloneNode(true),ids=new Map();
  svg.querySelectorAll('[id]').forEach(n=>{ids.set(n.id,prefix+n.id);n.id=prefix+n.id;});
  svg.removeAttribute('id');
  svg.querySelectorAll('*').forEach(n=>{for(const a of [...n.attributes]){if(a.value.includes('#')){const v=a.value.replace(/url\(#([^)]+)\)/g,(m,k)=>ids.has(k)?'url(#'+ids.get(k)+')':m).replace(/^#(.+)$/,(m,k)=>ids.has(k)?'#'+ids.get(k):m);if(v!==a.value)n.setAttribute(a.name,v);}}});
  svg.querySelectorAll('[class]').forEach(n=>n.classList.remove('activeTarget','selected','correct','wrong','highlight'));
  svg.querySelectorAll('#'+prefix+'nameLayer>*,.nameLabel').forEach(n=>n.remove());
  // Decorative copy: no focus stops, no accessible duplicates of the live targets.
  svg.querySelectorAll('[tabindex],[role],[aria-label]').forEach(n=>{n.removeAttribute('tabindex');n.removeAttribute('role');n.removeAttribute('aria-label');});
  svg.querySelectorAll('a,button,foreignObject').forEach(n=>n.remove());
  svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.removeAttribute('role');svg.classList.add(cls);
  addRelief(svg,prefix);
  return svg;
 }
 // Relief z8 in the render palette (Codex, v3/relief-z8 @ 2a7b0cf; measured DEM, same 890×1235 frame), in its layer
 // order: sea → land shadow → relief clipped to the original land → white coast rim → existing borders and labels.
 // All layers are decoration (aria-hidden, no pointer events, no data-id): geometry and targets stay the live map's.
 // V3 adds a soft coastal glow (copies of the same land paths) for a gentler sea gradient, and a land base in the
 // lowland colour where the raster ends (outside the canvas).
 const RELIEF=window.TOPO_V3_RELIEF||null;
 function addRelief(svg,prefix='v3m-'){
  const raster=(cls,href)=>{const i=document.createElementNS(SVGNS,'image');for(const [k,v] of Object.entries({x:0,y:0,width:890,height:1235,preserveAspectRatio:'none','pointer-events':'none','aria-hidden':'true',class:cls,href}))i.setAttribute(k,v);return i;};
  const defs=document.createElementNS(SVGNS,'defs');defs.innerHTML='<filter id="v3-coast-glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>';svg.prepend(defs);
  const shapes=[...svg.querySelectorAll('.land,.italy')].map(n=>n.getAttribute('d')).filter(Boolean);
  const layer=cls=>{const g=document.createElementNS(SVGNS,'g');g.setAttribute('class',cls);g.setAttribute('aria-hidden','true');g.setAttribute('pointer-events','none');for(const d of shapes){const q=document.createElementNS(SVGNS,'path');q.setAttribute('d',d);g.append(q);}return g;};
  const under=svg.querySelector('#'+prefix+'seaLayer'),terrain=svg.querySelector('.atlasTerrain');if(!under||!terrain)return;
  const below=[];if(RELIEF)below.push(raster('v3R v3RSea',RELIEF.sea));below.push(layer('v3CoastGlow'));if(RELIEF)below.push(raster('v3R v3RShadow',RELIEF.shadow));below.push(layer('v3LandBase'));
  under.before(...below);
  if(RELIEF){terrain.querySelector('image')?.setAttribute('href',RELIEF.terrain);terrain.after(raster('v3R v3RCoast',RELIEF.coast));svg.dataset.relief8='z8';}
 }
 function paintMap(c){
  if(!mapClone){mapClone=cloneMap();if(mapClone){stage.prepend(mapClone);addIsland(mapClone);
   // Outside the 890×1235 canvas the real land continues; the canvas sea colour fills behind it.
   const sea=mapClone.querySelector('.sea');if(sea)mapClone.style.setProperty('--v3-sea-school',getComputedStyle(sea).fill);}}
  if(!mapClone)return;
  mapClone.dataset.relief=ui.relief?'on':'off';mapClone.dataset.kaart=ui.kaart;
  const set=new Set(c?c.itemIds:[]);
  mapClone.querySelectorAll('[data-id]').forEach(n=>n.classList.toggle('v3Hit',set.has(n.getAttribute('data-id'))));
  mapClone.dataset.focus=c?(c.itemIds[0]?.startsWith('city')?'points':'areas'):'';
  fit(mapClone);
 }
 /* Variant (a) Eiland: decoration layers on the Reis clone only (aria-hidden, no pointer events, no data-id; the
    geometry stays the live map's). A copy of Italy's own outline carries a soft drop shadow under the relief; a clip of
    the same outline keeps the relief on Italy; neighbouring land fades out toward the frame (a mask in map space, moved
    with the viewBox), so there is no hard cut line and no haze on Italy. CSS switches them on per variant. */
 function addIsland(svg,prefix='v3m-'){
  // Italy is its mainland outline plus the island chapter's countries (Sicilië, Sardinië are .country items).
  const isles=(ROUTE_CHAPTERS.find(c=>c.id==='islands')?.itemIds||[]).map(id=>svg.querySelector('.country[data-id="'+id+'"]')).filter(Boolean);
  isles.forEach(n=>n.classList.add('v3Isle'));
  const it=svg.querySelector('.italy');const d=[it?.getAttribute('d'),...isles.map(n=>n.getAttribute('d'))].filter(Boolean).join(' ');const terrain=svg.querySelector('.atlasTerrain');if(!it||!terrain)return;
  const defs=document.createElementNS(SVGNS,'defs');
  defs.innerHTML='<clipPath id="'+prefix+'italyClip"><path d="'+d+'"/></clipPath>'
   +'<filter id="'+prefix+'isleShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#2a2440" flood-opacity=".30"/></filter>'
   +'<radialGradient id="'+prefix+'nbGrad" cx=".5" cy=".5" r=".5"><stop offset=".62" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>'
   +'<mask id="'+prefix+'nbFade" maskUnits="userSpaceOnUse"><rect class="v3FadeRect" x="0" y="0" width="890" height="1235" fill="url(#'+prefix+'nbGrad)"/></mask>';
  svg.prepend(defs);
  // Each clone references its own clip (Reis v3m-, Oefenen v3o-, Toets v3t-); the CSS reads it from this property.
  svg.style.setProperty('--v3-isle-clip','url(#'+prefix+'italyClip)');
  // The neighbours as one silhouette: copies of their outlines in one group, so the group's opacity and fade apply once
  // (overlapping shapes, each half transparent, drew seams where they overlap). The originals step aside in variant (a),
  // except a chapter's own countries (Landen), which stay the data.
  const nbg=document.createElementNS(SVGNS,'g');nbg.setAttribute('class','v3Neighbours');nbg.setAttribute('aria-hidden','true');nbg.setAttribute('pointer-events','none');nbg.setAttribute('mask','url(#'+prefix+'nbFade)');
  for(const n of svg.querySelectorAll('.contextLand,.country:not(.v3Isle)')){const q=document.createElementNS(SVGNS,'path');q.setAttribute('d',n.getAttribute('d')||'');nbg.append(q);}
  const base=document.createElementNS(SVGNS,'path');base.setAttribute('d',d);base.setAttribute('class','v3IsleBase');base.setAttribute('aria-hidden','true');base.setAttribute('pointer-events','none');base.setAttribute('filter','url(#'+prefix+'isleShadow)');
  terrain.before(nbg,base);
  const pins=document.createElementNS(SVGNS,'g');pins.setAttribute('class','v3Pins');pins.setAttribute('aria-hidden','true');pins.setAttribute('pointer-events','none');svg.append(pins);
 }
 // Pins (R-reis-ijk): the chapter's places as violet pins on the map, a constant on-screen size (redrawn on each fit).
 const PIN='M0 0C-2.6-5.4-10-10.2-10-17.5a10 10 0 1 1 20 0C10-10.2 2.6-5.4 0 0z';
 function drawPins(svg,k){
  const g=svg.querySelector('.v3Pins');if(!g)return;g.replaceChildren();
  if(svg.dataset.focus!=='points')return;
  for(const c of svg.querySelectorAll('circle.v3Hit')){const x=+c.getAttribute('cx'),y=+c.getAttribute('cy');if(!isFinite(x)||!isFinite(y))continue;
   const p=document.createElementNS(SVGNS,'g');p.setAttribute('class','v3Pin');p.setAttribute('transform','translate('+x+' '+y+') scale('+k+')');
   p.innerHTML='<path d="'+PIN+'"/><circle cx="0" cy="-17.5" r="4.2"/>';g.append(p);}
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
   // Variant (a) Eiland: Italy itself is the object — a tight frame (4%), not clamped to the canvas (the sea is
   // transparent and the neighbours fade out, so nothing beyond the data reads as sea); the stage letterboxes it.
   if(svg.dataset.kaart==='eiland'){const p=Math.max(x1-x0,y1-y0)*.04;x0-=p;y0-=p;x1+=p;y1+=p;svg.style.width=svg.style.height='';
    svg.setAttribute('viewBox',[x0,y0,x1-x0,y1-y0].map(v=>Math.round(v)).join(' '));
    // The fade and the mask region are the element's whole visible box in map units (the stage letterboxes the frame
    // and the neighbours draw beyond it): the fade reaches zero at that box's edges, so nothing ends in a straight cut.
    const r=svg.getBoundingClientRect(),fr=svg.querySelector('.v3FadeRect'),mk=fr?.parentNode;
    if(fr&&r.width&&r.height){const w=x1-x0,h=y1-y0,k=Math.max(w/r.width,h/r.height),bw=r.width*k,bh=r.height*k,bx=x0-(bw-w)/2,by=y0-(bh-h)/2;
     for(const n of [fr,mk])for(const [a,v] of [['x',bx],['y',by],['width',bw],['height',bh]])n.setAttribute(a,v);}if(r.width&&r.height)drawPins(svg,Math.max((x1-x0)/r.width,(y1-y0)/r.height));return;}
   const pad=Math.max(x1-x0,y1-y0)*MARGIN;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(CANVAS.w,x1+pad);y1=Math.min(CANVAS.h,y1+pad);
   // Match the stage aspect ratio by growing the shorter side, centred and clamped to the canvas.
   // Measure the free stage (any size set by an earlier fit is released first).
   svg.style.width=svg.style.height='';
   const box=svg.getBoundingClientRect(),aspect=box.width>0&&box.height>0?box.width/box.height:0;
   const grow=(a0,a1,len,max)=>{len=Math.min(len,max);let c=(a0+a1)/2,s=c-len/2;s=Math.max(0,Math.min(max-len,s));return [s,s+len];};
   if(aspect){const w=x1-x0,h=y1-y0;if(w/h<aspect)[x0,x1]=grow(x0,x1,h*aspect,CANVAS.w);else [y0,y1]=grow(y0,y1,w/aspect,CANVAS.h);}
   svg.setAttribute('viewBox',[x0,y0,x1-x0,y1-y0].map(v=>Math.round(v)).join(' '));
   // Clamped to the canvas: the element takes the viewBox's own proportions, so nothing outside the drawn data
   // (where neighbouring land is not part of the map) shows as sea; the map floats as one object (phase A, 10-11).
   const vb=(x1-x0)/(y1-y0);
   if(aspect&&Math.abs(vb-aspect)>.01){if(vb<aspect)svg.style.width=Math.round(box.height*vb)+'px';else svg.style.height=Math.round(box.width/vb)+'px';}
   // The neighbours' fade follows the frame; pins keep their on-screen size (map units per px).
   const fr=svg.querySelector('.v3FadeRect');if(fr){fr.setAttribute('x',x0);fr.setAttribute('y',y0);fr.setAttribute('width',x1-x0);fr.setAttribute('height',y1-y0);}
   const r2=svg.getBoundingClientRect();if(r2.width&&r2.height)drawPins(svg,Math.max((x1-x0)/r2.width,(y1-y0)/r2.height));
  }catch{}
 }
 // The stage size changes with the layout (rotation, sidebar width): refit on resize.
 if('ResizeObserver' in window)new ResizeObserver(()=>{if(mapClone)fit(mapClone);}).observe(stage);

 // Top of the map column: the map tools (Schoolblad, Schoolkaart | Reliëf) left, the counters right with line icons.
 // The tools sit beside the map, never on it (pins and coast stay free).
 const tools=make('div','v3MapTools');
 function renderTop(m){
  const cycle=(state.pizzas%3)*8+state.slices;
  const pz=make('span','v3Count');pz.setAttribute('aria-label',cycle+' van 24 pizzapunten tot de volgende Vespa-rit');
  pz.append(icon('v3slice'),make('b',null,cycle+' / 24'));
  const trip=make('span','v3Count');trip.setAttribute('aria-label',state.trips+' Vespa-ritten');trip.append(icon('v3scooter'),make('b',null,String(state.trips)));
  const counts=make('div','v3Counts');counts.append(pz,make('i','v3CountSep'),trip);
  top.replaceChildren(tools,counts);
 }

 // Chapter rows (R-reis-ijk): scene, name, status. Done = a check only; gold = a medal; in progress = a thin bar under
 // the name; locked = a lock only. The selected row is the selection style.
 function renderRows(m){
  rows.replaceChildren(...m.chapters.map(c=>{
   const st=stateOf(c,m),li=make('li'),b=make('button','v3Row');b.type='button';b.dataset.chapter=c.id;b.dataset.state=st;
   b.setAttribute('aria-pressed',String(ui.selected===c.id));if(st==='now')b.setAttribute('aria-current','step');
   const name=make('span','v3Name');name.append(range(c.title));
   const thumb=make('span','v3Thumb'),src=scenes[c.id]?.mini;
   if(src)thumb.append(pic(src,null,480,270));
   else if(art['chapter'+c.index]){thumb.classList.add('v3ThumbIcon');thumb.append(img(art['chapter'+c.index]));}
   const mid=make('span','v3RowMid');mid.append(name);
   const end=make('span','v3End');
   if(st==='gold'){end.append(icon('v3medal'));end.classList.add('v3EndGold');end.setAttribute('aria-label','goud');}
   else if(st==='done'){end.append(icon('v3check'));end.classList.add('v3EndDone');end.setAttribute('aria-label','afgerond');}
   else if(st==='locked'){end.append(icon('v3lock'));end.setAttribute('aria-label','op slot');}
   else{const bar=make('span','v3RowBar');bar.style.setProperty('--v3-on',String(c.r.stage/3));bar.setAttribute('aria-hidden','true');mid.append(bar);end.setAttribute('aria-label',c.r.stage+' van 3 lessen');}
   b.append(thumb,mid,end);
   b.addEventListener('click',e=>{e.stopPropagation();ui.selected=c.id;render();
    // Phone: the chosen chapter appears at the top: focus its title (keyboard position kept, read by screen readers)
    // and bring it into view; elsewhere keep focus on the list.
    if(matchMedia('(max-width:767px)').matches){$('#v3Title')?.focus({preventScroll:true});main.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
    else root.querySelector('.v3Row[data-chapter="'+c.id+'"]')?.focus();});
   li.append(b);return li;
  }));
 }

 // The chapter card (R-reis-ijk): title, three step dots, one pill; replays quietly below. No scene header (the rows
 // carry the scenes).
 function renderPanel(m,c){
  panel.replaceChildren();if(!c)return;
  // tabindex -1: on phone, focus moves here after choosing a chapter (Hermes V3-03).
  const h=make('h2','v3CardTitle');h.id='v3Title';h.tabIndex=-1;
  h.append(make('span','v3SrOnly','Hoofdstuk '+(c.index+1)+': '),range(c.title));
  const head=make('div','v3CardHead');head.append(h);
  const segs=make('div','v3StageBar');segs.setAttribute('role','list');segs.setAttribute('aria-label','Lessen');
  TopoRoute.STAGES.forEach((s,n)=>{const d=make('span',n<c.r.stage?'on':n===c.r.stage&&c.open&&!c.done?'now':'');d.setAttribute('role','listitem');d.setAttribute('aria-label',STAGE[s]+(n<c.r.stage?', klaar':n===c.r.stage&&c.open?', nu':''));if(n<c.r.stage)d.append(icon('v3checkmark'));segs.append(d);});
  head.append(segs);panel.append(head);
  const actions=make('div','v3Actions');
  const isActive=m.active&&m.active.chapterId===c.id;
  if(!c.open){const l=make('p','v3Locked');l.append(icon('v3lock'),make('span',null,'Opent na '+m.chapters[c.index-1].title));panel.append(l);return;}
  const pill=(label,find,glyph)=>{const b=btn('',press(find),'v3Btn primary');if(glyph)b.append(icon(glyph));b.append(make('span',null,label));return b;};
  if(isActive){actions.append(pill('Ga verder · '+KIND[m.active.kind],()=>$('#routeContinue')));}
  else if(!c.done){
   const s=TopoRoute.STAGES[c.r.stage];
   const viaContinue=!m.active&&c===m.next;
   actions.append(pill(STAGE[s],()=>viaContinue?$('#routeContinue'):v2Card(c.id)?.querySelectorAll('.routeStep')[c.r.stage]));
  }else{
   const due=m.due.some(d=>d.id===c.id);
   if(!c.gold)actions.append(pill('Verdien goud',()=>v2Card(c.id)?.querySelector('.goldButton'),'v3medal'));
   else actions.append(due?pill('Opfrissen',()=>v2Card(c.id)?.querySelector('.routeActions button:not(.goldButton)'),'v3again'):pill('Goud nog eens',()=>v2Card(c.id)?.querySelector('.goldButton'),'v3medal'));
  }
  panel.append(actions);
  // Replays: quiet, only for lessons already done.
  if(c.r.stage>0){const again=make('div','v3Again');TopoRoute.STAGES.forEach((s,n)=>{if(n<c.r.stage){const b=btn('',press(()=>v2Card(c.id)?.querySelectorAll('.routeStep')[n]));b.append(icon('v3again'),make('span',null,STAGE[s]));b.setAttribute('aria-label',STAGE[s]+' opnieuw');again.append(b);}});panel.append(again);}
 }

 function renderRewards(m){
  const h=make('h1','v3ScreenTitle','Beloningen');h.id='v3RewardsTitle';h.tabIndex=-1;
  const S=state.slices|0,P=state.pizzas|0,T=state.trips|0,isl=m.chapters.find(c=>c.id==='islands');
  // Postcards as the Reisboekje earns them (V2): two after the islands chapter, one after the 3rd and 6th ride.
  const cards=(isl?.done?2:0)+(T>=3)+(T>=6),gold=m.chapters.filter(c=>c.gold).length;
  const tile=(cls,iconSrc,value,label,aria)=>{const t=make('div','v3Tile'+(cls?' '+cls:''));t.setAttribute('role','group');t.setAttribute('aria-label',aria);if(iconSrc)t.append(pic(iconSrc,'v3TileIcon',96,96));const v=make('b',null,value);v.setAttribute('aria-hidden','true');const l=make('span',null,label);l.setAttribute('aria-hidden','true');t.append(v,l);return t;};
  const openBook=e=>{e.stopPropagation();window.TopoBook?.open(e.currentTarget);};
  const book=make('div','v3Book'),cover=btn('',openBook,'v3Btn v3BookCover');cover.setAttribute('aria-label','Open het Reisboekje');cover.tabIndex=-1;
  if(art.cover)cover.append(img(art.cover,'v3CoverArt'));book.append(cover,btn('Open Reisboekje',openBook,'v3Btn primary'));
  const ride=make('div','v3Ride');ride.setAttribute('role','group');ride.setAttribute('aria-label',T+' Vespa-ritten; '+(P%3)+' van 3 pizza’s tot de volgende rit');
  // R-beloningen (fase B, stap 6): the ride's three pizzas above the Vespa, as the data has them (3 per ride, V2 order
  // margherita, salami, quattro formaggi): earned ones whole, the current one with its slices over a faint whole, the rest faint.
  // The art is V2's 3×3 sprite of 0–8 slices. Decoration: the ride's aria-label already says how many.
  const PZ=window.TOPO_PIZZA_ART?.assets,pz=make('div','v3RidePizzas');pz.setAttribute('aria-hidden','true');
  if(PZ)['margherita','salami','quattro-formaggi'].forEach((k,i)=>{if(!PZ[k])return;const n=i<P%3?8:i===P%3?Math.min(8,S):0,e=make('span','v3RidePizza'+(i<P%3?' on':i===P%3?' now':''));
   e.style.setProperty('--v3-pz','url("'+PZ[k]+'")');e.style.setProperty('--v3-pz-pos',(n%3*50)+'% '+(Math.floor(n/3)*50)+'%');e.dataset.slices=n;pz.append(e);});
  if(pz.children.length)ride.append(pz);
  if(V3ART?.vespa)ride.append(pic(V3ART.vespa,'v3RideArt',1200,900));
  const meter=make('div','v3Steps v3RideSteps');meter.setAttribute('aria-hidden','true');for(let i=0;i<3;i++){const s=make('i');if(i<P%3)s.className='on';meter.append(s);}
  const rv=make('b',null,String(T));rv.setAttribute('aria-hidden','true');const rl=make('span',null,'Vespa-ritten');rl.setAttribute('aria-hidden','true');ride.append(rv,rl,meter);
  const tiles=make('div','v3Tiles');
  tiles.append(tile('v3TilePizza',V3ART?.icons.pizza,S+' / 8','Pizza '+(P+1),S+' van 8 stukjes van pizza '+(P+1)),tile('',V3ART?.icons.stamp,m.done+' / 11','Stempels',m.done+' van 11 stempels'),tile('',V3ART?.icons.gold,gold+' / 11','Goud',gold+' van 11 goudzegels'),tile('',V3ART?.icons.postcard,cards+' / 4','Postkaarten',cards+' van 4 postkaarten'));
  rewardsView.replaceChildren(h,book,ride,tiles);
 }
 function renderSwitch(){
  let sw=tools.querySelector('.v3Switch');
  if(!sw){sw=make('div','v3Switch');sw.setAttribute('role','group');sw.setAttribute('aria-label','Kaartstijl');
   for(const [k,label] of [[false,'Schoolkaart'],[true,'Reliëf']]){const b=btn(label,e=>{e.stopPropagation();ui.relief=k;render();});b.dataset.relief=String(k);sw.append(b);}
   tools.append(sw);}
  // Map tools: Schoolblad (V3.0 § 5, schoolblad.js) beside the map style switch.
  if(window.TOPO_V3?.schoolblad&&!tools.querySelector('.v3SchoolBtn'))tools.prepend(window.TOPO_V3.schoolblad.button('v3SchoolBtn'));
  sw.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.relief===String(ui.relief))));
 }
 function render(){
  const home=$('#routeHome');if(!home)return;
  if(root.parentNode!==home)home.prepend(root);
  root.dataset.theme=window.TOPO_V3_THEME||'viola';
  const m=model();
  if(!ui.selected||!m.chapters.some(c=>c.id===ui.selected))ui.selected=(m.active&&m.chapters.find(c=>c.id===m.active.chapterId)||m.next||m.chapters.at(-1)).id;
  const c=m.chapters.find(x=>x.id===ui.selected);
  // Backdrop: BG-01 (BG-02/BG-03 in the preview), full-bleed behind the window; the V2 panorama only as fallback.
  const pano=V3ART?.bg?.[window.TOPO_V3_BG||'bg01']||V3ART?.bg?.bg01||$('.routeScene img')?.currentSrc||$('.routeScene img')?.src;
  if(pano&&!document.body.style.getPropertyValue('--v3-pano'))document.body.style.setProperty('--v3-pano','url("'+pano+'")');
  root.dataset.view=views[ui.view]?ui.view:'reis';root.dataset.kaart=ui.kaart;
  markNav(root);
  renderTop(m);renderRows(m);renderPanel(m,c);renderSwitch();paintMap(c);renderRewards(m);
  if(renderers[root.dataset.view])try{renderers[root.dataset.view](views[root.dataset.view],m);}catch(e){console.error('V3 view',e);}
 }
 // V2 chrome steps aside while Reis is shown; lessons and other screens keep V2 as is.
 function chrome(){const on=!$('#journeyScreen')?.classList.contains('hidden')&&!$('#routeHome')?.classList.contains('hidden');document.body.classList.toggle('v3Home',on);}
 new MutationObserver(chrome).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
 const base=renderRouteHome;
 renderRouteHome=function(...a){const out=base.apply(this,a);try{render();chrome();}catch(e){console.error('V3 Reis',e);}return out;};
 document.body.classList.add('v3On');
 window.TOPO_V3={render,model,ui,makeSide,markNav,addView,cloneMap,fit,addIsland,icon,make,btn,pic,img,press,v2Card,v2Nav,STAGE,KIND,range,scenes,art:V3ART,nino,root};
 if(!$('#journeyScreen')?.classList.contains('hidden')){render();chrome();}
})();
