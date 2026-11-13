# Nino Topo — R2 portal implementation

The portal source is `portal/index.html` on branch `feat/nino-topo-portal-r2`.

## Canonical asset integration
All artwork is loaded using repository-relative paths from `assets/nino-topo/v3-r2/` at the pinned R2 source lineage `b05a9d585ab9a47a9448e94ee7c70f425aba0337`. This includes LOGO-01/LOGO-02 SVGs, canonical Nino/Vespa illustration, five country destination WebPs, five paired hover WebPs and the approved 192px Vespa icon.

No legacy logo or AI replacement artwork is used. Original R2 masters remain untouched.

## Run locally
From the repository root, serve the checkout with `python3 -m http.server 8000` and open `http://localhost:8000/portal/`.

## Behavior
Desktop hover crossfades default to paired hover artwork (400ms). The original returns when hover ends. Touch does not require hover; future countries remain unlinked and visibly unavailable. Reduced-motion preferences disable transitions. The header switches from LOGO-01 to LOGO-02 at narrow widths.

**Activation gate:** The Italy card links to the existing repository-root `../index.html`, which is present on this branch. This is a working in-repository preview route, **not yet an approved public-domain deployment contract**. France has no verified learning entry and explicitly shows "Leeromgeving volgt". Never invent a France URL. Verify route mapping before deploying the standalone portal at `/`.

## QA command
Run `node portal/qa/verify.mjs` from the repository checkout to verify all R2 assets, canonical logos and the current route contract. See `portal/qa/STATE.md` for evidence and remaining manual acceptance gates.

## QA status
- Git tree confirms the presence of the 10 destination WebP assets, both canonical SVG logos, Nino/Vespa cutout and favicon.
- Owner visual header-size acceptance and real browser screenshots remain open.
- Desktop, touch, keyboard, screen reader and real Safari validation still required before REVIEW_READY.
- No merge or deployment authorized.

## Design identity
Neutrals: #FAFAF9, #FFFFFF, #171B20, #73737D, #E5E5EA.
R2 lavender accent: #9781D5 with soft #D3C7ED.
