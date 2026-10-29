# Final independent TOPO / NINO passport artwork QA

## Verdict: CONDITIONAL production acceptance; no core artwork regeneration required

**Exact reviewed intake:** `8a704cb23da97baf7197635df7fa12f06b864a24`.
Art branch `art/nino-travel-stamps-v2-20261026`; preservation baseline `fab2bbae943d507fcd103887012f790c144f43a5`; prior artwork acceptance PR48 `4eb9a5ae33550d789c56d5c01393145a148565aa`.

One consolidated review of source integrity, actual native images, alpha composites and size proofs. Existing conclusive PR48 acceptance is retained rather than reopened. **No core painting/design needs regeneration or redesign.** Creative production can stop. Fully unconditional production promotion is **not** claimed: two bounded owner conditions and ordinary verified export/integration work remain below.

No application implementation, new artwork, original-master edits, invented visits/achievements, merge or deployment. The art branch contains a legacy app: **copy only accepted assets into a separately reviewed current runtime; never merge that app wholesale.**

## Two owner conditions before final production promotion

1. **Folio resolution exception:** supplied masters/candidates are genuinely1086×1448, not the spec's1536×2048-or-better. They look acceptable at tested scope. Accept **<=543 CSS px per page atDPR2**, original ratio and shared scale; do not upscale files and relabel them higher-resolution. Above543CSS width a full-native2x claim is unavailable; larger portrait presentation needs a separate explicit resolution/visual decision, not an invented pixel budget.
2. **Venezia edge treatment:** original painting is intact, but full1536×1024 RGB includes an opaque ochre exterior. A verified lossless rectangle `(58,66,1478,958)` (half-open) yields1420×892, with **every decoded RGB pixel identical to that source region**. It preserves the painting while intentionally trimming the decorative scalloped paper perimeter. Accept that straight-trim option, or retain CONDITIONAL until an exact contour mask is verified. Plain PNG→WebP re-encoding cannot create missing transparency. **No painting regeneration needed.**

These are not claims of missing artwork. Owner retains final visual approval; physical iPad and actual passport component acceptance are separate integration gates.

## Independent integrity results

- **18/18 new image assets present**, actual SHA256/byte counts/native dimensions verified against the supplied manifest.
- **20/20 pre-existing passport masters byte-unchanged** against actual Git baseline objects and fingerprints.
- **49/49 passport PNG/WebP files strictly decoded with Pillow10.4.0**. Every decoded-RGBA SHA256 also equals Codex's independently produced Sharp audit: zero cross-decoder mismatches.
- **25/25 supplied checksum entries** verified against actual imported/archived files, including relocated package records.
- All existing tracked binary/runtime/build/engine files unchanged; only two documentary existing-file updates in the intake. No unexpected geography/grader/reward/save alteration.
- All **22 old PR48 allowlist blobs** independently rehashed at that exact commit. Ten current stamp candidates byte-equal the ten accepted exports. Prior limitations remain: warm paper, live labels, original reviewed export paths/commit.
- Native folio PNG→normalized WebP comparisons: **zero differing RGB channels**, same1086×1448 canvases, opaque candidate centres. Alpha was intentionally normalized, so original PNG alpha is not substituted for rendering.
- Original ZIP byte streams were not newly provided in this Git checkout; I did not relabel Codex's archive CRC checks as my own execution. Actual imported source files were verified independently. Untagged images are not a calibrated ICC/device-colour certification.

[Integrity summary](integrity-summary.json) · [independent49-file inventory](independent-inventory.json) · [cross-verification](cross-verification.json) · [full final ledger](final-asset-ledger.json) · [source acceptance/export contract](final-art-acceptance.json).

## Asset-family acceptance

