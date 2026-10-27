# TOPO / NINO — Passport artwork production handoff (27 October 2026)

> **Git delivery update — 27 October:** The eight owner-provided split ZIPs have now been physically received, verified and additively imported into this art branch. See the [intake report, source hashes, native measurements and single Hermes handoff](../qa/artwork-20261027/intake/README.md). The earlier “NOT YET PUSHED” wording below is the historical design-package snapshot, superseded for source availability by this intake commit, not for production approval. All20 existing passport masters remain byte-identical. No new asset is activated in the app.

**State:** ART DIRECTION LOCKED. New source candidate package assembled and verified in the design conversation. **Physical ZIP binaries NOT YET PUSHED TO GITHUB**; production release / user acceptance / independent QA remain pending. Do not confuse design approval, source availability or checksums with production-ready alpha.

## Package and provenance

**Handoff archive:** `TOPO-NINO-PASSPORT-ART-QA-HANDOFF-20261027.zip` (download artifact in ChatGPT design conversation; do not invent a GitHub attachment URL).  
Archive contains 16 new original image sources/candidates, 2 derived lossless WebP alpha-normalized folio QA exports, manifest with per-file SHA256/native pixels, composite QA contact sheets (cream/dark/checker), complete SHA256SUMS and `PUSH_TO_GITHUB.sh` for additive source import on a clean authenticated art-branch clone. ZIP integrity & per-file checksums were locally reverified.

Already verified on art branch `art/nino-travel-stamps-v2-20261026`: 11 original chapter ink-stamp masters, 2 distinct original Gold seals, four collectible postcard front masters and one shared reverse, plus current closed/open book masters. **Do not reupload or overwrite those source masters.**

### New assets in handoff

| Group | File(s) | Current gate |
|---|---|---|
| Reusable blank folios | `book/masters/passport-blank-folio-{left,right}-master.png` | Owner-approved design; each native **1086×1448**, below optional 1536×2048 target; edge alpha production approval pending |
| Folio QA exports | `book/qa-candidates/passport-blank-folio-{left,right}-alpha-normalized.webp` | Lossless alpha normalization, **RGB decoded exactly equal to original source RGB**; both center alpha=255; composite QA proof; on-device visual acceptance pending |
| Passport design reference | Pages **01 V2, 02 V2, 05, 06, 07, 08, 09, 10 V2** | **CONCEPT ONLY, DO NOT embed** as 8 fixed page backgrounds; page 07/08 cropped native 768×1024; baked borders, photo corners, and visual motifs may conflict with dynamic content |
| Optional closing endpaper | `book/concepts/passport-back-endpaper.png` | Optional cosmetic flourish after page 10, not an eleventh live achievement page |
| Gold ornament | `gold/concepts/gold-finale-ornament-overlay.png` | **REWORK alpha**: red/yellow colored semi-alpha fringe/flecks. Existing final Gold seal remains independent; no product dependency on ornament |
| Extra postcards | `postcards/concepts/postcard-05-bologna-front.png`, `postcard-06-milano-front.png` | RGB postcard art source concepts with painted paper surround, not prepared alpha cutouts; optional future collection, not beta blocker |
| ARRIVO | `arrivo/qa-candidates/arrivo-travel-ink-preview.png` | QA needed for alpha and readability; actual trips only via canonical reward cycle |
| ISOLE correction | `stamps/rework/stamp-05-isole-geography-candidate.png` | Sardinia NW of Sicily candidate; requires **Hermes geography+alpha** acceptance before shipped stamp |

**Native dimensions must not be claimed as 1536×2048 or 3072px based on upscaling.** Both blank folios' actual original size is 1086×1448. Their pixel fidelity is sufficient for an initial design QA proof, but Retina readiness must be tested on real iPad before release.

## Immediate engineering use

Codex continues current P0 all-45 learning integrity / standalone offline computer HTML work. **Do not interrupt or rebase P0** for passport cosmetics. Then implement ONE openable passport using existing read-only canonical state per `PASSPORT_FIVE_SPREADS_V2_SPEC_2026-10-26.md`, the pages03/04 design decision and PR #49's state selectors as input (not as a finished UI). Use the shared clean folio backgrounds **only after alpha/visual acceptance**, and live HTML/CSS overlays for headings, chapter stamps, conditional Gold seals, earned postcards, pizza and real Vespa ARRIVO. Avoid source-book baked postmarks and do not merge the legacy art branch's app.

No 12th chapter: 11 chapter identifiers, 11 chapter Gold statuses, and one final seal only when all 11 true `goldAt>0`. No invented travel or quiz geometry; 45 source-backed targets, original score, offline `file://` HTML, save/migration stay unchanged.

## Hermes specific QA (single bounded pass)

1. Blank folios paired at landscape double-page and 1-up portrait, check seam orientation, paper color, native texture, alpha on warm paper/dark/checker, readable real captions at 1x/2x, and actual iPad.
2. ISOLE source-vs-corrected at 64/96/160px, Sardinia clearly NW of Sicily vs canonical island footprints, no artifact checker/white matte over ink.
3. ARRIVO stamp alpha/readability/dynamic label and real repeated Vespa trip eligibility.
4. Original chapter Gold and finale seal separate, alpha/64–240px readability and no counterfeit pre-earned badge.
5. Two optional RGB front postcard concepts only if owner later selects them; don't block first release. Gold ornament is flagged REWORK and can be excluded entirely.

**Creative production freeze:** stop new decorative page generations until actual device/app integration demonstrates a specific missing visual component.

## Git hygiene

The handoff archive is NOT a Git commit. Script adds files only after clean remote/branch verification and refuses any existing destination paths; it does not auto-commit, merge, deploy or replace learner data. Existing PR #48 art QA allowlist remains authoritative for its previously audited 10/11 stamp exports. This additional package is independent and cannot retroactively upgrade #48's verdicts.

**Adjacent visual concept:** `ATLANTE_DI_NINO_DISCOVERY_MAP_VISUAL_DIRECTION_2026-10-27.md` remains a one-prototype map-first atmosphere direction; keep readable geography and true map footprint intact.
