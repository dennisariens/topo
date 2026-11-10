# Overdracht V3.0 — bouw naar Codex (10-11)

Claude Code heeft tot donderdag geen ruimte meer. Codex neemt de bouw op `codex/topo-v3` over, vanaf `0dc0193` ("afwerking stap 1: wash, glas en typeschaal").

**Eén eigenaar per pakket:** Codex bouwt; Claude Code doet tot donderdag niets op deze branch. Lead design en review blijven in de chat, Hermes doet de QA.

## Al gedaan

- V3.0 functioneel: navigatie, Toets, Voortgang, kennismaking en schoolblad, plus de review-fixes.
- Fase A: frame, glas, viola, kaart zonder waas.
- Fase B: alle schermen volgens de doelbeelden.
- Importfix en resetbeleid (`636ba53`).
- Afwerking stap 1 (`0dc0193`): wash, glas en typeschaal, plus de check tekst ≥ 13 px.

## Nog te doen, in deze volgorde

1. **Afwerking stap 2, kaart:**
   - variant (a) Eiland is gekozen; verwijder variant (b);
   - de kaart vult haar rastervlak;
   - het reliëf krijgt diepte (hillshade, verzadiging ±1,15, slagschaduw);
   - check kaart ≥ 45% van het inhoudsvlak (Landschap).
2. **Afwerking stap 3, opbouw:** **kaart links, bediening rechts** op Reis, Oefenen, Les, Toets resultaat en Voortgang. Op Reis staat de hoofdstukkaart onderaan op het kaartvlak en de lijst rechts.
3. **Afwerking stap 4, per scherm:**
   - **Toets:** de score violet, gewicht 600, zonder kader en zonder zichtbare focusring; Nino vrij in een eigen rastervlak, met een overlap-check;
   - **Beloningen:** het boek is de knop (geen cirkel, geen "Open Reisboekje"); "Pizza 2" wordt "Pizza";
   - **Voortgang:** een grote kaart links; rijen op slot zonder balk; Toetsen binnen het frame;
   - **Les:** de kaart groter.
4. **Master-assets:** `origin/art/master` `339c420` → de pijplijn `art/v3-render-assets` (manifest met SHA256, bron en status "eigenaar akkoord, Hermes open"; WebP op de maat van het gebruik). Daarna integreren volgens DECISIONS 2026-11-10 ("Master-assets"). **`art/master` niet mergen.** NINO-ONDERWEG is `vespa-rijdend` of `vespa-bagage`. De paspoortbeelden niet gebruiken.
5. **Bewijs:**
   - vergelijkingen in `docs/qa/v3-stijlbeeld/` (desktop 1440×900, iPad liggend, telefoon);
   - alle QA-scripts groen;
   - werk `docs/PROJECT_STATE.md` bij;
   - tot slot een hertestverzoek voor Hermes op de eindpin.

## Bronnen (in deze volgorde)

1. `docs/v3/renders/README.md`. Bij een conflict wint de **laatste** sectie: "Afwerking na fase B" en "Bijstelling eigenaar (10-11, middag)", met glas 72% plus vibrancy.
2. Daarna `docs/DECISIONS.md` (10-11), `docs/v3/DESIGN_AUDIT_V3_0.md` en `docs/v3/DESIGN_FEEDBACK.md`.
3. De doelbeelden: `docs/v3/renders/R-*.webp`.

## Harde regels

- `index.html` blijft byte-gelijk (SHA256 `3aced3c3…`).
- Gedrag en logica blijven ongewijzigd: acties lopen via de bestaande V2-knoppen en -functies.
- Echte geometrie; de geometriecheck blijft 46/46.
- Offline, toetsenbord, focus, verminderde beweging en contrast AA.
- Lint, test, build en alle QA-scripts groen.
- Eén commit per stap, push na elke stap; de preview niet committen.
