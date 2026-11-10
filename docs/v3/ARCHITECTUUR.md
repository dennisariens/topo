# Eén V3-runtime — migratievoorstel

**Status:** voorbereiding vanaf `68bb5ae` (10 november 2026), geen runtimewijziging. Start na geaccepteerde V3.0 en Hermes-hertest; de visuele herziening blijft van Claude Code. Gedragsbasis: `tests/characterization/`, `DECISIONS.md`, `MAP_SYSTEM.md`, `V3_0_REST.md` en `renders/README.md`. Behoud bestaande saves én reservekopieën.

## 1 · Doel en grenzen

Eén applicatiestatus, één navigatiepad, één beoordelaar en één live kaart. Bronmodules blijven klein en dependencyvrij; geen framework, backend of generieke eventbus nodig. Onderstaande namen zijn voorgestelde bronlocaties, geen nieuwe code in deze levering.

| Module | Eigen verantwoordelijkheid; herkomst uit de huidige app |
| --- | --- |
| `src/map/` | Eén catalogus met 45 IDs, groepen, 11 hoofdstukken, geometrie en ankers; uit `ITEMS`, `GROUPS`, `ROUTE_CHAPTERS`, `italy`, `CONTEXT_LAND`, `NAME_ANCHORS`. Bestaande hashes/provenance en 890×1235-projectie blijven leidend. Geen tweede coördinatenbestand. |
| `src/learning/` | Naamnormalisatie/aliassen, beoordeling van gekozen IDs, route, herstelvragen, 6-vragenpauzes, goud, skillplanning en paspoortquery. Uit `norm/check/grade/routeGrade`, `TopoRoute`, `TopoLearning.session/draw` en het huidige paspoort. Zuivere functies op expliciete data en klok/seed; geen DOM of opslag. |
| `src/rewards/` | 8 punten/pizza, 3 pizza’s/rit, smaakvolgorde en beloningstokens/idempotentie. Uit `TopoLearning.award/journey` en de tokenregel in `TopoRoute.answer/restore`. De opgeslagen locatie `route.rewardTokens` blijft compatibel. `TopoPizza` tekenen/animatie gaat naar UI; voorkeurspizza blijft cosmetisch. |
| `src/storage/` | Valideren, lezen, atomair vastleggen, migreren, reservekopie en resets; uit `persist`, `progressSnapshot`, import/export, `TopoLearning.migrate`, routevalidatie en `TopoProfile.commitImport`. Alleen hier localStorage en schema-/sleutelkennis. |
| `src/ui/` | Eén shell, schermen, componenten en bootstrap. Uit V3 Reis/Les/Shell/Toets/Voortgang/Kennismaking, V2 invoer/feedback, `map-hit`, Focus/Schoolblad en `TopoBook`. UI-kaartadapter gebruikt echte SVG/CTM voor hitdetectie; de leerlogica ontvangt uitsluitend de gekozen ID. |

**Afhankelijkheden:** UI-bootstrap roept learning, rewards, storage en kaartdata aan. Learning mag de zuivere beloningstokenregel gebruiken; storage gebruikt domeinvalidatie, nooit UI. Kaartdata/rewards lezen geen DOM of opslag. Importcycli zijn niet toegestaan; bij extractie afdwingen met één importcheck, nu nog geen architectuurtool toevoegen.

Een antwoord levert één expliciete uitkomst: beoordeling, vaardigheids-/dagdoelmutatie, routeovergang en eventuele beloning. Een toets telt wel voor het dagdoel, nooit voor pizzapunten, ritten of goud. Correcte stage-/goudreplay telt voor het dagdoel maar krijgt geen tweede token. Meerdere schermen mogen deze feiten alleen projecteren.

**UI-grens:** één gedeeld frame met geïntegreerde zijbalk/rail/tabbalk, volgens de laatste regels in `renders/README.md`. Landschap: Reis, Oefenen, Les, Toetsresultaat, Beloningen. Werkblad: Voortgang, Toets instellen, Instellingen. Schermen componeren Kaart, Taak/Antwoord, Feedback, Beloningsmoment, Reisboekje, Toetsuitslag en Paspoort. Tokens beheren frame, raster, inkt, type en interactiestatus op één plaats; geografische verf en assets blijven apart. Schoolblad blijft de afzonderlijke originele foto, geen kaartprojectie.

<!-- pagebreak -->

## 2 · Extractie, compatibiliteit en meten

**Wat verdwijnt:** de verborgen V2-header/tabs/routekaarten, dubbele chrome, gekloonde interactieve bediening, DOM-uitlezen als datamodel en V3 die verborgen knoppen indrukt of functies overschrijft. Ook de `Blob`- en importstatus-wrappers verdwijnen: opslag krijgt een expliciete export-/importuitkomst. Eén antwoordveld behoudt vraag, tekst, selectie en focus bij navigatie. `TopoBook` wordt een leescomponent op echte voortgang; het kent geen nieuwe beloningsregels.

**Offline build:** behoud de bestaande Node-buildaanpak met expliciet geordende bronbestanden, inline scripts/styles en hash-gecontroleerde WebP/data-URI-assets. Geen externe runtime, netwerkfonts of runtime-imports. Eén downloadbare HTML, ook via `file://` bruikbaar. De bestaande V2-HTML blijft tijdens de migratie de bevroren referentie; pas bij een afzonderlijk integratiebesluit wordt de nieuwe gegenereerde HTML de levering. Deze opdracht verandert `index.html` niet.

