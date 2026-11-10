# V3.0 — Toets (bewijs)

Spec: [`docs/v3/V3_0_REST.md`](../../v3/V3_0_REST.md) § 2. Script: `scripts/qa-v3-toets.py`. Resultaat: [`results.json`](results.json), met de preview-SHA en de `index.html`-SHA (byte-gelijk).

Gecontroleerd op vijf formaten, met de demo `#afgerond`:

- **Instellen.**
  - Standaard staan de afgeronde hoofdstukken aan, met vorm Beide en lengte 10.
  - De focus staat op de titel.
- **Toets.**
  - Het is de V2-toets in de shell, onder de tab Toets.
  - Bovenaan staat alleen `n / 10`.
  - Er zijn geen hints, geen Oefen fouten, geen pizzameter en geen schoolblad.
  - Er wordt met echte toetsen en klikken geantwoord: 7 goed, 2 fout (aanwijzen of typen) en 1 overgeslagen.
  - Foutenlijst (review-fix 10 november): bij Aanwijzen alleen de plek, bij Namen schrijven de plek met het getypte antwoord (geen "jij:"), zonder antwoord "overgeslagen". Over de vijf viewports komen alle drie de soorten voor; het printblad bevat geen "jij".
- **Geen beloningen.**
  - Pizzapunten, pizza's, ritten en de V2-teller `good` blijven gelijk.
  - Er opent geen beloningsdialoog en ook niet de V2-resultaatdialoog.
- **Resultaat.**
  - Score `7 / 10`, gelijk aan V2 `examCorrect` / `examTotal`.
  - Een Nino-pose en de kaart met 10 markeringen; de 3 × hebben een naam en vallen binnen de kaart.
  - Een foutenlijst met 3 regels.
  - Acties: Oefen deze fouten (primair), Nieuwe toets, Kopieer, E-mail en Print.
  - De mailtekst is correct en de focus staat op de score.
  - Er is geen horizontale scroll en elke knop is minstens 44 px.
- **Opslag.** Er staat één uitslag in `topo-v3-toetsen-v1`, met dezelfde vragen in dezelfde volgorde en dezelfde goed/fout als gespeeld.
- **Oefen deze fouten.** Opent de V2-groep "Mijn fouten" in Aanwijzen, onder de tab Oefenen (iPad, telefoon en 320 px).
- **Alleen op desktop:**
  - de export bevat `v3Toetsen`;
  - een import met 2 uitslagen vervangt de opgeslagen uitslagen;
  - een import van een oude kopie (zonder het veld) laat ze staan;
  - bij 10 opgeslagen uitslagen plus één nieuwe toets blijven er 10 over, met de nieuwe eerst;
  - Print bouwt het A4-blad met kaart en 10 markeringen. Het blad staat in [`print-a4.pdf`](print-a4.pdf): één pagina.

Screenshots: `instellen-`, `resultaat-<formaat>.png` en `toets-desktop.png` / `toets-telefoon.png` (vraag 3).

**Gevonden en opgelost:** op de telefoon kon een tik op Overslaan direct na het typen verloren gaan. De tabbalk kwam namelijk meteen terug en schoof het antwoordblad weg. Nu komen tabbalk en blad pas na 0,4 s terug.

**Open punt:** de echte printdialoog en het papier zijn niet getest. Het PDF komt van Chromium.

**Ruimte voor de tabbalk (review-fix 10 november).** Op de telefoon en op 320 px krijgen Kopieer, E-mail en Print elk toetsenbordfocus; ze staan dan minstens 16 px boven de tabbalk en zijn op hun middelpunt het bovenste element. Aan het einde van de pagina blijft minstens 8 px over (padding = gemeten tabbalk + 16 px). Screenshot: `resultaat-einde-telefoon.png` en `resultaat-einde-telefoon-320.png`. De lopende toets zit in de lesshell (V2-padding); daar klikt de QA elke vraag door met echte klikken.
