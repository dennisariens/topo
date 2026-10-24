# Project state

## Release 1.2 candidate — owner art in the runtime

`hermes/topo-nino-visual-integration` is based precisely on Release 1.1 `a481317b33f5f6f55c179ee0fbfe6b211663be7b`, targeting `codex/topo-release-1-1-polish`. Six byte-verified WebP exports from owner art commit `047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d` are embedded in the self-contained app. Welcome, Guide, Encourage, Success, new earned Gold and actual Vespa Arrival follow real events. Gold pauses/replays never use the Gold pose; mixed rounds do not imply perfection. Existing artwork, both learning engines, geography, progress/reward schemas and print assets are preserved. Reusable chapter/postcard slots hide unfinished art without inventing unlocks. No app icon selected; art masters/branch untouched.

Both standalone downloads decode all six illustrations offline. Five viewport sizes, keyboard, reduced motion, resumed answers and real reward events have browser evidence. Candidate asset approval, physical iPad Safari/keyboard and real-printer acceptance remain outstanding. The narrow dev-only undici security update does not add runtime dependencies. See `RELEASE_1_2.md` and `assets/nino/RUNTIME.md`. No merge/deployment performed; stop at draft PR/owner review.

Verified 2026-10-23 for Release 1 integration. GitHub `dennisariens/topo` remains the source of truth. Integration is reviewable on `codex/topo-release-1-integration`; merge and deployment require owner approval. No deployment was performed.

## Canonical application

`index.html` is the self-contained Dutch Group 7 geography app, with all 45 stable learning IDs, reference codes and eleven groups/stops. Its three embedded scripts include the exact checked copies of `scripts/learning-engine.js` and `scripts/route-engine.js`. Original Nino panorama and scooter WebP bytes, coach, route layout, palette, icons and trip toast are retained. The frozen Work ZIP is historical transfer material, never an active second app.

## Integrated behavior

- Route stages: **Ontdekken → Aanwijzen → Namen schrijven**. Finishing writing opens the next stop. All completed stages remain replayable; optional gold requires correct pointing and writing for every item. Six-question pauses do not truncate gold queues (countries cover fourteen tasks).
- Free Point, Write and finite mixed tests retain group selection, mistakes, reveal/skip feedback and aliases. No question asks for a schoolcode. Codes remain reference metadata. Learn labels and Dutch prompts remain.
- Smart rounds select six weak, due or new point/write skills from unlocked content. Each skill has independent correct/wrong/streak/seen/due history, spaced 1/3/7/14 days. The knowledge passport covers all 45 places. Legacy aggregate history is preserved without inventing separate skill results.
- Results label the last six-question round separately from the full lesson totals; lifetime good count is distinct. For legacy in-progress saves without per-answer history, unavailable round scores are shown as unknown rather than invented; whole-lesson totals remain preserved. Daily goals count every accepted correct retrieval independently of pizza eligibility, including completed-stage/gold replays; answered-state guards prevent resubmission/reload credit. Goals roll over by local calendar date and reset with all-progress reset.
- Correct retrieval earns a slice, eight slices a pizza, every third pizza a Vespa destination. The meter always shows the current partial pizza, including after large lifetime totals. Original eight-wedge art is used on the route, in free practice and in a compact lesson meter; celebrations remain short, inline/nonblocking and reduced-motion aware. No postcards, customisation or additional currencies.
- Persisted stage/gold reward tokens prevent the same question minting rewards through correction fillers, reload, replay or old-save migration. Fresh review/adaptive/free practice sessions can earn rewards for new retrieval attempts. Schema-1 completed work is treated as already rewarded. Original pizzas/trips and completed writing/gold survive migration; obsolete code sessions close safely.
- Storage remains local under `topo-italie-v3`, with v2 reward migration. Progress JSON export/import from Work is retained; imports strictly validate supported nested route schemas 1/2 and their chapter/item/skill/session structures before confirmation or storage. Rejected imports preserve memory and localStorage unchanged; permissive startup recovery remains separate. No account or automatic cloud/device sync.
- Pizza reset changes only rewards; route reset clears route learning/gold while retaining earned rewards and the anti-replay token ledger; full reset clears rewards, mastery, mistakes, route and daily goal. Browser storage failures show an inline warning.

## Geography and interaction

