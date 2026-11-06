# V2 pre-implementation evidence

- Created contract, plan, risks and initial state before coding.
- git HEAD at isolation: a86975272ee700d79ab04fe5429ab91165f2029d; V1 worktree was clean.
- PR73 remote head same, draft OPEN; verify SUCCESS: https://github.com/dennisariens/topo/actions/runs/42181119560 . V1 independent Hermes remains OPEN; CI success is not independent acceptance.
- PR64 remote940a6a50ec74331a2b2864a904ad4d3c04f5645d contains .agents/skills/topo-ui-design/SKILL.md, absent in V1. Inspected via git show; no product implementation copied.
- Codex design skills available: frontend-design, ui-ux-pro-max, web-design-guidelines, frontend-testing-debugging. Availability is not usage. Hermes local skills and CLI discovered; no external agent launch or provider authentication tested.
- V1 policy rejects docs/brain. Proposed additive verification boundary and narrowly scoped CI dispatcher documented in CONTRACT; no V1 gate/policy changes made.
- Auto-suggested Vercel workflow/verification instructions and official docs inspected. V2 does not adopt Vercel services/SDK or deploy; local Node/persistence suffices for bounded execution. No unsupported claim of durable external infrastructure.
- No implementation tests or V2 gate run yet. No completion claim.

- Read-only builder check found three routine design gaps, now corrected before implementation: additive CI evidence upload, exact-head QA invalidation after any commit, and strict package file allowlist excluding backups/storage JSON. Reviewer is not independent Hermes.

## Corrected Codex candidate — executed, not the remote PR74 head

Tested implementation: `866a8b6fc1c19cc733acf19e550385fb3ae13ecf`; implementation digest `d9011582f98448a9f33cacd3d83f5f29b3b8b3eb10912ec0c2f4918993db115a`.
Actual full local V1 and V2 gates PASS: 27 directed V2 tests,18 unchanged V1 harness tests, all20 existing app test programs, build/lint/release/map/V2 audits, standalone integrity, Chromium+WebKit1500/768/320, genuine F1/question/draft/backward selection/Reisboekje/answer/reload/reset/backup/import, actual rejection proof. None skipped. Source-unchanged PASS. Complete output: evidence/full-quality-gate.log; structured results: evidence/final-gate/summary.json. Browser screenshots: evidence/final-gate/v1/browser/. V1 remains exacta869752; app/art/root dependencies/existing tests unchanged. Typecheck remains a no-op.

Actual corrected pilot: intent writer SIGKILL before verification subprocess launch → persisted interruption → explicit resume → fresh complete verification → actual provisional bundle → BLOCKED at INDEPENDENT_QA / AUTHENTICATED_HERMES_RESPONSE_REQUIRED. Durable events (byte copy from JSONL, named events.log), state, skills, timing, resume proof and manifest: evidence/final-pilot/. No test fixture keys/gate results are counted. Only the labeled unit fixture reaches REVIEW_READY.

App HTML remains40,999,720 bytes, SHA256 `933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35`. Runnable separate copy is under `.harness/tasks/TOPO-PILOT-001/runs/current/review-package/TOPO-NINO-provisional-review.html`. Delivery envelope archive (ignored development artifact): `TOPO-HARNESS-V2-PROVISIONAL-866a8b6.tar.gz` in the same task's runs/current. It includes the sealed hash-bound bundle plus V2/full test logs, durable events, actual resume proof and internal review. No existing download/master replaced; no learner backup/storage files included. Archive is provisional and not a release.

Brain was reconciled from the actual final gate with independently derived current implementation digest and exact consumed evidence path; PR74 repository metadata was independently reconciled as a historical event with exact PR identity and hash. Canonical product/design decisions remain untouched. Skill evidence separates actual process-skill usage from selected/available/read design instructions. No UI design usage or Hermes execution is inferred from a name/read. Metrics: evidence/delivery-metrics.json; token/currency costs unknown/null. Browser thumbnails/screenshots are actual journeys at tested viewports, not full visual certification. Physical Safari/iPad/IME/VoiceOver and owner artwork/folio/Venezia/final visual acceptance remain OPEN.

Internal review's seven Important findings fixed in one pass with directed tests; see evidence/REVIEW.md, review-observed-red.log and final-directed.log. One fixture adjustment canonicalized macOS /var read paths. No assertions or old app/V1 tests weakened. Rulings: fail-closed stale locks require exclusive external owner recovery (cost: intervention after lock-holding crash); fixture signatures never count as real QA. Deferred minor: local wrapper ledger crash before persistence needs reconstruction from logs during stale-lock review; no automatic recovery/OS/global-agent enforcement claim.

P001 implemented separately, not promoted: branch `agent/topo-harness-v2-improvement-fresh-package`, commit `94d13908693fa408bc066ee0ca0bcb1fc1f68f28`. Red→Green16/16 on that proposal. Main V2 controller already insists on a fresh bundle and validates complete inventory; proposal adds the standalone library boundary. Evidence-backed generated proposal: evidence/improvement-proposal.json. Independent and owner promotion OPEN.

## Final upstream check / blocking ownership decision

Read-only discovery: PR74 already exists on remote `agent/topo-harness-v2` at `beeaef406dc5338a4b43e2403a7d9b0519d1adc7`, with Claude continuation commits after shared4f71f699, revised owner P0/P1 contract, its own executed evidence/handoff and CI SUCCESS. Remote snapshots: evidence/upstream-pr74.json, upstream-pr73.json and upstream-pr71.json. V1/73 remainsa869752; PR71 remainsb06b130.

This local reviewed candidate diverges from that continuation. Its validation must NOT be attributed to PR74's head. No force-push, replacement, branch merge/rebase or duplicate PR. Preserve this candidate/evidence separately; await owner's explicit choice to reconcile reviewed fixes into current PR74 while preserving Claude's additions, or keep candidates separate. Original plan explicitly stops on upstream drift. Hermes review remains OPEN on both candidates; no acceptance or release authority inferred from remote documents/CI.
