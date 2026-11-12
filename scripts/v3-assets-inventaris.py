#!/usr/bin/env python3
"""Assetdieet stap 1 (docs/v3/ASSETDIEET.md): inventory of every image in the V3 preview output.

Catalogue: every image data URI in output/html/TOPO-V3-Reis-Preview.html, identified by the sha256 of its bytes against
assets/v2/assets.json and the files under assets/. Runtime scan: Playwright visits every demo state, screen, chapter,
the lesson, the picker, the test and its result, rewards, every page of the book, Vespa, Voortgang, Instellingen and
the kennismaking at desktop 1440×900 (1×), iPad 1080×810 (2×) and phone 390×844 (3×), and records each image that is actually drawn
(<img>, SVG <image>, CSS backgrounds and masks, also on ::before/::after) with its rendered size in CSS px.

"Ongebruikt in V3" is only set when an image is never drawn in the scan AND no scan step failed AND it is not in the
keep list below (doubt counts as used). Output: docs/v3/assets-inventaris.json.

  python3 scripts/v3-assets-inventaris.py [preview.html]   (needs Playwright + Pillow; see docs/v3/OVERDRACHT.md)
"""
import asyncio,base64,hashlib,io,json,os,pathlib,re,sys,time
from PIL import Image
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
HTML=pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT/'output/html/TOPO-V3-Reis-Preview.html'
OUT=pathlib.Path(os.environ['TOPO_SCAN_OUT']) if os.environ.get('TOPO_SCAN_OUT') else ROOT/'docs/v3/assets-inventaris.json'
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VIEWPORTS={'desktop':(1440,900),'ipad':(1080,810),'telefoon':(390,844)}
DPR={'desktop':1,'ipad':2,'telefoon':3}  # real devices; the landmark code picks its 256 px export only above 1×
STATES=['welkom','nieuw','bezig','afgerond','alles']
if os.environ.get('TOPO_SCAN_QUICK'):VIEWPORTS={'desktop':VIEWPORTS['desktop']};STATES=os.environ['TOPO_SCAN_QUICK'].split(',')
CHAPTERS=['city1','city2','city3','city4','islands','mountains','volcanoes','regions','countries','seas','rivers']
# Never placeholders, whatever the scan says: the tab icon is drawn by the browser, not the page.
KEEP={'assets/v2/favicon-16.png':'browser-tabicoon (niet in de DOM getekend)','assets/v2/favicon-32.png':'browser-tabicoon (niet in de DOM getekend)'}
def proven_unused(i):
 '''Positive proof that V3 never reads the image: returns the reason, or None (then it counts as used).'''
 v3=''.join(p.read_text() for p in sorted((ROOT/'scripts/v3').glob('*.js')))
 # Chapter header scenes: build-v3-preview.mjs embeds {mini,kop}; V3 code only reads .mini.
 if i['kind']=='scene' and re.search(r'(/scenes/[^/]+(?<!-mini)\.webp$)|SCENE-[A-Z]+-kop',i['id']) and not re.search(r'\.kop\b|\[.kop.\]|kop:',v3):
  return 'hoofdstukscène "kop": scripts/v3 leest alleen scenes[id].mini, nooit .kop'
 # Relief sea and shadow: only drawn in the Kaart variant, which V3 never sets (ui.kaart is only ever 'eiland') and
 # whose layers reis-ijk.css hides under data-kaart=eiland.
 css=''.join(p.read_text() for p in sorted((ROOT/'scripts/v3').glob('*.css')))
 if re.search(r'terrain-z8-render-(sea|shadow)\.webp$',i['id']) and set(re.findall(r"ui\.kaart\s*=\s*'([a-z]+)'",v3))=={'eiland'} and re.search(r'\[data-kaart=eiland\][^{]*\.v3RSea,\.v3RShadow[^{]*\{display:none!important',css):
  return 'reliëflaag zee/schaduw: alleen in variant Kaart; ui.kaart is altijd eiland en reis-ijk.css verbergt de lagen daar'
 return None
