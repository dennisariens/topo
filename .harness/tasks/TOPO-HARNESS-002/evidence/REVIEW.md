# Read-only internal review and single fix pass

Reviewer: fresh Codex agent, GPT-6 Astra high. Not independent Hermes. Reviewed4f71f699; no edits/tests/gates/browsers performed by reviewer. No Critical; seven Important findings.

Fixed with directed regression evidence:
1. Durable provisional manifest hash, explicit artifact entry, path/symlink/inventory checks and actual HTML hash; empty-files/self-declared hash cannot bypass validation.
2. Strict current scope/source/contract check before phase actions, QA consumption and finalization; actual dirty index.html regression proves unchanged HEAD is insufficient.
3. Removed automatic check-then-unlink stale-lock recovery. Both event/action locks fail closed; cleanup compares acquired inode. Owner/exclusive external recovery required.
4. Recovery/resume/QA/block require action ownership; CLI lease failures no longer mutate another worker's state. Actual active-owner recovery test leaves history unchanged.
5. Interruption fingerprint persists across resume and reaches same-error stop at2.
6. Required visual-QA instructions checked before verification, independent-QA route actually read; durable ledger and current hashes rechecked before QA/package. Reads remain used:false absent actual guided action evidence.
7. Brain compares independently derived current code digest, consumes exact evidence path, and binds repository event PR identity to actual evidence.

Observed RED on original public APIs: repeated interruption counter, live recovery, stale-lock auto-removal and self-compared brain digest. Other new guard tests began with missing guard exports. One green attempt exposed a fixture's /var versus /private/var read-path mismatch; fixture now obtains the actual canonical readSkill receipt. No assertions weakened. Final directed suite includes a real isolated Git fixture through signed fixture-QA→PACKAGE→REVIEW_READY. Fixture keys/gate rows are never real Hermes or pilot evidence.

Promised package components (skills, brain index, V1/V2 summaries) added, treating that omission as Important. Resume counter renamed resumptions; real human approvals counted separately. Wrapper ledger crash window deferred: stale action locks forbid unattended retry and require external reconstruction/owner recovery.

Ruling: stale lock recovery requires external exclusive owner review rather than automatic PID unlink; safer after review's concurrent-owner race. Cost: a crash holding a lock needs intervention by a supervisor with exclusive ownership.
Ruling: unit QA signing keys and fabricated gate rows test guards only, never real approval. Real pilot must remain BLOCKED until authenticated exact-source Hermes response.
Deferred minor: local wrapper failure ledger can miss the last failure if the process dies before persistence; operator must reconstruct from logs before owner-authorized stale-lock recovery. No host/distributed sandbox or global cross-machine retry claim.