| Family | Verdict | Approved source/use and exact limitations |
|---|---|---|
| Blank left/right folios | **CONDITIONAL**; artwork visually PASS | Use exact alpha-normalized WebPs, not original differing PNG alpha. Correct facing orientation, no flips, full-canvas contain/shared scale.8-native-pixel top/3px bottom asymmetry acceptable as worn leaves. Left1,417 canvas contacts are chiefly inner binding plus a small foliage-tip contact, not substantial outer-art clipping. No objectionable halo. Resolution exception above required. |
| Corrected ISOLE | **PASS for decorative chapter-stamp use** | Exact `stamps/rework/stamp-05-isole-geography-candidate.png`, SHA256 `1fd8360be1eb6cb8ee01f981651d03e2dbeec7cb5ca8af293752ff3c9357d8f4`. Sardinia clearly northwest, Sicily southeast. Remaining86-native-pixel vertical-bbox overlap is acceptable illustrative compression here, not a near-level southern-end relationship or inversion. Not a scale-accurate/reference/assessed map. Original wrong master/preview remain excluded. |
| ARRIVO | **PASS for warm-paper ink use** | Exact `arrivo/qa-candidates/arrivo-travel-ink-preview.png`, SHA256 `6a1ced67a6c25d8a995cb29fd12f0c4be2dfd12be0b49a2d06e4434f62540bef`. Readable main word, scooter/heritage character, real transparency. Five canvas contacts all alpha1/255: not visible ink clipping. No objectionable coloured fringe/matte in composites. |
| Chapter Gold | **CONDITIONAL production; artwork PASS** | `gold/masters/gold-chapter-seal-v2.png`, SHA256 `60c54e6efbb8239c327b4d7c76660dc816535a1f5431bf7c3cbe9f2927a1adf0`. Distinct small compass/brass design;>=48CSS labelled symbol,64preferred,160detail. Source-preserving derivative/live labels required, no visual repair. |
| Final Gold | **CONDITIONAL production; artwork PASS** | `gold/masters/gold-esploratore-doro.png`, SHA256 `e94a76ab4c0220eead56e3f208dc539a71bae2f217ca7756939903bce024e3ca`. Distinct ceremonial ribbon/inscription/Vespa composition.160compact emblem with live title;>=240main finale,320preferred. Not an enlarged/repeated Chapter Gold. |
| Sicilia / Sardegna / Napoli & Vesuvio | **PASS source/design and warm-holder scope** | Original1536×1024 fronts; intact edges and coherent warm paper/Italian colour family. Contain at preserved ratios; live captions. No repaint/recolour needed. |
| Venezia | **CONDITIONAL technical clip** | Painting PASS; full-canvas opaque exterior not accepted as transparent overlay. Parent verified cropped diagnostic SHA256 `35e7bd02929954043f6345620c6ea5cc49730d5a9e85e6a3b19ccf4c1d0cd8ef`. Rectangle is not exact scalloped-alpha recovery; owner edge decision above. |
| Universal reverse | **PASS source/design** | Quiet matching stationery, blank address/message area. Printed lines/empty stamp box are decorative, not actual travel history. No names/dates/messages fabricated. |
| Optional finale ornament | **REWORK / EXCLUDED** | Existing ghost flecks/fringe visible on dark. Optional only; neither core seal needs it. No replacement required to close the core art phase. |
| Full-page concepts / optional Bologna and Milano | **CONCEPT ONLY** | Nine full-page/endpaper references and two future postcards remain references, not runtime backgrounds/unlocks. Parent also viewed Bologna/Milano: paintings present and in-family, opaque/exterior handling future technical work. No activation or new eligibility approved. |

## ISOLE: explicit geography decision

I compared actual alpha composites at64/96/160CSS px,1x/2x, with exact canonical Sardinia/Sicily paths independently extracted from reviewed PR51 `bd1e57bc48e55a065cbbccb68acea196a64a187c`. The reference is uniformly scaled/translated, never reshaped to match the stamp. The canonical map has a north/south gap; the stamp is more vertically compressed. That difference is acknowledged rather than hidden by a centroid PASS.

**Decision:** the corrected whole silhouettes remain recognisable and clearly diagonal NW→SE; their vertical bounding boxes overlap, but the islands do not spatially overlap or swap identity. This is acceptable for a collectible illustrative chapter stamp, not for teaching exact latitude/spacing or replacing the map. No further island repositioning/redraw requested. At64/96 use a live Eilanden caption/accessibility label;>=160detail for baked fine lettering. The140 nonzero edge pixels have maximum alpha2/255; no meaningful silhouette/text clipping is visible.

[Canonical reference](canonical-islands-verified.png) · [exact source paths/provenance](canonical-islands-source.json) · [1x warm proof](ink-sizes-cream-1x.png) · [2x warm proof](ink-sizes-cream-2x.png) · [checker](ink-sizes-checker-1x.png) · [ink decisions](parent-ink-verdicts.json).

## Alpha, sizes and colour: non-blocking facts

