/* TOPO #52: presentation-only wide desktop refinement. Never duplicate quiz/grader, modify geographic data, or replace compact Focus Mode. */
function setupCalmDesktop52(){
 const nav=document.querySelector('body>nav.tabs'),header=document.querySelector('body>header'),layout=document.querySelector('main.layout');
 if(!nav||!header||!layout)return;
 const $=s=>document.querySelector(s);
 const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 const context=make('div','ux52Context');
 const kicker=make('span','ux52ContextKicker','JOUW LEERPAD');
 const chapter=make('strong','ux52ContextChapter','Italië');
 context.append(kicker,chapter);nav.prepend(context);
 const gold=make('button','ux52Gold','★ Gold-toets');gold.type='button';gold.id='ux52Gold';gold.disabled=true;gold.title='Gold opent na Ontdekken, Aanwijzen en Schrijven';
 nav.append(gold);
 const today=make('span','ux52Today');today.id='ux52Today';header.append(today);
 const menu=make('details','ux52Menu');menu.id='ux52Menu';
 const summary=make('summary','ux52MenuToggle','☰ Menu');summary.setAttribute('aria-label','Open het menu met leerroute en hulpmiddelen');
 menu.append(summary);
 const panel=make('div','ux52MenuPanel');menu.append(panel);
 const section=(label)=>{const box=make('section','ux52MenuGroup');box.append(make('h2','',label));panel.append(box);return box;};
 const learning=section('Leren en toetsen');
 const tools=section('Kaart en hulpmiddelen');
 const progress=section('Voortgang en instellingen');
 const shortcut=(where,title,selector,opts={})=>{
  const b=make('button','ux52MenuItem',title);b.type='button';
  b.addEventListener('click',()=>{
   const actual=$(selector);if(!actual||actual.disabled)return;
   menu.open=false;actual.click();if(opts.focus && actual.isConnected && !actual.hidden){actual.focus({preventScroll:true});}
  });
  where.append(b);return b;
 };
 shortcut(learning,'Mijn leerroute','nav.tabs .tab[data-mode="route"]');
 shortcut(learning,'Vrije toets','nav.tabs .tab[data-mode="exam"]');
 const trouble=make('button','ux52MenuItem','Lastige namen oefenen');trouble.type='button';
 trouble.addEventListener('click',()=>{menu.open=false;if(state.mode==='route'||state.mode==='exam')mode('point');$('#mistakes')?.click();});learning.append(trouble);
 shortcut(tools,'Print leerkaart','#printMap');
 shortcut(tools,'Reservekopie opslaan','#exportProgress');
 shortcut(tools,'Reservekopie terugzetten','#importProgress');
 shortcut(progress,'Antwoord tonen','#reveal');
 shortcut(progress,'Pizza’s resetten','#resetPizza');
 shortcut(progress,'Alle voortgang resetten','#resetAll');
 header.append(menu);

 const realStepButtons=[...nav.querySelectorAll('.tab[data-mode="learn"],.tab[data-mode="point"],.tab[data-mode="write"]')];
 for(const b of realStepButtons){
  const step=b.dataset.mode;
  const labels={learn:['01','Ontdekken'],point:['02','Aanwijzen'],write:['03','Schrijven']};
  b.textContent='';
  b.append(make('span','ux52StepNumber',labels[step][0]),make('span','ux52StepText',labels[step][1]));
 }
 let currentDesktop=null;
 const isDesktop=()=>window.innerWidth>1180&&!(window.innerWidth<=1440&&window.matchMedia?.('(pointer:coarse)').matches);
 const chapterId=()=>{
  if(state.mode==='route'){
   if(state.route?.active?.chapterId&&state.route.active.chapterId!=='smart')return state.route.active.chapterId;
   return ROUTE_CHAPTERS.find(ch=>TopoRoute.record(state.route,ch.id).stage<3)?.id||ROUTE_CHAPTERS.at(-1)?.id;
  }
  const candidate=$('#groupSelect')?.value;
  if(candidate&&ROUTE_CHAPTERS.some(ch=>ch.id===candidate))return candidate;
  return ROUTE_CHAPTERS.find(ch=>TopoRoute.record(state.route,ch.id).stage<3)?.id || ROUTE_CHAPTERS.at(-1)?.id;
 };
 const refresh=()=>{
  const desktop=isDesktop();
  if(currentDesktop!==desktop){currentDesktop=desktop;document.body.dataset.ux52Desktop=String(desktop);menu.open=false;}
  if(!desktop)return;
  const id=chapterId();
  const active=state.mode==='route'?state.route?.active:null;
  const route=ROUTE_CHAPTERS.find(c=>c.id===id);
  chapter.textContent=active&&active.chapterId!=='smart'?(ROUTE_TITLES[id]||id):($('#groupSelect')?.selectedOptions?.[0]?.textContent||route?.title||'Italië');
  const rec=id?TopoRoute.record(state.route,id):null;
  const modeName=active&&!active.done?active.kind:state.mode==='learn'?'learn':state.mode==='point'?'point':state.mode==='write'?'write':'';
  const stages={discover:'learn',point:'point',write:'write'};
  for(const b of realStepButtons){
   const stage=b.dataset.mode;
   b.classList.toggle('ux52StepCurrent',stage===(stages[modeName]||modeName));
   if(state.mode==='route'&&rec){
    const ix={learn:0,point:1,write:2}[stage];
    b.setAttribute('aria-disabled',String(ix>rec.stage));
    if(ix>rec.stage)b.title='Rond eerst de vorige stap af';
    else b.removeAttribute('title');
   }else{b.removeAttribute('aria-disabled');b.removeAttribute('title');}
  }
  const available=!!rec&&rec.stage===3&&!!id&&TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,id);
  gold.disabled=!available;
  gold.title=available?'Start de optionele Gold-toets van dit hoofdstuk':'Gold opent na de drie leerstappen';
  gold.setAttribute('aria-label',available?'Gold-toets starten voor '+(ROUTE_TITLES[id]||id):'Gold-toets is nog vergrendeld');
  gold.classList.toggle('ux52GoldEarned',!!rec?.goldAt);
  const n=state.daily?.date===localDay()?state.daily.correct:0;
  today.textContent='Vandaag · '+n+' / 8';
  today.title='Bestaande dagdoel: acht goede antwoorden. Geen extra beloning of verplichting.';
 };
 nav.addEventListener('click',e=>{
  if(!isDesktop()||state.mode!=='route')return;
  const b=e.target.closest('.tab[data-mode="learn"],.tab[data-mode="point"],.tab[data-mode="write"]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  const id=chapterId(),stage={learn:'discover',point:'point',write:'write'}[b.dataset.mode];
  const index={discover:0,point:1,write:2}[stage];
  if(!id||TopoRoute.record(state.route,id).stage<index||!TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,id))return;
  startRouteLesson(id,stage);
  queueMicrotask(refresh);
 },true);
 gold.addEventListener('click',()=>{
  if(!isDesktop()||gold.disabled)return;
  const id=chapterId();
  if(!id||TopoRoute.record(state.route,id).stage!==3)return;
  if(state.mode!=='route')mode('route');
  startRouteLesson(id,'gold');queueMicrotask(refresh);
 });
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();menu.open=false;summary.focus({preventScroll:true});}});
 document.addEventListener('pointerdown',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false;});
 window.addEventListener('resize',refresh);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 const group=$('#groupSelect');group?.addEventListener('change',()=>queueMicrotask(refresh));
 const observer=new MutationObserver(()=>{queueMicrotask(refresh);});
 for(const node of [layout,$('#routeLessonTitle'),$('#routeLessonCount'),$('#good'),$('#dailyText'),$('.tabs .tab')]){
  if(node)observer.observe(node,{childList:true,characterData:true,subtree:node!==layout,attributes:node===layout,attributeFilter:node===layout?['class']:undefined});
 }
 // Mode handlers already exist. All added controls only dispatch to existing original handlers.
 window.TopoUX52={refresh,get desktop(){return isDesktop()}};
 refresh();
}
setupCalmDesktop52();
