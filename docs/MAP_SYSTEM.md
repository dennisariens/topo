# Map system — Release 1

## Coordinate contract

One canonical geographic/content source: embedded `ITEMS`, `CONTEXT_LAND`, `italy` in root `index.html`. Longitude/latitude use WGS84 point references. The explicitly documented affine drawing projection is:

```
x = 55 * longitude - 225.5
y = 3830.75 - 77 * latitude
viewBox = 0 0 890 1235
```

This is an educational affine lon/lat projection, not a metric/conformal map. Runtime, cropped zooms, hit-distance conversion and static preview use the same SVG frame. Scaling preserves the viewBox ratio; lesson container width is bounded by available viewport height without separately stretching the SVG.

## Provenance

The October 23 Work handoff supplies source-projected output now integrated into root. `geography/points.json` contains 27 point excerpts: 23 cities, San Marino, Vatican and two volcanoes. `geography/map-manifest.json` records all 45 IDs, codes, anchors and geometry hashes. They are test/provenance fixtures, not a second runtime map. The original-point file is historical comparison only.

- Natural Earth 50m country/coast/island geometry; 10m populated places and river centre lines. Source datasets: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson . Natural Earth terms: https://www.naturalearthdata.com/about/terms-of-use/ (public domain; terms checked 2026-10-23).
- GeoNames Varese/La Spezia coordinates. Attribution: GeoNames, https://www.geonames.org/ , CC BY 4.0; WGS84 and attribution terms confirmed at https://www.geonames.org/about.html . Point projection is an adaptation.
- Smithsonian Global Volcanism Program volcano point references: https://volcano.si.edu/volcano.cfm?vn=211020 and https://volcano.si.edu/volcano.cfm?vn=211060 . Vesuvius source independently fetched 2026-10-23 confirms 40.821 N, 14.426 E; Etna page timed out in this integration pass, so its 37.748 N, 14.999 E reference remains inherited from Work rather than newly independently retrieved.

See `geography/README.md` for the transferred audit and source URLs. Natural Earth/GeoNames/GVP credits appear in the app and printable material. Raw upstream GeoJSON, precise upstream commit and simplification tooling were not included in Work; retained geometry hashes detect drift but cannot independently prove geographic truth. Fetch/pin source data before future geographic changes.

## Geometry and remaining schematic areas

36 target geometries are reference backed (points, country/island outlines or river lines). Nine remain educational zones: Apennines, Dolomites, Po Valley, Tuscany, Mediterranean, Adriatic, Ligurian, Tyrrhenian and Ionian seas. Mountain/region zones are not surveyed boundaries. Sea areas can overlap; Mediterranean is the parent sea. No schematic area should be described as precise GIS extent. Coastal population points are never nudged inland just to pass a coarse coastline containment test.

Vesuvius is east of Naples; Etna is north of Catania; Rome and Vatican retain their true close reference positions. San Marino is a visible source-projected point, not moved into the sea. Tiny state visible marks are symbolic point locators rather than cadastral outlines.

## Drawing versus selection

Issue #13 adds six source-backed background lakes using pinned Natural Earth 5.0.0 main/Europe polygon excerpts. See [geography/LAKES.md](geography/LAKES.md) for revision, license, the upstream Maggiore naming correction, geometry hashes and offline reproduction. One shared inline SVG definition is composed after schematic regions and before rivers/point marks in runtime and static fallback. Lakes have no learning IDs, labels, pointer handling or focus stops. Projection, frame and existing target geometry are unchanged; print remains byte-identical to Release 1.1.

Layer order remains sea, surrounding land/quiz countries/Italy/islands, schematic regions/mountains, river centre lines, static labels, accurate point marks, Learn labels. Source visual geometry is independent of hit tolerance and editorial label placement.

- Pointer proximity uses `getScreenCTM` to compare accurate point positions in CSS pixels; a 22-pixel radius does not move/enlarge the visual marker. A single candidate selects that place; multiple candidates open a neutral numbered crop of the same map. It does not identify the requested answer or offer answer names.
- Shared Rome/Vatican keyboard trigger opens the same neutral picker. Individually focusable SVG targets retain names for assistive technology. Enter/Space dispatch actual SVG-compatible click events. The named containment diagram remains only for Learn/Discover and is explicitly not to scale.
- Rivers have separate transparent non-scaling 44-pixel hit strokes, using exactly their visual centre-line paths. Visible river width remains unchanged.
- San Marino/Vatican highlighted tasks use rings centred on the exact point and a cropped canonical map. Locators are aids, not state boundaries. Cloned zoom/picker maps remove IDs and tab stops.

## Static views, worksheet and printing

