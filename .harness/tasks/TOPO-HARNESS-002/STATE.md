# TOPO-HARNESS-002 — persistent delivery state

Status: **BLOCKED — UPSTREAM_DIVERGENCE_OWNER_DECISION**
Local tested implementation:866a8b6fc1c19cc733acf19e550385fb3ae13ecf.
Original exact baseline: V1a86975272ee700d79ab04fe5429ab91165f2029d, PR73 untouched; PR71b06b130 unchanged.

Implemented approved plan; local full V1+V2 gate PASS,27 V2 tests plus unchanged V1/app suite and six offline browser contexts. Original pilot4f71f699 retained; corrected pilot866a8b6 durably interrupted/resumed, fresh actual gate PASS, then correctly BLOCKED at INDEPENDENT_QA awaiting authenticated Hermes response. No real REVIEW_READY or independent approval claim. Current brain and full evidence recorded in EVIDENCE.md.

Internal fresh review found7 Important issues; single RED→GREEN fix pass,27/27. Stale locks now require external exclusive owner recovery; no racy PID unlink. One deferred ledger crash-window limit is explicit in evidence/REVIEW.md. P001 stays separate at94d1390, unpromoted. Failure histories/counters retained; deliberate scope-rejection count1 was not reset. No unplanned full-gate failures.

Final upstream discovery: draft PR74 already exists atbeeaef406dc5338a4b43e2403a7d9b0519d1adc7 on remote agent/topo-harness-v2 with a parallel Claude continuation and revised P0/P1 contract. Local866a8b6 diverges; validation is not for that head. Owner asked whether to integrate the reviewed fixes into current PR74 preserving Claude work, or keep the candidates separate. Dependent integration is stopped until answer; no silent rebase/overwrite/force-push/duplicate PR.

Concrete runnable provisional HTML and34MB review archive retained under .harness/tasks/TOPO-PILOT-001/runs/current/. Final evidence-only preservation commit can pin these records without transferring exact-head QA. No merge/deploy/release, download/master replacement, external agent launch or schedule. Independent Hermes OPEN; owner merge/policy promotion OPEN.

Preservation branch: agent/topo-harness-v2-codex-reviewed; no second PR. Tested implementation remains866a8b6; preservation commit adds metadata/evidence only, verified against the original code digest. Remote PR74 is untouched.
