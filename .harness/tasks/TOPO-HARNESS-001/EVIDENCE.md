# TOPO-HARNESS-001 — evidence history

This is baseline evidence only, not a quality-gate or implementation acceptance report.

## Remote inspection
GitHub open PR inspection: no harness PR. `git ls-remote --heads origin agent/topo-harness-v1` and harness-name variants returned no branch. main fetched successfully. PR61/PR64 remain open, unchanged.

## Exact source comparison

```json
{
  "main": {
    "sha": "7e38160cb2f1f1c159c907e0150464b78c761f38",
    "testPrograms": 7,
    "routeStages": "['discover', 'point', 'write', 'codes']",
    "discoveryMapModulePresent": false,
    "TopoAtlasInHtml": false,
    "htmlBytes": 694547,
    "htmlSha256": "79e11c495f4b6ecae54a88602d30ee24b73c484a4571448345139eba41a2992e",
    "typecheck": "node -e \"console.log('No type checker configured: standalone JavaScript baseline')\"",
    "packageScripts": [
      "dev",
      "lint",
      "typecheck",
      "test",
      "build"
    ]
  },
  "PR61": {
    "sha": "1bf86b3e1c69319bed8ef877243070a64d97a12e",
    "testPrograms": 17,
    "routeStages": "['discover', 'point', 'write']",
    "discoveryMapModulePresent": true,
    "TopoAtlasInHtml": true,
    "htmlBytes": 3152649,
    "htmlSha256": "422f39dd06cb2ea2d6524ce07e4524738aa425aef5c5e54d63b55d90b54143a9",
    "typecheck": "node -e \"console.log('No type checker configured: standalone JavaScript baseline')\"",
    "packageScripts": [
      "dev",
      "lint",
      "typecheck",
      "test",
      "build",
      "release:check",
      "geography:lakes",
      "qa:lakes",
      "qa:release-1-2",
      "audit:release-1-2",
      "qa:schoolblad",
      "qa:discovery",
      "qa:map-hit",
      "qa:focus"
    ]
  },
  "PR64": {
    "sha": "940a6a50ec74331a2b2864a904ad4d3c04f5645d",
    "testPrograms": 17,
    "routeStages": "['discover', 'point', 'write']",
    "discoveryMapModulePresent": true,
    "TopoAtlasInHtml": true,
    "htmlBytes": 3152649,
    "htmlSha256": "422f39dd06cb2ea2d6524ce07e4524738aa425aef5c5e54d63b55d90b54143a9",
    "typecheck": "node -e \"console.log('No type checker configured: standalone JavaScript baseline')\"",
    "packageScripts": [
      "dev",
      "lint",
      "typecheck",
      "test",
      "build",
      "release:check",
      "geography:lakes",
      "qa:lakes",
      "qa:release-1-2",
      "audit:release-1-2",
      "qa:schoolblad",
      "qa:discovery",
      "qa:map-hit",
      "qa:focus",
      "qa:ux52"
    ]
  }
}
```

main's docs/PROJECT_STATE.md explicitly describes four phases ending in Schoolcodes, a worksheet photograph overlay and7 test programs. PR61 contains the later Discovery style, three-stage route and17 programs. PR64's declared base is PR61 and adds scripts/ux-desktop-52.js/css and a dedicated preview; it is not merged into main. This confirms a task/base mismatch, not an inferred runtime failure.

## iMac visibility limitation
A previous read-only SSH probe from mac-mini.lan to imac-van-dennis.lan failed authentication. No iMac task STATE/logs were read, so its actual stopping reason remains unconfirmed. The initial mission supplied by the owner was sufficient to identify the baseline conflict locally.

## Delivery status
Only these persistent contract/state/evidence files have been added. check.sh, enforcement, CI, deliberate-failure test and full quality gate are NOT IMPLEMENTED/NOT EXECUTED. No GATE: PASS or completion claim. No app/art/test changes and no PR61/64 edits.


## Implementation progress and stop (5 November2026)
Owner selected PR71; branch rebased onto b06b130 with no application merge or changes. Unit evidence: policy/process6PASS, artifacts6PASS, browser fail-closed testPASS. Browser development attempts are retained verbatim in evidence/browser-development*, summarized in DEVELOPMENT-ATTEMPTS.json. Attempt3 achieved Chromium desktopPASS, but responsive/WebKit driver errors remained; fixes are prepared and not executed after cap. Overall check.sh/CI/negative-gate proof remain unverified/incomplete. No GATE:PASS claim.

