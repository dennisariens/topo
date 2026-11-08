# NINO 2.0: UX-ronde, 7 november 2026

**Status: klaar voor eigenaarbeoordeling. Geen release-GO. Geen merge, deploy, publicatie of vervanging van de bestaande download.**

- Zelfstandige HTML: `output/html/NINO-2-Proefversie-2026-11-07.html`, 41.425.156 bytes.
- SHA256: `14e5a095de69fde1535f132c76af8cde816ae45fa16844b2a098421e56ee0c8f`. Byte-identiek aan `index.html` en de kandidaat-aliassen. De HTML van 6 november blijft ongewijzigd naast deze staan.
- Demosave (ongewijzigd): `output/demo/NINO-2-DEMO-vlak-voor-derde-pizza.json`, SHA256 `dfe9f46d2b8711ab65aaaa38d1194296ea1d52989d4661e37c3e459e0ee57b6c`. Twee pizza's, 7 van 8 punten, 0 ritten. Synthetisch, niet gespeeld.
- Opname van de Vespa-overgang: [GIF](video/chrome-vespa-overgang-volledig.gif), [webm](video/chrome-vespa-overgang.webm).

## Besluiten van de eigenaar en wat er veranderd is

| # | Besluit | Uitvoering |
| --- | --- | --- |
| 1 | Een reisles blijft onder **Reis** | De actieve tab volgt de gekozen route: een les uit de reis (`state.mode` route) houdt **Reis** actief, vrije oefenvormen markeren **Oefenen**. **Oefenen** vanuit of naast een reisles opent vrije oefening (de laatst gebruikte vorm). Een onderbroken reisles komt via **Reis → Verder** terug op dezelfde vraag, antwoordtekst en selectie; een onderbroken vrije oefening via **Oefenen**, zoals F1. Ook het resultaatscherm komt via **Verder** terug. |
| 2 | Kennismaking één keer opnieuw | Wie de eerste onboarding overslaat, krijgt bij de eerste reisles de keuze **Maak kennis met Nino** of **Start meteen**. Beide openen daarna de gekozen les. De stand staat in `topo-nino-intro-v1` (`skipped` → `offered` of `done`), los van voortgang en back-ups. Na de tweede aanbieding verschijnt die niet meer, ook niet na herladen. Afgeronde kennismaking, oudere profielen en bestaande reisvoortgang gaan direct door. Naam en pizza blijven via **Reisboekje → Pas mijn boekje aan** te bewerken. |
| 3 | Alleen de Schoolkaart | Het menu **Kaartstijl** is verborgen en het kaartthema staat altijd op `school`, ook in Ontdekken en Leren. **Schoolblad bekijken** blijft. Een opgeslagen voorkeur `discovery` blijft in de opslag staan maar valt veilig terug; les en voortgang blijven gelijk. `scripts/discovery-map.js/.css` zijn ongewijzigd; `window.NINO_DISCOVERY_MAP=true` vóór het laden zet de keuze terug (de bestaande atlastests gebruiken dit). |
| 4 | Eén pizzameter | Nieuwe `#ninoMeter` op basis van de grote pizza-illustratie: punten voor de volgende pizza, de gespaarde pizza's als illustraties en de afstand tot de rit (**Nog één pizza tot je Vespa-rit** bij twee). Desktop: bovenaan het zijpaneel. iPad en telefoon: onderin het antwoordvel, altijd in beeld. De oude compacte lesmeter en de zijpaneelmeter staan nog in de DOM maar zijn verborgen; **Reset pizza's** blijft. Beloningsregels zijn ongewijzigd. |
| 5 | Duidelijke start van de rit | Op de derde pizzadoos staat **Start de Vespa-rit**; bij de eerste en tweede blijft **Verder**. Vertrek, rit, aankomst, **Overslaan**, directe aankomst bij verminderde beweging, **Bekijk in Reisboekje** en de terugkeer naar de les zijn ongewijzigd. |
| H | Hermes: pijltjestoetsen na profielbewerking | Gereproduceerd in Chrome: na **Bewaar** of **Annuleren** bouwt het boek zijn pagina opnieuw op en verdwijnt de focus uit het boek, waardoor pijltjestoetsen niets deden. Na bladeren gebeurde hetzelfde bij een tweede pijltjestoets. Nu krijgt **Pas mijn boekje aan** de focus terug, en na elke nieuwe opbouw blijft de focus in het boek (**Volgende**, anders **Vorige**). |

## Zelf gespeeld (Chrome 157.0.8103.38, offline `file://`)

`scripts/qa-nino-ux-round.mjs` speelt de routes met echte muis, toetsenbord en invoer. Logboek: `chrome-play.log`, `chrome-ux-round.json`. 0 JS-/consolefouten, 0 externe verzoeken.

