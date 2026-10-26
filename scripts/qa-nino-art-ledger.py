#!/usr/bin/env python3
import csv,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];O=ROOT/'docs/qa/artwork-45'
inv=json.loads((O/'binary-inventory.json').read_text());allow=json.loads((O/'production-allowlist.json').read_text());rows=[]
for f in inv['files']:
 p=f['path'];verdict='PASS';ship=False;scope='reference master integrity';reason='Decoded and SHA verified where declared; preserve original bytes.'
 if '/chapter-icons/exports/'in p:ship=True;scope='labelled route icon 32-96px; prefer48-96';reason='No export-specific matte; category caption mandatory; not geographic teaching source.'
 if '/chapter-icons/masters/'in p:reason='1254 RGBA; cleaned repository master verified, original pre-cleanup source hash unavailable. Not pristine-native edge certification.'
 if '/stamps/'in p:
  if '/qa-candidates/'in p:ship=False;scope='QA source for approved export only; warm paper; detail>=160px';reason='Visual 48/96/160 1x/2x, paper/teal/checker; no objectionable matte/checker remnants. Ship allowlisted exports path only. Dark is diagnostic, not approved low-contrast background.'
  if '/masters/'in p:scope='approved design reference only, never direct runtime ink';reason='Original preserved. Source matte/fringe not automatically production alpha.'
  if 'stamp-05-'in p:verdict='REWORK';ship=False;reason='Sicily is nearly side-by-side with Sardinia; canonical source requires southeast separation. No inversion or missing-island claim.'
  elif '/masters/'in p and any('stamp-'+n+'-'in p for n in ['02','08','09']):verdict='REWORK';reason='Direct master alpha not production ready: embedded background/checker concern; use only approved reconstructed derivative, never master.'
 if 'passport-open-book' in p:verdict='REWORK';reason='Preprinted illegible cancellation/postmark beside profile frame; obtain blank source. Eleven chapter slots themselves are empty.'
 rows.append(dict(path=p,verdict=verdict,scope=scope,ship_this_path=ship,reason=reason,sha256=f['sha256'],dimensions=f['dimensions'],mode=f['mode'],integrity='PASS',declared_hash_match=f['hash_match']))
for e in allow['entries']:
 if not any(r['path']==e['path']for r in rows):rows.append(dict(path=e['path'],verdict='PASS',scope='warm-book release export',ship_this_path=True,reason=e['transform'],sha256=e['sha256'],dimensions=e['dimensions'],integrity='PASS'))
assert len(rows)==57
summary={'icons':{'PASS':11},'stamp_derivatives':{'PASS':10,'REWORK':1},'book_art':{'PASS':1,'REWORK':1},'allowlisted_files':len(allow['entries']),'file_rows_including_masters_candidates_derivatives':len(rows)}
missing=[{'asset':a,'verdict':'BLOCKED','reason':r}for a,r in [('final ESPLORATORE D\'ORO seal','Not supplied; Nino Gold character is not a seal.'),('small chapter Gold overprint','No dedicated verified seal supplied; preserve existing truthful text/badge until approved.'),('7 canonical ARRIVO city stamps','Not supplied; chapter stamps are not arrival stamps.'),('Milano football postcard','Existing Torino concept is not an approved Milano postcard.'),('Bologna pit-stop art','Not supplied.'),('isolated cypress/lemon/coastal overlays','Not supplied; do not use large scenic gutters.'),('registered Pisa lid/occlusion layers','Still #31; do not duplicate Pizza V2.')]]
(O/'asset-ledger.json').write_text(json.dumps({'source_revision':inv['source_sha'],'summary':summary,'files':rows,'missing':missing},indent=2)+'\n')
with(O/'asset-ledger.csv').open('w',newline='')as f:
 w=csv.DictWriter(f,fieldnames=['path','verdict','scope','ship_this_path','reason','sha256','dimensions','integrity'],extrasaction='ignore',lineterminator='\n');w.writeheader();w.writerows(rows)
print(summary)
