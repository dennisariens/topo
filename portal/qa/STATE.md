# Nino Topo Portal — R2 QA / reviewer state
**13 November 2026 · Branch:** `feat/nino-topo-portal-r2`

## Verified against GitHub
- Canonical R2 source branch `art/nino-topo-website-v1` at `b05a9d585ab9a47a9448e94ee7c70f425aba0337`.
- Ten WebP paths exist (five country defaults and five matching hover pairs).
- Correct image themes inspected individually: Amalfi / Rome + Fiat 500, Paris / Provence peloton, Andalusia / Barcelona, Bavaria / Berlin, Amsterdam / windmills.
- LOGO-01, LOGO-02 use the R2 non-legacy SVG files; Nino/Vespa uses the canonical transparent asset.
- Layout code uses 400ms desktop crossfade, reduced-motion handling, mobile card stacking, and visible focus on actionable Italy link.
- Italian repository-root entry `index.html` exists. `../index.html` is enabled only as the branch-local route, not accepted as public-domain routing.
- France remains intentionally unavailable.

## Fixes applied in implementation pass
- Larger, separate Nino illustration gutter rather than blocking Spain or the featured card.
- More accurate vertical rhythm and simplified hero without additional eyebrow.
- Functional whole-card click target for Italy using native anchor overlay; keyboard focuses the underlying link.
- Removed unproductive tabindex stops from disabled/future cards.
- R2 palette and soft lavender status badges preserved.
- Deterministic `node portal/qa/verify.mjs` check added.

## Local browser exercise — limited scope
A **previous ZIP-based modular variant**, with local mock images and a mocked logo (not the exact GitHub commit), was exercised using Chromium `page.set_content` at 1440×900, 820×1180, 390×844 and 320×720. It showed five country cards, ten image elements, no overlap or horizontal overflow and no JS page errors. The exercise helped identify the previous left-gutter overlap. **These screenshots are NOT production-R2 screenshot evidence and do not validate the final GitHub layout.**

## OPEN acceptance gates
1. Exact GitHub branch with original R2 assets in a normal browser: desktop, iPad landscape/portrait and mobile screenshots; compare with owner-approved concept.
2. Header-size LOGO-01/02 visual review (canonical raster is embedded in SVG).
3. Hover transitions and image crops tested with the original R2 image bytes across all five pairs.
4. Keyboard, touch, reduced-motion, VoiceOver and Safari coverage on the final artifact.
5. Spanish flag: CSS striping omits the official coat of arms; replace with reviewed high-fidelity vector flags before final visual signoff.
6. Public-domain route contract: Italy `../index.html` is valid within repo hosting but must be remapped if the portal is deployed at domain root; France entry remains unavailable.
7. Ensure no 404s, CSP conflicts or loading regressions in a real hosted preview.
8. Owner visual acceptance.

**Status: QA PARTIAL — NOT REVIEW_READY. No merge or deployment authorized.**
