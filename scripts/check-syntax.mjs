import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
const inline = scripts.filter(match => !match[1].includes('src='));
if (inline.length !== 1) throw new Error(`Expected one inline app script, found ${inline.length}`);
new Script(inline[0][2], { filename: 'index.html:inline.js' });
new Script(readFileSync(new URL('./learning-engine.js', import.meta.url), 'utf8'), { filename: 'learning-engine.js' });
const printHtml = readFileSync(new URL('../print.html', import.meta.url), 'utf8');
const printCode = printHtml.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!printCode) throw new Error('Printable map script missing');
new Script(printCode, { filename: 'print.html:inline.js' });
const standalone = readFileSync(new URL('../output/html/topo-italie-interactief.html', import.meta.url), 'utf8');
const bundled = [...standalone.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (bundled.length !== 2 || standalone.includes('src="scripts/learning-engine.js"')) throw new Error('Standalone HTML must contain both scripts inline');
bundled.forEach((match, index) => new Script(match[1], { filename: `standalone:script-${index}` }));
console.log('App, print page, standalone bundle and learning engine JavaScript syntax: OK');
