# V2 implementation plan

Goal: implement CONTRACT.md without product changes. Stack: Node built-ins, existing npm tools and dev-only pinned Playwright. Native implementation plus one read-only reviewer; no external agent assumed available. This plan is not implementation evidence.

## 1. Immutable baseline and additive verification
Create scripts/harness/v2/{scope,gate}.mjs and .harness/v2/README.md. scope(root) permits only new V2 infrastructure/brain/task paths and the exact CI dispatcher change; rejects application/V1 code/test/policy modifications, traversal, symlinks and dirty executable inputs. gate(root,task) executes original V1 gate in a frozen authenticated checkout, verifies all12 required results and exact SHA, then V2 tests and original/current byte preservation. Clone cleanup and full logs are mandatory. Keep V1 files untouched; only workflow command dispatch changes for V2. Test deliberate app corruption, V1 policy expansion, missing browser/result and nonzero subprocess. CI retains contents:read, immutable actions, no production operations.

## 2. Bounded resumable controller
Create scripts/harness/v2/{store,machine,controller}.mjs and .harness/v2/task-schema.json. openTask(dir) validates schema/history; appendEvent persists atomic sequence and snapshot under a single-writer lock; advance(root,task) uses fixed phase handlers and evidence guards. Persist an action-start before invocation; interrupted VERIFY is recorded interrupted and requires fresh verification, never inferred success. Block repeated identical errors (normalized fingerprint) twice or three failed attempts. Reject stale QA, bad phase, mismatched contract/SHA and forged REVIEW_READY events. CLI supports init/status/advance/resume/block; no arbitrary execute command. Regression tests launch/terminate/resume real child processes and cover competing writers/truncated snapshots/replay/failed phase recovery.

## 3. Skills and living brain
Create .harness/v2/skills/registry.json, pinned PR64 source+overlay, scripts/harness/v2/{skills,brain}.mjs and docs/brain/*.md/index.json. discoverSkills(config) checks explicitly configured roots without reading secrets; routeSkills(kind) selects applicable standalone skills; readSkill(id) hashes actual instructions; recordUse requires existing read hash plus concrete action artifact. Keep historical branch/test-count constraints from PR64 visibly superseded by current contract. reconcile(root,typedEvents) validates provenance/current SHA and source evidence before updating generated facts; stable source links own product/design decisions. Tests reject missing/unread/changed skills, React routing, unknown privacy fields, stale results, unapproved decision promotion and fabricated verification. Skill-name presence alone never counts.

## 4. Delivery metrics and reviewed evolution
Create scripts/harness/v2/evolution.mjs and .harness/v2/proposals/. Summarize recorded attempts/interventions/durations and null unavailable token/currency cost. Proposals cite exact observed defects and tests, remain PROPOSED. No auto-apply/merge path. Create separate agent/topo-harness-v2-improvement-* branch with one small actual regression-backed improvement; retain branch SHA/patch/results for independent review; do not merge it into V2 or promote gate/permission changes. Test that pending/unverified approvals cannot enable promotion.

## 5. Package and real pilot
Create scripts/harness/v2/{package,pilot}.mjs. Package only hash-verified original standalone HTML plus manifest, logs/screenshots, skill evidence, current brain references and QA handoff; never learner saves. Generate provisional bundle for independent QA; PACKAGE/REVIEW_READY requires actual exact-candidate QA. Pilot contract is verify/package frozen existing review candidate, not a product change. Run genuine V1+V2 checks, deliberately interrupt/restart controller, record persisted continuity. If trusted Hermes invocation/reply is unavailable, stop accurately BLOCKED at INDEPENDENT_QA and deliver provisional bundle. Unit QA fixtures must stay labeled fixtures and never satisfy real pilot approval.

## 6. Finalization
Commit candidate; execute comprehensive V2 gate once targeted checks pass. Retain failures and retry caps. Inspect screenshots and actual package HTML. Reconcile brain from executed output. Recheck remote PR73/71 heads; record drift/block rather than silently rebase. Commit evidence-only final pin, prove implementation unchanged, push V2 only, open one stacked draft PR. Record remote CI actual state, no inferred PASS. Hermes OPEN and owner approval separate.

## Review focus / risks covered by tests
- Crash between action completion and event persistence: no inferred success or duplicate unsafe action.
- Stale/forged evidence or changed input after verification: refuse PACKAGE/REVIEW_READY.
- Required skill selected but missing/unread or changed: block applicable work and reject usage claim.
- Source docs/events conflict or contain private payload: preserve provenance/status; reject unauthorized fields.
- Concurrent task writers/retry exhaustion: lock/error/block survives restart; no counter reset bypass.

## Test method
Write focused tests first, capture observed red output, implement smallest modules, capture green. Commands use supported Node24; node --test scripts/harness/v2/*.test.mjs, then new additive gate. Existing V1/npm tests remain unchanged and mandatory. Full browser matrix comes from real V1 execution plus V2-specific package/provenance/resume tests. No fake Hermes approval.
