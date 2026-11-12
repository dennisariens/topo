// Assembles index.html from src/v2/ (code and markup) and assets/v2/ (decoded data URIs).
// index.html is generated: edit src/v2/ or assets/v2/, never index.html directly.
//
//   node scripts/assemble-index.mjs               build, verify against src/v2/index.sha256, write index.html
//   node scripts/assemble-index.mjs --check       build in memory, fail if index.html differs (used by npm run lint)
//   node scripts/assemble-index.mjs --update-pin  accept a deliberate change: write index.html and the new pin
//
// Placeholders (expanded recursively, paths relative to the repository root):
//   <!--@part:PATH-->    replaced by the exact bytes of PATH
//   <!--@asset:NAME-->   replaced by data:MIME;base64,… of assets/v2/NAME (mime and sha256 from assets/v2/assets.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFileSync(root + p);
const sha = b => createHash('sha256').update(b).digest('hex');
export const TEMPLATE = 'src/v2/index.template.html';
export const PIN = 'src/v2/index.sha256';
export const MANIFEST = 'assets/v2/assets.json';

export function assemble() {
  const manifest = JSON.parse(read(MANIFEST).toString('utf8'));
  const expand = (text, from, depth) => {
    if (depth > 8) throw Error('Part nesting too deep at ' + from);
    return text.replace(/<!--@part:([^>]+?)-->/g, (_, p) => expand(read(p).toString('utf8'), p, depth + 1));
  };
  const html = expand(read(TEMPLATE).toString('utf8'), TEMPLATE, 0).replace(/<!--@asset:([^>]+?)-->/g, (_, name) => {
    const entry = manifest[name];
    if (!entry) throw Error('Asset missing from ' + MANIFEST + ': ' + name);
    const bytes = read('assets/v2/' + name);
    if (sha(bytes) !== entry.sha256) throw Error('Asset bytes differ from ' + MANIFEST + ': ' + name);
    return 'data:' + entry.mime + ';base64,' + bytes.toString('base64');
  });
  return Buffer.from(html, 'utf8');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const out = assemble(), hash = sha(out), args = process.argv.slice(2);
  if (args.includes('--check')) {
    if (!out.equals(read('index.html'))) { console.error('index.html differs from the assembled src/v2 + assets/v2 output. Edit src/v2, then run: node scripts/assemble-index.mjs'); process.exit(1); }
    console.log('index.html equals assembled source: ' + hash);
  } else {
    const pin = read(PIN).toString('utf8').trim();
    if (hash !== pin && !args.includes('--update-pin')) { console.error('Assembled sha256 ' + hash + ' differs from pin ' + pin + ' in ' + PIN + '. Nothing written. For a deliberate change rerun with --update-pin.'); process.exit(1); }
    writeFileSync(root + 'index.html', out);
    if (hash !== pin) writeFileSync(root + PIN, hash + '\n');
    console.log('index.html written: ' + out.length + ' bytes, sha256 ' + hash + (hash !== pin ? ' (pin updated)' : ' (matches pin)'));
  }
}
