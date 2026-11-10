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

## 2026-10-25 — P0 #36/#34 one-gesture semantic selection

Supersedes unconditional nearest-point capture and SVG paint-order selection for graded map taps. Use only the educational feature class and actual existing SVG geometry to generate candidates, never the expected target ID. Retain accurate 22 CSS px point halos, 44 CSS px non-scaling river corridors and existing region/mountain/country/island/sea fills; invert current screen transforms for zoom/pan. True ambiguity reuses the neutral picker with appropriate dot/shape wording and once-per-open answer-independent randomized order. Grade stable IDs; an invalid location follows the existing wrong/Next/repair semantics. No geography, learning/reward ledger, save, schoolblad, artwork or map-style rewrite. Measured source of the apparent route blockage is repeated incorrect hit resolution, not a route-engine deadlock; preserve completion and anti-replay rules. Physical iPad Safari and #37's mountain geography remain separate acceptance work.

## P0 #33 — map-first Focus Mode after PR #39

**Decision** Follow the owner's rejection of the permanent iPad sidebar. Stack one isolated implementation on verified PR #39 `fc8f5be4`, retaining its resolver and every geographic/learning/reward rule. Reparent the one canonical quiz/input/check to a low centered warm parchment sheet; expose existing modes, group/test and backup controls through a compact Menu. Use real visualViewport offsets/bounds and safe areas, without replacing field handlers or creating another grader. Keep full-map/chapter controls over the same SVG; exploration alone may auto-frame a group, never the requested graded answer. Keep explicit collapse/return, opaque input/feedback and accessible contrast/transparency fallbacks. **Status** IMPLEMENTED conditional candidate: Node/source gates and integrated viewport/semantic/route/offline tests pass, but actual Safari/IME/VoiceOver and an approval-blocked inherited browser-harness rerun remain open. **Supersedes** iPad's 290px permanent sidebar; does not supersede exact geography, #39 semantics, schoolblad or reward integrity. See `FOCUS_MODE.md`. No pizza/site/passport/art redesign, merge or deployment.

## P0 #37/#44 — bounded functional iPad update on PR40

**Decision** Replace only area-c.shape with a reproducible mainland teaching corridor through18 sourced peaks/passes, guided by63 hash-verified registered DEM tiles and clipped inside the original mainland. The old shape leaked19.62% of its fill offshore. Corrected fill is connected and0% offshore; Cadibona and Aspromonte coverage is explicit. This is not a surveyed boundary. Keep other44 complete item records,27 anchors,6 lakes, semantic resolver, spelling/Gold/pizza/route unchanged. Disable inapplicable chapter zoom; clear controls and learner-first Menu, printing/backups secondary. Require idempotent disabled writes to avoid observer starvation. Regenerate print/PDF and narrow historical guards to the exact signed shape/approved UI rather than skipping preservation tests. Evidence and server8033 instructions: `AFTERNOON_IPAD_BETA_2026-10-26.md`. No art/passport/reward feature, server mutation, merge or production deployment; physical Safari approval still pending.

## 2026-10-27 — Issue #50 computer download

Preserve exact PR47 runtime after actual offline file audit; add one byte-identical learner filename through the existing packager. Deliver it as a QA prerelease HTML attachment because GitHub raw URLs display text/plain, with a separate draft PR for review. This is a download artifact, not a production deployment. Preserve original filenames and local save/backup behavior. No rebuild-driven runtime rewrite, merge, iPad server update or artwork change. See OFFLINE_COMPUTER_50.md.

## 2026-10-27 — Issue #58 legible neutral map chooser

Replace tiny coincident-looking chooser endpoints with annotated geographic crops of the exact source anchors, constant-size markers, numbered external badges and collision-aware layout. Split broad clusters only when spacing/connector checks require it. Do not invent local boundaries or relocate learning targets. Show source outlines individually at a shared extent for non-point overlaps, masking sea overlays by existing land. Preserve the resolver, unbiased shuffle, grading, learning/rewards and saves. Owner visual GO/ADJUST and independent Hermes geographic/design QA remain release gates; keep the implementation as a draft candidate and leave the existing child download unchanged until approval. This supersedes treating fair numbering plus the old 80-unit crop as sufficient visual assessment quality.


## 2026-10-29 — PR #59 owner-required geographic chooser revision

**Supersedes** The 2026-10-27 choice to use generic extreme point crops and scrollable
point panels. Owner comments 6448336596 and 6490005107 reject that design; passing
pixel-distance/grading tests did not demonstrate geographic recognisability.
Restore one geographic scene and city/volcano/state semantics. Use the existing
illustrative Rome containment convention with source-relative centres, a larger
city circle and tiny nested Vatican marker, distinct neutral tips, north and a
regional locator. In broad candidate sets only this tiny relationship needs an
inset; no canonical anchor changes. Retain complete shared-scale area outlines.
Fit every candidate/control on first open, checking painted bounds against all
clipping ancestors and inset occlusion. Rendering/layout depend on candidates
and space, never the asked answer. Preserve exact resolver/grader/engines/saves/
rewards and offline packaging. **Status** IMPLEMENTED for the same draft PR59,
pending owner screenshot review before independent Hermes exact-SHA QA.
No release replacement, merge or deployment.

## 2026-10-30 — Approved computer candidate and map-selection design lock

**Decision** Integrate PR59 current `6f8bd232` with PR60 history `d7a99213` on their PR51/Release1.2 functional lineage, retaining PR59 approved source-relative nested Rome/Vatican rendering. PR60 is based on older `d55e9de`; its alternative diagram is not required because the owner accepts the previous depiction. Preserve PR59 later geographic cues and first-open viewport fitting rather than reverting them. Generate byte-identical `TOPO-NINO-Computer-Release.html` and a separate candidate prerelease for exact-artifact Hermes PASS/CONDITIONAL/FAIL. **Status** IMPLEMENTED candidate; independent final acceptance pending. **Supersedes** Earlier pending visual-design-GO statements for this approved map selection. **Preserves** Engine/45 IDs/11 chapters/saves/rewards, all existing art and both map themes. No redesign without reproducible functional/geographic defect; no final release or upstream merge before independent acceptance.

## 2026-10-30 — Exact owner-refined SVG supersedes prior Rome illustration

**Decision** Integrate the supplied 1,413-byte refined SVG (SHA256 `c2d66a994879ecc125e2bb3d01accbc8a10730d990b85ee13eb5b050e797c70c`) through one shared importer in existing PR61. Keep source paths/fills/font and Rome/Vatican endpoints, shuffle only assessment numbers, adapt neutral badge readability and reuse the importer in Discover. The diagram is schematic; only the real-map locator carries north. Other locations retain approved source geography/compositions and share pointer ink. **Status** IMPLEMENTED candidate; exact-artifact Hermes QA and owner release acceptance pending. **Supersedes** The earlier PR61 decision that the prior Rome/Vatican rendering was sufficient for the final owner-artwork task. No engine, IDs, coordinates, rewards, saves, dependencies, new art generation, onboarding or passport changes.

## 2026-10-30 — Lead integration evidence and Codex independent handoff

**Decision** Reuse existing draft PR61 and its exact approved-SVG implementation payload `b3540f72b2e21ede842bd38051e6a7015eaa0aa6`; do not create a competing implementation or change runtime bytes merely to repeat completed integration. Add reproducible lead validation, separate Chrome/WebKit all45 ledgers, actual published-download and backup/import evidence, a corrected element-scoped reference capture and an exact-commit Codex handoff. Preserve historical author evidence. **Responsibility** Hermes owns integration; Codex owns fresh independent technical QA, per the current owner mission. **Supersedes** Earlier instructions assigning independent PR61 acceptance to Hermes; lead verification is not independent approval. **Status** Lead gates pass; native Safari is BLOCKED by disabled Remote Automation, not approved by the passing WebKit engine run. Final immutable review SHA is pinned in the PR61 handoff after commit. Independent Codex verdict and owner approval remain required. No merge, final release publication, production/server change, or new design iteration.

## 2026-11-02 — Issue67 bounded artwork closure

Owner authorized technical exports from frozen masters and narrow PR61-lineage
integration. Produce PR66 reconstruction, source-faithful Gold/ink/cards and exact
folio copies; preserve originals in their pinned art history. Embed only approved
micro favicons into existing standalone HTML. Do not invent a passport component,
unlock mapping or animated hinge to close an artwork ledger. Static Pisa files
remain available; hinge stays optional under issue31/PR63. Source availability,
technical export, runtime integration and independent acceptance remain distinct.
Evidence and remaining conditions: [closure ledger](qa/nino-v2-closure-67/README.md).
This does not supersede PR61's independent functional review or owner release gate.

## 2026-11-03 — NINO 2 production integration (#68 / #21 / #67 / #58)

The owner mission authorizes one integration on exact PR61 lineage with PR70 exports and only PR69 presentation ported. Supersedes earlier no-passport/no-new-navigation scope for this branch. Preserve canonical engines, geometry and saves; passport remains a read-only projection of existing completion, goldAt and reward counts. Use exact approved chapter/stamp/seal/static-box/card bytes, with live captions and earned-only visibility. Folio backgrounds and Venezia runtime remain held for the explicit Hermes C1/C2 owner decisions; use code-native paper without claiming folio approval. Pisa hinge remains deferred. Independent Hermes exact-SHA QA and owner release GO remain separate; no merge/deploy/download replacement. See candidate evidence for execution and limitations.

## 2026-11-03 — Complete artwork integration under the current mission

Supersedes the integration record’s implementation hold on folios and Venezia: the current owner mission explicitly authorizes PR70 exports with bounded folio use and Venezia B. Use exact1086×1448 folios at <=543CSS pixels/page (testedDPR2) and the verified PR70 reconstructed contour after the real third Vespa trip. Preserve source bytes/aspect ratio. This is implementation authority, not higher-native-resolution approval, exact original-matte identity, independent artwork closure or final owner visual/release acceptance. Hermes C1/C2 technical caveats remain in the handoff for review.


## 2026-11-04 — Eén speelbare NINO 2.0-proef in bestaande PR71

De huidige eigenaaropdracht autoriseert onboarding20, doorlopende Design C-route68, volledige passport21/67-presentatie en hergebruik van PR29-pizza’s samen. Dit supersedeert eerdere scope-uitsluitingen voor die onderdelen, zonder geografische/leer-/beloningseconomiewijziging. Profiel schema1 blijft apart en optioneel in lokale opslag en backups; favoritePizza kiest nooit een verdiende smaak. Stempel/Gold/postkaart blijven canonieke projecties, demo is uitsluitend een apart expliciet te importeren bestand.

Goedgekeurde rode omslagpixels blijven exact; gekozen kleur is een persoonlijk omslagaccent. Huidige folio’s behouden native verhouding/cap en Venezia behoudt de bestaande contour, voor eigenaarbeoordeling. De grote appicoonbron uit topo-nino-app-icon-v1.zip is niet in onderzochte Git/lokale bronnen gevonden; volledige goedgekeurde Travel-cutout is tijdelijk, geen vervangende icoongoedkeuring. Echte hinge/uitgebreide Vespa uit scope. Eigenaarreview en onafhankelijke Hermes-GO blijven OPEN. Geen merge/deploy/release of bestaande-downloadvervanging.

## 2026-11-06 — NINO-oplevercontract na de speelronde

Eigenaaropdracht op PR71 supersedes de eerdere uitsluiting van de ritpresentatie, de boekkleur in onboarding en profiel, en de getimede pizzapresentatie. Ontdekkingskaart blijft zichtbaar omdat het verschil op gelijke schaal nu duidelijk is; dezelfde paden, doelen en beoordeling, alleen verf in de presentatielaag. Benchmark boek is `367b875:assets/nino/travel-passport/book/masters/passport-open-book.png`, uitsluitend als beeldreferentie omdat QA #45 die als runtime-achtergrond afwees. Stempelpagina's gebruiken de linkerfolio gespiegeld. `coverColor` blijft ongewijzigd in profielschema 1 voor back-upcompatibiliteit, zonder bediening of weergave. Momenten zijn projecties van echte voortgang: geen nieuwe opslag, en herladen of importeren speelt niets opnieuw af. De ritroute is verhalend en geen landkaart, zodat de rit geen ligging verklapt. Echte Pisa-scharnieranimatie blijft buiten scope. Eigenaaracceptatie en Hermes-review zijn OPEN.

## 2026-11-07 — UX-ronde na de speelronde van 6 november

