# Pilot evidence — Claude Code execution

Executed by Claude Code in this checkout on 2026-11-06. Same task history across two commits: `3b8dfb92a7b36a113496691991cd59d6ee582460` then, through the real `repaired` command, `d225af2ff2ce551fc9cd73fc7f0c970e208f70e9`. Byte-identical copies, so the hash chain and gate hash stay verifiable. Excluded: generated HTML, raw logs and screenshots, which stay in ignored `runs/` on this host and in CI artifacts.

Sequence: a real controller was SIGKILLed while the real V1 gate ran, the replacement terminated the orphaned action tree, verified afresh and stopped at INDEPENDENT_QA. A metadata commit then took the same history through `repaired` and a second complete gate. `timing.json` holds only the latest verification, so metric duration is a lower bound.

This is implementer evidence. Hermes has not reviewed it, and no receipt exists. A task reached BLOCKED at INDEPENDENT_QA, never REVIEW_READY.
