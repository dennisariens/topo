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
- Replaced approximate CSS flags with the 4×3 ISO-country vector flags from MIT-licensed lipis/flag-icons, including the Spanish coat of arms and bundled LICENSE.

## Local browser exercise — limited scope
A **previous ZIP-based modular variant**, with local mock images and a mocked logo (not the exact GitHub commit), was exercised using Chromium `page.set_content` at 1440×900, 820×1180, 390×844 and 320×720. It showed five country cards, ten image elements, no overlap or horizontal overflow and no JS page errors. The exercise helped identify the previous left-gutter overlap. **These screenshots are NOT production-R2 screenshot evidence and do not validate the final GitHub layout.**

## OPEN acceptance gates
1. Exact GitHub branch with original R2 assets in a normal browser: desktop, iPad landscape/portrait and mobile screenshots; compare with owner-approved concept.
2. Header-size LOGO-01/02 visual review (canonical raster is embedded in SVG).
3. Hover transitions and image crops tested with the original R2 image bytes across all five pairs.
4. Keyboard, touch, reduced-motion, VoiceOver and Safari coverage on the final artifact.
5. Vector flag integration complete; still verify legibility/alignment at actual card size in final browser review.
6. Public-domain route contract: Italy `../index.html` is valid within repo hosting but must be remapped if the portal is deployed at domain root; France entry remains unavailable.
7. Ensure no 404s, CSP conflicts or loading regressions in a real hosted preview.
8. Owner visual acceptance.

**Status: QA PARTIAL — NOT REVIEW_READY. No merge or deployment authorized.**

## R3 refinement pass — 13 November 2026
**Owner feedback:** design is calm and premium, but must feel more inviting; logo Vespa appears oversized vs wordmark, divider too subtle, hero Nino repeats the logo and looks younger than desired.

**Implemented in portal code**
- CTA hover now reacts to card hover with understated elevation, deeper lavender and +3px arrow movement; respects reduced-motion.
- Root cause of synchronized teaser hovers corrected: previously `.future:hover` matched the shared `div.grid.future` container **and** individual cards. Selectors are now scoped to `.country.future:hover` only.
- Coming-soon visuals retain gentle color and are less fogged while still distinct from open destinations.
- Official 4:3 SVG flags now sit inside a subtle rounded capsule instead of exposed rectangles.
- The existing R2 side-view Vespa is the favicon candidate (WebP); native 16/32/48px checked exports remain in the asset task.
- The subtitle is now invitation-led: “Kies een land, ontdek bijzondere plekken en leer de kaart kennen.”
- White normal-text contrast on brand `#9781D5` is about 3.27:1 (below AA 4.5:1). The primary CTA now uses dark lavender `#7B66B7` (~4.74:1) and hover `#6A539F` (~6.27:1); brand lavender stays an accent.
- Automated static regression assertions added to `portal/qa/verify.mjs` for selective hover, CTA color contrast, vector flag capsules and side-view favicon binding.

**Awaiting owner-approved source artwork (not coded around)**
- R3 logo internal proportions, separator and TOPO optical alignment.
- Separate Nino-welcome illustration with a slightly older, more confident age impression, still unmistakably canonical.
- Tiny-size quality checked favicon raster exports.

**See:** `portal/docs/FINAL-REFINEMENT-BRIEF.md` and `portal/docs/ARTWORK-R3-PROMPTS.md`.

**Gate status:** Static code and asset mapping updates completed; exact real-R2 screenshot review on desktop, tablet and mobile, functional browser verification and owner approval still outstanding. No merge or production release.


## Logo R3.1 owner approval — 14 November 2026
**Visual decision:** OWNER APPROVED Logo R3.1, with exact original Nino/Vespa, smaller icon and centered composition, for portal use. This is logo-specific approval, **not a site release GO**.

**Integrated unchanged on feature branch:**
- `assets/nino-topo/v3-r3/brand/logo-r3/logo-01-primary-r3-1.svg` — desktop
- `assets/nino-topo/v3-r3/brand/logo-r3/logo-02-compact-r3-1.svg` — mobile

Original R2 logos kept. Updated `portal/index.html` header references only; no change to learning engine or country data.

**QA added:** `portal/qa/verify.mjs` asserts the embedded Nino PNG and wordmark SVG path data remain identical to R2. GitHub import/asset path validation is separate from actual browser rendering.

**Remaining gates:** logo display at true responsive header size, official welcome mascot artwork (not yet approved), app route verification, complete mobile/Safari/a11y review, owner portal GO. No merge/deployment.
