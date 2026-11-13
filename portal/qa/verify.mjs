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
const flagCodes = ['it','fr','es','de','nl'];
for (const code of flagCodes) required.push('portal/assets/flags/'+code+'.svg');
required.push('portal/assets/flags/LICENSE');
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
assert(portal.includes('./assets/flags/'), 'Native SVG flag paths missing');
assert(!portal.includes('/legacy/superseded-logo-v1/'), 'Deprecated logo used');
assert(!portal.includes('raw.githubusercontent.com'), 'Unpinned external asset references found');
assert(portal.includes('class="flag-pill"'), 'Flag capsule markup missing');
assert(portal.includes('vespa-icon-02-compact.webp'), 'Side-view Vespa favicon candidate missing');
assert(portal.includes('.country.active:hover .action[href]'), 'CTA hover state missing');
assert(portal.includes('.country.future:hover .visual img.alt'), 'Independent future-card hover missing');
const allFutureHover = (portal.match(/\.future:hover/g)||[]).length;
const cardScopedHover = (portal.match(/\.country\.future:hover/g)||[]).length;
assert.equal(allFutureHover,cardScopedHover,'BUG: parent grid shares `.future:hover` and triggers all 3 cards');
function contrast(a,b){const color=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);let x=color(a),y=color(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
for(const token of ['lav-dark','lav-hover']){
 const match=portal.match(new RegExp('--'+token+':(#[0-9A-Fa-f]{6})'));
 assert(match,'Missing '+token+' token');
 assert(contrast(match[1],'#FFFFFF')>=4.5,'Insufficient white-on-'+token+' CTA text contrast');
}

const logoSvg=readFileSync(resolve(repo, 'assets/nino-topo/v3-r2/brand/logo/logo-01-primary.svg'),'utf8');
assert(logoSvg.includes('viewBox'), 'Logo is not a valid SVG');
console.log('Nino Topo portal static R2 checks: PASS — '+required.length+' files, 5 destination pairs, 5 licensed vector flags, 2 canonical logos.');
