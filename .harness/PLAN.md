# TOPO harness V1 implementation plan

Use superpowers:subagent-driven-development for owned utilities and internal reviews. Existing owner mission and CONTRACT are the accepted spec.

Architecture: root shell delegates to dependency-free Node orchestrator; fixed command/path policy; persistent failure ledger; disposable Git clone of committed candidate. Existing app/scripts/tests/package files are immutable relative to PR71. Playwright is lock-pinned in separate .harness/tooling dev-only package. CI runs the same gate, contents-read only, no deployment.

- [x] Record accepted contract/initial state before code (complete in preflight commit).
- [x] Artifact utility: required aliases equal canonical,pinned app hash, inline-only scripts/assets,45/11/stages/map/code metadata. Directed red/green fixture tests; no app edits.
- [x] Browser utility: pinned Playwright, mandatory Chromium+WebKit, fresh offline contexts, onboarding skip,F1 draft/backward selection/book, map style/source count, actual answer/score/reload;320/768/1500. No fixtures counted as natural play. Missing engine nonzero. Directed execution evidence.
- [x] Policy/orchestrator: exact allowed source changes and commands, fresh env, disposable clone, per-step timeout/log/result, all-required verdict, attempt stop, negative real-entrypoint proof. Unit tests before implementation. Templates/AGENTS/verifier describe enforced scope and host limits.
- [x] CI with full history, immutable action SHAs, Node24, clean installs, development browsers, least privilege and always-upload evidence. No secrets/deploy.
- [x] Commit candidate; execute full check.sh and fault probe; inspect evidence and source unchanged; internal review; one draft PR on PR71 with exact source/hash/logs/Hermes OPEN. Later evidence-only pin does not alter tested implementation.

Risks: false PASS after unavailable browser; bypassed argv/path; private env inherited; edits to app through build; stale evidence counted for another source; attempt reset after same failure; local-only gates falsely called CI-enforced. Tests/docs must explicitly address each.
