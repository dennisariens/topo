/* TOPO V3.0 — shell: navigation on every screen and the remaining screens (docs/v3/V3_0_REST.md).
   Presentation layer over the unchanged V2 app. Tabs: Reis · Oefenen · Toets · Beloningen · Voortgang, Instellingen
   at the bottom. Reis, Beloningen, the Oefenen choice, Toets (set-up and result) and Voortgang are views of the one
   V3 window (reis.js); lessons, free practice and the toets run in the V2 engine inside the V3 lesson shell (les.js).
   Every action presses a V2 control or calls the V2 function behind it; V3 never grades, rewards or stores progress. */
(function setupV3Shell(){
 'use strict';
 const V=window.TOPO_V3;if(!V)return;
 const {make,btn,ui}=V,$=s=>document.querySelector(s),body=document.body;
 const legacyTab=m=>$('nav.tabs .tab[data-mode="'+m+'"]');
 const atHome=()=>!$('#journeyScreen')?.classList.contains('hidden')&&!$('#routeHome')?.classList.contains('hidden');
 const FREE=['learn','point','write'];

 /* Where the learner is. The tab follows the chosen route (DECISIONS 7-11): route lessons → Reis, free practice and
    the slim rondje → Oefenen, the toets → Toets. On the V3 window the tab is its view. */
 function lessonTab(){
  if(state.mode==='exam')return 'toets';
  if(state.mode==='route')return state.route?.active?.kind==='smart'?'oefenen':'reis';
  return 'oefenen';
 }
 function currentTab(){
  if(!atHome())return lessonTab();
  return {toetsResult:'toets',oefenen:'oefenen',toets:'toets',rewards:'rewards',voortgang:'voortgang'}[ui.view]||'reis';
 }

 /* Leaving a lesson: the V2 "Reis" control keeps the exact lesson (question, draft, selection) for its own way back:
    Reis → Ga verder for route lessons, Oefenen for free practice and the toets. */
 let suspended=null;
 function toHome(){
  if(atHome())return;
  suspended=state.mode==='exam'?(state.examEnded?null:'toets'):state.mode==='route'?(state.route?.active?.kind==='smart'?'smart':'reis'):'oefenen';
  V.v2Nav('Reis')?.click();
 }
 const focusTitle=id=>requestAnimationFrame(()=>document.getElementById(id)?.focus({preventScroll:true}));
 function show(view,title){ui.view=view;V.render();marks();if(title)focusTitle(title);}
 function go(tab,opener){
  switch(tab){
   case 'reis':toHome();return show('reis');
   case 'rewards':toHome();return show('rewards','v3RewardsTitle');
   case 'voortgang':toHome();return show('voortgang','v3VoortgangTitle');
   case 'oefenen':
    if(!atHome()&&lessonTab()==='oefenen')return;
    toHome();
    if(suspended==='oefenen'&&FREE.includes(state.mode)){suspended=null;return V.v2Nav('Oefenen')?.click();}
    if(suspended==='smart'&&state.route?.active?.kind==='smart'&&!state.route.active.done){suspended=null;return $('#routeContinue')?.click();}
    return show('oefenen','v3OefenenTitle');
   case 'toets':
    if(!atHome()&&state.mode==='exam'&&!state.examEnded)return;
    toHome();
    if(suspended==='toets'&&state.mode==='exam'&&!state.examEnded){suspended=null;return V.v2Nav('Oefenen')?.click();}
    return show('toets','v3ToetsTitle');
   case 'instellingen':return openSettings(opener);
  }
 }
 // Settings: the V2 dialog (profile, reservekopie, wissen); focus returns to the V3 control that opened it.
 let settingsOrigin=null;
 function openSettings(opener){settingsOrigin=opener||document.activeElement;$('.ninoSettingsButton')?.click();}
 $('dialog.ninoSettings')?.addEventListener('close',()=>{const o=settingsOrigin;settingsOrigin=null;if(o?.isConnected&&o.checkVisibility?.()!==false)requestAnimationFrame(()=>o.focus({preventScroll:true}));});

 /* Lesson shell: one sidebar for every lesson, free exercise and toets (desktop sidebar, iPad rail, phone tab bar). */
 const shellNav=make('div','v3 v3ShellNav');shellNav.append(V.makeSide());shellNav.hidden=true;body.append(shellNav);
 function marks(){V.markNav(document);}

 /* Oefenen (§ 1): free forms with a choice of group; the slim rondje is the V2 smart route lesson. */
 const FORMS=[['learn','Ontdekken','discover'],['point','Aanwijzen','point'],['write','Namen schrijven','write'],['smart','Slim rondje','v3smart']];
 const pick={form:'point',group:'city1'};
 function chip(label,on,fn,cls='v3Chip'){const b=btn(label,e=>{e.stopPropagation();fn();},'v3Btn '+cls);b.setAttribute('aria-pressed',String(!!on));return b;}
 function groupChips(selected,toggle,{multi=false,extra=[]}={}){
  const wrap=make('div','v3Chips');wrap.setAttribute('role','group');
  for(const c of ROUTE_CHAPTERS){const b=chip('',selected(c.id),()=>toggle(c.id));b.append(V.range(c.title));b.dataset.group=c.id;wrap.append(b);}
  for(const [id,label,disabled] of extra){const b=chip(label,selected(id),()=>toggle(id));b.dataset.group=id;if(disabled)b.disabled=true;wrap.append(b);}
  return wrap;
 }
 function field(title,content,id){const f=make('section','v3Field');const h=make('h2',null,title);h.id=id;f.setAttribute('aria-labelledby',id);f.append(h,content);return f;}
 function startPractice(){
  if(pick.form==='smart'){show('reis');return $('#smartStart')?.click();}
  ui.view='reis';
  V.v2Nav('Oefenen')?.click();
  legacyTab(pick.form)?.click();
  const sel=$('#groupSelect');if(sel){sel.value=pick.group;sel.dispatchEvent(new Event('change',{bubbles:true}));}
  suspended=null;
 }
 V.addView('oefenen','Oefenen',view=>{
  const h=make('h1',null,'Oefenen');h.id='v3OefenenTitle';h.tabIndex=-1;
  const forms=make('div','v3Forms');forms.setAttribute('role','group');
  for(const [id,label,glyph] of FORMS){const b=chip('',pick.form===id,()=>{pick.form=id;V.render();},'v3FormBtn');b.append(V.icon(glyph),make('span',null,label));b.dataset.form=id;forms.append(b);}
  const mistakes=state.mistakes?.length||0;
  const groups=groupChips(id=>pick.group===id,id=>{pick.group=id;V.render();},{extra:[['all','Alles'],['mistakes','Mijn fouten'+(mistakes?' · '+mistakes:''),!mistakes]]});
  const groupField=field('Groep',groups,'v3OefenenGroep');if(pick.form==='smart')groupField.hidden=true;
  const start=btn('Start',e=>{e.stopPropagation();startPractice();},'v3Btn primary v3Start');
  view.replaceChildren(h,field('Vorm',forms,'v3OefenenVorm'),groupField,start);
 });

 /* Toets (§ 2) and Voortgang (§ 3): their views; content follows in toets.js and voortgang.js. */
 const title=(text,id)=>{const h=make('h1',null,text);h.id=id;h.tabIndex=-1;return h;};
 V.addView('toets','Toets',view=>{if(!view.firstChild)view.append(title('Toets','v3ToetsTitle'));});
 V.addView('voortgang','Voortgang',view=>{if(!view.firstChild)view.append(title('Voortgang','v3VoortgangTitle'));});
 V.shell={go,currentTab,atHome,lessonTab,toHome,show,field,chip,groupChips,marks,get suspended(){return suspended;}};
 V.go=go;V.currentTab=currentTab;

 /* V2 chrome that V3 replaces everywhere: header, the V2 tabs and Focus Mode's menu (all reachable through the
    V3 navigation or Instellingen). Marked on body; CSS hides them. */
 body.classList.add('v3Shell');
 let queued=0;
 function update(){
  queued=0;
  const home=atHome(),lesson=body.classList.contains('v3Les');
  shellNav.hidden=home||!lesson;
  body.dataset.v3Tab=currentTab();
  marks();
 }
 new MutationObserver(()=>{if(!queued)queued=requestAnimationFrame(update);}).observe(body,{subtree:true,attributes:true,attributeFilter:['class','hidden']});
 update();
})();
