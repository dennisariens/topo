# TOPO / NINO — Gold Mastery + Cartoline — new source art release
**Date:** 2026-10-26
**Target art branch:** `art/nino-travel-stamps-v2-20261026`
**Source status:** `7/7 originals packaged in design conversation ZIP; upload to GitHub NOT verified yet`
**Source ZIP:** `TOPO-GOLD-POSTCARDS-V2-GIT-HANDOFF-20261026.zip`

## Approved images, exact upload targets
1. `assets/nino/travel-passport/gold/masters/gold-chapter-seal-v2.png` — approved less-glossy eight-point compass/olive brass seal; one reusable small chapter Gold overlay.
2. `assets/nino/travel-passport/gold/masters/gold-esploratore-doro.png` — approved antique brass final Gold achievement (title + subtle Nino Vespa silhouette), unlocked only at 11/11 genuine chapter Gold.
3. `assets/nino/travel-passport/postcards/masters/postcard-01-sicilia-front.png` — original approved Sicilia postcard master.
4. `assets/nino/travel-passport/postcards/masters/postcard-02-sardegna-front.png` — Sardinian turquoise limestone bay.
5. `assets/nino/travel-passport/postcards/masters/postcard-03-napoli-vesuvio-front.png` — historic Naples / Vesuvius.
6. `assets/nino/travel-passport/postcards/masters/postcard-04-venezia-front.png` — **owner-selected final Venezia after Rialto scale/perspective correction** (NOT the earlier Venetian candidates).
7. `assets/nino/travel-passport/postcards/masters/postcard-05-universal-reverse.png` — reusable vintage postcard back with blank message/recipient regions.
Plus `assets/nino/travel-passport/gold-postcards-manifest-20261026.json`, source SHA-256 checks, release README and safe source-only push script in the ZIP.

**Critical truth:** The source package exists as a downloadable ChatGPT conversation artifact; the GitHub connector cannot directly access the container binary bytes, so the script must be run with GitHub authentication. Never mark source binary upload complete without verifying the remote tree.

## Technical and visual QA — NOT yet production approved
- All original masters preserved untouched, no accidental regeneration or crop. The two Gold files are RGBA; 4/5 postcard sources have alpha but may include residual beige, halos or imperfect scallop-edge transparency.
- **Final Venezia front master is RGB, without transparency**. Create and review a distinct transparent-border export or apply verified clip/mask in app; never overwrite original master. Do not represent as alpha-ready.
- Exact small-size visibility, Gold typography, eleven decorative marks count, postcard border shape alignment and paper-color coherence require Hermes independent review.
- The final Gold and chapter Gold are **separate achievements**. Chapter Gold uses existing actual `goldAt` of that chapter; finale only after all 11 `goldAt` values positive. No extra persistent award boolean; do not change quiz logic.
- Postcards do not create new earned counters/quiz questions. Honor documented unlock rules and real Vespa arrival state. The universal reverse takes dynamic Dutch microcopy in UI; no baked learner name/address/date.

## Remaining artwork, minimal production
1. `passport-blank-folio.png` — one reusable **portrait 3:4 blank paper folio**, still not uploaded or rendered as a standalone production master; source prompt committed in `docs/nino/PASSPORT_BLANK_FOLIO_ART_MASTER_PROMPT_2026-10-26.md`. Do not create 10 flattened book pages.
2. **ARRIVO** — one heritage travel arrival rubber-stamp base with city text provided dynamically; actual earned scooter visits only, including revisits. No batch of seven duplicated stamps before QA.
3. iPad/desktop passport integration and final owner acceptance.

## Codex handoff (AFTER remote verification + Hermes alpha QA)
- Read `docs/nino/PASSPORT_FIVE_SPREADS_V2_SPEC_2026-10-26.md`, issue #21, #41, and `docs/NINO_JOURNEY_GOLD_STORY_2026-10-26.md`.
- Fit distinct Gold seals and cards as real accessible overlays (not pre-earned background stickers); landscape facing-pages, portrait single page, readable fronts/backs.
- Preserve active iPad Focus Mode, maps, 45 assessed targets, original pizza and Gold systems; avoid refactoring unrelated PRs (#29, #30, #40).
- One bounded draft PR with explicit source SHA, tests, screenshots, offline acceptance; no autonomous merge or deploy.

## Hermes handoff
- Verify all 7 master checksums against manifest and exact selected Venice source; test edge transparency on cream and blue, 64–240px detail/contrast, old-gold finish, parchment/stamp palette.
- Flag specific masks or perspective issues, propose minimal changes rather than regenerating imagery. Confirm no false earned artifacts.
- Hand actionable GO/ADJUST evidence to Codex; no duplicate implementation.

**Source release package upload is a prerequisite, not proof of the app being complete.**