**A. Leeg profiel (1180×820).** Onboarding overgeslagen ([A1](chrome-A1-onboarding.png)). **Reis → Ga verder** toont de tweede aanbieding ([A2](chrome-A2-second-offer.png)). **Start meteen** opent Ontdekken met **Reis** actief en de Schoolkaart ([A3](chrome-A3-discover-under-reis.png)). Ontdekken kent geen antwoorden, dus de zes plekken bekeken en via het resultaatscherm Aanwijzen gestart. Napels goed aangewezen: de enige meter gaat van 0 naar 1 van 8 ([A5](chrome-A5-point-correct-meter.png)), **Reis** blijft actief. Na herladen: geen onboarding en geen aanbieding meer, **Reis** actief. In het Reisboekje naam en pizza aangepast ([A7](chrome-A7-profile-edit.png)). Na **Bewaar** én na **Annuleren**: twee keer →, twee keer ← terug naar 1–2.

**B. Demosave (1180×820, opgenomen).** Na het terugzetten en **Ga verder**: geen aanbieding (bestaande reisvoortgang), meter 7 van 8 met twee pizza's en **Nog één pizza tot je Vespa-rit** ([B1](chrome-B1-announcement.png)). Eén echt goed geschreven antwoord: 3 pizza's, 0 punten, 1 rit, 24 goed. Doos met **Start de Vespa-rit** ([B3](chrome-B3-box-start-ride.png)) en daarna vertrek, rit en aankomst ([vertrek](chrome-B4-ride-depart.png), [rit](chrome-B4-ride-ride.png), [aankomst](chrome-B4-ride-arrived-settled.png)). **Verder** keert terug naar de les met 0 van 8 en **Nog drie pizza's**. Herladen en het Reisboekje openen kennen niets opnieuw toe.

**C. Verminderde beweging (768×1024).** **Start de Vespa-rit** gaat direct naar de statische aankomst ([C1](chrome-C1-reduced-motion-arrival.png)).

**D. Overslaan.** Tijdens het vertrek naar de aankomst en daarna terug naar dezelfde vraag.

**E. Leesbaarheid van de meter**, met de demosave: 320×740, 390×844, 768×1024, 1024×768, 1180×820 en 1500×950 ([320](chrome-E-meter-320.png), [390](chrome-E-meter-390.png), [768](chrome-E-meter-768.png), [1024](chrome-E-meter-1024.png), [1180](chrome-E-meter-1180.png), [1500](chrome-E-meter-1500.png)). Overal precies één zichtbare meter, geen afgekapte tekst, kleinste letter 12,5 px. Op telefoon en iPad zichtbaar zonder scrollen.

## Controles

- `release-check.log`: build, lint, alle 18 testcommando's en release-audits geslaagd (`release:check exit 0`). `audit-nino-v2.log`: exit 0.
- Nieuw: `scripts/nino-ux-round.test.mjs`, 8 tests voor tab, tweede aanbieding (beide keuzes, herladen, uitzonderingen), Schoolkaart, meter, ritknop en boektoetsen.
- Eén instabiliteit tijdens de bouw gevonden en verholpen: de vrije toets kon toevallig dezelfde plek kiezen als de onderbroken reisvraag, waarna **Verder** de reisweergave herstelde in toetsmodus. De herstelcontrole vergelijkt nu ook de modus; regressietest toegevoegd.

### Aangepaste bestaande tests

- `focus-mode.test.mjs` (F1): een reisles keerde terug via **Oefenen**. Volgens besluit 1 keert ze nu terug via **Reis → Verder**; zelfde vraag, concept, selectie, voortgang en opslag worden nog steeds exact vergeleken.
- `discovery-map.test.mjs` zet `NINO_DISCOVERY_MAP=true`, zodat de bewaarde atlascode getest blijft.
- `pizza-reward.test.mjs` en `nino-moments.test.mjs`: extra controle op de knoptekst.
- `focus-source.mjs` en `playable-source-pins.json`: hashpins van de gewijzigde NINO-bronnen bijgewerkt, zoals in eerdere rondes.

## Open

- Eigenaarbeoordeling van deze vijf punten en onafhankelijke Hermes-review.
- WebKit niet gedraaid: de lokale Playwright 1.58.2 vraagt WebKit-build 2248, geïnstalleerd is 2370. Geen echte Safari, fysieke iPad, schermtoetsenbord of VoiceOver.
- Op telefoon verdwijnt de meter alleen zolang het schermtoetsenbord open staat bij een schrijfvraag, net als de knoppen nu al. Na het antwoord is hij weer zichtbaar.
- In Ontdekken op desktop kan de bestaande Rome-uitleg verschijnen als de muis na een klik boven Rome blijft staan. Dat is bestaand hovergedrag en niet veranderd.
- Ongewijzigd open uit eerdere rondes: zelfde aankomstillustratie voor elke bestemming, artwork-auditwaarschuwing, groot appicoon, echte Pisa-scharnier, echt printen.
- Harness #73/#74 bewust niet aangeraakt.

## Herhalen

```sh
npm ci --ignore-scripts
npm run release:check
node scripts/audit-nino-v2.mjs
PLAYWRIGHT_MODULE=/pad/naar/playwright/index.mjs node scripts/qa-nino-ux-round.mjs
```
