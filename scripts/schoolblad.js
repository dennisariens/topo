/* Original school photograph: presentation-only reference, never a quiz surface. */
function setupSchoolblad(){
 const toggle=document.getElementById('schoolToggle'),image=document.getElementById('school');
 const dialog=document.createElement('dialog');
 // Keep the original checkbox/photo behavior when native modal support is absent.
 if(typeof dialog.showModal!=='function')return;
 dialog.id='schoolbladDialog';dialog.className='schoolbladDialog';
 dialog.setAttribute('aria-labelledby','schoolbladTitle');dialog.setAttribute('aria-describedby','schoolbladDescription');dialog.setAttribute('aria-modal','true');
 dialog.innerHTML='<div class="schoolbladHeader"><div><h2 id="schoolbladTitle">Origineel schoolblad</h2><p id="schoolbladDescription">Referentie · niet interactief</p></div><button type="button" class="schoolbladClose" autofocus>Terug naar mijn kaart</button></div><div class="schoolbladToolbar" role="group" aria-label="Schoolblad vergroten"><button type="button" data-zoom="out" aria-label="Schoolblad verkleinen">−</button><output aria-live="polite" aria-label="Vergroting">100%</output><button type="button" data-zoom="in" aria-label="Schoolblad vergroten">+</button><button type="button" data-zoom="fit">Hele blad</button></div><p class="schoolbladHelp" id="schoolbladHelp">Vergroot met + of twee vingers. Sleep om te verschuiven. Met het toetsenbord: pijltjestoetsen.</p><div class="schoolbladViewport" tabindex="0" role="region" aria-label="Origineel gefotografeerd schoolblad, verschuifbaar" aria-describedby="schoolbladHelp"><div class="schoolbladStage"></div></div>';
 const viewport=dialog.querySelector('.schoolbladViewport'),stage=dialog.querySelector('.schoolbladStage'),close=dialog.querySelector('.schoolbladClose'),out=dialog.querySelector('output');
 image.classList.remove('hidden','on');image.draggable=false;stage.append(image);document.body.append(dialog);
 toggle.closest('label').hidden=true;
 let scale=1,fit=1,left=0,top=0,width=890,height=1235,restore=null,gesture=null;
 const pointers=new Map(),openers=[];
 const saveFocus=opener=>{
  const focus=document.activeElement;
  const editable=focus&&!focus.disabled&&/^(INPUT|TEXTAREA)$/.test(focus.tagName)&&focus.type!=='checkbox';
  return {focus:editable?focus:opener,start:editable?focus.selectionStart:null,end:editable?focus.selectionEnd:null,direction:editable?focus.selectionDirection:null,x:window.scrollX,y:window.scrollY};
 };
 function layout(anchor={x:viewport.clientWidth/2,y:viewport.clientHeight/2},point){
  const vw=viewport.clientWidth,vh=viewport.clientHeight;if(!vw||!vh)return;
  const oldWidth=width,oldHeight=height;
  const u=point?.u??(viewport.scrollLeft+anchor.x-left)/oldWidth,v=point?.v??(viewport.scrollTop+anchor.y-top)/oldHeight;
  const ratio=(image.naturalHeight||1235)/(image.naturalWidth||890);
  fit=Math.max(1,Math.min(vw-32,(vh-32)/ratio));width=fit*scale;height=width*ratio;
  const sw=Math.max(vw,width+32),sh=Math.max(vh,height+32);left=(sw-width)/2;top=(sh-height)/2;
  stage.style.width=sw+'px';stage.style.height=sh+'px';
  Object.assign(image.style,{width:width+'px',height:height+'px',left:left+'px',top:top+'px'});
  viewport.scrollLeft=left+u*width-anchor.x;viewport.scrollTop=top+v*height-anchor.y;
  out.value=Math.round(scale*100)+'%';dialog.querySelector('[data-zoom="out"]').disabled=scale<=1;dialog.querySelector('[data-zoom="in"]').disabled=scale>=4;
 }
 function zoom(next,anchor){scale=Math.min(4,Math.max(1,next));layout(anchor);}
 function reset(){scale=1;layout(undefined,{u:.5,v:.5});viewport.scrollLeft=0;viewport.scrollTop=0;}
 function open(opener,saved){
  if(dialog.open)return;restore=saved||saveFocus(opener);restore.overflow=document.documentElement.style.overflow;
  for(const b of openers)b.setAttribute('aria-expanded','true');
  toggle.checked=false;dialog.showModal();document.documentElement.style.overflow='hidden';reset();close.focus({preventScroll:true});
 }
 function restoreReference(){
  pointers.clear();gesture=null;for(const b of openers)b.setAttribute('aria-expanded','false');
  if(!restore)return;document.documentElement.style.overflow=restore.overflow;
  const saved=restore;restore=null;
  if(saved.focus?.isConnected){saved.focus.focus({preventScroll:true});if(saved.start!==null)saved.focus.setSelectionRange(saved.start,saved.end,saved.direction);}
  window.scrollTo({left:saved.x,top:saved.y,behavior:'instant'});
 }
 // Restore an editor within the close gesture, including touch keyboards.
 function dismiss(){dialog.close();restoreReference();}
 dialog.addEventListener('close',()=>{if(!dialog.open)restoreReference();});
 close.addEventListener('click',dismiss);
 dialog.addEventListener('cancel',e=>{e.preventDefault();dismiss();});
 dialog.addEventListener('keydown',e=>{
  e.stopPropagation();
  // Native modality makes the page inert; wrap the tab order inside the sheet.
  if(e.key==='Tab'){
   const all=[...dialog.querySelectorAll('button:not(:disabled),[tabindex="0"]')];
   if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all.at(-1).focus();}
   else if(!e.shiftKey&&document.activeElement===all.at(-1)){e.preventDefault();all[0].focus();}
  }
 });
 for(const button of dialog.querySelectorAll('[data-zoom]'))button.addEventListener('click',()=>{
  const action=button.dataset.zoom;if(action==='fit')reset();else zoom(scale+(action==='in'?.5:-.5));
 });
 viewport.addEventListener('keydown',e=>{
  if(e.key==='+'||e.key==='='){e.preventDefault();zoom(scale+.5);}
  else if(e.key==='-'){e.preventDefault();zoom(scale-.5);}
  else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
   e.preventDefault();viewport.scrollLeft+=e.key==='ArrowLeft'?-60:e.key==='ArrowRight'?60:0;viewport.scrollTop+=e.key==='ArrowUp'?-60:e.key==='ArrowDown'?60:0;
  }else if(e.key==='Home'){e.preventDefault();reset();}
 });
 const local=e=>{const r=viewport.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
 function beginGesture(){
  const ps=[...pointers.values()];if(!ps.length){gesture=null;return;}
  const center=ps.length>1?{x:(ps[0].x+ps[1].x)/2,y:(ps[0].y+ps[1].y)/2}:ps[0];
  gesture={center,scrollX:viewport.scrollLeft,scrollY:viewport.scrollTop,scale,distance:ps.length>1?Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y):0,u:(viewport.scrollLeft+center.x-left)/width,v:(viewport.scrollTop+center.y-top)/height};
 }
 viewport.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();viewport.focus({preventScroll:true});pointers.set(e.pointerId,local(e));viewport.setPointerCapture(e.pointerId);beginGesture();
 });
 viewport.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId)||!gesture)return;e.preventDefault();pointers.set(e.pointerId,local(e));const ps=[...pointers.values()];
  if(ps.length>1&&gesture.distance>0){
   const center={x:(ps[0].x+ps[1].x)/2,y:(ps[0].y+ps[1].y)/2};scale=Math.min(4,Math.max(1,gesture.scale*Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y)/gesture.distance));layout(center,{u:gesture.u,v:gesture.v});
  }else if(ps.length===1){viewport.scrollLeft=gesture.scrollX+gesture.center.x-ps[0].x;viewport.scrollTop=gesture.scrollY+gesture.center.y-ps[0].y;}
 });
 for(const name of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(name,e=>{pointers.delete(e.pointerId);beginGesture();});
 if(typeof ResizeObserver==='function')new ResizeObserver(()=>{if(dialog.open)layout();}).observe(viewport);
 else window.addEventListener('resize',()=>{if(dialog.open)layout();});
 image.addEventListener('load',()=>{if(dialog.open)reset();});
 function opener(parent,route=false){
  const b=document.createElement('button');b.type='button';b.className='schoolbladButton'+(route?' schoolbladRouteButton':'');b.textContent='Schoolblad bekijken';
  b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-controls',dialog.id);b.setAttribute('aria-expanded','false');let saved=null;
  b.addEventListener('pointerdown',()=>{saved=saveFocus(b);});b.addEventListener('click',()=>{open(b,saved);saved=null;});parent.append(b);openers.push(b);return b;
 }
 opener(toggle.closest('label').parentElement);opener(document.getElementById('routeContinue').parentElement,true);
 opener(document.getElementById('routeMapDock')).classList.add('schoolbladDockButton');
 // Older integrations invoking the checkbox still summon this same reference.
 toggle.onchange=()=>{toggle.checked=false;open(openers[0]);};
}
setupSchoolblad();
