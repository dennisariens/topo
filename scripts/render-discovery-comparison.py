"""Create labelled review boards from real browser captures and the owner benchmark.
No image in this script is used as application geography. Requires Pillow (development only).
"""
import argparse, hashlib, json, shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
p=argparse.ArgumentParser();p.add_argument('--reference',required=True);args=p.parse_args()
out=Path(__file__).resolve().parents[1]/'docs/visual/discovery-map'
ref=Image.open(args.reference).convert('RGB');shutil.copyfile(args.reference,out/'owner-benchmark.png')
font='/System/Library/Fonts/Supplemental/Arial.ttf'
try:
    title=ImageFont.truetype(font,28);small=ImageFont.truetype(font,18)
except OSError:
    title=ImageFont.load_default();small=title
records=[]
for name in ['ipad-landscape','ipad-portrait']:
    actual=Image.open(out/(name+'-discovery-learn.png')).convert('RGB')
    cell=1000;top=110;gap=32
    scale=min(cell/actual.width,1180/actual.height);right=actual.resize((round(actual.width*scale),round(actual.height*scale)),Image.Resampling.LANCZOS)
    left=ref.resize((cell,round(ref.height*cell/ref.width)),Image.Resampling.LANCZOS)
    height=top+max(left.height,right.height)+70
    board=Image.new('RGB',(cell*2+gap*3,height),'#f7f5ed');d=ImageDraw.Draw(board)
    d.text((gap,23),'OWNER-APPROVED BENCHMARK',font=title,fill='#28594b');d.text((cell+gap*2,23),'ACTUAL TOPO · '+name.upper(),font=title,fill='#28594b')
    d.text((gap,66),'Visual reference only — never used as map geometry',font=small,fill='#617063');d.text((cell+gap*2,66),'Live SVG / real DEM / original Nino / offline application',font=small,fill='#617063')
    board.paste(left,(gap,top));board.paste(right,(cell+gap*2,top))
    if name=='ipad-portrait':
        y=top+left.height+48
        for line in ['Intentional iPad adaptation:', '• Same 890 × 1235 frame; no stretched/fantasy coastline.', '• Genuine relief replaces invented mountain drawings.', '• Smaller scenic framing keeps question/map central.', '• No fabricated passport stamps or travel progress.']:
            d.text((gap,y),line,font=small,fill='#395649');y+=34
    d.text((gap,height-40),'Review candidate, not a deployment · Physical iPad Safari acceptance remains open.',font=small,fill='#617063')
    path=out/(name+'-reference-comparison.png');board.save(path)
    records.append({'board':path.name,'actual':name+'-discovery-learn.png','actual_size':actual.size,'reference_sha256':hashlib.sha256(Path(args.reference).read_bytes()).hexdigest(),'source_geo':'unchanged canonical vector map; reference is comparison-only'})
(out/'comparison-manifest.json').write_text(json.dumps(records,indent=2)+'\n')
print(json.dumps(records,indent=2))
