# Release 1 integration evidence

## Before integration (2026-10-23)

Main: all seven maintained test programs pass; original Nino WebP artwork and embedded art checks, eleven-stop four-stage route, local rewards/migration, standalone HTML, print HTML/PDF freshness pipeline work. Test exercises still require schoolcode recall; geographic paths have no documented source.

Work: archive SHA-256 verified before extraction; unmodified `node check.cjs` passes syntax, 168 reward answers, 100 meter totals, gold coverage, daily reset, adaptive skills, 27 source anchors, 45 geometry hashes, fallback equality and code-stage migration. Contains three-stage progression, neutral overlap picker and updated geometry. Lacks canonical Nino artwork and maintained print/DOM coverage.

Integration keeps the canonical document/artwork, route presentation and print pipeline. Ports Work runtime changes and source-backed geometry, with regression checks maintained against root index.html. Frozen archive retained unchanged for provenance.

## Integrated changes and review boundaries

Original Nino HTML/artwork and route presentation are retained. Work's source-backed map, three-stage lessons, six-question adaptive/long-lesson breaks, skill histories, passport, daily goals, local backup, neutral overlap picker and locator zooms are ported. Reward rendering uses the original eight-wedge art and nonblocking trip toast. Integration additionally makes stage/gold rewards idempotent across replay/migration, gives rivers separate screen-pixel hit targets, and makes visible microstate marks keyboard actionable.

Printing remains generated: canonical vector content, temporary question labels, naming/location practice and the original photo as a separate appendix. The booklet is 35 pages. `generate-preview.mjs` also derives all 45 fallback targets from canonical data.

## Validation

- Frozen ZIP SHA-256 checked before extraction and again after integration: OK. Unmodified archived `node check.cjs`: PASS.
- Pre-integration main's seven test programs: PASS.
- Final `npm run lint`: PASS (syntax, exact engine extracts, original Nino bytes, self-contained downloads).
- Final `npm test`: PASS (nine maintained programs: geography, printing, learning engine, route engine, exam, full standalone UI, route DOM, transferred Work regressions, Release 1 DOM integration).
- Final `npm run build`: PASS; static preview/HTML/print/PDF freshness checks pass.
- `npm audit`: zero vulnerabilities after compatible `source-map-js` patch (test-only transitive dependency).
- Chrome evidence: `visual/release-1/browser-results.json` and screenshots. Local URL only; no public deployment was tested.

Earlier failures were resolved: old tests expected four/code stages; fake DOM did not model new browser APIs (replaced with real jsdom); desktop browser harness initially targeted hidden mobile controls; native details toggle needed a render wait. Expanded gold QA then exposed nonfocusable visible microstate marks; corrected in the app and covered by DOM/Chrome checks. PDF generation initially needed a compatible ReportLab/Pillow combination for this Mac's Python 3.8/OpenSSL; generated outputs now pass freshness/build checks. No outstanding automated failure remains.

## Limits and recommendation

Ready for independent Hermes review and owner acceptance, subject to physical iPad Safari and actual printer checks. Not an approval to merge/deploy. No physical iPad pass, production URL or general accessibility certification is claimed. Nine map areas remain schematic; raw version-pinned upstream GIS is absent from the inherited handoff. Engine tests ran on this Mac's Node 24.13.1 despite jsdom's newer engine warning; use supported Node 24.15+ for independent reproduction. No TypeScript checker is configured.

Hermes instructions: `HERMES_QA_RELEASE_1.md`. The original handoff PR #2 must not be merged as the integrated application.

## Commit and browser evidence

- Provenance/baseline commit: `0f975a6`.
- Implementation commit: `d4a273bb54a6fa5b09236aff52fef26a5f0aaa73`.
- Chrome for Testing `146.0.7680.153`, reduced-motion context, local `http://127.0.0.1:8000/`: final automated browser run PASS, zero page errors. Full countries gold passed all fourteen answers across six/twelve-task pauses.
- Screenshots: [route](visual/release-1/desktop-route.png), [adaptive result](visual/release-1/adaptive-finish.png), [neutral overlap picker](visual/release-1/rome-vatican-picker.png), [tablet](visual/release-1/tablet-lesson.png), [phone](visual/release-1/phone-lesson.png), [gold](visual/release-1/countries-gold.png), [printed countries](visual/release-1/print-countries.png). [Machine-readable result](visual/release-1/browser-results.json).
- Final screenshot review also corrected old print table headings and made the finish-place list refer to the current round. Legacy sessions without historical per-answer records display unavailable round scores explicitly; preserved whole-lesson totals remain visible.
