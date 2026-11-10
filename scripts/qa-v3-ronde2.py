#!/usr/bin/env python3
"""Round 2 targeted presentation checks; use --point N for each commit's gate."""
import argparse,asyncio,hashlib,importlib.util,io,json,pathlib
from PIL import Image
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'docs/qa/v3-stijlbeeld/ronde2'
spec=importlib.util.spec_from_file_location('base',ROOT/'scripts/qa-v3-afwerking.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
q.HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
async def main(point):
 OUT.mkdir(parents=True,exist_ok=True);runs={}
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path=q.MAC_CHROME)
  for bg in ['default','bg01','bg02','bg03']:
   c=await b.new_context(viewport={'width':1440,'height':900});p=await c.new_page()
   await (await c.new_cdp_session(p)).send('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-transparency','value':'no-preference'}]})
   await p.goto(q.HTML.as_uri()+'#bezig'+('' if bg=='default' else '/'+bg));await p.wait_for_timeout(1000)
   data=await p.evaluate('''()=>({bg:window.TOPO_V3_BG,links:[...document.querySelectorAll('.v3Bg')].map(n=>n.hash),active:document.querySelector('.v3Bg[aria-current]')?.textContent})''')
   assert data['bg']==('bg03' if bg=='default' else bg),data
   assert data['links']==['#bezig/bg01','#bezig/bg02','#bezig'],data
   runs[bg]=data;await c.close()
  await b.close()
 (OUT/f'point-{point}.json').write_text(json.dumps({'point':point,'previewSha256':hashlib.sha256(q.HTML.read_bytes()).hexdigest(),'runs':runs,'pass':True},indent=2)+'\n')
 print('Round 2 point',point,'PASS')
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--point',type=int,default=1);asyncio.run(main(parser.parse_args().point))
