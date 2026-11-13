# Memory — wat waar hoort

**Kernregel: de repo is het geheugen van het project.** Alles wat een agent morgen moet weten, staat in een bestand op `main`. Chats, Claude-memory en Telegram zijn geen projectgeheugen.

| Laag | Waar | Wat erin | Levensduur |
|---|---|---|---|
| **Instructies** | `CLAUDE.md`, `AGENTS.md` | Regels die elke sessie nodig heeft | Permanent, kort houden |
| **Stand** | `ops/STATE.md` | Waar staan we nu (≤ 60 regels) | Overschreven na elke taak |
| **Historie** | `ops/RUNLOG.md`, git log, PR's | Wat er gebeurde | Append-only, wekelijks opgerold |
| **Besluiten** | `docs/DECISIONS.md` | Wat is besloten en waarom | Permanent, superseded markeren |
| **Lessen** | `ops/LEARNINGS.md` | Wat het systeem leerde | Promoveren of snoeien |
| **Specificatie** | `docs/PRODUCT_SPEC.md`, `docs/v3/SPEC.md`, `DESIGN_SYSTEM.md`, `MAP_SYSTEM.md` | Hoe het product hoort te zijn | Levend document |
| **Per land** | `src/lands/<id>/README.md` | Bronnen, keuzes, open punten van dat land | Per land |
| **Brain/kennis** | `docs/brain/` | Achtergrond (didactiek, onderzoek) | Op aanvraag lezen |
| **Claude-memory** (claude.ai) | buiten de repo | Wie Dennis is, hoe hij werkt, voorkeuren | Persoonlijk, niet projectspecifiek |
| **Hermes-memory** | Mac mini | Operatorzaken: schema's, tokens, paden | Infra |

## Hygiëne
- **Geen nieuwe statusdocumenten.** Geen `RELEASE_X.md`, `HANDOFF_<datum>.md` of `WORK_HANDOFF.md` meer. Status hoort in STATE, historie in RUNLOG en PR's.
- **QA-bewijs** komt als bijlage in de PR (of in een artifact). Alleen de laatste stand per Golden Screen blijft in `docs/qa/<scherm>/final/`.
- **Overdracht = transactie:** een overdracht is pas geldig als STATE is bijgewerkt en de pin klopt. Een samenvatting in een chat telt niet.
- **Lange bestanden** (> 300 regels) krijgen bovenaan een samenvatting van 10 regels plus een inhoudsopgave, zodat agents gericht kunnen zoeken.
- **Strategische ideeën** uit chats (branding, domeinen, structuur) gaan als `idee` in de BACKLOG of in `NORTH_STAR.md` → "Later".
