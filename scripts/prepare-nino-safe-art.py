#!/usr/bin/env python3
"""Issue45 manually reviewed release subset; never process gameplay or overwrite masters."""
import json,hashlib,shutil
from pathlib import Path
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
SHA='367b875c83a4e8b77c1f1d09523c20c96364f178'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,d):p.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
mfile=ROOT/'assets/nino/travel-passport/manifest.json';m=json.loads(mfile.read_text());out=[]
for s in m['stamps']:
 approved=s['chapter']!=5;s['production_alpha_approved']=approved
 s['independent_qa']={'source_revision':SHA,'verdict':'PASS'if approved else'REWORK','scope':'Ink derivative on warm paper only; live caption at thumbnail sizes; detail >=160 CSS px. Not original-master alpha approval.','evidence':'docs/qa/artwork-45/README.md'}
 if approved:
  src=ROOT/s['qa_candidate'];rel='assets/nino/travel-passport/stamps/exports/'+src.name.replace('-ink-preview','');dst=ROOT/rel;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dst);assert src.read_bytes()==dst.read_bytes();s['production_export']=rel;s['production_sha256']=digest(dst);out.append({'category':'chapter-stamp','chapter':s['chapter'],'path':rel,'sha256':digest(dst),'source':s['qa_candidate'],'transform':'byte-identical copy of visually accepted QA candidate','dimensions':list(Image.open(dst).size)})
 else:s['independent_qa']['reason']='Sicily/Sardinia almost side-by-side; canonical geography requires pronounced southeast offset. Do not ship this stamp.'
# Only closed cover passed. Open-book preprinted illegible postmark requires clean source.
for b in m['book']:
 approved=b['name']=='passport-closed-cover';b['independent_qa']={'source_revision':SHA,'verdict':'PASS'if approved else'REWORK','evidence':'docs/qa/artwork-45/README.md'}
 if approved:
  im=Image.open(ROOT/b['path']).convert('RGBA');rel='assets/nino/travel-passport/book/exports/passport-closed-cover.webp';dst=ROOT/rel;dst.parent.mkdir(parents=True,exist_ok=True);im.save(dst,format='WEBP',lossless=True,quality=100,method=6,exact=True);rt=Image.open(dst).convert('RGBA');assert np.array_equal(np.array(im),np.array(rt));b['production_export']=rel;b['production_sha256']=digest(dst);out.append({'category':'book-cover','path':rel,'sha256':digest(dst),'source':b['path'],'transform':'native-size lossless WebP; decoded RGBA exact','dimensions':list(im.size)})
 else:b['independent_qa']['reason']='Baked circular cancellation/postmark with illegible text beside profile frame; needs blank/no-postmark source before earned-state background approval.'
m['quality_gate']='PARTIAL_QA_PASS / ISOLE_AND_OPEN_BOOK_REWORK'
m['independent_qa']={'source_revision':SHA,'quality_gate':'SAFE_SUBSET_ONLY; ISOLE_AND_OPEN_BOOK_REWORK','report':'docs/qa/artwork-45/README.md'};write(mfile,m)
ip=ROOT/'assets/nino/chapter-icons/manifest.json';icons=json.loads(ip.read_text());icons['upload_status']='GITHUB_VERIFIED_AT_PINNED_SOURCE';icons['verified_source_branch']='art/nino-travel-stamps-v2-20261026';icons['verified_source_sha']=SHA;icons['independent_qa_evidence']='docs/qa/artwork-45/icons-verdicts.json'
for i in icons['assets']:
 p=ROOT/i['webp_512_path'];assert digest(p)==i['webp_512_sha256'];out.append({'category':'chapter-icon','id':i['id'],'path':i['webp_512_path'],'sha256':digest(p),'source':i['png_path'],'dimensions':list(Image.open(p).size),'scope':'labelled route UI; prefer48-96px; not geography or baked-text teaching source'})
write(ip,icons)
assert len(out)==22
write(ROOT/'docs/qa/artwork-45/production-allowlist.json',{'source_revision':SHA,'entries':out,'count':len(out),'excluded':['stamp-05-isole','passport-open-book','final Gold seal (missing)','canonical arrival stamp set (missing)'],'color_profile':'All supplied sources untagged; no certified ICC conversion claimed.'})
print('22 allowlisted files: 11 existing icons, 10 byte-identical stamp derivatives, 1 RGBA-exact lossless cover. Isole/open-book excluded.')
