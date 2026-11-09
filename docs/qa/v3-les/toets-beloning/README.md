# GE01-K01: de toets die antwoordt, sluit geen beloning (Hermes-REWORK op `1a42590`)

**Bevinding (Hermes, issue #76, bewijs `qa/v3-app-1a42590` @ `f4aa376`).** Met `prefers-reduced-motion` en één Enter op het antwoord dat een pizza vol maakt, klikte dezelfde Enter op **Verder** in de net geopende pizzadialoog. De verdiende pizza ging meteen dicht.

**Oorzaak.** V2 kijkt het antwoord na tijdens `keydown`, zowel in `#answer` als op de kaartdoelen. In dezelfde stap opent V2 de dialoog en zet de focus op de knop. Daarna maakt de browser van diezelfde toetsaanslag een klik (`detail 0`) op het element dat dan focus heeft: de nieuwe knop.

**Fix, alleen in de V3-laag** (`scripts/v3/les.js`; de V2-motor en `index.html` zijn ongewijzigd):
- Zolang Enter of spatie is ingedrukt, laat V3 een echte toetsenbordklik (`detail 0`) alleen door als die valt op het element waar de toets begon.
- Een klik op een ander element wordt genegeerd.
- Na het loslaten werkt elke volgende toets of klik gewoon.
- Een impliciete formulierverzending (hetzelfde formulier) blijft toegestaan.
- Kliks die V3 zelf op V2-knoppen geeft, zijn niet "trusted" en vallen erbuiten.
- De regel geldt voor elk moment dat zo opent: pizza, Vespa-rit, stempel en goud.

**Kandidaat:** preview SHA256 `71c2f49bf65ae04e9a1908bd7661cf8889562c0af4b3f582fd9cacfdfc4131d4` (50.200.591 bytes, +1.146 bytes t.o.v. `1a42590`); `index.html` byte-gelijk.

## Regressietest

`python3 scripts/qa-v3-toets-beloning.py`. Twaalf runs: drie scenario's × Enter of klik × met of zonder verminderde beweging. Chrome 157, 1440 × 900. Een gebeurtenissenlog legt elke toets, klik (met `detail`, `isTrusted` en "door V3 genegeerd") en dialoogsluiting vast.

| Scenario | Wat | Momenten (alle 4 runs) |
| --- | --- | --- |
| `pizza-hermes` | Precies het pad van Hermes: `#nieuw`, Ontdekken, 6 × Aanwijzen met Enter, 1 schrijfvraag; daarna het 8e beloonde antwoord met **één Enter** óf **klik op Controleer** | pizza |
| `bezig` | `#bezig`, hoofdstuk 2: Aanwijzen → Namen schrijven, alles met Enter (of klik), ook **Volgende** en de dialoogknoppen | pizza 1→2 en 2→3, Vespa-rit 0→1, stempel |
| `goud` | `#afgerond`, Extra steden 13–18 → ★ Goud | pizza, goud |

**Resultaat** (`results.json › summary`):
- `hermesReproPizzaStaysOpen: true`;
- `everyMomentSeen: {}`, `momentsClosedByKey: {}`, `keyClicksLeaked: {}`;
- `keyClicksDropped: 4`: precies de vier toetsaanslagen die anders zouden doorlekken;
- 0 fouten.

**Negatieve controle:** dezelfde test op de preview van `1a42590` (`23dced34…`, zonder de fix) faalt (`controle-1a42590.json`):
- `pizza-hermes`, Enter en verminderde beweging: de pizza gaat dicht door **Verder** ([screenshot](controle-1a42590-pizza-Enter-reduce.png)). Dit is de bevinding van Hermes, gereproduceerd.
- Ook **zonder** verminderde beweging landt de toetsklik op **Verder**.
- `bezig`: bij de derde pizza startte dezelfde Enter ongevraagd de Vespa-rit (**Start de Vespa-rit**).

**Niet getest:** WebKit (niet in deze omgeving; Hermes zag het lek ook in WebKit), echte iPad Safari, VoiceOver, en externe toetsenborden met key repeat.
