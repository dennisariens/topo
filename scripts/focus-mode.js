/* Responsive presentation only. The canonical quiz/input/check and PR39 resolver remain authoritative. */
function setupFocusMode(){
 const $id=id=>document.getElementById(id),map=$id('map'),area=map?.closest('.mapArea'),layout=document.querySelector('.layout'),quiz=$id('quiz');
 if(!area||!quiz)return;
 const slots=new Map(),park=(node,parent)=>{if(!node||node.parentElement===parent)return;if(!slots.has(node)){const marker=document.createComment('focus-return');node.before(marker);slots.set(node,marker)}parent.append(node);},restore=()=>{for(const[n,m]of slots)if(m.parentNode&&n.parentNode!==m.parentNode)m.after(n);};
 const menu=document.createElement('details');menu.id='focusMenu';menu.innerHTML='<summary>☰ Menu</summary><div class="focusMenuPanel"><strong>Oefenen en toetsen</strong><div class="focusMenuSettings"><details><summary>Instellingen en meer</summary><div class="focusMenuSettingsContents"></div></details></div></div>';const menuPanel=menu.lastElementChild;document.body.append(menu);
 const sheet=document.createElement('section');sheet.id='focusAnswerSheet';sheet.className='focusAnswerSheet';sheet.setAttribute('aria-label','Huidige opdracht');sheet.hidden=true;
 const toggle=document.createElement('button');toggle.id='focusSheetToggle';toggle.type='button';toggle.textContent='Kaart vrijmaken';toggle.setAttribute('aria-expanded','true');sheet.append(toggle);document.body.append(sheet);
 const learnBar=document.createElement('section');learnBar.id='focusLearnBar';learnBar.setAttribute('aria-label','Plek ontdekken');learnBar.hidden=true;document.body.append(learnBar);
 const status=document.createElement('span');status.id='focusLessonStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');area.closest('.mapCard').querySelector('.mapTools').prepend(status);
 const safe=document.createElement('div');safe.className='focusSafeProbe';safe.setAttribute('aria-hidden','true');document.body.append(safe);
 const input=$id('answer'),mirror=$id('routeDockAnswer');
 const text=(n,v)=>{if(n.textContent!==v)n.textContent=v;};let parked=false,active=false,lastQuestion='',collapsed=false,lastSelection=null,scheduled=0,layoutHeight=innerHeight,lastWidth=innerWidth;
 function caret(){return document.activeElement===input?{start:input.selectionStart,end:input.selectionEnd,direction:input.selectionDirection}:null;}
 let moveCaret=null;
 function preserveMove(fn){const c=caret();fn();if(c)moveCaret=c;}
 function shell(on){if(on===parked)return;preserveMove(()=>{if(on){park(quiz,sheet);for(const n of[document.querySelector('nav.tabs'),$id('groupPicker'),$id('testSetup'),$id('nameToggleWrap'),$id('printMap'),$id('reveal'),$id('mistakes'),document.querySelector('footer.backupTools')])park(n,n?.matches('footer.backupTools')?menuPanel.querySelector('.focusMenuSettingsContents'):menuPanel);park($id('learnPrompt'),learnBar);park($id('learnNext'),learnBar);}else restore();});parked=on;menu.hidden=!on;}
 function viewport(){const v=window.visualViewport;return {left:v?.offsetLeft||0,top:v?.offsetTop||0,width:v?.width||innerWidth,height:v?.height||innerHeight,scale:v?.scale||1};}
 function position(){
  scheduled=0;if(!active)return;const v=viewport(),cs=getComputedStyle(safe),bottom=parseFloat(cs.paddingBottom)||0,top=parseFloat(cs.paddingTop)||0;
  const root=document.documentElement;for(const[k,val]of Object.entries({'--focus-vv-top':v.top,'--focus-vv-left':v.left,'--focus-vv-width':v.width,'--focus-vv-height':v.height,'--focus-safe-top':top,'--focus-safe-bottom':bottom,'--focus-layout-height':layoutHeight}))root.style.setProperty(k,val+'px');
  const keyboard=document.activeElement===input&&v.height<layoutHeight*.78&&v.scale<=1.1;document.body.dataset.focusKeyboard=String(keyboard);
  const available=Math.max(92,v.height-top-bottom-64);sheet.style.maxHeight=available+'px';
  const center=v.left+v.width/2;sheet.style.left=center+'px';learnBar.style.left=center+'px';
  const h=sheet.getBoundingClientRect().height,low=v.top+v.height-bottom-12-h,min=v.top+top+50;
  let y=Math.max(min,low);const typing=state.questionMode==='write'&&state.mode!=='learn';
  // Only a writing task's ALREADY highlighted shape may influence placement. Never reveal point answers by moving UI.
  if(typing&&!collapsed){const r=elements[state.current?.id]?.getBoundingClientRect(),w=sheet.getBoundingClientRect().width;if(r&&r.width+r.height>0&&r.bottom>y-8&&r.top<y+h+8&&r.right>center-w/2&&r.left<center+w/2){const alt=Math.max(min,area.getBoundingClientRect().top+10);if(alt+h<=v.top+v.height-bottom-12&&!(r.bottom>alt-8&&r.top<alt+h+8))y=alt;}}
  sheet.style.top=y+'px';learnBar.style.top=Math.max(min,v.top+v.height-bottom-12-learnBar.getBoundingClientRect().height)+'px';
 }
 function schedule(){if(active&&!scheduled)scheduled=(window.requestAnimationFrame||((fn)=>setTimeout(fn,0)))(position);}
 function apply(){
  if(!document.body?.isConnected)return;
  const eligible=(innerWidth<=1180||(innerWidth<=1440&&window.matchMedia?.('(pointer:coarse)').matches))&&document.documentElement.clientWidth>0;
  if(!eligible)document.body.dataset.focusMode='false';document.body.dataset.focusShell=String(eligible);shell(eligible);
  const home=layout.classList.contains('routeHomeLayout')||layout.classList.contains('finishLayout'),show=eligible&&!home;
  active=show;document.body.dataset.focusMode=String(show);sheet.hidden=!show||state.mode==='learn';learnBar.hidden=!show||state.mode!=='learn';status.hidden=!show;
  if(show){const task=state.mode==='learn'?'learn':state.questionMode;document.body.dataset.focusTask=task;document.body.dataset.focusAnswered=String(state.answered);
   const key=[state.mode,state.questionMode,state.current?.id,state.route.active?.index].join(':');if(key!==lastQuestion){lastQuestion=key;collapsed=false;}sheet.dataset.collapsed=String(collapsed);text(toggle,collapsed?'Antwoord openen':'Kaart vrijmaken');toggle.setAttribute('aria-expanded',String(!collapsed));
   const stage=state.mode==='route'?$id('routeLessonCount').textContent:state.mode==='exam'?$id('testStatus').textContent:state.mode==='learn'?'Leren':state.mode==='write'?'Namen schrijven':'Aanwijzen';text(status,stage);text(menu.firstElementChild,'☰ Menu');
   // Retire the existing mobile mirror in Focus Mode. Exactly one visible/enabled semantic answer input is used.
   if(mirror&&!mirror.disabled)mirror.disabled=true;if($id('routeDockCheck')&&!$id('routeDockCheck').disabled)$id('routeDockCheck').disabled=true;
  }
  window.TopoFocusCamera?.update(show);
  // Restore only after both destination parents and responsive visibility are settled.
  const c=moveCaret;moveCaret=null;if(c&&!input.disabled){input.focus({preventScroll:true});input.setSelectionRange(c.start,c.end,c.direction);}schedule();
 }
 toggle.onclick=()=>{lastSelection=caret()||lastSelection;collapsed=!collapsed;sheet.dataset.collapsed=String(collapsed);text(toggle,collapsed?'Antwoord openen':'Kaart vrijmaken');toggle.setAttribute('aria-expanded',String(!collapsed));if(!collapsed&&state.questionMode==='write'&&!input.disabled){input.focus({preventScroll:true});if(lastSelection)input.setSelectionRange(lastSelection.start,lastSelection.end,lastSelection.direction);}schedule();};
 menu.addEventListener('click',e=>{if(e.target.closest('.tab'))menu.open=false});
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();menu.open=false;menu.firstElementChild.focus({preventScroll:true})}});
 document.addEventListener('pointerdown',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false});
 const observer=new MutationObserver(apply);for(const node of[layout,quiz,$id('groupPicker'),$id('learnList')])if(node)observer.observe(node,{subtree:true,childList:true,attributes:true,attributeFilter:['class','disabled']});
 window.addEventListener('resize',()=>{if(innerWidth!==lastWidth||document.activeElement!==input){layoutHeight=innerHeight;lastWidth=innerWidth;}apply();});
 window.visualViewport?.addEventListener('resize',position);window.visualViewport?.addEventListener('scroll',position);input.addEventListener('focus',schedule);input.addEventListener('blur',()=>{lastSelection={start:input.selectionStart,end:input.selectionEnd,direction:input.selectionDirection};schedule()});
 if(window.ResizeObserver)new ResizeObserver(schedule).observe(sheet);
 const meta=document.querySelector('meta[name="viewport"]');if(meta&&!meta.content.includes('viewport-fit'))meta.content+=',viewport-fit=cover';
 window.TopoFocus={apply,position,viewport,get active(){return active}};apply();
}
setupFocusMode();
