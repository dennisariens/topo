import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const portal = readFileSync(resolve(repo, 'portal/index.html'), 'utf8');
const required = [
  'assets/nino-topo/v3-r2/brand/logo/logo-01-primary.svg',
  'assets/nino-topo/v3-r2/brand/logo/logo-02-compact.svg',
  'assets/nino-topo/v3-r2/brand/characters/nino-vespa-canonical.webp',
  'assets/nino-topo/v3-r2/brand/icons/vespa-premium-192.png',
  'index.html'
];
const countries = ['italy','france','spain','germany','netherlands'];
for (const country of countries) {
  required.push('assets/nino-topo/v3-r2/destinations/'+country+'-destination.webp');
  required.push('assets/nino-topo/v3-r2/destinations/'+country+'-hover.webp');
}
for (const file of required) assert(existsSync(resolve(repo,file)), 'Missing R2 asset or Italy entry: '+file);
assert(portal.includes('logo-01-primary.svg') && portal.includes('logo-02-compact.svg'), 'Canonical logo bindings missing');
assert(portal.includes("const countries=[") && portal.includes('countries){'), 'Country mapping missing');
assert(portal.includes("const routes={italy:'../index.html',france:null}"), 'Route contract changed: re-verify Italy and France');
assert(portal.includes('prefers-reduced-motion'), 'Reduced-motion support missing');
assert(portal.includes('country:focus-within') || portal.includes('country:focus-visible'), 'Keyboard focus state missing');
assert(!portal.includes('/legacy/superseded-logo-v1/'), 'Deprecated logo used');
assert(!portal.includes('raw.githubusercontent.com'), 'Unpinned external asset references found');
const logoSvg=readFileSync(resolve(repo, 'assets/nino-topo/v3-r2/brand/logo/logo-01-primary.svg'),'utf8');
assert(logoSvg.includes('viewBox'), 'Logo is not a valid SVG');
console.log('Nino Topo portal static R2 checks: PASS — '+required.length+' files, 5 destination pairs, 2 canonical logos.');
