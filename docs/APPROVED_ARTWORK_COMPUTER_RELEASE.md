# Approved artwork → integrated computer candidate

This supersedes the earlier PR #61 candidate's prior Rome/Vatican rendering. Work stays on **the same branch and PR #61**. No additional renderer, new implementation branch, new artwork generation, dependencies, passport or reward feature was introduced.

## Source and implementation

The owner supplied `TOPO-Rome-Vaticaanstad-approved-refined.svg`. The committed asset is byte-identical to the supplied Downloads file: **1,413 bytes**, SHA-256 `c2d66a994879ecc125e2bb3d01accbc8a10730d990b85ee13eb5b050e797c70c`. Source and provenance: `assets/map-selection/README.md`.

- Shared component: `scripts/map-hit.js`. One SVG importer serves the neutral selector, multi-candidate Rome/Vatican inset and existing named Discover explanation. Point, formal Test and Gold use the same selector and grading callbacks. Writing remains a name-entry exercise with canonical location highlights; it does not gain an extra selection or named-answer hint.
- Rome's pointer ends at source `(221,88)`, visibly inside the dotted city rim. Vatican's pointer ends at `(170,128)` inside its enclave. Paths/fills/source typography are retained; number values follow the existing unbiased shuffle. Discover's explanatory numbers retain the source's 1/2 pairing.
- Compact neutral badges grow around their original centres for readable digits, without moving endpoints or target geometry. Pointer strokes retain screen-space legibility. The schematic artwork has no invented north orientation; a separate real-source geographic locator retains north. Neutral accessibility descriptions refer to the large circle/small interior area rather than incorrect screen quadrants from the previous geometric crop.
- Other approved selectors preserve geography, framing, city/volcano distinction, same-scale sea outlines and controls. Shared pointer/number ink matches approved `#254c46`. The Rome composition is not copied onto unrelated objects.
- Build embeds the exact approved SVG; no runtime asset request. All four exported HTML names and `dist/index.html` remain byte-identical to canonical `index.html`.
- Source-preservation audits retain both learning engines, all 45 IDs/coordinates/geometry, eleven chapters, six lakes, School/Discovery maps, existing Nino guidance, saves/rewards, backup/import/reset, existing startup behavior and print/PDF. Onboarding is not expanded or invented by this change.

## Reproduction and evidence

Run with Node 24.15+ and existing QA Playwright installation:

```sh
npm ci
QA_PRESERVATION_FILE=docs/qa/approved-artwork-20261030/preservation.json npm run release:check
export PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs
export CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
node scripts/qa-approved-selection-artwork.mjs
QA_INTEGRITY_DIR=docs/qa/approved-artwork-20261030/integrity/ node scripts/qa-computer-release.mjs
QA_REVISION_SKIP_HISTORY=1 QA_OUTPUT=../docs/qa/approved-artwork-20261030/selection/ node scripts/qa-map-picker-revision.mjs
QA_OUTPUT=../docs/qa/approved-artwork-20261030/sessions/ node scripts/qa-map-picker-sessions.mjs
QA_OUTPUT=../docs/qa/approved-artwork-20261030/physical/ node scripts/qa-map-picker-revision-taps.mjs
TOPO_OFFLINE_FILE=../output/html/TOPO-NINO-Computer-Release.html QA_OUTPUT=../docs/qa/approved-artwork-20261030/offline/ node scripts/qa-offline-computer.mjs
QA_FOCUS_HTML=output/html/TOPO-NINO-Computer-Release.html QA_FOCUS_DIR=../docs/qa/approved-artwork-20261030/focus/ node scripts/qa-focus-mode.mjs
```

Current-candidate results, artifact SHA-256 and counts are in `docs/qa/approved-artwork-20261030/summary.json`; do not use the previous candidate's digest/results as proof of this one.

Evidence categories:

