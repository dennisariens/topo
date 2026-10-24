import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url),base='c68ace4e44a6e797f536ec1a8d6b517d29167320';
const source=execFileSync('git',['show',base+':index.html'],{cwd:root,maxBuffer:20*1024*1024}).toString();
const css=readFileSync(new URL('./theme.css',import.meta.url),'utf8'),ui=readFileSync(new URL('./proof-ui.js',import.meta.url),'utf8');
// Replacement callbacks avoid dollar-sign interpolation in original application code.
const safe=source.replace('</head>',()=>'<style id="proofStyles">\n'+css+'\n</style></head>').replace('</body>',()=>'<noscript><p style="padding:16px">Javascript staat uit: de statische Schoolkaart blijft beschikbaar. Gebruik het bestaande printboek voor een toegankelijke papieren oefenvorm.</p></noscript><script id="proofUI">\n'+ui+'\n</script></body>');
writeFileSync(new URL('./proof.html',import.meta.url),safe);
writeFileSync(new URL('./source.json',import.meta.url),JSON.stringify({base,canonicalSHA256:createHash('sha256').update(source).digest('hex'),canonicalBytes:Buffer.byteLength(source),proofBytes:Buffer.byteLength(safe),sourcePolicy:'Canonical HTML/scripts/geometry embedded unchanged. Only docs presentation CSS and fixture UI appended. No production files edited.',generatedWith:'node docs/map-design-proof/generate.mjs'},null,2)+'\n');
console.log('Generated self-contained docs proof from exact canonical Git object '+base);