See `MAP_SYSTEM.md` and `docs/geography/README.md`. The Work source-projected geometry is integrated: 27 point anchors, Natural Earth country/island/coast outlines and river centre lines; 36 source-backed target geometries and nine explicitly schematic mountain/region/sea zones. Vesuvius is east of Naples. Coordinates never move to enlarge interaction targets.

Points accept a 22 CSS-pixel radius around their real position. Overlaps open a numbered, neutral local map picker; Rome/Vatican keyboard trigger uses it too. The named explanatory Rome/Vatican inset is reserved for Learn/Discover. Microstate highlights use locator rings and a cropped map at the canonical position. Rivers have separate invisible 44 CSS-pixel strokes, retaining their original visual centre lines. Keyboard activation uses SVG-compatible dispatched events. The map ratio remains 890:1235; the school photo is separate at its original ratio, not a registered overlay.

## Printing and generated outputs

`generate-print.mjs` reads canonical items/geometry; no second geographic content source. Formats: reference, marked place → name, and named place → map location. Temporary V1… labels belong only to that sheet; they are not fixed schoolcodes to memorise. Editorial leaders keep labels clear of cities, volcanoes and microstates. Original photo remains an optional separate reference sheet.

`generate-pdf.py` renders the same vector paths and label positions with ReportLab. The booklet is **35 A4 pages**: contents, 33 group exercise/reference pages, original school-photo appendix. The photograph is not used as a coordinate overlay. Font discovery supports Linux DejaVu and macOS Arial. See README for Python requirements. Physical printer legibility is still an acceptance check.

`generate-preview.mjs` generates the static preview from all 45 canonical definitions; the running app replaces it with live layers. Build produces byte-identical standalone HTML downloads and `dist/index.html`, `dist/print.html`, `dist/printboek.pdf`. PDF source hash freshness is checked by tests/build.

## Verification and limits

Required lint/test/build pass; browser evidence and independent reproduction are in `RELEASE_1_INTEGRATION.md`, `HERMES_QA_RELEASE_1.md` and `visual/release-1/`. DOM coverage includes all stops/gold, legacy migration, reset scopes/daily goal, isolated skills, exact round results, microstate highlighting, neutral keyboard picker, river targets and reward idempotence. Work regression checks are maintained against the canonical app, including 27 projected anchors and 45 geometry hashes; static/live geometry equality covers all 45.

Chrome desktop, tablet-sized and phone-sized viewports were exercised, including adaptive reload on each answer, pointer overlap selection and screenshots. This is not physical iPad Safari verification. Nine areas remain schematic; raw upstream GeoJSON/versioned retrieval artifacts are not in the Work handoff, so retained source URLs, point excerpts and geometry hashes establish provenance/baselines, not an independent survey of every vertex. See map documentation for remaining limits. No production URL was tested or published.

## Hermes QA follow-up — QA-1 and QA-2 only

Fixed replay daily credit and strict nested-backup validation after the independent review of `6746a3079d594693dbf8e08702cdb3db42aa3d4d`. Targeted regressions: `scripts/qa-findings.test.mjs`; real Chrome reproduction: `scripts/qa-findings-browser.mjs`. Evidence is in `visual/release-1-qa-fixes/browser-results.json`. Physical iPad Safari and real printer acceptance remain outstanding; no merge or deployment performed.

## Release 1.1 polish — separate PR against integration

`codex/topo-release-1-1-polish` starts from PR #3 HEAD `9df498919cd6fa1a07aadd6a15e973b496a8b0fd`. All eleven chapter icons have explicit valid references (including Eilanden); stale five-answer pizza copy is removed. Current chapter and next preview remain open, while later and completed stops use native accessible disclosures with replay/Gold access. Mobile modes fit without horizontal clipping, and map provenance moves into **Over de kaart**.

Nino's selected NOW messages come from PR #6's three documents at `d746ac9d1f4cbc5e9c8b7b8544cdba396cf60f1d`, via a checked embedded resolver. First/return/resume, lesson starts, graded answers, round results, chapter/Gold/review messages reflect actual engine events. No new artwork, hints, spelling retries or postcards; no new save schema or reward rules. Learning engines, geography and printable assets are unchanged. Details, browser evidence and device/learner limitations: `RELEASE_1_1.md`. This work is reviewable, not merged/deployed.
