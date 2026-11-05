# TOPO-HARNESS-001 — initial task contract

Status: pre-implementation; base decision BLOCKED.

## Requested outcome
A lightweight reproducible/recoverable TOPO agent harness, one draft PR, Codex implements/Hermes independently verifies/FARIS coordinates/owner approves merges and releases. No application redesign, merge, deployment, release publication or production changes.

## Required work
Concise <=40-line operational AGENTS.md preserving project rules by reference; .harness/task-template.md, verifier.md, permissions.yaml and task CONTRACT/STATE/EVIDENCE; executable check.sh and minimal scripts/harness verification; least-privilege pull-request CI without deployment.

Required gate: existing lint/tests/build, standalone integrity and actual relevant offline browser verification. Skipped/unavailable/failed required checks cannot yield GATE: PASS. Typecheck is a documented no-op, not type safety. Prove deliberate failure rejection. Permissions must have technical enforcement, not YAML-only claims. State/evidence must persist exact source and executed results.

## Baseline and scope
User explicitly requires isolated branch agent/topo-harness-v1 from main. Created from main7e38160cb2f1f1c159c907e0150464b78c761f38; no PR61/PR64 implementation is checked out for editing, merged, overwritten or cherry-picked. Preserve45 items/11 chapters, teaching/Gold/maps/school codes, Nino/art/rewards, saves/resets/backups and offline file://. Never alter existing tests merely for green.

## Retry/stop rule
Maximum3 attempts per failed step; stop after the same error occurs twice. No retry of a deterministic baseline contradiction. Record actual attempts and blockers. An attempt to inspect iMac in the preceding diagnostic turn failed SSH authentication; it was not retried or bypassed.

## Blocking question
main has discover/point/write/codes and no Discovery map module; PR61 has discover/point/write plus both map styles, and PR64 is based on61. Implementing the requested modern invariants on main would require application changes/importing an unmerged implementation, expressly prohibited. Silently skipping those required invariants would permit false acceptance. Owner must clarify whether the harness guards actual old main (with modern requirements deferred), or authorize a modern baseline. No implementation/gate PASS is claimed.
