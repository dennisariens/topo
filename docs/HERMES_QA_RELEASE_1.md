# Independent Hermes QA — Topo Release 1

Use branch `codex/topo-release-1-integration`; compare with `main`, not the original Work handoff PR #2. Review implementation/evidence commits listed in `RELEASE_1_INTEGRATION.md`. Do not merge or deploy. Use a disposable browser profile so acceptance tests do not replace the learner's real saved progress.

## Reproduce

```sh
git fetch origin
git switch codex/topo-release-1-integration
npm ci
npm run lint
npm test
npm run build
npm run dev
# http://127.0.0.1:8000/
```

Use a supported jsdom Node engine (Node 24.15+ recommended). For PDF regeneration: `node scripts/generate-print.mjs`, `python3 scripts/generate-pdf.py` in a ReportLab/Pillow environment, then `npm run build`. On macOS Arial is discovered automatically; Linux needs DejaVu Sans. Tests/build must reject a modified `print.html` with an old `output/pdf/print-source.sha256`.

Optional automated Chrome reproduction (install Playwright in your QA environment):

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
CHROME_PATH=/absolute/path/to/chrome \
node scripts/qa-release-1.mjs
```

The script accepts equivalent `--playwright-module=...` and `--chrome=...` options, plus `TOPO_URL` and `QA_OUTPUT` environment variables. Default browser path is Playwright's installed Chromium. It seeds completed chapters only for the final isolated countries-gold test; the maintained DOM flow independently completes all eleven chapters through their controls.

## Manual checks

1. Arrival: original Nino panorama, original scooter portrait/coach, eleven stops and exactly three stages. Only the first stop is unlocked for a clean save; existing direct Learn/Point/Write/Test tabs work. No code-recall question or Schoolcodes lesson.
2. Map: compare all 45 items against the manifest and source-point excerpts in `docs/geography/`. Check Vesuvius east of Naples, Etna north of Catania, accurate San Marino/Vatican points, non-drifting map at desktop/tablet/phone sizes. Nine mountain/region/sea zones are explicitly schematic, not audited boundaries. Raw upstream source data was not part of the handoff; do not mistake a hash baseline for independent survey validation.
3. Overlaps: in Point, tap Rome/Vatican's close position. A neutral numbered crop appears without answer names. Choose each marker in a separate question and verify distinct grading. Cancel returns without answering. In Learn/Discover the separate named containment explanation is allowed. Test Enter/Space on individual microstate marks and the shared picker trigger. River transparent hit strokes must follow the visible line without moving it.
4. Writing: exercise Vatican and San Marino in countries/write and gold. A visible ring and cropped map must identify the canonical point; enter names and accepted aliases. Typing must not update the pointing skill. Names and instructions remain Dutch.
5. Learning: finish a smart round with two right/four wrong. It stops after six and reports 2/4 for the round, independently of lifetime totals. Check passport includes all 45 places with separate point/write status. Weak/due/new selection must stay within available chapters. Long lessons pause at six without losing remaining questions.
6. Gold: complete all seven country items in pointing and writing (14 tasks), including six/twelve-question pauses and reload halfway. Flawless earns gold; one error prevents it. All eleven stops have equivalent coverage in the maintained DOM suite. Replay preserves completion/gold; it does not mint the same stage/gold reward tokens again.
7. Rewards: cross eight slices and 24 correct retrieval rewards. New pizza starts at zero, every third pizza moves destination, earned totals survive reload. Repeat after >100 lifetime pizzas. Only current partial pizza belongs in the focused lesson meter; Nino trip toast is brief/nonblocking. Reduced-motion preference must suppress trip/wedge animation.
8. Saved progress: test legacy v2 rewards and schema-1 route saves with completed writing/gold and an obsolete active code lesson. Pizzas/trips, aggregate history, completed writing and gold survive; obsolete code task closes; untracked point/write histories are not fabricated. Reload answered feedback cannot award again. Check JSON backup export/import in a disposable profile and invalid backup rejection.
9. Resets: pizza-only preserves skills/daily goal; route-only preserves earned rewards and replay ledger; full reset clears daily goal, mastery, mistakes, route and rewards. Change local calendar day for daily rollover. A browser with blocked storage should show its inline warning and keep working in memory.
10. Print: reference, place→name, name→location for cities and countries. V-labels are temporary questions, not fixed schoolcodes. Accurate point markers stay visible, label leaders do not cover them. PDF has 35 A4 pages, matching vector geometry/labels and separate original-photo appendix. Print representative sheets and check real legibility.

## Physical iPad Safari — outstanding acceptance

Test on the actual device in portrait and landscape, with real taps and the on-screen writing keyboard. Verify neutral overlap picker, microstate highlighting, scroll/sticky controls, browser zoom, text focus, touch tolerance, local save/reload, backup import/export, reduced motion and print/share if used. Chrome's tablet viewport is not this test. No physical iPad pass is claimed.

Record browser/device versions, exact commit, observed failures, screenshots, and whether the PR is acceptable to the owner. GitHub is the only source for fixes; do not edit the frozen archive, the older Work Site or downloaded historical HTML.