FP=lambda b64:f'{len(b64)}:{b64[-48:]}'

def catalogue(html):
 known={}
 v2=json.loads((ROOT/'assets/v2/assets.json').read_text())
 for name,e in v2.items():known[e['sha256']]='assets/v2/'+name
 for p in sorted((ROOT/'assets').rglob('*')):
  if p.is_file() and p.suffix.lower() in ('.webp','.png','.jpg','.jpeg','.avif','.svg') and not str(p).startswith(str(ROOT/'assets/v2')):
   known.setdefault(hashlib.sha256(p.read_bytes()).hexdigest(),str(p.relative_to(ROOT)))
 base=(ROOT/'index.html').read_text()
 v2uris=set(m.group(2) for m in re.finditer(r'data:(image/[a-z0-9+.-]+);base64,([A-Za-z0-9+/=]+)',base))
 images={}
 for m in re.finditer(r'data:(image/[a-z0-9+.-]+);base64,([A-Za-z0-9+/=]+)',html):
  b64=m.group(2);fp=FP(b64)
  if fp in images:images[fp]['occurrences']+=1;continue
  raw=base64.b64decode(b64);sha=hashlib.sha256(raw).hexdigest()
  try:
   im=Image.open(io.BytesIO(raw));w,h=im.size;fmt=im.format;mode=im.mode
  except Exception:w=h=0;fmt=m.group(1);mode='?'
  images[fp]={'id':known.get(sha,'onbekend:'+sha[:12]),'source':'v2' if b64 in v2uris else 'v3','mime':m.group(1),'format':fmt,'mode':mode,
   'bytes':len(raw),'base64Bytes':len(b64),'occurrences':1,'size':[w,h],'sha256':sha}
 if len({FP(i) for i in images})!=len(images):raise SystemExit('fingerprint collision')
 return images

def kind(i):
 p=i['id'];n=p.rsplit('/',1)[-1]
 if re.search(r'bg-0[123]|BG-0',p,re.I):return 'achtergrond'
 if 'landmarks' in p:return 'landmark'
 if '/scenes/' in p or 'SCENE-' in p:return 'scene'
 if 'favicon' in n or '/icons/' in p or re.search(r'chapter\d|stamp\d|favorite\d|chaptergold|finalgold|pizza-reward|pizza-board|ic-',n,re.I):return 'icoon'
 if re.search(r'terrain|relief|coast|sea|shadow',n):return 'kaart'
 if re.search(r'scene|sicilia|sardegna|napoli|venezia|reverse|folio|cover|panorama|kop|mini|arrival',n,re.I):return 'scene'
 if re.search(r'nino|vespa|pose|portret|portrait',p,re.I):return 'nino'
 if 'schoolblad' in n:return 'foto'
 return 'overig'

