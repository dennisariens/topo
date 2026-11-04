# NINO 2.0 — speelbare proefversie, 4 november 2026

**Eigenaarbeoordeling / onafhankelijke Hermes-herbeoordeling: OPEN. Geen release-GO.**

Basis: actuele PR71-head gecontroleerd vóór de bouw: `8c25b7a4592dafdc0003c0021c2a9fe375d68a34`. Werk blijft in dezelfde PR. Geteste implementatie-/bewijs-SHA: **`fd28019ba6f2a737d1ce4dc584780ec79d56427f`**. De finale PR-head staat exact in de PR-handoff; de volgende pin wijzigt alleen documentatie/bewijsformattering en heeft byte-identieke runtime, scripts, assets en HTML.

**Zelfstandige HTML:** `output/html/NINO-2-Proefversie-2026-11-04.html`,40.999.720bytes. SHA256 **`933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35`**. Byte-identiek aan de geteste canonieke HTML en de andere kandidaat-aliassen.

**Direct lokaal openen:** http://127.0.0.1:8071/NINO-2-Proefversie-2026-11-04.html . Alleen de lokale reviewserver; geen deployment/publicatie. Het losse HTML-bestand werkt ook rechtstreeks vanaf schijf zonder server, netwerk, fonts of sidecars. De previewserver serveert uitsluitend een kopie van deze kandidaat en het expliciete demobestand uit `/private/tmp/nino-2-preview-20261104`.

**Apart demobestand:** `output/demo/NINO-2-DEMO-niet-echt-gespeeld.json`. Importeren via Menu → Instellingen en meer → Zet reservekopie terug. Het is nadrukkelijk **synthetische demovoortgang, niet echt gespeeld**; import vervangt de lokale voortgang na bevestiging. Bewaar desgewenst eerst een eigen reservekopie. De naam blijft `DEMO · latere pagina’s`. Alle11 stempels/Gold en3 Vespa-ritten maken de latere boekpagina’s en Venezia zichtbaar. De standaardapp laadt dit bestand nooit automatisch en bevat geen demovoortgang.

## Wat zichtbaar is samengebracht

- Korte, overslaanbare eerste kennismaking met Nino: optionele naam, boekkleuraccent en drie geïllustreerde lievelingspizza’s. Keuze geeft meteen persoonlijke feedback, geen beloning. Wijzigen kan via de omslag in het boekje. Bestaande leerlingen met voortgang krijgen geen verplichte onboarding. Profiel schema1 heeft een eigen lokale opslagkey; oude voortgangsschema’s blijven exact. Versie1-reservekopieën dragen het optionele profiel apart mee; oude backups blijven geldig.
- Alle11 haltes vormen één zichtbare route met de goedgekeurde hoofdstukillustraties, huidige/volgende halte, de bestaande drie lesfasen, echte vergrendeling, herspelen en optionele Gold. Geen tweede leerroute of gewijzigde ontgrendeling. Pizza’s/Vespa-bestemmingen hebben een aparte beloningssectie en worden in het boek onderscheiden van leshaltes.
- De goedgekeurde omslag uit PR48 is nu werkelijk ingebed. Elke binnenpagina gebruikt de huidige originele folio’s: samenvatting, vier stempelpagina’s, bestemmingen en werkelijk beschikbare postkaarten. Telefoon en iPad-portret tonen één pagina; brede schermen een spread. Elk folio behoudt1086×1448 en maximaal543CSS pixels breed. Lange inhoud heeft eigen leesbare scrollruimte; header/footer blijven bereikbaar. Een verdiende stempel opent ook de bijbehorende hoofdstukillustratie.
- PR29-pizza’s zijn actief in Reis, Oefenen en lessen: de acht unieke bronstukken per smaak zijn exact samengesteld in de bestaande runtime-atlassen. Volgende smaak = pizzas%3; zojuist verdiende smaak = (pizzas−1)%3. Ook bij slices=0 verschijnt de juiste statische open Pisa-doos. De bestaande8-antwoorden/3-pizza’s-regels en anti-replaytokens blijven ongewijzigd. Persoonlijke favoriet heeft geen invloed.
- Dubbele welkomst-/scooterlagen zijn verwijderd waar ze dezelfde illustratie herhaalden. De verdiende pizzapresentatie staat in de huidige schermindeling, niet boven antwoordknoppen. De kaart-vrijmakenknop neemt eigen layoutruimte in; route-/navigatie-/boekknoppen zijn op de doelbreedtes gecontroleerd.

