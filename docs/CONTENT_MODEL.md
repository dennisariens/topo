# Content model (current, then proposed)

**Current source of truth:** `index.html`. `const ITEMS` is one JSON array of 45 objects. Each has `id`, `name`, `kind` (`city`, `area`, `water`, `river`), worksheet `code`, `x/y` (percentage-like legacy values), `r`, `aliases`, SVG pixel `px/py`, and optional SVG `shape`. `x/y/r` are legacy metadata; rendering uses `px/py/shape`. City IDs `city-1..23`; other IDs `area-a..o`, `water-A..G`. Do not infer type solely from prefix: river items have `water-` IDs.

| Semantic type | Present implementation | Count / example |
|---|---|---|
| City | `kind:city`, point circle | 23; Bologna `city-2` |
| Island / mountains / volcano / region | `kind:area`, SVG path except microstate | 2 each |
| Country / microstate | `kind:area`, country path or small visible point plus separate invisible hit target/lens | 7; San Marino `area-n`, Vatican `area-o` |
| Sea | `kind:water`, didactic polygon | 5; Ligurische Zee `water-C` |
| River | `kind:river`, stroked SVG path | 2; Po `water-G` |

`NAME_ANCHORS` and `CITY_NAME_ANCHORS` store separate pixel label positions in the same script. `groupItems()` hardcodes group IDs; `code` holds unique worksheet identifiers: city numbers 1–23, lowercase area/land letters a–o, uppercase sea/river letters A–G. The uppercase distinction is essential: `a` and `A` mean different things. `aliases` are normalized for typed **names**, while `TopoLearning.matchesCode` checks the typed **code** case-sensitively after trimming spaces. No locale variants schema exists. `CONTEXT_LAND` maps ISO-like country codes to SVG paths, `italy` is a composite SVG path, and the worksheet is an inline base64 JPEG. There is no external GeoJSON or geographic package **in this recovered repository**. Their original provenance is unknown; do not claim it is authoritative geographic data. The copied HTML is the current runtime truth, not a validated atlas.

Question ordering and reward state live in `scripts/learning-engine.js`: `session` and `draw` consume stable IDs; `migrate` maps old `topo-italie-v2` local progress to v3; v3 holds `{schema,good,pizzas,slices,trips,mistakes}`. A pizza needs 8 correct-answer slices; a Vespa trip happens every 3 pizzas. Pizza-only reset clears pizzas/slices/trips; full reset also clears good/mistakes. Only correct answers earn rewards; streak and question are transient. The old v2 record stays in storage for recovery but v3 takes precedence on reload.

**Generated outputs, not new source data:** `scripts/generate-print.mjs` extracts current `ITEMS`, context/Italy paths, label anchors, group IDs and embedded school photo from `index.html` to build standalone `print.html`; `scripts/generate-pdf.py` uses that generated data to create the A4 booklet. `scripts/package-standalone.mjs` embeds `scripts/learning-engine.js` into a one-file interactive HTML deliverable. Re-run generators after content changes; never fix a printed name/code only in the generated copy.

**Later migration, not yet implemented:** retain stable IDs and display names; add semantic subtype, language-tagged accepted names, geographic coordinates and geometry reference with named source/projection/license, label anchor, group, quiz target, difficulty, optional hint and editorial verification status. Derive the runtime SVG from a single versioned geographic source rather than copying geometry into `ITEMS`, `italy`, context paths and labels. Keep visible geometry, hit geometry and editorial anchor separate. Document data conversion and tests before deleting legacy fields.
