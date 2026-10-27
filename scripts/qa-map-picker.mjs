import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=new URL('../',import.meta.url),out=new URL('../docs/visual/map-picker-58/',import.meta.url);mkdirSync(out,{recursive:true});
const baseline='bd1e57bc48e55a065cbbccb68acea196a64a187c';
const before='/private/tmp/topo-picker-58-before.html';writeFileSync(before,execFileSync('git',['show',baseline+':index.html'],{cwd:root,maxBuffer:32e6}));
const browser=await chromium.launch(),records=process.env.QA_PICKER_RESUME?JSON.parse(readFileSync(new URL('collision-checkpoint.json',out),'utf8')):[],errors=[],external=[],screenshots=new Set();
const url=process.env.TOPO_PICKER_FILE?new URL(process.env.TOPO_PICKER_FILE,root).href:new URL('output/html/TOPO-Italie-Computer.html',root).href;
const examples=[['city-9','area-o'],['city-6','area-e'],['city-15','area-f'],['city-2','city-20'],['city-5','city-13'],['city-3','area-n']];
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!/^(file:|data:)/.test(r.url()))external.push(r.url())});}
// Exact finite arrangement cells of 27 equal-radius point hit disks. Midpoints of
// every circle arc, just inside/outside its boundary, cover every open cell.
async function enumerate(p){return p.evaluate(()=>{
 const m=document.querySelector('#map').getScreenCTM(),scale=Math.hypot(m.a,m.b),points=ITEMS.filter(i=>mapFeatureClass(i)==='point'),sets=new Map();
 const add=(x,y,kind,margin=0)=>{const q=new DOMPoint(x,y).matrixTransform(m),hits=mapTapCandidates(q.x,q.y,kind);if(hits.length>1){const key=kind+':'+hits.map(i=>i.id).sort().join(',');if(!sets.has(key)||margin>(sets.get(key).margin||0))sets.set(key,{kind,x,y,ids:hits.map(i=>i.id).sort(),margin});}};
 // Enumerate every integer CSS-pixel tap in the union of all 27 hit disks.
 // Keep the representative furthest from any disk boundary to avoid rounding noise.
 const screens=points.map(i=>{const q=new DOMPoint(i.px,i.py).matrixTransform(m);return{id:i.id,x:q.x,y:q.y}}),samples=new Map();
 for(const a of screens)for(let y=Math.floor(a.y-22);y<=Math.ceil(a.y+22);y++)for(let x=Math.floor(a.x-22);x<=Math.ceil(a.x+22);x++){
 const ids=screens.filter(b=>Math.hypot(x-b.x,y-b.y)<=22).map(b=>b.id).sort();if(ids.length<2)continue;const key=ids.join(','),margin=Math.min(...screens.map(b=>Math.abs(Math.hypot(x-b.x,y-b.y)-22)));if(!samples.has(key)||samples.get(key).margin<margin){const q=new DOMPoint(x,y).matrixTransform(m.inverse());samples.set(key,{kind:'point',x:q.x,y:q.y,ids,margin});}}
 for(const s of samples.values())sets.set('point:'+s.ids.join(','),s);
 // One CSS pixel raster for non-point overlaps, plus source outline sampling.
 const canvas=document.createElement('canvas');canvas.width=Math.ceil(890*scale);canvas.height=Math.ceil(1235*scale);const ctx=canvas.getContext('2d',{willReadFrequently:true}),w=canvas.width,h=canvas.height;
 const raster=(paths,stroke=false)=>{ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.setTransform(scale,0,0,scale,0,0);ctx.lineWidth=44/scale;ctx.fillStyle=ctx.strokeStyle='#000';for(const path of paths)stroke?ctx.stroke(path):ctx.fill(path);const data=ctx.getImageData(0,0,w,h).data,out=new Uint8Array(w*h);for(let n=0;n<out.length;n++)out[n]=data[n*4+3]>=128?1:0;return out;};
 const land=raster([...document.querySelector('#landLayer').children].filter(n=>n.tagName==='path').map(n=>new Path2D(n.getAttribute('d'))));
 for(const kind of['sea','river','regions','mountains','countries','islands']){
  const items=ITEMS.filter(i=>mapFeatureClass(i)===kind);if(items.length<2)continue;const cells=new Uint8Array(w*h);
  items.forEach((item,index)=>{const mask=raster([new Path2D(item.shape)],kind==='river');for(let n=0;n<cells.length;n++)if(mask[n]&&(kind!=='sea'||!land[n]))cells[n]|=1<<index;});
  const found=new Map();
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const bits=cells[y*w+x];if(!bits||(bits&(bits-1))===0)continue;const old=found.get(bits);if(old?.margin===8)continue;let margin=0;for(const d of[1,2,4,8]){if(x<d||y<d||x+d>=w||y+d>=h||cells[y*w+x-d]!==bits||cells[y*w+x+d]!==bits||cells[(y-d)*w+x]!==bits||cells[(y+d)*w+x]!==bits)break;margin=d;}if(!old||margin>old.margin)found.set(bits,{x:(x+.5)/scale,y:(y+.5)/scale,margin});}
  for(const sample of found.values())add(sample.x,sample.y,kind,sample.margin);
  // Include vector-boundary samples, recording shared-edge-only sets separately
  // if no integer-pixel physical tap can actually open a chooser after pan.
  for(const i of items){const path=elements[i.id],length=path.getTotalLength?.();if(length)for(let t=0;t<length;t+=1/scale){const q=path.getPointAtLength(t);add(q.x,q.y,kind);}}
 }
 return{scale,pointIds:points.map(i=>i.id),sets:[...sets.values()]};
});}
async function fixture(p,id,mode='point'){
 await p.evaluate(({id,mode})=>{window.mode(mode);state.current=byId[id];state.questionMode='point';state.answered=false;clearActive();hideLens();document.querySelector('#prompt').textContent='Waar ligt '+state.current.name+'?';message('Klik op de plek of de vorm op de kaart.');},{id,mode});
}
async function tap(p,s){const toggle=p.locator('#focusSheetToggle');if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')==='true')await toggle.click();await p.evaluate(ids=>window.__pickerExpected=ids.join(','),s.ids);const xy=await p.evaluate(({x,y})=>{const a=document.querySelector('.atlasViewport'),map=document.querySelector('#map');let q=new DOMPoint(x,y).matrixTransform(map.getScreenCTM()),r=a.getBoundingClientRect();a.scrollLeft+=q.x-r.left-r.width/2;a.scrollTop+=q.y-r.top-r.height/2;q=new DOMPoint(x,y).matrixTransform(map.getScreenCTM());for(let radius=0;radius<=24;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){const px=Math.round(q.x)+dx,py=Math.round(q.y)+dy;if(document.elementFromPoint(px,py)?.closest('.atlasViewport')&&mapTapCandidates(px,py,mapFeatureClass(state.current)).map(i=>i.id).sort().join(',')===window.__pickerExpected)return[px,py];}return null},{x:s.x,y:s.y});if(!xy)return null;await p.mouse.click(...xy);assert(await p.locator('#mapPicker').evaluate(n=>n.open),'physical tap did not open chooser '+JSON.stringify({s,xy,trace:await p.evaluate(([x,y])=>({element:document.elementFromPoint(x,y)?.outerHTML.slice(0,250),candidates:mapTapCandidates(x,y,mapFeatureClass(state.current)).map(i=>i.id),rect:document.querySelector('.atlasViewport').getBoundingClientRect().toJSON()}),xy)}));return xy;}
async function metrics(p){return p.evaluate(()=>{
 const panels=[...document.querySelectorAll('[data-picker-panel]')].map(svg=>{const m=svg.getScreenCTM(),marks=[...svg.querySelectorAll('[data-picker-endpoint]')].map(n=>{const p=new DOMPoint(+n.getAttribute('cx'),+n.getAttribute('cy')).matrixTransform(m);return{id:n.dataset.pickerEndpoint,x:p.x,y:p.y}}),lines=[...svg.querySelectorAll('[data-picker-leader]')].map(n=>[+n.getAttribute('x1'),+n.getAttribute('y1'),+n.getAttribute('x2'),+n.getAttribute('y2')]);let min=null,crossings=0;const orient=(a,b,c)=> (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);for(let a=0;a<marks.length;a++)for(let b=a+1;b<marks.length;b++){const d=Math.hypot(marks[a].x-marks[b].x,marks[a].y-marks[b].y);min=min===null?d:Math.min(min,d);const u=lines[a],v=lines[b],p=u.slice(0,2),q=u.slice(2),r=v.slice(0,2),s=v.slice(2);if(orient(p,q,r)*orient(p,q,s)<0&&orient(r,s,p)*orient(r,s,q)<0)crossings++;}return{key:svg.dataset.pickerPanel,marks,minEndpointPx:min,crossings};});
 const buttons=[...document.querySelectorAll('[data-map-choice]')].map(b=>{const r=b.getBoundingClientRect();return{id:b.dataset.mapChoice,width:r.width,height:r.height,visible:r.top>=0&&r.bottom<=innerHeight,label:b.getAttribute('aria-label')}});
 return{panels,buttons,outlineIds:[...document.querySelectorAll('[data-picker-outline]')].map(n=>n.dataset.pickerOutline),text:document.querySelector('#mapPicker').textContent,focused:document.activeElement.textContent};
});}
async function capture(p,name){await p.mouse.move(0,0);const viewport=p.locator('.pickerViewport');if(await viewport.count())await viewport.evaluate(n=>n.scrollTop=0);await p.screenshot({path:new URL(name+'.png',out).pathname});if(await viewport.count()){await viewport.evaluate(n=>n.scrollTop=n.scrollHeight);await p.screenshot({path:new URL(name+'-detail.png',out).pathname});}}
try{
 for(const[name,width,height]of[['desktop',1500,1000],['landscape',1180,820],['portrait',820,1180],['phone',390,844],['small-phone',320,568]]){
 if(process.env.QA_PICKER_RESUME&&records.some(r=>r.name===name))continue;
 const c=await browser.newContext({viewport:{width,height},offline:true,reducedMotion:'reduce'}),p=await c.newPage();watch(p);await p.goto(url);
 for(const[camera,zoom]of[['overview',1],['chapter',2],['pan',3]]){
  await fixture(p,'city-9');await p.evaluate(z=>TopoAtlas.zoom(z),zoom);console.log(name+' '+camera+' enumerate');const inventory=await enumerate(p);console.log(name+' '+camera+' '+inventory.sets.length+' collision sets');assert.equal(inventory.pointIds.length,27);
  for(const style of['school','discovery']){
   await p.evaluate(style=>TopoAtlas.applyTheme(style),style).catch(async()=>{await p.evaluate(style=>{document.querySelector('.atlasOptions input[value="'+style+'"]').click()},style)});
   for(const s of inventory.sets.sort((a,b)=>a.ids.length-b.ids.length)){
    // Same physical tap, two requested targets of the same semantic class.
    const targetIndependent=[];
    for(const requested of s.ids.slice(0,2)){
     await fixture(p,requested);await p.evaluate(z=>TopoAtlas.zoom(z),zoom);
     const before=await p.evaluate(()=>JSON.stringify({save:localStorage.getItem('topo-italie-v3'),route:state.route,good:state.good,answered:state.answered}));
     const physical=await tap(p,s);if(!physical){records.push({name,camera,style,...s,visualGeometry:'NO PHYSICAL TAP at integer CSS pixels: source border or occluded by existing Focus controls'});break;}const m=await metrics(p);targetIndependent.push(await p.locator('[data-map-choice]').evaluateAll(bs=>bs.map(b=>b.dataset.mapChoice).sort()));
     assert.deepEqual(targetIndependent.at(-1),s.ids);assert(!/Rome|Vaticaan|Napels|Etna|Povlakte|Toscane/.test(m.text));assert(m.buttons.every(b=>b.width>=44&&b.height>=44&&b.visible));assert(m.panels.every(x=>(x.minEndpointPx===null||x.minEndpointPx>=24)&&x.crossings===0));
     if(s.kind!=='point')assert.deepEqual(m.outlineIds.slice().sort(),s.ids);
     const key=name+'-'+camera+'-'+style+'-'+s.ids.join('_');
     const example=examples.findIndex(pair=>pair.every(id=>s.ids.includes(id))),reviewKey=name+'-'+(s.kind==='point'?example:s.kind);
     if(requested===s.ids[0]&&camera==='overview'&&style==='school'&&(example>=0||s.kind!=='point')&&!screenshots.has(reviewKey)){
      screenshots.add(reviewKey);await capture(p,'after-'+key);
      const bc=await browser.newContext({viewport:{width,height},offline:true}),bp=await bc.newPage();await bp.goto('file://'+beforeFile());await fixture(bp,requested);await bp.evaluate(z=>TopoAtlas.zoom(z),zoom);await tap(bp,s);await bp.mouse.move(0,0);await bp.screenshot({path:new URL('before-'+key+'.png',out).pathname});await bc.close();
     }
     await p.keyboard.press('Escape');assert(!await p.locator('#mapPicker').evaluate(n=>n.open));assert.equal(await p.evaluate(()=>JSON.stringify({save:localStorage.getItem('topo-italie-v3'),route:state.route,good:state.good,answered:state.answered})),before);
     if(requested===s.ids[0])records.push({name,width,height,camera,zoom,style,scale:inventory.scale,...s,...m,visualGeometry:'PASS'});
    }
    if(targetIndependent.length===2)assert.deepEqual(targetIndependent[0],targetIndependent[1]);
   }
  }
 }
 writeFileSync(new URL('collision-checkpoint.json',out),JSON.stringify(records,null,2)+'\n');await c.close();console.log(name+' PASS, total '+records.length+' enumerated matrix entries');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 writeFileSync(new URL('collision-results.json',out),JSON.stringify({baseline,browser:await browser.version(),transport:'file:// offline:true',pointEnumeration:'every integer CSS-pixel tap in union of all 27 radius-22px disks; maximum boundary-clearance representative per candidate set',areaEnumeration:'one CSS-pixel raster plus outline samples +/- .01 SVG units; subpixel-only area intersections not exhaustively proven',camera:'overview 1x; chapter-equivalent 2x; zoom 3x with scroll-pan to each physical tap',screenshots:[...screenshots],records,errors,external},null,2)+'\n');
}finally{await browser.close()}
function beforeFile(){return '/private/tmp/topo-picker-58-before.html'}
