# Overdracht V3.0 — bouw naar Codex (10-11)

Claude Code heeft tot donderdag geen ruimte meer. Codex neemt de bouw op `codex/topo-v3` over, vanaf `0dc0193` ("afwerking stap 1: wash, glas en typeschaal").

**Eén eigenaar per pakket:** Codex bouwt; Claude Code doet tot donderdag niets op deze branch. Lead design en review blijven in de chat, Hermes doet de QA.

## Al gedaan

- V3.0 functioneel: navigatie, Toets, Voortgang, kennismaking en schoolblad, plus de review-fixes.
- Fase A: frame, glas, viola, kaart zonder waas.
- Fase B: alle schermen volgens de doelbeelden.
- Importfix en resetbeleid (`636ba53`).
- Afwerking stap 1 (`0dc0193`): wash, glas en typeschaal, plus de check tekst ≥ 13 px.

**Stand 10-11, 20:30:** Claude Code pushte vóór de limiet nog `5d73aac`: kaart links, reliëf, Eiland, Toets, Beloningen en Voortgang. Daarmee zijn de stappen 1–3 hieronder grotendeels gedaan. Codex begint bij **stap 3b**.

## Nog te doen, in deze volgorde

1. **Afwerking stap 2, kaart:**
   - variant (a) Eiland is gekozen; verwijder variant (b);
   - de kaart vult haar rastervlak;
   - het reliëf krijgt diepte (hillshade, verzadiging ±1,15, slagschaduw);
   - check kaart ≥ 45% van het inhoudsvlak (Landschap).
2. **Afwerking stap 3, opbouw:** **kaart links, bediening rechts** op Reis, Oefenen, Les, Toets resultaat en Voortgang. Op Reis staat de hoofdstukkaart onderaan op het kaartvlak en de lijst rechts.
3. **Afwerking stap 4, per scherm:**
   - **Toets:** de score violet, gewicht 600, zonder kader en zonder zichtbare focusring; Nino vrij in een eigen rastervlak, met een overlap-check;
   - **Beloningen:** het boek is de knop (geen cirkel, geen "Open Reisboekje"); "Pizza 2" wordt "Pizza";
   - **Voortgang:** een grote kaart links; rijen op slot zonder balk; Toetsen binnen het frame;
   - **Les:** de kaart groter.
3b. **Kalibratie** (`renders/README.md` › "Kalibratie typografie en beeld"):
   - de gemeten typeschaal;
   - geen wash over het inhoudsvlak;
   - een warmer en dieper reliëf;
   - Voortgang met Eiland en alle 11 rijen;
   - het label "Toets" vrij, en de score in een glaskaart;
   - de checks op minimumgroottes.
4. **Master-assets:** `origin/art/master` `339c420` → de pijplijn `art/v3-render-assets` (manifest met SHA256, bron en status "eigenaar akkoord, Hermes open"; WebP op de maat van het gebruik). Daarna integreren volgens DECISIONS 2026-11-10 ("Master-assets"). **`art/master` niet mergen.** NINO-ONDERWEG is `vespa-rijdend` of `vespa-bagage`. De paspoortbeelden niet gebruiken.
5. **Bewijs:**
   - vergelijkingen in `docs/qa/v3-stijlbeeld/` (desktop 1440×900, iPad liggend, telefoon);
   - alle QA-scripts groen;
   - werk `docs/PROJECT_STATE.md` bij;
   - tot slot een hertestverzoek voor Hermes op de eindpin.

## Bronnen (in deze volgorde)

1. `docs/v3/renders/README.md`. Bij een conflict wint de **laatste** sectie: "Afwerking na fase B" en "Bijstelling eigenaar (10-11, middag)", met glas 72% plus vibrancy.
2. Daarna `docs/DECISIONS.md` (10-11), `docs/v3/DESIGN_AUDIT_V3_0.md` en `docs/v3/DESIGN_FEEDBACK.md`.
3. De doelbeelden: `docs/v3/renders/R-*.webp`.

