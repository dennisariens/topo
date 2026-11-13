# Playbook — Nieuw land in 14 dagen

> "Over 2 weken volgt Japan." Dit is de procedure die dat waarmaakt.
> **Voorwaarde:** M1 is klaar (kern + landpakket-contract) en het playbook is minstens één keer gelopen (FR, in M2). Daarvóór is 14 dagen niet realistisch, en dat zeg ik dan ook eerlijk in G0.

## Wat "een land" is
Een **landpakket** `src/lands/<id>/`: pure data en assets, geen kerncode (zie `ARCHITECTUUR.md` §3).
| Onderdeel | Inhoud |
|---|---|
| `manifest.json` | id, naam, versie, status (`draft`/`live`), aantallen, hashes |
| `geo/` | projectie, geometrie, contextland, ankers, met bron, licentie en hash |
| `items.json` | plekken (steden, rivieren, gebergten, wateren, regio's) met id, type, namen en aliassen |
| `route.json` | hoofdstukken, groepen, volgorde |
| `schoolblad/` | werkbladfoto of -kaart (als die er is) |
| `art/` | achtergronden, scènes, hoofdstukbeelden, stempels, postkaarten, landmarks |
| `boek.json` | inhoud van het Reisboekje |
| `README.md` | bronnen, keuzes, open punten |

Plus buiten het pakket: een **websitepagina** per land en de **build** (één HTML per land) op de productie-URL.

## Tijdlijn
| Dag | Fase | Wie | Gate / output |
|---|---|---|---|
| D0 | **G0 Richting**: Dennis zegt "Japan" | Dennis + Claude | `templates/LAND_G0.md` ingevuld: doelgroep/curriculum, aantal items, deadline, kill-criterium |
| D1 | Curriculum en itemlijst: welke plekken leren kinderen echt (toetslijsten, schoolatlas)? | Claude (research) | `items.json` concept plus bronnenlijst |
| D1–2 | Geometrie: betrouwbare bron (Natural Earth of OSM, met licentie), projectie, ankers, validatie | Claude/builder | geometriecheck 100%, hashes |
| D2 | **Artwork-brief**: Nino in Japan (thema-object zoals pizza/Vespa voor Italië), scènes, landmarks, stempels | Claude (design-lead) | brief plus moodboard → **G1 Dennis** (1 moment) |
| D3–8 | Artwork genereren en verfijnen in batches op `art/master` | art-pijplijn | batches met SHA256 |
| D3–6 | Route, hoofdstukken, aliassen (inclusief geldige schrijfvarianten), Reisboekje-teksten | builder | manifestcheck groen |
| D6–9 | Integratie: pakket in de build, flag `draft`, preview-URL | builder + evaluator | G2 per taak |
| D9 | **Artwork-goedkeuring**: alles in één keer, op de preview | Dennis | G1 (2e en laatste moment) |
| D10–11 | Websitepagina: hero, wat leer je, screenshots, download/speel-link, landkiezer | builder | preview |
| D11–12 | **G3**: volledige QA, iPad 9, offline, speeltest met 2 kinderen, Hermes | evaluator + Hermes | releasekandidaat |
| D13 | Fixes uit G3 | builder | — |
| D14 | **G4 Live**: Dennis akkoord → tag `<id>-1.0.0` → productie | Dennis | live-URL, aankondiging (concept) |

**Contactmomenten voor Dennis: 4** (G0, artwork-brief, artwork-goedkeuring, G4). Doel na 3 landen: 3.

## Kritieke pad en risico's
- **Artwork** is het langste traject. Start op D2 en houd het parallel aan de rest.
- **Geodata-licenties**: alleen bronnen die commercieel gebruik toestaan (Natural Earth = public domain). Leg de licentie vast in het manifest.
- **Schrift en namen** (JP, en eventueel CN of RU later): Nederlandse exonymen als primair antwoord, lokale namen als alias of extra info. Leg vast in G0.
- **Curriculum**: geen verzonnen geografie. Elk item heeft een bron.
- **Taal van de app**: dit playbook gaat over Nederlandse kinderen die een nieuw land leren. Een app in een andere taal (bijv. Duitse kinderen) is een aparte as: i18n van de kern. Dat is een eigen mijlpaal.

## Generatoren (gebouwd in M3, maken dit 14 → 7 dagen)
- `scripts/land/new.mjs <id>`: maakt de skeletmap en het manifest
- `scripts/land/geo-import.mjs`: bron → projectie → geometrie plus hashes plus validatierapport
- `scripts/land/art-brief.mjs`: genereert de artwork-brief uit items en hoofdstukken
- `scripts/land/site-page.mjs`: websitepagina uit manifest en screenshots

## Na afloop
Retro van het land: wat kostte meer dan gepland? Lessen gaan naar `LEARNINGS.md`, en dit playbook wordt bijgewerkt. **Elk land maakt het volgende sneller**, anders werkt het playbook niet.
