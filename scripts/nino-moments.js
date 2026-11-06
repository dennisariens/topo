/* Earned moments: shows events the engine already recorded. No awards, no storage, no replay. */
(function setupNinoMoments(){
 const art=NINO_V2_ART,make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const picture=(key,cls)=>{const a=art[key],i=make('img',cls);i.src=a.src;i.alt='';i.setAttribute('aria-hidden','true');return i;};
 const button=(text,fn,cls='button')=>{const b=make('button',cls,text);b.type='button';b.onclick=fn;return b;};
 const still=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
 const resume=()=>{const n=[...document.querySelectorAll('#finishScreen button.primary,#next,#routeDockNext')].find(b=>b.offsetParent&&!b.disabled);n?.focus({preventScroll:true});};
 document.querySelector('#pizzaCelebration').addEventListener('close',()=>setTimeout(()=>{if(!ride.open&&!pizzaCelebrations.busy){resume();flush();}},0));

 // Vespa ride: departure, the road, arrival. The left of the coast scene has no baked-in Nino.
 const ride=make('dialog','vespaRide');ride.setAttribute('aria-labelledby','vespaRideTitle');
 const stage=make('div','rideStage'),road=document.createElementNS('http://www.w3.org/2000/svg','svg');road.setAttribute('viewBox','0 0 100 56');road.setAttribute('preserveAspectRatio','none');road.setAttribute('aria-hidden','true');road.classList.add('rideRoad');
 road.innerHTML='<path class="rideLine" pathLength="1" d="M4 51C22 48 34 53 50 51S80 48 96 50"/><path class="rideTrail" pathLength="1" d="M4 51C22 48 34 53 50 51S80 48 96 50"/>';
 const scene=document.querySelector('.routeScene>img');if(scene)stage.style.setProperty('--ride-scene','url("'+scene.src+'")');
 const startSign=make('span','rideSign rideFrom'),endSign=make('span','rideSign rideTo'),rider=picture('travel','rideNino'),arrived=picture('arrivalScene','rideArrival');
 stage.append(road,startSign,endSign,rider,arrived);
 const title=make('h2',null);title.id='vespaRideTitle';const note=make('p','rideNote'),seal=picture('arrival','rideSeal');
 const caption=make('div','rideCaption');caption.append(seal,title,note);
 const actions=make('div','rideActions'),skip=button('Overslaan',()=>arrive()),book=button('Bekijk in Reisboekje',()=>TopoBook.open(book,'trips')),more=button('Verder',()=>endRide(),'button primary');
 actions.append(skip,book,more);ride.append(stage,caption,actions);document.body.append(ride);
 ride.addEventListener('cancel',e=>{e.preventDefault();ride.dataset.phase==='arrived'?endRide():arrive();});
 let timers=[],current=null;
 function later(fn,ms){timers.push(setTimeout(fn,ms));}
 function arrive(){
  timers.forEach(clearTimeout);timers=[];ride.dataset.phase='arrived';skip.hidden=true;book.hidden=false;more.hidden=false;seal.hidden=false;arrived.hidden=false;
  title.textContent='Aangekomen in '+current.to+'!';note.textContent='Je pizza’s brachten Nino van '+current.from+' naar '+current.to+'.';more.focus({preventScroll:true});
 }
 function startRide(from,to){
  current={from,to};startSign.textContent=from;endSign.textContent=to;seal.hidden=true;arrived.hidden=true;book.hidden=true;more.hidden=true;skip.hidden=false;
  title.textContent='Nino vertrekt uit '+from;note.textContent='Op weg naar '+to+'.';ride.dataset.phase='depart';
  if(!ride.open)ride.showModal();
  if(still())return arrive();
  skip.focus({preventScroll:true});
  later(()=>{ride.dataset.phase='ride';title.textContent='Op weg naar '+to;note.textContent='Nino rijdt over de kust.';},900);later(arrive,6400);
 }
 function endRide(){timers.forEach(clearTimeout);timers=[];if(ride.open)ride.close();current=null;delete ride.dataset.phase;resume();flush();}
 celebrateTrip=(from,to)=>startRide(from,to);

 // Stamps and Gold: a brief, non-blocking invitation that never appears for old or imported progress.
 const earnedKeys=()=>new Set(ROUTE_CHAPTERS.flatMap(c=>{const r=state.route.chapters[c.id]||{};return [...(r.stage===3?['stamp:'+c.id]:[]),...(r.goldAt>0?['gold:'+c.id]:[])];}));
 let known=earnedKeys();const pending=[];let card=null;
 function flush(){
  if(card||!pending.length||ride.open||pizzaCelebrations.busy)return;
  const key=pending.shift(),[kind,id]=key.split(':'),index=ROUTE_CHAPTERS.findIndex(c=>c.id===id),gold=kind==='gold',all=gold&&ROUTE_CHAPTERS.every(c=>state.route.chapters[c.id]?.goldAt>0);
  card=make('aside','earnedMoment'+(gold?' earnedGold':''));card.setAttribute('role','status');card.dataset.moment=key;
  const copy=make('div');copy.append(make('strong',null,(gold?'Goud verdiend: ':'Nieuw stempel: ')+ROUTE_CHAPTERS[index].title),make('p',null,'Bewaard in je Reisboekje.'));
  const row=make('div','earnedActions'),close=()=>{const shown=card;card=null;shown?.remove();resume();flush();},open=button('Bekijk in Reisboekje',()=>{TopoBook.element.addEventListener('close',close,{once:true});TopoBook.open(open,all?'final':key);},'button primary');
  row.append(open,button('Later',close));copy.append(row);card.append(picture(gold?'chapterGold':'stamp'+index,'earnedArt'),copy);
  const anchor=document.querySelector('.layout.finishLayout #finishScreen h2')||document.querySelector('#message');
  if(anchor?.offsetParent)anchor.after(card);else{card.classList.add('earnedFloating');document.body.append(card);}
 }
 function watch(){
  const now=earnedKeys();
  if(known===null){known=now;return;}
  for(const key of now)if(!known.has(key))pending.push(key);
  known=now;if(pending.length)setTimeout(flush,0);
 }
 const savePersist=persist,saveSync=sync,saveClear=clearRewardCelebrations;
 persist=function(){savePersist();watch();};
 function savedRows(){const count=document.querySelector('#journeyPizzaCount');if(count?.nextSibling)count.nextSibling.textContent=state.pizzas===1?' pizza':' pizza’s';for(const host of document.querySelectorAll('.journeyReward,#lessonReward')){let row=host.querySelector(':scope>.pizzaSavedRow');if(!row){row=make('div','pizzaSavedRow');host.append(row);}TopoPizza.saved(row,state.pizzas);}}
 sync=function(){saveSync();savedRows();};
 // Import and reset replace progress: rebase quietly instead of celebrating restored stamps.
 clearRewardCelebrations=function(){saveClear();timers.forEach(clearTimeout);timers=[];if(ride.open)ride.close();current=null;pending.length=0;card?.remove();card=null;known=null;};
 savedRows();
})();
