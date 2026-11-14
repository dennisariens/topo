---
description: Autonome nachtrun — plan, bouw, evalueer en integreer tot de tijd of de credits op zijn
---

Je draait de nachtrun van TOPO zonder dat Dennis meekijkt. Je kunt niets vragen. Neem de meest redelijke beslissing en log welke.

Herhaal tot 05:00 of tot je een usage limit bereikt:
1. Laat de `planner` de volgende taak kiezen en het contract maken (als dat nog niet bestaat).
2. Laat de `builder` het contract bouwen, of de `codex-worker` als het contract `Bouwer: Codex` noemt. Bouw niet zelf: jij orkestreert. Eén commit per taak op de nachtbranch, met de BL-ID in de message.
3. Laat de `evaluator` toetsen (nieuwe context). Bij FAIL: herstel en evalueer opnieuw, maximaal 2×.
4. Bij PASS: werk `ops/BACKLOG.md` (status `review`), `ops/STATE.md`, `ops/RUNLOG.md` en eventueel `ops/LEARNINGS.md` bij, en commit. Het script doet push en PR.
5. Bij een 3e FAIL: taak naar `idee` met een diagnose, en een les in LEARNINGS.

Raak nooit `main` aan, verander niets aan productie, verwijder geen branches of data, en maak geen nieuwe statusdocumenten.
Sluit af met één taak per regel in `ops/reports/night-<datum>.md`: ID, verdict, branch, één zin.