No iMac stopping cause has been confirmed; SSH access was denied earlier. The current stop is the mission's explicit maximum-three-attempt rule, not an assumed platform limitation.


## Authorized continuation and implemented candidate
Owner explicitly authorized one additional browser check; attempt4 passed both engines/three widths. DEVELOPMENT-ATTEMPTS.json retains every prior failure and the exception. App and existing tests remain byte-unchanged relative to PR71. Added unit evidence covers policy/process/artifacts/missing-browser/contracts/disposable identity, source cap/credential removal, repeated-error normalization and actual npm startup. CI is reviewable configuration; remote execution is not claimed until observed. Next action is actual complete check.sh on a committed candidate, including deliberate rejection through real entrypoint.


## Final executed local gate — 6 November 2026

**GATE: PASS**, all 12 required steps executed; none skipped. Tested implementation SHA: `d141caf59d69e4932bf2d426850fab69f10f969f`. Any later handoff/evidence-only commit must have zero code/artifact difference from that SHA. Review the exact final PR-head SHA in the PR description, not an inferred moving branch.

- Full unabridged output: [full-quality-gate.log](evidence/full-quality-gate.log).
- Machine results/source digest: [summary.json](evidence/final-gate/summary.json); digest `5428d1557905887c6e20d1d75ea73fd4690a8ce831f2c475b492fe1ff5380b32`.
- Node24.22.1; 18 harness tests PASS, existing full npm test suite (20 programs) PASS; build/lint/release/map/V2 audits PASS. The existing typecheck is a no-op and provides no type-safety evidence.
- Artifact SHA256: `933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35`, 40,999,720 bytes; required aliases/dist, inline assets and45/11/stages/two maps/code/art preservation PASS.
- [Browser results](evidence/final-gate/browser/summary.json): Chromium156.0.8078.4 + WebKit27.2,1500/768/320px, offline file://. All six fresh contexts PASS: map styles in Discover, F1 exact question/draft/backward selection and disk preservation, Reisboekje, genuine answer/duplicate guard/reload, backup/reset/import. No external requests or console/page errors. Backup/reset controls are exercised at desktop size after the responsive interactions.
- [Actual rejection proof](evidence/final-gate/negative-proof.json): deliberate standalone-alias corruption in authenticated disposable clone; real check.sh exit1 with `GATE: FAIL — DENIED source modification: output/html/TOPO-NINO-Computer-Release.html`; no terminal PASS. Original app untouched.
- Original source unchanged at end; PR71 baseline remains `b06b13059ff5e2ef7278c2d0c55597cf8a9435cf`. Only allowlisted harness/instruction/docs files differ; root app/package/lock/existing tests/art are unchanged.

### Full-gate failure history
Retained in evidence/gate-failure-1, -2 and -3. First run passed all browsers but negative proof encountered an earlier generated audit report; fixed by restoring committed inputs only after clone authentication. Second run encountered writing-sheet interception while selecting map style on WebKit768; style checks now precede writing. Third run found the driver closed an already-open disclosure; conditional opening fixes it. Two browser-step failures had different fingerprints; final allowed attempt passed. Original three development failures and explicit owner-authorized continuation remain separately recorded. Final read-only internal review found no further concrete correctness/security/false-PASS issue; this is not Hermes acceptance.

### Limitations and independent handoff
**Hermes: OPEN.** Check out exact PR head, confirm its evidence-only difference from tested implementation, follow .harness/verifier.md and independently rerun check.sh. Owner retains merge/release approval. No merge, deploy, release publication or download/master replacement occurred.

CI configuration is reviewable; remote execution/status must be read from GitHub and is not inferred from local PASS. Enforcement covers fixed runner actions/paths, clean subprocess environment, original-source checks and least-privilege workflow; it is not a host OS sandbox. Failure ledger is local; fresh CI checkout is not cross-machine retry enforcement. WebKit is not physical Safari/iPad certification, and one real answer per context is not a full natural11-chapter playthrough. Artwork warning, folio resolution, reconstructed Venezia border and definitive visual acceptance remain open owner decisions outside this infrastructure task. The iMac stopping cause remains unconfirmed.
