// Controleert de site-uitvoer in dist/ (na build-site.mjs). Faalt de build bij een kapotte verwijzing.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const must = f => assert(existsSync(join(dist, f)) && statSync(join(dist, f)).size > 0, 'Ontbreekt in dist: ' + f);

assert(html.includes('Waar gaan we vandaag naartoe?'), 'dist/index.html is niet het portal');
assert(!html.includes('../'), 'Portal verwijst buiten de site-root');
assert(html.includes("italy:'./italie/'") && html.includes('france:null'), 'Routecontract gewijzigd (Italië → ./italie/, Frankrijk nog geen route)');
for (const m of html.matchAll(/(?:src|srcset|href)="\.\/([^"#'+]+\.[a-z0-9]+)"/g)) must(m[1]);
for (const c of ['italy', 'france', 'spain', 'germany', 'netherlands']) for (const k of ['destination', 'hover']) must(`assets/nino-topo/v3-r2/destinations/${c}-${k}.webp`);
for (const f of ['it', 'fr', 'es', 'de', 'nl']) must(`assets/flags/${f}.svg`);
for (const i of JSON.parse(readFileSync(join(dist, 'site.webmanifest'), 'utf8')).icons) must(i.src.slice(2));
must('favicon.ico'); must('italie/index.html'); must('italie/print.html'); must('italie/printboek.pdf');
assert(readFileSync(join(dist, 'italie/index.html'), 'utf8').includes('Topo Italië'), 'dist/italie/index.html is niet de Italië-app');
assert(html.includes('favicon-32.png') && html.includes('nino-welcome-r3.webp') && html.includes('logo-01-primary-r3-1.svg'), 'R3-merkassets niet aangesloten');
assert(html.includes('prefers-reduced-motion'), 'Reduced-motion ontbreekt');
const contrast = (a, b) => { const L = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); const [x, y] = [L(a), L(b)]; return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
for (const t of ['lav-dark', 'lav-hover']) { const m = html.match(new RegExp('--' + t + ':(#[0-9A-Fa-f]{6})')); assert(m && contrast(m[1], '#FFFFFF') >= 4.5, 'Contrast te laag: ' + t); }
console.log('Site-check: OK');
