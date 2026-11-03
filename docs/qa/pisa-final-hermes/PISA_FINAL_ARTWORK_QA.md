# NINO Pisa Edition — Final Independent Artwork QA

## Verdict: REWORK — NOT FINAL / NOT LOCKED / DO NOT INTEGRATE ANIMATION

**Independent reviewer:** Hermes. Approved Pisa print/pizzas are locked; no redesign is requested or performed. No production source, generator, learning app, rewards, or original artwork changed by this QA.

### Exact inputs

- PR72 / `art/pisa-hinge-source-preserving-final-20261103`: **`8414319186c834cad091231d6c9beed6068b5876`**.
- Pinned CI run41644779256 /artifact13234956425. CI inner **`NINO_PISA_SOURCE_PRESERVING_QA.zip`**, SHA-256 **`d87c9d50f2a29b16d4d42ab24d73020478b5a0dff4e2edd17010347b6f58df82`**. Outer artifact digest independently matched GitHub: `dbb6e0ddd9b5947e27fb002e565399b4e304b1f710cfadb5275ea37b64076991`.
- Separately supplied **`NINO_PISA_FINAL_ARTWORK_REVIEW_v2.zip`**, **20,357,014 bytes**, SHA-256 **`b314beb412d9eb5fb4cd33cb1b3fe297343121869f1cfd16659887cc3b78442d`**.
- Approved source base `bf91fb3fa6ac553f78b33169efa9f2bf60e215ca`; static fallback PR29 `dcc474e8a9d1bc97559a3207b0a330423e128558`. Historical PR63 `92893ae91a177e4272807d662e2b101ff934017d` is failed-rig context, not a passed substitute.

The earlier missing-v2 checkpoint was superseded by actual uploaded bytes. V2 is now reviewed, NOT merely assumed identical to CI. Both independently fail physical closure/occlusion. [Actual comparison](PISA_PR72_VS_REVIEW_V2.md).

## Verified technical/source passes

- Fresh Git-tree comparison: **all79 current PNG/WebP source files** equal the approved art base and PR29 byte-for-byte. All4 v2-declared source hashes match actual sources. Originals preserved; derived faces are not originals.
- V2 ZIP CRC/path/symlink/size checks pass: **32 files**, **31 declared manifest entries all match bytes/SHA-256**, plus manifest itself inventoried. **28 actual images** decoded; seven registered PNG layers1254×1254; two auxiliary UVs800×800.
- All3 actual WebPs: **24 encoded frames,54ms/frame,1296ms,loop1**. Time0/25/50/75/100% samples use frames0/6/12/18/23, starting0/324/648/972/1242ms. Shipped static0/18/35/53/70° proofs are not time quartiles.
- No alpha contact with canvas edges in tested v2 compositing PNGs or any decoded motion frame.1254 canvas is padding, not restored native resolution: approved960 images are scaled0.8 before placement.
- Existing PR72 exporter executed unchanged, successfully, in an isolated fresh build; source-file identity checked against the pinned Git blob. Actual V2 versus that rebuild:0/28 byte-identical and4/28 fully decoded-identical. Exact V2 production is not reproducible from supplied source in the tested environment. No producing V2 commit/generator is in the archive. Platform/codec variation is a qualification, not alone proof of repainting.
- V2 versus actual CI images:0/28 byte-identical;5/28 fully decoded-identical. The identical components are exterior print UV, all3 pizza PNGs, and the renamed common foreground rim. Tray/underside/registered lids and animations differ. CI success does not validate the V2 ZIP.
- Source branding/tower/olive branches and visible exterior print orientation retained in inspected poses; no reversed-letter backface observed in those samples. Missing underside has been replaced with a visible kraft derivative, but presence alone does not prove a physically convincing rig.

## Blocking defects — actual supplied V2

### F1 — P1: pizza remains visible when closed

**Assets:** `layers/front-rim-occlusion.png`, all `proof/*-00-0deg.png`, all3 motion files frame0 (0–54ms), with related leakage through early opening.

The shared foreground contains baked Margherita crust/pizza, not just cardboard. It is composited in front of the closed printed lid. The claim of progressive reveal is therefore not met even though closed-flavor images are nearly equal: the wrong common pixels are shared.

Opaque rim/pizza/closed-lid overlap on the1254 canvas measures **17,067 Margherita /16,480 Salami /17,068 Quattro pixels**, bounding box `[315,822,839,1041]` (half-open). These are diagnostic mask intersections, not an automatic classifier of every pizza-colored pixel; native inspection confirms visible crust along the front notch/right edge.

**Correction:** re-segment the foreground to cardboard only from approved sources, remove baked pizza from common occluders, and retest zero visible pizza at closed pose for every flavor. Preserve original pizza art; do not cover the error by repainting branding or crossfading full images.

### F2 — P1: cross-flavor perimeter contamination

**Assets:** the same common rim plus Salami/Quattro animation composites across playback. The common rim is decoded-identical to the CI rim despite other V2 corrections.

Within the opaque overlap, common-rim color differs by more than30 RGB levels from the intended flavor at **12,125 Salami pixels /4,414 Quattro pixels**; Margherita control **0**. Actual visual/source-component inspection confirms shared Margherita perimeter art. This is not repaired by changing only the underlying pizza layer.

**Correction:** cardboard-only foreground and correctly registered, flavor-specific pizza/crust behind it. Recheck all three masks/edges on light/dark/ivory/checker backgrounds and every motion frame.

