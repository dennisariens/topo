/* TOPO V3 — Golden Experience 01, beat 3–7: Ontdekken → Aanwijzen → Namen schrijven → Feedback → beloning → Reisboekje.
   Presentation layer over the V2 lesson. The canonical #quiz, #prompt, #answer, #check, #message, #next, the live #map
   and their handlers stay the only lesson; Focus Mode keeps owning iPad and phone. V3 reads state and never writes it:
   it adds a sidebar and the lesson steps above the map, marks a few V2 nodes for styling, and presses V2 controls.
   Spec: docs/v3/GE01.md. */
(function setupV3Les(){
 'use strict';
 const V=window.TOPO_V3;if(!V)return;
 const {make,btn,press,icon,v2Card,v2Nav,STAGE}=V,$=s=>document.querySelector(s);
 const body=document.body,layout=$('.layout');if(!layout)return;

 /* GE01-K01 (Hermes, 1a42590): the key that submits an answer never activates a control that appears because of it.
    V2 grades on keydown (#answer, map targets) and opens a reward dialog with focus on its button; the browser then
    turns the same Enter/Space into a click on that button, which closed the pizza at once (reduced motion). While the
    key is held, a trusted keyboard click (detail 0) on another element than where the key went down is dropped; the
    next real key press or click works as usual. Implicit form submission (same form) stays allowed. */
 let held=null;
 addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!held)held={key:e.key,target:e.target};},true);
 addEventListener('keyup',e=>{if(held&&e.key===held.key){const h=held;setTimeout(()=>{if(held===h)held=null;});}},true);
 addEventListener('blur',()=>{held=null;});
 addEventListener('click',e=>{
  if(!held||!e.isTrusted||e.detail!==0)return;
  const t=e.target,from=held.target;
  if(t===from||(from instanceof Node&&from.contains(t))||(from?.form&&t?.form===from.form))return;
  e.preventDefault();e.stopImmediatePropagation();
 },true);

 /* Navigation lives in the shell (shell.js): sidebar, rail or tab bar on every lesson, exercise and toets.
    The back control returns to where this lesson was chosen: Reis, the Oefenen choice or the Toets set-up. */
 const FREE=['learn','point','write'];
 const toBack=e=>{e.stopPropagation();const sh=V.shell;if(!sh)return press(()=>v2Nav('Reis'))(e);const t=sh.lessonTab();sh.toHome();sh.show(t==='reis'?'reis':t,t==='oefenen'?'v3OefenenTitle':t==='toets'?'v3ToetsTitle':null);};

 /* Lesson steps above the map (topo-ui-design, PR #64): 1 Ontdekken · 2 Aanwijzen · 3 Namen schrijven, ★ Goud apart. */
 const bar=make('nav','v3 v3LesBar');bar.setAttribute('aria-label','Lesstappen');bar.hidden=true;
 const back=btn('',toBack,'v3Btn v3LesBack');back.append(make('span',null,'‹'),make('span','v3LesBackText','Reis'));
 const title=make('strong','v3LesTitle'),steps=make('ol','v3LesSteps'),gold=make('div','v3LesGold'),count=make('span','v3LesCount');
 // R-les (fase B, stap 4): two glass pills on desktop — the lesson (title and steps) and, on the right, Schoolblad and the
 // count (schoolblad.js puts its button before the count). In Focus Mode both wrappers are display:contents (les-ijk.css).
 const group=make('div','v3LesGroup'),end=make('div','v3LesEnd');group.append(back,title,steps,gold);end.append(count);
 bar.append(group,end);layout.before(bar);

 function model(){
  if(state.mode==='exam'){const total=state.examTotal|0;return {type:'exam',kind:'exam',title:'Toets',total,n:Math.min(total,(state.examAnswered|0)+(state.answered?0:1)),done:!!state.examEnded,paused:false,q:state.questionMode};}
  if(FREE.includes(state.mode)){const g=$('#groupSelect');return {type:'free',kind:state.mode==='learn'?'discover':state.mode,title:g?.selectedOptions[0]?.textContent.replace(/ · .*$/,'').trim()||'',group:g?.value,total:0,n:0,done:false,paused:false,q:state.mode==='learn'?'discover':state.questionMode};}
  const s=state.route?.active;if(state.mode!=='route'||!s)return null;
  const c=ROUTE_CHAPTERS.find(x=>x.id===s.chapterId);if(!c)return null;
  const r=TopoRoute.record(state.route,c.id),total=s.queue?.length||0,n=Math.min(total,(s.index|0)+(s.done?0:1));
  return {type:s.kind==='smart'?'smart':'route',s,c,r,index:ROUTE_CHAPTERS.indexOf(c),kind:s.kind,total,n,done:!!s.done,paused:typeof roundPaused!=='undefined'&&!!roundPaused,q:state.questionMode};
 }
 const offHome=()=>$('#journeyScreen')?.classList.contains('hidden')!==false||$('#routeHome')?.classList.contains('hidden');
 const inLesson=()=>state.mode==='route'?!!state.route?.active&&$('#journeyScreen')?.classList.contains('hidden')&&(layout.classList.contains('routeLessonLayout')||layout.classList.contains('finishLayout')):(state.mode==='exam'||FREE.includes(state.mode))&&offHome()&&!layout.classList.contains('routeHomeLayout');

 const STAGE_ICON={discover:'v3discover',point:'v3point',write:'v3write'};
 const FORM={discover:'Ontdekken',point:'Aanwijzen',write:'Namen schrijven',exam:'Toets',smart:'Slim rondje'};
 function renderBar(m){
  back.querySelector('.v3LesBackText').textContent=m.type==='route'?'Reis':m.type==='exam'?'Toets':'Oefenen';
  back.setAttribute('aria-label','Terug naar '+(m.type==='route'?'Reis':m.type==='exam'?'Toets':'Oefenen'));
  if(m.type!=='route'){
   // Free practice, slim rondje and toets: the form as one quiet marker; the toets shows only its count.
   title.replaceChildren(m.type==='exam'?'Toets':m.type==='smart'?FORM.smart:V.range(m.title));
   steps.replaceChildren();gold.replaceChildren();
   if(m.type==='free'){const li=make('li'),b=make('span','v3LesStep v3LesForm');b.dataset.state='now';b.append(make('span','v3LesStepName',FORM[m.kind]));li.setAttribute('aria-current','step');li.append(b);steps.append(li);}
   const hide=m.done||!m.total;count.textContent=hide?'':m.n+' / '+m.total;count.setAttribute('aria-label',hide?'':'Vraag '+m.n+' van '+m.total);
   return;
  }
  title.replaceChildren(V.range(m.c.title));
  steps.replaceChildren(...TopoRoute.STAGES.map((stage,n)=>{
   const li=make('li'),now=m.kind===stage&&!m.done,done=n<m.r.stage,st=now?'now':done?'done':'later';
   const b=btn('',now||!done?e=>e.stopPropagation():press(()=>v2Card(m.c.id)?.querySelectorAll('.routeStep')[n]),'v3Btn v3LesStep');
   b.dataset.state=st;b.dataset.stage=stage;
   // The mark is a line icon (R-les): a check when done, else the stage's own form icon.
   const mark=make('span','v3LesMark');mark.setAttribute('aria-hidden','true');mark.append(icon(done&&!now?'v3checkmark':STAGE_ICON[stage]));
   b.append(mark,make('span','v3LesStepName',STAGE[stage]));
   b.setAttribute('aria-label',STAGE[stage]+(now?', nu':done?', klaar · herhalen':', later'));
   if(now){li.setAttribute('aria-current','step');b.setAttribute('aria-disabled','true');}
   if(st==='later')b.disabled=true;
   li.append(b);return li;
  }));
  const goldOpen=m.r.stage===3||m.kind==='gold';
  gold.replaceChildren();
  if(goldOpen){const now=m.kind==='gold'&&!m.done,g=btn('★ Goud',now?e=>e.stopPropagation():press(()=>v2Card(m.c.id)?.querySelector('.goldButton')),'v3Btn v3LesStep v3LesGoldBtn');g.dataset.state=now?'now':'open';if(now)g.setAttribute('aria-current','step');gold.append(g);}
  const discover=m.q==='discover'||m.kind==='discover';
  const hide=m.done||m.paused||!m.total;
  count.textContent=hide?'':m.n+' / '+m.total;
  count.setAttribute('aria-label',hide?'':(discover?'Plek ':'Vraag ')+m.n+' van '+m.total);
 }

 /* Finish screen: the stamp is the reward; the V2 "back" action steps down when the stamp invites to the Reisboekje.
    Secondary V2 lines (where progress is saved, the round list) are marked, not removed. */
 function markFinish(){
  const f=$('#finishScreen');if(!f)return;
  for(const p of f.querySelectorAll(':scope>p')){const t=p.textContent.trim();const quiet=/^Je voortgang (blijft|is bewaard)/.test(t)||/^Hele les:/.test(t)||/^Deze ronde:/.test(t)||/^Rondegegevens/.test(t);if(quiet)p.dataset.v3Aside='';else delete p.dataset.v3Aside;}
  const stamp=f.querySelector('.earnedMoment'),buttons=[...f.querySelectorAll(':scope>button')];
  for(const b of buttons)b.classList.toggle('v3Second',!!stamp||!b.classList.contains('primary'));
  // After a finished chapter both V2 buttons call renderRouteHome: show one.
  const [go,home]=buttons;if(go&&home){if(/^Terug naar mijn reis/.test(go.textContent.trim()))home.dataset.v3Aside='';else delete home.dataset.v3Aside;}
 }

 let last='',wasAnswered=false;
 function render(){
  const on=inLesson(),m=on?model():null;
  body.classList.toggle('v3Les',!!m);bar.hidden=!m;
  if(!m){last='';wasAnswered=false;for(const k of ['v3Theme','v3Kind','v3Q','v3Answered','v3Type'])delete body.dataset[k];return;}
  bar.dataset.theme=body.dataset.v3Theme=window.TOPO_V3_THEME||'viola';
  body.dataset.v3Kind=m.kind;body.dataset.v3Type=m.type;body.dataset.v3Q=m.done?'result':m.q||'';
  const answered=!!state.answered&&!m.done;body.dataset.v3Answered=String(answered);
  // Owner 9-11: after an answer the feedback and Volgende are always in view. When the child collapsed the Focus
  // sheet ("Kaart vrijmaken") to tap the map, press the V2 toggle ("Antwoord openen") once; Focus Mode does the rest.
  if(answered&&!wasAnswered){const t=$('#focusSheetToggle');if(t&&$('#focusAnswerSheet')?.dataset.collapsed==='true'&&t.checkVisibility?.()!==false)t.click();}
  wasAnswered=answered;
  const key=[m.type,m.c?.id||m.title,m.kind,m.r?.stage,m.r?.goldAt>0,m.n,m.total,m.done,m.paused,m.q].join('|');
  // Back on Reis, the chapter of this lesson (Ga verder) or the next one is chosen, not an earlier pick.
  if(V.ui&&m.type==='route')V.ui.selected=null;
  if(key!==last){last=key;renderBar(m);}
  if(m.type!=='exam'&&m.type!=='free')markFinish();
 }
 let queued=0;const schedule=()=>{if(!queued)queued=requestAnimationFrame(()=>{queued=0;try{render();}catch(e){console.error('V3 les',e);}});};
 new MutationObserver(schedule).observe(body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
 V.les={render,model};
 render();
})();
