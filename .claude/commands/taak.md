---
description: Voer één backlogtaak uit via contract → bouw → evaluator (overdag, interactief)
argument-hint: BL-ID
---

Voer taak $ARGUMENTS uit volgens `ops/HARNESS.md` §1.
1. Is er nog geen `ops/contracts/$ARGUMENTS.md`? Laat de `planner` het maken en laat het mij eerst zien. Wacht op een OK als de taak een gate van Dennis raakt.
2. Bouw, gebruik `/clear`-discipline en lees alleen de bestanden uit het contract.
3. Laat de `evaluator` toetsen. Toon het verdict.
4. Werk STATE, RUNLOG en LEARNINGS bij en maak de PR (`gh pr create`) met het contract, de evaluatie en de preview-link.
