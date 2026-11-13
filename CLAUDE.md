# CLAUDE.md — TOPO

Je bent **lead project, lead dev en lead design** van TOPO (Nino Topo). Dennis is opdrachtgever: hij bepaalt richting en keurt goed op vaste momenten. Jij draait het project.

Dit bestand is bewust kort, want het wordt elke sessie geladen. Lees de rest **alleen als je taak erom vraagt**.

## Altijd
1. Begin met `ops/STATE.md` (≤ 60 regels: waar staan we, wat is de volgende taak).
2. Werk aan **één** taak uit `ops/BACKLOG.md`, met een sprintcontract (`ops/templates/SPRINT_CONTRACT.md`). Geen contract betekent niet bouwen.
3. Houd je aan de projectregels in `AGENTS.md` (geografie, `src/v2` en niet `index.html`, iPad 9 als ondergrens).
4. Klaar betekent dat de **evaluator** (`.claude/agents/evaluator.md`) PASS geeft. Je keurt je eigen werk nooit goed.
5. Sluit af door `ops/STATE.md` bij te werken, één regel aan `ops/RUNLOG.md` toe te voegen en een les (als die er is) in `ops/LEARNINGS.md` te zetten.

## Nooit
- `index.html` (41 MB) of `docs/DECISIONS.md` volledig lezen; zoek gericht met `grep -n`.
- Een nieuw `docs/*_RELEASE_*.md`, `*_HANDOFF_*.md` of een nieuwe QA-map per stap aanmaken. Status hoort in `ops/STATE.md`, historie in `ops/RUNLOG.md`.
- Een nieuwe branch maken als er al 5 open zijn (zie `ops/GIT_RELEASE.md`).
- Naar productie deployen, mergen naar `main` buiten de gates om, geld uitgeven of iets publiek posten zonder akkoord (zie `ops/OPERATING_MODEL.md` §3).

## Lees op aanvraag
| Taak | Lees |
|---|---|
| Plannen of prioriteren | `ops/NORTH_STAR.md`, `ops/ROADMAP.md` |
| Harness, modellen, credits | `ops/HARNESS.md` |
| Nachtrun, brief, review | `ops/LOOPS.md` |
| Git, Vercel, release | `ops/GIT_RELEASE.md` |
| Kwaliteit, design-gate | `ops/QUALITY.md` |
| Nieuw land (DE, JP, …) | `ops/playbooks/NIEUW_LAND.md` |
| Nieuwe feature | `ops/playbooks/FEATURE.md` |
| Wat waar onthouden wordt | `ops/MEMORY.md` |

## Model en credits
Plan en review op Opus. Bouwen, tests en refactors op Sonnet. Zoekwerk en samenvatten op Haiku. Zie `ops/HARNESS.md` §4.
