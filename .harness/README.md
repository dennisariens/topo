# TOPO harness V1

Harness-only scope: PR71 `b06b13059ff5e2ef7278c2d0c55597cf8a9435cf`; application/art/existing tests/root package and lock are unchanged. The owner's PR71 selection supersedes the original main-only requirement. See task CONTRACT/STATE/EVIDENCE and the retained main/61/64 comparison.

## Setup (development only)
Use supported Node24.15+ LTS (this Mac has24.22.1). Node25 is outside jsdom's documented engine range and is rejected. No type-safety claim is made for the app's no-op typecheck.
```sh
npm ci --ignore-scripts --no-audit --no-fund
npm ci --prefix .harness/tooling --ignore-scripts --no-audit --no-fund
node .harness/tooling/node_modules/playwright/cli.js install --with-deps chromium webkit
./check.sh TOPO-HARNESS-001
```
On this Mac mini, without changing global Node:
```sh
PATH=/Users/dennisariens/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./check.sh TOPO-HARNESS-001
```
Browser tools are separately lock-pinned to Playwright1.64.1; never bundled into offline HTML. Setup alone needs package/browser downloads. Gate subprocesses get no inherited credentials/npm config, a private HOME and explicit browser binary cache; browser contexts are offline and external requests fail.

## Required gate
Source/permission preflight → harness tests → existing build/lint/full npm tests → release/map/V2 audits → standalone parity/inlining/invariants → Chromium and WebKit file:// checks at1500/768/320 → actual broken-work entrypoint rejection → source-unchanged check. All are required. There are no skip/pass override flags and no automatic retries. Each child has a timeout and complete stdout/stderr log; timed-out process groups are killed. Only the final complete verdict prints GATE: PASS.

Verification uses a disposable shared Git clone of the committed candidate, copied installed app dev dependencies and pinned dev browser tooling. Build/audit changes remain inside that clone; original app files cannot be accepted with changes against the pinned base. Negative proof requires an authenticated clone marker/nonce and rejects direct use on the source repository before touching an artifact. Clone cleanup is automatic. State/evidence are written under the source task; no production service is accessed.

Full logs/results go to `.harness/tasks/<ID>/runs/<timestamp>/` (ignored during development; CI uploads them even on failure). `STATE.md` links the last run. `attempts.json` persists per-step failure counts/fingerprints locally: stop at2 identical failures or3 failed attempts, preflight blocked steps before launching more work. Run summaries retain history; a complete successful gate resets the active failure ledger. Agent development attempts outside check.sh must also be recorded in versioned STATE/evidence (as this task's three initial browser failures and explicit owner-authorized fourth run were). The harness does not intercept an independently running host agent.

## Enforcement boundaries / limits
The JSON document in permissions.yaml is valid YAML1.2 and parsed without another dependency. Fixed operations, command argv (no shell), path allowlists, cleaned environments, pre/post source checks, disposable identity and CI token restrictions are executable controls, not a YAML-only promise. They are **not** an OS-level filesystem/network jail: a trusted installed executable or independent host/admin retains host authority. Don't run untrusted arbitrary npm/agent code and claim isolation from these controls. CI uses trusted GitHub-hosted workers, immutable action SHAs, pull_request (not pull_request_target), no inherited secrets and no deploy/publish steps. Third-party Git-provider deployment integrations/branch-protection settings are outside this workflow's authority.

Browser checks are development Chromium/WebKit, not physical Safari/iPad/IME/VoiceOver/printing certification. They execute a genuine free-writing answer and backup/reset/transfer per context; existing npm tests cover the wider route/reward logic. They do not claim natural all45/11-chapter play. Hermes exact-SHA review and owner merge/release approval remain OPEN until explicitly returned.
