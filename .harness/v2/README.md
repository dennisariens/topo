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

`init`, `advance`, `status`, `recover`, `resume`, `accept-qa`, `block` operate only the approved safe candidate-review task. Max8 transitions per advance; fixed commands/deadlines; failure budget3 and identical errors2; interrupted intent is never successful verification. Repair requiring code work is OWNER_REVIEW_NEEDED; no arbitrary command/agent implementation input is executed. Future coding adapters are not pretended implemented. New SHA or contract requires a fresh intake; any commit invalidates independent QA, including metadata commits.

State uses fsynced sequenced hash-chain events, atomic snapshot cache, live-writer lock and dead-PID recovery. Events are authoritative; a damaged cache is reconstructed. A truncated/tampered log fails closed. Local locks assume one machine and durable local filesystem. This is not distributed consensus, an OS jail or protection from a trusted operator editing the runner. Killing a controller with running descendants requires the external supervisor to terminate its entire process tree/cgroup before resuming; the pilot kills the durable intent writer before any verification command starts, then performs fresh real verification.

## External controller required

A durable host service/queue must supply isolated checkout, supervision/process-tree cleanup, job persistence, scheduler and bounded wakeups, Codex/Hermes authenticated invocation, resource budgets, secret store and approval identities. None is installed or scheduled here. Suggested protocol: pin task+contract+SHA → start bounded CLI → persist exit/result/log hashes → reschedule only eligible phases → invoke implementer/reviewer via authenticated host adapters → wait for receipts/owner → resume. Persist task events outside ephemeral workers with exclusive ownership; mirror them back for review. Never inject arbitrary issue text as a command. Repository docs cannot launch agents.

For QA, the external controller supplies `TOPO_HARNESS_QA_TRUST` pointing outside this checkout to JSON mapping keyId→{reviewer,publicKey} (Ed25519 PEM), and `TOPO_HARNESS_QA_RECEIPT` to a signed receipt. `accept-qa` validates taskId, exact sourceSha, artifactSha256, PASS, independent role and distinct reviewer against that trust. Sign the canonical `qaMessage` representation. No keys are created/stored in the repository, no unsigned JSON or local boolean approvals count. The default has no configured trust/response, so the real pilot stops BLOCKED at INDEPENDENT_QA with a provisional bundle. Test-only ephemeral keys are fixtures, not Hermes responses. External trust provisioning and identity assurance are owner/controller duties.

## Brain / skills / evolution

Canonical decisions remain in existing docs; docs/brain indexes sources and typed verified metadata. No learner data or credentials are inputs. Required skill files/references are checked and hashed; usage additionally needs action evidence. Reads are not adherence proof. Host installed paths can differ; adjust a reviewed registry revision rather than falsely mark missing skills used.

Metrics retain measured wall time/failures/interventions; unknown token/currency cost is null. Proposals remain PROPOSED; no auto-promotion function exists. Separate improvement branches have regression evidence and require independent review plus owner approval before any merge/policy promotion. Never reset counters or remove checks to pass.

## Review package

Separately named provisional offline HTML is byte-identical to approved PR71. Only explicitly named logs, engine/viewport PNGs and handoff files are collected; browser backup/storage JSON is excluded. Hashes/source SHA are in manifest.json. No existing download/master is replaced. REVIEW_READY needs authenticated exact-head QA and unchanged package bytes; no merge/deploy/release action exists. Physical Safari/iPad/IME/VoiceOver and owner visual acceptance remain separate.
