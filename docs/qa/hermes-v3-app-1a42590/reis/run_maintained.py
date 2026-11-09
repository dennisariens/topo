import pathlib, subprocess, concurrent.futures, hashlib, json
ROOT=pathlib.Path('/Users/dennisariens/projects/topo-v3-app-1a42590')
OUT=pathlib.Path(__file__).parent
PY='/Users/dennisariens/.hermes/cache/scratch/hermes-v3-afb32d1/python311/bin/python'
src=(ROOT/'scripts/qa-v3-reis.py').read_text()
def run(engine):
    new=src.replace('b = await p.chromium.launch(executable_path=CHROME)',f'b = await p.{engine}.launch()')
    assert new!=src
    driver=OUT/f'maintained-{engine}.py';driver.write_text(new)
    dest=OUT/f'maintained-{engine}';dest.mkdir(exist_ok=True)
    with (dest/'run.log').open('w') as f:
        r=subprocess.run([PY,str(driver),str(ROOT/'output/html/TOPO-V3-Reis-Preview.html'),str(dest)],stdout=f,stderr=subprocess.STDOUT)
    return {'engine':engine,'exit':r.returncode,'source_sha256':hashlib.sha256(src.encode()).hexdigest(),'adaptation':'engine launch only','driver':str(driver)}
with concurrent.futures.ThreadPoolExecutor(2) as ex: result=list(ex.map(run,['chromium','webkit']))
(OUT/'maintained-status.json').write_text(json.dumps(result,indent=2))
print(result)
