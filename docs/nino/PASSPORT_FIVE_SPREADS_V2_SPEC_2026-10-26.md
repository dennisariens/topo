# TOPO / NINO — Il mio viaggio in Italia
## Passport V2 — FIVE SPREADS / TEN INTERIOR PAGES — OWNER DESIGN CONTRACT
**Date:** 26 October 2026
**State:** design specification, **NOT implemented**. Original stamp/book and Gold/postcard art sources have been verified in Git; source presence does not imply alpha, geography, or app QA approval. 10 of 11 stamps have an inspected safe derivative in Hermes PR #48; ISOLE and the open-book base require rework.
**Branch:** `art/nino-travel-stamps-v2-20261026`
**LATEST PRODUCTION DECISION (26 Oct):** [Pages 03/04 layer-based implementation contract](PASSPORT_PAGES_03_04_PRODUCTION_DECISION_2026-10-26.md) is authoritative for stamp-page layout and QA. Recently generated 03/04 full-page illustrations are style references, **not** ship-ready backgrounds. No additional full-page renders required for 05–10 unless a specific missing isolated decorative asset is proven.
**Companion canonical product contract:** `docs/NINO_JOURNEY_GOLD_STORY_2026-10-26.md` on `docs/nino-gold-journey-roadmap-20261026`. Read it before changing app logic; this document complements rather than replaces that contract. See issues #21 (passport), #41 (stamp imperfection), #20 (optional personalization), #43 (source assets).

## 0. Outcome and hard boundaries
Build one openable, tactile, **real** Italian travel journal from the approved burgundy leather cover and cream vintage-paper aesthetic. It is opened from any lesson without resetting draft answers or camera; entries reflect ACTUAL engine state. No additional quiz targets, currencies, lessons, mandatory mini-games or fabricated visits.

One physical cover + **5 facing-page spreads / 10 interior pages**; pages are living overlays on a reusable blank folio template. Do NOT generate 10 flattened rendered pages, fake stamped earned states, or bake name, profile, Gold or dates into artwork. Original approved cover and open-book images are reference/source art. If open-book pixels contain old baked page contents, do not present them as blank base or destructively inpaint without visual owner review.

The split is deliberate: regular stamps need 4 pages because 11 mixed shapes (circle, oval, postal rectangle) would be crushed on a single right-page grid.

## 1. Definitive information architecture

| Spread | Physical pages | Purpose | Slots / dynamic content |
|---|---:|---|---|
| 1 — Il mio viaggio | 1 left / 2 right | Personal profile + honest progress | LEFT: approved Nino portrait, optional nickname/cover theme/favorite pizza, onboarding-start text. RIGHT: completed chapters /11, actual Gold /11, eligible pizzas and actual Vespa-trip count; compact journey progress |
| 2 — Le mie scoperte | 3 left / 4 right | Chapter stamps 1–6 | p3: 01 Firenze (`city1`), 02 Roma (`city2`), 03 Borghi (`city3`); p4: 04 Liguria (`city4`), 05 Isole (`islands`), 06 Dolomiti (`mountains`). **3 generous positions per page** |
| 3 — Il viaggio continua | 5 left / 6 right | Chapter stamps 7–11 | p5: 07 Etna (`volcanoes`), 08 Toscana (`regions`), 09 Confine Italia (`countries`); p6: 10 Mari (`seas`), 11 Fiumi (`rivers`). Final p6 area is **decorative vignette** (no ring, number, empty 12th chapter, or Gold placeholder) |
| 4 — Le mie cartoline | 7 left / 8 right | Growing cultural postcard collection | 4 approved first concepts: Sicilië, Sardinië, Napoli & Vesuvio, Venezia; 2 card pockets/page for preview, a focusable magnified front/back card; future cards through scroll/pager inside collection, **not extra book assets** |
| 5 — La grande avventura | 9 left / 10 right | Actual Vespa journeys + meaningful finale | p9: chronological visits and ARRIVO impressions, repeated itinerary renders using scroll/pager. p10: final Gold presentation/progress. Before 11/11 Gold: calm non-earned outline/progress copy; at 11/11: bespoke `ESPLORATORE D'ORO · ITALIA` seal |

