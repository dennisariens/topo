# TOPO / NINO — Passport pages 03–04 production decision
**Date:** 26 October 2026  
**Authority:** owner-delegated visual/design decision; supplements `PASSPORT_FIVE_SPREADS_V2_SPEC_2026-10-26.md`.  
**Decision:** **NO MORE FULL-PAGE RENDERS OF 03/04.** Preserve last generated images as **visual references only**; they are **NOT approved production page backgrounds** and are **not verified Git art assets**. The production pages are 2 views of the same reusable folio + authored layout + live stamp/gold/content overlays.

## 1. What is locked
- Burgundy leather book and warm cream parchment, thin sepia border, olive/cypress accents, historic botanical engravings; friendly, detailed, premium Italian travel narrative. Approved for creative direction.
- Five facing-page spreads / ten interior pages from original product spec; portrait iPad shows a single readable page.
- Page03 LEFT (binding at right): `city1` FIRENZE, `city2` ROMA, `city3` BORGHI.
- Page04 RIGHT (binding at left): `city4` LIGURIA, `islands` ISOLE, `mountains` DOLOMITI.
- All 11 individual approved stamp *design masters* are kept intact for provenance. Runtime may consume **only audited alpha derivatives** on cream parchment. Reuse existing deterministic positioning from Hermes #45; no rerender/recolor of source stamp images.
- Show Chapter Gold (approved smaller matte brass seal) **only when** canonical chapter `goldAt>0`; full `ESPLORATORE D'ORO` on p10 only when all 11 real Gold chapters exist. Normal `stage===3` stamps are separate.
- Leafy ornaments and architectural vignettes may appear only in narrow exterior gutters or margins, not beneath live stamp labels and awards.

## 2. Why the recent page 03/04 images are NOT runtime bases
The recent generated images establish attractive coordinated style but bake in: decorative ribbon/headings, three fixed rectangular paper frames, empty Gold-looking stamp rings, postmark patterns, miniature architecture that competes with real stamps, and an illustrated binding. Their baked geometry cannot guarantee a 3:2 postal rectangle, a wide cancel, circular ISOLE or tall DOLOMITI all fit without overlay collisions; and a Gold-shaped printed outline risks implying already earned rewards. The images also have only about 1086×1448 source resolution, below target 1536×2048.

Do not force them into game canvas through cropping, patching opaque backgrounds or compressing real stamps into fake fixed outlines. **Keep them as creative art references only**, and annotate any design-preview use as `CONCEPT / NO REWARD`.

## 3. Page construction: render as layers, not a flattened stamp album
1. **Book shell:** shared approved closed cover; facing-page fold/gutter thickness/page-turn controlled in component/CSS. The existing open-book source has a baked, illegible decorative postmark: QA #45 lists the open-book source **REWORK**; do NOT use it as a live blank texture without a genuinely cleaned master.
2. **Folio:** one genuinely unfilled portrait 3:4 parchment layer, reused for left and right with mirrored *CSS* gutter lighting. User-generated `BLANK FOLIO MASTER` and pages 01–04 are not assumed verified in Git; inspect and approve any delivered source before using.
3. **Design furnishings (CSS/SVG, optionally isolated approved art):** a single consistent fine margin frame, little olive engraving at *outer corners*, small subtle paper creases and restrained warm texture. No baked chapter title, stamp border, medal icon, scores or decorative empty award medallions.
4. **Interactive layout:** three vertically stacked flexible `ChapterStampRow` slots per page. Each slot owns (a) live chapter title/status in accessible HTML text, (b) one stamp art area for its natural silhouette, (c) separate side-positioned Chapter Gold overlay conditional on `goldAt>0`. Uncompleted -> clear neutral text `Nog te ontdekken`, not gray printed stamp or pre-earned silhouette.
5. **Stamp placement:** `object-fit:contain`, natural preserved aspect ratio; no fixed circle, oval or rectangle baked in paper. Use source-approved deterministic transform/position algorithm from Hermes #45 #41 (original positions, no rerandomization). Preserve safe inset, only subtle ink pressure 98–100% as reviewed.
6. **Accessible control:** interactive hit area >=44px; whole row/tap for chapter details, descriptive chapter name separate from image; Gold and other rewards represented textually for assistive tech; no keyboard traps.

