#!/usr/bin/env python3
"""Repeatable boundary/integrity checks; visual decisions remain human review."""
import hashlib,json,subprocess
from pathlib import Path
from PIL import Image
import numpy as np
R=Path(__file__).resolve().parents[1];O=R/'docs/qa/artwork-45';S='367b875c83a4e8b77c1f1d09523c20c96364f178'
def sha(b):return hashlib.sha256(b).hexdigest()
def original(p):return subprocess.check_output(['git','show',S+':'+p],cwd=R)
i=json.loads((O/'binary-inventory.json').read_text());a=json.loads((O/'production-allowlist.json').read_text());l=json.loads((O/'asset-ledger.json').read_text())
assert len(i['files'])==46 and sum(x['hash_match']is True for x in i['files'])==35 and not any(x['hash_match']is False for x in i['files'])
for x in i['files']:assert sha((R/x['path']).read_bytes())==x['sha256']==sha(original(x['path'])),x['path']
for x in a['entries']:
 assert sha((R/x['path']).read_bytes())==x['sha256'];im=Image.open(R/x['path']);im.load();assert list(im.size)==x['dimensions']
 if x['category']=='chapter-stamp':assert(R/x['path']).read_bytes()==(R/x['source']).read_bytes()
 if x['category']=='book-cover':assert np.array_equal(np.array(im.convert('RGBA')),np.array(Image.open(R/x['source']).convert('RGBA')))
assert len(a['entries'])==22 and {x['path']for x in a['entries']}=={x['path']for x in l['files']if x['ship_this_path']}
protected=['index.html','scripts/learning-engine.js','scripts/route-engine.js','output/html/topo-italie-interactief.html','output/html/topo-italie-duolingo.html','print.html','output/pdf/topo-italie-printboek.pdf','package.json','package-lock.json']
proof={}
for p in protected:
 b=(R/p).read_bytes();assert b==original(p),p;proof[p]=sha(b)
report={'source_revision':S,'supplied_files_unchanged':46,'manifest_hash_matches':35,'mismatch':0,'allowlisted_files_verified':22,'stamp_copy_roundtrips':10,'cover_decoded_RGBA_exact':True,'protected_app_files_unchanged':proof,'visual_scope':'separate reviewed ledger; not gameplay/Safari approval'}
(O/'verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k!='protected_app_files_unchanged'},indent=2))
