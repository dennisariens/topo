/* V3-only presentation adapter. Slots, visibility, events and rewards remain owned by V2. */
(function(){
 'use strict';
 const V=window.TOPO_V3,poses=V?.art?.poses;if(!V||!poses)return;
 V.pose=(id,role='guide',variant='character')=>{
  const slot=TopoArt.create(document,{role},variant),asset=poses[id];
  if(asset){const img=slot.querySelector('img');if(img){img.src=asset.src;img.width=asset.size[0];img.height=asset.size[1];slot.dataset.v3Master=id;}}
  return slot;
 };
 const roles={welcome:'NINO-WELKOM',guide:'NINO-WIJST',encourage:'NINO-AANMOEDIGING',success:'NINO-JUICHT',gold:'NINO-GOLD',arrival:'VESPA-BAGAGE'};
 function apply(slot){
  if(!document.body.classList.contains('v3On')||slot.closest('.v3ToetsSetupNino,.v3ToetsNino'))return;
  const id=roles[slot.dataset.artRole],asset=poses[id],img=slot.querySelector('img');
  if(!asset||!img||img.src===asset.src)return;
  img.src=asset.src;img.width=asset.size[0];img.height=asset.size[1];slot.dataset.v3Master=id;
 }
 const scan=n=>{if(!(n instanceof Element))return;if(n.matches('.ninoArtSlot'))apply(n);n.querySelectorAll('.ninoArtSlot').forEach(apply);};
 new MutationObserver(ms=>{for(const m of ms){if(m.target instanceof Element&&m.target.matches('.ninoArtSlot'))apply(m.target);for(const n of m.addedNodes)scan(n);}}).observe(document.body,{childList:true,subtree:true});
 scan(document.body);
})();
