# Issue #45 — pinned Nino artwork intake / SAFE SUBSET

**Source:** `art/nino-travel-stamps-v2-20261026`, exact **`367b875c83a4e8b77c1f1d09523c20c96364f178`**. Art-only correction/evidence branch `hermes/nino-art-intake-45`. This is not application integration or a passport implementation. Do not merge this legacy art branch's app into PR #40.

## Result

| Asset family | PASS | REWORK | Scope |
|---|---:|---:|---|
| Chapter icons | 11 | 0 | Existing 512px WebPs, labelled UI; prefer48–96 CSS px |
| Stamp alpha derivatives | 10 | 1 | Warm paper only; captions at thumbnail sizes, inspect at ≥160px |
| Book artworks | 1 | 1 | Closed cover passes; open book needs clean source |

**22 allowlisted files:** 11 existing icon WebPs, ten byte-identical copies of accepted stamp candidates under `stamps/exports/`, one native-size lossless closed-cover WebP. Nothing outside [production-allowlist.json](production-allowlist.json) is approved for app consumption. Original master PNGs remain untouched. [Per-file CSV](asset-ledger.csv) / [JSON ledger](asset-ledger.json) contains **57 file rows** covering 46 supplied files plus 11 new exports, with SHA256, dimensions, purpose-specific verdict and ship flag. A source-reference PASS does not mean production-alpha approval.

### Stamp-by-stamp decision

All source masters and corresponding candidates are individually hashed/decoded in [binary-inventory.json](binary-inventory.json); exact paths use `assets/nino/travel-passport/stamps/{masters,qa-candidates,exports}/`.

| # / chapter key | Master / candidate | Decision and use |
|---|---|---|
| 01 city1 — Firenze | `stamp-01-firenze` | PASS derivative; completed **Steden1–6**, not a Florence-arrival event |
| 02 city2 — Roma | `stamp-02-roma` | PASS reconstructed derivative after paper/dark/checker review; master background is REWORK for direct alpha use |
| 03 city3 — Borghi | `stamp-03-borghi` | PASS derivative; group13–18, not a new place/visit |
| 04 city4 — Liguria | `stamp-04-liguria` | PASS derivative; group19–23 |
| 05 islands — Isole | `stamp-05-isole` | **REWORK original and derivative**; geographic relationship wrong, excluded from exports/allowlist |
| 06 mountains — Dolomiti | `stamp-06-dolomiti` | PASS derivative; illustrative mountain-category stamp, not surveyed geography |
| 07 volcanoes — Etna | `stamp-07-etna` | PASS derivative; no new volcanic target |
| 08 regions — Toscana | `stamp-08-toscana` | PASS reconstructed derivative after matte scrutiny; master not approved direct alpha |
| 09 countries — Confine Italia | `stamp-09-confine-italia` | PASS reconstructed derivative; **RGB master has baked checkerboard**, never ship master as transparent art |
| 10 seas — Mari | `stamp-10-mari` | PASS blue-ink derivative; keep original palette, warm paper only |
| 11 rivers — Fiumi | `stamp-11-fiumi` | PASS derivative |

**Not a claim of 48px baked-text readability:** at48px stamp letters/detail are too small;96px is a thumbnail with incomplete tiny text. Use a live opaque chapter label and accessible description; ≥160px detail/inspection, with2x source sampling. Dark teal was a diagnostic alpha background, not a release theme: dark red/olive/blue ink has inadequate contrast there. No whole-stamp fading or blur to hide defects.

### Specific rework findings

- **Isole:** both required identities are present; there is no defensible whole-island inversion claim. Sardinia should be distinctly northwest of Sicily. The source stamp puts them almost side by side with substantial vertical overlap and near-level southern ends. The real canonical SVG has Sardinia ending y834.71 and Sicily starting y881.97. Retain vintage art direction, correct relative placement against the supplied canonical paths; do not alter the map to match the stamp. Peripheral island identities are unverified. [Detailed independent report](isole-geographic-qa.md), [side-by-side proof](isole-side-by-side.png), [actual canonical SVG crop](isole-canonical-islands.svg). This is a comparison to the app/school geometry, **not independent GIS certification**.
- **Open book:** eleven empty chapter-circle positions and a twelfth decorative compass position are visible; they are not eleven pre-earned chapter stamps. However, a circular cancellation/postmark with illegible lettering is baked beside the profile portrait. Obtain a blank/no-postmark version, or explicit owner approval of its purely decorative role before background approval. Do not erase it by painting guessed paper, and do not reinterpret it as real travel history. [Native crop](open-preprinted-mark-crop.png). No production open-book export was created.
- **Closed cover:** readable compass/travel-book object with no learner name or earned chapter/arrival state baked in. Export retains native1254×1254; decoded RGBA equals original exactly. Cover decoration is not the final Gold seal.

### Icon-specific notes

All eleven independently reviewed at32/48/64/96px on paper/dark/checker: **264 size/background samples**, plus paired larger and native detail views. [Per-icon verdicts](icons-verdicts.json) and [technical measurements](icons-technical.json) carry every actual path/hash. Eilanden reads partly as coast, so live label is essential; Landen's baked sign words cannot teach country names and arrows are decorative. Dense03/04/08/09 favor64–96px. Zeeën has real native left-edge contact (max alpha185); accepted for the small labelled usage, not certified as a pristine full-size master. No objectionable export-specific matte or compression defect was observed.

## Integrity, alpha and provenance

