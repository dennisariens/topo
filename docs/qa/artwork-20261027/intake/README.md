# Final passport artwork intake — 27 October 2026

**Art intake complete; production acceptance remains separate.** Eight owner ZIPs were actually read from the workspace, CRC-tested and extracted into one isolated staging directory. Their 34 files were imported without content changes: **18 artwork assets, four supplied JPEG evidence boards, and 12 package/document files**. No path collisions or cross-path duplicate content were found against the existing repository. No image generation, redesign, retouching, runtime feature or reward change was performed.

Target: `art/nino-travel-stamps-v2-20261026`, isolated worktree from exact remote `fab2bbae943d507fcd103887012f790c144f43a5`. That art branch contains a legacy application; its runtime must never be merged into the reviewed P0 app. P0 worktrees were left untouched.

## Evidence and integrity

- **8/8** ZIP CRC checks PASS; archive sizes, SHA256 and every member path/hash are in [archives.json](archives.json). Archive SHA256 values are independently recorded fingerprints; no external signed archive digest was supplied.
- **25/25** supplied `SHA256SUMS.txt` entries and **18/18** asset-manifest byte/hash/dimension declarations match. Source alpha declarations match measured data. [Hash verification](hash-verification.json).
- **20/20 existing passport masters** preserved: 11 chapter stamp PNGs, two book sources, two Gold seal PNGs, four postcard fronts and one reverse. All other existing assets and runtime/build/engine files also match the baseline. The only existing-file edits are documentary delivery updates to Project State and the source handoff. [Preservation](preservation.json), [baseline fingerprints](baseline.json).
- **49 passport PNG/WebP files** strictly decoded (31 existing +18 new); all four supplied JPEG boards decoded as well. Native sizes, modes, actual alpha, bounds, edge contacts, profiles, hashes and source-pixel budgets are in [technical-audit.json](technical-audit.json).
- **18 existing master-manifest hashes** match (11 stamps + two Gold + five postcard files). The two existing book masters are covered by baseline hashes. All **22 PR48 allowlist blobs** were independently hashed at exact `4eb9a5ae33550d789c56d5c01393145a148565aa`; its reviewed scope is retained, not expanded.
- The three older source-archive digests inside the supplied manifest are historical provenance claims. Those three ZIPs were not supplied in this intake and their archive bytes were not independently rechecked here; existing Git source hashes were checked instead.

[Delivery SHA256 ledger](SHA256SUMS.intake.txt) covers all imported files, generated evidence and documentary updates, excluding its own self-hash. Original package metadata/evidence is unchanged. The original README, SHA file, reviewed import script and eight part inventories are archived under [source-package/](source-package/). Their repository-relative asset/document paths resolve against the repo; the script copy is provenance, not a command to run from this nested directory. The reviewed script was executed from the clean target art worktree against the fully extracted staging root; it imported/staged only assets. All QA documents were then copied/staged explicitly.

## Visual evidence and findings

[Received-files contact sheet](contact-sheet.jpg) · [Cream](key-assets-cream.png) · [Dark](key-assets-dark.png) · [Checker](key-assets-checker.png) · [Native facing-page pair](folio-pair-cream.png) · [Native dark pair](folio-pair-dark.png) · [1x size proof](size-proof-1x.png) · [2x size proof](size-proof-2x.png) · [ISOLE comparison](isole-geography-comparison.png).

These are deterministic composites of actual source bytes, labelled ART QA / NO REWARD. They are not generated artwork, implemented screens, earned-state demonstrations or physical-device acceptance. The supplied catalogue happens to depict page03/04 references, but their image binaries are **not** in these eight archives; the fresh contact sheet shows only the 18 received assets. Pages03/04 remain governed by the existing layer-based production decision, not missing new backgrounds to generate.

**Blank folios:** Both PNG originals and both WebP candidates are native **1086×1448**, not 1536×2048. The WebPs have a lossless `VP8L` bitstream and **zero differing decoded RGB channels** versus their respective PNGs; only alpha changes. Their centres are fully opaque. Actual transparent fractions are 3.251% left /2.821% right; opaque fractions 96.249% /96.519%. At 2x, native width supports at most 543 CSS px without upsampling; that is a pixel budget, not Retina/device certification. No source was resampled or replaced.

The same-canvas pair has an 8-native-pixel top and 3-pixel bottom difference at alpha>=128. Left alpha>=128 reaches the top/right canvas edges; 1,417 nonzero edge pixels require native edge/binding inspection. Right has no nonzero canvas-edge pixels. Central source RGB means differ by approximately (-2.66,-2.20,-2.81) left minus right. The diagnostic pair retains full canvases at x0/x1086, without mirroring, cropping, invented registration or recoloring. The two images have compatible cream paper and intended facing-page orientation in visual inspection, but seam/edge acceptance remains **QA REQUIRED**. Faint route/postmark decoration is part of the source; never interpret it as actual earned visits.

**ISOLE:** The corrected 1254×1254 PNG has real alpha and a clear red/blue imprint. The two main blue components put Sardinia west and north of Sicily by centroid: approximately (378.55,614.79) vs (724.68,759.04), north up. **This is not full geographic approval:** their vertical bounds still overlap by 86 native pixels (Sardinia bottom752; Sicily top666). The reviewed canonical app silhouettes have a north/south gap of 47.26 SVG units (Sardinia bottom834.71; Sicily top881.97). These are different units; the comparison concerns overlap versus separation, not an absolute distance match. [Exact canonical excerpt provenance](canonical-islands-provenance.json) pins `bd1e57bc48e55a065cbbccb68acea196a64a187c`, without touching its map. Hermes must decide whether the remaining stylization satisfies the geographic gate or requires a further correction. Until then use a truthful text-only completion state. No production ISOLE export is silently substituted.

