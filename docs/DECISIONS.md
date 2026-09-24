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