- `gates/release-check.log`: actual lint, build, complete 17-program regression and preservation audits. The map-selector suite adds an asset-fidelity regression that compares the embedded SVG bytes, drawing attributes, typography, shuffled digits and exact endpoints.
- `fidelity/`: owner-source render, actual Learn/Point/Test/Gold selectors in both number orders, Discover lens, and a machine comparison of source drawing/font attributes. These are shared-component fixtures, not a claimed complete route playthrough for each screenshot.
- `selection/`: actual offline desktop, tablet portrait/landscape and 390/320px scenes for Rome/Vatican, Naples/Vesuvius, Catania/Etna, Milan/Varese, Bologna/Modena, San Marino and sea overlap, both styles, orderings and requested targets. Visibility, neutral rendering, grading, controls and leader/inset coverage are checked.
- `integrity/ledger.json`: all 45 objects, source projection/hash status, two correct taps/one wrong tap and wrong/right spelling in both map styles; `summary.json` also records a completed wrong-Gold rejection and saved-data reload. Explicit current-question fixtures use actual mouse/input/buttons. The existing full DOM suite plays all eleven chapter routes.
- `sessions/`: Point/Test/Gold wrong/correct, both number orders, Escape/cancel, focus restoration, resize/reload and duplicate-credit protection.
- `physical/`: replay of the prior finite 799-cell overlap inventory using actual identical-coordinate browser mouse taps with changed requested targets. Unaddressable integer-pixel border samples are recorded separately, never called passes or proven functional failures. This is not a continuous-space enumeration or physical-device test.
- `focus/`: responsive layouts, canonical submission, keyboard/rotation/caret simulations and integrated semantic probes, including Po/Po Plain, Tuscany, microstates and Apennines.
- `offline/`: exact requested HTML opened as real `file://` with networking disabled, decoded assets, incorrect/correct writing, local save/reload/reset, console errors and external requests.

## Limits and acceptance gate

Desktop Chrome results are actual browser executions. Tablet-sized Chrome viewports and simulated keyboards are **not physical iPad Safari**. Native Safari session creation was attempted but rejected because **Allow Remote Automation is disabled**; raw response is in `safari.json`. Neither current Safari nor physical iPad/IME/VoiceOver is claimed PASS. Enabling automation or manual Safari testing remains necessary to close the requested Safari compatibility gate.

Geography is verified against the pinned source excerpts/projection/manifest and preserved canonical geometry, not freshly surveyed independently. Nine areas remain schematic, including source/DEM-guided Apennines; the approved Rome diagram is explicitly symbolic, not an official boundary or bearing map. A reproducible geographic/functional defect remains actionable; no design exploration is authorized.

File storage is browser/path specific. Export a JSON backup from the old app before changing filename/location/browser; import and verify it in the new file before discarding anything. No automatic cross-device/path transfer is claimed.

The new artifact is a **separate prerelease candidate**, leaving the previous prerelease, learner download, main branch and owner server unchanged. No merge or final publication before independent QA and owner release approval.

## Hermes handoff — exact new commit and attachment

Use the exact PR #61 head and the separately tagged `topo-nino-computer-approved-artwork-rc-20261030` release recorded in its release notes, with its new HTML checksum. **Do not review `bd4dace` or the prior `4bf23d…` artifact.**

Return **PASS / CONDITIONAL / FAIL**, exact commit, downloaded SHA-256, environment and evidence per finding:

1. Independently download `TOPO-NINO-Computer-Release.html`; verify its checksum/size, then run the downloaded bytes through `file://` offline, no console errors/external dependencies.
2. Compare against the exact supplied SVG (source SHA above): large city circle, enclosed enclave, Rome tip visibly inside dotted rim, Vatican tip on enclave, original drawing/fills/typography, consistent pointer styling. Check original-size desktop/iPad screenshots and real interaction; source metrics alone do not establish recognisability.
3. Verify the same shared artwork across Discover, Point, Test, Gold and real multi-way insets. Check neutral number swaps independent of requested answer and no named/style/position correctness leak. Writing retains the expected source highlight and no named lens.
4. Independently verify all 45 ledger objects and the nine named risk areas; distinguish points/cities/volcanoes from line/area targets and schematic/source-backed geometry. Reject wrong answers without learning/reward/Gold credit; complete a Gold attempt with an intentional mistake and require failure. Exercise genuine Discover → Point → Write, free practice, save/reload, backup/import, resets and rewards.
5. Run current Safari where available; keep physical iPad/IME/VoiceOver evidence separate. Report unexecuted checks honestly. Review existing full regression and source-preservation evidence against this exact new artifact.
6. Post the documented verdict and bounded reproducible findings to PR #61. Do not duplicate implementation, redesign, merge, replace the learner release or publish final. Owner acceptance follows independent QA.

This is a prepared handoff, not a claim that Hermes has launched or accepted the candidate.
