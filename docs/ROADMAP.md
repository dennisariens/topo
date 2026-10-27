# Topo / Nino — Roadmap

**Updated 27 October 2026.** Private Italy beta target: **29 October 2026 (conditional, not a completion claim).** GitHub PRs are still draft/unmerged unless their live status changes. This document tracks current shipping gates, product directions, agent ownership and accurate scope.

For the full accepted story + technical contract, see **[Nino Journey — Gold, Passport and Story](NINO_JOURNEY_GOLD_STORY_2026-10-26.md)**. Read alongside [current project state](PROJECT_STATE.md), [map selection hotfix](MAP_SELECTION_HOTFIX.md) and [Focus Mode](FOCUS_MODE.md). Planned features are not implemented merely because documented here.

## 27 October 2026 — Owner UX review & next build waves (current authority)

**Working computer download NOW:** [issue #50](https://github.com/dennisariens/topo/issues/50) / [draft PR #51](https://github.com/dennisariens/topo/pull/51) at `bd1e57bc48e55a065cbbccb68acea196a64a187c`, with [verified pre-release download](https://github.com/dennisariens/topo/releases/tag/offline-computer-issue-50). It retains the fully offline functional PR #47 runtime byte-for-byte (`b111ed2abfed15c97106e3d755fcff33c704215f`), including corrected Apennines, map semantic hit-testing and all 45 IDs. **Codex file:// and release digest PASS; independent Hermes desktop verification and physical iPad Safari remain pending.** Neither PR #47 nor PR #51 is merged to main. PR #49 is passport **preparation only**, not a newer working app.

**New authoritative design brief:** [TOPO UX & Journey Design V3 (27 October)](TOPO_UX_JOURNEY_V3_2026-10-27.md). Preserve existing [Nino Journey Gold story](NINO_JOURNEY_GOLD_STORY_2026-10-26.md), two interactive map styles [#22](https://github.com/dennisariens/topo/issues/22), and the separate physical iPad acceptance [#33](https://github.com/dennisariens/topo/issues/33). The 29 Oct beta is a conditional objective, not a license to merge incomplete UX.

### Roadmap V3 — delivery gates

| Phase | Priority and feature | Tracked execution, dependencies and evidence |
| --- | --- | --- |
| **P0: now** | Keep tested, downloadable offline computer release working; finish 45-object learning integrity audit; actual iPad Safari keyboard/lesson acceptance separately | [#50](https://github.com/dennisariens/topo/issues/50) / [PR #51](https://github.com/dennisariens/topo/pull/51); [#38](https://github.com/dennisariens/topo/issues/38); [#33](https://github.com/dennisariens/topo/issues/33). Independent QA must be exact SHA. |
| **Phase A — P1, first UX/design** | **Clean desktop learning column**, clearer hierarchy in mode-specific map/answers, move utilities into menu; unobtrusively display **existing** daily goal (do not add new streak engine) | New [#52](https://github.com/dennisariens/topo/issues/52) with [#44](https://github.com/dennisariens/topo/issues/44). Design screenshot comparison first. |
| **Phase A — P1** | Larger **Nino encouragement event cards** for earned/important moments, routine grading unobstructed | New [#53](https://github.com/dennisariens/topo/issues/53), owner overlay storyboard → Codex implementation → Hermes QA. |
| **Phase A — P1** | Fix upper-left cropped character with genuine approved **TOPO icon and wordmark**; align small and home-screen assets | Existing [#8](https://github.com/dennisariens/topo/issues/8) and native packaging later [#12](https://github.com/dennisariens/topo/issues/12). Asset owner approval required. |
| **Phase A — P1** | Bring mostly-green **Ontdekkingskaart** up to benchmark quality; during Test/Gold apply **quiet crème assessment rendering**, not a third interactive map selector | Existing [#35](https://github.com/dennisariens/topo/issues/35), [#22](https://github.com/dennisariens/topo/issues/22); use original map geometry, compare at same camera. |
| **Phase B — P1** | Redesign child-facing **`Mijn reisboekje`** (book, actual stamps, ARRIVO, Gold), retain factual 45-object **`Mijn kennis`** view inside; integrate verified passport art and **static** accurate journey first | Existing [#21](https://github.com/dennisariens/topo/issues/21), [#20](https://github.com/dennisariens/topo/issues/20), [#41](https://github.com/dennisariens/topo/issues/41), [PR #49](https://github.com/dennisariens/topo/pull/49), [#45](https://github.com/dennisariens/topo/issues/45)/[#46](https://github.com/dennisariens/topo/issues/46). P0 #38 & art production gates before runtime integration. |
| **Phase B → C — P1 design/P2 motion** | Earned **Vespa route storyboard**, depart → short ride → truthful destination → stamp/postcard → back to exact lesson; replay does not re-award | New [#54](https://github.com/dennisariens/topo/issues/54) after truthful passport trip state. Maintain 8 slices/pizza and every 3 pizzas/trip. |
| **Phase C — P2** | Optional **Milaan football** only after actual fourth-travel arrival; revisitable from journey book, skippable and cosmetic | New [#55](https://github.com/dennisariens/topo/issues/55). No assessed football object/extra currency/licensed kits. |
| **Phase C — P2** | Optional **Bologna Vespa pit stop** after actual second-travel arrival; brief and safe, never obligatory | New [#56](https://github.com/dennisariens/topo/issues/56), no fuel/damage/maintenance economy. |
| **Phase C — P2** | Occasional **gelati** celebration after real already-recorded milestone, not a second point/reward system | New [#57](https://github.com/dennisariens/topo/issues/57), owner artwork/cadence review before code. |

**Delivery rule per phase:** Main owns scope/priority; Hermes creates comparative visual proof and independently verifies exact Codex changes; Codex codes only approved bounded components; no simultaneous editing of the same application source. First pass = 1 design proof + owner GO/ADJUST, second pass = 1 small PR, then precise offline + state QA. No production/main merge without owner approval. Formal Gold/Test must remain low-distraction, no clues/false achievements.

---

## 0. Current working candidate and release truth

The historical 26 October combined functional branch documented in this section was **PR #40** at exact commit 71b33fd973c7b650c63e7921af3e7bf6aab5f79f. It stacks on **PR #39** fc8f5be4 (semantic map tap repair), which stacks on **PR #30** f67027d (two map paints with registered DEM), **PR #27** 1c4d00f (fold-out school sheet) and **PR #17** c68ace4 (Nino/lakes). None of these draft branches is an owner-approved merge or verified production deployment.

| Feature | Evidence/status | Explicit remaining gate |
| --- | --- | --- |
| Map geometry, 45 learning objects, 11 lessons, six lakes | Integrated in underlying release candidates; baseline automated tests pass | All-target learning integrity audit #38; Apennines source correction #37 if verified |
| Schoolkaart + Ontdekkingskaart | PR #30 functional, same geography, registered DEM | Owner visual finish #35, true-device accept |
| Class-aware Aanwijzen (Toscane area, Po Plain vs Po river, Rome/Vatican chooser) | Codex PR #39 + separate Hermes independent QA **PASS** for its exact SHA, 160 test taps | Real iPad Safari learner confirmation |
| iPad map-first Focus Mode, parchment answer panel, visualViewport keyboard care, chapter zoom | Hermes PR #40 functional, build/lint/17 chained programs; emulated/browser integration PASS, ~3.92× landscape and ~1.94× portrait useful map canvas | **Actual Safari software keyboard, touch, VoiceOver / iPad pass pending**. Inherited qa-map-hit browser script rerun was approval-blocked; do not mark as PASS |
| Pizza visual V2: three masters, 8 real wedges, Pisa box | Separate Codex PR #29: static open-box fallback and owner assets, unmerged | Integrate on PR #40 candidate, independent integrated QA; genuine hinge animation needs #31 source layers |
| Passport / first-run personalization | Owner contract issues #21/#20; not verified integrated | Bounded offline implementation and save/restore QA |
| Imperfect authentic stamps | Approved treatment #41; not verified integrated | Implement only in real passport, preserve masters, deterministic pressure/offset |
| Individual chapter Gold + grand 11/11 Gold ending, Venice/Milan/Bologna stories | **DESIGN SPEC ONLY** — [Nino Journey](NINO_JOURNEY_GOLD_STORY_2026-10-26.md) | Passport implementation, art acceptance and exact state/test integration |
| App packaging: home icon / iPad + macOS | #12 concept | Stabilise web/offline beta first; plan packaging without promising native DMG now |

## 0A. Verified art intake — new source branch 26 October

**Now actually present in Git, not a local art folder:** `art/nino-travel-stamps-v2-20261026` exact **`367b875c83a4e8b77c1f1d09523c20c96364f178`**. Dedicated producer-QA task **[#45](https://github.com/dennisariens/topo/issues/45)** is the authority for paths and release gates.

| Asset set | Live Git content | Product acceptance status |
| --- | --- | --- |
| 11 premium route chapter icons | 11 master PNGs + 11 optimized WebP exports + manifest in `assets/nino/chapter-icons/` | Art designs substantially ready; actual display-scale / hash verification needed. Manifest `upload_status=LOCAL_PACKAGE_ONLY_NOT_IN_GITHUB` is stale: binaries ARE in Git |
| 11 chapter travel ink stamps | 11 master PNGs + 11 extracted preview WebPs in `assets/nino/travel-passport/stamps/` | Master visual design approved, **production alpha NOT approved**; Roma, Toscana, Confine Italia have embedded matte/checkerboard concerns; Isole silhouette needs geography verification |
| Passport book | Closed/open book master PNGs in `assets/nino/travel-passport/book/masters/` | Available; must be a background for dynamic truly-earned content, never pre-baked awards/profile |
| Pizza three flavors and Pisa boxes | Real full asset package, already used in separate PR #29 | Safe source, no duplicate engineering; true hinged lid still lacks registered layers #31 |
| Final 11/11 Gold seal, Palermo/Milano football postcard, isolated botanical map frames | Not yet independently verified as final optimized release assets | Track as missing future design, not as shipped; do not replace with generic stock |

**Immediate independent work:** Hermes **art-only inspection/alpha QA** on pinned source head, contact sheets, per-asset PASS/REWORK/BLOCKED and approved runtime candidates, while Codex continues #37/#38 geography and teaching P0. Then Codex integrates verified art in one clean post-P0 branch using #21/#41 and this roadmap. Hermes reviews that exact code SHA once; don't make two agents edit runtime together. The owner’s observed green Discovery map/hidden Nino margins are still #35 design work, not proof these new icons solve the entire illustrated-map benchmark.

## 1. P0 — get a child learning correctly on the real iPad (beta gate)

1. **Owner physical-device acceptance #33:** serve immutable PR #40 candidate locally on iPad Safari, not a stale prior HTML. Portrait + landscape, genuine native on-screen keyboard showing question/input/Controleer together, focus/caret after rotation, map/full/chapter switching, Schoolblad restore, Po Plain/Tuscany, Rome/Vatican, wrong→Next→repair. Preserve existing learner save; use a disposable test profile/backup.
2. **Codex systematic learning integrity audit #38:** all 45 item IDs, meaningful correct/wrong taps, area-vs-point-vs-river overlaps, chapter route→write→Gold transitions, no stuck routes/answer leaks/unearned rewards, permanent regression ledger with PASS/FAIL/NOT TESTED. Hermes independent review **once on integrated result**, no duplicate broad testing.
3. **Geography correctness #37:** verify and if necessary correct schematic Apennines alignment, not merely source hash. Other schematic land/sea zones checked for educational validity; no fake tested claim. Preserve 890×1235 shared coordinate frame and 45 IDs.
4. **Integration candidate:** maintain PR #40's exact already-QA-tested map/Focus behavior; only compose independent PR #29 and other accepted features on a **single new reviewable integration branch**, with unified offline build/real saved session tests, no premature merge or production deploy.

**Beta GO definition:** one personally tested iPad candidate with visible unobstructed quiz/input and accurate map hit grading; no known unanswerable map object, deadlocked chapter, incorrect Gold/credit, corrupt saved progress or untested critical Safari keyboard regression. Escaped defects documented as BLOCK/NO-GO. Beta is for actual curriculum learning; premium extras must not block this gate.

## 2. P1 — cohesive journey and meaningful rewards (first stable beta iterations)

**Learning and travel are two truthful progress tracks.**

- 11 chapter ink stamps at stage 3 and separate 11 chapter Gold seals only after genuine flawless Gold. Route node and passport agree.
- End of regular learning after all 11 stage 3: **“Italië ontdekt!”**, not all-Gold.
- One distinct **“ESPLORATORE D'ORO · ITALIA”** final passport stamp only after **all 11 actual chapter Gold seals**, regardless of scooter trips. No new currency or Gold shortcut. Historical saves reflect Gold without invented first-earn animation.
- Existing pizza thresholds remain 8 correct per pizza, 3 pizzas per Vespa trip, flavors Margherita → Salami → Quattro Formaggi. PR #29 uses static Pisa-box fallback until #31 artwork layer gate. Favorite pizza chosen in optional onboarding is cosmetic only, never changes earned reward flavor.
- Passport issue #21: read-only pages for chapters/Gold, separate ARRIVO stamps for real trips only, final Golden Italy page, Nino original art. Names/cover personalisation #20 preserves old progress; stamp finish #41 uses subtly crooked/off-center, one-sided uneven ink appearance, stable across reload/backup and offline.
- **Sequencing:** ship the static earned stamps/passport/Gold first with Codex; independent Hermes visual/functional review; defer theatrical scooter behavior.

## 3. P2 — Nino's optional illustrated travel story (post-beta delight)

The Vespa order remains canonical: Rome (start) → Florence → Bologna → Venetië → Milaan → Genua → Napels → Rome, repeat based only on real earned trip count. Do not create a new Gold exam for each travel city.

- **Arrival stamp:** each actually earned arrival gets ARRIVO city mark and accurate leg on the illustrated route. Old saves reconstruct itinerary from trip count without fabricating dates.
- **Animated scooter route:** restrained 1.5–2.5s *schematic* travel connection between truthful existing city anchor positions; Nino on original red Vespa, then subtle arrival impression. Skippable / reduced-motion static; never through assessed question UI; visual replays give no rewards.
- **Bologna Vespa pit stop:** 5–8s optional tire/helmet check; no fuel/maintenance economy or mandatory interaction.
- **Milaan calcio / San Siro:** approved footballer Nino (helmet off) visits a cultural stadium postcard; selectable generic unbranded jersey color, no licensed kits, no 46th assessed item, no extra points. A teaser after correctly studying Milan can be shown outside formal tests; full cameo after actual Milan arrival. Optional 10–15s, instantly skippable.
- **Venetië:** scooter parked outside lagoon; by foot/boat in city, not riding across canals. Genua coast and Napels culture remain short story beats. Rome return is a travel-loop milestone, **never automatically 11/11 Gold**.
- Optional chapter illustration integration #19, owner illustration palette, premium Discovery visual finish #35 and more authentic passport page ornament only if they do not shrink real iPad map or obscure keyboard.

## 4. Ownership and exact handoff sequence

| Order | Responsible | Bounded output |
| --- | --- | --- |
| Now / beta | Owner + Hermes | Physical iPad Focus Mode test; PASS/ADJUST with device evidence on PR #40 |
| Now / beta | Codex | #38 45-target real learning audit + #37 source-checked correction, one focused PR and truthful ledger |
| After stable #40 | Codex | Integrate PR #29 Pizza V2 into actual combined app; no fake hinged-lid animation |
| Passport milestone | Hermes design | One unified visual contract: approved 11 ink masters, Gold chapter die, distinct grand Gold, arrival stamps, #41 imperfections, book spreads and optional 7-beat storyboards |
| Passport milestone | Codex implementation | #21 + #20 (optional), stage/goldAt/trips projections, Gold in route and book, static itinerary, final Gold; tests/offline & save migration; one bounded PR |
| Verification | Hermes QA | Independent exact-SHA functional/visual review including 11 Gold states, 7+ trips, rewards, reload, input and offline |
| Post-beta | Codex + Hermes | Optional cinematic route, Milan football card and Bologna maintenance, owner visual approval |
| Later | Owner-led | iPad/macOS packaging #12 and cross-country site/module work #32, only after core Italy app stabilises |

**Resource use:** Codex for focused engineering, Hermes for art/narrative and independent QA, Main for product decisions, Work only where distinct browser/cross-app orchestration matters. Do not ask two agents to alter the same source in parallel. No merge/deployment/paid action without explicit owner approval.

## 5. Definition of done: gold and journey milestones

- Chapter completion at stage 3 yields **one ink chapter stamp**, not Gold.
- Genuine chapter Gold first-earned updates route and passport consistently with no replay duplication.
- 11 completed with fewer than 11 Gold never shows final Golden Italy stamp. 11/11 genuine Gold shows final stamp regardless of Vespa travel count.
- ARRIVO stamps reflect trip count only; landing at Milan, playing football or choosing jersey color never earns chapter Gold. >7 trips cycle truthfully and re-visits are labelled.
- Motion is never required, never reveals a target during assessment, and never blocks current lesson. Portrait/landscape/keyboard and reduced-motion/VoiceOver remain usable.
- Legacy saves, reset choices, offline exports, source art and canonical map content remain truthful and intact.

## 6. Deferred; not beta blockers unless they cause core damage

Genuine layered Pisa box lid #31, decorative stamp foil effects, football animation, optional maintenance scene, postcards, native installer (#12), additional countries/web platform (#32), advanced parent dashboards and cloud sync.

## 7. Historical context

Earlier Release 1 / 1.1 / 1.2 review records remain in their original documents (RELEASE_1_INTEGRATION.md, RELEASE_1_1.md, RELEASE_1_2.md, RELEASE_1_2_INTEGRATION.md). This roadmap supersedes the 2026 September Release 1-only “Deferred outside Release 1” paragraph; it does **not** imply that any historical feature or current draft PR has been merged or deployed.
