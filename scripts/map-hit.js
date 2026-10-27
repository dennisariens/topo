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
// Layout uses only candidates and available space, never the requested answer.
// Close pairs get a genuine magnified crop; broad collision sets may need multiple crops.
function mapPickerPointPanels(items,width){
 const sorted=items.slice().sort((a,b)=>a.px-b.px||a.py-b.py||a.id.localeCompare(b.id));
 const span=Math.max(...sorted.map(i=>i.px))-Math.min(...sorted.map(i=>i.px));
 const vertical=Math.max(...sorted.map(i=>i.py))-Math.min(...sorted.map(i=>i.py));
 const side=sorted.length===1?80:Math.max(span,vertical,.01)*width/(width-128);
 const x=(Math.min(...sorted.map(i=>i.px))+Math.max(...sorted.map(i=>i.px))-side)/2;
 const y=(Math.min(...sorted.map(i=>i.py))+Math.max(...sorted.map(i=>i.py))-side)/2;
 const marks=sorted.map(i=>({id:i.id,x:(i.px-x)*width/side,y:(i.py-y)*width/side}));
 for(const side of[-1,1]){
  const lane=marks.filter(m=>(m.x<=width/2?-1:1)===side).sort((a,b)=>a.y-b.y||a.x-b.x);
  lane.forEach((m,n)=>{m.lx=side<0?22:width-22;m.ly=Math.max(m.y,n?lane[n-1].ly+46:32)});
  if(lane.length&&lane.at(-1).ly>width-32){lane.at(-1).ly=width-32;for(let n=lane.length-2;n>=0;n--)lane[n].ly=Math.min(lane[n].ly,lane[n+1].ly-46)}
 }
 const cross=(a,b,c)=> (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
 let valid=marks.every(m=>m.ly>=28&&m.ly<=width-28);
 for(let a=0;a<marks.length;a++)for(let b=a+1;b<marks.length;b++){
  const p=marks[a],q=marks[b],u={x:p.lx,y:p.ly},v={x:q.lx,y:q.ly};
  if(Math.hypot(p.x-q.x,p.y-q.y)<32||Math.hypot(u.x-v.x,u.y-v.y)<44)valid=false;
  if(cross(p,u,q)*cross(p,u,v)<0&&cross(q,v,p)*cross(q,v,u)<0)valid=false;
 }
 if(valid||sorted.length===1)return[{items:sorted,x,y,side,marks}];
 // Split at the largest source-coordinate gap, keeping very close neighbours together.
 const axis=span>=vertical?'px':'py',order=sorted.slice().sort((a,b)=>a[axis]-b[axis]||a.id.localeCompare(b.id));
 let cut=1;for(let n=2;n<order.length;n++)if(order[n][axis]-order[n-1][axis]>order[cut][axis]-order[cut-1][axis])cut=n;
 return [...mapPickerPointPanels(order.slice(0,cut),width),...mapPickerPointPanels(order.slice(cut),width)];
}
// Clone context, not active-answer paint, inflated city symbols or named learning labels.
function mapPickerContext(box,width){
 const copy=$('#map').cloneNode(true);copy.setAttribute('viewBox',`${box.x} ${box.y} ${box.side} ${box.side}`);
 copy.querySelectorAll('text,#nameLayer,#pointLayer,#previewMap,.microLocator,.atlasTerrain,.atlasWaterTexture,[data-hit-id]').forEach(n=>n.remove());
 [copy,...copy.querySelectorAll('*')].forEach(n=>{['id','tabindex','aria-label','data-id','data-hit-id','role'].forEach(a=>n.removeAttribute(a));n.classList.remove('activeTarget');});
 copy.querySelectorAll('path,circle,polygon,polyline').forEach(n=>{n.setAttribute('vector-effect','non-scaling-stroke');n.style.strokeWidth='1px';});
 copy.setAttribute('x',0);copy.setAttribute('y',0);copy.setAttribute('width',width);copy.setAttribute('height',width);
 copy.style.cssText='width:100%;height:100%;max-height:none;pointer-events:none';copy.setAttribute('aria-hidden','true');
 return copy;
}
function mapPickerFrame(box,width){
 const svg=el('svg',{viewBox:`0 0 ${width} ${width}`,class:'pickerMap','aria-hidden':'true'},document.createDocumentFragment());svg.append(mapPickerContext(box,width));
 const north=el('text',{x:width-18,y:20,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#173c36',stroke:'#fffefa','stroke-width':4,'paint-order':'stroke'},svg);north.textContent='N ↑';return svg;
}
function mapPickerBounds(items,padding=1.3){
 const boxes=items.map(i=>mapFeatureClass(i)==='point'?{x:i.px,y:i.py,width:0,height:0}:elements[i.id].getBBox());
 const left=Math.min(...boxes.map(b=>b.x)),right=Math.max(...boxes.map(b=>b.x+b.width)),top=Math.min(...boxes.map(b=>b.y)),bottom=Math.max(...boxes.map(b=>b.y+b.height));
 const side=Math.max(80,right-left,bottom-top)*padding;return{x:(left+right-side)/2,y:(top+bottom-side)/2,side};
}
const pickerStyle=document.createElement('style');pickerStyle.textContent=`
.mapPicker{box-sizing:border-box;width:min(480px,94vw);max-height:92dvh;overflow:auto;padding:18px}.mapPicker[open]{display:flex;flex-direction:column}.mapPicker>h2,.mapPicker>p,.mapPicker .pickerActions,.mapPicker .pickerCancel{flex:none}.mapPicker .pickerMap{display:block;width:100%;aspect-ratio:1;max-height:none;height:auto;margin:8px 0;border:1px solid #9eafa2;border-radius:10px;background:#d7eaf0}.mapPicker .pickerContext{max-width:112px;margin:8px auto}.mapPicker .pickerViewport{flex:1;min-height:80px;max-height:52dvh;overflow:auto;scrollbar-gutter:stable;overscroll-behavior:contain}.mapPicker figure{margin:12px 0;padding:10px;border:1px solid #b4c5b7;border-radius:12px;background:#fffefa}.mapPicker figcaption{font-weight:750;font-size:14px}.mapPicker .pickerActions{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.mapPicker .pickerActions button{min-height:48px;min-width:44px}.mapPicker .pickerCancel{width:100%;min-height:48px}.mapPicker p{line-height:1.45}.mapPicker .pickerNote{font-size:13px;color:#365b52}.mapPicker button:focus-visible{outline:3px solid #087887;outline-offset:3px}
`;document.head.append(pickerStyle);
let mapPickerReturnFocus=null,mapPickerMaskSerial=0;
pick.addEventListener('close',()=>{const n=mapPickerReturnFocus;mapPickerReturnFocus=null;if(n?.isConnected&&n!==document.body)n.focus({preventScroll:true});else{$('#map').setAttribute('tabindex','-1');$('#map').focus({preventScroll:true})}});
function openMapPicker(hits){
 const candidates=neutralMapOrder(hits),classes=new Set(candidates.map(mapFeatureClass));
 const pointOnly=classes.size===1&&classes.has('point');
 const noun=pointOnly?'Stip':classes.size===1&&classes.has('river')?'Rivier':classes.size===1?'Gebied':'Plek';
 mapPickerReturnFocus=document.activeElement;
 pick.replaceChildren();const title=document.createElement('h2');title.id='mapPickerTitle';title.textContent=pointOnly?'Welke stip bedoel je?':noun==='Rivier'?'Welke rivier bedoel je?':noun==='Gebied'?'Welk gebied bedoel je?':'Welke plek bedoel je?';pick.append(title);
 const hint=document.createElement('p');hint.textContent=pointOnly?'Bekijk de uitvergrote stippen. Kies het nummer bij jouw plek.':'Vergelijk de omlijnde vormen op dezelfde kaart. Kies jouw plek.';pick.append(hint);
 const content=document.createElement('div');content.className='pickerViewport';pick.append(content);
 const choices=document.createElement('div');choices.className='pickerActions';
 candidates.forEach((i,n)=>{const button=routeButton(noun+' '+(n+1),()=>chooseMapPlace(i));button.dataset.mapChoice=i.id;choices.append(button)});
 const cancel=routeButton('Terug naar de kaart',()=>pick.close(),'button pickerCancel');cancel.autofocus=true;pick.append(choices,cancel);pick.showModal();cancel.focus({preventScroll:true});
 const render=()=>{
  content.replaceChildren();const width=Math.max(160,content.clientWidth-22),numbers=new Map(candidates.map((i,n)=>[i.id,n+1]));
  const overview=mapPickerBounds(candidates);const orientation=mapPickerFrame(overview,width);orientation.classList.add('pickerContext');
  const contextCaption=document.createElement('p');contextCaption.className='pickerNote';contextCaption.textContent='Overzicht · noord is boven';content.append(contextCaption,orientation);
  if(pointOnly){
   const panels=mapPickerPointPanels(candidates,width);
   panels.forEach((panel,index)=>{
    const key=String.fromCharCode(65+index),figure=document.createElement('figure'),caption=document.createElement('figcaption');caption.textContent='Uitsnede '+key+' · uitvergrote plaatsmarkeringen';figure.append(caption);
    const svg=mapPickerFrame(panel,width);svg.dataset.pickerPanel=key;
    // Country-scale river/zone paths are not neighbourhood geography. At extreme
    // magnification show only the exact source anchors and the land context.
    if(panel.side<30){const local=svg.querySelector('svg');local.querySelectorAll('.zone,.lineTarget,[data-context-layer]').forEach(n=>n.remove());}
    // The frame is a crop locator, not an invented geographic boundary.
    const cx=(panel.x+panel.side/2-overview.x)*width/overview.side,cy=(panel.y+panel.side/2-overview.y)*width/overview.side,r=Math.max(7,panel.side/overview.side*width/2);
    el('rect',{x:cx-r,y:cy-r,width:r*2,height:r*2,fill:'none',stroke:'#173c36','stroke-width':2},orientation);
    const tag=el('text',{x:cx+r+3,y:cy-r+12,'font-size':14,'font-weight':800,fill:'#173c36',stroke:'#fffefa','stroke-width':3,'paint-order':'stroke'},orientation);tag.textContent=key;
    panel.marks.forEach(m=>{
     const n=numbers.get(m.id);el('line',{x1:m.x,y1:m.y,x2:m.lx,y2:m.ly,stroke:'#173c36','stroke-width':2,'data-picker-leader':m.id},svg);
     el('circle',{cx:m.x,cy:m.y,r:6,fill:'#173c36',stroke:'#fffefa','stroke-width':2,'data-picker-endpoint':m.id},svg);
     el('circle',{cx:m.lx,cy:m.ly,r:18,fill:'#173c36',stroke:'#fffefa','stroke-width':2},svg);
     const label=el('text',{x:m.lx,y:m.ly+6,'text-anchor':'middle','font-size':18,'font-weight':800,fill:'#fffefa'},svg);label.textContent=n;
     const button=choices.querySelector('[data-map-choice="'+m.id+'"]');button.setAttribute('aria-label',`${noun} ${n}, uitsnede ${key}, ${m.x<width/2?'links':'rechts'}, ${m.y<width/2?'boven':'onder'}`);
    });figure.append(svg);content.append(figure);
   });
   const note=document.createElement('p');note.className='pickerNote';note.textContent='De stippen blijven op hun echte plaats. Het kader toont de uitsnede; stippen zijn geen grenzen.';
   if(state.mode==='learn'&&hits.some(i=>i.id==='city-9')&&hits.some(i=>i.id==='area-o'))note.textContent+=' Vaticaanstad ligt binnen Rome, ten westnoordwesten van de aangegeven stadsplek.';content.append(note);
  }else{
   // Small multiples share one extent and one scale. Each option shows its whole true
   // outline/centreline, including nested seas, instead of indistinguishable centre dots.
   candidates.forEach((item,n)=>{
    const figure=document.createElement('figure'),caption=document.createElement('figcaption');caption.textContent=noun+' '+(n+1)+' · omlijnde vorm';figure.append(caption);
    const svg=mapPickerFrame(overview,width),context=svg.querySelector('svg');
    const path=el('path',{d:item.shape,fill:'none',stroke:'#fffefa','stroke-width':7,'vector-effect':'non-scaling-stroke'},context);path.style.strokeWidth='7px';
    if(mapFeatureClass(item)==='sea'){
     const id='picker-sea-'+(++mapPickerMaskSerial),defs=el('defs',{},context),mask=el('mask',{id,maskUnits:'userSpaceOnUse',x:overview.x,y:overview.y,width:overview.side,height:overview.side},defs);
     el('rect',{x:overview.x,y:overview.y,width:overview.side,height:overview.side,fill:'white'},mask);
     for(const land of $('#landLayer').querySelectorAll('path'))el('path',{d:land.getAttribute('d'),fill:'black',stroke:'none'},mask);path.setAttribute('mask','url(#'+id+')');
    }
    const outline=el('path',{d:item.shape,fill:'none',stroke:'#173c36','stroke-width':3,'vector-effect':'non-scaling-stroke','data-picker-outline':item.id},context);outline.style.strokeWidth='3px';if(path.hasAttribute('mask'))outline.setAttribute('mask',path.getAttribute('mask'));
    if(mapFeatureClass(item)==='point'){
     const x=(item.px-overview.x)*width/overview.side,y=(item.py-overview.y)*width/overview.side;el('circle',{cx:x,cy:y,r:6,fill:'#173c36',stroke:'#fffefa','stroke-width':2},svg);
    }
    figure.append(svg);content.append(figure);choices.children[n].setAttribute('aria-label',noun+' '+(n+1)+', omlijnde vorm in kaart '+(n+1));
   });
  }
 };
 render();pick.scrollTop=0;
 // Reflow an open chooser after rotation/resize without reshuffling or losing the session.
 let lastWidth=content.clientWidth;const resize=()=>{if(pick.open&&content.clientWidth!==lastWidth){lastWidth=content.clientWidth;render()}};window.addEventListener('resize',resize);pick.addEventListener('close',()=>window.removeEventListener('resize',resize),{once:true});
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
