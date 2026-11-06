# Independent controller/state/recovery/brain review

Reviewed and executed source: `beeaef406dc5338a4b43e2403a7d9b0519d1adc7`.
Pinned repository remained clean; no tracked edits, branch changes, npm/full-gate runs, remote updates, real action termination, global Brain/key/profile writes.

## Reproduction

```sh
TMPDIR=/Users/dennisariens/.hermes/cache/scratch PATH=/opt/homebrew/bin:$PATH /usr/local/bin/node /Users/dennisariens/.hermes/cache/scratch/hermes-harness-v2-review/recovery/proof.mjs
```

Node `v24.13.1`; modern Git `/opt/homebrew/bin/git` `2.53.0`. Final execution exited 0, all adversarial assertions satisfied. `results.json` contains machine-readable results and the retained fixture directory. The fixtures copy scripts or import pure/root-parameterized APIs; the copied controller CLI computes its root inside the fixture. Brain gate summaries are explicitly synthetic validator fixtures, not claimed delivery verification. Only owned fixture processes were signalled.

## Findings

### R1 — P1: recovery CLI bypasses the live runner lease and kills its action

Source: `scripts/harness/v2/controller.mjs:12,40-41`, versus lease acquisition at `16,18`; `scripts/harness/v2/store.mjs:12`.

`recover` and `resume` invoke `recoverAction` without `withRunLock`. A second CLI therefore ignores `runner.lock`, calls `terminateAction`, and changes the running task to INTERRUPTED. Proof `live-runner-recover` holds a valid live runner lease, launches a tracked fixture action, and invokes the real copied CLI `recover`. It exits **0**, kills that action with **SIGKILL**, and appends BLOCKED/INTERRUPTED with attempts **1**, while the lock owner is still alive and its lease exists.

Impact: a concurrent routine recovery/resume can destroy healthy verification and consume interruption budget. The original controller can subsequently process its killed child against a state already rewritten by the competing CLI. This is a local mutual-exclusion failure, not a missing distributed queue/consensus claim.

### R2 — P1: root exit discards recovery identity while descendants remain alive past deadline

Source: `scripts/harness/v2/action.mjs:9,11-14` (root-only identity check at 9; close unconditionally removes action record and clears timer at 14).

Proof `orphan-after-root-close` launches an owned root which starts a detached descendant and exits 0. `runTracked` reports root success, deletes `action.json`, and cancels its deadline; after the configured deadline the descendant is still alive. `terminateAction` returns `{terminated:false,pids:[]}` because the only identity record is gone. Fixture cleanup explicitly kills the owned descendant.

Impact: work can outlive its bounded action and survive subsequent recovery. The tree-stop algorithm only helps while the recorded root is alive; it cannot rediscover a reparented descendant after root exit. Gate/test subprocess early exits can therefore leave parallel work outside supervision. This proves the primitive failure, not that the pinned real full gate actually leaked a child.

### R3 — P2: successful verification does not break the controller's consecutive-failure streak

Source: `scripts/harness/v2/machine.mjs:18-19,23`; requirement `.harness/tasks/TOPO-HARNESS-002/CONTRACT.md:32,35`. The separate gate ledger reset exists at `scripts/harness/v2/gate.mjs:6,16`, but it does not reset controller counts.

Proof `success-does-not-break-consecutive-failures` records failure → descendant repair → successful `verified` → independent-QA block → another descendant repair → first failure. After successful verification controller counts remain attempts **1**, same **1**. The later failure reaches same **2** and BLOCKED, treating failures separated by success as consecutive. All **12** history rows remain present.

Impact: an otherwise repaired task can stop prematurely after a new-head verification failure despite a successful validation between failures. Preserve historical events while resetting active retry counters only after complete successful validation; do not reset them merely on repair. This finding concerns the controller counters, not the already-implemented `attempts.json` reset.

### R4 — P2: Brain freshness check reports PASS with dirty verification implementation

Source: `scripts/harness/v2/brain.mjs:8`; `scripts/harness/v2/scope.mjs:13`.

Proof `brain-dirty-code-still-pass` uses an isolated local Git fixture, records a summary with the actual fixture implementation digest, updates Brain and commits its evidence. The baseline check passes. It then changes a tracked `scripts/harness/v2/check.mjs` file without committing: `git status` reports `M scripts/harness/v2/check.mjs`, and the live implementation digest differs from the recorded digest, but `checkBrain` still returns **PASS**. It checks committed `from..HEAD` only, and checks neither dirty implementation nor the gate's implementation digest against current inputs.

Impact: operators may receive a clean Brain freshness verdict while executing materially different local verification code. This does not independently bypass the full delivery gate, which has stricter scope/dirty-input checks. Facts about the historical source commit can remain valid; the bug is the unqualified freshness PASS for the current working copy.

## Passing adversarial controls

- Mutated snapshot claiming REVIEW_READY is ignored; sequenced events replay to VERIFY.
- Truncated event history fails closed rather than falling back to cache.
- Bounded `run` permits exactly one fresh verification after interruption; a second consecutive interruption stops at same=2.
- A live owned PID with mismatched recorded start identity is not signalled.
- Skill selection/read do not imply usage; missing required skills block; changed instructions and missing concrete usage evidence are rejected.

## Scope / limitations

No full gate, dependency install, actual pilot re-execution, real keys/approvals, package/trust/handoff acceptance, or external-state mutation was attempted. Tree PID-reuse races beyond the start-identity mismatch control were inspected but not claimed proven. No issue is raised for the expressly excluded external supervisor/distributed-consensus responsibilities. All artifacts and fixture repositories are retained exclusively under this recovery directory.
