# Nino & Topo — Art Production Roadmap
**Updated:** 2026-10-23. **Scope:** visual and editorial work only; implementation must remain separately reviewed.
**Source of truth:** `dennisariens/topo`; Release 1 working baseline PR #3 at `9df4989`; Nino design documents PR #6; UX audit Issue #5; icon Issue #8.

The art roadmap deliberately exists under `docs/nino/` while Release 1 PR #3 has not been merged. Do not overwrite its newer canonical `docs/ROADMAP.md` from older `main` or create conflicting integration commits. After the merge, Codex should link this design sub-roadmap from the canonical roadmap.

## Phase and status board

| Priority | Deliverable | State as of 2026-10-23 | Required gate / owner |
|---|---|---|---|
| P0 | Preserve original Nino identity and hero | LOCKED existing supplied originals | Never silently redesign |
| P0 | Fix missing Eilanden symbol / stale 5-vs-8 pizza text | CONFIRMED bugs, Issue #4 | Codex focused PR + Hermes test |
| P1 | **Nino scooter app icon: Riviera + terracotta candidates** | **Two 1024px master concepts and 16–512px exports locally prepared in chat; not in app or GitHub binary** | Owner selects one via iPad-scale comparison |
| P1 | **iPad icon + favicon + manifest wiring** | SPECIFIED ONLY, not implemented. Issue #8; APP_ICON_SPEC.md | Codex after visual sign-off; real Safari |
| P1 | Character Guide pose (transparent, standalone high-res) | Existing **contact sheet crop** only; isolated final render OUTSTANDING | Render ≥640px transparent, owner approves faithful character |
| P1 | Character Encourage pose (transparent, standalone high-res) | Existing **contact sheet crop** only; isolated final render OUTSTANDING | Same source identity, helpful not disappointed |
| P1 | Character Gold pose (transparent, standalone high-res) | Existing **contact sheet crop** only; isolated final render OUTSTANDING | Genuine gold event, no every-answer confetti |
| P1 | Minimal six-answer finish / travel feedback | VOICE+89-event copy matrix ready; app implementation OUTSTANDING | Codex implement NOW subset, Hermes truth QA |
| P1 | Eilanden arrival scene | Illustrated **prototype scene crop** exists, final clean 16:9 full-resolution export OUTSTANDING | Owner visual check; no wrong map geography |
| P1 | Eleven category route icons | 11 **icon-reference PNG concepts**; not production SVGs | Codex generate proper readable SVGs, verify all references |
| P2 | Welcome, Success, Travel, Arrival, Reflect Nino poses | Concepts only; first reuse existing original/approved portrait where enough | Test value after Guide/Encourage/Gold |
| P2 | Extra chapter scenes: Vulkanen, Bergen, Zeeën, Rivieren, Steden | Contact-sheet prototypes / briefs; standalone art OUTSTANDING | Produce only for meaningful arrival moments |
| P2 | First 2 postcards: Eilanden + Vulkanen | Concept crops only, unlock not implemented | Test with learner; no duplicates/more currencies |
| P3 | Remaining 4–6 postcards / passport collection | Concept only | Validate child interest, milestone unlocks and device storage |
| P3 | Cosmetic Vespa colours / travel stickers | Deferred | Avoid scope inflation |
| P3 | Animation / seasonal graphics | Deferred | Reduced motion and offline performance first |

## Short execution sequence — no parallel duplicate builders

### Release 1.1 (Codex; Hermes QA)
Issue #4 and Issue #5 P1 usability: restore Eilanden icon, fix stale five-answer pizza copy, compact long route cards, improve mobile navigation, move map provenance to a disclosure. No broad character-art implementation during functional stabilization.

### Art Gate A — icon concept decision (Main + owner)
Review local **topo-nino-app-icon-v1.zip**:
- Blue Riviera preferred vs terracotta alternate, both derived from original high-res Nino PNG rather than tiny crop.
- Check true **64px and 32px** previews, appearance on real iPad, and compare with any prior favicon the user supplied historically.
- Once selected, Codex adds touch-icon/favicon/manifest assets via Issue #8 in a separate reviewable implementation PR.
- Do not mistake a nice contact sheet for deployable icon exports. Real PNG/ICO assets are separately produced.

### Art Gate B — Nino Guide + Encourage + Gold
Current overview sheets are **direction boards only**. Render and approve one full-resolution truly transparent pose at a time using approved original Nino as exact reference; check face/helmet/goggles/scarf/jacket/hair, clean alpha, thumbs/finger anatomy, accurate red scooter if included, consistent age and lighting. Do not use low-resolution crops as finished cutouts. Export optimized WebP with alpha for actual app; maintain clean source PNG.

### Art Gate C — one final Eilanden landscape
Final illustration must be a stand-alone 16:9 (at least 1200×675), no captions/labels baked into pixels, no false island silhouette, low-complexity UI negative space. Compare to Nino original scene, approve and measure load/standalone bundle growth before integrating. Course map always takes priority.

### Release 1.2 — Nino voice and first imagery (Codex; Hermes)
Implement only approved NOW matrix messages; do not leak geography hints during test/Gold. Add 2–3 character states and one chapter background in meaningful moments. Keep existing rewards and daily credit truthful. No new persistent child data unless essential. Run lint/test/build and real Safari QA.

### Release 2 — Italy learning adventure
Sourced item-specific feedback, assisted practice vs independent school test, map-side explanation after grading, optional typo second try in assisted mode; first postcard/passport reward if child wants it. A real learning trial takes precedence over large art production.

### Release 3 — collectible experience
Only if prior trials show voluntary re-use and learning remains strong: full postcard set, travel stamps, optional scooter cosmetics and subtle scene transitions. No random rewards, streak penalties, leaderboards or pressure tactics.

## Acceptance gate checklist
- [ ] Original Nino identity retained — no cross-scene drift (character and red scooter).
- [ ] Icon clear and recognisable at **60, 48, 32 px** and in Safari Add to Home Screen; standalone HTML still runs offline.
- [ ] Five-versus-eight reward text and missing SVG icon corrected.
- [ ] No new art moves or obscures geographic features / map clickable shapes.
- [ ] Original 45 items, point/write skills, 11 chapters and Gold remain unaffected.
- [ ] No false feedback: only actual pizza/gold/progress events narrated.
- [ ] Touch targets, keyboard, contrast, 200% text, reduced motion, 320px phone and iPad portrait/landscape checked.
- [ ] File size and embedded source assets measured, no runtime external requests.
- [ ] Hermes independent focused QA, owner signs off before merge or deployment.

## Artifact truth and repository status
The earlier chat delivered `topo-nino-art-prototypes-v1.zip`: image-generation **crops** and approved original references. They are **not** production-grade transparent cutouts or vector SVG. The newer `topo-nino-app-icon-v1.zip` has actual separate PNG/ICO variants generated from the user's original large Nino character, prepared **locally in the conversation**, not yet committed to GitHub or installed in the site. No live version has been updated by this design work.
