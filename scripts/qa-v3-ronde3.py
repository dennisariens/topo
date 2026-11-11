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
