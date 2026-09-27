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