## Harde regels

- `index.html` blijft byte-gelijk (SHA256 `3aced3c3…`).
- Gedrag en logica blijven ongewijzigd: acties lopen via de bestaande V2-knoppen en -functies.
- Echte geometrie; de geometriecheck blijft 46/46.
- Offline, toetsenbord, focus, verminderde beweging en contrast AA.
- Lint, test, build en alle QA-scripts groen.
- Eén commit per stap, push na elke stap; de preview niet committen.

## Ronde 2 (lead designer, 10-11, 22:15, na `bc05cc6`)

Stap 3b–5 zijn akkoord: de typeschaal is gemeten en doorgevoerd, de master-assets zitten in de pijplijn, Nino op de Vespa staat bij het toetsresultaat, en de QA is groen. Op ware grootte (1440×900, BG-03) komt het dicht bij de doelbeelden. Nog te doen, met één commit per punt:

1. **Standaardachtergrond BG-03 Kust** in plaats van BG-01. Kust ligt het dichtst bij de doelbeelden: de zee draagt de zwevende kaart. BG-01 en BG-02 blijven kiesbaar.
2. **Zijbalk:**
   - wit 70% met `saturate(.6)` achter de zijbalk, zodat het artwork daar geen kleurvlek (roze bloemen) meer geeft;
   - check: de tint van de zijbalk wijkt op alle drie de achtergronden maximaal ΔE 8 af van neutraal wit.
3. **Voortgang past in 1440×900:**
   - de kaart, de lijst (11 rijen) en de drie tegels Dagdoel · Pizza's · Vespa-ritten staan **volledig** in beeld zonder te scrollen;
   - Toetsen en het kennis-paspoort volgen onder de vouw, met een duidelijke rand, en nooit half afgesneden in de eerste weergave;
   - check: geen element van de eerste rij snijdt de onderrand van het frame.
4. **Reliëfkleur** zoals in de doelbeelden:
   - laagland warm geelgroen (richtwaarde `#A8C25A`), heuvels olijf, bergen bruin (`#8A5A3A`), sneeuw wit;
   - contrast 1,3; niet khaki, niet neon.
5. **Beloningen:** de iconen in de tegels 72 px en de cijfers 40/700; nu ogen ze nog klein.
6. Daarna: de vergelijkingen opnieuw, en de vergelijking van BG-03 erbij voor alle schermen. Push, en vraag in het afsluitende bericht een hertest door Hermes aan op de eindpin.

## Ronde 3: iPad-test van de eigenaar (11-11)

**Apparaat (de ondergrens):** iPad 9e generatie (3 GB RAM, 1080×810 pt), iPadOS 26.7.2, Safari.

Werk in deze volgorde, één punt per commit:
- alleen de QA van het gewijzigde scherm;
- één desktop-screenshot en één screenshot op iPad 1080×810 in `docs/qa/v3-stijlbeeld/final/`.

### P1: fouten
1. **Reis:** de schakelaar Schoolkaart/Reliëf werkt niet.
2. **Reis:** de knop Schoolblad reageert niet. Geef hem op iPad ook zijn label "Schoolblad"; alleen het icoon is onduidelijk.
3. **Toets:** sommige knoppen reageren slecht op aanraking, en tekst is groter dan de knop. Controleer de tik-doelen (≥ 44 pt), `pointer-events` en overlappende lagen.
4. **iPad 1080×810:** een eigen breakpoint, zodat geen tekst buiten knoppen of panelen valt. Volg de iPad-kolom van de typeschaal, en verklein bij krapte de ruimte, niet de leesbaarheid.
5. **V2 flitst bij het laden:** verberg de app tot de V3-laag klaar is, met een korte fade vanaf de achtergrond. Na de runtime-migratie verdwijnt V2 helemaal.
6. **Oefenen:** het rechterpaneel scrolt op iPad. Het moet zonder scroll passen.

