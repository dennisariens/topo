# TOPO / NINO — UX #52 implementation candidate

**Status:** functional source implementation and independently named single-file offline **review candidate** pushed to PR #64. **NOT QA PASSED** and **NOT released**. Full owner design GO was given in TOPO Main on 31 Oct 2026 ("oke let's go ... full on design"), after v2 navigation feedback was approved. This document supersedes the earlier design-only PR text.

## Fixed source of truth
- Frozen computer v1 baseline SHA: `1bf86b3e1c69319bed8ef877243070a64d97a12e` on `release/topo-nino-computer-v1-20261030`. Do not edit/reissue this release.
- Implementation branch: `codex/issue-52-calm-desktop-learning` / [PR #64](https://github.com/dennisariens/topo/pull/64), based on v1.
- App source: `scripts/ux-desktop-52.css` and `scripts/ux-desktop-52.js` are injected through the existing `scripts/embed-focus-mode.mjs` build path **inside the existing marked Focus presentation block**. Existing geometry/hitbox/learning modules are never rewritten.
- Repository-level Codex skill: `.agents/skills/topo-ui-design/SKILL.md`. The design skill is part of this PR and applies to future TOPO UI work.

## Real offline app preview
[**TOPO-NINO-UX52-Computer-Preview.html**](https://github.com/dennisariens/topo/blob/codex/issue-52-calm-desktop-learning/output/html/TOPO-NINO-UX52-Computer-Preview.html)

This is a complete source-based HTML file, **not the older concept UI with a fake map**. The candidate was generated from the exact frozen v1 original `index.html`, appending only the new source CSS and JS and changing the document title for review. All geography, art and existing inline scripts were retained verbatim. At creation the exact source was **3,152,432 bytes**, the regenerated #52 candidate **3,171,146 bytes** (byte counts from GitHub returned UTF-8 string values, not independently downloaded physical byte measurements). Reversing the UX additions and title normalization yields the byte-identical original source.

All three existing inline JavaScript blocks parse under V8: the unchanged learning engine, route engine and original + UX app block. **This is syntax/source verification only, NOT a successful actual browser interaction or screenshot.** The candidate is self-contained by construction; the existing embedded WebP and `file://` infrastructure remains present, but running it offline on a fresh browser is still part of QA.

## UX implementation
- Wide fine-pointer desktop `>1180`, except coarse pointer screens up to 1440 retain original Focus, receives the new Italian field-notebook treatment: warm cream surfaces, restrained teal/terracotta, fine borders, responsive 69/31 split map/task, quiet header and smaller clutter footprint.
- The original three learning-phase `.tab` buttons are visible **immediately under the header** with `01 Ontdekken → 02 Aanwijzen → 03 Schrijven`. The existing route/exam `.tab` elements stay in the DOM with original handlers; they are available through Menu shortcuts on desktop.
- The separate Gold button checks the original real `TopoRoute.record(...).stage === 3` and `TopoRoute.unlocked()` before activation; it launches the existing `startRouteLesson(chapter,'gold')`. An ordinary `exam` is not relabelled Gold. Current guided route phase clicks go through canonical stage progression; locked future stages cannot be launched.
- `Vandaag` mirrors `state.daily.date===localDay()?state.daily.correct:0` against the existing eight-answer goal; no new counter, reward or streak created.
- Responsive compact/iPad existing Focus Mode continues to own navigation, answer sheet, input keyboard and camera; the new desktop surface is hidden outside its allowed breakpoint. No map clone, new grader, duplicate input or extra persisted keys.
- Secondary controls are accessed via Menu shortcuts that activate **their original buttons and confirmations**: route, free Test, mistakes, print, JSON backup/import and resets. Visual noise in the permanent panel (pizza meter, duplicate reward information, reveal/mistakes, resets) is hidden **only on wide desktop**; actual rewards and celebratory event logic still run.
- Gold has an optional accessible title and semantic disabled state until available; nav buttons retain their original `data-mode` and status.

## Pending execution gates for Codex (do NOW, do not plan again)
1. Check out the **current PR #64 HEAD** locally with Node 24, `npm ci`, `npm run build && npm run lint && npm test`. The build embeds `ux-desktop-52.css/js` and regenerates canonical `index.html` + matching standalone outputs. Run `npm run audit:release-1-2` and `node scripts/audit-map-picker-revision.mjs`; if an unrelated audit pins an older layout hash, report it rather than weakening geography protection.
2. Run `PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs npm run qa:ux52` on the full candidate; the test covers desktop 1728/1440/1280, iPad 1180/820, phone 390/320, five modes where reachable, single canonical input and focus/caret breakpoint crossing, true `file://` offline and no external request.
3. **Human-grade screenshot audit:** actual application screenshots in `docs/visual/ux52` for Discover, Point, Write, free Test and a real Gold (unlock through the genuine route, do not manually grant Gold). Compare to the already approved v2 design concept and to baseline v1; check text cutoffs, map+panel ratio, zoom scrolling, navigation discoverability and 44px clickable targets.
4. Run the existing all-45 per-item geography/writing, map-choice/Gold/reward/backup validation in actual Chromium. Reproduce Rome/Vatican nested markers, Etna/Naples volcano icon choices, San Marino and sea overlap neutral shuffles. Daily rollover and reset/backup UI need real tests, not only source review.
5. **Fix actual browser defects on the SAME PR #64 branch**, rebuild output and produce a new exact reviewed SHA. Do not change owner-approved visual concept just to satisfy metrics. Avoid new branches and duplicate PRs.
6. Hermes independently reviews the final Codex commit/browser evidence, including display at 1440/1280 and existing iPad Focus behavior. Physical native Safari/IME and iPad touch remain NOT TESTED until user/device verification. Do not claim them from Playwright WebKit.
7. Deliver exact new preview/release-**candidate** checksum, browser snapshots and honest PASS / CONDITIONAL / FAIL. **No merge, production deployment, tag promotion, learner-data reset or overwrite of frozen computer v1** without owner final GO.

## Known QA status at this draft
- PASS: project design skill committed; source CSS/JS added; standalone HTML candidate generated and pushed; source geometry/learning scripts verified unchanged by reversing appended blocks; all three inline script tags parsed successfully by V8 on the earlier candidate; new JS source syntax parsed after later patch.
- NOT YET RUN: full npm test/build/audit, visual browser screenshots of the real learner UI, real `file://` runtime, browser QA runner, exact post-build equivalence, independent Hermes and physical iPad/Safari. Do not describe these as PASS.

**No parallel design-only work.** The next engineering task is execute/browser-QA/fix on this existing candidate.
