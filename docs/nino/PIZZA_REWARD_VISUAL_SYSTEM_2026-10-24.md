# Topo — Pizza & Vespa Reward Visual System
**Owner design decision locked: 2026-10-24.** Scope: artwork and design requirements only. No app code, rewards, learner progress, merge, or deployment changed.

## Product intent
Italian margherita pizza is a deliberate, playful Topo identity cue. Keep it cheerful and recognisably Italian, but premium and aligned with the owner-created Nino character and red scooter. Pizza is *progress*, not a judgment of ability. Gold Mastery remains separate as proof of actual knowledge.

## Fixed reward contract — DO NOT CHANGE
- **1 accepted, eligible correct retrieval = 1 pizza slice** (existing anti-replay/idempotent eligibility rules remain authoritative).
- **8 slices = 1 completed pizza.**
- **3 earned pizzas = 1 Nino Vespa journey/destination.**
- No slice/pizza removal for mistakes, skips, or missed days.
- No duplicate credits for reload/resubmit/replay; rewards only when the real existing engine says earned.
- Preserve all persisted keys, existing 11-chapter route, school geography, Gold, reset behaviors, and standalone offline build.
- No extra coins, diamonds, energy, pressure loops, new currencies, or unrelated animations.

## Art direction — approved concept, final asset production pending
1. **Pizza master:** one delightful top-down authentic Italian margherita (golden slightly irregular baked crust, tomato sauce, melted mozzarella, restrained basil, subtle oven-baked texture), in the same polished warm premium 3D family as Nino; readable at 40–64 px. Use one visually consistent master across *all* UI surfaces.
2. **Eight identical divisions:** eight geometrically equal radial wedge positions (45° each). Each newly earned slice fills its corresponding position, drawn from the SAME master geometry and toppings, with no appearance drift or misaligned seams. Prefer one master plus coded clipping/masking or rigorously aligned layer exports; do not generate eight unrelated pizzas.
3. **0/8:** elegant clean neutral serving board/plate, no fake earned slice. **1–7/8:** the same partial pizza. **8/8:** whole pizza and a very brief tasteful earned moment; immediate truthful transition to the next pizza meter.
4. **Master asset format:** full-resolution lossless transparent PNG and layered/separable working assets where relevant; transparent WebP runtime exports, small-size previews, dimensions/sha manifest, no baked UI text or labels. A subtle wooden board is a possible independent underlay, not baked into every slice.
5. **Sitewide uses:** compact practice meter, route overview, in-lesson progress, round completion, reward toasts, and any existing pizza display; one unified pizza visual language, not disparate emoji/SVG/flat-wheel icons.
6. **Vespa trip:** remove any old yellow/plain scooter icon or emoji when Nino Travel or original on-scooter Nino is shown. Render **one official red Nino scooter asset**, never two overlapping scooter representations. Use clear next-destination text outside imagery.
7. **Motion:** subtle individual earned-slice appearance, restrained whole-pizza completion, brief travel transition. Honor reduced motion; do not obscure map or delay next question.
8. **Accessibility:** dynamic textual counts remain the authoritative descriptions (`1 / 8`, pizzas earned, trips, next destination). Decorative images are not sole source of reward status.

## Production queue — art team
- **A. PIZZA_MASTER:** one premium top-down whole margherita, isolated, alpha PNG, true eight-slice plan; check 48px.
- **B. PIZZA_SLICE:** same pizza sliced wedge with exact 45° silhouette; reference matching master; alpha PNG.
- **C. PIZZA_BOARD:** empty circular authentic wooden board/plate as a separate alpha layer (optional if UI looks cleaner without it).
- **D. PIZZA_COMPLETION:** minimal alternate effect/lighting cue only if necessary, not a confetti-loaded different pizza.
- Export test strip 0/8, 1/8, 4/8, 7/8, 8/8 using SAME assets; 40, 48, 64, 120px previews.
- Keep unfinished renders tagged candidate; only owner-reviewed final masters marked approved.

## Implementation handoff (another branch; not authorized by this design lock)
- UI source currently contains `.pizzaWheel`, `.wheelSlice`, `rewardPizzaVisual`, `journeyScooter`, `vespaRoute .vespa` and `#vespaIcon`; audit all occurrences and replace visuals *after art approval*.
- The initial screenshot showed a flat orange pizza wheel and duplicate Nino/yellow scooter. Root cause in Release 1.1 source: `vespaIcon` initialized to `🛵`, while `.vespaRoute .vespa` also applies `var(--nino-art)` as background. Only ONE Nino image is allowed.
- Do not assume a new visual asset fixes code: dedicated Codex implementation and independent Hermes QA required.
- Maintain original save schema and reward-engine unit tests; test 0–8 slices, overflow to new pizza, milestones after 3 pizzas, reset, reload, Gold replay, phone/iPad/desktop, no overlap and reduced motion.
- Bundle any approved new assets inside standalone/offline HTML; no network dependency.

## Status
**Concept / reward mechanism: OWNER-APPROVED & LOCKED.**
**Pizza master / wedge / board binaries: NOT YET PRODUCED OR APPROVED.**
**Site-wide code integration: NOT STARTED under this decision.**
**Merge / deploy: NOT AUTHORIZED.**

## Candidate proof-of-concept produced in conversation (not committed)
A draft visual asset set `topo-pizza-reward-candidate-2026-10-24.zip` was assembled from the earlier generated visual direction board. It contains transparent candidate master, 45-degree slice cutout, a distinct wooden board layer, nine aligned 0/8–8/8 state PNGs, WebP counterparts, contact-sheet preview, and SHA-256 manifest. **These are extracted/upscaled from a ~314px design-board pizza, not a true native high-resolution master.** They are a QA/design candidate only, are NOT owner-approved, NOT uploaded to this branch, and MUST NOT be silently substituted for an approved production master. Art owner should review legibility at 48px and crust edges before Codex builds a runtime replacement.
