#!/usr/bin/env python3
"""Canonical final comparisons: all seven screens against approved renders, at three viewports."""
import asyncio, importlib.util, json, pathlib, hashlib
from PIL import Image,ImageDraw,ImageFont
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('afwerking',ROOT/'scripts/qa-v3-afwerking.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
OUT=ROOT/'docs/qa/v3-stijlbeeld/final'
REFERENCES={'reis':'R-reis-ijk','oefenen':'R-oefenen-ijk-rust','les':'R-les','toets':'R-toets-instellen','toetsResult':'R-toets-resultaat','rewards':'R-beloningen','voortgang':'R-voortgang-doel'}
async def main():
 OUT.mkdir(parents=True,exist_ok=True);runs={}
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path=q.MAC_CHROME)
  for vp,(w,h) in {'desktop':(1440,900),'ipad-liggend':(1180,820),'telefoon':(390,844)}.items():
   for screen,ref in REFERENCES.items():
    c=await b.new_context(viewport={'width':w,'height':h},has_touch=vp!='desktop');p=await c.new_page()
    await (await c.new_cdp_session(p)).send('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-transparency','value':'no-preference'}]})
    await p.goto(q.HTML.as_uri()+'#bezig');await p.wait_for_timeout(1200);await q.goto(p,screen)
    await p.screenshot(path=str(OUT/f'{screen}-{vp}.png'))
    a=Image.open(ROOT/f'docs/v3/renders/{ref}.webp').convert('RGB');a=a.resize((w,round(a.height*w/a.width)),Image.Resampling.LANCZOS)
    shot=Image.open(OUT/f'{screen}-{vp}.png').convert('RGB');board=Image.new('RGB',(2*w+48,max(a.height,shot.height)+64),(246,244,250));board.paste(a,(16,48));board.paste(shot,(w+32,48))
    d=ImageDraw.Draw(board);d.text((16,16),'Doelbeeld: '+ref,fill=(42,36,64));d.text((w+32,16),'Build: '+screen+' / '+vp,fill=(42,36,64));board.save(OUT/f'vergelijking-{screen}-{vp}.jpg',quality=90)
    runs[f'{screen}/{vp}']={'reference':ref,'viewport':[w,h]};print(screen,vp,flush=True);await c.close()
  await b.close()
 (OUT/'comparisons.json').write_text(json.dumps({'previewSha256':hashlib.sha256(q.HTML.read_bytes()).hexdigest(),'runs':runs},indent=2)+'\n')
if __name__=='__main__':asyncio.run(main())
