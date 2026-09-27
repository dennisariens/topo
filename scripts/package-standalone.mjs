import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const engine = readFileSync(new URL('scripts/learning-engine.js', root), 'utf8');
const reference = '<script src="scripts/learning-engine.js"></script>';
if (html.split(reference).length !== 2) throw new Error('Learning engine script reference changed');
const file = new URL('output/html/topo-italie-interactief.html', root);
mkdirSync(new URL('output/html/', root), { recursive: true });
writeFileSync(file, html.replace(reference, `<script>\n${engine}\n</script>`));
console.log('Standalone interactive HTML: output/html/topo-italie-interactief.html');
