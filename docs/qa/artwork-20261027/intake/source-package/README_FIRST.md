# TOPO / NINO — Artwork delivery, 27 October 2026

**Package type:** additive visual-source + QA handoff (NOT the final production release). The original source PNGs in this package are byte-identical to the conversation files. Two optional, separately named blank-folio QA exports have their alpha normalized **without changing RGB**. All input originals remain untouched.

## What is genuinely ready
- Creative direction for the complete ten-page passport, gold finale and endpaper is established.
- One reusable 3:4 LEFT and RIGHT paper folio is in this pack, with **separate derived lossless WebP alpha-normalized QA candidates**. Both native 1086×1448, NOT the requested native 1536×2048 / Retina-certified size. Do not falsely mark as high-resolution masters.
- 6 postcards conceived (4 original in Git, 2 optional source concepts here).
- Existing 11 original chapter stamp masters, two genuine Gold seal source masters and four original postcards + universal reverse are **already in Git**. They are NOT duplicated in this upload pack.

## Why some assets are concept-only
The individual full-page pieces (01/02/05/06/07/08/09/10) still contain ornamental book furniture, page binding, preprinted frame or decoration, or insufficient resolution. They are **design references**, not a substitute for the shared blank folio + live HTML achievements. Page 07/08 have only 768×1024 native crop resolution. Page 01 V2 has empty portrait/photo holders; page 02 V2 shows postcards in its margin and decorative postmarks but no rewards. The app must own labels, navigation, real chapter stamp/Gold state, 3-flavor pizza count and actual travel.

## Exactly what is open
1. **Folio:** visually inspect the two *alpha-normalized* lossless WebP candidates on cream, dark and checkerboard; verify edge safety and book-spread seam. They are 1086×1448 native and must not be called 1536×2048 just by resampling. Review on iPad before integrating. No new global full-page rendering needed unless high-resolution is a hard acceptance gate.
2. **ISOLE:** independent Hermes geography recheck of the corrected candidate against canonical islands and legible red-blue ink at 64/96/160px. Until approved show a truthful text-only completed chapter state.
3. **Gold original seals:** present in repo but production alpha, text readability, small-size consistency require final QA. The decorative frame source here has **severe red/yellow semi-alpha halo/flecks** — deliberately NOT exported to production; optional anyway.
4. **ARRIVO:** source QA candidate is included. Distinct from any chapter and Gold stamp; city/dates/status dynamic from genuine Vespa journeys only. Inspect alpha and 1x/2x; no fabricated place visits.
5. **Postcards:** 05 Bologna and 06 Milano are RGB photographic paper postcard concepts, not alpha-cut transparent exports and not auto-eligible rewards. Owner can shelve both for later.
6. **Piza box hinge** is a separate P2 art problem, not a passport release blocker. The static box fallback is already accepted for the learning beta.

## Implementation boundary
Original app retains all 45 targets and 11 chapters, 2 map paints, actual `stage===3`, Gold `goldAt>0`, final Gold only at 11/11, actual Vespa arrival progression, correctly earned pizzas, offline file:// HTML, persistence. Dynamic page content must be above the folio asset. Read project contracts from `docs/nino/` and Hermes PR #48 before integrating.

## Existing Git files and missing physical upload
This ZIP **has not been uploaded to Git** by merely generating it in this session. It is staged in repository-relative paths; use the included `PUSH_TO_GITHUB.sh` on a clean authenticated clone or let Codex do the narrow art-only import. **Do not merge an old art branch's application**. The script refuses unclean worktrees, tracks additive changes, and does not overwrite existing binaries.

## QA evidence
- `docs/qa/artwork-20261027/asset-catalog.jpg` full new visual catalogue
- `docs/qa/artwork-20261027/alpha-composite-{cream,dark,checker}.jpg` scaled asset previews over controlled backgrounds
- `docs/qa/artwork-20261027/manifest.json` file-by-file native pixels, SHA256, alpha extrema, status, notes and export provenance

**Signoff:** visual design mostly complete; full image production and device integration QA not complete. No product release GO implied.
