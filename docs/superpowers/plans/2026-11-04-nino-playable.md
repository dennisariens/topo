# NINO 2.0 playable candidate implementation plan

> **For agentic workers:** use superpowers:subagent-driven-development for owned modules; integration remains one candidate in PR71.

**Goal:** Deliver the five owner-requested surfaces together in the existing offline learner, retaining F1, geography, lesson/reward engines and saves.
**Architecture:** Existing standalone HTML + embedded presentation modules. Reuse PR29 pizza module/atlases and approved C+/passport art. Optional independently versioned local profile is separate from authoritative progress, included in backups with strict validation. Passport remains derived from real stage/gold/trip state; demo is an explicit import file only.
**Tech Stack:** Existing vanilla JS/CSS, inline data assets, Node/jsdom and external Playwright Chrome/WebKit; no dependencies or deployment changes.
**Spec:** Owner request 4 November; authoritative #20/#21/#28/#68/#67/#8/#65, PR29 at dcc474e8. Base PR71 8c25b7a4592dafdc0003c0021c2a9fe375d68a34.

## Global constraints
- Preserve45 objects,11 chapters, both styles, schoolblad, Rome/Vatican, engine/score/save/reward rules and F1 original input/selection.
- Existing source art is immutable; no generated substitute. Report missing approved header-icon source precisely if unavailable.
- Favorite pizza is optional cosmetic identity; reward order is Margherita/Salami/Quattro,8 eligible answers/pizza,3 pizzas/trip.
- Desktop/iPad landscape: spread when space permits; portrait/phones: one readable folio. Existing folios/Venezia contour shown for owner review.
- No true hinge/expanded scooter animation. No merge/deploy/release publication or existing approved-download replacement.

## Tasks
- [x] Pizza owner: reuse PR29 assets/module; supply explicit integration substitutions + inverse audit, targeted tests of all flavors0–8, immediate zero rollover, event ordering/reset/replay. No editing shared index/V2/build/package.
- [x] Profile owner: safe optional name24graphemes/three cover colors/three favorite choices; skip/edit/reload/legacy behavior; independent schema1 profile and strict backup hooks, targeted tests. No shared index/V2/build/package edits.
- [x] Integrator: approved cover/folio/chapter assets; coherent continuous11-stop route; expand book into cover, summary, stamp folios, destinations/postcards; responsive navigation/buttons and single scooter. Add missing-source evidence. Preserve canonical state and F1 while integrating modules/hooks.
- [x] Per-change focused red/green checks. Then build once for broad17-program chain + new targeted programs, lint, strict bounded whole-file/source audits. Do not rerun broad suite for unchanged evidence/docs.
- [x] Offline browser QA at1500/1180landscape/768portrait/390/320 in Chrome and WebKit: initial onboarding/skip, genuine first chapter/discovery+point+write,8-answer pizza rollover, personal book, F1, buttons/overflow, earned-only projections, backup/reload and explicit demo import. Visual comparison to existing approved references via screenshots/view_image.
- [x] Produce separately named candidate offline HTML + clearly labeled demo JSON, local clickable link for direct opening plus immutable PR source links; keep existing approved releases untouched. Pin final SHA/checksum/results in PR71 and handoff; independent Hermes review OPEN and owner visual acceptance requested only after candidate exists.

## Review focus
Canceled profile/lesson/reset must not lose active draft; existing progressed users must not be forced through onboarding; cosmetic choice must not change reward flavor; imported huge totals/zero slices must show correct completed flavor; portrait folio content must remain legible without covering controls.

Completed candidate checks: see docs/qa/playable-20261104/README.md. Requirement gap explicitly retained: approved large header app-icon source unavailable. Book color is a UI accent around original red approved cover, for owner review. Release/owner/Hermes approval stays OPEN.
