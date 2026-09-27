# Roadmap (no date commitments)

Each item is a distinct outcome; statuses describe code today. Dependency order is intentional.

## Now — Geographic Data Foundation (recommended next Codex package)

| Goal | Status | Dependency | Size |
|---|---|---|---|
| Establish named/license-checked source geometry and explicit projection; independently check all 45 and coastal lines | PLANNED | Current embedded map and invariants | L |
| Separate visual paths and interaction tolerances for remaining rivers, countries and city dots | PARTIAL (microstates separated) | Geospatial source and touch review | M |
| Compare worksheet photo against independent coastline control points before any warp | PARTIAL (printed dots checked) | Verified source geometry | M |
| Browser/mobile audit of lens, quiz, labels, touch targets, progress and resets | PLANNED | Browser accessible to local app | M |
| Add data-level invariants against independent source, not just drawn coastline | PARTIAL (static checks now) | Geospatial source | M |

Final Italy stabilization implemented the Rome/Vatican selector, shuffled sessions, v2 migration and continuous pizza/Vespa loop on 2026-09-27. Geographic source validation remains the next package. Avoid unrelated pages, dashboard redesign or curriculum expansion.

## Next

| Goal | Status | Dependency | Size |
|---|---|---|---|
| Track weak/mastered items and simple due reviews; keep a transparent map-first flow | CONCEPT | Shuffled deck and stable item IDs | M |
| Category-filtered quiz using the existing worksheet groups | PLANNED | Deck accepts a filtered pool | S |
| Review print contrast and legibility on a physical school printer | PARTIAL (A4 booklet and print HTML implemented) | First printed copy/user feedback | S |
| Parent/teacher overview only if observed need | CONCEPT | Validated learning data | M |

## Later

| Goal | Status | Dependency | Size |
|---|---|---|---|
| Additional countries/regions and difficulty levels | CONCEPT | Trusted map/content pipeline | L |
| Profiles and cloud progress | CONCEPT | Privacy/user need, stable local model | L |

Current reward threshold/stops and legacy conversion are in `scripts/learning-engine.js`; change them only with migration tests and a recorded decision.
