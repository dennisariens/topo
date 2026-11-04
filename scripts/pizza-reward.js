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
 function createCelebrations({document,onTrip,reducedMotion=()=>false,schedule=setTimeout,cancel=clearTimeout}){
  const panel=document.createElement('div');panel.id='pizzaCelebration';panel.hidden=true;panel.className='pizzaCelebration';panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');panel.setAttribute('aria-atomic','true');
  const picture=document.createElement('div');picture.className='pizzaCelebrationPicture';picture.setAttribute('aria-hidden','true');
  const wheel=document.createElement('div');wheel.className='pizzaWheel';const box=document.createElement('img');box.alt='';box.className='pizzaOpenBox';picture.append(wheel,box);
  const label=document.createElement('strong');panel.append(picture,label);document.body.append(panel);
  let timer=null,current=null;const queue=[];
  function finish(){panel.hidden=true;current=null;timer=null;next()}
  function showBox(){panel.dataset.phase='open-box';wheel.hidden=true;box.hidden=false}
  function next(){
   if(current||!queue.length)return;
   current=queue.shift();const event=current,key=flavor(event.pizzas,true);
   panel.dataset.flavor=key;panel.dataset.phase='full-pizza';panel.hidden=false;wheel.hidden=false;box.hidden=true;
   draw(wheel,8,event.pizzas,true);box.src=root.TOPO_PIZZA_ART.assets['box-'+key];
   label.textContent=name(key)+' compleet! 8 / 8 · '+event.pizzas+' pizza’s verdiend.';
   // Supplied boxes are complete, mismatched-perspective renders. Static open art is
   // deliberate until a registered lid/base/inside set exists; no simulated hinge/crossfade.
   if(reducedMotion())showBox();
   timer=schedule(()=>{showBox();timer=schedule(()=>{
    panel.hidden=true;
    if(event.trip){panel.dataset.phase='journey';onTrip(event);timer=schedule(finish,1500)}else finish();
   },900)},320);
  }
  return {
   enqueue(event){if(!event?.pizza||!count(event.pizzas))return;queue.push({...event});next()},
   clear(){if(timer!==null)cancel(timer);timer=null;current=null;queue.length=0;panel.hidden=true;delete panel.dataset.phase},
   get busy(){return current!==null}
  };
 }
 root.TopoPizza={flavor,name,draw,createCelebrations};
})(typeof window==='undefined'?globalThis:window);
