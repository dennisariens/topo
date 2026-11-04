# PR #71 — Hermes F1 navigation repair

Independent Hermes re-review: **OPEN**. Internal verification is not independent acceptance.

Starting PR head was checked through GitHub before work: `92f441e52c6b38550d5920dfbfc9a22310aec8f6`, unchanged from the owner’s last check. Independent source: [Hermes report at64216f6](https://github.com/dennisariens/topo/blob/64216f605e27bfef5cefd7bfbb7ab4b491c71595/docs/qa/hermes-nino2-final-71/README.md). That report remains unmodified.

The immutable candidate SHA is pinned in the PR #71 F1 handoff. This file is included in the tested implementation commit; a following documentation-only pin may name that implementation SHA without a self-referential commit hash.

Generated offline HTML: `output/html/TOPO-NINO-Computer-Release.html`, **35,710,604 bytes**, SHA256 **`8822e92e097d32bdc6b1588bee0d11ffc204020229def49709317a267e9afdc9`**.

## Cause and bounded repair

Reis called `mode('route')`, which discarded the free-mode session/current question; `renderRouteHome()` then cleared the question, map/art and answered state. Oefenen subsequently called `mode('learn')`. Choosing writing again generated a new question and cleared the original input. Hidden DOM text alone was insufficient proof of continuity.

Reis now shows the current journey as a temporary view. It retains the existing canonical state, sessions and original input node; only existing view classes are saved/restored. There is no second exercise state, new save schema or stored draft. The route-home renderer has a strict boolean presentation-only option that skips destructive cleanup and persistence. Its default behavior, including invocation as an event handler, stays unchanged. Oefenen restores the original view without calling a mode/task generator. First entry without a suspended exercise retains the original Learn fallback.

Accepted journey actions leave the temporary view through the existing route handlers. Canceled reset/lesson confirmations retain it. Result/pause screens can also be suspended and restored without deleting their original DOM or pause state. Reisboekje is unchanged.

The preservation adapter pins the new V2 JS hash and reverses only three exact renderer guard substitutions, each required exactly once. It does not broadly exclude changed engine code. No artwork mapping/metadata-audit fix is included.

## Verification

- RED: `regression-before.log` reproduces original F1 before the repair: write/current question becomes learn/null. `result-screen-before.log` and `cancellation-before.log` retain subsequent failing edge-case regressions before their fixes.
- GREEN: `regression-after.log`: four focused F1 tests pass. They are part of the existing seventeenth test program, so `npm test` still runs all17 programs and now includes these regressions.
- `release-check.log`: build, lint, all17 test programs, release source audit and map-picker preservation audit. `preservation.log`, `whole-file-preservation.json` and `scope-preservation.json`: complete baseline reconstruction and unchanged protected source/assets/print/dependency scopes. Standalone aliases are byte-identical candidate build outputs.
- `chrome-navigation.json` / `webkit-navigation.json`: generated offline file:// HTML, Chrome157.0.8103.38 and WebKit27.2, clean independent contexts at1500×1000,768×1024 and320×740, DPR2, reduced motion and simulated touch on tablet/phone. No injected questions or progress. Zero external requests or page/console errors.
- Real buttons/input/keyboard reproduce `Navigatieconcept`, including backward `[3,10,'backward']`, cursor `[5,5,'none']` and forward `[2,8,'forward']`. Two repeated Reis→Oefenen cycles assert the same question, mode, question mode, session, prompt, answer, selection direction, progress and exact localStorage bytes, plus visible quiz/input.
- Book opening/closing/paging, including opening it while on Reis, preserves the same exercise. One genuine correct answer earns nonempty score/reward progress before another navigation check. Point/Test/Learn mode round trips, explicit route start/resume, completed discovery-result suspension/default exit, canceled reset and canceled different-lesson start also pass.
- Before/after screenshots for the exact backward-selection case are retained per browser and width. The320px view was visually inspected. Native selection highlight is not painted while a navigation button holds focus; JSON verifies the retained native selection and its direction.
- Initial browser-driver failures are retained separately: Home did not move WebKit’s input cursor as expected; repeated paging hit the book boundary. Driver now uses actual ArrowLeft/ArrowRight selection and checks enabled paging. Assertions were not relaxed. An older external Playwright install lacked its matching WebKit binary; the existing matching external install was used. No dependency/lockfile change.
- A separate internal code reviewer found the canceled-action issue; after repair, it reported no further concrete findings and independently reran all four focused DOM tests successfully. This is not Hermes re-review.

Browser plugin not available; the requested installed Chrome/WebKit were controlled through external Playwright. Runtime dependencies remain unchanged. Node25.8.2/npm, existing jsdom installation.

## Reproduce and Hermes next action

```sh
npm run release:check
node scripts/audit-nino-v2.mjs
node --test --test-name-pattern=F1 scripts/focus-mode.test.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/qa-f1-navigation.mjs
QA_BROWSER=webkit PLAYWRIGHT_MODULE=/path/to/matching/playwright/index.mjs node scripts/qa-f1-navigation.mjs
```

Chrome defaults to the installed macOS Chrome; `CHROME_PATH` overrides it. `QA_F1_HTML` and `QA_F1_DIR` permit a different local candidate/output directory. Do not run historical pinned-HTML browser drivers against a new artifact without checking/updating their target checksum.

Hermes: checkout the exact candidate pinned in PR71, verify the HTML checksum above, independently repeat F1 and check the visible active question/mode (not only hidden input text), book continuity and untouched progress/scores/rewards. Return exact-SHA PASS/REWORK. **Independent re-review remains OPEN until Hermes responds to this new candidate.**

## Separate open findings and owner decisions

- **OPEN:** Hermes’ artwork-audit semantic blind spot (swapped stamp roles or incorrect folio metadata can pass the maintained adapter). This F1 repair does not fix it or claim that a green preservation audit closes it; Hermes separately found the current artwork mapping correct.
- **OPEN owner decisions:** native1086×1448 folio resolution at≤543CSS px/page/DPR2, the reconstructed Venezia edge versus the unavailable original reviewed matte, and final visual/release acceptance.
- Native Safari, physical iPad, OS keyboard/IME/VoiceOver, OS favicon cache and real printing remain untested. WebKit viewport testing is not physical-device acceptance. This focused repair does not claim a new natural all45/11-chapter playthrough; full existing automated progression/reward coverage was rerun.

No merge, deployment, release publication, existing approved-download replacement or source-master modification. Generated HTML changes are confined to the isolated PR candidate.
