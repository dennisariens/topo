# NINO TOPO — V3 Production Asset Library R2

**Updated 13 November 2026.** Replaces previous logo exports with the V2 technical rebuild.

## Canonical logo files

- `brand/logo/logo-01-primary.svg` — Nino + wordmark + lavender divider + outlined TOPO.
- `brand/logo/logo-02-compact.svg` — identical Nino and wordmark without divider or TOPO.
- `brand/logo/logo-03-wordmark.svg` — identical standalone lettering.
- `brand/logo/logo-03-monochrome.svg` — same lettering in charcoal.
- `brand/characters/nino-vespa-logo-master.png` — exact shared embedded character raster.
- `legacy/superseded-logo-v1/` — old logos retained for traceability; **do not use in production**.
- `qa/logo-technical-check.json` — automated SVG identity checks.

All text is path outlines. Nino remains a raster illustration embedded in the logo SVG; zooming far past its native resolution may soften Nino, not the vector lettering. Source character is 528×591 pixels. Never claim the entire composition is vector.

## Approval and Git policy

Technical checks on this package passed; V2 visual signoff in the real website header is still required. Existing destination cards and other assets are unchanged. Nothing has been committed, merged or deployed. The currently published website was not modified.

# NINO TOPO — V3 Production Asset Library

**Prepared:** 2026-11-13  |  **Scope:** available artwork in this conversation's working filesystem.

## Canonical logo identity

- `brand/characters/nino-vespa-canonical.png`: the SAME owner-reviewed Nino/Vespa raster in both lockups.
- `brand/logo/logo-03-wordmark.svg`: exact original custom paths from the latest LOGO-03 vector.
- `brand/logo/logo-01-primary.svg`: Nino + identical wordmark paths + divider + TOPO.
- `brand/logo/logo-02-compact.svg`: Nino + identical wordmark paths.
- Both logo lockups have the same graphic source, not regenerated characters.
- Wordmark is traced vector paths, not a reusable font face. `TOPO` remains SVG text and should be outlined after the font is locked for a totally font-independent master.

## Collections

- `destinations`: five approved destination cards and five hover counterparts.
- `chapters`: five cinematic chapter-introduction images.
- `passport/stamps`: five stamped engravings; backgrounds and identical ribbon geometry still need final paper-context QA.
- `brand/icons`: approved scooter and Nino icon candidates, plus derivative 512/192/180 exports.
- `reference-only`: source character/object alternates kept separate to avoid accidental character drift.
- `rewards` and `props`: approved contextual artwork.

## Production cautions

1. Selected images have not been rendered in the actual V3 app yet. Crop, hover transitions and small-size legibility remain integration checks.
2. The five stamps are visually matched but do NOT yet have pixel-identical rings/ribbons; alpha/halo appearance depends on paper background.
3. The 512/192/180 icons are resizing derivatives, NOT new native master resolution. The final native 1024 icon is pending source-based build or approval.
4. Several original V2 assets (pizza rewards, full passport pages and all onboarding graphics) are not identifiable in this local folder and are not falsely marked complete. Audit repo before replacing or removing any V2 asset.
5. The package is local; no GitHub push, merge or deployment has been performed.
6. SVG lockups contain embedded raster Nino, while lettering is vector. Not a wholly vector character.

## Integration instructions

1. Verify these mapped files against the approved screenshots and final country pairing.
2. Integrate selected `webp` files in the V3 homepage with matching original PNG as archival master.
3. Point both logo variants at the same reusable canonical illustration and custom wordmark paths.
4. Review stamps on actual passport paper, including transparent holes and fine line contrast.
5. Run mobile/desktop QA and compare color consistency on real screens.
6. Do not discard older V2 rewards or commit/deploy without owner approval.

## Machine-readable index

See `manifest.json` for every included asset, source filename, dimensions, format, SHA-256 and export status.
