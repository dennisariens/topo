/* Presentation only: no storage, grading, rewards or unlock mutations. */
(function(root){
 'use strict';
 const data=()=>root.TOPO_NINO_ART_DATA||{assets:{},chapters:{},postcards:{}};
 function roleFor(context={}){
  const {phase,event,kind,answered,ok,index=0,pause,passed,goldEarned,newlyCompleted,known,right,wrong,total,reward,mode}=context;
  if(phase==='arrival')return reward?.trip===true?'arrival':null;
  if(mode==='exam')return null;
  if(phase==='entry')return event==='ENTRY.FIRST'?'welcome':null;
  if(phase==='task')return answered?(ok===false?'encourage':null):kind==='discover'||index===0?'guide':null;
  if(phase==='answer')return ok===false?'encourage':null;
  if(phase==='summary'){
   if(pause||kind==='discover')return 'guide';
   if(kind==='gold')return passed?(goldEarned?'gold':'success'):'encourage';
   if(newlyCompleted)return 'success';
   if(known&&total>0&&right===total&&wrong===0)return 'success';
   return wrong>0?'encourage':'guide';
  }
  return null;
 }
 function resolve(request={}){
  const manifest=data();let role=request.role;
  if(request.kind==='chapter'){
   if(!request.unlocked)return null;
   role=manifest.chapters?.[request.chapter]||request.fallbackRole;
  }
  if(request.kind==='postcard'){
   // A slot never grants a postcard. A future caller must supply a real unlock.
   if(!request.unlocked)return null;
   role=manifest.postcards?.[request.postcard];
  }
  const asset=manifest.assets?.[manifest.states?.[role]||role];
  return asset&&typeof asset.src==='string'&&asset.src.startsWith('data:image/webp;base64,')?{role,...asset}:null;
 }
 function update(slot,request={}){
  const asset=resolve(request);slot.replaceChildren();slot.hidden=!asset;slot.classList.remove('artFallback');delete slot.dataset.artRole;delete slot.dataset.fallback;
  if(!asset)return slot;
  slot.dataset.artRole=asset.role;
  const img=slot.ownerDocument.createElement('img');
  img.alt='';img.setAttribute('aria-hidden','true');img.width=asset.width;img.height=asset.height;img.decoding='async';
  img.addEventListener('error',()=>{
   // Local failure must not leave a broken-image glyph or retry loop.
   if(img.parentNode!==slot)return;
   slot.replaceChildren();slot.classList.add('artFallback');slot.dataset.fallback='original-nino';
   const fallback=slot.ownerDocument.createElement('span');fallback.className='ninoPortrait';fallback.setAttribute('aria-hidden','true');slot.append(fallback);
  },{once:true});
  img.src=asset.src;slot.append(img);return slot;
 }
 function create(document,request={},variant='character'){
  const slot=document.createElement('figure');slot.className='ninoArtSlot ninoArtSlot--'+variant;slot.setAttribute('aria-hidden','true');return update(slot,request);
 }
 root.TopoArt={roleFor,resolve,create,update};
})(typeof window==='undefined'?globalThis:window);