- **46 supplied images decoded;35 locally checkable declared hashes match;0 mismatch.** Masters:11 icons1254×1254 RGBA,11 stamp designs at their manifest dimensions/modes,2 book sources. Roma/Toscana/Confine are1536×1024, Mari1312×1199; do not relabel them2048px. Candidate sizes vary and are preserved.
- The icon manifest's11 upstream pre-cleanup `source_sha256` claims cannot be independently verified because those uploaded originals are absent. Verified repository master/export hashes are separate. No fabricated provenance claim.
- All supplied images lack embedded ICC profiles. No certified sRGB conversion is claimed; no conversion/recolor was performed. RGB/alpha extrema, bounding boxes, edge-contact and partial-alpha measurements are in the inventory.
-10 accepted production stamp exports are exact byte copies of the inspected candidates—no new threshold, erosion, hue remap, crop or lossy recompression. Closed cover uses lossless WebP with full decoded-RGBA equality. Existing11 icon exports are unchanged. Stale icon upload metadata now identifies the verified Git source; historic creation provenance is retained.

## Visual evidence — original artwork, not actual earned app state

- Stamp source vs candidate at48/96/160 on warm paper/dark teal/checker, raster1x/2x: `stamps-batch-{1,2,3}-{1x,2x}.png`.
- Icons: `icons-sizes-{warm,dark,checker}.png`, paired `icons-overview-{01-06,07-11}.png`, native details/sea-edge board.
- [Book sources](book-source-contact.png), [eleven deterministic impressions + proposed book positions](placement-book-mockup.png), [five design reference cases](placement-five-references.png).

Every book-placement board says **MOCKUP / NO REWARD**. It intentionally includes Isole for inspection, not approval, and does not place a fabricated Gold seal in the twelfth compass slot. The fifth Gold reference is **BLOCKED**, not replaced with the Nino character.

## Deterministic imperfection design

[11 exact poses](placement-poses.json), [Python/JavaScript parity](placement-parity-results.json). Seed is JSON `["topo-stamp-v1","chapter",exactChapterID,""]`, UTF-8 FNV-1a32, independent `\0rotation`, `\0x`, `\0y`, `\0pressure` lanes. No name/date/device/viewport/random seed or parallel award ledger. Freeze mapping once shipped. Preserve chapter pose when Gold is attached.

Canonical field160×152, uniformly fitted art112×96, safety inset12. Weighted angle pool0/±1.5/±4.5°, hard cap±6; x0/±5/±10, y0/±3/±6, independently selected. Rotated-envelope calculations clamp offset before clipping; eleven fixture poses pass safety bounds and Python/JS equality. Uniformly scale the complete field across displays, rather than choose new poses on resize.

The original art already contains distressed ink. No new destructive texture was added. With no protected-text mask supplied, proof pressure is deliberately restrained to **98–100%** alpha. Stronger one-sided effects need trusted label protection; reduced-transparency/high-contrast fallback uses clean opaque presentation. Existing readable caption remains outside transformed art.

These prove stable design mapping and calculated mockup bounds—not runtime reopen/import/offline behavior in a missing passport component. Physical iPad/VoiceOver/large-text/actual1x–2x device approval remains pending.

## Codex integration contract / sequencing

1. **P0 first:** stabilize #37/#38 and actual iPad #33/#44. Then branch from the then-reviewed iPad candidate, not this legacy art branch. **Do not merge its app, package, engines, PDF or geometry.** Copy only allowlisted art and reviewed metadata.
2. Map chapter numbers1–11 to `city1 city2 city3 city4 islands mountains volcanoes regions countries seas rivers`. Read chapter completion from canonical `stage===3`, Gold from `goldAt>0`; icons are navigation art, not earned awards. Missing Isole art must not suppress genuine completed-state text or fabricate a lock.
3. Follow PR #42 roadmap at `75a1dedf3f8db973de9a3a481faff24fc7027057`: final Golden Italy seal only if all11 Gold records are positive. Chapter art is **not** a Vespa arrival, football award or automatic Gold. Read trips from original engine; no invented dates or visits.
4. **BLOCKED missing assets:** final `ESPLORATORE D'ORO` seal; dedicated verified small chapter-Gold overprint; seven canonical ARRIVO stamps. Optional later: Milano football postcard (Torino concept is not approved Milano art), Bologna pit-stop, isolated scenic margins, registered Pisa lid/occlusion layers (#31). Do not duplicate Pizza V2 or block core beta for optional art.
5. Embed accepted art in both self-contained HTML exports; no fonts/CDN/runtime fetch. Preserve exact45 items, projection/hitboxes, two map styles, canonical grader, Focus Mode, Schoolblad, reward cycle/anti-replay and saves. Opening/closing the eventual book must restore draft/caret/focus/camera. Do not add a second passport to demonstrate these assets.
6. Integration acceptance remains actual earned/locked/Gold/replay/reset/import/7+trip cycles, both offline builds, iPad orientations/Split View/keyboard, accessibility and image-budget checks. This report is **not** that functional gate, nor a merge/deploy approval.

## Reproducible execution

Python3 with Pillow10.4.0 + NumPy1.24.4; Node24.15 for cross-language parity. The author's existing interpreter was `/Users/dennisariens/.hermes/cache/scratch/topo-discovery-terrain/venv/bin/python`.

```sh
python scripts/qa-nino-art-intake.py
python scripts/qa-nino-placement.py
node scripts/qa-nino-placement-parity.mjs
python docs/qa/artwork-45/icons-audit.py
python docs/qa/artwork-45/icons-verdicts.py
python scripts/prepare-nino-safe-art.py
python scripts/qa-nino-art-ledger.py
python scripts/verify-nino-art-intake.py
```

`prepare-nino-safe-art.py` encodes the documented manual review allowlist, not automatic visual certification. Its byte/roundtrip assertions and final ledger/allowlist equality passed. No application build/gameplay run is represented as part of this art-only intake; original app/master integrity is checked separately. No paid generation, original-master edits, merge or deployment.
