import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const engine = readFileSync(new URL('scripts/learning-engine.js', root), 'utf8');
if (!html.includes(`<script>\n${engine.trimEnd()}\n</script>`)) throw new Error('The one-file HTML lost its inline learning engine');
const file = new URL('output/html/topo-italie-interactief.html', root);
mkdirSync(new URL('output/html/', root), { recursive: true });
writeFileSync(file, html);
writeFileSync(new URL('output/html/topo-italie-duolingo.html', root), html);
console.log('Standalone interactive HTML: output/html/topo-italie-interactief.html');
