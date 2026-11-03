# Independent Nino V2 binary QA — PR70

Target: **`2a9dda3d3d8ec567687bc3b61bf9cbde645c752c`**.

**Measured binary inventory/export checks pass. This is not final visual, runtime,
package, release or owner approval. Exact approved Venezia raster-matte comparison
remains BLOCKED.** No exporter was run; no artwork/app file was changed.

## Reproduce

From this exact target's evidence worktree, with pinned Git source objects present:

```sh
/Users/dennisariens/.hermes/cache/scratch/nino-independent-binary-venv/bin/python docs/qa/nino-v2-hermes-67/binary/audit.py
```

The environment is Python 3.8.2 + Pillow 10.4.0. For another machine, create a
Python environment in its scratch directory and install `Pillow==10.4.0`.
`audit.py` reads the pinned manifest/Git blobs and target working files; writes
only this directory. It independently implements measurement/comparison and does
not import production scripts, their PASS assertions or export-verification data.
The source export scripts were read only to understand intended recipes.
Missing source objects were fetched by immutable SHA from origin; no branch was
switched and no commits were made. Initial old-pip installation failed; updating
pip/setuptools/wheel in the scratch-only venv allowed the Pillow wheel install.

## Findings

- **239 rows / 239 distinct paths / 225 distinct Git blobs.** All 239 reconcile
  with zero mismatching rows for bytes, SHA256, Git blob, presence, dimensions,
  format/mode, decoded RGBA SHA256, alpha metrics, color metadata and ICO sizes
  where applicable. All source commit/blob references were checked against actual
  trees, allowing relocated copies. Recipe destination self-references are
  explicitly resolved to the pinned target; source equivalence is separately
  measured, not inferred from those references.
- **56 delivered, 183 source-only.** Of the 56, 53 are raster files and three are
  SVGs. All 236 manifest rasters were decoded. SVG byte/blob identity and XML root
  were verified; SVG manifest dimensions/mode/alpha are null, not raster claims.
  Every delivered working file equals its target Git blob.
- **30 export comparisons, zero failures:** 12 Gold outputs (both distinct
  1254-square native masters; chapter 64/128 and final 240/480, PNG+WebP), corrected
  native1254 ISOLE, native1536 ARRIVO, ten other ink stamps, two folios and four
  non-Venezia postcards. All match full decoded RGBA including hidden RGB;
  designated stamp/folio copies are also byte-identical. Gold resampling is
  independently computed directly from each pinned source with RGBA LANCZOS,
  using the documented Pillow version; it is not independent resampler-family
  approval or evidence of increased native resolution.
- **20/20 old masters unchanged:** independently enumerated from baseline
  `fab2bbae943d507fcd103887012f790c144f43a5`; all inventory source blobs and
  ART/PR66 versions equal baseline. Only Venezia's master is present in the target
  tree, and it also equals baseline. The other 19 are preserved source-only
  objects, not files falsely claimed present in this delivery.
- **Venezia full PNG (1536×1024): every RGB byte equals original source.** Tight
  PNG (1497×973) is exact full-image RGBA crop at half-open `[23,26,1520,999]`.
  PNG/WebP alpha and visible RGBA are exact in both variants. Entire decoded RGBA
  is **not** identical: WebP changes **213487 full / 97198 tight** invisible RGB
  pixels; no alpha or visible pixels differ. Reconstructed full alpha is binary
  0/255 with nonzero bbox `[32,35,1511,990]`.
- **Missing approved Venezia matte:** no exact owner-reviewed raster matte
  binary/path/blob was supplied. This audit measures reconstructed committed
  exports; it cannot establish equivalence to that missing matte or independently
  reproduce the historical 0.1264% tolerance claim. Scalloped-edge acceptance
  remains an owner/parent visual gate.
- Folios remain native **1086×1448**; the documented 543 CSS px/page at DPR2 cap
  and owner resolution exception are not waived by source-copy equality.

## Evidence / visual inspection

- `inventory-results.json`: every row's actual measurements, full alpha histogram,
  edge contact/amplitude counts, per-source tree proof, exact working-file proof,
  and mismatch list. ICO frames have separate RGBA hashes.
- `export-equivalence.json`: all 30 independently measured source/output relations.
- `master-preservation.json`: all 20 baseline master paths and ART/PR66/target
  presence and byte/blob comparisons.
- `venezia-comparison.json`: explicit RGB, alpha, visible/invisible comparisons and
  missing-reference blocker.
- `summary.json`: machine totals, environment, target and audit-script hash.
- `contact-sheets.json`: exact sheet-to-asset mapping. `contacts-*.png` covers all
  53 delivered raster files plus an explicitly source-only 11-chapter-icon sheet.
- `native-*.png`: unscaled warm-paper, dark and true-checker alpha composites of
  Gold native/scales, ISOLE, ARRIVO, both folios and Venezia full/tight.
- `tiny-native-and-8x-nearest.png`: all five tiny PNG exports and both ICO frames,
  displayed at native and 8× nearest-neighbor on all three backgrounds.

Overview composites are composited at native resolution before thumbnailing;
small native art is not upscaled in overview sheets. Native diagnostic sheets and
nearest-neighbor icon sheets are labeled separately. Open native sheets at 100%
for edge judgments. The Gold overview and tiny sheet were opened to verify their
layout, painted art and background panels; this is evidence usability checking,
not final artwork acceptance. Parent/owner retains all visual signoff.
