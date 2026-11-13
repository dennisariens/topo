/* TOPO V3 ronde 5 punt 9 — melding bij nieuwe post.
   V2 has a moment for a new stamp and gold (nino-moments.js, earnedMoment), not for a new postcard. This adds one in V3
   with V2's own rule, unchanged (nino-v2.js renderBook): Sicilia and Sardegna when the islands chapter is done
   (stage 3), Venetië at the 3rd Vespa-ride, Napels at the 6th. No new reward rule; it only reads state.
   - Glass card "Post voor jou!" with the postcard as illustration; it slides into the Reisboekje (the Beloningen tab)
     after 4 s; a tap opens the book on that postcard page. Reduced motion: no animation. Announced via aria-live=polite.
   - A small violet dot on the Beloningen tab until the new postcard has been seen in the book.
   - Never during a question, the toets or the Gouden proef (or over the ride, the book or another dialog): it waits.
   - Like V2's stamps: old, imported or reset progress is rebased quietly, never celebrated. */
(function(){
 'use strict';
 const V=window.TOPO_V3,ART=typeof NINO_V2_ART!=='undefined'?NINO_V2_ART:null;if(!V||!V.book||!ART)return;
 const body=document.body,book=window.TopoBook?.element,ride=document.querySelector('.vespaRide');
 // Labels exactly as the V2 book names the postcard pages (section aria-label), in V2's order.
 const CARDS=[['sicilia','Sicilia, souvenir van je eilandenles'],['sardegna','Sardegna, souvenir van je eilandenles'],['venezia','Venetië, je derde Vespa-rit'],['napoli','Napels, je zesde Vespa-rit']];
 const LABEL=Object.fromEntries(CARDS);
 const earned=()=>{const isl=state.route?.chapters?.islands?.stage===3,t=state.trips|0;return CARDS.map(c=>c[0]).filter(k=>k==='sicilia'||k==='sardegna'?isl:k==='venezia'?t>=3:t>=6);};
 const KEY='topoV3PostSeen',still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const load=()=>{try{const v=JSON.parse(localStorage.getItem(KEY));return Array.isArray(v)?new Set(v):null;}catch{return null;}};
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify([...seen]));}catch{}};
 // First run: what is already earned counts as seen (no dot for earlier progress).
 let seen=load()||new Set(earned());save();
 let known=new Set(earned()),pending=[],card=null,timer=0,poll=0;

 // The live region exists before any message, so VoiceOver announces the card when it is filled.
 const live=document.createElement('div');live.className='v3Post';live.setAttribute('aria-live','polite');body.append(live);

 function navs(){return [...document.querySelectorAll('[data-nav=rewards]')];}
 function dot(){
  const unseen=earned().some(k=>!seen.has(k));
  for(const n of navs()){
   let d=n.querySelector('.v3PostDot');
   if(unseen&&!d){d=document.createElement('i');d.className='v3PostDot';d.append(Object.assign(document.createElement('em'),{className:'v3SrOnly',textContent:', nieuwe post'}));n.append(d);}
   else if(!unseen&&d)d.remove();
  }
  body.dataset.v3Post=unseen?'unseen':'';
 }
 // Busy: a question in a lesson, free practice, the toets or the Gouden proef; the toets also while paused on another tab;
 // the ride, the book or any other open dialog; V2's stamp/gold card; a pizza celebration.
 function busy(){
  if(body.classList.contains('v3Les')&&body.dataset.v3Q!=='result')return true;
  if(state.mode==='exam'&&!state.examEnded)return true;
  if(state.route?.active?.kind==='gold'&&!state.route.active.done&&body.classList.contains('v3Les'))return true;
  if(document.querySelector('dialog[open]')||ride?.open)return true;
  if([...document.querySelectorAll('.earnedMoment')].some(n=>n.checkVisibility?.()??n.offsetParent))return true;
  return typeof pizzaCelebrations!=='undefined'&&!!pizzaCelebrations.busy;
 }
 function show(){
  if(card||!pending.length)return;
  if(busy()){if(!poll)poll=setTimeout(()=>{poll=0;show();},600);return;}
  const keys=pending.splice(0),first=keys[0];
  card=document.createElement('button');card.type='button';card.className='v3Btn v3PostCard';card.dataset.post=keys.join(' ');
  const art=ART[first],im=document.createElement('img');im.src=art.src;im.width=art.width;im.height=art.height;im.alt='';im.decoding='async';im.className='v3PostArt'+(first==='venezia'?' v3PostScallop':'');
  const copy=document.createElement('span');copy.className='v3PostCopy';
  const t=document.createElement('strong');t.textContent='Post voor jou!';
  const n=document.createElement('span');n.textContent=keys.length>1?keys.length+' nieuwe postkaarten in je Reisboekje.':'Een nieuwe postkaart in je Reisboekje.';
  copy.append(t,n);card.append(im,copy);
  card.addEventListener('click',()=>{const origin=navs().find(b=>b.checkVisibility?.())||null;leave(true);V.book.openPage(origin,LABEL[first]);});
  live.replaceChildren(card);
  if(!still())card.animate([{transform:'translateY(16px)',opacity:0},{transform:'none',opacity:1}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
  timer=setTimeout(()=>leave(false),4000);
 }
 // Leaving: slide into the Reisboekje (the Beloningen tab) and shrink; with reduced motion or after a tap, gone at once.
 function leave(now){
  clearTimeout(timer);timer=0;const c=card;card=null;if(!c)return;
  const to=navs().find(b=>b.checkVisibility?.());
  if(now||still()||!to||!c.isConnected){c.remove();show();return;}
  const a=c.getBoundingClientRect(),b=to.getBoundingClientRect();
  const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2);
  c.inert=true;c.dataset.leaving='1';
  c.animate([{transform:'none',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(.18)`,opacity:.2}],{duration:620,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'}).finished.then(()=>{c.remove();show();},()=>{c.remove();});
 }
 function watch(){
  const now=new Set(earned());
  for(const k of now)if(!known.has(k)&&!pending.includes(k))pending.push(k);
  // Progress that goes back (reset of a chapter or trips): forget it, so earning it again counts as new.
  for(const k of [...seen])if(!now.has(k))seen.delete(k);
  known=now;save();dot();if(pending.length)setTimeout(show,0);
 }
 // Seen: the postcard's page is shown in the book (spread or single page).
 if(book){
  const mark=()=>{if(!book.open)return;let changed=false;for(const s of book.querySelectorAll('section.bookPage[aria-label]')){const k=CARDS.find(c=>c[1]===s.getAttribute('aria-label'))?.[0];if(k&&!seen.has(k)&&known.has(k)){seen.add(k);changed=true;}}if(changed){save();dot();}};
  new MutationObserver(mark).observe(book,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
  book.addEventListener('close',()=>{if(pending.length)setTimeout(show,0);});
 }
 const savePersist=persist;persist=function(){savePersist();watch();};
 // Import and reset replace progress (V2 calls this first): rebase quietly after the state is replaced.
 const saveClear=clearRewardCelebrations;
 clearRewardCelebrations=function(){saveClear();pending.length=0;leave(true);setTimeout(()=>{known=new Set(earned());seen=new Set(known);save();dot();},0);};
 // The navigation is (re)built by the shell; keep the dot on every Beloningen tab.
 new MutationObserver(()=>{const want=body.dataset.v3Post==='unseen';if(navs().some(n=>!!n.querySelector('.v3PostDot')!==want))dot();}).observe(body,{childList:true,subtree:true});
 ride?.addEventListener('close',()=>{if(pending.length)setTimeout(show,0);});
 dot();
 V.post={earned,seen:()=>[...seen],pending:()=>[...pending],busy,watch,cards:CARDS};
})();
