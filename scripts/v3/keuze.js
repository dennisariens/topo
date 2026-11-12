/* TOPO V3 — Ronde 4 punt 3: the V2 place picker ("Welke plek bedoel je?", scripts/map-hit.js) in V3 form. Presentation
   only: candidates, numbering, aria labels, focus, keyboard and Escape stay V2's. The class is set before the first open,
   so V2's own fit measures the V3 title and the hidden help line; after each open the legend is shortened to its symbols
   and the picker refits once through V2's own resize handler. */
(function setupV3Keuze(){
 'use strict';
 const pick=document.getElementById('mapPicker');if(!pick)return;
 pick.classList.add('v3','v3Keuze');
 const LONG=/\.\s*Symbolen, geen grenzen; vergrotingen zijn schematisch\.(\s*)/;
 new MutationObserver(()=>{
  const note=pick.querySelector(':scope>.pickerNote');if(!note||note.dataset.v3)return;note.dataset.v3='kort';
  for(const p of pick.querySelectorAll(':scope>p:not(.pickerNote)'))p.hidden=true;
  if(LONG.test(note.textContent)){note.textContent=note.textContent.replace(LONG,(_,rest)=>rest?'. ':'');if(pick.open)requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));}
 }).observe(pick,{childList:true});
})();
