# TOPO / NINO — integrated computer release candidate

Owner DESIGN GO: 30 October 2026. **Candidate for independent acceptance, not a final release.**

## Delivery and integration decision

Download the prerelease asset named **TOPO-NINO-Computer-Release.html**, save it on the computer and double-click/open it in a browser. No server, internet, install or supplementary files are needed. The file is generated from canonical `index.html`; lint rejects different bytes under the release filename.

Candidate tag: `topo-nino-computer-rc-20261030`. Its Git tag identifies the exact review commit. The published release notes and `SHA256SUMS.txt` identify the attachment bytes; use them rather than a mutable branch download.

The branch starts from PR #60 `d7a99213b9c32db223f2b9ede8b1b256bc69ffe4` and merges PR #59 `6f8bd2321a627aaf89bde63a7b161d9763b4a72a`. Inspection found that #60 actually forked from #59's **older rejected** `d55e9de` implementation. Blindly taking #60 would lose #59's later volcano/city/context and viewport fixes. Both already descend from PR #51 `bd1e57bc48e55a065cbbccb68acea196a64a187c`, which contains integrated Release 1.2 #17 and later School/Discovery/semantic/Focus/Apennines fixes. No redundant cherry-picks were needed.

Conflict resolution retains #59's complete owner-approved renderer, including its source-relative symbolic Rome circle containing Vatican with separate callouts. The owner expressly accepts that prior Rome/Vatican implementation. #60's alternative fixed-layout illustration is deliberately not layered over it: doing so would substitute a different layout and discard tested fitting behavior. This is a documented choice between approved alternatives, not a redesign. The app and `scripts/map-hit.js` are byte-identical to approved #59. Both learning engines, geometry, artwork, saves, rewards, School/Discovery and print remain exact PR #51 bytes outside the bounded chooser module, as verified by `audit-map-picker-revision.mjs`.

No upstream PR/main branch was merged, no existing release was replaced and no owner test server or production deployment was changed. The earlier uncommitted Release 1.1 acceptance work in the other checkout remains untouched. The integration merge exists only on the new candidate branch.

## Changes made for delivery

- Generate the requested filename alongside existing three exports; keep all four identical to canonical HTML.
- Add a filename parity check to lint and `npm run release:check` for build, lint, full tests and existing preservation audits.
- Add `scripts/qa-computer-release.mjs`: a reproducible 45-object ledger of actual correct/wrong pointer and writing interactions in both map styles, with a separate real Gold queue that must fail after a wrong answer and an exact save/reload check.
- Give maintained picker/offline QA scripts configurable output directories so this exact candidate's evidence does not replace historical evidence.
- Store current results/screenshots under `docs/qa/computer-release-20261030/`.

No new dependencies, art, reward behavior, learning-engine rewrite or passport implementation.

## Reproduce

Use a supported Node runtime; repository gates were executed with Node 24.15.0. Browser suites below use local Playwright already installed in the QA environment, not a new application dependency.

```sh
npm ci
npm run release:check
export PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs
node scripts/qa-computer-release.mjs
QA_REVISION_SKIP_HISTORY=1 QA_OUTPUT=../docs/qa/computer-release-20261030/selection/ node scripts/qa-map-picker-revision.mjs
QA_OUTPUT=../docs/qa/computer-release-20261030/sessions/ node scripts/qa-map-picker-sessions.mjs
TOPO_OFFLINE_FILE=../output/html/TOPO-NINO-Computer-Release.html QA_OUTPUT=../docs/qa/computer-release-20261030/offline/ node scripts/qa-offline-computer.mjs
QA_FOCUS_HTML=output/html/TOPO-NINO-Computer-Release.html QA_FOCUS_DIR=../docs/qa/computer-release-20261030/focus/ node scripts/qa-focus-mode.mjs
QA_OUTPUT=../docs/qa/computer-release-20261030/physical/ node scripts/qa-map-picker-revision-taps.mjs
```

The scripts launch Chromium with actual `file://` and `offline:true`. Recorded candidate-set fixtures and explicit question fixtures are labelled; they are not described as natural all-45 route playthroughs or physical iPad taps. The existing full DOM regression independently exercises all eleven chapters/stages/Gold.

## Geographic and learning evidence

Executed gates and evidence (Chromium 145.0.7632.6 on macOS; browser harnesses Node 24.13.1, build/regression gates Node 24.15.0):

| Check | Result | Evidence under `docs/qa/computer-release-20261030/` |
| --- | --- | --- |
| Full 17-program regression, lint, production build, source audits | PASS | `gates/release-check.log`, `gates/final-lint.log` |
| Exact requested filename, decoded images, incorrect/correct writing, local-file reload/reset | PASS | `offline/desktop-results.json` |
| Seven named selection scenes, both themes/number orders/requested targets | PASS: 280 grading/render cases and 280 candidate layouts | `selection/browser-results.json`, `selection/revised-*.png` |
| Point/Test/Gold, wrong/correct, both orders, cancel/focus/resize/reload/duplicate guards | PASS: 12 sessions | `sessions/session-results.json` |
| Recorded real-mouse overlap matrix | PASS for 679 addressable cells / 1,358 actual taps; 120 unaddressable samples NOT PASSED | `physical/physical-results.json` |
| Responsive keyboard simulation and canonical submissions | PASS: seven viewports plus desktop breakpoint | `focus/browser-results.json`, `focus/breakpoint-focus-results.json` |
| Semantic map interaction in integrated Focus | PASS: 64 probes across eight theme/orientation/zoom runs | `focus/semantic-focus-results.json` |
| Every object: two correct taps, one wrong tap, wrong/right writing in both themes; completed wrong-Gold and reload | PASS: 45 rows, 180 correct / 90 wrong pointer trials, 180 writing trials, wrong-Gold rejection and reload | `integrity/ledger.json`, `integrity/summary.json` |
| Native Safari | NOT TESTED: session creation rejected, remote automation disabled | `safari.json` |

