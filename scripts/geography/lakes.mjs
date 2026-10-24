import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

export const hash = value => createHash('sha256').update(value).digest('hex');
export const project = ([longitude, latitude]) => [55 * longitude - 225.5, 3830.75 - 77 * latitude];
export const lakeUse = '<use href="#lakeGeometry" data-context-layer="lakes" aria-hidden="true" pointer-events="none"/>';
export const start = '<!-- BEGIN GENERATED LAKES -->';
export const end = '<!-- END GENERATED LAKES -->';
export const source = JSON.parse(readFileSync(new URL('../../geography/lakes/source.geojson', import.meta.url)));
export const provenance = JSON.parse(readFileSync(new URL('../../geography/lakes/sources.json', import.meta.url)));

// No simplification: preserve every source vertex, ring, winding and order.
// SVG quantisation is at most 0.005 units per axis in the canonical 890×1235 frame.
export function lakePath(feature) {
  if (feature.geometry.type !== 'Polygon') throw new Error('Expected source lake Polygon');
  return feature.geometry.coordinates.map(ring => ring.map((point, index) =>
    `${index ? 'L' : 'M'} ${project(point).map(n => Number(n.toFixed(2))).join(' ')}`
  ).join(' ') + ' Z').join(' ');
}

export function lakeMarkup() {
  const paths = source.features.map(f => `  <path data-lake="${f.id}" d="${lakePath(f)}"/>`).join('\n');
  return `${start}\n<defs><g id="lakeGeometry" aria-hidden="true" pointer-events="none" fill="#c5e3eb" stroke="#689baa" stroke-width="0.75" stroke-linejoin="round" fill-rule="evenodd">\n${paths}\n</g></defs>\n${end}`;
}

export function lakeManifest() {
  return source.features.map(f => {
    const points = f.geometry.coordinates.flat(), projected = points.map(project);
    const bounds = arr => [Math.min(...arr.map(p => p[0])), Math.min(...arr.map(p => p[1])), Math.max(...arr.map(p => p[0])), Math.max(...arr.map(p => p[1]))];
    return {id: f.id, name: f.properties.displayName, dataset: f.properties.sourceDataset,
      ne_id: f.properties.sourceProperties.ne_id, sourceGeometrySha256: hash(JSON.stringify(f.geometry)),
      pathSha256: hash(lakePath(f)), vertices: points.length, boundsWgs84: bounds(points),
      boundsProjected: bounds(projected).map(n => Number(n.toFixed(2)))};
  });
}