`generate-preview.mjs` derives every static fallback mark/path from canonical runtime data. Tests compare all 45 static representations and live definitions. `generate-print.mjs` uses exactly the same items, context paths and Italy outline; tests compare the entire item data. No copied map coordinates are maintained in print code.

The photographed school worksheet has perspective/skew and a separate scale. It is shown as a separate original-ratio image in the app, as an optional print reference page, and as the booklet's final appendix. It is not overlaid on projected geometry or used to grade locations.

Print point labels are editorial offsets with leaders to the unchanged point and clearance from all city/volcano/microstate marks. V-labels identify questions on that page only. PDF renders the same SVG M/L/Q/Z geography paths; quadratic curves convert exactly to cubic curves. Microstates use explicit point marks. Source-hash checks reject stale booklets.

## Acceptance limits

Automated tests lock source-projected anchors, expected geometry hashes, all 45 static/live matches, microstate locator centres, neutral overlap grading, print data equality and print freshness. Chrome evidence covers desktop and simulated tablet/phone viewport sizes. Physical iPad Safari, actual touch with the on-screen keyboard, screen-reader ergonomics and real printer output remain owner/Hermes acceptance checks. Browser zoom/pixel tolerance is not a blanket accessibility conformance claim.

This document supersedes the September unprovenanced-map and registered-photo-overlay description. Earlier decisions remain in the append-only decision log.

## P0 semantic hit correction — 25 October 2026

The nearest-point capture/paint-order selection described above is superseded for pointer grading by [MAP_SELECTION_HOTFIX.md](MAP_SELECTION_HOTFIX.md). One tap resolves all features of the task's semantic class against original SVG geometry, independently of the expected feature ID. True point overlaps retain the same 22 CSS px tolerance; areas use fill containment, rivers the original non-scaling 44 CSS px corridor. Every conversion uses the current screen CTM, including map zoom and pan. Genuine ambiguous areas/rivers use outlines rather than dot-only wording; display order is shuffled once per dialog without reading the answer or mutating candidate geometry. Sea selection excludes the same source land silhouettes that occlude sea paint; hidden inland sea-fill portions are not selectable. Learn can inspect genuine mixed overlaps using neutral wording. Focused SVG keyboard selection and the Rome/Vatican keyboard trigger remain. No source position, boundary, projection or hit-width was moved or expanded; schematic mountain extent accuracy remains issue #37.

## P0 #58 — visually distinguishable neutral choices

Supersedes the shared 80-unit-minimum chooser crop and 1.5-unit centre dots. The hit resolver, its 22 CSS-pixel disks, class filters and sea/land exclusion are unchanged. Only chooser presentation changes: true source-anchor close-ups use constant-size endpoint marks, separate numbered badges and noncrossing connectors. Layout targets at least 32 CSS pixels of endpoint separation in its coordinate plan; rendered QA enforces 24 pixels. Broad sets split into linked geographic crops when needed, without moving a single source anchor. Crop frames are locators, never invented borders. Extreme close-ups omit coarse river/zone context below 30 source units; they are explicitly enlarged place-marker maps, not municipal/street maps. Rome/Vatican containment copy appears only in Learn.

Non-point overlaps use individual same-extent/same-scale maps of the complete candidate outlines/centrelines; sea outline overlays mask the unchanged land geometry. No expected answer is read by the renderer. Number order is shuffled once, retained through window resize, and independent of layout, distance, requested answer or grading. Answer controls remain at least 44px, cancellation has initial focus, Escape leaves the session intact and closing restores focus. JSON save/backup schemas are unchanged. Evidence, source limits and owner release gate: [MAP_PICKER_58.md](MAP_PICKER_58.md).


## PR #59 owner revision — supersedes generic #58 point crops above

The chooser uses one regional source map with city circles, summit-anchored
volcano glyphs, symbolic microstate diamonds, neutral neighbouring places and
original lakes/rivers/coasts. Rome/Vatican use the illustrative containment
convention: large city circle (not surveyed boundary), tiny nested Vatican,
distinct noncrossing tips at exact source-relative centres, north and a persistent
coastline locator. Broader candidate sets retain this relation in a corner inset.
No coordinates, source geometry, grading or candidate detection change.

All numbered endpoints/badges, orientation and >=44px controls fit available width
AND height on first open/resize. The old scrollable crop list and 24px-only gate
are superseded by painted-bound visibility/occlusion and semantic/context checks.
Complete area/sea outlines retain the shared extent/scale and original land mask;
all comparison maps fit together. Original-pixel before/rejected/revised captures,
finite-matrix limits and release gate:
[visual/map-picker-58-revision/README.md](visual/map-picker-58-revision/README.md).
