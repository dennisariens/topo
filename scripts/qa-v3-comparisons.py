#!/usr/bin/env python3
"""Seven BG-03 screens at three viewports, plus desktop BG-01/02/03 comparison strips."""
import asyncio, importlib.util, json, pathlib, hashlib, io
from PIL import Image,ImageDraw,ImageFont
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('afwerking',ROOT/'scripts/qa-v3-afwerking.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
OUT=ROOT/'docs/qa/v3-stijlbeeld/final'
REFERENCES={'reis':'R-reis-ijk','oefenen':'R-oefenen-ijk-rust','les':'R-les','toets':'R-toets-instellen','toetsResult':'R-toets-resultaat','rewards':'R-beloningen','voortgang':'R-voortgang-doel'}
async def main():
 OUT.mkdir(parents=True,exist_ok=True);runs={};backgrounds={};initial=hashlib.sha256(q.HTML.read_bytes()).hexdigest()
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path=q.MAC_CHROME)
  for vp,(w,h) in {'desktop':(1440,900),'ipad-liggend':(1180,820),'telefoon':(390,844)}.items():
   for screen,ref in REFERENCES.items():
    c=await b.new_context(viewport={'width':w,'height':h},has_touch=vp!='desktop');p=await c.new_page()
    await (await c.new_cdp_session(p)).send('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-transparency','value':'no-preference'}]})
    errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
    await p.goto(q.HTML.as_uri()+'#bezig/bg03');await p.wait_for_timeout(1200);await q.goto(p,screen)
    assert await p.evaluate('window.TOPO_V3_BG')=='bg03'
    assert not errors,errors
    await p.screenshot(path=str(OUT/f'{screen}-{vp}.png'))
    a=Image.open(ROOT/f'docs/v3/renders/{ref}.webp').convert('RGB');a=a.resize((w,round(a.height*w/a.width)),Image.Resampling.LANCZOS)
    shot=Image.open(OUT/f'{screen}-{vp}.png').convert('RGB');board=Image.new('RGB',(2*w+48,max(a.height,shot.height)+64),(246,244,250));board.paste(a,(16,48));board.paste(shot,(w+32,48))
    d=ImageDraw.Draw(board);d.text((16,16),'Doelbeeld: '+ref,fill=(42,36,64));d.text((w+32,16),'Build: '+screen+' / '+vp+' / BG-03 Kust',fill=(42,36,64));board.save(OUT/f'vergelijking-{screen}-{vp}.jpg',quality=90)
    runs[f'{screen}/{vp}']={'reference':ref,'viewport':[w,h],'background':'bg03','pageErrors':errors,'comparison':f'vergelijking-{screen}-{vp}.jpg'}
    if vp=='desktop':
     strip=Image.new('RGB',(3*w+64,h+64),(246,244,250));draw=ImageDraw.Draw(strip);entries={}
     for i,(bg,label) in enumerate([('bg01','BG-01 Toscane'),('bg02','BG-02 Meer'),('bg03','BG-03 Kust')]):
      if bg=='bg03':image=shot
      else:
       await p.goto(q.HTML.as_uri()+'#bezig/'+bg);await p.wait_for_timeout(1200);await q.goto(p,screen)
       assert await p.evaluate('window.TOPO_V3_BG')==bg
       assert not errors,errors
       image=Image.open(io.BytesIO(await p.screenshot())).convert('RGB')
      strip.paste(image,(16+i*(w+16),48));draw.text((16+i*(w+16),16),screen+' / '+label,fill=(42,36,64));entries[bg]=label
     name=f'achtergronden-{screen}-desktop.jpg';strip.save(OUT/name,quality=90);backgrounds[screen]={'viewport':[w,h],'backgrounds':entries,'comparison':name}
    print(screen,vp,flush=True);await c.close()
  await b.close()
 assert initial==hashlib.sha256(q.HTML.read_bytes()).hexdigest(),'Preview changed during comparison capture'
 assert len(runs)==21 and len(backgrounds)==7
 (OUT/'comparisons.json').write_text(json.dumps({'previewSha256':initial,'runs':runs,'backgroundComparisons':backgrounds,'pass':True},indent=2)+'\n')
if __name__=='__main__':asyncio.run(main())
