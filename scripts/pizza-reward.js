/* Presentation only: no awards, storage or profile preference. */
(function(root){
 'use strict';
 const flavors=['margherita','salami','quattro-formaggi'];
 const names=['Margherita','Salami','Quattro Formaggi'];
 const count=n=>Number.isSafeInteger(n)&&n>=0?n:0;
 function flavor(pizzas,completed=false){return flavors[(Math.max(0,count(pizzas)-(completed?1:0)))%3]}
 function name(key){return names[flavors.indexOf(key)]||names[0]}
 function draw(target,slices,pizzas,completed=false){
  if(!target)return;
  const n=Math.max(0,Math.min(8,count(slices))),key=flavor(pizzas,completed);
  if(!target.classList.contains('pizzaWheel'))target=target.querySelector('.pizzaWheel');
  if(!target)return;
  if(!target.querySelector('.pizzaPixels')){
   target.replaceChildren();const pixels=target.ownerDocument.createElement('span');pixels.className='pizzaPixels';target.append(pixels);
   // Retained selector semantics; the pixels are precomposited from eight UNIQUE source sectors.
   for(let i=0;i<8;i++){const sector=target.ownerDocument.createElement('span');sector.className='wheelSlice';sector.hidden=true;target.append(sector)}
  }
  target.dataset.flavor=key;target.dataset.slices=n;
  const pixels=target.querySelector('.pizzaPixels');pixels.style.backgroundImage='url("'+root.TOPO_PIZZA_ART.assets[key]+'")';
  pixels.style.backgroundPosition=`${n%3*50}% ${Math.floor(n/3)*50}%`;
  target.querySelectorAll('.wheelSlice').forEach((s,i)=>s.classList.toggle('earned',i<n));
 }
 // Illustrated progress toward the next ride; the label carries the same facts for screen readers.
 function saved(target,pizzas,tripJustEarned=false){
  if(!target)return;
  const total=count(pizzas),n=tripJustEarned?3:total%3,doc=target.ownerDocument;
  if(target.dataset.pizzas===total+':'+n&&target.childElementCount)return;
  target.dataset.pizzas=total+':'+n;target.classList.add('pizzaSaved');target.setAttribute('role','img');
  target.replaceChildren();
  for(let i=0;i<3;i++){const slot=doc.createElement('span');slot.className='pizzaSlot';if(i<n){const wheel=doc.createElement('span');wheel.className='pizzaWheel';slot.append(wheel);target.append(slot);draw(wheel,8,i)}else target.append(slot)}
  const held=names.slice(0,n).join(', ');
  target.setAttribute('aria-label',total+(total===1?' pizza':' pizza’s')+' gespaard. '+n+' van 3 voor de volgende Vespa-rit'+(n?': '+held:'')+'.');
 }
 function createCelebrations({document,onTrip,reducedMotion=()=>false,schedule=setTimeout,cancel=clearTimeout}){
  const panel=document.createElement('dialog');panel.id='pizzaCelebration';panel.hidden=true;panel.className='pizzaCelebration';panel.setAttribute('aria-labelledby','pizzaCelebrationTitle');
  const picture=document.createElement('div');picture.className='pizzaCelebrationPicture';picture.setAttribute('aria-hidden','true');
  const wheel=document.createElement('div');wheel.className='pizzaWheel';const box=document.createElement('img');box.alt='';box.className='pizzaOpenBox';picture.append(wheel,box);
  const title=document.createElement('h2');title.id='pizzaCelebrationTitle';const label=document.createElement('p');label.className='pizzaCelebrationLabel';
  const row=document.createElement('div');const more=document.createElement('button');more.type='button';more.className='button primary';more.textContent='Verder';
  panel.append(picture,title,label,row,more);document.body.append(panel);
  let timer=null,current=null;const queue=[];
  function showBox(){if(timer!==null)cancel(timer);timer=null;panel.dataset.phase='open-box';wheel.hidden=true;box.hidden=false}
  function hide(){if(panel.open&&typeof panel.close==='function')panel.close();panel.hidden=true}
  function finish(){const event=current;hide();current=null;if(event?.trip){panel.dataset.phase='journey';onTrip(event)}next()}
  function next(){
   if(current||!queue.length)return;
   current=queue.shift();const event=current,key=flavor(event.pizzas,true),left=3-event.pizzas%3;
   panel.dataset.flavor=key;panel.dataset.phase='full-pizza';panel.hidden=false;wheel.hidden=false;box.hidden=true;
   draw(wheel,8,event.pizzas,true);box.src=root.TOPO_PIZZA_ART.assets['box-'+key];
   title.textContent=name(key)+' verdiend!';
   label.textContent=event.trip?'Drie pizza’s! Nino start de Vespa.':'Nog '+left+(left===1?' pizza':' pizza’s')+' tot je volgende Vespa-rit.';
   saved(row,event.pizzas,!!event.trip);
   if(typeof panel.showModal==='function'&&!panel.open)panel.showModal();else panel.setAttribute('open','');
   more.focus?.();
   // Supplied boxes are complete, mismatched-perspective renders. Static open art is
   // deliberate until a registered lid/base/inside set exists; no simulated hinge/crossfade.
   if(reducedMotion())showBox();else timer=schedule(showBox,700);
  }
  // The learner decides: the first press skips to the box, the box waits for Verder.
  more.onclick=()=>{if(panel.dataset.phase==='full-pizza')showBox();else if(current)finish()};
  panel.addEventListener('cancel',e=>{e.preventDefault();more.click()});
  return {
   enqueue(event){if(!event?.pizza||!count(event.pizzas))return;queue.push({...event});next()},
   clear(){if(timer!==null)cancel(timer);timer=null;current=null;queue.length=0;hide();delete panel.dataset.phase},
   get busy(){return current!==null}
  };
 }
 root.TopoPizza={flavor,name,draw,saved,createCelebrations};
})(typeof window==='undefined'?globalThis:window);
