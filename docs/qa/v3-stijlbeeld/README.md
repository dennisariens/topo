# V3 stijlbeeld — Reis op renderniveau, met de renderassets

**Kandidaat:** `output/html/TOPO-V3-Reis-Preview.html`, SHA256 `71c2f49bf65ae04e9a1908bd7661cf8889562c0af4b3f582fd9cacfdfc4131d4`. Niet in Git; reproduceer met `node scripts/build-v3-preview.mjs`. Basis: ongewijzigde V2.0.2-`index.html` (`3aced3c3…304f5a`) + `scripts/v3/` + `assets/v3/scenes/` + `assets/v3/render/` (exports en manifest van `art/v3-render-assets` @ `05ab1d0`, byte-gelijk; portret, Roma en Napoli vernieuwd met het gesloten blauwe werkshirt) + de z8-renderlagen (`assets/discovery/terrain-z8-render*`, van `v3/relief-z8` @ `2a7b0cf`).
**Openen:** `file://…#bezig` (Italia, BG-01), `#bezig/bg02` en `#bezig/bg03` (alternatieve achtergronden; ook in de previewbalk), `#bezig` (Viola, standaard sinds 10-11), `#bezig/italia` (Italia), `#thema-bezig` (Italia en Viola naast elkaar, desktop) en `#thema-ipad-bezig` (iPad liggend). In de previewbalk: **Italia + Viola**.
**Opdracht:** stijlbeeld volgens `docs/v3/ARTWORK_BRIEF.md` › Volgorde 1 en besluit "Renderniveau" (DECISIONS 2026-11-09). Er zijn geen nieuwe beelden gegenereerd; de renderassets zijn ongewijzigd overgenomen (SHA256 = manifest, gecontroleerd door de build én de QA).
**Oordeel:** technisch geslaagd · **eigenaar: richting akkoord, accent Italia (9-11)**; renderassets ter beoordeling · Hermes: modelcheck en hertest open. Geen merge of deployment.

## Naast de doelbeelden

| Render | Stijlbeeld |
| --- | --- |
| Kaart en hoofdstukken (render 1), Viola | [vergelijking](vergelijking-r1-kaart-desktop-viola.jpg) |
| Kaart en hoofdstukken (render 1), Italia | [vergelijking](vergelijking-r1-kaart-desktop-italia.jpg) |
| Hoofdstukbeelden (render 5) | [vergelijking](vergelijking-r5-hoofdstukken-desktop-viola.jpg) |
| iPad liggend | [vergelijking](vergelijking-r1-kaart-ipad-landscape-viola.jpg) |
| Italia en Viola naast elkaar | [desktop](italia-viola-desktop.png) · [iPad liggend](italia-viola-ipad.png) |
| Renderassets | [BG-01 (standaard)](desktop-viola.png) · [BG-02 Meer](desktop-bg02.png) · [BG-03 Kust](desktop-bg03.png) · [kop Roma](desktop-kop-roma.png) |
| Beloningen | [desktop, alles af](beloningen-desktop-alles.png) · [desktop, halte bezig](beloningen-desktop-bezig.png) · [iPad liggend](beloningen-ipad-landscape-alles.png) · [iPad staand](beloningen-ipad-portrait-alles.png) · [telefoon](beloningen-phone-alles.png) |
| Losse schermen | [desktop Italia](desktop-italia.png) · [desktop Viola](desktop-viola.png) · [iPad Italia](ipad-landscape-italia.png) · [iPad Viola](ipad-landscape-viola.png) · [telefoon](phone-viola.png) · [Verminder transparantie](desktop-verminder-transparantie.png) |

De renders zelf staan niet in Git (bestanden van de eigenaar, `~/Downloads`). In de vergelijkingen staan ze verkleind naast het stijlbeeld.

## Spoor per opdrachtpunt

