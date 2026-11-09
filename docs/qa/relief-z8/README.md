# Reliëf z8 — reviewkandidaat met kustdiscrepantie

Eigenaar heeft z9 uitgesteld en na melding van de kustdiscrepantie op 9 november opdracht gegeven door te gaan. De discrepantie is niet opgelost of als geaccepteerd aangemerkt; integratie blijft apart ter goedkeuring. Branch `v3/relief-z8`, basis `afb32d1`.

De bestaande generator `scripts/geography/generate-terrain.py` is hergebruikt (oorspronkelijke SHA256 `a2aecd048065e79c00a68dc02bd1eccb13968e3089ca1e89f387d1f6106d1bf4`). Zoom en DPR zijn instelbaar; de projectie is niet vervangen. Gaussian- en textuurradii schalen met DPR zodat ze dezelfde omvang in SVG-eenheden behouden. Kleuren, lichtbronnen en verticale overdrijving blijven gelijk.

Nieuw kandidaatbestand: `assets/discovery/terrain-z8.webp`, **1780×2470**, **153.026 bytes**, kwaliteit 86, 208 AWS Terrarium-tegels. URLs, SHA256, bronattributie en versies staan in `assets/discovery/terrain-z8-provenance.json`. Budget 1.000.000 bytes. Mont Blanc, Gran Sasso, Etna en Povlakte slagen. Alle 6.373 landvertices doorlopen dezelfde affiene registratie met maximaal 6,92e-13 SVG px numeriek verschil.

## Aanvulling: renderpalet (eigenaarbrief §5)

Bron: `docs/v3/ARTWORK_BRIEF.md` §5 op `codex/topo-v3` vanaf `8af18a8`, alleen gelezen. Tweede stijl naast de bestaande z8-kleuring; geen AI-beeld, nieuwe hoogtedata of projectie. Laagland groen, heuvels geel-oker, gebergte bruin, wit vanaf circa 2500 m. Wit is een hoogteklasse, geen meting van sneeuwbedekking. De exacte hoogtestops en kleuren staan in de nieuwe provenance. Hillshade gebruikt dezelfde lichtrichtingen en hoogtehoek, met verticale overdrijving 4,5 in plaats van 3 en meer licht/donkercontrast.

Alle renderlagen zijn 1780×2470 pixels, te plaatsen op exact hetzelfde `x=0 y=0 width=890 height=1235`-frame:

| Bestand onder `assets/discovery/` | Bytes | Gebruik |
| --- | ---: | --- |
| `terrain-z8-render.webp` | 308.232 | RGB-reliëf; clip met de bestaande landpaden |
| `terrain-z8-render-sea.webp` | 245.696 | Helderblauwe zee met lichtere kustzone; onder land |
| `terrain-z8-render-shadow.webp` | 119.588 | Transparante zachte landschaduw; onder land |
| `terrain-z8-render-coast.webp` | 50.682 | Transparante witte kustrand; boven land |
| **Totaal renderstijl** | **724.198** | **Binnen budget van 1.000.000 bytes** |

Laagvolgorde: zee → schaduw → op origineel land geclipt reliëf → kustrand → bestaande grenzen/labels. Zee, rand en schaduw kunnen onafhankelijk geschakeld worden. Ze voegen geen hitgebieden toe: gebruik `pointer-events="none"` en behandel ze als decoratie. Zeehalo (6 px blur) is een stijlmiddel, geen nieuwe bathymetrie. De schaduw heeft 2 px verticale offset en 3 px blur. De witte rand is 1,5 SVG px breed, gecentreerd op de gezamenlijke bestaande landvorm; gedeelde landsgrenzen krijgen geen witte rand of schaduw. Rasterisatie gebruikt 4 samples per SVG px, vervolgens Lanczos naar DPR2. Alleen de nieuwe transparante decoratie heeft deze rasterisatie; de vectorgeometrie en oorspronkelijke registratie veranderen niet.

Alle 208 tegel-URLs en SHA256, attributie, palet, shading, laaginstellingen, maker/datum en hashes per export staan in `assets/discovery/terrain-z8-render-provenance.json`. Herbouw controleert dezelfde gepinde bronnen. De nieuwe ruwe DEM is exact gelijk aan de oorspronkelijke z8-DEM (SHA256 `b831aff53b152259c12b2b67b12dfb9b910fa5a6525d5db858dc9dee865a9fe3`); registratie en alle vier hoogtechecks zijn gelijk. De eerdere DEM/vector-kustdiscrepantie blijft onopgelost; de decoratieve rand maskeert of corrigeert die niet in de ruwe controle.

Werkelijke HTML-groei blijft **0 bytes**. Als later de oorspronkelijke z7-base64-payload wordt vervangen door het volledige renderpakket, groeit alleen die payload netto **886.728 bytes**, exclusief nieuwe markup. Beide nieuwe z8-terreinvarianten plus de drie decoratielagen samen zijn 877.224 bytes. Er is niets geïntegreerd.

[Render-validatie](render-validation.json) · [Render-verificatie](render-verification.txt)

