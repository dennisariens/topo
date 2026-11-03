# Independent PR71 static / preservation audit

**Tested SHA:** `2c52f121b853d1d8a46555d725ef79c97e0bf85b`.
Compared PR70 REWORK candidate `2a9dda3d3d8ec567687bc3b61bf9cbde645c752c` and immutable Hermes evidence `827ebaf313509dde70a2c79ace4cbf3e9cb3ccdc` (README and provenance review read from Git).

**Outcome: D1/D2 corrections and exact source/art preservation PASS for this static scope. One independently reproduced audit-coverage weakness remains. This is not browser acceptance, final artwork closure or owner release GO.** No npm/build/browser execution, branch switch, commit, external comment or implementation change.

## Independently executed measurements

`audit.py` reads actual working files/pinned Git blobs, decodes rasters with Pillow, checks file and decoded-RGBA hashes, dimensions/alpha/format/mode, measures inline bytes, and independently removes only the exact presentation additions (not through the production normalizer). `measurements.json` contains every measured row.

- Canonical HTML and all four tracked downloadable aliases: **35,709,206 bytes**, SHA256 `352ddd742436ac4f5a5a8a82374f742788952219e42b47d87d83536319183d53`. All five identical. Local ignored `dist/index.html` also matches, but is not presented as pinned Git evidence.
- After exact C+/V2 removal and exact title restoration, **entire HTML equals PR70 byte for byte**. Consequently all embedded 45 learning definitions, geometry, canonical question/chooser/grading/backup/migration/reward code are retained, not merely selected arrays. **92 existing protected tracked source/art/engine/test/print/dependency files unchanged.** All **239 pre-existing artwork rows retain identical source SHA256/Git blobs**; eleven source-existing chapter exports are newly copied into the delivery tree.
- **239 unique manifest paths**, **67 delivered /172 source-only**. Availability reconciles: **205 pinned-source /34 derivative** rows. Status is **87 READY /37 INTEGRATION PENDING /83 EXPORT PENDING /32 OPTIONAL DEFERRED**. **40 READY rows are source-only**: READY remains scoped source readiness, not a release total.
- Manifest runtime references: **46 integrated /193 not integrated**. Actual HTML contains the bytes of all **46 unique integrated hashes**. **58 manifest path rows** have bytes present because twelve source-only candidate aliases have identical bytes to explicitly embedded exports (two folios plus ten stamps). This is alias equivalence, not twelve additional integrated assets. All aliases are enumerated in the measurements; no unaccounted byte presence or absent claimed integrated bytes.
- `NINO_V2_ART` contains **36 roles**: eleven chapter pictures, eleven stamps, welcome, two distinct Gold seals, ARRIVO, three static Pisa boxes, four ordinary card sides, Venezia, two folios. All actual data URIs equal their real delivered files, all declared dimensions agree with decoded dimensions. Runtime availability is not proof all earned states were naturally played.

## D1 — corrected (PASS)

`docs/qa/nino-v2-closure-67/artwork-manifest.json:9924–9984` now retains open-book historical `ARCHIVAL REFERENCE` / `REWORK`, sets `OPTIONAL DEFERRED`, says not a blank folio/no integration authority, and removes the unrelated 1086×1448 dependency. Independently decoded pinned blob `883625438e29019a89cb3b372d31012f4edd4ef8`: **1586×992**, 2,674,616 bytes, SHA256 `94f5d286e502b81ee156ae0923132f22dc8475f474f44709087e83662e032b8d`. It is source-only and its bytes do not occur in HTML.

Generator `scripts/inventory-nino-artwork-67.py:72–89` now excludes this exact path and historical ARCHIVAL/REWORK/REJECTED verdicts **before** generic masters→READY. No current READY row with one of these historical artwork verdicts exists. Other optional concepts remain deferred. No archival master has been silently promoted in this snapshot.

## D2 — corrected with important counting scope (PASS)

Manifest `:13–28`, generator `:96–102`, integration README `:22` distinguish source availability, physical delivery, runtime reference. Recomputed counts above agree. `READY=87` must never be advertised as 87 runtime/release-approved assets; it includes forty source-only rows. Twelve byte-identical source aliases explain the otherwise surprising 58-versus46 count.

Minor residual metadata imprecision: generator `:90–91` attaches the folio-native-size caveat to *every* `/book/` row other than archival, including the separate 1254-square closed cover. This is not the corrected D1 defect and causes no current cover integration, but consumers must use per-row dimensions rather than generic dependency text.

## Canonical earning and state isolation (source PASS, runtime reserved)

- Exact chapter order is canonical `index.html:1167–1168`; embedder `scripts/embed-nino-v2.mjs:9–10` sorts the numbered files into corresponding eleven roles. Corrected `stamp-05-isole.webp`, not rejected old ISOLE, is wired. Historical city-associated paintings remain decorative lesson stamps, not replacement assessment geometry.
- `scripts/nino-v2.js:22,28,36–38`: earned stamps require exact chapter `stage===3`; chapter seal additionally requires that chapter `goldAt>0`; live canonical chapter title always accompanies it. `:17` supplies earned-stamp detail. No stage-count shortcut awards Gold.
- `:28,32`: final Gold appears only when all eleven canonical chapters have positive `goldAt`. Canonical restore `scripts/route-engine.js:85–86` normalizes incomplete chapters to zero Gold; route engine's existing queue-complete/wrong-answer rules remain unchanged (`:224` first-award timestamp logic). The UI does not award Gold.
- `:42–46`: ARRIVO is hidden at zero trips, visits use the unchanged deterministic `TopoLearning.journey`/STOPS route, Venezia requires **trips>=3**, Napoli>=6; island souvenirs require completed islands. `scripts/learning-engine.js:5,95–98` confirms third arrival is Venetië. Counts reconstruct deterministic visits, not fabricated stored event history; no invented dates/messages.
- `:30` shows a static Pisa flavor from existing pizza count; eight-answer/three-pizza rules are untouched. There are no rejected hinge frames.
- Passport code contains no state assignments, persistence calls, reward-engine calls, grading calls or extra save schema. UI-local page/side/flip/origin state lives in closure/DOM only. Text uses `textContent`, not user HTML. Reis/Oefenen deliberately invoke existing canonical navigation (`:7`), so the broader navigation is not claimed to be a no-op.
- Observers `:56–62` read canonical state and add decorative chapter images only to unlocked route cards. Observed layout class changes are not rewritten by update; route-card additions are below the observed direct-child list. No static self-triggering observer loop found.

