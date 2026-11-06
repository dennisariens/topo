# TOPO / NINO agent operations

- Start with `docs/PROJECT_STATE.md`, `docs/DECISIONS.md`, and the assigned task contract.
- Read `docs/MAP_SYSTEM.md` and `docs/geography/README.md` before any map/geography work.
- Use an isolated task branch/worktree from the explicitly approved base; never assume main is the current learner.
- Codex implements; Hermes independently verifies; FARIS/Main coordinates; owner approves merges/releases.
- Before coding, create/update `.harness/tasks/<ID>/{CONTRACT,STATE,EVIDENCE}.md` from `.harness/task-template.md`.
- Keep task-specific state and exact-SHA evidence current; distinguish fixtures, natural play and untested obligations.
- Run `./check.sh <ID>`; follow `.harness/verifier.md` and `.harness/README.md` for setup and interpretation.
- Maximum three failed attempts per failed step; stop on the same error twice. No blind automatic retries.
- Record a blocker in STATE.md and stop; an explicit owner continuation must be recorded before exceeding a cap.
- Never claim PASS/completion from skipped, unavailable, stale or failed required checks.
- `typecheck` is a documented no-op, not genuine type safety.

## Application invariants
- `index.html` is the canonical self-contained learner; no external runtime scripts/assets/fonts/network dependencies.
- Embedded learning/route engines must exactly match `scripts/learning-engine.js` and `scripts/route-engine.js`.
- Preserve45 learning IDs/reference school codes,11 chapters, city groups, Discover→Point→Write, Gold and free modes.
- School codes are reference metadata; do not reintroduce schoolcode recall into current learner tests.
- Preserve both map styles, separate schoolblad, Rome/Vatican distinction, grading/feedback and saved mistakes.
- Preserve Nino/approved art, pizza/Vespa economy, anti-replay, due/review scheduling and save migrations.
- Preserve reset scopes, backups/import rejection, current questions/drafts/selections and F1 navigation continuity.
- Never approximate sourced geography, move a target to enlarge its hit area, or derive coordinates from chat images.
- Inspect embedded ITEMS/CONTEXT_LAND/italy/NAME_ANCHORS/worksheet before coordinate changes; source and pin reliable data.
- Keep visual geometry separate from touch tolerance; no second independent coordinate source.
- Retain corrected San Marino, Bologna, Sicily label, Etna, Po endpoint and Dolomites positions.
- Geographic correctness → educational effectiveness → clarity → usability → consistency → engagement.

## Verification and delivery
- Reuse existing tests; never weaken them merely to obtain green. Add targeted evidence for actual changes.
- Existing npm lint/test/build and geographic/print checks remain authoritative; browser checks must exercise actual file:// HTML.
- For print changes: generate-print.mjs → generate-pdf.py → npm build; preserve source-hash freshness and booklet scope.
- Never manually edit generated HTML/PDF masters; build/package them and verify canonical/download/dist byte parity.
- Update PROJECT_STATE after meaningful work; append product decisions without erasing history in DECISIONS.
- See `.harness/permissions.yaml` for enforced runner scope and its limits; it is not a whole-host sandbox.
- No merge, production deploy, release publication, existing-download replacement or source-master overwrite without owner approval.
