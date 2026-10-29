from pathlib import Path
from PIL import Image
import numpy as np,json,hashlib,collections
R=Path('/Users/dennisariens/projects/topo-passport-final-art-qa');O=Path('/Users/dennisariens/.hermes/outputs/topo-passport-final-art-qa')
raw=json.loads((O/'independent-inventory.json').read_text());prior=json.loads((O/'pr48-allowlist-shape.json').read_text())
original=Image.open(R/'assets/nino/travel-passport/postcards/masters/postcard-04-venezia-front.png').convert('RGB')
proof=Image.open(O/'postcards/DIAGNOSTIC-ONLY-venezia-rectangle.png').convert('RGB');box=(58,66,1478,958)
assert proof.size==(1420,892);assert np.array_equal(np.asarray(proof),np.asarray(original.crop(box)))
cropHash=hashlib.sha256((O/'postcards/DIAGNOSTIC-ONLY-venezia-rectangle.png').read_bytes()).hexdigest();assert cropHash=='35e7bd02929954043f6345620c6ea5cc49730d5a9e85e6a3b19ccf4c1d0cd8ef'
(O/'venezia-parent-verification.json').write_text(json.dumps({'source':'assets/nino/travel-passport/postcards/masters/postcard-04-venezia-front.png','source_sha256':hashlib.sha256((R/'assets/nino/travel-passport/postcards/masters/postcard-04-venezia-front.png').read_bytes()).hexdigest(),'half_open_crop':box,'result_size':proof.size,'decodedRGBExactlyEqualsSourceRegion':True,'diagnosticPNGsha256':cropHash,'edge_treatment':'straight rectangular trim, decorative scalloped perimeter removed; not exact scalloped alpha recovery','production_status':'CONDITIONAL on owner acceptance of edge treatment; diagnostic is not a shipped export'},indent=2))
rows=[];sources=[]
for x in raw:
 p=x['path'];notes=[];role='';art='PASS';status='PASS';runtime=False
 if '/book/concepts/'in p or '/postcards/concepts/'in p:
  status='CONCEPT ONLY';art='REFERENCE';notes=['Reference only; no production page background, unlock or reward state. Optional Bologna/Milano are not core blockers.']
 elif '/gold/concepts/'in p:
  status='REWORK';art='REWORK';notes=['Optional ornament has ghost flecks/fringe; exclude. Neither core Gold seal depends on it.']
 elif p.endswith('/stamp-05-isole.png')or p.endswith('/stamp-05-isole-ink-preview.webp'):
  status='REWORK';art='HISTORICAL REWORK';notes=['Historical wrong island relationship remains excluded; use only the separately approved corrected source.']
 elif '/stamps/masters/'in p:
  status='SOURCE ONLY';notes=['Preserved source/design master. Runtime permission remains on exact reviewed PR48 alpha export, not arbitrary master.']
 elif p.endswith('/passport-open-book.png'):
  status='REWORK';art='ARCHIVAL REFERENCE';notes=['Not a blank runtime base: old baked postmark/content. New folios replace this need; no new full-book repaint required.']
 elif p.endswith('/passport-closed-cover.png'):
  status='PASS';notes=['Retain PR48 acceptance and consume its exact approved lossless cover export.']
 elif '/book/masters/passport-blank-folio-'in p:
  status='CONDITIONAL';notes=['Source art visually accepted, native1086x1448. Preserve PNG; render normalized WebP counterpart, not original different alpha. Folio pair conditions apply.']
 elif '/book/qa-candidates/passport-blank-folio-'in p:
  status='CONDITIONAL';role='blank-folio';notes=['Use exact normalized lossless WebP, shared full-canvas contain scale, no flip/crop/stretch. <=543CSSpx/page atDPR2; owner must accept native-resolution exception to1536x2048 spec. Seam/edge differences acceptable at that scope.']
 elif '/stamps/rework/'in p:
  role='corrected-islands-stamp';notes=['PASS for decorative Eilanden chapter stamp on warm paper. Sardinia clearly NW of Sicily; remaining vertical bbox overlap is acceptable stylized compression, not a scale-accurate map. Native1254 lossless-alpha export required; no redraw. Live thumbnail label, >=160CSS detailed view.']
 elif '/arrivo/'in p:
  role='arrival-ink';notes=['PASS warm-paper ink; >=160CSS detail/240preferred, live labels at thumbnails. Only actual canonical Vespa trips; city/date/count dynamic and truthful. No alpha normalization or fictitious visit.']
 elif '/gold/masters/'in p:
  status='CONDITIONAL';role='chapter-gold'if'chapter'in p else'final-gold';notes=['Artwork PASS. Source1254-square; alpha1 canvas specks not substantial clipping. Verified source-preserving runtime derivative/live labels required. Chapter48minimum/64preferred/160detail; final240minimum main presentation/320preferred. Exact chapter goldAt>0 vs all11positive; no new reward states.']
 elif p.endswith('/postcard-04-venezia-front.png'):
  status='CONDITIONAL';role='postcard-venezia';notes=['Painting PASS, original full RGB exterior not approved as transparent overlay. Parent-verified rectangle(58,66,1478,958),1420x892 preserves source RGB but trims scalloped perimeter. Owner edge-treatment acceptance required; otherwise verified contour mask remains technical work. No regeneration needed.']
 elif '/postcards/masters/'in p:
  role='postcard';notes=['PASS original design/cream-holder scope. Contain with preserved ratio, >=240x160CSS preview with live caption, >=480wide detail; corners and source-alpha edges preserved. Actual holder/app QA separate.']
 elif '/stamps/qa-candidates/'in p:
  notes=['Byte-identical to accepted PR48 production export; previous warm-paper/live-caption/minimum-size limitations retained. Candidate path itself not silently promoted.']
 else:raise AssertionError('Unclassified '+p)
 row=dict(x,artwork_verdict=art,qa_verdict=status,production_role=role,notes=notes)
 rows.append(row)
 if role:sources.append({'path':p,'source_commit':'8a704cb23da97baf7197635df7fa12f06b864a24','sha256':x['sha256'],'native_size':x['size'],'role':role,'artwork_verdict':art,'production_promotion':status,'conditions':notes})
