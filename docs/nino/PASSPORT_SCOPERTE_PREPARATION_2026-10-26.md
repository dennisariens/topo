# Scoperte 03–04 — isolated preparation; runtime blocked

Checked 26 October 2026. Branch `codex/passport-scoperte-preparation-20261026`.
Baseline: PR #47, `b111ed2abfed15c97106e3d755fcff33c704215f`.
The working spread is **not implemented**. The owner's stop/go instruction limits
work to isolated preparation while P0 integration or critical artwork QA remains
unsafe. This branch prepares a tested state boundary and exact integration handoff.
It adds no live UI, background, achievement counter, reward, asset or second passport.

## Reviewed PR stack

| PR | Exact HEAD | Integration status |
| --- | --- | --- |
| #29 pizza | `dcc474e8a9d1bc97559a3207b0a330423e128558` | Draft on #17; separate from #47 ancestry; physical lid art blocked. |
| #30 Discovery | `f67027d42202d1bd2a78f1d82dd02aa7fba41a91` | Draft on Schoolblad #27; inherited through #39/#40/#47. |
| #39 semantic selection | `fc8f5be4dc77c8b1adb71aae3931a1c134389cf5` | Draft on #30; scoped independent QA PASS, not full #38 audit. |
| #40 Focus Mode | `71b33fd973c7b650c63e7921af3e7bf6aab5f79f` | Draft on #39; physical Safari/OS keyboard pending. |
| #47 afternoon P0 | `b111ed2abfed15c97106e3d755fcff33c704215f` | Draft on #40; conditional owner-test candidate. |
| #48 art intake | `4eb9a5ae33550d789c56d5c01393145a148565aa` | Separate draft on legacy art branch; copy audited assets only after gates. |
| #42 Gold/journey docs | `75a1dedf3f8db973de9a3a481faff24fc7027057` | Docs-only sibling on #40; canonical product contract, not runtime. |

Bodies, comments and reviews were inspected. P0 order: #27 → #30 → #39 → #40 → #47.
Pizza #29 and art #48 remain separate. This preparation targets #47 to exclude
inherited P0 changes from its diff. Recheck the final app base after P0 acceptance;
this pin is a conditional candidate, not approved production. Never merge the
legacy artwork branch's app, package, geometry or engines.

## Exact stop/go blockers

