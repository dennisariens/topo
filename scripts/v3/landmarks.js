/* Geographic presentation: data anchors and raster height are never moved or rewritten. */
window.TopoV3Landmarks=function(svg,k){
 'use strict';
 const art=window.TOPO_V3_ART?.landmarks;
 if(!art||!svg.matches('.v3MapStage .v3Map,.v3ToetsMap'))return;
 const NS='http://www.w3.org/2000/svg',make=(tag,attrs)=>{const n=document.createElementNS(NS,tag);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,String(value));return n;};
 svg.classList.add('v3LandmarkMap');
 // Compose the existing depth transform with a gentle warm, less green palette. Only the raster is filtered.
 const depth=svg.querySelector('filter[id$="reliefDepth"]');
 if(depth&&!svg.querySelector('filter[id$="warmRelief"]')){
  const warm=depth.cloneNode(true);warm.id=depth.id.replace('reliefDepth','warmRelief');
  warm.append(make('feColorMatrix',{type:'saturate',values:.65}));
  const temperature=make('feComponentTransfer',{});
  for(const [tag,slope,intercept] of [['R',1.08,.035],['G',1,.015],['B',.88,.025]])temperature.append(make('feFunc'+tag,{type:'linear',slope,intercept}));
  warm.append(temperature);depth.after(warm);svg.querySelector('.atlasTerrain')?.setAttribute('filter','url(#'+warm.id+')');
 }
 let g=svg.querySelector('.v3Landmarks');if(!g){g=make('g',{class:'v3Landmarks','aria-hidden':'true','pointer-events':'none'});svg.insertBefore(g,svg.querySelector('.v3Marks'));}
 g.replaceChildren();const cw=art.width/art.columns,ch=art.height/art.rows;
 for(const item of art.items){
  const anchor=ITEMS.find(i=>i.id===item.anchor);if(!anchor)continue;
  const node=make('g',{'data-landmark':item.id,'data-anchor':anchor.id,transform:'translate('+anchor.px+' '+anchor.py+') scale('+k+')'});
  const cell=make('svg',{x:-17,y:-34,width:34,height:34,viewBox:[item.cell%art.columns*cw,Math.floor(item.cell/art.columns)*ch,cw,ch].join(' '),overflow:'hidden',preserveAspectRatio:'xMidYMax meet'});
  cell.append(make('image',{href:art.src,width:art.width,height:art.height}));node.append(cell);g.append(node);
 }
};
