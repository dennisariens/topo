"""Issue 45 bounded icon QA: read assets, write only icons-* evidence files."""
from pathlib import Path
import hashlib, json, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageCms
import io
ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).parent
PIN = '367b875c83a4e8b77c1f1d09523c20c96364f178'
assert subprocess.check_output(['git','rev-parse','HEAD'], cwd=ROOT, text=True).strip() == PIN
mp = ROOT/'assets/nino/chapter-icons/manifest.json'
manifest = json.loads(mp.read_text())
assets = manifest['assets']
assert len(assets) == len({a['id'] for a in assets}) == 11
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
records = []
for a in assets:
    rec = {'id':a['id'], 'title':a['title'], 'upstream_source_sha256_manifest_only':a['source_sha256'], 'files':{}}
    for kind, key, hashkey, dim, fmt in [('master','png_path','png_sha256',1254,'PNG'),('export','webp_512_path','webp_512_sha256',512,'WEBP')]:
        p=ROOT/a[key]
        with Image.open(p) as im:
            im.load(); ar=np.array(im.convert('RGBA')); alpha=ar[:,:,3]
            icc=im.info.get('icc_profile')
            profile=ImageCms.getProfileName(ImageCms.ImageCmsProfile(io.BytesIO(icc))).strip() if icc else None
            rec['files'][kind]={'path':a[key], 'sha256':sha(p), 'manifest_sha256':a[hashkey], 'hash_matches':sha(p)==a[hashkey], 'mode':im.mode, 'dimensions':list(im.size), 'format':im.format, 'icc_profile_bytes':len(icc) if icc else 0, 'icc_profile_name':profile, 'srgb_chunk':im.info.get('srgb'), 'gamma':im.info.get('gamma'), 'alpha_bbox':list(im.getchannel('A').getbbox() or (0,0,0,0)), 'alpha_min':int(alpha.min()), 'alpha_max':int(alpha.max()), 'alpha_1_15_pixels':int(((alpha>0)&(alpha<16)).sum()), 'nonzero_outer_edge_pixels':int(np.count_nonzero(alpha[0,:])+np.count_nonzero(alpha[-1,:])+np.count_nonzero(alpha[1:-1,0])+np.count_nonzero(alpha[1:-1,-1])), 'outer_edge_alpha_max':int(max(alpha[0,:].max(),alpha[-1,:].max(),alpha[:,0].max(),alpha[:,-1].max())), 'outer_edge_alpha_16_plus_pixels':int((alpha[0,:]>=16).sum()+(alpha[-1,:]>=16).sum()+(alpha[1:-1,0]>=16).sum()+(alpha[1:-1,-1]>=16).sum()), 'technical_pass':sha(p)==a[hashkey] and im.mode=='RGBA' and im.size==(dim,dim) and im.format==fmt}
    records.append(rec)
report={'revision':PIN,'manifest_sha256':sha(mp),'scope':'11 repository PNG masters and 11 existing WebP exports. Upstream originals not supplied by this manifest path; upstream hashes are claims, not verified bytes. Existing GO metadata excluded from decisions.', 'profile_policy':'Absent embedded ICC/sRGB/gamma metadata is recorded, not proof of sRGB conversion; ordinary web untagged-sRGB interpretation assumed for these renders.', 'icons':records}
(OUT/'icons-technical.json').write_text(json.dumps(report,indent=2)+'\n')
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',14)
small=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',12)
def background(size,name):
    im=Image.new('RGBA',size, {'warm':'#f5ead6','dark':'#17252b','checker':'#eeeeee'}[name])
    if name=='checker':
        d=ImageDraw.Draw(im)
        for y in range(0,size[1],8):
            for x in range(0,size[0],8):
                if (x//8+y//8)%2: d.rectangle((x,y,x+7,y+7), fill='#b9b9b9')
    return im
for bg in ['warm','dark','checker']:
    board=Image.new('RGB',(930,11*140+65),'#ffffff'); d=ImageDraw.Draw(board)
    d.text((12,8),f'Issue 45 | {bg} | direct master downsamples LEFT; existing 512 WebP downsamples RIGHT',font=font,fill='black')
    for base in (215,570):
        for x,s in zip((0,58,132,222),(32,48,64,96)): d.text((base+x,35),str(s)+'px',font=small,fill='black')
    for i,a in enumerate(assets):
        y=65+i*140
        d.text((10,y+15),a['id'],font=font,fill='black'); d.text((10,y+38),a['title'],font=small,fill='black')
        for base,key in [(215,'png_path'),(570,'webp_512_path')]:
            for dx,s in zip((0,58,132,222),(32,48,64,96)):
                tile=background((s+12,112),bg)
                with Image.open(ROOT/a[key]) as im: reduced=im.convert('RGBA').resize((s,s),Image.Resampling.LANCZOS)
                tile.alpha_composite(reduced,(6,(112-s)//2))
                board.paste(tile.convert('RGB'),(base+dx,y))
        d.line((0,y+132,929,y+132),fill='#cccccc')
    board.save(OUT/f'icons-sizes-{bg}.png')
# Larger paired overview: preserve aspect/canvas; no asset modifications.
for start,end in [(0,6),(6,11)]:
    board=Image.new('RGB',(1080,((end-start+1)//2)*315),'#ffffff'); d=ImageDraw.Draw(board)
    for n,a in enumerate(assets[start:end]):
        x=(n%2)*540; y=(n//2)*315
        d.text((x+8,y+6),a['id']+' | PNG / WebP',font=font,fill='black')
        for off,key in [(8,'png_path'),(276,'webp_512_path')]:
            tile=background((256,276),'dark')
            with Image.open(ROOT/a[key]) as im: tile.alpha_composite(im.convert('RGBA').resize((256,256),Image.Resampling.LANCZOS),(0,10))
            board.paste(tile.convert('RGB'),(x+off,y+28))
    board.save(OUT/f'icons-overview-{start+1:02d}-{end:02d}.png')
print(json.dumps({'count':len(records),'files_checked':sum(len(r['files']) for r in records),'all_technical_pass':all(f['technical_pass'] for r in records for f in r['files'].values()),'profiles':sorted({str(f['icc_profile_name']) for r in records for f in r['files'].values()}),'edges':{r['id']:{k:f['nonzero_outer_edge_pixels'] for k,f in r['files'].items()} for r in records}},indent=2))
