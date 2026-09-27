# Product specification

**Primary user:** Dutch primary-school learner, roughly Group 7. Topo teaches spatial location and recognizable form rather than arbitrary hit boxes. Priority: geography, learning, clarity, usability, consistency, engagement.

| Learner job | Status | Current behavior / gap |
|---|---|---|
| Find cities, countries, seas, rivers, mountains, volcanoes, regions, microstates | PARTIAL | All 45 Italy worksheet items present; several features schematic and independent GIS provenance unknown. |
| Learn by category and see correct answers | IMPLEMENTED | Four city groups and thematic groups show map labels, list and printable map. All 45 labels cannot display at once. |
| Point to a geographic name | IMPLEMENTED | Shuffled full quiz pool checks SVG item ID; saved wrong items recur. Category-filtered quiz PLANNED. |
| Write a geographic name | IMPLEMENTED | Highlighted object; normalized name/aliases accepted regardless of accents. |
| Take a mixed test | IMPLEMENTED | Point, name and worksheet-code questions; no completion screen. |
| Review mistakes | PARTIAL | Learn group, mistake-only quiz, periodic mistake review; per-item mastery PLANNED. |
| Track progress and earn rewards | IMPLEMENTED | Eight slices/pizza, three pizzas/Vespa trip, local v3 persistence, both resets, reduced-motion-aware celebration. |
| Distinguish Rome from Vatican | IMPLEMENTED | Tiny Vatican marker and hover/focus/tap local two-choice inset; device QA pending. |
| Compare worksheet with map | PARTIAL | 1:1 photographed overlay with sampled dot alignment; perspective/coastlines unregistered. |

## Modes

- **Learn — IMPLEMENTED:** grouped reference with shuffled highlight sequence and fixed-order school list.
- **Practice — IMPLEMENTED:** `Alles aanwijzen` and `Namen schrijven` use full shuffled pool; `Oefen fouten` narrows it.
- **Test — IMPLEMENTED:** three interleaved formats; no final score screen.
- **Reference map — PARTIAL:** group names on map and print; no separate atlas.
- **Adaptive learning — CONCEPT:** item history and due reviews; see `LEARNING_MODEL.md`.

Stabilize Italy before expanding curriculum. Accurate shapes and worksheet comparison take priority over decorative additions. Keep microstates geographically tiny with separate generous hit geometry. Pizza/Vespa is a restrained learning reward that does not interrupt the next question.
