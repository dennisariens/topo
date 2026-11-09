#!/usr/bin/env python3
"""Run original maintained GE01 test; replace browser launch only."""
import hashlib
import importlib.metadata
import json
import os
import pathlib
import subprocess
import sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path('/Users/dennisariens/projects/topo-v3-ge01-6934799')
OUT = pathlib.Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-ge01-6934799/maintained-chromium')
SOURCE = ROOT / 'scripts/qa-v3-toets-beloning.py'
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
PIN = '6934799454441582b953ed455d54ca3b0e2db722'
EXPECTED = '71c2f49bf65ae04e9a1908bd7661cf8889562c0af4b3f582fd9cacfdfc4131d4'
OUT.mkdir(parents=True, exist_ok=True)
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip() == PIN
assert len(HTML.read_bytes()) == 50200591
assert hashlib.sha256(HTML.read_bytes()).hexdigest() == EXPECTED
assert len(sys.argv) == 3 and pathlib.Path(sys.argv[1]).resolve() == HTML and pathlib.Path(sys.argv[2]).resolve() == OUT
assert not os.environ.get('QA_ONLY'), 'Must run all twelve original scenarios'
with sync_playwright() as p:
    executable = p.chromium.executable_path
assert pathlib.Path(executable).is_file()
source = SOURCE.read_text()
old = "        b = await p.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await p.chromium.launch()"
new = '        b = await p.chromium.launch(executable_path=' + repr(executable) + ')'
assert source.count(old) == 1
patched = source.replace(old, new)
assert patched.replace(new, old) == source
paths = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT).split(b'\0')
def snapshot():
    return {os.fsdecode(x): hashlib.sha256((ROOT / os.fsdecode(x)).read_bytes()).hexdigest() for x in paths if x and (ROOT / os.fsdecode(x)).is_file()}
before = snapshot()
(OUT / 'hashes-before.json').write_text(json.dumps(before, indent=2) + '\n')
provenance = {'pin': PIN, 'html': str(HTML), 'htmlSha256': EXPECTED, 'htmlBytes': HTML.stat().st_size, 'python': sys.executable, 'playwright': importlib.metadata.version('playwright'), 'chromiumExecutable': executable, 'chromiumExecutableSha256': hashlib.sha256(pathlib.Path(executable).read_bytes()).hexdigest(), 'originalScript': str(SOURCE), 'originalScriptSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'onlyModification': {'old': old, 'new': new}, '__file__': str(SOURCE), 'argv': sys.argv[1:], 'gitStatusBefore': subprocess.check_output(['git', 'status', '--porcelain=v1'], cwd=ROOT, text=True)}
(OUT / 'launch-provenance.json').write_text(json.dumps(provenance, indent=2) + '\n')
(OUT / 'executed-maintained-script.py').write_text(patched)
code = 0
try:
    exec(compile(patched, str(SOURCE), 'exec'), {'__name__': '__main__', '__file__': str(SOURCE)})
except SystemExit as exc:
    code = exc.code
finally:
    after = snapshot()
    (OUT / 'hashes-after.json').write_text(json.dumps(after, indent=2) + '\n')
    verification = {'trackedFiles': len(before), 'changedTrackedFiles': sorted(k for k in before if before[k] != after.get(k)), 'gitStatusAfter': subprocess.check_output(['git', 'status', '--porcelain=v1'], cwd=ROOT, text=True), 'htmlSha256After': hashlib.sha256(HTML.read_bytes()).hexdigest(), 'htmlBytesAfter': HTML.stat().st_size, 'exitCode': code}
    (OUT / 'preservation.json').write_text(json.dumps(verification, indent=2) + '\n')
    print('PRESERVATION', json.dumps(verification), flush=True)
sys.exit(code)
