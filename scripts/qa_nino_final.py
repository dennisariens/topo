#!/usr/bin/env python3
"""Audit delivered image bytes and all actual encoded Pisa frames."""
import hashlib,json,subprocess
from pathlib import Path
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/qa/nino-artwork-final'
PISA=ROOT/'assets/nino/rewards/pizza/hinge-review'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
manifest=json.loads((PISA/'manifest.json').read_text())
for name,row in manifest['files'].items():
    assert sha(PISA/name)==row['sha256'],name
images=[]
for path in sorted((ROOT/'assets/nino').rglob('*')):
    if path.suffix.lower() not in ('.png','.webp','.ico','.jpg'):continue
    im=Image.open(path); im.load(); a=im.convert('RGBA').getchannel('A')
    images.append(dict(path=str(path.relative_to(ROOT)),sha256=sha(path),dimensions=list(im.size),alpha_range=list(a.getextrema()),frames=getattr(im,'n_frames',1)))
motions=[]
for flavor in ('margherita','salami','quattro-formaggi'):
    path=PISA/f'motion/pisa-{flavor}.webp'; im=Image.open(path)
    durations=[]; decoded=[]; edge_contacts=[]
    assert im.n_frames==24
    for index in range(im.n_frames):
        im.seek(index); im.load(); frame=im.convert('RGBA')
        durations.append(im.info['duration']); decoded.append(hashlib.sha256(frame.tobytes()).hexdigest())
        alpha=np.asarray(frame)[:,:,3]
        edge_contacts.append(int(np.count_nonzero(np.concatenate([alpha[0],alpha[-1],alpha[:,0],alpha[:,-1]]))))
        if index in manifest['proof_frame_indices']:
            n=manifest['proof_frame_indices'].index(index)
            proof=Image.open(PISA/f'proof/{flavor}-time-{n*25:03}.png').convert('RGBA')
            # Lossless animation may normalize invisible RGB; visible bytes and alpha must match.
            aa=np.asarray(frame);bb=np.asarray(proof)
            assert np.array_equal(aa[:,:,3],bb[:,:,3])
            assert np.array_equal(aa[aa[:,:,3]>0],bb[bb[:,:,3]>0])
    assert durations==[54]*24 and not any(edge_contacts)
    assert len(set(decoded))==24
    motions.append(dict(flavor=flavor,frames=24,durations=durations,edge_contacts=edge_contacts,decoded_hashes=decoded))
preserved=[]
for path in ('index.html','scripts/learning-engine.js','scripts/route-engine.js','package.json','package-lock.json'):
    old=subprocess.check_output(['git','show','2a9dda3d3d8ec567687bc3b61bf9cbde645c752c:'+path],cwd=ROOT)
    assert old==(ROOT/path).read_bytes(),path
    preserved.append(dict(path=path,sha256=sha(ROOT/path)))
result=dict(verdict='TECHNICAL PASS; visual/independent acceptance pending',images=images,motion=motions,preserved=preserved,
            limitations=['Alpha integrity and checksums do not certify physical realism or absence of source halos.',
                         'Native source silhouettes retained. Physical iPad/Safari/owner review not tested.'])
(OUT/'binary-qa.json').write_text(json.dumps(result,indent=2)+'\n')
print('PASS:',len(images),'delivered images; 72 lossless motion frames; 15 exact visible proof samples; source preservation')
