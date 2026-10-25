/* One tap resolver. Geometry and feature class only; never the expected answer ID. */
const mapPointIds=new Set(['area-e','area-f','area-n','area-o']);
function mapFeatureClass(item){
 if(item.kind==='city'||mapPointIds.has(item.id))return 'point';
 if(item.kind==='river')return 'river';
 if(item.kind==='water')return 'sea';
 return groupForItem(item); // regions, mountains, countries or islands; static content metadata.
}
function mapFillContains(shape,clientX,clientY){
 const matrix=shape?.getScreenCTM();return !!matrix&&shape.isPointInFill(new DOMPoint(clientX,clientY).matrixTransform(matrix.inverse()));
}
function mapTapCandidates(clientX,clientY,featureClass){
 const matrix=$('#map').getScreenCTM();if(!matrix)return [];
 return ITEMS.filter(item=>{
  const kind=mapFeatureClass(item);if(featureClass&&kind!==featureClass)return false;
  if(kind==='point'){
   const point=new DOMPoint(item.px,item.py).matrixTransform(matrix);
   return Math.hypot(clientX-point.x,clientY-point.y)<=22;
  }
  const shape=kind==='river'?$('#map').querySelector('[data-hit-id="'+item.id+'"]'):elements[item.id];
  const transform=shape?.getScreenCTM();if(!transform)return false;
  const local=new DOMPoint(clientX,clientY).matrixTransform(transform.inverse());
  // The river hit path already has the source line + a 44 CSS px non-scaling stroke.
  // SVG geometry queries respect fill containment and vector-effect under zoom/pan.
  if(kind==='river')return shape.isPointInStroke(local);
  if(!shape.isPointInFill(local))return false;
  // Sea zones are painted BEFORE the source land. Their hidden inland fill is not sea.
  return kind!=='sea'||![...$('#landLayer').children].some(land=>mapFillContains(land,clientX,clientY));
 });
}
function mapChoiceRandom(){
 if(window.crypto?.getRandomValues){const value=new Uint32Array(1);window.crypto.getRandomValues(value);return value[0]/4294967296}
 return Math.random();
}
function neutralMapOrder(candidates,random=mapChoiceRandom){
 const ordered=candidates.slice();
 for(let n=ordered.length-1;n>0;n--){const j=Math.floor(random()*(n+1));[ordered[n],ordered[j]]=[ordered[j],ordered[n]]}
 return ordered;
}
// Shared ambiguity dialog: dots for point collisions, outlines for genuine area/line overlaps.
const pick=document.createElement('dialog');pick.id='mapPicker';pick.className='mapPicker';pick.setAttribute('aria-labelledby','mapPickerTitle');document.body.append(pick);
function chooseMapPlace(item){
 pick.close();
 if(state.mode==='learn'){if(item)showLesson(item);return}
 if(state.questionMode==='point'&&!state.answered)grade(!!item&&item.id===state.current.id,item);
}
function openMapPicker(hits){
 const candidates=neutralMapOrder(hits),classes=new Set(candidates.map(mapFeatureClass));
 const pointOnly=classes.size===1&&classes.has('point');
 const noun=pointOnly?'Stip':classes.size===1&&classes.has('river')?'Rivier':classes.size===1?'Gebied':'Plek';
 pick.replaceChildren();const title=document.createElement('h2');title.id='mapPickerTitle';title.textContent=pointOnly?'Welke stip bedoel je?':noun==='Rivier'?'Welke rivier bedoel je?':noun==='Gebied'?'Welk gebied bedoel je?':'Welke plek bedoel je?';pick.append(title);
 const hint=document.createElement('p');hint.textContent='Dezelfde kaart, van dichtbij. Kies het nummer bij jouw plek.';pick.append(hint);
 const bounds=candidates.map(i=>mapFeatureClass(i)==='point'?{x:i.px,y:i.py,width:0,height:0}:elements[i.id].getBBox());
 const left=Math.min(...bounds.map(b=>b.x)),right=Math.max(...bounds.map(b=>b.x+b.width)),top=Math.min(...bounds.map(b=>b.y)),bottom=Math.max(...bounds.map(b=>b.y+b.height));
 const side=Math.max(80,right-left+35,bottom-top+35),x=(left+right-side)/2,y=(top+bottom-side)/2;
 const copy=$('#map').cloneNode(true);copy.setAttribute('viewBox',`${x} ${y} ${side} ${side}`);copy.querySelectorAll('text,#nameLayer,.microLocator').forEach(n=>n.remove());
 [copy,...copy.querySelectorAll('*')].forEach(n=>{['id','tabindex','aria-label','data-id','data-hit-id'].forEach(a=>n.removeAttribute(a));n.classList.remove('activeTarget')});copy.setAttribute('aria-hidden','true');copy.style.pointerEvents='none';
 candidates.forEach((i,n)=>{
  if(mapFeatureClass(i)!=='point')el('path',{d:i.shape,fill:'none',stroke:'#155e4a','stroke-width':2,'vector-effect':'non-scaling-stroke'},copy);
  el('circle',{cx:i.px,cy:i.py,r:1.5,fill:'#155e4a'},copy);
  el('line',{x1:i.px,y1:i.py,x2:i.px+(n%2?12:-12),y2:i.py-12,stroke:'#155e4a','stroke-width':.5},copy);
  const label=el('text',{x:i.px+(n%2?12:-12),y:i.py-13,'text-anchor':'middle','font-size':8,fill:'#155e4a',stroke:'white','stroke-width':.7,'paint-order':'stroke'},copy);label.textContent=n+1;
 });pick.append(copy);
 const choices=document.createElement('div');choices.className='pickerActions';
 candidates.forEach((i,n)=>{const button=routeButton(noun+' '+(n+1),()=>chooseMapPlace(i));button.dataset.mapChoice=i.id;choices.append(button)});
 pick.append(choices,routeButton('Terug naar de kaart',()=>pick.close()));pick.showModal();
}
$('#map').addEventListener('click',event=>{
 if(state.mode!=='learn'&&(state.questionMode!=='point'||state.answered))return;
 // Coordinate-free keyboard activation still selects the focused semantic SVG feature.
 if(!event.clientX&&!event.clientY)return;
 const kind=state.mode==='learn'?null:mapFeatureClass(state.current);
 const candidates=mapTapCandidates(event.clientX,event.clientY,kind);
 // Always consume geographical taps, including misses: never fall back to SVG paint order.
 event.preventDefault();event.stopImmediatePropagation();
 if(candidates.length>1)openMapPicker(candidates);
 else chooseMapPlace(candidates[0]); // A miss is a real wrong answer; existing Next/retry rules apply.
},true);