### P2: ontwerp
7. **Instellingen:** zet het V2-dialoogvenster om naar V3: violet glas (Werkblad) en een lijst zoals de Instellingen van iOS. Geen terracotta.
8. **Kennismaking:**
   - één Nino: de kopscène met de Vespa óf `nino-welkom`, niet allebei;
   - de tekstballon kleiner (17/600);
   - een glaskaart over het artwork in plaats van veel wit.
9. **Aanwijs- en feedbackstijl in de les** (de markering van het goede antwoord en de verduidelijking): in de V3-stijl, violet, zonder V2-terracotta.
10. **Tellers (pizza, Vespa):** de geïllustreerde iconen (IC-slice, IC-vespa) in plaats van lijniconen.
11. **Afgerond hoofdstuk in de lijst:** het verdiende stempel (IC-stamp, klein) in plaats van een kaal vinkje. Goud krijgt de lauwerkrans.
12. **Terug:** in de les en de toets een terugknop (chevron) in de kop, naar het scherm waar je vandaan kwam. Elders volstaan de tabs.
13. **Beloningen:**
    - de tegels Stempels, Goud en Postkaarten openen het boek op de bijbehorende pagina;
    - de instellingenknop ín het boek vervalt;
    - in het boek kun je **vegen** naar links en rechts (en de pijltjestoetsen gebruiken), naast Vorige, Volgende en Sluit.
14. **Boek, pagina 1 en 2:** een nieuwe indeling als papierwereld. Eén schreeftype voor de titels plus één leesletter; geen mengelmoes. Rustige marges.
15. **Glas rechts:** 68% als AA tegen het artwork overal haalbaar is (meten); anders 72% laten staan.

### P3: akkoord van de eigenaar (11-11)
16. **Toets:** een chip **Willekeurig**: 10 vragen uit de ontgrendelde hoofdstukken.
17. **Vespa-rit:** de Vespa schudt even (de motor start) en rijdt dan het beeld uit, in plaats van over het lijntje te rijden. Bij verminderde beweging een korte fade.
18. **Achtergrond kiesbaar** in Instellingen: Kust, Toscane, Meer, of **Wisselen** (per hoofdstuk een passende achtergrond).
19. **Inventaris van het artwork:** een lijst van alle aanwezige assets (V2 en V3) en waar ze wel of niet zichtbaar zijn. Daarna stelt de lead designer voor waar ongebruikte assets een plek krijgen (scènes Roma, Venezia en Napoli, postkaarten, VE-01).
20. **Reliëfkaart in de stijl van de render** (advies van de lead designer):
    - het reliëf warmer en minder groen;
    - met **geïllustreerde bezienswaardigheden** op de juiste plek: Colosseum bij Rome, de toren van Pisa, Vesuvius en Etna, een gondel bij Venetië, enzovoort;
    - alleen op Reis en het toetsresultaat;
    - **leren blijft op de schoolkaart.**
    Hiervoor is nieuw artwork nodig (±10 iconen).

### Aanvulling ronde 3: Vespa (eigenaar, 11-11)

De Vespa uit de master-set vervangt **IC-vespa** overal. Reden: dezelfde scooter waarop Nino rijdt (`vespa-rijdend`, `vespa-bagage`), met hetzelfde versleten rood en chroom; IC-vespa was glanzender, oranjer en had spiegels. Daarmee is er één Vespa in de hele app.

| Plek | Asset (master `art/master` `339c420`) |
| --- | --- |
| Tellers (Reis, Voortgang) en kleine iconen | `vespa-icoon` (driekwart vooraanzicht; leest goed op 24–48 px) |
| Beloningen (Vespa-ritten) en de animatie van de Vespa-rit (P3, punt 17) | `vespa-zij` (zijaanzicht naar rechts: de motor start, de Vespa schudt even en rijdt naar rechts het beeld uit) |
| Toets resultaat, kennismaking, uitstapjes | `vespa-rijdend` / `vespa-bagage` (met Nino) |

