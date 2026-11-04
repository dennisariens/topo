/* NINO 2 presentation: reads canonical progress, never awards or stores achievements. */
(function setupNinoV2(){
 const art=NINO_V2_ART,make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const image=(key,cls='')=>{const a=art[key],i=make('img',cls);i.src=a.src;i.width=a.width;i.height=a.height;i.alt='';i.setAttribute('aria-hidden','true');i.decoding='async';return i;};
 const action=(text,fn,cls='button')=>{const b=make('button',cls,text);b.type='button';b.onclick=fn;return b;};
 const nav=make('nav','ninoNav');nav.setAttribute('aria-label','Hoofdnavigatie');
 // Reis is a temporary view of the existing exercise, not a mode change.
 const layout=document.querySelector('.layout');let practiceView=null;
 const viewNodes=['#quiz','#routeHome','#routeLessonBar','#routeMapDock','#journeyScreen','#finishScreen'];
 const reis=action('Reis',()=>{
  if(layout.classList.contains('routeHomeLayout'))return;
  practiceView={current:state.current,route:state.route,layout:layout.className,lesson:document.body.classList.contains('lessonFocus'),nodes:viewNodes.map(s=>document.querySelector(s)).filter(Boolean).map(node=>[node,node.className])};
  layout.classList.remove('finishLayout');document.querySelector('#finishScreen')?.classList.add('hidden');
  renderRouteHome(true);
 }),practice=action('Oefenen',()=>{
  if(!layout.classList.contains('routeHomeLayout'))return;
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
 const brand=document.querySelector('.brand');brand.lastChild.textContent='NINO';brand.querySelector('small').textContent='La Grande Avventura';
 const legacy=document.querySelector('nav.tabs');legacy.setAttribute('aria-label','Oefenvorm');legacy.classList.add('practiceModes');
 legacy.querySelector('[data-mode="route"]').hidden=true;
 const dialog=make('dialog','travelBook');dialog.id='travelBook';dialog.setAttribute('aria-labelledby','travelBookTitle');
 const head=make('header','bookHeader'),title=make('h2',null,'Il mio viaggio in Italia');title.id='travelBookTitle';
 const close=action('Sluit boekje',()=>dialog.close());head.append(title,close);
 const stampZoom=make('dialog','stampZoom');stampZoom.setAttribute('aria-label','Lesstempel in detail');document.body.append(stampZoom);let stampOrigin=null;
 stampZoom.addEventListener('close',()=>stampOrigin?.focus({preventScroll:true}));
 function inspectStamp(index,c,button){stampOrigin=button;stampZoom.replaceChildren(make('h3',null,c.title),image('stamp'+index,'stampLarge'),make('p',null,'Verdiend door deze halte af te ronden.'),action('Sluit stempel',()=>stampZoom.close()));stampZoom.showModal();}
 const body=make('div','bookSpread'),foot=make('div','bookFooter');let page=0,side=0,origin=null,scroll=null;const isNarrow=()=>innerWidth<=650;
 const pageLabel=make('span','micro');pageLabel.setAttribute('aria-live','polite');
 function turn(delta){if(isNarrow()){const leaf=page*2+side+delta;page=Math.floor(leaf/2);side=leaf%2;}else page+=delta;renderBook();}
 const previous=action('Vorige',()=>turn(-1)),next=action('Volgende',()=>turn(1));foot.append(previous,pageLabel,next);dialog.append(head,body,foot);document.body.append(dialog);
 function record(c){return state.route.chapters[c.id]||{stage:0,goldAt:0};}
 function renderBook(){
  body.replaceChildren();previous.disabled=page===0&&(!isNarrow()||side===0);next.disabled=page===2&&(!isNarrow()||side===1);pageLabel.textContent=['Mijn reis','Lesstempels','Bestemmingen'][page]+' · '+(isNarrow()?(page*2+side+1)+' / 6':(page+1)+' / 3');
  const left=make('section','bookPage'),right=make('section','bookPage');body.append(left,right);if(isNarrow())(side===0?right:left).hidden=true;
  if(page===0){
   left.append(make('p','eyebrow','Il passaporto di Nino'),make('h3',null,'Jouw grote avontuur'),image('welcome','bookNino'),make('p',null,'Elke les brengt je verder door Italië. Hier bewaar je wat je écht hebt verdiend.'));
   const completed=ROUTE_CHAPTERS.filter(c=>record(c).stage===3).length,gold=ROUTE_CHAPTERS.filter(c=>record(c).goldAt>0).length;
   right.append(make('h3',null,'Dit is jouw reis'),make('p','bookCount',completed+' / 11 haltes'),make('p',null,gold+' gouden haltes · '+state.trips+' Vespa-reizen'),make('p',null,state.slices+' / 8 goede antwoorden tot je volgende pizza.'),make('p',null,(state.pizzas%3)+' / 3 pizza’s voor je volgende Vespa-rit.'));
   if(state.pizzas>0){right.append(image('pizza'+((state.pizzas-1)%3),'bookPizza'),make('p','micro','Laatst verdiende pizza · '+['Margherita','Salami','Quattro Formaggi'][(state.pizzas-1)%3]));}
   else right.append(make('p','bookEmpty','Nog geen pizza verdiend. Acht goede antwoorden leveren één pizza op.'));
   if(gold===11)right.append(image('finalGold','bookFinalGold'),make('p',null,'Esploratore d’oro · alle elf haltes goud!'));
   right.append(action('Verder leren',()=>dialog.close(),'button primary'));
  }else if(page===1){
   left.append(make('h3',null,'Jouw lesstempels'));right.append(make('h3',null,'Verder door Italië'));
   ROUTE_CHAPTERS.forEach((c,index)=>{const r=record(c),earned=r.stage===3,row=make('article','bookStamp'+(earned?' earned':''));row.dataset.chapter=c.id;
    if(earned){const inspect=action('',()=>inspectStamp(index,c,inspect),'stampInspect');inspect.setAttribute('aria-label','Bekijk stempel: '+c.title);inspect.append(image('stamp'+index,'stampArt'));row.append(inspect);if(r.goldAt>0)row.append(image('chapterGold','chapterSeal'));}
    const copy=make('div');copy.append(make('h4',null,c.title),make('p','micro',earned?(r.goldAt>0?'Afgerond · goud verdiend':'Afgerond · stempel verdiend'):'Nog te verdienen'));row.append(copy);(index<6?left:right).append(row);
   });
  }else{
   left.append(make('h3',null,'Met de Vespa door Italië'),make('p',null,state.trips+' Vespa-'+(state.trips===1?'reis':'reizen')+' verdiend met leren.'));
   // Saves contain a count, not event history. Reconstruct only deterministic destinations.
   if(!state.trips)left.append(make('p','bookEmpty','Je eerste rit gaat van Rome naar Florence. Verdien drie pizza’s om te vertrekken.'));
   else{left.append(image('arrival','arrivalStamp'));const list=make('ol','destinationList');TopoLearning.STOPS.forEach((_,i)=>{const first=i+1;if(state.trips<first)return;const visits=Math.floor((state.trips-first)/TopoLearning.STOPS.length)+1,j=TopoLearning.journey(first);list.append(make('li',null,j.to+' · '+visits+'× bereikt'));});left.append(list);}
   right.append(make('h3',null,'Post uit Italië'));
   const cards=[];if(record(ROUTE_CHAPTERS.find(c=>c.id==='islands')).stage===3)cards.push(['sicilia','Sicilia · souvenir van je eilandenles'],['sardegna','Sardegna · souvenir van je eilandenles']);if(state.trips>=3&&art.venezia)cards.push(['venezia','Venetië · bereikt met je derde Vespa-rit']);if(state.trips>=6)cards.push(['napoli','Napels · bereikt met je zesde Vespa-rit']);
   if(!cards.length)right.append(make('p','bookEmpty','Je postkaarten verschijnen hier na de bijbehorende les of Vespa-rit.'));
   for(const [key,label]of cards){const card=make('figure','earnedPostcard'),flip=action('Bekijk achterkant',()=>{const reverse=flip.dataset.reverse!=='true';picture.replaceWith(picture=image(reverse?'reverse':key,'postcardArt'));flip.dataset.reverse=String(reverse);flip.textContent=reverse?'Bekijk voorkant':'Bekijk achterkant';});let picture=image(key,'postcardArt');card.append(picture,make('figcaption',null,label),flip);right.append(card);}
  }
  if(page===0){for(const [folio,section]of [['left',left],['right',right]]){section.classList.add('illustratedFolio');const content=make('div','folioWriting');content.append(...section.childNodes);section.append(image('folio'+folio,'folioPaper'),content);}}
 }
 function openBook(button){if(dialog.open)return;origin=button;scroll=[window.scrollX,window.scrollY];renderBook();dialog.showModal();close.focus();}
 dialog.addEventListener('close',()=>{origin?.focus({preventScroll:true});if(scroll)window.scrollTo(...scroll);});
 dialog.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;if(e.key==='ArrowRight'&&!next.disabled){e.preventDefault();turn(1);}if(e.key==='ArrowLeft'&&!previous.disabled){e.preventDefault();turn(-1);}});
 window.addEventListener('resize',()=>{side=0;if(dialog.open)renderBook();});
 function update(){
  const home=document.querySelector('.layout').classList.contains('routeHomeLayout');reis.setAttribute('aria-current',home?'page':'false');practice.setAttribute('aria-current',home?'false':'page');
  document.body.dataset.ninoHome=String(home);legacy.hidden=home;
  ROUTE_CHAPTERS.forEach((c,i)=>{const card=document.querySelector('.routeCard[data-chapter="'+c.id+'"]');if(!card||!TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,c.id)||card.querySelector('.chapterPicture'))return;card.prepend(image('chapter'+i,'chapterPicture'));});
 }
 new MutationObserver(update).observe(document.querySelector('.layout'),{attributes:true,attributeFilter:['class']});
 new MutationObserver(update).observe(document.querySelector('#routeCards'),{childList:true});update();
})();