assert len(rows)==49 and len(sources)==11
ledger={'reviewed_commit':'8a704cb23da97baf7197635df7fa12f06b864a24','count':len(rows),'counts':dict(collections.Counter(x['qa_verdict']for x in rows)),'assets':rows}
(O/'final-asset-ledger.json').write_text(json.dumps(ledger,indent=2)+'\n')
accept={'reviewed_commit':ledger['reviewed_commit'],'prior_reference_commit':'4eb9a5ae33550d789c56d5c01393145a148565aa','prior_allowlist_count':len(prior['entries']),'prior_allowlist_entries':prior['entries'],'current_review_source_count':len(sources),'current_review_source_decisions':sources,'production_exports_created':False,'app_integration_or_release_approved':False,'legacy_art_application_must_not_be_merged':True,'genuine_core_art_redraw_blockers':[],'open_owner_conditions':['Folio native1086x1448 resolution exception: <=543CSS per page atDPR2 rather than declared1536x2048-or-better source requirement.','Venezia straight-trim alternative acceptance; full decorative scalloped alpha not verified.'],'technical_closeout':['Copy exact normalized folio WebPs to runtime export paths with same hashes.','Derive source-faithful lossless ISOLE/ARRIVO/Gold/card exports and verify decoded RGBA or documented alpha0-RGB exception plus composite parity.','Apply only the owner-accepted Venezia edge option.'],'runtime_rules':['chapter stamp only exact canonical stage===3','one chapter Gold design reused only beside exact chapter goldAt>0','final Gold only all11 canonical goldAt>0, derived not shadow ledger','ARRIVO only actual existing Pizza-to-Vespa trips; no invented history/dates','postcards use existing/source-approved eligibility, no new currency']}
(O/'final-art-acceptance.json').write_text(json.dumps(accept,indent=2)+'\n');print(json.dumps({'assetCount':len(rows),'verdicts':ledger['counts'],'priorApprovedReferences':len(prior['entries']),'currentSourceDecisions':len(sources),'cropParentVerified':True,'coreRedrawBlockers':0},indent=2))
