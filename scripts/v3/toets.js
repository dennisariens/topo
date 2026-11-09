/* TOPO V3.0 — Toets (docs/v3/V3_0_REST.md § 2): set-up, the toets in the lesson shell, result.
   The engine is the V2 toets: resetExam, next, grade, finishExam, #testFormat. V3 only configures it (the chosen
   chapters and length are handed to resetExam as its pool; the form is #testFormat), records what V2 graded, and shows
   the result. A toets gives no rewards: while the V2 toets runs, TopoLearning.award returns "no reward" (no point, no
   pizza, no ride; DECISIONS). The last 10 results live under their own key and travel in the reservekopie. */
(function setupV3Toets(){
 'use strict';
 const V=window.TOPO_V3;if(!V||!V.shell)return;
 const {make,btn,ui}=V,sh=V.shell,$=s=>document.querySelector(s),SVGNS='http://www.w3.org/2000/svg';
 const KEY='topo-v3-toetsen-v1',MAX=10;
 const FORMS=[['point','Aanwijzen'],['write','Namen schrijven'],['both','Beide']];
 const byId=Object.fromEntries(ITEMS.map(i=>[i.id,i])),chapterIds=ROUTE_CHAPTERS.map(c=>c.id);
 const title=id=>ROUTE_CHAPTERS.find(c=>c.id===id)?.title||id;

 /* Storage (schema 1): {schema:1, results:[newest first, at most 10]}; one result:
    {at, chapters:[ids], form:'point'|'write'|'both', length:10|20|0 (alle), total, correct,
     items:[{id, mode:'point'|'write', ok, given?:string|null}]}. Invalid data reads as no results. */
 const validItem=x=>x&&byId[x.id]&&['point','write'].includes(x.mode)&&typeof x.ok==='boolean'&&(x.given==null||typeof x.given==='string'&&x.given.length<=80);
 const validResult=r=>r&&typeof r.at==='string'&&!isNaN(Date.parse(r.at))&&Array.isArray(r.chapters)&&r.chapters.length>0&&r.chapters.every(id=>chapterIds.includes(id))
  &&['point','write','both'].includes(r.form)&&[0,10,20].includes(r.length)&&Number.isSafeInteger(r.total)&&r.total>0&&Number.isSafeInteger(r.correct)&&r.correct>=0&&r.correct<=r.total
  &&Array.isArray(r.items)&&r.items.length===r.total&&r.items.every(validItem)&&r.items.filter(x=>x.ok).length===r.correct;
 const valid=d=>d&&d.schema===1&&Array.isArray(d.results)&&d.results.length<=MAX&&d.results.every(validResult);
 function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');return valid(d)?d.results:[];}catch{return [];}}
 function store(results){try{localStorage.setItem(KEY,JSON.stringify({schema:1,results:results.slice(0,MAX)}));return true;}catch{return false;}}

 // Reservekopie: the V2 export gains a field `v3Toetsen` (V2 import ignores unknown fields, so old and new copies
 // stay valid both ways). The V2 export builds its file with `new Blob`; V3 adds the field to that JSON only.
 const exp=$('#exportProgress');
 if(exp&&typeof exp.onclick==='function'){const orig=exp.onclick;exp.onclick=function(e){
  const B=window.Blob;
  window.Blob=function(parts,opts){try{if(parts?.length===1&&typeof parts[0]==='string'){const d=JSON.parse(parts[0]);if(d?.app==='topo-italie'){d.v3Toetsen={schema:1,results:load()};parts=[JSON.stringify(d,null,2)];}}}catch{}return new B(parts,opts);};
  try{return orig.call(this,e);}finally{window.Blob=B;}
 };}
 // Import: after V2 restored the progress, results from the copy replace the stored ones; a copy without results
 // (older copies) leaves them as they are.
 const file=$('#backupFile');
 if(file&&typeof file.onchange==='function'){const orig=file.onchange;file.onchange=async function(e){
  let extra;try{const f=e.target.files?.[0];if(f&&f.size<=1000000)extra=JSON.parse(await f.text())?.v3Toetsen;}catch{}
  const r=await orig.call(this,e);
  if(extra!==undefined&&valid(extra)&&/^Je voortgang is teruggezet/.test($('#backupStatus')?.textContent||''))store(extra.results);
  return r;
 };}
 // Begin helemaal opnieuw (V2 settings) starts fresh: the results go with the progress.
 document.addEventListener('click',e=>{if(!e.target.closest?.('.ninoResetDanger'))return;const before=localStorage.getItem('topo-italie-v3');
  queueMicrotask(()=>{try{if(localStorage.getItem('topo-italie-v3')!==before)localStorage.removeItem(KEY);}catch{}});},true);

 /* Set-up (§ 2.1): chapters (default: completed ones, otherwise all), form, length; one button Start toets. */
 const completed=()=>ROUTE_CHAPTERS.filter(c=>TopoRoute.record(state.route,c.id).stage===3).map(c=>c.id);
 const pick={chapters:null,form:'both',length:10};
 const chosen=()=>pick.chapters||(completed().length?completed():chapterIds.slice());
 const poolFor=ids=>ITEMS.filter(i=>ROUTE_CHAPTERS.some(c=>ids.includes(c.id)&&c.itemIds.includes(i.id)));
 const lengths=n=>[...(n>10?[[10,'10']]:[]),...(n>20?[[20,'20']]:[]),[0,'Alle']];
 const choice=(list,on,set)=>{const w=make('div','v3Chips');w.setAttribute('role','group');for(const [v,label] of list){const b=sh.chip(label,on(v),()=>{set(v);V.render();});b.dataset.value=String(v);w.append(b);}return w;};
 V.addView('toets','Toets',view=>{
  const h=make('h1',null,'Toets');h.id='v3ToetsTitle';h.tabIndex=-1;
  const ids=chosen(),n=poolFor(ids).length;
  const toggle=id=>{const cur=chosen();if(id==='all')pick.chapters=cur.length===chapterIds.length?[]:chapterIds.slice();else pick.chapters=cur.includes(id)?cur.filter(x=>x!==id):chapterIds.filter(x=>x===id||cur.includes(x));};
  const chapters=sh.groupChips(id=>id==='all'?ids.length===chapterIds.length:ids.includes(id),toggle,{extra:[['all','Alles']]});
  const lens=lengths(n);if(!lens.some(([v])=>v===pick.length))pick.length=0;
  const start=btn('Start toets',e=>{e.stopPropagation();startToets();},'v3Btn primary v3Start');start.disabled=!n;
  view.replaceChildren(h,sh.field('Hoofdstukken',chapters,'v3ToetsHoofdstukken'),sh.field('Vorm',choice(FORMS,v=>pick.form===v,v=>{pick.form=v;}),'v3ToetsVorm'),
   sh.field('Lengte',choice(lens,v=>pick.length===v,v=>{pick.length=v;}),'v3ToetsLengte'),start);
 });

 /* The toets: V2 runs it. resetExam takes its pool from groupItems(); for this one call V3 hands it the chosen,
    shuffled and shortened pool. Grading, mistakes, skills and the daily goal stay V2. */
 let run=null,last=null,suppress=false;
 function startToets(){
  const ids=chosen();let pool=TopoLearning.shuffle(poolFor(ids));if(!pool.length)return;
  if(pick.length&&pool.length>pick.length)pool=pool.slice(0,pick.length);
  ui.view='reis';
  V.v2Nav('Oefenen')?.click();
  const f=$('#testFormat');if(f)f.value=pick.form;
  run={chapters:ids,form:pick.form,length:pick.length,items:[]};
  const orig=groupItems;groupItems=()=>pool.slice();
  try{$('nav.tabs .tab[data-mode="exam"]')?.click();}finally{groupItems=orig;}
  if(state.mode!=='exam'||state.examTotal!==pool.length)run=null;
 }
 // No rewards in a toets: no point, no pizza, no ride, no "good" count (the V2 reward counter).
 const award=TopoLearning.award;
 TopoLearning.award=function(progress){if(state.mode==='exam')return {pizza:false,trip:false,...TopoLearning.journey((progress?.trips|0)+1)};return award.apply(this,arguments);};
 // Record what V2 graded, per question.
 const v2grade=grade;
 grade=function(ok,clicked,skipped){
  const before=state.examAnswered|0,item=state.current,mode=state.questionMode,typed=($('#answer')?.value||'').trim().slice(0,80);
  const r=v2grade.apply(this,arguments);
  if(run&&state.mode==='exam'&&item&&(state.examAnswered|0)===before+1)run.items.push(ok?{id:item.id,mode,ok:true}:{id:item.id,mode,ok:false,given:skipped?null:mode==='write'?typed||null:clicked?.name||null});
  return r;
 };
 // The result: V3 shows it instead of the V2 result dialog.
 const dlg=$('dialog.ninoExamResult');if(dlg)dlg.showModal=function(){if(suppress)return;return HTMLDialogElement.prototype.showModal.call(this);};
 const v2finish=finishExam;
 finishExam=function(){
  suppress=!!run;let r;try{r=v2finish.apply(this,arguments);}finally{suppress=false;}
  if(!run)return r;
  const res={at:new Date().toISOString(),chapters:run.chapters,form:run.form,length:run.length,total:state.examTotal|0,correct:state.examCorrect|0,items:run.items};run=null;
  if(validResult(res))store([res,...load()]);
  last=res;sh.toHome();sh.show('toetsResult','v3ToetsScore');
  return r;
 };

 /* Result (§ 2.3): score, one Nino pose, the real map with ✓/×, the mistakes, Oefen deze fouten, delen and print. */
 function marks(svg,r){
  const g=document.createElementNS(SVGNS,'g');g.setAttribute('class','v3Marks');g.setAttribute('aria-hidden','true');svg.append(g);
  for(const x of r.items){
   const nodes=[...svg.querySelectorAll('[data-id="'+x.id+'"]')];nodes.forEach(n=>n.classList.add('v3Hit',x.ok?'v3Ok':'v3Bad'));
   let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
   for(const n of nodes){try{const b=n.getBBox();if(!b.width&&!b.height)continue;x0=Math.min(x0,b.x);y0=Math.min(y0,b.y);x1=Math.max(x1,b.x+b.width);y1=Math.max(y1,b.y+b.height);}catch{}}
   if(!isFinite(x0))continue;
   const cx=(x0+x1)/2,cy=(y0+y1)/2,m=document.createElementNS(SVGNS,'g');m.setAttribute('class','v3Mark '+(x.ok?'ok':'bad'));m.dataset.id=x.id;
   m.innerHTML='<circle cx="'+cx+'" cy="'+cy+'" r="13"/><text x="'+cx+'" y="'+(cy+5.5)+'" text-anchor="middle">'+(x.ok?'✓':'×')+'</text>';
   if(!x.ok){const t=document.createElementNS(SVGNS,'text');t.setAttribute('class','v3MarkName');t.setAttribute('x',cx+18);t.setAttribute('y',cy+5);t.textContent=byId[x.id].name;m.append(t);}
   g.append(m);
  }
  return g;
 }
 const scoreText=r=>r.correct+' / '+r.total;
 const shareText=r=>'Ik heb de NINO-toets Topografie Italië gemaakt.\nOnderwerp: '+(r.chapters.length===chapterIds.length?'Alles':r.chapters.map(title).join(', '))+'\nScore: '+r.correct+' van '+r.total+' goed.';
 function mistakeList(r){
  const ul=make('ul','v3ToetsFouten');
  for(const x of r.items.filter(x=>!x.ok)){const li=make('li');li.append(make('strong',null,byId[x.id].name),make('span',null,x.given?'jij: '+x.given:'overgeslagen'));ul.append(li);}
  return ul;
 }
 let mapSvg=null;
 // As on Reis: outside the drawn sea the canvas takes the school-map sea colour.
 const seaColour=svg=>{const sea=svg.querySelector('.sea');if(sea)svg.style.setProperty('--v3-sea-school',getComputedStyle(sea).fill);};
 V.addView('toetsResult','Toetsuitslag',view=>{
  const r=last;if(!r){ui.view='toets';return;}
  if(view.dataset.at===r.at)return;view.dataset.at=r.at;
  const perfect=r.correct===r.total,head=make('div','v3ToetsHead');
  const h=make('h1','v3ToetsScore',scoreText(r));h.id='v3ToetsScore';h.tabIndex=-1;h.setAttribute('aria-label',r.correct+' van '+r.total+' goed');
  const nino=make('div','v3ToetsNino');try{nino.append(TopoArt.create(document,{role:perfect?'success':'encourage'},'exam-result'));}catch{}
  head.append(nino,h);
  const map=make('figure','v3ToetsKaart');map.setAttribute('aria-label','Kaart met je antwoorden');
  const wrong=r.items.filter(x=>!x.ok),side=make('div','v3ToetsSide');
  if(wrong.length){const f=make('section','v3Field');const h2=make('h2',null,'Fouten');h2.id='v3ToetsFoutenTitel';f.setAttribute('aria-labelledby',h2.id);f.append(h2,mistakeList(r));side.append(f);}
  const status=make('p','v3ToetsStatus');status.setAttribute('role','status');
  const actions=make('div','v3ToetsActions'),text=shareText(r);
  if(wrong.length)actions.append(btn('Oefen deze fouten',e=>{e.stopPropagation();sh.practice(r.form==='write'?'write':'point','mistakes');},'v3Btn primary v3ToetsOefen'));
  const again=btn('Nieuwe toets',e=>{e.stopPropagation();sh.show('toets','v3ToetsTitle');},'v3Btn'+(wrong.length?'':' primary'));
  const copy=btn('Kopieer',async e=>{e.stopPropagation();try{await navigator.clipboard.writeText(text);status.textContent='Score gekopieerd.';}catch{const t=make('textarea','v3ToetsCopy');t.readOnly=true;t.value=text;t.setAttribute('aria-label','Scoretekst');status.replaceChildren(t);t.focus();t.select();}},'v3Btn v3ToetsKopieer');
  const mail=make('a','v3Btn v3ToetsMail','E-mail');mail.href='mailto:?subject='+encodeURIComponent('Mijn NINO-toetsscore')+'&body='+encodeURIComponent(text);
  const printBtn=btn('Print',e=>{e.stopPropagation();print(r);},'v3Btn v3ToetsPrint');
  actions.append(again,copy,mail,printBtn);side.append(actions,status);
  const bodyGrid=make('div','v3ToetsBody');bodyGrid.append(map,side);
  view.replaceChildren(head,bodyGrid);
  mapSvg=V.cloneMap('v3t-','v3ToetsMap');mapSvg?.classList.add('v3Map');
  if(mapSvg){map.append(mapSvg);mapSvg.dataset.relief='off';seaColour(mapSvg);marks(mapSvg,r);V.fit(mapSvg);}
 });

 // Print A4: name, date, score, map, mistakes. A separate sheet; only it prints.
 function print(r){
  const sheet=make('section','v3Print');
  const name=(()=>{try{return TopoProfile.exportProfile()?.name||'';}catch{return '';}})();
  const date=new Date(r.at).toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'});
  sheet.append(make('h1',null,'Toets Topografie Italië'));
  const meta=make('p','v3PrintMeta');meta.append(make('span',null,name?'Naam: '+name:'Naam: ____________________'),make('span',null,date));sheet.append(meta);
  sheet.append(make('p','v3PrintScore',r.correct+' van '+r.total+' goed'),make('p','v3PrintOnderwerp',r.chapters.length===chapterIds.length?'Alles':r.chapters.map(title).join(' · ')));
  const svg=V.cloneMap('v3p-','v3PrintMap');
  if(svg&&mapSvg){svg.classList.add('v3Map');svg.setAttribute('viewBox',mapSvg.getAttribute('viewBox'));svg.dataset.relief='off';svg.style.setProperty('--v3-sea-school',mapSvg.style.getPropertyValue('--v3-sea-school'));
   for(const x of r.items)svg.querySelectorAll('[data-id="'+x.id+'"]').forEach(n=>n.classList.add('v3Hit',x.ok?'v3Ok':'v3Bad'));
   const m=mapSvg.querySelector('.v3Marks');if(m)svg.append(m.cloneNode(true));sheet.append(svg);}
  if(r.items.some(x=>!x.ok)){sheet.append(make('h2',null,'Fouten'),mistakeList(r));}
  document.body.append(sheet);document.body.classList.add('v3Printing');
  const done=()=>{sheet.remove();document.body.classList.remove('v3Printing');removeEventListener('afterprint',done);};
  addEventListener('afterprint',done);
  window.print();
 }

 V.toets={load,valid,KEY,get last(){return last;}};
})();
