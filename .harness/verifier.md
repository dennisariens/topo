# Independent verification handoff

Hermes verifies the exact candidate after Codex's executed evidence; internal agent review is not independent Hermes acceptance.
1. Check out the immutable PR-head SHA named in EVIDENCE; verify any later evidence-only pin has no code/artifact difference from the tested implementation.
2. Inspect the CONTRACT, STATE, attempt ledger and original failures/owner exceptions. Do not erase blockers or infer release approval.
3. Follow README setup with supported Node and lock-pinned dev-only Playwright; run the real `./check.sh TOPO-HARNESS-001`.
4. Read every required step's exit/status and source/artifact hash. Missing browsers/dependencies or interrupted/timeout commands must fail the gate.
5. Inspect policy, CI contents-read/persist-credentials:false, clean child environment, disposable-clone identity and enforced fixed commands/paths. Check the documented host-level limits.
6. Inspect `negative-proof.json`: actual entrypoint, corrupted disposable alias, nonzero exit, specific denial, no terminal PASS. Verify original application bytes remain the pinned baseline.
7. Browser evidence must cover both engines/all widths and real interactions; don't call screenshots, fixtures or metadata-only checks natural full-route play.
8. Return exact-SHA PASS/REWORK with evidence and unresolved limits. Keep owner merge/release approval separate.

A local GATE: PASS does not mean remote CI ran, physical Safari passed, GitHub branch protection is installed, or Hermes/owner accepted the candidate.
