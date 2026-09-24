# Learning model

## Actual sequence (2026-09-24)

Learn steps through `ITEMS` order inside a chosen group and displays the label/highlight; the first city is always Bari. Switching to `point`, `write` or `exam` calls `next()`, which samples the entire 45-item pool using `Math.random()`, with saved mistakes represented three times and the previous item removed. Mixed test randomly picks point, name or code. There is no deck, session coverage, category balancing, history of per-item successes, or spaced repetition. A wrong item remains in the mistake list until a correct answer clears it. Reveal does not count as a correct response.

## Target progression (recommendation, not code)

1. **See and recognize:** labeled map and true silhouette/path first; name, code and location together.
2. **Active recall:** point to an unlabeled feature, then identify a highlighted feature by name, then mixed test. Reduce labels/hints gradually rather than withholding them immediately.
3. **Short-term robust random:** use a seeded shuffle or a testable session deck with each eligible item once before reshuffling; disallow consecutive repeats across deck boundaries; test that first items vary with seed and that full coverage occurs. Category practice should select that category, not all 45. Keep any deliberately increased mistake frequency measurable.
4. **Later adaptive:** track `correct`, `incorrect`, `lastSeen`, `lastMistake`, and `nextReview` for each ID; classify `new`, `learning`, `weak`, `mastered` through simple thresholds (e.g. correct after multiple sessions, with no recent error). Mix due weak items with new ones, occasionally revisit mastered items. Never present the same prompt twice in a row.
5. **Feedback:** immediately show correct location/shape and name after an error; allow another attempt later, no punitive reward loss. Keep prompt, target and next action clear for a child.

Progress remains local and resettable. Avoid opaque mastery scores or a dashboard that distracts from the map. Rewards should recognize practice without replacing geographic recall: proposed eight slices → pizza; three pizzas → brief Vespa trip, then back to the next question. Decide whether the existing five-answer-pizza saved data migrates before changing the persistence schema.
