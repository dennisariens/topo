import asyncio,json,pathlib,hashlib,subprocess,io,re,unicodedata
from playwright.async_api import async_playwright
import struct,zlib
# Decode actual Chromium/WebKit PNG RGB bytes, including every PNG row filter.
def rgb_png(blob):
 pos=8;data=b''
 while pos<len(blob):
  n,kind=struct.unpack('>I4s',blob[pos:pos+8]);chunk=blob[pos+8:pos+8+n];pos+=12+n
  if kind==b'IHDR':w,h,depth,colour,_,_,interlace=struct.unpack('>IIBBBBB',chunk);assert depth==8 and colour in (2,6) and interlace==0
  if kind==b'IDAT':data+=chunk
 raw=zlib.decompress(data);bpp=3 if colour==2 else 4;stride=w*bpp;prior=bytearray(stride);out=[];pos=0
 for y in range(h):
  f=raw[pos];pos+=1;row=bytearray(raw[pos:pos+stride]);pos+=stride
  for x in range(stride):
   a=row[x-bpp] if x>=bpp else 0;b=prior[x];c=prior[x-bpp] if x>=bpp else 0
   if f==1:v=a
   elif f==2:v=b
   elif f==3:v=(a+b)//2
   elif f==4:
    p=a+b-c;pa,pb,pc=abs(p-a),abs(p-b),abs(p-c);v=a if pa<=pb and pa<=pc else b if pb<=pc else c
   else:assert f==0;v=0
   row[x]=(row[x]+v)&255
  out.append(bytes(row) if bpp==3 else bytes(v for x,v in enumerate(row) if x%4!=3));prior=row
 return out

ROOT=pathlib.Path('/Users/dennisariens/projects/topo-v3-app-1a42590'); OUT=pathlib.Path(__file__).parent; HTML=ROOT/'output/html/TOPO-V3-Reis-Preview.html'
EXPECTED='23dced34e7d9079cd59195532721f39b1bc6c1f00032ce6c4a41bb4ea619b556'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
FILES=[HTML,ROOT/'scripts/v3/reis.js',ROOT/'scripts/v3/reis.css',ROOT/'scripts/qa-v3-reis.py',ROOT/'index.html']
BEFORE={str(p):digest(p) for p in FILES}; assert BEFORE[str(HTML)]==EXPECTED and HTML.stat().st_size==50199445

def normal(s):return ''.join(c for c in unicodedata.normalize('NFD',s.casefold()) if not unicodedata.combining(c))
def check_labels(labels,items):
 hits=[]
 for label in labels:
  spaced=normal(label);compact=re.sub(r'\s+','',spaced)
  for item in items:
   for n in [item['name']]+item.get('aliases',[]):
    needle=normal(n)
    if re.search(r'(?<![a-z0-9])'+re.escape(needle)+r'(?![a-z0-9])',spaced) or re.search(r'(?<![a-z0-9])'+re.escape(re.sub(r'\s+','',needle))+r'(?![a-z0-9])',compact):hits.append({'label':label,'name':n,'id':item['id']})
 return hits
async def settle(p):
 await p.wait_for_timeout(650);await p.wait_for_selector('.v3Map');await p.evaluate('Promise.allSettled([...document.images].map(i=>i.decode()))');await p.wait_for_timeout(100)
 # Require six successive stable frames, including current SVG CTM and scroll.
 await p.evaluate('''async()=>{let old='',n=0;for(let i=0;i<120;i++){await new Promise(requestAnimationFrame);let m=document.querySelector('.v3Map'),t=m?.getScreenCTM(),s=JSON.stringify([scrollY,m?.getAttribute('viewBox'),t&&[t.a,t.b,t.c,t.d,t.e,t.f],document.querySelector('.v3Panel')?.getBoundingClientRect().height]);n=s===old?n+1:0;old=s;if(n>=6)return;}throw Error('layout not settled')}''')
