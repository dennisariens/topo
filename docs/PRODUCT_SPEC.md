# Product specification

**Primary user:** a Dutch primary-school learner at roughly Group 7 level. Topo teaches location and recognizable form, not memorization of arbitrary hit boxes. Product priority: geography, learning, clarity, usability, consistency, engagement.

| Learner job | Current status | Concrete behavior / remaining gap |
|---|---|---|
| Find cities, country shapes, seas, rivers, mountains, volcanoes, regions and microstates | PARTIAL | Italy map covers all categories; several non-country shapes are approximate and microstates use oversized visible circles. |
| Learn by category and see answers | IMPLEMENTED | 4 city sets and thematic groups show labels; printable group map. All 45 labels cannot be shown together. |
| Point to a name on the map | IMPLEMENTED | `point` samples all 45, checks tapped object ID. No category selector in quiz. |
| Write a geographic name | IMPLEMENTED | Highlighted target, exact normalized name/aliases; accents ignored. |
| Mixed test | IMPLEMENTED | Random point/write/school-sheet code questions. |
| Review mistakes | PARTIAL | Mistake-only quiz button and Learn group; no mastery history or review schedule. |
| Sense progress and earn rewards | PARTIAL | Totals, streak, five-answer pizza, local persistence and reset; continuous slice/Vespa progression PLANNED. |
| Recognize Rome and Vatican separately at small scale | PARTIAL | Separate adjacent clickable circles; map inset/lens PLANNED. |
| Compare worksheet with interactive map | PARTIAL | Embedded photo toggle; perspective alignment and north-up calibration PLANNED. |

## Modes

- **Learn — IMPLEMENTED:** show one of the ordered learning groups, label overlay and sequential highlights. Always starts first item (Bari for first group).
- **Practice — IMPLEMENTED/PARTIAL:** `Alles aanwijzen` and `Namen schrijven` draw from all items; only the Learn list offers category selection. `Oefen fouten` narrows quiz pool if mistakes exist.
- **Test — IMPLEMENTED:** interleaves three formats, without per-session coverage guarantee or final result screen.
- **Reference map — PARTIAL:** show labels by group and print; no independent complete multi-page reference pack.
- **Adaptive learning — CONCEPT:** see `LEARNING_MODEL.md`; keep the child’s next action obvious.

## Current stabilization requirements

Correct geographical silhouettes and labels come first. North-up worksheet ↔ SVG calibration should correct perspective without arbitrary rotation. Rome and Vatican need an accurate small visible location and an obvious two-choice local inset on hover/focus/tap, usable on touch. Question sessions should vary their first prompt and cover each item without predictable or immediate repetition. Pizza rewards continue: proposed 8 correct slices per pizza, 3 pizzas per short Vespa trip, route such as Rome → Florence → Bologna → Venetië → Milaan → Genua → Napels; reset and persistence must remain explicit. Short celebration (~1–2 s), never blocks learning, honors `prefers-reduced-motion`. Exact Vespa threshold/destinations are ACTIVE design parameters, not implemented constants.
