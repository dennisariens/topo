# TOPO-HARNESS-001 — accepted implementation contract

Status: IMPLEMENTING. Owner clarification: **PR71** (5 November2026) supersedes the original main-only base requirement. Branch agent/topo-harness-v1 is rebased onto exact PR71 b06b13059ff5e2ef7278c2d0c55597cf8a9435cf; PR61/64/71 application branches remain unchanged.

Deliver: concise <=40-line AGENTS, task template/verifier/permissions, executable root check.sh, minimal scripts/harness utilities, persistent attempts/state/evidence, least-privilege PR CI, one draft PR stacked on PR71. No app/art/test/package/runtime changes, merge/deploy/release or production actions. School codes stay reference data; three-stage Discover/Point/Write and Gold,45 objects/11 chapters, two maps, Nino/pizza/Vespa, saves/resets/backups and file:// stay intact.

## Gate obligations
1. Enforced path/command allowlist, cleaned child environment without inherited credentials, immutable application comparison to pinned base.
2. Disposable shared Git clone; copy installed dev dependencies, run build/lint/full npm tests and existing release/map/V2 preservation audits there. Never modify the source app with build outputs.
3. Required standalone byte parity/inlining/invariants and Chromium+WebKit file:// checks, including320px/tablet/desktop, F1 and real save/reward interactions. A missing browser/tool/dependency is failure, not skip.
4. Harness unit tests must exercise denied commands/paths, missing/failed steps, timeouts and persistent two-identical-failure stop. No automatic retries; maximum3 per step and stop at same error twice.
5. Deliberately corrupt a standalone alias only in disposable workspace and invoke real check.sh; expect nonzero,GATE: FAIL,specific protected-file rejection and no GATE: PASS. Restore only the disposable copy afterward.
6. Record exact source SHA, code digest, artifact SHA256, all step exits/durations, logs, environment and known limits. Typecheck remains explicitly no-op, never type-safety evidence.

Permissions are enforced within the harness through fixed operations, path validation, pre/post source checks, clean environment and read-only CI credentials. This is not a host-level jail for an independently running agent/admin; no YAML-only sandbox claim. CI has no deploy step/secrets and never uses pull_request_target.

Codex/internal reviewers implement/check; Hermes independently verifies exact candidate afterward; FARIS/Main coordinates; owner controls merge/release. Independent Hermes remains OPEN until actual response.
