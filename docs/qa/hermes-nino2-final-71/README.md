# NINO 2.0 — onafhankelijke Hermes eind-QA, PR #71

## Verdict: REWORK

**Geteste commit:** `2c52f121b853d1d8a46555d725ef79c97e0bf85b`.
**Nieuwste gecontroleerde PR-head:** `92f441e52c6b38550d5920dfbfc9a22310aec8f6`.
**Bewijscommit:** de commit die deze directory toevoegt; de gepubliceerde PR-review vermeldt de volledige bewijs-SHA. Geen zelfreferentiële hash in dit bestand.

Standalone `output/html/TOPO-NINO-Computer-Release.html`: **35.709.206 bytes**, SHA256 **`352ddd742436ac4f5a5a8a82374f742788952219e42b47d87d83536319183d53`**.

De PR-head is tijdens de review veranderd. De volledige diff van 2c52f121 naar 92f441e bevat uitsluitend 17 QA/documentatiebestanden en `scripts/qa-nino-v2.mjs` (extra expliciete trips=2-fixture). Geen productiecode, masters, HTML, dependency- of enginewijzigingen. De HTML op de nieuwe head is zelfstandig uit Git gelezen en gehasht: exact dezelfde bytes. Volledige build/test/browseruitvoering vond plaats op **2c52f121**, niet op een stilzwijgend nieuwe checkout. De runtimebevinding hieronder geldt dus ook voor de byte-identieke nieuwe head. De nieuwe Codex-WebKit-JSON is daadwerkelijk in Git aanwezig en uit de nieuwe commit gelezen; die resultaten worden NIET als onafhankelijke Hermes-tests gebruikt.

Dit is onafhankelijke review, geen tweede implementatie. Alleen bewijsbestanden toegevoegd; geen merge, deploy, releasepublicatie, downloadvervanging of bronmasterwijziging.

## F1 — navigatie verliest oefencontext en uiteindelijk concept/caret

**Reproduceerbare functionele fout; acceptatiepunt 5 niet gehaald.**

1. Open de exacte standalone offline in een vers profiel.
2. Kies **Oefenen → Namen schrijven**.
3. Typ `Navigatieconcept`; selecteer tekens 3–10 achterwaarts.
4. Kies **Reis → Oefenen**.
5. Kies opnieuw **Namen schrijven**.

Verwacht: hervatten van dezelfde onbeantwoorde vraag, concept en selectie.
Werkelijk: na stap 4 is `state.mode='learn'` en de actieve vraag verdwenen. De oude tekst/selectie staan op dat moment nog in het verborgen inputelement — alleen DOM-waarde controleren mist deze fout. Na stap 5 verschijnt een andere vraag en is de tekst leeg met caret `[0,0,'none']`.

Gereproduceerd met echte UI, zonder geïnjecteerde voortgang, in **Chrome156.0.8078.80 en WebKit27.2**, bij 1500,768 en320CSS px. Zie [Chrome](chrome-navigation-repro.json), [WebKit](webkit-navigation-repro.json), [reproductiescript](navigation-repro.mjs), screenshots `browser/*navigation*-before.png` en `*after-reenter-writing.png`. Bijvoorbeeld Chrome320: city-6 → geen vraag → city-1; het concrete willekeurige vraag-ID kan per sessie verschillen.

Broncontext: `scripts/nino-v2.js:7` roept voor Oefenen steeds de bestaande `mode('learn')` aan, in plaats van de eerdere oefencontext te hervatten. Dit is niet hetzelfde als boek openen/sluiten; die afzonderlijke continuïteitstest slaagt. Geregistreerde voortgang/currency is niet als verloren aangetoond.

## Onafhankelijk uitgevoerde matrix

