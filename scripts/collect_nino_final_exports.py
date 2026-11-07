#!/usr/bin/env python3
"""Copy missing approved exports by exact Git blob; never replace existing art."""
import hashlib, json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REF = '4eb9a5ae33550d789c56d5c01393145a148565aa'
def git(*args): return subprocess.check_output(['git',*args],cwd=ROOT)
paths = git('ls-tree','-r','--name-only',REF,'assets/nino/chapter-icons/exports').decode().splitlines()
paths += ['assets/nino/travel-passport/book/exports/passport-closed-cover.webp']
rows = []
for path in paths:
    data = git('show',REF+':'+path)
    target = ROOT/path
    if target.exists(): assert target.read_bytes()==data, path
    else:
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(data)
    rows.append(dict(path=path,source_branch='hermes/nino-art-intake-45',source_commit=REF,sha256=hashlib.sha256(data).hexdigest()))
(ROOT/'docs/qa/nino-artwork-final/collected-exports.json').write_text(json.dumps(rows,indent=2)+'\n')
print('Exact approved Git exports:',len(rows))
