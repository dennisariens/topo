# Stap 0: `index.html` opsplitsen in bronbestanden (geen gedragswijziging)

**Doel:** agents lezen en wijzigen kleine bronbestanden in plaats van één bestand van 41 MB. De build zet ze weer in elkaar tot **exact hetzelfde** `index.html` (SHA256 `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a`). Dit is de goedkope voorloper van de runtime-migratie (`arch/v3-runtime`, ARCHITECTUUR.md). Besluit van de eigenaar, 12-11.

**Branch en eigenaar:** `arch/stap0-bron`, vanaf de laatste `codex/topo-v3`, gebouwd door Claude Code. Codex werkt parallel op `codex/topo-v3` (landmarks); raak `scripts/v3/` en `docs/v3/renders/` niet aan. Geen merge, deploy of publicatie zonder akkoord van de eigenaar.

## Opbouw (voorstel; leg de definitieve indeling vast in de overdracht)

```
src/v2/
  index.template.html   skelet met plaatshouders <!--@part:naam-->
  head/                 meta, titel
  styles/*.css          elk inline <style>-blok, in volgorde
  scripts/*.js          elk inline <script>-blok, in volgorde (de eerste twee = scripts/learning-engine.js en scripts/route-engine.js: hergebruik die, geen kopie)
  markup/*.html         grote markup-blokken (kaart-SVG, dialogen) als dat de leesbaarheid helpt
  data/*.json|js        kaartdata (ITEMS, CONTEXT_LAND, italy, NAME_ANCHORS …) alleen als ze letterlijk terug te zetten zijn
assets/v2/              gedecodeerde data-URI's (webp, png, jpg, svg) + assets.json (naam, mime, sha256, plek)
scripts/assemble-index.mjs
```

## Regels

1. **Byte-identiek:** `node scripts/assemble-index.mjs` schrijft `index.html` en controleert de SHA256. Wijkt die af, dan faalt het script. Het moet ook elke data-URI exact terugzetten: hetzelfde mime-type en dezelfde base64-vorm (zonder regelafbreking als het origineel die niet heeft).
2. **Bron leidend:** `index.html` blijft gecommit als leverbaar product, maar wordt gegenereerd. `npm run lint` faalt als `index.html` niet gelijk is aan de assemble-uitvoer. Agents wijzigen `src/v2/` of `assets/v2/`, nooit `index.html` direct.
3. **Bestaande checks blijven:** `npm run lint`, `npm test` en `npm run build` groen, en de geometriecheck 46/46. De bestaande koppeling tussen `scripts/learning-engine.js`, `scripts/route-engine.js` en de inline scripts blijft gelden: dat zijn nu dezelfde bronnen.
4. **Klein houden:** geen herschrijving, geen hernoemen van functies, geen formattering (geen prettier). Alleen knippen en terugzetten.
5. **Preview:** `scripts/build-v3-preview.mjs` blijft werken; die leest het gegenereerde `index.html`.

## Oplevering

- **Commits:** (1) het assemble-script met de byte-check, (2) de extractie, (3) de lint-koppeling en de update van `AGENTS.md` en `docs/v3/SPEC.md` (de regel "wijzig src/v2, nooit index.html").
- **Overdracht** onderaan dit bestand:
  - de pin;
  - een tabel met onderdelen en hun grootte (hoeveel van de 41 MB is code, hoeveel data, hoeveel assets);
  - de grootste bestanden die een agent nog zou kunnen openen.
- **Tijdsbudget:** 1 tot 2 sessies. Lukt byte-identiek niet voor een onderdeel, laat dat onderdeel dan in de template staan en noteer het; forceer niets.

## Overdracht (Claude Code, 12-11)

**Pin:** `index.html` SHA256 `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a` (41 445 845 bytes), vastgelegd in `src/v2/index.sha256`. `node scripts/assemble-index.mjs` bouwt exact dezelfde bytes terug; `dist/index.html` na `npm run build` heeft dezelfde hash. Commits op `arch/stap0-bron`: assemble-script → extractie → lint-koppeling + regels.

**Definitieve indeling**

