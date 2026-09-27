import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
const inline = scripts.filter(match => !match[1].includes('src='));
if (inline.length !== 1) throw new Error(`Expected one inline app script, found ${inline.length}`);
new Script(inline[0][2], { filename: 'index.html:inline.js' });
new Script(readFileSync(new URL('./learning-engine.js', import.meta.url), 'utf8'), { filename: 'learning-engine.js' });
console.log('App and learning engine JavaScript syntax: OK');