### Chapter-order source of truth
`city1, city2, city3, city4, islands, mountains, volcanoes, regions, countries, seas, rivers`. Keep this exact order and ID mapping. The display label for Italy/stamps may be Italian, accessible action is Dutch.

### Per-chapter slot behavior
- `stage < 3` -> clearly empty slot + label `Nog te ontdekken` / chapter name, **no tinted preview of earned imprint masquerading as earned**; an illustrated neutral placeholder frame is allowed if not stamp-shaped. Action -> continue lesson.
- `stage === 3` -> actual approved stamp asset, stable mildly imperfect hand impression from #41, accessible label `[Hoofdstuk] afgerond`; action -> enlarge stamp / revisit.
- `goldAt > 0` -> **small Gold seal associated with that exact chapter** beside (not obscuring) its genuine ink stamp. Can be earned only from existing flawless chapter Gold test. Not a twelfth slot.
- Gold fail/replay/reload does not grant any new stamp or animation.
- Chapter stamps continue to be viewable even after a different stage/quiz is active.

### ARRIVO & finale, distinct achievement classes
- `progress.trips` drives real chronological Vespa arrivals via established cyclic Rome → Florence → Bologna → Venezia → Milano → Genova → Napoli → Rome ...; starting Rome is departure, not an earned ARRIVO.
- A trip increments only via genuine existing 3-pizza sequence (8 eligible correct for each Margherita → Salami → Quattro Formaggi; then Vespa). Repeat visits are labelled returns; no invented trip date and no ceiling at seven.
- ARRIVO is a **separate travel imprint**, not a chapter stamp, Gold stamp or 46th map task.
- `finalGold` is **derived** from `goldAt > 0` for all 11 canonical chapters. Do not persist a competing boolean. Completing all 11 chapters alone is not final Gold. Before unlock p10 shows honest `X/11 gouden hoofdstukken` without counterfeit golden art.
- Final gold concept is a one-off sovereign Nino fictional travel-award seal, not a duplicate of 11 small chapter Gold overlays. **Two owner-selected Gold original source files are now in the art branch**, with independent technical alpha/export and UI QA still required.

### Personalization & postcard rules
- First name/nickname, `favoritePizza` (Margherita / Salami / Quattro Formaggi / none) and optional approved cover theme are cosmetic; no reward mutation.
- Keep favorite-pizza identity visually separate from **earned flavor** and pizza counter.
- Postcards are cultural souvenirs, NOT grades. **Proposal for a grounded pilot, not new reward economy:** Sicilië and Sardinië available after actual `islands` chapter `stage===3`; Venezia when actual recorded Vespa arrival at Venezia, Napoli & Vesuvio at actual Napoli arrival. If existing implementation already defines postcard eligibility, keep it and reconcile before changing. Do not show cards as earned prior to the relevant event. Future cards need explicit requirements and owner review. Unlocked cards may be revisited freely without credit.
- The 4-card grid is an editorial view, future collection can scroll/paginate. User can flip enlarged postcard; any written messages are authored interface text, not image-generation text.

