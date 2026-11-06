# TOPO-HARNESS-002 — persistent state

Status: IMPLEMENT (continuation in progress; see Owner continuation below)
Implementation: owner approved plan; core/knowledge/controller tests RED→GREEN; additive gate and pilot implementation in progress. No app changes.
Owner outcome: supplied V2 mission. Design/plan: proposed in CONTRACT.md and PLAN.md.
Branch: agent/topo-harness-v2; exact start a86975272ee700d79ab04fe5429ab91165f2029d.
V1 PR73: untouched; remote exact head confirmed; GitHub verify SUCCESS (run42181119560).
PR71: frozen V1 underlying baseline b06b13059ff5e2ef7278c2d0c55597cf8a9435cf.
Independent Hermes: OPEN. No approval or invocation claimed.

Preflight: read existing AGENTS/project state/decisions/V1 policy/tests and PR64 skill. Installed Codex and Hermes skill paths inspected; hermes CLI exists but authenticated execution/independent response unverified. Native worktree creation failed before creating a checkout (not a Git repository in tool host context); isolated git worktree fallback succeeded at exact authorized SHA. No V1 files changed.

Attempts: native worktree creation1 failure, Git fallback1 success; no implementation/gate attempts yet. Retry limits remain3 failed attempts per step / same error twice. No overrides.

Builder review completed: three routine corrections incorporated (CI retains both tasks; every new commit invalidates independent QA; package file allowlist excludes backup/storage payloads). No owner-only ambiguity found. Owner approved plan. Implementation now has15 directed passing tests and isolated locked dev dependencies. Next: commit candidate, prove actual scope rejection, execute real interrupted/resumed pilot and full frozen-V1/additive gate. No merge/deployment/publication/download or master replacement authorized.

## Owner continuation — 2026-11-06, Claude Code
Audit: Codex's `agent/topo-harness-v2` existed only locally; no commits were lost because `4f71f69` was contained in the pushed improvement branch, but pilot results lived only in ignored `runs/`. Claude Code stopped and reported. The owner accepted the audit and chose `4f71f699ee82c6be9ab7f18609ba502097f8877f` as baseline.

Done: full SHA and ancestry verified; branch published without force; V1 `a869752` and improvement `94d1390` unchanged. Codex pilot evidence imported to `evidence/pilot-4f71f69/` with provenance. Codex executed it; it is not evidence for later commits. P001 remains excluded from V2.

Claude Code continues on this branch against the P0/P1 list in CONTRACT.md. Hermes: OPEN. No merge/deploy/release authorized.
