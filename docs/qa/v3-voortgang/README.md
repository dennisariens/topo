# V3.0 — Voortgang (bewijs)

Spec: [`docs/v3/V3_0_REST.md`](../../v3/V3_0_REST.md) § 3. Script: `scripts/qa-v3-voortgang.py`. Resultaat: [`results.json`](results.json), met de preview-SHA en de `index.html`-SHA (byte-gelijk).

Gecontroleerd op vijf formaten × drie demo's (`#bezig`, `#afgerond`, `#alles`):

- **Kop.** `n / 45 plekken` en de balk komen overeen met het aantal plekken waarvan beide V2-paspoortlabels "Goed onthouden" zijn.
- **Kaart en legenda.**
  - De status per plek (beheerst, bezig, nog niet) staat op de echte kaart, met één klasse per plek.
  - Die status is gelijk aan een onafhankelijke herberekening uit `state.route.items` met de V2-labelregels.
  - De legenda-aantallen kloppen.
- **Hoofdstukken.** Lesstaven, ✓ en ★ zijn gelijk aan `TopoRoute.record` voor alle 11.
- **Kennis-paspoort.** De V2-tabel met 45 rijen staat in Voortgang, zonder V2-samenvatting en -toelichting.
- **Dagdoel.** Na drie V2-aanroepen van `recordDailyCorrect` toont Voortgang `3 / 8`, gelijk aan V2.
- **Toetsuitslagen.** Zonder uitslagen staat er "Nog geen toetsen.". Met twee opgeslagen uitslagen staan ze er allebei, de nieuwste eerst, met datum en score.
- **Overig.** De focus staat op de titel, er is geen streak en er is geen horizontale scroll.

Screenshots: `<demo>-<formaat>.png` en `met-toetsen-<formaat>.png` (`#afgerond`). Telefoon en 320 px staan erin als volledige pagina.
