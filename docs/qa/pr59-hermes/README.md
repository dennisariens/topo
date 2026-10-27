# Independent Hermes QA — PR59: ADJUST

**Exact candidate:** `d55e9deb2adfa7985bc33a3251402860f95a0b46`.
Baseline PR51: `bd1e57bc48e55a065cbbccb68acea196a64a187c`.
Assignment: PR59 comment6443626029. No implementation, merge, deployment, owner8033 server change or replacement of the released learner download. Evidence is separate from candidate code.

## Decision

**ADJUST — child-level geographic recognizability is not established by separated dots.** The connectors are clearer and source coordinates are preserved, but that is not sufficient for the requested pedagogical GO. This is expert proxy inspection, not evidence from an actual11-year-old or physical iPad/Safari test. It does not claim that a well-trained child could never recall these pairs.

## P1 — Rome/Vatican: clean dots, inadequate geographic meaning

Before/after original runtime PNGs were inspected for desktop1500×1000, iPad landscape1180×820, portrait820×1180 and phone390×844. The new detail is effectively a uniform land-coloured field, two identical endpoints/badges/leaders and a north arrow. No recognisable neighbourhood, enclosing city extent or Vatican enclave is present. The112px context thumbnail/crop-boxA is too weak to supply that meaning and disappears when scrolling the full detail into view. A child can trace number→dot, but that does not establish which real place the dot represents.

The source explains this: `scripts/map-hit.js:76–83` strips names/point symbols/terrain, then `:119–122` strips coarse zones/rivers/context at `panel.side<30`. No wrong coordinate relocation was found; the failure is representational/pedagogical.

**Important distinction:** Learn already has a named containment explanation and explicitly non-scale schematic (`#romeLens`). I independently activated it and confirmed “Vaticaanstad ligt binnen Rome”. The formal Point/Test/Gold picker did not leak these names/explanation. The Learn teaching exists; it does not turn the blank formal detail into recognisable local cartography. Do not invent a Vatican boundary or mistake the original locator-circle `shape` for a surveyed border.

Own exact-candidate evidence: [desktop](desktop-school-rome-detail.png), [iPad](landscape-school-rome-detail.png), [Learn enclosure explanation](desktop-school-learn-enclave.png).

## P1 — chooser can offer an unseen candidate

Independently reproduced through **actual Point UI questions and native mouse clicks**, not requested-answer fixtures:

- Etna/Catania: Catania `city-15` endpoint is below `.pickerViewport` on opening while its Stip button is visible.
- Varese/Milan: Milan `city-5` endpoint is similarly hidden while its answer button is available.

[Etna initial](etna-catania-actual-initial.png) · [Varese initial](varese-milan-actual-initial.png) · [DOM visibility telemetry](clipped-candidates.json).

Scrolling reveals the missing point, but removes the locator/reference context. Mac overlay-scrollbar affordance is weak. Min endpoint separation and >=44px answer buttons do not test whether the numbered geographic targets are visible for comparison. This must be fixed inside the chooser, not deferred wholesale to the desktop clutter redesign.

## Case verdicts — original screenshot evidence

All source links below pin the reviewed commit and show original PNGs, not generated maps. Leaders are generally clear once visible; no obvious crossing was seen in the inspected images. Number order is deliberately not a permanent place identity.

| Case | Verdict | Actual geographic support / limitation |
|---|---|---|
| Rome/Vatican | ADJUST | Both endpoints distinguishable, but extreme close-up is anonymous land; enclave identity is not conveyed by formal map. See4-view links below. |
| Naples/Vesuvius | ADJUST | Coastline supports relative position, but close-up turns both city and volcano into identical dots; missing volcano/city semantics and persistent recognisable coastal reference. [detail](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-desktop-overview-school-area-e_city-6-detail.png) |
| Catania/Etna | ADJUST | East-coast/inland relation is useful, but no volcanic identity; initial lower candidate hidden, locator lost on scroll. [initial](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-desktop-overview-school-area-f_city-15.png) |
| Bologna/Modena | ADJUST | Plain land and unexplained dashed linework largely reduce the decision to remembered pair order; wider river/regional context is confined to tiny disappearing locator. [detail](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-desktop-overview-school-city-2_city-20-detail.png) |
| Milan/Varese | ADJUST | Strongest physical cues: northern lake shapes. They are cropped on desktop; Milan endpoint initially hidden. Closest to GO after framing/context fix. [initial](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-desktop-overview-school-city-13_city-5.png) |
| San Marino/nearby Florence | ADJUST | Useful coast/inland relation, but unclear pale polygon and no neutral explanation of marker/feature meaning. Do not infer a surveyed microstate boundary from it. `area-n_city-3` is San Marino/FLORENCE, not Rimini; identity checked against ITEMS. [detail](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-desktop-overview-school-area-n_city-3-detail.png) |
| Ligurian/Tyrrhenian sea overlap | GO for visual approach only | Whole source outlines on a common extent, with Italy/island coasts, provide meaningful geographic distinction rather than identical centre dots. Serial scrolling still costs context. Additional independent sea-specific grading probe was BLOCKED before execution; no runtime grading PASS claimed for that extra probe. [desktop](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-desktop-overview-school-water-C_water-D-detail.png), [phone](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-phone-overview-school-water-C_water-D-detail.png) |

