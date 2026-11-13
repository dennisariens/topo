# TOPO Operating System

Het besturingssysteem van het project: wie beslist wat, hoe werk stroomt, hoe het systeem leert en hoe we groeien naar "over 2 weken volgt Japan".

## Installatie (eenmalig, ±30 min)
1. Kopieer `CLAUDE.md`, `ops/` en `.claude/` naar de root van `dennisariens/topo`, op een nieuwe branch `ops/setup`.
2. Zet bovenaan het bestaande `AGENTS.md`:
   ```
   > Werkwijze, rollen en loops: `ops/OPERATING_MODEL.md`. Status: `ops/STATE.md`. Deze regels hieronder blijven gelden.
   ```
   Codex leest `AGENTS.md`, Claude Code leest `CLAUDE.md`. Beide komen zo op dezelfde plek uit.
3. ~~Besluiten in `ops/NORTH_STAR.md`~~ ✅ 13-11
4. Merge `ops/setup` naar `main`. Vanaf dat moment is `main` weer de waarheid.
5. Nachtrun installeren op de Mac mini, in Terminal vanuit de topo-repo:
   `git fetch origin main && git show origin/main:ops/scripts/install-nightly.sh | bash`
   Dat zet launchd op (01:00), legt de paden vast in `~/.topo-night/env`, doet een proefdraai en checkt of Claude headless werkt. Telegram is optioneel: vul de token en chat-ID in `~/.topo-night/env`.
6. Eerste taak voor Claude: `BL-001 Consolidatie` uit `ops/BACKLOG.md`.

## Kaart
| Bestand | Wat | Wie schrijft |
|---|---|---|
| `OPERATING_MODEL.md` | Rollen, beslisrechten, gates, ritme | Dennis keurt goed |
| `NORTH_STAR.md` | Missie, doelgroep, doelen en targets | Dennis beslist, Claude stelt voor |
| `ROADMAP.md` | Mijlpalen met deadlines | Claude, Dennis keurt goed |
| `BACKLOG.md` | Geprioriteerde taken | Claude |
| `STATE.md` | Huidige stand (≤ 60 regels) | Claude, na elke taak |
| `RUNLOG.md` | Eén regel per run, append-only | Agents |
| `LEARNINGS.md` | Lessen, en welke tot regel zijn gepromoveerd | Agents en evaluator |
| `HARNESS.md` | Graph, rollen, modellen, credits | Claude |
| `LOOPS.md` | Nacht, dag, week, maand | Claude |
| `MEMORY.md` | Geheugenlagen en wat waar hoort | Claude |
| `GIT_RELEASE.md` | Branches, PR, Vercel, release, rollback | Claude |
| `QUALITY.md` | Definition of Done, gates, budgetten | Claude, Dennis keurt goed |
| `MAINTENANCE.md` | Onderhoud, updates, opruimen | Claude |
| `playbooks/` | Herhaalbare procedures (nieuw land, feature) | Claude |
| `templates/` | Sprintcontract, brief, weekreview, overdracht | — |

## Waarom dit nodig is (diagnose, 13 nov 2026)
- `main` staat stil sinds **28 september**. Er zijn **71** remote branches, en minstens 6 werkstromen lopen tegelijk (v3, art, land/fr, portal, website, runtime). Niets komt samen, dus er is nooit "een versie die af is".
- `docs/` bevat tientallen release-, handoff- en QA-bestanden. Agents lezen die steeds opnieuw, en dat kost credits zonder dat er iets landt.
- Codex en Claude Code bouwen parallel aan hetzelfde product, met overdrachten via chats.
- Wat er wél goed staat: harde geografieregels, een karakteriseringstest, Hermes als onafhankelijke QA, en het **landpakket-contract** (`arch/v3-runtime`). Dat contract is precies de basis voor "nieuw land in 2 weken".

Dit systeem voegt geen vierde harness toe. Het **vervangt** de losse handoffs door één stroom: backlog → contract → bouw → evaluator → `main`.
