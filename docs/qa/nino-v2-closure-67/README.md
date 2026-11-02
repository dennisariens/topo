# NINO V2 artwork closure — issue #67

**Exporter/integrator verdict: GO FOR INDEPENDENT QA of this bounded delivery.**
This is not final artwork, device or release approval. No merge, deployment,
promotion, published-download replacement or learner-server change was made.
The exact delivery commit and review PR are pinned in the PR/issue handoff;
the immutable implementation base is PR61 `1bf86b3e1c69319bed8ef877243070a64d97a12e`.

## Actual scope and provenance

The production report and final ledger live here; the machine inventory is
`artwork-manifest.json` / `.csv`. Each row records actual file bytes, SHA256,
Git blob, pinned source branch/commit, dimensions, format/mode, alpha counts,
color metadata, approval, export readiness, intended placement, runtime use,
delivery presence and remaining dependencies. Source-only files are decoded
from actual Git blobs, not inferred from a PR description. They are intentionally
not all copied into the runtime directory. Original checkouts/masters are intact.

`pr-snapshot.json` pins the observed PR61/63/65/66 heads and bases. Source art:
`8a704cb23da97baf7197635df7fa12f06b864a24`; independent Hermes review:
`9e58e756f124ff37d47b4ebcfd274684125d8aeb` (especially
`docs/qa/artwork-20261029/hermes-final/{README.md,gold/VERDICT.md,final-asset-ledger.json}`).
PR65 actual binary source: `5cfcbc37eb6b0266d76d2c05404d993908611410`.
PR66 recipe/contour: `cec9fd26ac858bdbcbdf03b5ee6b0ea246e3e02f`.
PR63 actual hinge README at `92893ae91a177e4272807d662e2b101ff934017d`
confirms REWORK; its base `bf91fb3fa6ac553f78b33169efa9f2bf60e215ca`
contains the approved static box binaries used here.

## Final ledger

| Package | Status | Exact delivery / remaining gate |
|---|---|---|
| Six current runtime Nino poses | READY | Existing manifest bytes and decoded embedded images preserved. Additional source character poses, including reflect/travel, inventoried; not silently activated. |
| Eleven chapter icons | INTEGRATION PENDING | 11/11 actual approved source exports measured and browser-decoded from pinned blobs. Current PR61 chapter manifest remains null; no design or new chapter invented. |
| Eleven chapter ink stamps | INTEGRATION PENDING | Ten accepted WebPs copied byte-identically; rejected old ISOLE not promoted. Corrected approved ISOLE source has a native1254 lossless WebP. Exact approval scopes/live labels remain necessary. |
| ARRIVO | INTEGRATION PENDING | Approved1536-square source has source-preserving lossless WebP; no fictional trip/arrival. |
| Two distinct Gold seals | INTEGRATION PENDING | Native1254 PNG+WebP; chapter64/128 and final240/480 PNG+WebP. Every decoded RGBA byte equals source/resampled reference, including invisible pixels. Warm-paper scope, chapter>=48CSS/prefer64; final>=240CSS/prefer320, live labels. No goldAt eligibility code changed. |
| Blank folios | INTEGRATION PENDING | Two normalized WebPs copied byte-identically. Native1086×1448; owner resolution exception remains pending, <=543CSS/page atDPR2. No upscale, fixed concept-page embedding or interactive passport claim. |
| Sicilia/Sardegna/Napoli/reverse | INTEGRATION PENDING | Native1536×1024 source-preserving lossless WebPs. Partial alpha retained. No card ownership/unlocks added. |
| Venezia B scallops | INTEGRATION PENDING | Four actual recipe outputs committed, full1536×1024 and tight1497×973. PNG all original RGB exact; PNG/WebP visible RGBA and alpha exact. Reconstructed edge needs independent acceptance. |
| Exact owner-reviewed Venezia raster matte | EXPORT PENDING | BLOCKED for exact comparison: original local PNG/WebP/ZIP not supplied at a repository path by PR66. No exact filename/path or blob is given upstream; do not invent one. The approved master and572-point reconstruction are available and used. This does not block inspection of the authorized recipe outputs. |
| Micro-v2 icons | READY | PR65 exact ICO+16px Italy+32px scooter/Italy are inline data-URI favicon links in every candidate standalone. All five PNG sizes and two SVG masters retained.24/48/64 are reference exports, not claimed OS installation targets. OS favicon cache/native Safari/home-screen acceptance pending. Large icon unchanged. |
| Static Pisa pizza boxes | READY | Exact approved closed/three open WebPs copied, decoded and captured as assets. PR61 still uses its approved existing pizza wedges; no claim that the box was already its reward UI. No substitute animation. |
| Hinged lid / #31 / PR63 | OPTIONAL DEFERRED | REWORK is preserved; missing storyboard/registered layers are not essential V2 blockers. |
| Ornament, old ISOLE, fixed page concepts, optional stories | OPTIONAL DEFERRED | Rejected/reference/future material never activated. No Milan calcio/Bologna/gelati design production. |

READY means the stated source/export/runtime scope is verified, not self-approved
final QA. All newly produced derivatives still require exact-SHA independent
acceptance. The package is not labelled DONE. PR61 has no earned passport UI,
postcard ownership mapping or chapter-art mapping; creating those would be a
separate functional implementation, beyond this asset closeout. No fake
passport/reward screenshots or parallel application were produced.