**Kleine stappen, ieder afzonderlijk beoordeelbaar:**

1. V3.0 laten afronden/goedkeuren; deze karakterisering opnieuw draaien op die pin. De geannuleerde-importafwijking uit de overdracht eerst laten beslissen/herstellen door de eigenaar van de V3-laag. Een bewuste gedragswijziging krijgt een expliciete nieuwe verwachting.
2. Catalogus en pure learning/rewards uit de bevroren code extraheren; aanvankelijk dezelfde publieke functies en resultaatvormen. Testharnas krijgt een kandidaatadapter, dezelfde gedragsorakels. Nog geen verandering van UI of persistente vorm.
3. Opslag achter één grens brengen. Behoud `topo-italie-v3` schema 3, route 1→2, profiel schema 1, introstatus, en `topo-v3-toetsen-v1` schema 1 (maximaal 10, nieuwste eerst). Envelope `app/version` blijft gelijk; oude kopie zonder `v3Toetsen` behoudt lokale uitslagen, nieuwe kopie blijft door V2 leesbaar. Volledige validatie vóór bevestiging; alle onderdeelmutaties pas na geslaagde commit, met rollback bij opslagfouten.
4. Scherm voor scherm de V3-componenten rechtstreeks op de status aansluiten: Les/feedback → Reis/Oefenen → Toets/Voortgang → boek/instellingen. Verwijder de bijbehorende verborgen V2-DOM pas als beide adapters dezelfde tests doorstaan. Geen blijvende dubbele status of twee schrijvers.
5. Volledig nieuw offline bestand vergelijken met de referentie: karakterisering, oude regressies, echte browserflows, reload/import en fysieke iPad. Pas na eigenaar/Hermes-akkoord de oude assemblage en adapters verwijderen; rollback met dezelfde saves blijft mogelijk.

**Meetpunten per stap:**

| Risico | Meetwijze en gate |
| --- | --- |
| Grootte/assets | HTML-bytes, gzip en asset-/data-URI-inventaris vergelijken. Referentie: index 41.445.845 bytes; bestaande V3-preview 50.255.820 bytes. Verklaar iedere groei; bewaak de bestaande assetbudgetten. Geen stilzwijgende verdubbeling. |
| iPad-geheugen | DOM-nodes/kaartkopieën en geschatte gedecodeerde RGBA-bytes tellen; piekgeheugen en herhaald scherm-/boekwisselen op fysieke iPad/Safari meten. Geen heapwinst claimen op basis van bestandsgrootte of jsdom. Limiet vaststellen op het ondersteunde apparaat vóór integratie. |
| Opslagverlies | Oude/nieuwe back-ups in beide richtingen, cancel, corrupte data, quota en rollback; snapshots vóór/na en reload. Geen ongeautoriseerde of gedeeltelijke vervanging. |
| Gedrags-/UI-regressie | Karakterisering groen op referentie én kandidaat; vaste klok/seed. Daarnaast echte SVG-fill/stroke, touch/IME/selectie, offline downloaden en responsive/focus/contrast naast de goedgekeurde renders. Deze DOM-tests bewijzen geen browserlayout. |

## 3 · Landpakket en kern (na Italië volgt Frankrijk)

Besluit van 10 november 2026: na Italië volgt Frankrijk. De migratie legt daarom meteen één grens vast.

| Landpakket (`src/lands/<id>/`, per land) | Kern (landonafhankelijk) |
| --- | --- |
| Projectie, geometrie, context en ankers met hashes en provenance; plekken en IDs; hoofdstukken en groepen; namen en aliassen; schoolblad; artwork (achtergronden, scènes, hoofdstukbeelden, stempels, postkaarten); uitstapjes; reisboekje-inhoud | `src/learning`, `src/rewards`, `src/storage` en `src/ui`, inclusief tokens, frame en componenten. Één UI-palet; het land komt alleen binnen via artwork en data. |

- **Contract:** de kern kent geen land-ID's, geen namen en geen coördinaten. Een landpakket is pure data plus assets, met één manifest dat de kern valideert (aantallen, IDs uniek, hashes, verwijzingen compleet).
- **Build:** één HTML per land: kern plus één pakket. Een bundel met meerdere landen is een latere keuze.
- **Opslag:**
  - één profiel (naam, pizza, introstatus);
  - voortgang, route, toetsuitslagen en beloningen per land, onder `lands.<id>`;
  - het Reisboekje is een paspoort met per land een hoofdstuk.
- **Migratie Italië:**
  - `topo-italie-v3` schema 3 en `topo-v3-toetsen-v1` worden 1-op-1 `lands.it`; het profiel blijft;
  - oude saves en reservekopieën blijven inleesbaar (oud → nieuw), en een nieuwe kopie bevat het Italië-deel in de oude vorm zolang de V2-referentie bestaat;
  - geen gegevensverlies; de migratie is idempotent en draait pas na een geslaagde validatie.
- **Tests:** de karakterisering blijft op Italië. Een tweede pakket hoeft alleen de manifestcontrole en de gedeelde gedragstests te doorstaan.