| Controle | Uitkomst | Bewijs / afbakening |
|---|---|---|
| Build, lint, alle17 testprogramma's | PASS | [release-check-first.log](gates/release-check-first.log); `npm ci && npm run release:check && node scripts/audit-nino-v2.mjs` onder Node24.15.0, exit0. Testprogramma's vormen de ongewijzigde `&&`-keten in package.json. |
| Behoud engine, geometrie, beoordelen, beloningen, print, saves | PASS | [statische audit](static/FINDINGS.md), [metingen](static/measurements.json), [map-preservation.json](map-preservation.json), release-audit/. Onafhankelijke exacte verwijdering van alleen presentatie-addities herstelt de gehele PR70-HTML bytegelijk;92 beschermde bestanden ongewijzigd. |
| D1 archiefboek en dependencies | PASS | Werkelijk1586×992, source-only, OPTIONAL DEFERRED, niet ingebed; historische REWORK/ARCHIVAL niet READY gepromoveerd. |
| D2 bron/export/runtime apart | PASS | 239 unieke paden:205 pinned-source/34 derivaten;67 geleverd/172 source-only;46 expliciet geïntegreerde unieke hashes/193 niet geïntegreerd.58 byte-equivalente padregels omvatten12 bronaliases, geen58 unieke integraties.87 READY bevat40 source-only; geen releasegoedkeuringstelling. |
| Alle45 objecten, beide kaartstijlen | PASS, vraagfixtures | [all45/summary.json](all45/summary.json), ledger.json, [log](gates/independent-all45.log). Eigen uitvoering maintained harness:180 correcte pointer-,90 verkeerde pointer-,180 schrijftests. Echte muis/buttons/input, maar huidige vragen expliciet geïnjecteerd; GEEN natuurlijke all45-route. |
| 11 hoofdstukken, Rome/Vaticaan, neutrale chooser, kaartbron | PASS binnen scope | All11 DOM-programma, map-hit/approved-SVG tests, volledige bytebehoudsaudit en all45-browserledger. Geen nieuwe onafhankelijke GIS-survey. |
| Offline desktop/tablet/320px, boek, paging, nested stamp/Escape | PASS | Eigen [Chrome](chrome-responsive.json) en [WebKit](webkit-responsive.json), viewports1500×1000/768×1024/320×740, DPR2; nul externe requests/JS-/consolefouten. Deze JSON heeft REWORK als totaal vanwege F1, niet vanwege modal-/boekchecks. |
| Folio verhouding en cap | PASS, C1 open | Natuurlijke1086×1448; gemeten543×724 op desktop,366.5×488.65625 op tablet,302×402.65625 op320. Geen CSS-breedte boven543. Zie responsive-JSON en screenshots. |
| Gold-detail | PASS presentatie, fixtures | [Chrome](chrome-gold-detail.json), [WebKit](webkit-gold-detail.json);320/270.5/242CSS px breed bij1500/768/320. Elementcrops en gescrolde dialogscreenshots `browser/*gold*FIXTURE.png`. Runtime-export480×480; niet claimen dat desktop320CSS/DPR2 native640 detail is. Alle11-Goldpresentatie is een expliciete fixture, geen natuurlijk verdiende finale. |
| Werkelijk hoofdstuk, stamp, Gold, verkeerde Gold | PASS, echte speelsessies | [Chrome](chrome-real-play.json), [WebKit](webkit-real-play.json). Discover→Point→Write eerste hoofdstuk: stamp zonder Gold; echte foutloze Gold geeft seal. Verkeerde Gold na import van echte vóór-Goldsave geeft géén seal. |
| Venezia na2 verborgen / na3 zichtbaar | PASS, echte speelsessies | Per engine72 echte correcte UI-antwoorden in positieve sessie →9pizza's→3reizen. Controle bij48 correct/6pizza's/2reizen: verborgen; bij72/9/3: zichtbaar. Geen tellerinjectie. Extra fixturegrenzen apart in responsive-suite. |
| Beloningen8→pizza en derde pizza→reis | PASS | Echte eerste24 correct→3pizza's/1reis;48→6/2;72→9/3, plus maintained regressies voor alle rollovers. |
| Boek openen/sluiten/paging, kaartstijlwissel: vraag/concept/caret/save | PASS | Strikte snapshots van huidige vraag, modus, concept, selectie, progress en opgeslagen bytes. Dit bewijst geen fysieke OS-keyboard/IME-focus. |
| Opslag, reload, echte JSON-export/reset/import | PASS | Beide eigen real-play suites: daadwerkelijke download via exportknop, parser, reset via UI, upload naar fileinput, reload en vergelijking. Tokenvolgorde semantisch gesorteerd; dubbele tokens eerst verboden. Geen synthetische backuppayload als gespeelde sessie. |
| Anonieme exacte Git-download en nieuwe file:// locatie | PASS | Afzonderlijk anoniem gedownloade HTML heeft verwachte bytes/hash. [Chrome](chrome-downloaded-transfer.json), [WebKit](webkit-downloaded-transfer.json): verse contexts, import van werkelijk geëxporteerde72-correct-save, reload exact. Idle-observer0 mutaties/400ms in beide engines. |
| Primaire Reis/Oefenen-continuïteit | **REWORK** | F1 hierboven; beide engines, alle drie breedtes. |

Alle browserresultaten hierboven zijn door Hermes zelf uitgevoerd. De statische deelscope is gedelegeerd, door parent gelezen en beide auditprogramma's opnieuw uitgevoerd. Bestaande Codex-logs zijn geen onafhankelijke tests.

## Extra bevinding: maintained audit heeft een semantische blinde vlek

[adapter-probes.json](static/adapter-probes.json) reproduceert in-memory dat `scripts/focus-source.mjs:31–35` een omwisseling stamp0/stamp1 en een onjuiste folio-metadatawidth9999 accepteert en daarna nog baselinegelijkheid meldt. Extra executable code wordt wel afgewezen; edits buiten het blok blijven zichtbaar. Geen kandidaat gewijzigd.

