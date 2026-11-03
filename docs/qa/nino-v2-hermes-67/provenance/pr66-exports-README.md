# TOPO / NINO — CARTOLINA 04 VENEZIA · approved scalloped artwork handoff

**Owner VISUAL GO: 31 October 2026.** The vintage Venezia painting and original scalloped postage-stamp contour are approved for use in the passport. This is an **art-only** branch; it does not change the app, the rewards, the passport runtime or the source artwork.

## Source / edit status

- Untouched master: `assets/nino/travel-passport/postcards/masters/postcard-04-venezia-front.png` (Git blob `47b7c616d0a2ca8956a3d302c0c1a270f2320bf0`).
- New source contour: `postcard-04-venezia-approved-contour.svg`, traced from the actual owner-reviewed alpha; **572 sampled points**, original 1536 × 1024 pixel reference.
- Reproducible conversion: `scripts/build_venezia_postcard.py`; keeps **every original RGB pixel** and recreates transparent outside pixels. Outputs full and tight PNG, matching lossless WebP, and a SHA256/size manifest.
- Existing original is **never replaced**. No generative repaint, no blur/retouch, no upscaling.
- The owner's approved raster alpha was separately rendered/checked on dark, light and warm-gold backgrounds before this commit.

## Actual limitations / transparency

The **large owner-reviewed PNG/WebP export binaries are not uploaded in this branch**. The GitHub connector could not ingest those multi-megabyte local binaries directly; the **source contour and tested generator are committed** instead. Hermes can generate the export from the original master already tracked in this repository:

```sh
python3 -m pip install Pillow
python3 scripts/build_venezia_postcard.py
```

The regenerated file maintains every original RGB byte in the decoded pixels; a raster-to-vector approximation changes a *small number of antialiased contour-edge alpha pixels*, so it is **NOT** byte-identical to the owner-reviewed raster mask. In local comparisons at 1536×1024, decoded RGB was identical, and only 0.1264% of pixels had alpha deviation >64. Visually check at native size before promoting exports; for exact owner-review pixels use the original locally delivered artwork ZIP if available. The generated full PNG and lossless WebP were decoded and compared identical to one another. No production acceptance of the app or build is implied.

## Artwork status / later polish

- **PASS, owner visual approval:** Venice vintage illustration, Rialto Bridge scene, scalloped postcard contour, transparent outside.
- **LATER, OPTIONAL:** Owner feels the **Rialtobrug appears too large** in the composition. Record it, but **do not alter the current approved painting** or regenerate it during this narrow art-delivery PR. If revised later, make a separate art option for visual approval; do not silently replace this master.
- **NOT included in this PR:** new postcard, passport unlocking or scoring logic, new icon, app integration, deployments, Safari/iPad tests.

Once Hermes is free, use this contour/source to build the full transparent export, verify against warm-paper/card backgrounds, and integrate it only where a postcard has actually been earned. Avoid an opaque gold rectangle or phantom rewards.