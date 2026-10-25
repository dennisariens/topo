# TOPO CHAPTER ICONS — visual art QA / pre-Git sync — 2026-10-25

## Decision
**ARTWORK GO — TECHNICAL CLEANUP DONE LOCALLY, GIT UPLOAD NOT YET DONE.** Eleven premium circular chapter icons visually consistent with the original Nino Italian illustrative world and the new Topo cream/terracotta/navy/turquoise interface.

- All 11 source master renders are native **1254×1254 RGBA** (do not claim 2048).
- Production PNG derivatives are pixel-identical to source except nearly invisible alpha values 1–15 outside/near the cutout border cleared to zero; original colors/texture unchanged.
- Individual masters have consistent round matte-cream frames and broad Italian art palette.
- Each has transparent exterior in production derivatives, and 512px alpha WebP export. Small previews 32/48/64/96px provided.
- No new Nino character or scooter drawn. No image/Git change to main branch.

## Small-screen suitability
- At 96 and 64 pixels: all subjects recognizable.
- At 48 pixels: labels help identify similar city icons. Keep chapter labels visible in UI.
- At 32 pixels: many historical details and three tiny place names on Icon 09 cannot be read; use simplified existing SVG route pictograms for very small tap targets, and chapter labels in DOM.

## Conceptual cautions (nonblocking)
- **05 Eilanden:** depicts a close-up island *coast*, not the identifiable silhouette of Sardinia or Sicily; acceptable only as a decorative chapter illustration with explicit text label and true geography learned on map. Consider future revision if child confuses it with 'Zeeën'.
- **09 Landen:** France, Switzerland and Austria Dutch text + flags read at medium and large sizes; **arrows are symbolic and not geographically correct from a specific border pass**. Do not reuse as geography quiz location/map. Slovenia and the microstates still remain in actual teaching content.
- **07 Vulkanen:** cinematic Etna-inspired scene, **not an exact geographic/eruptive reconstruction**. Distinct from alpine mountains in navigation.
- **11 Rivieren:** three-arch bridge is an evocative scene, not a specific documented Po bridge.

## Handoff
- Use `assets/nino/chapter-icons/masters/` as archival masters, `assets/nino/chapter-icons/exports/` for app-level candidates.
- Preserve source docs, map SVG/geography content, quiz rules, current app icon and passport unlock logic.
- App-side functional integration, icons matching 11 chapter IDs, reduced motion, offline export and responsive tests belong to Codex/Hermes.
- Physical iPad QA and final owner review after integration are still pending.
- Use `manifest.json` for source and export checksums and provenance.
