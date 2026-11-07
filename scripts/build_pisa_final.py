#!/usr/bin/env python3
"""Deterministic registered hinge derivative; approved image bytes are read-only.

Python 3.8, Pillow 10.4.0, numpy 1.24.4, opencv-python-headless 4.10.0.84.
No generated illustration. Hidden cardboard is explicitly a derived surface.
"""
import hashlib, json, math
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT/'assets/nino/rewards/pizza/exports'
OUT = ROOT/'assets/nino/rewards/pizza/hinge-review'
for directory in ('layers', 'textures', 'motion', 'proof'):
    (OUT/directory).mkdir(parents=True, exist_ok=True)
FLAVORS = ('margherita', 'salami', 'quattro-formaggi')
EXPECTED = {
    'pizza-box-closed-pisa.webp': '6e47559c8eea4932fa4516fea324ee85fbe386ab7c3df26034f820a8c4860d3c',
    'pizza-box-open-pisa-margherita.webp': '742a5d39843dc84b6a8b781678edcb3ce6643a60bde1c8ae67c1e0567125f7d7',
    'pizza-box-open-pisa-salami.webp': '9f3795b47f6b60a975f3f83af6edb07981739cc2a55c0d4de1b7cb66f2b184aa',
    'pizza-box-open-pisa-quattro-formaggi.webp': '1b317d38980873756276ffaedeca3843a30c386233e83ecf846a1563f99903b2'}
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
for name, expected in EXPECTED.items():
    assert sha(SRC/name) == expected, name
refs = {f: np.array(Image.open(SRC/f'pizza-box-open-pisa-{f}.webp').convert('RGBA')) for f in FLAVORS}
closed = np.array(Image.open(SRC/'pizza-box-closed-pisa.webp').convert('RGBA'))
W = 1254
SCALE = .8
OFFSET = np.array([180, 370])
def save(im, name): im.save(OUT/name, compress_level=7)
def mask(points):
    result = np.zeros((960,960), np.uint8)
    cv2.fillPoly(result, [np.array(points, np.int32)], 255)
    return result
def registered(arr):
    im = Image.fromarray(arr, 'RGBA').resize((768,768), Image.Resampling.LANCZOS)
    result = Image.new('RGBA', (W,W))
    result.alpha_composite(im, tuple(OFFSET))
    return result

# Exact shared plane: rear hinge BL/BR, front FR/FL. These are the tray's
# upper seating edges, not its lower silhouette. No post-projection translation.
seat = np.float32([[326,251],[940,440],[644,914],[12,599]])
world = np.float32([[-.5,.5],[.5,.5],[.5,-.5],[-.5,-.5]])
ground = cv2.getPerspectiveTransform(world, seat)
# A single projective camera for all faces. The fourth column is the vertical
# vanishing direction. Calibrated to this illustration, not claimed surveyed 3D.
vertical = np.array([0., -650., -.12])
def project(points):
    a = np.asarray(points, dtype=float)
    p = np.column_stack([a[:,:2], np.ones(len(a))]) @ ground.T + a[:,2,None]*vertical
    return (p[:,:2]/p[:,2,None])*SCALE + OFFSET
def corners(angle, depth=0):
    t = math.radians(angle)
    return project([[-.5,.5+depth*math.sin(t),depth*math.cos(t)],
                    [.5,.5+depth*math.sin(t),depth*math.cos(t)],
                    [.5,.5-math.cos(t)+depth*math.sin(t),math.sin(t)+depth*math.cos(t)],
                    [-.5,.5-math.cos(t)+depth*math.sin(t),math.sin(t)+depth*math.cos(t)]])
uv = np.float32([[0,0],[799,0],[799,799],[0,799]])
source_print = np.float32([[316,84],[941,291],[704,783],[22,562]])
exterior = cv2.warpPerspective(closed, cv2.getPerspectiveTransform(source_print,uv), (800,800), flags=cv2.INTER_CUBIC)
exterior[:,:,3] = 255
save(Image.fromarray(exterior), 'textures/lid-exterior-original-uv.png')
# Hidden inner face samples real unprinted cardboard. Tiled source patch is a
# reconstruction, never described as recovered original artwork.
patch = refs['margherita'][665:685,80:100,:3]
interior = np.tile(patch,(40,40,1))
interior = np.dstack([interior,np.full((800,800),255,np.uint8)])
save(Image.fromarray(interior), 'textures/lid-interior-derived-uv.png')

