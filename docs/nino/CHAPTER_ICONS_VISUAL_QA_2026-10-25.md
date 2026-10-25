# Topo chapter icon set — visual benchmark & technical QA (2026-10-25)

**Status:** **GO for art-branch source upload.** Not yet integrated into app and NOT approved for production deployment.

## Approved reference
- Original owner-created Nino / Italian-coast visual assets and Topo 2026 renewed travel-journal UI.
- First icon **Florence V2** defines the approved matte cream round frame; Rome, hilltown, Liguria, islands, Dolomites, Etna, regions, border, seas, rivers follow it.
- Earlier composite concept-sheet icons are visual inspiration, not exact production masters; this eleven-piece V2 series supersedes their border/rendering treatment.

## Visual review
| Icon | Subject | Visual gate |
| --- | --- | --- |
| 01 | Firenze Duomo | PASS |
| 02 | Rome Colosseum | PASS |
| 03 | San Gimignano-inspired town | PASS |
| 04 | Ligurian coast | PASS |
| 05 | Mediterranean islands | PASS with note: coast is more legible than isolated island silhouette |
| 06 | Dolomites | PASS |
| 07 | Etna-inspired volcano | PASS; stylized, not exact eruptive/topographic study |
| 08 | Val d'Orcia regions | PASS |
| 09 | Alpine border, Italian marker, France/Switzerland/Austria flags | PASS with note: arrow directions symbolic, not real pass geography |
| 10 | Mediterranean sea | PASS |
| 11 | Meandering river and bridge | PASS |

**Overall visual verdict:** 9/10 for coherent high-quality Nino/Topo warm Mediterranean premium illustration family. No new image generation required before pushing these masters.

## Technical gate
- All 11 unique source images present in the conversation runtime, **native 1254×1254 RGBA**. Do not misreport as 2048 native.
- All source images have transparency outside circle, but sub-16-alpha fringe/speckles around cutout perimeter. Clean these negligible fringe pixels to true transparent in derivative masters before upload.
- Preserve original RGB colors and all visible content. Separate **archival PNG** from **optimized 512px WebP**.
- Inspect 96/64/48/32px. At 64–96 the subjects work. At 32, icons are atmospheric rather than sufficient geographic markers: ALWAYS keep external chapter text and/or canonical legible SVG route pictogram.
- 09 baked-in flag/text detail cannot be read at 32–48; do not rely on it to name countries.
- 05 is an illustrative island coastline, not a map or literal Sardinia/Sicily silhouette. Geographic identification belongs to the real interactive map.
- All icons use a creamy matte ring rather than Gold Mastery gold. No newly generated Nino characters.

## Package prepared LOCALLY, not GitHub
`TOPO-ICONS-ART-01.zip` through `TOPO-ICONS-ART-06.zip` (each <6MB) plus `TOPO-ICONS-QA-MANIFEST.zip`, in this conversation's downloads. These contain 11 cleanup-only native-size PNG masters, 11 alpha WebP exports, manifest of SHA-256 hashes and provenance, 32/48/64/96 previews, contact sheet and an optional safe art-branch upload shell script.
**Important: source pixels and binaries are not yet in GitHub. Do not claim Git sync complete until the binary file paths appear in `assets/nino/chapter-icons/` in the GitHub tree.**

## Codex/Hermes integration checks
- Verify routing to all 11 actual lesson group IDs; maintain exact current map/scoring.
- Check desktop/iPad/mobile small cards, dark/light contrast if supported, 200% font and focus/labels.
- Preserve standalone offline availability, text equivalents, locked/unlocked contrast and profile/passport references.
- Real iPad Safari acceptance is distinct and still pending.
- Separate owner review before merge/deploy.