### Layout geometry (implementation guidance, not yet tested)
- Every page: safe content area approximately x 8%–92%, y 17%–92% of page, leaving top display title via HTML outside stamp slots.
- Three vertically stacked rows, each approx one third of available content height; slight variations of decorative ornaments **only in margin**. Do NOT split stamps into two side-by-side picture frames per row.
- Per row: keep stamp footprint centered/flexible at up to ~60–67% of safe row width; text/status can sit underneath or adjacent, subject to 200% zoom. Gold uses remaining side space, outside stamp footprint, **no permanent Gold ring**.
- At smaller widths/200% text: stack text below artwork, reduce margin ornamentation, not stamp size past legibility limits; book portrait uses one page, two-page spread only when room permits. Minimum art detailed view >=160px as Hermes QA #45 notes; thumbnails may need separate chapter label.
- Do not hardcode PNG pixel-specific coordinates until measured against actual `folio` final page and 11 aspect ratios.
- Source fidelity and layout safe fit trump decorative flourishes.

## 4. Remaining pages 05–10
**Do not generate six new full-page background illustrations by default.** Compose from the same approved folio and shared components; add distinct *noninteractive* ornament/small isolated vignette only if composition truly needs it:
- p05 Etna/Toscana/Landen — same 3-row pattern.
- p06 Mari/Fiumi — 2-row pattern + optional small bottom vignette, never an empty third chapter/12th Gold.
- p07–08 postcard pockets — separate corner holders and cards, two slots per page, card flip details dynamic and accessible.
- p09 ARRIVO visits — scroll/paged actual trips, dedicated arrival impression, no fake dates.
- p10 Gold — earned final large seal only after 11 actual `goldAt>0`; before that plain progress + calm ornament, no gilded pre-earned award.

Page 01–02 drafted concept art may inspire ornament but dynamic profile/progress remain textual/interactive, no embedded achievement.

## 5. Git / source audit snapshot (2026-10-26)
`art/nino-travel-stamps-v2-20261026` at lookup HEAD `e4456f2fa43b53da4d3a03084cadcada8417f67d` contains **11 original stamp masters + 11 earlier preview derivatives, 2 original book masters, 2 Gold originals, 4 postcard fronts + 1 reverse, and manifests**. This verifies only presence, not product readiness.
Hermes art-only **PR #48**, not merged, reports **10/11** inspected safe stamp alpha derivatives (Isole **REWORK**: Sardinia should sit clearly northwest of Sicily, not alongside with overlap), 11 labelled chapter icon exports PASS, closed cover PASS, original open-book background REWORK due baked illegible postmark. Do not represent 11/11 as production approved. PR #48 provides audited allowlist and deterministic placement fixtures; use ONLY after reviewed cherry-pick/copy into verified app baseline. New Gold/postcards still require independent alpha/export QA, especially Venezia RGB exterior.
New **ARRIVO** candidate exists in design conversation but not assumed in Git; alpha QA first.
**Do not** merge `art/nino-travel-stamps-v2-20261026` wholesale into canonical running app; PR #40 iPad Focus Mode, #47 afternoon P0 fixes, #29 pizza, #30 atlas and #39 semantic map hotfix must not be disrupted.

## 6. Codex implementation assignment — one bounded PR only
After current P0 iPad stability, take one clean reviewed app baseline and integrate the passport shell + pages03/04 as a **two-page vertical slice**, using the approved reusable folio (or safe CSS parchment until verified) and only audited stamp alpha exports. Add verified blank states and actual completed states for all six chapter IDs, conditional Chapter Gold, book open/close preserves question draft/focus/camera, desktop landscape 2-up, iPad portrait 1-up, offline HTML. No map/grader/reward rewrite. No automatic merge/deploy.

Once that vertical slice passes on real iPad and owner visual check, reuse SAME components for remaining 8 pages; avoid giant PR and parallel code branches.

## 7. Hermes acceptance and stop/go
Review Codex's exact SHA and screenshots at 0/6 completed, 1/6, all6, Gold0/6, Gold6/6, on iPad portrait, iPad landscape, split view/keyboard, desktop/320px, high contrast, 200% text, reduced motion, and offline single-file build.
Pass only if: no phantom Gold, intact 6 distinct stamp shapes, no clipping/baked paper or checkerboard, spine mirrored, legible live labels, no geography or progress corruption, state restored on close.
**Block** if source Isole remains geospatially wrong, unexpected fake Gold rings, lack of source alpha approval, or book preview with unreviewed baked markings.
Owner retains final visual approval.

### Financial/production discipline
No new full-page image generations for pages 03–10 without a **specific verified missing visual component**; prioritize reliable HTML/CSS/SVG composition and real images we already approved. Reuse source art, no duplicate Work/Codex/Hermes loops.
