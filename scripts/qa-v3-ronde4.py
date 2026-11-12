#!/usr/bin/env python3
"""Targeted Round 4 screen checks (landmarks, kennismaking, keuzevenster); desktop 1440×900 and iPad 1080×810,
overwriting the final evidence screenshots."""
import argparse,asyncio,hashlib,importlib.util,json,pathlib
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'docs/qa/v3-stijlbeeld/final'
spec=importlib.util.spec_from_file_location('screen',ROOT/'scripts/qa-v3-afwerking.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
q.HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
VIEWPORTS={'desktop':(1440,900),'ipad-liggend':(1080,810)}

# Painted landmark boxes (screen px) and every pin / mark / mistake label; overlaps and the median painted height.
LANDMARKS='''map=>{
 const svg=document.querySelector(map),items=TOPO_V3.art.landmarks.items,boxes=[];
 for(const g of svg.querySelectorAll('.v3Landmarks>g')){const a=items.find(i=>i.id===g.dataset.landmark),img=g.querySelector('image'),e=a.exports[img.dataset.exportSize];
  const r=img.getBoundingClientRect(),s=r.width/e.size[0],[l,t,rr,b]=e.paintBounds;boxes.push({id:a.id,x0:r.left+l*s,y0:r.top+t*s,x1:r.left+rr*s,y1:r.top+b*s,
  anchored:g.getAttribute('transform').startsWith('translate('+a.point[0]+' '+a.point[1]+')')});}
 const obst=[...svg.querySelectorAll('.v3Pin,.v3Mark>circle,.v3MarkName')].map(n=>n.getBoundingClientRect());
 const overlaps=[];for(const b of boxes)for(const o of obst)if(b.x0<o.right&&o.left<b.x1&&b.y0<o.bottom&&o.top<b.y1)overlaps.push(b.id);
 const h=boxes.map(b=>b.y1-b.y0).sort((a,b)=>a-b),median=(h[(h.length-1)>>1]+h[h.length>>1])/2;
 const lm=svg.querySelector(':scope>.v3Landmarks'),top=svg.querySelector(':scope>.v3Pins,:scope>.v3Marks');
 return {count:boxes.length,anchored:boxes.every(b=>b.anchored),overlaps,median:Math.round(median*10)/10,obstacles:obst.length,
  pinAbove:!top||!!(lm.compareDocumentPosition(top)&Node.DOCUMENT_POSITION_FOLLOWING)};
}'''

WELKOM='''()=>{
 const d=document.querySelector('dialog.v3Welkom'),cs=getComputedStyle(d),alpha=c=>{const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return 0;const v=m[1].split(',').map(Number);return v.length>3?v[3]:1;};
 const plates=[...d.querySelectorAll('*')].filter(n=>!n.matches('.primary,.primary *')&&!n.matches('.profileChoice:has(:checked)')&&n.getClientRects().length&&alpha(getComputedStyle(n).backgroundColor)>=.9).map(n=>n.tagName+'.'+n.className);
 const i=d.querySelector('[name=name]');i.focus();const focus=getComputedStyle(i).outlineColor;i.blur();
 const img=d.querySelector('.profileWelcome').getBoundingClientRect(),r=d.getBoundingClientRect();
 return {glass:alpha(cs.backgroundColor)<.9&&cs.backdropFilter!=='none',plates,focus,nino:Math.round(img.height*1159/1200),fits:r.top>=0&&r.bottom<=innerHeight&&d.scrollHeight<=d.clientHeight+1,dialog:[Math.round(r.width),Math.round(r.height)]};
}'''

KEUZE='''()=>{
 const d=document.getElementById('mapPicker'),cs=getComputedStyle(d),alpha=c=>{const m=c.match(/rgba?\(([^)]+)\)/);const v=m?m[1].split(',').map(Number):[0,0,0,0];return v.length>3?v[3]:1;};
 const h=getComputedStyle(d.querySelector('h2')),svg=d.querySelector('.pickerViewport>svg').getBoundingClientRect(),view=d.querySelector('.pickerViewport').getBoundingClientRect();
 const badges=[...d.querySelectorAll('[data-picker-badge]')],r=d.getBoundingClientRect(),cancel=d.querySelector('.pickerCancel').getBoundingClientRect();
 return {glass:alpha(cs.backgroundColor)<.9&&cs.backdropFilter!=='none',title:[h.fontSize,h.fontWeight,h.color],
  help:[...d.querySelectorAll(':scope>p:not(.pickerNote)')].some(n=>n.getClientRects().length),note:d.querySelector('.pickerNote').textContent,
  badges:badges.map(n=>getComputedStyle(n).fill),leaders:[...d.querySelectorAll('[data-picker-leader]')].map(n=>getComputedStyle(n).stroke),
  chips:Math.min(...[...d.querySelectorAll('[data-map-choice]')].map(n=>n.getBoundingClientRect().height)),cancel:[cancel.height,cancel.width],width:r.width,
  inside:svg.right<=view.right+1&&badges.every(n=>{const b=n.getBoundingClientRect();return b.left>=svg.left-1&&b.right<=svg.right+1&&b.top>=svg.top-1&&b.bottom<=svg.bottom+1;}),
  fits:r.top>=0&&r.bottom<=innerHeight&&d.scrollHeight<=d.clientHeight+1,focus:document.activeElement?.classList.contains('pickerCancel')?'pickerCancel':document.activeElement?.tagName};
}'''

async def act(p,selector,touch=False):
 n=p.locator(selector).filter(visible=True).first
 await (n.tap(timeout=2500) if touch else n.click(timeout=2500))
 await p.wait_for_timeout(200)

async def check(p,n,touch,vp):
 shots=[]
 if n==1:
  target=34 if vp!='desktop' else 40
  geometry='() => [...document.querySelectorAll("#map [data-id]")].map(n=>[n.dataset.id,n.getAttribute("d"),n.getAttribute("cx"),n.getAttribute("cy")])'
  before=await p.evaluate(geometry)
  r=await p.evaluate(LANDMARKS,'.v3MapStage .v3Map')
  assert r['count']==10 and r['anchored'] and r['pinAbove'] and r['obstacles']>0 and not r['overlaps'],r
  assert abs(r['median']-target)<=1.5,r
  await p.screenshot(path=str(OUT/f'reis-{vp}.png'));shots.append('reis')
  await q.play_toets(p)
  r2=await p.evaluate(LANDMARKS,'.v3ToetsMap')
  assert r2['count']==10 and r2['anchored'] and r2['pinAbove'] and r2['obstacles']>0 and not r2['overlaps'],r2
  assert abs(r2['median']-target)<=1.5,r2
  assert await p.evaluate(geometry)==before
  await p.evaluate('document.activeElement?.blur?.()');await p.mouse.move(1,1);await p.wait_for_timeout(300)
  await p.screenshot(path=str(OUT/f'toetsResult-{vp}.png'));shots.append('toetsResult')
  return shots,{'reis':r,'toetsResult':r2}
 if n==2:
  await p.goto(q.HTML.as_uri()+'#welkom/bg03');await p.wait_for_timeout(900)
  r=await p.evaluate(WELKOM)
  assert r['glass'] and not r['plates'],r
  assert r['focus']=='rgb(91, 69, 224)',r
  assert 200<=r['nino']<=220,r
  assert r['fits'],r
  await p.locator('.v3Welkom [name=name]').focus();await p.wait_for_timeout(150)
  await p.screenshot(path=str(OUT/f'kennismaking-{vp}.png'));shots.append('kennismaking')
  return shots,r
 if n==3:
  await p.evaluate('TOPO_V3.shell.practice("point","city1")');await p.wait_for_timeout(800)
  out={}
  for case,ids in (('rome',['city-9','area-o']),('napels',['city-6','area-e'])):
   await p.evaluate("ids=>{document.activeElement?.blur?.();openMapPicker(ITEMS.filter(i=>ids.includes(i.id)))}",ids);await p.wait_for_timeout(700)
   r=await p.evaluate(KEUZE);out[case]=r
   assert r['glass'] and r['title']==['28px','700','rgb(42, 36, 64)'],r
   assert not r['help'] and 'Symbolen' not in r['note'] and r['note'].startswith('○ stad'),r
   assert r['badges'] and all(c=='rgb(91, 69, 224)' for c in r['badges']+r['leaders']),r
   assert r['chips']>=44 and r['cancel'][0]>=44 and r['cancel'][1]<r['width']-60,r
   assert r['inside'] and r['fits'] and r['focus']=='pickerCancel',r
   if case=='napels':
    await p.evaluate('document.querySelector(".pickerCancel").blur()');await p.mouse.move(1,1);await p.wait_for_timeout(150)
    await p.screenshot(path=str(OUT/f'keuzevenster-{vp}.png'));shots.append('keuzevenster')
   await p.keyboard.press('Escape');await p.wait_for_timeout(250)
   assert not await p.evaluate('document.getElementById("mapPicker").open')
  # Keyboard choice is V2's: Tab to "Stip 1", Enter answers and closes.
  await p.evaluate("()=>{document.activeElement?.blur?.();openMapPicker(ITEMS.filter(i=>['city-6','area-e'].includes(i.id)))}");await p.wait_for_timeout(500)
  await p.locator('#mapPicker [data-map-choice]').first.focus();await p.keyboard.press('Enter');await p.wait_for_timeout(300)
  assert not await p.evaluate('document.getElementById("mapPicker").open')
  assert await p.evaluate('state.answered')
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
 path=OUT/'ronde4.json';data=json.loads(path.read_text()) if path.exists() else {};data[str(point)]={'previewSha256':initial,'runs':runs,'pass':True};path.write_text(json.dumps(data,indent=2)+'\n')
 print('Ronde 4 punt',point,'PASS',flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--point',type=int,choices=range(1,4));args=parser.parse_args()
 for point in ([args.point] if args.point else range(1,4)):asyncio.run(main(point))