IC-vespa gaat in het manifest naar de status "vervangen", met de verwijzing. Dit hoort bij punt 10 (tellers met illustraties) en punt 13 (Beloningen).

## Ronde 3 — korte eindoverdracht (12-11)

Eindpin (geteste code): `70cdb342b47898d98225d889fb7d5b49270b3616` op `codex/topo-v3`. Punten 1–20 zijn uitgevoerd, met één oorspronkelijke commit per punt; de eindverificatie bevat de gerichte kopruimte- en laadcorrecties. Glas blijft 72%; de master-Vespa is verwerkt en de artworkinventaris bevat ook de tien nieuwe landmarkillustraties.

Controle: `npm run lint`, `npm test`, `npm run build` en `python3 scripts/qa-v3-all.py` PASS (20/20 scripts; Ronde 3: 20/20 punten). `index.html` is byte-gelijk; leerengine en echte geometrie zijn behouden. Compact bewijs: `docs/qa/v3-stijlbeeld/final/verification-ronde3.json`; screenshots desktop 1440×900 en iPad 1080×810 staan in dezelfde map. Preview en lange logs zijn niet gecommit. Geen merge, deploy of publicatie.

Open: fysieke iPad/Safari-hertest en visuele eigenaar/Hermes-review van het nieuwe landmarkartwork. **Hermes: hertest deze eindpin**, vooral kaartschakelaar/Schoolblad, toetsaanraakvlakken, Oefenen zonder scroll, terugnavigatie, boekvegen, willekeurige toets, Vespa met verminderde beweging en achtergrondwisseling. Controleer dat de landmarks alleen op Reis/toetsresultaat verschijnen en leren op de schoolkaart blijft.

## Master-landmarks — 12-11

De bestaande masters op `art/master` zijn gepind op `69c945c16a8bd34c8e45cffa96c12442c2672cb1`. TOPO_11 is daar geschrapt. TOPO_01–10 vervangen de Ronde 3-atlas, met gecontroleerde WebP 128/256 en broncoördinaten (Wikidata/UNESCO; vulkanen uit canonieke ITEMS). Alleen Reis en toetsresultaat bij Reliëf; geen decoratie op de leerkaart. Pisa/Florence zijn kleiner gemaakt tegen overlap, zonder hun ankers te verplaatsen. TOPO_12–16 staan uitsluitend in het manifest als `V3.1 uitstapjes`.

Gerichte QA: Reis en toetsresultaat PASS, desktop 1440×900 en iPad 1080×810, inclusief offline laden, exacte projectie, bron-/exporthashes, alpha, 128/256-selectie, kaartschakelaar, onveranderde leergeometrie en overlapcontrole. Bewijs: `docs/qa/v3-stijlbeeld/final/landmarks.json` en de vier overschreven screenshots. `index.html` blijft byte-gelijk. Open: fysieke iPad/Safari; TOPO_12 toont geen zichtbare logo’s maar wel rood-zwarte tribunes, dus kleurreview blijft open en de master is niet als clubneutraal goedgekeurd. Geen merge of deploy.

## Ronde 4: klein (lead designer, 12-11, review van `5d1ae77`)

Ronde 3 en de landmarks zijn akkoord. Reis, Toets resultaat, Oefenen, Beloningen, het boek en Instellingen staan op het beoogde niveau. Bundel deze punten met de bevindingen van de iPad-test en Hermes; geen aparte ronde.

1. **Landmarks:**
   - ±40 px op desktop en ±34 px op iPad (nu ±24 px, te klein om te herkennen);
   - nooit onder of over een pin of foutlabel: verschuif ze naar de rand van de plek, met een botsingscheck;
   - de pin blijft altijd boven.
2. **Kennismaking:**
   - de focusring van het naamveld in violet, niet het V2-groen;
   - het venster als glaspaneel in plaats van een witte plaat;
   - Nino groter (±160 px hoog).
