# North Star

> Besloten door Dennis op 13-11-2026. *(voorstel)* = voorstel van Claude, geldt tot Dennis het aanpast.

## Missie
Kinderen leren topografie zo dat het blijft hangen én leuk is: met echte kaarten, korte routes en Nino als reisgids. *(voorstel)*

## Doelgroep
- Gebruiker: basisschoolleerlingen in groep 6–8 (kern: **groep 7, 10–11 jaar**), op iPad en computer.
- **B2C én B2B** (besluit 13-11): ouders/kind thuis en leerkrachten/scholen in de klas.
- Volgorde *(voorstel)*: eerst B2C-product perfect (één kind, één land, alleen), daarna een klasmodus voor B2B (M4+). Dezelfde kern, geen tweede app.

## Wat is succes (12 maanden)
**Hoofddoel (besluit 13-11): kinderen leren topografie op een leuke manier.**
Dat meten we met twee dingen tegelijk, nooit één zonder de ander:
- **Leren:** een kind haalt na de route de toets (echte schooltoets of de app-toets).
- **Leuk:** een kind wil uit zichzelf terugkomen en vertelt het aan anderen.
Gebruikersaantallen en omzet volgen hieruit en zijn in 2026–Q1 2027 geen stuurdoel.

## Targets (meetbaar, per kwartaal)
| Target | Q4 2026 | Q1 2027 | Meting |
|---|---|---|---|
| Live landen | 1 (Italië V3) | 3 (+ FR, + 1) | Productie-URL per land |
| Doorlooptijd nieuw land (G0 → live) | n.v.t. | ≤ 14 dagen | RUNLOG |
| Een kind haalt de toets na de route | — | ≥ 80% van de testkinderen | Speeltest |
| iPad 9: alle schermen passen, geen crash | 100% | 100% | QA-gate |
| PASS-rate van taken bij eerste evaluatie | ≥ 60% | ≥ 75% | RUNLOG |
| Taken naar `main` per week | ≥ 5 | ≥ 10 | git log |
| Tijd van Dennis per week | ≤ 1 uur | ≤ 1 uur | eigen schatting |

## Kwaliteit en plezier
- Plezier is meetbaar: speeltests met 2–3 echte kinderen per mijlpaal. Observeer wat ze vanzelf opnieuw willen doen.
- **Testkinderen: groep 7, 10–11 jaar** (besluit 13-11). Protocol: BL-008.
- Prioriteit bij conflict: geografische juistheid → leereffect → duidelijkheid → bruikbaarheid → consistentie → plezier (uit `AGENTS.md`).

## Grenzen
- Kinderen: geen tracking, geen accounts verplicht, data blijft lokaal tenzij er later een expliciet besluit valt (AVG voor kinderen).
- B2B/scholen: zodra er leerlinggegevens buiten het apparaat gaan, is een verwerkersovereenkomst nodig. Tot die tijd blijft alles lokaal, ook in de klasmodus.
- Offline bruikbaar, één bestand per land.

## Budget (voorstel Claude, 13-11)
| Post | Kosten | Wanneer |
|---|---|---|
| Claude Max + ChatGPT/Codex | bestaat al | nu |
| Hosting | bestaat al (Vercel Hobby voor previews) | nu |
| Domein (bijv. `ninotopo.nl` + `.com`) | ±€20–30 per jaar | M0 — Dennis koopt |
| Vercel Pro | $20 per maand | **verplicht vanaf het moment dat er betaald wordt of een school een contract tekent**: Hobby is alleen voor niet-commercieel gebruik |
| Beeldgeneratie (Nino-artwork) | max. €25 per maand, op aanvraag | M2/M3, alleen als de huidige art-pijplijn niet volstaat |
| **Totaal nu** | **±€2–3 per maand (domein)** | Overig pas bij een commerciële release |

## Kill-criteria
Stop of heroverweeg als: *(voorstel)*
- na 2 landen de doorlooptijd van een nieuw land > 30 dagen blijft, of
- speeltests laten zien dat kinderen na 1 sessie niet terug willen.
