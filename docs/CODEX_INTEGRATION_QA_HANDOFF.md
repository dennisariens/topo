# Codex — independent technical QA handoff

**Role separation:** Hermes is lead integration engineer, not the independent reviewer. Codex owns a fresh independent technical review. Previous PR text requesting independent Hermes QA is superseded by the owner's current mission. The inherited author tests and this lead evidence do not establish independent acceptance.

**PR:** https://github.com/dennisariens/topo/pull/61 (existing draft, no duplicate PR).

**Exact review target:** use the full 40-character **final SHA posted in the PR61 lead-integration handoff comment**. Do not review a moving branch or the older author commit. The runtime payload is unchanged from `b3540f72b2e21ede842bd38051e6a7015eaa0aa6`; the new commit adds lead evidence and executable QA. Review the complete tree, not just the stacked PR diff. Base remains the existing PR51 offline-computer branch; no merge is authorized.

**Artifact:** `output/html/TOPO-NINO-Computer-Release.html`, 3,152,649 bytes, SHA-256 `422f39dd06cb2ea2d6524ce07e4524738aa425aef5c5e54d63b55d90b54143a9`.

[Anonymous direct download](https://github.com/dennisariens/topo/releases/download/topo-nino-computer-approved-artwork-rc-20261030/TOPO-NINO-Computer-Release.html)

**Owner SVG:** `assets/map-selection/TOPO-Rome-Vaticaanstad-approved-refined.svg`, SHA-256 `c2d66a994879ecc125e2bb3d01accbc8a10730d990b85ee13eb5b050e797c70c`. This exact approved source is definitive; do not invent a replacement or begin a design iteration.

## Acceptance checklist

1. Pin the target SHA in a disposable checkout. Rebuild and compare all required standalone outputs to the released bytes. Run lint, build, all17 test programs, preservation and geographic audits. Typecheck is a documented no-op, not a passing TS gate.
2. Download the published file independently; verify checksum, then open **the downloaded file** using `file://` with network disabled, fresh storage and no server. Check embedded assets, startup/console errors, pointing/writing, reload and real backup export/import. Do not overwrite learner data.
3. Check all45 stable objects and all11 chapters, Discover→Point→Write, Gold, Nino, onboarding, pizzas/Vespa and progress/reward anti-replay. Add independent failure-path browser checks; inherited green scripts are evidence, not a substitute for your judgment.
4. Inspect original-size visuals: approved Rome circle/Vatican enclave, tips at `(221,88)` / `(170,128)`, typography/colors/drawing and responsive badge treatment. Verify both neutral number orders select stable IDs, wrong answers fail, and Point/Test/Gold never reveal the requested answer. Inspect Naples/Vesuvius, Catania/Etna, Milan/Varese, Bologna/Modena, San Marino, Po/Po Valley, Tuscany and Apennines. Preserve canonical geography unless a genuine defect is demonstrated.
5. Distinguish the **per-item question fixtures** from a natural-route all45 playthrough. Verify no inaccessible object and independent geographic source limits; eight schematic extents are not freshly GIS-certified.
6. Recheck finite overlap evidence honestly: 679/799 addressable cells pass, 1,358 same-XY mouse taps; 120 unaddressable integer-pixel border samples are exclusions, NOT passes or continuous-space coverage. Let layout/pan settle before addressability assertions.
7. Native Safari is a separate **open gate**: lead safaridriver attempt was blocked by disabled Allow Remote Automation. Chrome156 and WebKit27.2 passed all45 offline; WebKit is not native Safari. Do not enable settings without owner approval or claim physical iPad/OS keyboard/IME/VoiceOver acceptance from emulation.

## Reproduction and evidence

[Lead report and commands](INTEGRATED_RELEASE_CANDIDATE.md) · [machine summary](qa/integration-lead-20261030/summary.json) · [Chrome 45-row ledger](qa/integration-lead-20261030/integrity/ledger.json) · [WebKit 45-row ledger](qa/integration-lead-20261030/webkit/ledger.json) · [download proof](qa/integration-lead-20261030/download/verification.json) · [screenshots](qa/integration-lead-20261030/selection/) · [owner-source comparison](qa/integration-lead-20261030/fidelity/).

Execute `bash scripts/validate-integrated-release.sh` with `PLAYWRIGHT_MODULE` and Node24 as documented. Native Safari probe is separate. Raw gate logs are committed. Test only fresh/disposable contexts.

## Return contract

Post **PASS / CONDITIONAL / FAIL** on PR61 with the exact reviewed SHA, artifact checksum, independently executed commands/browser flows, visual findings, source/fixture limits and unexecuted gates. Do not call this an independent PASS merely because existing reports are green. **Do not merge, deploy, publish a final release or redesign artwork.** Owner approval remains required after review.