## Export evidence and reproduction

Temporary build environment: Python3.8, Pillow10.4.0. Default Python lacked Pillow;
its old pip initially failed, then the isolated installer was updated and the
compatible binary wheel installed. No runtime dependency or repo lock changed.

```sh
python3 -m venv /private/tmp/topo-artwork-67-venv
/private/tmp/topo-artwork-67-venv/bin/pip install --upgrade pip setuptools wheel
/private/tmp/topo-artwork-67-venv/bin/pip install Pillow==10.4.0
/private/tmp/topo-artwork-67-venv/bin/python scripts/build_venezia_postcard.py --out assets/nino/travel-passport/postcards/exports
/private/tmp/topo-artwork-67-venv/bin/python scripts/close-nino-artwork-67.py
/private/tmp/topo-artwork-67-venv/bin/python scripts/inventory-nino-artwork-67.py
```

The production script can read preserved source bytes from pinned ART Git
objects when not duplicated in this branch. Fetch that exact source commit if
using a shallow clone. `export-verification.json` records30 verified exports,
including byte-identical copies. PR66 adds four Venezia files and its own manifest.
No image generation/repainting was used.

`venezia-codec-verification.json`: full WebP changes213487 invisible RGB pixels;
tight changes97198. Visible RGBA differences=0; alpha is identical. These are
fully transparent RGB codec changes, not a claim of entire decoded RGBA equality.
The full PNG preserves every original RGB byte. PR66 reports0.1264% of pixels
with alpha deviation>64 from the original reviewed matte; that historical
comparison cannot be independently rerun without the missing matte. No false
byte-identical owner-export claim. The reconstructed mask is binary0/255.
`master-preservation.json` rechecks20/20 old masters against baseline
`fab2bbae943d507fcd103887012f790c144f43a5` and the actual PR66 tree.

## Runtime changes and validation

Only three approved micro-favicon links change app HTML. `html-preservation.json`
proves the entire remaining HTML equals PR61 byte-for-byte. Engines, geometry,
rendering policy, save schema,45 IDs/11 chapters, print and reward logic remain
exact. Build embeds icons after presentation assembly. Historical preservation
audits explicitly allow only the exact three links after checking pinned PR65
binary hashes; arbitrary marker contents fail. No teaching/reward assertion
was removed. Audit output paths can target this evidence folder.

Use Node24.15.0, installed locally, ahead of default24.13.1 (the current jsdom
dependency reports an engine warning with the older default). `npm ci` completed
with0 reported vulnerabilities; no dependency update was made.

```sh
export PATH=/Users/dennisariens/.npm/_npx/1c56de6e9acc34f8/node_modules/node/bin:/usr/local/bin:/usr/bin:/bin
npm run build
npm run lint
npm test
QA_RELEASE_AUDIT_DIR=docs/qa/nino-v2-closure-67/release-audit/ npm run audit:release-1-2
QA_PRESERVATION_FILE=docs/qa/nino-v2-closure-67/map-preservation.json node scripts/audit-map-picker-revision.mjs
PLAYWRIGHT_MODULE=/Users/dennisariens/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node scripts/qa-nino-artwork-67.mjs
```

Exact final exits/logs: `command-results.json`, `*-delivery.log`,
`build-complete.log`, `browser-verified.log`, `browser-results.json`.
Typecheck is a documented no-op, not a passed type analysis.
Intermediate failures are retained: extra audit copies violated the six-file
runtime allowlist (copies removed); the old source audit rejected new favicon
links (bounded exact-byte adapter); sandbox Chrome launch failed (authorized
external launch); multi-megabyte source data-URL navigation failed (local-file
source inspection); one audit ran before dist was rebuilt (rerun sequentially).
Large raw failure logs are retained as `.log.gz`, not silently discarded.

The Browser plugin is unavailable. Installed Chrome via Playwright tested actual
`file://` with context offline=true at1500×1000 and800×900. Before/after startup,
all embedded images, delivered export images, all11 chapter source exports and
character sources decode. No page/console error or external request was observed.
Real free-writing submissions verify8 correct=1pizza,24 correct=3pizzas=1trip,
and JSON storage survives reload. Native artwork captures assert painted pixels
equal natural dimensions. Diagnostic gold64/final240 and Venezia composites
were inspected; they are QA sheets, not earned passport displays.

Screenshots: `before/after-desktop.png`, `before/after-compact.png`,
`one-pizza.png`, `three-pizzas-one-trip.png`, native Venezia/Gold/static box
captures, and `gold-and-venezia-size-proof.png`. No layout redesign was made.
Headless screenshots do not prove OS favicon selection/cache, Safari, calibrated
color, physical iPad, VoiceOver, print output or owner visual acceptance.

## Hermes exact-SHA handoff

Check the immutable delivery SHA pinned in the draft PR and issue67 comment.
Independently verify manifest hashes/actual binaries, both Gold scales and alpha,
Venezia native scallops vs owner reference (or report missing reference), native
folio limitations,11 icons/stamps, ISOLE/ARRIVO, postcard reverse, tiny favicon
clarity and offline candidate decoding. Review all status/usage claims; do not
mistake source availability for integration. Return PASS/CONDITIONAL/FAIL with
evidence at that SHA. Owner resolves folio/edge conditions and retains merge,
release/download and deployment approval. Codex has not self-approved final QA.
