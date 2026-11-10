#!/usr/bin/env python3
"""Pinned provenance, decoded WebP dimensions and offline V3 pose integration."""
import asyncio, hashlib, importlib.util, io, json, pathlib, subprocess
from PIL import Image
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
PIN='339c4207e6d4b212cda4073862b5df42c8d95474'
async def main():
 manifest=json.loads((ROOT/'assets/v3/render/manifest.json').read_text());entries=[a for a in manifest['assets'] if a.get('universalMaster')]
 assert len(entries)==13
 for a in entries:
  source=a['source'];assert source['commit']==PIN and a['status']=='eigenaar akkoord, Hermes open'
  raw=subprocess.check_output(['git','show',PIN+':'+source['path']],cwd=ROOT)
  assert hashlib.sha256(raw).hexdigest()==source['sha256']==a['master']['sha256']
  e=a['export'];data=(ROOT/e['path']).read_bytes();assert hashlib.sha256(data).hexdigest()==e['sha256']
  with Image.open(io.BytesIO(data)) as im:
   assert list(im.size)==e['size'] and im.mode=='RGBA'
   sw,sh=a['master']['size'];assert abs(im.width/im.height-sw/sh)<.002
 spec=importlib.util.spec_from_file_location('qa',ROOT/'scripts/qa-v3-afwerking.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
 runs={}
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path=q.MAC_CHROME)
  for vp,dim in {'desktop':(1440,900),'ipad-liggend':(1180,820),'telefoon':(390,844)}.items():
   c=await b.new_context(viewport={'width':dim[0],'height':dim[1]},offline=True);p=await c.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   await p.goto(q.HTML.as_uri()+'#bezig');await p.wait_for_timeout(1300);await q.goto(p,'toets')
   setup=await p.locator('.v3ToetsSetupNino img').evaluate('(n)=>({ok:n.complete&&n.naturalWidth>0,id:n.parentElement.dataset.v3Master})')
   assert setup['ok'] and setup['id']=='NINO-SCHRIJFT'
   await p.evaluate('TOPO_V3.shell.go("reis")');await q.play_toets(p)
   result=await p.locator('.v3ToetsNino img').evaluate('(n)=>({ok:n.complete&&n.naturalWidth>0,id:n.parentElement.dataset.v3Master})')
   assert result['ok'] and result['id']=='VESPA-RIJDEND'
   assert not errors,errors
   runs[vp]={'setup':setup,'result':result,'offline':True};await c.close()
  await b.close()
 out=ROOT/'docs/qa/v3-stijlbeeld/master-assets.json';out.write_text(json.dumps({'source':PIN,'pipeline':'b70e1ac','masters':len(entries),'runs':runs,'pass':True},indent=2)+'\n');print('13 provenance/exports and 3 offline viewports PASS')
if __name__=='__main__':asyncio.run(main())
