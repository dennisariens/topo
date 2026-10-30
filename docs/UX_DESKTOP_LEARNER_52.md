# TOPO / NINO — #52 Calm Desktop Learning (UX Design + Codex contract)
**Status:** design direction and engineering scope only; **NO application implementation yet**. Owner has released computer v1 and explicitly asked to proceed with issue #52. Date: 30 October 2026.

## Source of truth / branch isolation
- **Frozen v1 baseline:** `release/topo-nino-computer-v1-20261030`, full commit `1bf86b3e1c69319bed8ef877243070a64d97a12e`.
- **Only implementation branch:** `codex/issue-52-calm-desktop-learning` based on that precise SHA. Target this frozen branch for review, not stale `main`, PR #51 or the moving unfinished stacked PRs.
- Existing final computer HTML release is **immutable** for this work. Build a separately named **UX preview candidate** with its own sha; do not overwrite or republish the frozen v1 until signoff.
- This is a **presentation-only refactor**. No new study IDs, graphics, counters, question logic, interactions with the grader, schema, maps or rewards.

## Observed issue + actual architecture audit
Current large fine-pointer desktop still uses the original right-hand full panel; it is too busy during learning. The code already has an intelligent map-first Focus Mode for compact and coarse-pointer screens:
- `scripts/focus-mode.js` uses `setupFocusMode()`, one canonical `#quiz`, `#answer` and `#check`, moving existing DOM nodes with marker anchors (no clones).
- Focus eligibility is `innerWidth <=1180` or `<=1440 && pointer:coarse`. The rule and iPad behavior should stay intact; desktop changes must not create a competing responsive fork or double-reparent input.
- Existing Focus Menu moves `nav.tabs`, `#groupPicker`, `#testSetup`, `#nameToggleWrap`, `#printMap`, `#reveal`, `#mistakes`, `footer.backupTools` under its Menu. Reuse these **same real controls and handlers** when simplifying the desktop, with a compact purposeful menu/drawer rather than duplicating the controls.
- Existing `.mapCard`, `.mapTools`, `#map`, `.mapArea` and Schoolblad/Kaartstijl/Heel Italië/Zoom op hoofdstuk controls are already functional. Change desktop layout/presentation, not map source/paint/camera/geometry.
- Existing route status appears in `#routeLessonCount`; Test/Gold in `#testStatus`; Learn in `#learnPrompt` and `#learnNext`. These and correct/wrong explanations remain legible.
- Today/daily-answer credit is **already present** in the current app. Locate canonical actual data and rollover rules before placing a UI display. Do NOT add a second daily ledger, a manufactured threshold or a stressful streak.

## Visual direction — before/after proof required
**North star:** like a premium Italian field notebook, warm ivory paper, restrained green/terracotta ink and one clear task at a time. Calm, legible, 11-year-old friendly, not corporate dashboard or Duolingo control carnival.

