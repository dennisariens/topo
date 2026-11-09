# Onafhankelijke TOPO V3 QA — punten 2 en 4

## Exact geteste kandidaat
- Commit: `1a42590de5525bd4d9fb1bcd02bf384e4437b1c2` in `/Users/dennisariens/projects/topo-v3-app-1a42590`.
- Bestaand HTML: `output/html/TOPO-V3-Reis-Preview.html`, **50.199.445 bytes**.
- SHA256 vóór en na: `23dced34e7d9079cd59195532721f39b1bc6c1f00032ce6c4a41bb4ea619b556`.
- Chromium **156.0.8078.4** en Playwright WebKit **27.2**, lokale geïsoleerde contexten, `file://`.
- Kandidaat, Git, engines, assets en publicaties niet gewijzigd; `git status --short` leeg. Alle QA-uitvoer staat uitsluitend in deze scratchmap. Nieuwere docs-only commits zijn niet uitgevoerd.

## Oordeel
| Punt | Chromium | WebKit |
|---|---|---|
| 2 — GE01 werkelijk spelen, feedback, verdienen, boek, hervatten en anti-dubbeltelling | **REWORK** | **REWORK** |
| 4 — Beloningen: tellers, zelfde V2-boek, toetsenbord, terugpad, alleen-lezen | **PASS** | **PASS** |

## REWORK GE01-K01 — Enter sluit de zojuist verdiende pizza automatisch bij verminderde beweging
**Beide engines, werkelijk verdiend vanaf `#nieuw`, geen antwoord-/beloningsinjectie.**

Korte reproductie:
1. Zet `prefers-reduced-motion: reduce` aan en open `#nieuw`.
2. Speel Steden 1–6: zes plekken Ontdekken, zes juiste antwoorden Aanwijzen.
3. Beantwoord de eerste schrijfvraag goed; bij de tweede schrijfvraag wordt de achtste pizzapunt verdiend.
4. Vul de juiste naam in en druk eenmaal **Enter**.

**Actueel:** `pizzas: 1`, `slices: 0` en `Perfetto! Een pizza compleet.` zijn correct, maar de pizzadialoog is al gesloten. Dezelfde Enter genereert een onbedoelde klik op de nieuw gefocuste dialoogknop **Verder**. Het statische beloningsmoment blijft niet staan. Controle met een muisklik op **Controleer** bij dezelfde echte mijlpaal laat de verdiende Margherita-doos wel open. Geen verlies of verdubbeling van valuta vastgesteld.

Echte eventvolgorde Chromium: `keydown Enter → answer`, `click → Verder`, `keyup Enter → Verder`, `close → pizzaCelebration`. WebKit toont dezelfde onbedoelde klik en sluiting (close vóór keyup). Dit is geen staatinjectie of screenshotfixture. Verminderde beweging is hier een expliciet geteste toegankelijkheidsinstelling; er wordt geen claim gedaan over dit effect zonder die instelling.

Bewijs: [Chromium eventledger](chromium-pizza-probe.json), [WebKit eventledger](webkit-pizza-probe.json), [werkelijk verdiende pizza via Controleer](chromium-pizza-click.png), [Enter: dialoog verdwenen](webkit-pizza-Enter.png). Reproductiedriver: [pizza-probe.py](pizza-probe.py).

## Wat bij punt 2 wel slaagt
- Onafhankelijke route vanaf **`#nieuw`** in beide engines: Ontdekken → Aanwijzen → Namen schrijven, één echte fout in Aanwijzen en één in Schrijven, correcte antwoorden via kaartaanwijzing/overlapkiezer en invoer. Antwoorden, feedback, reparatievragen en afronding volgen de werkelijke UI. Er is nergens `grade()` aangeroepen of een antwoord-/beloningsstaat geïnjecteerd.
- Per engine eindigt dit nieuwe spel op **12 goed, 1 pizza + 4 stukjes, 0 ritten, 1 nieuw hoofdstukstempel**. Het afronddisplay en het V2-boek tonen het stempel Steden 1–6. **Bekijk in Reisboekje** opent daadwerkelijk de stempelspread; het is hetzelfde `TopoBook.element`.
- Halverwege schrijven: concept **`Rome concept`**, niet-ingeklapte selectie **9–12, backward**, vraag-ID en schrijfmodus blijven gelijk na **Reis → Ga verder** én na **les → Beloningen → boek openen/bladeren/sluiten → Reis → Ga verder**. De selectie is met echte Shift+pijltoetsen gemaakt. De invoer krijgt bij terugkomst niet automatisch de focus; dit is apart gelogd, niet als focusherstel geclaimd. De expliciet gevraagde vraag/modus/concept/selectie blijven behouden.
- Een werkelijk uitgespeelde herhaling van Aanwijzen voegt **geen** valuta toe: vóór en na **4 stukjes / 1 pizza / 0 ritten**. Boek heropenen, Beloningen en terugnavigeren veranderen de opgeslagen voortgang niet.
- De onderhouden `scripts/qa-v3-les.py` is **volledig uitgevoerd in beide engines op alle vijf eigen formaten** (desktop, beide iPad-viewports, 390 en 320 px), plus zijn reduced-motion-probe. Alleen de browser-launch is aangepast; ROOT blijft het originele scriptpad, HTML het exacte bestaande artifact en uitvoer gaat naar scratch. Geen checks of speelstappen zijn verzwakt.
- Alle oorspronkelijke samenvattingschecks voor stappen, goede/foute feedback, meter, echte kaarttikken, sheet openen, pizza/Vespa op echte telling, concept bij formaatwissel, verdiend city2-stempel, boekklik en terugkeer naar volgend hoofdstuk slagen. Geen browserfouten, overlap-, clipping-, kleine-target- of overflowmeldingen in dit lesharnas. Dit groene harnas dekt de hierboven gevonden Enter-rand niet af.

