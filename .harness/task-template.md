# Task <ID> — contract, state and evidence

Create `.harness/tasks/<ID>/CONTRACT.md` before implementation:
- Actor/problem, authorized outcome, non-goals and acceptance oracles.
- Exact approved base SHA/PR, owned paths, immutable application/invariants and dependencies.
- Required commands/browser environments; unavailable checks fail, never silently skip.
- Role allocation: Codex implementation, independent Hermes verification, FARIS coordination, owner merge/release.
- Stop/recovery: max3 failed attempts per failed step, same error twice; record any owner exception.

Create `STATE.md`: status, exact source, current step, attempt/fingerprint history, blocker, next permitted action and untested work.
Create `EVIDENCE.md`: exact source/code/artifact hashes, full run path/output, step exits, real vs fixture coverage, negative proof and limitations.
Use `.harness/verifier.md` for the handoff. Do not put credentials, learner personal data or a fabricated independent verdict in evidence.

V1 is a harness-only permission scope pinned to PR71. A later application task needs an explicitly reviewed scope/base-policy change; do not casually expand allowlists to make a failing gate green.