### Wide fine-pointer desktop (1440–1728 px)
- One clean horizontal header: correctly named existing TOPO identity, optional subtle true `Vandaag` count, a single real **Menu**. Do not redesign/icon-source substitute (issue #8).
- Main content is **map-first**; aim for **~68–72% map / ~28–32% task panel** based on actual desktop usable width, but choose a smaller safe map/panel ratio when accessibility or content requires it. No nested horizontal scrolling; Italy whole-map and chapter zoom both reachable.
- Map toolbar: only essential functional `Heel Italië`, `Zoom op hoofdstuk`, `Kaartstijl` and `Schoolblad` controls, grouped and consistently aligned. The default visible map must remain fully navigable.
- Right task space: single chapter/mode label, concise *real* progress, one current question, canonical input OR clear 'tap the map' instruction, current feedback, **one visually primary CTA** (as context requires). One subtle back/exit action. No persistent pizza slice rack, Vespa carousel, Nino card, reset/import/print/mistakes/reveal utilities competing with the question.
- Secondary navigational and utility controls go under **Menu**, grouped: `Leren en oefenen` (mode, chapters, Test/Gold), `Kaart en hulp` (non-primary info), `Hulpmiddelen` (print, backup, reset, settings). Reset must require its existing explicit confirmation. The Menu must remain discoverable, accessible by keyboard and close on Escape/outside click. Use real originals, not cloned buttons.
- On home/route overview, `Vandaag` may be shown as calm factual progress. In lessons, a minimal compact factual label only if accurately sourced. No invented "10 per day" if no real target, no newly added streak or reward.
- Display actual completion state truthfully: completed chapter not the same as Gold, pizza earned from 8 actual slices, trip after 3 actual pizzas. No generated decorative passport or new Nino overlays in this ticket.

### Mode-specific contract
| Mode | Visible learner surface | Keep out of view |
| --- | --- | --- |
| Ontdekken | Current place, genuine Discover copy and existing Next control; map as main attraction | Deep utility stack and graded-status wording |
| Aanwijzen | One question, instruction to tap map, step progress, short actual correct/wrong feedback, continue | Writing input when not needed, redundant CTA |
| Namen schrijven | One question, exact original input, exactly one `Controleer` and necessary Next/feedback | Second/mirror answer field, competing buttons |
| Ordinary Test | Correct question and real grading, quiet controls; existing map style but no unsolicited answer hints | Nino celebrations and utility clutter on unanswered tasks |
| Gold | Exam-style calm cream/low-noise state, question/progress/necessary actions only | Named answer, altered picker neutral order, premature Gold badge |

### Small and medium screens
- **DO NOT rewrite** existing iPad/phone Focus. Maintain `<=1180` and coarse-pointer `<=1440` ownership, keyboard-safe `visualViewport`, one canonical input, bottom frosted sheet, safe reparent, caret and camera.
- Across 1500→1100→1500, active writing draft, backward caret selection and focus must remain intact, no double focus handler and no duplicate/menu nodes.
- Provide actual side-by-side **before/after screenshots** at 1728×1080 and 1440×900; regression snapshots 1280×800, 1180×820, 820×1180, 390×844 and 320×568. Note 1280 fine pointer is desktop, 1180 switches to Focus, coarse at 1366 retains Focus.
- At 200% zoom / large text, test no hidden primary action; use column stacking as needed rather than overlaps.

## Delivery protocol (avoid another endless planning-only handoff)
1. **Stage 1 design proof**: prepare annotated real-app before/after capture/mock in the actual project for five modes; produce minimal source-aware design plan and show owner. A separate standalone HTML **UX concept preview exists in the TOPO chat**, but it uses a **clearly identified map placeholder** and **fake/sample UI state**, not a working geography engine. It is reference for hierarchy only, not a release or QA proof.
2. **Stage 2 implementation**: after owner design GO, same branch, reuse exact existing DOM elements and isolated CSS/JS. Keep modules bounded, no app state or persisted data change. Generate a new separate offline HTML **review candidate**; do not change released SHA/file.
3. **Stage 3 acceptance**: npm build/lint/17-program test chain and audited file:// offline Chromium with network blocked, map-based Point/Write/Test/Gold and legitimate route tasks, all45 reachable, neutral Rome/Vatican & volcano/sea choices, correct/wrong, save/backup, daily rollover, 8 slices/pizza and third pizza/Vespa. Desktop + compact Focus screenshots. Independent Hermes exact-SHA QA, owner final GO; no merge to main or release overwrite before GO.

## Explicit non-goals
No #53 Nino encouragement overlay, #8 icon redesign, #35 Atlas terrain/Discovery polish, #21 travel passport implementation, #54 Vespa animation, #55 football, #56 pit stop or #57 gelati. They follow this UX task and must not bleed into the change. Keep original artwork and map assets unchanged.

## Specific QA traps
- Do not remove print or backup functionality just because hidden from the learning workspace.
- Do not use display:none on a parent of the real canonical input when its handler is needed, do not leave a second enabled mirror input, and preserve exact focus after crossing breakpoint.
- Do not hide progress/reward announcements in a way that makes earned events inaccessible, though the persistent sidebar can be quiet.
- Do not reveal correct answers by changing map pan/zoom, answer-dependent CSS or a difference between shuffled Rome/Vatican option diagrams.
- Do not show fake progress after reload/day rollover or count trial/replay answers as a new pizza/Gold.
- Do not introduce DOM MutationObserver loops or unwanted map resize drifts.
