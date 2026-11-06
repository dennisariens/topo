# NINO 2.0: speelbare kandidaat, 6 november 2026

**Status: klaar voor eigenaarbeoordeling. Geen release-GO. Geen merge, deploy of publicatie.**

- Geteste implementatie: `aa9b3e9fb7f83fd40f88a386cd019614985fb9aa`. De commit erna bevat alleen documentatie en bewijs.
- Zelfstandige HTML: `output/html/NINO-2-Proefversie-2026-11-06.html`, 41.415.295 bytes.
- SHA256: `616cfdc860cef8ad0ea9d113974c5c99b7da2a6f901fa704fd5a51cf226051f1`. Byte-identiek aan `index.html` en de kandidaat-aliassen.
- Demosave: `output/demo/NINO-2-DEMO-vlak-voor-derde-pizza.json`, SHA256 `dfe9f46d2b8711ab65aaaa38d1194296ea1d52989d4661e37c3e459e0ee57b6c`.
- Korte opname: [video/nino-kandidaat-doorloop.webm](video/nino-kandidaat-doorloop.webm).

## Zo speel je het

1. Open de HTML. Eerste start toont de onboarding.
2. Voor de derde pizza: kies onderaan het Reis-scherm **Zet reservekopie terug** en daarna de demosave. Dit vervangt de lokale voortgang.
3. Kies **Ga verder · Steden 1–6** en geef het juiste antwoord op de open schrijfvraag.

### Wat uit de demosave komt

| Veld | Waarde in de demosave |
| --- | --- |
| Pizza's, punten, goede antwoorden, ritten | 2, 7 van 8, 23, 0 |
| Halte 1 | Ontdekken en Aanwijzen staan op afgerond; Namen schrijven 5 van 6 gedaan |
| Profiel | `DEMO-save`, favoriet Salami, oude kleurwaarde `lemon` |

Dit is synthetische voortgang, niet echt gespeeld. Alleen het laatste antwoord is echt: het levert 3 pizza's, 0 punten, 1 rit en 24 goede antwoorden op. De standaardapp laadt dit bestand nooit zelf.

## Per afspraak

Status betekent: **T** technisch werkt, **V** visueel tegen benchmark bekeken, **E** door eigenaar geaccepteerd.

