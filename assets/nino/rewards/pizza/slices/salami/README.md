# TOPO — PIZZA SLICES | SALAMI

Eight **exact pixel extractions** from owner-approved Salami Pizza Master.

- Source: `top_down_studio_style_isolated_food_product_image.png`, dimensions **1265 × 1244 RGBA**.
- Eight wedge angles of **45 degrees**, clockwise starting from north. Shared original center **(634, 594)** in pixel coordinates.
- `individual_slices/pizza-salami-slice-01.png` through `-08.png`: cropped, original pixels only, 12px transparent margins. They are **not rotated copies**.
- `aligned_full_canvas/`: the same eight wedges in the original **1265 × 1244** canvas; these are ready for perfectly registered cumulative overlays. Use original canvas position, do not place cropped wedges without the `pixel_origin` in manifest.
- `pizza-salami-slice-icon.png`: single representative wedge, centered on a 512px transparent canvas, scaled (not re-generated).
- `quality_checks/`: 48px, 64px and 120px icons; nine composite progress state previews; exact RGBA reconstruction.
- `manifest.json`: original pixel origin per cropped wedge, source SHA-256, and QA assertions.

**Verification:** Bit-for-bit pixel reconstruction of original source RGBA from the eight sector layers passed (max channel difference zero). The segmentation keeps pre-existing source aliasing/art exactly as-is, and does not invent any toppings or change the render. QA background for presentation only; the production slices have true transparency. The composite progress preview board is not a production slice.

**Design note:** The geometric 45-degree seams are *computational masks* radiating from the visible center, so they may follow mathematically straight lines rather than every pixel of the original physical cut. For runtime at low pixel sizes, layer all slices on a shared canvas and scale/composite consistently to avoid 1px interpolation hairlines. Do not scale cropped slices separately to the same box.
