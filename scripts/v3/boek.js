/* Presentation and navigation around the existing earned-only V2 book. */
(function(){
 'use strict';
 const V=window.TOPO_V3,book=window.TopoBook;if(!V||!book)return;
 const d=book.element,spread=d.querySelector('.bookSpread'),buttons=d.querySelectorAll('.bookFooter button'),[previous,next]=buttons;
 d.querySelector('.ninoBookSettings')?.remove();
 V.book={open(opener,kind){
  const chapters=V.model().chapters;
  if(kind==='Stempels'||kind==='Goud'){
   const c=chapters.find(c=>kind==='Goud'?c.gold:c.done)||chapters[0];
   return book.open(opener,(kind==='Goud'?'gold:':'stamp:')+c.id);
  }
  book.open(opener);
  if(kind==='Postkaarten'){
   while(!previous.disabled)previous.click();
   for(let i=0;i<12&&!d.querySelector('.earnedPostcard')&&![...d.querySelectorAll('h3')].some(n=>n.textContent==='Post uit Italië')&&!next.disabled;i++)next.click();
  }
 },
 // Ronde 5 punt 9: open the book on one page, by the label V2 gives it (section aria-label), e.g. a new postcard.
 openPage(opener,label){
  book.open(opener);if(!d.open)return;
  while(!previous.disabled)previous.click();
  const has=()=>[...d.querySelectorAll('section.bookPage[aria-label]')].some(s=>s.getAttribute('aria-label')===label);
  for(let i=0;i<24&&!has()&&!next.disabled;i++)next.click();
 }};
 const ride=document.querySelector('.vespaRide'),rider=ride?.querySelector('.rideNino');
 ride?.querySelector('.rideActions button')?.classList.add('v3RideSkip');
 // Ronde 5 punt 7: the Fiat 500 drives past in the background (behind Nino); with reduced motion it stands still.
 const fiat=V.art.lifestyle?.items.find(i=>i.id==='TOPO_16');
 if(rider&&fiat&&!ride.querySelector('.v3RideFiat')){const f=document.createElement('img');f.className='v3RideFiat';f.src=fiat.exports[devicePixelRatio>1?256:128].src;f.alt='';f.setAttribute('aria-hidden','true');f.dataset.lifestyle='TOPO_16';rider.before(f);}
 // Ronde 5 punt 6: Nino rides along (VESPA-RIJDEND), not the empty Vespa; shake, start and ride-out stay as they were.
 if(rider){rider.src=V.art.poses?.['VESPA-RIJDEND']?.src||V.art.vespa;rider.dataset.v3Master=V.art.poses?.['VESPA-RIJDEND']?'VESPA-RIJDEND':'VESPA-ZIJ';rider.addEventListener('animationend',e=>{if(e.animationName==='v3RideOut'&&ride.dataset.phase==='ride')ride.querySelector('.rideActions button')?.click();});}
 let start=null;
 spread.style.touchAction='pan-y';
 spread.addEventListener('pointerdown',e=>{if(e.isPrimary!==false)start={x:e.clientX,y:e.clientY,t:e.timeStamp,id:e.pointerId};});
 spread.addEventListener('pointercancel',()=>{start=null;});
 spread.addEventListener('pointerup',e=>{
  const s=start;start=null;if(!s||s.id!==e.pointerId||e.timeStamp-s.t>900)return;
  const dx=e.clientX-s.x,dy=e.clientY-s.y;if(Math.abs(dx)<60||Math.abs(dy)>40||Math.abs(dx)<Math.abs(dy)*1.5)return;
  const b=dx<0?next:previous;if(!b.disabled)b.click();
 });
})();
