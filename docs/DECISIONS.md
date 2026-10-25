# Decision log (append new entries; retain superseded entries)

## 2026-09-24 — Publish canonical baseline to dennisariens/topo

**Decision** The Git repository `dennisariens/topo` on `main` is the ongoing source of truth; the Library ZIP remains a historical recovery snapshot. **Reason** An explicit remote prevents later sessions from editing a stale archive instead of the repository. **Status** LOCKED. **Supersedes** Treating the reconstructed local repository as the only current copy.

## 2026-09-24 — Treat restored v6 as the executable baseline

**Decision** `index.html` is copied from the latest Library `topo-italie-v6.html` version 7; this repository and its docs become the editing source. Earlier HTML versions are historical. **Reason** The previous scratch workspace was pruned and no Topo Git repository was accessible; v6 is the latest identified artifact. **Status** ACTIVE. **Supersedes** Treating older `v2`–`v5` copies or conversation screenshots as the current app. The geographic provenance of embedded paths remains unverified.

## 2026-09-24 — Geography before styling

**Decision** Visible locations, shape recognition and land/sea distinction take priority. Preserve recognizable country silhouettes and surrounding land. Keep labels over the intended geography and trace source geometry before new manual coordinates. **Reason** Past errors placed San Marino or coastal names over the Adriatic and land into the sea color. **Status** LOCKED. **Supersedes** Approximate boxes or visual shortcuts for country learning.

## 2026-09-24 — Visual geography and tap geometry are separate

**Decision** Real tiny-state/volcano/river location remains small/accurate; future generous hit geometry may be invisible, and Rome/Vatican need a local two-choice inset/lens. **Reason** Current visible 9-unit Vatican circle distorts scale and touches Rome's hit area. **Status** ACTIVE (lens concept not implemented). **Supersedes** Enlarging a microstate's visible country depiction solely for clicking.

## 2026-09-24 — Worksheet photo requires registration

**Decision** Keep SVG north-up; rectify photo perspective against multiple verified landmarks, and retain readable original. **Reason** The photographed frame has perspective/skew and is stretched with `object-fit:fill`; a guessed rotation can align one point while making other locations wrong. **Status** ACTIVE, implementation pending. **Supersedes** An arbitrary CSS rotation as an alignment fix.

## 2026-09-24 — Reference groups and gentle reward loop

**Decision** Preserve learning groups and printable names, mistakes and reset. Target rewards are 8 slices per pizza and approximately 3 pizzas per brief Vespa milestone; short, nonblocking, reduced-motion-friendly animation. **Reason** Reference and active recall reinforce each other; rewards motivate without distracting. **Status** ACTIVE design; current five-answer pizza is IMPLEMENTED and must be migrated carefully. **Supersedes** Treating a completed pizza as an endpoint. Exact journey threshold/stops can be tuned.

## 2026-09-24 — From random picks to testable sessions, then adaptive review

**Decision** First implement shuffled, testable session coverage without adjacent repeats and category-aware practice; later weight weak items using recorded responses/due dates. **Reason** Learn starts at Bari by ordered list, while quiz makes independent random picks; neither ensures varied first question plus broad coverage. **Status** ACTIVE, implementation pending. **Supersedes** Relying on repeated `Math.random()` draws as a learning sequence.

## 2026-09-24 — Stabilize Italy before expansion

**Decision** Focus next package on source provenance, worksheet calibration, microstate interaction, sequencing and continuous reward, with restrained polish and tests. **Reason** Further geographic content would compound drift. **Status** LOCKED for this stabilization phase. **Supersedes** Adding unrelated regions/features before the Italy baseline is reliable.

## 2026-09-27 — Preserve worksheet orientation after matching school dots

**Decision** Keep the 890 × 1235 photo at its existing 1:1 orientation over the equally sized SVG. Do not rotate/warp the photo until independent coastline control points prove that a change improves alignment without displacing school dots. **Reason** Sampled red worksheet dots already match runtime city anchors across the image; camera perspective and coastline differences cannot be corrected by a single rotation. **Status** ACTIVE. **Supersedes** The unverified assumption on 2026-09-24 that CSS `object-fit:fill` necessarily stretches this equal-ratio photo or that an immediate homography is required.

## 2026-09-27 — Small Vatican marker and two-target Rome lens

