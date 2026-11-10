# V3.0 fase A — canvas, glas en kaart (bewijs)

Opdracht: visuele herziening fase A (`docs/v3/DESIGN_AUDIT_V3_0.md`, `docs/v3/renders/README.md` § Ingetogenheid). Script: `scripts/qa-v3-glas.py`. Resultaat: [`results.json`](results.json), met de preview-SHA en de `index.html`-SHA (byte-gelijk, `3aced3c3…`).

Gemeten op Reis, Les, Oefenen, Toets en Voortgang, op desktop 1440×900 en iPad liggend 1180×820, demo `#bezig`. Reis en Les ook met verminderde transparantie (`-verminderd`).

| Check | Drempel | Hoe |
| --- | --- | --- |
| Frame | op elke tab identiek (±1 px): marge 28 (iPad 20), radius 28 | `.v3Reis`, en in lessen `body::after`; gemeten ten opzichte van de previewbalk |
| Achtergrond zichtbaar (Landschap: Reis, Les, Oefenen) | ≥ 30% van de viewport | Raster van 40×25 punten. Een punt telt als er geen kaart, beeld of dekkende laag boven het artwork ligt. Glas met een gestapelde alfa ≤ 0,75 laat het artwork door. |
| Artwork zichtbaar (Werkblad: Toets instellen, Voortgang) | ≥ 12% | als hierboven |
| Geen dekkend paneel (Landschap) | geen paneel met alfa ≥ 0,9 breder dan 70% | Alle zichtbare elementen hoger dan 40 px; de previewbalk telt niet mee. |
| Contrast | AA: 4,5, of 3 voor grote tekst | Elke zichtbare V3-tekst tegen de gerenderde pixels erachter: tweede screenshot met onzichtbare tekst, 5e percentiel van het binnenste deel van het tekstvak. |
| Thema | viola (`#5b45e0`) | `--v3-accent` |
| Verminderde transparantie | geen blur meer op de panelen | `backdrop-filter` van zijbalk, panelen en stappenbalk |
| Kaartrand | geen masker en opacity ≥ 0,85 aan de rand | stap 2 |

## Stap 1 — canvas en glas

Voor (`43e56d1`): de achtergrond was op 0–37% zichtbaar en een les had een dekkende balk van 1208 px. Op de iPad lag de les in een beige focusvlak met een zeekleurig kaartvlak over de volle breedte.

Na: één frame op alle tabs. Op Landschap-schermen is de achtergrond op 55–82% zichtbaar en is geen paneel dekkend en breder dan 70%. Op Werkblad-schermen is het artwork op 12–24% zichtbaar. Geen tekst zit onder AA. Getallen per scherm: `results.json › summary.free`. Screenshots: `<scherm>-<formaat>.png`. Voor/na-vergelijkingen: [`docs/qa/v3-stijlbeeld/voor-na-*.jpg`](../v3-stijlbeeld/README.md#fase-a-voor-en-na).

Bekende uitzondering: met verminderde transparantie is de stappenbalk van de les ondoorzichtig en breder dan 70% (gerapporteerd, niet afgekeurd; zie DECISIONS).
