# Product specification

**Primary user:** Dutch primary-school learner, roughly Group 7. Topo teaches spatial location and recognizable form rather than arbitrary hit boxes. Priority: geography, learning, clarity, usability, consistency, engagement.

| Learner job | Status | Current behavior / gap |
|---|---|---|
| Find cities, countries, seas, rivers, mountains, volcanoes, regions, microstates | PARTIAL | All 45 Italy worksheet items present; several features schematic and independent GIS provenance unknown. |
| Learn by category and see correct answers | IMPLEMENTED | Four city groups and thematic groups show map labels and lists. Generated `print.html` and A4 booklet offer group learning sheets and two kinds of paper tests; all 45 labels cannot display together. |
| Point to a geographic name | IMPLEMENTED | Shuffled questions within the chosen worksheet group check SVG item ID; saved wrong items recur. Very small map targets need device testing. |
| Write a geographic name | IMPLEMENTED | Chosen group, highlighted object, normalized name/aliases regardless of accents. |
| Take a grouped, finite worksheet test | IMPLEMENTED | Default alternates letter/number → name and name → letter/number; choose one direction or mix with map pointing/name writing. A score and restart appear after every item in the selected group. |
| Review mistakes | PARTIAL | Learn group, mistake-only quiz, periodic mistake review, and guided route due reviews of weak items; durable mastery across all modes remains PLANNED. |
| Track progress and earn rewards | IMPLEMENTED | Eight slices/pizza, three pizzas/Vespa trip, local v3 persistence, both resets, reduced-motion-aware celebration. |
| Distinguish Rome from Vatican | IMPLEMENTED | Tiny Vatican marker and hover/focus/tap local two-choice inset; device QA pending. |
| Compare worksheet with map | PARTIAL | 1:1 photographed overlay with sampled dot alignment; perspective/coastlines unregistered. |

## Modes

- **Guided route — IMPLEMENTED:** own overview screen with all 11 stops and four stages per stop, visible locked future stages, replay of completed stages, optional gold challenge, due review, local persistence and a map lesson screen. The route is shown first; all free modes remain accessible.
- **Learn — IMPLEMENTED:** grouped reference with shuffled highlight sequence and fixed-order school list.
- **Practice — IMPLEMENTED:** `Alles aanwijzen` and `Namen schrijven` use the chosen group, initially cities 1–6; `Oefen fouten` narrows to saved mistakes. A skipped or revealed item enters mistake review.
- **Test — IMPLEMENTED:** choose any worksheet learning group and both directions, either direction alone, or all formats; shuffled questions, score and restart. Capital worksheet letters A–G differ from lowercase a–o.
- **Reference map — IMPLEMENTED for current worksheet:** group names on the interactive map and printable group-by-group learning cards, with both a clean generated map and the original school photo in `print.html`.
- **Adaptive learning — PARTIAL:** route stages track per-item mistakes and schedule reviews; stronger mastery estimates across free practice and tests are CONCEPT. See `LEARNING_MODEL.md`.

Stabilize Italy before expanding curriculum. Accurate shapes and worksheet comparison take priority over decorative additions. Keep microstates geographically tiny with separate generous hit geometry. Pizza/Vespa is a restrained learning reward that does not interrupt the next question.