- ARRIVO and decorative ink intentionally use partial alpha; no alpha255 requirement.>=160CSS detailed view,240preferred;64/96 are labelled thumbnails. City/date/visit count must be live actual-state text, not baked or fabricated.
- Gold's “mostly partial alpha” is not washed-out metal: nonzero median253 for both.18/13 edge contacts are exactlyRGBA(0,0,0,1), not chopped metal. Do not globally threshold alpha or recolour metallic highlights/tricolour into flat ink.
- Small Gold glyphs need live achievement labels; final inscription is readable at supported larger size, not an accessibility substitute.
- Postcard240×160CSS preview with live caption,>=480px-wide magnified front/back. Two cards/page as the five-spread spec, not four microcards.1536 source supports768CSS at2x; cropped Venezia supports710CSS. Native source sufficiency is not physical Retina certification.
- Dark/checker are alpha diagnostics. Warm-paper approval does not automatically approve low-contrast red/blue ink on a dark UI. No ICC recolouring/conversion is required by this review.
- Baked route/postmark/vignette motifs on folios/reverse are background decoration only, never earned ARRIVO/Gold/visit records. Keep live content off scenery/borders/gutter.

[Detailed folio verdict](folios/VERDICT.md) · [native edge proof](folios/native-edge-crops-dark.png) · [Gold verdict](gold/VERDICT.md) · [Gold1x](gold/sizes-paper-1x.png) / [2x](gold/sizes-paper-2x.png) · [postcards report](postcards/REPORT.md) · [holder clip proof](postcards/venezia-holder-proof.png) · [parent crop verification](venezia-parent-verification.json).

## Exact folio rendering inputs

- Left: `assets/nino/travel-passport/book/qa-candidates/passport-blank-folio-left-alpha-normalized.webp` — `d4862f0f5e34631c4e483761f933baa92bd85dee05b7ea0d581a7eb29be668a2`.
- Right: `assets/nino/travel-passport/book/qa-candidates/passport-blank-folio-right-alpha-normalized.webp` — `3ce3133d483bec940e961a5a920a30bbb00e16da3ebb2445966fc83e3f210b16`.

Left remains left, inner binding on right; right inner binding on left. Shared shell may supply the gutter, but do not mirror geographic decoration, crop to fake registration or independently stretch one page to erase the8/3px difference. Use transparent room around the image; the art is two worn leaves, not a seamless panorama. No art correction required within the conditional pixel budget.

## Minimal Codex technical handoff — no new creative work

1. Keep the22 PR48 asset references and their exact scopes; current art branch does not magically contain every prior exports path. Copy the named blobs from their pinned commits, not the legacy application.
2. After owner conditions are resolved, promote the two exact normalized folio WebPs via byte-identical copy. Produce one source-faithful native1254-square lossless-alpha ISOLE production export from the newly accepted source; do not promote the rejected old stamp05.
3. ARRIVO/Gold/cards need only verified optimized source-preserving exports, not new designs. Preserve partial alpha, colours, ratios and registration. Lossless PNG/WebP baseline is safest. Read every derivative back and check decoded RGBA equality; if an encoder changes only fully transparent RGB, record that exception and verify all visible-alpha pixels/composites. Never flatten on cream or claim new native resolution. No production derivative was created by this QA; the Venezia crop is explicitly diagnostic.
4. Apply only the owner-accepted Venezia edge route. Straight clip proof is a verified option. If scallops are mandatory, exact silhouette masking is bounded technical work still unverified—not permission to regenerate the painting.
5. Implement the existing5-spread/10-page layer architecture later: normal chapter stamp only exact canonical `stage===3`; one small Chapter Gold reused only when that chapter's `goldAt>0`; final Gold derived only from all11 positive; ARRIVO only real Pizza→Vespa trip counts, departure Rome not earned arrival, real dates only if recorded. Keep eligibility/reset/replay/backup semantics, no shadow award ledger/currency or fictional history.
6. Actual holder fit,11/11 states, book open/close/draft/caret/focus, offline embedding, accessibility, 200% text and physical iPad Safari are later functional integration gates. These raster boards are **ART QA / NO REWARD**, not a finished passport UI or actual earned-state test.

## Ledger interpretation and closure recommendation

The49-file ledger records17 PASS,7 CONDITIONAL,4 REWORK,11 CONCEPT ONLY and10 SOURCE ONLY. The4 REWORK entries are **old wrong ISOLE master + old preview, retired nonblank open-book base, optional ornament**. None is required in the accepted new core pipeline. Ten source-only original stamp masters remain preserved provenance, not new blockers. The22 previous approved references plus11 current source decisions are **not33 unconditionally approved new runtime files**.

**Recommendation:** stop creative artwork production; approve the bounded folio-resolution exception and choose Venezia's edge treatment, then finish the specified mechanical exports. There is no evidence-based reason to regenerate core artwork. Do not call unrestricted production/device acceptance or the interactive passport implementation complete until those separate conditions/gates are actually met.
