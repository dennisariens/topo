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
 g.replaceChildren();
 for(const item of art.items){
  const size=window.devicePixelRatio>1?256:128,asset=item.exports[size];
  const [left,top,right,bottom]=asset.paintBounds;
  // Anchor the painted bottom centre, not the padded square, at the real geographic point.
  const units=item.paintSize/Math.max(right-left,bottom-top),width=asset.size[0]*units;
  const node=make('g',{'data-landmark':item.id,'data-longitude':item.coordinates[0],'data-latitude':item.coordinates[1],transform:'translate('+item.point[0]+' '+item.point[1]+') scale('+k+')'});
  node.append(make('image',{href:asset.src,x:-(left+right)/2*units,y:-bottom*units,width,height:width,'data-export-size':size}));g.append(node);
 }
};
