# V3.0 — navigatie op alle schermen (bewijs)

Spec: [`docs/v3/V3_0_REST.md`](../../v3/V3_0_REST.md) § 1. Script: `scripts/qa-v3-shell.py`. Resultaat: [`results.json`](results.json), met de preview-SHA en de `index.html`-SHA (byte-gelijk, `3aced3c3…`).

Op vijf formaten — desktop 1440×900, iPad liggend 1180×820, iPad staand 820×1180, telefoon 390×844 en 320×640 — op de demo `#bezig`:

- **Navigatie overal.** Reis, Oefenen, Toets, Beloningen, Voortgang en Instellingen zijn bereikbaar op het V3-venster en in een les (zijbalk, rail of tabbalk).
  - Precies één navigatie is zichtbaar.
  - De actieve tab heeft `aria-current=page`.
  - Er is geen V2-header, V2-nav, `nav.tabs`, `#focusMenu` of backupbalk zichtbaar.
- **Focus.** Elke tab zet de focus op de titel van zijn view. Instellingen opent het V2-dialoogvenster; na Escape staat de focus weer op de tab.
- **Oefenen.** Aanwijzen + Steden 1–6 → Start opent het vrij oefenen in de shell, onder de tab Oefenen. Daarna Reis → Oefenen: dezelfde vraag en dezelfde modus.
- **Routeles.** Reis → hoofdactie opent de les, onder de tab Reis. Daarna Beloningen → Reis → hoofdactie: dezelfde vraag.
- **Maatvoering.** Tabs zijn minstens 44 px, staan binnen het scherm, en er is geen horizontale scroll. Rail en tabbalk bedekken het antwoordblad niet.

Screenshots per formaat: `reis-`, `oefenen-`, `toets-`, `rewards-`, `voortgang-`, `vrij-oefenen-` en `les-<formaat>.png`.

De bestaande V3-QA (`qa-v3-reis.py`, `qa-v3-les.py`, `qa-v3-stijlbeeld.py`, `qa-v3-toets-beloning.py`) is groen. De selectors zijn bijgewerkt naar `.v3ShellNav`.
