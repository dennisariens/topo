# Independent blank-folio / seam artwork verdict

**CONDITIONAL — visually acceptable existing artwork; no real-art correction or regeneration required for the bounded use below.**

Evidence handle: **FOLIOS-8a704cb-independent-01**. Reviewed exact intake `8a704cb23da97baf7197635df7fa12f06b864a24`, matching clean checkout HEAD. This is expert source-art visual review, **not physical-device, owner, runtime or accessibility approval**. No repository files were changed.

## Decision and technical conditions

1. Use the two **alpha-normalized WebP candidates**, unchanged, in their supplied orientation. Preserve PNG masters as provenance; do not substitute their different source alpha as though compositing were identical. Decoded RGB is exactly equal (zero differing channels) for each PNG/WebP pair, but alpha is intentionally different.
2. Both pages are truly **1086×1448** (3:4), not 1536×2048. Maximum width **543 CSS px per page at DPR2**; preserve aspect ratio, no zoom/upscaling claim. DPR1 can consume native pixels up to1086 CSS px, but larger-than543 layouts are not covered by this paired 2x acceptance. The spec's1536×2048-or-better requirement is **not met**: owner must explicitly accept this bounded native-resolution exception. If larger 2x display is mandatory, these files cannot satisfy it; obtain a genuinely larger source, not an upscale.
3. Keep left art left / right art right, no CSS or pixel flips, rotations, recoloring or invented registration. Left's inner binding is on its **right**; right's inner recessed edge is on its **left**. Use full-canvas contain scaling at a shared scale, aligned canvas origins, no object-fit:cover or independent stretching/cropping. Shared shell may provide the binding background; do not add a second heavy spine/shadow or a large inter-page gap.
4. Accept the measured asymmetric worn-paper silhouette: **8 native px top /3 native px bottom** mismatch at alpha>=128 (4/1.5 CSS px at543 width). Do not attempt to align both edges by distortion or retouch. These differences look like irregular leaves, not a broken book, at reviewed usage sizes. A future requirement for a perfectly continuous rectangular top/bottom would require a different acceptance decision, not an invisible CSS 'fix'.
5. Preserve cover identity and keep source route/postmark decoration purely decorative, never an actual trip/earned imprint. Later integration must keep interactive content inside clear paper, off border/scenery/gutter. No layout or earned-state acceptance is implied here.

## Findings from actual originals and candidates

- **Family/identity:** The approved red/burgundy leather cover has gold linear framing, corner foliage, compass and Italian ribbon. Folios carry compatible warm cream/ochre parchment, sepia/gold double borders/flourishes, compasses, olive foliage and tricolor details. Their richer coastal decoration is not an identity break. Right bottom scenery is heavier than left, but this is deliberate visual asymmetry, not a reason to redesign. Paper tones differ slightly; perceptually coherent, not a mismatched white/cream pair. No color matching/regrading needed.
- **Seam:** Actual full-canvas candidate pair reads as two facing framed leaves with a narrow recessed gutter. Left has a more visible burgundy under-edge; right a softer ochre edge. This is not a seamless painted panorama, and it should not be sold as one, but is acceptable as the reusable two-leaf journal. Borders and decoration do not need to connect across the gutter.
- **Edge contacts:** Independently reproduced **1,417 unique nonzero boundary pixels on the normalized left**:6 at top,1,411 at right; bottom/left zero. Normalized right has zero canvas-boundary contacts. These counts refer to candidates, not PNG original alpha (which has additional low-alpha perimeter pixels). The left right-edge contact is the straight inner binding termination, not accidental outer-page loss. Top contact is a small foliage-tip/canvas kiss: slightly tight at native scale, unobjectionable at543/362 CSS proof. No unacceptable chopped main motif or leaf silhouette requiring art repair was observed.
- **Alpha/halos:** Candidate paper stays opaque and checker does not show through. Native dark edge crops show a narrow light/warm paper rim and ochre/burgundy binding, not a broad white matte, black dirty halo, detached colored fringe or floating cleanup debris. Paper rim remains visually plausible on cream, charcoal and checker. On charcoal the hard central binding line is visible by design; do not mistake that shadow for defective exterior alpha. Original PNGs were also opened directly and composited on charcoal: their globally differing alpha is why the normalized candidates are the approved rendering inputs for this decision.
- **Native 1x/2x usage:** Reviewed native 1pixel-per-source-pixel top/bottom gutter and outer-edge crops (the actual raster footprint for543CSS at DPR2), plus independently downsampled543CSS DPR1 full pairs and seam crops at543/362CSS DPR1. Detail and edge treatment are acceptable without sharpening. Native crops are source-pixel inspection, not a physical543CSS Retina screenshot. No device approval is claimed.

