#!/usr/bin/env python3
"""Execute immutable maintained QA with exactly one browser-launch replacement."""
import hashlib, importlib.metadata, json, os, pathlib, subprocess, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path('/Users/dennisariens/projects/topo-v3-ge01-6934799')
OUT = pathlib.Path('/Users/dennisariens/.hermes/cache/scratch/hermes-v3-ge01-6934799/maintained-webkit')
SOURCE = ROOT / 'scripts/qa-v3-toets-beloning.py'
HTML = ROOT / 'output/html/TOPO-V3-Reis-Preview.html'
assert subprocess.check_output(['git','rev-parse','HEAD'], cwd=ROOT, text=True).strip() == '6934799454441582b953ed455d54ca3b0e2db722'
assert hashlib.sha256(HTML.read_bytes()).hexdigest() == '71c2f49bf65ae04e9a1908bd7661cf8889562c0af4b3f582fd9cacfdfc4131d4'
assert HTML.stat().st_size == 50200591
assert not os.environ.get('QA_ONLY'), 'Full 12-run matrix required'
assert importlib.metadata.version('playwright') == '1.64.0'
original = SOURCE.read_text()
old = 'b = await p.chromium.launch(executable_path=MAC_CHROME) if pathlib.Path(MAC_CHROME).exists() else await p.chromium.launch()'
new = 'b = await p.webkit.launch()'
assert original.count(old) == 1
modified = original.replace(old, new)
# Preserve __file__, ROOT and all application/test assertions. Original browser
# label says Chrome; provenance below identifies the actual engine explicitly.
(OUT / 'executed-source.py').write_text(modified)
paths = subprocess.check_output(['git','ls-files','-z'], cwd=ROOT).split(b'\0')
baseline = {os.fsdecode(p): hashlib.sha256((ROOT / os.fsdecode(p)).read_bytes()).hexdigest() for p in paths if p and (ROOT / os.fsdecode(p)).is_file()}
(OUT / 'tracked-before.json').write_text(json.dumps(baseline, indent=2))
with sync_playwright() as p:
    executable = pathlib.Path(p.webkit.executable_path)
    browser = p.webkit.launch()
    version = browser.version
    browser.close()
    provenance = {'engine': 'webkit', 'version': version, 'playwright': importlib.metadata.version('playwright'), 'python': sys.executable, 'executable': str(executable), 'executableSha256': hashlib.sha256(executable.read_bytes()).hexdigest(), 'source': str(SOURCE), 'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'executedSourceSha256': hashlib.sha256(modified.encode()).hexdigest(), 'replacement': {'old': old, 'new': new}, 'originalFilePreserved': str(SOURCE), 'argv': [str(SOURCE), str(HTML), str(OUT)], 'htmlSha256': hashlib.sha256(HTML.read_bytes()).hexdigest(), 'htmlBytes': HTML.stat().st_size, 'note': 'Maintained results.json browser label is unmodified Chrome; actual launch is WebKit only.'}
(OUT / 'launch-provenance.json').write_text(json.dumps(provenance, indent=2))
print(json.dumps(provenance, indent=2), flush=True)
sys.argv = [str(SOURCE), str(HTML), str(OUT)]
exec(compile(modified, str(SOURCE), 'exec'), {'__name__': '__main__', '__file__': str(SOURCE)})
