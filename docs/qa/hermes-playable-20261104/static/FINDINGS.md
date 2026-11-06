# Independent static/source review — PR71 playable candidate

## Scope and identity

- **Tested/source-reviewed HEAD:** `b06b13059ff5e2ef7278c2d0c55597cf8a9435cf` (checked before probes and at exit).
- **Comparison:** last independently F1-approved `8c25b7a4592dafdc0003c0021c2a9fe375d68a34`.
- **Artifact:** `output/html/NINO-2-Proefversie-2026-11-04.html`, **40,999,720 bytes**, SHA256 `933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35`.
- Read AGENTS, current PROJECT_STATE, playable README, and applicable DECISIONS before judging. Static inspection + Node v24.13.1 / in-memory VM and jsdom probes only. **No final GO**, no npm/browser/native-device execution.

## Findings: reproduced versus risks

### S1 — Low-severity reproduced input/backup round-trip defect: a valid profile can exceed the importer’s size ceiling

**Locations:** `scripts/nino-profile.js:5–8,33–34,49`; export/import in `index.html:1478–1481` (in particular `f.size>1000000` at line1481).

The name limit counts graphemes, not code units or serialized bytes. One base character followed by500,001 combining acute accents is **one grapheme**, passes `validate`, survives `normalizeName` unchanged, and can be saved by `importProfile`. The form likewise truncates by graphemes only. Serializing the exact backup envelope with this accepted profile and only minimal progress already yields **1,000,235 UTF-8 bytes**, exceeding the importer’s1,000,000-byte hard limit. Normal real progress can only increase that size. Thus app-accepted input can produce an app-exported backup which its own importer rejects.

Repro: `probe.mjs`, `result.defects.oversizedNameBackup`. All assertions passed. This is deliberately pathological pasted Unicode, **not** a normal-child-name failure or a reproduced loss of existing learning progress. Bounded UTF-8/code-unit validation in addition to grapheme count would close it; no implementation was performed.

### S2 — Reproduced headless-DOM focus loss on closing profile edit; native impact awaits parent browser confirmation

**Locations:** `scripts/nino-profile.js:45–49`; `scripts/nino-v2.js:52,83–85`.

`done()` focuses the previous “Pas mijn boekje aan” trigger and then calls `onDone:renderBook`. `renderBook` calls `body.replaceChildren()`, removing that just-focused trigger. In the **actual candidate HTML**, open book → focus/edit profile → focus name → cancel: original trigger becomes disconnected, `document.activeElement` becomes **BODY**, and book stays open. Both save and cancel use the same `done()` path; the executed reproduction used cancel.

Repro: `probe.mjs`, `result.defects.profileEditorFocus`. **Dialog showModal/close were shimmed in jsdom**: focused-node destruction is proven, but native dialog focus containment/recovery and actual keyboard/VoiceOver user impact are **not** established by this probe. Parent should reproduce in real Chrome/WebKit before treating this as a browser acceptance blocker. Not a repeat of the historical unverified BODY/browser-focus concern; this identifies an explicit new focused-trigger removal sequence.

### R1 — Risk only: two-key import is best-effort rollback, not fully atomic across changing storage availability

**Location:** `scripts/nino-profile.js:14–20`, particularly swallowed rollback failure at line19.

Single progress-write failure correctly restores the old profile and leaves live game/progress storage untouched (verified through the actual import handler). If storage permits the new-profile write, then rejects both the progress write and the rollback, disk contains **name New**, memory remains **Ada**, and progress remains old. Fault-injected proof is in `result.risks.doubleStorageFailure`. This requires changing availability / a second storage failure; **no real quota/privacy browser scenario was established**, so it is not reported as an ordinary reproduced user defect. Transactional guarantees should not be described as unconditional under all storage failure modes.

### R2 — Historical artwork-normalizer semantic coverage gap remains OPEN

**Location:** `scripts/focus-source.mjs:32–36`.

In-memory swap of complete `stamp0` / `stamp1` records and a fictional `folioleft.width=99999` both still normalize to the same baseline. Source/path bytes are checked, but semantic role and dimensions are not pinned here. This was already a separate known open issue; **not solved and not a newly discovered blocker**. Actual36 pre-existing artwork role records are identical to the F1-approved baseline, and newly consumed assets were independently checked against Git blobs below. A passing normalization audit is therefore not being used as proof of semantic artwork correctness.

## Verified positives (own executed evidence)

