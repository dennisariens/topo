# Six background lakes — Issue #13

Implemented from Release 1.1 PR #9 at `a481317b33f5f6f55c179ee0fbfe6b211663be7b`, on `codex/topo-lakes-map-layer`. No merge or deployment. These are visual context, never new learning items or answer targets.

## Geographic source and identity

Natural Earth **5.0.0, 1:10 million**, pinned repository revision [`ace5fed0eaf3c6c03c951e75b439ba8fffbc218e`](https://github.com/nvkelso/natural-earth-vector/tree/ace5fed0eaf3c6c03c951e75b439ba8fffbc218e/geojson), retrieved 2026-10-24. Datasets: `ne_10m_lakes.geojson` and `ne_10m_lakes_europe.geojson`. Natural Earth's [lake documentation](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-lakes/) explains the main/supplement datasets and the Europe supplement's CCM 2.1 derivation. Both distributed datasets are **public domain**, including the supplement; [terms](https://www.naturalearthdata.com/about/terms-of-use/). Made with Natural Earth; European supplement derived by Natural Earth from European Commission JRC CCM. No OSM data is used. Existing in-app Natural Earth credit is retained.

The committed [source excerpt](../../geography/lakes/source.geojson) preserves all original coordinates and original feature properties. [sources.json](../../geography/lakes/sources.json) pins exact upstream URLs, upstream SHA-256 byte hashes, excerpt hash, license, projection and identity evidence. [projected-manifest.json](../../geography/lakes/projected-manifest.json) records per-lake source geometry/path hashes, coordinate bounds and vertex counts.

| Lake | Dataset | Stable upstream `ne_id` | Vertices | Projected bounds (min x, min y, max x, max y) |
| --- | --- | --- | --- | --- |
| Garda | main | 1159116699 | 63 | 352.64, 296.79, 372.34, 331.15 |
| Maggiore | main | 1159116693 | 103 | 241.61, 275.53, 261.20, 310.14 |
| Como | Europe | 1159109333 | 76 | 273.21, 275.28, 292.21, 302.66 |
| Lugano | Europe | 1159109403 | 35 | 263.23, 285.57, 276.20, 295.47 |
| Bolsena | Europe | 1159109633 | 18 | 426.95, 545.96, 434.25, 554.95 |
| Léman / Genève | main | 1159114143 | 39 | 111.83, 248.53, 155.95, 272.99 |

**Upstream naming defect:** main feature 1159116693 is labelled “Lago di Como” with Como's Wikidata ID, but its polygon is Maggiore. This is independently reported in [Natural Earth #1022](https://github.com/nvkelso/natural-earth-vector/issues/1022). [ILEC's World Lake Database](https://wldb.ilec.or.jp/Display/html/3467) places Maggiore at 45°43′–46°11′ N, 8°28′–8°52′ E, consistent with this polygon, rather than Como farther east. We correct only the display identity in our excerpt, retaining the erroneous source metadata transparently. Real Como is feature 1159109333 from the Europe supplement, with both southern arms and the dry peninsula between them. Select by dataset + `ne_id`, never by the erroneous main name/Wikidata ID. Bolsena also comes from the correctly identified Europe supplement.

## Reproducible generation and integration

```sh
npm ci
# Optional network audit: download both pinned files, verify byte hashes,
# and compare all six excerpt geometries/properties with upstream.
node scripts/geography/verify-lake-sources.mjs
# Normal generation is entirely offline from the committed source excerpt.
npm run geography:lakes
npm run lint
npm test
npm run build
```

`scripts/geography/lakes.mjs` applies exactly `x = 55 * lon - 225.5`, `y = 3830.75 - 77 * lat`. It retains all 334 vertices, ring order, winding and closure. There is **no extra simplification or smoothing**: the small source excerpt does not justify losing Como's forks. SVG coordinates round to 0.01 map units (at most 0.005 per axis); no manual vertices or offsets are added. This is Natural Earth's generalized cartography, not a cadastral or current water-level survey.

`generate-lakes.mjs` writes a bounded `BEGIN/END GENERATED LAKES` SVG definition block and the projected manifest. It is deterministic and runs before preview/standalone generation in the build. Only one runtime composition call is added to the existing app: an SVG `use` after the schematic regions in `areaLayer`, before rivers and points. No extra runtime scripts, fetches, dependencies or storage data. All lake definitions/uses have `aria-hidden` and `pointer-events="none"`, without text, focus stops or `data-id` answer targets.

`generate-preview.mjs` uses the same definition after static regions and before static rivers/points. With JavaScript disabled there is one static use; with JavaScript enabled the fallback is removed and there is one runtime use. Both standalone downloads and `dist/index.html` contain identical canonical HTML and lake paths, and operate over `file://` offline. The viewBox stays `0 0 890 1235`; Léman's full source polygon lies inside that frame. Normal SVG and lesson-crop clipping applies, without bound expansion or distortion.

Print is deliberately unchanged: `print.html`, PDF and print freshness hash are byte-identical to the pinned Release 1.1 baseline. No lake definitions enter the print generator or the 45-item arrays. See [scope-audit.json](../visual/lakes/scope-audit.json): removing the single lake composition call leaves all three inline scripts byte-identical to the baseline. The learning engines, original Nino assets/resolver and dependency lockfile are also unchanged.

## Verification and evidence

`npm run lint`, `npm test` (eleven existing programs plus lake regression), `npm run build`, pinned upstream audit and `git diff --check`: **PASS**. Lake regression checks six closed polygons, exact projected envelopes and geometry hashes, retained vertices, Como's two wet arms/dry peninsula, source identities, noninteractive layer ordering and live/static/standalone equality. Existing regressions cover every stop, lesson, Gold queue, saves/migration, grading, rewards and resets.

Chrome 146: [browser results](../visual/lakes/browser-results.json), [Release 1.1 learning/save/replay regression](../visual/lakes/learning-regression.json), [daily-credit/reward-idempotence/import regression](../visual/lakes/replay-import-regression.json). The lake runner opens real `file://` pages with `offline:true`, checks unchanged map dimensions/aspect ratio and 27 point anchors against the baseline at **1440×1000**, **1180×820**, **820×1180**, **390×844**, **320×568**, then switches all modes and captures a route lesson. Maximum numerical point drift is under 0.004 CSS px. No page errors, external requests, horizontal overflow or lake pointer interception. Scripting-disabled fallback and both standalone downloads plus the built index pass.

```sh
# Use installed Playwright and Chrome paths if not on default paths.
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/chrome npm run qa:lakes
TOPO_URL=file:///absolute/path/to/index.html QA_OUTPUT=/tmp/topo-learning \
  PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/chrome node scripts/qa-polish.mjs
TOPO_URL=file:///absolute/path/to/index.html QA_OUTPUT=/tmp/topo-replay \
  PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/chrome node scripts/qa-findings-browser.mjs
```

The lake runner reconstructs its before file from the pinned Git commit; run inside this checkout. Screenshots in [visual/lakes](../visual/lakes) include camera crops of an exact SVG clone, without coordinate changes:

- Switzerland/northern lakes: [before](../visual/lakes/switzerland-before.png), [after](../visual/lakes/switzerland-after.png).
- Lazio/Bolsena: [before](../visual/lakes/lazio-before.png), [after](../visual/lakes/lazio-after.png).
- [Desktop after](../visual/lakes/desktop-after.png), [iPad landscape lesson](../visual/lakes/ipad-landscape-lesson.png), [iPad portrait after](../visual/lakes/ipad-portrait-after.png), [390px phone](../visual/lakes/phone-390-after.png), [320px phone](../visual/lakes/phone-320-after.png), [static fallback](../visual/lakes/static-fallback.png).

Screenshots were visually inspected for shoreline visibility, Como's fork, Bolsena northwest of Rome, land/marker visibility and responsive layout. Lakes remain small context on a full phone map; no enlarged/displaced silhouettes are substituted. Physical iPad Safari and real touch/assistive technology remain untested. Existing Node 24.13.1 produces jsdom dependency engine warnings; checks pass. The unchanged lockfile has one npm audit high finding in development-only `undici` (jsdom dependency); no runtime dependency ships in the standalone app. Dependency remediation belongs in a separate change.

## Hermes integration handoff

Draft PR targets `codex/topo-release-1-1-polish`. This branch does not modify the owner design branch, `main`, PR #9, `scripts/nino-feedback.js`, any `assets/nino/**`, original artwork, icons, copy or rewards. Hermes owns the illustration system.

Expected overlap is shared `index.html` map markup (the static preview occupies a long line), generated standalone copies, and possibly package/build wiring or append-only docs. After review, perform controlled integration on a separate branch. Retain Hermes' UI/illustrations, the bounded lake definition block and single map composition call; resolve source changes first, then run `npm run geography:lakes` and `npm run build` to regenerate preview/downloads. Do not resolve generated HTML by replacing Hermes' whole file with this branch's version. Re-run full tests, offline/responsive lake QA and illustration QA on the combined result. No simultaneous edits, automatic merge, deployment or claim of completed combined QA is made here.
