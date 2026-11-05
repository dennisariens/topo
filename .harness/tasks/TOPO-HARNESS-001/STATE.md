# TOPO-HARNESS-001 — persistent state

Status: **BLOCKED_ATTEMPT_LIMIT**
Branch: agent/topo-harness-v1
Base: PR71 b06b13059ff5e2ef7278c2d0c55597cf8a9435cf (owner-authorized)
Independent Hermes: OPEN. Overall gate: NOT EXECUTED/PASS NOT CLAIMED.

## Completed
- Accepted PR71 base and committed task contract/plan before implementation.
- Root/dev dependencies installed without changing app package/lock. Supported Node24.22.1 identified; host Node25.8.2 is outside jsdom's documented engine range.
- Fixed-action/path policy and cleaned environment implemented;6 policy/process tests pass (including timeout/failure/credential stripping/two-error stop).
- Artifact verifier and6 directed tests pass; missing dist correctly fails before build.
- Browser verifier and fail-closed test implemented. Chromium desktop verified full workflow.
- Initial check.sh/orchestrator and deliberate-rejection utility written, NOT yet integration-verified.

## Required stop — actual browser attempts
1. Both engines1500 failed a driver assertion that counted duplicated canonical/focus map-style controls. Adapted to unique metadata/visible controls.
2. Both engines1500 failed because map options are in a closed details menu. Adapted to real visible disclosure interaction.
3. Chromium1500 passed all checks; Chromium768 failed because mode tabs are inside closed Focus Menu. WebKit1500 failed backward selection because Home does not move the caret equivalently. Source fixes prepared: open Focus Menu and select with actual arrow keys. **No fourth execution.**

Exact engine/context failures: DEVELOPMENT-ATTEMPTS.json and evidence/browser-development*/. These are harness-driver failures, not proven app defects. Different errors occurred; no blind repeated retry, but maximum3 attempts for this step is reached.

## Still incomplete
- Latest browser fixes unverified. Full check.sh quality gate and real deliberate-rejection proof NOT EXECUTED.
- AGENTS refactor, task template/verifier and CI workflow NOT completed.
- No draft PR, push, merge, deployment, release or production action.
- Existing app/art/tests/lockfile/PR61/64/71 implementations unchanged.

## Resume requirement
Owner must explicitly authorize a fresh verification attempt after the three-attempt cap, or redirect this step. Preserve all failure evidence; do not mark browser or overall gate PASS from prepared code. On authorized resume finish remaining harness/CI pieces, execute gate and negative proof, then create one draft PR with exact evidence/Hermes handoff.
