# V3.0 — Kennismaking (bewijs)

Spec: [`docs/v3/V3_0_REST.md`](../../v3/V3_0_REST.md) § 4. Script: `scripts/qa-v3-kennismaking.py`. Resultaat: [`results.json`](results.json), met de preview-SHA en de `index.html`-SHA (byte-gelijk).

Gecontroleerd op vijf formaten × drie flows, met de demo `#welkom` (eerste bezoek):

- **Scène.**
  - De V2-eerste-keerdialoog verschijnt in V3-stijl, met welkomstpose, naamveld, de drie pizza's (margherita, salami, quattro_formaggi), Andiamo! en Start meteen.
  - Er staan geen hulpteksten.
  - De focus staat in de dialoog en de scène past op het scherm, zonder horizontale scroll.
- **Andiamo!**, alleen met het toetsenbord: naam typen, pizza kiezen met de pijltjes, Enter.
  - Het profiel is precies `{"schema":1,"name":"Lia","coverColor":"riviera","favoritePizza":"salami"}` en de intro staat op `done`.
  - Daarna Reis met Steden 1–6 geselecteerd.
- **Start meteen.**
  - Het profiel krijgt schema 1, een lege naam en geen pizza; de intro staat op `skipped`.
  - Reis opent met Steden 1–6.
  - De eerste les krijgt het eenmalige V2-aanbod in V3-stijl, zonder hulpregel. Daar start Start meteen de les.
- **Escape.** Werkt als Start meteen (V2-annuleren).

Screenshots: `kennismaking-<formaat>.png`, `kennismaking-ingevuld-desktop.png`, `reis-na-kennismaking-<formaat>.png` en `aanbod-desktop.png` / `aanbod-telefoon.png`.

**Niet in de preview te testen:** Begin helemaal opnieuw herlaadt de pagina, en de preview zet bij herladen de demo terug. Het V2-pad is ongewijzigd: het wist profiel, voortgang en de introductiesleutel, waarna V2 bij het opstarten de kennismaking opent. Dat is gedekt door de V2-tests in `npm test`.

**Label "Jouw naam" (review-fix 10 november).** Het label is op alle vijf formaten niet zichtbaar. Het veld is wel te vinden als tekstvak met de toegankelijke naam "Jouw naam" (`get_by_role('textbox', name='Jouw naam')`).
