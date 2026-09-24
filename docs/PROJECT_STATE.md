# Project state

**Last verified against repository: 2026-09-24.** Source baseline: recovered `topo-italie-v6.html`, copied byte-for-byte to `index.html`. A former repository was not available; this is a newly initialized Git baseline, not a claim that older source files were audited.

Canonical Git remote: `dennisariens/topo`, branch `main`. The Library ZIP is a recovery snapshot, not an alternative editing source.

## Purpose and implementation

Dutch primary-school learner, around Group 7; map-first Italy topography with 45 items: 23 cities; 2 islands, 2 mountain ranges, 2 volcanoes, 2 regions, 7 countries/microstates; 5 seas; 2 rivers. One offline HTML file contains CSS, inline JavaScript, SVG paths and an embedded photographed worksheet. No dependencies, API, routes, localization framework, build pipeline, CI, or existing tests preceded this baseline.

## What works in code

- Learn: category selector (city groups 1–6, 7–12, 13–18, 19–23; thematic groups; all; mistakes), highlight, next/list navigation, names on group-specific map, print. `all` deliberately suppresses labels to avoid crowding.
- Quiz: all-item point mode, name typing, and a mixed test that also asks the school-sheet letter/number. Click/tap or keyboard Enter/Space on SVG targets; normalize diacritics for typed names; correct/incorrect feedback and reveal.
- Progress: correct count, current streak, mistakes, five correct answers per pizza. Counts/mistakes/pizzas saved in `localStorage` key `topo-italie-v2`; streak and current question are session-only. Pizza-only and full reset have confirmation dialogs.
- Responsive: desktop map + panel columns; panel above map under 950 px; smaller text/spacing under 600 px. SVG scales with `viewBox`. No verified tablet/mobile tap ergonomics or live-browser run yet.

## Stable decisions / do not regress

Real country silhouettes for the five quiz countries, distinct surrounding land, San Marino within Italy, country labels inside their countries, 23 cities on land in the **current drawn coastline**, Ligurian Sea in content, Po endpoint on land, volcano markers on land, Sicily label on Sicily, Dolomites zone on Italian land, original group order, reward resets. Keep actual map geometry separate from generous target geometry during future work.

## Known issues and limits

The JS `ITEMS` combines objects, positions and hand-authored quiz shapes in one large line; SVG country/Italy paths and context shapes are embedded without upstream provenance. Map coordinates are custom SVG pixels, not stored longitude/latitude. The drawing is coarse at coastal cities; moving markers inland to fit it is not a substitute for accurate coastline data. River and sea zones, mountain shading, regional outlines and some anchor labels are didactic approximations. No browser or mobile verification was available at reconstruction.

The worksheet is a perspective photograph shown with `object-fit: fill` against the SVG; it is north-up approximately but uncalibrated and stretches nonuniformly. Vatican and Rome are separate circles around 15 px apart at source viewBox scale, without an inset; their tap areas are small/adjacent. Questions use independent `Math.random` picks, avoid only immediate repeat, and weight saved mistakes 3×; there is no shuffled session deck, category-balanced practice, mastery, or adaptive scheduling. `mode('learn')` always opens with Bari because the list follows `ITEMS` order; the reported first-Bari symptom belongs to Learn, while quiz starts are random in code. Pizza is five answers, no slices or Vespa. See `MAP_SYSTEM.md` for the issue table and `LEARNING_MODEL.md` for sequencing.

## Active direction and next package

Stabilize the existing Italy experience. First package: **Topo Stabilization / Final Italy Pass** — establish source-provenance and geometric validation, calibrate the worksheet, implement Rome/Vatican lens, testable shuffled questions, then an eight-slice/three-pizza Vespa loop, with restrained motion and regression coverage. This is a recommendation, not an implemented feature. Details and dependencies in `ROADMAP.md`.