```
src/v2/index.template.html   skelet (2 KB): head, <style>/<script>-schillen, kleine BEGIN/END-blokken inline
src/v2/index.sha256          pin; alleen wijzigen via --update-pin
src/v2/styles/01..04-*.css   vier inline <style>-blokken (05 en 06 zijn alleen includes, staan in de template)
src/v2/markup/01-body-voor-kaart.html, 02-kaart.svg.html, 03-body-na-kaart.html
src/v2/scripts/NN-*.js       hoofdscript, geknipt op de top-level // BEGIN/END-markers (nummer = volgorde;
                             ontbrekende nummers zijn kleine blokken die in de template staan)
src/v2/data/items.js, context-land.js, italy.js   de drie data-regels uit 05-app-kern.js (incl. regeleinde)
assets/v2/*.webp|png|jpg     56 unieke gedecodeerde bestanden (62 data-URI's; dubbele gedeeld via sha256)
assets/v2/assets.json        naam → mime, sha256, bytes, gebruikt-in
```

Plaatshouders: `<!--@part:PAD-->` (recursief, pad vanaf de repo-root) en `<!--@asset:NAAM-->`. **Geen kopieën:** 26 bestaande bronnen in `scripts/` (o.a. `learning-engine.js`, `route-engine.js`, `map-hit.js`, `nino-v2.js`, `discovery-map.js`, `focus-*.js|css`, `schoolblad.*`, `nino-*.css`) staan niet in `src/v2/` maar worden met `<!--@part:scripts/…-->` ingevoegd. Alles bleek byte-identiek terug te zetten; niets is in de template achtergebleven wegens een afwijking. `NAME_ANCHORS` (20 regels) is klein en staat nog in `05-app-kern.js`.

**Groottes (bytes in `index.html`)**

| Onderdeel | In index.html | Op schijf in bron |
|---|---:|---:|
| Assets (data-URI's, base64) | 40 861 820 (98,6 %) | 29 285 280 in `assets/v2/` (gedecodeerd) |
| Kaartdata (ITEMS, CONTEXT_LAND, italy, kaart-SVG) | 256 611 (0,6 %) | idem |
| Code en overige markup (CSS, JS, HTML) | 327 414 (0,8 %) | idem, verdeeld over `src/v2/` en `scripts/` |
| **Totaal** | **41 445 845** | |

**Grootste tekstbestanden die een agent nog zou kunnen openen** (gericht zoeken blijft beter):
`src/v2/markup/02-kaart.svg.html` 129 KB · `src/v2/data/context-land.js` 65 KB · `src/v2/scripts/05-app-kern.js` 53 KB · `src/v2/data/items.js` 52 KB · `scripts/nino-v2.js` 27 KB · `scripts/map-hit.js` 25 KB · `scripts/nino-moments.css` 20 KB · `src/v2/styles/02-stabilisatie.css` 19 KB. Alle andere bronnen zijn kleiner dan 17 KB. De grootste assets zijn de scènes `nino-v2-sardegna|sicilia|napoli.webp` (2,4–2,7 MB, binair; nooit openen).

**Controles:** `npm run lint` (nu met assemble-vergelijking), `npm test` en `npm run build` groen, alleen aan het eind gedraaid. De browsergebonden geometriecheck 46/46 is niet apart gedraaid; `index.html` is byte-gelijk aan de pin, dus de geometrie is ongewijzigd.

**Open punten**
1. De oude `scripts/embed-*.mjs` (nino-art, nino-v2, map-hit, focus-mode, discovery-map, schoolblad, micro-icons, cplus, pizza) schrijven nog direct in `index.html`. Dat breekt nu de lint. Ombouwen of uitfaseren hoort bij de runtime-migratie; tot dan: niet gebruiken.
2. Wie een bron in `scripts/` wijzigt die ingevoegd wordt (bijv. `map-hit.js`), verandert `index.html`: draai `node scripts/assemble-index.mjs --update-pin` en de bestaande pariteitstests. Tests die oude commits van `index.html` vergelijken (audit-/baseline-tests) blijven op de gegenereerde `index.html` werken.
3. Editors die een slot-regeleinde toevoegen breken de byte-gelijkheid (de assemble-check vangt dat). `.gitattributes` zet `src/v2/** -text` en `assets/v2/** binary` tegen eol-conversie.
4. Asset-namen zijn afgeleid van de JSON-sleutel (`nino-v2-stamp3.webp` enz.); een aantal is byte-gelijk aan bestanden in `assets/nino/…` (git deelt die blobs). Ontdubbelen naar één bronmap kan bij de runtime-migratie.
5. Het eenmalige extractiescript is niet gecommit; de extractie is reproduceerbaar uit commit `e300ed5`.
