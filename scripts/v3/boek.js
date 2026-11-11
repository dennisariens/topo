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
 }};
 const ride=document.querySelector('.vespaRide'),rider=ride?.querySelector('.rideNino');
 if(rider){rider.src=V.art.vespa;rider.addEventListener('animationend',e=>{if(e.animationName==='v3RideOut'&&ride.dataset.phase==='ride')ride.querySelector('.rideActions button')?.click();});}
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
