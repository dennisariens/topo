# TOPO PIZZA SLICES — MARGHERITA

Eight original, exact pixel-extracted pizza slices from the approved Margherita Pizza Master.

- Source file: `top_down_studio_style_isolated_shot_of_a_whole_piz.png`, **1254 × 1254 pixels**.
- Shared cut intersection: **(622, 600)** in original image pixels.
- Sector 01 begins at 12 o'clock; sectors are 45° clockwise.
- `individual_slices/`: 8 cropped, lossless RGBA PNGs with 12px transparent margins and `pixel_origin` in manifest.
- `aligned_full_canvas/`: 8 original-size RGBA PNGs for perfectly registered stacking without rotating a sample wedge.
- `pizza-margherita-slice-icon.png`: isolated representative slice, derived from sector 01, 512px transparent PNG.
- `quality_checks/`: pixel-exact original reconstruction, 9 preview states 0/8–8/8 (board layer shown only in these previews), icons at 48px/64px/120px.
- `manifest.json` records crop offsets, original source SHA-256 and verification results.

**QA:** All original source RGBA pixels are reconstructed exactly by ORing the 8 nonoverlapping original-size sector files: max channel difference **0**. This guarantees no lost or duplicated image pixels. Edge aliasing at segment boundaries is the source image's own and generated angular masks. For web display, composite aligned original-canvas layers before scaling or mask the complete master with the same sector geometry; scaling independently can introduce hairline seams.

**Note:** The previous single Margherita wedge is a standalone reference; it did not constitute the complete 8-sector pack. This pack closes that gap. No pizza ingredients were regenerated.
