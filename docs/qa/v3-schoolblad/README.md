# V3.0 — Schoolbladknop en toets S (bewijs)

Spec: [`docs/v3/V3_0_REST.md`](../../v3/V3_0_REST.md) § 5. Script: `scripts/qa-v3-schoolblad.py`. Resultaat: [`results.json`](results.json), met de preview-SHA en de `index.html`-SHA (byte-gelijk).

Gecontroleerd op vijf formaten: desktop, iPad liggend, iPad staand, telefoon en 320 px.

- **Reis** (`#bezig`):
  - de knop naast Schoolkaart/Reliëf opent het V2-schoolblad;
  - na Escape staat de focus weer op de knop;
  - S opent het ook;
  - Ctrl+S, Cmd+S en Alt+S doen niets.
- **Routeles Aanwijzen:**
  - de knop staat in de leskop;
  - S opent het schoolblad;
  - na sluiten is het dezelfde vraag en staat de focus terug op de knop.
- **Oefenen › Ontdekken:** de knop staat in de leskop.
- **Oefenen › Namen schrijven:**
  - S in het antwoordveld typt alleen een letter;
  - de knop bewaart het concept (`Pisas`) en de selectie (1–4, achterwaarts);
  - na sluiten staat de focus weer in het antwoordveld.
- **Toets** (tab en lopende V2-toets) **en Gouden proef** (`#afgerond`, Extra steden 13–18 → ★ Goud): er is geen knop en S doet niets.
- **V2-knoppen:** de schoolbladknoppen van V2 zijn nergens zichtbaar.

Screenshots: `reis-`, `open-`, `les-`, `ontdekken-`, `toets-` en `goud-<formaat>.png`.

**Open punt:** het V2-venster heeft een eigen hulpregel ("Vergroot met + of twee vingers…") en de ondertitel "Referentie · niet interactief". Die blijven, omdat de spec het bestaande venster voorschrijft. Weghalen kan later met een V3-stijlregel, als de eigenaar dat wil.
