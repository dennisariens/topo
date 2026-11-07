#!/usr/bin/env python3
"""Build an immutable review ZIP with fixed timestamps and per-member hashes.

Run after committing the producing sources. ZIP does not contain itself.
"""
import hashlib,json,subprocess,zipfile
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
QA=ROOT/'docs/qa/nino-artwork-final'
def sha(data):return hashlib.sha256(data).hexdigest()
inventory=json.loads((ROOT/'docs/qa/nino-v2-closure-67/artwork-manifest.json').read_text())
exports=[ROOT/r['path'] for r in inventory['assets'] if r['delivery_present'] and (r['delivered_export'] or r['integration_status']=='EMBEDDED')]
# Category contact sheets show actual delivered art, not fictional reward UI.
for category, fragment in [('chapters','/chapter-icons/'),('passport','/book/'),('stamps','/stamps/'),('gold','/gold/'),('postcards','/postcards/'),('micro','/micro-v2/'),('arrival','/arrivo/')]:
    paths=[p for p in exports if fragment in str(p) and p.suffix in ('.png','.webp')]
    sheet=Image.new('RGB',(1000,max(1,(len(paths)+3)//4)*220),(246,238,222));draw=ImageDraw.Draw(sheet)
    for i,p in enumerate(paths):
        image=Image.open(p).convert('RGBA');image.thumbnail((230,180),Image.Resampling.LANCZOS)
        x=(i%4)*250;y=(i//4)*220
        sheet.paste(image,(x+(250-image.width)//2,y),image)
        draw.text((x+5,y+182),p.name[:34],fill=(45,35,25))
    sheet.save(QA/f'contact-{category}.png')
files=set(exports)
files.update(p for p in (ROOT/'assets/nino/rewards/pizza/hinge-review').rglob('*') if p.is_file())
files.update(p for p in QA.rglob('*') if p.is_file() and p.name not in ('package-manifest.json','ZIP-SHA256.txt'))
files.update(ROOT/p for p in ['docs/qa/NINO_ARTWORK_FINAL_CLOSEOUT.md','docs/qa/nino-v2-closure-67/artwork-manifest.json','docs/qa/nino-v2-closure-67/artwork-manifest.csv',
                             'scripts/build_pisa_final.py','scripts/collect_nino_final_exports.py','scripts/close-nino-artwork-67.py',
                             'scripts/inventory-nino-artwork-67.py','scripts/build_venezia_postcard.py','scripts/qa_nino_final.py','scripts/qa-nino-final-browser.mjs','scripts/package_nino_final.py'])
source=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT).decode().strip()
manifest=dict(producing_commit=source,status='REVIEW REQUIRED; NOT FINAL / LOCKED',
              note='Package commit and exact review SHA are pinned by the draft PR. No archive can contain its own Git SHA or checksum.',
              files={str(p.relative_to(ROOT)):dict(sha256=sha(p.read_bytes()),bytes=p.stat().st_size) for p in sorted(files)})
manifest_path=QA/'package-manifest.json'
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n');files.add(manifest_path)
archive=ROOT/'NINO_ARTWORK_FINAL_REVIEW.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in sorted(files):
        entry=zipfile.ZipInfo(str(p.relative_to(ROOT)),date_time=(2026,11,7,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED;entry.external_attr=0o100644<<16
        z.writestr(entry,p.read_bytes())
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    for name,row in manifest['files'].items():assert sha(z.read(name))==row['sha256'],name
(QA/'ZIP-SHA256.txt').write_text(sha(archive.read_bytes())+'  '+archive.name+'\n')
print('Verified ZIP:',archive.stat().st_size,'bytes;',len(files),'files;',sha(archive.read_bytes()))