# Retain each complete approved flavor floor/tray below the rear hinge.
# This avoids a shared Margherita floor or crust overwriting another flavor.
tray_mask = mask([[326,251],[928,440],[945,500],[648,959],[619,959],[7,672],[0,586]])
trays = {}
for flavor, arr in refs.items():
    a = arr.copy(); a[:,:,3] = np.minimum(a[:,:,3], tray_mask)
    trays[flavor] = registered(a)
    save(trays[flavor], f'layers/tray-and-original-pizza-{flavor}.png')

# Cardboard-only front: follow the outer lip BELOW the entire crust and notch.
# The narrow conservative mask excludes the interior and all pizza pixels.
foreground_mask = mask([[18,626],[254,756],[275,784],[304,798],[333,793],
                        [526,899],[547,889],[627,931],[625,948],[18,668]])
fg = refs['margherita'].copy(); fg[:,:,3] = np.minimum(fg[:,:,3], foreground_mask)
front = registered(fg)
save(front, 'layers/front-cardboard-only.png')
save(registered(np.dstack([np.zeros((960,960,3),np.uint8),foreground_mask])), 'layers/front-mask.png')

def lid(angle):
    pts = corners(angle).astype(np.float32)
    area = cv2.contourArea(pts, oriented=True)
    texture = exterior if area > 0 else interior
    face = Image.fromarray(cv2.warpPerspective(texture,cv2.getPerspectiveTransform(uv,pts),(W,W),flags=cv2.INTER_LINEAR))
    # Finite cardboard edge surfaces, sharing the same rear hinge and camera.
    lower = corners(angle, -.065)
    edges = Image.new('RGBA',(W,W)); d = ImageDraw.Draw(edges)
    for a,b in ((1,2),(2,3),(3,0)):
        d.polygon([tuple(pts[a]),tuple(pts[b]),tuple(lower[b]),tuple(lower[a])],fill=(133,89,54,255))
    edges.alpha_composite(face)
    d = ImageDraw.Draw(edges)
    d.line([tuple(pts[0]),tuple(pts[1])],fill=(112,72,42,255),width=3)
    return edges
def frame(flavor, angle):
    im = trays[flavor].copy()
    im.alpha_composite(front)
    im.alpha_composite(lid(angle))
    return im
save(lid(0), 'layers/lid-closed-registered.png')
save(lid(70), 'layers/lid-open-registered.png')
angles = [70*(1-(1-i/23)**3) for i in range(24)]
time_samples = [0,6,12,18,23]
contact = Image.new('RGB',(1800,1140),(246,238,222)); draw = ImageDraw.Draw(contact)
for row, flavor in enumerate(FLAVORS):
    frames = [frame(flavor,a) for a in angles]
    frames[0].save(OUT/f'motion/pisa-{flavor}.webp',save_all=True,append_images=frames[1:],duration=54,loop=1,lossless=True,method=4,exact=True)
    for column, index in enumerate(time_samples):
        save(frames[index],f'proof/{flavor}-time-{column*25:03}.png')
        tile = frames[index].resize((340,340),Image.Resampling.LANCZOS)
        contact.paste(tile,(column*360,row*380+25),tile)
        draw.text((column*360+8,row*380+5),f'{flavor} | frame {index} | {angles[index]:.1f} deg',fill=(45,35,25))
save(contact,'proof/contact-sheet.png')
manifest = dict(source_branch='art/nino-pizza-rewards-20261024',source_commit='bf91fb3fa6ac553f78b33169efa9f2bf60e215ca',source_sha256=EXPECTED,
                status='REVIEW REQUIRED; independent Hermes and owner visual acceptance pending',
                canvas=[W,W],source_scale=SCALE,source_offset=OFFSET.tolist(),seat_source=seat.tolist(),
                ground_homography=ground.tolist(),vertical_column=vertical.tolist(),hinge=corners(0)[:2].tolist(),
                angles=angles,proof_frame_indices=time_samples,duration_ms=1296,frame_duration_ms=54,
                compositing_order=['flavor tray with original pizza','cardboard-only foreground','physical lid and edge surfaces'],
                limitations=['Hidden underside is a tiled approved cardboard patch, not original hidden artwork.',
                             'Common-camera projective reconstruction requires native visual acceptance.',
                             'No live app integration; existing static fallback untouched.'])
manifest['files'] = {str(p.relative_to(OUT)):dict(sha256=sha(p),bytes=p.stat().st_size) for p in sorted(OUT.rglob('*')) if p.is_file() and p.name!='manifest.json'}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Built registered Pisa review assets:', OUT)