- Canonical HTML and all five candidate standalone aliases are byte-identical to the artifact hash above.
- Learning engine, route engine, print HTML/PDF/source hash and dependency lockfile are unchanged against F1-approved baseline.
- After exact V2/F1/pizza/profile inverse transformations, **whole non-V2 HTML matches the baseline byte-for-byte**. Both normalized SHA256 values: `72c706661b45ff80eb3969e911047b61d1a2cfe8d3d191c1680ccc4e6dd9d159`.
- Executable mutation inside profile and pizza blocks is rejected; mutation outside the excluded presentation blocks remains detectable by baseline inequality. Three exact PR29 art hooks are reversed rather than excluding the entire art UI module.
- **85 pizza source files** match immutable PR29 `dcc474e8a9d1bc97559a3207b0a330423e128558` blobs, byte counts and hashes. Pizza JS/CSS/runtime manifest also match that pin. Seven actually embedded pizza runtime roles, plus three favorite-pizza images, match their approved source blobs.
- Cover embedded/local bytes match PR48 `4eb9a5ae33550d789c56d5c01393145a148565aa`: SHA256 `8901f57c74feb6d81fea23cb7b216ef403b982e8bdf66f1c89ea83eca15add44`.
- Travel embedded/local bytes match `8a704cb23da97baf7197635df7fa12f06b864a24`: SHA256 `d12e2738fbbbfd05f174ab5af8d555f22fc4505a4c57fb72f28020096dc7a424`.
- All36 previously embedded V2 role records remain unchanged (including paths, data URIs and metadata). New roles are cover, travel and favorite0/1/2. This is source-identity verification, **not independent aesthetic or original-matte acceptance**.
- Actual import handler, with in-memory file stand-ins: malformed profile, unsupported nested route, cancellation and injected progress-write failure leave memory/progress/profile stores unchanged. Valid profile import and legacy backup import succeed. Legacy import intentionally clears optional profile when absent; no invented schema break is claimed. Safe profile text is rendered with textContent/input.value rather than interpolating user names into HTML.
- Actual unchanged authoritative award engine driven72 times: **9 pizzas,0 slices,3 trips**, thresholds every8 answers /3 pizzas. Completed flavor `(pizzas−1)%3`, next flavor `pizzas%3`; presentation drawing does not mutate authoritative state. Fake-scheduler queued callbacks reach Florence, Bologna, Venetië in order and clearing a pending trip cancels it. These are engine/presentation probes, **not naturally played UI progress**.
- Full candidate headless DOM boot and targeted import/profile interaction emitted no jsdom errors.

## Reproduce and evidence

```sh
node /Users/dennisariens/.hermes/cache/scratch/hermes-playable-review/static/probe.mjs
```

Uses existing installed jsdom through the reviewed repo's package resolution; installs nothing and uses no browser/network. Reads candidate files and pinned local Git blobs. All mutations are to VM/in-memory DOM/storage/HTML strings only. Writes only:

- `probe.mjs` — reproducible independent probes.
- `measurements.json` — hashes, source identities, controls and results.
- `probe-output.log` — last successful stdout (`allAssertionsPassed:true`, exit0).
- `FINDINGS.md` — this report.

No tracked-file edits, implementations, branch switches, commits or remote comments were performed by this review. Entry worktree status was clean. Final `git status --short` reports **` M docs/qa/nino-v2-integration/preservation.json`**; this review's probes contain no repository writes (only the three scratch result/script files plus this report). Likely concurrent parent verification; origin was not independently established. **Do not revert it as part of this review.** Final HEAD still matches tested SHA.

## Owner and untested limits

- No npm suite/lint/build/rebuild, browser layout/offline-download gameplay, natural all45 route or native focus verification. Parent owns Chrome/WebKit execution and final review.
- DOM imports used file stand-ins and shimmed dialogs, not OS upload/download or native modal accessibility.
- DPR/layout/responsive book typography/overflow, pointer occlusion, F1 caret selection, IME, physical keyboard, native Safari, physical iPad and VoiceOver are not certified by these static probes.
- Original1086×1448 folios at≤543CSS pixels/DPR2, reconstructed Venezia contour, original-red-cover accent and final visual approval remain owner OPEN.
- Missing approved1024PNG from `topo-nino-app-icon-v1.zip` remains a source gap. Travel header is verified temporary artwork, **not** final app-icon approval.
- Atlas bytes were compared to pinned approved runtime files; their pixel assembly was not independently regenerated or visually approved. No new artwork or redesign.
