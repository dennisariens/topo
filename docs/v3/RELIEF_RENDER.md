# Pakket reliëf-render (opdracht, 13-11)

**Doel:** de reliëfkaart op Reis, Oefenen en het toetsresultaat krijgt de diepte en het licht van de doelbeelden (`R-reis-ijk`, `R-oefenen-ijk`): oranje-bruine bergen, witte Alpen, warm geelgroen laagland, sterke schaduwen en een "3D-miniatuur"-gevoel. Een filter over het huidige raster haalt dat niet (overdracht ronde 5, punt 8). Daarom komt er een nieuwe render uit de vastgelegde DEM.

**Stopcriterium:** de vergelijking naast `R-reis-ijk` en `R-oefenen-ijk` op desktop en iPad 1080×810 (`docs/qa/v3-stijlbeeld/final/relief-render-*.png`) en akkoord van de lead designer en de eigenaar. Geometrie ongewijzigd (kustlijn, eilanden en ankers op dezelfde plek; geometriecheck 46/46).

## Werkwijze

1. **Een eenmalig render-script** (`scripts/render-relief-v3.py`, offline, deterministisch) op de bestaande vastgelegde DEM (`assets/discovery/terrain-z8*` en de herkomst). Geen nieuwe brondata zonder herkomst en hash.
2. **Techniek** (kiezen wat werkt, binnen het budget):
   - multidirectionele hillshade met een hoofdlicht uit het noordwesten;
   - verticale overdrijving ±2–3×;
   - ambient occlusion of sky-view-factor voor diepte in de dalen;
   - hypsometrische tint: laagland geelgroen (`#A8C25A`), heuvels olijf, middengebergte okerbruin (`#B07A45`), hooggebergte bruin (`#8A5A3A`), sneeuw vanaf de Alpenhoogte wit met een blauwe schaduw;
   - een zachte "rand" langs de kust, zoals bij een uitgesneden miniatuur, plus de slagschaduw die er al is.
3. **Export:** WebP op de maat uit het assetdieet (maximaal 2× de weergavemaat), met een budget van ≤ 600 KB. De master (PNG of 16-bit) gaat naar `art/v3-render-assets`, met manifest en SHA256.
4. **Inbouw:** vervangt alleen de reliëflaag; schoolkaart, pins, landmarks en lifestyle-iconen blijven gelijk.

## Grenzen

- `index.html` en `src/v2/` ongewijzigd.
- Leren gebeurt op de schoolkaart: dit raakt alleen de belevingskaart.
- Eén sessie. Lukt het doelbeeld niet binnen het budget, lever dan de beste variant met een vergelijking, en stop.
