#!/usr/bin/env python3
"""TOPO V3 — chapter scenes for the style image (stijlbeeld).

Copies the eight #75 chapter scenes byte-for-byte from commit 8a704cb into assets/v3/scenes/ and cuts a
480×270 miniature on the landscape, without Nino (crop boxes below, as fractions of the 1672×941 scene).
Writes assets/v3/scenes/manifest.json with source, SHA256, size and crop. No new imagery is generated.
Needs Pillow with WebP support:  python3 scripts/build-v3-scenes.py
"""
import hashlib, io, json, subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/v3/scenes'
SOURCE_COMMIT = '8a704cb23da97baf7197635df7fa12f06b864a24'
# chapter id → (#75 scene, crop x0, y0, width) — fractions of the scene; height follows from 16:9.
SCENES = {
    'city1':     ('topo-steden-firenze',         .40, .03, .60),
    'islands':   ('topo-eilanden-v2',            .20, .08, .40),
    'mountains': ('topo-bergen-dolomieten',      .04, .00, .56),
    'volcanoes': ('topo-vulkanen-etna',          .00, .00, .58),
    'regions':   ('topo-streken-toscana',        .45, .05, .55),
    'countries': ('topo-landen-italie-slovenie', .42, .00, .58),
    'seas':      ('topo-zeeen-amalfi',           .33, .00, .67),
    'rivers':    ('topo-rivieren-po',            .00, .08, .55),
}
THUMB = (480, 270)
sha = lambda b: hashlib.sha256(b).hexdigest()

OUT.mkdir(parents=True, exist_ok=True)
entries = {}
for chapter, (name, fx, fy, fw) in SCENES.items():
    src_path = f'assets/nino/exports/{name}.webp'
    data = subprocess.run(['git', 'show', f'{SOURCE_COMMIT}:{src_path}'], cwd=ROOT, check=True, capture_output=True).stdout
    (OUT / f'{name}.webp').write_bytes(data)
    im = Image.open(io.BytesIO(data)).convert('RGB')
    W, H = im.size
    w = round(W * fw); h = round(w * 9 / 16); x = round(W * fx); y = round(H * fy)
    assert x + w <= W and y + h <= H, (name, x, y, w, h)
    thumb = im.crop((x, y, x + w, y + h)).resize(THUMB, Image.LANCZOS)
    buf = io.BytesIO(); thumb.save(buf, 'WEBP', quality=74, method=6); tb = buf.getvalue()
    assert len(tb) <= 40_000, (name, len(tb))
    (OUT / f'{name}-mini.webp').write_bytes(tb)
    entries[chapter] = {
        'scene': {'path': f'assets/v3/scenes/{name}.webp', 'sha256': sha(data), 'bytes': len(data), 'width': W, 'height': H,
                  'source': f'{SOURCE_COMMIT[:7]}:{src_path}', 'note': '#75 chapter scene, byte-identical copy'},
        'mini': {'path': f'assets/v3/scenes/{name}-mini.webp', 'sha256': sha(tb), 'bytes': len(tb), 'width': THUMB[0], 'height': THUMB[1],
                 'crop': {'x': x, 'y': y, 'width': w, 'height': h}, 'note': 'landscape without Nino, cut from the scene'},
    }
manifest = {
    'title': 'TOPO V3 chapter scenes (stijlbeeld)',
    'status': 'stijlbeeld — eigenaar open; Hermes QA open',
    'sourceCommit': SOURCE_COMMIT,
    'maker': 'scenes: #75 (see assets/nino in 8a704cb); miniatures: scripts/build-v3-scenes.py',
    'date': '2026-11-09',
    'missing': {'city2': 'chapter icon (temporary)', 'city3': 'chapter icon (temporary)', 'city4': 'chapter icon (temporary)'},
    'chapters': entries,
}
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + '\n')
for k, v in entries.items(): print(k, v['mini']['bytes'], v['mini']['sha256'][:12])