**Kleurkeuze:** het gekozen boekkleuraccent is zichtbaar rond de originele rode omslagillustratie. De goedgekeurde rode bronpixels zijn niet herkleurd. Beoordeling van deze persoonlijke accentpresentatie hoort bij de visuele eigenaarreview.

## Precieze ontbrekende bron — groot appicoon

Het goedgekeurde **1024×1024 PNG-appicoon uit `topo-nino-app-icon-v1.zip`**, genoemd in #8, is niet gevonden. Het ontbreken raakt de **volledige vierkante header-/appidentiteit op32–60px**. Onderzocht: alle lokale Git-refs/padgeschiedenis, beide relevante art-branches, stashes en gerichte bestandsnamen in projecten, Downloads, Desktop, Documents, `.hermes` en `/private/tmp`. Er staan alleen de micro-v2-binaries en hun SVG-masters; de oude header was een uitsnede van scene-art. Een pad/commit is aan de eigenaar gevraagd.

Tijdelijk toont de header de **volledige goedgekeurde Travel-cutout** uit `8a704cb23da97baf7197635df7fa12f06b864a24:assets/nino/exports/nino-travel.webp`, zonder toevallige crop. Dat is **niet** het ontbrekende appicoon en sluit dit acceptatiepunt niet. De aparte goedgekeurde micro-iconen blijven exact behouden.

## Bronhergebruik en behoud

PR29 `dcc474e8a9d1bc97559a3207b0a330423e128558` levert de bestaande pizza-module, CSS,85 bronbestanden en ongewijzigde runtime-atlassen. Bestaande bestanden zijn vóór kopiëren bytegelijk vergeleken. Omslag-WebP komt exact uit PR48 `4eb9a5ae33550d789c56d5c01393145a148565aa`; Travel uit8a704cb. Geen bestaande bronmaster gewijzigd, geen nieuwe illustratie gegenereerd. `runtime-placement.json` en `assets/nino/playable-art-manifest.json` leggen huidige plaatsing en nieuwe bronconsumptie vast; de oude #67-inventaris blijft een historisch gepinde levering, geen stilzwijgend actuele integratietelling.

De volledige oorspronkelijke PR70-HTML wordt na het verwijderen van exact gepinde presentatieblokken en het omkeren van expliciete pizza/profiel/F1-substituties bytegelijk hersteld. Voor `nino-art-ui.js` worden alleen drie exacte PR29-hooks omgekeerd; onverwachte code/gewijzigde hooks blijven falen. Learning-/route-engine,45 objecten, beide stijlen, schoolblad, Rome/Vaticaan, grading, beloningseconomie, print/PDF en bestaande opslag blijven beschermd.

## Werkelijk getest versus demo/fixtures

- `release-check.log`: brede build/lint/testketen, de17 bestaande programma’s plus drie nieuwe gerichte testbestanden, release- en geografische behoudsaudits. `whole-file-preservation.json` / `preservation.log` bevatten de aparte volledige behoudsaudit.
- Nieuwe gerichte tests: profielvalidatie/Unicode24graphemes/safe text, overslaan/edit/cancel/reload, storage failure en importrollback; alle smaken0–8/zero rollover/queue/reset/voorkeur-onafhankelijkheid; zichtbare11-stoproute, folio’s op alle pagina’s, portrait en behoud van de beloningsnode over resultaat-/lesovergangen. Vier bestaande F1-regressies blijven actief.
- `chrome-playable.json` / `webkit-playable.json`: offline file://, Chrome157.0.8103.38 en WebKit27.2,1500×1000,1180×820,768×1024,390×844,320×740,DPR2,reduced motion, gesimuleerde touch. Verse profielen doorlopen onboarding, profielwijziging/terugkomst, alle lege boekpagina’s, controle op overlappende/te kleine knoppen, en F1 met echte toetsenbordselectie[3,10,backward]. Zelfde vraag/modus/concept/selectie en exacte progress-opslag bij terugkeer.
- **Echt doorgespeeld, per engine:** eerste halte met6 Ontdekken +6 echte pointerantwoorden +6 schrijfsubmissies. Achtste goede antwoord→1 Margherita/slices0/juiste statische Pisa-doos; eindstand12goed/1pizza/4stukken, eerste hoofdstukstempel, geen Gold. Echte reservekopie met persoonlijk profiel gedownload. De favoriete Salami levert toch eerst Margherita op. Dit is geen natuurlijk uitgespeelde11-hoofdstukkenroute.
- `chrome-profile-transfer.json` / `webkit-profile-transfer.json`: die echte voortgang zonder profiel als legacy-backup geïmporteerd; na reload blijft voortgang behouden zonder verplichte onboarding. Ongeldig profiel in backup wordt vóór mutatie afgewezen.
- `all45-chrome/summary.json` / `all45-webkit/summary.json`:45 objecten, beide stijlen,180 correcte/90 verkeerde pointerproeven en180 schrijftests per engine; Rome/Vaticaan, wrong-Gold en reload. Dit zijn expliciete **huidige-vraagfixtures** met echte muis/input, geen natuurlijke all45-route.
- **DEMO/fixture:** de latere stempels, Gold en Venezia zijn via het aparte demobestand bekeken en geïmporteerd, nooit als natuurlijk verdiend spel gerapporteerd. De runtime toont ze uitsluitend bij daadwerkelijk aanwezige canonieke completion/gold/tripwaarden.
- Schermafbeeldingen en bronreferenties zijn visueel bekeken: C+-palet/typografie, oorspronkelijke omslag/folio’s, hoofdstukart, statische Pisa-doos, nav-/antwoordknoppen en320px/portrait-indeling. De lokale proeflink geeft HTTP200,text/html en exact dezelfde40.999.720bytes; een aparte preview-smoke controleert onboarding/overslaan in een echte browser.

