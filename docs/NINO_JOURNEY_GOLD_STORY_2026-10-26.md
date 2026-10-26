# Nino — Gold, reisboekje en het Grote Italiaanse Avontuur

**Product specification | 26 October 2026 | design approved in principle, implementation pending**

Repository: dennisariens/topo. Companion to [roadmap](ROADMAP.md), passport issue #21, personalisation #20, imperfect stamp finish #41, original pizza rules #28, active iPad candidate PR #40, learning audit #38 and geography issue #37.

## 1. Product promise

Nino helps a child learn the **existing 45 Italian geography targets** through the **existing 11 chapters**, with three actual stages: Ontdekken, Aanwijzen, Namen schrijven. Rewards make this real school work feel like filling an illustrated Italian travel passport. Nothing in this specification adds an assessed target, school code, score currency, compulsory side quest or learning shortcut.

There are **two independent paths**: a **LEARNING path** through chapter mastery and Gold, and a **TRAVEL path** through three authentically earned pizzas per Vespa ride. They meet visually in the passport, but never award each other progress. A football postcard is an optional memento, not learning credit.

### Sources of truth; no new achievement economy

- Chapter IDs exactly: city1, city2, city3, city4, islands, mountains, volcanoes, regions, countries, seas, rivers.
- Existing chapter record: stage 3 = completed; completedAt = completion time; goldAt > 0 = earned genuine flawless chapter Gold. Existing Gold tests consist of Point + Write questions and award Gold only when the actual Gold test passes with zero errors.
- Existing reward state: 8 eligible correct answers = one pizza; Margherita, then Salami, then Quattro Formaggi; each third pizza = one real Vespa trip. RewardTokens / existing anti-replay rules are authoritative.
- Existing ordered travel stops: Rome → Florence → Bologna → Venetië → Milaan → Genua → Napels → Rome, then repeat. The first Rome is the starting point, not an invented trip.
- Passport renders earned state as a **read-only projection**; optional nickname, cover colour and favorite-pizza selection from #20 are personalisation only, not a route or reward trigger.

## 2. Four visual achievement types (never interchangeable)

| Type | Actual unlock event | On learning route | In passport |
| --- | --- | --- | --- |
| Chapter ink stamp | That chapter reaches stage 3 | Earned chapter stamp; replay remains available | Unique approved chapter stamp, imperfectly pressed |
| Chapter Gold seal | That exact chapter's existing flawless Gold test earns goldAt | Small, calm GOLD emblem on its chapter node; text “Goud behaald” | Smaller genuine gold overprint beside the existing ink stamp |
| Vespa arrival ink stamp | Existing trip count increases after a third earned pizza | Short optional arrival invite, not a Gold badge | ARRIVO city stamp + numbered historical itinerary |
| Final Golden Italy seal | ALL 11 genuine chapter goldAt values are positive | A single finale moment / 11 of 11 Gold; existing learning stays usable | Distinct large “ESPLORATORE D'ORO · ITALIA” seal on last spread |

### Important: chapter Gold is not city Gold

The four city learning chapters are groups of actual worksheet places. Seven scooter destination cities are a different progression. An arrival in Milan, Venice or Bologna DOES NOT confer Gold. If a destination is an item in a specific city chapter, its passport visit page may reference “Goud behaald bij [existing chapter name]” **only if that actual chapter has goldAt** and the item-to-chapter mapping verifies the relationship. Do not introduce seven artificial individual-city Gold exams. Do not equate knowing one city's name with flawless mastery of a full group.

### Chapter-result interaction

After normal completion: a 250–450ms ink press onto existing passport stamp slot, subtle “Hoofdstuk afgerond” acknowledgement, next lesson action immediately accessible. Gold remains explicitly optional.

After *true* Gold first-earned event: a restrained one-off gold seal press, gentle ring emboss and text “Goud behaald! Je beheerst [hoofdstuk].” Actions “Verder leren” (primary) and “Bekijk mijn reisboekje” (secondary), neither blocks progression. No duplicate animation / reward on Gold replay, reload or passive page visit.

Route overview always shows progress 0–11 chapters completed and 0–11 Gold earned separately. Gold failure shows neutral retry/review, never a gold seal. All 11 chapters completed is a legitimate “Italië ontdekt!” milestone even without 11 Gold; it does not unlock the final Gold seal.

## 3. Final Gold seal — ESPLORATORE D'ORO

One distinct gold artwork, not an oversized copy of a chapter icon. Visual design: warm off-white paper; hand-stamped circular / slightly oval gilt impression; terracotta outer typographic circle “ITALIA”; clear title “ESPLORATORE D'ORO”; restrained old-gold foil and a discreet approved original Nino-on-red-Vespa silhouette, with eleven small marks representing earned chapter Gold. No sports team logo, faux national government seal or literal Italian passport identity. This is Nino's fictional travel award.

