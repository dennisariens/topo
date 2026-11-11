# V3 — huidige waarheid (één pagina)

Lees voor V3-werk **alleen dit bestand en `docs/v3/OVERDRACHT.md`**. `DECISIONS.md` (lang, historisch) en `docs/v3/renders/README.md` (lagen bijstellingen) niet volledig inlezen; zoek er gericht in (`grep -n`) als iets hier ontbreekt. Bij een conflict wint dit bestand.

## Grenzen
- `index.html` (V2.0.2, 41 MB, SHA256 `3aced3c3…`) blijft byte-gelijk; **nooit volledig lezen**. Zoek gericht (`grep -n`, `sed -n` met een bereik).
- V3 is de presentatielaag in `scripts/v3/` en wordt alleen in de preview geïnjecteerd (`node scripts/build-v3-preview.mjs`). Acties lopen via de bestaande V2-knoppen en -functies.
- Echte geometrie (geometriecheck 46/46); offline; toetsenbord, focus, verminderde beweging en contrast AA.
- Geen merge, deploy of publicatie zonder akkoord van de eigenaar.

## Ontwerp (stand 11-11, pin `d2383f2`)
- **Twee werelden:** de app is violet glas; het Reisboekje is een papierwereld (omslag B: rood leer, kompasroos).
- **Frame:** identiek op alle tabs (marge 28 en radius 28 op desktop; 20 op iPad). De zijbalk is de glazen linkerkolom (wit 70%, neutraal).
- **Oppervlakken:**
  - Landschap (Reis, Oefenen, Les, Toets resultaat, Beloningen): glaspanelen wit 72% met blur en verzadiging;
  - Werkblad (Voortgang, Toets instellen, Instellingen): een plaat van 92%.
- **Achtergrond:** BG-03 Kust is de standaard; BG-01 en BG-02 zijn kiesbaar. Er ligt geen wash over het inhoudsvlak.
- **Kaart links, bediening rechts.** De kaart is variant Eiland (Italië zwevend, reliëf, slagschaduw) en het grootste element (≥ 45%). In de Les staat de volledige schoolkaart.
- **Typografie (desktop / iPad):**
  - titel 44/36 en kaarttitel 32/28, beide op 700;
  - nav 18/16 en rijen 17/16, beide op 600;
  - tellers 20/18 op 600; kerncijfers 40/32 op 700;
  - toetsscore 64/52 op 600 in violet;
  - secundair 14/13 op 500; niets onder 13 px.
- **Kleur:** inkt `#2A2440`. Violet alleen voor betekenis: primaire knop, actief item, selectie en voortgang.
- **Nino:** het portret in de zijbalk is vast. Poses alleen in de inhoud (master-assets `art/v3-render-assets`); bij het toetsresultaat staat Nino op de Vespa.
- **Doelbeelden:** `docs/v3/renders/R-*.webp`, met als laatste stand `docs/qa/v3-stijlbeeld/final/`.

## Werkwijze die credits spaart
- **Eén punt per sessie.** Lees alleen de bestanden die je wijzigt.
- **QA:** draai alleen de scripts voor het scherm dat je wijzigt. Het volledige pakket (`npm test` plus alle `qa-v3-*`) alleen bij de eindpin.
- **Screenshots:** alleen desktop van het gewijzigde scherm, overschreven in `docs/qa/v3-stijlbeeld/final/`. Geen nieuwe mappen per stap, en geen iPad of telefoon tussendoor.
- **Preview:** niet bouwen als het niet nodig is (50 MB); niet committen.
- **Afsluiten:** één korte overdracht met de pin, wat er veranderd is en wat open staat. Geen lange logs in Git.

## Ondergrens
- iPad 9e generatie (3 GB RAM, 1080×810 pt), iPadOS 26.7.2, Safari. Elk scherm moet daar passen, zonder afgesneden tekst.

## Stand
- **V3.0:** inhoudelijk en visueel klaar voor de Hermes-hertest op `d2383f2`.
- **Open:**
  - de iPad-test door de eigenaar;
  - de hertest door Hermes;
  - na V3.0 de runtime-migratie (`arch/v3-runtime`, met landpakket voor Frankrijk);
  - uitstapjes (V3.1).
