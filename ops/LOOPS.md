# Loops

| Loop | Frequentie | Trigger | Output | Dennis |
|---|---|---|---|---|
| **Taak** | per taak | backlog `ready` | PR plus evaluatie | — |
| **Nacht** | dagelijks 01:00–06:00 | `ops/scripts/nightly.sh` | 1–4 taken, PR's | — |
| **Brief** | dagelijks 07:30 | einde van de nachtrun | `ops/briefs/YYYY-MM-DD.md` plus Telegram | 2–5 min lezen en antwoorden |
| **Dag** | overdag, op aanvraag | Dennis of Claude chat | design-iteraties (G1), beslissingen | optioneel |
| **Week** | vrijdag 16:00 | `/weekreview` | targets, demo, voorstel voor volgende week, RUNLOG opgerold | 15 min |
| **Maand (retro)** | eerste vrijdag | `/retro` | LEARNINGS gepromoveerd en gesnoeid, harness lichter | 15 min |
| **Onderhoud** | wekelijks en maandelijks | `MAINTENANCE.md` | patches, opruimen | — |
| **Release** | per mijlpaal | G3 | Hermes-hertest, G4-vraag | 1 akkoord |

## Nachtloop (detail)
1. `git fetch`; de worktree `../topo-night` krijgt een nieuwe tak vanaf `main`.
2. De planner kiest de bovenste `ready`-taak. Is er geen `ready` maar wel een `idee`, dan schrijft hij eerst contracten (maximaal 3) en stopt.
3. De builder voert uit. De evaluator toetst in een nieuwe context. Bij FAIL volgt maximaal 2× herstel.
4. Bij PASS: push, PR met contract en evaluatie, en de preview-link.
5. STATE, RUNLOG en LEARNINGS bijwerken.
6. Tijd over (vóór 05:00) en geen limiet bereikt? Door naar de volgende taak.
7. De brief schrijven en versturen.

## Ochtendbrief (format: `templates/BRIEF.md`)
- ✅ Klaar (met preview-links) · ❌ Gefaald (met reden) · ⛔ Geblokkeerd
- 📈 Stand van de mijlpaal: X/Y taken, deadline, op schema ja/nee
- ❓ Maximaal 3 beslissingen als meerkeuze met aanbeveling
- 💳 Credits: nachtgebruik laag/mid/hoog, limiet geraakt ja/nee

## Zelfverbetering (de echte loop)
```
run → evaluatie → FAIL/correctie → LEARNINGS → (2×) regel of test → volgende run vermijdt het
                                                       ↑
                                       maandretro snoeit wat niet meer nodig is
```
Je feedback in de brief of de weekreview gaat via dezelfde weg erin: correctie → LEARNINGS → direct een regel.