## 2. Visual system — LOCKED
- Original burgundy leather cover, subtle old-brass travel compass motif and existing vintage cream-page feel remain unchanged. Nino identity: curly dark hair, green pilot cap/goggles, blue shirt, red scarf, brown backpack, red Vespa.
- Original V2 approved ink stamps **must be used** (not regenerated) in their varied shapes/inks: Firenze terracotta round; Roma red oval; Borghi sepia chamfered; Liguria red postal perforations; Isole terra-red+blue; Dolomiti brown oval; Etna sepia oval; Toscana muted olive oval; Confine Italia burgundy/sepia rounded rectangle with **single border marker and no road signs**; Mari vintage blue postmark; Fiumi warm rust circular.
- Keep stamp masters pristine; stamps rendered as translucent ink overlays, never opaque white or cream stickers. Source album QA warning: Roma red exterior, Toscana olive gradient, Confine Italia checkerboard, others with pale fill. Hermes PR #48 independently inspected and allowlisted safe exports for **10/11 stamps**, while ISOLE geographic placement is **REWORK**; original full stamp masters are never treated as ready-to-overlay transparent ink by default.
- Slot layout feels collected, not perfect digital cards. Use #41 deterministic placement: mostly ±1–3° rotation, extremes ≤ ±6°, modest x/y shift within **slot padding**, asymmetrically varied ink pressure (approved Hermes #45 placement proof uses **98–100%**, because protected label masks are not supplied). Never randomize on rerender/reopen or apply effects to raw masters.
- Chapter Gold: smaller warm brass/gilt mark beside relevant ink. Final Gold: bespoke, separate larger authentic foil embossed award; no excessive neon particles, stars shower, UI casino vibe.
- Postcards are physical paper souvenirs with corners/holders. Four artwork fronts and one reusable reverse (no generated personal data/text). NO map-edited photo used as an assessed geography source.
- Page details: subtle borders, worn corners, light thread/paper texture; no illegible dense miniature type. Decorative vignette on p6 is clearly not a reward position.
- Default titles/UI text render via HTML/CSS layers for Dutch readability and accessibility; no baked name, date, score, progress, control, navigation or optional content in imagery.

## 3. Asset architecture — one blank folio, not 10 flattened pages
1. Reuse approved closed cover master unchanged.
2. Derive/prepare **one blank interior page / folio art master**, portrait aspect 3:4, 1536×2048 or better, matched parchment/binding visual language, no titles, labels, slots, stubs, stamps or objects. May be reused for left/right with mirrored subtle side shadow; backgrounds and spine/binding supplied as shell CSS/shared art.
3. Page corner/paper texture and optional small ornamental vignette can be lightweight authored CSS/SVG. If current open-book master has baked UI content, do **not** simply use it as dynamically empty pages.
4. All stamp masters/Gold/postcards separate alpha assets; independently verified before commit. Use safe CSS `object-fit:contain` and per-slot bounds. Text, date, passport marks dynamic HTML.
5. Suggested paths (proposed, do not treat as existing): `assets/nino/travel-passport/book/masters/passport-blank-folio.png`, `.../book/exports/passport-blank-folio.webp`, `.../book/qa/folio-paper-and-binding.png`. Passport existing masters and manifest from issue #43 remain as documented.
6. Two iPad views are the **same component** with presentation changes, not separately painted screenshots.