COLLECT=r'''(screen)=>{
 const fp=u=>{const b=u.slice(u.indexOf(',')+1);return b.length+':'+b.slice(-48);};
 const out=[],seen=new Set(),add=(u,n,box,fit,extra)=>{if(!u||!u.startsWith('data:image'))return;const r=box;const vis=r.width>0&&r.height>0&&n.getClientRects().length>0&&getComputedStyle(n).visibility!=='hidden';
  const key=fp(u)+'|'+(vis?1:0)+'|'+Math.round(r.width)+'x'+Math.round(r.height);if(seen.has(key))return;seen.add(key);
  let where=n.tagName.toLowerCase()+(n.id?'#'+n.id:'')+(typeof n.className==='string'&&n.className?'.'+n.className.trim().split(/\s+/).slice(0,2).join('.'):'');
  const host=n.closest('[id],dialog,.v3View,section');if(host&&host!==n)where=(host.id?'#'+host.id:host.tagName.toLowerCase()+'.'+String(host.className).trim().split(/\s+/)[0])+' '+where;
  const onScreen=vis&&r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight;
  out.push({fp:fp(u),screen,where,visible:vis,onScreen,box:[Math.round(r.width*10)/10,Math.round(r.height*10)/10],fit,...extra});};
 const urls=v=>[...v.matchAll(/url\("?(data:image[^")]+)"?\)/g)].map(m=>m[1]);
 for(const n of document.querySelectorAll('*')){
  if(n.tagName==='IMG'){const c=getComputedStyle(n);add(n.currentSrc||n.src,n,n.getBoundingClientRect(),c.objectFit,{tag:'img',loading:n.loading,decoding:n.decoding});}
  else if(n.tagName==='image'){const h=n.href?.baseVal||n.getAttribute('href');add(h,n,n.getBoundingClientRect(),'contain',{tag:'svg-image'});}
  else if(n.tagName==='SOURCE'&&n.srcset){add(n.srcset.split(' ')[0],n.parentElement?.querySelector('img')||n,(n.parentElement?.querySelector('img')||n).getBoundingClientRect(),'source',{tag:'source'});}
  for(const pseudo of [null,'::before','::after']){const c=getComputedStyle(n,pseudo);
   for(const prop of ['backgroundImage','maskImage','webkitMaskImage','borderImageSource','content','listStyleImage']){const v=c[prop];if(!v||v==='none'||!v.includes('data:image'))continue;
    for(const u of urls(v)){let r=n.getBoundingClientRect();if(pseudo){const w=parseFloat(c.width),h=parseFloat(c.height);if(w>0&&h>0)r={width:w,height:h,left:r.left,top:r.top,right:r.left+w,bottom:r.top+h};}
     add(u,n,r,prop==='backgroundImage'?c.backgroundSize:prop==='content'?'contain':(c.maskSize||c.webkitMaskSize||'auto'),{tag:'css-'+prop+(pseudo||'')});}}}
 }
 return out;
}'''

