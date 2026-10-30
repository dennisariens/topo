# TOPO / NINO — integrated computer release candidate

**Status:** implementation and lead-integration validation delivered on the existing draft **PR #61**. This is **not independent Codex acceptance**. No merge, production deployment or owner-server change.

**Ownership:** Hermes owns integration and this evidence. The owner's current mission assigns **independent technical QA to Codex**. That supersedes older PR/report text asking Hermes to act as the independent reviewer. Historical author evidence is retained, not relabelled.

## One candidate, no competing implementation

Reuse `codex/topo-nino-computer-release-20261030` / [PR #61](https://github.com/dennisariens/topo/pull/61), stacked on the existing PR51 offline-computer branch. Implementation payload is `b3540f72b2e21ede842bd38051e6a7015eaa0aa6`; the final review commit, including this evidence and reproducible QA, is pinned in the lead-integration handoff comment on PR61. Review that full immutable SHA, not the moving branch or an older comment.

The lead finalization changes QA portability, reference capture and evidence/handoff only. `index.html`, `scripts/map-hit.js`, both learning engines, the owner SVG and the released HTML remain byte-identical to that implementation payload. The existing prerelease download therefore remains the exact tested artifact; no new publication or replacement of older downloads was needed.

## Integrated components

- Exact `assets/map-selection/TOPO-Rome-Vaticaanstad-approved-refined.svg`, **1,413 bytes**, SHA-256 `c2d66a994879ecc125e2bb3d01accbc8a10730d990b85ee13eb5b050e797c70c`. One shared importer serves the main chooser, multi-way inset and Discover explanation.
- Rome is a large city circle; Vatican is a small area within it. Rome's tip `(221,88)` lies inside the dotted rim; Vatican's tip `(170,128)` identifies the enclave. Source drawing/colors/font are retained. Neutral assessment digits can swap without changing geography; responsive badge transforms maintain readability. This is the approved symbolic drawing, not an invented municipal boundary or bearing map; the real-map locator remains separate.
- Existing PR59/60 selection lineage with distinct city/volcano/state context and consistent pointer ink for Naples/Vesuvius, Catania/Etna, Milan/Varese, Bologna/Modena, San Marino and sea overlaps. No unrelated map redesign or coordinate change.
- Existing **45 objects / 11 chapters**, Discover → Point → Write, School/Discovery maps, Nino guidance and onboarding, six existing runtime illustration roles, pizzas/Vespa, Gold, progress, backup/reset and offline building retained. No new passport/art/reward feature or design-branch mutation.

## Download and integrity

[Download **TOPO-NINO-Computer-Release.html**](https://github.com/dennisariens/topo/releases/download/topo-nino-computer-approved-artwork-rc-20261030/TOPO-NINO-Computer-Release.html)

- Repository artifact: `output/html/TOPO-NINO-Computer-Release.html`
- Bytes: **3,152,649**
- SHA-256: **`422f39dd06cb2ea2d6524ce07e4524738aa425aef5c5e54d63b55d90b54143a9`**
- Actual anonymous browser download saved with the expected filename, compared byte-for-byte with the repository artifact, then reopened through `file://` in a fresh Chrome context with networking disabled. Writing and Vatican chooser grading passed; no startup/console errors or external requests.
- Open locally by double-click/file association; no server or internet required. Finder double-click itself was not automated. Export a JSON backup before changing browser/file path/name; browser-local saves do not migrate automatically. Actual UI export/import between fresh contexts is verified.

## Executed lead validation

All raw results below are under [`qa/integration-lead-20261030/`](qa/integration-lead-20261030/). Author's older evidence remains separately under `qa/approved-artwork-20261030/`.

| Gate | Result / scope |
|---|---|
| Lint, production build, 17 test programs, preservation/release audits | PASS; `gates/release-check.txt`, `preservation.json`. Typecheck is the repository's documented no-op, not TypeScript coverage. |
| **All45 — installed Google Chrome 156.0.8078.74** | PASS in both styles: 180 correct pointer trials, 90 wrong pointer trials, 180 writing trials; duplicate-credit protection, completed wrong-Gold rejection and parsed reload equality. `integrity/ledger.json` has 45 unique rows. |
| **All45 — Playwright WebKit 27.2** | Same checks PASS offline, separate 45-row ledger in `webkit/`. This engine run is NOT installed/native Safari approval. |
| Selector drawing / answer mapping | 280 cases + 280 layout checks PASS, `selection/browser-results.json`. |
| Point / Test / Gold chooser sessions | 12 cases PASS, both orders/wrong/correct, cancel, focus, resize, reload and no double credit; `sessions/session-results.json`. |
| Finite physical mouse overlap replay | **679 / 799 cells PASS**, 1,358 identical-XY mouse taps; **120 unaddressable integer-pixel border samples excluded, not passes**. `physical/physical-results.json`. No claim of continuous pan/zoom coverage or physical touch hardware. All45 individual objects remain reachable in their positive trials. |
| Exact approved SVG | 8 mode/order cases PASS; Discover lens, writing without named lens, desktop/small-phone multi-way. `fidelity/results.json`. Original SVG reference is captured element-scoped in a larger viewport to avoid the earlier tiny-page capture clipping/repetition. Source SVG unchanged. |
| Responsive Focus / real route / semantic regression | Seven viewports PASS; existing semantic/breakpoint probes and genuinely played first-stop route/reward captures in `focus/`. Keyboard occlusion is explicitly SIMULATED, not an OS keyboard test. |
| Actual downloaded HTML | Browser download, byte equality, offline startup, correct writing and Vatican choice PASS; `download/verification.json`, `download/downloaded-offline.png`. |
| Real backup transfer | PASS: wrong/correct grading, style/draft/caret/question invariance, actual JSON export, malformed/cancelled import preserves memory/storage, reload and transfer to a fresh context; `backup/backup-transfer-results.json`. |
| Daily credit / replay / strict import regression | PASS: stage daily credit 6→12 and Gold 30→42 without duplicate pizza rewards; reload/resubmission, six malformed imports preserving memory/storage, valid schema1/2 restore; `daily-import/browser-results.json`. |
| Native Safari | **BLOCKED / NOT TESTED**: safaridriver cannot create a session because Allow Remote Automation is disabled. `native-safari.json` records the actual error. No settings changed. |

These all45 runs use explicit current-question fixtures and real mouse/chooser/writing actions. They are **not** a full natural-route playthrough of all45; the DOM regression suite separately exercises all11 chapters. Baseline geography verification records 27 projected source points, 10 pinned-source baselines and 8 schematic extents: **not a new independent GIS survey or certification of schematic boundaries**. No new geography/assessment changes were justified or made.

## Visual evidence

- [Approved original reference](qa/integration-lead-20261030/fidelity/owner-original.png)
- [Rome/Vatican actual chooser](qa/integration-lead-20261030/fidelity/point-original.png) / [swapped neutral numbers](qa/integration-lead-20261030/fidelity/point-swapped.png)
- [Discover explanation](qa/integration-lead-20261030/fidelity/discover-lens.png) / [multi-way](qa/integration-lead-20261030/fidelity/desktop-multiway.png)
- [Naples/Vesuvius](qa/integration-lead-20261030/selection/revised-desktop-school-naples.png)
- [Catania/Etna](qa/integration-lead-20261030/selection/revised-desktop-school-etna.png)
- [Milan/Varese](qa/integration-lead-20261030/selection/revised-desktop-school-milan.png)
- [Bologna/Modena](qa/integration-lead-20261030/selection/revised-desktop-school-bologna.png)
- [San Marino](qa/integration-lead-20261030/selection/revised-desktop-school-san-marino.png)
- [Actual downloaded file offline](qa/integration-lead-20261030/download/downloaded-offline.png)

## Reproduce

Use a disposable checkout/profile. Never use learner saves. Node **24.15.0**, Playwright **1.64.1** were used; browser tooling is dev-only outside the repository, not a runtime dependency.

```bash
# Pin the full final SHA from the PR61 handoff before executing anything.
git checkout --detach <EXACT_SHA_FROM_PR61_HANDOFF>
npm ci
BROWSER_DEPS="$HOME/.hermes/cache/scratch/topo-integration-browser"
npm install --prefix "$BROWSER_DEPS" playwright@1.64.1
node "$BROWSER_DEPS/node_modules/playwright/cli.js" install chromium webkit
export PLAYWRIGHT_MODULE="$BROWSER_DEPS/node_modules/playwright/index.mjs"
# macOS runner uses installed Chrome when present; otherwise Playwright Chromium.
# Set CHROME_PATH explicitly if testing a different installed Chrome binary.
bash scripts/validate-integrated-release.sh
# Separate native macOS gate, if owner has already enabled Safari automation:
python3 scripts/qa-integrated-native-safari.py
node scripts/summarize-integrated-release.mjs
shasum -a 256 output/html/TOPO-NINO-Computer-Release.html
```

Use Node24 directly or prefix the shell with `npx --yes --package=node@24.15.0 -c '...'` as in the recorded execution. The maintained finite overlap run can take roughly twenty minutes. The final runner adds the separately executed WebKit/backup/daily gates to the initially executed nine-gate sequence; all constituent commands ran successfully. Native Safari status is separate and must never be inferred from the runner exit code. Linux browser installation may require platform dependencies; it cannot establish native Safari acceptance.

## Remaining gates

Native Safari local-file compatibility remains unverified until automation/manual owner testing is available. Physical iPad / OS keyboard / IME / VoiceOver are NOT TESTED. Independent Codex exact-commit QA and owner approval are still required. [Codex acceptance handoff](CODEX_INTEGRATION_QA_HANDOFF.md). No merge, final release publication, production deployment, owner test-server change or further design iteration is authorized by this delivery.