| ID | Referentie | Bewijs | Status |
| --- | --- | --- | --- |
| MAP | `docs/visual/discovery-map/owner-benchmark.png` (#22, #35) | [compare-map-same-scale.png](compare-map-same-scale.png) | T, V; E open |
| PIZZA | #28, PR #29 | [box](chrome-10-third-pizza-box.png), [opgeslagen pizza's](chrome-390-saved-pizzas-FIXTURE.png), [echt verdiend](chrome-04-first-pizza-real.png) | T, V; E open |
| START | #20, tegel Onboarding in de benchmark | [start](chrome-01-onboarding-start.png), [reactie](chrome-02-onboarding-reaction.png) | T, V; E open |
| BOEK | [`passport-open-book.png`, commit 367b875](https://github.com/dennisariens/topo/blob/367b875/assets/nino/travel-passport/book/masters/passport-open-book.png) (#21) | [spread](compare-book-spread.png), [telefoon](compare-book-phone.png) | T, V; E open |
| RIT | #54 | [vertrek](chrome-11-ride-departure.png), [route](chrome-12-ride-route.png), [aankomst](chrome-13-ride-arrival.png), [statisch](chrome-17-reduced-motion-arrival.png) | T, V; E open |
| MOMENT | #21 | [stempelmoment](chrome-15-stamp-moment.png), [juiste pagina](chrome-16-book-stamp-spread.png), [Vespa-pagina](chrome-14-book-vespa-page.png) | T, V; E open |

## Keuzes in deze ronde

- **Kaart:** de Ontdekkingskaart blijft. Buurlanden wijken naar perkament, Italië houdt het echte DEM-reliëf, de zee is dieper blauw. Alleen verf op dezelfde paden; `scripts/discovery-map.css` en `.js` zijn ongewijzigd. Formele toetsen blijven rustig.
- **Benchmark boek:** de open-boekrender is alleen beeldreferentie. QA #45 markeerde die als niet geschikt als runtime-achtergrond, dus de pagina's blijven de goedgekeurde folio's. De witte vlakken zijn weg; tekst en stempels staan op het papier. Leer en messing zijn CSS.
- **Folio's:** stempelpagina's gebruiken de rustige linkerfolio gespiegeld, omdat rechts het geschilderde dorp onder de stempelrijen viel. Gemeten contrast op de donkerste 5% van het schrijfvlak: inkt 7,96 en 8,64; zachte tekst 5,01 en 5,44.
- **Rit:** de achtergrond is het linkerdeel van de goedgekeurde kustscène, waar geen ingebakken Nino staat. De route is verhalend en bewust geen landkaart, zodat de rit tijdens een oefening geen ligging verklapt.
- **Boekkleur:** de bediening is weg. `coverColor` blijft ongemoeid in het profiel staan, zodat oude back-ups gelijk blijven en nieuwe back-ups door oudere versies leesbaar zijn.

## Verificatie

Op HTML `616cfdc8…`, Node 25.8.2, Chrome 157.0.8103.38 en WebKit 27.2, offline `file://`:

- `release-check.log`: build, lint, 18 testcommando's en release-audits geslaagd; 50 `node:test`-tests, 0 fouten. Nieuw: `scripts/nino-moments.test.mjs`, 5 tests.
- `audit-nino-v2.log`: rest van het oorspronkelijke HTML-bestand bytegelijk.
- `chrome-candidate.json`, `webkit-candidate.json`: speelronde PASS, 0 JS-/consolefouten, 0 externe verzoeken.
- `all45-chrome/`, `all45-webkit/`: 45 objecten in beide kaartstijlen. Dit zijn huidige-vraagfixtures met echte muis en invoer.
- Echt gespeeld vanaf leeg profiel: onboarding, kaartkeuze en de eerste halte door alle drie de fasen met 12 goed, 1 pizza, 4 punten en 1 stempel.
- Herladen na rit en stempel: geen dialoog, geen uitnodiging, zelfde beloningen.
- F1, boek openen en sluiten: zelfde vraag, concept en selectie op 1500, 1180, 768, 390 en 320 breed.
- Fixture: het scherm met twee opgeslagen pizza's op alle breedtes zet `state.pizzas=2`.

### Aangepaste bestaande tests

De tests in `pizza-reward`, `nino-art`, `ui-smoke`, `nino-profile` en `nino-experience` legden het oude gedrag vast: pizza op timer, korte rittoast, kleurkeuze en oude knoptekst. Ze controleren nu het gevraagde gedrag. Geen controle op score, beloning of geografie is verzwakt. `qa-computer-release.mjs` sluit tussen fixtures de pizzadialoog en gebruikt de knop **Overslaan**. `scripts/qa-nino-playable.mjs` hoort bij de vorige ronde en is vervangen door `scripts/qa-nino-candidate.mjs`.

## Open

- Eigenaarbeoordeling van alle zes onderdelen en onafhankelijke Hermes-review.
- De aankomstillustratie is voor elke bestemming dezelfde kustscène; alleen de naam wisselt.
- Eén stempel en één Gold-pad zijn in tests gedekt. Gold is hier niet in de browser verdiend.
- De artwork-auditwaarschuwing en het ontbrekende grote appicoon blijven apart open.
- Niet getest: echte Safari, fysieke iPad, schermtoetsenbord, VoiceOver, echt printen.
- Echte Pisa-scharnieranimatie: buiten deze ronde.

## Herhalen

```sh
npm ci --ignore-scripts
npm run release:check
node scripts/audit-nino-v2.mjs
PLAYWRIGHT_MODULE=/pad/naar/playwright/index.mjs node scripts/qa-nino-candidate.mjs
QA_BROWSER=webkit PLAYWRIGHT_MODULE=/pad/naar/playwright/index.mjs node scripts/qa-nino-candidate.mjs
PLAYWRIGHT_MODULE=/pad/naar/playwright/index.mjs node scripts/qa-nino-compare.mjs
```