### F3 — P1: closed lid does not seat on tray; physical edge/flap contract incomplete

**Assets:** `layers/lid-exterior-closed-registered.png`, `layers/tray-empty-corrected.png`, all closed proofs/motion frame0; moving edge connections throughout opening.

The printed face visibly overhangs the tray as a separate sheet, while the foreground rim crosses the printing. Actual alpha bounds: lid `[92,576,908,1212]` versus tray `[180,568,926,1133]`. These bounds include antialiasing; native inspection, not bounds alone, establishes the gross front-left overhang. V2 still declares lid length1.14 box-depths and screen offset `[0,38]`; a flat projected face plus edge strokes does not supply convincing lid thickness/rear flap connections.

**Correction:** register lid footprint and true rear hinge to the same stationary tray/camera; derive proper thickness/flap/edge surfaces while preserving the approved exterior print. Validate closed seating before opening, not merely absence of canvas clipping. No new packaging concept is needed.

### F4 — P2: production provenance and documentation remain inconsistent

V2 QA notes now truthfully describe hidden faces as reconstructed derivatives, an improvement over literal source-pixel claims. Nevertheless its README says105°, while manifest/proofs/QA notes say70°. Exact producing V2 revision is not supplied and the successful pinned CI package is demonstrably different.

**Correction:** remove stale105° text; publish the actual producing revision/build recipe/dependency lock or an explicit immutable imported-art manifest binding the exact ZIP. Do not call CI validation of different bytes acceptance of V2. Reconstructed faces require owner visual acceptance, not a claim of recovered original pixels.

## Browser, reduced motion and child-facing review

Actual **supplied `review.html`**, Chrome156.0.8078.80, fresh contexts, **file:// with network disabled**. All3 animations decoded and changed early→final in normal mode. Keyboard replay worked. Under `prefers-reduced-motion: reduce`, each article displayed its static70° proof, hidden motion images were not shown, and visible image hashes stayed stable. **PASS for this review page**, not for TOPO integration. No page/console errors or external requests. Desktop and820×1180 browser-size captures; no physical iPad/Safari/VoiceOver acceptance.

The earlier CI raw WebPs still animate under reduced-motion preference unless a consumer selects a static fallback. V2's review-page improvement is real and is not a retroactive PASS for that package or the learning app.

Actual frames inspected on light, dark, warm ivory and checkerboard, with native closed/open frames and approximately350/360CSS display sizes. Pisa/pizzas remain recognizable, but the exposed crust and loose sheet-like closed lid are visibly unconvincing for a premium child reward. No unnecessary extra effects/new mascot/design were introduced. Smooth playback and attractive source art cannot override the physical P1s.

Current ZIP layer dimensions are compatible; temporal geometry/registration is not certified from dimensions alone. Parent compared actual selected frames, not only generator source. Source checks, the fresh rebuild and V2 comparisons cited here are direct independent measurements; producer QA prose was not used as acceptance evidence.

## Evidence and reproduction

- [Acceptance matrix](PISA_QA_MATRIX.md)
- [PR72 versus V2](PISA_PR72_VS_REVIEW_V2.md)
- [V2 per-file hash/alpha/dimension/movie audit](v2/v2-audit.json), [full V2 SHA-256 list](v2/V2-SHA256SUMS.txt)
- [Fresh source preservation/rebuild comparison](v2/v2-source-and-rebuild.json), [build log](v2/source-rebuild.log)
- [Margherita annotated native proof](v2/v2-margherita-closed-annotated.png), [Salami](v2/v2-salami-closed-annotated.png), [Quattro](v2/v2-quattro-formaggi-closed-annotated.png)
-12 v2 time/background sheets named `v2/v2-<flavor>-<light|dark|ivory|checker>.png`; all are QA composites of actual decoded pixels, not replacement artwork.
- [Actual offline review-page results](v2/browser/results.json), desktop/iPad-sized captures in that folder. No fabricated learner reward/passport screen.

Run `v2/audit_v2.py` with Pillow10.4 against the extracted ZIP and pinned CI package; run `v2/source_rebuild_compare.py` after executing unchanged `scripts/build_pisa_source_preserving_qa.py` in an isolated scratch CWD with approved assets available. Tested rebuild: Python3.12.13/Pillow13.0.0/numpy2.5.4/OpenCV5.0.0 on macOS arm64. Asset audit/composites: Python3.8.2/Pillow10.4.0. `v2/browser-v2.mjs` uses Node24.15.0 and external Playwright1.64.1, with `PLAYWRIGHT_MODULE`/`CHROME_PATH`; it navigates the supplied page, not a replacement implementation. Input locations are recorded in `INPUTS.json`; reproduce using your own scratch paths.

## Final production gate / return to Codex

**PR72 CI: REWORK. Supplied Review V2: REWORK. Neither is FINAL/LOCKED. No implementation-ready handoff is issued while F1–F3 remain.**

Return the corrected registered source layers/masks, exact generating Git SHA, immutable ZIP/checksum and fresh proofs for all flavors. Recheck actual time quartiles plus closed/final poses, source integrity, zero early pizza, flavor-correct perimeter, seated lid/hinge/thickness and offline/reduced-motion behavior. Keep PR29's approved static reward fallback. Do not become a second implementer, redesign approved art, merge/deploy/replace learner HTML, or close issue31; owner approval remains required.
