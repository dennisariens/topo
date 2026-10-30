# TOPO / NINO — MICRO ICON V2

**Owner approved 30 October 2026. Artwork-only handoff for Hermes; not yet installed in the app.**

- 16 px: Italy-only favicon, green silhouette on Mediterranean blue, no scooter or text
- 24/32 px: red scooter + Italy, no Nino face or text
- 48/64 px: red scooter + Italy, preview/reference variants
- `favicon.ico`: native icon container with a 16px Italy-only PNG and 32px scooter+Italy PNG
- Two editable SVG source masters included
- `manifest.json`: binary sizes and SHA256 checksums

**Preserve:** The owner's earlier large illustrated Nino/Vespa app icon remains the large-size design. These micro assets deliberately replace only the small favicon concept. They should not be mistaken for a geographical assessment map.

**For Hermes:** integrate only after your current release QA/integration branch is stable; use an inline data URI in standalone `file://` HTML if the icon must be self-contained. Do not rely on adjacent assets for single-file offline. Test 16/24/32px against real light/dark UI, favicon cache, iPad home-screen cropping; no HTML/manifest/build files changed in this art PR.