async def scan():
 usage=[];steps=[];errors=[]
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path=CHROME)
  for vp,(w,h) in VIEWPORTS.items():
   for state in STATES:
    for opt in (['bg03','bg01','bg02','italia'] if state=='bezig' else ['bg03']):
     c=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=DPR[vp],has_touch=vp!='desktop');p=await c.new_page()
     await (await c.new_cdp_session(p)).send('Emulation.setEmulatedMedia',{'features':[{'name':'prefers-reduced-transparency','value':'no-preference'}]})
     p.on('dialog',lambda d:asyncio.ensure_future(d.dismiss()))
     tag=f'{vp}/{state}/{opt}'
     async def grab(screen,wait=350):
      await p.wait_for_timeout(wait)
      try:usage.extend(dict(u,viewport=vp,state=state,opt=opt) for u in await p.evaluate(COLLECT,screen));steps.append(tag+'/'+screen)
      except Exception as e:errors.append(f'{tag}/{screen}: {e}')
     async def step(name,coro):
      try:await coro
      except Exception as e:errors.append(f'{tag}/{name}: {str(e).splitlines()[0][:160]}')
     async def esc():
      for _ in range(3):await p.keyboard.press('Escape');await p.wait_for_timeout(120)
     async def js(code):await p.evaluate(code)
     h_=(opt if opt=='italia' else ('' if opt=='bg03' else opt))
     await p.goto(HTML.as_uri()+'#'+state+('/'+h_ if h_ else ''));await p.wait_for_timeout(900)
     if state=='welkom':
      await grab('kennismaking')
      await step('welkom-skip',p.locator('dialog.v3Welkom [data-profile-cancel]').click(timeout=2500));await grab('kennismaking-aanbod',600)
      await esc()
     await grab('reis')
     for ch in CHAPTERS:
      await step('reis-'+ch,js(f'(()=>{{const r=document.querySelector(".v3Row[data-chapter={ch}]");if(r)r.click();}})()'));await grab('reis-'+ch,300)
     await step('relief-uit',js('document.querySelector(".v3MapTools [data-relief=false]")?.click()'));await grab('reis-relief-uit')
     await step('relief-aan',js('document.querySelector(".v3MapTools [data-relief=true]")?.click()'))
     await step('schoolblad',js('document.querySelector(".v3SchoolBtn")?.click()'));await grab('schoolblad',600);await esc()
     for nav in ['oefenen','toets','rewards','voortgang']:
      await step(nav,js(f'TOPO_V3.shell.go("{nav}")'));await grab(nav,700)
     # Lesson: point and write, a right and a wrong answer, the picker.
     for mode in ['point','write']:
      await step('les-'+mode,js(f'TOPO_V3.shell.practice("{mode}","city1")'));await grab('les-'+mode,900)
      await step('les-fout',js('(()=>{if(state.questionMode==="write"){const a=document.querySelector("#answer");a.value="xxxx";a.form?.requestSubmit?.()||document.querySelector("#check")?.click();}else{const s=document.querySelector("#map .sea");s?.dispatchEvent(new MouseEvent("click",{bubbles:true,clientX:5,clientY:5}));}})()'))
      await grab('les-'+mode+'-fout',700)
      await step('les-goed',js('(()=>{if(state.questionMode==="write"){const a=document.querySelector("#answer");a.value=state.current.name;document.querySelector("#check")?.click();}else{document.querySelector("#map [data-id=\\""+state.current.id+"\\"][tabindex=\\"0\\"]")?.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}));}})()'))
      await grab('les-'+mode+'-goed',700)
     await step('keuze',js("openMapPicker(ITEMS.filter(i=>['city-6','area-e'].includes(i.id)))"));await grab('keuzevenster',600);await esc()
     await step('keuze-rome',js("openMapPicker(ITEMS.filter(i=>['city-9','area-o'].includes(i.id)))"));await grab('keuzevenster-rome',600);await esc()
     await step('les-terug',js('document.querySelector(".v3LesBack")?.click()'))
     # Test with mistakes, then a perfect test.
     async def toets(perfect):
      await js('TOPO_V3.shell.go("toets")');await p.wait_for_timeout(400)
      await js('document.querySelector("[aria-labelledby=v3ToetsLengte] [data-value=\\"10\\"]")?.click()');await js('document.querySelector(".v3View-toets .v3Start")?.click()');await p.wait_for_timeout(800)
      for n in range(10):
       if not await p.evaluate('!!(state.current&&state.mode==="exam")'):break
       if not perfect and n in (2,5):
        await js('document.querySelector("#next").click()');await p.wait_for_timeout(200);await js('document.querySelector("#next").click()');await p.wait_for_timeout(250);continue
       await js('(()=>{if(state.questionMode==="write"){const a=document.querySelector("#answer");a.value=state.current.name;document.querySelector("#check")?.click();}else{document.querySelector("#map [data-id=\\""+state.current.id+"\\"][tabindex=\\"0\\"]")?.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}));}})()')
       await p.wait_for_timeout(180);await js('document.querySelector("#next")?.click()');await p.wait_for_timeout(250)
      await p.wait_for_timeout(900)
     await step('toets-fouten',toets(False));await grab('toetsResult-fouten',600)
     await step('toets-perfect',toets(True));await grab('toetsResult-perfect',600)
     # Rewards: tiles, the book (every page), stamps, postcards.
     for tile in ['.v3BookCover','.v3TileStamp','.v3TilePostcard','.v3TileGold','.v3TilePizza']:
      await step('rewards',js('TOPO_V3.shell.go("rewards")'));await p.wait_for_timeout(500)
      await step('tegel'+tile,js(f'document.querySelector("{tile}")?.click()'));await grab('rewards-'+tile[1:],700)
      if await p.evaluate('!!document.querySelector("#travelBook")?.open'):
       last=None
       for k in range(40):
        lab=await p.evaluate('document.querySelector(".bookFooter .micro")?.textContent||""')
        if lab==last:break
        last=lab;await grab('boek-'+tile[1:]+'-'+str(k),250);await p.keyboard.press('ArrowRight')
       for k in range(40):
        lab=await p.evaluate('document.querySelector(".bookFooter .micro")?.textContent||""');await p.keyboard.press('ArrowLeft');await p.wait_for_timeout(150)
        if lab==await p.evaluate('document.querySelector(".bookFooter .micro")?.textContent||""'):break
       await grab('boek-terug-'+tile[1:],300)
      await esc()
     await step('instellingen',js('document.querySelector("[data-nav=instellingen]")?.click()'));await grab('instellingen',600);await esc()
     await step('vespa',js('celebrateTrip("Rome","Florence")'))
     for t in (100,600,1200,2500):await grab('vespa-'+str(t),t if t==100 else 500)
     await esc()
     await c.close()
  await b.close()
 return usage,steps,errors

