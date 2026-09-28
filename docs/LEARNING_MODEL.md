# Learning model

## Current sequence (2026-09-27)

Learn keeps worksheet order in its visible group list, while shuffling the first highlight and subsequent `Volgende plek` cards. Point/name practice draws from a Fisher–Yates shuffled deck within the selected worksheet group (`scripts/learning-engine.js`); initial items vary, there is no adjacent repeat at deck boundaries, and every fifth turn may review a saved mistake. A correct answer clears that mistake flag. `Oefen fouten` restricts the practice pool. Skipping or revealing a practice answer records a mistake and shows feedback before advancing. A separate finite **Toets** draws each item in the chosen worksheet group once and displays score/result. Its default directions alternate, in randomized order, between code → name and name → code; either direction or a four-format mix can be selected. Skipped/revealed items count as incorrect in Toets. `a` and `A` are different codes; only typed names are case/accent insensitive. Free practice has no per-item mastery scheduler. The guided route records per-item correct/wrong counts and schedules short review after chapter completion.

The app stores `{schema:3,good,pizzas,slices,trips,mistakes}` locally. Legacy v2 pizza totals are preserved; a partial five-answer pizza converts proportionally into the new eight-slice meter. Progress is resettable. One correct answer earns one slice; eight slices make a pizza; each third pizza triggers a brief Vespa trip. Mistakes never remove earned rewards.

## Guided route (implemented 2026-09-28)

Eleven stops match the worksheet groups. Each stop has four phases: first say names with locations shown; next point to the named feature; then type its name from a highlighted location; finally match worksheet codes and names in both directions. A passed phase unlocks the next; all places in a chapter must be answered correctly, with mistakes reintroduced after other questions. A stage can be replayed after completion without removing progress. One completed chapter unlocks the next, even without gold. The optional gold challenge requires flawless pointing and writing across all chapter items; a failed challenge retains the completed stop. Scheduled short reviews use recent error counts and streaks to choose up to six weak items; review intervals are 1, 3, 7 and 14 days after flawless reviews. All stages and current questions persist locally; reset of just the route leaves pizza rewards in place. This is a modest first adaptive layer within the route; free Learn/Practice/Test remain available at all times.

## Next learning improvements (recommendations)

1. Show labeled maps and real silhouettes/paths before recall; gradually reduce hints. Retain city and thematic groups across Learn, Point, Write and Test.
2. Keep deck coverage and no adjacent repeats; measure whether interleaved mistake review helps before tuning its frequency.
3. Track `correct`, `incorrect`, `lastSeen`, `lastMistake` and `nextReview` by stable ID. Present due weak items more often, occasionally revisit mastered ones and mix in new items.
4. Define mastery by multiple correct answers across sessions without a recent mistake. Immediately reveal location/name after errors and repeat later.
5. Keep Vespa celebration brief and nonblocking; the next question stays available, and reduced-motion preference is honored.
