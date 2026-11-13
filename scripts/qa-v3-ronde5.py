#!/usr/bin/env python3
"""Targeted Round 5 screen checks (docs/v3/OVERDRACHT.md › Ronde 5); desktop 1440×900 and iPad 1080×810,
overwriting the final evidence screenshots. One point per run: --point N."""
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
   want={k for k,v in loc['items'].items() if set(v['relevantItems'])&set(items)}
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
 parser=argparse.ArgumentParser();parser.add_argument('--point',type=int,choices=range(1,10),required=True);args=parser.parse_args()
 asyncio.run(main(args.point))
