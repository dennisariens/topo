# Punt 1 — PASS (Chromium + WebKit)

Uitsluitend V3 Reis/kaart op commit `1a42590de5525bd4d9fb1bcd02bf384e4437b1c2` in de disposable checkout. Geen publicatie, release-GO of wijziging aan kandidaat/Git/assets.

- HTML: **50199445 bytes**; SHA256 `23dced34e7d9079cd59195532721f39b1bc6c1f00032ce6c4a41bb4ea619b556` vóór openen én na afloop gelijk.
- Browserengines: Chromium `Chrome 156.0.8078.4`, WebKit `Chrome 27.2` (maintained browser-veld behoudt de oorspronkelijke generieke “Chrome”-prefix; engine is WebKit). Playwright 1.64, gecachte binaries.
- Fysieke iPad Safari: **NIET GETEST**. VoiceOver: **NIET GETEST**.
- Geaccepteerde kustafwijking ≤2,84 SVG px niet heropend.

## Uitkomsten

| Criterium | Chromium | WebKit | Bewijs |
|---|---|---|---|
| V3-01 contextnamen toegestaan; geen van de 45 namen/aliassen in SVG-labels | PASS | PASS | Onafhankelijke Unicode/woordgrens-check per matrixgeval; nul hits |
| V3-01 negatieve controle | PASS | PASS | Alleen disposable DOM-label `B Á R I`; beide detecteren `Bari` / `city-1` |
| V3-02 alle 11 hoofdstukken × 2 kaartstijlen × 3 formaten | PASS, 66/66 | PASS, 66/66 | 132 unieke gevallen; 390×844, 320×640, 820×1180 |
| V3-02 werkelijke geselecteerde verf onder bediening | PASS | PASS | Nul bedekte geselecteerde pixels; echte RGB-verfdifferentie, niet alleen bbox |
| V3-03 echte pointerselectie op telefoon | PASS | PASS | Actief `H1#v3Title`, tabindex -1, zichtbaar; volgende toets naar hoofdactie |
| V3-03 echte toetsenbordselectie op telefoon | PASS | PASS | Tab/Enter (WebKit native Option-Tab/Enter), zonder focus() in testdriver |

Layout na hoofdstuk/stijlwissel: beelddecodering, wachttijd en zes opeenvolgende stabiele frames voor scrollY, CTM, viewBox en paneelhoogte. De kaart is in alle 132 meetbeelden volledig in het viewport. Bij geen kaart/bedienings-bbox-intersectie kan de bediening geen kaartverf bedekken (88 gevallen). Bij intersectie (44 gevallen, beide engines alle tablet-hoofdstukken/stijlen) worden bediening én de paddingcontainer tijdelijk verborgen en echte screenshot-RGB-bytes vergeleken met en zonder geselecteerde SVG-verf. Drempel: een verschil >10 in één RGB-kanaal. Geen RGBA-getbbox-gebruik. Tijdelijke stijlen worden hersteld.

Verfdetector-negatieve controle: schakelaar uitsluitend in disposable DOM boven Sicilië geplaatst. Detector meldt **1735 pixels** (Chromium) en **1710 pixels** (WebKit). Bronhashes daarna gelijk.

## Maintained script en twee verklaarde WebKit-harnessuitslagen

`scripts/qa-v3-reis.py` is onafhankelijk geheel uitgevoerd voor beide engines, elk exit 0. Kopieën verschillen uitsluitend op de browser-launchregel; expliciet HTML-pad en scratch-outputmap als argumenten. Geen assertions/checks verwijderd of afgezwakt. Samen 40 layoutgevallen en 132 maintained sweepgevallen. Geometrie 46/46, echte lesstart/terug/Verder en vraagbehoud slagen in beide engines, beide flowformaten; nul console/page-errors.

Het oorspronkelijke maintained WebKit-resultaat is **niet volledig groen** en is ongewijzigd bewaard:

1. `phoneSelectFocusOnTitle=false`: het script gebruikt gewone Tab. macOS WebKit neemt knoppen standaard niet op dezelfde wijze op als Chromium. De onafhankelijke test bereikt city2 met echte **Option-Tab**, drukt Enter, registreert `document.activeElement`, maakt screenshot en neemt de volgende Option-Tab. Beide pointer/keyboard-cases slagen zonder handmatige focusmaskering.
2. `mapFrameShort` meldt acht telefoongevallen. Gereproduceerde oorzaak: WebKit `SVG.scrollIntoView({block:'center'})` scrollt in het 390×844-geval naar **scrollY=566**, kaarttop **-282**, terwijl de kaart op scrollY=0 correct is. Chromium centreert naar scrollY=12. Zie `frame-diagnostic.json` met rect/CTM en echte screenshots. De onafhankelijke matrix gebruikt expliciete scrollTo op basis van de gemeten viewportrect. Extra frame-diagnose behoudt dezelfde feature-picking en ≥80%-contrastcriteria, alleen expliciete centrering: **24/24 PASS**, zonder ontbrekende vereiste referenties. Dit is een harness-scrollprobleem, niet ontbrekende geografie.

Kortste reproductie van de oorspronkelijke harnessmeldingen: run `maintained-webkit.py` met HTML en scratch-outputpad; bekijk `summary.mapFrameShort` en `summary.phoneSelectFocusOnTitle`. Voor het scrollverschil run `frame_diagnostic.py`; voor correcte centreermeting `frame_explicit_scroll.py`.

## Bewijs en reproduceerbaarheid

- [Geaggregeerde uitkomst](summary.json), [132-casematrix](matrix.json), [hashes en onafhankelijke uitkomsten](independent-summary.json).
- [Onafhankelijke driver](independent.py), [maintained runner](run_maintained.py), [maintained launch-status](maintained-status.json).
- [Chromium onderhouden resultaten](maintained-chromium/results.json), [WebKit onderhouden resultaten](maintained-webkit/results.json).
- [Chromium onafhankelijk](independent-chromium/results.json), [WebKit onafhankelijk](independent-webkit/results.json).
- [WebKit keyboard-focus screenshot](independent-webkit/focus-keyboard.png), [Chromium keyboard-focus screenshot](independent-chromium/focus-keyboard.png).
- [320×640 Eilanden/Schoolkaart](independent-chromium/320x640-islands-false.png), [WebKit Eilanden/Schoolkaart](independent-webkit/390x844-islands-false.png).
- [Verfdetectorcontrole](paint-negative-control.json), [framediagnose](frame-diagnostic.json), [24 expliciete framechecks](frame-explicit-scroll.json).

Reproductie onafhankelijk: `/Users/dennisariens/.hermes/cache/scratch/hermes-v3-afb32d1/python311/bin/python /Users/dennisariens/.hermes/cache/scratch/hermes-v3-app-1a42590/reis/independent.py`. De driver verifieert eerst de exacte HTML-hash en grootte en schrijft uitsluitend onder deze scratch-map. Maintained: dezelfde Python met `/Users/dennisariens/.hermes/cache/scratch/hermes-v3-app-1a42590/reis/run_maintained.py`.

AGENTS, PROJECT_STATE, alle 9-novemberbesluiten, maintained script en werkelijke reis.js/css gelezen. HTML, reis.js/css, maintained bron en index.html blijven hashgelijk; Git HEAD exact en status schoon gecontroleerd na de tests. Geen onvolledige V3-01/02/03-enginecriteria; hardware/VoiceOver vallen buiten de uitgevoerde scope.
