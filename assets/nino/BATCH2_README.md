# Nino — chapter artwork batch 2 (24 October 2026)

Owner-created Nino, original scooter and existing Batch 1 assets are retained on the existing art branch.

This add-on contributes 2 standalone character images, 8 chapter scenes, one superseded Eilanden V1 reference and 10 optimized WebP exports.

## Canonical files

| Role | PNG master | WebP for app |
|---|---|---|
| travel | `assets/nino/characters/nino-travel.png` | `assets/nino/exports/nino-travel.webp` |
| reflect | `assets/nino/characters/nino-reflect.png` | `assets/nino/exports/nino-reflect.webp` |
| islands-v1 | `assets/nino/concepts/topo-eilanden-v1.png` | none (archived) |
| islands | `assets/nino/scenes/topo-eilanden-v2.png` | `assets/nino/exports/topo-eilanden-v2.webp` |
| volcanoes | `assets/nino/scenes/topo-vulkanen-etna.png` | `assets/nino/exports/topo-vulkanen-etna.webp` |
| mountains | `assets/nino/scenes/topo-bergen-dolomieten.png` | `assets/nino/exports/topo-bergen-dolomieten.webp` |
| cities | `assets/nino/scenes/topo-steden-firenze.png` | `assets/nino/exports/topo-steden-firenze.webp` |
| seas | `assets/nino/scenes/topo-zeeen-amalfi.png` | `assets/nino/exports/topo-zeeen-amalfi.webp` |
| rivers | `assets/nino/scenes/topo-rivieren-po.png` | `assets/nino/exports/topo-rivieren-po.webp` |
| countries | `assets/nino/scenes/topo-landen-italie-slovenie.png` | `assets/nino/exports/topo-landen-italie-slovenie.webp` |
| regions | `assets/nino/scenes/topo-streken-toscana.png` | `assets/nino/exports/topo-streken-toscana.webp` |

## Owner & QA notes

- These are creative chapter scenes, NOT accurate map geometry. The real map and school worksheet remain geographic sources of truth.
- Image generation did not guarantee the 2560×1440 target: chapter PNGs are 1672×941. Do not report upscaled pixels as native generation resolution.
- Nino Travel and Reflect are native cutouts with alpha. The scenic chapters are RGB panoramas.
- Keep older `output/art/nino-op-de-scooter.webp` unchanged.
- Art pack alone changes no HTML, app icons, routes, map positions, quiz content, grading, or progress.
- Independent character drift, spelling, small-device crop and cultural/geographic review before integration.
- Eilanden V1 is archived; V2 with Sardegna and Sicilia signs is the canonical scene.
- `assets/nino/manifest.json` combines the existing first batch manifest with all new source + export hashes.
- Do not auto-merge or deploy.