Eigenaaropdracht op PR71. (1) De actieve hoofdtab volgt de gekozen route: lessen uit de reis horen bij **Reis**, vrije oefenvormen bij **Oefenen**. Dit supersedeert het F1-gedrag waarbij **Oefenen** een onderbroken reisles herstelde; een reisles komt nu terug via **Reis → Verder**, met dezelfde vraag, antwoordtekst en selectie. F1 voor vrije oefening blijft. (2) Een overgeslagen kennismaking wordt precies één keer opnieuw aangeboden bij de eerste reisles, met **Maak kennis met Nino** en **Start meteen**; de stand staat apart in `topo-nino-intro-v1`, niet in het profielschema of de back-up. (3) Voor deze proefversie alleen de Schoolkaart. Dit supersedeert de keuze van 6 november om de Ontdekkingskaart zichtbaar te houden. De atlascode en een opgeslagen voorkeur blijven bestaan voor een latere versie met een duidelijke leerfunctie. (4) Eén pizzameter tijdens de les, gebaseerd op de grote illustratie; de compacte lesmeter en de zijpaneelmeter zijn verborgen. (5) De derde pizzadoos zegt **Start de Vespa-rit**. Geen wijziging aan beloningsregels, geografie, leer-engines of opslagschema's. [Bewijs](qa/ux-20261107/README.md).

## 2026-11-07 — UX-ronde 2: boek, postkaarten, knoppen en goudronde

Eigenaaropdrachten op PR71.

1. **Reisboekje.** Het Reisboekje heeft geen interne scrollbalken. De compositie is aangepast, met als vangnet dat een pagina krimpt tot minimaal 0,7.
2. **Postkaarten.** De achterkant toont Nino's tekst op de bestaande illustratie en draait om binnen dezelfde kaartruimte.
3. **Ontwerppreview.** De preview is een apart bestand, opgebouwd als de app met een extra laag erbovenop. Toestanden staan alleen in het geheugen, en de ritpreview verandert geen voortgang.
4. **Knoppen.**
   - Alle knoppen hebben dezelfde hoogte (44 px voor hulpmiddelen, 48 px voor hoofdacties) en een hoekradius van 12 px.
   - Hulpmiddelen zijn crème en donkergroen; een gekozen optie wordt donkergroen. Terracotta `#b9502f` is alleen voor de hoofdactie (AA met witte tekst).
   - **Ik weet het nog niet** en **Overslaan** blijven rustig tot er geantwoord is.
   - `focus-mode.js/.css` blijven vastgepind. De ontbrekende klasse van de leerbalk wordt daarom in de NINO V2-laag gezet.
5. **Goudronde.**
   - Het label **★ Goudronde** hangt alleen af van een lopende sessie met `kind === 'gold'`. De bestaande voortgangsregel verhuist mee, zodat er geen tweede teller ontstaat.
   - Het resultaat toont één uitkomst: **Goud verdiend**, **Je goud blijft staan** (er was al goud) of **Nog geen goud**. Daarbij staat de score van de hele ronde.
   - De toetsregels en de motorteksten (`CHAPTER.GOLD*`) zijn niet gewijzigd. De titel wordt in de NINO-laag vervangen.
6. **Favicon (7 november 2026).** De door de eigenaar aangeleverde N (crème op donkergroen, 16 en 32 px) vervangt de PR65-microiconen als favicon. Alleen twee PNG-links, als data-URI ingebed; geen ICO meer. De PR65-bestanden blijven als geschiedenis. Het grote appicoon blijft ongewijzigd. Hiermee vervalt het PR65-faviconbesluit voor de offline HTML.

## 2026-11-08 — Instellingen en gewone toets

Reservekopieën en reset horen in het algemene instellingenmenu. Wis voortgang behoudt het Reisboekje-profiel. Begin helemaal opnieuw wist ook het profiel en heropent de kennismaking. De gewone toets deelt onderwerp en score als tekst, met e-mailconcept en kopieeroptie, en gebruikt bestaande Nino-illustraties en feedback. Toetsafronding kent geen nieuwe beloning toe.

## 2026-11-08 — NINO 2.0.2: Mac-launcher en toetsresultaat

- **Mac-launcher.** De Mac-app krijgt een native universal Mach-O-launcher. Het installatiescript blijft ongewijzigd en staat in `Resources/`. Een shellscript als bundle-executable vraagt op Apple Silicon om Rosetta en faalt zonder Rosetta met `-10669`.
- **Installers in de repo.** De installers worden voortaan in de repo gebouwd (`installers/`, `scripts/package-installers.mjs`). Het Windows-script blijft gepind op de hash van de meegeleverde HTML.
- **Signering.** Signering blijft ad hoc. Developer ID en notarisatie zijn een apart besluit, omdat daar een Apple Developer-account voor nodig is.
- **Toetsresultaat.** De illustratie in het toetsresultaat wordt begrensd door haar eigen vlak.

## 2026-11-09 — V3 start als presentatielaag, Reis eerst

- **Basis:** `codex/topo-v3` vanaf `f53dc0b`. V2.0.2 blijft de afgesloten release; `index.html` verandert niet tot een V3-kandidaat is goedgekeurd.
- **Bouwwijze:** V3-schermen zijn lagen in `scripts/v3/` die de canonieke staat lezen en nooit schrijven. Acties drukken de bestaande V2-knop in, zodat het gedrag dat in de klikonderschepping van NINO V2 zit (kennismaking, Reis → Verder, bevestiging) behouden blijft. Geen tweede route-, beloning- of opslaglogica.
- **Reis:** één kaart met de huidige halte en één hoofdactie, boven de vouw op alle geteste formaten; de route als verhalend slingerpad (geen landkaart, zie 2026-11-06); detail van een andere halte in de routekaart, met alleen secundaire acties.
- **Ontwerpregels:** `docs/v3/DESIGN_RULES.md`, tokens in `scripts/v3/tokens.css`, gescoped tot `.v3`. Voorstel; eigenaarsakkoord open.
- **Harness:** #74 niet overgenomen (Hermes-REWORK open). Bestaande `npm`-checks plus `scripts/qa-v3-reis.py` op de exacte HTML.
- **Status:** kandidaat ter beoordeling. Geen merge, deployment of downloadvervanging.

## 2026-11-09 — Reis v3b: conceptrichting, landthema's, reliëf

- **Richting:** de conceptrenders van de eigenaar zijn de V3-richting voor structuur en rust (zijbalk · lijst · kaart · één actie), niet voor inhoud: echte elf hoofdstukken, echte kaartgeometrie, canonieke artwork. **Supersedes** de gestapelde kaarten en het verhalende slingerpad van Reis v1 van vandaag.
- **Principe:** de letterlijke eigenaarstekst (Linear / Apple Notes; geen taglines, hulpteksten of bijlabels; UX, DX en AX tegelijk) staat bovenaan `DESIGN_SYSTEM.md` V3.
- **Kaart op Reis:** kopie van de live kaart, gelijke geometrie, zonder namen en zonder interactie; plekken van het gekozen hoofdstuk gemarkeerd. Dit is geen ritkaart en verklapt niets wat Ontdekken niet al toont; het besluit van 6 november over de verhalende rit blijft voor de Vespa-rit gelden.
- **Reliëf:** terug als schakelaar met een leerfunctie (Bergen, Vulkanen, Apennijnen, Povlakte). Schoolkaart blijft standaard en de lesvorm. Een scherper reliëf is een apart spoor met bron en groottelimiet.
- **Landthema's:** neutrale structuur voor elk land; een thema zet alleen accent en vlag. Italia standaard, Viola ter vergelijking. Keuze accent: eigenaar.
- **Ontwerpregels:** `docs/v3/DESIGN_RULES.md` is opgegaan in `docs/DESIGN_SYSTEM.md` V3 (**supersedes** de regel daarover van vanochtend). Verminderde beweging: decoratieve en overgangsbeweging uit, functionele feedback blijft.
- **Preview-HTML** gaat niet meer in Git; buildscript en checksum wel.
- **Status:** kandidaat ter beoordeling. Geen merge, deployment of downloadvervanging.


## 2026-11-09 — Eigenaar: Reis v3b akkoord, Italia, kaartkader

- **Reis v3b** is akkoord als richting; door naar de route hoofdstuk → kaartles → feedback → beloning → Reisboekje.
- **Thema:** Italia is de standaard. Viola blijft alleen als vergelijkingsthema in de preview.
- **Kaartkader:** de vervaging aan de rand mag het referentiekader niet wegnemen. De leerling moet zien wat eromheen ligt (buurlanden, zeeën, eilanden). Minder fade, ruimer kader.
- **Werkverdeling:** implementatie gaat naar Claude Code op de Mac mini (of Codex), via een overdracht in Git; dit gesprek blijft voor product- en ontwerpbesluiten.

## 2026-11-09 — Reis: kaartkader verwerkt

- **Kader:** Italië en de plekken van het hoofdstuk met 14% marge, verruimd tot de vorm van het kaartvlak binnen het kaartcanvas; herberekend bij formaatwijziging. **Supersedes** het krappe kader (6%) en de radiale rand-fade van Reis v3b.
- **Zee en rand:** de echte zeekleur van de kaart vult het vlak; alleen een smalle randfade (4%). Buiten het canvas lopen de echte landvormen door; geen nieuwe geometrie.
- **Schakelaar** Schoolkaart/Reliëf staat onderaan het kaartvlak (op zee), zodat hij geen buurland afdekt.
- **Check:** `qa-v3-reis.py` meet per formaat en stand of buurlanden, eilanden, Noord-Afrika en zeeën ≥ 80% van hun contrast houden (`mapFrameShort`).

## 2026-11-09 — Golden Experience 01, beat 3–7 als V3-laag

- **Besluit:** de les (Ontdekken → Aanwijzen → Namen schrijven → Feedback → beloning → Reisboekje) krijgt V3 als presentatielaag (`scripts/v3/les.js`, `les.css`) over de ongewijzigde V2-les. De canonieke `#quiz`, `#message`, `#next`, kaart en handlers blijven de enige les; V3 leest `state`, schrijft niets en drukt V2-knoppen. Geen tweede beoordelaar, geen nieuwe beloningsregels. Spec: `docs/v3/GE01.md`.
- **Focus Mode blijft eigenaar** van iPad en telefoon. V3-regels voor de lesbalk hangen aan `data-focus-shell` (ook bij pauze en afronding), de kaartverschuiving aan `data-focus-mode`.
- **Reis na een les** kiest het hoofdstuk van de les of het volgende, niet een eerdere rijkeuze.
- **Les:** een `:focus`-regel die de lettergrootte veranderde, liet op telefoon de tik op **Bekijk in Reisboekje** verloren gaan (knop schoof 59 px). Regel: focus verandert nooit de maat; check `bookTapLandsOnButton`.
- **Check:** `qa-v3-les.py` speelt hoofdstuk 2 met echte tikken op vijf formaten; bewijs in `docs/qa/v3-les/`.

## 2026-11-09 — GE01: eigenaarskeuzes les

- **Sheet na antwoord:** gaat vanzelf open. V3 drukt bij de overgang naar "beantwoord" eenmalig de V2-knop **Antwoord openen** als het kind de sheet had ingeklapt; geen wijziging in Focus Mode of `index.html`. Check `sheetOpensAfterAnswer`.
- **Teller** volgt de V2-wachtrij; herhaalde vragen tellen mee.
- **Les zonder hulpregels en "Samen met Nino"**; oefenmodi alleen via Oefenen.

## 2026-11-09 — Beloningen: richting B, rustig kader en rijk boek

