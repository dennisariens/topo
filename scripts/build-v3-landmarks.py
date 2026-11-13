#!/usr/bin/env python3
"""Verify pinned art/master PNGs and export the V3 landmarks (01–10) and lifestyle icons (11–16), without cropping/repainting."""
import hashlib
import io
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/v3/landmarks'
PIN = 'daa188fad9966329805ed7912d64d2fc221b4dd5'  # art/master: TOPO_11 Ferrari included; 11–16 lifestyle in use in V3.0 (owner 12/13-11)
MASTER_ROOT = 'assets/art/masters/italia/landmarks/'
sha = lambda data: hashlib.sha256(data).hexdigest()


def git_bytes(path):
    return subprocess.check_output(['git', 'show', f'{PIN}:{path}'], cwd=ROOT)


def main():
    raw_manifest = git_bytes(MASTER_ROOT + 'MANIFEST.json')
    masters = json.loads(raw_manifest)
    assert {a['id'] for a in masters} == set(range(1, 17))
    locations = json.loads((OUT / 'locations.json').read_text())
    assert set(locations['items']) == {f'TOPO_{i:02}' for i in range(1, 17)}
    exports_dir = OUT / 'exports'
    exports_dir.mkdir(exist_ok=True)
    items = []
    for master in masters:
        number = master['id']
        key = f'TOPO_{number:02}'
        data = git_bytes(MASTER_ROOT + master['filename'])
        assert sha(data) == master['sha256'], key
        image = Image.open(io.BytesIO(data))
        assert image.size == (1024, 1024) and image.mode == 'RGBA', key
        entry = {
            'id': key, 'label': master['name'],
            'status': 'V3.0 reliëfkaart' if number <= 10 else 'in gebruik V3.0',
            'ui': True,
            'lifestyle': number >= 11,
            'master': {'path': MASTER_ROOT + master['filename'], 'sha256': sha(data),
                       'bytes': len(data), 'size': list(image.size), 'alpha': True},
        }
        # Pisa and Florence are geographically close: reduce ink size, never move their anchors. Lifestyle icons
        # are sized at run time (ronde 5 punt 7: ±32/28 px, smaller than the landmarks).
        if number <= 10:
            entry['paintSize'] = 26 if number in (2, 7) else 34
        entry['location'] = locations['items'][key]
        entry['exports'] = {}
        for size in (128, 256):
            scaled = image.resize((size, size), Image.Resampling.LANCZOS)
            buffer = io.BytesIO()
            scaled.save(buffer, 'WEBP', quality=88, method=6, exact=True)
            output = buffer.getvalue()
            path = exports_dir / f'{key}-{size}.webp'
            path.write_bytes(output)
            decoded = Image.open(io.BytesIO(output)).convert('RGBA')
            bounds = decoded.getchannel('A').point(lambda a: 255 if a >= 16 else 0).getbbox()
            assert bounds
            entry['exports'][str(size)] = {
                'path': str(path.relative_to(ROOT)), 'sha256': sha(output),
                'bytes': len(output), 'size': [size, size], 'alpha': True,
                'paintBounds': list(bounds),
            }
        if number == 12:
            entry['visualReview'] = {
                'logos': 'No visible logos or lettering in the 1024px master.',
                'clubColours': 'Red/black seating: not certified as club-neutral; in use by owner decision (12-11).',
                'uiBlocked': False,
            }
        if number == 11:
            entry['visualReview'] = {'logos': 'Owner 13-11: included without badge or logo (art/master daa188f).'}
        items.append(entry)
    manifest = {
        'version': 2,
        'source': {'repository': 'dennisariens/topo', 'ref': 'art/master', 'commit': PIN,
                   'path': MASTER_ROOT + 'MANIFEST.json', 'sha256': sha(raw_manifest)},
        'pipeline': {'script': 'scripts/build-v3-landmarks.py', 'pillow': Image.__version__,
                     'resize': 'Lanczos; preserve full frame and alpha; no recolouring or crop',
                     'webp': {'sizes': [128, 256], 'quality': 88, 'method': 6, 'exact': True}},
        'scope': 'TOPO_01–10 on Reis/toetsresultaat in relief mode; lifestyle TOPO_11–16 on the Reis map (per chapter) and once on '
                 'toetsresultaat ≥ 8/10, Voortgang 45/45 and the Vespa ride; never in lessons, exam questions, Gouden proef or picker.',
        'excluded': [],
        'supersedes': {'path': 'assets/v3/landmarks/italia-landmarks-atlas.png',
                       'commit': '23133b7a43ed2c68c91c7c9a8a10772e4c984efb'},
        'items': items,
    }
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(items)} verified masters; {2 * len(items)} WebP exports; TOPO_11–16 lifestyle in use.')


if __name__ == '__main__':
    main()
