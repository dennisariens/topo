import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,symlinkSync,rmSync,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,dirname,join} from 'node:path';
import {createHash} from 'node:crypto';
import {verifyArtifacts,ARTIFACT_PATHS} from './artifacts.mjs';
const source=resolve(import.meta.dirname,'../..');
const hash=b=>createHash('sha256').update(b).digest('hex');
function fixture(t,transform=x=>x){
 const root=mkdtempSync(join(tmpdir(),'topo-artifacts-'));t.after(()=>rmSync(root,{recursive:true,force:true}));
 const html=transform(readFileSync(join(source,'index.html'),'utf8'));
 writeFileSync(join(root,'index.html'),html);
 for(const p of ARTIFACT_PATHS.slice(1)){mkdirSync(dirname(join(root,p)),{recursive:true});symlinkSync(join(root,'index.html'),join(root,p));}
 for(const p of ['scripts','assets'])symlinkSync(join(source,p),join(root,p));
 return {root,options:{expectedHtmlSha256:hash(html)}};
}
test('approved generated standalone set satisfies artifact contract',t=>{const f=fixture(t);assert.equal(verifyArtifacts(f.root,f.options).ok,true)});
test('one broken generated alias is rejected',t=>{const f=fixture(t);const path=join(f.root,ARTIFACT_PATHS[2]);unlinkSync(path);writeFileSync(path,'broken alias');const r=verifyArtifacts(f.root,f.options);assert.equal(r.ok,false);assert(r.errors.some(e=>e.includes('parity')&&e.includes(ARTIFACT_PATHS[2])))});
test('an external runtime asset fails even when its document digest is explicitly accepted',t=>{const f=fixture(t,s=>s.replace('</head>','<script src="https://example.invalid/runtime.js"></script></head>'));const r=verifyArtifacts(f.root,f.options);assert.equal(r.ok,false);assert(r.errors.some(e=>e.includes('external asset')))});
test('post-build dist is mandatory',t=>{const f=fixture(t);unlinkSync(join(f.root,'dist/index.html'));const r=verifyArtifacts(f.root,f.options);assert.equal(r.ok,false);assert(r.errors.some(e=>e.includes('dist/index.html')&&e.includes('missing')))});
test('default pinned digest cannot silently follow edited canonical HTML',t=>{const f=fixture(t,s=>s+'\n');const r=verifyArtifacts(f.root);assert.equal(r.ok,false);assert(r.errors.some(e=>e.includes('pinned SHA256')))});

test('external stylesheet and image references fail the standalone policy',t=>{const f=fixture(t,s=>s.replace('</head>','<style>.probe{background:url(https://example.invalid/art.webp)}</style></head>').replace('</body>','<img src="external.webp"></body>'));const r=verifyArtifacts(f.root,f.options);assert.equal(r.ok,false);assert(r.errors.some(e=>e.includes('CSS url:')));assert(r.errors.some(e=>e.includes('img:external.webp')))});
