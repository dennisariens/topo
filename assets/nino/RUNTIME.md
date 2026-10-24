# Nino runtime illustrations — Release 1.2

## Immutable owner source

The six `exports/*.webp` files are **byte-for-byte copies**, not new exports, from:

- Repository: `dennisariens/topo`
- Source branch: `art/nino-complete-20261024` (reference only)
- Pinned commit: `047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d`
- Source inventory: `assets/nino/manifest.json` at that commit

`runtime-manifest.json` records the imported file paths, dimensions, byte counts and SHA-256 values. Build and lint reject changed bytes. No PNG masters, concept boards, app-icon candidates or older app tree were copied. The owner art/design branch is not modified, merged or cherry-picked.

**Visual approval remains pending.** Encourage's small gold thumb rays and all supplied pixels are intentionally preserved. Arrival is a generic Italian travel illustration, not a photograph or geographic depiction of each earned destination; the actual destination is supplied separately by the reward engine and the picture is labelled as a travel illustration.

## Data and slots

- `assets`: local immutable WebP files and provenance/dimensions.
- `states`: logical Welcome/Guide/Encourage/Success/Gold/Arrival → asset mapping.
- `chapters`: all eleven stable chapter IDs, currently `null` while art is pending.
- `postcards`: empty. This release does **not** grant postcards or invent unlocks.
- `scripts/nino-art.js`: pure visual selection and reusable `TopoArt.create(document, request, variant)` / `TopoArt.update(slot, request)` renderer.
- `scripts/nino-art-ui.js`: actual hero, lesson, practice, summary and Arrival placements. No new save fields.

Example of adding approved future chapter art, without touching grading:

1. Copy the approved immutable WebP into `assets/nino/chapters/`, retaining provenance.
2. Add its `path`, `width`, `height`, `bytes`, `sha256` to `assets` under a stable key such as `chapter-islands`. Approved runtime paths may live under `exports/`, `chapters/` or `postcards/`.
3. Set `chapters.islands` to `"chapter-islands"`.
4. Rebuild and run tests/browser checks. `#chapterScene` automatically reads the current chapter; pending art leaves the original panorama/route intact. Locked chapter requests return no image.

The postcard renderer accepts `{kind:'postcard', postcard:'key', unlocked:true}` only when a mapped asset exists. **A future implemented collectible system must supply a real unlock event**; this renderer never writes progress, grants ownership, or displays pending cards as earned. Adding imagery is not implementing postcards.

Missing assets hide the optional slot. An image decode/error event replaces the image with the existing original Nino portrait, not a broken image or a loop of network retries. Illustration boxes have fixed dimensions; all illustration images are decorative/aria-hidden because the visible text already communicates the event.

## Offline build

`node scripts/embed-nino-art.mjs` validates source hashes and embeds the manifest, six data-URL WebPs, renderer, UI helpers and styles into the existing third inline script/styles in canonical `index.html`. Both learning engines remain the first two inline scripts, unchanged. The feedback resolver is kept synchronized from its source.

`npm run build` invokes embedding before existing preview/print/standalone packaging. Both downloadable HTML files and `dist/index.html` remain byte-identical to canonical `index.html`. They need no sibling assets, CDN, external JS, font, API or network connection. The local WebPs remain reviewable source assets, not runtime network dependencies.

When changing presentation sources, run the build before lint, because lint deliberately rejects stale generated HTML or stale embedded code/styles. Normal fresh-checkout lint/test/build works because generated outputs are committed.
