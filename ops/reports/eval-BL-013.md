# Evaluatie BL-013 — Portal R3 als site-root (ronde 2)

Branch `t/BL-013-portal-r3` @ `7c7bdad` (fix `7a162d2` + merge van main `b79fd80`) · evaluator · 2026-11-14

**Ronde 1** (`7becc1f`): FAIL. In de Binnenkort-kaarten werden landnamen afgesneden en overlapt door de pill op 1080×810, 810×1080, 1024×768 en 768×1024 ("Spanj", "Duitsl", "Neder"). De pill had een contrast van 4,45:1. Buiten scope: tekst onder 13 px (tagline 10, footer 11, pills 12), tagline 2,96:1 en footer 2,70:1, beide logo-SVG's gedownload, Frankrijk-kaart met hover-lift zonder actie, `build-site.mjs` niet bestand tegen een tweede run, merge-conflict met main.

VERDICT: PASS

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Site-indeling klopt | `npm run build` + `npm run build:site` (zelf gedraaid, exitcodes apart gecontroleerd) | PASS | build=0, site=0; "Site: dist/ (portal, 24 assets) + dist/italie/ (app)", "Site-check: OK"; `dist/italie/` bevat index.html, print.html, printboek.pdf, scripts |
| 2 | App ongewijzigd | `git diff --stat origin/main -- index.html print.html scripts/learning-engine.js scripts/route-engine.js` (na `git fetch`) | PASS | lege diff. `git merge-tree --write-tree origin/main HEAD` → exit 0, tree `7fadcf2`, geen conflicten |
| 3 | Bestaande tests groen | `npm run lint && npm test` (zelf gedraaid) | PASS | exit 0; syntax OK, alle 7 testscripts OK |
| 4 | Geen kapotte verwijzingen | Playwright + `/usr/bin/google-chrome --no-sandbox`, `python3 -m http.server 8791` op `dist/`, lazy→eager + scroll, 7 viewports | PASS | Op 1440×900, 1080×810, 1024×768, 810×1080, 768×1024, 390×844 en 320×720: 0 HTTP ≥ 400, 0 requestfailed, 0 console-fouten of -waarschuwingen, 17/17 afbeeldingen geladen. `/italie/` op 1080×810, 810×1080 en 390×844: 0 fouten, 0 kapotte afbeeldingen |
| 5 | Geen horizontale scroll, Nino overlapt geen kaart (en, na ronde 1: geen afgesneden tekst) | dezelfde run: `scrollWidth` vs `clientWidth` op alle elementen, tekstbereik van naam vs rechthoek van pill/knop, kinderen buiten de kaart | PASS | `scrollWidth = innerWidth` op alle 7. 0 elementen met scrollWidth > clientWidth. h2/h3: scrollWidth = clientWidth (Spanje 108, Duitsland 129, Nederland 138 px). 0 overlaps tussen naam en pill/knop, 0 elementen buiten de kaart. Op ≤ 1080 px staat de pill onder de naam (flex-wrap). Mascotte zichtbaar op 1440/1080/1024 zonder overlap, verborgen ≤ 820 px |
| 6 | Italië-knop werkt | klik "Start leren" op alle 7 viewports, plus Tab×3 + Enter | PASS | steeds `http://127.0.0.1:8791/italie/`, titel "Topo Italië · leer de kaart". Tab-volgorde: skip-link → logo → "Start Italië leren" |
| 7 | R3-assets byte-gelijk aan `art/master` | `sha256sum -c --ignore-missing` tegen `SHA256SUMS.txt` van `origin/art/master` (`b9e4a38`, ls-remote) | PASS (dezelfde kanttekening als ronde 1) | 10/10 OK in de werkmap, 9/9 OK in `dist/` (favicon-48 is niet gekopieerd, wordt niet gebruikt). `dist/favicon.ico` heeft dezelfde hash als de master. 0 mismatches |
| 8 | Frankrijk heeft geen verzonnen route | bron + DOM | PASS | `routes={italy:'./italie/',france:null}`; Frankrijk toont "Leeromgeving volgt" (span, geen link) |
| 9 | Contrast knoppen | `verify-site.mjs` + eigen berekening uit de computed colors | PASS | Start leren #FFF/#7B66B7 4,74:1; Leeromgeving volgt en Binnenkort #685398/#F1EDFA 5,56:1 |

