# NINO TOPO — Artwork R3 production prompts
**Owner feedback 13 November 2026.** This is a targeted refinement, **not** a new brand direction.
Use the approved R2 originals at `assets/nino-topo/v3-r2/` as immutable references. Work in `art/nino-topo-website-v1` or a new branch based on it. **Do not modify the original approved R2 files in place.**

## Prompt A — LOGO-R3 / optical refinements
**Source:** `brand/logo/logo-01-primary.svg`, `logo-02-compact.svg`, `logo-03-wordmark.svg`, `brand/characters/nino-vespa-logo-master.png`.

> Refine the exact established Nino Topo primary and compact vector lockups. The approved Nino/Vespa character is non-negotiable, as is the original custom `nino.` lettering and lavender dot. Reduce the scooter illustration's optical weight relative to the lettering by approximately 15–20%, not by randomly scaling the whole lockup. Align the character baseline with the wordmark, refine negative space, and make the divider between `nino.` and `TOPO` visible at actual header size. The divider should feel intentional, not decorative or loud. Keep `TOPO` outlined and secondary; do not replace any wordmark paths with fonts or regenerate the character. Produce harmonious LOGO-01 (character + nino. + divider + TOPO), LOGO-02 (character + nino.), LOGO-03 unchanged. Use the R2 brand #171B20 and #9781D5 with restrained neutral context. Produce versioned R3 SVG and WebP/PNG exports. Show full-width desktop header crops at 1× and 2× and compact mobile header for comparison with R2, on #FAFAF9 and #FFFFFF. No new icons or compass marks.

**Deliver:** `brand/logo-r3/logo-01-primary-r3.svg`, `logo-02-compact-r3.svg`, preview R2/R3 grid and size/readability QA notes. Preserve R2 and font/path geometry; no signoff until reviewed at real browser size.

## Prompt B — NINO-WELCOME-R3 / distinct homepage guide
**Source:** official `brand/characters/nino-vespa-canonical.png` and other approved source views. Subject stays canonical.

> Create a new premium cinematic character illustration for the Nino Topo homepage, separate from the existing logo image. Nino is a curious 11–13-year-old European explorer and approachable guide: brown curly hair, freckles, olive leather aviator helmet with bronze goggles, blue shirt, flowing red scarf, olive trousers, brown shoes, brown travel backpack; his vintage red Vespa keeps the exact approved design and colors. Keep recognisable face and proportions from the official R2 character, but subtly reduce the baby-faced impression by a more assured posture and engaged expression. Pose: standing next to the parked Vespa, one hand resting naturally on the handlebars, gaze gently inviting toward the country cards to the right. His purpose is to welcome, not overwhelm the cards. A second optional pose may show him about to set off on an adventure, positioned facing right and with lots of open breathing space around the scarf. Full body and the Vespa must fit inside frame; transparent clean edges; no artificial beige background, halos, text, UI, badges, logos, flags or monuments. Premium painterly cinematic 3D illumination, matching official R2 art, not generic cute preschool cartoon. Source identity must be reviewed for fidelity. No arbitrary redesign.

**Deliver:** two alternatives max with transparent high-resolution masters and optimized WebPs, character side-by-side comparison with canonical, recommended crop placement for 1440 desktop and 1024 tablet. No website integration until owner selects.

## Prompt C — Side-view Vespa favicon R3
**Source:** `brand/icons/vespa-icon-02-compact.png/.webp` showing the approved side-on red Vespa.

> Produce a restrained, instantly recognisable red Vespa side silhouette favicon from the approved source. Keep form and color faithful; increase visual contrast and simplify tiny details only for legibility, not change vehicle proportions. Avoid a person in the icon; preserve iconic side panel, wheels, seat, headlamp and red body. The purpose is recognisability at 16px, not vehicle photorealism at small size. Evaluate light and dark browser tabs, Safari pinned tabs and iOS icon rendering; use a warm neutral field only if strictly necessary for legibility. Compare against current premium front-angled scooter favicon.

**Deliver:** tested `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, optional `favicon.ico`, and `apple-touch-icon-180.png` from a controlled master. Show true native-size contact sheet, not enlarged-only composites.

## Integration and release gates
1. Character and logo must remain unmistakably the same Nino; no independent regeneration.
2. Use R2 provenance in the asset manifest; retain original PNG/source.
3. New art delivered separate from website screenshot; transparent where required.
4. Header and Nino assets require explicit owner comparison approval before replacing current R2.
5. Actual desktop/iPad/mobile screenshots and functional hover/focus tests are required after integration.
6. No merge or production deployment without owner approval.
