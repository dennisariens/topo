# Kwaliteit

## Definition of Done (elke taak, gate G2)
- [ ] Alle contractcriteria PASS volgens de evaluator, met bewijs (testoutput, meetwaarde of screenshot)
- [ ] `npm run lint` en `npm test` groen, plus de taakspecifieke `qa-v3-*`-scripts
- [ ] Geografie: geometriecheck 46/46 (of het equivalent per land), geen benaderde vormen
- [ ] Geen regressie in de karakterisering
- [ ] STATE, RUNLOG en (indien van toepassing) LEARNINGS bijgewerkt
- [ ] PR met een preview-link

## Release-gate (G3)
- [ ] Volledige testset plus karakterisering op de releasepin
- [ ] iPad 9e generatie, iPadOS/Safari: alle schermen passen, geen afgesneden tekst, geen crash bij 10 minuten wisselen tussen schermen
- [ ] Offline: het gedownloade HTML-bestand werkt via `file://`
- [ ] Toegankelijkheid: toetsenbord, focus, verminderde beweging, contrast AA
- [ ] Opslag: oude saves en reservekopieën lezen in, rollback getest
- [ ] Hermes-hertest PASS
- [ ] Speeltest met ≥ 2 kinderen bij elke mijlpaal met nieuwe gebruikersflow

## Design-gate (G1)
- Een nieuw scherm wordt eerst als render of preview naast het Golden Screen gezet (`docs/v3/renders/`)
- De `design-critic`-subagent toetst tegen `DESIGN_SYSTEM.md` en `docs/v3/SPEC.md` §Ontwerp: frame, oppervlakken, typografie en kleurgebruik
- Dennis geeft de visuele GO. Zonder GO wordt er niet gebouwd.
- **Anti-patronen** (direct FAIL): tekst onder 13 px · violet als decoratie · kaart < 45% van het scherm · een tweede palet per land · nieuwe Nino-poses zonder goedgekeurd master-asset

## Budgetten
| Meting | Budget | Actie bij overschrijding |
|---|---|---|
| HTML per land | ≤ referentie + 10% | Verklaren in de PR, anders FAIL |
| Gedecodeerde beeldbytes per scherm | vaststellen in M1 op iPad 9 | FAIL |
| Laadtijd tot interactie (iPad 9) | vaststellen in M1 | FAIL |

## Plezier
Kwaliteit is meer dan "geen bugs". Per mijlpaal: wat deden kinderen vanzelf opnieuw, waar haakten ze af? De top 3 gaat als `idee` in de backlog.
