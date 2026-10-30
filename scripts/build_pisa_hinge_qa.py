#!/usr/bin/env python3
"""TOPO/NINO Pisa hinged-lid projection candidate, from already-approved masters.

Status: QA ONLY. The lid art is registered to one stationary tray, but rendering
a warped source rectangle is NOT a physically valid folded cardboard underside.
An independently approved production animation must solve lid orientation,
front-cover occlusion and a consistent camera. Original masters never changed.
Dependencies: Pillow, numpy, opencv-python (build-only, not runtime).
Usage from repository root:
  python3 scripts/build_pisa_hinge_qa.py
Outputs ignored/not committed: out/qa/pisa-hinge-20261030/.
"""
from pathlib import Path
import hashlib
import json
import math

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / "assets/nino/rewards/pizza/exports"
OUT = ROOT / "out/qa/pisa-hinge-20261030"
OUT.mkdir(parents=True,exist_ok=True)
CANVAS=1024
STOP_VALUES=[i/10 for i in range(11)]
# Rectified printed face SOURCE_TOP: the CLOSED approved master, not the
# unrelated newly generated seven-state moodboard.
SOURCE_TOP=np.float32([[312,88],[994,300],[696,872],[0,564]])
HINGE_LEFT=np.float32([328,258])
HINGE_RIGHT=np.float32([935,374])
FRONT_CLOSED_LEFT=np.float32([0,662])
FRONT_CLOSED_RIGHT=np.float32([659,960])
FRONT_OPEN_LEFT=np.float32([220,-50])
FRONT_OPEN_RIGHT=np.float32([941,118])
# Photos already contain perspective; tray mask is a QA approximation only.
TRAY_POLYGON=np.int32([[329,253],[925,368],[966,472],[836,953],
                        [649,985],[6,682],[4,600],[249,322]])

def hash_file(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def load(path):
    image=Image.open(path).convert("RGBA")
    if image.size!=(CANVAS,CANVAS):
        image=image.resize((CANVAS,CANVAS),Image.Resampling.LANCZOS)
    return np.asarray(image)

def unwarp_lid(source):
    width,height=820,510
    dest=np.float32([[0,0],[width-1,0],[width-1,height-1],[0,height-1]])
    m=cv2.getPerspectiveTransform(SOURCE_TOP,dest)
    return cv2.warpPerspective(source,m,(width,height),
        flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))

def fixed_tray(image):
    mask=np.zeros((CANVAS,CANVAS),dtype=np.uint8)
    cv2.fillPoly(mask,[TRAY_POLYGON],255)
    mask=cv2.GaussianBlur(mask,(3,3),0.6)
    out=image.copy()
    out[:,:,3]=(out[:,:,3].astype(np.float32)*mask/255).astype(np.uint8)
    return out

def over(back,fore):
    a=fore[:,:,3:4].astype(np.float32)/255
    b=back[:,:,3:4].astype(np.float32)/255
    alpha=a+b*(1-a)
    rgb=(fore[:,:,:3]*a+back[:,:,:3]*b*(1-a))/np.maximum(alpha,1e-5)
    return np.dstack((rgb.clip(0,255),alpha[:,:,0]*255)).astype(np.uint8)

def render(tray,texture,t):
    progress=(1-math.cos(math.pi*t))/2
    front_left=(1-progress)*FRONT_CLOSED_LEFT+progress*FRONT_OPEN_LEFT
    front_right=(1-progress)*FRONT_CLOSED_RIGHT+progress*FRONT_OPEN_RIGHT
    quad=np.float32([HINGE_LEFT,HINGE_RIGHT,front_right,front_left])
    h,w=texture.shape[:2]
    rect=np.float32([[0,0],[w-1,0],[w-1,h-1],[0,h-1]])
    transform=cv2.getPerspectiveTransform(rect,quad)
    lid=cv2.warpPerspective(texture,transform,(CANVAS,CANVAS),
        flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
    return over(tray,lid),[front_left.tolist(),front_right.tolist()]

def main():
    original=BASE/"pizza-box-closed-pisa.webp"
    flavors=["margherita","salami","quattro-formaggi"]
    sources={f: BASE / ("pizza-box-open-pisa-"+f+".webp") for f in flavors}
    if not original.exists() or not all(p.exists() for p in sources.values()):
        raise SystemExit("Missing canonical Pisa masters in assets/nino/rewards/pizza/exports")
    top=unwarp_lid(load(original))
    Image.fromarray(top).save(OUT/"lid-registered-preview.png")
    frames=[]
    for flavor,source in sources.items():
        tray=fixed_tray(load(source))
        Image.fromarray(tray).save(OUT/f"tray-{flavor}-preview.png")
        for idx,t in enumerate(STOP_VALUES):
            frame,front=render(tray,top,t)
            path=OUT/f"pisa-{flavor}-hinge-{idx:02d}.webp"
            Image.fromarray(frame).save(path,format="WEBP",quality=84,method=1)
            frames.append({"flavor":flavor,"stop":idx,"t":t,
                "file":path.name,"sha256":hash_file(path),"free_edge":front})
    report={"status":"QA_CANDIDATE_NOT_PRODUCTION_READY",
        "blocking_defects":[
          "Some intermediate lid orientations invert the Pisa printing",
          "Pizza becomes visible around the lid before a realistic opening",
          "No real registered underside, lid-thickness and rear-flap occlusion",
          "Flattened original open and closed photos differ in camera/perspective"],
        "master_closed_sha256":hash_file(original),
        "source_sha256":{name:hash_file(path) for name,path in sources.items()},
        "canvas":[CANVAS,CANVAS],"hinge_left":HINGE_LEFT.tolist(),
        "hinge_right":HINGE_RIGHT.tolist(),
        "frames":frames}
    (OUT/"qa-manifest.json").write_text(json.dumps(report,indent=2)+"\n")
    print(f"Generated {len(frames)} QA candidate frames in {OUT}")
    print("NOT release-approved; keep static original box fallback.")

if __name__=="__main__":
    main()
