import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import { createHash } from 'node:crypto';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
for (const [file,start,end] of [['schoolblad.js','// BEGIN SCHOOLBLAD\n','// END SCHOOLBLAD'],['schoolblad.css','/* BEGIN SCHOOLBLAD */\n','/* END SCHOOLBLAD */']]) {
  if(!html.includes(start+readFileSync(new URL(file,import.meta.url),'utf8')+end))throw Error('Embedded schoolblad source is stale; rebuild');
}
const heroArt = readFileSync(new URL('../output/art/topo-italie-avontuur.webp', import.meta.url)).toString('base64');
const ninoArt = readFileSync(new URL('../output/art/nino-op-de-scooter.webp', import.meta.url)).toString('base64');
if (!html.includes(`<img src="data:image/webp;base64,${heroArt}"`)) throw new Error('Route panorama differs from its source WebP');
if (!html.includes(`--nino-art:url("data:image/webp;base64,${ninoArt}")`)) throw new Error('Nino artwork differs from its source WebP');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
const inline = scripts.filter(match => !match[1].includes('src='));
if (inline.length !== 3 || scripts.length !== 3) throw new Error(`Expected three self-contained scripts, found ${inline.length}`);
const engine = readFileSync(new URL('./learning-engine.js', import.meta.url), 'utf8').trim();
if (inline[0][2].trim() !== engine) throw new Error('Inline engine differs from tested learning engine');
const routeEngine = readFileSync(new URL('./route-engine.js', import.meta.url), 'utf8').trim();
if (inline[1][2].trim() !== routeEngine) throw new Error('Inline route engine differs from tested route engine');
inline.forEach((match, index) => new Script(match[2], { filename: `index.html:inline-${index}.js` }));
const printHtml = readFileSync(new URL('../print.html', import.meta.url), 'utf8');
const printCode = printHtml.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!printCode) throw new Error('Printable map script missing');
new Script(printCode, { filename: 'print.html:inline.js' });
const standalone = readFileSync(new URL('../output/html/topo-italie-interactief.html', import.meta.url), 'utf8');
const bundled = [...standalone.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (bundled.length !== 3 || standalone !== html) throw new Error('Downloaded HTML must equal the one-file app exactly');
if (readFileSync(new URL('../output/html/topo-italie-duolingo.html', import.meta.url), 'utf8') !== html) throw new Error('New route download differs from canonical app');
bundled.forEach((match, index) => new Script(match[1], { filename: `standalone:script-${index}` }));
console.log('App, print page, standalone bundle and learning engine JavaScript syntax: OK');

const nino=readFileSync(new URL('./nino-feedback.js',import.meta.url),'utf8');
if(!html.includes('// BEGIN NINO FEEDBACK\n'+nino+'// END NINO FEEDBACK'))throw new Error('Embedded Nino resolver differs from tested source');
const art=readFileSync(new URL('./nino-art.js',import.meta.url),'utf8');
const artUI=readFileSync(new URL('./nino-art-ui.js',import.meta.url),'utf8');
const artCSS=readFileSync(new URL('./nino-art.css',import.meta.url),'utf8');
if(!html.includes(art+'// END NINO ART')||!html.includes('// BEGIN NINO ART UI\n'+artUI+'// END NINO ART UI')||!html.includes(artCSS+'/* END NINO ART CSS */'))throw Error('Embedded illustration code/styles are stale. Rebuild.');
const manifest=JSON.parse(readFileSync(new URL('../assets/nino/runtime-manifest.json',import.meta.url),'utf8'));
const embedded=JSON.parse(html.match(/window\.TOPO_NINO_ART_DATA=(\{[^\n]+\});/)?.[1]||'null');
if(!embedded||embedded.sourceCommit!==manifest.sourceCommit)throw Error('Missing pinned offline art manifest');
for(const field of ['states','chapters','postcards'])if(JSON.stringify(embedded[field])!==JSON.stringify(manifest[field]))throw Error('Stale art mapping: '+field);
for(const [role,asset] of Object.entries(manifest.assets)){
 const bytes=readFileSync(new URL('../'+asset.path,import.meta.url));
 if(createHash('sha256').update(bytes).digest('hex')!==asset.sha256||embedded.assets[role]?.src!=='data:image/webp;base64,'+bytes.toString('base64'))throw Error('Offline art differs from immutable export: '+role);
}
console.log('Pinned Nino art, reusable slots and all offline image bytes: OK');
