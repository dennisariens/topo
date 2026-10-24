# Release 1.2 integration — Nino and lakes

Issue #16. Candidate branch: `integration/topo-release-1-2-nino-lakes`. Draft target: `codex/topo-release-1-1-polish`. All checks below are local executed results, not GitHub CI claims. No target/release/main merge or deployment.

## Exact inputs and composition

| Input | Pinned SHA |
| --- | --- |
| Release 1.1 PR #9 baseline | `a481317b33f5f6f55c179ee0fbfe6b211663be7b` |
| Hermes Nino PR #14 | `4f15b610479358b4bf64a7de8be6c5875039b086` |
| Codex lake PR #15 | `35ff21b639e4672b7ed221b540b2c48dcd582285` |
| Immutable owner art | `047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d` |

The branch was created from the pinned baseline, advanced to the pinned Hermes commit, and combined with the pinned lake commit using a merge on this new branch. Both feature histories are retained. No shared design/art branch was edited. Original PNG masters were neither imported nor modified; the six approved runtime WebP exports are byte-identical to their original owner Git objects and Hermes copies.

[Source preservation audit](visual/release-1-2-integration/source-preservation.json) verifies that removing **exactly three lake insertions** from the combined canonical HTML produces Hermes' pinned HTML byte-for-byte. These insertions are the generated lake SVG definition block, static preview use, and one runtime composition call. This preserves every art slot, inline image, event policy, UI hook and responsive style without hand-reimplementing Hermes' work. Lake source/projection/manifest/generation files are exact copies from pinned PR #15. Learning/route engines, original artwork, print HTML, PDF and freshness hash are exact baseline bytes. No target coordinates, learning arrays or persistence schema changed.

The combined candidate retains 45 learning targets, eleven chapter groups, 27 point anchors, three point/write/discover stages, 890:1235 map frame, removed schoolcode questions, eight slices per pizza, real third-pizza travel, Gold/replay/daily ledgers, strict backup imports, reset scopes and keyboard microstate picker. Future chapter scenes and postcards remain safe empty/locked slots; no unapproved app icon or new artwork is introduced.

## Conflict resolution

| Shared file | Resolution |
| --- | --- |
| `package.json` — actual conflict | Keep all eleven baseline programs, Hermes' six-case art test program, and the lake regression: **13 programs**. Retain lake generation/QA commands; add combined audit/offline QA commands. |
| `scripts/build.mjs` — actual conflict | Run art embedding **and** lake generation, then canonical static preview, print freshness, standalone packaging and validation. Both generators precede all derived app copies. |
| `docs/DECISIONS.md` — actual conflict | Preserve both independent appended decisions and append the bounded integration decision. |
| `index.html` — auto-merged, explicitly audited | Preserve Hermes' full app and exactly three lake additions. No whole-file side selection. Source audit proves the composition. |
| `docs/PROJECT_STATE.md` — auto-merged | Retain both feature summaries and append current combined status. |
| `output/html/*.html` — auto-merged, then regenerated | Rebuild both from canonical `index.html`; no manual generated-output reconciliation. |
| `scripts/nino-art.test.mjs` — integration adjustment | The geometry equality test excludes only paths inside `#lakeGeometry`, since those six new background polygons are intentional. All pre-existing shape attributes remain compared with Release 1.1, while the lake suite checks exact six-polygon hashes, envelopes and layer behavior. No reward/progress assertions were removed. |
| `package-lock.json` | Retain Hermes' compatible development-only undici 8.12.3 patch unchanged. |
| Lake browser runner | Accept `QA_OUTPUT` so combined evidence does not overwrite the isolated PR #15 evidence. Assertions remain intact. |

## Actual verification

Supported **Node 24.15.0**, Chrome **146.0.7680.153**. `npm ci` installed all 37 development packages. [Full lint/test/build output](visual/release-1-2-integration/verification.txt), [summary](visual/release-1-2-integration/verification-summary.json), [fresh npm audit](visual/release-1-2-integration/npm-audit.json).

| Gate | Actual result |
| --- | --- |
| `npm ci` | PASS with the Hermes lockfile |
| `npm run lint` | PASS, exact inline source/styles, immutable embedded image bytes and standalone parity |
| `npm test` | PASS: all 13 programs, including `nino-art.test.mjs` (6 cases, 0 failures/skips) and `geography/lakes.test.mjs` |
| `npm run build` | PASS: six verified embedded images + six lake polygons, canonical preview and downloads; print freshness unchanged |
| `npm audit --json` | PASS: **0 vulnerabilities**; PR #15's prior dev-only undici finding is resolved by PR #14's lockfile patch |
| `npm run audit:release-1-2` | PASS: exact source/asset preservation, unchanged print/engines, identical canonical/two downloads/dist, byte-idempotent rebuild |
| `scripts/qa-nino-art.mjs` | PASS: all six rendered art roles, actual graded full Gold, no new Gold at pause/replay/miss, 2/6 mixed round, true 24th-retrieval trip to **Florence**, pending/error fallbacks and responsive controls |
| `scripts/geography/qa-lakes.mjs` | PASS: same six lake paths, baseline map dimensions/anchors, noninteractive order, scripting-disabled fallback, before/after and three offline app outputs |
| `scripts/qa-polish.mjs` | PASS: eleven chapter symbols/navigation, keyboard disclosures, all modes, baseline interrupted-save restoration, Gold/review/reward regressions at five sizes |
| `scripts/qa-findings-browser.mjs` | PASS: daily replay credit, no duplicate reward on resubmit/reload, valid schema 1/2 import and malformed imports preserving memory/storage |
| `npm run qa:release-1-2` | PASS: **both actual standalone files** and dist over `file://`, browser `offline:true`, all six images decode + all six lake paths match together; actual backup download → reset → file restore → reload preserves exact progress; real neutral keyboard picker grades correct answer |
| `git diff --check` | PASS |

