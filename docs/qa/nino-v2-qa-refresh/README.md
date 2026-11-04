# Current handoff superseded by Hermes F1 repair — 4 November 2026

Use [the F1 handoff and current HTML checksum](../f1-71/README.md). Tested implementation/evidence SHA: `41701bcb659825796a319f9571a15e74daf2d0b4`; final evidence-only PR head is pinned in PR #71. Independent Hermes re-review **OPEN**. The old target/checksum and runtime-byte-identity statements below are historical only. Artwork-audit warning and owner folio/Venezia/final visual decisions remain OPEN.

---

# NINO 2.0 — current exact-artifact QA / Hermes handoff

## Candidate and verdict

Tested runtime/source commit: `df775042cbb24884d675ba0b70607813aa5e9090`.
This evidence update changes QA/docs only. Concurrent evidence-only commit d6bb83753a96755908e3a08e2c7473e842d8f4ae and2c52f121b853d1d8a46555d725ef79c97e0bf85b were retained; no runtime/assets/scripts changed there. The final evidence commit is pinned in PR #71; its application bytes must remain identical to that tested commit.

Standalone `output/html/TOPO-NINO-Computer-Release.html`: **35,709,206 bytes**, SHA256 **`352ddd742436ac4f5a5a8a82374f742788952219e42b47d87d83536319183d53`**.

**Codex internal checks PASS. Release verdict REWORK / independent Hermes QA OPEN.** No Hermes execution channel is connected in this session; this is a ready-to-run handoff, not an independent acceptance claim.

This supersedes the stale target `de6820316f51b20a7f21703f59fe138392c98707` and its older HTML checksum. Native folios and earned Venezia ARE now integrated; earlier statements that they are held do not describe this candidate. Owner acceptance remains open.

## Current evidence

- `current-release.log`: build, lint and all17 test programs PASS; historical artwork commit was initially absent, so the command stopped at the release audit. After fetching exact commit047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d, `current-audits.log` records both remaining release/geographic audits PASS. The initial failure is retained; no assertions were weakened.
- `current-preservation.json` / `current-preservation.log`: entire PR70 learner recovered byte-for-byte after removing only verified presentation blocks; identical standalone aliases; D1 archival book excluded with real dimensions and no generic folio dependency; D2 separate availability/delivery/runtime counts.
- `chrome-results.json`, `webkit-results.json`: actual offline file:// Chrome156.0.8078.80 and WebKit27.2, 1500x1000,1024x768,768x1024,390x844,320x740, DPR2, reduced motion, simulated touch; no external requests/errors. Folios retain1086:1448 ratio and <=543CSS px/page; 320px final Gold width >=240; modal keyboard/paging/focus and answer/caret/save preserved.
- `integrity-summary.json`, `integrity-ledger.json`: all45 in both styles;180 correct pointer,90 wrong pointer,180 writing trials; wrong-Gold and reload. These are per-question fixtures, NOT a naturally played all45 route.
- `played.json` / `current-played.log`: actual first-chapter Discover/Point/Write, earned stamp, true Gold, wrong-Gold rejection,8 correct→pizza /24→3pizzas→trip, real exported JSON imported into fresh storage and reload. Driver reuses Hermes tooling; execution is Codex internal.
- `scripts/qa-nino-v2.mjs`: explicitly labelled state fixtures include trips2 and3, asserting postcard count before/after Venezia threshold. Later stamps, final Gold, destinations and postcard cycles are fixtures, not naturally earned play. First-trip earning is separately played above.
- Full screenshots retained in the integration browser evidence; supplemental320px Chrome/WebKit captures accompany this refresh. Mobile folio and desktop Venezia captures visually inspected; this is not owner artwork acceptance.

## Hermes task

1. Checkout the final evidence SHA pinned in PR71, verify the HTML SHA256 above and no runtime diff versus tested commit df775042.
2. Independently rerun release:check, preservation, responsive, actual-play and all45 checks. Review D1/D2 relative to Hermes report `827ebaf313509dde70a2c79ace4cbf3e9cb3ccdc` (tested PR70 `2a9dda3d3d8ec567687bc3b61bf9cbde645c752c`).
3. Focus:320px dialog/Gold, folio cap/aspect, Venezia absent at2/present at3 trips, canonical rewards, repeated Oefenen/draft/caret, book open/close, save/import/export and Rome/Vatican.
4. Return exact-SHA PASS/REWORK with independent evidence and remaining owner gates. Do not become a second implementer.

## Reproduction

This run used Node25.8.2, npm ci --ignore-scripts and an existing external Playwright installation. Browser plugin unavailable; regular Playwright used. Chrome initially blocked by local process restrictions; authorized retry succeeded. For a single-branch clone, fetch historical artwork commit with `git fetch origin 047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d` before release:check. No dependency/lock/runtime changes.

```sh
npm ci --ignore-scripts
npm run release:check
node scripts/audit-nino-v2.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/qa-nino-v2.mjs
QA_BROWSER=webkit PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/qa-nino-v2.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/Chrome node scripts/qa-nino-v2-played.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/Chrome QA_INTEGRITY_DIR=docs/qa/nino-v2-integration/current-integrity/ node scripts/qa-computer-release.mjs
```

## Open gates

- Independent Hermes exact-SHA review OPEN. Codex tests do not close it.
- Owner native folio-resolution exception (1086x1448, <=543CSS px/page atDPR2), reconstructed Venezia contour acceptance/exact reviewed matte, and final design acceptance remain OPEN. Integration itself does not imply acceptance.
- Native Safari, physical iPad, OS keyboard/IME/VoiceOver, OS favicon cache and real print NOT TESTED. WebKit PASS is not native Safari acceptance.
- True Pisa hinge OPTIONAL DEFERRED; static boxes integrated. Geography preserved against pinned baselines, not independently GIS-certified.

No merge, deployment, release publication, existing-download replacement or source-master changes.
