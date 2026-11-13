#!/usr/bin/env python3
"""Targeted Round 5 screen checks (docs/v3/OVERDRACHT.md › Ronde 5); desktop 1440×900 and iPad 1080×810,
overwriting the final evidence screenshots. One point per run: --point N."""
import argparse,asyncio,hashlib,importlib.util,json,pathlib
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