**Medium audit-dekkingstekort, geen bewezen verkeerde artworkmapping in deze kandidaat.** De onafhankelijke239-rijen/36-role/file/dimensiecontrole toont de huidige mapping juist aan. Het groene productie-auditresultaat alleen is dus geen bewijs van semantisch exacte rolemapping. Zie [FINDINGS.md](static/FINDINGS.md). Ook generieke folio-caveattekst bij het afzonderlijke gesloten coverbeeld is een metadata-imprecisie, geen huidig geïntegreerd coverdefect. Niet als extra runtimefout presenteren.

## Fixtures versus echte voortgang

- Natuurlijk gespeeld: eerste hoofdstuk en Gold; positieve sessie door tot72correct/3reizen; verkeerde Gold vanuit werkelijk geëxporteerde prerequisietsave; echte export/import en reload. Per engine83 correcte plus één verkeerde submissie over positieve en negatieve sessies samen; dat is niet één83-antwoordenroute.
- Geïnjecteerd: all45 huidige-vraagledger; stage2/3, all11-stamps/Gold/finale, latere reisprojecties voor responsive/artpresentatie. Boekscreenshots met `FIXTURE` zijn geen verdiende final-Goldclaims.
- Niet natuurlijk uitgespeeld: alle11 hoofdstukken en alle45 objecten in één end-to-end-route.

## NOT TESTED / open eigenaarbesluiten

1. **C1:** eigenaaracceptatie native1086×1448 folios bij maximaal543CSS/page/DPR2 in plaats van1536×2048; finale naad/visuele indruk blijft eigenaarbesluit.
2. **C2:** Venezia1497×973 behoudt exact PR70-painting/export; gereconstrueerde scalloped rand is niet vergeleken met de ontbrekende originele owner-reviewed rastermatte. Acceptatie of originele referentie nodig.
3. Definitieve visuele acceptatie en expliciete release-GO blijven bij eigenaar. C3 integratiescope is wel geautoriseerd; eerdere PR70-‘nog niet geïntegreerd’-kritiek is hier niet meer actueel.
4. Native Safari, fysieke iPad, OS-keyboard/IME/VoiceOver, OS-faviconcache en werkelijk printen NOT TESTED. WebKit27.2 en gesimuleerde touch/viewport zijn geen hardwaregoedkeuring.
5. Beschadigde V2-afbeeldingen/fallbackinjectie en focus na resize tijdens een nested stampdialog niet afzonderlijk getest. Statische bronrisico's zijn géén gereproduceerde fouten; zie static/FINDINGS.md. Directe boekcontinuïteit en werkelijke image-decode in geteste situaties slagen.
6. True Pisa hinge OPTIONAL DEFERRED; alleen goedgekeurde statische dozen actief. Geen acceptatie van PR72/Review-v2-hinge door deze review.

## Reproduceren

Externe Playwright-installatie vereist; geen runtime-dependency toegevoegd. Gebruik Node24.15.0. Zet `PLAYWRIGHT_MODULE` en voor Chrome `CHROME_PATH`. Vanuit repo-root:

```sh
npm ci
QA_RELEASE_AUDIT_DIR=docs/qa/hermes-nino2-final-71/release-audit/ \
 QA_PRESERVATION_FILE=docs/qa/hermes-nino2-final-71/map-preservation.json npm run release:check
node scripts/audit-nino-v2.mjs
node docs/qa/hermes-nino2-final-71/responsive.mjs
node docs/qa/hermes-nino2-final-71/real-play.mjs
node docs/qa/hermes-nino2-final-71/navigation-repro.mjs
node docs/qa/hermes-nino2-final-71/gold-detail.mjs
# Herhaal eigen suites met QA_BROWSER=webkit.
# Zie static/FINDINGS.md voor Pillow-venv en beide statische auditprogramma's.
```

`downloaded-transfer.mjs` vereist een anonieme download op `QA_DOWNLOADED_HTML` (default scratchpad in het script) en de echte geëxporteerde JSON van de bijbehorende engine. Chrome gebruikte de onvoorziene engineprefix-vrije `genuine-three-trips.json`; de latere driver gebruikt engineprefixen om parallelle bestandbotsingen te voorkomen. Bestaande Chrome-export is behouden. Eerste real-play-poging vond de resetknop niet op de na-reload thuispagina; de driver is gecorrigeerd om via echte navigatie/disclosure de knop te tonen, niet door controles te verzwakken. De mislukte driverlog is behouden; beide finale real-play uitvoeringen slagen. Native screenshots zijn ongeschaald opgeslagen; sommige overzichtcaptures tonen een scrollbaar deel, vandaar aparte gescrolde detail-/elementcrops.

## Eén volgende actie

**Codex: herstel exact hervatten van oefenvraag, modus, conceptantwoord en caret over Reis/Oefenen, voeg deze reproductie als regressie toe en lever een nieuwe SHA voor herreview.** Geen tweede implementatie door Hermes; eigenaarbesluiten blijven apart.
