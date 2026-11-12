# V4 Frankrijk: overdracht voor het parallelle spoor (12-11)

**Doel:** zodra V3.0 (Italië) af is en de runtime-migratie de grens tussen landpakket en kern heeft gelegd, wordt Frankrijk een **tweede landpakket**: data en artwork, geen nieuwe app. Alles wat nu kan worden voorbereid zonder de app te raken, gebeurt op eigen branches. Lead design en review blijven in de V3-chat.

## Wat vastligt (niet opnieuw beslissen)

- **Eén app, één UI-palet (violet glas).** Het land zit in het artwork, de driekleur, de stempels en het boek. Geen Franse UI-kleur.
- **Nino reist mee:** hetzelfde uniform (gesloten blauw werkshirt, rode sjaal, helm met bril, tas) en dezelfde rode master-Vespa.
- **Leren gebeurt altijd op de schoolkaart**, met echte geometrie. Reliëf en landmarks zijn alleen beleving (Reis, toetsresultaat).
- **Beloningsregel in de kern:** 8 punten per beloning, 3 per Vespa-rit, plus goud. Per land verschilt alleen het beeld (Italië: pizza).
- **Opbouw zoals Italië:** 11 hoofdstukken, drie stappen per hoofdstuk (Ontdekken, Aanwijzen, Namen schrijven), een Gouden proef, toets en voortgang.
- **Artworkregels:** geen tekst in beeld, geen logo's of merken, de stijl van de V3-renders en masters, masters in Git met manifest (SHA256) en eerst een review.
- **Architectuur:** `docs/v3/ARCHITECTUUR.md` § 3 (landpakket `src/lands/fr/`, kern landonafhankelijk, opslag per land met één profiel).

## Open besluiten (eigenaar)

1. **Lesstof:** het Franse schoolblad of de toetslijst van school is de bron voor de plekken. **Zonder die lijst geen definitieve hoofdstukken.**
2. **Beloningsbeeld:** voorstel croissant uit de bakkerij (8 stukjes per croissant).
3. **Paspoort:** wordt het teal paspoort (`art/master` masters `paspoort-*`) het overkoepelende boek met een stempel per land?
4. **Levering:** web-app (PWA via Vercel) met offline-download als tweede vorm. Zie het advies onderaan.

## Sporen die nu parallel kunnen (elk op een eigen branch, raakt de app niet)

### A · Lesstof en hoofdstukken, branch `land/fr-inhoud`
- Op basis van het schoolblad: een lijst van plekken (id, Nederlandse naam, Franse naam, type: stad, rivier, gebergte, regio, zee, eiland of buurland) en een indeling in 11 hoofdstukken.
- Nog zonder schoolblad: alleen een **conceptvoorstel**, gemarkeerd als concept.
- Uitvoer: `docs/v4/fr-inhoud.md` en `data/fr/items.draft.json`.

### B · Geografie, branch `land/fr-geo`
- Betrouwbare, vastgelegde brondata (Natural Earth 1:10m en, voor rivieren en steden, OSM of IGN-open data), met licentie, versie en hash, zoals in `docs/MAP_SYSTEM.md`.
- Inhoud:
  - de landsgrens, Corsica, de buurlanden (België, Luxemburg, Duitsland, Zwitserland, Italië, Spanje, Andorra, Monaco) en de zeeën (Noordzee, Het Kanaal, Atlantische Oceaan, Golf van Biskaje, Middellandse Zee);
  - rivieren (Seine, Loire, Rhône, Garonne, Rijn en verder volgens de lesstof);
  - gebergten (Alpen, Pyreneeën, Massif Central, Vogezen, Jura);
  - steden volgens de lesstof.
- Een projectie en een SVG-extent zoals bij Italië, plus een geometriecheck. **Alleen data en scripts**, geen UI.
- Uitvoer: `data/fr/` en `docs/v4/fr-geo.md`.

### C · Artwork, via ChatGPT naar branch `art/master` (`assets/art/masters/fr/`)
- **Achtergronden (2880×1800, kustgevoel zoals BG-03):** Provence met lavendel, de daken van Parijs met de Eiffeltoren in de verte, de kust van Bretagne.
- **11 hoofdstukbeelden**, volgens spoor A.
- **Scènes met Nino:** Parijs (Seine en Eiffeltoren), Mont-Saint-Michel, de oude haven van Marseille.
- **Landmarks (1024², alfa, 40 px leesbaar):** Eiffeltoren, Mont-Saint-Michel, Arc de Triomphe, Notre-Dame, Pont du Gard, Carcassonne, de kastelen van de Loire (Chambord), Mont Blanc, lavendelveld, Calanques.
- **Beloning:** een croissant (heel, en in 8 stukjes zoals de pizza-meter), een bakkerijdoos, en een postkaart Frankrijk.
- **Nino-poses:** de bestaande masters volstaan; alleen nieuwe scènes.
- Elk asset eerst ter review in de V3-chat.

## Advies levering: Vercel als PWA, offline-download als tweede vorm

**Advies van de lead designer en lead developer:**
- **Hoofdvorm:** een statische web-app op Vercel, geïnstalleerd als PWA ("Zet op beginscherm" op de iPad). Een service worker maakt hem volledig offline na het eerste bezoek.
- **Tweede vorm:** "Download voor offline": dezelfde bron, gebouwd als één HTML-bestand, zoals nu.

**Waarom:**
- De afbeeldingen worden losse bestanden in plaats van base64: ±33% kleiner en per land en scherm te laden. Een tweede land maakt de app dan niet steeds zwaarder.
- Updates komen vanzelf binnen, zonder bestanden te vervangen.
- Het past bij later werk: leraarsmodus en groepstoets (V3.1) vragen eerder of later om een webadres.

**Voorwaarden:**
- Geen accounts, geen tracking en geen analytics (kinderen). Een statische site zonder backend.
- Bestaande saves blijven bruikbaar: de opslag van `file://` en die van de website zijn gescheiden. Daarom eenmalig een reservekopie exporteren uit de HTML en importeren in de web-app. De bestaande reservekopie-functie doet dat al.
- Safari op de iPad kan opslag van websites opruimen na lange ongebruikte periodes. Een geïnstalleerde PWA heeft daar minder last van, maar een reservekopie blijft het advies; in Instellingen staat al een knop.
- **Gebruiken we het al voor V3.0?** Nee. V3.0 wordt uitgeleverd zoals afgesproken. De web-app komt mee met de runtime-migratie: daar komen twee build-uitvoeren uit, `dist/web/` en `dist/offline.html`. Deploy alleen met akkoord van de eigenaar.

## Werkwijze voor het parallelle spoor

- Geen wijzigingen in `scripts/v3/`, `src/v2/`, `index.html` of `codex/topo-v3`. Alleen de branches hierboven.
- Eén spoor per agent; push naar de eigen branch. De review en de samenvoeging gebeuren in de V3-chat.
- Credits sparen: lees alleen dit bestand, `docs/v3/SPEC.md` en `docs/MAP_SYSTEM.md` (voor spoor B).
