#!/usr/bin/env python3
"""Regression for stale QA reuse: execute the real runner in a tiny isolated repository."""
import json,pathlib,shutil,subprocess,sys,tempfile
SOURCE=pathlib.Path(__file__).with_name('qa-v3-all.py')
with tempfile.TemporaryDirectory(prefix='topo-qa-runner-') as d:
 root=pathlib.Path(d);(root/'scripts').mkdir();(root/'output/html').mkdir(parents=True)
 runner=root/'scripts/qa-v3-all.py';shutil.copyfile(SOURCE,runner)
 preview=root/'output/html/TOPO-V3-Reis-Preview.html';preview.write_text('pin-one');(root/'index.html').write_text('canonical')
 stub=root/'scripts/qa-v3-probe.py'
 stub.write_text("from pathlib import Path\np=Path('count');p.write_text(str(int(p.read_text())+1) if p.exists() else '1')\n")
 def run(expected=0):
  result=subprocess.run([sys.executable,str(runner),'--failed'],cwd=root,capture_output=True,text=True)
  assert result.returncode==expected,result.stdout+result.stderr
  return json.loads((root/'docs/qa/v3-stijlbeeld/final/results-all.json').read_text())
 assert run()['pass'];assert (root/'count').read_text()=='1'
 assert run()['pass'];assert (root/'count').read_text()=='1','identical inputs should reuse'
 preview.write_text('pin-two');assert run()['pass'];assert (root/'count').read_text()=='2','new preview must rerun'
 stub.write_text(stub.read_text()+'# changed test\n');assert run()['pass'];assert (root/'count').read_text()=='3','new script must rerun'
 dep=root/'scripts/qa-v3-dependency.py';dep.write_text('VALUE=1\n')
 stub.write_text(stub.read_text()+"import runpy\nPath('dependency-value').write_text(str(runpy.run_path('scripts/qa-v3-dependency.py')['VALUE']))\n")
 assert run()['pass'];assert (root/'count').read_text()=='4'
 dep.write_text('VALUE=22\n')
 assert run()['pass'];assert (root/'count').read_text()=='5','imported helper changes must rerun the dependent test'
 assert (root/'dependency-value').read_text()=='22'

 stub.write_text(stub.read_text()+"Path('output/html/TOPO-V3-Reis-Preview.html').write_text('changed-during-run')\n")
 report=run(1);assert not report['pass'] and not report['stable'],'in-run change must fail'
 print('QA runner: unchanged reuse, changed preview, changed test, imported helper, in-run mutation: PASS')
