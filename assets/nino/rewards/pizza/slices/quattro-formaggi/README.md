# TOPO — PIZZA SLICES | QUATTRO FORMAGGI

- Source: `quattro_formaggi_pizza_in_acht_punten.png` (native 1254 × 1254 RGBA)
- Slice extraction: pixel-disjoint 45° wedges around physically verified center (627, 600); clockwise from 12 o'clock.
- 8 cropped individual PNGs have their exact `pixel_origin` stored in `manifest.json`.
- 8 aligned PNGs preserve original canvas and placement.
- One 512 × 512 icon (scaled down from the original slice, not regenerated).
- QA states 0/8 to 8/8 preview and 48/64/120 px icons.
- **Exact 8-piece RGBA reconstruction verified: True.** No toppings changed or invented.
- Warning: geometric masks use straight boundaries; align full-canvas layers and scale entire composite to avoid hairlines.
