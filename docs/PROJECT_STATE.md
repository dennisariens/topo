# Project state

**Last verified against repository: 2026-09-27.** Canonical repository: `dennisariens/topo`, branch `main`. Recovered from standalone `topo-italie-v6.html`; older HTML and recovery ZIP are historical.

## Purpose and implementation

Dutch Group 7 learner; map-first Italy practice with 45 items: 23 cities, 2 islands, 2 mountain ranges, 2 volcanoes, 2 regions, 7 countries/microstates, 5 seas and 2 rivers. Dependency-free HTML/CSS/SVG/JavaScript. `index.html` embeds SVG paths and the worksheet photo; `scripts/learning-engine.js` is loaded locally for sessions/rewards. `npm run build` copies both to `dist/`; no API, framework, deployment configuration or CI.

## Working in code

- Learn: four city groups (1–6, 7–12, 13–18, 19–23), thematic groups, all, mistakes, shuffled first highlight and subsequent cards, fixed-order list, group labels and print. The all-items group suppresses labels to avoid collisions. `print.html` offers matching group-specific printable reference and two worksheet question directions; selecting all produces 11 separate group pages. `output/pdf/topo-italie-printboek.pdf` bundles all 11 groups in three printable formats (34 A4 pages including contents).
- Quiz: point, type, and a finite **Toets** for any existing learning group. Default test alternates worksheet code → full name and name → worksheet code; each direction and an all-formats mix (including map pointing and highlighted-name questions) are selectable. It reports questions answered and the final correct count, counts skipped/revealed answers as incorrect, and offers a restart. Lowercase a–o and uppercase A–G are distinct; names still accept documented aliases/accents. Point/name practice uses a shuffled 45-item deck without immediate repeats; saved mistakes can recur after five turns. Category selection is implemented for Toets but not separate pointing/writing practice; mastery scheduling is absent.
- Rome/Vatican: small visible Vatican dot near Rome; shared transparent trigger opens a two-target local selector on hover/focus/tap. San Marino has a separate visible dot and transparent hit circle. Exact source coordinates remain unverified.
- Rewards: each correct answer earns a slice; 8 slices = pizza; every third pizza = Vespa trip along Rome → Florence → Bologna → Venetië → Milaan → Genua → Napels, cycling thereafter. Nonblocking 1.4-second animation respects reduced motion. Good count, mistakes, pizzas, slices and trips persist under `topo-italie-v3`; v2 saves migrate preserving earned pizzas. Pizza-only and full reset work; streak and current question are session-only.
- Responsive: SVG viewBox fixed; map and panel rearrange below 950 px. Local browser connection was blocked at verification, so phone/tablet ergonomics remain unverified.
- Deliverables: `index.html` plus local engine script is the editable app. `output/html/topo-italie-interactief.html` is the generated single-file version, with engine and worksheet embedded. `print.html` is generated from the same item/geometry definitions; `scripts/generate-pdf.py` reads it to create the print booklet. Regenerate with `npm run build` and `python3 scripts/generate-pdf.py`; never edit generated outputs as alternate map sources.

## Geography and worksheet

Surrounding European/North African land is distinct from sea. Country shapes, 23 city markers, microstates, Ligurian Sea label, Po endpoint, Etna, Sicily label and Dolomites have targeted static invariants (`scripts/validate-map.mjs`). These test the **drawn** geometry, not external GIS. Path provenance is unknown; coastlines, mountain regions, rivers and sea zones are partly schematic. Worksheet photo and SVG both measure 890 × 1235; sampled printed red dots mostly align with the SVG markers. A global rotation would degrade alignment. Photo perspective and coastlines remain independently unregistered; keep the readable 1:1 overlay. Details: `MAP_SYSTEM.md`.

## Do not regress / next priority

Preserve 45 item IDs and school codes, learning groups and reference labels, surrounding land color, corrected locations, Vatican/Rome selector, shuffled deck, saved-progress migration and both resets. **Next package:** Geographic Data Foundation: source/projection, independently sourced coast/points/rivers, visual vs hit validation and browser checks at phone/tablet/desktop sizes. See `ROADMAP.md`.
