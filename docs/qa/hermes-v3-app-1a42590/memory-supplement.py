import asyncio,json,subprocess,time,re
from pathlib import Path
from playwright.async_api import async_playwright
O=Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-app-1a42590/parent');H=Path('/Users/dennisariens/projects/topo-v3-app-1a42590/output/html/TOPO-V3-Reis-Preview.html');results=[]
def ps():
 rows=[]
 for line in subprocess.check_output(['ps','-axo','pid=,ppid=,rss=,command='],text=True).splitlines():
  m=re.match(r'\s*(\d+)\s+(\d+)\s+(\d+)\s+(.+)',line)
  if m:rows.append(dict(pid=int(m[1]),ppid=int(m[2]),rssKiB=int(m[3]),command=m[4]))
 return rows
async def main():
 async with async_playwright()as p:
  for name in['chromium','webkit']:
   baseline={r['pid']for r in ps()};b=await getattr(p,name).launch();c=await b.new_context(viewport={'width':1440,'height':900},offline=True);pg=await c.new_page();records=[]
   for trial in range(3):
    start=time.monotonic()
    if trial==0:await pg.goto(H.as_uri()+'#bezig',wait_until='load')
    else:await pg.reload(wait_until='load')
    await pg.wait_for_function("document.querySelectorAll('.v3Map [data-id]').length===46 && document.querySelector('.v3Actions .primary')?.getBoundingClientRect().width>0")
    await pg.evaluate("Promise.all([...document.images].map(i=>i.decode().catch(()=>null)))")
    await pg.wait_for_timeout(600);elapsed=(time.monotonic()-start)*1000;allps=ps();fresh=[r for r in allps if r['pid']not in baseline and('/ms-playwright/webkit-2370/'in r['command']if name=='webkit'else'/ms-playwright/chromium_headless_shell-1248/'in r['command'])];record={'trial':trial,'loadAndDecodeSettledMs':elapsed,'candidates':fresh,'rssKiBCandidateSum':sum(r['rssKiB']for r in fresh),'state':'#bezig fixture, no actual-earned claim; no dataURI hash probes or book traversal before memory sample'};records.append(record)
    if trial==0:
     args=['/usr/bin/footprint']
     for r in fresh:args+=['-p',str(r['pid'])]
     args+=['-f','bytes','--noCategories'];f=subprocess.run(args,capture_output=True,text=True,timeout=30);record['footprintExit']=f.returncode;(O/(name+'-all-fresh-processes-footprint.txt')).write_text(f.stdout+f.stderr)
   await c.close();await b.close();await asyncio.sleep(1);alive={r['pid']for r in ps()};candidatePids={r['pid']for row in records for r in row['candidates']};closed=sorted(candidatePids-alive);survived=sorted(candidatePids&alive)
   for row in records:row['closedWithBrowserRSSKiBSum']=sum(r['rssKiB']for r in row['candidates']if r['pid']in closed)
   result={'engine':name,'version':b.version,'records':records,'candidatePIDsGoneAfterOwnClose':closed,'candidatePIDsStillAliveExcludedFromClosedSum':survived,'attributionLimit':'Launch-window+close-lifecycle association for WebKit launchd XPC, not a privileged coalition audit; exclude surviving candidates. Concurrent QA may contend for resources. RSS sums include shared pages, not unique physical RAM.','webkitHeap':'N/A unsupported'};results.append(result);(O/'memory-supplement.json').write_text(json.dumps(results,indent=2));print(json.dumps({'engine':name,'rssKiB':[r['closedWithBrowserRSSKiBSum']for r in records],'closed':closed,'surviving':survived}),flush=True)
asyncio.run(main())
