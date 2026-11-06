# Hermes — onafhankelijke review NINO 2.0 speelbare proefversie

## Verdict: REWORK

**Getest:** `b06b13059ff5e2ef7278c2d0c55597cf8a9435cf`, vooraf en na uitvoering bevestigd als actuele PR71-head. Vergelijking met eerdere F1-PASS: `8c25b7a4592dafdc0003c0021c2a9fe375d68a34`.

**Artifact:** `output/html/NINO-2-Proefversie-2026-11-04.html`, **40.999.720 bytes**, SHA256 **`933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35`**. Zelfstandig gehasht vóór/na uitvoering; kandidaat-aliassen bytegelijk. Bewijs-SHA is de commit die deze directory toevoegt en staat volledig in de gepubliceerde review; geen zelfreferentiële commit-hash.

De technische basis slaagt. Eén nieuwe, daadwerkelijk in Chrome gereproduceerde boek-/toetsenbordfout verhindert acceptatie van deze kandidaat. Daarnaast is een laag-prioritair Unicode/backuprandgeval bewezen. **F1 is niet heropend:** oefencontext en achterwaartse selectie blijven correct behouden.

## F2 — P2: profiel sluiten verliest Chrome-boekfocus en schakelt toetsenbordbladeren uit

### Reproductie op echte gegenereerde HTML, offline, vers profiel

1. Kies **Begin zonder invullen** en open **Reisboekje**.
2. Controle: **Pijl-rechts** bladert van `1–2 / 8` naar `3–4 / 8`. Pijl-links keert terug.
3. Kies **Pas mijn boekje aan**, typ bijvoorbeeld `Focuscontrole`.
4. Klik **Annuleren**, of herhaal de sessie en klik **Bewaar mijn boekje**.
5. Druk direct **Pijl-rechts**.

**Chrome157.0.8103.38:** boek blijft open maar `document.activeElement` is BODY, niet een element in het boek. Paginering blijft `1–2 / 8`. Eén Tab herstelt focus op de opnieuw aangemaakte knop Pas mijn boekje aan; daarna werkt Pijl-rechts weer (`3–4 / 8`). Zowel bewaren als annuleren gereproduceerd. Geen geïnjecteerde appstate, geen geshimde dialoog.

**WebKit27.2:** native herstel focust het boekdialog; direct Pijl-rechts werkt. De oorspronkelijke fout is daar niet gereproduceerd. Latere Tab-focus is niet als vergelijkbare WebKit-acceptatiefout geclassificeerd; native full-keyboard-access is niet gecertificeerd.

**Oorzaak:** `scripts/nino-profile.js:45–49` focust de oude opener vóór `onDone:renderBook`. `scripts/nino-v2.js:52,83–85` vervangt vervolgens de paginainhoud en verwijdert die gefocuste knop. De statische deelscope ontdekte dit eerst met jsdom; parent bevestigde de daadwerkelijke Chrome-impact en WebKit-afwijking in native browsers.

Bewijs: [Chrome native focus/paging](chrome-profile-focus.json), [WebKit vergelijking](webkit-profile-focus.json), [reprodriver](drivers/hermes-playable-profile-focus.mjs), [Chrome screenshot](chrome-profile-save-focus.png). JSON bewijst de focus/paginering; screenshot alleen kan dat niet.

## F3 — P3: geaccepteerde Unicode-naam kan een niet-herimporteerbare backup maken

De 24-graphemegrens beperkt niet het aantal code-units of UTF-8-bytes. `a` gevolgd door500.001 combining acute accents telt als één grapheme en wordt geaccepteerd. Een exacte backup-envelope met die naam en minimale voortgang is al **1.000.235 bytes**, boven de importgrens1.000.000. Werkelijke geëxporteerde voortgang maakt het bestand niet kleiner.

In-memory op de echte validator/exportstructuur bewezen, parent heeft dezelfde probes opnieuw uitgevoerd; **geen normaal kindernaamprobleem of echte voortgangsverliezen geclaimd**. Dit is een pathologisch plak-/robuustheidsrandgeval, niet de primaire afkeurreden. Voeg naast graphemes een begrensde geserialiseerde naamgrootte toe en behoud geldige normale Unicode.

Zie [statische bevindingen](static/FINDINGS.md), [metingen](static/measurements.json), [probes](static/probe.mjs). Daar genoemde jsdom-focusbevinding is met F2 hierboven naar echte native browserimpact vertaald; niet als twee aparte fouten tellen.

