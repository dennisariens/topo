# Sprintcontract — BL-___ <titel>

**Doel (1 zin):**
**Waarom nu (target/mijlpaal):**
**Bouwer:** Claude Code (Sonnet) / Codex · **Evaluator:** evaluator-subagent · **Max runs:** 1/3

## Scope
- Wel:
- Niet:
- Bestanden die gewijzigd mogen worden:
- Bestanden die gelezen moeten worden (en verder niets):

## Acceptatiecriteria (elk toetsbaar, met methode)
| # | Criterium | Hoe getoetst | Verwacht |
|---|---|---|---|
| 1 | | `npm test -- <...>` | groen |
| 2 | | screenshot desktop van <scherm> naast `docs/v3/renders/R-..` | geen afwijking op frame, type, kleur |
| 3 | | meting | ≤ … |
| UI | Geen afgesneden of overlappende tekst (verplicht bij elke UI-taak) | browser, per formaat incl. 1080×810 en 810×1080: elk tekstelement `scrollWidth ≤ clientWidth`, geen overlap tussen tekst en knoppen | 0 gevallen |
| UI | Contrast en lettergrootte van álle tekst, ook labels en pills | meting in de browser | ≥ 4,5:1, niets onder 13 px |

## Stopcriterium
Klaar wanneer 1–n PASS zijn. Niet doorgaan met "verbeteringen" buiten de scope. Die gaan als `idee` naar de backlog.

## Risico en rollback
