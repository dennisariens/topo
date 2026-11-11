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
    // Tapping Oefenen again during an exercise goes back to the choice (as the back control does).
    if(!atHome()&&lessonTab()==='oefenen'){toHome();suspended=null;return show('oefenen','v3OefenenTitle');}
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
 const settings=$('dialog.ninoSettings');
 if(settings){
  settings.classList.add('v3','v3SettingsSheet');
  const profile=make('section','ninoSettingsGroup');profile.append(make('h3',null,'Profiel'),btn('Naam en favoriete pizza',()=>window.TopoProfile?.open(), 'v3Btn'));
  settings.querySelector('.ninoSettingsActions')?.prepend(profile);
 }
 function openSettings(opener){settingsOrigin=opener||document.activeElement;$('.ninoSettingsButton')?.click();}
 $('dialog.ninoSettings')?.addEventListener('close',()=>{const o=settingsOrigin;settingsOrigin=null;if(o?.isConnected&&o.checkVisibility?.()!==false)requestAnimationFrame(()=>o.focus({preventScroll:true}));});

 /* Lesson shell: one sidebar for every lesson, free exercise and toets (desktop sidebar, iPad rail, phone tab bar). */
 const shellNav=make('div','v3 v3ShellNav');shellNav.append(V.makeSide());shellNav.hidden=true;body.append(shellNav);
 function marks(){V.markNav(document);}

 /* Oefenen (§ 1): free forms with a choice of group; the slim rondje is the V2 smart route lesson. */
 const FORMS=[['learn','Ontdekken','v3discover'],['point','Aanwijzen','v3point'],['write','Namen schrijven','v3write'],['smart','Slim rondje','v3smart']];
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
 /* Oefenen volgens R-oefenen-ijk (fase B, stap 3): one glass panel (title, four form tiles, a thin line, the groups in
    three columns, the Start pill) and the map as the one loud element, with only the chosen group as pins. The map is
    a decorative clone in variant (a) Eiland, like Reis (DECISIONS 10-11, fase B stap 2), until the owner chooses. */
 let oefMap=null;const oefStage=make('div','v3OefStage');oefStage.setAttribute('aria-hidden','true');
 function groupIds(g){if(g==='mistakes')return state.mistakes||[];if(g==='all')return [];return ROUTE_CHAPTERS.find(c=>c.id===g)?.itemIds||[];}
 function paintOef(){
  if(!oefMap){oefMap=V.cloneMap('v3o-','v3Map');if(!oefMap)return;oefMap.classList.add('v3OefMap');oefStage.append(oefMap);V.addIsland(oefMap,'v3o-');}
  oefMap.dataset.relief='on';oefMap.dataset.kaart=V.ui.kaart||'eiland';
  const ids=pick.form==='smart'?[]:groupIds(pick.group),set=new Set(ids);
  oefMap.querySelectorAll('[data-id]').forEach(n=>n.classList.toggle('v3Hit',set.has(n.getAttribute('data-id'))));
  oefMap.dataset.focus=ids.length?(ids.every(id=>id.startsWith('city'))?'points':'areas'):'';
  requestAnimationFrame(()=>V.fit(oefMap));
 }
 if('ResizeObserver' in window)new ResizeObserver(()=>{if(oefMap)V.fit(oefMap);}).observe(oefStage);
 // Raster: the panel ends on the first column line after its content (the longest chip sets it), 5–8 of 12 columns.
 function snapOef(){
  const view=document.querySelector('.v3View-oefenen'),panel=view?.querySelector('.v3OefPanel');if(!panel||!matchMedia('(min-width:1024px)').matches){view?.style.removeProperty('--v3-oef-w');return;}
  const gut=parseFloat(getComputedStyle(view).columnGap)||0,col=(view.getBoundingClientRect().width-11*gut)/12;if(!(col>0))return;
  // Measured with the group shown (also for Slim rondje), so switching the form never moves the panel's edge.
  const g=panel.querySelector('.v3OefGroep'),was=g.hidden,chips=g.querySelector('.v3Chips'),cs=getComputedStyle(panel);g.hidden=false;chips.style.width='max-content';const w=chips.getBoundingClientRect().width+parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight);chips.style.width='';g.hidden=was;
  const n=Math.max(5,Math.min(8,Math.ceil((w+gut-.5)/(col+gut))));
  view.style.setProperty('--v3-oef-w','calc('+n+' * var(--v3-col) + '+(n-1)+' * var(--v3-gut))');view.dataset.cols=n;
 }
 addEventListener('resize',()=>{if(ui.view==='oefenen')snapOef();});
 V.addView('oefenen','Oefenen',view=>{
  const h=make('h1','v3ScreenTitle','Oefenen');h.id='v3OefenenTitle';h.tabIndex=-1;
  const forms=make('div','v3Forms');forms.setAttribute('role','group');
  for(const [id,label,glyph] of FORMS){const b=chip('',pick.form===id,()=>{pick.form=id;V.render();},'v3FormBtn');b.append(V.icon(glyph),make('span',null,label));b.dataset.form=id;forms.append(b);}
  const mistakes=state.mistakes?.length||0;
  const groups=groupChips(id=>pick.group===id,id=>{pick.group=id;V.render();},{extra:[['all','Alles'],['mistakes','Mijn fouten'+(mistakes?' · '+mistakes:''),!mistakes]]});
  const vorm=field('Vorm',forms,'v3OefenenVorm'),groupField=field('Groep',groups,'v3OefenenGroep');
  // One title per screen: the field headings stay for screen readers; a thin line separates form and group.
  vorm.querySelector('h2').className=groupField.querySelector('h2').className='v3SrOnly';groupField.classList.add('v3OefGroep');
  if(pick.form==='smart')groupField.hidden=true;
  const start=btn('',e=>{e.stopPropagation();startPractice();},'v3Btn primary v3Start');start.append(V.icon('v3play'),make('span',null,'Start'));
  const panel=make('div','v3OefPanel');panel.append(h,vorm,groupField,start);
  view.replaceChildren(panel,oefStage);
  paintOef();requestAnimationFrame(snapOef);
 });

 /* Toets (§ 2) and Voortgang (§ 3): their views live in toets.js and voortgang.js. */
 // Start a free exercise from elsewhere (Toets › Oefen deze fouten): same path as Oefenen › Start.
 function practice(form,group){pick.form=form;pick.group=group;startPractice();}
 V.shell={go,currentTab,atHome,lessonTab,toHome,show,field,chip,groupChips,marks,practice,get suspended(){return suspended;}};
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
 // Phone: the real height of the fixed tab bar (with safe area), so screens outside lessons clear it (shell.css).
 const tabbar=()=>{const bar=[...document.querySelectorAll('.v3Side')].find(e=>e.checkVisibility?.()&&getComputedStyle(e).position==='fixed'&&e.getBoundingClientRect().bottom>=innerHeight-1);
  if(bar)document.documentElement.style.setProperty('--v3-tabbar',Math.ceil(bar.getBoundingClientRect().height)+'px');};
 if('ResizeObserver' in window){const ro=new ResizeObserver(tabbar);document.querySelectorAll('.v3Side').forEach(e=>ro.observe(e));}
 addEventListener('resize',tabbar);tabbar();
 // Keyboard focus outside lessons: a control that lands behind the tab bar scrolls clear of it (scroll-padding).
 document.addEventListener('focusin',e=>{const t=e.target;if(body.classList.contains('v3Les')||!t?.closest?.('.v3Reis')||t.closest('.v3Side'))return;
  const bar=[...document.querySelectorAll('.v3Reis>.v3Side')].find(x=>getComputedStyle(x).position==='fixed');if(!bar)return;
  if(t.getBoundingClientRect().bottom>bar.getBoundingClientRect().top)t.scrollIntoView({block:'nearest',behavior:'instant'});});
})();
