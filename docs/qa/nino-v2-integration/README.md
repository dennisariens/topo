# NINO 2.0 integration candidate / Hermes handoff

Codex implementation and internal verification. **No independent PASS or owner release GO is claimed.** Review the exact full PR-head SHA pinned in the integration PR description, rather than main or another candidate. Runtime implementation commit: `df775042cbb24884d675ba0b70607813aa5e9090`; subsequent evidence changes must retain the artifact hash below.

Standalone: [`TOPO-NINO-Computer-Release.html`](../../../output/html/TOPO-NINO-Computer-Release.html), 35,709,206 bytes. SHA-256: `352ddd742436ac4f5a5a8a82374f742788952219e42b47d87d83536319183d53`.

## What to review

One PR61-lineage learner, with exact PR70 favicons/exports, PR69 C+ CSS and the authorized #68/#21 navigation/passport increment. Primary Reis / Oefenen / Reisboekje navigation retains contextual exercise/map controls. The book is a native modal over the current lesson; completion, Gold and destinations are read from canonical state. Desktop has facing pages; narrow screens have six single pages with visible and keyboard paging. Earned stamps have a 240px detail view. Gold seals, static Pisa pizza boxes and postcards use original approved exports and real earning conditions. Postcard backs contain no fabricated messages/dates. Original PR70 folios are used on the opening spread; Venezia unlocks after the third real Vespa trip. Both retain the technical caveats below.

The entire PR70 HTML is recovered byte for byte after removing the exact verified C+ and V2 presentation additions: [preservation.json](preservation.json). The learning/route engines, 45 target definitions, geometry, neutral chooser, print and save/migration logic are unchanged. The original generated aliases remain required by the repository packager; they are identical downloads, not competing implementations.

## Evidence index

- [Baseline lineage and protected hashes](baseline.json); [baseline gate log](baseline-check.log).
- [Final build, lint, all 17 test programs and release/geographic audits](delivery-release-check.log); [whole-file preservation audit](preservation.json).
- [Final Chrome responsive results](browser/chrome-results.json): desktop1500×1000, tablet1024×768 /768×1024, mobile390×844 /320×740; file://, offline contexts, zero external requests/unexpected errors, modal/keyboard/touch/caret/question/save checks. Explicit state fixtures cover all11 stamps, Gold gating, reset-like projections, repeat trips and postcard front/back; **fixtures are not naturally earned play**.
- [Final all45 ledger](delivery-integrity/ledger.json) / [raw log](delivery-integrity.log): both map styles, correct/wrong pointer trials, writing, wrong-Gold gate, duplicate-credit/reload checks. These are per-question fixtures, not a complete natural-route all45 playthrough. DOM tests separately cover all11 chapters.
- [Real-play report](played/chrome-internal-playthrough.json) / [raw log](delivery-played-serial.log): Discover→Point→Write first chapter, actual neutral-chooser taps, no premature Gold, genuine Gold, wrong Gold, 8→pizza and24→3pizzas→trip, real JSON export/import and reload. The driver is adapted from Hermes evidence `827ebaf`; this run is **Codex internal evidence**, not Hermes acceptance.
- Screenshots: [desktop journey](browser/chrome-1500-journey.png), [tablet practice](browser/chrome-768-practice.png), [390px journey](browser/chrome-390-journey.png), [320px passport](browser/chrome-320-passport.png), [earned stamp without Gold](played/chrome-passport-earned-chapter-no-gold.png), [earned Gold](played/chrome-passport-genuinely-earned-gold.png), [first earned arrival](played/chrome-passport-earned-first-trip.png).
- [Rome/Vatican source-SVG fidelity](rc-selection/results.json) / [raw log](delivery-selection.log): Learn/Point/Test/Gold, both neutral number orders, Discover lens and320px multiway chooser.
- [Corrected measured artwork inventory](../nino-v2-closure-67/artwork-manifest.json): source availability, actual delivered files and runtime embedding reported separately. D1 archival open-book master excluded, with its real dimensions and corrected dependencies. D2 separate totals retained. Embedded availability is not proof that every earned state was naturally played.

Intermediate failing logs remain for transparency. One playthrough load raced the packager rewriting the HTML; the recorded failed attempt was rerun serially after the release checks completed. The final320px Gold check requires a rendered seal width of at least240CSS pixels; its narrow-page inset and the browser’s default dialog width limit were corrected; the diagnostic measures242CSS pixels at320px. The later folio render check also caught a CSS background failure; ordinary decorative image elements replaced the background approach, with decoded dimensions and rendered bounds asserted. The initial build failed on a presentation CSS ordering issue, missing source-only chapter files and a wrong static-pizza path; these were corrected. The first DOM run exposed unavailable matchMedia; responsive logic now uses the ordinary viewport width. The inherited browser driver needed the new Oefenen entry before selecting a mode. Assertions were preserved. Old pre-final evidence directories are historical attempts; only the final paths above establish this candidate.

## Remaining gates and scope limits

1. **Hermes independent exact-SHA QA remains required.** Codex does not self-approve it. Owner design acceptance and explicit release GO remain required; no merge, deployment, release promotion or approved-download replacement.
2. **Hermes C1 / native folio caveat:** the current mission authorizes bounded integration of existing PR70 exports. Native folios remain1086×1448; runtime width is capped at543CSS px/page and tested atDPR2. Exact source images retain aspect ratio; no1536×2048 native master or upscaling approval is claimed. The scenery/ornamental postmarks are decorative paper art, not earned travel stamps. Final owner visual acceptance remains separate.
3. **Hermes C2 / contour caveat:** the explicitly requested Venezia integration uses the exact PR70 tight reconstructed scalloped export. The original painting is unchanged. Exact identity with the unavailable owner-reviewed raster matte is not claimed; final owner contour acceptance remains open. C3 integration scope is authorized by the current owner mission. No artwork closure or independent acceptance is self-approved.
4. **WebKit NOT TESTED:** installed Playwright requires webkit2248; installation explicitly fails with “Playwright does not support webkit on mac13.” [Attempt log](webkit-responsive.log). Chrome viewport/touch simulation is not physical Safari/iPad testing. Native Safari, physical iPad, IME/VoiceOver, OS favicon cache and real printing remain untested.
5. True Pisa hinged-lid animation stays OPTIONAL DEFERRED. Static approved boxes are active in the earned passport. Optional personalization/page-flip/swipe polish is not added; native modal controls and keyboard paging work.
6. Geographic correctness is preserved against pinned source geometry and existing audits, not a new GIS survey. Decorative passport maps/stamps never become assessment geometry. The existing schematic mountain/region/sea extents and finite browser sample limits remain documented in the baseline.

## Reproduce

Use Node24.15.0 and `npm ci`; Playwright tooling is external to the runtime dependency tree. Browser plugin was unavailable. The HTML requires no server, packages or network.

```sh
npm run release:check
node scripts/audit-nino-v2.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/qa-nino-v2.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/Chrome node scripts/qa-nino-v2-played.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/Chrome \
 QA_INTEGRITY_DIR=docs/qa/nino-v2-integration/delivery-integrity/ node scripts/qa-computer-release.mjs
```

Additional artwork evidence: [native folio spread](browser/chrome-native-folio-spread.png), [earned Venezia (explicit state fixture)](browser/chrome-earned-venezia-fixture.png).

Use fresh browser profiles and file paths. Existing browser-local saves do not automatically follow a moved HTML or another browser; use the preserved JSON backup/import controls. Production authorization remains with the owner.
