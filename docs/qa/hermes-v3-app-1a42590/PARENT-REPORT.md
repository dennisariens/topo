# Zelfstandige parentprobes — TOPO V3 app1a42590

Getest `1a42590de5525bd4d9fb1bcd02bf384e4437b1c2`; Chromium156.0.8078.4 en WebKit27.2 via Playwright1.64.0, macOS26.2/AppleM4/Mac16,10/16GiB. Dit document sluit alleen punten3,5,6 en de build af; punt1,2,4 staan in afzonderlijke deelreviews. Geen impliciete volledige-app-PASS.

## Build — PASS

Zelf `node scripts/build-v3-preview.mjs` uitgevoerd onder Node24.15.0. Preview50199445 bytes, SHA256 `23dced34e7d9079cd59195532721f39b1bc6c1f00032ce6c4a41bb4ea619b556`. `index.html` SHA256 `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a`.

Eigen `npm ci && npm run lint && npm test && npm run build` volledig uitgevoerd, `GATE_EXIT=0`. Hashes en schone worktree na afloop opnieuw gecontroleerd. Gates zijn nieuwe Hermes-uitvoering, niet overgenomen bouwerresultaten.

Alle9-novemberbesluiten uit de pin gelezen. Upstream stond bij ophalen op `89404f3491854d3c6004ab541079c39bef8bf0ec`: uitsluitend6 regels documentatie toegevoegd in DECISIONS. Geen runtimeverschillen, maar die head is niet als eigen uitgevoerde pin geclaimd. De eigenaar accepteert de<=2,84SVGpx-kustafwijking voor V3.0 expliciet; dit is geen nieuwe bevinding.

##3 — Reliëf z8 — PASS

Vier lokale beeldlagen én de daadwerkelijke runtime-dataURI's in beide engines tegen `terrain-z8-render-provenance.json` gehasht: terrain,sea,shadow,coast. Lokale bytes tevens exact tegen `v3/relief-z8@2a7b0cf` gecontroleerd. Zie `static/results.json` en `parent/results.json`.

Beide engines:
-46/46 live target-elementen gelijk aan hun kloon: d,cx,cy,r,points,x,y,width,height en alle interne ancestor-transform-attributen. Dit zijn elementrecords, niet een bewering dat er46 unieke leer-ID's zijn.
- Laagvolgorde: zee → zachte kustgloed → schaduw → landbasis → canonieke seaLayer → terrein → kust → canonieke landLayer. Extra gloed/basis bestaan uit kopieën van bestaande landpaden, zonder nieuwe doelen.
- Nieuwe decoratielagen aria-hidden=true en pointer-events=none; geen eigen data-id/tabindex/doelen. Kloon aria-hidden,focusable=false en geen focusstops. Aantal landkopieën exact2×canonieke landvormen.
- Reliëf aan/uit daadwerkelijk bediend; uit verbergt terrein en alle decoratieve reliëflagen, behoudt46 doelelementen.

Screenshots van Reliëf en Schoolkaart daadwerkelijk bekeken. Geen herbeoordeling van de geaccepteerde raster/vector-kustafwijking. De upstream DEM-generatie/alle oorspronkelijke tiles zijn niet opnieuw opgebouwd; dit is een onafhankelijke integratie-/byte-/geometriecontrole, geen nieuw extern hoogtemodelcertificaat.

##5 — Runtime-assets — PASS

Appmanifest exact gelijk aan dat van `art/v3-render-assets@05ab1d0808aa20a18b99fea81950a6284539bf03`. Alle23 gekopieerde runtime-exportbestanden: SHA256,bytes,gedecodeerde maat,effectieve alfa exact manifest en Gitbron. Masters zijn bewust niet in de app gekopieerd.

17 daarvan daadwerkelijk in de preview ingebed; de overige6 zijn ongebruikte48px-iconvarianten, geen ontbrekende runtimebron. Acht bestaande #75-scènes leveren de andere hoofdstukken.

Bovendien onafhankelijk in beide engines de daadwerkelijke DOM-consumenten gecontroleerd: BG-01,CSS-achtergrond,portret,tellericonen,alle3 vernieuwde stedenskoppen en miniaturen,VE-01 en4 beloningstegeliconen. Elke hash gelijk aan de verwachte export. Niet alleen de bouwers-hashcheck of een globaal assetregister vertrouwd. Zie `parent/dom-assets-and-memory-limits.json`, `static/results.json` en het drivermateriaal.

##6 — Laden, geheugen en offline — PASS op deze host, geen iPad-goedkeuring

50.199.445B via file://;3 laadmetingen per engine (verse browser en2 herladingen). Eerste interactieve marker: zichtbare hoofdactie plus46 kaartdoelen. Document-load en interactive gemeten met monotone hostklok; geen koude OS-schijfcache geclaimd.

| Engine | Document-load | Interactieve marker | OS Summary Footprint verse meetsessie |
|---|---|---|---|
| Chromium156.0.8078.4 |891–904ms|1042–1643ms|1263623056B ≈1205MiB|
| WebKit27.2 |1126–1648ms|1243–1667ms|741626992B ≈707MiB|

OS-footprint betreft de gemeten procesgroep inclusief GPU/netwerk/launchwrapper, niet de grootte van alleen de JavaScriptheap. Het is een diagnose, geen universele budgetnorm. Extra decoderings-/geheugensessie zonder dataURI-hashprobes vóór het sample:3 metingen per engine, na decode van DOM-images,600ms settle. RSS som over gekoppelde processen kwam op1573–1981MiB Chromium en1757–2081MiB WebKit. RSS telt gedeelde pagina's dubbel en is niet uitwisselbaar met footprint. Procesgroep via launch-window plus verdwijnen bij eigen browser-close geïdentificeerd; andere QA kan hostbelasting beïnvloeden. Geen privileged coalition-audit geclaimd.

**Correctie op ruwe eerste meting:** WebKit WebContent/GPU/Networking draaien als launchd-XPC-processen, niet als browserkinderen. De eerste148MiB-achtige descendantwaarden in `parent/results.json` betreffen dus slechts controller/wrapper en zijn GEEN totale WebKit-geheugenmeting. Gebruik `memory-supplement.json` en de OS-footprintbestanden. WebKit biedt hier geen JS-heap-API; die is N/A, niet verzonnen. Ook de ruwe Chromium-procesboom bevat een kleine ps-helper; die waarden zijn niet de definitieve footprintmeting.

Het beslag is aanzienlijk en hoort bij de fysieke iPad-acceptatie. De korte reeks bewijst geen geheugenlek of langetermijnplateau. Geen geheugenlek afgeleid uit oplopende korte-reeks-RSS, en geen cross-engine heapvergelijking uit onvergelijkbare API's gemaakt.

Alle6 hoofdlaadproeven:0 app-page HTTP(S)/WebSocket-pogingen en0 page-/console-errors. Eerste context online met uitgaand HTTP preventief onderschept, vervolgmetingen offline. Alleen file-document en embedded data; geen externe app-resource nodig. Dit is geen packetcaptureclaim over alle achtergrondprocessen van het OS.

Fysieke iPad Safari, VoiceOver en echte devicegeheugendruk: NIET GETEST, eigenaar. Ook geen goedkeuring voor een fysieke Retina-/iPad-prestatie op grond van deze Mac-metingen.