**Decision** Show Vatican as a small SVG mark near Rome and share one transparent trigger that exposes explicit Rome/Vaticaanstad buttons. Use hover/focus/tap and keep the buttons keyboard accessible. The lens sketch is schematic; its choices map to distinct item IDs. **Reason** One large visible enclave circle distorts geography and overlapping points are ambiguous on touch. **Status** ACTIVE, implemented; touch QA pending. **Supersedes** The former radius-9 visible Vatican circle and the 2026-09-24 planned-only lens status.

## 2026-09-27 — Shuffled sessions and lightweight mistake reviews

**Decision** Fisher–Yates shuffle each eligible session deck; vary the first Learn/quiz highlight, avoid adjacent quiz repeats and permit one saved mistake review after five turns. Keep the group list in worksheet order. **Reason** Bari was invariably first in Learn; independent quiz random draws offered no coverage guarantee. **Status** ACTIVE, implemented. **Supersedes** 2026-09-24 planned-only sequencing and repeated independent draws. Weighted/mastery scheduling remains future work.

## 2026-09-27 — Continuous pizza/Vespa progression with v2 migration

**Decision** Correct answer = one slice; 8 slices = pizza; each third pizza = one trip through Rome → Florence → Bologna → Venetië → Milaan → Genua → Napels. Save v3 state, preserve old earned pizzas and proportionally convert the partial v2 meter; keep both reset scopes. Celebration lasts 1.4 seconds and respects reduced motion. **Reason** A continuous but restrained reward supports practice while preserving previous effort. **Status** ACTIVE, implemented. **Supersedes** Five-answer pizza and the 2026-09-24 planned-only loop.

## 2026-09-27 — Worksheet code test in both directions

**Decision** Toets is finite for the selected existing group and defaults to alternating code → name and name → code. Offer either direction alone and a mixed map test, plus score and restart. Distinguish lowercase area letters a–o from uppercase water/river letters A–G when validating codes; continue case-insensitive matching for names. A skipped or revealed exam item counts as incorrect and enters the mistake list. **Reason** A child needs to recall both sides of the original school worksheet mapping; treating `a` and `A` as equal can mark a wrong geographic feature as correct. **Status** ACTIVE, implemented. **Supersedes** An endless mixed test with only name → code and case-insensitive code comparison.

## 2026-09-27 — Print from one content source

**Decision** Generate standalone interactive HTML, an A4 print page and a PDF booklet from the current `index.html` content and `learning-engine.js`. Use the existing 11 worksheet groups, with a reference sheet and both paper test directions. Allow the clean map or the photographed school sheet in the HTML; the PDF uses the original photo as a familiar reference. **Reason** The child needs a usable answer map and paper tests without copying 45 coordinates and code mappings into a separately maintained document. **Status** ACTIVE, implemented. **Supersedes** Relying only on the browser print of the interactive screen.

## 2026-09-28 — Restore one-file v6 execution and require button smoke coverage

**Decision** Keep all runtime scripts inside `index.html`, as in the working v6 baseline. Check that the first inline script exactly matches the testable engine source, that the downloadable HTML is byte-identical, and execute the complete boot plus learn/point/write/exam/reset buttons in a DOM smoke harness. Provide a served HTTPS URL for actual browser usage, not GitHub raw content or the iOS Files preview. **Reason** A missing secondary JS file or non-rendering preview makes every control appear broken despite passing syntax/unit tests; a child needs a first-tap working experience. **Status** ACTIVE; code and automated checks implemented, live device/hosting verification pending. **Supersedes** The 2026-09-27 split-runtime `index.html` and treating a raw downloadable HTML link as a live app.

## 2026-09-28 — Preserve category progression in every activity

**Decision** Keep the worksheet groups selectable in Learn, Point, Write and Test. Start on cities 1–6, then let the learner advance by group. In practice, an explicit Skip or Reveal shows the answer and adds the item to mistake review; Next advances only after feedback. Clicking a map item outside the Learn group moves to that item's group. **Reason** The previous point/write modes unexpectedly drew from all 45 items, and a learner could silently skip hard items without review. **Status** ACTIVE, implemented and covered by standalone button-flow tests. **Supersedes** The group selector being exclusive to Learn and Test, and practice skips that silently discard a question.

## 2026-09-28 — Keep printed place markers visible

