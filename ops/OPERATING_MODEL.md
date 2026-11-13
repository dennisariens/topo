# Operating model

## 1. Rollen
| Rol | Wie | Verantwoordelijk voor |
|---|---|---|
| **Opdrachtgever** | Dennis | Richting, doelen, budget, eindakkoord op gates. Speelt mee als consultant: feedback op vaste momenten, niet tussendoor. |
| **Lead project, dev en design** | Claude (Opus, planner) | Roadmap, backlog, prioriteit, sprintcontracten, architectuur, designrichting, kwaliteit, rapportage. Eigenaar van het resultaat. |
| **Bouwer** | Claude Code (Sonnet) | Uitvoeren van precies één contract per run. |
| **Tweede bouwer / reviewer** | Codex | Alleen op expliciete toewijzing: een afgebakend pakket of een tweede code-review. **Nooit tegelijk met Claude Code op dezelfde scope.** |
| **Evaluator** | Claude subagent `evaluator` (read-only) | Toetst tegen het contract met tests en screenshots. Geeft PASS of FAIL met bewijs. Repareert niets. |
| **Onafhankelijke QA** | Hermes | Hertest bij release-gates (G3) en op echte apparaten waar mogelijk. |
| **Operator** | Hermes-runtime op de Mac mini | Plant nachtruns, stuurt de brief via Telegram, bewaakt het creditbudget. |
| **Sparring en onderzoek** | ChatGPT, Claude chat | Ideeën en research. Uitkomsten gaan **altijd** naar `ops/` of een issue, nooit alleen in een chat. |

## 2. Beslisrechten
| Claude beslist zelf | Claude stelt voor, Dennis keurt goed | Alleen Dennis |
|---|---|---|
| Taakvolgorde binnen de goedgekeurde roadmap | Wijzigingen aan roadmap of deadlines | Missie, doelgroep, prijsmodel |
| Technische aanpak en refactors binnen de architectuur | Architectuurwijziging (nieuwe dependency, framework, backend) | Merge naar productie en publieke release (G4) |
| Design binnen het goedgekeurde designsysteem | Nieuwe designrichting, een nieuw Golden Screen, nieuwe Nino-artwork | Uitgaven (tools, domeinen, stores, betaalde API's) |
| Preview-deploys op Vercel | Een nieuw land starten (playbook G0) | Juridisch: privacy, licenties, voorwaarden |
| Branches opruimen die volgens de regels in `GIT_RELEASE.md` dood zijn | Het verwijderen van data of saves | |
| Bugs fixen, dependency-patches, docs | | |

**Regel:** twijfel je bij iets onomkeerbaars, vraag dan. Bij iets omkeerbaars beslis je, log je het in `ops/RUNLOG.md` en ga je door.

## 3. Gates
| Gate | Moment | Wie | Bewijs |
|---|---|---|---|
| **G0 Richting** | Start van een mijlpaal, nieuw land of grote feature | Dennis | Eén pagina: doel, scope, deadline, kill-criterium |
| **G1 Design** | Vóór bouw van een nieuw scherm | Dennis (visuele GO) | Render of preview naast het Golden Screen |
| **G2 Taak klaar** | Na elke taak | Evaluator | PASS tegen het contract, tests groen |
| **G3 Release-kandidaat** | Voor productie | Hermes en de evaluator | Volledige testset, iPad 9, karakterisering |
| **G4 Live** | Productie | Dennis | Eén druk op "akkoord" in de brief |

G0, G1 en G4 zijn jouw momenten. Al het andere loopt zonder jou.

## 4. Ritme met Dennis
| Wanneer | Wat | Tijd voor Dennis |
|---|---|---|
| Dagelijks om 08:00 | Ochtendbrief (Telegram en `ops/briefs/`): gedaan, gefaald, max. 3 beslissingen | 2–5 min |
| Vrijdag | Weekreview: targets, demo-link, voorstel voor volgende week | 15 min |
| Per mijlpaal | G0- en G4-gesprek | 30 min |
| Ad hoc | Alleen bij blokkades die niets anders laten doorlopen | — |

Beslissingen vraag ik als **meerkeuze met een aanbeveling**, zodat je met één letter kunt antwoorden.

## 5. Parallel werk (besluit 13-11, status 🟡)
Eén actieve mijlpaal betekent niet dat agents stilzitten. Werk naast de mijlpaal mag, onder vier voorwaarden:
1. **Het overleeft elke architectuurwijziging.** Dat betekent pure data, research of art (itemlijsten, bronnen, geometrie met licentie, artwork-briefs, teksten), niet de app-code. Code voor een land wacht tot het landpakket-contract (M1) staat, anders bouwen we het twee keer.
2. **Ander budget.** Parallel werk draait op Codex (OpenAI), niet op het Claude-venster van de mijlpaal. Credits zijn niet gratis omdat een agent "niks doet".
3. **Geen eigen langlopende branch.** Data gaat als kleine PR naar `main` in `src/lands/<id>/` (status `draft`), art via `art/master`.
4. **Max. 1 parallelle stroom**, en die krijgt dezelfde evaluator. Raakt de mijlpaal achter op schema, dan stopt het parallelle werk eerst.

## 6. Escalatie
- Twee keer FAIL op hetzelfde contract: de taak gaat terug naar de planner, die het contract splitst of herschrijft.
- Drie nachten zonder een PASS: dat komt in de brief als rood signaal met een diagnose.
- Credits voor 80% op vóór donderdag: dan alleen nog P0-taken, en dat staat in de brief.
