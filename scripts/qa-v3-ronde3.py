#!/usr/bin/env python3
"""Targeted Round 3 screen checks; two requested viewports, overwrite final evidence."""
import argparse,asyncio,hashlib,importlib.util,json,pathlib
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
 initial=hashlib.sha256(q.HTML.read_bytes()).hexdigest();runs={}
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path=q.MAC_CHROME)
  for vp,(w,h) in {'desktop':(1440,900),'ipad-liggend':(1080,810)}.items():
   c=await b.new_context(viewport={'width':w,'height':h},has_touch=vp!='desktop');p=await c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   await (await c.new_cdp_session(p)).send('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-transparency','value':'no-preference'}]})
   await p.goto(q.HTML.as_uri()+'#bezig/bg03');await p.wait_for_timeout(650)
   try:screen=await check(p,point,vp!='desktop')
   except Exception:
    print(await p.locator('.v3MapTools').evaluate('(n)=>{const r=n.getBoundingClientRect();return {rect:r.toJSON(),hits:document.elementsFromPoint(r.x+r.width/2,r.y+r.height/2).slice(0,5).map(x=>x.tagName+"."+x.className)}}'))
    raise
   assert not errors,errors
   await p.screenshot(path=str(OUT/f'{screen}-{vp}.png'))
   runs[vp]={'viewport':[w,h],'screen':screen,'errors':errors};await c.close()
  await b.close()
 assert initial==hashlib.sha256(q.HTML.read_bytes()).hexdigest()
 path=OUT/'ronde3.json';data=json.loads(path.read_text()) if path.exists() else {};data[str(point)]={'previewSha256':initial,'runs':runs,'pass':True};path.write_text(json.dumps(data,indent=2)+'\n')
 print('Ronde 3 punt',point,'PASS',flush=True)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--point',type=int,choices=range(1,21),default=1);asyncio.run(main(parser.parse_args().point))