## Onafhankelijke resultaten

| Scope | Resultaat | Bewijs / grenzen |
|---|---|---|
| npm ci, build, lint, regressies | PASS | Node24.15.0, ongewijzigde release:check-keten exit0:17 bestaande testprogramma's plus3 nieuwe testbestanden; log meldt11 nieuwe tests. [Log](gates/release-check.log). Geen typecheckerclaim: package-script is een gedocumenteerde no-op. |
| Release/geografie/whole-file behoud | PASS | [Whole-file](independent-whole-preservation.json), [map](map-preservation.json), [source](source-preservation.json). Exact begrensde inversies herstellen de baseline; onverwachte code wordt niet algemeen uitgesloten. |
| Onafhankelijke statische broncontrole | PASS, met F3 en dekkingwaarschuwing | [static/FINDINGS.md](static/FINDINGS.md). Learning-/route-engines, print/PDF/sourcehash en lockfile ongewijzigd tegen F1-basis. Alle36 bestaande V2-roles identiek.85 pizza-bronbestanden matchen PR29; nieuwe cover/Travel/favorite-/runtime-assets matchen gepinde Git-blobs. Atlasassemblage niet opnieuw gegenereerd of esthetisch goedgekeurd. |
| Offline onboarding/profiel/route/folio's/F1 | PASS | Eigen uitvoering maintained harness, Chrome157.0.8103.38/WebKit27.2,1500×1000/1180×820/768×1024/390×844/320×740,DPR2. [Chrome](chrome/chrome-playable.json), [WebKit](webkit/webkit-playable.json). Onboarding, bewerken, reload, alle11 zichtbare haltes, echte locks, lege boekpagina's, knopmaten/-overlap en F1-selectie `[3,10,'backward']`. |
| Echte eerste halte, geen premature Gold | PASS | Maintained browserharness zelf uitgevoerd:6 Discover/6 pointer/6 schrijven,12 correct/1pizza/4stukken, eerste stempel,geen Gold. Eigen downloads met profiel; dit is niet een natuurlijke all11-route. |
| Alle drie smaken en echte Gold/rit | PASS, extra eigen testontwerp | Afzonderlijke echte sessie per engine:24 geaccepteerde antwoorden,8→Margherita/16→Salami/24→Quattro Formaggi, telkens slices0 en de juiste statische Pisa-doos; uiteindelijk3pizza's/1rit en echte eerste Gold. Favoriet Salami verandert de volgorde niet. [Chrome](chrome-independent-extra.json), [WebKit](webkit-independent-extra.json), [foto24](chrome-REAL-24-pizza.png). De12- en24-antwoordsessies zijn verschillende contexts, niet één36-antwoordenroute. |
| Profiel/backups, legacy, rollback | PASS in uitgevoerde situaties | Eigen echte exports/imports. [Legacy/invalid Chrome](chrome/chrome-profile-transfer.json), [WebKit](webkit/webkit-profile-transfer.json). Oude backup zonder profiel behoudt voortgang en blokkeert na reload niet op onboarding. Ongeldig profiel wordt vóór wijziging afgewezen. Extra native UI-import met bewust geblokkeerde progress-store herstelt oud profiel en behoudt exacte memory/storage; daarna slaagt dezelfde echte24-save na opheffen van de fout. Naam `Mila <b> & Nino` is zichtbare platte tekst, geen markup. |
| Alle45, beide stijlen, Rome/Vaticaan | PASS, expliciete huidige-vraagfixtures | Eigen maintained-harnessuitvoering in **beide engines**, exit0. Per engine180 correcte pointer/90 verkeerde pointer/180 schrijftests, duplicate-credit, verkeerde Gold en reload. [Chrome](all45-chrome/summary.json), [WebKit](all45-webkit/summary.json) met volledige ledgers. Geen natuurlijke all45-speelroute of verse GIS-survey. |
| DEMO-latere stempels/Gold/Venezia | PASS projectie, FIxTURE | Apart expliciet DEMO-bestand geïmporteerd en later artwork bekeken; nooit standaard geladen, niet als echt gespeeld gerapporteerd. Alle11-Gold/latere-Venezia in deze nieuwe kandidaat niet natuurlijk uitgespeeld. |
| Profiel sluiten → direct boekkeyboard | **REWORK Chrome** | F2; save én cancel. WebKit directe pijltoets slaagt. |

Geen externe requests/onverwachte JS-/consolefouten in de geslaagde eigen browseruitvoeringen. Een groene maintained-suite is hier niet als eindacceptatie gebruikt: F2 kwam uit extra bronanalyse en native reproductie.