## Reproduced audit weakness — medium coverage gap, not a current wrong-art finding

**`scripts/focus-source.mjs:31–35` accepts arbitrary role mapping and dimensions in `NINO_V2_ART`.** It checks each value against a mutable ledger/local byte file, but does not pin the expected key→path mapping, required role set, actual file hash, or decoded width/height. `scripts/audit-nino-v2.mjs:7` therefore normalizes away some semantically different V2 art payloads while still reporting preservation.

Executed `adapter-probes.mjs` against exact current source in memory, no implementation writes:

| Probe | Adapter / full baseline comparison |
|---|---|
| Unaltered candidate | accepts / equal |
| Extra executable line inside V2 block | rejects exact script mismatch |
| Edit outside bounded block | remains visible / unequal |
| Swap complete `stamp0` and `stamp1` objects | **accepts / equal** |
| Change `folioleft.width` to9999 | **accepts / equal** |

Thus its “verified presentation” result alone does **not** establish exact canonical artwork mapping/metadata. Current independent role/file/dimension inspection found the actual candidate mapping correct. Recommend explicit role/path/dimension/hash assertions in future maintained acceptance; do not reinterpret this warning as present learner-state corruption. No production audit/test was altered by this review. Its short D1 assertion (`audit-nino-v2.mjs:9–11`) also does not actually decode archival dimensions or recompute D2 totals; this audit did both independently.

## Modal/caret/source-failure risks for parent browser QA

These are **source risks/coverage limits, not reproduced runtime failures**:

- `nino-v2.js:52–55` uses native `showModal`/close/Escape behavior. It restores opener focus and window scroll but does not explicitly snapshot/restore the previously focused answer field/selection. It does not reparent or overwrite the field, so existing draft/caret may survive; exercise actual field→open→nested stamp→Escape/close, breakpoint/visualViewport changes, IME and focus containment. Unlike existing schoolblad, there is no unsupported-`showModal` guard (`index.html:1733`). Modern tested-browser support and physical Safari accessibility remain separate.
- `:55` rebuilds book contents and resets narrow side on **every resize**. While nested stamp dialog is open, this can remove `stampOrigin`; `:16` subsequently focuses a detached origin. Verify native focus restoration rather than assuming it. Arrow keys are bound to the main dialog; nested stamp is a sibling dialog, so static event structure does not show accidental page-turn bubbling through it.
- `:4` sets all V2 art decorative (`alt=''`, aria-hidden). No per-image `error` fallback is installed. Live captions remain, and source decode/integrity passes here; corrupt-data tests of the *old Nino image* do not prove fallback for a folio/seal/postcard. Test those specific failures and ensure no progress/state changes. A missing art-table key would throw synchronously. No such missing key exists in current payload.
- Maintained `scripts/qa-nino-v2.mjs:28–30` checks draft/selection values/save/question, not renewed focus in the answer input. Its all11/trip fixture assertions (`:33–58`) are explicitly fixtures, not eleven naturally earned chapters. Do not call Codex logs independent Hermes execution.

## Folio contract and owner decisions

- `nino-v2.css:9–10` bounds grid columns/page width at **543CSS px**, mobile max-width also543. Full-canvas `.folioPaper` is width100%/height:auto; no crop, mirroring, transform or replacement raster. Actual source dimensions both **1086×1448** (3:4). Container has aspect-ratio3/4, but its content can legitimately grow taller; verify **image bounds**, not just page-box ratio. Global border-box sizing is retained (`index.html:3`). DPR2 is the bounded native-pixel contract, not unlimited higher-DPR resolution approval.
- **C1 stays owner-facing:** accept native1086×1448 at <=543CSS/page/DPR2 instead of1536×2048 specification, plus final seam/visual acceptance. Current scope authorizes integration; it does not make a larger master exist.
- **C2 stays owner-facing:** actual tight Venezia is **1497×973**, exact PR70 reconstructed scalloped export. This review verifies unchanged bytes, not identity with unavailable original reviewed raster matte. Owner must accept reconstruction or supply original reference; no repaint required.
- **C3 integration scope is now authorized** in supplied mission and `docs/DECISIONS.md` final integration record. Do not repeat PR70's absent-integration scope objection against this implementation. Owner visual/release GO, native Safari/physical iPad/IME/VoiceOver/real print and parent's independent runtime checks remain separate gates.

## Reproduce

From pinned worktree root:

```sh
/Users/dennisariens/.hermes/cache/scratch/nino-independent-binary-venv/bin/python \
  docs/qa/hermes-nino2-final-71/static/audit.py
node docs/qa/hermes-nino2-final-71/static/adapter-probes.mjs
```

First inventory attempt incorrectly treated identical source/export aliases as extra integration claims; corrected independent QA counting to distinguish explicit runtime paths from content equality, then reran with **zero measurement errors**. This was a QA-script correction, no application/test weakening. Files created only in this static evidence directory: both reproducible scripts, `measurements.json`, `adapter-probes.json`, this report.
