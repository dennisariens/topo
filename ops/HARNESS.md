# Harness — graph, rollen, modellen, credits

## 1. De graph (één taak)

```
BACKLOG (ready) ──▶ PLANNER (Opus) ──▶ sprintcontract
                                            │
                                            ▼
                                     BUILDER (Sonnet, worktree)
                                            │
                                            ▼
                         ┌──── EVALUATOR (read-only, nieuwe context)
                         │            │
                    FAIL ≤2×      PASS
                    met bewijs        │
                         │            ▼
                         └──▶ BUILDER   INTEGRATOR: PR → preview → main*
                                            │
           FAIL 3× ──▶ PLANNER splitst      ▼
                                     STATE · RUNLOG · LEARNINGS
```
\* Mergen naar `main` mag na G2 als de taak geen G1/G4-gate raakt. Een productie-release vraagt altijd G4.

## 2. Taakstatus (state machine)
`idee → ready → bezig → review → klaar`
Zijpaden: `review → fail(n) → bezig` · `fail(3) → idee (herplannen)` · `* → geblokkeerd: <reden>`. Geblokkeerde taken komen in de brief.

## 3. Rollen per node
| Node | Wat het doet | Mag niet |
|---|---|---|
| Planner | Taak kiezen, contract schrijven (`templates/SPRINT_CONTRACT.md`), te grote taken splitsen | Code schrijven |
| Builder | Precies het contract uitvoeren in een eigen worktree | Scope uitbreiden, `main` aanraken, eigen werk PASS noemen |
| Evaluator | Contractcriteria één voor één toetsen met tests, screenshots en meetwaarden | Code wijzigen (geen Write/Edit) |
| Integrator | Rebase, PR met contract en evaluatie, preview-link, merge na de gate | Mergen zonder groene evaluatie |
| Hermes QA | Onafhankelijke hertest bij G3 | — |

**Waarom een aparte evaluator:** een agent die zijn eigen werk beoordeelt, keurt het te makkelijk goed. Een frisse context zonder schrijfrechten is strenger en goedkoper dan een week heen en weer in chats.

## 4. Modelrouting en credits
| Werk | Model | Waarom |
|---|---|---|
| Planning, contracten, architectuur, design-review, evaluatie van UI | Opus | Oordeel en kwaliteit |
| Bouwen, tests schrijven, refactors, docs | Sonnet | ±5× goedkoper, voldoende voor een helder contract |
| Zoeken in de repo, samenvatten, logs lezen | Haiku of de Explore-subagent | Houdt de hoofdcontext schoon |
| Tweede code-review, eenvoudig data- en docswerk, of builder bij een lege Claude-limiet | Codex (`codex-worker`) | Ander budget (OpenAI), andere blik |
| Uitzonderlijk zware taken (architectuur, grote refactor), alleen als Dennis het aanzet | Fable (`TOPO_MAIN_MODEL=claude-fable-5-2`) of de hoofdsessie van Dennis | Sterkste model, beperkt beschikbaar |

**Orkestratie:** de hoofdsessie (Opus) bouwt zelf niet. Hij delegeert aan `planner`, `builder`, `evaluator`, `design-critic`, `scout` en `codex-worker` (`.claude/agents/`). Zo blijft de context van de hoofdsessie klein en goedkoop, en draait elk deel op het goedkoopste model dat volstaat.

**Credits: de regels**
1. **Eén bouwer per scope.** Claude Code en Codex nooit tegelijk aan hetzelfde.
2. **Nachtrun binnen één 5-uursvenster**, start 01:00. Het venster is om 06:00 gereset, zodat jij overdag de volle capaciteit hebt.
3. **Context-hygiëne:** `/clear` tussen taken. Lees alleen de bestanden uit het contract. Laat subagents zoeken, niet de hoofdagent.
4. **CLAUDE.md onder 60 regels.** Alles wat elke sessie geladen wordt, kost elke sessie credits.
5. **Failover:** meldt Claude een usage limit, dan pakt Codex de volgende `ready`-taak met hetzelfde contract (`ops/scripts/nightly.sh`). De evaluator blijft Claude.
6. **Geen grote previews of screenshots per tussenstap.** Alleen bij de eindcheck van een taak (zie `docs/v3/SPEC.md`, "Werkwijze die credits spaart").

## 5. Bestanden en tools
- Subagents: `.claude/agents/planner.md`, `evaluator.md`, `design-critic.md`
- Commands: `.claude/commands/nachtrun.md`, `taak.md`, `brief.md`, `weekreview.md`, `nieuw-land.md`, `retro.md`
- Headless: `ops/scripts/nightly.sh` (claude `-p`, git worktree, `gh pr create`, Telegram)
- Hermes: plant de nachtrun, stuurt de brief door en houdt de Telegram-lijn naar Dennis open. Hermes bouwt zelf niet aan TOPO.
- Paperclip: niet nodig voor TOPO. De backlog in de repo is de takenlijst.

## 6. Harness-onderhoud
Na elke modelupgrade (een nieuwe Claude- of Codex-versie) volgt een retro-vraag: welke regels en stappen zijn nu overbodig? Haal weg wat het model zelf al goed doet. Een harness hoort met de tijd lichter te worden, niet zwaarder.