Target appearance: premium, tactile, lightly misaligned ±2–4 degrees and a little off-centre, slight one-sided ink pressure, sharp readable lettering; original master art remains pristine. Follow deterministic per-stamp variations in #41. Provide a static reduced-motion / low-transparency rendering and a small accessible text label “Alle 11 hoofdstukken goud behaald”.

**Unlock:** finalGold = every canonical chapter has record.goldAt > 0. Derive on every render; do not persist a competing earnedFinalGold Boolean. First actual transition false→true in a current app session may offer a 1–2s optional finale and passport flip to rear spread. Saved Gold from an old backup must render the correct seal without fabricating a new “just earned” event. Reload/reopen never auto-rewards or auto-replays. A deliberate “Bekijk de finale opnieuw” can replay only appearance.

Suggested Dutch copy:
- “11 hoofdstukken geleerd. Italië ontdekt!”
- “11 van de 11 gouden haltes. De gouden reis is voltooid!”
- Nino: “Bravissimo! Jij bent een echte ontdekker van Italië!”

## 4. Passport pages and layout

1. **Inside cover**: chosen learner name, Nino portrait, “x/11 hoofdstukken voltooid”, “x/11 Gold”, real pizzas/actual Vespa trip count. Personalisation alone never adds awards.
2. **Eleven chapter slots**: unique existing chapter art, actual earned ink only if stage=3, small gilded overlay only if goldAt>0. Unfinished chapters show an unmistakably *empty* outline and “Nog te ontdekken”, never a faded fake earned stamp. Click completed chapter to inspect approved artwork or return to lesson.
3. **My journeys**: one chronological itinerary row per actual trip, from/to derived from the canonical seven-stop cycle; original first visit versus repeat visit labelled. Each actual arrival has ARRIVO stamp; previews of unvisited cities unearned and light. No invented travel dates for old saves. The travel count may exceed seven and remain truthful.
4. **Souvenirs**: optional cultural postcards (e.g. football in Milan, scooter pit stop in Bologna), labelled souvenir — NOT scored and not confused with lesson or arrival stamps.
5. **Final spread**: 11 real Gold markers surround the unique end seal *only when all eleven exist*. Before then show progress wording and a non-earned frame, not a gold-colored fake reward.

The book opens from any mode including mid-question, restores exact question, typed draft, focus, map camera and scroll on closing, respects reduced motion, keyboard, screen readers and iPad orientation. Important earned icons must have text labels. Passport rendering should not mutate the source route or learning state.

## 5. Short story: the seven Vespa travel beats

Do not reorder travel destinations in TopoLearning.STOPS; travel only after genuine trip increment.

| Journey | Destination | Small narrative beat | Genuine passport output |
| --- | --- | --- | --- |
| Departure | Rome | Nino checks his paper map, helmet on and sets off; no unearned ARRIVO | Starting-point illustration |
| Trip 1 | Florence (Firenze) | A real first scooter journey through Tuscan landscapes | ARRIVO FIRENZE |
| Trip 2 | Bologna | Optional five-second Vespa maintenance pit stop: tire check, scarf, helmet | ARRIVO BOLOGNA + optional pit-stop postcard |
| Trip 3 | Venetië (Venezia) | Nino parks the scooter outside the historic lagoon city and visits by foot / boat | ARRIVO VENEZIA |
| Trip 4 | Milaan (Milano) | Optional footballer Nino, stadium / San Siro culture card | ARRIVO MILANO + optional CALCIO postcard |
| Trip 5 | Genua (Genova) | Port, colorful Ligurian houses, sea breeze | ARRIVO GENOVA |
| Trip 6 | Napels (Napoli) | Southern coastal warmth and pizza heritage, independently of pizza rewards | ARRIVO NAPOLI |
| Trip 7 | Rome (Roma) | Return to beginning of one round trip, not the Gold ending | ARRIVO ROMA — ritorno |

Every subsequent seventh-trip cycle may reuse places, but a return is labelled as a revisit, not another first discovery. At most one meaningful side scene per roughly two trips; other arrivals get one line plus a stamp. No contrived fuel economy, damage, maintenance failure, repairs to buy, streaks, levels or forced mini-game.

**Football feature: optional Milano CALCIO stop.** Reuse approved original footballer Nino with familiar face, curls, scarf/character continuity; helmet **off** while playing football only. San Siro is an illustrative Milan cultural landmark, not a 46th map target or new quiz question. Allow a simple cosmetic jersey choice (Riviera blue, terracotta red or green), no real team badges, official kits, third-party logos or paid unlocks. One short “Nino speelt calcio!” postcard interaction (about 10–15s max), user may skip/close. Existing Milan city recognition in a normal lesson can surface a tiny optional teaser AFTER feedback, never as a hint in Point/Test/Gold; true full football souvenir is available on genuinely earned arrival at Milan. No mastery or pizza reward from the color selection.

