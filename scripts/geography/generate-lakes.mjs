import {readFileSync, writeFileSync} from 'node:fs';
import {lakeMarkup, lakeManifest, start, end} from './lakes.mjs';

const file = new URL('../../index.html', import.meta.url);
const html = readFileSync(file, 'utf8');
const a = html.indexOf(start), b = html.indexOf(end);
if ((a < 0) !== (b < 0)) throw new Error('Incomplete generated lake block');
const next = a < 0
  ? html.replace('<g id="previewMap"', lakeMarkup() + '<g id="previewMap"')
  : html.slice(0, a) + lakeMarkup() + html.slice(b + end.length);
if (!next.includes(lakeMarkup())) throw new Error('Lake composition entrypoint missing');
writeFileSync(file, next);
writeFileSync(new URL('../../geography/lakes/projected-manifest.json', import.meta.url), JSON.stringify(lakeManifest(), null, 2) + '\n');
console.log('Six background lakes generated from pinned Natural Earth polygons (no simplification)');
