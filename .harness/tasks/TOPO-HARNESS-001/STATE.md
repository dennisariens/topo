# TOPO-HARNESS-001 — persistent state

Status: **READY_FOR_FULL_GATE**
Branch: agent/topo-harness-v1
Base: PR71 b06b13059ff5e2ef7278c2d0c55597cf8a9435cf (owner-authorized)
Independent Hermes: OPEN. No merge/release authorization.

## Progress
- Accepted contract/initial state committed before implementation; original main mismatch resolved by owner selecting PR71.
- Three browser development attempts failed on driver assumptions. Stopped and asked; owner explicitly authorized one additional attempt.
- Authorized attempt4 **PASS**: Chromium/WebKit at1500/768/320,45/11/3stages/two styles/referencecodes, F1/backward selection/book, one actual correct answer/reward guard,reload, real backup/reset/import. Exact evidence: evidence/browser-authorized-4/summary.json.
- AGENTS36lines, templates/verifier, technically enforced runner policy, isolated workspace identity, attempt/fingerprint handling, dev-only lock-pinned browser tooling and least-privilege reviewable CI are implemented.
- Internal review identified disposable-guard/fingerprint issues; fixes have directed tests and read-only re-review with no further concrete finding.
- Full check.sh and actual rejection proof are next; no overall GATE:PASS claimed yet.

## Retry history
Original failures and exception retained in DEVELOPMENT-ATTEMPTS.json and evidence/browser-development*/. No unauthorized fourth retry occurred. Additional unit development corrected a noncanonical macOS temp path in clone-identity fixture and distinct npm config paths; current unit results are retained separately. Gate subprocess failure ledger is local attempts.json; CI starts fresh checkout and never claims cross-machine agent enforcement.

## Next
Commit candidate, run ./check.sh using supported Node24, preserve complete logs and rejection proof. Stop on two identical failures or three failed attempts for any gate step. Then prepare one draft PR/Hermes exact-SHA handoff; never merge/deploy/publish.