## 4. Accessibility, device behavior and interaction
- iPad landscape / desktop: genuine facing-page spread. Portrait / phone: show one readable page at a time, with explicit back/forward and spread indicator. Do not shrink ten-page book to microscopic double-page portrait.
- Every spread has persistent Next, Previous, Close controls with ≥44×44 CSS px touch targets; keyboard arrow only when appropriate (don't hijack typing). Optional reachable book contents index; chapter stamp tap enlarges art with clear close/back.
- Book can open from every mode while an answer is partly typed; closing resumes exact question, draft, caret, focus, map camera and scroll. No changing question or auto-grade while book is open. Preserve same canonical grading/input nodes; interoperate with the iPad Focus Mode from PR #40.
- Avoid trapping/scaling text at 200%; focus managed on open/close; aria labels for 11 earned/unearned, Gold status, ARRIVO travel, cards and unlock provenance. Respect reduced motion and high contrast; page turns are decorative ≤ 250–450ms and immediately skippable, and static when reduced motion. No audio requirement.
- At 320px phone, prefer accessible linear single page and drawers; never partially hidden next/close actions. On orientation switch preserve current page/index.
- Offline HTML builds stay entirely self-contained and byte-identical exports where required; no remote fonts, CDN or network traffic.
- Book should show a page number/spread name and **persistent chapter index**. No impression of 12 numbered chapters.

## 5. Navigation/state contracts for Codex (implementation gated)
- Book is a **read-only projection of current canonical state**. Avoid new achievement persistence, local storage schema forks or shadow progress.
- Existing chapter records `stage`, `completedAt`, `goldAt`; existing pizza/eligible answers/trip state authoritative. All 45 official targets unchanged, school codes remain not graded.
- Passport opening is non-modal to the learning engine's state; it may be an accessible dialog visually, but no activity rerun or camera recenter on entry/exit.
- Continue list/scroll for potentially unbounded trips. Do not show fictitious ARRIVO for travel stop zero. Real dates only when recorded.
- Page selection stable through orientation and reload if reasonable; don't persist identity/location unnecessarily.
- Printing/export if present must present accurate earned states; no private learner names baked into assets.
- Mark source filenames/version/hash in one manifest; fallbacks for missing art should not fabricate stamps.
- Do not merge source artwork directly into working map branches. Integrate as a bounded passport PR stacked atop a known verified integration baseline, only **after** issue #43 source binary push+QA.

## 6. Architecture & responsibilities
**ChatGPT Design:** system decisions, blank folio source art, Gold master direction, postcard art pilot.
**Codex:** one functional passport implementation with actual canonical state, responsive page template, deterministic stamp transforms, iPad interaction + offline bundling; no new game reward logic.
**Hermes:** independent source review, accessibility/performance/alpha/geographic QA and real-device test plan; no duplicative parallel implementation.
**Owner:** final visual approval; physical iPad Safari acceptance; explicit authorization before merge/deploy.
PRs #29 pizza and #40 iPad Focus Mode and #30 atlas are in-flight: do not rework their code, copy or rebase without a focused integration plan.

## 7. Definition of done (mandatory evidence)
- [x] Original art source pack verified in Git: 11 original masters, 2 original book masters, 11 QA candidates, manifest. **Separate alpha/geography QA still open for ISOLE and book base**; do not confuse source presence with ship approval.
- [ ] Blank folio owner-approved against original cover/open-book identity; 1 source master, high-res export, clean alpha/paper; avoid full-screen generated mockup masquerading as master.
- [ ] All 5 facing spreads and 10 single-page portrait views tested with zero to eleven earned chapter stamps and 0/11 to 11/11 genuine Gold. No 12th phantom slot.
- [ ] Three stamps per page can fit red/blue ISOLE and wide LANDEN without clipping/binding intrusion; p6 decorative space clearly non-achievement.
- [ ] Read-only chapter and travel state survives offline/reload/backup-import; no duplicate Gold, ARRIVO, postcard, pizza or chapter credit.
- [ ] Infinite/repeated trips paginate/scroll, departure Rome not marked as arrival, no fabricated dates.
- [ ] Four postcards front/back/pockets accessible and truthfully locked/unlocked by verified source events; favorites don't unlock prizes.
- [ ] Portrait/landscape iPad (physical Safari gate), desktop, 320px, split view/keyboard, VoiceOver, reduced-motion, 200%-text tests with screenshots and findings.
- [ ] No hot paths touched in the 45-point map, true source hitboxes or Gold grader; regression smoke tests documented.
- [ ] QA original and derived image masters at full/120/96/64px and on warm cream paper; contrast, baked checkerboard/white/paper checked, no sticker look.
- [ ] New Gold / postcards separately signed off by owner; no fake runtime art or abandoned extra concepts.
- [ ] Owner-approved Git PR / no auto merge / no deploy.

## 8. Artwork batches — gated for efficient production
**A — reusable blank folio master (FIRST).** Single independent portrait paper page, no content. Owner approves texture, margin, spine-side lighting and match to existing approved burgundy passport.
**B — optional presentation proof (NOT production asset).** One five-spread overview using exact masters, 3 stamp slots/page, real dynamic overlays indicated; only after blank folio A approved. Render depicts a demonstration state and labels it as such.
**C — Gold.** Small chapter-gold motif and separate end-of-all-11 Gold artwork; distinct functional sizes/states, not eleven unique originals.
**D — Postcards.** Reuse/verify original benchmark first, four approved illustration fronts then **one** reusable reverse, not eleven speculative new cards.
**E — Final art+UX QA and one focused Codex handoff.**

For future implementers: this is a **design & integration contract**; do not claim done without real source commits, QA logs and physical acceptance.
