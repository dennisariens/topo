#!/usr/bin/env python3
"""Targeted Round 3 screen checks; two requested viewports, overwrite final evidence."""
import argparse,asyncio,hashlib,importlib.util,json,pathlib
from PIL import Image
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'docs/qa/v3-stijlbeeld/final'
spec=importlib.util.spec_from_file_location('screen',ROOT/'scripts/qa-v3-afwerking.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
q.HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
async def act(p,selector,touch=False):
 n=p.locator(selector).filter(visible=True).first
 await (n.tap(timeout=2500) if touch else n.click(timeout=2500))
 await p.wait_for_timeout(200)
async def check(p,n,touch):
 if n==1:
  await p.evaluate("document.body.dataset.mapTheme='discovery'")
  await act(p,'.v3MapTools [data-relief=false]',touch)
  assert await p.locator('.v3MapStage .v3Map').get_attribute('data-relief')=='off'
  assert await p.locator('.v3MapStage .atlasTerrain').evaluate("n=>getComputedStyle(n).display")=='none'
  assert (await p.locator('.v3Switch button').first.bounding_box())['height']>=44
  await act(p,'.v3MapTools [data-relief=true]',touch)
  assert await p.locator('.v3MapStage .v3Map').get_attribute('data-relief')=='on'
 if n==20:
  geometry='() => [...document.querySelectorAll("#map [data-id]")].map(n=>[n.dataset.id,n.getAttribute("d"),n.getAttribute("cx"),n.getAttribute("cy")])'
  before=await p.evaluate(geometry)
  assert await p.locator('.v3MapStage .v3Landmarks>g').count()==10
  assert await p.locator('.v3Landmarks>g').evaluate_all('ns=>ns.every(n=>{const a=TOPO_V3.art.landmarks.items.find(i=>i.id===n.dataset.landmark);return n.getAttribute("transform").startsWith("translate("+a.point[0]+" "+a.point[1]+")")})')
  assert await p.locator('#map .v3Landmarks').count()==0
  await act(p,'.v3MapTools [data-relief=false]',touch)
  assert not await p.locator('.v3MapStage .v3Landmarks').is_visible()
  await act(p,'.v3MapTools [data-relief=true]',touch)
  await p.screenshot(path=str(OUT/f'reis-{("ipad-liggend" if touch else "desktop")}.png'))
  await q.goto(p,'oefenen');assert await p.locator('.v3OefMap .v3Landmarks').count()==0
  await q.play_toets(p)
  assert await p.locator('.v3ToetsMap .v3Landmarks>g').count()==10
  assert await p.evaluate(geometry)==before
  assert await p.locator('.v3ToetsMap .atlasTerrain').get_attribute('filter')=='url(#v3t-reliefDepth)'  # ronde 5 punt 8: one relief chain for every map
  return 'toetsResult'
 if n==18:
  await act(p,'[data-nav=instellingen]',touch)
  for key in ['bg01','bg02','bg03','auto']:
   await act(p,f'[data-background={key}]',touch)
   assert await p.locator(f'[data-background={key}]').get_attribute('aria-pressed')=='true'
   assert await p.evaluate('TOPO_V3.background.get()')==key
  assert await p.evaluate('localStorage.getItem("topo-v3-background-v1")')=='auto'
  await p.keyboard.press('Escape')
  await act(p,'.v3Row[data-chapter=city1]',touch);first=await p.locator('body').get_attribute('data-v3-background')
  await act(p,'.v3Row[data-chapter=city2]',touch);second=await p.locator('body').get_attribute('data-v3-background')
  assert first!=second
  await act(p,'[data-nav=instellingen]',touch)
  return 'instellingen'
 if n==17:
  await p.evaluate('celebrateTrip("Rome","Florence")');await p.wait_for_timeout(100)
  assert await p.locator('.rideNino').evaluate('n=>getComputedStyle(n).animationName')=='v3Engine'
  assert await p.locator('.rideRoad').evaluate('n=>getComputedStyle(n).display')=='none'
  await p.wait_for_timeout(1000)
  assert await p.locator('.rideNino').evaluate('n=>getComputedStyle(n).animationName')=='v3RideOut'
  for animation in await p.locator('.rideNino').evaluate('n=>n.getAnimations().map(a=>a.animationName)'):assert animation=='v3RideOut'
  await p.locator('.rideNino').evaluate('n=>n.getAnimations().forEach(a=>{a.pause();a.currentTime=500})')
  return 'vespa'
 if n==16:
  await q.goto(p,'toets');await act(p,'[data-random=true]',touch)
  assert await p.locator('[data-random=true]').get_attribute('aria-pressed')=='true'
  allowed=await p.evaluate('TOPO_V3.model().chapters.filter(c=>c.open).flatMap(c=>c.itemIds)')
  await act(p,'.v3ToetsSetup .v3Start',touch)
  assert await p.evaluate('state.examTotal')==10
  assert set(await p.evaluate('state.examPool.map(i=>i.id)')).issubset(allowed)
  await act(p,'.v3LesBack',touch)
  return 'toets'
 if n==15:
  manifest=json.loads((ROOT/'assets/v3/render/manifest.json').read_text());samples={}
  for asset in manifest['assets']:
   if asset['id'] not in ('BG-01','BG-02','BG-03'):continue
   image=Image.open(ROOT/asset['export']['path']).convert('RGB').resize((240,160))
   fg=q.lum((94,88,114))
   ratios=[(q.lum(tuple(255*.68+c*.32 for c in pixel))+.05)/(fg+.05) for pixel in image.getdata()]
   samples[asset['id']]=round(min(ratios),2)
  assert any(v<4.5 for v in samples.values()),samples
  assert await p.locator('.v3Reis').evaluate('n=>getComputedStyle(n).getPropertyValue("--v3-glass").trim()')=='rgba(255,255,255,.72)'
  (OUT/'glas-ronde3.json').write_text(json.dumps({'decision':'KEEP 72%','candidate':.68,'method':'Conservative white compositing across entire unwashed background artwork; secondary text #5e5872, AA 4.5','minimumContrast':samples},indent=2)+'\n')
 if n==14:
  await q.goto(p,'rewards');await act(p,'.v3BookCover',touch)
  while not await p.locator('.bookFooter button').first.is_disabled():await p.locator('.bookFooter button').first.click()
  assert await p.locator('.coverFolio').count()==1
  assert await p.locator('.bookScript').first.evaluate('n=>getComputedStyle(n).fontFamily')=='Georgia, serif'
  assert await p.locator('.folioWriting').evaluate_all('ns=>ns.every(n=>n.scrollHeight<=n.clientHeight+1)')
  return 'boek'
 if n==13:
  await q.goto(p,'rewards');await act(p,'.v3TileStamp',touch)
  assert await p.locator('#travelBook').evaluate('n=>n.open')
  assert await p.locator('#travelBook .ninoBookSettings').count()==0
  assert await p.locator('.stampFolio').count()>0
  label=await p.locator('.bookFooter .micro').inner_text()
  await p.locator('#travelBook').press('ArrowRight')
  assert await p.locator('.bookFooter .micro').inner_text()!=label
  await p.locator('.bookSpread').evaluate('n=>{n.dispatchEvent(new PointerEvent("pointerdown",{clientX:100,clientY:100,pointerId:1,isPrimary:true,bubbles:true}));n.dispatchEvent(new PointerEvent("pointerup",{clientX:220,clientY:100,pointerId:1,isPrimary:true,bubbles:true}));}')
  assert await p.locator('.bookFooter .micro').inner_text()==label
  await p.keyboard.press('Escape');await act(p,'.v3TilePostcard',touch)
  assert 'Post uit Italië' in await p.locator('.bookSpread').inner_text()
  return 'boek'
 if n==12:
  await p.evaluate('TOPO_V3.shell.practice("point","city1")');await p.wait_for_timeout(500)
  assert await p.locator('.v3LesBack').is_visible()
  await act(p,'.v3LesBack',touch)
  assert await p.locator('.v3View-oefenen').is_visible()
  await p.evaluate('TOPO_V3.shell.go("toets")');await p.wait_for_timeout(250)
  await act(p,'.v3ToetsSetup .v3Start',touch)
  assert await p.locator('.v3LesBack').is_visible()
  await act(p,'.v3LesBack',touch)
  assert await p.locator('.v3ToetsSetup').is_visible()
  await p.evaluate('TOPO_V3.shell.go("toets")');await p.wait_for_timeout(300)
  return 'toets-les'
 if n==11:
  assert await p.locator('.v3EndDone img').count()>0
  assert await p.locator('.v3EndDone img').evaluate_all('ns=>ns.every(n=>n.complete&&n.naturalWidth>0)')
 if n==10:
  assert await p.locator('.v3Counts .v3CountArt').count()==2
  assert await p.locator('.v3Counts .v3CountArt').evaluate_all('ns=>ns.every(n=>n.complete&&n.naturalWidth>0)')
 if n==9:
  await p.evaluate('TOPO_V3.shell.practice("point","city1")');await p.wait_for_timeout(700)
  item=await p.evaluate('state.current.id')
  await p.locator(f'#map [data-id="{item}"][tabindex="0"]').first.press('Enter');await p.wait_for_timeout(300)
  assert await p.locator('#message').evaluate('n=>n.classList.contains("good") && getComputedStyle(n).color==="rgb(77, 50, 165)"')
  return 'les'
 if n==8:
  await p.goto(q.HTML.as_uri()+'#welkom/bg03');await p.wait_for_timeout(800)
  assert await p.locator('.v3Welkom .profileWelcome').count()==1
  assert await p.locator('.v3Welkom .profileScene').evaluate('n=>getComputedStyle(n).backgroundImage')=='none'
  assert await p.locator('.v3Welkom .profileBubble h2').evaluate('n=>getComputedStyle(n).fontSize')=='17px'
  return 'kennismaking'
 if n==7:
  await act(p,'[data-nav=instellingen]',touch)
  d=p.locator('dialog.ninoSettings')
  assert await d.evaluate('n=>n.open && n.classList.contains("v3SettingsSheet")')
  assert await d.locator('button').count()>=5
  return 'instellingen'
 if n==6:
  await q.goto(p,'oefenen')
  assert await p.locator('.v3OefPanel').evaluate('n=>n.scrollHeight<=n.clientHeight+1 && n.getBoundingClientRect().bottom<=innerHeight')
  assert not await p.locator('.v3OefPanel button').evaluate_all('ns=>ns.filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>n.textContent)')
  return 'oefenen'
 if n==5:
  assert await p.locator('html').get_attribute('class')=='v3Ready'
  assert await p.locator('.v3Reis').is_visible()
 if n==2:
  await act(p,'.v3SchoolBtn',touch)
  assert await p.locator('#schoolbladDialog').evaluate('n=>n.open')
  await p.keyboard.press('Escape')
  if touch:assert await p.locator('.v3SchoolBtn span').evaluate('n=>n.getBoundingClientRect().width')>30
 if n==4:
  assert await p.locator('.v3MapTools').evaluate('n=>{const r=n.getBoundingClientRect(),f=n.closest(".v3Reis").getBoundingClientRect();return r.top>=f.top&&r.bottom<=f.bottom&&r.left>=f.left&&r.right<=f.right}')
 if n in (3,4):
  await q.goto(p,'toets')
  bad=await p.locator('.v3ToetsSetup button').evaluate_all("nodes=>nodes.filter(n=>{const r=n.getBoundingClientRect();return r.width<44||r.height<44||n.scrollWidth>n.clientWidth+1}).map(n=>n.textContent)")
  assert not bad,bad
  if n==4:
   assert await p.locator('.v3ToetsSetup').evaluate('n=>n.getBoundingClientRect().bottom<=innerHeight && n.scrollWidth<=n.clientWidth+1')
  await act(p,'.v3ToetsForms [data-value=write]',touch)
  assert await p.locator('.v3ToetsForms [data-value=write]').get_attribute('aria-pressed')=='true'
  await act(p,'[aria-labelledby=v3ToetsHoofdstukken] [data-group=city2]',touch)
  assert await p.locator('[aria-labelledby=v3ToetsHoofdstukken] [data-group=city2]').get_attribute('aria-pressed')=='true'
  return 'toets'
 return 'reis'
async def main(point):
 if point==19:
  report=ROOT/'docs/v3/ARTWORK-INVENTARIS-RONDE3.md';content=report.read_text()
  files=[f for f in (ROOT/'assets').rglob('*') if f.is_file() and f.suffix.lower() in ('.png','.webp','.jpg','.jpeg','.svg','.gif','.woff2')]
  assert all(str(f.relative_to(ROOT)) in content for f in files)
  path=OUT/'ronde3.json';data=json.loads(path.read_text());data['19']={'pass':True,'files':len(files),'reportSha256':hashlib.sha256(report.read_bytes()).hexdigest(),'screenshots':'none: documentation only'};path.write_text(json.dumps(data,indent=2)+'\n');print('Ronde 3 punt 19 PASS');return
 initial=hashlib.sha256(q.HTML.read_bytes()).hexdigest();runs={}
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path=q.MAC_CHROME)
  for vp,(w,h) in {'desktop':(1440,900),'ipad-liggend':(1080,810)}.items():
   c=await b.new_context(viewport={'width':w,'height':h},has_touch=vp!='desktop');p=await c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   await (await c.new_cdp_session(p)).send('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-transparency','value':'no-preference'}]})
   await p.goto(q.HTML.as_uri()+'#bezig/bg03');await p.wait_for_timeout(650)
   try:screen=await check(p,point,vp!='desktop')
   except Exception:
    print('Point',point,'failed at viewport',vp,flush=True)
    raise
   assert not errors,errors
   await p.screenshot(path=str(OUT/f'{screen}-{vp}.png'))
   if point==17:
    await p.emulate_media(reduced_motion='reduce')
    await p.keyboard.press('Escape');await p.keyboard.press('Escape')
    await p.evaluate('celebrateTrip("Rome","Florence")');await p.wait_for_timeout(100)
    assert await p.locator('.vespaRide').get_attribute('data-phase')=='arrived'
    assert await p.locator('.rideArrival').evaluate('n=>getComputedStyle(n).animationDuration')=='0.16s'
   runs[vp]={'viewport':[w,h],'screen':screen,'errors':errors};await c.close()
  await b.close()
 assert initial==hashlib.sha256(q.HTML.read_bytes()).hexdigest()
 path=OUT/'ronde3.json';data=json.loads(path.read_text()) if path.exists() else {};data[str(point)]={'previewSha256':initial,'runs':runs,'pass':True};path.write_text(json.dumps(data,indent=2)+'\n')
 print('Ronde 3 punt',point,'PASS',flush=True)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--point',type=int,choices=range(1,21));args=parser.parse_args()
 for point in ([args.point] if args.point else range(1,21)):asyncio.run(main(point))
