// Audit/test adapter ONLY. Exact approved #37/#44 deltas; never loaded by application.
import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{execFileSync}from'node:child_process';import{createHash}from'node:crypto';
const root=new URL('../',import.meta.url),approved='bbba235b1b087505c09e73af9e238ddc5c9cd277',base='71b33fd973c7b650c63e7921af3e7bf6aab5f79f';
const git=(sha,p)=>execFileSync('git',['show',sha+':'+p],{cwd:root,maxBuffer:32e6}),read=p=>readFileSync(new URL(p,root));
const area=s=>s.match(/data-reference-id="area-c" d="([^"]+)"/)?.[1];const before=area(git(base,'index.html').toString()),after=area(read('index.html').toString());assert(before&&after&&before!==after);assert.equal(createHash('sha256').update(after).digest('hex'),'e5216860fead38464ae54f22fbec0b868e164b9d17e9a978db90be76d8dbdcd2','only approved DEM-guided area-c correction');
export function restoreApprovedArea(source){return source.replaceAll(after,before)}
export function restoreApprovedIpadUI(source){let s=restoreApprovedArea(source);for(const p of['scripts/discovery-map.js','scripts/discovery-map.css'])s=s.replace(git(approved,p).toString(),git(base,p).toString());return s}
export function assertFreshPrint(){const p=read('print.html');assert.equal(restoreApprovedArea(p.toString()),git(base,'print.html').toString(),'print changes only exact approved area-c');assert.equal(read('output/pdf/print-source.sha256').toString().trim(),createHash('sha256').update(p).digest('hex'),'PDF source fresh');const pdf=read('output/pdf/topo-italie-printboek.pdf').toString('latin1');assert(pdf.startsWith('%PDF-'));assert.match(pdf,/\/Count 35/);assert(read('scripts/generate-pdf.py').equals(git(base,'scripts/generate-pdf.py')),'PDF generator unchanged')}
export function assertPreserved(file,current,reference){
 if(file==='print.html'){assert.equal(restoreApprovedArea(current.toString()),reference.toString(),file+' only approved area-c');assertFreshPrint();return}
 if(['output/pdf/print-source.sha256','output/pdf/topo-italie-printboek.pdf'].includes(file)){assertFreshPrint();return}
 if(['scripts/discovery-map.js','scripts/discovery-map.css'].includes(file)){assert(current.equals(git(approved,file)),file+' exact reviewed Kaartstijl change');return}
 assert(current.equals(reference),file+' unchanged');
}
