# V3 stijlbeeld — Reis op renderniveau (bestaand materiaal)

**Kandidaat:** `output/html/TOPO-V3-Reis-Preview.html`, SHA256 `c7972188fa9816dddb620b696dd5931c5e9e2b5e7f6c25edb5fd53bec43310db`. Niet in Git; reproduceer met `node scripts/build-v3-preview.mjs`. Basis: ongewijzigde V2.0.2-`index.html` (`3aced3c3…304f5a`) + `scripts/v3/` + `assets/v3/scenes/`.
**Openen:** `file://…#bezig` (Italia), `#bezig/viola` (Viola), `#thema-bezig` (Italia en Viola naast elkaar, desktop) en `#thema-ipad-bezig` (iPad liggend). In de previewbalk: **Italia + Viola**.
**Opdracht:** stijlbeeld volgens `docs/v3/ARTWORK_BRIEF.md` › Volgorde 1 en besluit "Renderniveau" (DECISIONS 2026-11-09). Er zijn geen nieuwe beelden gegenereerd.
**Oordeel:** technisch geslaagd · **eigenaar: open** (stijlbeeld wacht op jouw oordeel) · Hermes: open. Geen merge of deployment.

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
| 3. Reliëf standaard | Reliëf staat standaard aan; Schoolkaart blijft één tik | `reliefDefaultWithPalette` | ✓ |
| 3. Renderpalet | SVG-filter op de bestaande laag (`terrain.webp`): kleurmatrix, gefit op pixels uit het raster (laagland groen, heuvels oker, gebergte bruin, toppen wit), daarna verzadiging en contrast. Heldere zee | filter `v3-relief-palette` | ✓ (benadering, zie open punt 1) |
| 3. Kust | Witte kustrand (1,5 px), lichte kustzone in zee, zachte schaduw onder het land. Kopieën van dezelfde landpaden zonder `data-id` of klasse, plus een groene landbasis waar het raster ophoudt | `whiteCoastAndShadow` | ✓ |
| 3. Geometrie gelijk | Elk leerobject gelijk aan de live kaart | `geometrySame` 46/46 op alle formaten en thema's; `qa-v3-reis.py` 46/46 | ✓ |
| 4. Italia en Viola | Twee live frames naast elkaar, desktop en iPad liggend | `themes` (#b9502f / #5b45e0), `themePairs` | ✓ |
| Reis-gedrag en V2-knoppen | Ongewijzigd | `qa-v3-reis.py` en `qa-v3-les.py` groen | ✓ |
| Layout | Geen afgekapte namen, geen woordbreuk, hoofdactie boven de vouw, geen horizontale scroll | `namesClipped: []`, `namesTwoLines: []`, `primaryAboveFold`, `horizontalOverflow: []` | ✓ |
| V2 intact | — | `indexUnchanged`; lint, test, build ✓ | ✓ |

Browser: Chrome 157, macOS, headless, transparantie geëmuleerd als standaard (`python3 scripts/qa-v3-stijlbeeld.py`). **Niet getest:** WebKit en echte iPad Safari (matglas en SVG-filters kunnen daar anders renderen), VoiceOver.

## Waar het stijlbeeld nog van de render afwijkt (bewust, bestaand materiaal)

1. **Reliëf.** De render heeft een sterke hillshade en een plastisch 3D-reliëf. Het huidige raster is zoom 7 met zachte schaduw; het palet benadert de kleuren, niet de diepte. Dat komt met Codex `v3/relief-z8`.
2. **Achtergrond.** Het panorama is een havenstraat, geen open landschap: onrustig achter het glas. BG-01 (Toscaanse heuvels, rustig midden) lost dat op.
3. **Hoofdstukbeelden.** Drie stedenhoofdstukken tonen nog een icoon in plaats van een scène (Roma, Venezia, Napoli).
4. **Nino.** De zijbalk toont het bestaande `guide`-beeld, uitgesneden. Het portret uit de brief (§ 3) volgt na akkoord.
5. **Niet overgenomen uit de render** (vaste regels): genummerde pins op de kaart, streak, de hoofdstuknamen en -tellingen van de render (de echte elf hoofdstukken blijven).

## Open punten

1. **Eigenaar:** oordeel over het stijlbeeld en de keuze tussen Italia en Viola (opnieuw te toetsen, DECISIONS "Renderniveau").
2. **Telefoon:** links van het kaartcanvas heeft de bron geen landgeometrie (Frankrijk stopt bij x = 0), dus daar staat zee. Dat speelde al vóór het stijlbeeld. Telefoon valt buiten deze opdracht; er is geen geometrie toegevoegd.
3. Na akkoord: BG-01, drie nieuwe scènes, portret, iconen en VE-01 volgens de brief, met Hermes-QA.
