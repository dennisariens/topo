# TOPO / Nino — UX & Journey Design V3
**Owner feedback:** 27 October 2026. **Status:** approved product direction / design brief, **not** runtime implementation or signed-off artwork.

This document updates the product brief for the working downloadable computer experience and the future iPad experience. Existing curricular and saving logic are not being redesigned. **Source of live runtime:** [PR #51](https://github.com/dennisariens/topo/pull/51) at `bd1e57bc48e55a065cbbccb68acea196a64a187c`, with identical functional app bytes to [PR #47](https://github.com/dennisariens/topo/pull/47) at `b111ed2abfed15c97106e3d755fcff33c704215f`. These drafts are **not merged into main**. Download from release `offline-computer-issue-50`; the offline artifact is verified by Codex, Hermes independent QA and physical iPad Safari acceptance remain separate.

## Product north star
A child exploring Italy with Nino: **quiet map-first geography learning + meaningful earned travel moments**, not a dashboard crowded with controls, score counters and unrelated minigames. Formal exams are even quieter. Keep original warm Italian palette (crema, terracotta, basil/teal, Riviera blue, authentic restrained gold); the benchmark `docs/visual/discovery-map/owner-benchmark.png` is the quality reference, not permission to fake terrain.

## 1. Decisions and open visual approvals

| Surface | Product decision / priority | Implementation / design ticket |
| --- | --- | --- |
| Desktop/right learning column | **P1:** simplify task surface to map, one current question, answer/check/feedback, concise real progress. All utilities secondary; maintain primary actions discoverable. Compare original desktop and iPad Focus flows. | [#52](https://github.com/dennisariens/topo/issues/52), existing [#33](https://github.com/dennisariens/topo/issues/33)/[#44](https://github.com/dennisariens/topo/issues/44) |
| Existing daily goal | **P1 display review, NOT new mechanics**. Already exists in route/learning app: daily answer credit and local-day rollover. Show modest `Vandaag` in home/journey and optionally small progress indicator; no streak guilt, punishments or additional score. | #52; current implementation described in `docs/PROJECT_STATE.md` |
| App identity/cropped Nino at upper left | **P1:** replace accidental portrait crop with a designed and owner-approved TOPO/Nino app icon/wordmark lockup, tuned at 32–60 px with safe visible face and red Vespa. Favicon/home icon/offline inline fallback from one source. Owner must approve icon asset choice. | Existing [#8](https://github.com/dennisariens/topo/issues/8), packaging [#12](https://github.com/dennisariens/topo/issues/12) |
| Nino guidance | **P1:** routine grades inline; major real events get larger temporary, nonblocking Nino speech/illustration card. Avoid full-screen disruption and never hide error explanation. | [#53](https://github.com/dennisariens/topo/issues/53) |
| Discovery map | **P1:** current mostly green outcome is NOT the owner benchmark. Revise from real DEM, controlled olive/terracotta mountain values, richer blue water, tiny approved margin art; compare side by side against benchmark at same camera. Keep authentic map and target positions. | Existing [#35](https://github.com/dennisariens/topo/issues/35) |
| Schoolkaart / Ontdekkingskaart / assessment | **Exactly two user-selectable interactive map styles**, per existing #22. Formal Test/Gold get a **quiet exam rendering state** (crème/parchment low-noise paint, no decorations/answer labels) applied to canonical geometry without becoming a third selector item. Preserve saved preference and restore after assessment; explicitly test for unexpected theme jumps. School handout is a separate reference, never an interactive style. | Existing [#22](https://github.com/dennisariens/topo/issues/22), #35, #44 |
| `Mijn kennis paspoort` / `Mijn` | Primary child-facing entry becomes **`Mijn reisboekje`** with illustrated opening cover and facing pages / single-page on phone. Existing **45-item knowledge/mastery passport remains accessible as an internal `Mijn kennis` view**, not deleted or falsely converted to stamps. Real chapter ink, separate earned Gold, Vespa ARRIVO and postcards only when actual state warrants. Do not rename internal persisted keys casually. | Existing [#21](https://github.com/dennisariens/topo/issues/21), [#20](https://github.com/dennisariens/topo/issues/20), [#41](https://github.com/dennisariens/topo/issues/41), preparation [PR #49](https://github.com/dennisariens/topo/pull/49) |
| Vespa earned transitions | **P1 design/P2 polish:** explicit progress → third earned pizza → invitation → departure → moving along schematic true ordered stop line → arrival/postcard/stamp → continue exact lesson. Reduced motion uses static destination; replay no reward. | [#54](https://github.com/dennisariens/topo/issues/54), #21 |
| Football side quest | **P2:** genuine **Milaan fourth-trip arrival** unlocks small optional 10–15s football experience / collectible cultural memory. Reviewable from attained Milaan page; no licensed kits and no 46th assessed item. Replay adds zero rewards. | [#55](https://github.com/dennisariens/topo/issues/55) |
| Vespa pit stop | **P2:** genuine **Bologna second-trip arrival** unlocks optional 5–8s helmet/tyre check / illustration. Skippable and replayable, no fuel/maintenance economy or gating. | [#56](https://github.com/dennisariens/topo/issues/56) |
| Gelati | **P2:** restrained occasional chapter-completion delight, not points/second currency. Decorative/ephemeral unless owner approves a read-only memory grounded in genuine completion. Pizza remains the canonical rewards meter. | [#57](https://github.com/dennisariens/topo/issues/57) |

## 2. Screen hierarchy by mode

### Discover / Learn
- Map is hero, more visually rich Discovery benchmark after acceptance.
- Nino greets unobtrusively; chapter/topic and one action are obvious.
- Short real `Vandaag` indicator possible on journey/home, no obsession or forced daily streak.

### Point / Write
- One current question, direct pointer/keyboard interaction, clearly visible solid answer/control, concise correct/wrong feedback.
- Right-hand desktop utility tower collapses into small coherent menu. Do not break existing iPad floating warm parchment Focus Mode, input field focus, camera or pointer hit testing.
- Overlay Nino only at meaningful events, not on every correct tap; all wrong-answer recovery remains usable.

### Test / Gold
- Quiet cream/parchment **presentation state**, no rich off-map embellishment, no hinting labels or choice-order leaks. Same vector map, source locations, transforms, hit geometry and resolver.
- Do not silently discard user-chosen Schoolkaart/Ontdekkingskaart preference. Keep explicit style selector exactly two options; restore normal rendering on exit.
- Earned Gold feedback only on genuine passed complete Gold, not six-question pause, replay or missed questions.

### Journey / passport
- Travel passport is tactile and openable, not generic profile card. `Mijn reisboekje` entry persists safely during lessons and focus returns to exact question on close.
- `Mijn kennis` is a factual 45-object skill/mastery reference, distinct from `Mijn reis` travel/stamps, with truthful representations in both.
- Existing stage 3 and `goldAt` are canonical for chapter ink and separate Gold stamps; trip count for ARRIVO. No fabricated event dates, no extra ledger; see #21/PR49.
- Canonical order: Rome [start] → Florence [trip 1] → Bologna [2] → Venetië [3] → Milaan [4] → Genua [5] → Napels [6] → Rome [7], then repeats. Trips arise from **3 genuinely earned pizzas**, pizzas from **8 real slices** each. These are *not* a chapter-by-chapter path.
- Actual trip celebration route storyboard: context/invitation, depart, travel 1.5–2.5s, arrive at truthful destination, optional eligible optional mini excursion, `Verder leren`. Skip/reduced motion accessible. On interruption progress saved; no duplicated grant on reload.
- Milaan calcio and Bologna workshop are **optional contextual experiences**, not tests or economies; no additional 45-object syllabus item, no fake sports results.
- Gelati are an optional gentle celebration after a genuine milestone, not a cumulative currency.

## 3. Dependency-aware delivery, without duplicate agents

**P0 preserve first (ongoing):** verified computer download #50/PR51; complete independent Hermes #51 QA, all-45 actual integrity #38 and physical iPad Safari #33 before iPad-beta GO. Preserve separate draft PRs and offline source artifacts.

**Phase A — P1 focus & visual proof:** owner sees side-by-side desktop/iPad views for #52 (declutter & existing daily goal), #53 (Nino overlay), #8 (real icon) and #35 (Discovery benchmark + quiet exam paint). Hermes can produce art/UX visual specifications while Codex handles narrow code, **never simultaneous edits to same runtime source**. Build implementation after owner visual approval and verified reviewed head.

**Phase B — P1 passport & journey foundation:** adopt #21/#20/#41/PR49 after #38 & art gates (#45/#46/#48). Design and implement real stamps/chapters/Gold and static legitimate route history before animated travel. #54 approved storyboard before cinematic code. Chapter completion ≠ Gold ≠ pizza ≠ travel.

**Phase C — P2 optional side stories:** implement #55 Milaan (fourth trip), #56 Bologna (second trip), #57 gelati; all optional, accessible, skippable and replay with zero new reward credits. Ship only after Phase B state truthful and stable.

**Per batch acceptance:** owner annotated visual GO/ADJUST; Codex one bounded implementation PR; Hermes independent exact-SHA functional/visual QA; offline `file://` actual downloaded HTML, map pixel invariance, mode/keyboard/focus, genuine vs unearned state tests, legacy saves and reset correctness. Physical iPad Safari must be labelled pending unless actually observed. Nothing merges to `main` or deploys without owner approval.

## 4. Explicit non-goals
No new target IDs beyond 45, no extra chapter, no new reward wallet, no fabricated map routes, no license-sensitive football assets, no hidden hints during Gold/Test, no child tracking/cloud account, no new difficulty penalties, no independent third interactive exam map and no parallel Codex/Hermes implementation against the same source. Illustrated experience never takes priority over an answerable exercise or safe progress.

## 5. Review pointers
- Current computer release: [PR #51](https://github.com/dennisariens/topo/pull/51), [issue #50](https://github.com/dennisariens/topo/issues/50).
- Underlying verified map/Focus baseline: [PR #47](https://github.com/dennisariens/topo/pull/47).
- Existing story specification: [`NINO_JOURNEY_GOLD_STORY_2026-10-26.md`](NINO_JOURNEY_GOLD_STORY_2026-10-26.md).
- Roadmap status and schedule: [`ROADMAP.md`](ROADMAP.md); decision log: [`DECISIONS.md`](DECISIONS.md).
