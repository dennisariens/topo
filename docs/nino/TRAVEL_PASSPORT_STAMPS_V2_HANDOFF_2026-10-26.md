# TOPO / NINO — TRAVEL PASSPORT + STAMPS V2 — Git/engineering handoff
**Date:** 2026-10-26  
**Art branch:** `art/nino-travel-stamps-v2-20261026` (branched off `art/nino-pizza-rewards-20261024`).  
**Current gate:** **SOURCE PACK PREPARED LOCALLY — 11 BINARY STAMP ASSETS NOT YET IN THIS GIT TREE.**  
**Do not merge, deploy, or claim assets uploaded before remote files are verified.**

## Approved visual direction
- First-class stamps are earned chapter souvenirs, not uniform badges.
- Eleven stamp designs use vintage postmarks, heritage seals and border stamps: color/shape variation, slight irregular impression, no game-metal UI styling.
- Book visuals: original closed burgundy compass cover and open cream double-page book.
- Three pilots approved: `05 ISOLE` terracotta-red ring/lettering + blue island silhouettes and cancellation lines; `07 ETNA` vertical sepia oval; `09 CONFINE ITALIA` simpler border marker, **no multiple directional road signs**.
- Additional accepted: `01 FIRENZE`, `02 ROMA`, `03 BORGHI`, `04 LIGURIA`, `06 DOLOMITI`, `08 TOSCANA`, `10 MARI`, `11 FIUMI`.

## Source package, release 2026-10-26
The design conversation generated a single downloadable package named **TOPO-TRAVEL-STAMPS-V2-GIT-HANDOFF-20261026.zip** (must be downloaded to an authenticated owner/Codex Mac; GitHub cannot access a chat attachment automatically).

The archive contains:
- `assets/nino/travel-passport/stamps/masters/stamp-01-firenze.png` ... `stamp-11-fiumi.png`, with `05-isole`, `07-etna`, `09-confine-italia`, etc. **Unmodified original PNGs**, 11.
- `assets/nino/travel-passport/stamps/qa-candidates/*.webp`, 11 **ink-alpha previews only**, not production approved.
- `assets/nino/travel-passport/book/masters/passport-closed-cover.png` and `passport-open-book.png`.
- `assets/nino/travel-passport/manifest.json`: mapping, SHA-256 hashes, dimensions, source quality flags.
- `README_FIRST.md`, `CODEX_HERMES_HANDOFF.md`, `PUSH_ART_TO_GIT.sh`, QC contact sheets.

**Owners' one-time local push (do not do twice):** unzip archive, `cd` into extracted folder, run `bash PUSH_ART_TO_GIT.sh`. It works only on this art branch and refuses a dirty git worktree. It does not merge or deploy.

### Verification gate after push
Confirm these 13 PNGs exist in the branch Git tree:
1–11 stamp original masters + 2 passport masters, along with 11 WebP QA candidates and manifest.
Do not start the app PR until a valid remote commit SHA and full 11/11 file count are recorded.

## Important honest technical warnings
- Generated stamp images are **not always transparent ink-only**, even when RGBA. Some contain baked cream/paper fill.
- Especially: source **02 ROMA** has red gradient exterior, **08 TOSCANA** olive gradient exterior, **09 LANDEN/CONFINE ITALIA** baked checkerboard and originally RGB.
- The supplied derived alpha WebPs are **provisional algorithmic extractions**, may simplify colors/soft lines and are **not automatically ready for production**.
- Strict QA on paper and white at 64, 96, 120px, full size; fix remaining halos/fake transparency without regenerating the approved stamp artwork.
- **ISOLE coastline geometry** must be checked against canonical school map; do not substitute art outlines for geography questions.

## Codex — next assignment (AFTER remote binary verification)
1. Inspect existing PR stack first. PR #29 pizza and PR #40 iPad Focus Mode remain separate. Do not duplicate or interfere with them.
2. Wire single source-of-truth manifest and 11 chapter IDs to the actual engine. Earned stamp persists per student and chapter. The cover and open book are backdrop assets; all profile text, pizza preference and stamps are **separate UI layers**.
3. Implement opening/closing, stable per-stamp slight rotation/opacity, reading/focus accessibility, reduced-motion, iPad portrait & landscape, offline load.
4. **No '12th Gold stamp'**. Gold Mastery is triggered by actual special chapter assessment criteria, separate from 11 regular stamp completions. Gold art will follow in another handoff.
5. Make one narrow draft PR with SHA, test output, screenshots, and any discovered blockers. **No merge/deploy without owner approval.**

## Hermes — next assignment (AFTER remote binary verification)
- Independent asset review: SHA-256 originals, image content, transparency/composite, file dimensions, no opaque parchment or checkerboard, small-size legibility.
- Confirm correct country/landmark silhouettes; especially ISOLE against school material.
- Regression check in existing iPad UX; coordinate with open PR #40 rather than duplicate its work.
- Report specific pass/fail and repair list to Codex. Do not autonomously rewrite entire experience.

## Artwork remaining (design thread)
- **Gold Mastery**: concept benchmark -> one approved unique metallic antique-brass seal, contextual to a mastered chapter, not a separate 12th chapter.
- **4 collectible postcards pilot:** Sicilië, Sardinië, Napoli & Vesuvio, Venezia; approved benchmark suggests a perforated paper edge and handwritten Italian travel caption. Confirm existing card sources/reuse before drawing new art.
- Passport technical layers: empty earned view, stamp press/noise, Gold attachment and zoom/focus examples; app-owned animation.
- Final app icon/desktop + iPad Safari acceptance.
- Prioritize finished assets and evidence; no blind batch redesign.

**Resource use:** ChatGPT Design owns visual direction/art, Codex focused implementation, Hermes independent low-cost QA. Work only for a concrete blocker where cross-app orchestration is needed.
