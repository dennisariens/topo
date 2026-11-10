#!/usr/bin/env python3
"""Round 2 targeted presentation checks; use --point N for each commit's gate."""
import argparse,asyncio,hashlib,importlib.util,io,json,pathlib
from PIL import Image
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'docs/qa/v3-stijlbeeld/ronde2'
spec=importlib.util.spec_from_file_location('base',ROOT/'scripts/qa-v3-afwerking.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)
q.HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'

def delta_white(rgb):
 c=[v/255/12.92 if v/255<=.04045 else ((v/255+.055)/1.055)**2.4 for v in rgb[:3]]
 x=(.4124564*c[0]+.3575761*c[1]+.1804375*c[2])/.95047
 y=.2126729*c[0]+.7151522*c[1]+.0721750*c[2]
 z=(.0193339*c[0]+.1191920*c[1]+.9503041*c[2])/1.08883
 f=lambda t:t**(1/3) if t>(6/29)**3 else t/(3*(6/29)**2)+4/29
 L,a,b=116*f(y)-16,500*(f(x)-f(y)),200*(f(y)-f(z))
 return ((L-100)**2+a*a+b*b)**.5
async def sidebar(p,bg):
 n=p.locator('body.v3Les .v3ShellNav,body.v3Home .v3Reis>.v3Side').filter(visible=True).first;box=await n.bounding_box();style=await n.evaluate('(n)=>({background:getComputedStyle(n).backgroundColor,filter:getComputedStyle(n).backdropFilter})')
 assert style['background']=='rgba(255, 255, 255, 0.7)' and 'saturate(0.6)' in style['filter'],style
 await p.add_style_tag(content='.v3Side>*,.v3ShellNav>*{visibility:hidden!important}')
 await p.wait_for_timeout(100)
 shot=Image.open(io.BytesIO(await p.screenshot(path=str(OUT/f'sidebar-{bg}.png')))).convert('RGB')
 colors=[shot.getpixel((x,y)) for x in range(int(box['x'])+16,int(box['x']+box['width'])-16,4) for y in range(int(box['y'])+16,int(box['y']+box['height'])-16,4)]
 values=sorted(delta_white(c) for c in colors);result={**style,'metric':'CIE76 / D65 / sRGB','samples':len(values),'maxDeltaE':round(values[-1],3),'p95DeltaE':round(values[int(len(values)*.95)],3)}
 assert values[-1]<=8,result
 return result


async def progress(p,bg):
 await q.goto(p,'voortgang')
 data=await p.evaluate("""()=>{const R=n=>{const r=n.getBoundingClientRect();return {l:r.left,t:r.top,r:r.right,b:r.bottom,w:r.width,h:r.height}};
 const frame=R(document.querySelector('.v3Reis')),items=[...document.querySelectorAll('.v3VgKaart,.v3VgSide,.v3VgTile')].map(R),rows=[...document.querySelectorAll('.v3VgChapters li')].map(R),card=R(document.querySelector('.v3VgSide .v3Card')),following=[...document.querySelectorAll('.v3View-voortgang>.v3Card')].map(R);
 const contentCuts=[...document.querySelectorAll('.v3VgTileText,.v3VgTile .v3VgDots')].filter(n=>{const r=R(n),p=R(n.closest('.v3VgTile'));return r.t<p.t||r.b>p.b||r.l<p.l||r.r>p.r}).length;
 return {frame,items,rows,card,following,contentCuts,scrollTop:document.querySelector('.v3View-voortgang').scrollTop};}""")
 assert data['scrollTop']==0 and data['contentCuts']==0,data
 assert len(data['rows'])==11 and all(r['h']>=40 and r['t']>=data['card']['t'] and r['b']<=data['card']['b'] for r in data['rows']),data
 assert all(r['b']<=data['frame']['b']-1 and r['t']>=data['frame']['t'] for r in data['items']),data
 assert all(r['t']>=data['frame']['b'] for r in data['following']),data
 await p.screenshot(path=str(OUT/f'voortgang-fit-{bg}.png'))
 return data

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
   if point==3:data['progress']=await progress(p,bg)
   if point==2:
    data['sidebar']=await sidebar(p,bg)
    await q.goto(p,'les');data['lessonSidebar']=await sidebar(p,bg+'-les')
   runs[bg]=data;await c.close()
  await b.close()
 (OUT/f'point-{point}.json').write_text(json.dumps({'point':point,'previewSha256':hashlib.sha256(q.HTML.read_bytes()).hexdigest(),'runs':runs,'pass':True},indent=2)+'\n')
 print('Round 2 point',point,'PASS')
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--point',type=int,default=1);asyncio.run(main(parser.parse_args().point))