Eerste driverfouten en gevonden afwijkingen blijven als vóór-bewijs bewaard: verkeerde favoriet-statusselector; kaart-vrijmaken/Controleer-overlap; pizzapresentatie voor knoppen; losgeraakte beloningsnode na verwijderen van een oud resultatenscherm; oude testverwachting voor ingeklapte haltes; bronbehoudstest die de drie nu geautoriseerde PR29-hooks nog als ongeautoriseerd zag. Geen grading/reward-/opslagassertie afgezwakt. De uiteindelijke logs/JSON zijn aan de actuele HTML-hash gebonden.

## Open review, geen publicatie

- Groot appicoon: ontbrekende exacte bron zoals hierboven. Tijdelijke full-art-header is geen definitieve icoonacceptatie.
- Eigenaar: huidig boekkleuraccent, native folioresolutie, huidige gereconstrueerde Venezia-rand en algemene visuele speelacceptatie. De eigenaar heeft een directe proeflink gekregen; antwoord blijft OPEN tot expliciete reactie.
- Onafhankelijke Hermes-review van de exacte nieuwe SHA: OPEN. Interne agentreview en eigen browseruitvoering zijn geen onafhankelijke Hermes-acceptatie.
- De eerder gemelde semantische blinde vlek in de algemene artworkaudit blijft apart OPEN; deze levering beweert die auditdekking niet af te sluiten.
- Echte Pisa-scharnieranimatie en uitgebreide Vespa-animatie zijn bewust buiten scope. Native Safari/fysieke iPad, OS-keyboard/IME/VoiceOver, icooncache, echt printen en200% OS-tekst/hardware zijn niet gecertificeerd met viewporttests.

Geen merge/deploy/releasepublicatie of vervanging van de bestaande goedgekeurde download. Alleen een nieuwe kandidaat in de bestaande PR en een lokale reviewkopie.

## Herhalen

```sh
npm ci --ignore-scripts
npm run release:check
node scripts/audit-nino-v2.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/qa-nino-playable.mjs
QA_BROWSER=webkit PLAYWRIGHT_MODULE=/path/to/matching/playwright/index.mjs node scripts/qa-nino-playable.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/qa-nino-profile-transfer.mjs
QA_BROWSER=webkit PLAYWRIGHT_MODULE=/path/to/matching/playwright/index.mjs node scripts/qa-nino-profile-transfer.mjs
```

De overdrachttest gebruikt de echte backup uit de bijbehorende speeltest. `qa-computer-release.mjs` herhaalt de afzonderlijk gelabelde all45-fixtures; gebruik `QA_INTEGRITY_DIR` om nieuw bewijs apart te bewaren. Browserplugin/skill niet beschikbaar: bestaande externe Playwright-installatie gebruikt. Bestaande runtime/dependency-lockfile onveranderd; Node25.8.2, Chrome157 en WebKit27.2 in deze uitvoering.
