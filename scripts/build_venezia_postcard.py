#!/usr/bin/env python3
"""Rebuild Venezia scalloped postcard exports from approved original image.

Faithful original RGB; alpha is recreated from the reviewed 572-point outline.
An extremely small (<0.2% of total pixels) boundary feather difference from
the original hand-reviewed raster-alpha matte can remain. This is an artwork
build script, not an app dependency. Requires Pillow at build time.
"""
from pathlib import Path
import argparse
import hashlib
import json
import re
from PIL import Image, ImageDraw, ImageChops

REPO = Path(__file__).resolve().parents[1]
SOURCE = REPO / "assets/nino/travel-passport/postcards/masters/postcard-04-venezia-front.png"
CONTOUR = REPO / "assets/nino/travel-passport/postcards/exports/postcard-04-venezia-approved-contour.svg"
OUTPUT = REPO / "out/art/venezia"
EXPECTED_BLOB_SHA = "47b7c616d0a2ca8956a3d302c0c1a270f2320bf0"

def git_blob_sha(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\x00" + data).hexdigest()

def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--source",type=Path,default=SOURCE)
    ap.add_argument("--contour",type=Path,default=CONTOUR)
    ap.add_argument("--out",type=Path,default=OUTPUT)
    args=ap.parse_args()
    source_data=args.source.read_bytes()
    if git_blob_sha(source_data)!=EXPECTED_BLOB_SHA:
        raise SystemExit("REFUSE: Venezia master changed or is not the approved original Git blob")
    original=Image.open(args.source).convert("RGB")
    if original.size!=(1536,1024):
        raise SystemExit("REFUSE: unexpected source resolution")
    entry=re.search(r'<path\s+d="([^"]+)"',args.contour.read_text())
    if not entry:
        raise SystemExit("Contour path missing")
    points=[tuple(map(int,match.split(","))) for match in re.findall(r"\d+,\d+",entry.group(1))]
    if len(points)!=572:
        raise SystemExit("Contour expected exactly 572 source-traced points")
    alpha=Image.new("L",original.size,0)
    ImageDraw.Draw(alpha).polygon(points,fill=255)
    image=original.convert("RGBA")
    image.putalpha(alpha)
    if ImageChops.difference(image.convert("RGB"),original).getbbox():
        raise SystemExit("Refuse: RGB retouched")
    args.out.mkdir(parents=True,exist_ok=True)
    files={}
    for variant,im in (("full",image),("tight",image.crop((23,26,1520,999)))):
        for fmt,ext in (("PNG","png"),("WEBP","webp")):
            output=args.out/f"postcard-04-venezia-scalloped-{variant}.{ext}"
            options={"optimize":True} if fmt=="PNG" else {"lossless":True,"method":6}
            im.save(output,format=fmt,**options)
            files[output.name]={"bytes":output.stat().st_size,"sha256":sha256(output),"width":im.width,"height":im.height}
    png=Image.open(args.out/"postcard-04-venezia-scalloped-full.png").convert("RGBA")
    webp=Image.open(args.out/"postcard-04-venezia-scalloped-full.webp").convert("RGBA")
    if ImageChops.difference(png,webp).getbbox():
        raise SystemExit("Fail: WebP is not decoded-pixel identical to PNG")
    manifest={"source_git_blob":EXPECTED_BLOB_SHA,"contour_points":572,
      "status":"Source RGB exact; owner-approved 50%-alpha border approximated within contour tolerance (not byte-identical to owner's manually reviewed matte)",
      "files":files}
    (args.out/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
    print(json.dumps(manifest,indent=2))

if __name__=="__main__":
    main()
