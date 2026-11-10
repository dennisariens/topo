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

## Stap 2 — kaart links, reliëf en per scherm

Dezelfde runs als stap 1. Op BG-01 komen daar deze checks bij:

| Check | Schermen | Drempel |
| --- | --- | --- |
| kaart links van het paneel | Reis, Oefenen, Les, Toets resultaat, Voortgang (desktop, iPad liggend) | de linkerrand van de kaart ligt links van die van het paneel |
| kaart ≥ 45% van het inhoudsvlak | Reis, Oefenen, Les, Toets resultaat (desktop, iPad liggend) | de kaartbox binnen het inhoudsvlak (binnenmarges, naast de zijbalk) ≥ 45%. De Les in Focus Mode (iPad) wordt niet gemeten |
| Nino zonder overlap | Toets resultaat | 0 px² overlap tussen Nino en een paneel |
| toetsscore | Toets resultaat | accentkleur, gewicht 600, geen kader of schaduw, geen focusring bij focus |
| het boek is de knop | Beloningen | geen knop "Open Reisboekje"; het omslag is focusbaar, zonder achtergrond of `backdrop-filter`; tegellabel "Pizza" |
| slotrijen | Voortgang | geen zichtbare balk |

Gemeten (`mapShare` in `results-afwerking.json`): Reis 52%, Oefenen 49% (desktop) en 58% (iPad liggend), Les 49% (desktop), Toets resultaat 56% (desktop) en 53% (iPad liggend).

De vergelijkingen naast de renders staan opnieuw in [`docs/qa/v3-stijlbeeld/`](../v3-stijlbeeld/README.md). Ze worden gemaakt door `qa-v3-faseb*.py`.

Open: de Les in Focus Mode (iPad) houdt zijn eigen indeling (ongeveer 35%). NINO-ONDERWEG volgt via de artworkpijplijn.
