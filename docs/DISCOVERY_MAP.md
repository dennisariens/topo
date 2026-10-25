# Discovery Map — working in-app atlas candidate

## Result / source contract

This is a **production implementation in the canonical Topo app**, not PR #26's standalone design proof. It adds exactly **Schoolkaart / Ontdekkingskaart** to Kaartopties, live shared-vector map zoom/pan and an actual, geographically registered relief layer. The owner-approved `Vernieuwde Topo Italië Interface` is the primary visual benchmark; it is included only in review evidence, **never used as map pixels or geometry**.

Branch: `hermes/topo-discovery-map-production`. Verified base: schoolblad PR #27 **`1c4d00f8d5cf9a293ac0d2643b4163c2eed384d0`**, itself atop integration PR #17 **`c68ace4e44a6e797f536ec1a8d6b517d29167320`**. The initial base's fourteen verification/test programs passed before implementation. No Codex or owner branch was edited; PR #27's `schoolblad.js` and `schoolblad.css` remain exact original bytes. This candidate can be reviewed as a stacked PR over #27 without competing schoolblad code.

PR #26's native two-radio utility, palette/layer constraints, explicit-choice policy, shared-frame approach and source-comparison method were adapted into real app modules. Its fixture page and proof-shell replacement are not shipped. No new learning feature, profile, passport, reward or schoolcode exercise was added.

## Visual layers — real geography, not a recolored poster

1. **Canonical vector school map**: all original paths, points, anchors, six lake geometries, IDs and handlers remain. Schoolkaart retains the original map paint.
2. **Riviera sea paint / quiet wave material**: CSS/SVG definitions and noninteractive full-frame texture, below land/targets. It is decorative water material, not new bathymetry, sea boundaries or routes.
3. **Actual terrain relief**: 63 source AWS Terrarium zoom-7 elevation tiles, reprojected into the exact existing `890 × 1235` affine frame. Alps, Apennines, Etna, Corsica/Sardinia and surrounding land are derived from measured elevations, not invented mountain illustrations. Warm olive/tan/cream hypsometric color and hillshade provide depth. The WebP is **890×1235, 59,152 bytes**, with no coastline mask, labels, markers or borders of its own.
4. **Exact source land clipping**: a `clipPath` references the existing land paths using `use`. No new geographic `path` is copied or traced. Original land paint/borders remain above the relief, followed by original schematic areas, lakes, rivers, labels and points.
5. **Italian framing / approved Nino**: cream paper mat, restrained lemon/leaf accent outside the SVG, the already-approved original panorama as a quiet header atmosphere, existing Nino portraits/Guide/feedback art. Where a landscape layout already leaves wide paper gutters, character-free CSS crops of that same approved panorama fill **only those gutters**, visibly labelled “Sfeerillustratie · Italië”; they never overlap the geographic SVG or consume additional map area. They are hidden when gutters are narrow, on phones, in formal tests and high-contrast mode. No Nino generation, master correction or character replacement.
6. **Assessment restraint**: formal Test/Gold keeps explicit chosen palette but removes the relief/waves/header scenery/botanical accent and uses solid, readable land/sea fills. No extra answer label or question-dependent decorative highlight is introduced.

Sources, exact tile hashes, attribution-document hashes, registration bounds and validation: [`assets/discovery/terrain-provenance.json`](../assets/discovery/terrain-provenance.json). The generator verifies terrain samples near Mont Blanc, Gran Sasso, Etna and the Po plain; these are rendering checks, not new learning places. Data credit appears in **Over de kaart**: Mapzen Terrain Tiles; USGS SRTM/GMTED2010; NOAA ETOPO1. No claim of navigation-grade terrain or a fresh survey of the inherited nine schematic educational zones is made.

## Interaction / preserved learning

- Default **Discovery** in Leren/Ontdekken; default **School** in Point/Write/formal tests until the learner chooses explicitly.
- Explicit choice persists under separate `topo-ui-map-style-v1`, outside learner state/backups/reset/reward schemas. It survives next/mode changes and reload; no automatic switch halfway through a question.
- Changing style only changes paint/UI preference. The original `mode`, `next`, `grade`, progress and reward functions are not replaced or wrapped. The entire verified PR #27 HTML is retained byte-for-byte after removing the two isolated additive atlas blocks.
- Original source coordinates, 45 IDs, 27 point anchors, six lake paths and `viewBox="0 0 890 1235"` remain. Runtime tests compare both styles at the same zoom/question and obtain **zero screen-position drift**.
- The single SVG remains interactive. The shared scroll viewport zooms 100–300%; browser touch scrolling, map-button zoom, keyboard +/-/Home/arrows and original hit testing all use the same `getScreenCTM`. Native page pinch remains available. New map-specific two-finger pinch-to-scale is **not** implemented or claimed; the existing schoolblad has its own unchanged pinch handler.
- Rome/Vatican uses the existing neutral numbered picker, including real touch at 100% and 200% zoom. San Marino retains its original source anchor and selection code. No named containment hint is added in point/test mode.
- Schoolblad remains the original separately summoned reference overlay, not a third map style. Its focus/caret/scroll/pan/zoom behavior is preserved and its complete maintained browser suite was rerun.
- iPad sidebar/question stays visible next to the map. The map height responds to the space below the actual toolbar rather than guessing device dimensions. Phone controls remain above a full-width map with normal vertical scrolling; no decorative layer intercepts taps. Route illustration space is compacted on phones without altering art bytes.