Rome/Vatican original before/after detail pairs:
- [desktop before](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/before-desktop-overview-school-area-o_city-9.png) / [after](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-desktop-overview-school-area-o_city-9-detail.png)
- [landscape before](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/before-landscape-overview-school-area-o_city-9.png) / [after](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-landscape-overview-school-area-o_city-9-detail.png)
- [portrait before](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/before-portrait-overview-school-area-o_city-9.png) / [after](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-portrait-overview-school-area-o_city-9-detail.png)
- [phone before](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/before-phone-overview-school-area-o_city-9.png) / [after](https://github.com/dennisariens/topo/blob/d55e9deb2adfa7985bc33a3251402860f95a0b46/docs/visual/map-picker-58/after-phone-overview-school-area-o_city-9-detail.png)

## Executed functional QA — PASS within stated scope

Actual HTML downloaded from **this SHA**, not issue50 release; local `file://`, networking disabled, disposable contexts, Chromium156.0.8078.4 on macOS.

- Candidate **3,143,245 bytes**, SHA256 **`84bf071e52f917832f0dfa67a1e33e0b394a037378cf3cbfaceef2ef02f434d5`**; downloaded bytes equal canonical source.
- Existing released learner HTML independently downloaded and remains **`89464c6686ff90eeaa9cd1274cb39f5881a1905b1b49211427a8f352c5d96c31`**, unchanged. No release update performed.
- Complete ITEMS/CONTEXT_LAND/italy/NAME_ANCHORS declarations byte-exact versus PR51; learning/route engines, Focus/Discovery, lake manifest and print source unchanged. Maintained tests validate45 IDs,11 chapters,27 point anchors and6 lakes.
- `npm ci`, lint, entire17-program test chain PASS under Node24.15.0. Build was not independently rerun; no author build result is relabelled as my execution.
- **24 independently authored actual Point/Test/Gold chooser checks**, desktop1500×1000 and iPad-size1180×820, both map styles. Point/Test questions reached through real UI/keyboard progression, no current-answer replacement or direct grading. Correct/wrong ID grading, both controlled RNG orders, same physical coordinates/candidates/order for actual Rome vs Vatican requests; Escape/cancel state invariance and invoker-focus restoration; no premature Gold or repeated-activation credit. Formal chooser has no Rome/Vatican names.
- Gold uses an explicitly labelled chapter-unlocked backup prerequisite, **not a claim of genuinely earned prerequisite chapters**. After that, a full12-answer Gold session and12-answer replay were actually played through UI, including the physical Rome chooser. First earned good12/pizza1/slices4/trips0; replay remained good12/pizza1/slices4/trips0; persisted reload verified. No extra replay currency.
- No page errors/external requests in the main independent interaction matrix.
- An extra sea-specific independent grading script was denied by the execution approval layer before running; no retry/bypass. The sea row is visual GO only, not a separately executed grading claim.

## Matrix audit and the22 phone entries

Parsed raw records, not just declared totals: **799 =657 physical-PASS records +120 nonphysical country-border records +22 phone records**. Physical subset has154 distinct candidate sets; all records together have159. The657 already include point and sea subsets; they are not799 physical touches.

**Important independent recheck:** immediately after the requested-question fixture I initially reproduced sheet obstruction. After allowing layout to settle before and after pan, **all22 recorded phone cells opened the chooser via an actual pointer click** in Chromium156 at320×568. No forced click through a sheet was used. This is an explicitly requested-question-fixture addressability diagnostic, not22 normal-route grading passes. Raw coordinates/candidate pixel counts/actual-open results are saved in [phone-occlusion.json](phone-occlusion.json).

Therefore the22 are honestly not physical passes in Codex's original matrix, but they do **not establish a persistent Focus defect**. First make the PR59 harness wait for stable layout/CTM/bounds and rerun on the author browser as well. The initial zero-reachability inference is superseded by the settled recheck. Do not automatically assign all22 to#33/#52. If persistent obstruction remains after stable-layout/native-device confirmation, #33 should own Focus sheet/safe-map-area correction, coordinated with #52; not a broad UI rewrite inside this chooser PR.

## Minimum Codex follow-up on PR59

1. **Fix comparison framing:** on opening, the reviewed two/three-target cases must show all candidate endpoints/leaders/badges with north and a readable, source-linked locator together. Do not leave an answer button as the only visible representation of its target. Preserve common extent for outline comparisons.
2. **Restore geographic meaning, not more zoom:** retain enough valid-scale coast/lake/river/regional context and consistent neutral city/volcano/microstate marker semantics/legend. Keep the locator readable and persistent. If extreme magnification leaves anonymous land, widen/limit that detail rather than claim neighbourhood cartography. Do not use the requested answer to choose context or paint.
3. **Rome/Vatican:** keep named containment teaching in Learn. Do not invent city/enclave boundaries or repurpose placeholder circles as borders. If the existing source cannot support a defensible local inset, use a clearly explained source-faithful locator/marker design and obtain a new original-pixel owner/child task check; otherwise withhold a forced graded ambiguous choice rather than pretend spacing solves identification. No answer names/explanatory answer leak in Point/Test/Gold.
4. Add visibility assertions for endpoints/badges against the clipping viewport, not just button bounds/distance, and stable-layout waits for the phone matrix. Re-run exact-SHA screenshots and interaction checks after changes.

**Keep draft and keep the existing learner release unchanged. Owner visual GO, real child acceptance and physical Safari remain PENDING.** No implementation was performed by this review.
