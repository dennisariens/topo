#!/usr/bin/env python3
"""Deterministic source-preserving exports authorized by issue67 / Hermes9e58e756.

Requires Pillow10.4.0. Never edits masters; records invisible RGB codec changes.
"""
import hashlib
import io
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
BASE = '1bf86b3e1c69319bed8ef877243070a64d97a12e'
ART = '8a704cb23da97baf7197635df7fa12f06b864a24'
QA = '9e58e756f124ff37d47b4ebcfd274684125d8aeb'
OUT = ROOT / 'docs/qa/nino-v2-closure-67'
OUT.mkdir(parents=True, exist_ok=True)

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)

def digest(data):
    return hashlib.sha256(data).hexdigest()

prior = json.loads(git('show', QA+':docs/qa/artwork-20261029/hermes-final/final-asset-ledger.json'))
accepted = {r['path']: r for r in prior['assets']}
exports = []

def source_bytes(path):
    file=ROOT/path
    data=file.read_bytes() if file.is_file() else git('show', ART+':'+path)
    if path in accepted:
        assert digest(data)==accepted[path]['sha256'], path
    return data

def export(source, destination, width=None):
    src = ROOT / source
    data=source_bytes(source)
    original = Image.open(io.BytesIO(data)).convert('RGBA')
    im = original if width is None else original.resize((width, width), Image.Resampling.LANCZOS)
    dest = ROOT / destination
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.suffix == '.png':
        if width is None:
            dest.write_bytes(data)
        else:
            im.save(dest, optimize=True)
    else:
        im.save(dest, lossless=True, method=6, exact=True)
    decoded = Image.open(dest).convert('RGBA')
    assert im.size == decoded.size
    changed = visible = 0
    for a, b in zip(im.getdata(), decoded.getdata()):
        assert a[3] == b[3], destination
        if a != b:
            changed += 1
            if a[3] > 0:
                visible += 1
    assert visible == 0, destination
    exports.append(dict(source=source, path=destination, source_sha256=digest(data),
                        sha256=digest(dest.read_bytes()), size=list(im.size),
                        alpha_exact=True, visible_RGBA_exact=True,
                        invisible_RGB_changed_pixels=changed, resampler='native' if width is None else 'Pillow RGBA LANCZOS directly from master'))

prefix = 'assets/nino/travel-passport/'
for name, widths in [('gold-chapter-seal-v2', [64,128]), ('gold-esploratore-doro', [240,480])]:
    source = prefix+'gold/masters/'+name+'.png'
    for ext in ['png','webp']:
        export(source, prefix+'gold/exports/'+name+'-native.'+ext)
        for width in widths:
            export(source, prefix+'gold/exports/'+name+'-'+str(width)+'.'+ext, width)
export(prefix+'stamps/rework/stamp-05-isole-geography-candidate.png', prefix+'stamps/exports/stamp-05-isole.webp')
export(prefix+'arrivo/qa-candidates/arrivo-travel-ink-preview.png', prefix+'arrivo/exports/arrivo-travel.webp')
for r in prior['assets']:
    path = r['path']
    if '/stamps/qa-candidates/' in path and 'stamp-05-' not in path:
        assert r['qa_verdict'] == 'PASS'
        dest = path.replace('/qa-candidates/', '/exports/').replace('-ink-preview','')
        (ROOT/dest).parent.mkdir(parents=True, exist_ok=True)
        (ROOT/dest).write_bytes(source_bytes(path))
        exports.append(dict(source=path,path=dest,sha256=digest((ROOT/dest).read_bytes()),byte_identical=True))
    elif '/book/qa-candidates/' in path:
        dest = path.replace('/qa-candidates/','/exports/')
        (ROOT/dest).parent.mkdir(parents=True, exist_ok=True)
        (ROOT/dest).write_bytes(source_bytes(path))
        exports.append(dict(source=path,path=dest,sha256=digest((ROOT/dest).read_bytes()),byte_identical=True,
                            condition='1086x1448 native; <=543 CSS px per page at DPR2; owner exception pending'))
    elif '/postcards/masters/' in path and 'venezia' not in path:
        export(path,path.replace('/masters/','/exports/').replace('.png','.webp'))
(OUT/'export-verification.json').write_text(json.dumps(dict(sourceCommit=ART, hermesReview=QA, exports=exports),indent=2)+'\n')
print('Verified',len(exports),'exports; source masters unchanged; no new illustration.')