### Fixtures expliciet gescheiden van nieuw verdiend
De onderhouden lesrun gebruikt **`#bezig`**: geïmporteerde demo-baseline met city1 afgerond, city2 Ontdekken afgerond, **1 pizza + 6 stukjes**. Die bestaande voortgang is **niet** in deze QA verdiend. De daaropvolgende kaart-/schrijfantwoorden, nieuwe city2-afronding en pizza-/Vespa-overgangen zijn door de UI gespeeld en per beat vastgelegd. De onafhankelijke `#nieuw`-run heeft daarentegen nul oude stempels/pizza’s als beginstand.

### Herladen: harde beperking van dit artifact
Deze preview vervangt localStorage door een geheugenopslag en laadt bij elke reload de hash-demostand opnieuw. Bij reload van het werkelijk gespeelde `#nieuw` ontstaat opnieuw nul voortgang, geen extra beloning. **Bewaren en anti-replay na herladen van een werkelijk verdiende save zijn op dit preview-artifact niet aangetoond**; dat zou een andere persistente build of expliciete restorefixture vereisen. Geen persistentie-PASS op basis van deze demo. Replay/heropenen/terugkeren binnen dezelfde sessie zijn wel echt getest.

## Punt 4 — Beloningen PASS in beide engines
Alle vier demostanden én de werkelijk verdiende toestand zijn vergeleken met het **werkelijk geopende V2-boek**, pagina voor pagina met de echte Vorige/Volgende-knoppen. Het boek onthoudt zijn spread; de driver gaat daarom eerst via de UI terug naar het begin voordat hij telt.

| Stand | Pizza’s + stukjes | Ritten | Stempels in boek/V3 | Goud in boek/V3 | Postkaarten in boek/V3 |
|---|---|---|---|---|---|
| nieuw | 0 + 0 | 0 | 0 | 0 | 0 |
| bezig — demo | 1 + 6 | 0 | 1 | 0 | 0 |
| afgerond — demo | 7 + 3 | 2 | 4 | 2 | 0 |
| alles — demo | 21 + 0 | 7 | 11 | 11 | 4 |
| nieuw → echt gespeeld | 1 + 4 | 0 | 1 | 0 | 0 |

- De V3-pizzategel toont **stukjes van de huidige pizza**, niet het totale pizzabezit: bijvoorbeeld `4 / 8`, `Pizza 2`; de ritmeter toont `pizzas % 3`. Ook deze semantiek is gecontroleerd.
- Beloningen vanuit Reis én vanuit de les bereikt het juiste scherm en focust `v3RewardsTitle`. Echte **Tab → Enter** (Chromium), respectievelijk **Option/Alt-Tab → Enter** (macOS WebKit), bereikt en opent **Open Reisboekje**, zonder voorafgaand programmatisch `focus()`.
- Het geopende dialoog is exact het bestaande `TopoBook.element`. Escape sluit het; focus keert terug naar de verbonden knop Open Reisboekje. Reis is daarna bereikbaar en de les kan hervat worden met dezelfde vraag/concept/selectie.
- Zowel in-memory canonieke voortgang als volledige preview-opslag zijn vóór/na identiek. Een observerende wrapper om de bestaande opslagsetter registreert **0 setItem-aanroepen** tijdens iedere geteste Beloningen-/boekcyclus; geen leer- of beloningswaarden worden door deze driver gezet.
- De vier demostanden zijn alleen **tellerfixtures**, niet nieuw verdiende prestaties. De vijfde rij is de echte nieuwe route.

## Bewijs en reproduceerbare drivers
- [Geaggregeerde, geverifieerde resultaten](results.json)
- [Onafhankelijke driver](independent.py), [launch-only wrapper onderhouden lesharnas](run-maintained.py), [resultaatcontrole](summarize.py)
- [Onafhankelijk Chromium-ledger](independent-chromium/ledger.json), [onafhankelijk WebKit-ledger](independent-webkit/ledger.json)
- [Onderhouden lesharnas Chromium](maintained-chromium/results.json), [onderhouden lesharnas WebKit](maintained-webkit/results.json)
- [Werkelijk verdiend afrondscherm](independent-chromium/earned-stamp-finish.png), [werkelijk verdiend stempel in V2-boek](independent-webkit/finish-earned-book.png), [toetsenbordfocus Open Reisboekje](independent-webkit/earned-book-button-focus.png), [goede feedback](independent-chromium/point-correct-feedback.png), [foute feedback](independent-webkit/write-wrong-feedback.png)
- Per engine 33 screenshots in de definitieve onafhankelijke run en 35 in het onderhouden lesharnas; extra pizza-reprobeelden staan in de hoofdmap. Screenshots hierboven zijn visueel geïnspecteerd.
- Oude `*-attempt*`-mappen zijn behouden als harnasdiagnostiek, **niet** de definitieve QA-resultaten: aanvankelijk werd een desktop-verborgen terugknop gekozen, later moest de boektelling eerst terugbladeren en is een ledger-keyfout hersteld. Geen daarvan is als appdefect gerapporteerd. Definitieve runs eindigen zonder driverfout.

## Niet getest / niet geclaimd
Fysieke iPad Safari, OS-toetsenbord/IME en VoiceOver **NIET GETEST**. WebKit-engine-QA is geen fysieke Safari-acceptatie. De volledige stijlbeeldsuite is door deze subtaak gelezen maar niet uitgevoerd; kaart-, artwork-, static-, performance- en npm-gates vallen bij de oudertaak. Geen publicatie, release-GO of nieuwe-commitgoedkeuring.
