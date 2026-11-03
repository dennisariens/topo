# NINO V2 — independent artwork closure QA

## Verdict: REWORK — package closure not established

**Tested commit:** `2a9dda3d3d8ec567687bc3b61bf9cbde645c752c` — [Codex PR70](https://github.com/dennisariens/topo/pull/70), issue67. **Independent reviewer:** Hermes; Codex is exporter/integrator. Reviewed the exact delivered snapshot, not main or a substitute candidate.

**Technical binary delivery and preserved current-runtime checks PASS. This is not a blanket rejection of the artwork.** Closure cannot be signed off while the machine ledger promotes a historically retired master to READY, required-category integration is still pending without an owner closeout-scope decision, and folio/Venezia owner gates remain unresolved. Do not redesign or repaint approved assets to fix these gates. Owner has final visual approval.

No application, artwork, production tests, generator or approved source master was edited by this QA. This directory contains evidence and QA-only programs. The tested PR70 SHA remains unchanged; evidence is published on a separate QA branch. No merge, deployment, release promotion or learner-download replacement.

## Independently verified inventory

- **239/239 unique manifest paths**, **225 unique blobs**, zero measurement mismatches. **56 delivery-present /183 source-only** entries. All delivered working files equal the pinned Git blobs.
- **236 raster entries decoded;3 SVG entries byte/XML checked.** Hashes/blobs, raster dimensions, format, mode, color metadata, alpha counts, decoded RGBA and delivery-presence assertions reconciled row by row. SVG source identity is verified; no standalone SVG rasterization/OS installation approval is claimed.
- **30/30 independent export-equivalence checks PASS:** both distinct Gold seals (1254-square native and chapter64/128 /final240/480 PNG+WebP), corrected ISOLE, ARRIVO, ten other stamp copies, two normalized folios and four non-Venezia postcards.
- **20/20 existing masters unchanged** against independently enumerated historical baseline and ART/PR66 blobs. Only Venezia's original master is delivered in this target; the other19 remain source-only. Preserved source availability is not delivery/runtime integration.
- **Venezia:** actual full/tight PNG and WebP are in the tested Git tree. Full1536×1024 PNG preserves every original RGB byte. Tight1497×973 is exact half-open full-image RGBA crop `[23,26,1520,999]`, not an upscaled1536 canvas. PNG/WebP alpha and visible RGBA agree. WebP changes213487 full /97198 tight fully invisible RGB pixels; do not claim entire decoded-RGBA equality. Full reconstructed alpha is binary0/255.
- Independent Git comparison: all five changed HTML files equal PR61 after removing the single exact approved favicon block;41 protected engine/geometry/test/print/dependency files unchanged. Historical adapters retain assertions and reject arbitrary marker contents, script injection and altered icon bytes. See [provenance review](provenance/REVIEW.md).

## PASS / FAIL / NOT TESTED matrix

Each cell refers only to the stated scope. NOT TESTED is not PASS. Detailed row-level technical evidence is in [inventory-results.json](binary/inventory-results.json); category machine matrix is [matrix.json](matrix.json).

| Category / check | Source or technical export | Actual current-runtime acceptance | Release classification / remaining gate |
|---|---|---|---|
| Six current Nino poses + original panorama/scooter | PASS | PASS: startup, real lesson/Gold/arrival, fallback and responsive UI | READY for preserved existing use; extra source poses not silently activated |
| 11 chapter icons | PASS:11/11 source exports decoded/measured/visually inspected | NOT TESTED: current chapter art mapping remains null | INTEGRATION PENDING; source-only availability is not11 integrated chapter pictures |
| 11 ink stamps, including corrected ISOLE | PASS: source copies/native corrected derivative; warm-paper art scope | NOT TESTED: no earned chapter-stamp holder | INTEGRATION PENDING; live labels required at small sizes, not map geometry |
| ARRIVO | PASS: source-preserving1536 derivative and transparent ink | NOT TESTED: no earned ARRIVO stamp placement | INTEGRATION PENDING; destination/date must follow real trip, not decorative rendering |
| Two distinct Gold seals | PASS: native and exact approved-scale PNG/WebP | NOT TESTED: new seal art is not used by current Gold UI | INTEGRATION PENDING; chapter>=48CSS/prefer64; final main>=240/prefer320; live labels and genuine goldAt gating |
| Normalized blank left/right folios | PASS: exact accepted normalized copies, open writing areas; no earned overlays | NOT TESTED: no art-passport component | INTEGRATION PENDING; decorative scenery/faded ornaments are baked art, not recorded travel |
| Folio native resolution versus1536×2048 requirement | FAIL: only1086×1448 | NOT TESTED: no live page-size contract | Owner exception required; at DPR2 at most543CSS px/page wide without upscale |
| Retired `book/masters/passport-open-book.png` status | FAIL: historical REWORK/ARCHIVAL REFERENCE is labelled READY | NOT TESTED / not delivered or integrated | Correct to archival-excluded/OPTIONAL DEFERRED; do not promote as a blank folio |
| Sicilia/Sardegna/Napoli fronts + universal reverse | PASS: source-preserving exports, warm-holder visuals | NOT TESTED: no collectible ownership/front-back UI | INTEGRATION PENDING; no invented message/date/visit |
| Venezia B full/tight exports | PASS: real Git files, original painting RGB, crop, alpha and visible codec parity | NOT TESTED: no live collectible holder | INTEGRATION PENDING plus reconstructed-edge owner gate |
| Venezia exact owner-reviewed matte identity | NOT TESTED: reference unavailable at independently checked handles | NOT TESTED | EXPORT/REFERENCE PENDING; upstream0.1264% tolerance not independently reproduced |
| Micro-v2 ICO/16px/32px favicon | PASS: exact pinned PR65 bytes | PASS: all3 inline links decode offline in Chrome/WebKit | READY for HTML integration; OS selection/cache and native Safari NOT TESTED |
| Static Pisa closed/three open boxes | PASS: approved source binaries, visual/static availability | NOT TESTED: actual current app uses old8-wedge pizza, not these boxes | READY as static assets only; in-app box presentation remains a scope/integration decision |
| 45 objects /11 chapters /source geometry /map interactions | PASS: immutable-source comparison,17-program tests and all45 fixture trials | PASS within executed matrix; no fresh GIS survey/continuous-space certification | Existing PR61 independent functional release gate remains separate |
| Gold earning /pizza /Vespa /save safety | PASS: unchanged canonical engines | PASS: genuine first-stop play, wrong-Gold rejection,8→pizza /24→3pizzas→trip, real backup and reload | Current Nino Gold pose is not acceptance of new Gold-seal placement |
| Hinged Pisa animation #31 /PR63 | NOT TESTED: known separate REWORK rig not activated | NOT TESTED | OPTIONAL DEFERRED; no requirement to create missing layers in this QA |
| Milan/Bologna/Gelati additions | NOT TESTED: future scope | NOT TESTED | OPTIONAL DEFERRED; not hidden release blockers |

## Actual browser and regression execution

Fresh `npm ci`; Node24.15.0; build/lint/full17-program tests, release audit and map-preservation audit PASS. `typecheck` is a documented no-op, not TypeScript coverage. [Raw execution](gates/independent-release-check.txt).

Independently authored [browser-qa.mjs](browser-qa.mjs), installed Chrome156.0.8078.74 and Playwright WebKit27.2, **seven cases each**, fresh offline `file://` contexts only:

1. 1500×1000 /800×900 /390×844 startup:45 objects/11 chapters, no premature Gold, all3 inline favicons decoded; decorative image alt/aria, no horizontal overflow and draft/caret/state through breakpoint changes.
2. Actual deliberately broken data-image decoding invokes original-Nino fallback without progress/storage mutation. Expected injected-resource failures are separated from clean startup errors.
3. Genuine first-stop Discover→Point→Write, using actual mouse coordinates and neutral chooser buttons, not answer/state replacement or direct grading calls. Chapter completion does not show Gold before a genuine Gold pass.
4. Genuine Gold pass after all12 pointing/writing tasks, including six-question pause handling: Nino Gold pose appears only on the completed earned result.8 correct=1pizza;24correct=3pizzas=1trip.
5. Actual UI JSON export before Gold, restore into another fresh context, then completed mixed/wrong Gold: no Gold earned, no medal pose. Real progress persists on reload, normalizing only the documented ordering of the reward-token set and checking uniqueness; no fields dropped.

Final runs have zero unexpected console/page errors or external network requests. Actual Gold/reward screenshots are played app states; asset composites are explicitly diagnostic, not fake passport/award screens. Maintained all45 harness was also rerun:45 unique rows in both styles,180 correct/90 wrong pointer trials and180 writing trials. Those use declared per-question fixtures, **not** a natural-route playthrough of all45. DOM tests separately exercise all11 chapters.

Raw final browser data: [Chrome](browser/chrome-independent-browser.json), [WebKit](browser/webkit-independent-browser.json), [all45 ledger](all45/ledger.json). [Runtime checkpoint and QA-driver correction history](RUNTIME_CHECKPOINT.md) retains failed attempts. Corrections concerned guessed summary selectors, canonical token ordering and document-level scrolling before manual mouse coordinates; no production change or grading relaxation.

## Visual inspection and original-size evidence

All9 category contact sheets inspected: poses/original art,11 source chapter icons,11 stamp exports,ARRIVO,both Gold families,both folios,postcards/reverse,micro icons and static pizza.22 actual PNG diagnostic sheets exist (21 mapped in `contact-sheets.json` plus the native/8× tiny-icon sheet). Transparent art inspected on warm/dark/true-checker backgrounds; dark diagnostics do not broaden historical warm-holder approval.

- [Full category mapping](binary/contact-sheets.json) / [technical inventory](binary/inventory-results.json).
- [Gold actual64px chapter](binary/native-gold-chapter-seal-v2-64.png.png) and [actual240px final](binary/native-gold-esploratore-doro-240.png.png): compass readable; final `ESPLORATORE D'ORO` / `ITALIA` text is legible at240. Preserve live captions and approved size/holder scopes; no newly inferred dark-mode acceptance.
- [Venezia native full](binary/native-postcard-04-venezia-scalloped-full.png.png) / [native tight](binary/native-postcard-04-venezia-scalloped-tight.png.png): full scene and actual-size dark-edge crop inspected. Scallops are present, no rectangular exterior or conspicuous dark matte fringe observed. Binary-mask edge is not original anti-aliased-matte identity; owner acceptance remains open.
- [Folios](binary/contacts-book.png): correct left/right orientation and broadly consistent parchment/style, open content regions; known canvas contact/registration caveat remains, no hidden upscale. Native edge/corner inspected. Existing scenic/faded ornamentation is not an earned overlay; blank-until-earned runtime behavior is NOT TESTED because that component is absent.
- [Micro native/8× pixel proof](binary/tiny-native-and-8x-nearest.png): Italy-only16 and scooter+Italy larger variants visibly distinguishable, native size readability preserved within tiny-icon limits. OS favicon/cache choice not established by an image decode.
- [Actual earned Gold/third pizza/trip](browser/chrome-genuinely-earned-gold-and-third-pizza-trip.png), [completed chapter without Gold](browser/chrome-completed-chapter-no-gold.png), [completed wrong Gold](browser/chrome-wrong-gold-no-award.png), [390px actual app](browser/chrome-fresh-390.png), [actual image fallback](browser/chrome-actual-broken-image-fallback.png).

No new visible export corruption/crop/color inconsistency requiring approved-art redesign was found in the inspected current-release assets. Fine stamp words are subordinate to live captions at small sizes; warm-holder and detail-size caveats from the29Oct review remain. Final aesthetic, calibrated-color and owner approval are not transferred to this report.

## Concise return to Codex / owner

**D1 — ledger defect (medium, concrete):** `assets/nino/travel-passport/book/masters/passport-open-book.png` is READY although the row itself records `qa: REWORK`, `artwork: ARCHIVAL REFERENCE` and baked old postmark/content. Source is1586×992, but generic dependencies also describe it as a1086×1448 folio. Correct both the generator's classification rule and generated ledger/placement/dependency fields; retain the source as archival, do not repaint or integrate it. Recheck no other retired/concept master is promoted by generic `masters→READY` logic.

**D2 — release-status clarity (low):**53 READY rows include41 source-only;72 INTEGRATION PENDING include28 source-only. Existing prose caveats are honest, but status totals are not release totals. Report source availability, delivered exports and actual runtime integration separately and keep exact per-row dimensions/approval scopes. No invented runtime PASS.

**C1 — folio owner decision:** explicitly accept the bounded native-resolution exception/display cap, or supply approved higher-native-resolution replacements. Never upscale and call it a higher-resolution master.

**C2 — Venezia owner/reference decision:** provide the exact original reviewed raster matte/ZIP path or URL, or explicitly accept the reconstructed contour outputs. Independent PR66 body/comments/reviews/inline-comments/tree/README search found no retrievable original matte. Do not claim the historical0.1264% comparison independently reproduced or demand a new painting.

**C3 — closure scope/integration decision:** owner must confirm asset-only closeout versus requiring a bounded follow-up integration of the already approved passport/chapter/stamp/seal/postcard/static-box components. Current absence is correctly disclosed, but it cannot become a runtime PASS or silently OPTIONAL DEFERRED like hinge/stories. Hermes will not build those components as a second implementer.

After D1/D2 correction and explicit C1/C2/C3 decisions, return a new exact delivery SHA for focused re-review. Existing current-app tests pass; do not expand the illustration backlog. Keep native Safari, OS favicon cache/home-screen/device, physical iPad/IME/VoiceOver, real print and owner final visual acceptance separate. This QA does not close PR61's independent functional/owner gate.

## Reproduce

Use a disposable checkout of the exact tested SHA plus this evidence directory; source Git objects pinned in the manifest must be fetched. No learner profiles/saves.

```sh
# Node24.15.0; Playwright1.64.1 installed as dev tooling outside the repo.
npm ci
QA_RELEASE_AUDIT_DIR=docs/qa/nino-v2-hermes-67/release-audit/ \
 QA_PRESERVATION_FILE=docs/qa/nino-v2-hermes-67/map-preservation.json npm run release:check
export PLAYWRIGHT_MODULE="$HOME/.hermes/cache/scratch/nino-v2-qa-browser/node_modules/playwright/index.mjs"
export CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
node docs/qa/nino-v2-hermes-67/browser-qa.mjs
QA_BROWSER=webkit node docs/qa/nino-v2-hermes-67/browser-qa.mjs
QA_INTEGRITY_DIR=docs/qa/nino-v2-hermes-67/all45/ node scripts/qa-computer-release.mjs
python3 docs/qa/nino-v2-hermes-67/provenance/compare-provenance.py
# Python3.8 + Pillow10.4.0 in scratch, no exporter invocation:
"$HOME/.hermes/cache/scratch/nino-independent-binary-venv/bin/python" docs/qa/nino-v2-hermes-67/binary/audit.py
```

Candidate HTML SHA-256: `3203f1b4cd9b72b60ed5301fdeafc9fd59988d1b12fb75ce22902b130b50b635`,3,156,792bytes. Existing published learner HTML was not replaced. Machine summary and final matrix are alongside this report; all evidence is scoped to the exact tested SHA.
