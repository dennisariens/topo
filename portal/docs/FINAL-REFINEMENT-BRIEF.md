# NINO TOPO — FINAL PORTAL REFINEMENT BRIEF
**Decision brief + implementation tasking | 13 November 2026**
**Branch:** `feat/nino-topo-portal-r2` • **PR:** #82 (draft, no merge)
**Artwork source:** `assets/nino-topo/v3-r2/` on `art/nino-topo-website-v1`

## North star
The child should feel *"I want to explore this country now"*, while parents recognize a carefully made, reliable learning product. Retain the approved light Apple/Linear-like UI; warm cinematic country illustrations carry the emotion, the interface supplies clarity.

Preserve heading **“Waar gaan we vandaag naartoe?”** and keep copy concise. Current proposed subtitle: **“Kies een land, ontdek bijzondere plekken en leer de kaart kennen.”**

## LOCKED / KEEP
- Nino Topo brand name and approved light, spacious layout: Italy/France featured, Spain/Germany/Netherlands teased below.
- Official R2 country imagery: 5 defaults + 5 country-specific hover images. No Nino inside destination artworks.
- Official R2 brand lavender `#9781D5`; soft `#D3C7ED`, tint `#F1EDFA`; charcoal `#171B20`; background `#FAFAF9`. Earlier V1.1 proposal `#7464A8` is superseded by this canonical R2 branding for this branch.
- Flags as real SVG vector artwork (accurate national symbols), with a **soft pill-shaped visual container**; never approximate national crests in CSS.
- Only Italy has a confirmed in-repository educational entry. France is showcased visually but no fake learn link. All future countries remain unavailable.

## P0 — code / immediate (implemented on feature branch)
1. **CTA microinteractions.** Hovering a featured card subtly elevates the card, darkens its lavender CTA, lifts the CTA shadow and nudges the arrow 3px. Do not add bounce/tilt. Keyboard focus should be equally obvious.
2. **Independent teaser hovers — bug fix.** The class `.future` was on BOTH the lower grid and each card, so `.future:hover` matched the entire grid and animated all three. Scope hover selectors to `.country.future:hover` only. Test each card individually and repeat on mobile, where hover is optional.
3. **Inviting coming-soon treatment.** Preserve grayscale but raise image opacity and retain a hint of colour. Proposed reference: `grayscale(.78) saturate(.62)`, default `opacity:.69`, hovered second image `opacity:.73`. These are implementation starting values, not immutable visual thresholds.
4. **Flag capsules.** Official SVGs inside quiet `40×28px` rounded shells; balance spacing and alignment with names.
5. **Favicon candidate.** Preview the existing R2 side-view Vespa asset `brand/icons/vespa-icon-02-compact.webp`. Keep approved Apple touch icon. True 16/32/48 px exports must be reviewed for legibility before final release.
6. **Clearer first-run copy.** Heading locked; one sentence that sells exploration rather than listing only geography categories.

## P0 — asset production required (DO NOT fake in CSS)
### A. LOGO-R3 — optical balance, *same identity*
Current R2 logo is technically canonical, but in the real header the scooter overwhelms `nino.` and the lavender divider is too subtle.
- Reduce the Nino/Vespa illustration's *optical mass* by ~15–20% relative to the existing custom `nino.` paths; test at actual 80–100px header height rather than using only percentage.
- Keep the custom wordmark path geometry **identical** for LOGO-01, LOGO-02 and LOGO-03, including lavender dot. Do not recreate the lettering in CSS or substitute a font.
- Make the divider visible at normal header scale with a refined lavender rule (`#9781D5` or `#D3C7ED` if contrast permits), appropriate length and spacing; align `TOPO` more precisely.
- Preserve the exact approved Nino/Vespa source, colours and overall style; no independent character regeneration.
- Create **new versioned SVG + optimized PNG/WebP exports**, not destructive overwrites. Test against white and warm neutral backgrounds.
- Deliver a side-by-side header sheet **R2 vs R3** at 1440 desktop, 820 tablet, 390 mobile, plus 1× and 2× crops.

### B. NINO-WELCOME-R3 — distinct hero character
The homepage Nino should not simply be a large duplicate of the logo raster.
- Create a **separate welcoming guide pose** of established Nino, visibly different from the riding logo. Possible direction: standing beside the parked Vespa, looking toward countries or inviting the child into the journey. Avoid blocking card CTAs or drawing attention away from the destination artworks.
- Owner perceives current Nino as too baby-faced. Target age impression: **curious 11–13 year-old explorer**, not preschool, not teenage/adult; communicate maturity mainly via posture, expression and proportions.
- Keep canonical brown curly hair, freckles, olive aviator helmet with bronze goggles, blue shirt, red scarf, olive trousers, brown backpack, vintage red Vespa.
- Native transparent source, clean edges/no artificial halo, visually consistent lighting, generous safe margins; optimized desktop WebP. Do not make an AI-generated approximation without reference to the canonical source and explicit owner approval.
- Provide 2 candidate poses max with side-by-side source comparison, then owner chooses; only swap the webpage asset after approval.

### C. FAVICON-R3 — side Vespa
Review `brand/icons/vespa-icon-02-compact.webp` as the starting source. Produce **native-checked 16×16, 32×32, 48×48 PNG** and Apple touch 180px version; preserve visible red scooter silhouette and avoid visual clutter. Do not claim downscaled 512px detail survives at 16px; check Safari, Chrome and iOS.

## P1 — experience + quality
- Exact original-R2 browser screenshots: 1440×900, 1280×800, iPad portrait/landscape, 390×844, 320×720.
- Verify only the hovered teaser changes its paired image; on keyboard only actual links participate in tab order; reduced-motion disables all motion.
- Active Italy: direct working navigation from card; revisit public-domain route at launch (`../index.html` is branch-local, not production contract). France stays unavailable until its learning route is confirmed.
- Check actual SVG flag legibility (Spain coat of arms), button contrast, truncation of long translated text (future i18n), touch targets, cropped focal points, image decode/no 404 and layout shift.
- No extra header search/profile icons unless they have real functions; avoid decorative dead controls.
- Shared educational engine, geography, saved progress, rewards, map and V3/V4 code must be unchanged.

## Acceptance criteria
- [ ] Logo R3 optically balanced: icon does not dominate `nino.`; divider is legible.
- [ ] Homepage guide is a different approved Nino pose, not logo upscaled.
- [ ] Red Vespa side favicon legible at 16, 32 and 48 px.
- [x] Country CTA responds to card/button hover; subtle motion only.
- [x] Lower grid hover affects **one** card at a time in CSS.
- [x] Upcoming images retain muted colour and no longer feel flat/disabled.
- [x] Accurate vector flags presented inside soft capsules.
- [ ] Reviewed desktop, iPad and mobile screenshots against reference.
- [ ] Direct Italy link verified in intended deployment route; France status truthful.
- [ ] Keyboard, screen reader, touch, Safari, reduced-motion and real browser images verified.
- [ ] Owner visual GO before merge/deployment.

## Hand-off split
**Artwork branch:** LOGO-R3, NINO-WELCOME-R3, favicon exports, contact sheet, provenance and native size QA. **Codex:** implement approved swaps, responsive polish and browser checks. **Hermes:** independent regression/accessibility/visual verification. **Main:** product decisions and owner review. Do not assign duplicate implementation streams.

**Release rule:** the page is a polished *review candidate* until the artwork acceptance and original-asset browser QA pass. No merge, no public production release without owner approval.
