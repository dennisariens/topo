# Independent Gold artwork QA

Pinned repository: `/Users/dennisariens/projects/topo-passport-final-art-qa`

Commit verified: `8a704cb23da97baf7197635df7fa12f06b864a24`. Working tree clean before and after. Read intake HERMES_HANDOFF.md, README.md and PASSPORT_FIVE_SPREADS_V2_SPEC_2026-10-26.md. QA outputs only; no production exports, artwork edits, reward changes or integration.

## Verdict

**Both core seals: CONDITIONAL overall — visual artwork PASS for warm-paper use at the sizes below; physical-device/owner approval and an independently verified runtime derivative remain pending. No redesign or core artwork REWORK required.**

| Existing source (repository-relative) | SHA256 | Decision |
|---|---|---|
| `assets/nino/travel-passport/gold/masters/gold-chapter-seal-v2.png` | `60c54e6efbb8239c327b4d7c76660dc816535a1f5431bf7c3cbe9f2927a1adf0` | CONDITIONAL; artwork PASS as chapter symbol >=48 CSS px; prefer64; detailed view >=160 |
| `assets/nino/travel-passport/gold/masters/gold-esploratore-doro.png` | `e94a76ab4c0220eead56e3f208dc539a71bae2f217ca7756939903bce024e3ca` | CONDITIONAL; artwork PASS as compact final emblem >=160 CSS px with live title; main finale presentation >=240, prefer320 |
| `assets/nino/travel-passport/gold/concepts/gold-finale-ornament-overlay.png` | `f58e3077c57740345ed48632d3917baba32a451bf8bb1e917753e3ff91e62947` | REWORK / excluded, OPTIONAL ONLY; not a core-seal blocker |

## Actual visual findings

- Chapter: convincing warm antique brass, coherent eight-point compass, dimensional opposed light/dark facets, embossed olive branches, rings and deliberately irregular rim. No text in this asset; no small baked label to certify. At48 it is a recognizable gold compass medallion, not a readable fine engraving.64 is the better repeated chapter size;96 is clearer and160 resolves foliage/relief. Dense detail appropriately merges rather than becoming malformed glyphs.
- Final: visibly distinct, not merely the chapter PNG enlarged. More elaborate compass with central boss, star arc, fleur-de-lis, tricolour ribbon, correctly readable `ESPLORATORE D’ORO`, `ITALIA`, landscape and Vespa. Consistent serif lettering; no obvious malformed/misspelled inscription. Same aged metallic family, brighter and more ceremonial. At160/1x inscription is small and secondary;240 is a usable main presentation,320 materially improves lettering and scene. No promise that tiny engraved subdetail is accessible text even at320.
- Both are embossed medallions/foil-like metal, NOT transparent ink stamps. Their mostly filled medal interiors are intentional, not stray white/paper sticker rectangles. Neither shows a broad cream matte, baked checkerboard or objectionable halo in the rendered warm-paper, dark or checker size proofs. Dark/checker are diagnostic, not unrestricted production theme approval. Native raw transparency can reveal isolated fine colour noise around the outline; no conspicuous coloured rim survives the assessed CSS sizes. Do not confuse legitimate metallic highlights or final tricolour with fringe defects.
- Chapter/final distinction is good **at their different functional sizes and with live labels**. The shared compass is intentional family consistency, not sufficient standalone semantic identity. Never use either miniature image without its real achievement label; final must not be repeated beside chapter stamps.
- Optional ornament independently shows grey/white ghost flecks across nominally empty interior on dark, with dirty/coloured edge remnants. Keep it out. The finale works with the final seal alone; no replacement ornament is required.

## Native alpha and clipping

Both core PNGs are genuinely1254x1254; all size samples were downsampled directly from these bytes. No native-resolution claim based on upscaling.

- Chapter: transparent43.0083%, partial56.9637%, opaque0.02804%.18 nonzero canvas-edge pixels, ALL exactly RGBA(0,0,0,1), on x=0 at y219–226 and972–981. Meaningful alpha>=128 bounds `(83,72,1180,1158)` (right/bottom exclusive). These contacts are near-invisible extraction residue, not clipped metal.
- Final: transparent25.9634%, partial74.0065%, opaque0.03014%.13 nonzero canvas-edge pixels, ALL exactly RGBA(0,0,0,1), on x=0 at y148–150,1169–1175,1177–1179. Alpha>=128 bounds `(15,15,1237,1239)` leave the actual metal clear of the canvas edges. Not a visibly amputated rim/ribbon.
- Nonzero-alpha median253 for BOTH; 10th percentile252 for BOTH. Thus “predominantly partial alpha” does not mean mostly transparent washed-out metal. Interior is almost opaque; do not globally threshold/boost alpha to255.
- Ornament1086x1448:527 unique nonzero canvas-edge pixels; maximum edge alpha27, plus clearly visible interior ghosts. Native measurements and every edge RGBA coordinate are recorded in measurements.json.

