# Parent — gerichte GE01-hertest6934799

Pin `6934799454441582b953ed455d54ca3b0e2db722`. Preview50200591B, SHA256 `71c2f49bf65ae04e9a1908bd7661cf8889562c0af4b3f582fd9cacfdfc4131d4`; index ongewijzigd `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a`. Alleen productie-runtimeverschil met1a42590:16 regels keyguard in `scripts/v3/les.js`. Geen map/artwork/herhaalde brede V3-test.

## Eigen toetsenreproductie —14/14 PASS

Chromium156.0.8078.4 en WebKit27.2, elk7 gevallen:
- Oorspronkelijke #nieuw-route: Ontdekken6, Aanwijzen6, Schrijven1, achtste beloonbare antwoord met Enter of Controleer; elk met normale en verminderde beweging.
- Space op echt kaartdoel bij #bezig:1 pizza+6 stukjes is expliciete baselinefixture; alleen de volgende2 juiste antwoorden zijn nieuw verdiend. Met beide bewegingsinstellingen blijft de tweede verdiende pizza staan.
- Ingedrukt/geherhaald Enter op de oorspronkelijke drempel: dialoog blijft open vóór en na loslaten.

Elke case: juiste antwoord telt eenmaal, pizza blijft open na de openingsgesture, focus werkelijk binnen pizza, nieuwe bewuste Enter of Space sluit wél, valuta/goedteller veranderen niet door die vervolgactie.0 externe apprequests en0 page-errors. Geen grade()-aanroep of antwoord-/beloningsinjectie. De meeste gevallen starten vanaf nul; #bezig is apart gelabeld. Native toetsenbordacties, geen synthetische DOM-keydown als bewijs.

Scripts/logs/data: `parent-repro.py`, `parent-repro.log`, `parent-repro/results.json`, PNGs `*-open.png`. Screenshots van WebKit Enter-reduce en Chromium held-Enter-reduce daadwerkelijk geïnspecteerd. Vorige fout1a42590 is al onafhankelijk gereproduceerd en gepubliceerd in f4aa376; huidige bewijs gebruikt de nieuwe hash en geen oude screenshots.

## Eigen volledige GE01-flow — beide engines PASS

Voorgaande zelfstandige UI-driver opnieuw gepind, de vier out-of-scope Beloningen-demotellersweeps verwijderd, alle echte GE01-/boek-/hervat-/replaychecks behouden. Beide engines werkelijk #nieuw gespeeld met één fout in Aanwijzen en één in Schrijven:12 goed,1 pizza+4 stukjes,0 ritten,1 nieuw stempel. Juiste/foute feedback, reparatievragen en afronding echt bediend.

Reis→Ga verder en les→Beloningen→boek→terug behouden vraag/modus/concept Rome concept/selectie9–12 backward. Werkelijk verdiend city1-stempel opent V2-boek. Verse keyboardopening/sluiten/terugweg werken. Replay van afgerond Aanwijzen voegt geen valuta toe; boek/Beloningen alleen-lezen.

`independent-ge01.py`, `independent-{engine}/ledger.json`, `parent-summary.json`. Visueel nieuw verdiend V2-boekstempel gecontroleerd. Onzichtbare/fixtureprestaties niet als echt verdiend gepresenteerd.

## Gates

Zelf `npm ci`, lint, gerichte Node-tests `nino-moments.test.mjs` en `nino-ux-round.test.mjs`, build: GATE_EXIT=0. Geen claim dat de hele npm-teststraat of de hele Reis/stijlbeeldsuite opnieuw is uitgevoerd. `source-audit.json` bevat de actuele hashes en diffscope.

## Harnessdiagnostiek en grenzen

Eerste parentprobereeks strandde op een Python-driverfout: Request.url is een property, geen methode. Dat is in de onafhankelijke driver gecorrigeerd; geen appwijziging en geen app-REWORK daarvan gemaakt. Eerste log apart gehouden, definitieve14 cases geheel opnieuw voltooid.

Persistente echte-save-reload niet bewezen: de memory-only preview herstelt bij reload de hashbaseline. Same-session replay/boek/terugweg wel echt gecontroleerd. Echte iPad Safari en VoiceOver NIET GETEST. Geen merge, appcodewijziging of releaseactie. De volledige onderhouden12-scenarioregressie per engine is inmiddels apart voltooid en door de parent gevalideerd:24/24 PASS. Alleen de launchregel verschilt van het oorspronkelijke script; geen checks verzwakt. De twee soorten bewijs blijven afzonderlijk herkenbaar.
