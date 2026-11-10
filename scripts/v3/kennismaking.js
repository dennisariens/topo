/* TOPO V3.0 — Kennismaking (docs/v3/V3_0_REST.md § 4). The V2 first-run profile dialog (TopoProfile.open, schema 1,
   unchanged) as one V3 scene: Nino's welcome pose, name (optional) and favourite pizza, with Andiamo! and always
   Start meteen (the V2 skip). V2's own rules stay: when it opens (first visit, Begin helemaal opnieuw), what it stores,
   and the one-time renewed offer before the first lesson (its help line is hidden). Afterwards Reis shows chapter 1. */
(function setupV3Kennismaking(){
 'use strict';
 const V=window.TOPO_V3;if(!V)return;
 const body=document.body;
 function decorate(d){
  if(d.dataset.v3)return;d.dataset.v3='welkom';d.classList.add('v3','v3Welkom');
  const skip=d.querySelector('[data-profile-cancel]');if(skip){skip.textContent='Start meteen';skip.classList.add('v3Btn');}
  d.querySelector('[type=submit]')?.classList.add('v3Btn','primary');
  // Help lines of the V2 form (V3 principle: no help texts).
  for(const n of d.querySelectorAll('.profileName>span,#profileNameHelp'))n.hidden=true;
  const input=d.querySelector('[name=name]');input?.removeAttribute('aria-describedby');
  // The label "Jouw naam" is not shown (Nino's question carries it) but stays the field's accessible name.
  const label=d.querySelector('label.profileName');
  if(label)for(const n of [...label.childNodes])if(n.nodeType===3&&n.textContent.trim()){const sr=document.createElement('span');sr.className='v3SrOnly';sr.textContent=n.textContent.trim();n.replaceWith(sr);}
 }
 function offer(d){if(d.dataset.v3)return;d.dataset.v3='aanbod';d.classList.add('v3','v3Aanbod');for(const p of d.querySelectorAll(':scope>p'))p.hidden=true;d.querySelectorAll('.introActions .button').forEach(b=>b.classList.add('v3Btn'));d.querySelector('.introActions .primary')?.classList.add('primary');}
 // After the kennismaking, on Reis: chapter 1 is the selected chapter (a lesson that the offer started stays).
 function after(){requestAnimationFrame(()=>{const home=V.shell?.atHome?.();if(home===false)return;V.ui.view='reis';V.ui.selected='city1';V.render();});}
 const scan=n=>{if(!(n instanceof Element))return;if(n.matches('dialog.ninoProfile.ninoFirstRun'))decorate(n);if(n.matches('dialog.ninoIntroOffer'))offer(n);};
 new MutationObserver(list=>{for(const m of list){m.addedNodes.forEach(scan);m.removedNodes.forEach(n=>{if(n instanceof Element&&n.matches('dialog.ninoProfile.ninoFirstRun'))after();});}}).observe(body,{childList:true});
 body.querySelectorAll(':scope>dialog').forEach(scan);
})();
