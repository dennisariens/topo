# Assetdieet: de V3-uitvoer kleiner en lichter (opdracht, 12-11)

**Doel:** de V3-preview van ±50 MB naar ±15–20 MB brengen, met minder decodeergeheugen op de iPad 9 (3 GB). De beeldkwaliteit op de schermmaat blijft gelijk. Na ronde 4, op `codex/topo-v3`. Besluit van de eigenaar, 12-11.

**Grens:** `index.html` en `src/v2/` blijven ongewijzigd (SHA256 `3aced3c3…`). Het dieet geldt alleen voor de V3-uitvoer van `scripts/build-v3-preview.mjs`. V2-gedrag verandert niet.

## Stappen (één commit per stap)

1. **Inventaris** `docs/v3/assets-inventaris.json` (script, geen handwerk). Per beeld in de V3-uitvoer (de V2-data-URI's uit `assets/v2/assets.json` plus de V3-render, de masters en de landmarks):
   - naam, bytes, afmetingen, waar het in V3 zichtbaar is (scherm en element) en de grootste weergavemaat in CSS-px op desktop en iPad;
   - "ongebruikt in V3" alleen als het bewezen is: een runtime-scan van alle schermen en staten, alle hoofdstukken, beloningen, het boek en Vespa. Bij twijfel geldt het als gebruikt.
2. **Weglaten in de preview-build:** beelden die bewezen ongebruikt zijn, worden in de V3-uitvoer vervangen door een kleine transparante placeholder. Een JS-verwijzing mag dus niet breken. De lijst staat in de inventaris.
3. **Schalen:** maximaal 2× de grootste weergavemaat (iPad 9: 1080×810 pt, 2×). De masters blijven ongewijzigd in Git; dit gebeurt alleen bij het exporteren.
4. **AVIF met WebP als terugval:**
   - AVIF (kwaliteit gekozen op een visuele drempel, SSIM ≥ 0,97 tegen het geschaalde origineel) waar Safari en Chromium het ondersteunen;
   - de terugval via `<picture>` of een functiecheck in JS;
   - werkt AVIF ergens niet, dan blijft WebP.
5. **Budgetten** met een check die faalt bij overschrijding:

   | Soort | Budget |
   | --- | --- |
   | Achtergrond | ≤ 400 KB |
   | Scène of kop | ≤ 300 KB |
   | Nino-pose of Vespa | ≤ 150 KB |
   | Landmark | ≤ 40 KB |
   | Icoon of tegel | ≤ 30 KB |
   | Totaal V3-uitvoer | ≤ 20 MB |

6. **Geheugen:** decodeer een beeld pas als het scherm het toont (`decoding="async"`, `loading="lazy"` waar dat kan), en houd geen verborgen grote `<img>` in de DOM. Meet de gedecodeerde RGBA-bytes per scherm voor en na.
7. **Bewijs:**
   - een tabel voor en na (totaal, per soort, de top 10);
   - screenshots van desktop en iPad 1080×810 van Reis, Toets resultaat en Beloningen naast elkaar, voor en na (kwaliteit gelijk);
   - QA alleen voor deze schermen, en aan het eind één keer de volledige suite.

## Regels

- Geen beeld zichtbaar slechter op de schermmaat. Bij twijfel liever minder winst.
- Offline blijft één HTML-bestand; geen externe bestanden.
- Werk SPEC.md bij met de budgetten en de exportregel.
- Overdracht onderaan dit bestand: de pin, de groottes voor en na, en de open punten.
