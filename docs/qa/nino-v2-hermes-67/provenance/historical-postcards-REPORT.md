# Independent original postcard QA

Pinned repo: `/Users/dennisariens/projects/topo-passport-final-art-qa` at exact `8a704cb23da97baf7197635df7fa12f06b864a24` (HEAD verified, clean on entry). Scope: source art and diagnostic holder-size raster proofs only. Intake README/HERMES_HANDOFF, five-spread spec and pages03/04 production decision read. No source/app edits, generation, reward rules, dates, names or visit histories. Owner/parent production approval remains separate.

## Verdict

**No genuine missing-painting/source-art blocker for the four core postcards. Venezia is a technical exterior/clip issue, not a reason to regenerate.** A source-RGB-identical straight rectangular clip has been rendered and visually checked. It removes the opaque ochre exterior by sacrificing the decorative scalloped paper edge, NOT the painting. This is a conditional alternative requiring parent/owner agreement to that edge treatment. An exact scalloped alpha extraction has NOT been verified. Plain PNG→lossless WebP re-encoding of the full RGB source cannot remove its opaque exterior.

| Source filename (under `assets/nino/travel-passport/postcards/masters/`) | Verdict | Findings |
|---|---|---|
| `postcard-01-sicilia-front.png` | PASS — source art / cream holder | Rich blue sea, lemon/terracotta palette and mountain scene remain distinct at 240×160. Cream scalloped border intact. Actual card silhouette is shallower than the canvas: alpha>=128 bbox `(31,73,1505,947)`. Do not stretch it to match other cards. |
| `postcard-02-sardegna-front.png` | PASS — source art / cream holder | Turquoise cove and pale cliff scene distinct at preview; matched warm paper family, slightly cooler scene by subject. Alpha>=128 bbox `(27,29,1512,996)`. No substantial matte rectangle. |
| `postcard-03-napoli-vesuvio-front.png` | PASS — source art / cream holder | Bay/volcano and terracotta scene readable at preview; no meaningful painting clipping. Alpha>=128 bbox `(28,30,1513,995)`. Very faint residual exterior alpha, not an opaque exterior. |
| `postcard-04-venezia-front.png` | CONDITIONAL — verified technical clip route | Full 1536×1024 RGB has an opaque ochre exterior, conspicuously unlike the transparent sources on dark. Unmodified full-canvas overlay is NOT passed. Verified straight clip below preserves painting but changes scalloped paper perimeter to straight trim. Parent must verify before promotion. |
| `postcard-05-universal-reverse.png` | PASS — decorative reverse source / cream holder | Quiet warm-paper reverse, compass/foliage, address lines and empty stamp box. No name, date, authored message or real earned postmark supplied. Printed wavy lines are decoration, NOT history. Alpha>=128 bbox `(39,52,1499,980)`. Live readable message/details required, not tiny raster text. |

PASS means this independent source/design inspection, not integration, physical-device, owner, or production-export approval. No approved production export was published.

## Exact verified Venezia alternative

- Source coordinate system: top-left `(0,0)`; original `1536×1024` RGB.
- Pillow-style half-open crop **`(58,66,1478,958)`**; included pixel extrema x58…1477, y66…957. Result **1420×892**. Equivalent full-canvas rectangular mask: alpha255 in x `[58,1478)`, y `[66,958)`, alpha0 elsewhere; no inferred feather/scallop mask.
- `DIAGNOSTIC-ONLY-venezia-rectangle.png` is a lossless PNG diagnostic, not an approved export. Its decoded RGB is programmatically identical to `source[66:958,58:1478]`. SHA256 `35e7bd02929954043f6345620c6ea5cc49730d5a9e85e6a3b19ccf4c1d0cd8ef`.
- Visual review: no remaining ochre exterior; rounded painting corners, bridge, gondola, skyline, flower foreground and buildings retained. Narrow cream paper remains. Scalloped paper removed intentionally. `venezia-crop-boundary.png` shows the exact boundary on original source.
- This crop is not 3:2. Use **contain**, never stretch/cover. At 240×160 it occupies approximately240×151; at480×320 approximately480×302, with remaining height as holder background. Those actual proofs are in `venezia-holder-proof.png`; dark letterbox strips are containment, not residual baked exterior.
- Lossless export of a verified masked/cropped derivative is feasible without repainting. Lossless re-encoding alone does NOT fix alpha. If preserving the original full scalloped paper edge is mandatory, retain CONDITIONAL until a separately verified traced alpha/mask is supplied; do not call this rectangle an exact alpha recovery.

