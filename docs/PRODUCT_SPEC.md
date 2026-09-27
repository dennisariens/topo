# Product specification

**Primary user:** Dutch primary-school learner, roughly Group 7. Topo teaches spatial location and recognizable form rather than arbitrary hit boxes. Priority: geography, learning, clarity, usability, consistency, engagement.

| Learner job | Status | Current behavior / gap |
|---|---|---|
| Find cities, countries, seas, rivers, mountains, volcanoes, regions, microstates | PARTIAL | All 45 Italy worksheet items present; several features schematic and independent GIS provenance unknown. |
| Learn by category and see correct answers | IMPLEMENTED | Four city groups and thematic groups show map labels and lists. Generated `print.html` and A4 booklet offer group learning sheets and two kinds of paper tests; all 45 labels cannot display together. |
| Point to a geographic name | IMPLEMENTED | Shuffled full quiz pool checks SVG item ID; saved wrong items recur. Category-filtered quiz PLANNED. |
| Write a geographic name | IMPLEMENTED | Highlighted object; normalized name/aliases accepted regardless of accents. |
| Take a grouped, finite worksheet test | IMPLEMENTED | Default alternates letter/number → name and name → letter/number; choose one direction or mix with map pointing/name writing. A score and restart appear after every item in the selected group. |
| Review mistakes | PARTIAL | Learn group, mistake-only quiz, periodic mistake review; per-item mastery PLANNED. |
| Track progress and earn rewards | IMPLEMENTED | Eight slices/pizza, three pizzas/Vespa trip, local v3 persistence, both resets, reduced-motion-aware celebration. |
| Distinguish Rome from Vatican | IMPLEMENTED | Tiny Vatican marker and hover/focus/tap local two-choice inset; device QA pending. |
| Compare worksheet with map | PARTIAL | 1:1 photographed overlay with sampled dot alignment; perspective/coastlines unregistered. |

## Modes

- **Learn — IMPLEMENTED:** grouped reference with shuffled highlight sequence and fixed-order school list.
- **Practice — IMPLEMENTED:** `Alles aanwijzen` and `Namen schrijven` use full shuffled pool; `Oefen fouten` narrows it.
- **Test — IMPLEMENTED:** choose any worksheet learning group and both directions, either direction alone, or all formats; shuffled questions, score and restart. Capital worksheet letters A–G differ from lowercase a–o.
- **Reference map — IMPLEMENTED for current worksheet:** group names on the interactive map and printable group-by-group learning cards, with both a clean generated map and the original school photo in `print.html`.
- **Adaptive learning — CONCEPT:** item history and due reviews; see `LEARNING_MODEL.md`.

Stabilize Italy before expanding curriculum. Accurate shapes and worksheet comparison take priority over decorative additions. Keep microstates geographically tiny with separate generous hit geometry. Pizza/Vespa is a restrained learning reward that does not interrupt the next question.