def rendered(box,fit,nat):
 bw,bh=box;nw,nh=nat
 if not nw or not nh:return box
 fit=(fit or 'fill').split(',')[0].strip()
 if fit in ('cover',):s=max(bw/nw,bh/nh);return [nw*s,nh*s]
 if fit in ('contain','scale-down','source'):s=min(bw/nw,bh/nh);return [nw*s,nh*s]
 if fit in ('auto','auto auto','none'):return [nw,nh]
 m=re.match(r'([\d.]+)(px|%)\s*([\d.]+)?(px|%)?',fit)
 if m:
  w=float(m.group(1))*(bw/100 if m.group(2)=='%' else 1)
  h=float(m.group(3))*(bh/100 if m.group(4)=='%' else 1) if m.group(3) else w*nh/nw
  return [w,h]
 m=re.match(r'auto\s+([\d.]+)(px|%)',fit)
 if m:h=float(m.group(1))*(bh/100 if m.group(2)=='%' else 1);return [h*nw/nh,h]
 return box  # fill / unknown

def main():
 t0=time.time();html=HTML.read_text();images=catalogue(html)
 usage,steps,errors=asyncio.run(scan())
 for fp,i in images.items():
  i['kind']=kind(i);u=[x for x in usage if x['fp']==fp];vis=[x for x in u if x['visible']]
  i['inDom']=bool(u);i['drawn']=bool(vis)
  i['screens']=sorted({x['screen'].split('-')[0] if x['screen'].startswith('boek') else x['screen'] for x in vis})
  i['elements']=sorted({x['where'] for x in vis})[:12]
  i['hiddenInDom']=sorted({x['where'] for x in u if not x['visible']})[:8]
  md={}
  for vp in VIEWPORTS:
   r=[rendered(x['box'],x['fit'],i['size']) for x in vis if x['viewport']==vp]
   md[vp]=[round(max((a for a,_ in r),default=0)),round(max((b for _,b in r),default=0))]
  i['maxDisplayCss']=md
  if i['id'] in KEEP:i['used']=True;i['keepReason']=KEEP[i['id']]
  else:
   reason=None if (i['drawn'] or errors) else proven_unused(i)
   i['used']=reason is None
   if reason:i['unusedReason']=reason
   elif not i['drawn']:i['note']='niet getekend in de scan, maar niet bewezen ongebruikt: telt als gebruikt'
 total=sum(i['base64Bytes']*i['occurrences'] for i in images.values())
 out={'preview':str(HTML.relative_to(ROOT)),'previewBytes':len(html.encode()),'previewSha256':hashlib.sha256(html.encode()).hexdigest(),
  'scan':{'viewports':VIEWPORTS,'states':STATES,'steps':len(steps),'errors':errors,'seconds':round(time.time()-t0)},
  'rule':'ongebruikt = nooit getekend in de volledige scan, geen enkele scanfout, en een positief bewijs in de code (proven_unused); anders gebruikt',
  'totals':{'images':len(images),'imageBase64Bytes':total,'unused':sum(not i['used'] for i in images.values()),
   'unusedBase64Bytes':sum(i['base64Bytes']*i['occurrences'] for i in images.values() if not i['used'])},
  'images':sorted(images.values(),key=lambda i:-i['base64Bytes']*i['occurrences'])}
 OUT.write_text(json.dumps(out,indent=1,ensure_ascii=False)+'\n')
 print(json.dumps(out['totals']),'steps',len(steps),'errors',len(errors))
 for e in errors[:20]:print('  fout:',e)
if __name__=='__main__':main()