## Reproduceerbaarheid en attributie

Parent voerde npm/tests/browsers uit. Statische deelscope werd gedelegeerd; parent las het rapport en draaide `static/probe.mjs` opnieuw (alle assertions PASS). Codex-logbestanden zijn niet als onafhankelijk bewijs overgenomen.

`drivers/hermes-playable-maintained.mjs` voert de maintained browserdrivers uit met uitsluitend verplaatsing van root/output/DEMO-paden naar eigen scratchbewijs. Alle asserties/acties blijven intact; de twee provenance-JSONs per engine bevatten originele/uitgevoerde bronhashes en exacte relocaties. Het onderhoudsscript schrijft anders ook een DEMO in de kandidaat; deze relocatie voorkomt dat. Eigen aanvullende24-speel-/fault-injection- en native-focusdrivers staan in drivers/.

De oude externe Playwright-scratchinstallatie was verwijderd. Eerste pogingen stopten vóór browseruitvoering door module-resolutie. Eigen tooling is apart geïnstalleerd met Playwright1.64.0, passend bij aanwezige Chromium1248/WebKit2370-binaries. De definitieve runs hierboven zijn geslaagd. Bij evaluatie als data-URL vereist de externe module een `file://`-specifier; dit is tooling, geen appbug.

Alle drivers bevatten expliciete absolute lokale tool-/repo-/outputpaden; pas die voor een andere machine aan. De actual candidate bleef tijdens browseruitvoering byte-identiek. `audit-nino-v2.mjs` overschreef zijn historische tracked preservation-JSON met actuele meetwaarden; parent heeft dat exacte testgegenereerde bewijs hierboven bewaard en alleen dat eigen gegenereerde QA-bestand teruggezet naar HEAD. Runtime/masterbestanden zijn niet aangepast. De statische deelscope noteert de tussentijdse dirty QA-JSON; dit is geen onverklaarde productiediff. Deze bewijsbranch voegt uitsluitend deze directory toe.

## Geen blanket artwork-/releaseacceptatie

- De historische semantische artwork-normalizerblinde vlek blijft OPEN: role-omwisseling en fictieve foliodimensies kunnen het generieke auditpad passeren. Huidige werkelijke36-role-/bronidentiteiten zijn afzonderlijk gecontroleerd. De oude #67-inventaris/D2-tellingen blijven een gepinde historische ledger, **geen actuele totaaltelling van alle nieuw geïntegreerde playable-assets**.
- Dubbele, veranderende opslagfouten kunnen best-effort rollback laten mislukken. Alleen fault-injected risicoprobe; geen gewone echte-browserquota/privacyfout vastgesteld. Een enkele geblokkeerde progress-write is in native UI wél getest en herstelt juist. Geen onvoorwaardelijke atomaire garantie onder iedere opslagfout claimen.
- Groot goedgekeurd1024×1024-appicoon uit `topo-nino-app-icon-v1.zip` ontbreekt. De volledige Travel-cutout is een geverifieerde tijdelijke bron, geen definitieve icoonacceptatie. Geen nieuw icoon bedacht.
- Eigenaarbesluiten blijven: kleuraccent rond de originele rode cover, native1086×1448 folios bij≤543CSS/page/DPR2, gereconstrueerde Venezia-rand versus ontbrekende originele matte en finale visuele/releaseacceptatie.
- Native Safari, fysieke iPad, OS-keyboard/IME/VoiceOver, OS-faviconcache, werkelijk printen en200% OS-tekst/hardware NOT TESTED. WebKit/viewporttests zijn geen fysieke goedkeuring.
- Echte Pisa-hinge/uitgebreide Vespa-animatie blijven buiten scope. Alleen goedgekeurde statische dozen; eerdere afgewezen hinge is hiermee niet goedgekeurd.

## Volgende actie

**Codex: herstel focus op een verbonden boekelement ná de profiel-/boekrerender en voeg een native Chrome-regressie toe voor zowel Bewaren als Annuleren → direct Pijl-rechts. Lever daarna een nieuwe SHA voor gerichte herreview.** F3 kan als afzonderlijk laag-prioritair backup-/naamvalidatiepunt worden behandeld; eigenaarbesluiten blijven apart.

Geen productimplementatie door Hermes, geen merge/deploy/releasepublicatie, geen bestaande-downloadvervanging, geen bronmasterwijziging of aanpassing van de lokale reviewserver.
