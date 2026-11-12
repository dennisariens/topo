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
 // Ronde 4: landmarks below every pin and mark layer; the pin stays on top.
 let g=svg.querySelector('.v3Landmarks');if(!g)g=make('g',{class:'v3Landmarks','aria-hidden':'true','pointer-events':'none'});
 svg.insertBefore(g,svg.querySelector(':scope>.v3Pins,:scope>.v3Marks'));
 g.replaceChildren();
 // Ronde 4 size: the median painted height is 40 screen px on desktop and 34 on iPad (≤ 1279 px); the relative sizes
 // between landmarks (paintSize) are kept.
 const size=window.devicePixelRatio>1?256:128,target=matchMedia('(max-width:1279px)').matches?34:40;
 const heights=art.items.map(item=>{const [l,t,r,b]=item.exports[size].paintBounds;return item.paintSize*(b-t)/Math.max(r-l,b-t);}).sort((a,b)=>a-b);
 const grow=target/((heights[(heights.length-1)>>1]+heights[heights.length>>1])/2);
 // Collision check (screen px around each landmark's anchor): never under or over a pin, a ✓/× mark or a mistake
 // label. A landmark that would touch one moves to the nearest free spot at the edge of its place; its anchor
 // (translate) stays on the real geographic point.
 const toMap=svg.getScreenCTM?.()?.inverse(),obstacles=[],GAP=3;
 const boxOf=n=>{try{const b=n.getBBox(),m=toMap&&n.getScreenCTM()&&toMap.multiply(n.getScreenCTM());if(!m||(!b.width&&!b.height))return null;
  const xs=[],ys=[];for(const [x,y] of [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]]){xs.push(m.a*x+m.c*y+m.e);ys.push(m.b*x+m.d*y+m.f);}
  return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];}catch{return null;}};
 for(const n of svg.querySelectorAll(':scope>.v3Pins .v3Pin,:scope>.v3Marks .v3Mark>circle,:scope>.v3Marks .v3MarkName')){const b=boxOf(n);if(b)obstacles.push(b);}
 const hits=(r)=>obstacles.some(o=>r[0]<o[2]+GAP*k&&o[0]<r[2]+GAP*k&&r[1]<o[3]+GAP*k&&o[1]<r[3]+GAP*k);
 const STEPS=[[0,-1],[1,0],[-1,0],[1,-1],[-1,-1],[0,1],[1,1],[-1,1]];
 for(const item of art.items){
  const asset=item.exports[size];
  const [left,top,right,bottom]=asset.paintBounds;
  // Anchor the painted bottom centre, not the padded square, at the real geographic point.
  const units=item.paintSize*grow/Math.max(right-left,bottom-top),width=asset.size[0]*units,pw=(right-left)*units,ph=(bottom-top)*units;
  const at=(dx,dy)=>[item.point[0]+(dx-pw/2)*k,item.point[1]+(dy-ph)*k,item.point[0]+(dx+pw/2)*k,item.point[1]+dy*k];
  let dx=0,dy=0;
  if(hits(at(0,0)))search:for(let d=4;d<=96;d+=4)for(const [sx,sy] of STEPS){const r=at(sx*d,sy*d);if(!hits(r)){dx=sx*d;dy=sy*d;break search;}}
  const box=at(dx,dy);obstacles.push(box);
  const node=make('g',{'data-landmark':item.id,'data-longitude':item.coordinates[0],'data-latitude':item.coordinates[1],transform:'translate('+item.point[0]+' '+item.point[1]+') scale('+k+')'});
  if(dx||dy){node.dataset.shift=dx+' '+dy;}
  node.append(make('image',{href:asset.src,x:-(left+right)/2*units+dx,y:-bottom*units+dy,width,height:width,'data-export-size':size}));g.append(node);
 }
};