1. [Issue #38](https://github.com/dennisariens/topo/issues/38) remains OPEN. Latest
   sequencing still requires the full 45-object Learn/Point/Write/Test/Gold ledger
   and persistent harness on the composed candidate, then independent QA.
   Existing scoped semantic tests do not complete that audit.
2. [PR #47's final review](https://github.com/dennisariens/topo/pull/47#issuecomment-6423005994)
   explicitly says conditional owner-test candidate, no release GO. Independent
   numerical execution was blocked; physical Safari/keyboard/VoiceOver pending.
   Clear with recorded P0 acceptance and an exact reviewed application baseline.
3. Chapter Gold sources exist at art commit
   `e4456f2fa43b53da4d3a03084cadcada8417f67d`, but independent production-alpha,
   small-size and export QA remains required. #48's 22-file allowlist has no Gold
   export. Clear with approved derivative/hash/dimensions and warm-paper/64–240px
   evidence. Source upload is verified; the source-release doc's older “NOT verified”
   upload statement is stale. Source presence does not clear production QA.

Isole is REWORK, but the latest owner assignment allows genuine completed-state
text without a stamp image. Clean folio absence has an authorized CSS parchment
fallback. Neither fallback clears the three blockers above. ARRIVO, postcards,
final Gold and other pages are outside this slice. No test server or learner data
was changed.

## Contracts inspected

At art branch revision `7052a67`:

- `docs/nino/PASSPORT_PAGES_03_04_PRODUCTION_DECISION_2026-10-26.md`
- `docs/nino/PASSPORT_FIVE_SPREADS_V2_SPEC_2026-10-26.md`
- `docs/nino/TRAVEL_PASSPORT_STAMPS_V2_HANDOFF_2026-10-26.md`
- `docs/nino/GOLD_CARTOLINE_V2_SOURCE_RELEASE_2026-10-26.md`

At #48 SHA above: `docs/qa/artwork-45/README.md`, `production-allowlist.json`,
`placement-poses.json`. At #42 SHA above:
`docs/NINO_JOURNEY_GOLD_STORY_2026-10-26.md`.
Latest production decision and owner Isole fallback supersede older background
and empty-outline suggestions. Open-book source has a baked postmark and remains
REWORK. Page concepts are visual references, never production backgrounds.

## Prepared state boundary

`scripts/passport-scoperte.mjs` accepts normalized `state.route` and existing
`ROUTE_CHAPTERS`; returns pages 3/4, canonical live titles, completion, Gold,
Dutch status and inspect/learn intent. Page 3: city1/city2/city3;
page 4: city4/islands/mountains. Direct record reads avoid `TopoRoute.record()`
which creates missing records. No counters, dates, rewards or persistence.
Gold requires `stage===3 && goldAt>0`: canonical restore already clears incomplete
Gold, with an additional presentation guard against inconsistent input.
Do not pass raw backup data or call restore/start/advance just to open the book.

The module is **not loaded by index.html or the standalone outputs**.
Tests use the unchanged real route engine and actual canonical title definitions,
with one synthetic item per chapter for bounded execution. These tests cover the
state boundary, not the full 45-target audit or browser functionality.

## Concrete integration plan after gates

Continue one implementation in this branch after updating its reviewed baseline.
Build shared BookShell → Folio → ChapterStampRow layers. CSS parchment, mirrored
gutter, live headings/labels, fine margin, outer-corner ornaments only. No empty
medal rings, preprinted stamps or concept background. Reuse rows for later pages.

Copy only these #48 allowlisted assets, verifying its hashes:

| Chapter | Path relative to assets/nino/travel-passport/ | Status |
| --- | --- | --- |
| city1 | stamps/exports/stamp-01-firenze.webp | warm-paper QA PASS |
| city2 | stamps/exports/stamp-02-roma.webp | QA PASS, preserve 768×512 proportions |
| city3 | stamps/exports/stamp-03-borghi.webp | warm-paper QA PASS |
| city4 | stamps/exports/stamp-04-liguria.webp | warm-paper QA PASS |
| islands | none | REWORK; completed text only |
| mountains | stamps/exports/stamp-06-dolomiti.webp | warm-paper QA PASS |

Cover: `book/exports/passport-closed-cover.webp`. None are copied here. Never
consume source PNGs or unaudited candidates as production alpha. Embed accepted
bytes in existing standalone bundling; no network, remote font or CDN.

Reuse #48's exact `topo-stamp-v1` FNV-1a32 lanes and frozen poses. Canonical field
160×152, uniform art fit 112×96, inset 12; transform whole field on resize.
Poses (angle°, x, y, pressure): city1 (-1.5,-10,0,even), city2 (-1.5,0,-6,even),
city3 (1.5,0,0,even), city4 (-1.5,-5,0,left-heavy),
islands (-1.5,0,-3,right-heavy), mountains (0,0,0,even).
No randomization, independent axis scaling or new texture. Pressure 98–100%,
opaque high-contrast fallback. Conditional Gold occupies separate side space.

Landscape: facing pages. Portrait/large text: one selected physical page (3/4),
preserved through rotation. Native controls >=44px; earned detail art >=160px.
Incomplete learning actions respect existing chapter locks.

Open only a presentation layer; preserve question, original answer node/value,
caret/direction, focus, camera, map scroll and window scroll. Close without calling
`mode`, `renderRouteHome` or lesson-start handlers: those reset question state.
Coordinate inert/focus management with Focus Mode reparenting. No earn animation
on passive render, reload or import. No reward mutation.

## Evidence and Hermes handoff

Logs: `docs/qa/passport-scoperte/{state-tests,lint,regression,build}.txt`.
`preservation.json` records unchanged application/engine/release bytes.
Exact commit and changed files are attached to the draft PR.

| Acceptance | Current result |
| --- | --- |
| Zero / one / six completed | State tests PASS |
| No / selected multiple / failed Gold; replay | State tests PASS |
| JSON reload through canonical restore, repeated read-only projection | State tests PASS |
| Isole completed without approved image claim | State projection PASS; UI not implemented |
| Landscape / portrait / rotation / desktop | NOT IMPLEMENTED / NOT TESTED |
| Close during partial answer; draft/caret/focus/map | NOT IMPLEMENTED / NOT TESTED |
| Keyboard / 200% text / contrast / reduced motion | NOT IMPLEMENTED / NOT TESTED |
| Rendered spread offline reload and bundled artwork | NOT IMPLEMENTED / NOT TESTED |
| Physical iPad Safari / VoiceOver | NOT TESTED |
| Screenshots | None: no new live UI to capture |

This is a blocker/state-boundary handoff, **not visual/functional QA readiness**.
After gates clear, complete one implementation and capture every remaining row,
then Hermes performs one independent review. No duplicate build, merge or deploy.
