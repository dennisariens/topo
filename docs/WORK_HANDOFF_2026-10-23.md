# Work → Codex handoff — 23 October 2026

## Start here

Continue in `dennisariens/topo`. Read AGENTS.md, this document, PROJECT_STATE.md and MAP_SYSTEM.md. The repository root `index.html` remains the canonical application. This branch preserves the divergent Work implementation as a frozen transfer archive; it does not integrate or deploy those changes.

GitHub baseline: `7e38160cb2f1f1c159c907e0150464b78c761f38`. Work/Sites baseline: `b6d1b8e16c692012b7790d44e329043fa81facdb`. GitHub has original Nino artwork, engine extracts, extensive DOM tests and the generated printbook pipeline absent from the Work build. Do not replace root index.html wholesale with the snapshot.

## User-approved requirements

- Remove questions that require memorising worksheet numbers or letters. Keep map pointing, highlighted-place naming/writing and mixed tests. Codes can remain reference metadata, not a learned skill.
- Keep all 45 places, existing groups, progress, gold, saved mistakes and reset scopes.
- Prevent map drift; keep geographic positions independent of touch target size. Make San Marino and Vatican visible in every relevant highlighted exercise and gold challenge.
- Make pizza rewards continuous after a full pizza; retain earned progress.
- Continue the guided Italian scooter learning app with short useful practice, then hand ongoing development to Codex/GitHub.

## Frozen implementation available for integration

`work-sync/2026-10-23/topo-work-snapshot.zip` contains:

- `dist/index.html`: complete self-contained Work app, including embedded worksheet and map.
- `check.cjs`: executable targeted regression checks.
- `reference/README.md`: source URLs, projection, audit and limitations.
- `reference/points.json`: 27 source lon/lat locations and projected anchors.
- `reference/original-points.json`: previous 45 anchors for comparison.
- `reference/map-manifest.json`: all 45 identifiers, codes, positions and geometry hashes.

Implemented in that archive:

1. Three route stages: discover → point → write. Schema-1 saves migrate to schema 2; writing completion and gold survive; obsolete code sessions are discarded. Free tests, adaptive sessions and reviews use pointing/writing only.
2. Six-question adaptive practice of weak, due and new skills; separate point/write histories; a 45-place knowledge passport; round scores distinct from lifetime totals; daily-goal reset handling.
3. Continuous pizza meter and restrained inline reward feedback; large lifetime totals no longer leave the visible meter maxed out. Six-question breaks preserve complete gold challenge coverage.
4. Source-projected city/microstate/volcano positions; Natural Earth 50m country/coast/island geometry and 10m rivers; Vesuvius corrected to east of Naples. Projection: x = 55 × longitude − 225.5; y = 3830.75 − 77 × latitude.
5. Accurate close points remain unmoved. Crowded touch targets use a neutral numbered local map picker without revealing the answer. Vatican/Rome and San Marino highlights remain visible. SVG keyboard dispatch fixed.
6. Stable map aspect ratio and matching static/live coordinates. School photograph shown separately at its original aspect ratio, not treated as an exact registered overlay.

## Geography limits

The photograph is perspective-skewed and has unlabelled city dots. It cannot independently establish every name or boundary. 36 target geometries are source-backed; 9 regions/mountains/sea zones remain explicitly schematic. The manifest detects subsequent changes, not independent geographic truth. Raw downloaded reference GeoJSON is not bundled; public source URLs and projected output are retained in reference/README.md. Preserve provenance and fetch source data before further geographic edits.

## Next bounded Codex task

Integrate the snapshot changes into the canonical root app in one reviewable implementation PR, preserving Nino art and the print pipeline. Do not begin another broad feature audit or add a second maintained map copy.

1. Extract archive to a temporary directory; inspect the reference README and compare the root app to the snapshot. Port geography, map interaction, learning and reward changes deliberately.
2. Update the exact first/second inline engine extracts and existing tests for three stages and no code-memory questions. Preserve old-save migration and gold.
3. Align generated printable exercises with place knowledge rather than memorising fixed codes; temporary worksheet question labels are allowed. Keep one source of place/geometry data. Regenerate print HTML and PDF with the prescribed scripts when their source changes.
4. Port snapshot regression checks into the maintained test suite, including 27 source-projected anchors, 45 geometry baselines, static/live equality, microstate highlighting, overlapping-target grading, adaptive skill isolation, reward rollover and migration.
5. Run npm run lint, npm test, npm run build. Verify actual browser flows for point/write/mixed test, gold, Vatican/Rome selection and San Marino; check desktop/tablet aspect ratio. Test physical iPad Safari separately before claiming device support.
6. Update PROJECT_STATE, MAP_SYSTEM, DECISIONS and ROADMAP to describe the integrated state. Publish only the integrated tested build; state which public URL was verified.

## Validation and release status at handoff

- GitHub baseline: npm run lint, npm test and npm run build all passed on 2026-10-23. These tests still cover its older code-based behavior; passing them does not mean the snapshot is integrated.
- Work: node check.cjs passed after removal of code questions. Checks cover syntax, reward rollover through 168 correct answers and 100 lifetime totals, duplicate rewards, gold/resume, adaptive sessions, skill isolation, geography and schema migration.
- Earlier browser checks exercised app boot, six-question results, crowded point selection, Vatican and San Marino highlighting. No physical iPad verification. Final code-removal edit received automated checks, not a fresh complete browser pass.
- Current Work edits have NOT been published to the live Site or replaced in the prior downloadable file. Existing Site: https://topo-vespa.dennisariens.chatgpt.site (older build). This synchronization does not deploy or merge main.
- Deferred ideas: postcards/customisation, parent print builder, placement challenge and cloud sync. None are claimed implemented.

## Recovery commands

From repository root:

```sh
(cd work-sync/2026-10-23 && sha256sum -c SHA256SUMS)
unzip work-sync/2026-10-23/topo-work-snapshot.zip -d /tmp/topo-work-2026-10-23
(cd /tmp/topo-work-2026-10-23 && node check.cjs)
```

The archive is historical handoff material, not a second active application. After integration, retain it only for provenance/recovery and mark this handoff completed with the integration commit.
