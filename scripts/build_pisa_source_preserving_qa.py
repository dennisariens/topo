#!/usr/bin/env python3
"""Rebuild Pisa hinge QA assets from existing approved TOPO art, without redesign."""
from PIL import Image, ImageDraw
from pathlib import Path
import numpy as np
import cv2, math, json, hashlib, zipfile

SRC=Path("assets/nino/rewards/pizza/exports")
OUT=Path("out/pisa-hinge-original-art")
for p in ("layers","motion","proof"): (OUT/p).mkdir(parents=True,exist_ok=True)
FLAVORS=("margherita","salami","quattro-formaggi")
EXPECTED={
"pizza-box-closed-pisa.webp":"6e47559c8eea4932fa4516fea324ee85fbe386ab7c3df26034f820a8c4860d3c",
"pizza-box-open-pisa-margherita.webp":"742a5d39843dc84b6a8b781678edcb3ce6643a60bde1c8ae67c1e0567125f7d7",
"pizza-box-open-pisa-salami.webp":"9f3795b47f6b60a975f3f83af6edb07981739cc2",
"pizza-box-open-pisa-quattro-formaggi.webp":"1b317d38980873756276ffaedeca3843a30c386233e83ecf846a1563f99903b2"}
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
for fn,hash_expected in EXPECTED.items():
    assert digest(SRC/fn)==hash_expected, "Approved source changed: "+fn
refs={k:Image.open(SRC/f"pizza-box-open-pisa-{k}.webp").convert("RGBA") for k in FLAVORS}
closed=Image.open(SRC/"pizza-box-closed-pisa.webp").convert("RGBA")
assert all(i.size==(960,960) for i in [closed,*refs.values()])
W=1254; H=1254; SCALE=.8; TX=180; TY=370
def canvas(img):
    final=Image.new("RGBA",(W,H))
    scaled=img.resize((768,768),Image.Resampling.LANCZOS)
    final.alpha_composite(scaled,(TX,TY))
    return final
def saved(im,path): im.save(path,format="PNG",compress_level=7)
q=np.array([[326,251],[928,440],[636,950],[0,595]],np.int32)
m=np.zeros((960,960),np.uint8); cv2.fillPoly(m,[q],255)
m=cv2.GaussianBlur(m,(3,3),.45)
pizza_shape=np.array([[483,317],[612,330],[731,386],[798,462],[827,546],[818,632],[765,707],[670,781],[515,840],[370,823],[255,773],[174,690],[149,581],[170,483],[261,384],[366,332]],np.int32)
pm=np.zeros((960,960),np.uint8)
cv2.fillPoly(pm,[pizza_shape],255);pm=cv2.GaussianBlur(pm,(5,5),1.1)
base=np.array(refs["margherita"])
# Fill ONLY the hidden pizza footprint with a tile sampled from approved kraft art.
patch=base[274:307,363:398,:3]
background=np.tile(patch,(math.ceil(960/len(patch)),math.ceil(960/len(patch[0])),1))[:960,:960]
hole=cv2.dilate(pm,np.ones((13,13),np.uint8),iterations=1).astype(np.float32)[:,:,None]/255
base[:,:,:3]=(base[:,:,:3]*(1-hole)+background*hole).astype(np.uint8)
base[:,:,3]=m
tray=canvas(Image.fromarray(base,"RGBA"))
saved(tray,OUT/"layers/tray.png")
pizzas={}
for k in FLAVORS:
    img=np.array(refs[k]);img[:,:,3]=(img[:,:,3].astype(np.float32)*pm/255).astype(np.uint8)
    pizzas[k]=canvas(Image.fromarray(img,"RGBA"))
    saved(pizzas[k],OUT/f"layers/pizza-{k}.png")
# Cardboard front rim (original source pixels), in front of pizza and lid.
occ=np.zeros((960,960),np.uint8)
for poly in ([[3,586],[632,858],[636,948],[7,665]],[[626,856],[834,547],[927,444],[818,710],[636,948]]):
    pass
cv2.fillPoly(occ,[np.array([[3,586],[632,858],[636,948],[7,665]],np.int32),
                 np.array([[626,856],[834,547],[927,444],[818,710],[636,948]],np.int32)],255)