3. **Keuzevenster "Welke plek bedoel je?"** (twee plekken dicht bij elkaar, zoals een stad bij een vulkaan of een kleine staat). Nu nog in de V2-stijl: beige, groene nummers, een witte plaat. Gedrag en logica blijven gelijk; alleen de vormgeving in V3:
   - een glaspaneel, en de titel "Welke plek bedoel je?" op 28/700 in inkt;
   - de uitvergroting op de V3-schoolkaart (zoals in de les), met een zachte rand in plaats van een bruine cirkel;
   - de nummers als violette badges met witte cijfers, en de verbindingslijnen in violet;
   - de keuzeknoppen als V3-chips ("Stip 1", "Stip 2"), op ≥ 44 pt hoog;
   - "Terug naar de kaart" als secundaire glaspil;
   - de hulpzin "Volg de lijn…" vervalt (de lijnen spreken voor zich);
   - de legenda compact (symbolen en de woorden stad, vulkaan, kleine staat) zonder de zin "Symbolen, geen grenzen…";
   - toetsenbord en focus ongewijzigd; Escape gaat terug naar de kaart.

### Overdracht ronde 4 (Claude Code, 12-11)

**Pin:** `bde7729` (laatste codewijziging; de commit hierna voegt alleen deze overdracht, de artworkinventaris en QA-bewijs toe). `index.html` byte-gelijk (`3aced3c3…`); V2 en `src/v2/` niet gewijzigd.

- **Punt 1, landmarks** (`2b788dd`): mediane zichtbare hoogte 40 px op desktop en 34 px op iPad (≤ 1279 px), met de onderlinge verhoudingen behouden. Een botsingscheck verschuift een landmark die een pin, ✓/×-teken of foutlabel (of een andere landmark) raakt naar de dichtstbijzijnde vrije plek aan de rand. Het anker blijft op het echte punt en de laag ligt onder de pins en tekens (eerder lag die op Reis erboven).
- **Punt 2, kennismaking** (`1242046`): één glaspaneel zonder crèmekleurige platen, een violette focusring en Nino ~210 px zichtbaar. *Afwijking:* de opdracht noemde ±160 px, maar Nino was al ~183 px; de eigenaar koos "groter". De lead designer kan dit bij de iPad-test corrigeren.
- **Punt 3, keuzevenster** (`bde7729`): `scripts/v3/keuze.js` + `ronde4.css`. Glas, titel 28/700, de uitvergroting met een zachte rand, violette badges en lijnen, chips van 48 px, "Terug naar de kaart" als glaspil, geen hulpzin en een legenda met alleen symbolen. Kandidaten, aria-labels, toetsenbord en Escape komen ongewijzigd uit V2 (`scripts/map-hit.js`). De zijmarge blijft 12 px, omdat V2 de uitvergroting op breedte − 24 berekent.
- **QA:** `scripts/qa-v3-ronde4.py` (punten 1–3, desktop 1440×900 en iPad 1080×810). Eindcontrole: `npm run lint`, `npm test` en `npm run build` groen; `qa-v3-all.py` 21/21. Ronde 3 punt 19 faalde eerst, omdat `assets/v2/` (stap 0) ontbrak in `ARTWORK-INVENTARIS-RONDE3.md`; die bestanden staan er nu in een eigen sectie. De QA draait met Python + Playwright uit `/private/tmp/topo-v3-ronde2-qa`; de systeem-`python3` heeft geen Playwright.

**Open**
- De iPad-test door de eigenaar en de hertest door Hermes (met de Nino-maat uit punt 2).
- De locatorcirkel en het insetkader in de Rome/Vaticaan-uitvergroting volgen deels nog de V2-kleuren (kader neutraal gemaakt, stippelcirkel ongewijzigd).
- De vlakkenkiezer ("Welk gebied bedoel je?") krijgt dezelfde stijl, maar alleen de stippenkiezer is in de QA met screenshots gecontroleerd.
