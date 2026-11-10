/* TOPO V3.0 — Voortgang (docs/v3/V3_0_REST.md § 3): places on the real map, the chapters, the daily goal, the
   kennis-paspoort and the toets results. Everything is read from V2; nothing is computed anew:
   * per place the V2 kennis-paspoort (its own table, moved here) gives the labels for Vinden and Naam; a place is
     "beheerst" when both read "Goed onthouden", "bezig" when at least one is not "Nog oefenen", otherwise "nog niet"
     (threshold in DECISIONS);
   * chapters: TopoRoute.record (stage 0–3, goud) and TopoRoute.unlocked; daily goal: V2 renderDailyGoal → #dailyProgress (of 8);
   * pizza's and Vespa-ritten: V2 state.pizzas and state.trips, as in Beloningen;
   * toets results: the last 10 from toets.js. No streak (rejected earlier). */
(function setupV3Voortgang(){
 'use strict';
 const V=window.TOPO_V3;if(!V||!V.shell)return;
 const {make,STAGE}=V,$=s=>document.querySelector(s);
 const STATUS={beheerst:'Beheerst',bezig:'Bezig',nog:'Nog niet'};
 const mastery=$('details.mastery'),grid=$('#masteryGrid');

 // The V2 paspoort builds its table when opened; it is moved into Voortgang and rebuilt on every visit.
 function passport(){
  if(!mastery||!grid)return null;
  mastery.open=true;mastery.dispatchEvent(new Event('toggle'));
  const rows=[...grid.querySelectorAll('tbody tr')];if(rows.length!==ITEMS.length)return null;
  return ITEMS.map((item,n)=>{const [find,name]=[...rows[n].querySelectorAll('td')].map(td=>td.textContent.trim());
   const status=find==='Goed onthouden'&&name==='Goed onthouden'?'beheerst':find!=='Nog oefenen'||name!=='Nog oefenen'?'bezig':'nog';
   return {item,find,name,status};});
 }
 const bar=(value,max,cls)=>{const b=make('div','v3Bar '+(cls||''));b.setAttribute('role','progressbar');b.setAttribute('aria-valuemin','0');b.setAttribute('aria-valuemax',String(max));b.setAttribute('aria-valuenow',String(value));const f=make('i');f.style.width=(max?value/max*100:0)+'%';b.append(f);return b;};
 const section=(title,id,...content)=>{const s=make('section','v3Field v3Card');const h=make('h2',null,title);h.id=id;s.setAttribute('aria-labelledby',id);s.append(h,...content);return s;};
 const fmt=at=>new Date(at).toLocaleDateString('nl-NL',{day:'numeric',month:'short'});

 V.addView('voortgang','Voortgang',view=>{
  const h=make('h1',null,'Voortgang');h.id='v3VoortgangTitle';h.tabIndex=-1;
  const pp=passport()||[],count=pp.filter(p=>p.status==='beheerst').length;

  // Titelbalk (R-voortgang): "Voortgang" and "n / 45" on one line, then a broad bar.
  const head=make('div','v3VgHead');const big=make('p','v3VgCount');big.append(make('strong',null,count+' / '+ITEMS.length),make('span',null,' plekken'));
  head.append(big,bar(count,ITEMS.length,'v3VgBar'));head.lastChild.setAttribute('aria-label','Plekken beheerst');
  const titleBar=make('div','v3VgTitleBar');titleBar.append(h,head);

  // Kaart: each place coloured by its status; legend.
  const fig=make('figure','v3VgKaart');
  const svg=V.cloneMap('v3v-','v3VgMap');
  if(svg){svg.classList.add('v3Map');svg.dataset.relief='off';fig.append(svg);
   const sea=svg.querySelector('.sea');
   for(const p of pp)svg.querySelectorAll('[data-id="'+p.item.id+'"]').forEach(n=>{n.classList.add('v3Hit','v3St-'+p.status);if(p.item.kind==='river')n.classList.add('v3StLine');});
   requestAnimationFrame(()=>{if(sea)svg.style.setProperty('--v3-sea-school',getComputedStyle(sea).fill);V.fit(svg);});}
  const legend=make('ul','v3VgLegend');for(const [k,label] of Object.entries(STATUS)){const li=make('li','v3St-'+k);li.append(make('i'),make('span',null,label+' · '+pp.filter(p=>p.status===k).length));legend.append(li);}
  // The card's caption (R-voortgang-doel): the map's subject; the count stays in the title bar.
  const cap=make('figcaption','v3VgKaartTitle','Italië');cap.append(make('span',null,ITEMS.length+' plekken'));
  fig.append(cap,legend);fig.setAttribute('aria-label',count+' van '+ITEMS.length+' plekken beheerst');

  // Hoofdstukken (R-voortgang, fase B stap 7): the chapter's real photo, "n. naam", one thick bar of the three lessons
  // (three segments, so the bar still reads the stage) and a status illustration: gold laurel (IC-gold) = goud, the
  // green check = klaar, the pizza slice (IC-slice) = open, the lock = nog dicht. All from TopoRoute.record.
  const list=make('ol','v3VgChapters'),M=V.model?.(),ART=V.art,SC=V.scenes||{};
  ROUTE_CHAPTERS.forEach((c,i)=>{const r=TopoRoute.record(state.route,c.id),li=make('li'),open=M?.chapters[i]?.open??true;li.dataset.chapter=c.id;
   const st=r.goldAt>0?'gold':r.stage===3?'done':open?'open':'locked';li.dataset.status=st;
   const thumb=make('span','v3VgThumb');thumb.setAttribute('aria-hidden','true');if(SC[c.id]?.mini)thumb.append(V.pic(SC[c.id].mini,null,480,270));
   const steps=make('span','v3VgSteps');steps.setAttribute('aria-hidden','true');for(let n=0;n<3;n++){const s=make('i');if(n<r.stage)s.className='on';steps.append(s);}
   const status=make('span','v3VgStatus');status.setAttribute('aria-hidden','true');
   if(st==='gold'&&ART?.icons?.gold)status.append(V.pic(ART.icons.gold,null,96,96));
   else if(st==='open'&&ART?.icons?.slice)status.append(V.pic(ART.icons.slice,null,96,96));
   else status.append(V.icon(st==='locked'?'v3lock':'v3checkmark'));
   li.setAttribute('aria-label',c.title+': '+r.stage+' van 3 lessen'+(r.goldAt>0?', goud':st==='locked'?', nog dicht':''));
   const name=make('span','v3VgName');name.append(make('span','v3VgNum',(i+1)+'.'),document.createTextNode(' '+c.title));
   li.append(thumb,name,steps,status);list.append(li);});

  // Dagdoel (V2).
  try{renderDailyGoal();}catch{}
  const today=Math.min(8,+($('#dailyProgress')?.value||0));
  const dots=make('span','v3VgDots');dots.setAttribute('aria-hidden','true');for(let n=0;n<8;n++){const d=make('i');if(n<today)d.className='on';dots.append(d);}
  // Pizza's and Vespa-ritten (V2 state, as Beloningen): the ride's pizzas of 3 and the rides so far.
  const P=state.pizzas|0,T=state.trips|0;
  const tile=(cls,src,lineIcon,label,value,aria,extra)=>{const t=make('section','v3VgTile '+cls);t.setAttribute('aria-label',aria);const ic=make('span','v3VgTileIcon');ic.setAttribute('aria-hidden','true');
   if(src)ic.append(V.pic(src,null,96,96));else ic.append(V.icon(lineIcon));const txt=make('span','v3VgTileText');const l=make('span','v3VgTileLabel',label),v=make('strong',null,value);l.setAttribute('aria-hidden','true');v.setAttribute('aria-hidden','true');txt.append(l,v);t.append(ic,txt);if(extra)t.append(extra);return t;};
  const dagdoel=tile('v3VgDagdoel',null,'v3target','Dagdoel',today+' / 8','Dagdoel: '+today+' van 8',dots);dagdoel.querySelector('.v3VgTileText').classList.add('v3VgDaily');
  const pd=make('span','v3VgDots v3VgPizzaDots');pd.setAttribute('aria-hidden','true');for(let n=0;n<3;n++){const d=make('i');if(n<P%3)d.className='on';pd.append(d);}
  const pizzas=tile('v3VgPizzas',ART?.icons?.pizza,'v3slice','Pizza’s',(P%3)+' / 3',(P%3)+' van 3 pizza’s tot de volgende rit',pd);
  const rides=tile('v3VgRides',ART?.icons?.vespa,'v3scooter','Vespa-ritten',String(T),T+' Vespa-ritten');

  // Toetsuitslagen.
  const results=V.toets?.load?.()||[],rl=make('ol','v3VgToetsen');
  for(const r of results){const li=make('li');li.append(make('span','v3VgDate',fmt(r.at)),make('span','v3VgOnderwerp',r.chapters.length===ROUTE_CHAPTERS.length?'Alles':r.chapters.map(id=>ROUTE_CHAPTERS.find(c=>c.id===id)?.title).join(', ')),make('strong',null,r.correct+' / '+r.total));rl.append(li);}
  const toetsen=results.length?rl:make('p','v3VgEmpty','Nog geen toetsen.');

  const pass=make('div','v3VgPaspoort');if(mastery){pass.append(mastery);}

  // Raster (12 kolommen): titelbalk; kaartkaart 1–7 en hoofdstukken 8–12; Dagdoel, Pizza's en Vespa-ritten; Toetsen; paspoort.
  const side=make('div','v3VgSide');side.append(section('Hoofdstukken','v3VgHoofdstukken',list));
  const grid2=make('div','v3VgGrid');grid2.append(fig,side);
  const row=make('div','v3VgRow');row.append(dagdoel,pizzas,rides);
  view.replaceChildren(titleBar,grid2,row,section('Toetsen','v3VgToetsTitel',toetsen),section('Kennis-paspoort','v3VgPaspoortTitel',pass));
 });
 V.voortgang={passport};
})();
