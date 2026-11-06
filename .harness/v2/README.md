# TOPO harness V2 — proposed, not promoted

Exact V1 baseline: a86975272ee700d79ab04fe5429ab91165f2029d. V1 source/test/policy/check.sh are unchanged. Owner approved task002 plan. Product/app/art/dependencies/tests are immutable. This is one stacked draft, not production deployment.

## Run (Node24, existing locked dev dependencies)

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm ci --prefix .harness/tooling --ignore-scripts --no-audit --no-fund
node .harness/tooling/node_modules/playwright/cli.js install --with-deps chromium webkit
node --test scripts/harness/v2/*.test.mjs
node scripts/harness/v2/gate.mjs
node scripts/harness/v2/pilot.mjs
node scripts/harness/v2/controller.mjs status
```

The V2 gate first tests V2 then executes all original V1 steps in the exact frozen V1 checkout, including original tests, build, audits, both offline browser engines and the actual rejection proof. It does NOT run V1 directly on the V2 tree: V1's scope correctly rejects docs/brain. V2 separately rejects every current product or V1 implementation change, and only permits the exact additive CI dispatcher/upload change. No skip/PASS override flags. Every required result must exist. Code must be committed; task STATE/EVIDENCE are the only allowed dirty inputs. Full logs are retained under task002/runs. V1 backups/storage are omitted from copied evidence.

## Bounded executable controller

`init`, `run`, `advance`, `status`, `recover`, `resume`, `repaired`, `accept-qa`, `block` take an optional task ID (default TOPO-PILOT-001) and operate only candidate-review tasks with a committed contract and plan. Max8 transitions per advance; fixed commands/deadlines; failure budget3 and identical errors2; interrupted intent is never successful verification. `run` is the bounded supervisor: it recovers an interrupted action, verifies afresh once, and stops at the first second consecutive interruption, external blocker or exhausted budget. Each stop writes next-action.json naming who acts next. No arbitrary command/agent implementation input is executed. Future coding adapters are not pretended implemented.

Repair: when a gate fails the controller stops at OWNER_REVIEW_NEEDED. The implementer commits a tested fix on a descendant commit and runs `repaired`. The same event history continues on the new SHA: prior verification, bundle and QA are cleared, retry counters are kept, and earlier gate directories and bundles stay untouched. Any commit invalidates independent QA, including metadata commits. Bad arguments, a live lock or a read-only command never write to the task. INPUT_OR_CONTROLLER_ERROR and OPERATOR_BLOCKED can be resumed; external blockers cannot.

State uses fsynced sequenced hash-chain events, atomic snapshot cache, live-writer lock and dead-PID recovery. Events are authoritative; a damaged cache is reconstructed. A truncated/tampered log fails closed. Local locks assume one machine and durable local filesystem. This is not distributed consensus, an OS jail or protection from a trusted operator editing the runner. Each verification action persists its PID and start time. A replacement controller terminates that exact process tree, refuses a reused PID, removes the action's temporary workspace, records the interruption and verifies afresh. The pilot kills a real controller during the real V1 gate. If the action root itself also died, its descendants can no longer be identified; they work only in a disposable clone, and an external supervisor must still own cgroup-level cleanup.

## External controller required

A durable host service/queue must supply isolated checkout, supervision/process-tree cleanup, job persistence, scheduler and bounded wakeups, Codex/Hermes authenticated invocation, resource budgets, secret store and approval identities. None is installed or scheduled here. Suggested protocol: pin task+contract+SHA → start bounded CLI → persist exit/result/log hashes → reschedule only eligible phases → invoke implementer/reviewer via authenticated host adapters → wait for receipts/owner → resume. Persist task events outside ephemeral workers with exclusive ownership; mirror them back for review. Never inject arbitrary issue text as a command. Repository docs cannot launch agents.

### Independently verifiable receipt

After a run stops at INDEPENDENT_QA, the reviewer gets the exact bytes to sign with `node scripts/harness/v2/receipt.mjs request TOPO-PILOT-001 --reviewer NAME --key-id ID` and signs them with their own Ed25519 key, for example `openssl pkeyutl -sign -rawin -inkey KEY -in MESSAGE | base64`. The receipt is that JSON plus a `signature` field. It binds task, exact source SHA, HTML hash and the bundle manifest hash. Anyone with the public trust file can check it with `receipt.mjs verify TOPO-PILOT-001`, which needs no private key. `status` replays a QA event without trust but reports UNVERIFIED_ON_REPLAY; packaging always re-verifies the signature, so a forged event with a valid hash chain cannot reach REVIEW_READY.

For QA, the external controller supplies `TOPO_HARNESS_QA_TRUST` pointing outside this checkout to JSON mapping keyId→{reviewer,publicKey} (Ed25519 PEM), and `TOPO_HARNESS_QA_RECEIPT` to a signed receipt. `accept-qa` validates taskId, exact sourceSha, artifactSha256, PASS, independent role and distinct reviewer against that trust. Sign the canonical `qaMessage` representation. No keys are created/stored in the repository, no unsigned JSON or local boolean approvals count. The default has no configured trust/response, so the real pilot stops BLOCKED at INDEPENDENT_QA with a provisional bundle. Test-only ephemeral keys are fixtures, not Hermes responses. External trust provisioning and identity assurance are owner/controller duties.

## Brain / skills / evolution

Canonical decisions remain in existing docs; docs/brain indexes sources and typed verified metadata. No learner data or credentials are inputs. `brain.mjs update GATE EVIDENCE [STATE]` reconciles a committed gate summary into index.json and the generated block of current-state.md. `brain.mjs check` fails when a canonical source moved, evidence changed, or code moved past the verified commit.

Required skill files/references are checked and hashed; usage additionally needs action evidence. Reads are not adherence proof. `skills.mjs discover` scans reviewed host roots, reading only frontmatter name and description, and lists design candidates. Candidates are never required, read or used automatically; unsuitable stacks are excluded. `skills.mjs plan KIND` reports availability, and a required skill resolves through reviewed `alternates` so Codex and Claude Code hosts both work. `skills.mjs record` writes a usage row only after an unchanged read plus concrete evidence.

`evolution.mjs report` builds docs/brain/metrics.json and proposals.json from committed controller histories and curated incidents.json; repeated failure fingerprints and open incidents become evidence-cited proposals. Metrics retain measured wall time/failures/interventions; unknown token/currency cost is null. Proposals remain PROPOSED; no auto-promotion function exists. Separate improvement branches have regression evidence and require independent review plus owner approval before any merge/policy promotion. Never reset counters or remove checks to pass.

## Review package

Separately named provisional offline HTML is byte-identical to approved PR71. Only explicitly named logs, engine/viewport PNGs and handoff files are collected; browser backup/storage JSON is excluded. Hashes/source SHA are in manifest.json. No existing download/master is replaced. REVIEW_READY needs authenticated exact-head QA and unchanged package bytes; no merge/deploy/release action exists. Physical Safari/iPad/IME/VoiceOver and owner visual acceptance remain separate.

## Codex ↔ Claude Code handoff

`.harness/tasks/<ID>/handoffs/` is a committed, hash-chained log. The sender runs `node scripts/harness/v2/handoff.mjs emit <ID> --from codex --to claude-code --next "..." [--open "..."] [--controller-task TOPO-PILOT-001]`, commits and pushes the record. The receiver runs `handoff.mjs accept <ID> --as claude-code`, then commits and pushes the acceptance. `handoff.mjs status <ID>` shows the owner or pending receiver.

Emit refuses uncommitted or untracked work, a detached HEAD, a head GitHub does not have, a controller gate whose summary is not committed under evidence/, a pending unaccepted handoff, a sender who is not the owner, and secret-shaped text. Accept refuses a wrong receiver, tampered records, an unpushed head, any delta beyond metadata, and a changed implementation or contract. Only one agent owns a task at a time. A record cannot contain its own commit SHA, so `headSha` is the commit before the record and the accepted delta must be metadata-only. Run outputs under runs/ are git-ignored and never count as durable evidence. Node24 is required on both sides. The check depends on `origin` being reachable; it refuses rather than guesses when it is not.
