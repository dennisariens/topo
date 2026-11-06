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

## Imported Codex pilot (executed by Codex, imported by Claude Code)
See `evidence/pilot-4f71f69/PROVENANCE.md`. At `4f71f69`: V2 gate PASS (4 V2 and 12 V1 steps, `gateHash` f2bb4970c312d7265d402bc49e64707f2058d125518c1398c064702ff91aa0ae), pilot BLOCKED at INDEPENDENT_QA. Not evidence for later commits.

Audit note, not V2 evidence: Claude Code ran the full gate at P001 head `94d1390` on Node 24.22.1 and it passed, local only. That commit is outside V2.
