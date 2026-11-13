// Adds the independent Nino Topo portal and its approved R2 assets to the normal
// static build output. Does not modify the existing learning engine.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const required = [
  'portal/index.html',
  ...['it','fr','es','de','nl'].map(code => `portal/assets/flags/${code}.svg`),
  'portal/assets/flags/LICENSE',
  'assets/nino-topo/v3-r2/brand/logo/logo-01-primary.svg',
  'assets/nino-topo/v3-r2/brand/logo/logo-02-compact.svg',
  'assets/nino-topo/v3-r2/brand/characters/nino-vespa-canonical.webp',
  'assets/nino-topo/v3-r2/brand/icons/vespa-premium-192.png',
  ...['italy','france','spain','germany','netherlands'].flatMap(country => [
    `assets/nino-topo/v3-r2/destinations/${country}-destination.webp`,
    `assets/nino-topo/v3-r2/destinations/${country}-hover.webp`
  ])
];

if (!existsSync('dist/index.html')) throw new Error('Expected existing Italy learning build at dist/index.html');
for (const file of required) {
  if (!existsSync(file)) throw new Error(`Missing approved portal asset: ${file}`);
  const to = join('dist', file);
  mkdirSync(dirname(to), {recursive:true});
  copyFileSync(file,to);
}
console.log(`Nino Topo portal: exported ${required.length} R2 files to dist/portal/ and dist/assets/.`);
