# TOPO / NINO — kaartkeuze-ontwerpen (30 oktober 2026)

**Status:** eigenaar heeft de bestaande, geïmplementeerde selecties op Schoolkaart en Ontdekkingskaart visueel goedgekeurd. De geïmplementeerde actuele runtime staat in [PR #59](https://github.com/dennisariens/topo/pull/59) en is geïntegreerd in de offline computerkandidaat [PR #61](https://github.com/dennisariens/topo/pull/61), commit `bd4daceed08e2d86c5940c858e08fd93983f190c`.

**Ontwerp-preview:** [Open de zelfstandige interactieve HTML](index.html). Deze aparte referentie laat zes gevallen zien (Rome/Vaticaanstad, Napels/Vesuvius, Catania/Etna, Bologna/Modena, Milaan/Varese, Firenze/San Marino) met source-gebaseerde onderlinge richting en neutrale omwisselbare nummers. De illustratieve stads-/microstaatmarkeringen zijn uitdrukkelijk **niet op schaal** of juridisch grensmateriaal. De originele, in ChatGPT gemaakte preview inspireerde deze referentie; dit Git-bestand is een zelfstandig gereconstrueerde versie en geen claim van byte-identiteit met de chatdownload.

**Belangrijk onderscheid:**
- Het functionerende selectorontwerp en de daadwerkelijke Schoolkaart-/Ontdekkingskaart-renders zijn al in de *appcode* van #59 en #61 gecommit.
- De standalone preview dient uitsluitend als controleerbare ontwerpdocumentatie; zij is geen vervangende kaart, geen uitrol naar de leerling en geen nieuwe bron van beoordeelde kaartgeometrie.
- De schilderachtige premium Ontdekkingskaart (L'Atlante di Nino) is **nog niet geïmplementeerd**; dat blijft apart onder [issue #35](https://github.com/dennisariens/topo/issues/35), uitgesteld tot na P0.
- Actuele release is nog draft/QA; Hermes' onafhankelijke eindacceptatie van exact PR #61-releasemateriaal staat los van de visuele goedkeuring.

**Regel:** origineel bronkaartvlak, 27 geprojecteerde puntankers, 45 objecten, 11 hoofdstukken, Gold, scoring, opslag, offline gedrag en toetsneutraliteit blijven onaangetast. Werk niet opnieuw aan deze ontwerpen zonder aantoonbare functionele of geografische regressie.