b=np.array(refs["margherita"]);b[:,:,3]=np.minimum(b[:,:,3],occ)
front=canvas(Image.fromarray(b,"RGBA"));saved(front,OUT/"layers/front-rim.png")
# Extract ORIGINAL Pisa artwork from the approved closed master, without redraw.
src=np.array([[316,84],[941,291],[704,783],[22,562]],np.float32)
dst=np.array([[0,0],[799,0],[799,799],[0,799]],np.float32)
print_art=cv2.warpPerspective(np.array(closed),cv2.getPerspectiveTransform(src,dst),(800,800),flags=cv2.INTER_CUBIC)
print_art[:,:,3]=255
exterior=Image.fromarray(print_art,"RGBA")
saved(exterior,OUT/"layers/lid-exterior-original.png")
# Kraft underside, derived only from approved package texture; new hidden face.
texture=np.array(refs["margherita"])[232:283,372:445,:3]
under=np.tile(texture,(math.ceil(800/texture.shape[0]),math.ceil(800/texture.shape[1]),1))[:800,:800]
underside=Image.fromarray(under,"RGB")
pen=ImageDraw.Draw(underside)
pen.rectangle((12,12,787,787),outline=(125,81,44),width=8)
pen.line((25,65,775,65),fill=(192,145,99),width=6)
pen.line((25,730,775,730),fill=(123,84,54),width=7)
underside=underside.convert("RGBA")
saved(underside,OUT/"layers/lid-interior-kraft.png")
K=np.array([[1300,0,480],[0,1300,480],[0,0,1]],float)
obj=np.array([[-.5,-.5,0],[.5,-.5,0],[.5,.5,0],[-.5,.5,0]],np.float32)
screen=np.array([[10,590],[637,938],[920,446],[332,262]],np.float32)
ok,rvec,tvec=cv2.solvePnP(obj,screen,K,np.zeros(5),flags=cv2.SOLVEPNP_ITERATIVE)
assert ok
rot,_=cv2.Rodrigues(rvec);camera=(-rot.T@tvec).ravel()
def project(points):
    a,_=cv2.projectPoints(np.array(points,np.float32),rvec,tvec,K,np.zeros(5))
    return a.reshape(-1,2)*SCALE+[TX,TY]
def lid_corners(angle):
    t=math.radians(angle)
    return project([[-.5,.5,.1],[.5,.5,.1],[.5,.5-math.cos(t),.1+math.sin(t)],[-.5,.5-math.cos(t),.1+math.sin(t)]])
def lid(angle):
    pts=lid_corners(angle).astype(np.float32)
    t=math.radians(angle)
    norm=np.array([0,math.sin(t),math.cos(t)])
    mid=np.array([0,.5-math.cos(t)/2,.1+math.sin(t)/2])
    art=exterior if np.dot(norm,camera-mid)>0 else underside
    warped=cv2.warpPerspective(np.array(art),cv2.getPerspectiveTransform(dst,pts),(W,H),
      flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
    out=Image.fromarray(warped,"RGBA")
    line=Image.new("RGBA",(W,H));d=ImageDraw.Draw(line)
    coords=[tuple(map(float,p)) for p in pts]
    d.line(coords+[coords[0]],fill=(93,59,33,205),width=3)
    d.line((coords[3],coords[2]),fill=(201,158,109,226),width=5)
    out.alpha_composite(line)
    return out
def frame(flavor,degrees):
    f=Image.new("RGBA",(W,H))
    f.alpha_composite(tray);f.alpha_composite(pizzas[flavor])
    f.alpha_composite(lid(degrees));f.alpha_composite(front)
    return f
proof_angles=[0,28.75,57.5,86.25,115]
for name in FLAVORS:
    motion=[]
    for i in range(24):
        t=i/23
        a=115*(1-(1-t)**3)
        motion.append(frame(name,a))
    motion[0].save(OUT/f"motion/pisa-{name}.webp",save_all=True,append_images=motion[1:],
                   duration=54,loop=1,quality=85,method=4)
    for index,angle in enumerate(proof_angles):
        saved(frame(name,angle),OUT/f"proof/{name}-{index}-angle{round(angle)}.png")
contact=Image.new("RGB",(1800,950),(246,238,222))
draw=ImageDraw.Draw(contact)
draw.text((40,30),"PISA HINGE PROOF | APPROVED SOURCE ART | NO REDESIGN",fill=(55,44,32))
for i,angle in enumerate(proof_angles):
    img=frame("margherita",angle)
    img.thumbnail((338,790))
    tile=Image.new("RGB",(338,790),(236,227,210))
    tile.paste(img,((338-img.width)//2,(790-img.height)//2),img)
    contact.paste(tile,(40+i*350,90))
    draw.text((43+i*350,890),f"{int(angle)} degrees",fill=(55,44,32))
contact.save(OUT/"proof/contact-sheet.png")
manifest={"source":"dennisariens/topo:art/nino-pizza-rewards-20261024","source_hashes":EXPECTED,
          "original_runtime_resolution":[960,960],"output_canvas":[W,H],
          "source_to_canvas_scale":SCALE,"source_offset":[TX,TY],
          "lid_hinge_endpoints_px":lid_corners(0)[:2].tolist(),"lid_open_degrees":115,
          "motion_frames":24,"duration_ms":1296,"flavors":list(FLAVORS),
          "artwork_status":"QA CANDIDATE: Requires owner visual acceptance and Hermes exact-source verification.",
          "limitations":["Flat source masters cannot reveal occluded original tray or lid underside; these are derivatives from genuine kraft pixels.","No crossfade, no app integration, no changes to rewards, no production deployment."]}
(OUT/"manifest.json").write_text(json.dumps(manifest,indent=2))
(OUT/"README.md").write_text("NINO / TOPO Pisa Edition: source-preserving hinge QA package.\n"
 "All Pisa print and pizzas derive from the approved originals and are never redesigned.\n"
 "The rig is a genuine planar 3D projection, not a crossfade. Do NOT merge without visual QA.\n")
with zipfile.ZipFile("NINO_PISA_SOURCE_PRESERVING_QA.zip","w",zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in sorted(OUT.rglob("*")):
        if p.is_file():z.write(p,p.relative_to(OUT.parent))
print("ready NINO_PISA_SOURCE_PRESERVING_QA.zip")