**ARRIVO:** 1536×1536 RGBA, actual alpha0–254; 72.286% fully transparent, no alpha255 pixels, five nonzero canvas-edge pixels. The word ARRIVO and scooter read at inspection sizes; fine text/detail at64px is not certified. Use a live accessible label and >=160px detailed view. Dark backgrounds are diagnostic, not approval for low-contrast red ink there. Edge clipping, matte/fringe and 1x/2x acceptance remain independent gates. The generic blank imprint does not supply a city, date or visit event; those must come from real canonical Vespa trips.

**Chapter/final Gold:** Existing separate 1254×1254 original PNGs were verified, not reuploaded. Both have real alpha0–255 but predominantly partial alpha (only about0.028% /0.030% alpha255); edge-contact counts18/13 need native inspection. The chapter compass reads as a symbol at small size; final text needs a larger view (the proof includes240px) plus live HTML labels. Neither has a newly approved production export. Chapter Gold requires that chapter's real `goldAt>0`; final ESPLORATORE D'ORO requires all11 Gold states. This task did not implement those projections or change earning.

**Gold ornament:** REWORK; known colored semi-alpha fringe, ghost flecks and stray marks remain visible on dark/checker diagnostics. Excluded from the recommended production allowlist. It is optional and must not block use of a separately accepted final Gold seal. No attempted cleanup or new generation.

**Bologna/Milano and full pages:** The two1536×1024 postcards are opaque RGB concepts with painted paper edges. No alpha-cutout claim, new earning rule or activation. The nine full-page/endpaper files remain CONCEPT ONLY; pages07/08 are native768×1024. Baked frames, photo holders, routes and ornament are references, not finished interactive UI. The optional endpaper is not chapter12 or an extra achievement.

**Color:** All49 passport files lack embedded ICC profiles and PNG color-characterization chunks. Decoder sRGB interpretation is not calibrated source/device color certification. Original bytes and folio RGB parity establish color preservation; no recoloring or profile conversion was applied to source assets. The red/yellow semi-alpha pixel count is descriptive and also counts legitimate red/gold ink; it is not an automatic halo verdict.

## Status and recommended use

[Per-file ledger JSON](asset-ledger.json) / [CSV](asset-ledger.csv) give every native measurement/hash and **PASS / QA REQUIRED / REWORK / CONCEPT ONLY** disposition. Source integrity/decode PASS is separate from permission to consume an image in the app.

New-package dispositions: **6 QA REQUIRED, 1 REWORK, 11 CONCEPT ONLY; zero new runtime approvals**. All18 technical source-file checks pass. Ten existing stamp candidates byte-match the accepted PR48 exports on warm paper, with live chapter labels and detailed views; PASS records that equivalence, while runtime permission remains attached to the approved export paths/commit; original ISOLE and the baked open-book remain excluded.

[Recommended allowlist](production-allowlist.json) pins the22 already-reviewed PR48 exports at their exact source commit/hash, reports which paths are present here, and marks the6 promotion candidates (folio pair, corrected ISOLE, ARRIVO, two original Gold seals). It does **not** copy missing exports, overwrite originals, approve concepts or retroactively rewrite PR48. Its old missing-Gold/arrival wording describes historical availability; those sources are now present, but acceptance is still separate.

No new asset is wired into `index.html`, build outputs, the map, UI, learning/assessment/rewards or saved data. All actual stamps, counts, destinations, dates, postcards and Gold must remain dynamic projections of the existing canonical state in a later separately authorised integration. Preserve45 objects,11 chapters, normal completion versus Gold, all11 final Gold,8-slice/third-pizza travel, offline operation and backups.

## Checks, reproduction and next gate

The art branch's `npm test`, lint and build pass; their logs are in [gates/](gates/). These exercise the unchanged **legacy art-branch app**, not a substitute verification of the ongoing P0 runtime. All existing runtime files remain byte-identical after build.

[Offline browser diagnostic](browser/results.json): actual file://,9 data-URL images, macOS Chromium, five desktop/tablet/phone layouts, 1x/2x native-pixel sufficiency, no horizontal overflow, page exceptions or external requests. It is an asset sheet only, **not an implemented passport, accessibility audit, state/reward test or physical iPad acceptance**. Diagnostic folios deliberately cap at540 CSS px to respect their native 2x budget. Browser screenshots are in [browser/](browser/).

The two development-only QA scripts require sharp0.34.5 and Playwright; dependencies are not added to the app. Run from repo root:

```sh
SHARP_MODULE=/absolute/path/to/sharp/lib/index.js node docs/qa/artwork-20261027/intake/verify-artwork.mjs
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node docs/qa/artwork-20261027/intake/browser-proof.mjs
```

`verify-artwork.mjs` is read-only by default. `--write-evidence` regenerates only diagnostic evidence, never source assets. [Tool versions](technical-audit.json) pin Node, sharp, libvips and image-codec versions. Node24.13.1 completed the inherited npm gates; npm ci's inherited jsdom engine-range warning is retained in its log.

No intake file is missing. Remaining **production** blockers: independent folio seam/alpha/native-resolution acceptance, ISOLE geographic spacing, ARRIVO/Gold alpha/edge/readability acceptance and production export choices, physical iPad/owner approval, then a separately scoped current-runtime integration. Optional ornament/postcards/full-page concepts are excluded, not reasons to restart artwork creation. The single bounded independent pass is [HERMES_HANDOFF.md](HERMES_HANDOFF.md). No merge into the application or deployment was performed.