**Decision** Offset city codes on printable worksheets and connect each code to its original city dot with a short leader line. Generate shared positions for print HTML and PDF; require minimum clearance from every printed city dot and from other codes. Fail the build if the PDF does not match the generated print source. **Reason** The previous badges sat nearly on top of the red school worksheet dots, obscuring the location a child must learn. **Status** ACTIVE, implemented and visually checked on city group learning/test pages. **Supersedes** The printable city code positioned just 12 SVG units from the marker.

## 2026-09-28 — Guided route is the first screen and existing practice remains accessible

**Decision** Present a separate eleven-stop path first. Every future stop and its four stages is visible but disabled until the preceding stop is finished. All completed stages can be replayed; a stop unlocks the next without requiring the optional flawless gold challenge. Guided lessons reuse the same map and school codes. **Reason** A child sees a clear next step and their whole journey while retaining direct category practice and a real map during exercises. **Status** ACTIVE. **Supersedes** Making the grouped Learn tab the sole arrival screen.

## 2026-09-28 — Small adaptive reviews and pizza as positive reinforcement

**Decision** Save in-progress route questions, chapter completion and gold locally; repeat errors after other items, schedule short review of weak items, and award slices once for a correct question token. Pizza/Vespa remains a brief visual celebration, with no penalties for wrong answers or skipped days. Show the reward near route progress. **Reason** Active recall and spacing should support learning; repeated reloads must not mint slices, and rewards must not hold up a lesson. **Status** ACTIVE. **Supersedes** The 2026-09-27 assumption that item history and due reviews are entirely future work; longer-term mastery across modes is still open.

## 2026-09-28 — Explain Rome and Vatican containment in a schematic inset

**Decision** Draw an oval representing Rome's city area inside the selector and place the Vatican marker inside it, clearly labeling the inset not to scale. Keep the original separate mapped item coordinates and identifiers. **Reason** Two nearby dots alone imply neighboring places; the learner needs to understand Vatican is enclosed by Rome. **Status** ACTIVE. **Supersedes** The earlier lens sketch with two seemingly adjacent dots. Independently sourced map geometry is still pending.

## 2026-09-28 — Give the route its own original Italian artwork

**Decision** Use a compact inline vector landscape, an original Vespa graphic, category and lesson pictograms, and eight visually earned pizza slices on the route and quiz reward. Keep the map plain and avoid Duolingo-owned character art or virtual currency. **Reason** Progress should feel tangible to a ten-year-old without obscuring locations or adding external asset requests to the standalone HTML. **Status** SUPERSEDED (scenic art direction; functional SVG pictograms and eight pizza wedges remain). **Superseded by** the Nino character decision below.

## 2026-09-28 — Original Nino character becomes the visual thread

**Decision** Replace the vector scooter landscape with an original premium animated illustration of a sunny Italian coastal village and a fictional young explorer, Nino, on a red scooter. Use a matching transparent cutout for the active stop, the lesson, and the earned Vespa trip. Keep category/stage pictograms, the eight pizza wedges and accessible words. Bundle both optimized WebP assets inside the standalone HTML. Do not use the supplied movie frames or characters as shipped app assets. **Reason** The flat banner failed the requested visual quality; a consistent character makes the child’s journey through the 11 worksheet groups easier to follow. The geographic SVG remains the teaching surface. **Status** ACTIVE. **Supersedes** the hand-drawn road/Vespa scenic banner and the previous vector-only art direction.

## 2026-10-23 — Integrate Work selectively into canonical Release 1

**Decision** Preserve the original Nino document, assets, route presentation, engine extraction checks and print pipeline; port verified Work geography, learning and interaction changes. Keep the archive checksum-identical as historical recovery material. **Status** IMPLEMENTED on integration branch; owner acceptance pending. **Supersedes** Treating the divergent Work app or its older published Site as the active source. GitHub remains canonical; no merge/deployment is authorised by this implementation task.

## 2026-10-23 — Geographical recall replaces schoolcode memorisation