**Bologna maintenance:** charming 5–8s illustration, optional and skippable. No forced taps before continuing the geography lesson, no persistent scooter health/fuel data.

## 6. Animation grammar — only actual trips, not graded tasks

On true earned trip only: after current question/result resolves, a nonblocking “Bekijk Nino's rit” invite. On view, show route segment with truthful existing projected city endpoints and a **schematic decorative connecting arc**, not a GPS itinerary or asserted drive route. The red Vespa moves calmly 1.5–2.5s; then 0.3–0.5s ARRIVO impression. Static fallback / skip immediately shows endpoint and stamp. The graded geography map, 45 IDs and hit testing remain unchanged; do not dynamically highlight assessed answers. Mark only actually traveled legs as active; unearned future stops are previews.

A route replay is explicitly user-triggered and visual only, with no changed good/slices/pizzas/trips, stage, goldAt or saved progress. Do not autoplay on reload, import, Gold replay or passive book opening; do not block typing with animations. Use approved Nino Travel illustration only (not a random new scooter or generic emoji).

## 7. State, persistence, offline and correctness

- **Gold condition:** read current 11 chapter records; Gold seal if goldAt positive; final seal if all eleven. Existing Gold replays must never mint new Gold or return incorrect final counts.
- **Trips:** reconstruct visited stop sequence from nonnegative progress.trips and canonical stops. Journey N routes from stop index (N-1) mod 7 to N mod 7. Do not invent journey timestamps, geographic tracking, travel spending or extra score. Respect legacy save import/reset: route reset clears Gold/chapter stamps; separate pizza reset changes earned arrivals only; full reset clears both.
- **Stamp placement:** generated deterministically from stable chapter/stamp identity, with per-instance slight x/y offsets, optional rotations, pressure asymmetry, edge irregularity per #41. Stable across reload, offline, backup/import, viewport/device. No global random animation reseeding.
- **Learning:** all 45 targets, two active map styles, one canonical grader, no new assessed stadium, Gold stage or school code. Test/Gold hides story hints and route previews while answering. Child can resume after dismissing story or passport.
- **Offline:** two byte-identical self-contained HTML downloads from the canonical build, no CDN, fonts or extra network calls. Preserve Nino, schoolblad, local saves, security, accessibility, focus, performance.

## 8. Acceptance matrix — required before merge

- Each of 11 chapter states: unfinished / stage 3 / Gold earned and replay; actual learn route and result badge plus identical passport state.
- Gold not granted on completion-only, Gold failed/paused, free Point, arrival, football, maintenance, pizza or replay. Gold remains optional and no reward duplication.
- Transition from 10 Gold to 11 shows one final seal. 11 completed without all Gold shows NO final Gold; old imported all-Gold save shows the seal but no new celebration. Multiple reopen/reload/reset/import cases.
- Trip counts 0, 1, 2, 3, 4, 7, 8, 14: correct from/to route, achieved stamps, repeat-visit labelling and no fictitious dates. First three pizzas (8/16/24 earned answers) continue exact preexisting reward behavior.
- Football only opt-in at actual Milaan arrival; jersey cosmetic only; no story answer hints in formal Test/Gold; Venice no scooter crossing canals.
- Genuine rerender, portrait/landscape + wide and split iPad, keyboard open, no hidden buttons, reduced motion, accessible text labels, no clipping or stamp text lost. Both offline builds and saved progress restored correctly.
- One bounded implementation PR and one independent Hermes QA at exact SHA; physical device and owner artwork approval expressly pending until tested.

## 9. Work allocation & sequencing

| Stage | Owner | Deliverable and gate |
| --- | --- | --- |
| P0 now | Codex | Close full 45-target learning integrity audit #38 and source-driven Apennines correction #37; rely on passed map-selection PR #39 |
| P0 now | Owner + Hermes QA | Physical iPad Safari accept/reject latest PR #40 Focus Mode, true software keyboard and touch |
| Beta integration | Codex | Integrate and verify existing PR #29 Pizza V2 with #40 baseline, preserving fallback static Pisa box until proper layers exist (#31) |
| First journey milestone | Hermes design, then Codex | Passport #21 with authentic 11 earned ink/Gold stamps, correct destination arrivals, static route and final 11/11 Gold seal, with #41 stamp treatment |
| Visual QA | Hermes | Independent exact-SHA review: passport state, Gold UI, 7-trip cycles, saved progress, iPad, artwork and offline |
| Post-beta delight | Hermes art/narrative, Codex build | Animated trip, Milano football cameo, Bologna scooter pit stop and collectible optional postcards |
| Later | Owner | Approve visual finish #35, Nino onboarding #20, packaging #12 and optional further countries #32 separately |

**Do not delay core geographical school beta for football, an animated scooter, the Pisa hinge or decorative gold texture.** This document is an accepted design direction and implementation handoff, NOT evidence that these features are shipped, tested on hardware or deployed. No merge or deployment without explicit owner approval.
