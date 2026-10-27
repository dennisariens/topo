# Hermes independent QA — PR51

## Verdict: PASS for offline computer delivery / Chromium

Candidate **`bd1e57bc48e55a065cbbccb68acea196a64a187c`**, stacked on PR47 **`b111ed2abfed15c97106e3d755fcff33c704215f`**. No new P0/P1 defect found in PR51's packaging/download changes. This is not a native Safari/IME approval or a fresh scientific/GIS certification of the unchanged PR47 geometry.

QA used a new detached checkout and disposable Playwright browser contexts. No original learner saves, owner server, application runtime, PR head, release asset, artwork or reward logic was modified. This evidence branch is separate from the reviewed candidate.

## Actual downloaded artifact

- Release link fetched both with GitHub's release client and **anonymous curl**: HTTP200.
- Filename `TOPO-Italie-Computer.html`, **3,133,692 bytes**.
- Independently computed SHA256 **`89464c6686ff90eeaa9cd1274cb39f5881a1905b1b49211427a8f352c5d96c31`**.
- Actual public and authenticated downloaded bytes equal the committed new computer filename, original two HTML exports, canonical index and rebuilt dist.
- Full runtime also equals PR47's index byte-for-byte. Diff review found only additive packaging filename, test-harness input/output parameters and documentation/evidence; no runtime/geography/progress alteration.

## Independently executed maintained gates

- Build, lint, entire17-program npm test chain PASS under **Node24.15.0**. `typecheck` is a documented no-op and is not represented as a real type-check result.
- Actual downloaded release file opened with `file://`, **offline:true**:45 unique target IDs /11 chapters; images decoded; wrong/correct grading, persisted reload, pizza/full-reset controls PASS. No page exceptions, console errors or external requests.
- Focus browser suite rerun against that downloaded file:7 viewports, keyboard/visualViewport **simulation**, rotation/draft/caret, real original input/check, styles/zero coordinate drift, Schoolblad, desktop fine-pointer breakpoint and genuinely played wrong→repair→Point→Write→Gold with3pizzas/1trip PASS. It also exercises original standalone export filenames.
- Existing semantic matrix:8 runs /64 actual Tuscany/Plain/Po/mistake taps, plus neutral microstates PASS.
- Apennines matrix:8 orientation/style/zoom runs /32 actual interior/old-offshore touches, all45 disabled chapter zoom and menus PASS. This tests interactive behavior, not a new GIS perimeter claim.
- Desktop browser in this independent run: **Chromium156.0.8078.4 on macOS**; not the145 version reported by the PR author.

## Additional independently authored failure-path probes

[Harness](independent-browser.mjs) and [executed results](independent-browser.json):

- [Native desktop mouse probe](desktop-mouse.mjs) / [results](desktop-mouse-results.json):14 explicit target/negative cases at1500×1000, both styles, Tuscany/Plain/Po, SanMarino/Vatican neutral chooser and deliberate wrong-region/wrong-river clicks. Actual mouse events and real question navigation; no answer replacement/direct grading.

- Both map styles preserve typed draft, backward caret selection, current question, mode and progress on desktop.
- Real wrong answer grants no correct credit; real correct input grants one.
- Actual browser download of progress JSON verified, not an invented backup fixture.
- Nested-invalid route backup rejected; live progress and stored bytes unchanged.
- Valid backup with user confirmation **cancelled** preserves live progress and stored bytes.
- Same-path reload preserves semantic stored progress.
- Actual exported backup imported into a fresh offline browser context successfully transfers good/pizzas/slices/trips.
- No page errors or external web requests during these probes.
- Test development initially assumed the map-style chooser stayed open. It closes by design; the harness was corrected to reopen it. **No application fix was made.**

## Visual check

[Desktop top](desktop-top.png) inspected: readable primary navigation, aligned style controls, one visible input and clear Controleer button; no horizontal clipping/duplicate form. [Reset-controls view](desktop-reset-controls.png) is intentionally scrolled to the footer, not evidence that the header is clipped. [Fresh-context restored route](independent-restore.png).

## Remaining limits / owner usage

- Native macOS Safari, WebKit and physical iPad/OS keyboard/IME **NOT TESTED**. WebKit browser was not installed; it was not silently substituted with Chromium. This PASS is scoped to the executed offline desktop/Chromium checks and regressions.
- Local-file storage is browser/path-specific and not a portable guarantee. Keep filename/location/browser stable; use the tested JSON export/import to move existing progress from server/iPad/another browser.
- No merge/deployment or existing8033 server change. Keep candidate draft until owner decides next step.

## Reproduction

Install dependencies and run `npm run build && npm run lint && npm test` using Node24.15.0+ in the repository. Set `PLAYWRIGHT_MODULE` to a development Playwright module. Use the actual downloaded file URL as `QA_FOCUS_HTML` for `scripts/qa-focus-mode.mjs` / `scripts/qa-ipad-update.mjs` and as `TOPO_OFFLINE_FILE` for `scripts/qa-offline-computer.mjs` and this independent harness. Direct outputs to disposable QA folders with `QA_FOCUS_DIR` / `QA_UPDATE_DIR`; the independent harness writes its own outputs beside its script. All browser contexts must be disposable.

Raw records: [artifact](artifact-verification.json), [desktop smoke](desktop-smoke.json), [counts](browser-counts.json), [Focus](browser-results.json), [semantic](semantic-focus-results.json), [breakpoints](breakpoint-focus-results.json), [Apennines](update-interaction-results.json), [gates](gates.txt), [Focus log](focus-browser.txt), [Apennines log](apennines.txt).
