/* TOPO V3 — Reis / hoofdstukkeuze.
   Presentation layer over the V2 app: reads canonical state (state.route, ROUTE_CHAPTERS, TopoRoute)
   and never writes it. Every action clicks the existing V2 button, so the intro offer, Reis → Verder
   restore, confirmations and lesson start stay exactly as in V2. */
(function setupV3Reis(){
 'use strict';
 const art=NINO_V2_ART,$=s=>document.querySelector(s);
 const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const img=(key,cls)=>{const a=art[key],i=make('img',cls);i.src=a.src;i.width=a.width;i.height=a.height;i.alt='';i.decoding='async';return i;};
 const STAGE_LABEL={discover:'Ontdekken',point:'Aanwijzen',write:'Namen schrijven'};
 const KIND_LABEL={discover:'Ontdekken',point:'Aanwijzen',write:'Namen schrijven',gold:'Gouden proef',review:'Opfrissen',smart:'Slim rondje'};
 // Every V3 action: stop the event here, then press the original V2 control.
 const press=find=>e=>{e.stopPropagation();const b=find();if(b&&!b.disabled)b.click();};
 const v2Card=id=>$('#routeCards article[data-chapter="'+id+'"]');
 const btn=(text,onclick,cls='v3Btn')=>{const b=make('button',cls,text);b.type='button';b.addEventListener('click',onclick);return b;};
 let selected=null;
 // Keep "7–12" together: a range never breaks across lines.
 const titleNode=t=>{const f=document.createDocumentFragment();t.split(/(\d+–\d+)/).forEach(part=>{if(!part)return;if(/^\d+–\d+$/.test(part))f.append(make('span','nw',part));else f.append(part);});return f;};

 function model(){
  const chapters=ROUTE_CHAPTERS.map((c,index)=>{
   const r=TopoRoute.record(state.route,c.id),open=TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,c.id);
   return {...c,index,r,open,done:r.stage===3,gold:r.goldAt>0};
  });
  const next=chapters.find(c=>c.r.stage<3)||null,active=state.route.active&&!state.route.active.done?state.route.active:null;
  const due=TopoRoute.due(state.route,ROUTE_CHAPTERS);
  return {chapters,next,active,due,completed:chapters.filter(c=>c.done).length,gold:chapters.filter(c=>c.gold).length};
 }
 function stateOf(c,m){return !c.open?'locked':c.gold?'gold':c.done?'done':c===m.next?'now':'open';}

 function renderNow(m){
  const box=make('section','v3Now v3Card');box.setAttribute('aria-labelledby','v3NowTitle');
  const activeChapter=m.active&&m.chapters.find(c=>c.id===m.active.chapterId);
  const focus=activeChapter||m.next||null;
  const head=make('div','v3NowHead'),h=make('h1');h.id='v3NowTitle';
  if(focus){
   head.append(img('chapter'+focus.index,'v3NowIcon'));
   h.append(make('small',null,m.active?'Les bezig · halte '+(focus.index+1):'Halte '+(focus.index+1)+' van 11'),titleNode(focus.title));
  }else{
   head.append(img('finalGold','v3NowIcon'));
   h.append(make('small',null,m.active?'Les bezig':'Alle 11 haltes afgerond'),document.createTextNode(m.active?'Mijn slimme rondje':'Italië rond'));
  }
  head.append(h);box.append(head);
  if(focus&&!['gold','review','smart'].includes(m.active?.kind)){
   const ol=make('ol','v3Stages');ol.setAttribute('aria-label','Lessen van deze halte');
   TopoRoute.STAGES.forEach((s,n)=>{const st=n<focus.r.stage?'done':n===focus.r.stage?'now':'later';const li=make('li','v3Stage');li.dataset.state=st;li.append(make('span',null,st==='done'?'✓ Klaar':st==='now'?'Nu':'Straks'),make('b',null,STAGE_LABEL[s]));ol.append(li);});
   box.append(ol);
  }
  const nino=make('div','v3Nino');nino.append(img('welcome'),make('p',null,$('#routeIntro')?.textContent||''));
  box.append(nino);
  // Label follows the same branches as V2 #routeContinue.
  const label=m.active?'Ga verder · '+KIND_LABEL[m.active.kind]:m.next?(m.completed===0&&m.next.r.stage===0?'Start de reis':'Verder met '+STAGE_LABEL[TopoRoute.STAGES[m.next.r.stage]]):'Start een slim rondje';
  const primary=btn(label,press(()=>$('#routeContinue')),'v3Btn primary');primary.id='v3Continue';box.append(primary);
  const extra=make('div','v3Extra');
  if(m.due.length)extra.append(btn('Even opfrissen · '+m.due.length+' halte'+(m.due.length===1?'':'s'),press(()=>$('#routeReview')),'v3Btn quiet'));
  if(m.next&&!m.active&&m.completed>0)extra.append(btn('Slim rondje · 6 vragen',press(()=>$('#smartStart')),'v3Btn quiet'));
  if(extra.childElementCount)box.append(extra);
  return box;
 }

 function renderRoute(m){
  const sec=make('section','v3Route v3Card');sec.setAttribute('aria-labelledby','v3RouteTitle');
  const head=make('div','v3RouteHead'),h=make('h2',null,'Route door Italië');h.id='v3RouteTitle';
  head.append(h,make('span','v3Muted',m.completed+' van 11 · '+m.gold+' goud'));sec.append(head);
  const path=make('div','v3Path');path.setAttribute('role','list');
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('v3PathLine');svg.setAttribute('aria-hidden','true');path.append(svg);
  for(const c of m.chapters){
   const st=stateOf(c,m),b=make('button','v3Stop');b.type='button';b.dataset.state=st;b.dataset.chapter=c.id;b.setAttribute('role','listitem');
   if(st==='now')b.setAttribute('aria-current','step');
   b.setAttribute('aria-pressed',String(selected===c.id));
   b.setAttribute('aria-label',(c.index+1)+'. '+c.title+', '+({locked:'op slot',gold:'goud verdiend',done:'afgerond',now:'huidige halte, '+c.r.stage+' van 3 lessen klaar',open:'open'})[st]);
   const disc=make('span','disc');disc.append(img('chapter'+c.index));
   if(st==='done'){const k=make('span','mark','✓');disc.append(k);}
   if(st==='gold'){const k=make('span','mark');k.append(img('chapterGold'));disc.append(k);}
   if(st==='locked'){const k=make('span','mark');k.innerHTML='<svg width="12" height="12" viewBox="0 0 32 32" fill="none" stroke="#fff" stroke-width="4"><rect x="6" y="14" width="20" height="15" rx="3"/><path d="M11 14V9a5 5 0 0 1 10 0v5"/></svg>';disc.append(k);}
   if(st==='now')disc.append(img('travel','v3Vespa'));
   b.append(disc,make('span','name',c.title));
   b.addEventListener('click',e=>{e.stopPropagation();selected=(selected===c.id||st==='now')?null:c.id;render();if(selected)$('#v3Detail')?.focus({preventScroll:false});else if(st==='now')$('#v3Continue')?.focus();});
   path.append(b);
  }
  sec.append(path);
  place(path);
  const pick=selected&&m.chapters.find(c=>c.id===selected);
  if(pick)sec.append(renderDetail(pick,m));
  requestAnimationFrame(()=>drawLine(path,m));
  return sec;
 }

 function renderDetail(c,m){
  const d=make('div','v3Detail');d.id='v3Detail';d.tabIndex=-1;d.setAttribute('role','region');d.setAttribute('aria-label',c.title);
  const head=make('div','v3DetailHead'),t=make('div');
  t.append(make('h3',null,(c.index+1)+'. '+c.title),make('p','v3Muted',!c.open?'Opent als je '+m.chapters[c.index-1].title+' afrondt · '+c.itemIds.length+' plekken':c.gold?'Goud verdiend · '+c.itemIds.length+' plekken':c.done?'Afgerond · '+c.itemIds.length+' plekken':c.r.stage+' van 3 lessen klaar'));
  head.append(img('chapter'+c.index),t,btn('×',e=>{e.stopPropagation();selected=null;render();$('[data-chapter="'+c.id+'"].v3Stop')?.focus();},'v3Btn v3Close'));
  head.lastChild.setAttribute('aria-label','Sluit');
  d.append(head);
  if(c.open){
   const row=make('div','v3DetailActions');
   TopoRoute.STAGES.forEach((s,n)=>{if(n<=c.r.stage&&n<3){const b=btn((n<c.r.stage?'↻ ':'')+STAGE_LABEL[s],press(()=>v2Card(c.id)?.querySelectorAll('.routeStep')[n]));row.append(b);}});
   if(c.done){
    const g=btn(c.gold?'★ Goud nog eens':'★ Verdien goud',press(()=>v2Card(c.id)?.querySelector('.goldButton')),'v3Btn gold');row.append(g);
    row.append(btn('Opfrissen',press(()=>v2Card(c.id)?.querySelector('.routeActions button:not(.goldButton)'))));
   }
   d.append(row);
  }
  return d;
 }

 function renderRewards(){
  const box=make('section','v3Rewards v3Card');box.setAttribute('aria-label','Pizza’s en Vespa');
  const key=TopoPizza.flavor(state.pizzas),n=['margherita','salami','quattro-formaggi'].indexOf(key);
  const pz=make('div','v3Pizza');pz.style.setProperty('--p',String(state.slices/8));pz.append(img('favorite'+Math.max(0,n),'base'),img('favorite'+Math.max(0,n),'earned'));
  pz.setAttribute('role','img');pz.setAttribute('aria-label',state.slices+' van 8 punten voor een '+TopoPizza.name(key));
  const t=make('div','v3RewardText'),left=3-state.pizzas%3;
  t.append(make('b',null,TopoPizza.name(key)+' · '+state.slices+'\u00a0/\u00a08'),make('span','v3Muted','Nog '+left+(left===1?' pizza':' pizza’s')+' tot de Vespa-rit naar '+TopoLearning.journey(state.trips+1).to));
  const trip=make('div','v3Trip');trip.setAttribute('aria-hidden','true');for(let i=0;i<3;i++){const p=make('i');if(i<state.pizzas%3)p.className='on';trip.append(p);}t.append(trip);
  const book=btn('Reisboekje',e=>{e.stopPropagation();window.TopoBook?.open(book);});
  box.append(pz,t,book);return box;
 }

 // Serpentine: DOM and keyboard order stay 1→11; even rows run right-to-left so the path never jumps back.
 function place(path){const cols=parseInt(getComputedStyle(path).getPropertyValue('--cols'))||3;path.querySelectorAll('.v3Stop').forEach((b,i)=>{const row=Math.floor(i/cols),c=i%cols;b.style.gridRow=String(row+1);b.style.gridColumn=String(row%2?cols-c:c+1);});}
 // Path through the stop centres in reading order; walked part solid, the rest dotted.
 function drawLine(path,m){
  const svg=path.querySelector('.v3PathLine');if(!svg||!path.isConnected)return;
  const base=path.getBoundingClientRect(),pts=[...path.querySelectorAll('.v3Stop .disc')].map(d=>{const r=d.getBoundingClientRect();return [r.left-base.left+r.width/2,r.top-base.top+r.height/2];});
  if(pts.length<2)return;
  // Row turn: bulge outward past the edge stop so the line never crosses a label.
  const cols=parseInt(getComputedStyle(path).getPropertyValue('--cols'))||3,out=base.width/cols*0.9;
  const seg=(a,b)=>{if(Math.abs(a[1]-b[1])<2)return ' L'+b[0]+' '+b[1];const dx=a[0]>base.width/2?out:-out;return ' C'+(a[0]+dx)+' '+a[1]+' '+(b[0]+dx)+' '+b[1]+' '+b[0]+' '+b[1];};
  const reach=Math.max(0,(m.next?m.next.index:10));
  let walked='M'+pts[0][0]+' '+pts[0][1],ahead='M'+pts[reach][0]+' '+pts[reach][1];
  for(let i=1;i<pts.length;i++){if(i<=reach)walked+=seg(pts[i-1],pts[i]);else ahead+=seg(pts[i-1],pts[i]);}
  svg.innerHTML='<path class="ahead" d="'+ahead+'"/>'+(reach>0?'<path class="walked" d="'+walked+'"/>':'');
 }

 const root=make('div','v3Reis v3');root.dataset.v3='reis';
 function render(){
  const home=$('#routeHome');if(!home)return;
  if(root.parentNode!==home)home.prepend(root);
  const m=model();if(selected&&!m.chapters.some(c=>c.id===selected))selected=null;
  const focusId=document.activeElement?.closest?.('.v3Stop')?.dataset.chapter;
  root.replaceChildren(renderNow(m),renderRoute(m),renderRewards());
  if(focusId)root.querySelector('.v3Stop[data-chapter="'+focusId+'"]')?.focus({preventScroll:true});
 }
 const base=renderRouteHome;
 renderRouteHome=function(...args){const out=base.apply(this,args);try{render();}catch(e){console.error('V3 Reis',e);}return out;};
 new ResizeObserver(()=>{const p=root.querySelector('.v3Path');if(p){place(p);drawLine(p,model());}}).observe(root);
 document.body.classList.add('v3On');
 window.TOPO_V3={render,model};
 if(!$('#journeyScreen')?.classList.contains('hidden'))render();
})();
