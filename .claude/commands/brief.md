---
description: Schrijf de ochtendbrief voor Dennis
model: sonnet
---

Schrijf `ops/briefs/<vandaag>.md` volgens `ops/templates/BRIEF.md`. Gebruik als bronnen: `ops/reports/night-<vandaag>.md`, `ops/STATE.md`, `ops/RUNLOG.md` (laatste 24 uur) en `gh pr list`.
- Elk getal en elke status verwijst naar een bestand of PR. Niets schatten.
- Maximaal 3 beslissingen, als meerkeuze met een aanbeveling. Dennis antwoordt met één letter.
- Maximaal 20 regels. Print daarna alleen de inhoud (het script stuurt die naar Telegram).
