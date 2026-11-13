# Onderhoud en optimalisatie

## Wekelijks (in de nachtrun van maandag)
- `npm outdated` en `npm audit`: patch- en minor-updates als S-taak met tests. Majors komen als `idee` in de backlog.
- Open branches > 3 dagen oud: integreren of sluiten
- `docs/` controleren: nieuwe statusdocumenten? Verplaatsen en een les vastleggen
- RUNLOG ouder dan 2 weken oprollen tot één regel per week

## Maandelijks (retro)
- LEARNINGS: promoveren en snoeien (zie `LEARNINGS.md`)
- Harness lichter maken: welke stap of regel kan weg? (`HARNESS.md` §6)
- Targets uit `NORTH_STAR.md` bijwerken
- Performance op iPad 9: grootte, geheugen, laadtijd tegen de budgetten
- Tools: nieuwe versies van Claude Code, Codex en Hermes. Lees de changelog, probeer het uit op een taakbranch en neem alleen over wat aantoonbaar helpt.

## Optimaliseren (doorlopend, P2-backlog)
- Wat speeltests opleveren
- Code die drie keer per land is aangepast → naar de kern of een generator
- Langzame of dure stappen in de harness (uit RUNLOG: welke taken kostten "hoog")

## Features toevoegen
Altijd via `playbooks/FEATURE.md`. Een feature die niet bijdraagt aan een target in `NORTH_STAR.md` blijft `idee`.