## Exact files / SHA256

All paths below are relative to `/Users/dennisariens/projects/topo-passport-final-art-qa/`.

| Role | Path | SHA256 |
|---|---|---|
| Left source, preserved | `assets/nino/travel-passport/book/masters/passport-blank-folio-left-master.png` | `b64802b9ea775b487660bebf57302848ee32b9f5f6934139e4ec7c02d488e4a4` |
| Right source, preserved | `assets/nino/travel-passport/book/masters/passport-blank-folio-right-master.png` | `70e22b4ae4a6a2e63c542906bcd78d3be196e031a2b94c97a172c0bf71d59a40` |
| Left rendering candidate, conditional acceptance | `assets/nino/travel-passport/book/qa-candidates/passport-blank-folio-left-alpha-normalized.webp` | `d4862f0f5e34631c4e483761f933baa92bd85dee05b7ea0d581a7eb29be668a2` |
| Right rendering candidate, conditional acceptance | `assets/nino/travel-passport/book/qa-candidates/passport-blank-folio-right-alpha-normalized.webp` | `3ce3133d483bec940e961a5a920a30bbb00e16da3ebb2445966fc83e3f210b16` |
| Cover comparison | `assets/nino/travel-passport/book/masters/passport-closed-cover.png` | `3d1c0e1978373d2a21b0072baa3f342375641341635fc7f9f06e5721ff58f1b9` |

Candidate alpha>=128 bboxes, exclusive maxima: left `[12,0,1086,1438]`; right `[7,8,1077,1435]`. All dimensions/hash/RGB comparisons and candidate-edge counts are in `measurements.json`.

## Evidence (same output directory)

- `pair-native-{cream,dark,checker}.png`: full1086px/page candidates, no transforms beyond alpha compositing.
- `pair-543css-1x-{cream,dark,checker}.png`: full pair, each page543 raster px, usage proof atDPR1.
- `native-edge-crops-dark.png`: unresized source crops of top/bottom seam, left-top foliage, inner binding and right outer edge. Represents source detail available at543CSS DPR2.
- `usage-edge-crops-1x.png`:543/362CSS DPR1 seam crops.
- `original-png-pair-dark-543css.png`: independent PNG original composite, not candidate stand-in.
- `folio_diagnostics.py`, `measurements.json`, `SHA256SUMS.evidence.txt`: reproducible measurements and evidence fingerprints.

Read first: intake README, nested intake HERMES_HANDOFF and five-spread spec. No root HERMES_HANDOFF exists; resolved the actual nested file. Diagnostics use the supplied scratch Python with Pillow/NumPy. A first script name `inspect.py` shadowed Python's standard module; renamed to `folio_diagnostics.py` and reran successfully. Final measurements and composites come from the successful run. Git status remained clean after diagnostics. No asset retouch, regenerated illustration, runtime build, repo write or invented achievement was performed.

**Remaining boundary:** owner approval of the native-resolution exception and final appearance; physical iPad Safari and later real-component seam/layout testing remain pending. Those are separate acceptance gates, not evidence that the source artwork needs correction. This verdict resolves source seam/edge appearance positively within the stated limits rather than leaving all folios QA REQUIRED.
