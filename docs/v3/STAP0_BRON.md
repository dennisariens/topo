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