## Edges, color, holder fit and size contract

All five originals are1536×1024. First three fronts/reverse have real alpha but not alpha255: maxima254,254,253,254. Nonzero canvas-edge contacts are865,981,5111,58 respectively, but edge alpha maxima are only1,1,4,1; counts alone do not demonstrate objectionable clipping. Cream/dark native composites show intact scallops without an opaque rectangular matte for those four. Napoli's very faint exterior is not equivalent to Venezia's fully opaque exterior. No automatic background removal or alpha thresholding is approved.

Paper family is coherent cream/sepia, with brighter blue/turquoise scenery and warm buildings/foliage. Venezia's original outside tan field is the consistency exception. No recoloring, brightness normalization or profile conversion warranted by this review. Visual color consistency is not calibrated physical-device/ICC acceptance.

- Examined original previews at exact240×160 and480×320 (1x/2x raster pair for a240×160 CSS holder), plus600×400 view and native cream/dark edge composite. Enlarged original Venezia and the1420×892 crop also inspected. These are offline raster diagnostics, not real passport/browser/device screenshots.
- Recommended smallest card preview **240×160 CSS px** with live destination caption, focusable magnify/flip control and >=44px target. Below that, use caption/list navigation rather than claim fine-art readability. Detailed view **at least480px wide**, retaining ratio; larger when viewport permits. No baked text is used as the accessible name.
- Four originals provide source width for up to768 CSS px at2x, not a device certification. Cropped Venezia provides710 CSS px at2x. Do not upscale to meet a fictitious source target.
- Keep two cards per page on p7/p8, not four miniatures per page. Use independent corner holders around each card's contained bounds; do not cover the painting or bind the card to a fixed painted frame. Leave cream breathing room. Shared front/back viewport and `contain` prevent flip-layout jumps despite different source alpha bounds. Actual holder corner geometry/folio safe fit has NOT been tested in a live app.
- Suggested live captions: `Sicilië`, `Sardinië`, `Napoli & Vesuvio`, `Venezia`; controls `Vergroten`, `Voorzijde`, `Achterzijde`, and an actual state-derived availability label. Captions, written message and provenance are interface text, not generated artwork. No new rewards or changes to eligibility are authorized.

## Exact original SHA256

- `postcard-01-sicilia-front.png`: `36f1656b44f00c2eec477517d32de0b2067e42507131a110d424cc22d4c3e328`
- `postcard-02-sardegna-front.png`: `b06eb78fb5ad8e0116175317a98ab16ae88b251001adb40763c23d0c274ac4e3`
- `postcard-03-napoli-vesuvio-front.png`: `822ada426bf732273738bcdb1f9bbc2466beb2bd2d5c8b6c29b5815d807910ab`
- `postcard-04-venezia-front.png`: `3228aeb85ca52d214378f287ba5fb63be42c40966074bd98a5d2548f858359e6`
- `postcard-05-universal-reverse.png`: `67450c16303c2da9d0c7d1e690554b163ce1c8c720a3244abee17c3440a3ed86`

## Evidence handles / remaining gates

All files reside beside this report, outside the repository:
- `original-size-proof.png`: exact240/480/600px source composites.
- `native-cream-dark.png`: full-native cream/dark edge composites, five rows.
- `venezia-crop-boundary.png`: proposed rectangular cut marked on original.
- `DIAGNOSTIC-ONLY-venezia-rectangle.png`: lossless unchanged-pixel diagnostic crop.
- `venezia-holder-proof.png`: crop contained in240×160 and480×320 on cream/dark.
- `measurements.json`, `edge-measurements.json`, `clip-verification.json`: independent measurements/hashes/pixel comparison.
- `diagnostics.py`, `clip-proof.py`: reproducible Pillow/NumPy diagnostic renderers.

Pending: parent verifies crop/source and accepts trimmed edge treatment; owner visual approval; actual component/folio/corner-holder integration, front/back keyboard/focus, accessible live captions, truthful existing-state availability, offline/browser and physical iPad Safari checks. None is replaced by raster proof. Optional Bologna/Milano were not independently inspected in this bounded core-card pass and do not block it. Initial one-line shell rendering attempt failed on literal newline quoting; file-based Python scripts executed successfully afterward.