**Decision** Use exactly Ontdekken, Aanwijzen, Namen schrijven. Free tests, reviews and smart rounds evaluate pointing/writing, never fixed worksheet codes. Printable questions use temporary V-labels for marked-place naming or named-place locating. Preserve all 45 IDs/reference codes and eleven stops. Schema-1 writing completion and gold migrate; obsolete code queues close. **Status** IMPLEMENTED. **Supersedes** The ACTIVE 2026-09-27 bidirectional worksheet-code test decision, the four-stage/code requirements in 2026-09-28 route decisions, and the two code-recall print directions. Those historical behaviors are now SUPERSEDED.

## 2026-10-23 — Source-projected geometry and independent photo

**Decision** Adopt Work's explicit x=55*longitude−225.5, y=3830.75−77*latitude map frame and reference-backed output; preserve the nine declared schematic zones. Derive static/print views from root data. Use accurate visible points and separate CSS-pixel touch tolerance, neutral overlap picker and microstate locator rings. Show the original school photograph separately, never as a registered overlay. **Status** IMPLEMENTED. **Supersedes** September's unprovenanced geometry, inferred-only projection and 1:1 photo overlay policy. Raw upstream/versioned inputs remain a documented provenance limitation, not something geometry hashes prove independently.

## 2026-10-23 — Separate skills and bounded rounds

**Decision** Store independent point/write histories with weak/due/new selection, six-task smart rounds and a 45-place passport. Split longer route/gold sessions at six-task pauses without dropping any tasks. Show round scores separately from lesson/lifetime totals. Preserve legacy aggregate history without fabricating skill history. **Status** IMPLEMENTED. **Supersedes** Earlier planned-only global mastery/adaptive practice status. Local daily goals reset independently of earned lifetime rewards.

## 2026-10-23 — Idempotent rewards with original visual identity

**Decision** Keep the existing eight-wedge pizza, three-pizza Vespa cadence, Nino illustrations and short nonblocking trip toast. Show the current partial pizza continuously, including at rollover; use one compact meter in focused lessons. Persist a bounded chapter/stage/question ledger across stage/gold replays, reload and migration, including route-only resets. Fresh review/adaptive/free sessions remain rewarded retrieval opportunities. Pizza-only reset leaves learning/daily progress; full reset clears both. **Status** IMPLEMENTED. **Supersedes** Session-only reward tokens for replayed stage/gold questions. No modal reward gate, postcards, customisation or extra currency.

## 2026-10-23 — Preserve print pipeline with canonical vector geography

**Decision** Generate reference/name/location exercises and a 35-page ReportLab booklet from root items/geometry, with leaders that clear accurate points. Keep the original school photo in a separate appendix/reference sheet. Maintain PDF source freshness checks and byte-identical app downloads. **Status** IMPLEMENTED. **Supersedes** PDF geographic labels positioned over the perspective-skewed photograph and schoolcode-recall exercises. Physical printer legibility remains an acceptance check.

## 2026-10-23 — Hermes QA-1/QA-2 corrections

**Decision** Count daily-goal credit in guarded correct-retrieval grading, independently of the unchanged pizza reward ledger. Correct completed-stage/gold replays count; duplicate submissions/reloaded answered feedback do not. Validate imported route schemas 1/2 and nested structures strictly before replacement confirmation or persistence; keep startup recovery permissive. **Status** IMPLEMENTED with focused DOM and Chrome regressions. **Clarifies** The Release 1 daily-goal and backup behavior; supersedes daily credit being a side effect of pizza eligibility. No other product behavior or release scope changes.

## 2026-10-23 — Release 1.1 presentation and NOW-only Nino content

**Decision** Keep the existing artwork, palette, map and learning engines. Fix the Eilanden symbol through an explicit eleven-chapter mapping and correct the stale five-answer explanation. Show current/next chapters first, place future/completed stops in native disclosures, fit all mobile modes without horizontal scrolling, and disclose map provenance under Over de kaart. Integrate only compatible NOW messages from PR #6 (`d746ac9d`), with actual reward/round/chapter/Gold events governing copy and no learner-copy history persisted. **Status** IMPLEMENTED on a separate follow-up branch; owner acceptance pending. **Supersedes** Eleven expanded route cards and two visually equal hero CTAs. **Preserves** All progression, mastery, migration, backup validation, daily/reward idempotence, geography, standalone and print behavior. No future assistance, retry or postcard functionality is implied; no new art.

## Release 1.2 — Owner art, truthful event slots and offline embedding

