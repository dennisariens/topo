#!/usr/bin/env python3
"""Verify pinned art/master PNGs and export active V3 landmarks, without cropping/repainting."""
import hashlib
import io
import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/v3/landmarks'
PIN = '69c945c16a8bd34c8e45cffa96c12442c2672cb1'
MASTER_ROOT = 'assets/art/masters/italia/landmarks/'
sha = lambda data: hashlib.sha256(data).hexdigest()


def git_bytes(path):
    return subprocess.check_output(['git', 'show', f'{PIN}:{path}'], cwd=ROOT)


def main():
    raw_manifest = git_bytes(MASTER_ROOT + 'MANIFEST.json')
    masters = json.loads(raw_manifest)
    assert {a['id'] for a in masters} == set(range(1, 11)) | set(range(12, 17))
    locations = json.loads((OUT / 'locations.json').read_text())
    assert set(locations['items']) == {f'TOPO_{i:02}' for i in range(1, 11)}
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
            'status': 'V3.0 reliëfkaart' if number <= 10 else 'V3.1 uitstapjes',
            'ui': number <= 10,
            'master': {'path': MASTER_ROOT + master['filename'], 'sha256': sha(data),
                       'bytes': len(data), 'size': list(image.size), 'alpha': True},
        }
        if number <= 10:
            # Pisa and Florence are geographically close: reduce ink size, never move their anchors.
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
                'clubColours': 'OPEN: red/black seating; do not certify neutral club colours.',
                'uiBlocked': True,
            }
        items.append(entry)
    manifest = {
        'version': 2,
        'source': {'repository': 'dennisariens/topo', 'ref': 'art/master', 'commit': PIN,
                   'path': MASTER_ROOT + 'MANIFEST.json', 'sha256': sha(raw_manifest)},
        'pipeline': {'script': 'scripts/build-v3-landmarks.py', 'pillow': Image.__version__,
                     'resize': 'Lanczos; preserve full frame and alpha; no recolouring or crop',
                     'webp': {'sizes': [128, 256], 'quality': 88, 'method': 6, 'exact': True}},
        'scope': 'Only TOPO_01–10 on Reis/toetsresultaat in relief mode; never in lessons.',
        'excluded': [{'id': 'TOPO_11', 'reason': 'Ferrari brand; removed from art/master.'}],
        'supersedes': {'path': 'assets/v3/landmarks/italia-landmarks-atlas.png',
                       'commit': '23133b7a43ed2c68c91c7c9a8a10772e4c984efb'},
        'items': items,
    }
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(items)} verified masters; 20 WebP exports; TOPO_12–16 manifest-only; TOPO_11 excluded.')


if __name__ == '__main__':
    main()
