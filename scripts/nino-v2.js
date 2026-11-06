/* NINO 2 presentation: reads canonical progress, never awards or stores achievements. */
(function setupNinoV2(){
 const art=NINO_V2_ART,PIZZA_KEYS=['margherita','salami','quattro-formaggi'],make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
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
 const head=make('header','bookHeader'),title=make('h2',null,'Mijn reisboekje');title.id='travelBookTitle';
 const close=action('Sluit boekje',()=>dialog.close());head.append(title,close);
 const stampZoom=make('dialog','stampZoom');stampZoom.setAttribute('aria-label','Lesstempel in detail');document.body.append(stampZoom);let stampOrigin=null;
 stampZoom.addEventListener('close',()=>stampOrigin?.focus({preventScroll:true}));
 function inspectStamp(index,c,button){stampOrigin=button;stampZoom.replaceChildren(make('h3',null,c.title),image('stamp'+index,'stampLarge'),make('p',null,'Verdiend door deze halte af te ronden.'),action('Sluit stempel',()=>stampZoom.close()));stampZoom.append(image('chapter'+index,'stampChapter'));stampZoom.showModal();}
 const shell=make('div','bookShell'),body=make('div','bookSpread'),foot=make('div','bookFooter');shell.append(body);let leaf=0,origin=null,scroll=null;const isNarrow=()=>innerWidth<900||(innerWidth<1100&&innerHeight>innerWidth);
 const pageLabel=make('span','micro');pageLabel.setAttribute('aria-live','polite');
 const previous=action('Vorige',()=>{leaf=Math.max(0,leaf-(isNarrow()?1:2));renderBook();}),next=action('Volgende',()=>{leaf+=isNarrow()?1:2;renderBook();});foot.append(previous,pageLabel,next);dialog.append(head,shell,foot);document.body.append(dialog);
 function record(c){return state.route.chapters[c.id]||{stage:0,goldAt:0};}
 function profile(){return window.TopoProfile?.current();}
 const tilt=[-3,2,-1.5,2.5,-2,1.5,-2.5,3,-1,2,-3];
 function renderBook(target){
  const p=profile(),pages=[];
  const page=(heading,fill,keys=[])=>pages.push({heading,fill,keys});
  const fact=(icon,value,label)=>{const row=make('div','bookFact');if(icon)row.append(icon);const copy=make('p');copy.append(make('strong',null,value),' '+label);row.append(copy);return row;};
  page('Il mio viaggio in Italia',section=>{
   section.classList.add('coverFolio');section.append(make('h3','bookScript','Il mio viaggio in Italia'));
   const plate=make('div','bookPortrait');plate.append(image('cover','bookCover'),image('welcome','bookNino'));section.append(plate);
   section.append(make('p','coverTitle',p?.name?p.name+'’s reisboekje':'Mijn reisboekje'));
   if(p?.favoritePizza){const key=p.favoritePizza==='quattro_formaggi'?'quattro-formaggi':p.favoritePizza,sticker=make('p','favoriteLabel');sticker.append(image('favorite'+PIZZA_KEYS.indexOf(key),'favoriteSticker'),'Mijn favoriete pizza: '+TopoPizza.name(key));section.append(sticker);}
   section.append(action('Pas mijn boekje aan',()=>TopoProfile.open({onDone:()=>renderBook()}),'bookLink'));
  });
  page(p?.name?'Ciao, '+p.name+'!':'Dit is jouw reis',section=>{
   const completed=ROUTE_CHAPTERS.filter(c=>record(c).stage===3).length,gold=ROUTE_CHAPTERS.filter(c=>record(c).goldAt>0).length;
   section.append(make('h3','bookScript',p?.name?'Ciao, '+p.name+'!':'Dit is jouw reis'));
   section.append(fact(image('chapterGold','factIcon'),completed+' van 11',completed===1?'halte afgerond':'haltes afgerond'),fact(null,String(gold),gold===1?'gouden halte':'gouden haltes'),fact(null,String(state.trips),state.trips===1?'Vespa-rit gemaakt':'Vespa-ritten gemaakt'));
   const row=make('div');TopoPizza.saved(row,state.pizzas);section.append(row,make('p','bookNote',state.slices+' van 8 punten voor '+TopoPizza.name(TopoPizza.flavor(state.pizzas))+'. '+(3-state.pizzas%3)+(3-state.pizzas%3===1?' pizza':' pizza’s')+' tot je volgende rit.'));
   section.append(action('Verder leren',()=>dialog.close(),'bookLink'));
  });
  for(let start=0;start<11;start+=3){const group=ROUTE_CHAPTERS.slice(start,start+3);page('Lesstempels '+(start+1)+' tot '+Math.min(11,start+3),section=>{
   section.classList.add('stampFolio');section.append(make('h3','bookScript','Mijn stempels'));
   group.forEach((c,n)=>{
    const index=start+n,r=record(c),earned=r.stage===3,unlocked=TopoRoute.unlocked(state.route,ROUTE_CHAPTERS,c.id),row=make('article','bookStamp'+(earned?' earned':''));row.dataset.chapter=c.id;row.style.setProperty('--tilt',tilt[index]+'deg');
    if(earned){const inspect=action('',()=>inspectStamp(index,c,inspect),'stampInspect');inspect.setAttribute('aria-label','Bekijk stempel: '+c.title);inspect.append(image('stamp'+index,'stampArt'));row.append(inspect);if(r.goldAt>0)row.append(image('chapterGold','chapterSeal'));}
    else row.append(make('span','stampSlot'));
    const copy=make('div');copy.append(make('h4',null,c.title),make('p','micro',earned?(r.goldAt>0?'Afgerond en goud verdiend':'Afgerond'):unlocked?'Hier kun je verder leren':'Nog te ontdekken'));row.append(copy);section.append(row);
   });
  },group.flatMap(c=>['stamp:'+c.id,'gold:'+c.id]));}
  page('Met de Vespa door Italië',section=>{
   section.append(make('h3','bookScript','Met de Vespa'));
   if(!state.trips)section.append(make('p','bookNote','Je eerste rit gaat van Rome naar Florence. Drie verdiende pizza’s brengen je daar.'));
   else{section.append(image('arrival','arrivalStamp'));const list=make('ol','destinationList');TopoLearning.STOPS.forEach((_,i)=>{const first=i+1;if(state.trips<first)return;const visits=Math.floor((state.trips-first)/TopoLearning.STOPS.length)+1,j=TopoLearning.journey(first);list.append(make('li',null,j.to+(visits>1?', '+visits+' keer bereikt':'')));});section.append(list);}
   section.append(make('p','micro','Leshaltes en Vespa-bestemmingen zijn twee verschillende reizen.'));
  },['trips']);
  const cards=[];if(record(ROUTE_CHAPTERS.find(c=>c.id==='islands')).stage===3)cards.push(['sicilia','Sicilia, souvenir van je eilandenles'],['sardegna','Sardegna, souvenir van je eilandenles']);if(state.trips>=3)cards.push(['venezia','Venetië, je derde Vespa-rit']);if(state.trips>=6)cards.push(['napoli','Napels, je zesde Vespa-rit']);
  if(!cards.length)page('Post uit Italië',section=>section.append(make('h3','bookScript','Post uit Italië'),make('p','bookNote','Je postkaarten verschijnen na je eilandenles of een bijbehorende Vespa-rit.')));
  for(const [key,label]of cards)page(label,section=>{section.append(make('h3','bookScript','Post uit Italië'));const card=make('figure','earnedPostcard');let picture=image(key,'postcardArt');const flip=action('Bekijk achterkant',()=>{const reverse=flip.dataset.reverse!=='true';picture.replaceWith(picture=image(reverse?'reverse':key,'postcardArt'));flip.dataset.reverse=String(reverse);flip.textContent=reverse?'Bekijk voorkant':'Bekijk achterkant';},'bookLink');card.append(picture,make('figcaption',null,label),flip);section.append(card);});
  if(ROUTE_CHAPTERS.every(c=>record(c).goldAt>0))page('Esploratore d’oro',section=>section.append(make('h3','bookScript','Esploratore d’oro'),image('finalGold','bookFinalGold'),make('p',null,'Alle elf haltes goud. Benissimo!')),['final']);
  if(pages.length%2)page('Jouw volgende herinnering',section=>section.append(make('h3','bookScript','Wordt vervolgd'),make('p','bookNote','Nieuwe herinneringen verschijnen hier als je ze verdient.')));
  if(typeof target==='string'){const found=pages.findIndex(info=>info.keys.includes(target));if(found>=0)leaf=found;}
  leaf=Math.min(Math.max(0,leaf),pages.length-1);if(!isNarrow())leaf-=leaf%2;
  dialog.classList.toggle('bookSingle',isNarrow());body.replaceChildren();
  const visible=isNarrow()?[leaf]:[leaf,leaf+1];
  for(const index of visible){const info=pages[index],side=index%2?'right':'left',section=make('section','bookPage illustratedFolio folio-'+side),content=make('div','folioWriting');section.setAttribute('aria-label',info.heading);info.fill(content);
   // Stamp rows need clear paper down to the page foot; the right folio's painted village sits there.
   const quiet=side==='right'&&content.classList.contains('stampFolio');section.append(image(quiet?'folioleft':'folio'+side,'folioPaper'+(quiet?' folioMirrored':'')),content);body.append(section);}
  previous.disabled=leaf===0;next.disabled=leaf+(isNarrow()?1:2)>=pages.length;pageLabel.textContent=(leaf+1)+(isNarrow()?'':'–'+(leaf+2))+' / '+pages.length;
 }
 function openBook(button,target){if(dialog.open)return;origin=button;scroll=[window.scrollX,window.scrollY];renderBook(target);dialog.showModal();const stamp=typeof target==='string'&&target.includes(':')?body.querySelector('[data-chapter="'+target.split(':')[1]+'"] .stampInspect'):null;(stamp||close).focus();}
 window.TopoBook={open:openBook,element:dialog};
 dialog.addEventListener('close',()=>{origin?.focus({preventScroll:true});if(scroll)window.scrollTo(...scroll);});
 dialog.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;if(e.key==='ArrowRight'&&!next.disabled){e.preventDefault();next.click();}if(e.key==='ArrowLeft'&&!previous.disabled){e.preventDefault();previous.click();}});
 window.addEventListener('resize',()=>{if(dialog.open)renderBook();});
 function update(){
  const home=document.querySelector('.layout').classList.contains('routeHomeLayout');reis.setAttribute('aria-current',home?'page':'false');practice.setAttribute('aria-current',home?'false':'page');
  document.body.dataset.ninoHome=String(home);legacy.hidden=home;
  const cards=document.querySelector('#routeCards');
  for(const group of cards.querySelectorAll('.routeCollection')){group.before(...group.querySelectorAll('.routeCard'));group.remove();}
  const ordered=ROUTE_CHAPTERS.map(c=>cards.querySelector('.routeCard[data-chapter="'+c.id+'"]')).filter(Boolean);
  const actual=[...cards.querySelectorAll('.routeCard')];if(ordered.some((card,i)=>card!==actual[i]))for(const card of ordered)cards.append(card);
  ROUTE_CHAPTERS.forEach((c,i)=>{const card=ordered[i];if(!card||card.querySelector('.chapterPicture'))return;card.prepend(image('chapter'+i,'chapterPicture'));});
 }
 new MutationObserver(update).observe(document.querySelector('.layout'),{attributes:true,attributeFilter:['class']});
 new MutationObserver(update).observe(document.querySelector('#routeCards'),{childList:true});update();
 TopoProfile.setup({art:{welcome:art.welcome.src,scene:document.querySelector('.routeScene>img')?.src,pizzas:{margherita:art.favorite0.src,salami:art.favorite1.src,quattro_formaggi:art.favorite2.src}}});
 // Existing learners keep their lesson/session. Personalization is always available in the book.
 const progressed=state.good>0||state.pizzas>0||state.trips>0||state.route.active||state.slices>0||state.mistakes.length>0||Object.keys(state.route.items).length>0||Object.values(state.route.chapters).some(r=>r.stage>0||r.goldAt>0);
 if(!progressed&&!TopoProfile.current())setTimeout(()=>TopoProfile.open({firstRun:true}),0);
})();
