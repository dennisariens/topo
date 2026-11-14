# Nino Topo — Portal with owner-approved Logo R3.1

The portal source is `portal/index.html` on branch `feat/nino-topo-portal-r2`.

## Canonical asset integration
Destination images and character artwork retain their canonical R2 sources under `assets/nino-topo/v3-r2/`. The header now uses approved **optically centered Logo R3.1 SVGs**, imported unchanged from `art/nino-topo-r3-refinements`:
- `assets/nino-topo/v3-r3/brand/logo-r3/logo-01-primary-r3-1.svg` (desktop)
- `assets/nino-topo/v3-r3/brand/logo-r3/logo-02-compact-r3-1.svg` (mobile)

R3.1 preserves the canonical Nino/Vespa raster and outlined wordmark shapes. Original R2 logos are still available and unchanged.

No legacy logo or AI replacement artwork is used. Original R2 masters remain untouched. The user approved Logo R3.1 on 14 November 2026; this approval does **not** imply approval of the full portal, new welcome character, merge or deployment.

## Run locally
From the repository root, serve the checkout with `python3 -m http.server 8000` and open `http://localhost:8000/portal/`.

## Behavior
Desktop hover crossfades default to paired hover artwork (400ms). The original returns when hover ends. Touch does not require hover; future countries remain unlinked and visibly unavailable. Reduced-motion preferences disable transitions. The header switches from LOGO-01 to LOGO-02 at narrow widths.

**Activation gate:** The Italy card links to the existing repository-root `../index.html`, which is present on this branch. This is a working in-repository preview route, **not yet an approved public-domain deployment contract**. France has no verified learning entry and explicitly shows "Leeromgeving volgt". Never invent a France URL. Verify route mapping before deploying the standalone portal at `/`.

## QA command
Run `node portal/qa/verify.mjs` from the repository checkout to verify the R2 artwork, R3.1 source-invariant logos, flags and current route contract. See `portal/qa/STATE.md` for evidence and remaining manual acceptance gates.

## QA status
- Git tree confirms the presence of the 10 destination WebP assets, both canonical SVG logos, Nino/Vespa cutout and favicon.
- Logo R3.1 owner visual approval recorded on 14 November 2026. Real-browser screenshots and integration checks still open.
- Desktop, touch, keyboard, screen reader and real Safari validation still required before REVIEW_READY.
- No merge or deployment authorized.

## Design identity
Neutrals: #FAFAF9, #FFFFFF, #171B20, #73737D, #E5E5EA.
R2 lavender accent: #9781D5 with soft #D3C7ED.