**Decision** Integrate only the six immutable runtime WebP exports from owner art commit `047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d`, based on Release 1.1 `a481317`. Keep masters/design branch unchanged and candidate artwork subject to owner visual review, including Encourage's existing gold rays. Use a data-driven manifest and presentation-only reusable slots: new Gold requires full flawless/newly earned outcome; replay/pause/mixed results cannot claim it; Arrival requires the real reward-engine trip and actual destination. Pending chapters/postcards remain hidden, with no collectible feature or unlock added. Embed all assets and helpers for both self-contained offline downloads, retain original art/engines/geography/print/progress semantics, and stop at a draft PR against Release 1.1. **Status** IMPLEMENTED candidate; no merge/deployment or app-icon selection. **Clarifies** Release 1.1's no-new-art boundary for this explicitly authorised integration; grading and reward boundaries are unchanged.

## 2026-10-24 — Six sourced lakes as background context (Issue #13)

**Decision** Use pinned public-domain Natural Earth 5.0.0 main/Europe polygon excerpts for Garda, Maggiore, Como, Lugano, Bolsena and Léman. Preserve all source vertices, existing affine projection and map bounds; reuse a generated inline SVG definition below rivers/points in runtime and static fallback. Correct Maggiore's known upstream name error transparently, source actual Como from the Europe supplement, and keep lake labels/interaction/curriculum absent. **Status** IMPLEMENTED for draft review on `codex/topo-lakes-map-layer` from Release 1.1 `a481317b`; no merge/deployment. **Preserves** All learning geometry, behavior, saves, Nino ownership and byte-identical print. No decision to add lake questions or alter map bounds is implied. Exact source/license/hashes, verification and later Hermes integration: `docs/geography/LAKES.md`.

## 2026-10-24 — Bounded Release 1.2 Nino/lake consolidation (Issue #16)

**Decision** Combine exact PR #14 `4f15b610` and PR #15 `35ff21b6` on a new branch from common PR #9 `a481317b`, preserving both histories and features. Keep both generators and test suites, regenerate all derived app HTML, preserve baseline engines/print and immutable art/lake bytes, and verify combined responsive/offline behavior. **Status** IMPLEMENTED as a draft candidate, conditional on independent Hermes exact-SHA review and owner visual approval. **Clarifies** The two previous independent feature candidates now have a combined acceptance report in `docs/RELEASE_1_2_INTEGRATION.md`; neither original branch is rewritten. No art generation, icon decision, new learning targets, merge to a target/main branch or deployment is authorized by this consolidation.

## 2026-10-24 — Separate accessible original schoolblad reference (Issue #23)

**Decision** Progressively enhance the existing worksheet checkbox/photo into a separately summoned native modal, with secondary map/route/mobile-dock controls, full original image fit, bounded zoom/pan/pinch, keyboard containment and focus/caret/scroll recovery. The photograph is unchanged and never georeferenced or used as a grading surface. Opening/closing is presentation-only, with no learning, answer, save or reward mutation. **Status** IMPLEMENTED as a draft from PR #17 `c68ace4e`; owner interaction approval pending. **Supersedes** The appended image-under-map behavior in browsers with native modal support; retains that behavior as a fallback. **Preserves** All existing map geometry/style, Nino, progress and print materials. Two-style map proof #24 remains separate. Verification and design: `docs/SCHOOLBLAD_OVERLAY.md`. No merge/deployment.

## 2026-10-25 — Real Discovery atlas under exact source geometry

**Decision** Implement the owner's final benchmark as a working two-style map utility, not another proof page. Base the isolated Hermes branch on PR #27 `1c4d00f8` so the original schoolblad code is preserved. Adapt PR #26's utility/palette/shared-frame contract; add a real source DEM hillshade reprojected to the exact canonical frame and clipped through references to original land paths. Keep all original targets, geometry, assessment/reward/saves, owner Nino and print bytes. Separate persistent style preference from learning data, keep explicit choice, and remove scenic materials during formal Test/Gold. Compare actual iPad captures with the reference, acknowledging cartographic versus hand-painted style and retained portrait-frame differences. **Status** IMPLEMENTED candidate; owner visual and physical-device acceptance pending. **Supersedes** PR #26 as the final visual standard, not its geometry contract. **Preserves** Codex's active branch and exact schoolblad module/style. No merger, deployment, fabricated passport content, image-generated geography or art-master changes.
