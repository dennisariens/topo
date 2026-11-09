/* TOPO V3.0 — Schoolblad (docs/v3/V3_0_REST.md § 5). One button on Reis (beside Schoolkaart/Reliëf) and in the lesson
   bar of Ontdekken, Aanwijzen and Namen schrijven (route and Oefenen); key S everywhere. Not in Toets and not in the
   Gouden proef: there is no button and S does nothing. Opens the existing V2 schoolblad dialog by pressing a V2
   opener (zoom, panning, Escape and its own focus handling stay V2); V3 brings focus back to where it was: the
   answer field with its draft and selection, or the V3 control that opened it. */
(function setupV3Schoolblad(){
 'use strict';
 const V=window.TOPO_V3;if(!V)return;
 const {make,btn,icon}=V,$=s=>document.querySelector(s),body=document.body;
 const dialog=$('#schoolbladDialog');if(!dialog)return;
 const editable=n=>n&&!n.disabled&&/^(INPUT|TEXTAREA)$/.test(n.tagName)&&n.type!=='checkbox';
 // Toets (set-up, run, result) and the Gouden proef have no schoolblad.
 const blocked=()=>(typeof state!=='undefined'&&state.mode==='exam')||V.currentTab?.()==='toets'||body.dataset.v3Kind==='gold';

 let restore=null;
 function open(opener,saved){
  if(dialog.open||blocked())return;
  const f=saved||document.activeElement;
  restore=editable(f)?{el:f,start:f.selectionStart,end:f.selectionEnd,dir:f.selectionDirection}:{el:opener||f};
  // The plain V2 opener (map toolbar); the Reis and dock openers sit inside route-home click handlers.
  $('.schoolbladButton:not(.schoolbladRouteButton):not(.schoolbladDockButton)')?.click();
  if(!dialog.open)restore=null;
 }
 dialog.addEventListener('close',()=>{
  const r=restore;restore=null;if(!r?.el?.isConnected)return;
  // After V2's own restore (it targets its hidden opener): put focus back on the V3 opener or the answer.
  requestAnimationFrame(()=>{if(r.el.checkVisibility?.()===false)return;r.el.focus({preventScroll:true});if(r.start!=null)try{r.el.setSelectionRange(r.start,r.end,r.dir);}catch{}});
 });

 // A V3 opener; like V2, the editable that had focus is remembered on pointerdown (before the button takes focus).
 function button(cls){
  let saved=null;
  const b=btn('',e=>{e.stopPropagation();open(b,saved);saved=null;},'v3Btn v3School '+cls);
  b.append(icon('v3sheet'),make('span',null,'Schoolblad'));b.setAttribute('aria-haspopup','dialog');
  b.addEventListener('pointerdown',()=>{const f=document.activeElement;saved=editable(f)?f:null;});
  return b;
 }

 // Key S: not while typing, not with modifiers, not when a dialog is open, not in Toets or Gold.
 addEventListener('keydown',e=>{
  if(e.key!=='s'&&e.key!=='S')return;
  if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.defaultPrevented)return;
  const t=e.target;if(editable(t)||t?.isContentEditable||t?.tagName==='SELECT')return;
  if(document.querySelector('dialog[open]')||blocked())return;
  e.preventDefault();open(document.activeElement===body?null:document.activeElement);
 });

 // Lesson bar: after the title, for the forms that may use it.
 const bar=$('.v3LesBar'),barBtn=button('v3LesSchool');barBtn.hidden=true;
 bar?.querySelector('.v3LesCount')?.before(barBtn);
 function update(){barBtn.hidden=!body.classList.contains('v3Les')||blocked();}
 new MutationObserver(update).observe(body,{attributes:true,attributeFilter:['class','data-v3-kind','data-v3-type']});

 V.schoolblad={open,button,blocked};
 V.render();update();
})();
