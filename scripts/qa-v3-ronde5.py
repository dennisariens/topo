#!/usr/bin/env python3
"""Targeted Round 5 screen checks (docs/v3/OVERDRACHT.md › Ronde 5); desktop 1440×900 and iPad 1080×810,
overwriting the final evidence screenshots. One point per run: --point N; without it, points 1–9 in order."""
import argparse,asyncio,hashlib,importlib.util,io,json,pathlib
from PIL import Image
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'docs/qa/v3-stijlbeeld/final'
spec=importlib.util.spec_from_file_location('screen',ROOT/'scripts/qa-v3-afwerking.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
q.HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
VIEWPORTS={'desktop':(1440,900),'ipad-liggend':(1080,810)}

# Point 1: per chapter the Reis viewBox, Italy's on-screen box and the card's top.
FRAME='''async id=>{
 TOPO_V3.ui.selected=id;TOPO_V3.render();await new Promise(r=>setTimeout(r,650));
 const svg=document.querySelector('.v3MapStage .v3Map'),it=svg.querySelector('.italy').getBoundingClientRect(),isl=[...svg.querySelectorAll('.v3Isle')].map(n=>n.getBoundingClientRect());
 const b=[it,...isl].reduce((a,r)=>({l:Math.min(a.l,r.left),t:Math.min(a.t,r.top),r:Math.max(a.r,r.right),b:Math.max(a.b,r.bottom)}),{l:1e9,t:1e9,r:-1e9,b:-1e9});
 const st=document.querySelector('.v3Reis .v3MapStage').getBoundingClientRect(),card=document.querySelector('.v3Reis .v3Main>.v3Panel').getBoundingClientRect();
 return {id,frame:svg.dataset.frame,viewBox:svg.getAttribute('viewBox'),italyH:Math.round(b.b-b.t),italyW:Math.round(b.r-b.l),
  clearOfCard:b.b<=card.top+1,inStage:b.t>=st.top-1&&b.l>=st.left-1&&b.r<=st.right+1,stageH:Math.round(st.height),stageW:Math.round(st.width),
  freeH:Math.round(st.height-parseFloat(getComputedStyle(document.querySelector('.v3Reis .v3MapStage')).getPropertyValue('--v3-fit-bottom')))};
}'''

# Point 2: the landmarks drawn on Reis and any overlap with a pin or mark.
LANDMARKS='''()=>{const svg=document.querySelector('.v3MapStage .v3Map'),items=TOPO_V3.art.landmarks.items,ids=[],lm=[];
 for(const g of svg.querySelectorAll('.v3Landmarks>g')){const a=items.find(i=>i.id===g.dataset.landmark),img=g.querySelector('image'),e=a.exports[img.dataset.exportSize];
  const r=img.getBoundingClientRect(),s=r.width/e.size[0],[l,t,rr,bb]=e.paintBounds;ids.push(a.id);lm.push({left:r.left+l*s,top:r.top+t*s,right:r.left+rr*s,bottom:r.top+bb*s});}
 const ob=[...svg.querySelectorAll('.v3Pin,.v3Mark>circle,.v3MarkName')].map(n=>n.getBoundingClientRect());
 const overlaps=[];lm.forEach((a,i)=>ob.forEach(b=>{if(a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom)overlaps.push(ids[i]);}));
 return {ids,set:svg.dataset.landmarkSet||'',overlaps};}'''

# Point 3: on the book's first spread, no plate behind the text, and every text line box (Range rects) with its ink.
PLATES='''()=>[...document.querySelectorAll('#travelBook .bookSpread .folioWriting,#travelBook .bookSpread .folioWriting *')].filter(n=>{
 if(!n.getClientRects().length||n.matches('img,svg,svg *'))return false;const m=getComputedStyle(n).backgroundColor.match(/[\\d.]+/g);return m&&(m.length>3?+m[3]:1)>.05;}).map(n=>n.className)'''
TEXTS='''()=>{const out=[];const w=document.createTreeWalker(document.querySelector('#travelBook .bookSpread'),NodeFilter.SHOW_TEXT);
 while(w.nextNode()){const t=w.currentNode;if(!t.textContent.trim()||!t.parentElement.closest('.folioWriting'))continue;const cs=getComputedStyle(t.parentElement);
  const r=document.createRange();r.selectNodeContents(t);for(const b of r.getClientRects())if(b.width>2&&b.height>2)out.push({t:t.textContent.trim().slice(0,30),color:cs.color,size:parseFloat(cs.fontSize),weight:+cs.fontWeight,box:[b.left,b.top,b.width,b.height]});}
 return out;}'''

# Point 4: Voortgang's map — saturated violet only as an edge or accent; relief visible; the 45 / 45 congratulation.
VOORTGANG='''()=>{const f=document.querySelector('.v3VgKaart'),svg=f.querySelector('.v3VgMap'),acc=getComputedStyle(document.querySelector('.v3View-voortgang')).getPropertyValue('--v3-vg-hi').trim();
 const probe=document.createElement('i');probe.style.color=acc;document.body.append(probe);const violet=getComputedStyle(probe).color;probe.remove();
 const flat=[],area=svg.getBoundingClientRect().width*svg.getBoundingClientRect().height;let outlined=0;
 for(const n of svg.querySelectorAll('.v3Hit')){const cs=getComputedStyle(n),b=n.getBoundingClientRect();
  if(cs.stroke===violet&&cs.strokeWidth!=='0px')outlined++;
  if(cs.fill===violet&&+cs.fillOpacity*+cs.opacity>.25&&b.width*b.height>area*.004&&n.tagName!=='circle')flat.push(n.dataset.id);}
 const terrain=svg.querySelector('.atlasTerrain'),cheer=f.querySelector('.v3VgCheer [data-v3-master]');
 return {count:document.querySelector('.v3VgCount strong').textContent,flat,outlined,relief:svg.dataset.relief==='on'&&!!terrain&&getComputedStyle(terrain).display!=='none',
  gold:f.classList.contains('v3VgAllDone')&&getComputedStyle(f).boxShadow.includes('rgb(210, 165, 60)'),cheer:cheer?.dataset.v3Master||'',caption:f.querySelector('.v3VgKaartTitle span').textContent};}'''

# Point 5: every V2 green and teal (index.html outside data URIs: hue 85–186°, saturation ≥ 12 %, lightness 10–93 %),
# plus V2's three focus teals at 187° (#087887 focus, #147486 summary focus, #067b8b map micro-hit). Derived at run time.
def v2_greens():
 import colorsys,re
 t=re.sub(r'data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+','',(ROOT/'index.html').read_text(encoding='utf-8'));out={'#087887','#147486','#067b8b'}
 hexes=[m.lower()[:6] if len(m)==8 else m.lower() for m in re.findall(r'#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])',t)]
 rgbs=['%02x%02x%02x'%tuple(map(int,m)) for m in re.findall(r'rgba?\((\d+),\s*(\d+),\s*(\d+)',t)]
 for h in hexes+rgbs:
  h=''.join(x*2 for x in h) if len(h)==3 else h
  H,L,S=colorsys.rgb_to_hls(*(int(h[i:i+2],16)/255 for i in (0,2,4)))
  if 85<=H*360<=186 and S>=.12 and .1<L<.93:out.add('#'+h)
 return sorted(out)
V2_GREENS=v2_greens()
GREEN_SCAN='''greens=>{const want=new Set(greens.map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',')));const hits=[];
 const rgb=v=>[...(v||'').matchAll(/rgba?\\(([\\d.]+),\\s*([\\d.]+),\\s*([\\d.]+)(?:,\\s*([\\d.]+))?/g)].filter(m=>m[4]===undefined||+m[4]>0).map(m=>[m[1],m[2],m[3]].map(Math.round).join(','));
 const name=n=>n.tagName.toLowerCase()+(n.id?'#'+n.id:'')+(typeof n.className==='string'&&n.className?'.'+n.className.trim().split(/\\s+/).slice(0,2).join('.'):'');
 const look=(n,cs,where)=>{const props=[];
  if([...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim()))props.push('color');
  props.push('background-color','background-image','box-shadow','fill','stroke');
  for(const s of ['top','right','bottom','left'])if(parseFloat(cs['border-'+s+'-width'])>0&&cs['border-'+s+'-style']!=='none')props.push('border-'+s+'-color');
  if(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0)props.push('outline-color');
  if(cs.textDecorationLine!=='none')props.push('text-decoration-color');
  for(const pr of props){if(pr==='stroke'&&cs.stroke==='none')continue;if(pr==='fill'&&!(n instanceof SVGElement))continue;for(const c of rgb(cs.getPropertyValue(pr)))if(want.has(c))hits.push([name(n)+where,pr,c]);}};
 for(const n of document.querySelectorAll('body *')){if(n.closest('.v3PreviewBar,#v3PreviewBar,[data-preview-bar]'))continue;if(!n.getClientRects().length)continue;const cs=getComputedStyle(n);if(cs.visibility!=='visible'||+cs.opacity===0)continue;
  look(n,cs,'');if(n.tagName==='DIALOG'&&n.open){const bd=getComputedStyle(n,'::backdrop');for(const c of rgb(bd.backgroundColor))if(want.has(c))hits.push([name(n)+'::backdrop','background-color',c]);}
  for(const ps of ['::before','::after']){const c2=getComputedStyle(n,ps);if(c2.content&&c2.content!=='none'&&c2.display!=='none')look(n,c2,ps);}}
 return hits;}'''

FOCUS_SCAN='''greens=>{const want=new Set(greens.map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',')));const n=document.activeElement;if(!n||n===document.body)return [];
 const cs=getComputedStyle(n),vals=[cs.outlineStyle!=='none'?cs.outlineColor:'',cs.boxShadow,cs.borderTopColor,cs.color,cs.backgroundColor];
 const hit=vals.flatMap(v=>[...(v||'').matchAll(/rgba?\\(([\\d.]+),\\s*([\\d.]+),\\s*([\\d.]+)/g)].map(m=>[m[1],m[2],m[3]].map(Math.round).join(','))).filter(c=>want.has(c));
 return hit.length?[[n.tagName+'.'+(n.className&&n.className.baseVal===undefined?n.className:''),'focus',hit[0]]]:[];}'''

async def tab_scan(p,steps=14):
 hits=[]
 for _ in range(steps):
  await p.keyboard.press('Tab');hits+=await p.evaluate(FOCUS_SCAN,V2_GREENS)
 return hits

async def green_screens(p,touch):
 """Visit the V3 screens and dialogs; per screen the elements still painted in a V2 green."""
 scan=lambda:p.evaluate(GREEN_SCAN,V2_GREENS);out={}
 blur='()=>{document.activeElement?.blur?.()}'
 out['reis']=await scan()
 await act(p,'.v3SchoolBtn',touch);out['schoolblad']=await scan()
 b=p.locator('#schoolbladDialog button').filter(visible=True)
 out['schoolblad-focus']=await tab_scan(p,6)
 await p.keyboard.press('Escape');await p.wait_for_timeout(300)
 await act(p,'[data-nav=instellingen]',touch);out['instellingen']=await scan()
 out['instellingen-focus']=await tab_scan(p,12)
 await p.keyboard.press('Escape');await p.wait_for_timeout(300)
 await q.goto(p,'oefenen');out['oefenen']=await scan()
 await p.evaluate('TOPO_V3.shell.practice("point","city1")');await p.wait_for_timeout(900);out['les']=await scan();out['les-focus']=await tab_scan(p,10)
 wrong=await p.evaluate('()=>[...document.querySelectorAll("#map [data-id][tabindex=\\"0\\"]")].map(n=>n.dataset.id).find(id=>id!==state.current.id&&id.startsWith("city"))')
 await p.locator('#map [data-id="'+wrong+'"][tabindex="0"]').first.press('Enter');await p.wait_for_timeout(500);out['les-fout']=await scan()
 await p.evaluate('document.querySelector("#next")?.click()');await p.wait_for_timeout(500)
 await p.locator('#map [data-id="'+await p.evaluate('state.current.id')+'"][tabindex="0"]').first.press('Enter');await p.wait_for_timeout(500);out['les-goed']=await scan()
 await p.evaluate('TOPO_V3.shell.practice("write","city1")');await p.wait_for_timeout(900)
 await p.locator('#answer').fill(await p.evaluate('state.current.name'));await p.locator('#answer').press('Enter');await p.wait_for_timeout(500);out['les-schrijf']=await scan()
 await p.evaluate('()=>{document.activeElement?.blur?.();openMapPicker(ITEMS.filter(i=>["city-6","area-e"].includes(i.id)))}');await p.wait_for_timeout(600);out['keuzevenster']=await scan()
 out['keuzevenster-focus']=await tab_scan(p,5)
 await p.keyboard.press('Escape');await p.wait_for_timeout(300)
 await p.goto('about:blank');await p.goto(q.HTML.as_uri()+'#alles/bg03');await p.wait_for_timeout(800)
 await q.goto(p,'rewards');out['beloningen']=await scan()
 await act(p,'.v3BookCover',touch);out['boek']=await scan();await p.keyboard.press('Escape');await p.wait_for_timeout(300)
 await q.goto(p,'voortgang');out['voortgang']=await scan()
 await q.goto(p,'toets');out['toets']=await scan()
 await q.play_toets(p);out['toetsResult']=await scan()
 await p.goto('about:blank');await p.goto(q.HTML.as_uri()+'#welkom/bg03');await p.wait_for_timeout(900);out['kennismaking']=await scan()
 return out

# Point 7: lifestyle icons on Reis (painted boxes) against pins, marks, labels and landmarks.
LIFESTYLE='''()=>{const svg=document.querySelector('.v3MapStage .v3Map'),A=TOPO_V3.art,boxes=[];
 const paint=(g,e)=>{const img=g.querySelector('image'),x=e.exports[img.dataset.exportSize],r=img.getBoundingClientRect(),s=r.width/x.size[0],[l,t,rr,b]=x.paintBounds;
  return {left:r.left+l*s,top:r.top+t*s,right:r.left+rr*s,bottom:r.top+b*s};};
 const ls=[...svg.querySelectorAll('.v3Lifestyle>g')].map(g=>({id:g.dataset.lifestyle,place:g.dataset.place,transform:g.getAttribute('transform'),shift:g.dataset.shift||'',box:paint(g,A.lifestyle.items.find(i=>i.id===g.dataset.lifestyle))}));
 const lm=[...svg.querySelectorAll('.v3Landmarks>g')].map(g=>paint(g,A.landmarks.items.find(i=>i.id===g.dataset.landmark)));
 const ob=[...svg.querySelectorAll('.v3Pin,.v3Mark>circle,.v3MarkName')].map(n=>n.getBoundingClientRect()).concat(lm);
 const over=(a,b)=>a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;
 const overlaps=ls.filter((x,i)=>ob.some(o=>over(x.box,o))||ls.some((y,j)=>j!==i&&over(x.box,y.box))).map(x=>x.id);
 const order=[...svg.children].map(n=>n.getAttribute('class')||'');
 return {items:ls.map(x=>[x.id,x.place]),placement:ls.map(x=>x.transform+x.shift),sizes:ls.map(x=>Math.round(Math.max(x.box.right-x.box.left,x.box.bottom-x.box.top)*10)/10),overlaps,
  below:order.indexOf('v3Lifestyle')<Math.min(...['v3Pins','v3Marks'].map(c=>order.indexOf(c)).filter(i=>i>=0))};}'''
VISIBLE_LIFESTYLE='()=>[...document.querySelectorAll("[data-lifestyle]")].filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility==="visible").map(n=>n.dataset.lifestyle)'

async def toets(pg,skips):
 """The V2 exam through the V3 setup (city2, 10 questions); skips at the given question numbers."""
 await pg.evaluate('TOPO_V3.shell.go("toets")');await pg.wait_for_timeout(300)
 await pg.locator('[aria-labelledby=v3ToetsHoofdstukken] [data-group=city2]').click();await pg.wait_for_timeout(200)
 await pg.locator('[aria-labelledby=v3ToetsLengte] [data-value="10"]').click();await pg.wait_for_timeout(200)
 await pg.locator('.v3View-toets .v3Start').click();await pg.wait_for_timeout(800)
 during=[]
 for n in range(10):
  during+=await pg.evaluate(VISIBLE_LIFESTYLE)
  q2=await pg.evaluate('state.current.id');mode=await pg.evaluate('state.questionMode')
  if n in skips:
   await pg.evaluate('document.querySelector("#next").click()');await pg.wait_for_timeout(250)
   await pg.evaluate('document.querySelector("#next").click()');await pg.wait_for_timeout(300);continue
  if mode=='point':await pg.locator(f'#map [data-id="{q2}"][tabindex="0"]').first.press('Enter')
  else:await pg.locator('#answer').fill(await pg.evaluate('state.current.name'));await pg.locator('#answer').press('Enter')
  await pg.wait_for_timeout(200);await pg.evaluate('document.querySelector("#next").click()');await pg.wait_for_timeout(300)
 await pg.wait_for_timeout(900)
 return during

# Point 8: the relief before (the previous chain: contrast 1.3, then warmRelief's saturate .65 and warm shift; no sun or gloss)
# and after, measured on the Italy crop of Reis (pins, landmarks and lifestyle hidden).
OLD_RELIEF='''()=>{const svg=document.querySelector('.v3MapStage .v3Map'),f=svg.querySelector('filter[id$=reliefDepth]');svg._qaNew=f.innerHTML;
 f.innerHTML='<feComponentTransfer><feFuncR type="linear" slope="1.3" intercept="-.15"/><feFuncG type="linear" slope="1.3" intercept="-.15"/><feFuncB type="linear" slope="1.3" intercept="-.15"/></feComponentTransfer><feColorMatrix type="saturate" values=".65"/><feComponentTransfer><feFuncR type="linear" slope="1.08" intercept=".035"/><feFuncG type="linear" slope="1" intercept=".015"/><feFuncB type="linear" slope=".88" intercept=".025"/></feComponentTransfer>';
 svg.querySelector('.v3Sun').style.display='none';svg.querySelector('.v3RCoast').style.filter='none';}'''
NEW_RELIEF='''()=>{const svg=document.querySelector('.v3MapStage .v3Map');svg.querySelector('filter[id$=reliefDepth]').innerHTML=svg._qaNew;svg.querySelector('.v3Sun').style.display='';svg.querySelector('.v3RCoast').style.filter='';}'''
def relief_stats(png):
 import numpy as np
 im=Image.open(io.BytesIO(png)).convert('RGB');a=np.asarray(im.convert('HSV'),dtype=float)/255;g=np.asarray(im.convert('L'),dtype=float)
 land=(a[...,1]>.2)&(a[...,0]>.1)&(a[...,0]<.35)
 lap=np.abs(4*g[1:-1,1:-1]-g[:-2,1:-1]-g[2:,1:-1]-g[1:-1,:-2]-g[1:-1,2:])[land[1:-1,1:-1]]
 return {'satMean':round(float(a[...,1][land].mean()),3),'satP99':round(float(np.percentile(a[...,1][land],99)),3),'valP99':round(float(np.percentile(a[...,2][land],99)),3),'localContrast':round(float(lap.mean()),2)}

async def act(p,selector,touch=False):
 n=p.locator(selector).filter(visible=True).first
 await (n.tap(timeout=2500) if touch else n.click(timeout=2500))
 await p.wait_for_timeout(300)

async def check(p,n,touch,vp):
 shots=[]
 if n==1:
  ids=await p.evaluate('ROUTE_CHAPTERS.map(c=>c.id)');out={}
  for st in ('bezig','alles'):
   await p.goto(q.HTML.as_uri()+'#'+st+'/bg03');await p.wait_for_timeout(700)
   rows=[await p.evaluate(FRAME,i) for i in ids]
   it=[r for r in rows if r['frame']=='italy'];om=[r for r in rows if r['frame']=='omgeving']
   assert sorted(r['id'] for r in om)==['countries','seas'],rows
   # One scale: every Italy chapter has the same viewBox, and so do the two context chapters.
   assert len({r['viewBox'] for r in it})==1 and len({r['viewBox'] for r in om})==1,rows
   assert all(r['clearOfCard'] and r['inStage'] for r in it),rows
   # As large as possible: Italy (4 % margin) fills the free height above the tallest card, or the stage's width.
   r0=it[0];assert r0['italyH']>=.9*r0['freeH'] or r0['italyW']>=.9*r0['stageW'],r0
   assert om[0]['italyH']<it[0]['italyH'],(om[0],it[0])
   out[st]={'italy':it[0],'omgeving':om[0]}
  # The glide: mid-way between the frames the viewBox is in between; with reduced motion the switch is immediate.
  await p.goto(q.HTML.as_uri()+'#bezig/bg03');await p.wait_for_timeout(700)
  await p.evaluate(FRAME,'city1')
  mid=await p.evaluate('async()=>{TOPO_V3.ui.selected="countries";TOPO_V3.render();await new Promise(r=>setTimeout(r,200));const s=document.querySelector(".v3MapStage .v3Map");return [s.dataset.gliding||"",s.getAttribute("viewBox")]}')
  assert mid[0]=='1' and mid[1] not in (out['bezig']['italy']['viewBox'],out['bezig']['omgeving']['viewBox']),mid
  await p.emulate_media(reduced_motion='reduce')
  now=await p.evaluate('()=>{TOPO_V3.ui.selected="city2";TOPO_V3.render();const s=document.querySelector(".v3MapStage .v3Map");return [s.dataset.gliding||"",s.getAttribute("viewBox")]}')
  assert now==['',out['bezig']['italy']['viewBox']],now
  await p.emulate_media(reduced_motion='no-preference')
  await p.evaluate(FRAME,'volcanoes');await p.evaluate('document.activeElement?.blur?.()');await p.mouse.move(1,1);await p.wait_for_timeout(300)
  await p.screenshot(path=str(OUT/f'reis-{vp}.png'));shots.append('reis')
  await p.evaluate(FRAME,'countries');await p.mouse.move(1,1);await p.wait_for_timeout(300)
  await p.screenshot(path=str(OUT/f'reis-omgeving-{vp}.png'));shots.append('reis-omgeving')
  return shots,out
 if n==2:
  loc=json.loads((ROOT/'assets/v3/landmarks/locations.json').read_text());out={}
  for cid,items in await p.evaluate('ROUTE_CHAPTERS.map(c=>[c.id,c.itemIds])'):
   await p.evaluate(FRAME,cid)
   r=await p.evaluate(LANDMARKS)
   want={k for k,v in loc['items'].items() if set(v.get('relevantItems',[]))&set(items)}
   kind='chapter' if want else 'basis';want=want or set(loc['relevance']['basisSet'])
   assert set(r['ids'])==want and r['set']==kind and not r['overlaps'],(cid,r,want)
   assert kind=='chapter' or len(want)<=4
   out[cid]={'landmarks':sorted(r['ids']),'set':kind}
  await p.evaluate(FRAME,'volcanoes');await p.evaluate('document.activeElement?.blur?.()');await p.mouse.move(1,1);await p.wait_for_timeout(300)
  await p.screenshot(path=str(OUT/f'reis-{vp}.png'));shots.append('reis')
  # Toets resultaat (no chapter) keeps all ten.
  await q.play_toets(p)
  assert await p.evaluate('document.querySelectorAll(".v3ToetsMap .v3Landmarks>g").length')==10
  return shots,out
 if n==3:
  await p.goto(q.HTML.as_uri()+'#alles/bg03');await p.wait_for_timeout(700)
  await q.goto(p,'rewards');await act(p,'.v3BookCover',touch)
  while not await p.locator('.bookFooter button').first.is_disabled():await p.locator('.bookFooter button').first.click()
  await p.wait_for_timeout(400)
  plates=await p.evaluate(PLATES)
  assert not plates,plates
  texts=await p.evaluate(TEXTS)
  assert len(texts)>=8,texts
  await p.evaluate('document.querySelectorAll("#travelBook .bookSpread .folioWriting").forEach(n=>n.style.setProperty("color","transparent","important"));document.head.insertAdjacentHTML("beforeend","<style id=qaHide>#travelBook .bookSpread .folioWriting *{color:transparent!important;text-shadow:none!important}</style>")')
  await p.wait_for_timeout(150);bg=await p.screenshot()
  await p.evaluate('document.getElementById("qaHide").remove();document.querySelectorAll("#travelBook .bookSpread .folioWriting").forEach(n=>n.style.removeProperty("color"))')
  im=Image.open(io.BytesIO(bg)).convert('RGB');fails=[];low=99
  for t in texts:
   fg=q.lum(q.parse_rgb(t['color']));x,y,w,h=t['box']
   crop=im.crop((int(x),int(y),int(x+w)+1,int(y+h)+1))
   cs=sorted((max(fg,L)+.05)/(min(fg,L)+.05) for L in (q.lum(px) for px in crop.getdata()))
   c=cs[int(len(cs)*.05)];low=min(low,c)
   large=t['size']>=24 or (t['size']>=18.66 and t['weight']>=700)
   if c<(3 if large else 4.5):fails.append({'text':t['t'],'contrast':round(c,2),'size':t['size']})
  assert not fails,fails
  await p.evaluate('document.activeElement?.blur?.()');await p.mouse.move(1,1);await p.wait_for_timeout(200)
  await p.screenshot(path=str(OUT/f'boek-p1-2-{vp}.png'));shots.append('boek-p1-2')
  return shots,{'texts':len(texts),'lowestContrast':round(low,2)}
 if n==4:
  out={}
  for st in ('alles','bezig'):
   await p.goto(q.HTML.as_uri()+'#'+st+'/bg03');await p.wait_for_timeout(700)
   await q.goto(p,'voortgang');await p.wait_for_timeout(500)
   r=await p.evaluate(VOORTGANG);out[st]=r
   # No large flat violet: every filled shape with the accent colour is a tint (≤ 0.25) or small (a pin).
   assert not r['flat'],r
   assert r['relief'] and (st!='alles' or r['outlined']>0),r
   if st=='alles':
    assert r['count']=='45 / 45' and r['gold'] and r['cheer']=='NINO-JUICHT' and r['caption'].startswith('45 / 45'),r
    await p.evaluate('document.activeElement?.blur?.()');await p.mouse.move(1,1);await p.wait_for_timeout(200)
    await p.screenshot(path=str(OUT/f'voortgang-alles-{vp}.png'));shots.append('voortgang-alles')
   else:
    assert not r['gold'] and not r['cheer'],r
  return shots,out
 if n==5:
  out=await green_screens(p,touch)
  hits={k:v for k,v in out.items() if v}
  for k,v in hits.items():print(vp,k,len(v),v[:6])
  assert not hits,list(hits)
  await p.goto('about:blank');await p.goto(q.HTML.as_uri()+'#bezig/bg03');await p.wait_for_timeout(800)
  await act(p,'.v3SchoolBtn',touch);await p.mouse.move(1,1);await p.wait_for_timeout(200)
  await p.screenshot(path=str(OUT/f'schoolblad-{vp}.png'));shots.append('schoolblad')
  await p.keyboard.press('Escape');await p.wait_for_timeout(300)
  await act(p,'[data-nav=instellingen]',touch);await p.mouse.move(1,1);await p.wait_for_timeout(200)
  await p.screenshot(path=str(OUT/f'instellingen-{vp}.png'));shots.append('instellingen')
  return shots,{'screens':sorted(out),'v2Greens':V2_GREENS,'v2GreenCount':len(V2_GREENS),'hits':0}
 if n==6:
  out={}
  ride='''()=>{const r=document.querySelector('.vespaRide'),n=r.querySelector('.rideNino'),cs=getComputedStyle(n);
   return {open:r.open,phase:r.dataset.phase||'',master:n.dataset.v3Master||'',rijdend:n.src===TOPO_V3.art.poses['VESPA-RIJDEND'].src,anim:cs.animationName,visible:cs.display!=='none'};}'''
  await p.evaluate('celebrateTrip("Rome","Napels")');await p.wait_for_timeout(300)
  r=await p.evaluate(ride);out['depart']=r
  g=await p.evaluate(GREEN_SCAN,V2_GREENS);assert not g,g
  assert r['open'] and r['phase']=='depart' and r['rijdend'] and r['master']=='VESPA-RIJDEND' and r['anim']=='v3Engine' and r['visible'],r
  await p.wait_for_timeout(900);r=await p.evaluate(ride);out['ride']=r
  assert r['phase']=='ride' and r['rijdend'] and r['anim']=='v3RideOut',r
  await p.mouse.move(1,1);await p.screenshot(path=str(OUT/f'vespa-rit-{vp}.png'));shots.append('vespa-rit')
  await p.wait_for_timeout(1800);r=await p.evaluate(ride);out['arrived']=r
  assert r['phase']=='arrived',r
  await p.keyboard.press('Escape');await p.wait_for_timeout(300)
  # Reduced motion: straight to the arrival, no shake or ride-out.
  await p.emulate_media(reduced_motion='reduce')
  await p.evaluate('celebrateTrip("Napels","Palermo")');await p.wait_for_timeout(300)
  r=await p.evaluate(ride);out['reducedMotion']=r
  assert r['phase']=='arrived' and r['anim']=='none',r
  await p.keyboard.press('Escape');await p.emulate_media(reduced_motion='no-preference')
  return shots,out
 if n==7:
  loc=json.loads((ROOT/'assets/v3/landmarks/locations.json').read_text())['lifestyle']['chapters'];out={};target=28 if vp!='desktop' else 32
  lm_target=34 if vp!='desktop' else 40
  for cid in await p.evaluate('ROUTE_CHAPTERS.map(c=>c.id)'):
   await p.evaluate(FRAME,cid);r=await p.evaluate(LIFESTYLE)
   assert r['items']==[list(x) for x in loc[cid]] and 1<=len(r['items'])<=2,(cid,r)
   assert not r['overlaps'] and r['below'],(cid,r)
   assert all(abs(z-target)<=1.5 and z<lm_target for z in r['sizes']),(cid,r)
   out[cid]=r
  # Stable: the same placement on a second visit.
  for cid in ('city4','rivers'):
   await p.evaluate(FRAME,cid);assert (await p.evaluate(LIFESTYLE))['placement']==out[cid]['placement'],cid
  fiat={tuple(x) for c in loc.values() for x in c if x[0]=='TOPO_16'};fiat_ch=[c for c,v in loc.items() if any(x[0]=='TOPO_16' for x in v)]
  assert len(fiat_ch)>=4 and {'turijn','rome','kust-napels','toscane'}<= {pl for _,pl in fiat},(fiat_ch,fiat)
  await p.evaluate(FRAME,'city4');await p.evaluate('document.activeElement?.blur?.()');await p.mouse.move(1,1);await p.wait_for_timeout(250)
  await p.screenshot(path=str(OUT/f'reis-lifestyle-{vp}.png'));shots.append('reis-lifestyle')
  # Never in the lesson or the picker.
  await p.evaluate('TOPO_V3.shell.practice("point","city1")');await p.wait_for_timeout(900)
  assert not await p.evaluate(VISIBLE_LIFESTYLE),'lesson'
  await p.evaluate('()=>{openMapPicker(ITEMS.filter(i=>["city-6","area-e"].includes(i.id)))}');await p.wait_for_timeout(500)
  assert not await p.evaluate(VISIBLE_LIFESTYLE),'picker'
  await p.keyboard.press('Escape');await p.wait_for_timeout(300)
  # Toets: nothing during the questions; 7/10 no gelato; ≥ 8/10 one gelato by the score, never on the result map.
  during=await toets(p,(2,5,8));assert not during,during
  assert await p.locator('.v3ToetsScore').inner_text()=='7 / 10' and not await p.evaluate(VISIBLE_LIFESTYLE)
  await p.goto('about:blank');await p.goto(q.HTML.as_uri()+'#bezig/bg03');await p.wait_for_timeout(700)
  during=await toets(p,(4,));assert not during,during
  assert await p.locator('.v3ToetsScore').inner_text()=='9 / 10',await p.locator('.v3ToetsScore').inner_text()
  vis=await p.evaluate(VISIBLE_LIFESTYLE);assert vis==['TOPO_13'],vis
  assert await p.locator('.v3ToetsMap [data-lifestyle]').count()==0
  await p.evaluate('document.activeElement?.blur?.()');await p.mouse.move(1,1);await p.wait_for_timeout(250)
  await p.screenshot(path=str(OUT/f'toetsResult-goed-{vp}.png'));shots.append('toetsResult-goed')
  # Voortgang 45 / 45: the Fiat by Nino, once.
  await p.goto('about:blank');await p.goto(q.HTML.as_uri()+'#alles/bg03');await p.wait_for_timeout(700)
  await q.goto(p,'voortgang');await p.wait_for_timeout(400)
  vis=await p.evaluate(VISIBLE_LIFESTYLE);assert vis==['TOPO_16'],vis
  await p.evaluate('document.activeElement?.blur?.()');await p.mouse.move(1,1);await p.wait_for_timeout(200)
  await p.screenshot(path=str(OUT/f'voortgang-alles-{vp}.png'));shots.append('voortgang-alles')
  # Gouden proef: never (the gold run of a finished chapter).
  await act(p,'[data-nav=reis]',touch);await p.wait_for_timeout(400);await p.evaluate(FRAME,'city1')
  gold=p.locator('.v3Reis .v3Panel .v3Btn.primary').filter(has_text='goud')
  if await gold.count():
   await gold.first.click();await p.wait_for_timeout(1000)
   assert not await p.evaluate(VISIBLE_LIFESTYLE),'gold';out['goldChecked']=True
  # Vespa ride: the Fiat passes behind Nino; with reduced motion it stands still.
  await p.goto('about:blank');await p.goto(q.HTML.as_uri()+'#bezig/bg03');await p.wait_for_timeout(700)
  await p.evaluate('celebrateTrip("Rome","Napels")');await p.wait_for_timeout(1300)
  f=await p.evaluate('()=>{const f=document.querySelector(".vespaRide .v3RideFiat");return [getComputedStyle(f).animationName,f.compareDocumentPosition(document.querySelector(".vespaRide .rideNino"))&Node.DOCUMENT_POSITION_FOLLOWING]}')
  assert f[0]=='v3FiatPast' and f[1],f
  vis=await p.evaluate('()=>[...document.querySelectorAll(".vespaRide [data-lifestyle]")].filter(n=>n.getClientRects().length).map(n=>n.dataset.lifestyle)');assert vis==['TOPO_16'],vis
  await p.mouse.move(1,1);await p.screenshot(path=str(OUT/f'vespa-rit-{vp}.png'));shots.append('vespa-rit')
  await p.keyboard.press('Escape');await p.wait_for_timeout(300)
  await p.emulate_media(reduced_motion='reduce')
  await p.evaluate('celebrateTrip("Napels","Palermo")');await p.wait_for_timeout(300)
  assert await p.evaluate('getComputedStyle(document.querySelector(".vespaRide .v3RideFiat")).animationName')=='none'
  await p.keyboard.press('Escape');await p.emulate_media(reduced_motion='no-preference')
  return shots,{k:{'items':v['items'],'sizes':v['sizes']} for k,v in out.items() if isinstance(v,dict)}|{'goldChecked':out.get('goldChecked',False)}
 if n==8:
  geometry='() => [...document.querySelectorAll("#map [data-id]")].map(n=>[n.dataset.id,n.getAttribute("d"),n.getAttribute("cx"),n.getAttribute("cy")])'
  before_geo=await p.evaluate(geometry)
  await p.evaluate(FRAME,'city2')
  # Same rasters (terrain, coast, sea, shadow) as their provenance; the snow is part of the terrain raster.
  hrefs=await p.evaluate('()=>{const s=document.querySelector(".v3MapStage .v3Map");return {terrain:s.querySelector(".atlasTerrain image").getAttribute("href"),...Object.fromEntries(["Coast","Sea","Shadow"].map(k=>[k.toLowerCase(),s.querySelector(".v3R"+k).getAttribute("href")]))}}')
  assert hrefs==await p.evaluate('({terrain:TOPO_V3_RELIEF.terrain,coast:TOPO_V3_RELIEF.coast,sea:TOPO_V3_RELIEF.sea,shadow:TOPO_V3_RELIEF.shadow})')
  chain=await p.evaluate('()=>{const s=document.querySelector(".v3MapStage .v3Map"),t=s.querySelector(".atlasTerrain"),sun=s.querySelector(".v3Sun");return {filter:t.getAttribute("filter"),sat:s.querySelector("filter[id$=reliefDepth] feColorMatrix")?.getAttribute("values"),warm:!!s.querySelector("filter[id$=warmRelief]"),sun:!!sun&&getComputedStyle(sun).mixBlendMode==="soft-light"&&getComputedStyle(sun).display!=="none"&&sun.getAttribute("clip-path")==="url(#v3m-italyClip)"}}')
  assert chain=={'filter':'url(#v3m-reliefDepth)','sat':'1.15','warm':False,'sun':True},chain
  await p.evaluate('document.querySelectorAll(".v3MapStage .v3Map :is(.v3Pins,.v3Landmarks,.v3Lifestyle)").forEach(n=>n.style.display="none")');await p.mouse.move(1,1)
  box=await p.evaluate('(()=>{const b=document.querySelector(".v3MapStage .v3Map .italy").getBoundingClientRect();return {x:b.left-10,y:b.top-10,width:b.width+20,height:b.height+20}})()')
  await p.evaluate(OLD_RELIEF);await p.wait_for_timeout(250);old=await p.screenshot(clip=box)
  await p.evaluate(NEW_RELIEF);await p.wait_for_timeout(250);new=await p.screenshot(clip=box)
  so,sn=relief_stats(old),relief_stats(new)
  # Livelier and more saturated, highlights lifted, never neon.
  assert sn['satMean']>=so['satMean']+.08 and sn['localContrast']>=1.2*so['localContrast'] and sn['valP99']>=so['valP99'] and sn['satP99']<=.75,(so,sn)
  assert await p.evaluate(geometry)==before_geo
  a,b2=Image.open(io.BytesIO(old)).convert('RGB'),Image.open(io.BytesIO(new)).convert('RGB')
  r=Image.open(ROOT/'docs/v3/renders/R-reis-ijk.webp').convert('RGB').crop((820,80,1400,770));h=max(a.height,b2.height);r=r.resize((round(r.width*h/r.height),h))
  c=Image.new('RGB',(a.width+b2.width+r.width+48,h+16),(246,244,250));x=8
  for im in (a,b2,r):c.paste(im,(x,8));x+=im.width+16
  c.save(OUT/f'relief-vergelijking-{vp}.png');shots.append('relief-vergelijking (voor | na | R-reis-ijk)')
  await p.evaluate('document.querySelectorAll(".v3MapStage .v3Map :is(.v3Pins,.v3Landmarks,.v3Lifestyle)").forEach(n=>n.style.display="")')
  await p.screenshot(path=str(OUT/f'reis-{vp}.png'));shots.append('reis')
  return shots,{'before':so,'after':sn}
 if n==9:
  # V2 has no moment for a new postcard (only stamps and gold, nino-moments.js); V3 adds one with V2's rule.
  card='.v3Post .v3PostCard';dot='[data-nav=rewards] .v3PostDot'
  earn='()=>{state.trips=2;persist();state.trips=3;persist();}'
  async def visible_dot():return await p.evaluate('()=>[...document.querySelectorAll("'+dot+'")].some(n=>n.closest("[data-nav]").checkVisibility())')
  await act(p,'[data-nav=reis]',touch);await p.mouse.move(1,1)
  start=await p.evaluate('()=>({earned:TOPO_V3.post.earned(),seen:TOPO_V3.post.seen()})')
  # Earlier progress is not celebrated and has no dot.
  assert sorted(start['earned'])==sorted(start['seen']) and not await p.locator(card).count() and not await visible_dot(),start
  # Earning Venetië (the 3rd ride, V2's rule): the glass card with that postcard, announced politely, and the dot.
  await p.evaluate(earn);await p.wait_for_timeout(120)
  info=await p.evaluate('()=>{const c=document.querySelector("'+card+'"),i=c.querySelector("img");return {text:c.innerText,live:c.parentElement.getAttribute("aria-live"),src:i.src===NINO_V2_ART.venezia.src,post:c.dataset.post,bg:getComputedStyle(c).backdropFilter,anim:c.getAnimations().length}}')
  assert info['text'].startswith('Post voor jou!') and info['live']=='polite' and info['src'] and info['post']=='venezia' and 'blur' in info['bg'] and info['anim']==1,info
  assert await visible_dot()
  await p.screenshot(path=str(OUT/f'post-{vp}.png'));shots.append('post (kaart + stip)')
  # After 4 s it slides into the Reisboekje (towards Beloningen) and is gone; the dot stays until the postcard is seen.
  await p.wait_for_timeout(3000);assert await p.locator(card).count()
  await p.wait_for_timeout(700);assert await p.evaluate('document.querySelector("'+card+'")?.dataset.leaving')=='1'
  await p.wait_for_timeout(800);assert not await p.locator(card).count() and await visible_dot()
  # A tap opens the book on the postcard page; seen, so the dot goes.
  await p.evaluate(earn);await p.wait_for_timeout(500)
  await act(p,card,touch);await p.wait_for_timeout(500)
  shown=await p.evaluate('[...document.querySelectorAll("#travelBook section.bookPage")].map(s=>s.getAttribute("aria-label"))')
  assert 'Venetië, je derde Vespa-rit' in shown and await p.evaluate('TopoBook.element.open'),shown
  await p.mouse.move(1,1);await p.screenshot(path=str(OUT/f'post-boek-{vp}.png'));shots.append('post-boek (postkaartpagina)')
  await p.keyboard.press('Escape');await p.wait_for_timeout(300)
  assert not await visible_dot() and 'venezia' in await p.evaluate('TOPO_V3.post.seen()')
  # Reduced motion: no animation in or out.
  await p.emulate_media(reduced_motion='reduce')
  await p.evaluate(earn);await p.wait_for_timeout(400)
  assert await p.evaluate('document.querySelector("'+card+'").getAnimations().length')==0
  await p.wait_for_timeout(4100);assert not await p.locator(card).count()
  await p.emulate_media(reduced_motion='no-preference')
  # Never during the toets: it waits until the toets is over.
  await p.evaluate('TOPO_V3.shell.go("toets")');await p.wait_for_timeout(300)
  await p.locator('[aria-labelledby=v3ToetsHoofdstukken] [data-group=city2]').click();await p.wait_for_timeout(200)
  await p.locator('[aria-labelledby=v3ToetsLengte] [data-value="10"]').click();await p.wait_for_timeout(200)
  await p.locator('.v3View-toets .v3Start').click();await p.wait_for_timeout(800)
  await p.evaluate(earn)
  for k in range(10):
   assert not await p.locator(card).count(),('toets',k)
   await p.evaluate('document.querySelector("#next").click()');await p.wait_for_timeout(200)
   await p.evaluate('document.querySelector("#next").click()');await p.wait_for_timeout(250)
  await p.wait_for_timeout(1500)
  assert await p.evaluate('state.examEnded') and await p.locator(card).count(),'after toets'
  await p.wait_for_timeout(4600)
  # Never during the Gouden proef (a finished chapter's gold run), until the child leaves it.
  goldChecked=False
  await act(p,'[data-nav=reis]',touch);await p.wait_for_timeout(400)
  for cid in await p.evaluate('ROUTE_CHAPTERS.map(c=>c.id)'):
   await p.evaluate(FRAME,cid)
   gold=p.locator('.v3Reis .v3Panel .v3Btn').filter(has_text='oud')
   if not await gold.count():continue
   await gold.first.click();await p.wait_for_timeout(1000)
   if await p.evaluate('state.route?.active?.kind')!='gold':continue
   await p.evaluate(earn);await p.wait_for_timeout(1500)
   assert not await p.locator(card).count(),'gold'
   await act(p,'[data-nav=reis]',touch);await p.wait_for_timeout(1200)
   assert await p.locator(card).count(),'after gold';goldChecked=True;break
  assert goldChecked
  return shots,{'start':start,'card':info,'goldChecked':goldChecked}
 raise SystemExit('unknown point')

async def main(point):
 initial=hashlib.sha256(q.HTML.read_bytes()).hexdigest();runs={}
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path=q.MAC_CHROME)
  for vp,(w,h) in VIEWPORTS.items():
   c=await b.new_context(viewport={'width':w,'height':h},has_touch=vp!='desktop');p=await c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   await (await c.new_cdp_session(p)).send('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-transparency','value':'no-preference'}]})
   await p.goto(q.HTML.as_uri()+'#bezig/bg03');await p.wait_for_timeout(650)
   try:shots,detail=await check(p,point,vp!='desktop',vp)
   except Exception:
    print('Point',point,'failed at viewport',vp,flush=True)
    raise
   assert not errors,errors
   runs[vp]={'viewport':[w,h],'screens':shots,'detail':detail};await c.close()
  await b.close()
 assert initial==hashlib.sha256(q.HTML.read_bytes()).hexdigest()
 path=OUT/'ronde5.json';data=json.loads(path.read_text()) if path.exists() else {};data[str(point)]={'previewSha256':initial,'runs':runs,'pass':True};path.write_text(json.dumps(data,indent=2)+'\n')
 print('Ronde 5 punt',point,'PASS',flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--point',type=int,choices=range(1,10));args=parser.parse_args()
 # Without --point (qa-v3-all.py): every point in order, so the last screenshots are those of the latest point.
 for n in ([args.point] if args.point else range(1,10)):asyncio.run(main(n))
