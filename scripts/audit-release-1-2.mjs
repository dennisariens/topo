import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {withoutDiscovery} from './discovery-source.mjs';

const root = new URL('../', import.meta.url);
const base = 'a481317b33f5f6f55c179ee0fbfe6b211663be7b';
const art = '4f15b610479358b4bf64a7de8be6c5875039b086';
const lakes = '35ff21b639e4672b7ed221b540b2c48dcd582285';
const masters = '047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d';
const read = file => readFileSync(new URL(file, root));
const original = (sha, file) => execFileSync('git', ['show', `${sha}:${file}`], {cwd:root,maxBuffer:24*1024*1024});
const hash = b => createHash('sha256').update(b).digest('hex');
const preserved = {};
function exact(file, sha) {
  assert(read(file).equals(original(sha,file)), `${file}: exact source preservation`);
  preserved[file] = {source:sha,sha256:hash(read(file))};
}
for (const file of ['scripts/learning-engine.js','scripts/route-engine.js','print.html','output/pdf/topo-italie-printboek.pdf','output/pdf/print-source.sha256','output/art/nino-op-de-scooter.webp','output/art/topo-italie-avontuur.webp']) exact(file,base);
for (const file of ['assets/nino/runtime-manifest.json','assets/nino/RUNTIME.md','scripts/nino-art.js','scripts/nino-art-ui.js','scripts/nino-art.css','scripts/nino-feedback.js','scripts/embed-nino-art.mjs','package-lock.json']) exact(file,art);
const manifest = JSON.parse(read('assets/nino/runtime-manifest.json'));
for (const asset of Object.values(manifest.assets)) {exact(asset.path,art); assert(read(asset.path).equals(original(masters,asset.path)), 'Original owner export bytes');}
for (const file of ['geography/lakes/source.geojson','geography/lakes/sources.json','geography/lakes/projected-manifest.json','scripts/geography/lakes.mjs','scripts/geography/generate-lakes.mjs','scripts/geography/lakes.test.mjs','scripts/geography/verify-lake-sources.mjs','scripts/generate-preview.mjs']) exact(file,lakes);
const html = read('index.html').toString();
const withoutSchoolblad = withoutDiscovery(html).replace(/\/\* BEGIN SCHOOLBLAD \*\/[\s\S]*?\/\* END SCHOOLBLAD \*\/\n/,'').replace(/\/\/ BEGIN SCHOOLBLAD\n[\s\S]*?\/\/ END SCHOOLBLAD\n/,'');
const withoutLakes = withoutSchoolblad.replace(/<!-- BEGIN GENERATED LAKES -->[\s\S]*?<!-- END GENERATED LAKES -->/,'')
  .replace('<use href="#lakeGeometry" data-context-layer="lakes" aria-hidden="true" pointer-events="none"/>','')
  .replace("el('use',{href:'#lakeGeometry','data-context-layer':'lakes','aria-hidden':'true','pointer-events':'none'},$('#areaLayer'));\n",'');
assert.equal(withoutLakes,original(art,'index.html').toString(), 'Entire Hermes app retained with only lake and isolated schoolblad insertions');
for (const file of ['output/html/topo-italie-interactief.html','output/html/topo-italie-duolingo.html','dist/index.html']) assert(read(file).equals(read('index.html')),file+' parity');
const derived = ['index.html','output/html/topo-italie-interactief.html','output/html/topo-italie-duolingo.html','geography/lakes/projected-manifest.json','print.html'];
const first = derived.map(read);
execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'pipe'});
derived.forEach((file,i) => assert(first[i].equals(read(file)),file+' idempotent rebuild'));
const output = new URL(html.includes('// BEGIN DISCOVERY MAP')?'docs/visual/discovery-map/':html.includes('// BEGIN SCHOOLBLAD')?'docs/visual/schoolblad/':'docs/visual/release-1-2-integration/',root); mkdirSync(output,{recursive:true});
const result = {base,art,lakes,masters,preserved,canonicalComposition:'PASS: pinned Hermes app + three lake insertions; isolated schoolblad/Discovery additions excluded and checked separately',derivedParity:'PASS: canonical, two downloads, dist',rebuild:'byte-idempotent',masters:'read-only source; no PNGs imported or altered'};
writeFileSync(new URL('source-preservation.json',output),JSON.stringify(result,null,2)+'\n');
console.log('Combined source audit: immutable art/geometry, entire Hermes app, engines/print, downloads and idempotent rebuild: PASS');