## Evidence — actual app, not concept screens

[Landscape: reference alongside real app](visual/discovery-map/ipad-landscape-reference-comparison.png) · [Portrait: reference alongside real app](visual/discovery-map/ipad-portrait-reference-comparison.png)

| Same source frame / question | Schoolkaart | Ontdekkingskaart |
|---|---|---|
| iPad landscape | [School](visual/discovery-map/ipad-landscape-school-learn.png) | [Discovery](visual/discovery-map/ipad-landscape-discovery-learn.png) |
| iPad portrait | [School](visual/discovery-map/ipad-portrait-school-learn.png) | [Discovery](visual/discovery-map/ipad-portrait-discovery-learn.png) |
| Active route / landscape | [School](visual/discovery-map/ipad-landscape-route-discover-school.png) | [Discovery](visual/discovery-map/ipad-landscape-route-discover-discovery.png) |
| Active route / portrait | [School](visual/discovery-map/ipad-portrait-route-discover-school.png) | [Discovery](visual/discovery-map/ipad-portrait-route-discover-discovery.png) |

Further evidence covers live writing, actual correct feedback, quiet Test style, schoolblad return, 390/320px phone and desktop. These are real Chromium viewport/touch-emulated screenshots, **not physical iPad Safari**. Review boards preserve image aspect ratios and label the concept separately from the actual app. The benchmark is not imported by the app or used as the map.

## Remaining visual differences — stated before owner approval

- The reference has an expansive, hand-illustrated scenic composition. This candidate uses **source-derived shaded relief**, more cartographic than hand-painted. It is visibly richer than the prior palette-only proof, but is **not a pixel-identical recreation or an assertion of equal artistic finish**.
- The canonical tall `890×1235` frame is intentionally retained. The reference's wider composition is not obtained by stretching Italy or moving surrounding geography. On iPad landscape this retains the portrait map plus explicitly non-geographic scenic gutters rather than stretching the projection; zoom supplies detail without changing geometry.
- Botanical/scenic framing is deliberately smaller than the concept, particularly on phones and in assessments. A fully hand-painted, geographically registered relief treatment would be additional approved art work, not a secretly substituted generated coastline.
- The reference's new passport layout/illustrated sidebar is not fabricated here. Existing truthful Nino/reward/progress UI is preserved; Codex's separate passport/onboarding work is not duplicated or claimed integrated.
- Physical iPad Safari, on-screen keyboard, VoiceOver, actual child use and owner taste acceptance remain open. Pixel/keyboard checks are not broad accessibility certification. Context labels retain source size/positions with a light halo in Discovery; zoom supports detail, but small source labels are not all comfortably readable at full-frame landscape scale.

**Recommendation:** working, reviewable map implementation; owner should judge the actual comparison boards and these explicit visual gaps. No claim that the approved illustration benchmark has been matched perfectly. No merge/deployment approval is implied.

## Verification / reproduction

Use Node **24.15.0+**:

```sh
npm ci
npm run build
npm run lint
npm test
npm run audit:release-1-2
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/qa-discovery-map.mjs
QA_OUTPUT=/absolute/path/to/evidence PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs npm run qa:schoolblad
```

Normal build is fully local: it embeds the committed hash-pinned relief, modules and all existing art into the original third inline script/styles; both `output/html/*.html` downloads and `dist/index.html` equal canonical `index.html`. It fetches no terrain and adds no runtime dependency. Source/baseline audits normalize only explicit atlas insertion blocks and then compare the entire pre-existing app; they do not waive geography or grading assertions. Existing schoolblad test was only taught to exclude those same new blocks; its implementation stays untouched. QA_OUTPUT merely redirects maintained schoolblad evidence away from its historical report.

- Fifteen chained validation/test programs: original map/print/learning/route/save/reward/migration/Gold suites plus the new four atlas cases. Original Nino six cases and schoolblad four cases continue to pass.
- New actual-app browser QA: desktop **1440×1000**, iPad **1180×820 / 820×1180**, phones **390×844 / 320×568**; real choice controls, draft/question continuity, native keyboard, zoom/pan, source neutral touch picker, real answers and actual Discover→Point route progression.
- Both actual standalone downloads opened using `file://`, offline contexts; embedded DEM decodes at original dimensions. Existing schoolblad suite also tests both downloads and dist, reference fit/zoom/pan/pinch, focus/caret/Escape, route/Gold and orientation/large text.
- Original Nino assets, school photograph, learning/reward engines, all geography and print HTML/PDF are exact protected source bytes. Existing saves/reset scopes/daily and replay idempotence remain covered. Selected UI/boundary contrast and focus are inspected; no new answer labels/targets are added.

Machine-readable [browser results](visual/discovery-map/browser-results.json), [full verification output](visual/discovery-map/verification.txt), [source preservation](visual/discovery-map/source-preservation.json), [schoolblad regression](visual/discovery-map/schoolblad-regression/browser-results.json), and [parent-executed terrain rebuild](visual/discovery-map/terrain-rebuild.txt).

Optional source rebuild (Python NumPy/Pillow, development only):

```sh
python scripts/geography/generate-terrain.py --cache /your/cache/path
python scripts/render-discovery-comparison.py --reference '/path/to/owner-reference.png'
```

The terrain generator records the exact projection and download hashes. Normal npm build does not require Python. See provenance for pinned dependency versions and public-data notices. Owner imagery is untouched. No branch merge, deployment or replacement of the previous release was performed.
