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
// One regional scene retains coasts, islands, lakes, rivers and mountain zones.
// BEGIN APPROVED ROME SVG
const mapPickerApprovedRomeSvg = "<svg font-family=\"-apple-system-body, ui-sans-serif, -apple-system, system-ui, &quot;Segoe UI&quot;, Helvetica, &quot;Apple Color Emoji&quot;, Arial, sans-serif, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;\" font-weight=\"400\" data-d-component=\"svg\" fill=\"currentColor\" style=\"color:rgb(13, 13, 13)\" viewBox=\"0 0 340 212\" width=\"100%\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"340\" height=\"212\" rx=\"12\" fill=\"#f0d4a0\"/><circle cx=\"204\" cy=\"110\" r=\"83\" fill=\"#e6c28b\" stroke=\"#895c3a\" stroke-width=\"3\"/><circle cx=\"204\" cy=\"110\" r=\"77\" fill=\"none\" stroke=\"#478079\" stroke-width=\"1.3\" stroke-dasharray=\"4 4\"/><path d=\"M152 100 L172 86 L194 99 L200 118 L181 135 L157 125Z\" fill=\"#bd8b51\" opacity=\".33\"/><path d=\"M158 126 L171 114 L183 125 L178 143 L161 140 Z\" fill=\"#8d5248\" stroke=\"#622d2c\" stroke-width=\"1.6\"/><circle cx=\"170\" cy=\"128\" r=\"4\" fill=\"#fff\"/><path d=\"M67 52 H114 L171 66 L221 88\" fill=\"none\" stroke=\"#254c46\" stroke-width=\"2.5\"/><circle cx=\"221\" cy=\"88\" r=\"4\" fill=\"#254c46\" stroke=\"white\" stroke-width=\"1.5\"/><circle cx=\"53\" cy=\"52\" r=\"16\" fill=\"#254c46\"/><text x=\"53\" y=\"58\" font-size=\"16\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"white\">1</text><path d=\"M67 164 H112 L170 128\" fill=\"none\" stroke=\"#254c46\" stroke-width=\"2.5\"/><circle cx=\"53\" cy=\"164\" r=\"16\" fill=\"#254c46\"/><text x=\"53\" y=\"170\" font-size=\"16\" font-weight=\"bold\" text-anchor=\"middle\" fill=\"white\">2</text></svg>";
// END APPROVED ROME SVG
// The owner's schematic artwork is immutable; only shuffled digits and neutral
// QA/accessibility metadata are applied to an imported copy, never source geometry.
function mapPickerApprovedRomeArtwork(numbers){
 const art=document.importNode(new DOMParser().parseFromString(mapPickerApprovedRomeSvg,'image/svg+xml').documentElement,true);
 art.dataset.approvedArtwork='rome-vatican';art.setAttribute('aria-hidden','true');
 const circles=art.querySelectorAll('circle'),paths=art.querySelectorAll('path'),labels=art.querySelectorAll('text');
 circles[0].dataset.pickerCityArea='illustrative';circles[0].dataset.pickerSymbol='city-9';circles[0].dataset.symbolKind='city';
 paths[1].dataset.pickerSymbol='area-o';paths[1].dataset.symbolKind='microstate';
 for(const [id,endpoint,badge,leader,label]of[['city-9',circles[3],circles[4],paths[2],labels[0]],['area-o',circles[2],circles[5],paths[3],labels[1]]]){
  // Indices are locked to the supplied SVG by the source-fidelity regression.
  if(!numbers.has(id)){badge.remove();leader.remove();label.remove();continue}
  endpoint.dataset.pickerEndpoint=id;badge.dataset.pickerBadge=id;leader.dataset.pickerLeader=id;label.textContent=String(numbers.get(id));
 }
 return art;
}
function mapPickerApprovedRomeScene(panel,size,numbers){
 const svg=mapPickerFrame(panel,size);svg.dataset.pickerPanel='geography';svg.querySelector('svg').remove();svg.querySelector('[data-picker-north]').remove();svg.style.background='#f0d4a0';
 const art=mapPickerApprovedRomeArtwork(numbers);art.setAttribute('x',0);art.setAttribute('y',(size-size*212/340)/2);art.setAttribute('width',size);art.setAttribute('height',size*212/340);art.style.cssText=`width:${size}px;height:${size*212/340}px;pointer-events:none`;
 mapPickerFitApprovedNumbers(art,size);svg.append(art);
 const locator=mapPickerFrame(mapPickerBounds(panel.items,2.6),size);locator.setAttribute('x',6);locator.setAttribute('y',6);locator.setAttribute('width',size*.26);locator.setAttribute('height',size*.26);locator.classList.add('pickerLocator');locator.dataset.pickerLocator='';svg.append(locator);
 return svg;
}
function mapPickerFitApprovedNumbers(art,width){
 // Preserve the source drawing and badge centres. Keep neutral digits readable
 // in an existing compact inset without enlarging or moving geographic targets.
 const scale=Math.max(1,Math.min(3.2,12*340/(16*width)));
 for(const badge of art.querySelectorAll('[data-picker-badge]')){
  const x=+badge.getAttribute('cx'),y=+badge.getAttribute('cy'),transform=`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`;
  badge.setAttribute('transform',transform);
  const label=[...art.querySelectorAll('text')].find(n=>+n.getAttribute('x')===x&&Math.abs(+n.getAttribute('y')-y)<10);if(label)label.setAttribute('transform',transform);
 }
 for(const leader of art.querySelectorAll('[data-picker-leader]'))leader.setAttribute('vector-effect','non-scaling-stroke');
}
function mapPickerPointPanels(items,width){
 const sorted=items.slice().sort((a,b)=>a.px-b.px||a.py-b.py||a.id.localeCompare(b.id));
 const rome=sorted.length===2&&sorted.some(i=>i.id==='city-9')&&sorted.some(i=>i.id==='area-o');
 const left=Math.min(...sorted.map(i=>i.px)),right=Math.max(...sorted.map(i=>i.px));
 const top=Math.min(...sorted.map(i=>i.py)),bottom=Math.max(...sorted.map(i=>i.py));
 // These are framing extents, not new feature coordinates or territorial boundaries.
 let context=sorted.some(i=>i.id==='area-e')?110:sorted.some(i=>i.id==='area-f')?230:260;
 const side=rome?Math.hypot(right-left,bottom-top)*4.8:Math.max(context,(right-left)*1.65,(bottom-top)*1.65);
 const x=(left+right-side)/2,y=(top+bottom-side)/2;
 const marks=sorted.map(i=>({id:i.id,x:(i.px-x)*width/side,y:(i.py-y)*width/side}));
 // Separate left/right rails. Sorting each rail by actual north/south position
 // prevents crossings without ever using the shuffled option number for layout.
 for(const direction of[-1,1]){
  const lane=marks.filter(m=>(m.x<=width/2?-1:1)===direction).sort((a,b)=>a.y-b.y||a.x-b.x);
  const gap=Math.min(44,(width-44)/Math.max(1,lane.length-1));
  lane.forEach((m,n)=>{m.lx=direction<0?20:width-20;m.ly=Math.max(m.y,n?lane[n-1].ly+gap:24)});
  if(lane.length&&lane.at(-1).ly>width-24){lane.at(-1).ly=width-24;for(let n=lane.length-2;n>=0;n--)lane[n].ly=Math.min(lane[n].ly,lane[n+1].ly-gap)}
 }
 // Uncross by swapping badge slots, not geographic endpoints. Each proper
 // crossing swap shortens total connector length, so this finite assignment
 // converges without target-dependent sorting or moving a place marker.
 const turn=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
 for(let pass=0;pass<marks.length**3;pass++){
  let changed=false;
  for(let a=0;a<marks.length;a++)for(let b=a+1;b<marks.length;b++){
   const p=marks[a],q=marks[b],u={x:p.lx,y:p.ly},v={x:q.lx,y:q.ly};
   if(turn(p,u,q)*turn(p,u,v)<0&&turn(q,v,p)*turn(q,v,u)<0){[p.lx,q.lx]=[q.lx,p.lx];[p.ly,q.ly]=[q.ly,p.ly];changed=true;}
  }
  if(!changed)break;
 }
 return[{items:sorted,x,y,side,marks,rome}];
}
function mapPickerContext(box,width){
 const copy=$('#map').cloneNode(true);copy.setAttribute('viewBox',`${box.x} ${box.y} ${box.side} ${box.side}`);
 copy.querySelectorAll('text,#nameLayer,#pointLayer,#previewMap,.microLocator,.atlasTerrain,.atlasWaterTexture,[data-hit-id]').forEach(n=>n.remove());
 [copy,...copy.querySelectorAll('*')].forEach(n=>{['id','tabindex','aria-label','data-id','data-hit-id','role'].forEach(a=>n.removeAttribute(a));n.classList.remove('activeTarget');});
 copy.querySelectorAll('path,circle,polygon,polyline').forEach(n=>{n.setAttribute('vector-effect','non-scaling-stroke');n.style.strokeWidth='1px';});
 copy.querySelectorAll('.land,.italy,.country').forEach(n=>n.style.fillOpacity='1');
 copy.setAttribute('x',0);copy.setAttribute('y',0);copy.setAttribute('width',width);copy.setAttribute('height',width);
 copy.style.cssText='width:100%;height:100%;max-height:none;pointer-events:none';copy.setAttribute('aria-hidden','true');
 return copy;
}
function mapPickerFrame(box,width){
 const svg=el('svg',{viewBox:`0 0 ${width} ${width}`,class:'pickerMap','aria-hidden':'true'},document.createDocumentFragment());svg.append(mapPickerContext(box,width));
 const north=el('text',{x:width-24,y:18,'text-anchor':'middle','font-size':13,'font-weight':800,fill:'#254c46',stroke:'#fffefa','stroke-width':4,'paint-order':'stroke','data-picker-north':''},svg);north.textContent='N ↑';return svg;
}
function mapPickerBounds(items,padding=1.3){
 const boxes=items.map(i=>mapFeatureClass(i)==='point'?{x:i.px,y:i.py,width:0,height:0}:elements[i.id].getBBox());
 const left=Math.min(...boxes.map(b=>b.x)),right=Math.max(...boxes.map(b=>b.x+b.width)),top=Math.min(...boxes.map(b=>b.y)),bottom=Math.max(...boxes.map(b=>b.y+b.height));
 const side=Math.max(80,right-left,bottom-top)*padding;return{x:(left+right-side)/2,y:(top+bottom-side)/2,side};
}
function mapPickerSymbol(svg,item,x,y,attributes={}){
 const kind=['area-e','area-f'].includes(item.id)?'volcano':['area-n','area-o'].includes(item.id)?'microstate':'city';
 const common={fill:kind==='volcano'?'#705342':kind==='microstate'?'#c8a650':'#fffefa',stroke:'#254c46','stroke-width':1.8,'data-picker-symbol':item.id,'data-symbol-kind':kind,...attributes};
 if(kind==='volcano'){
  // Summit is at the original GVP anchor. The glyph extends down from it.
  el('path',{d:`M ${x} ${y} l -8 12 h 16 Z`,...common},svg);
  el('path',{d:`M ${x-3} ${y+5} l 3 2 3 -2`,fill:'none',stroke:'#fffefa','stroke-width':1.4},svg);
 }else if(kind==='microstate')el('path',{d:`M ${x} ${y-5} l 5 5 -5 5 -5 -5 Z`,...common},svg);
 else el('circle',{cx:x,cy:y,r:4.5,...common},svg);
}
function mapPickerRomeInset(svg,panel,size,numbers){
 const nestedItems=[byId['city-9'],byId['area-o']],detailSize=Math.min(180,Math.floor(size*.60));
 const detailPanel=mapPickerPointPanels(nestedItems,detailSize)[0];
 const excluded=new Set(nestedItems.map(i=>i.id)),others=panel.marks.filter(m=>!excluded.has(m.id));
 const padding=5,positions=[[padding,padding],[size-detailSize-padding,padding],[padding,size-detailSize-padding],[size-detailSize-padding,size-detailSize-padding]];
 // Place the illustrative close-up in a free corner; no candidate or trace can hide below it.
 const intersects=(m,x,y)=>{for(let t=0;t<=1;t+=.025){const px=m.x+(m.lx-m.x)*t,py=m.y+(m.ly-m.y)*t;if(px>x-18&&px<x+detailSize+18&&py>y-18&&py<y+detailSize+18)return true}return false};
 positions.sort((a,b)=>others.filter(m=>intersects(m,...a)).length-others.filter(m=>intersects(m,...b)).length);
 const [x,y]=positions[0],detail=mapPickerPointScene(detailPanel,detailSize,numbers);
 detail.querySelector('.pickerLocator')?.remove();detail.removeAttribute('data-picker-panel');detail.dataset.pickerDetail='rome';
 detail.setAttribute('x',x);detail.setAttribute('y',y);detail.setAttribute('width',detailSize);detail.setAttribute('height',detailSize);
 el('rect',{x:x-2,y:y-2,width:detailSize+4,height:detailSize+4,rx:6,fill:'#f6f2e5',stroke:'#6f7767','stroke-width':1.5,'data-picker-inset-frame':''},svg);
 // A regional locator remains exactly at the original source positions.
 const city=byId['city-9'];el('circle',{cx:(city.px-panel.x)*size/panel.side,cy:(city.py-panel.y)*size/panel.side,r:7,fill:'none',stroke:'#254c46','stroke-width':1.4,'stroke-dasharray':'2 2'},svg);
 svg.append(detail);
 // A reference city is not an extra answer when only the microstate is a candidate.
 detail.querySelectorAll('[data-picker-badge],[data-picker-leader],[data-picker-endpoint]').forEach(n=>{const id=n.dataset.pickerBadge||n.dataset.pickerLeader||n.dataset.pickerEndpoint;if(!numbers.has(id))n.remove()});
 detail.querySelectorAll('text').forEach(n=>{if(n.textContent==='undefined')n.remove()});
}
function mapPickerPointScene(panel,size,numbers){
 const svg=mapPickerFrame(panel,size);svg.dataset.pickerPanel='geography';
 if(panel.rome)return mapPickerApprovedRomeScene(panel,size,numbers);
 // Show neutral neighbouring city/state/volcano symbols too, as in the original map.
 // Candidate callouts are the ONLY numbered symbols; no active-answer paint is cloned.
 if(!panel.rome)for(const item of ITEMS.filter(i=>mapFeatureClass(i)==='point'&&!panel.items.includes(i))){
  const x=(item.px-panel.x)*size/panel.side,y=(item.py-panel.y)*size/panel.side;
  if(x>32&&x<size-32&&y>28&&y<size-24)mapPickerSymbol(svg,item,x,y,{'opacity':.55,'data-picker-reference':''});
 }
 // Draw connectors before glyphs so their caps never obscure a volcano or enclave.
 const needsInset=!panel.rome&&panel.items.some(i=>i.id==='area-o');
 const visibleMarks=panel.marks.filter(m=>!needsInset||!['city-9','area-o'].includes(m.id));
 visibleMarks.forEach(m=>{
  if(!numbers.has(m.id))return;
  el('line',{x1:m.x,y1:m.y,x2:m.lx,y2:m.ly,stroke:'#fffefa','stroke-width':5},svg);
  el('line',{x1:m.x,y1:m.y,x2:m.lx,y2:m.ly,stroke:'#254c46','stroke-width':1.8,'data-picker-leader':m.id},svg);
 });
 visibleMarks.forEach(m=>{
  const item=panel.items.find(i=>i.id===m.id);mapPickerSymbol(svg,item,m.x,m.y);
  if(!numbers.has(m.id))return;
  el('circle',{cx:m.x,cy:m.y,r:2,fill:'#254c46',stroke:'#fffefa','stroke-width':.7,'data-picker-endpoint':m.id},svg);
  el('circle',{cx:m.lx,cy:m.ly,r:16,fill:'#254c46',stroke:'#fffefa','stroke-width':2,'data-picker-badge':m.id},svg);
  const label=el('text',{x:m.lx,y:m.ly+6,'text-anchor':'middle','font-size':18,'font-weight':800,fill:'#fffefa'},svg);label.textContent=numbers.get(m.id);
 });
 if(needsInset)mapPickerRomeInset(svg,panel,size,numbers);
 return svg;
}
// Discover's explanatory lens uses the same approved artwork importer. It remains
// unavailable in assessments; named buttons here are teaching, not answer hints.
const approvedLearnSketch=lens.querySelector('.lensSketch');
approvedLearnSketch.replaceChildren(mapPickerApprovedRomeArtwork(new Map([['city-9',1],['area-o',2]])));
approvedLearnSketch.classList.add('approvedRomeSketch');
if(window.ResizeObserver)new ResizeObserver(entries=>{for(const entry of entries)if(entry.contentRect.width>0)mapPickerFitApprovedNumbers(entry.target,entry.contentRect.width)}).observe(approvedLearnSketch.querySelector('svg'));
for(const button of lens.querySelectorAll('[data-choice]'))button.textContent=(button.dataset.choice==='city-9'?'1 · ':'2 · ')+button.textContent;
const pickerStyle=document.createElement('style');pickerStyle.textContent=`
.lensSketch.approvedRomeSketch{height:auto;background:#f0d4a0}.lensSketch.approvedRomeSketch::before,.lensSketch.approvedRomeSketch::after{content:none}.approvedRomeSketch>svg{display:block;width:100%;height:auto}
.mapPicker{box-sizing:border-box;width:min(620px,96vw);max-height:96dvh;padding:12px;overflow:hidden}.mapPicker[open]{display:flex;flex-direction:column;gap:8px}.mapPicker>h2{font-size:20px;line-height:1.15;margin:0}.mapPicker>p{font-size:14px;line-height:1.25;margin:0}.mapPicker .pickerViewport{flex:none;min-height:0;overflow:hidden;display:grid;gap:6px;justify-items:center}.mapPicker .pickerMap{display:block;flex:none;max-height:none;margin:0;border:1px solid #9eafa2;border-radius:8px;background:#d7eaf0;box-sizing:border-box}.mapPicker .pickerMap .pickerLocator{border-radius:0}.mapPicker figure{margin:0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px}.mapPicker figcaption{font-weight:750;font-size:13px}.mapPicker .pickerActions{display:grid;grid-template-columns:repeat(auto-fit,minmax(72px,1fr));gap:6px;flex:none;margin:0}.mapPicker .pickerActions button,.mapPicker .pickerCancel{min-height:44px;min-width:44px;padding:6px;font-size:15px;margin:0}.mapPicker .pickerCancel{width:100%;flex:none}.mapPicker .pickerNote{font-size:12px;line-height:1.25;margin:0;color:#365b52;flex:none}.mapPicker button:focus-visible{outline:3px solid #087887;outline-offset:2px}
`;document.head.append(pickerStyle);
let mapPickerReturnFocus=null,mapPickerMaskSerial=0;
pick.addEventListener('close',()=>{const n=mapPickerReturnFocus;mapPickerReturnFocus=null;if(n?.isConnected&&n!==document.body)n.focus({preventScroll:true});else{$('#map').setAttribute('tabindex','-1');$('#map').focus({preventScroll:true})}});
function openMapPicker(hits){
 const candidates=neutralMapOrder(hits),classes=new Set(candidates.map(mapFeatureClass));
 const pointOnly=classes.size===1&&classes.has('point');
 const noun=pointOnly?'Stip':classes.size===1&&classes.has('river')?'Rivier':classes.size===1?'Gebied':'Plek';
 mapPickerReturnFocus=document.activeElement;
 pick.replaceChildren();const title=document.createElement('h2');title.id='mapPickerTitle';title.textContent=pointOnly?'Welke plek bedoel je?':noun==='Rivier'?'Welke rivier bedoel je?':noun==='Gebied'?'Welk gebied bedoel je?':'Welke plek bedoel je?';pick.append(title);
 const hint=document.createElement('p');hint.textContent=pointOnly?'Volg de lijn van het nummer naar de plek.':'Vergelijk de omlijnde vormen op dezelfde schaal.';pick.append(hint);
 const content=document.createElement('div');content.className='pickerViewport';pick.append(content);
 const note=document.createElement('p');note.className='pickerNote';note.textContent=pointOnly?'○ stad · ▲ vulkaan · ◆ kleine staat. Symbolen, geen grenzen; vergrotingen zijn schematisch.':'De volledige vormen, op dezelfde schaal. Noord is boven.';
 if(state.mode==='learn'&&hits.some(i=>i.id==='city-9')&&hits.some(i=>i.id==='area-o'))note.textContent+=' Vaticaanstad ligt binnen Rome, ten westnoordwesten van de aangegeven stadsplek.';
 pick.append(note);
 const choices=document.createElement('div');choices.className='pickerActions';
 candidates.forEach((i,n)=>{const button=routeButton(noun+' '+(n+1),()=>chooseMapPlace(i));button.dataset.mapChoice=i.id;choices.append(button)});
 const cancel=routeButton('Terug naar de kaart',()=>pick.close(),'button pickerCancel');cancel.autofocus=true;pick.append(choices,cancel);pick.showModal();cancel.focus({preventScroll:true});
 const render=()=>{
  content.replaceChildren();
  // Measure the non-map chrome first; fit ALL maps and controls on first opening.
  // Native dialog margins are accounted for. No scroll-to-see-a-candidate fallback.
  const chrome=[title,hint,note,choices,cancel].reduce((h,n)=>h+n.getBoundingClientRect().height,0)+7*8+26;
  const available=Math.max(80,Math.min(innerHeight,window.visualViewport?.height||innerHeight)*.96-chrome);
  const width=Math.max(100,pick.clientWidth-24),numbers=new Map(candidates.map((i,n)=>[i.id,n+1]));
  if(pointOnly){
   content.style.gridTemplateColumns='1fr';
   const size=Math.floor(Math.min(width,available)),panel=mapPickerPointPanels(candidates,size)[0];
   const svg=mapPickerPointScene(panel,size,numbers);svg.style.width=svg.style.height=size+'px';content.append(svg);
   panel.marks.forEach(m=>{
    const symbolic=(panel.rome||panel.items.some(i=>i.id==='area-o'))&&['city-9','area-o'].includes(m.id);
    const location=symbolic?(m.id==='city-9'?'grote stadscirkel':'klein vlak binnen de stadscirkel'):`${m.x<size/2?'links':'rechts'}, ${m.y<size/2?'boven':'onder'}`;
    choices.querySelector('[data-map-choice="'+m.id+'"]').setAttribute('aria-label',`${noun} ${numbers.get(m.id)}, ${location}`);
   });
  }else{
   const columns=candidates.length<=3?candidates.length:Math.ceil(Math.sqrt(candidates.length)),rows=Math.ceil(candidates.length/columns);
   content.style.gridTemplateColumns=`repeat(${columns},1fr)`;
   const size=Math.floor(Math.min((width-(columns-1)*6)/columns,(available-rows*22-(rows-1)*6)/rows)),overview=mapPickerBounds(candidates);
   // Shared extent and scale, complete source outlines and source land masks retained.
   candidates.forEach((item,n)=>{
    const figure=document.createElement('figure'),caption=document.createElement('figcaption');caption.textContent=noun+' '+(n+1);figure.append(caption);
    const svg=mapPickerFrame(overview,size),context=svg.querySelector('svg');svg.style.width=svg.style.height=size+'px';
    const path=el('path',{d:item.shape,fill:'none',stroke:'#fffefa','stroke-width':7,'vector-effect':'non-scaling-stroke'},context);path.style.strokeWidth='7px';
    if(mapFeatureClass(item)==='sea'){
     const id='picker-sea-'+(++mapPickerMaskSerial),defs=el('defs',{},context),mask=el('mask',{id,maskUnits:'userSpaceOnUse',x:overview.x,y:overview.y,width:overview.side,height:overview.side},defs);
     el('rect',{x:overview.x,y:overview.y,width:overview.side,height:overview.side,fill:'white'},mask);
     for(const land of $('#landLayer').querySelectorAll('path'))el('path',{d:land.getAttribute('d'),fill:'black',stroke:'none'},mask);path.setAttribute('mask','url(#'+id+')');
    }
    const outline=el('path',{d:item.shape,fill:'none',stroke:'#254c46','stroke-width':3,'vector-effect':'non-scaling-stroke','data-picker-outline':item.id},context);outline.style.strokeWidth='3px';if(path.hasAttribute('mask'))outline.setAttribute('mask',path.getAttribute('mask'));
    if(mapFeatureClass(item)==='point')mapPickerSymbol(svg,item,(item.px-overview.x)*size/overview.side,(item.py-overview.y)*size/overview.side);
    figure.append(svg);content.append(figure);choices.children[n].setAttribute('aria-label',noun+' '+(n+1)+', omlijnde vorm in kaart '+(n+1));
   });
  }
 };
 render();pick.scrollTop=0;
 // Height changes (rotation and virtual keyboard) also require refitting, not reshuffling.
 window.addEventListener('resize',render);window.visualViewport?.addEventListener('resize',render);
 pick.addEventListener('close',()=>{window.removeEventListener('resize',render);window.visualViewport?.removeEventListener('resize',render)},{once:true});
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
