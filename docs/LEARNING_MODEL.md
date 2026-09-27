# Learning model

## Current sequence (2026-09-27)

Learn keeps worksheet order in its visible group list, while shuffling the first highlight and subsequent `Volgende plek` cards. Point/name/mixed quiz modes draw from a Fisher–Yates shuffled 45-item deck (`scripts/learning-engine.js`). Initial items vary across sessions; a new deck avoids an adjacent repeat at its boundary. Every fifth turn, a saved mistake may be reviewed if different from the last question. A correct answer clears that item's mistake flag. `Oefen fouten` restricts the quiz pool. Mixed test separately samples point/name/code formats. Reveal does not count as correct. There is no per-item success history, category-filtered quiz, adaptive weighting or due-date scheduler.

The app stores `{schema:3,good,pizzas,slices,trips,mistakes}` locally. Legacy v2 pizza totals are preserved; a partial five-answer pizza converts proportionally into the new eight-slice meter. Progress is resettable. One correct answer earns one slice; eight slices make a pizza; each third pizza triggers a brief Vespa trip. Mistakes never remove earned rewards.

## Next learning improvements (recommendations)

1. Show labeled maps and real silhouettes/paths before recall; gradually reduce hints. Retain city groups and offer future category-filtered quiz.
2. Keep deck coverage and no adjacent repeats; measure whether interleaved mistake review helps before tuning its frequency.
3. Track `correct`, `incorrect`, `lastSeen`, `lastMistake` and `nextReview` by stable ID. Present due weak items more often, occasionally revisit mastered ones and mix in new items.
4. Define mastery by multiple correct answers across sessions without a recent mistake. Immediately reveal location/name after errors and repeat later.
5. Keep Vespa celebration brief and nonblocking; the next question stays available, and reduced-motion preference is honored.