## Herstelclaims ronde 1, zelf gemeten
1. **Namen niet meer afgesneden of overlapt:** klopt op alle 7 viewports (zie #5).
2. **Alle zichtbare tekst ≥ 13 px:** klopt. Gemeten op alle zichtbare tekstnodes, minimum 13 px op alle viewports. `.eyebrow{font-size:11px}` staat nog in de CSS, maar geen enkel element gebruikt die klasse.
3. **Contrast van tagline, footer en pill ≥ 4,5:1:** klopt. Tagline en footer #6B6B75/#FAFAF9 5,05:1, pill 5,56:1.
4. **Eén logo-SVG per formaat:** klopt. ≥ 651 px vraagt alleen `logo-01-primary-r3-1.svg` op, ≤ 650 px alleen `logo-02-compact-r3-1.svg`. Dit staat in de requestlog.
5. **Frankrijk tilt niet op bij hover:** klopt. Transform blijft `none` en de schaduw verandert niet. Italië tilt wel op (`translateY(-3px)`), Spanje alleen met een schaduw.
6. **Tweede run van `build-site.mjs` geweigerd:** klopt. Exit 1 met "Draai eerst `npm run build`: dist/index.html moet de Italië-app zijn."; `dist/italie/` bleef intact en `verify-site` gaf daarna nog OK.

## Resterende problemen (niet blokkerend voor dit contract)
1. **De hero-ondertitel "Kies een land, ontdek bijzondere plekken …" haalt AA niet:** `--secondary` #73737D op `--bg` #FAFAF9 = **4,49:1** (16 px, normaal gewicht, op 390/320 is het 14 px). Op alle viewports is dit de enige tekst onder 4,5:1. Omdat het niet om een knop gaat, valt het buiten criterium 9. Voor G3 ("contrast AA") faalt het wel. Fix van één token: bijv. #6B6B75, dat al voor de tagline wordt gebruikt (5,05:1). `p.description` gebruikt dezelfde token op wit en haalt 4,69:1.
2. **320×720:** Spanje houdt de pill naast de naam, Duitsland en Nederland zetten hem eronder. Daardoor zien drie gelijke kaarten er ongelijk uit (screenshot bekeken).
3. **810×1080:** tussen de onderste kaartenrij en de footer zit ongeveer 100 px lege ruimte (`min-height:100vh` met `margin-top:auto`). Dat is cosmetisch.
4. In de CSS staat de dode regel `.eyebrow`.

Visueel bekeken (Read) op 1080×810, 810×1080, 390×844 en 320×720: geen afgesneden tekst, de pill staat netjes onder de naam (iPad) of ernaast (390), het logo is compact op mobiel en de mascotte overlapt niets. Een Golden Screen of render van het portal ontbreekt nog in `docs/v3/renders/`, dus een visuele vergelijking was niet mogelijk. Dat hoort bij G1 (GO van Dennis).

## Buiten scope opgemerkt (→ backlog-idee)
- De contrastcheck in `verify-site.mjs` meet alleen knoppen. Breid hem uit naar alle tekst-tokens (`--secondary` op `--bg` was hier 4,49).
- Gewicht en iPad-budget zijn nog niet vastgesteld (zie ronde 1, ~6 MB aan assets).
- Afgeleid, niet getest: `/italie` zonder slash op Vercel (lokaal 301 naar `/italie/`).

## Les
Een contrastmeting moet over alle zichtbare tekstnodes lopen, met de achtergrond berekend uit de DOM, en niet over een lijst bekende tokens. Zowel in ronde 1 als in ronde 2 kwam de overgebleven AA-fout uit een token die niemand had genoemd.

Artefacten (niet in repo): `/tmp/evalbl013/run.mjs`, `/tmp/evalbl013/result.json`, `/tmp/evalbl013/shots/portal-*.png`.
