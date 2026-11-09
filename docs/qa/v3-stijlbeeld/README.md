# V3 stijlbeeld — Reis op renderniveau (bestaand materiaal)

**Kandidaat:** `output/html/TOPO-V3-Reis-Preview.html`, SHA256 `94b62f8ac30cfc64587ad4c127ef3f4be42ce424da1792f8e30324fb4b0c5464`. Niet in Git; reproduceer met `node scripts/build-v3-preview.mjs`. Basis: ongewijzigde V2.0.2-`index.html` (`3aced3c3…304f5a`) + `scripts/v3/` + `assets/v3/scenes/` + de z8-renderlagen (`assets/discovery/terrain-z8-render*`, van `v3/relief-z8` @ `2a7b0cf`).
**Openen:** `file://…#bezig` (Italia), `#bezig/viola` (Viola), `#thema-bezig` (Italia en Viola naast elkaar, desktop) en `#thema-ipad-bezig` (iPad liggend). In de previewbalk: **Italia + Viola**.
**Opdracht:** stijlbeeld volgens `docs/v3/ARTWORK_BRIEF.md` › Volgorde 1 en besluit "Renderniveau" (DECISIONS 2026-11-09). Er zijn geen nieuwe beelden gegenereerd.
**Oordeel:** technisch geslaagd · **eigenaar: richting akkoord, accent Italia (9-11)** · Hermes: open. Geen merge of deployment.

## Naast de doelbeelden

| Render | Stijlbeeld |
| --- | --- |
| Kaart en hoofdstukken (render 1), Viola | [vergelijking](vergelijking-r1-kaart-desktop-viola.jpg) |
| Kaart en hoofdstukken (render 1), Italia | [vergelijking](vergelijking-r1-kaart-desktop-italia.jpg) |
| Hoofdstukbeelden (render 5) | [vergelijking](vergelijking-r5-hoofdstukken-desktop-italia.jpg) |
| iPad liggend | [vergelijking](vergelijking-r1-kaart-ipad-landscape-italia.jpg) |
| Italia en Viola naast elkaar | [desktop](italia-viola-desktop.png) · [iPad liggend](italia-viola-ipad.png) |
| Losse schermen | [desktop Italia](desktop-italia.png) · [desktop Viola](desktop-viola.png) · [iPad Italia](ipad-landscape-italia.png) · [iPad Viola](ipad-landscape-viola.png) · [telefoon](phone-italia.png) · [Verminder transparantie](desktop-verminder-transparantie.png) |

De renders zelf staan niet in Git (bestanden van de eigenaar, `~/Downloads`). In de vergelijkingen staan ze verkleind naast het stijlbeeld.

## Spoor per opdrachtpunt

| Punt | Wat je ziet | Bewijs (`results.json › summary`) | Oordeel |
| --- | --- | --- | --- |
| 1. Achtergrond | V2-panorama full-bleed achter de app (tijdelijk, tot BG-01). Uitsnede links, zodat Nino uit het panorama niet achter het venster piept. Telefoon: geen achtergrond | `backdropIsV2Panorama`, `phoneNoBackdrop` | ✓ |
| 1. Zwevend venster | Zacht matglas (80% oppervlak, blur 26 px), hoeken 24, zachte schaduw, 24 px vrij rondom. Lijst als lichte kaart op het glas | `floatingGlassWindow` (radius 24px, blur, schaduw, alfa < 1, marge ≥ 16) | ✓ |
| 1. Verminder transparantie | Bij macOS "Verminder transparantie" wordt het venster ondoorzichtig; het landschap blijft | `reducedTransparencyOpaque` | ✓ — **let op:** deze instelling staat aan op de Mac waar dit is gebouwd, dus daar zie je het glas niet |
| 2. Hoofdstukbeelden | Miniatuur per rij: de 8 #75-scènes, uitgesneden op het landschap zonder Nino. Steden 7–12, 13–18 en 19–23: het bestaande hoofdstukicoon als tijdelijke vervanger | `miniaturesMatchManifest` (SHA256 = manifest, 480×270), `missingScenesUseChapterIcon` (`city2`, `city3`, `city4`) | ✓ |
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

## Waar het stijlbeeld nog van de render afwijkt (bewust, bestaand materiaal)

1. **Reliëf.** Nu z8 met sterke hillshade (verticale overdrijving 4,5) uit `v3/relief-z8`. De render blijft plastischer. **Open bij Codex:** de DEM-nulhoogtelijn wijkt bij Sicilië en Sardinië tot 2,22 en 2,84 SVG px af van de vectorkust (`docs/qa/relief-z8` op `v3/relief-z8`). De rand en clip volgen de bestaande landpaden; de afwijking is daarmee niet opgelost.
2. **Achtergrond.** Het panorama is een havenstraat, geen open landschap: onrustig achter het glas. BG-01 (Toscaanse heuvels, rustig midden) lost dat op.
3. **Hoofdstukbeelden.** Drie stedenhoofdstukken tonen nog een icoon in plaats van een scène (Roma, Venezia, Napoli).
4. **Nino.** De zijbalk toont het bestaande `guide`-beeld, uitgesneden. Het portret uit de brief (§ 3) volgt na akkoord.
5. **Niet overgenomen uit de render** (vaste regels): genummerde pins op de kaart, streak, de hoofdstuknamen en -tellingen van de render (de echte elf hoofdstukken blijven).

## Open punten

1. **Besloten 9-11:** richting akkoord; accent Italia. `relief-z8` is ingebouwd; daarna BG-01, en het artwork pas na de modelcheck van Hermes.
2. **Telefoon:** links van het kaartcanvas heeft de bron geen landgeometrie (Frankrijk stopt bij x = 0), dus daar staat zee. Dat speelde al vóór het stijlbeeld. Telefoon valt buiten deze opdracht; er is geen geometrie toegevoegd.
3. Na akkoord: BG-01, drie nieuwe scènes, portret, iconen en VE-01 volgens de brief, met Hermes-QA.
