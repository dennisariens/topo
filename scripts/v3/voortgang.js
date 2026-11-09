/* TOPO V3.0 — Voortgang (docs/v3/V3_0_REST.md § 3): places on the real map, the chapters, the daily goal, the
   kennis-paspoort and the toets results. Everything is read from V2; nothing is computed anew:
   * per place the V2 kennis-paspoort (its own table, moved here) gives the labels for Vinden and Naam; a place is
     "beheerst" when both read "Goed onthouden", "bezig" when at least one is not "Nog oefenen", otherwise "nog niet"
     (threshold in DECISIONS);
   * chapters: TopoRoute.record (stage 0–3, goud); daily goal: V2 renderDailyGoal → #dailyProgress (of 8);
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

  // Kop: n / 45 plekken.
  const head=make('div','v3VgHead');const big=make('p','v3VgCount');big.append(make('strong',null,count+' / '+ITEMS.length),make('span',null,' plekken'));
  head.append(big,bar(count,ITEMS.length,'v3VgBar'));head.lastChild.setAttribute('aria-label','Plekken beheerst');

  // Kaart: each place coloured by its status; legend.
  const fig=make('figure','v3VgKaart');
  const svg=V.cloneMap('v3v-','v3VgMap');
  if(svg){svg.classList.add('v3Map');svg.dataset.relief='off';fig.append(svg);
   const sea=svg.querySelector('.sea');
   for(const p of pp)svg.querySelectorAll('[data-id="'+p.item.id+'"]').forEach(n=>{n.classList.add('v3Hit','v3St-'+p.status);if(p.item.kind==='river')n.classList.add('v3StLine');});
   requestAnimationFrame(()=>{if(sea)svg.style.setProperty('--v3-sea-school',getComputedStyle(sea).fill);V.fit(svg);});}
  const legend=make('ul','v3VgLegend');for(const [k,label] of Object.entries(STATUS)){const li=make('li','v3St-'+k);li.append(make('i'),make('span',null,label+' · '+pp.filter(p=>p.status===k).length));legend.append(li);}
  fig.append(legend);fig.setAttribute('aria-label',count+' van '+ITEMS.length+' plekken beheerst');

  // Hoofdstukken: three lesson bars, ✓ and goud.
  const list=make('ol','v3VgChapters');
  ROUTE_CHAPTERS.forEach((c,i)=>{const r=TopoRoute.record(state.route,c.id),li=make('li');li.dataset.chapter=c.id;
   const steps=make('span','v3VgSteps');steps.setAttribute('aria-hidden','true');for(let n=0;n<3;n++){const s=make('i');if(n<r.stage)s.className='on';steps.append(s);}
   const done=make('span','v3VgDone',r.stage===3?'✓':''),gold=make('span','v3VgGold',r.goldAt>0?'★':'');
   li.setAttribute('aria-label',c.title+': '+r.stage+' van 3 lessen'+(r.goldAt>0?', goud':''));
   li.append(make('span','v3VgNum',String(i+1)),make('span','v3VgName',c.title),steps,done,gold);list.append(li);});

  // Dagdoel (V2).
  try{renderDailyGoal();}catch{}
  const today=Math.min(8,+($('#dailyProgress')?.value||0));
  const daily=make('p','v3VgDaily');daily.append(make('strong',null,today+' / 8'));

  // Toetsuitslagen.
  const results=V.toets?.load?.()||[],rl=make('ol','v3VgToetsen');
  for(const r of results){const li=make('li');li.append(make('span','v3VgDate',fmt(r.at)),make('span','v3VgOnderwerp',r.chapters.length===ROUTE_CHAPTERS.length?'Alles':r.chapters.map(id=>ROUTE_CHAPTERS.find(c=>c.id===id)?.title).join(', ')),make('strong',null,r.correct+' / '+r.total));rl.append(li);}
  const toetsen=results.length?rl:make('p','v3VgEmpty','Nog geen toetsen.');

  const pass=make('div','v3VgPaspoort');if(mastery){pass.append(mastery);}

  const side=make('div','v3VgSide');
  side.append(section('Hoofdstukken','v3VgHoofdstukken',list),section('Dagdoel','v3VgDagdoel',daily,bar(today,8,'v3VgDailyBar')),section('Toetsen','v3VgToetsTitel',toetsen));
  const grid2=make('div','v3VgGrid');grid2.append(fig,side);
  view.replaceChildren(h,head,grid2,section('Kennis-paspoort','v3VgPaspoortTitel',pass));
 });
 V.voortgang={passport};
})();