| Punt | Wat je ziet | Bewijs (`results.json › summary`) | Oordeel |
| --- | --- | --- | --- |
| 1. Achtergrond | **BG-01** (Toscane) full-bleed achter de app; **BG-02** (meer) en **BG-03** (kust) schakelbaar in de previewbalk (`#…/bg02`, `/bg03`). Telefoon: geen achtergrond. Het V2-panorama is alleen nog terugval | `backdropIsBG01` (SHA256 = manifest), `bgAlternativesSwitch`, `phoneNoBackdrop` | ✓ |
| 1. Glaspanelen (fase A, 10-11) | Geen vensterplaat meer. Er is één frame (marge 28, radius 28, glasrand). De zijbalk is de glazen linkerkolom van dat frame. Lijst en paneel zweven als glas (wit 58%, blur 24 px, binnenrand 1 px, kleine schaduw, radius 28). Dit vervangt het zwevende venster van 9 november | `glassPanels` | ✓ |
| 1. Verminder transparantie | Bij macOS "Verminder transparantie" worden de panelen ondoorzichtig; het landschap blijft | `reducedTransparencyOpaque` | ✓ — **let op:** deze instelling staat aan op de Mac waar dit is gebouwd, dus daar zie je het glas niet |
| 2. Hoofdstukbeelden | Miniatuur per rij voor alle 11 hoofdstukken: de 8 #75-scènes plus **SCENE-ROMA** (Steden 7–12), **SCENE-VENEZIA** (13–18) en **SCENE-NAPOLI** (19–23). De gekozen scène staat als kop (16:9) boven de titel; op telefoon geen kop (ruimte voor titel en actie) | `miniaturesMatchManifest` (11/11, 480×270, SHA256 = scenes- of rendermanifest), `kopsMatchManifest` (elke rij gekozen, kop-SHA256 = manifest, kop vóór de titel), `phoneNoKop` | ✓ |
| Zijbalk | **NINO-PORTRET** in plaats van de `guide`-uitsnede (Reis en les) | `portraitIsNinoPortret` | ✓ |
| Iconen | **IC-slice** bij de pizzateller, **IC-vespa** bij de ritten | `counterIcons` | ✓ |
| Beloningen | Nieuw V3-scherm (zijbalk → Beloningen, ook vanuit een les): Reisboekje (omslag + **Open Reisboekje**, de enige hoofdactie; opent het V2-Reisboekje) · **VE-01** met het aantal ritten en 3 pizza's tot de volgende rit · tegels **IC-pizza** (stukjes / 8), **IC-stamp**, **IC-gold**, **IC-postcard**. Focus op de titel; `aria-current` in de navigatie | `rewardsArt` (SHA256 per beeld), `rewardsCountsMatchV2Book` (stempels, goud en postkaarten = wat het V2-Reisboekje zelf toont, pagina voor pagina geteld; pizza en ritten = V2-stand), `rewardsView`, `lessonToRewards`, `rewardsLayout: {}` (geen overlap, afkapping of overloop op desktop, iPad liggend/staand en telefoon) | ✓ (fout gevonden en hersteld, zie onder) |
| 2. Manifest | `assets/v3/scenes/manifest.json`: bron (`8a704cb:assets/nino/exports/…`), SHA256, maat en uitsnede per beeld. Scènes byte-gelijk aan de bron; miniaturen ≤ 37 KB. Reproduceer met `python3 scripts/build-v3-scenes.py` | build controleert de SHA256 | ✓ |
| 3. Reliëf standaard | Reliëf staat standaard aan; Schoolkaart blijft één tik | `reliefDefaultZ8` | ✓ |
| 3. Reliëf z8 (Codex) | Gemeten z8-reliëf in het renderpalet (1780×2470, DPR 2) met de vier renderlagen in hun volgorde: zee → landschaduw → reliëf (geclipt op de bestaande landpaden) → witte kustrand → bestaande grenzen en labels. **Supersedes** het SVG-kleurfilter op z7 | `reliefLayersMatchProvenance` (SHA256 per laag = `terrain-z8-render-provenance.json`), `reliefLayerOrder`, `reliefIsDecorationOnly` (geen `data-id`, `aria-hidden`, geen pointer events) | ✓ |
| 3. Buurlanden gedempt | Buurlanden (`contextLand` en de niet-gekozen landen) onder een crème waas (42%); Italië en de plekken van het hoofdstuk op volle sterkte | `neighboursDimmed` | ✓ |
| 3. Zachter zeeverloop | Gemeten zeelaag op halve sterkte over een lichte basis, met een brede, zachte kustgloed; buiten het canvas loopt dezelfde mengkleur door | screenshots; `reliefLayerOrder` | ✓ (eigenaar beoordeelt) |
| 3. Geometrie gelijk | Elk leerobject gelijk aan de live kaart | `geometrySame` 46/46 op alle formaten en thema's; `qa-v3-reis.py` 46/46 | ✓ |
| 4. Italia en Viola | Twee live frames naast elkaar, desktop en iPad liggend | `themes` (#b9502f / #5b45e0), `themePairs` | ✓ |
| Reis-gedrag en V2-knoppen | Ongewijzigd | `qa-v3-reis.py` en `qa-v3-les.py` groen | ✓ |
| Layout | Geen afgekapte namen, geen woordbreuk, hoofdactie boven de vouw, geen horizontale scroll | `namesClipped: []`, `namesTwoLines: []`, `primaryAboveFold`, `horizontalOverflow: []` | ✓ |
| V2 intact | — | `indexUnchanged`; lint, test, build ✓ | ✓ |

Browser: Chrome 157, macOS, headless, transparantie geëmuleerd als standaard (`python3 scripts/qa-v3-stijlbeeld.py`). **Niet getest:** WebKit en echte iPad Safari (matglas en SVG-filters kunnen daar anders renderen), VoiceOver.

## Renderassets: HTML-groei

Preview 42.784.186 → 50.199.445 bytes (**+7,42 MB, +17%**; met de assets van `05ab1d0` 22.808 bytes kleiner dan met `908b4a4`); `index.html` (41.445.845 bytes) is byte-gelijk. Ingebed als base64:

| Groep | MB |
| --- | ---: |
| Koppen van de 8 #75-scènes (nieuw: kop bij de titel) | 4,21 |
| BG-01, BG-02, BG-03 (2880 × 1800) | 1,61 |
| Koppen Roma, Venezia, Napoli (1672 × 941) | 1,23 |
| Miniaturen Roma, Venezia, Napoli | 0,12 |
| VE-01 | 0,12 |
| NINO-PORTRET | 0,07 |
| Zes iconen (96 px) | 0,05 |

De #75-scènes zitten niet in `index.html`; hergebruik is daarom niet mogelijk. Besluit 9-11: alle drie de achtergronden blijven; kwaliteit gaat voor grootte. Groei oplossen we technisch: eerst meten op een echte iPad, daarna zo nodig AVIF en decoderen wanneer zichtbaar.

## Gevonden en hersteld tijdens de QA

1. **Omslag over de knop (iPad).** Op iPad liggend en staand liep de omslag van het Reisboekje over **Open Reisboekje**: de boekrij kromp, de afbeelding niet. Nu schaalt de omslag mee met de rij (één kolom: vaste maximale hoogte). De QA meet overlap tussen alle blokken.
2. **Les → Beloningen zonder focus.** Vanuit de les-zijbalk opende Beloningen wel, maar de focus bleef nergens. Nu gaat de focus naar de titel **Beloningen**.

## Waar het stijlbeeld nog van de render afwijkt (bewust)

1. **Reliëf.** Nu z8 met sterke hillshade (verticale overdrijving 4,5) uit `v3/relief-z8`. De render blijft plastischer. **Open bij Codex:** de DEM-nulhoogtelijn wijkt bij Sicilië en Sardinië tot 2,22 en 2,84 SVG px af van de vectorkust (`docs/qa/relief-z8` op `v3/relief-z8`). De rand en clip volgen de bestaande landpaden; de afwijking is daarmee niet opgelost.
2. **Niet overgenomen uit de render** (vaste regels): genummerde pins op de kaart, streak, de hoofdstuknamen en -tellingen van de render (de echte elf hoofdstukken blijven).

## Open punten

1. **Besloten 9-11:** richting akkoord; accent Italia. `relief-z8` en de renderassets zijn ingebouwd.
2. **Renderassets:** BG-01..03 akkoord (uitzondering bronresolutie). Portret, Roma en Napoli zijn vernieuwd (shirt) en wachten op de **Hermes-hertest**; Venezia wacht op de modelcheck; iconen en VE-01 staan "ter beoordeling eigenaar". De kaart en de leerinhoud zijn er niet door veranderd (46/46).
3. **Postkaarten:** de tegel volgt de regel van het V2-Reisboekje (2 na Eilanden, +1 bij rit 3 en rit 6); de QA telt ze in het boek zelf na.
4. **Telefoon:** links van het kaartcanvas heeft de bron geen landgeometrie (Frankrijk stopt bij x = 0), dus daar staat zee. Dat speelde al vóór het stijlbeeld. Telefoon valt buiten deze opdracht; er is geen geometrie toegevoegd.

## Fase A voor en na

Voor = pin `43e56d1`, na = de huidige stap van fase A. Links staat de oude build, rechts de nieuwe, op hetzelfde formaat. Gemaakt door `scripts/qa-v3-glas.py` (met `VOOR_DIR`); de metingen staan in [`../v3-glas/`](../v3-glas/README.md).

| Scherm | Desktop 1440×900 | iPad liggend 1180×820 |
| --- | --- | --- |
| Reis | [voor/na](voor-na-reis-desktop.jpg) | [voor/na](voor-na-reis-ipad-liggend.jpg) |
| Les | [voor/na](voor-na-les-desktop.jpg) | [voor/na](voor-na-les-ipad-liggend.jpg) |
| Oefenen | [voor/na](voor-na-oefenen-desktop.jpg) | [voor/na](voor-na-oefenen-ipad-liggend.jpg) |
| Toets | [voor/na](voor-na-toets-desktop.jpg) | [voor/na](voor-na-toets-ipad-liggend.jpg) |
| Voortgang | [voor/na](voor-na-voortgang-desktop.jpg) | [voor/na](voor-na-voortgang-ipad-liggend.jpg) |