Responsive dimensions are desktop **1440×1000**, iPad portrait **820×1180**, iPad landscape **1180×820**, phones **390×844 / 320×568**. Browser logs report zero page errors and external requests. All 27 point anchors and map ratio remain unchanged; no horizontal overflow or art covering answer/map controls. Reduced motion, image decode, long Dutch content, restored answered feedback, modal keyboard interaction and truthful reward state are checked. The short Arrival toast remains the original noninteractive overlay with `pointer-events:none`; its illustration does not add a blocking control.

## Combined evidence and reproduction

Fresh evidence is under [visual/release-1-2-integration](visual/release-1-2-integration); the retained `visual/release-1-2` and `visual/lakes` directories belong to the original separate feature runs. Original feature documents likewise describe their isolated scope. This combined report supersedes their lake-out-of-scope and old dependency-audit limitations for this candidate only.

Machine-readable combined results:

- [Nino](visual/release-1-2-integration/nino/browser-results.json)
- [Lakes and responsive anchor measurements](visual/release-1-2-integration/lakes/browser-results.json)
- [Learning/navigation/saves](visual/release-1-2-integration/polish/browser-results.json)
- [Replay/import safeguards](visual/release-1-2-integration/replay/browser-results.json)
- [Both offline downloads, images + lakes + backups + keyboard](visual/release-1-2-integration/combined-offline.json)
- [Changed-file manifest relative to pinned baseline](visual/release-1-2-integration/changed-files.json)

Screenshots were visually inspected in addition to automated checks:

- Before/after: [Release 1.1 welcome](visual/release-1-2-integration/nino/before-release-1-1.png), [combined welcome](visual/release-1-2-integration/nino/welcome.png), [desktop lesson with Nino and lakes](visual/release-1-2-integration/nino/desktop-guide.png).
- Northern lakes: [before](visual/release-1-2-integration/lakes/switzerland-before.png), [after](visual/release-1-2-integration/lakes/switzerland-after.png); Como's fork, Maggiore and Lugano remain separate, with Geneva at its unwarped position.
- Lazio/Bolsena: [before](visual/release-1-2-integration/lakes/lazio-before.png), [after](visual/release-1-2-integration/lakes/lazio-after.png); source-backed Bolsena remains northwest of Rome, below labels/points/rivers.
- [iPad portrait Guide](visual/release-1-2-integration/nino/ipad-portrait-guide.png), [iPad landscape real Arrival](visual/release-1-2-integration/nino/ipad-landscape-arrival.png), [390px Encourage on resume](visual/release-1-2-integration/nino/phone-encourage-resumed.png), [320px earned Gold](visual/release-1-2-integration/nino/small-phone-gold.png), [320px offline keyboard modal](visual/release-1-2-integration/offline-320-keyboard-picker.png).

```sh
# Supported Node 24.15.0; execute from this checkout, with pinned commits available.
npm ci
npm run lint
npm test
npm run build
npm audit --json
npm run audit:release-1-2
python3 -m http.server 8016 --bind 127.0.0.1
# In a second terminal, use installed Playwright/Chrome paths as needed:
export PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs
export CHROME_PATH=/path/to/chrome
TOPO_URL=http://127.0.0.1:8016/ QA_OUTPUT=docs/visual/release-1-2-integration/nino node scripts/qa-nino-art.mjs
QA_OUTPUT=docs/visual/release-1-2-integration/lakes npm run qa:lakes
TOPO_URL=http://127.0.0.1:8016/ QA_OUTPUT=docs/visual/release-1-2-integration/polish node scripts/qa-polish.mjs
TOPO_URL=http://127.0.0.1:8016/ QA_OUTPUT=docs/visual/release-1-2-integration/replay node scripts/qa-findings-browser.mjs
npm run qa:release-1-2
```

The source audit compares the immutable owner art Git objects; a fresh clone may need a read-only `git fetch origin 047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d`. Source provenance/license and the known upstream Maggiore/Como name correction remain in [geography/LAKES.md](geography/LAKES.md). No new lake approximation or geographic source is introduced by integration.

## Verdict and independent review handoff

**Codex verification verdict: CONDITIONAL HANDOFF.** All automated, rendered browser and offline gates above pass for the draft candidate; no known integration code failure remains. This is not Hermes' independent final verdict or owner visual approval. The exact candidate SHA is recorded in the draft PR/handoff; review that SHA, not moving individual feature branches.

**Hermes review request:** independently review this integration branch and exact SHA, including source preservation, conflict resolutions, both offline downloads, truthful Gold/Arrival, lake geometry/layer order, current screenshots and the combined test results. Publish **PASS / CONDITIONAL / BLOCKING**, findings and exact reviewed SHA on the integration PR. Do not duplicate implementation or merge/deploy. Hold for owner visual approval, including Encourage's supplied rays.

Physical iPad Safari, the child's feedback, assistive technology/on-screen keyboard and real print proof remain **not tested/accepted**. Future chapter scenes/postcards and app-icon choice remain pending. No changes to the owner art/design branch, target Release 1.1 branch, main or production were made.
