# Issue 45 — ISOLE geographic QA: REWORK

## Decision

**REWORK for geographic acceptance, in both original PNG and provisional ink WebP.** Both required island identities are represented recognizably, but their relative north–south placement is materially wrong compared with the actual canonical school SVG. This is not a rejection of the vintage stamp style. Do not use the illustrative stamp as geographic source or answer geometry.

## Sources and scope

- Read `AGENTS.md`, `docs/PROJECT_STATE.md`, and `docs/MAP_SYSTEM.md` in the intake and current Focus worktrees before comparison.
- Art worktree: `/Users/dennisariens/projects/topo-art-intake-45`, exact HEAD `367b875c83a4e8b77c1f1d09523c20c96364f178`.
- Canonical application: `/Users/dennisariens/projects/topo-ipad-focus-mode/index.html`, HEAD `71b33fd973c7b650c63e7921af3e7bf6aab5f79f`.
- Local pinned PR39 base examined with `git show`: `fc8f5be4dc77c8b1adb71aae3931a1c134389cf5`. Required island item objects, Italy outline and entire CONTEXT_LAND object compare equal between that commit and Focus HEAD. No upstream fetch was performed; this is local canonical-source QA, not an independent upstream/GIS validation.
- Required canonical learning islands: `area-a`, Sicilië, code `a`; `area-b`, Sardinië, code `b`. Both are `kind: area`, not `kind: island`.
- Artwork directly visually inspected: `assets/nino/travel-passport/stamps/masters/stamp-05-isole.png` and `qa-candidates/stamp-05-isole-ink-preview.webp`.

## Visible findings — identity, geometry, then style

| Criterion | Result | Specific evidence |
|---|---|---|
| Required island identity, separately from style | PASS at recognizable-pair level | Left tall island corresponds to Sardinia; right broad triangular island corresponds to Sicily. The text reads “SICILIA · SARDEGNA”. **No required island is missing.** The presence of two blue blobs or the collective label alone would not establish this: identification here is supported by comparison to the canonical silhouettes. |
| East–west placement | PASS | Sardinia is left/west of Sicily in both canonical SVG and stamp. |
| North–south placement and separation | **REWORK** | In the actual SVG, Sardinia's entire bounding box ends at y=834.71; Sicily's starts at y=881.97. There is a clear vertical gap: Sicily is wholly below Sardinia in this source frame. In the original stamp, Sardinia spans roughly y=490–835 and Sicily y=580–845; the major silhouettes overlap vertically through most of Sicily's height and their southern ends are nearly level. The WebP retains that same near-side-by-side arrangement. Sicily has effectively been brought far north relative to Sardinia, or Sardinia far south relative to Sicily. This is compositional displacement, not the canonical geographic relationship. |
| Sicily silhouette/orientation | Recognizable; exact coastline NOT certified | Canonical Sicily has a mostly east–west northern edge, an up/right northeast tip and a downward southeastern corner. Those same major directions appear in the stamp. No visible evidence supports claiming a horizontal or vertical mirror inversion. The stamp makes coast irregularities broader/rounder and adds or emphasizes peripheral blue marks; it is not an exact tracing. Do not describe it as a faithful geographic outline. |
| Sardinia silhouette/orientation | Recognizable; local distortion | Canonical Sardinia is tall, with a northern indentation, a northeast high point, and a small detached mark northwest of the main outline. The stamp keeps the tall orientation and north indentation, but the upper-left protrusion is enlarged into a prominent hooked/lobed projection and the western edge/nearby islets are more embellished. This is visible local shape distortion, not proof that the entire island is flipped. |
| Peripheral islands/islets | UNVERIFIABLE as geographic identities | Blue dots/ovals north/east of Sicily and around Sardinia are present. No labels or source mapping establish which real islands they intend. The unchanged canonical learning-target paths do not establish every such extra mark as a required learning island. Do not invent identities or claim a missing Corsica: Corsica is not one of the two required learning targets. |
| Text order vs map order | No separate failure | Collective text lists Sicily first, while the left silhouette is Sardinia. A collective caption need not follow left-to-right shape order; do not mislabel the left shape as Sicily because of caption order. Individual island labels would reduce ambiguity but are not established here as an existing acceptance requirement. |
| Vintage ring, ink texture, red/blue palette | Not the geographic gate | These can be retained. Alpha processing/ink extraction does not correct the relative placement problem. Visual pilot approval is not equivalent to coastline/geography approval; the handoff explicitly asks for canonical ISOLE coastline QA. |

## Repair criterion

Preserve the approved artwork direction, but revise the illustrated geography so that Sardinia is visibly northwest of Sicily, with the strong canonical north–south offset rather than nearly aligned bottoms. Use the actual unchanged island paths as a reference for recognizable coast and orientation; do not move or alter the application SVG to match the stamp. If a deliberately rearranged, not-to-scale island montage is desired instead, that requires an explicit owner/product acceptance decision and clear treatment as illustration, not a geographic-map pass.

Before accepting revised art, verify both required identities independently of typography/style; compare the northeastern and southeastern Sicily corners, Sardinia's north indentation and side contours, island order and vertical separation. Remove unsupported satellite decoration or supply a real reference for its intended identities. A precise GIS-coastline certification remains outside this local comparison.

## Actual reference proof and reproducibility

The proof script reads canonical `ITEMS`, `CONTEXT_LAND` and `italy` from the Focus `index.html` and renders actual `shape` strings with Chromium/Playwright. It does not load a substitute map, redraw coordinates, rotate paths or alter the app renderer. Proof-only fills distinguish required islands from context; these are not screenshots of the application's Discovery paint. The full map preserves the 890×1235 frame. The isolated crop changes only the camera to `200 630 470 410`, maintaining one shared scale and all relative coordinates. Original stamp bytes are embedded unchanged and composited on white.

Artifacts, all under `/Users/dennisariens/projects/topo-art-intake-45/docs/qa/artwork-45/`:

- `isole-side-by-side.png`: actual canonical paths, unchanged original PNG and unchanged ink WebP, side by side.
- `isole-canonical-islands.png`: actual target-path crop, inspected visually after generation.
- `isole-canonical-islands.svg`: vector version of that crop.
- `isole-evidence.json`: exact revisions, original asset hashes, island path hashes, equality checks and browser-measured bounding boxes.
- `isole-proof.mjs`: reproducible proof generator; run from intake root with `npx --yes --package=node@24 node docs/qa/artwork-45/isole-proof.mjs`.

Execution returned required IDs `area-a`/`area-b`, all three PR39/Focus geometry equality checks true, and nonempty island bounding boxes. An initial selector using `kind: island` returned zero features; it was corrected to the exact canonical item IDs, rerun, and the resulting reference images were visually inspected. No empty-reference result was used for this decision.

Only new `docs/qa/artwork-45/isole-*` evidence files were written. No source, original asset, Focus file or renderer appearance was changed. No merge, deploy or independent upstream claim.