| Gebied | z7 / z8 / z8-render |
| --- | --- |
| Heel Italië | [Drie varianten](italie-z7-z8-render.png) |
| Alpen | [Drie varianten](alpen-z7-z8-render.png) |
| Apennijnen | [Drie varianten](apennijnen-z7-z8-render.png) |
| Sicilië | [Drie varianten](sicilie-z7-z8-render.png) |

Het renderpaneel toont de samengestelde assetlagen, zonder de donkere broncontouren van de andere twee panelen, om de gevraagde witte kustrand te kunnen beoordelen. Het is geen geïntegreerd V3-scherm. Eigenaarstijlacceptatie en integratie zijn nog open.

Reproductie naast de oorspronkelijke opdrachten:

```sh
python scripts/geography/generate-terrain.py --cache /path/to/cache --zoom 8 --dpr 2 --style render
python scripts/geography/qa-relief-z8.py --cache /path/to/cache --render
python scripts/geography/terrain-render.test.py
```

## Stopbevinding

De afstand van de bestaande eilandcoast tot de geïnterpoleerde nulhoogtelijn in de ruwe DEM overschrijdt 1 SVG px (dus niet DPR2-rasterpixels):

| Eiland | Maximum | P95 |
| --- | ---: | ---: |
| Sicilië | 2,22 px | 1,27 px |
| Sardinië | 2,84 px | 1,56 px |

Dit is **geen bewezen affiene registratiefout**. De DEM-nulhoogtelijn is een benadering van de fysieke kust en bevat verschillen tussen SRTM, ETOPO1 en de bestaande vectorbron. De RGB-render heeft zelf geen kustmasker. Het bestaande SVG-clip volgt per definitie exact de bestaande landpaden; dat is geen onafhankelijk bewijs dat de DEM-kust samenvalt. Op deze discrepantie is eerst gestopt. Na de opdracht “continue” is de reviewkandidaat afgewerkt, zonder data of geometrie bij te sturen. Dit pakket claimt geen geslaagde kustmatch binnen 1 px. De controle omvat deze twee eilanden; een volledige mainland-kustbeoordeling is nog niet uitgevoerd.

`kust-sicilie.png` en `kust-sardinie.png` tonen onbegrensde rasterdetailbeelden bij de grootste afwijking: magenta is de bestaande vectorcoast; cyaan de geïnterpoleerde DEM-nulhoogtelijn. `validation.json` bevat methode, meetpunten en cijfers. `italie-z7-z8.png`, `alpen-z7-z8.png`, `apennijnen-z7-z8.png` en `sicilie-z7-z8.png` vergelijken de beelden met exact de bestaande landpaden als clip en contour; z7 is voor de detailvergelijking opgeschaald, zonder extra terreindetail te suggereren.

## Beelden

| Gebied | Vergelijking |
| --- | --- |
| Heel Italië | [z7 naast z8](italie-z7-z8.png) |
| Alpen | [z7 naast z8](alpen-z7-z8.png) |
| Apennijnen | [z7 naast z8](apennijnen-z7-z8.png) |
| Sicilië | [z7 naast z8](sicilie-z7-z8.png) |
| Kustdetail | [Sicilië](kust-sicilie.png) · [Sardinië](kust-sardinie.png) |

[Validatie-JSON](validation.json) · [Verificatie](verification.txt)

## Omvang en bescherming

`index.html`, `terrain.webp`, de bestaande provenance, kaartgeometrie, alle 45 items en leer-/beloningsmotoren zijn niet gewijzigd. Werkelijke HTML-groei: **0 bytes**. Bij latere vervanging van uitsluitend de bestaande base64-terreinpayload zou de HTML met **125.164 bytes** groeien (overige markup gelijk). Er is nog niets geïntegreerd.

`npm run lint && npm test && npm run build` is geslaagd; resultaten staan in `verification.txt`. Geen merge, deployment of wijziging aan `codex/topo-v3`. De kandidaat en de open kustbevinding worden uitsluitend op `v3/relief-z8` vastgelegd.

## Reproductie

Python 3.8.2, NumPy 1.24.4, Pillow 10.4.0, tijdelijke omgeving buiten de repo:

```sh
python scripts/geography/generate-terrain.py --cache /path/to/cache --zoom 8 --dpr 2
python scripts/geography/qa-relief-z8.py --cache /path/to/cache
```

De generator schrijft de ruwe DEM uitsluitend in de cache voor de QA. De eerste download legt de tegelhashes vast in de provenance. Bij herbouw worden alle 208 tegelhashes, de tegeldekking, bron-documenthashes en bestaande rasterafmetingen geverifieerd; een verschil stopt de build. Herbouw uit de gepinde cache geeft exact dezelfde WebP-SHA256. Een proef met een beschadigde tegel is afgewezen voordat het bestaande WebP werd overschreven. Beide kustdetailbeelden worden door dezelfde QA-opdracht reproduceerbaar uit de ruwe DEM gerenderd.

De visuele vergelijking is een assetcontrole op het vaste frame, geen geïntegreerde V3-browser- of responsive QA: de app gebruikt nog het oorspronkelijke z7-bestand. De QA-afbeeldingen vallen buiten het WebP-runtimebudget.
