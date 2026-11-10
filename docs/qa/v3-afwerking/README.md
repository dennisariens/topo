# V3.0 — afwerking na fase B

Bron: `docs/v3/renders/README.md` › "Afwerking na fase B" en "Bijstelling eigenaar (10-11, middag)". Alleen presentatie; de logica blijft gelijk.

## Stap 1 — wash, glas en typeschaal

`scripts/qa-v3-afwerking.py` (na `node scripts/build-v3-preview.mjs`), met `prefers-reduced-transparency: no-preference`:

- schermen: Reis, Oefenen, Les, Toets instellen, Toets resultaat, Beloningen en Voortgang;
- viewports: desktop 1440×900, iPad liggend 1180×820 en iPad staand 820×1180;
- Landschap (Reis, Oefenen, Les, Toets resultaat) op desktop en iPad liggend, op BG-01, BG-02 en BG-03.

Per run:

- **tekst ≥ 13 px:** geldt voor alle zichtbare tekst. Kaartlabels in de svg tellen niet mee, en tekst die een scrollend vak afsnijdt ook niet;
- **AA-contrast:** gemeten tegen wat er echt achter de tekst staat, in een tweede screenshot met transparante tekst. De lichtste en de donkerste plek tellen allebei;
- **geen horizontale overloop en geen paginafouten.**

Resultaat: `results-afwerking.json` (41 runs, geslaagd).

Bijgesteld: `qa-v3-faseb-beloningen.py` en `qa-v3-faseb-voortgang.py` tellen kerncijfers (32–44/700) niet langer als display-tekst; alleen de titel is display.

Open: de tablabels op de telefoon blijven 11 px. Zes tabs passen niet op 13 px; de check geldt vanaf 768 px.
