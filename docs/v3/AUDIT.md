# V3-basisaudit, 9 november 2026

Beperkt tot wat het eerste V3-ontwerp (Reis / hoofdstukkeuze) beïnvloedt.

## Basis

- **Branch** `codex/topo-v3`, gemaakt vanaf `f53dc0b0c8e12683b124d45bf154a368ef1dd5da` (V2-afsluiting, `codex/nino-v2-artwork-closure-67`). De branch bestond nog niet op de remote.
- **Voorouder gecontroleerd:** `v2.0.2` → `83ec1ce26681ab2fd4811952fd5d442c8dbd53ce` is voorouder van `f53dc0b` (`git merge-base --is-ancestor`).
- **Runtime:** `index.html` (41.445.845 bytes, SHA256 `3aced3c3…304f5a`), byte-identiek aan `TOPO-NINO-Computer-Release.html` en de downloads. Deze V3-oplevering wijzigt dit bestand **niet**.
- **Baseline-checks op `f53dc0b`:** `npm run lint`, `npm test` (alle programma's), `npm run build` slagen. Eén test (`nino-art.test.mjs`) vraagt commit `8a704cb` via `git show`; in een shallow clone moet die eerst worden opgehaald (`git fetch --depth=1 origin 8a704cb…`). Geen productfout.

## Wat werkelijk draait

Eén script-tag van 40 MB bevat artwork-data en daarna de app-lagen in deze volgorde: NINO ART → PIZZA REWARD → NINO FEEDBACK → app-kern → MAP HIT → NINO ART UI → SCHOOLBLAD → DISCOVERY MAP → FOCUS MODE → NINO V2. Voor V3 relevant:

- **Staat en motor:** `state.route`, `ROUTE_CHAPTERS`, `TopoRoute` (`record`, `unlocked`, `due`, `STAGES`, `start`) en `renderRouteHome` / `startRouteLesson` zijn globale bindings. Een presentatielaag kan ze lezen zonder een tweede bron.
- **V2-gedrag zit in klikonderschepping op `#journeyScreen`:** de eenmalige kennismaking, **Reis → Verder** (dezelfde vraag, tekst en selectie) en de bevestiging bij een andere les. Een V3-knop die rechtstreeks `startRouteLesson` aanroept, slaat dat over. Daarom drukt V3 de bestaande V2-knop in.
- **Leeg profiel:** zonder profiel opent de kennismaking direct bij start (`app-v2` r. 302). Dat blijft zo.
- **V2-Reis gemeten (1440×900 en 390×844):** de hoofdactie **Verder** staat op ±1000 px, dus op beide formaten onder de vouw. Erboven staan banner, titel, samenvatting en pizzastand. De elf haltes zijn een lange kolom gelijke kaarten.

## Ontwerp- en artworkbronnen die gelden

- **Tokens:** C+ (`scripts/nino-cplus.css`: forest `#073f3b`, paper/cream, teal, sun) en de knopregels van 7 november r2 (44/48 px, radius 12, terracotta `#b9502f` alleen voor de hoofdactie). Font: platformfont (SF Pro op Apple-apparaten); er is geen merkfont gekozen.
- **Artwork in de runtime (`NINO_V2_ART`):** 11 hoofdstukiconen, 11 stempels, Nino welcome/travel, Gold-zegel en Esploratore d'oro, drie Pisa-dozen en drie pizza's, aankomst, vier postkaarten en de achterkant, folio's en omslag. Voor het Reis-scherm gebruikt: hoofdstukiconen, welcome, travel, Gold-zegel (64), Esploratore d'oro (480) en de pizza-illustraties. Van alle 18 gebruikte beelden zijn de ingebedde bytes gelijk aan het bronbestand in de repo ([artwork-used.json](../qa/v3-reis/artwork-used.json)).
- **Alleen als asset, niet ingebouwd:** de 8 hoofdstukscènes, het Pisa-scharnier en de masters (#75). Het premium-appicoon ontbreekt nog steeds. Zie de [V2-afsluiting](../V2_AFSLUITING.md).
- **Routeprincipe (DECISIONS 6 november):** de rit is verhalend, geen landkaart, zodat ze geen ligging verklapt. De V3-route volgt dat.

## Open PR's die iets toevoegen

| PR | Voor V3 | Stand |
| --- | --- | --- |
| #75 artwork-closeout | Scènes, Pisa-scharnier, masters | Open; eigenaar voorwaardelijk akkoord, Hermes-QA open. Niet gebruikt. |
| #74 / #73 Harness V1/V2 | Controller voor Design → Review → Build → Verify | #74 heeft Hermes-**REWORK** (o.a. H1: `recover` negeert een actieve runner-lease). Niet overgenomen; de bestaande `npm`-commando's en een eigen QA-script zijn gebruikt. |
| #64 UX52 rustig desktop-leren | Bron voor **Leren** met de kaart centraal | Open kandidaat op een oudere basis; relevant voor stap 3. |
| #49 Scoperte, #6 appicoonspec, #42 roadmap | Beloningen en Voortgang | Bron, niet ingebouwd. |
| #69 C+ | Tokens | Al vastgepind in `nino-cplus.css`. |

Overige open PR's (#2, #7, #26, #29, #48, #59, #62, #63, #65, #66, #70, #72) zijn ingehaald of artwork-bron; zie de V2-afsluiting.