## Scope, labels and earning

One chapter asset may appear beside each of the11 canonical chapter stamps **only for that exact chapter's actual `goldAt > 0`**. It must not obscure ink. A48 CSS image is visual size, not independent accessibility/touch certification. Keep chapter name and earned status in live HTML, e.g. `[Hoofdstuk] — Goud behaald`; enlarging action needs accessible name/focus and >=44x44 CSS target. When adjacent live text already gives the meaning, image may be decorative (`alt=""`); otherwise use a truthful alt. Do not rely on a tooltip or baked art alone.

Final seal appears only when ALL11 canonical chapter `goldAt > 0`; derive this, do not persist another award boolean or use completion count. Main p10 title `Esploratore d’oro — Italia` and honest `11/11 gouden hoofdstukken` must be live text. Before unlock show actual `X/11 gouden hoofdstukken`, no earned golden seal or ornamental surrogate. No chapter12, extra reward, fabricated date or visit. Decorative stars are decoration, not counted achievements.

## Minimal export path (instructions only; NOT executed)

No visual repair is required for the accepted warm-paper scope. If a runtime derivative is authorised later:

1. Verify the exact source path/hash above; preserve master bytes. Keep full1254 square canvas, original registration, RGB and alpha. No trimming, matte, recolouring, sharpening, shadow, new inscription or aggressive global de-fringing.
2. Safest first derivative: lossless RGBA PNG or lossless WebP at1254x1254, with decoded RGBA equality against the source. Do not let an optimizer quantize alpha or flatten to paper. If codec rewrites invisible alpha0 RGB, explicitly record that exception rather than claim exact equality.
3. If size variants are needed, derive each directly from the master using an alpha-aware/premultiplied resampler and unpremultiply on output (Pillow RGBA LANCZOS used for these QA samples). Chapter physical widths:48/96 for48 CSS1x/2x;64/128 for64;96/192 for96;160/320 for160 detail. Final:160/320,240/480,320/640. Prefer lossless first; never resize a small export upward. Preserve aspect ratio with contain.
4. Read back every derivative, check dimensions/alpha, create/hash a manifest and re-render over warm paper/dark/checker. A different derivative is not automatically approved by these master QA boards. Low-alpha1 edge residue can remain: it is not a repair prerequisite. Any optional cleanup must be a separate reviewed derivative, never a master edit.
5. Integrate only in a separately authorised runtime task; verify real states0..11, repeat-safe eligibility, live labels, unclipped placement and offline bundling. Physical iPad Safari/VoiceOver, orientations and owner visual approval still required. Retain previous allowlist unchanged.

At2x the1254-pixel source has627 CSS-pixel width budget; tested maximum320 CSS requires640 physical pixels, safely below source size. This is pixel sufficiency, not calibrated foil colour or physical Retina acceptance.

## Evidence handles

All paths below relative to `/Users/dennisariens/.hermes/outputs/topo-passport-final-art-qa/gold/`:

- `sizes-paper-1x.png`: all requested CSS sizes rendered in1x physical pixels, strongest baseline legibility proof.
- `sizes-paper-2x.png`: actual2x physical pixels, not enlarged1x board.
- `sizes-dark-1x.png`, `sizes-dark-2x.png`: dark diagnostics.
- `sizes-checker-1x.png`, `sizes-checker-2x.png`: transparency diagnostics.
- `native-chapter-paper.png`, `native-chapter-dark.png`, `native-final-paper.png`, `native-final-dark.png`: full1254 square native composites, no resampling.
- `edge-crops.png`: native1:1 crops and explicitly labelled nearest-neighbour2x magnification (magnified diagnostics are NOT native art). Some enlarged comparison panels touch neighbouring panels; use original native composites for whole-edge inspection.
- `native-ornament-dark.png`: obvious ghost-fleck evidence; optional ornament exclusion.
- `measurements.json`: exact source fingerprints, dimensions, alpha fractions and edge coordinates.
- `qa_gold.py`: reproducible Pillow/NumPy QA-board generator, run using `/Users/dennisariens/.hermes/cache/scratch/topo-final-art-qa/bin/python`.

Limit: expert screen-render proxy using actual bytes, not browser-layout, integrated earning, physical-device, calibrated colour or owner acceptance. Repository remained unmodified.
