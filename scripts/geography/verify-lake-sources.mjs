// Optional online audit. Normal generation/build/tests use the committed excerpt offline.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {source, provenance, hash} from './lakes.mjs';

assert.equal(hash(readFileSync(new URL('../../geography/lakes/source.geojson', import.meta.url))), provenance.excerptSha256);
for (const upstream of provenance.upstream) {
  const response = await fetch(upstream.url);
  assert(response.ok, `Source download: ${response.status}`);
  const raw = Buffer.from(await response.arrayBuffer());
  assert.equal(hash(raw), upstream.sha256, 'Pinned upstream byte hash');
  const original = JSON.parse(raw);
  for (const feature of source.features.filter(f => f.properties.sourceDataset === upstream.dataset)) {
    const matches = original.features.filter(f => f.properties.ne_id === feature.properties.sourceProperties.ne_id);
    assert.equal(matches.length, 1);
    assert.deepEqual(feature.geometry, matches[0].geometry, 'Exact upstream polygon, no fabricated vertices');
    assert.deepEqual(feature.properties.sourceProperties, matches[0].properties, 'Original upstream metadata retained');
    console.log(`${feature.id}: exact pinned upstream geometry + properties`);
  }
}
