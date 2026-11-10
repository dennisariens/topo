#!/usr/bin/env python3
"""Every V3 browser QA script against one immutable preview; reuse only identical inputs and script bytes."""
import asyncio,hashlib,json,pathlib,sys,time
ROOT=pathlib.Path(__file__).resolve().parent.parent
OUT=ROOT/'docs/qa/v3-stijlbeeld/final'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inputs():
 suite=hashlib.sha256()
 for p in sorted((ROOT/'scripts').glob('qa-v3-*.py')):suite.update(p.name.encode()+b'\0'+p.read_bytes())
 return {'previewSha256':sha(ROOT/'output/html/TOPO-V3-Reis-Preview.html'),'indexSha256':sha(ROOT/'index.html'),'qaSuiteSha256':suite.hexdigest()}
async def main():
 OUT.mkdir(parents=True,exist_ok=True);initial=inputs()
 scripts=sorted(p for p in (ROOT/'scripts').glob('qa-v3-*.py') if p.name not in {'qa-v3-all.py','qa-v3-comparisons.py'})
 previous=json.loads((OUT/'results-all.json').read_text()) if '--failed' in sys.argv and (OUT/'results-all.json').exists() else {}
 results={};pending=[]
 for p in scripts:
  old=previous.get('scripts',{}).get(p.name,{})
  if old.get('exit')==0 and old.get('inputs')==initial and old.get('scriptSha256')==sha(p):results[p.name]=old
  else:pending.append(p)
 sem=asyncio.Semaphore(4)
 async def run(p):
  async with sem:
   start=time.monotonic();script_sha=sha(p);log=OUT/(p.stem+'.log')
   with log.open('w') as f:
    proc=await asyncio.create_subprocess_exec(sys.executable,str(p),cwd=ROOT,stdout=f,stderr=asyncio.subprocess.STDOUT);code=await proc.wait()
   stable=initial==inputs() and script_sha==sha(p)
   results[p.name]={'exit':code if stable else 99,'seconds':round(time.monotonic()-start,1),'log':str(log.relative_to(ROOT)),'inputs':initial,'scriptSha256':script_sha,'stable':stable}
   print(p.name,results[p.name]['exit'],flush=True)
 await asyncio.gather(*(run(p) for p in pending))
 stable=initial==inputs() and all(results[p.name]['scriptSha256']==sha(p) for p in scripts)
 report={**initial,'scripts':results,'stable':stable,'pass':stable and all(r['exit']==0 for r in results.values())}
 (OUT/'results-all.json').write_text(json.dumps(report,indent=2)+'\n');return 0 if report['pass'] else 1
if __name__=='__main__':sys.exit(asyncio.run(main()))
