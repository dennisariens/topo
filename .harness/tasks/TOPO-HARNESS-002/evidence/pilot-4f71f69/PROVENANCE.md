# Imported pilot evidence — original Codex execution

Executed by Codex at `4f71f699ee82c6be9ab7f18609ba502097f8877f` on 2026-11-06 in the worktree `projects/topo-harness-v2`. These results were never pushed because `runs/` is git-ignored. Claude Code imported them on owner direction; Claude Code did not execute them and they are not evidence for any later commit.

Files are byte-identical copies, so the event hash chain and `gateHash` stay verifiable. `SHA256SUMS.txt` lists them. Excluded on owner direction: the 41 MB generated HTML, raw logs, screenshots and the derived `snapshot.json`. A secret/learner-data scan of these files found only the manifest's `learnerDataIncluded: false` flag. Absolute paths name the original host worktree and are retained because editing them would break the hash chain.

Result: the gate passed all 4 V2 and all 12 V1 steps, then the pilot stopped BLOCKED at INDEPENDENT_QA with AUTHENTICATED_HERMES_RESPONSE_REQUIRED. The interruption occurred after the verification intent was persisted and before any verification subprocess started. Hermes did not review this run.

`attempts-after-rejection.json` was written at 09:24:35 by the deliberate scope rejection and was still present after the gate passed at 09:29:54. It is the observed RED for the failure-ledger defect.