Initial integrity-harness attempts exposed test assumptions, not a runtime patch: disabled answered-state Check buttons cannot be clicked; polygon samples needed an interior margin to survive pixel rounding; seeded completed chapters need canonical metadata/ledger; reload may reorder JSON object keys without changing data. The maintained harness now tests the disabled control/Enter guard, uses robust interior samples, seeds through the supported restore path and compares parsed persisted state. No application assertion was removed to conceal a failing grade.

The 45-row ledger links every ID, category, source status, geometry hash, sampled taps, candidates/order, correct/wrong grade and writing outcome. Source-projected points are checked against the pinned lon/lat excerpts and projection; all geometries are compared to the retained manifest. Nine zones remain explicitly schematic. Apennines retain PR #47's sourced mountain/DEM educational mainland corridor, not an official surveyed range boundary. Source baseline consistency is not a new independent GIS survey or scientific certification of every vertex.

High-risk cases are covered by the all-object ledger plus named selection captures: Rome/Vatican, Naples/Vesuvius, Catania/Etna, Milan/Varese, Bologna/Modena, San Marino, overlapping seas; Focus semantic probes separately cover Po/Po Plain, Tuscany and Apennines. Both randomized option orders and different requested targets are checked against identical candidate scenes; wrong choices do not earn correct-answer rewards. Gold sessions cover wrong/correct choice, resize, Escape/focus, reload and duplicate submission guards; the new harness completes a Gold queue after an intentionally wrong pointer and requires a failed result/no Gold award.

## Known limitations and release gate

- **Hermes independent verdict is pending.** Existing reviews of older PRs are not acceptance of this commit or attachment.
- Native Safari session creation was attempted. macOS Safari rejected it because **Allow Remote Automation is disabled**. Safari, WebKit and physical iPad/IME/VoiceOver are **NOT TESTED** in this candidate run. No system preferences were changed. Chromium viewport/keyboard simulation is labelled as such.
- The physical matrix replays a finite previously enumerated 799-cell inventory. An integer-pixel tap that cannot reproduce a source-border candidate set is **NOT TESTED / unaddressable**, not a pass and not automatically a functional failure. It is not an enumeration of all continuous zoom/pan positions.
- Geography has the source/schematic limits described above. Owner visual DESIGN GO freezes the design; independent recognisability review must not be replaced by endpoint-distance metrics.
- Browser `file://` storage is browser/path specific. Before changing filename/browser/location, export JSON progress from the old working app. Keep the old file and backup, open the new app, import the backup and verify earned progress before removing anything. The new file retains the same schema, IDs and migration; it cannot guarantee automatic cross-path browser storage continuity.
- No cloud/device sync, PWA or account is added. Printing artifacts are preserved, not freshly tested on a physical printer. New paid art/passports/reward changes are excluded.

## Hermes — bounded independent handoff

**Verdict required: PASS / CONDITIONAL / FAIL**, with exact candidate commit, downloaded SHA-256, environment, evidence links and severity/reproduction for every finding. Review the commit named by the candidate tag and published release notes, not #51, an earlier #59 commit, local branch state or a previous download.

1. Independently download the GitHub prerelease attachment. Confirm its filename, size and SHA-256 against `SHA256SUMS.txt` and the committed generated artifact. Open the downloaded bytes via `file://` with networking disabled. Check decoded art, no page/console errors and no external requests.
2. Verify all 45 ledger rows and source/schematic distinctions. Spot-check actual geographic context/anchors against references; do not count geometry hashes alone as geographic truth. Reproduce the nine named risk areas and both School/Discovery styles using real pointer/keyboard controls.
3. Check approved picker screenshots at original pixels and actual runtime: nested Vatican within symbolic Rome, recognizable city/volcano context, distinct noncrossing callouts, correct same-scale sea outlines, all options visible initially. Preserve DESIGN LOCK unless a reproducible defect exists.
4. Independently demonstrate both option orders, question-independent candidates/rendering, wrong-answer rejection and correct grading. Confirm no positional strategy, cancel/resize/reload exploit or duplicate submission can mint progress/rewards/Gold. Reproduce the completed wrong-Gold test, not only its intermediate wrong answer.
5. Play an actual Discover → Point → Write → Gold route and free practice; check no stuck route, old-save restore, JSON export/import, reset scopes and eight-slice/three-pizza cadence. Retain the full-regression evidence and report any unexecuted part explicitly.
6. Where Safari is available, verify the exact downloaded file there. Keep physical iPad/keyboard/assistive checks separate. Computer acceptance must not imply device acceptance.
7. Post your verdict/evidence to the candidate PR. **Do not implement a duplicate app, redesign, merge, update the existing learner release or publish a final release.** Escalate only concrete failures within this scope. The owner decides final acceptance/promotion after independent review.

The handoff is prepared here; this document does not claim Hermes was launched or has returned a verdict.
