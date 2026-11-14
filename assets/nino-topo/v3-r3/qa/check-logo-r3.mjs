import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const r2='assets/nino-topo/v3-r2/brand/logo/';
const r3='assets/nino-topo/v3-r3/brand/logo-r3/';
function imagePayload(s){return s.match(/xlink:href="(data:image\/png;base64,[^"]+)"/)?.[1];}
function allPaths(s){return [...s.matchAll(/<path\b[^>]*d="([^"]+)"/g)].map(m=>m[1]);}
for(const [oldName,newName] of [['logo-01-primary.svg','logo-01-primary-r3.svg'],['logo-02-compact.svg','logo-02-compact-r3.svg']]){
  const old=read(r2+oldName),now=read(r3+newName);
  assert(imagePayload(old),'R2 embedded canonical PNG missing: '+oldName);
  assert.equal(imagePayload(now),imagePayload(old),'Character PNG changed: '+newName);
  assert.deepEqual(allPaths(now),allPaths(old),'Custom lettering outlines changed: '+newName);
  assert.equal((now.match(/viewBox="([^"]+)"/)||[])[1],(old.match(/viewBox="([^"]+)"/)||[])[1],'Unexpected viewBox change');
  assert(now.includes('width="410" height="459"'),'R3 char scale not applied');
}
assert.equal(read(r2+'logo-03-wordmark.svg'),read(r3+'logo-03-wordmark-r3.svg'),'Standalone custom wordmark differs from R2');
const p=read(r3+'logo-01-primary-r3.svg');
assert(p.includes('width="5" height="235.20"')&&p.includes('fill="#9781D5"'),'Optical R3 divider missing');
const list=['logo-01-primary-r3.svg','logo-02-compact-r3.svg','logo-03-wordmark-r3.svg'];
console.log('R3 Logo technical source QA PASS; 3 vectors, R2 byte-identical Nino raster and original wordmark outline data. Visual acceptance still pending.');