- **Besluit eigenaar:** Beloningen volgt richting B uit het ontwerpcanvas (https://claude.ai/artifact/KyM6Dx5UmJ26cPLU4BaqmH). De V3-schil (zijbalk, tellers, typografie) blijft strak. Het Reisboekje staat als rijk middelpunt op een rustig vlak, met de bestaande folio's, stempels, goudzegels en postkaarten.
- **Principe:** rustig kader, rijke inhoud. Het renaissance-schetsboek is het materiaal van het boek, niet van de interface; lessen, kaart en toets blijven er vrij van. Nino blijft overal Nino.
- **Niet:** het boek als donker venster over de app (richting A), of stempels als vlakke tegels zonder perkament (richting C).
- **Open:** folio's in hogere resolutie (nu maximaal 543 CSS-px per pagina); Venezia-rand; idee: per land een eigen kunsttraditie voor het boek (later).
- **Status:** richting gekozen; nog te bouwen als V3-laag, na de les (GE01).

## 2026-11-09 — Renderniveau: V3 gaat naar de kwaliteit van de conceptrenders

- **Besluit eigenaar:** V3 moet het visuele niveau van de conceptrenders halen. Nieuw artwork (achtergronden, hoofdstukbeelden, Nino-portret, iconen, losse Vespa) is dat waard. **Supersedes** "geen nieuw artwork" in de opdrachten van vandaag voor Reis en Beloningen; Beloningen richting B blijft gelden.
- **Wat blijft:** echte geografie (reliëf uit gemeten data in het renderpalet, geen beeld als kaart), de echte elf hoofdstukken, geen streak, en Nino alleen vanaf de canonieke referenties.
- **Bron:** de 8 hoofdstukscènes uit #75 zijn de stijlreferentie en de eerste hoofdstukbeelden. Specificatie: `docs/v3/ARTWORK_BRIEF.md`.
- **Volgorde:** eerst één stijlbeeld met bestaand materiaal (accent Italia en Viola naast elkaar opnieuw te toetsen), dan pas artwork produceren, met QA door Hermes.

## 2026-11-09 — Stijlbeeld Reis (renderniveau, bestaand materiaal)

- **Gebouwd ter beoordeling:** het V2-panorama staat tijdelijk full-bleed achter de app (tot BG-01). Op ≥ 768 px zweeft het app-venster erboven: matglas, hoeken 24, zachte schaduw. Telefoon heeft geen achtergrond. De #75-scènes zijn de hoofdstukminiaturen, uitgesneden zonder Nino (`assets/v3/scenes/manifest.json`); ontbrekende scènes tonen het hoofdstukicoon.
- **Kaart:** het reliëf staat standaard aan (**supersedes** Schoolkaart als standaard in Reis v3b; Schoolkaart blijft één tik). Het renderpalet is een SVG-kleurfilter op het bestaande raster tot `v3/relief-z8`, met witte kustrand, kustzone en landschaduw uit kopieën van dezelfde paden. Geometrie gelijk (46/46).
- **Toegankelijkheid:** bij "Verminder transparantie" of meer contrast wordt het venster ondoorzichtig.
- **Check:** `scripts/qa-v3-stijlbeeld.py`; bewijs in `docs/qa/v3-stijlbeeld/`. Oordeel eigenaar open; geen nieuwe beelden gegenereerd.

## 2026-11-09 — Stijlbeeld akkoord; accent Italia

- **Besluit eigenaar:** de richting van het stijlbeeld is akkoord (zwevend venster boven landschap, hoofdstukbeelden, reliëf in renderpalet, één hoofdactie). Het verschil met de renders zit in het materiaal, niet in de opbouw.
- **Accent:** Italia (terracotta) blijft standaard; dit bevestigt de keuze van 9 november na de hertoetsing uit "Renderniveau". Viola blijft alleen ter vergelijking in de preview.
- **Volgorde artwork:** eerst het reliëf `v3/relief-z8` (Codex) en BG-01, daarna de drie stedenscènes (Roma, Venezia, Napoli), het Nino-portret, de iconen en VE-01. Alles met Hermes-QA volgens `docs/v3/ARTWORK_BRIEF.md`.

## 2026-11-09 — Hermes V3-01: contextnamen op de Reis-kaart blijven

- **Besluit eigenaar:** de contextnamen in de kaartkopie (zoals ITALIË, DUITSLAND, BOSNIË) blijven staan. Ze geven het referentiekader dat de leerling nodig heeft. Voorwaarde: een automatische check faalt zodra een label een van de 45 leerplek-namen toont. Leerplekken zelf blijven naamloos op Reis.
- **Artwork:** BG-01, het Nino-portret en de scène Roma hebben het akkoord van de eigenaar (`art/v3-render-assets`). De modelcheck van Hermes staat nog open; daarna inbouwen.

## 2026-11-09 — Hermes-REWORK afb32d1 verwerkt; reliëf z8 in V3

- **V3-01:** contextnamen blijven (besluit eigenaar). `qa-v3-reis.py` faalt (`labelsWithLearningName`) zodra een kaartlabel een van de 45 leerplek-namen of hun aliassen bevat, ongeacht accenten en letterafstand. Een negatieve controle bewijst dat de check vangt.
- **V3-02:** de schakelaar staat op telefoon onder de kaart (sinds `4b2c323`). `switchCoversPlace` meet per hoofdstuk en per kaartstijl of een gekozen plek wordt bedekt. Op `afb32d1` geeft dezelfde meting voor Sicilië 948 px², nu 0.
- **V3-03:** na het kiezen van een hoofdstuk op telefoon gaat de focus naar de titel (`tabindex=-1`). Focus verandert de maat niet.
- **Reliëf:** Reis gebruikt de z8-renderlagen van Codex (`v3/relief-z8` @ `2a7b0cf`, SHA256 gecontroleerd tegen de provenance) in de laagvolgorde van Codex. Buurlanden zijn gedempt, de zee loopt zachter (halve sterkte, brede kustgloed). **Supersedes** het SVG-kleurfilter op z7 uit het stijlbeeld. Alleen in de Reis-kopie: de lessen en `index.html` blijven z7. De kustdiscrepantie die Codex meldde (≤ 2,84 SVG px bij de eilanden) blijft open.

## 2026-11-09 — Renderassets ingebouwd in V3 Reis

- **Bron:** `art/v3-render-assets` @ `908b4a4`, alleen `assets/v3/render/exports/` en `manifest.json`, byte-gelijk gekopieerd (23 exports, SHA256 = manifest). Masters blijven op de art-branch. Er zijn geen beelden aangepast.
- **Gebruik:** BG-01 is de standaardachtergrond (**supersedes** het V2-panorama uit het stijlbeeld). BG-02 en BG-03 zijn alleen in de preview schakelbaar (`#…/bg02`, `/bg03`). NINO-PORTRET staat in de zijbalk (**supersedes** de `guide`-uitsnede). SCENE-ROMA, -VENEZIA en -NAPOLI vullen Steden 7–23 (**supersedes** het hoofdstukicoon als vervanger). Alle 11 hoofdstukken hebben een miniatuur in de lijst en een kop bij de titel (niet op telefoon). IC-slice en IC-vespa staan bij de tellers.
- **Beloningen:** er is een V3-scherm gebouwd (richting B noemde het nog als te bouwen). Het toont het Reisboekje (opent het V2-boek), VE-01 met de ritten, en tegels voor IC-pizza, IC-stamp, IC-gold en IC-postcard. Alle getallen leest het uit V2 en het schrijft niets. Postkaarten volgen de regel van het V2-boek.
- **Build:** elk ingebed beeld wordt tegen zijn manifest-SHA256 gecontroleerd. De preview groeit met 7,44 MB (+17%). `index.html` blijft byte-gelijk.
- **Open:** de Hermes-modelcheck, en voor meerdere assets het oordeel van de eigenaar (status in het manifest). Hermes-hertest op de pin van deze commit.

## 2026-11-09 — Artwork: visuele kwaliteit boven bestandsgrootte; Nino-kenmerken

- **Achtergronden:** BG-01, BG-02 en BG-03 blijven alle drie in de app. Visuele kwaliteit gaat voor; de groei van het bestand (+7,4 MB) lossen we technisch op: eerst meten op een echte iPad, daarna zo nodig AVIF in plaats van WebP en decoderen wanneer zichtbaar. De bronresolutie van 1586×992 (maximum van de beeldgenerator) is een vastgelegde uitzondering op de brief. Budgetten gelden in KiB.
- **Nino-model:** vast zijn gezicht, groene helm met bril, rode sjaal, blauw bovenstuk, rugzak en rode Vespa. De precieze snit van shirt of jasje mag per scène wat variëren. Uitzondering: het portret (altijd zichtbaar in de zijbalk) moet exact canoniek zijn: gesloten blauw werkshirt.
- **Gevolg voor Hermes 908b4a4:** BG-01 t/m BG-03 vallen onder de uitzondering. Roma en Napoli zijn binnen de modelregel geaccepteerd. Het portret gaat terug voor het shirt; de uitsnede (hoofd en schouders) en de lichte haarrand op donker zijn geaccepteerd.

## 2026-11-09 — Nino draagt overal hetzelfde shirt

- **Besluit eigenaar:** Nino draagt in elk beeld het gesloten blauwe werkshirt uit de canonieke referenties, dichtgeknoopt met kraag, zonder wit shirt eronder. **Supersedes** de regel van vandaag dat de snit per scène mag variëren.
- **Gevolg:** portret, scène Roma en scène Napoli gaan terug voor het shirt (Hermes 908b4a4); Venezia en de #75-scènes blijven.

## 2026-11-09 — Vernieuwde renderassets (05ab1d0) in V3

- Portret, scène Roma en scène Napoli met het gesloten blauwe werkshirt, van `art/v3-render-assets` @ `05ab1d0`. Byte-gelijk overgenomen, SHA256 volgens het manifest. **Supersedes** dezelfde drie exports van `908b4a4`. De drie achtergronden blijven (besluit 9-11).
- Preview 50.199.445 bytes (+7,42 MB t.o.v. vóór de renderassets); `index.html` blijft byte-gelijk. Klaar voor de Hermes-hertest op de pin van deze commit.

## 2026-11-09 — Akkoord Venezia, iconen en VE-01; kustafwijking reliëf geaccepteerd voor V3.0

- **Artwork:** de eigenaar keurt SCENE-VENEZIA, de iconen (pizza, pizzapunt, Vespa, goud, stempelafdruk, postkaart) en VE-01 goed; Hermes gaf al PASS (`908b4a4`). Status in `assets/v3/render/manifest.json` op `art/v3-render-assets`.
- **Kust reliëf z8:** de afwijking tussen hoogtemodel en vectorkust (≤ 2,84 SVG px, Codex `v3/relief-z8`) is voor V3.0 geaccepteerd. Leergeografie, doelen en aanwijsgebieden komen uit de ongewijzigde vectorkaart; het reliëf is beschildering binnen de kustlijn. Het hoogtemodel op de vectorkust laten passen is een apart klusje voor Codex, vóór de definitieve release.
- **Nog open:** Hermes-hertest (beelden `05ab1d0`, app op de nieuwe pin); WebKit bij Hermes; echte iPad met Safari en VoiceOver door de eigenaar.

## 2026-11-09 — Hermes GE01-K01: de toets die antwoordt, activeert geen beloningsknop

- **Bevinding (Hermes, `1a42590`):** met verminderde beweging en één Enter op het antwoord dat een pizza vol maakt, klikte dezelfde Enter op **Verder** in de net geopende pizzadialoog. Die ging meteen dicht.
- **Fix, in de V3-laag (`scripts/v3/les.js`):** zolang Enter of spatie is ingedrukt, telt een echte toetsenbordklik alleen op het element waar de toets begon. Daarna werkt elke nieuwe toets gewoon. Dit geldt voor alle beloningsmomenten (pizza, Vespa-rit, stempel, goud), met en zonder verminderde beweging. De V2-motor en `index.html` zijn ongewijzigd.
- **Regressie:** `scripts/qa-v3-toets-beloning.py` volgt de reproductie van Hermes (Enter én klik) en speelt daarna alle momenten. Op `1a42590` faalt de test, nu is hij groen. Bewijs: `docs/qa/v3-les/toets-beloning/`. Gerichte Hermes-hertest van alleen GE01 op de pin van deze commit.

## 2026-11-09 — V3.0 navigatie op alle schermen

- **Shell:** zes tabs (Reis, Oefenen, Toets, Beloningen, Voortgang, Instellingen onderaan). Zichtbaar als zijbalk op desktop, als rail van 76 px op iPad (Focus Mode, lessen) en als tabbalk onderaan onder 768 px. Onder 360 px tonen de tabs alleen iconen, met een toegankelijke naam. Spec: `docs/v3/V3_0_REST.md` § 1.
- **V2-chrome:** de V2-header, `.ninoNav`, `nav.tabs`, `#focusMenu` en `footer.backupTools` zijn onder `body.v3Shell` verborgen, niet verwijderd. Reservekopie, wissen en profiel blijven bereikbaar via Instellingen, dat het bestaande V2-dialoogvenster opent. Na sluiten gaat de focus terug naar de tab.
- **Actieve tab:** volgt de route die de leerling koos. Een routeles valt onder Reis. Vrij oefenen en het slim rondje vallen onder Oefenen. De toets valt onder Toets.
- **Oefenen:** kiest de vorm (Ontdekken, Aanwijzen, Namen schrijven, Slim rondje) en de groep (11 hoofdstukken, Alles, Mijn fouten). Start drukt de bestaande V2-knoppen in: de modus-tab, `#groupSelect` en `#smartStart`.
- **Terugkeer:** een tab buiten de les drukt V2 "Reis", dat de les bewaart. Oefenen en Toets herstellen een onderbroken oefening of toets via V2 "Oefenen". Een routeles gaat verder via Ga verder. Vraag, concept en selectie blijven gelijk.
- **Nieuwe drempels of opslag:** geen. De telefoontabbalk staat onder 768 px, de grens die Focus Mode al gebruikt; de rail staat op iPad vanaf 768 px.

## 2026-11-09 — V3.0 Schoolbladknop en toets S

- **Knoppen:** op Reis staat de knop **Schoolblad** naast Schoolkaart/Reliëf. In de leskop staat hij bij Ontdekken, Aanwijzen en Namen schrijven, zowel in routelessen als bij Oefenen; op de telefoon alleen als icoon. De V2-schoolbladknoppen zijn onder de V3-shell verborgen. De V3-knop drukt de gewone V2-opener (die naast de kaartwerkbalk), zodat het V2-venster met zoom, verschuiven, Escape en focusbeheer ongewijzigd blijft. De Reis- en dock-openers van V2 zitten binnen klikhandlers van de route-home en worden niet gebruikt.
- **Toets S:** opent het schoolblad overal, behalve in Toets (instellen, toets en resultaat) en in de Gouden proef. Daar is ook geen knop. S doet niets tijdens typen (input, textarea, select), met Ctrl/Cmd/Alt, bij herhaling of als er al een dialoog open is.
- **Focus:** na het sluiten gaat de focus terug naar het antwoordveld, met concept en selectie, als dat vóór het openen focus had. Anders gaat hij naar de V3-knop die het venster opende.
- **Tab Oefenen opnieuw tikken** tijdens een oefening gaat terug naar de Oefenen-keuze, net als de terugknop. Tijdens een lopende toets doet een tik op Toets niets, zodat een toets niet per ongeluk stopt.
- **Nieuwe drempels of opslag:** geen.

## 2026-11-09 — V3.0 Toets: motor, geen beloningen, opslag uitslagen

- **Motor:** de gewone V2-toets (`resetExam`, `next`, `grade`, `finishExam`, `#testFormat`). V3 stelt alleen in. De gekozen hoofdstukken, geschud en ingekort tot de lengte, gaan als pool naar één aanroep van `resetExam` (via `groupItems`). De vorm is `#testFormat` (Aanwijzen, Namen schrijven of Beide). Beoordelen, foutenlijst, skill-historie en dagdoel blijven bij V2.
- **Standaard bij instellen:** de afgeronde hoofdstukken (stage 3); zijn er geen, dan alle. Lengte 10, 20 of Alle; 10 en 20 staan er alleen als de pool groter is.
- **Geen beloningen:** zolang de V2-toets loopt, geeft `TopoLearning.award` "geen beloning" terug. Er komt geen pizzapunt, geen pizza, geen rit en geen ophoging van de teller `good` bij; er is geen beloningsdialoog en geen goud. Het dagdoel telt goede toetsantwoorden wel mee (V2-gedrag, ongewijzigd).
- **Resultaat:** V3 toont het in plaats van de V2-dialoog `.ninoExamResult`, die tijdens een V3-toets niet opent. Het resultaat bestaat uit:
  - de score (V2 `examCorrect` / `examTotal`) en één Nino-pose (V2 `TopoArt`: `success` bij alles goed, anders `encourage`);
  - de echte kaart met ✓/× per gevraagde plek, met de naam bij ×;
  - de foutenlijst: bij Aanwijzen alleen de plek, bij Namen schrijven de plek met het getypte antwoord, zonder antwoord "overgeslagen" (review-fix 10 november; geldt ook voor het printblad);
  - **Oefen deze fouten**, dat de bestaande V2-groep "Mijn fouten" opent;
  - Kopieer en E-mail, met dezelfde tekst als V2 maar de echte hoofdstukken als onderwerp;
  - **Print**, een A4-blad met naam, datum, score, kaart en fouten.
- **Opslag:** sleutel `topo-v3-toetsen-v1` met `{schema:1, results:[…]}`, de nieuwste eerst en maximaal 10. Per uitslag worden opgeslagen: datum, hoofdstukken, vorm, lengte, totaal, goed, en per vraag id, vorm, goed/fout en het gegeven antwoord (≤ 80 tekens). Ongeldige data telt als geen uitslagen. Dit staat los van de V2-voortgang; V3.0 kent één profiel, dus één lijst.
- **Reservekopie:** de V2-export krijgt het veld `v3Toetsen` (V2-import negeert onbekende velden, dus oude en nieuwe kopieën blijven in beide richtingen geldig). Na een geslaagde V2-import vervangt een geldige `v3Toetsen` de opgeslagen uitslagen. Een oude kopie zonder dat veld laat de uitslagen staan. **Begin helemaal opnieuw** wist de uitslagen mee.
- **Telefoon (fix bij deze test gevonden):** na het typen komen de tabbalk en het antwoordblad pas na 0,4 s terug. Daardoor valt een tik op Controleer of Overslaan nog op de knop waar hij begon.

## 2026-11-09 — V3.0 Voortgang: drempel "beheerst" en wat er staat

- **Bron:** de V2-skill-historie per plek, zoals het V2-kennis-paspoort die labelt (Vinden = aanwijzen, Naam = schrijven). V3 leest het paspoort uit en rekent niets opnieuw. Het paspoort zelf, de V2-tabel, is naar Voortgang verplaatst; de V2-samenvatting en -toelichting zijn daar verborgen.
- **Drempel:** een plek is **beheerst** als beide labels "Goed onthouden" zijn, dus streak ≥ 3 en nog niet aan de beurt voor opfrissen. Een plek is **bezig** als minstens één label niet "Nog oefenen" is. Anders staat de plek op **nog niet**. Een plek die moet worden opgefrist, telt dus als bezig en niet als beheerst.
- **Kaart:**
  - steden zijn gekleurde stippen (donkergroen, lichtgroen of grijs);
  - beheerste en bezige gebieden en zeeën krijgen een groene tint; "nog niet" houdt bij gebieden de gewone kaartkleur;
  - rivieren krijgen een groene lijn;
  - er is een legenda met aantallen.
- **Verder op het scherm:**
  - de 11 hoofdstukken met drie lesstaven, ✓ (stage 3) en ★ (goud), uit `TopoRoute.record`;
  - het dagdoel `n / 8` uit V2 `renderDailyGoal`;
  - de laatste 10 toetsuitslagen;
  - geen streak.
- **Preview:** de demo-staten krijgen een skill-historie. Afgeronde hoofdstukken staan voor beide skills op "Goed onthouden", hoofdstukken die nog bezig zijn op Aanwijzen "Op weg". Daardoor laat Voortgang in `#bezig`, `#afgerond` en `#alles` iets zien. Dit raakt alleen de preview.

## 2026-11-09 — V3.0 Kennismaking

- **Eén scène:** de V2-eerste-keerdialoog (`TopoProfile.open({firstRun:true})`) in V3-stijl. Hij bevat:
  - de welkomstpose op de scène, met de tekstballon "Ciao! Ik ben Nino." en "Hoe mag ik je noemen?";
  - het naamveld, optioneel;
  - de drie pizza's;
  - **Andiamo!** (opslaan) en **Start meteen**. Start meteen is de V2-knop Overslaan met een nieuw label; Escape doet hetzelfde.
- **Hulpteksten weg:** "(mag leeg blijven)" en "Maximaal 24 tekens." zijn verborgen. De limiet van 24 tekens blijft in V2 gelden.
- **Profielschema 1 ongewijzigd:** `{schema, name, coverColor, favoritePizza}` onder `topo-nino-profile-v1`. Het opslaan, de introductiesleutel (`done` of `skipped`) en het eenmalig opnieuw aanbieden vóór de eerste les blijven V2. Het aanbod krijgt V3-stijl en zijn hulpregel is verborgen; "Start meteen" stond er al. **Begin helemaal opnieuw** opent de kennismaking via de bestaande V2-route (wissen en herladen).
- **Daarna:** Reis met hoofdstuk 1 (Steden 1–6) geselecteerd. Start het aanbod een les, dan blijft die les staan.
- **Preview:** de demo `#welkom` is een eerste bezoek, zonder profiel en zonder introductie.
- **Fix bij deze ronde:** op 320 px werden de hoofdstuknamen in Voortgang met "…" afgekapt. Ze breken nu af over twee regels.

## 2026-11-10 — V3 basiskleur violet; visuele herziening V3.0

- **Kleur:** violet (`viola`) wordt het standaardthema van V3 (besluit eigenaar). Dit vervangt "Italia (terracotta) als standaard" van 9 november. Het land komt terug in artwork, driekleur, stempels en scènes, niet in de primaire knopkleur. Terracotta blijft hooguit als artworkkleur. De landthema's voor Frankrijk en volgende landen volgen dezelfde regel: één UI-palet, het land zit in het beeld.
- **Visuele herziening:** zie `docs/v3/DESIGN_AUDIT_V3_0.md`.
  - Eerst een conceptrender per scherm: Les, Oefenen, Toets instellen, Toets resultaat, Beloningen, Voortgang. De eigenaar keurt die goed.
  - Daarna een gedeelde visuele laag: canvas, glas, typografie, pilknop, zwevende kaart en reliëf zonder waas.
  - Daarna scherm voor scherm, met render en build naast elkaar als bewijs.
- **Fix 4 van de review vervalt** (de V2-zoombalk in de les). De les wordt opnieuw ontworpen.

## 2026-11-10 — V3.0 review-fix: ruimte voor de tabbalk op de telefoon

Review-fix 2. Op de telefoon (≤ 767 px) eindigt elk V3-scherm buiten lessen boven de vaste tabbalk: Reis, Oefenen, Toets instellen, het toetsresultaat, Voortgang en Beloningen.
- **Onderruimte:** de gemeten hoogte van de tabbalk plus 16 px. De meting gebeurt in `shell.js` (ResizeObserver, `--v3-tabbar`) en bevat de safe-area-padding van de balk. Zonder meting geldt `65px + env(safe-area-inset-bottom)`.
- **Toetsenbord:** `scroll-padding-bottom` gebruikt dezelfde waarde. Een knop die focus krijgt en achter de balk valt, scrolt vrij.
- **Lessen:** die houden de bestaande V2-padding. De lopende toets is een les.
- **Drempel in de QA:** het einde van de inhoud ligt minstens 8 px boven de balk.

## 2026-11-10 — V3.0 review-fix: label "Jouw naam" alleen voor schermlezers

Review-fix 3 (ook in `DESIGN_AUDIT_V3_0.md`: "het dubbele label weg"). In de kennismaking is "Jouw naam" niet meer zichtbaar, omdat Nino's vraag "Hoe mag ik je noemen?" het veld al draagt. Het label blijft de toegankelijke naam van het veld: de tekst staat visueel verborgen in het V2-label. Het V2-formulier en profielschema 1 blijven ongewijzigd.

## 2026-11-10 — Nino: vast portret, poses in de inhoud

- **Portret:** het portret in de zijbalk blijft op alle tabs hetzelfde (`NINO-PORTRET`); het is het vaste anker van de navigatie.
- **Poses:** Nino varieert alleen in de inhoud, waar hij iets betekent:
  - klembord bij Toets instellen;
  - duim omhoog of aanmoediging bij het toetsresultaat;
  - welkom bij de kennismaking;
  - eventueel bij lege staten.
- **Assets:** zie `docs/v3/renders/README.md` › Nieuw artwork.

## 2026-11-10 — Twee werelden: app in violet glas, Reisboekje als papierwereld (lead designer)

- **App** (alle schermen, het frame en de lessen): violet glas volgens `docs/v3/renders/README.md`. Violet primair, de inkt als tekstkleur, het artwork als kleurbron. Geen terracotta in de UI.
- **Reisboekje** (het opengeklapte boek, stempels, postkaarten, het omslag B): een papierwereld met perkament en crème, aardetinten (oker, olijf, terracotta, diepgroen), een schreeftype of handschriftaccent voor titels, en een getekende of gegraveerde stijl in de geest van Da Vinci.
- **Waarom:**
  - een kleur werkt alleen binnen haar systeem: terracotta is een accent op papier, en wordt baksteen- of waarschuwingsrood op glas;
  - het contrast maakt het boek tot een beloning: wie het opent, stapt in een warmere wereld;
  - de app blijft rustig en gericht op het leren.
- **Grens:**
  - in de appwereld gebruiken we alleen de echte objecten (het omslag, het stempel-icoon, de postkaart) als artwork;
  - in de papierwereld verschijnen geen glas en geen violet, behalve de sluitknop en de focusring, die in de app-stijl blijven omdat ze bij de bediening horen.
- **Herkomst:** de vergelijking met het eerdere concept "Vernieuwde interface" (atlas, perkament, diepgroen primair, terracotta accent). Daarvan nemen we de warmte over in het boek, niet de drukte (tagline, hulpteksten, veel blokken).

## 2026-11-10 — Idee uitstapjes (V3.1, niet in V3.0)

- **Idee van de eigenaar:** tijdens de leerroute nodigt Nino uit voor een uitstapje, bijvoorbeeld "Zin in een potje voetbal in Turijn?".
- **Vorm (lead designer):** een uitstapje is de inhoud van de **Vespa-rit**, de bestaande beloning na 3 pizza's. Er komt geen nieuw beloningssysteem. Elke rit gaat naar een stad: een scène, één weetje en een korte interactie (≤ 30 s) die stiekem leert. Bij Turijn bijvoorbeeld: "schiet de bal naar Milaan" op een mini-kaart.
- **Regels:**
  - het uitstapje onderbreekt nooit een vraag; het verschijnt alleen op een natuurlijke pauze (na een lesstap);
  - "Later" kan altijd en kost niets;
  - geen uitstapjes in Toets en Gouden proef;
  - toetsenbord, verminderde beweging en VoiceOver werken volledig;
  - het uitstapje geeft geen extra pizza's: de rit is al de beloning;
  - het eindigt als postkaart in het Reisboekje.
- **Artwork:** Nino in zijn uniform (geen clubtenue, geen tekst in beeld). De Turijn-scène (Piazza San Carlo, bal, Vespa) is de eerste kandidaat.
- **Planning:** na V3.0, eerst één prototype (Turijn) en daarna besluit de eigenaar.

## 2026-11-10 — Na TOPO Italië volgt Frankrijk

- **Richting (eigenaar):** zodra TOPO Italië af is (V3.0 en de runtime-migratie), volgt Frankrijk.
- **Gevolgen voor het ontwerp (lead designer):**
  - een **landpakket** per land: geometrie en projectie, plekken en hoofdstukken, namen en uitspraak, artwork (achtergronden, scènes, hoofdstukbeelden), uitstapjes en de inhoud van het reisboekje;
  - **app, leerlogica, beloningen, opslag en UI** zijn landonafhankelijk;
  - **één UI-palet** (violet glas); het land komt terug in het artwork, de driekleur en de stempels (DECISIONS 10-11, "Twee werelden");
  - **Nino reist mee**, in hetzelfde uniform;
  - **voortgang per land**, met één profiel;
  - het **Reisboekje** wordt een paspoort met een hoofdstuk per land.
- **Gevolg voor de architectuur:** `docs/v3/ARCHITECTUUR.md` (Codex, `arch/v3-runtime`) beschrijft de grens tussen landpakket en app, en het opslagschema per land met migratie van de bestaande Italië-saves.

## 2026-11-10 — V3.0 fase A, stap 1: canvas en glas

Uitvoering van de visuele herziening, alleen presentatie. Bronnen:
- `docs/v3/DESIGN_AUDIT_V3_0.md`;
- `docs/v3/renders/README.md`: § Ingetogenheid, § Voortgang (Landschap/Werkblad) en § Raster en uitlijning. Die gaan voor de renders.

Nieuw bestand: `scripts/v3/glas.css`, geladen na `shell.css`.
- **Thema:** viola is de standaard (tokens, `reis.js`, `les.js`, preview). Italia blijft als vergelijking beschikbaar via `#…/italia` en de previewbalk.
- **Canvas:** de ondoorzichtige plaat is weg. Het artwork (BG-01) is het canvas op desktop en iPad, ook in lessen en in de Focus Mode van de iPad. Het kaartvlak van de les is geen zeekleurige plaat meer.
- **Eén frame, op elk scherm identiek:**
  - marge 28 px (iPad 20), radius 28, een fijne glasrand;
  - in lessen tekent `body::after` hetzelfde frame;
  - de zijbalk is de linkerkolom van het frame (240 px op desktop, rail 76 op iPad), van transparant glas (wit 34%, blur).
- **Landschap** (Reis, Oefenen, Les, Toets resultaat, Beloningen): het inhoudsvlak is transparant.
  - De panelen zweven op één niveau: wit 58%, blur 24, een binnenrand van 1 px, een kleine schaduw, radius 28.
  - Goot 24 px (iPad 16); de binnenmarge is goot + 8.
  - Kaarten binnen een paneel zijn lichter en hebben geen schaduw (niet gestapeld).
  - Oefenen is zo groot als zijn inhoud.
- **Werkblad** (Voortgang, Toets instellen): één lichte plaat (92%) vult het inhoudsvlak. Het artwork blijft langs de randen en onder de zijbalk zichtbaar.
- **Wash:** `body::before`, fixed, met z-index −1: een lichte lavendelwitte gradiënt (sterker links) en `saturate(.72)` op het artwork. Hij ligt onder alle inhoud, dus nooit op de kaart.
- **Verminderde transparantie en meer contrast:** glas en plaat worden ondoorzichtig (`--v3-surface`), zonder blur.
- **Contrast-AA op glas:** `--v3-ink2` gaat van #66706d naar #525b58 en `--v3-done` van #2f9a5b naar #24804b (wit vinkje 4,9:1). Typografie, knoppen, iconen en de inkt `#2A2440` volgen in fase B.
- **Telefoon:** ongewijzigd (geen achtergrond, zoals besloten).
- **Nog niet in stap 1:** het 12-koloms raster en de gedeelde lijnen per scherm. Die horen bij de schermen in fase B.
- **QA-drempels** (`scripts/qa-v3-glas.py`, desktop en iPad liggend):
  - **frame:** identiek op alle tabs (±1 px) en gelijk aan de marge;
  - **Landschap:** achtergrond zichtbaar op ≥ 30% en geen dekkend paneel (alfa ≥ 0,9) breder dan 70%. Een meetpunt telt mee als er geen kaart, beeld of dekkende laag boven ligt; glas met een gestapelde alfa ≤ 0,75 telt als zichtbaar;
  - **Werkblad:** artwork zichtbaar op ≥ 12%;
  - **contrast AA:** per tekst tegen de werkelijk gerenderde pixels.
- **Bekende uitzondering:** met verminderde transparantie is de stappenbalk van de les ondoorzichtig en breder dan 70%. De QA rapporteert het, zonder af te keuren.

## 2026-11-10 — V3.0 fase A, stap 2: kaart

- **Oorzaak van de waas (gemeten in de DOM, Reis-reliëf, desktop).** Gemeten is de verzadiging van de hele kaart en van de randband van 24 px. Het reliëf zelf staat op opacity 1 zonder filter. De waas kwam uit vier lagen erboven:
  1. `.v3RSea` stond op halve sterkte boven de lichte V2-zee `#dcedf4`. Zonder die halve sterkte stijgt de verzadiging van 0,324 naar 0,451; dit is de grootste bron.
  2. Over de buurlanden (`.contextLand`, `.country`) lag een crèmekleurige sluier (`#f6f2e8`, fill-opacity 0,42). Zonder sluier: 0,380.
  3. Het randmasker (`--v3-edge`, een vervaging van 4%) gaf de melkrand. In de randband stijgt de verzadiging van 0,204 naar 0,294.
  4. `.v3CoastGlow` was een witte streek van 26 breed met blur op 0,55. Die maakte de kust zacht.
- **Weg:** alle vier. Het reliëf staat op volle kracht: zee op volle sterkte, buurlanden ongedempt, geen kustgloed, dus een scherpe kust.
  - **Supersedes:** de smalle randfade (9-11, "Reis: kaartkader verwerkt") en het dempen van de buurlanden en de zachte zee (z8-besluit).
- **Zweven:** de kaart heeft geen kader. Ze krijgt radius 28 en een zachte slagschaduw: op Reis `.v3Map`, in de les het kaartvlak (desktop) of `#map` (Focus Mode).
- **Schoolkaart: buurlanden altijd in landkleur.** Er waren twee oorzaken.
  1. De focus van Reis dimde elk element dat geen hit was naar opacity 0,28. Ook leerlanden als FRA, CHE, AUT, SVN en HRV (`.country`) werden zo dun dat de zee erdoor scheen. Nu blijven `.country`-elementen op 1; alleen plekken dimmen.
  2. `fit()` klemt de viewBox aan het canvas (890×1235). Was het element breder, dan toonde het ruimte buiten de getekende data, en die werd zeekleur. Daar ontbreken buurlanden in de data: Kosovo, Bulgarije (een leeg pad) en Oekraïne.
  - **Fix:** het element neemt de verhouding van de viewBox aan. De geometrie is onveranderd; de geometriecheck blijft 46/46. De datagaten (Kosovo, BGR) zijn niet getekend en zijn nu ook niet meer zichtbaar.
- **QA (`qa-v3-glas.py`):** twee nieuwe checks.
  - *Randwaas:* geen CSS-masker, opacity ≥ 0,85, en binnen 24 px van de rand niets anders dan de kaart of haar knoppen. De afgeronde hoeken tellen niet mee.
  - *Schoolkaart:* geen letterbox, en geen land met een effectieve dekking < 0,9. Gemeten op Reis Schoolkaart, Reis Reliëf en Les.
  - `qa-v3-reis.py` meet het referentiekader nu zonder fade-marge.

## 2026-11-10 — Review fase A; besluiten uit de Codex-overdracht (lead designer)

- **Fase A akkoord.**
  - Wel goed: frame, glas, viola, het artwork zichtbaar, het reliëf zonder waas, buurlanden in landkleur.
  - Nog niet: het raster, de typografie en de bediening (fase B).
- **Kaart op Landschap-schermen (Reis, Oefenen, Toets resultaat):** de kaart is nu een rechthoek met een zeevlak. Het doelbeeld toont Italië als vrij zwevend land. Fase B levert voor Reis twee varianten naast het doelbeeld:
  - (a) **Eiland:** Italië met de eilanden; de buurlanden alleen als zachte, onverzadigde landsilhouetten (geen waas en geen harde snijlijn); de zee transparant op de wash;
  - (b) **Kaart:** de huidige kaart, maar de rechthoek afgerond tot een glaskaart die past in het raster.
  De eigenaar kiest. In de Les blijft de volledige schoolkaart met zeeën staan, want plekken aanwijzen en het hoofdstuk Zeeën hebben dat referentiekader nodig.
- **Defect (Codex, karakterisering):** een geannuleerde import vervangt toch de toetsuitslagen, omdat `toets.js` de tekst van `#backupStatus` als bewijs leest. Fix: alleen vervangen bij een echte, geslaagde import. De karakteriseringstest verwacht dan behoud bij annuleren.
- **Resetbeleid:** "Wis voortgang" wist ook de toetsuitslagen, want die gaan over de gewiste voortgang. Het profiel en de intro blijven staan. "Begin helemaal opnieuw" blijft ongewijzigd (alles weg).

## 2026-11-10 — Fix: toetsuitslagen bij import en bij Wis voortgang

- **Import.** `toets.js` leest `#backupStatus` niet meer. De uitslagen uit een kopie vervangen de opgeslagen uitslagen alleen als V2 de voortgang echt heeft opgeslagen. Het bewijs daarvoor is dat `TopoProfile.commitImport` in deze import zonder fout terugkwam; V3 kijkt alleen mee, V2 blijft ongewijzigd. Bij een geannuleerde of ongeldige import blijven de uitslagen staan.
- **Wis voortgang** (`#resetAll`). Na de bevestiging in V2 is ook `topo-v3-toetsen-v1` weg. Het profiel en de intro blijven staan; bij annuleren verandert er niets. "Begin helemaal opnieuw" is ongewijzigd.
- **Test:** `qa-v3-toets.py` dekt beide gevallen.
  - Import: annuleren terwijl de status nog "teruggezet" meldt; daarnaast een ongeldige kopie.
  - Wis voortgang: annuleren en bevestigen.
  - Op de oude code faalt de test op beide punten.
- **Karakteriseringstest op `arch/v3-runtime`:** de test "observed quirk" (`exam-storage.test.mjs`) legt het oude defect vast. Bij samenvoegen moet hij behoud bij annuleren verwachten. Deze branch raakt hem niet aan.

## 2026-11-10 — V3.0 fase B, stap 1: de gedeelde visuele laag

Bron: `docs/v3/renders/README.md` (Gedeelde stijl, Ingetogenheid, IJkpunt `R-oefenen-ijk`, Verfijning). Bij een conflict gaan de regels van Ingetogenheid en Verfijning voor de renders. Alleen presentatie; gedrag en logica blijven gelijk. Bestanden: `scripts/v3/stijl.css` (na `glas.css`) en `scripts/v3/iconen.js`.

- **Letter:** één ronde schreefloze letter.
  - Waar het systeem SF Pro Rounded heeft (Safari op Apple, via `ui-rounded`), is dat de letter.
  - Elders is het een **ingebedde ronde fallback "Topo Rounded"**: Nunito (OFL), Latijns subset, variabel gewicht, 33 KB woff2. Het bestand staat in `assets/v3/font/` met manifest en SHA256; de previewbuild controleert de SHA256 en bedt het in.
  - Waarom: Chrome kent `ui-rounded` niet, en op Chromebooks ontbreekt SF.
- **Gewichten en maten:**
  - de schermtitel op 700 en ±35 px;
  - rijen en labels op 500, 15–17 px;
  - actief of geselecteerd op 600;
  - geen hoofdletters als nadruk (het kopje "HOOFDSTUK 2" wordt "Hoofdstuk 2", in secundaire inkt).
- **Inkt:**
  - de tekst is `#2A2440`;
  - secundaire tekst is `#5E5872` (±62% van de inkt, licht donkerder voor AA op glas);
  - een derde, stille inkt `#8B879A`, alleen voor iconen (bijvoorbeeld het slotje).
  - De lijniconen staan in secundaire inkt.
- **Violet alleen voor betekenis:** de primaire actie, de actieve nav, selectie en voortgang. Geen violette labels of lopende tekst.
- **Knoppen:**
  - **primair:** een violette pil met verloop en een stille pijl rechts, zonder glow;
  - **secundair:** een witte glaspil met een binnenrand van 1 px;
  - **selectie** (chips, vormtegels, rijen, nav): een lavendel vulling met een violette rand en violette tekst op 600;
  - **hover:** maakt alleen stille knoppen lichter, nooit de selectie of de primaire knop.
- **Iconen:** één set dunne lijniconen (32×32, streek 1,7, in de stijl van SF Symbols), toegevoegd aan de bestaande V2-sprite.
  - **Nav (vast):** Reis = kaart, Oefenen = baret, Toets = klembord, Beloningen = beker, Voortgang = staafjes, Instellingen = tandwiel.
  - **Vormen:** Ontdekken = verrekijker, Aanwijzen = vizier, Namen schrijven = potlood, Slim rondje = shuffle.
  - **Status en acties:** vinkje, medaille, slot, pizzapunt, scooter, opnieuw, pijl, play.
  - Illustraties blijven inhoud; ze komen niet in knoppen.
- **Zijbalk:**
  - het woordmerk TOPO in inkt (700) met de driekleur;
  - het portret is kleiner: 112 px op desktop;
  - de nav in inkt, het actieve item als lavendel pil;
  - onderaan alleen een tandwiel, onder een dunne lijn.
  - Het portret van 88 px op iPad komt met de gelabelde iPad-zijbalk in stap 2.
- **Lessen:** de lesvorm-pil en de kaartknoppen nemen dezelfde pillen, inkt en gewichten over. Bij lessen onder 1280 px blijft de rail van 76 px.
- **Nog niet in deze stap:**
  - het 12-koloms raster en de schermen volgens de renders (vanaf stap 2, Reis eerst);
  - ★ en ↻ in labels; die gaan per scherm mee.

## 2026-11-10 — V3.0 fase B, stap 2: Reis volgens `R-reis-ijk`, twee kaartvarianten

Bron: `docs/v3/renders/README.md` (Reis, Raster en uitlijning, Verfijning) en de review van fase A (twee kaartvarianten). Alleen presentatie: elke actie drukt nog steeds de bestaande V2-knop, en de geometrie is ongewijzigd (46/46). Bestand: `scripts/v3/reis-ijk.css`, na `stijl.css`.

- **Raster (≥ 768 px):**
  - het inhoudsvlak heeft 12 kolommen, met een goot van 24 (iPad 16) en een binnenmarge van goot + 8;
  - de titel "Reis" en de lijst beslaan 5 kolommen, de kaartkolom 7;
  - **gedeelde lijnen:** de bovenkant van de titel = de bovenkant van de eerste rij in de kaartkolom; de onderkant van de lijst = de onderkant van de hoofdstukkaart = de binnenmarge.
- **Eén titel:** de schermtitel "Reis" is een `h1`. Het kopje "Hoofdstukken" is alleen nog voor schermlezers. De hoofdstuktitel in de kaart is een `h2` (`#v3Title`; de focus op de telefoon blijft daar).
- **Rijen:**
  - een rij toont de scène, de naam en de status;
  - **afgerond:** alleen een vinkje; **goud:** een medaille; **bezig:** een dunne balk onder de naam; **op slot:** alleen een slotje;
  - de nummers vervallen;
  - de gekozen rij heeft de selectiestijl.
- **Kaartkolom:**
  - bovenaan links de kaartknoppen (Schoolblad, Schoolkaart/Reliëf), naast de kaart en nooit erop; rechts de tellers met lijniconen (pizzapunt, scooter);
  - de stappenbalk van 11 hoofdstukken en "1 / 11" vervallen hier; die informatie staat in Voortgang;
  - de kaart heeft een eigen rij, dus pins vallen nooit onder de hoofdstukkaart.
- **Hoofdstukkaart:**
  - de titel, drie stapstippen (klaar: violet met vinkje; nu: een ring; later: leeg) en één pil met pijl;
  - eronder stil de herhalingen (opnieuw-icoon + les);
  - de scènekop vervalt, want de rijen dragen de scènes;
  - ★ en ↻ in labels zijn lijniconen geworden (medaille, opnieuw).
- **Pins:** de steden van het gekozen hoofdstuk zijn violette pins op de kaart, op een vaste schermgrootte. Ze zijn decoratie bovenop de kloon; het treffervlak van de stad blijft eronder.
- **Variant (a) Eiland** (standaard tot de eigenaar kiest):
  - Italië en de eilanden van het hoofdstuk Eilanden (Sicilië en Sardinië, `.country`-items) zweven als land met een zachte slagschaduw;
  - het reliëf is op hun omtrek geclipt;
  - de zee is transparant op de wash, zonder zeelaag en zonder landschaduw;
  - de buurlanden zijn zachte, onverzadigde silhouetten (lavendelgrijs, 55%). Ze vervagen met een radiaal masker dat binnen de getekende data naar nul loopt, dus er is geen harde snijlijn en geen waas op Italië;
  - de kaart is strak gekaderd (4%) en vult haar rij.
- **Variant (b) Kaart:** de kaart van fase A in een afgeronde glaskaart (radius 28) die haar rasterrij vult; de kaart zelf heeft radius 20. Preview: `#…/kaart`.
- **Zijbalk:**
  - op iPad liggend (1024–1279) is de zijbalk gelabeld, 200 px breed, met een portret van 88 px (Verfijning);
  - op iPad staand blijft de rail van 76 px;
  - in lessen blijft de rail van 76 px onder 1280, zodat de kaart de ruimte krijgt.
- **QA (`scripts/qa-v3-faseb.py`):**
  - raster en gedeelde lijnen (±1 px);
  - één display-tekst;
  - portretmaat en status per rij;
  - pins binnen de kaartrij;
  - lijniconen bij de tellers;
  - variant (a): geen zeekleur, buurlanden als vervaagde silhouetten, het reliëf op Italië geclipt;
  - variant (b): de glaskaart;
  - geen violette tekst buiten de betekenis.
  - Vergelijkingen naast `R-reis-ijk`: `docs/qa/v3-stijlbeeld/reis-ijk-{eiland,kaart}-{desktop,ipad-liggend}.jpg`.
  - **Bestaande checks bijgesteld:** `qa-v3-stijlbeeld` (lijst- en kaartpanelen, geen kop, lijniconen bij de tellers, zee- en schaduwlaag uit in variant (a)) en `qa-v3-reis`/`qa-v3-kennismaking` (de titel is `#v3Title`).
- **Open voor de eigenaar:** de keuze tussen (a) en (b). Bij Les blijft de volledige schoolkaart met zeeën staan (besluit 10-11).

## 2026-11-10 — V3.0 fase B, stap 3: Oefenen volgens R-oefenen-ijk

Oefenen volgt nu het ijkpunt `R-oefenen-ijk`, binnen het frame en het raster van Reis. Het gedrag is ongewijzigd: dezelfde vormen, dezelfde groepen en hetzelfde startpad naar V2.

**Opbouw:**
- één glaspaneel met de titel "Oefenen" (het enige display-element), vier vormtegels (lijnicoon en label), een dunne lijn, de groepen als chips in drie kolommen en de pil Start (open play-icoon en pijl, over de volle breedte);
- de kopjes "Vorm" en "Groep" zijn alleen nog voor schermlezers;
- rechts de kaart als het enige luide element, met alleen de gekozen groep: steden als violette pins, andere groepen als vlakken; bij Alles en Slim rondje geen markering.

**Raster:** het paneel begint op de binnenmarge en eindigt op de eerste kolomlijn na de langste chip, zodat de namen altijd voluit op één regel staan ("de breedte volgt de langste chip"). Dat zijn minimaal 5 en maximaal 8 van de 12 kolommen: op desktop 6, op iPad liggend 8. De kaart vult de rest tot de binnenmarge. De bovenkant van het paneel en die van de kaart liggen op één lijn. De breedte wordt gemeten met de groepen zichtbaar, zodat het paneel niet verspringt bij Slim rondje. Op iPad staand staat de kaart onder het paneel, op de telefoon ook, met de chips in twee kolommen.

**Kaart:** dezelfde variant als Reis, dus (a) Eiland als standaard en (b) Kaart via `#…/kaart`. De keuze van de eigenaar geldt dus voor beide schermen. Elke kloon heeft een eigen clip en vervaging (`v3m-` Reis, `v3o-` Oefenen); de CSS leest ze uit `--v3-isle-clip` en `--v3-isle-fade`.

**Afwijking van de render:** het boek-icoon voor Ontdekken is volgens de ijkpuntregel de verrekijker.

**QA-bijstelling:** in `qa-v3-shell.py` telt een kaartkloon (svg) bij de tabbalkcheck als één element. Zijn paden mogen buiten het eigen vak lopen; op de telefoon wordt de Oefenen-kaart daar afgekapt.

**Bewijs:** `scripts/qa-v3-faseb-oefenen.py` (24 runs, groen) en de vergelijkingen `docs/qa/v3-stijlbeeld/oefenen-ijk-{eiland,kaart}-{desktop,ipad-liggend}.jpg`.

## 2026-11-10 — V3.0 fase B, stap 4: Les volgens R-les

De les volgt nu de opbouw van `R-les`, met de stijl van `R-oefenen-ijk` en de Verfijning. De V2-les blijft ongewijzigd: `#quiz`, `#map`, hun knoppen, handlers en Focus Mode. V3 voegt alleen twee wrappers toe in zijn eigen lesbalk en zet iconen in zijn eigen stapmarkeringen.

**Stappenbalk (desktop):**
- twee glaspillen op één lijn: links de les (titel en de stappen als één gesegmenteerde pil), rechts Schoolblad en de teller;
- elke stap heeft een lijnicoon in plaats van een cijfer of ✓: een vinkje bij klaar, anders het vormicoon (verrekijker, vizier, potlood);
- in Focus Mode (iPad, telefoon) lossen de wrappers op (`display:contents`), zodat de bestaande ene rij blijft; alleen de iconen zijn ook daar nieuw.

**Vraagpaneel (desktop):**
- de vraag is het enige display-element;
- "Ik weet het nog niet", "Toon antwoord" en "Oefen fouten" zijn secundaire pillen over de volle breedte, met een lijnicoon (vraagteken, oog, opnieuw);
- de hoofdactie is de primaire pil met verloop;
- door V2 verborgen knoppen blijven verborgen, en in een toets blijven de hints weg (`shell.css`);
- de pizzameter is compact, met de stand ("6 van 8") als het getal dat leest. De tekst eromheen blijft staan, want die is inhoud.

**Kaart (desktop):**
- de zoomgroep (− + 100%) staat in de hoek rechtsonder van de kaart, Heel Italië en Zoom op hoofdstuk linksboven;
- de kaart krijgt daardoor de hele kolomhoogte, en de bovenkant ligt op één lijn met het vraagpaneel;
- de schoolkaart met buurlanden in landkleur bleef zoals hij was.

**Niet overgenomen:** de render toont alleen − en +. De knoppen 100%, Heel Italië en Zoom op hoofdstuk zijn bestaand gedrag en blijven staan.

**Bewijs:** `scripts/qa-v3-faseb-les.py` en `docs/qa/v3-stijlbeeld/les-ijk-{desktop,ipad-liggend}.jpg`. De lesflow zelf blijft gedekt door `qa-v3-les.py`.

## 2026-11-10 — Fix: Toets instellen toont de hoofdstukkeuze meteen

Gevonden bij fase B, stap 5. Het fout zat er al in sinds V3.0 deel 3.

**Wat er misging:** een tik op een hoofdstukchip in Toets instellen veranderde de keuze wel, maar het scherm toonde die pas na een volgende tik op Vorm of Lengte. Ook de lengtechips, die van de pool afhangen, liepen daardoor achter. Het startpad en de toets zelf waren in orde: die lazen de keuze correct.

**Fix:** de hoofdstukkeuze rendert nu direct, net als Vorm en Lengte. Er is geen andere wijziging.

**Test:** `qa-v3-toets.py` kiest een extra hoofdstuk, controleert dat het direct gekozen is en zet het weer uit. Op de oude code faalt die check (desktop en iPad).

## 2026-11-10 — V3.0 fase B, stap 5: Toets instellen en Toets resultaat

Beide schermen volgen hun render, met de regels van Ingetogenheid, Raster en Verfijning. De toets zelf is ongewijzigd: pool, vorm, lengte, beoordeling, opslag en reservekopie. De uitslag-DOM die `qa-v3-toets.py` leest, is ook gelijk gebleven.

**Toets instellen (`R-toets-instellen`), Werkblad:**
- het instelblok staat op de lichte plaat en neemt 6 van de 12 kolommen (iPad liggend 7);
- de titel "Toets" is het enige display-element;
- drie groepen met een klein label en een dunne lijn ertussen, zonder kaarten in kaarten:
  - alle 11 hoofdstukken en Alles als chips in drie kolommen, voluit op één regel; een gekozen chip krijgt een vinkje;
  - de vorm als drie tegels met lijniconen (Beide toont vizier en potlood);
  - de lengte als chips, zonder radiorondjes;
- de pil Start toets met het play-icoon, over de volle breedte;
- rechts Nino als decoratie. Dat is tijdelijk de bestaande V2-pose "guide"; NINO-KLEMBORD volgt via de artworkpijplijn.

**Toets resultaat (`R-toets-resultaat`), Landschap:**
- de score in een glaskaart, als het enige display-element;
- daaronder de kaart als het luide element, in dezelfde variant als Reis, met reliëf, de ✓/×-markeringen en de namen bij fouten. De andere plekken treden terug;
- rechts één glaspaneel met de fouten (× via CSS, zodat de lijst-DOM gelijk blijft), de primaire pil Oefen deze fouten met icoon, en Nieuwe toets, Kopieer, E-mail en Print als tegels met lijnicoon. Zonder fouten is Nieuwe toets de primaire pil;
- Nino staat onder het paneel in de rechterkolom;
- op het raster: score en kaart op 7 kolommen, het paneel op 5, met de bovenkanten op één lijn.

**Variant (a) Eiland, bijgesteld op alle schermen:**
- de buurlanden waren halftransparante losse vormen. Waar die overlapten, ontstonden naden, en het standaard SVG-maskervlak sneed ze in een rechte lijn af;
- nu tekent een kopie van hun omtrekken in één groep met één dekking (0,55). De originelen tekenen in variant (a) niets meer, behalve gekozen landen, die data zijn;
- de vervaging en het maskervlak zijn het hele zichtbare kaartvak, zodat de vervaging precies daar nul wordt;
- de QA (`qa-v3-faseb.py`, `qa-v3-glas.py`) meet nu die groep, en dat de originelen niets meer tekenen.

**Bewijs:** `scripts/qa-v3-faseb-toets.py` en de vergelijkingen `docs/qa/v3-stijlbeeld/toets-instellen-{desktop,ipad-liggend}.jpg` en `toets-resultaat-{eiland,kaart}-*.jpg`.

## 2026-11-10 — V3.0 fase B, stap 6: Beloningen

**Beloningen (`R-beloningen`), Landschap, op het raster van 12 kolommen:**
- de titel "Beloningen" staat op het canvas als het enige display-element, zonder decoratieve streepjes;
- het Reisboekje staat groot en vrij op het landschap (kolom 1–5), zonder kaart eromheen, met het omslag als knop en de pil Open Reisboekje. Het omslag blijft het goedgekeurde omslag B (besluit eigenaar 10-11);
- rechts staat één glaspaneel (kolom 6–12), op één bovenlijn met het boek:
  - bovenaan de drie pizza's van de huidige rit, volgens de data (3 per rit, de V2-volgorde margherita, salami, quattro formaggi). Verdiende pizza's zijn heel, de huidige toont zijn punten boven een vage hele pizza, de rest is vaag. De pizza's komen uit de bestaande V2-sprite van 0–8 punten;
  - een haarlijn;
  - de Vespa naast het aantal ritten en een meter van drie brede segmenten;
- daaronder vier gelijke glastegels over de volle breedte: icoon, label en een getal op 700 (28 px);
- iPad staand: boek, paneel en tegels onder elkaar, de tegels in twee kolommen, met een eigen scroll. Telefoon: hetzelfde, ook met het boek vrij;
- de pizza's zijn decoratie (`aria-hidden`); het label van de rit noemt het aantal al. Logica en tellingen blijven gelijk.

**QA met glas zoals ontworpen:** deze Mac staat op "verminderde transparantie". Headless Chrome neemt dat over, en dan maakt `glas.css` de panelen terecht dicht. `qa-v3-glas.py` en `qa-v3-stijlbeeld.py` emuleren daarom al `no-preference`. `qa-v3-faseb-beloningen.py` doet dat nu ook, en controleert dat de panelen echt glas zijn (backdrop-filter).

**Bewijs:** `scripts/qa-v3-faseb-beloningen.py` en de vergelijkingen `docs/qa/v3-stijlbeeld/beloningen-ijk-{desktop,ipad-liggend}.jpg`.

## 2026-11-10 — QA fase B: vergelijkingen met het glas zoals ontworpen

Gevonden bij fase B, stap 6. Deze Mac staat op "verminderde transparantie", en headless Chrome neemt dat over. De screenshots en vergelijkingen van stap 2–5 toonden daardoor dichte panelen: de terechte variant uit `glas.css`, maar niet het ontwerp. `qa-v3-faseb.py`, `-oefenen`, `-les` en `-toets` emuleren nu `prefers-reduced-transparency: no-preference`, net als `qa-v3-glas.py`, `qa-v3-stijlbeeld.py` en `-beloningen`. De dichte variant blijft gedekt door `qa-v3-glas.py`. De checks zelf zijn ongewijzigd en groen; het bewijs van stap 2–5 is opnieuw gemaakt.

## 2026-11-10 — V3.0 fase B, stap 7: Voortgang

Volgens de bijstelling van de eigenaar (renders/README § Voortgang, bijstelling): een mix van `R-voortgang-doel` (raster, lucht, kaartkaart, rustige inkt) en `R-voortgang` (levendigheid). Werkblad, op het raster van 12 kolommen.

**Indeling:**
- **titelbalk:** "Voortgang" en "n / 45" groot op één lijn, in inkt (niet violet), met een brede, dikke balk;
- **kaartkaart (kolom 1–7):** een witte kaart met het onderschrift "Italië · 45 plekken" en de legenda links, de schoolkaart rechts;
  - de 45 plekken in verzadigde beheersingskleuren: diep violet (beheerst), lavendel (bezig), crème (nog niet), met een witte rand en grotere stippen;
  - de grote vlakken (buurlanden, zeeën) als een lichte, dekkende tint met een gekleurde rand. Volle kleur liet de kaart overspoelen. Nog niet begonnen houdt de eigen kaartkleur, dus buurlanden blijven landkleur;
- **hoofdstukken (kolom 8–12):** alle 11 rijen met de echte hoofdstukfoto, "n. naam", één dikke ronde balk (de drie lessegmenten aaneen) en een status-illustratie:
  - de gouden lauwerkrans (IC-gold) voor goud;
  - het groene vinkje voor klaar;
  - de pizzapunt (IC-slice) voor open;
  - het slotje voor nog dicht.

  De kaart heeft een eigen scroll en staat op één boven- en onderlijn met de kaartkaart;
- **daaronder:**
  - Dagdoel (lijnicoon, n / 8, een rij van 8 stippen) op 6 kolommen;
  - Pizza's (n / 3, met stippen) en Vespa-ritten op 3 kolommen elk, uit dezelfde V2-state als Beloningen;
  - dan Toetsen en het Kennis-paspoort.
- **niet:** groet, offline-badge, streak, decoratieve streepjes, violette display-tekst.

De data blijft gelijk: plekken uit het V2-paspoort, hoofdstukken uit `TopoRoute`, het dagdoel uit V2.

**QA bijgesteld:**
- `qa-v3-voortgang.py` leest de status per rij (`data-status`) in plaats van de ✓/★-tekst, en controleert ook `TopoRoute.unlocked`, de foto en de illustratie;
- `qa-v3-glas.py` meet geen contrast meer voor tekst die een scrollend of afkappend vak afsnijdt. Die tekst is niet te zien; de rand van de eigen scroll van de hoofdstukkaart en van de plaat gaf schijnfouten.

**Bewijs:** `scripts/qa-v3-faseb-voortgang.py` en de vergelijkingen `docs/qa/v3-stijlbeeld/voortgang-ijk-{desktop,ipad-liggend}.jpg`.


## 2026-11-10 — Master-assets van `art/master` in V3 (lead designer)

- **Bron:** `art/master` (`c3bce12`), uit een parallelle chat. Gemaakt met `docs/ASSET_BRIEF.md` op die branch, en gebaseerd op de oude `main` (`7e38160`).
- **Oordeel:** de set is consistent onderling en met de V3-renderstijl (Nino, helm met bril, rode sjaal, blauw shirt, tas, rode Vespa). **Gebruiken in V3.**
- **Toewijzing:**

  | Asset | V3-gebruik |
  | --- | --- |
  | `nino-welkom` | Kennismaking (welkom) |
  | `nino-schrijft` | Toets instellen (in plaats van NINO-KLEMBORD) |
  | `vespa-rijdend` / `vespa-bagage` | Toets resultaat: **NINO-ONDERWEG** ("op weg naar de volgende bestemming"); `vespa-bagage` bij een afgerond hoofdstuk of land |
  | `nino-aanmoediging` | Toets resultaat bij veel fouten, als alternatief voor ONDERWEG |
  | `nino-juicht` | Toets resultaat 10/10; hoofdstuk afgerond |
  | `nino-gold` | Gouden proef gehaald |
  | `nino-paspoort` | Voortgang (lege staat); Reisboekje |
  | `nino-denkt`, `nino-wijst`, `nino-wijst-rechts` | Les: hint, Toon antwoord, lege staten |
  | `vespa-zij`, `vespa-icoon` | reserve; IC-vespa (goedgekeurd) blijft het teller-icoon |

- **Resolutie:** de WebP's zijn 600 px hoog (poses) en 800 px breed (Vespa). Dat is genoeg tot ±300 CSS-px. Voor het toetsresultaat en de kennismaking zijn de bron-PNG's nodig, met ≥ 1200 px hoog (2× voor iPad); die staan niet in Git. De eigenaar levert ze aan, of de 600 px-versie wordt daar kleiner getoond.
- **Branchhygiëne:** `art/master` wordt **niet** gemerged, want de basis is oud en DECISIONS en docs zouden botsen. De assets gaan via de V3-artworkpijplijn (`art/v3-render-assets`: masters, WebP, `manifest.json` met SHA256 en status, Hermes-QA). Claude Code integreert daarna.
- **Afstemming met de `art/master`-briefing:**
  - **3a/3b paspoort (teal omslag):** niet in V3.0; daar is het Reisboekje met omslag B het boek. De beelden bestaan al (masters `paspoort-cover`, `paspoort-binnen`). Bij het landpakket (Frankrijk) kijken we opnieuw: wordt het teal paspoort het overkoepelende boek met een stempel per land, en blijft elk Reisboekje van het land? Beslissing van de eigenaar.
  - **6 Hero Frankrijk:** zonder tekst in beeld; het bord blijft leeg (regel: geen tekst in artwork).
  - **Uniform:** het blauwe shirt dicht geknoopt, zoals in deze poses. Korte of opgerolde mouwen mogen; het portret blijft leidend.
  - **Bakkerijbeloningen Frankrijk:** past in het landpakket als landeigen beloningsartwork. De regel (8 punten, 3 per rit) blijft in de kern.

- **Masters ontvangen** (`art/master` `339c420`, `assets/art/masters/universal/`): Nino-poses 1024×1536 en Vespa's 1536×1024 (icoon 1254²), RGBA met echte alfa en schone uitsnede. Genoeg voor het toetsresultaat en de kennismaking (tot ±600 CSS-px hoog op 2×). De grens van 300 CSS-px vervalt.

## 2026-11-10 — V3.0 afwerking na fase B, stap 1: wash, glas en typeschaal

Volgens renders/README § "Afwerking na fase B". Waar die waarden botsen met "Verfijning" of "Ingetogenheid", gaan ze voor. Alleen presentatie; nieuw bestand `scripts/v3/afwerking.css`, geladen na `voortgang-ijk.css`.

- **Wash:** verzadiging .95 over het hele artwork. De lavendel gradiënt (35%) staat alleen achter de zijbalk en loopt over 64 px uit. De randen blijven helder.
- **Glas:** wit **72%** met `blur(28px) saturate(1.4)`, een binnenrand van 1 px (wit 70%) en schaduw `0 12px 32px rgba(42,36,64,.12)`; de zijbalk wit 55%. De opdracht noemde 80%. De README (laatste commit `e2da37f`) zegt 72%, en 80% alleen voor een paneel dat AA niet haalt. Geen enkel paneel faalt, dus het blijft 72%.
- **Typeschaal:**
  - nav 16/500, actief 600;
  - rijen en labels 15/600 in inkt `#2A2440`;
  - secundair 13/500 in inkt 62%;
  - schermtitel 34/700, kaarttitel 28/700;
  - kerncijfers 32–44/700;
  - niets onder 13 px (≥ 768).
- **Tellers op Reis:** een glaspil. Op BG-03 haalde de "0" van de Vespa-teller AA niet tegen het artwork.
- **ninoMeter in de Les:** minimaal 13 px.

**QA:**
- nieuw `scripts/qa-v3-afwerking.py`: alle schermen op desktop en iPad (liggend en staand), Landschap op BG-01/02/03. Het controleert tekst ≥ 13 px, AA tegen het artwork en geen horizontale overloop;
- `qa-v3-faseb-beloningen.py` en `qa-v3-faseb-voortgang.py` tellen kerncijfers niet langer als display-tekst.

**Open:** de tablabels op de telefoon blijven 11 px. Zes tabs passen niet op 13 px; de regel geldt vanaf 768 px.

## 2026-11-10 — V3.0 afwerking na fase B, stap 2: kaart links, reliëf, per scherm

Volgens renders/README § "Afwerking na fase B" en § "Bijstelling eigenaar (10-11, middag)". Alleen presentatie; de logica blijft gelijk.

- **Kaart links, bediening rechts** op Reis, Oefenen, Les, Toets resultaat en Voortgang (≥ 1024 en iPad liggend). Zo staat de kaart op elke tab op dezelfde plek, op het rustige deel van het artwork.
  - **Reis:** de kaart op 7/12 links. De hoofdstukkaart (titel, stappen, Aanwijzen) ligt onderaan op het kaartvlak; de tekening houdt die strook vrij (`--v3-fit-bottom`), zodat er geen pin onder de kaart valt. De lijst staat op 5/12 rechts.
  - **Oefenen:** het keuzepaneel rechts (wijkt af van `R-oefenen-ijk`). Op iPad liggend staan de chips in twee kolommen en de vormtegels 2×2, zodat het paneel op 5 kolommen past.
  - **Les (desktop):** de schoolkaart links, zo groot als het rastervlak toelaat (7 kolommen of de volle hoogte). Rechts staat één glaskaart met les, Schoolblad, teller en stappen, met de vraag eronder. **Focus Mode (iPad) houdt zijn eigen indeling** (V2-gedrag met safe-area en een inklapbaar blad); die is niet herschikt.
  - **Toets resultaat:** de kaart op 7 kolommen over de volle hoogte, met de score linksboven op het kaartvlak. Het paneel staat rechts; Nino staat vrij in een eigen rastervlak onder het paneel en wordt nooit bedekt.
  - **Voortgang:** de grote kaart links over de volle hoogte, met "Italië · 45 plekken" en de legenda op de kaart (geen lege kolom). Rechts staan de hoofdstukken (eigen scroll), met Dagdoel, Pizza's en Vespa-ritten eronder. Toetsen en het paspoort volgen; het Werkblad scrolt als geheel.
- **Kaart en reliëf:** de kaart vult zijn rastervlak. Het reliëf krijgt diepte: verzadiging 1,15 en een sterkere hillshade (contrast 1,2 rond de middentoon, SVG-filter op het terrein). Onder het land ligt een slagschaduw `0 18px 24px rgba(42,36,64,.28)`, per fit omgerekend naar kaarteenheden. **Variant (a) Eiland is gekozen;** variant (b) Kaart, `#…/kaart` en de CSS ervoor zijn weg.
- **Toetsscore:** violet (accent, want het is data), gewicht 600, zonder kader en zonder focusring. Het is een kop met `tabindex=-1` die alleen programmatisch focus krijgt.
- **Beloningen:**
  - het boek is de knop. Het witte rondje erachter was de glasstijl van de secundaire knop (achtergrond plus `backdrop-filter`); dat is weg;
  - de aparte knop "Open Reisboekje" is weg, en het omslag krijgt de focus;
  - "Pizza 2" heet nu "Pizza".
- **Voortgang:** slotrijen tonen alleen het slot, zonder balk.

**QA:**
- `qa-v3-afwerking.py` meet nu ook:
  - de kaart links van het paneel;
  - de kaart ≥ 45% van het inhoudsvlak op Landschap (het vlak binnen de binnenmarges naast de zijbalk). Gemeten: Reis 52%, Oefenen 49–58%, Les 49%, Toets resultaat 53–56%;
  - Nino zonder overlap met een paneel;
  - de toetsscore, het boek als knop, "Pizza" en de slotrijen.
- De `qa-v3-faseb-*.py` en `qa-v3-stijlbeeld.py` volgen de nieuwe indeling. De runs voor variant (b) en de bijbehorende beelden zijn verwijderd.

**Open:**
- de Les in Focus Mode (iPad) is nog de gecentreerde kaart met het blad onderaan: ongeveer 35% van het vlak, niet herschikt;
- NINO-ONDERWEG: de masters liggen op `art/master` en gaan via de artworkpijplijn. Tot dan staat de huidige pose, vrij geplaatst.

## 2026-11-10 — Kalibratie typografie en beeld (overdracht stap 3b)

- De avondkalibratie in renders/README vervangt de eerdere typeschaal: desktop titel 44, kaarttitel 32, nav 18, rijen/chips 17, tellers 20, tegels 40 en toetsscore 64; de iPad-waarden volgen de aparte kolom. Gewichten blijven 600/700 volgens de tabel.
- De wash eindigt bij de zijbalk, zonder filter op het inhoudsvlak. Het gemeten z8-reliëf behoudt zijn sneeuw en geometrie; alleen de kleurmatrix (olijf/geel, wit blijft wit), verzadiging 1,15 en contrast 1,3 veranderen.
- Toetsresultaat krijgt weer een glaskaart rond label en score; dit vervangt de kaderloze score van de middag. Programmatische focus verandert de maat niet en tekent geen ring op de kop.
- Voortgang gebruikt Eiland. Elf rijen zijn elk minimaal 40 px en volledig binnen hun hoofdstukpaneel; de drie even brede tegels volgen onder de kaart/lijst. Het gehele Werkblad scrolt, ook naar Toetsen en het kennis-paspoort.
- Oefenen gebruikt op desktop twee chipkolommen en compacte 2×2-vormtegels. Dit wijkt af van de eerdere drie kolommen: volledige namen op 17 px, kaart ≥45% en bediening rechts passen samen niet in vijf kolommen met drie chips naast elkaar. De selectie, inhoud en acties veranderen niet.
- QA: minimumgroottes per elementtype toegevoegd aan qa-v3-afwerking.py, plus Eiland, elf rijen en afsnijding. Historische fase-B-asserties volgen de avondkalibratie (kaarttitels zijn geen extra schermtitels, score op glas).

## 2026-11-10 — Master-assets via de artworkpijplijn (overdracht stap 4)

- Pijplijn `art/v3-render-assets` @ `b70e1ac`: dertien bron-PNG's byte-gelijk uit `339c4207e6d4b212cda4073862b5df42c8d95474`, met reproduceerbaar exportscript, bronpad, SHA256, afmetingen en status **eigenaar akkoord, Hermes open**. Technische WebP-verkleining zonder uitsnijden of herschilderen: poses maximaal 800×1200; Vespa's maximaal 1200×800.
- In de app komen alleen exports en het manifest; geen masters en geen merge van `art/master`. Elk ingebed bestand wordt tegen de manifest-SHA256 gecontroleerd.
- V3 gebruikt `nino-schrijft` bij Toets instellen, `vespa-rijdend` als NINO-ONDERWEG en `nino-juicht` bij een perfecte toets. Bestaande V2-slots voor welkom, gids, aanmoediging, succes, goud en aankomst krijgen de overeenkomstige nieuwe pose via een V3-adapter; de slots en de momenten waarop ze verschijnen blijven van V2.
- `nino-denkt`, `nino-wijst-rechts`, `nino-paspoort`, `vespa-zij` en `vespa-icoon` blijven reserve en worden niet ingebed. De paspoortomslag en het paspoortbinnenwerk zijn niet overgenomen. Omslag B en het canonieke zijbalkportret blijven de goedgekeurde beelden.
- Bronnen behouden: sommige aangeleverde PNG's hebben maximaal alfa 254; die alfa en de geschilderde randen zijn niet aangepast. De technische test controleert bronhash, exporthash, afmetingen, beeldverhouding en offline laden. De onafhankelijke Hermes-modelcheck blijft open.

## 2026-11-10 — Eindbewijs en QA-integriteit (overdracht stap 5)

- Alle zeven schermen krijgen een vergelijking naast hun doelbeeld op desktop 1440×900, iPad liggend 1180×820 en telefoon 390×844, in `docs/qa/v3-stijlbeeld/final/`. De laatste kalibratieregels gaan voor de oudere raster- en typekeuzes in de renders. Geen nieuwe UI-copy of motorlogica.
- Laatste kalibratiecorrecties: ook op telefoon heeft de toetsscore glas; de `<b>`-elementen van de reistellers krijgen expliciet gewicht 600, zodat de browser ze niet op zijn standaardgewicht 700 tekent. De berekende desktop/iPad-waarden staan in `typografie.log`.
- `qa-v3-all.py` registreert de SHA256 van preview, index en elk QA-script, plus een digest van de volledige suite inclusief gedeelde helpers. Hergebruik met `--failed` is alleen toegestaan bij gelijke inputs en testbytes; een wijziging tijdens een run maakt die rood. Een geïsoleerde regressie bewijst hergebruik, invalidatie na een nieuwe preview of test (ook bij wijziging van alleen een geïmporteerde helper), en afwijzing van een wijziging tijdens de run.
- De minimumtitelcheck meet echte schermtitels, niet de vraagkop van de V2-focusles. De tabelkolom iPad betreft liggend; de bestaande staande Reis-titel blijft 30 px. De actuele controles volgen de kalibratie, zonder de functionele controles uit eerdere fasen te verwijderen.
- De interne codereview vervangt geen onafhankelijke Hermes-review. Het gevonden risico van oude groene QA-uitslagen is hersteld. De iPad Focus Mode-uitzondering en de twee chipkolommen op desktop Oefenen staan zichtbaar in het reviewpakket.
- **Volgorde na bouw:** stoppen na stap 5, eerst de lead designer; die vraagt daarna de Hermes-hertest aan. Dit volgt de directe eigenaarsopdracht en gaat voor het onmiddellijke hertestverzoek in de oudere overdracht. Geen verzoek verstuurd, geen merge, deploy, publicatie of downloadvervanging.

## 2026-11-10 — Ronde 2, punt 1: Kust als standaard

BG-03 Kust is de standaardachtergrond; BG-01 Toscane en BG-02 Meer blijven kiesbaar. De previewlinks bewaren de achtergrond bij wisselen van thema of demosituatie. De QA kiest BG-01/02/03 nu expliciet en verwacht Kust zonder achtergrondoptie. Gerichte check: `qa-v3-ronde2.py --point 1` (standaard plus alle drie keuzes), lint groen. Geen wijziging van `index.html` of gedrag.

## 2026-11-10 — Ronde 2, punt 2: neutrale zijbalk

De zijbalk is wit 70% met blur 28 en saturatie .6, ook in de les. Een witte wash staat uitsluitend onder de zijbalk; het inhoudsvlak blijft vrij. Op Home staat die wash op het frame zelf, omdat de body daar de framevariabelen niet erft. De regel voor de les heeft dezelfde specificiteit als de bestaande Focus Mode-regel. Verminderde transparantie/meer contrast houdt de ondoorzichtige variant.

De tintcheck meet CIE76 ΔE tegen D65-wit over een dicht raster van de getekende binnenzijde, met tekst, iconen en portret tijdelijk verborgen. Op BG-01/02/03, Home én Les, is de maximale ΔE ≤8; achtergrondkleur en saturatie worden ook uit de berekende CSS gecontroleerd. Bewijs: `docs/qa/v3-stijlbeeld/ronde2/point-2.json` en `sidebar-*.png`.

## 2026-11-10 — Ronde 2, punt 3: Voortgang in één eerste frame

Op desktop vanaf 1280 px vormt `v3VgOverview` één viewporthoog raster: titel, kaart plus elf rijen van 40 px, en drie tegels van 104 px. De balken blijven 10 px. Geen element in dit overzicht raakt de onderste framerand; de inhoud van de tegels blijft binnen de tegel. Toetsen en het kennis-paspoort beginnen volledig onder het eerste frame, gescheiden door witruimte en een rand; het werkblad blijft als geheel scrollen. iPad/telefoon behouden hun goedgekeurde scrollindeling. Gerichte framecheck en bestaande vijf Voortgang-cases groen; kaartgeometrie en lees-/beoordelingslogica ongewijzigd.
