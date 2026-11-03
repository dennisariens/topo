#!/usr/bin/env python3
"""Read-only exact-commit source comparison; outputs evidence only beside script."""
import subprocess,json,hashlib,re,collections,base64
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
OUT=Path(__file__).resolve().parent
BASE='1bf86b3e1c69319bed8ef877243070a64d97a12e'
HEAD='2a9dda3d3d8ec567687bc3b61bf9cbde645c752c'
REVIEW='9e58e756f124ff37d47b4ebcfd274684125d8aeb'
def git(*args):return subprocess.check_output(['git',*args],cwd=ROOT)
def blob(ref,path):return git('show',ref+':'+path)
def sha(b):return hashlib.sha256(b).hexdigest()
def tree(ref):
 return {line.split('\t',1)[1]:line.split('\t',1)[0].split()[2] for line in git('ls-tree','-r',ref).decode().splitlines()}
a,b=tree(BASE),tree(HEAD)
changed=[p for p in sorted(set(a)|set(b)) if a.get(p)!=b.get(p)]
html=[]
for p in changed:
 if p.endswith('.html'):
  old,new=blob(BASE,p),blob(HEAD,p)
  blocks=re.findall(rb'<!-- BEGIN NINO MICRO ICONS -->\n[\s\S]*?<!-- END NINO MICRO ICONS -->\n',new)
  html.append(dict(path=p,base_sha256=sha(old),candidate_sha256=sha(new),bytes=len(new),blocks=len(blocks),only_icon_block=len(blocks)==1 and new.replace(blocks[0],b'',1)==old,all_candidate_html_equal=new==blob(HEAD,'index.html')))
assert all(x['only_icon_block'] and x['all_candidate_html_equal'] for x in html)
protected=[p for p in a if p.endswith(('.test.mjs','.test.js')) or p.startswith(('geography/','docs/geography/','tests/')) or p in ['scripts/learning-engine.js','scripts/route-engine.js','scripts/map-hit.js','scripts/schoolblad.js','scripts/schoolblad.css','scripts/discovery-map.js','scripts/discovery-map.css','scripts/focus-mode.js','scripts/focus-mode.css','scripts/embed-nino-art.mjs','assets/nino/runtime-manifest.json','print.html','output/pdf/topo-italie-printboek.pdf','output/pdf/print-source.sha256','package.json','package-lock.json']]
assert all(a[p]==b.get(p) for p in protected)
for p in ['scripts/build_venezia_postcard.py','assets/nino/travel-passport/postcards/exports/postcard-04-venezia-approved-contour.svg','assets/nino/travel-passport/postcards/masters/postcard-04-venezia-front.png']:
 assert blob(HEAD,p)==blob('cec9fd26ac858bdbcbdf03b5ee6b0ea246e3e02f',p),p
manifest=json.loads(blob(HEAD,'docs/qa/nino-v2-closure-67/artwork-manifest.json'))
rows=manifest['assets'];assert len(rows)==manifest['count']==239
historical=json.loads(blob(REVIEW,'docs/qa/artwork-20261029/hermes-final/final-asset-ledger.json'))
conflicts=[]
for row in rows:
 if isinstance(row['visual_approval'],dict) and row['visual_approval'].get('qa')=='REWORK' and row['status']=='READY':conflicts.append(row)
node="""import {readFileSync} from 'node:fs';import {withoutMicroIcons} from './scripts/focus-source.mjs';
const html=readFileSync('index.html','utf8');let checks=[];
function probe(name,s,expected){let error=null,result;try{result=withoutMicroIcons(s)}catch(e){error=e.message}checks.push({name,rejected:!!error,error,expected});if((expected==='reject')!==!!error)throw Error(name)}
probe('exact candidate block',html,'accept');
probe('script inserted within block',html.replace('<!-- END NINO MICRO ICONS -->','<script>arbitrary()</script><!-- END NINO MICRO ICONS -->'),'reject');
probe('favicon bytes changed within href',html.replace('data:image/x-icon;base64,','data:image/x-icon;base64,X'),'reject');
probe('duplicate bounded blocks',html+html.match(/<!-- BEGIN NINO MICRO ICONS -->[\\s\\S]*?<!-- END NINO MICRO ICONS -->\\n/)[0],'accept');
checks.push({name:'duplicate leaves second block for whole-source equality audit',pass:withoutMicroIcons(html+html.match(/<!-- BEGIN NINO MICRO ICONS -->[\\s\\S]*?<!-- END NINO MICRO ICONS -->\\n/)[0]).includes('<!-- BEGIN NINO MICRO ICONS -->')});
checks.push({name:'arbitrary outside block retained for whole-source equality audit',pass:withoutMicroIcons(html+'OUTSIDE').endsWith('OUTSIDE')});
console.log(JSON.stringify(checks));"""
probes=json.loads(subprocess.check_output(['node','--input-type=module','-e',node],cwd=ROOT))
assert all(x.get('pass',True) for x in probes)
pr_snapshot=[]
for n in [61,63,65,66,70]:
 pr=json.loads(subprocess.check_output(['/opt/homebrew/bin/gh','pr','view',str(n),'--repo','dennisariens/topo','--json','number,url,headRefOid,baseRefOid,body,state,isDraft'],cwd=ROOT));pr_snapshot.append(pr)
