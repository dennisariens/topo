# Nino artwork — Topo (2026-10-24)

This folder contains the full-resolution PNG masters, source/reference images, concept archives, optimized WebP exports, and a verifiable manifest. **No app UI changes are included.**

## Runtime selection

| Event / state | Original PNG | Runtime WebP |
|---|---|---|
| Map-side guide | `characters/nino-guide.png` | `exports/nino-guide.webp` |
| Wrong-answer encouragement | `characters/nino-encourage.png` | `exports/nino-encourage.webp` |
| Six-question success | `characters/nino-success.png` | `exports/nino-success.webp` |
| Real Gold Mastery | `characters/nino-gold.png` | `exports/nino-gold.webp` |
| Welcome | `characters/nino-welcome.png` | `exports/nino-welcome.webp` |
| Vespa destination | `scenes/nino-arrival.png` | `exports/nino-arrival.webp` |

**Source of truth:** `references/nino-original-scooter.png`. Do not redesign Nino or replace the originals in `output/art/`. `sources/` contains 1024px earlier-generation images as archival provenance; `concepts/` must not be treated as production assets.

## QA / limitations

- All five character PNGs and the original scooter reference have actual transparent pixels (not a painted checkerboard). The Arrival illustration and reference landscapes are opaque scenes.
- Some supplied masters are 1024–1536px, despite preferred 2048px requests; no invented upscale has been made. `nino-success.png` and `nino-encourage.png` were already supplied as 2048×3072.
- The Encourage pose contains small gold ray/motion marks beside the thumb, contrary to the strict no-symbol brief. Flagged for owner review; do not silently call it final-approved.
- The Gold pose and other generated cutouts remain visual candidates until owner sign-off. The original source is locked.
- WebP is for efficient local app runtime; PNG masters are unchanged, retaining color/alpha and highest available detail.
- Only use the gold pose after an actual perfect Gold Mastery test. Do not invent scores, gold or pizza events.
- Keep offline-first behavior, map geometry, existing storage keys and keyboard/touch accessibility intact; image integration is a separate reviewed change.

Run `python3 scripts/verify_nino_art.py` from the package root to verify bytes and dimensions.