async def active(p):return await p.evaluate('''()=>{let e=document.activeElement,r=e.getBoundingClientRect();return {id:e.id,tag:e.tagName,text:e.textContent.trim().slice(0,80),chapter:e.dataset.chapter,tabindex:e.getAttribute('tabindex'),rect:{x:r.x,y:r.y,width:r.width,height:r.height},inView:r.top>=0&&r.bottom<=innerHeight}}''')
async def engine_run(engine,pw):
 b=await getattr(pw,engine).launch(); dest=OUT/('independent-'+engine);dest.mkdir(exist_ok=True)
 result={'engine':engine,'version':b.version,'cases':[],'focus':[],'negativeControl':{},'errors':[]}
 for w,h in [(390,844),(320,640),(820,1180)]:
  ctx=await b.new_context(viewport={'width':w,'height':h},has_touch=True,is_mobile=w<768,device_scale_factor=1);p=await ctx.new_page();p.on('pageerror',lambda e:result['errors'].append(str(e)))
  await p.goto(HTML.as_uri()+'#afgerond');await settle(p)
  items=await p.evaluate('ITEMS.map(i=>({id:i.id,name:i.name,aliases:i.aliases||[]}))');assert len(items)==45
  chapters=await p.locator('.v3Row').evaluate_all('(ns)=>ns.map(n=>n.dataset.chapter)');assert len(chapters)==11
  for ch in chapters:
   await p.locator(f'.v3Row[data-chapter="{ch}"]').click();await settle(p)
   for relief in ['false','true']:
    await p.locator(f'.v3Switch button[data-relief="{relief}"]').click();await settle(p)
    await p.evaluate("let r=document.querySelector('.v3Map').getBoundingClientRect();scrollTo({top:scrollY+r.top-(innerHeight-r.height)/2,behavior:'instant'})");await settle(p)
    labels=await p.locator('.v3Map text').all_text_contents();hits=check_labels(labels,items)
    geo=await p.evaluate('''()=>{let svg=document.querySelector('.v3Map'),r=svg.getBoundingClientRect();let controls=[...document.querySelectorAll('.v3Switch,.v3Side,.v3PreviewBar,.v3Reis button,.v3PreviewBar button,.v3PreviewBar select')].filter(e=>e.checkVisibility()).map((e,i)=>{e.dataset.independentControl=i;let b=e.getBoundingClientRect();return {i,text:e.textContent.trim(),x:b.x,y:b.y,w:b.width,h:b.height}}).filter(b=>b.x<r.right&&b.x+b.w>r.left&&b.y<r.bottom&&b.y+b.h>r.top&&b.y<innerHeight&&b.y+b.h>0);return {mapRect:r.toJSON(),selected:document.querySelector('.v3Row[aria-pressed=true]').dataset.chapter,relief:svg.dataset.relief,selectedIds:[...new Set([...svg.querySelectorAll('.v3Hit')].map(n=>n.dataset.id))],controls}}''')
    name=f'{w}x{h}-{ch}-{relief}';shot=dest/(name+'.png');await p.screenshot(path=str(shot))
    painted=[]
    if geo['controls']:
     # Two RGB captures with controls removed, with and without selected feature paint.
     await p.evaluate("document.querySelectorAll('[data-independent-control]').forEach(e=>{e.dataset.savedVisibility=e.style.visibility;e.style.visibility='hidden'})")
     a=rgb_png(await p.screenshot())
     await p.evaluate("document.querySelectorAll('.v3Map .v3Hit').forEach(e=>{e.dataset.savedVisibility=e.style.visibility;e.style.visibility='hidden'})")
     z=rgb_png(await p.screenshot())
     for c in geo['controls']:
      box=(max(0,int(c['x'])),max(0,int(c['y'])),min(w,int(c['x']+c['w']+1)),min(h,int(c['y']+c['h']+1)))
      if box[2]<=box[0] or box[3]<=box[1]:continue
      pixels=sum(max(abs(a[y][x*3+k]-z[y][x*3+k]) for k in range(3))>10 for y in range(box[1],box[3]) for x in range(box[0],box[2]))
      if pixels:painted.append({'control':c,'selectedPaintPixels':pixels})
     await p.evaluate("document.querySelectorAll('[data-saved-visibility]').forEach(e=>{e.style.visibility=e.dataset.savedVisibility;delete e.dataset.savedVisibility})")
    case={'size':[w,h],'chapter':ch,'relief':relief,'labels':labels,'labelHits':hits,**geo,'coveredPaint':painted,'screenshot':str(shot)};assert geo['selected']==ch and geo['relief']==('on' if relief=='true' else 'off')
    result['cases'].append(case);(dest/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=1))
  if w==390:
   await p.evaluate("let t=document.createElementNS('http://www.w3.org/2000/svg','text');t.id='independent-negative';t.textContent='B Á R I';document.querySelector('.v3Map').append(t)")
   result['negativeControl']={'injected':'B Á R I','hits':check_labels(await p.locator('.v3Map text').all_text_contents(),items)}
   await p.evaluate("document.querySelector('#independent-negative').remove()")
   for mode in ['pointer','keyboard']:
    await p.goto(HTML.as_uri()+'#alles');await settle(p)
    key='Alt+Tab' if engine=='webkit' else 'Tab'
    trace=[]
    if mode=='pointer':await p.locator('.v3Row[data-chapter="city2"]').click()
    else:
     for k in range(55):
      await p.keyboard.press(key);a=await active(p);trace.append(a)
      if a.get('chapter')=='city2':break
     assert trace[-1].get('chapter')=='city2',trace
     await p.keyboard.press('Enter')
    await settle(p);a=await active(p);await p.screenshot(path=str(dest/f'focus-{mode}.png'));await p.keyboard.press(key);n=await active(p)
    result['focus'].append({'mode':mode,'navigationKey':key,'beforeEnter':trace[-1] if trace else None,'afterChange':a,'nextStep':n,'trace':trace,'selected':await p.locator('.v3Row[aria-pressed=true]').get_attribute('data-chapter'),'screenshot':str(dest/f'focus-{mode}.png')})
  await ctx.close()
 await b.close();(dest/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=1));return result
async def main():
 async with async_playwright() as pw: results=await asyncio.gather(engine_run('chromium',pw),engine_run('webkit',pw))
 after={str(p):digest(p) for p in FILES};assert after==BEFORE
 summary={'sha256':EXPECTED,'bytes':HTML.stat().st_size,'before':BEFORE,'after':after,'sourceUnchanged':after==BEFORE,'engines':{}}
 for r in results:
  summary['engines'][r['engine']]={'cases':len(r['cases']),'labelFailures':[c for c in r['cases'] if c['labelHits']],'paintFailures':[c for c in r['cases'] if c['coveredPaint']],'negativeControl':r['negativeControl'],'focus':r['focus'],'errors':r['errors']}
 summary['caseCount']=sum(len(r['cases']) for r in results);assert summary['caseCount']==132
 (OUT/'independent-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2));print(json.dumps(summary,ensure_ascii=False,indent=2))
asyncio.run(main())