(OUT/'github-pr-snapshot.json').write_text(json.dumps(pr_snapshot,indent=2)+'\n')
issue=json.loads(subprocess.check_output(['/opt/homebrew/bin/gh','issue','view','67','--repo','dennisariens/topo','--json','number,url,title,body,comments'],cwd=ROOT))
(OUT/'github-issue67.json').write_text(json.dumps(issue,indent=2)+'\n')
for p in ['README.md','gold/VERDICT.md','folios/VERDICT.md','postcards/REPORT.md','parent-ink-verdicts.json']:
 (OUT/('historical-'+p.replace('/','-'))).write_bytes(blob(REVIEW,'docs/qa/artwork-20261029/hermes-final/'+p))
# PR63 head is not in the local object database; inspect exact GitHub content without fetching/moving refs.
hinge=json.loads(subprocess.check_output(['/opt/homebrew/bin/gh','api','repos/dennisariens/topo/contents/assets/nino/rewards/pizza/hinge/README.md?ref=92893ae91a177e4272807d662e2b101ff934017d'],cwd=ROOT))
(OUT/'pr63-hinge-README.md').write_bytes(base64.b64decode(hinge['content']))
pr66=json.loads(subprocess.check_output(['/opt/homebrew/bin/gh','pr','view','66','--repo','dennisariens/topo','--json','number,url,body,comments,reviews,files'],cwd=ROOT))
inline=json.loads(subprocess.check_output(['/opt/homebrew/bin/gh','api','repos/dennisariens/topo/pulls/66/comments'],cwd=ROOT))
pr66['inline_review_comments']=inline
pr66['checked_api_handles']=['https://api.github.com/repos/dennisariens/topo/issues/66/comments','https://api.github.com/repos/dennisariens/topo/pulls/66/reviews','https://api.github.com/repos/dennisariens/topo/pulls/66/comments','https://api.github.com/repos/dennisariens/topo/git/trees/cec9fd26ac858bdbcbdf03b5ee6b0ea246e3e02f?recursive=1']
pr66['attachment_urls_in_body_comments_reviews']=re.findall(r'https?://[^\\s<>\"\)]+',json.dumps([pr66['body'],pr66['comments'],pr66['reviews'],inline]))
pr66['pinned_tree_venezia_or_zip_paths']=[p for p in tree('cec9fd26ac858bdbcbdf03b5ee6b0ea246e3e02f') if 'venezia' in p.lower() or p.lower().endswith('.zip')]
(OUT/'pr66-reference-search.json').write_text(json.dumps(pr66,indent=2)+'\n')
(OUT/'pr66-exports-README.md').write_bytes(blob('cec9fd26ac858bdbcbdf03b5ee6b0ea246e3e02f','assets/nino/travel-passport/postcards/exports/README.md'))
pinned=json.loads(blob(HEAD,'docs/qa/nino-v2-closure-67/pr-snapshot.json'))
result=dict(reviewed_commit=HEAD,base_commit=BASE,historical_review=REVIEW,head_verified=git('rev-parse','HEAD').decode().strip()==HEAD,changed_paths=changed,html=html,protected_files=[dict(path=p,blob=a[p],unchanged=True) for p in protected],adapter_negative_probes=probes,pr_heads_match_pinned={str(x['pr']):next(y for y in pr_snapshot if y['number']==x['pr'])['headRefOid']==x['head_sha'] for x in pinned},manifest_count=len(rows),manifest_status_counts=dict(collections.Counter(x['status'] for x in rows)),source_only_ready_count=sum(x['status']=='READY' and not x['delivery_present'] for x in rows),source_only_integration_pending_count=sum(x['status']=='INTEGRATION PENDING' and not x['delivery_present'] for x in rows),historical_rework_now_ready=conflicts,scope='Source/provenance only: no image decode, npm/build or browser execution; no current derivative visual acceptance.')
(OUT/'comparison.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(dict(html_files=len(html),protected_files=len(protected),manifest_count=len(rows),status_counts=result['manifest_status_counts'],source_only_ready=result['source_only_ready_count'],source_only_integration_pending=result['source_only_integration_pending_count'],historical_rework_now_ready=[x['path'] for x in conflicts],pr_heads_match_pinned=result['pr_heads_match_pinned'],adapter_probes=probes),indent=2))
