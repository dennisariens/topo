# Hermes handoff — TOPO-HARNESS-002

Status: Hermes review OPEN. Nothing here is acceptance. No merge, deploy or production change is authorized.

PR: https://github.com/dennisariens/topo/pull/74 (draft, base `agent/topo-harness-v1`, branch `agent/topo-harness-v2`). Verified implementation commit: `d225af2ff2ce551fc9cd73fc7f0c970e208f70e9`. Later commits on the branch must be metadata-only; `handoff.mjs accept` proves that.

## Run
Node 24.15+ on the review host.
```sh
git fetch origin && git switch agent/topo-harness-v2 && git pull --ff-only
npm ci --ignore-scripts --no-audit --no-fund
npm ci --prefix .harness/tooling --ignore-scripts --no-audit --no-fund
node scripts/harness/v2/handoff.mjs accept TOPO-HARNESS-002 --as hermes
git add .harness/tasks/TOPO-HARNESS-002/handoffs && git commit -m "docs: Hermes accepts V2 handoff" && git push
node scripts/harness/v2/brain.mjs check
node scripts/harness/v2/controller.mjs init
node scripts/harness/v2/controller.mjs run
```
The acceptance commit changes the head, and any commit invalidates QA, so review and sign that exact resulting head. `run` executes the full V1 and V2 gate and stops at INDEPENDENT_QA with a fresh bundle.

## Receipt
Use Hermes's own Ed25519 key, held outside this repository. This repository holds no keys and no receipt.
```sh
node scripts/harness/v2/receipt.mjs request TOPO-PILOT-001 --reviewer Hermes --key-id KEY_ID > message.json
openssl pkeyutl -sign -rawin -inkey KEY.pem -in message.json | base64 | tr -d '\n'
```
Add the result to the JSON as `signature`. With `TOPO_HARNESS_QA_TRUST` pointing outside the checkout and `TOPO_HARNESS_QA_RECEIPT` at the receipt: `receipt.mjs verify TOPO-PILOT-001`, `controller.mjs accept-qa`, `controller.mjs run`. Only that path reaches REVIEW_READY. Sign only a real PASS; a failing review needs no receipt.

## Please challenge
1. Scope: `.github/workflows/harness.yml` is the only pre-existing file changed against V1 `a86975272ee700d79ab04fe5429ab91165f2029d`.
2. `repaired` keeps retry counters but changes the contract hash when the contract changed. Is that strict enough?
3. `run` re-verifies once after an interruption. Does that fit "no blind automatic retries"?
4. `terminateAction` signals a recorded process tree. Can it reach a process it should not?
5. Replay leaves a forged QA event visible as UNVERIFIED_ON_REPLAY until packaging re-verifies it. Is `status` output clear enough?
6. New-task paths are allowed by `allowedV2Path`, excluding task 001. Is that wider than it should be?
7. P001 is excluded, so `createPackage` still accepts a nonempty directory for direct callers; the controller uses a fresh per-gate directory.

## Known limits
Fixture keys prove the REVIEW_READY route only; no real receipt has ever been verified. Handoff accept has been exercised only in fixtures, not by a second real agent. Descendants of an action whose root also died cannot be identified. Browser checks are development engines, not physical Safari, iPad, IME or VoiceOver. The design review covers the journey screen only. `web-design-guidelines` was read but not used. External scheduling, agent launch and key provisioning stay outside this repository. docs/PROJECT_STATE.md and docs/DECISIONS.md are unchanged because V2 scope treats them as immutable; state lives in task STATE.md and docs/brain until promotion.
