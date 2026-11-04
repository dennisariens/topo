/* NINO 2 presentation: reads canonical progress, never awards or stores achievements. */
(function setupNinoV2(){
 const art=NINO_V2_ART,make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const image=(key,cls='')=>{const a=art[key],i=make('img',cls);i.src=a.src;i.width=a.width;i.height=a.height;i.alt='';i.setAttribute('aria-hidden','true');i.decoding='async';return i;};
 const action=(text,fn,cls='button')=>{const b=make('button',cls,text);b.type='button';b.onclick=fn;return b;};
 const nav=make('nav','ninoNav');nav.setAttribute('aria-label','Hoofdnavigatie');
 // Reis is a temporary view of the existing exercise, not a mode change.
 const layout=document.querySelector('.layout'),rewardPresentation=document.querySelector('#pizzaCelebration');let practiceView=null;
 const viewNodes=['#quiz','#routeHome','#routeLessonBar','#routeMapDock','#journeyScreen','#finishScreen'];
 const reis=action('Reis',()=>{
  if(layout.classList.contains('routeHomeLayout'))return;
  practiceView={current:state.current,route:state.route,layout:layout.className,lesson:document.body.classList.contains('lessonFocus'),nodes:viewNodes.map(s=>document.querySelector(s)).filter(Boolean).map(node=>[node,node.className])};
  layout.classList.remove('finishLayout');document.querySelector('#finishScreen')?.classList.add('hidden');
  renderRouteHome(true);
 }),practice=action('Oefenen',()=>{
  if(!layout.classList.contains('routeHomeLayout'))return;
  if(practiceView&&(state.current!==practiceView.current||state.route!==practiceView.route))practiceView=null;
  if(practiceView){
   layout.className=practiceView.layout;document.body.classList.toggle('lessonFocus',practiceView.lesson);
   for(const [node,cls]of practiceView.nodes)node.className=cls;
   practiceView=null;
  }else if(state.mode==='route'&&state.route.active&&!state.route.active.done)renderRouteTask();
  else if(state.mode==='route')mode('learn');
 }),bookButton=action('Reisboekje',()=>openBook(bookButton));
 // Leave the suspended view only after a journey action actually proceeds (confirm may cancel).
 document.querySelector('#journeyScreen').addEventListener('click',e=>{
  if(!practiceView||!e.target.closest('button:not(:disabled)'))return;
  const opened=!layout.classList.contains('routeHomeLayout');
  if(!opened&&state.current===practiceView.current&&state.route===practiceView.route)return;
  practiceView=null;if(state.mode!=='route'){mode('route');if(opened)renderRouteTask();}
 });
 nav.append(reis,practice,bookButton);document.querySelector('header').after(nav);
 const mark=document.querySelector('.brandMark');mark.replaceChildren(image('travel','headerIcon'));
 const reward=document.querySelector('.journeyReward');reward.before(make('h3','rewardHeading','Pizza’s & Vespa-ritten'));reward.setAttribute('aria-label','Verdiende pizzabeloningen');
 const brand=document.querySelector('.brand');brand.lastChild.textContent='NINO';brand.querySelector('small').textContent='La Grande Avventura';
 const legacy=document.querySelector('nav.tabs');legacy.setAttribute('aria-label','Oefenvorm');legacy.classList.add('practiceModes');
 legacy.querySelector('[data-mode="route"]').hidden=true;
 const dialog=make('dialog','travelBook');dialog.id='travelBook';dialog.setAttribute('aria-labelledby','travelBookTitle');
 const head=make('header','bookHeader'),title=make('h2',null,'Il mio viaggio in Italia');title.id='travelBookTitle';
 const close=action('Sluit boekje',()=>dialog.close());head.append(title,close);
 const stampZoom=make('dialog','stampZoom');stampZoom.setAttribute('aria-label','Lesstempel in detail');document.body.append(stampZoom);let stampOrigin=null;
 stampZoom.addEventListener('close',()=>stampOrigin?.focus({preventScroll:true}));
 function inspectStamp(index,c,button){stampOrigin=button;stampZoom.replaceChildren(make('h3',null,c.title),image('stamp'+index,'stampLarge'),make('p',null,'Verdiend door deze halte af te ronden.'),action('Sluit stempel',()=>stampZoom.close()));stampZoom.append(image('chapter'+index,'stampChapter'));stampZoom.showModal();}
 const body=make('div','bookSpread'),foot=make('div','bookFooter');let leaf=0,origin=null,scroll=null;const isNarrow=()=>innerWidth<900||(innerWidth<1100&&innerHeight>innerWidth);
 const pageLabel=make('span','micro');pageLabel.setAttribute('aria-live','polite');
 const previous=action('Vorige',()=>{leaf=Math.max(0,leaf-(isNarrow()?1:2));renderBook();}),next=action('Volgende',()=>{leaf+=isNarrow()?1:2;renderBook();});foot.append(previous,pageLabel,next);dialog.append(head,body,foot);document.body.append(dialog);
 function record(c){return state.route.chapters[c.id]||{stage:0,goldAt:0};}
 function profile(){return window.TopoProfile?.current();}
 function renderBook(){
  const p=profile(),pages=[];
  const page=(heading,fill)=>pages.push({heading,fill});
  page('Il mio viaggio in Italia',section=>{section.classList.add('coverFolio');section.append(image('cover','bookCover'),make('h3','coverTitle',p?.name?p.name+' · mijn reisboekje':'Mijn reisboekje'),make('p','micro','Jouw herinneringen aan leren en reizen.'),action('Pas mijn boekje aan',()=>TopoProfile.open({onDone:renderBook})));});
  page(p?.name?'Ciao, '+p.name+'!':'Dit is jouw reis',section=>{
   const completed=ROUTE_CHAPTERS.filter(c=>record(c).stage===3).length,gold=ROUTE_CHAPTERS.filter(c=>record(c).goldAt>0).length;
   section.append(make('h3',null,p?.name?'Ciao, '+p.name+'!':'Dit is jouw reis'),make('p','bookCount',completed+' / 11 haltes'),make('p',null,gold+' gouden haltes · '+state.trips+' Vespa-reizen'));
   if(p?.favoritePizza){const key=p.favoritePizza==='quattro_formaggi'?'quattro-formaggi':p.favoritePizza;section.append(make('p','favoriteLabel','Mijn lievelingspizza · '+TopoPizza.name(key)));}
   section.append(make('p',null,state.slices+' / 8 stukken voor '+TopoPizza.name(TopoPizza.flavor(state.pizzas))),make('p',null,(state.pizzas%3)+' / 3 pizza’s tot je volgende Vespa-rit.'));
   if(state.pizzas>0)section.append(image('pizza'+((state.pizzas-1)%3),'bookPizza'),make('p','micro','Laatst verdiend · '+TopoPizza.name(TopoPizza.flavor(state.pizzas,true))));
   else section.append(make('p','bookEmpty','Nog geen pizza verdiend. Acht goede antwoorden leveren één pizza op.'));
   section.append(action('Verder leren',()=>dialog.close(),'button primary'));
  });
  for(let start=0;start<11;start+=3){page('Lesstempels · '+(start+1)+'–'+Math.min(11,start+3),section=>{
   section.append(make('h3',null,'Jouw lesstempels'),make('p','micro','Een stempel na Namen schrijven. Goud is een extra uitdaging.'));
   ROUTE_CHAPTERS.slice(start,start+3).forEach((c,n)=>{
    const index=start+n,r=record(c),earned=r.stage===3,unlocked=TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,c.id),row=make('article','bookStamp'+(earned?' earned':''));row.dataset.chapter=c.id;
    if(earned){const inspect=action('',()=>inspectStamp(index,c,inspect),'stampInspect');inspect.setAttribute('aria-label','Bekijk stempel: '+c.title);inspect.append(image('stamp'+index,'stampArt'));row.append(inspect);if(r.goldAt>0)row.append(image('chapterGold','chapterSeal'));}
    else if(unlocked)row.append(image('chapter'+index,'bookChapter'));
    const copy=make('div');copy.append(make('h4',null,c.title),make('p','micro',earned?(r.goldAt>0?'Afgerond · goud verdiend':'Afgerond · stempel verdiend'):unlocked?'Hier kun je verder leren':'Nog te verdienen'));row.append(copy);section.append(row);
   });
  });}
  page('Met de Vespa door Italië',section=>{
   section.append(make('h3',null,'Je Vespa-bestemmingen'),make('p',null,state.trips+' verdiende '+(state.trips===1?'rit':'ritten')));
   if(!state.trips)section.append(make('p','bookEmpty','Je eerste rit gaat van Rome naar Florence. Drie verdiende pizza’s brengen je verder.'));
   else{section.append(image('arrival','arrivalStamp'));const list=make('ol','destinationList');TopoLearning.STOPS.forEach((_,i)=>{const first=i+1;if(state.trips<first)return;const visits=Math.floor((state.trips-first)/TopoLearning.STOPS.length)+1,j=TopoLearning.journey(first);list.append(make('li',null,j.to+' · '+visits+'× bereikt'));});section.append(list);}
   section.append(make('p','micro','Je leshaltes en je Vespa-bestemmingen zijn twee verschillende reizen.'));
  });
  const cards=[];if(record(ROUTE_CHAPTERS.find(c=>c.id==='islands')).stage===3)cards.push(['sicilia','Sicilia · souvenir van je eilandenles'],['sardegna','Sardegna · souvenir van je eilandenles']);if(state.trips>=3)cards.push(['venezia','Venetië · je derde Vespa-rit']);if(state.trips>=6)cards.push(['napoli','Napels · je zesde Vespa-rit']);
  if(!cards.length)page('Post uit Italië',section=>section.append(make('h3',null,'Post uit Italië'),make('p','bookEmpty','Je postkaarten verschijnen na je eilandenles of een bijbehorende Vespa-rit. Blijf ontdekken!')));
  for(const [key,label]of cards)page(label,section=>{section.append(make('h3',null,'Post uit Italië'));const card=make('figure','earnedPostcard');let picture=image(key,'postcardArt');const flip=action('Bekijk achterkant',()=>{const reverse=flip.dataset.reverse!=='true';picture.replaceWith(picture=image(reverse?'reverse':key,'postcardArt'));flip.dataset.reverse=String(reverse);flip.textContent=reverse?'Bekijk voorkant':'Bekijk achterkant';});card.append(picture,make('figcaption',null,label),flip);section.append(card);});
  if(ROUTE_CHAPTERS.every(c=>record(c).goldAt>0))page('Esploratore d’oro',section=>section.append(make('h3',null,'Esploratore d’oro'),image('finalGold','bookFinalGold'),make('p',null,'Alle elf haltes goud. Benissimo!')));
  if(pages.length%2)page('Jouw volgende herinnering',section=>section.append(make('h3',null,'Er is nog meer te ontdekken'),make('p','bookEmpty','Nieuwe herinneringen verschijnen hier als je ze verdient.')));
  leaf=Math.min(Math.max(0,leaf),pages.length-1);if(!isNarrow())leaf-=leaf%2;
  dialog.classList.toggle('bookSingle',isNarrow());dialog.dataset.cover=p?.coverColor||'riviera';body.replaceChildren();
  const visible=isNarrow()?[leaf]:[leaf,leaf+1];
  for(const index of visible){const info=pages[index],section=make('section','bookPage illustratedFolio'),content=make('div','folioWriting');section.setAttribute('aria-label',info.heading);info.fill(content);section.append(image('folio'+(index%2?'right':'left'),'folioPaper'),content);body.append(section);}
  previous.disabled=leaf===0;next.disabled=leaf+(isNarrow()?1:2)>=pages.length;pageLabel.textContent=(leaf+1)+(isNarrow()?'':'–'+(leaf+2))+' / '+pages.length;
 }
 function openBook(button){if(dialog.open)return;origin=button;scroll=[window.scrollX,window.scrollY];renderBook();dialog.showModal();close.focus();}
 dialog.addEventListener('close',()=>{origin?.focus({preventScroll:true});if(scroll)window.scrollTo(...scroll);});
 dialog.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;if(e.key==='ArrowRight'&&!next.disabled){e.preventDefault();next.click();}if(e.key==='ArrowLeft'&&!previous.disabled){e.preventDefault();previous.click();}});
 window.addEventListener('resize',()=>{if(dialog.open)renderBook();});
 function update(){
  const home=document.querySelector('.layout').classList.contains('routeHomeLayout');reis.setAttribute('aria-current',home?'page':'false');practice.setAttribute('aria-current',home?'false':'page');
  document.body.dataset.ninoHome=String(home);legacy.hidden=home;
  const celebration=rewardPresentation,finish=document.querySelector('#finishScreen');
  const anchor=home?document.querySelector('.journeyReward'):layout.classList.contains('finishLayout')?finish?.querySelector('h2'):document.querySelector('#message');
  if(celebration&&anchor&&celebration.previousElementSibling!==anchor)anchor.after(celebration);
  const cards=document.querySelector('#routeCards');
  for(const group of cards.querySelectorAll('.routeCollection')){group.before(...group.querySelectorAll('.routeCard'));group.remove();}
  const ordered=ROUTE_CHAPTERS.map(c=>cards.querySelector('.routeCard[data-chapter="'+c.id+'"]')).filter(Boolean);
  const actual=[...cards.querySelectorAll('.routeCard')];if(ordered.some((card,i)=>card!==actual[i]))for(const card of ordered)cards.append(card);
  ROUTE_CHAPTERS.forEach((c,i)=>{const card=ordered[i];if(!card||card.querySelector('.chapterPicture'))return;card.prepend(image('chapter'+i,'chapterPicture'));});
 }
 new MutationObserver(update).observe(document.querySelector('.layout'),{attributes:true,attributeFilter:['class']});
 new MutationObserver(update).observe(document.querySelector('#routeCards'),{childList:true});update();
 TopoProfile.setup({art:{welcome:art.welcome.src,cover:art.cover.src,pizzas:{margherita:art.favorite0.src,salami:art.favorite1.src,quattro_formaggi:art.favorite2.src}}});
 // Existing learners keep their lesson/session. Personalization is always available in the book.
 const progressed=state.good>0||state.pizzas>0||state.trips>0||state.route.active||state.slices>0||state.mistakes.length>0||Object.keys(state.route.items).length>0||Object.values(state.route.chapters).some(r=>r.stage>0||r.goldAt>0);
 if(!progressed&&!TopoProfile.current())setTimeout(()=>TopoProfile.open({firstRun:true}),0);
})();
