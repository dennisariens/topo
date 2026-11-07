# NINO 2.0: UX-ronde 7 november 2026, ronde 2

**Status: klaar voor eigenaarbeoordeling. Geen release-GO. Geen merge, deploy, publicatie of vervanging van de bestaande download.**

- Speelbare offline HTML: `output/html/NINO-2-Proefversie-2026-11-07-r2.html`, 41.440.242 bytes, SHA256 `4e8002705f92bce937484f613bb6763383a278fe2c107dd427d68b40797ca3ba`. Byte-identiek aan `index.html` en de kandidaat-aliassen. De HTML's van 6 november en van ronde 1 (`…-2026-11-07.html`, `14e5a095…0c8f`) zijn niet gewijzigd.
- Aparte ontwerppreview: `output/html/NINO-2-Ontwerppreview-2026-11-07-r2.html`, 41.444.148 bytes, SHA256 `a99aa07683622e0b2c28e863f70363b37d6ef4bdfca8beffd5470758749e7aa6`. Dit is de app met een extra laag erbovenop: knoppen voor **Steden 7–12**, **Eilanden**, **Alles vrijgespeeld** en **Speel Vespa-rit af**. Alles draait in het geheugen, er wordt niets bewaard en je hoeft niets te importeren. De gewone app bevat deze code niet (`build-design-preview.mjs` weigert te bouwen als `index.html` hem wel bevat).
- Demosave (ongewijzigd): `output/demo/NINO-2-DEMO-vlak-voor-derde-pizza.json`, SHA256 `dfe9f46d2b8711ab65aaaa38d1194296ea1d52989d4661e37c3e459e0ee57b6c`.
- Opname van de Vespa-rit: [GIF](video/chrome-vespa-overgang.gif), [webm](video/chrome-vespa-overgang.webm).

## Opdracht en uitvoering

| # | Punt | Uitvoering |
| --- | --- | --- |
| 1 | Reis-tab | Al gedaan in ronde 1, nu opnieuw gespeeld. **Reis** blijft actief bij lessen via **Reis → Verder** en bij hervatten. F1 **Oefenen → Reis → Oefenen** geeft in Chrome dezelfde vraag, hetzelfde concept en dezelfde selectie terug (`Navigatieconcept`, 3–10, terugwaarts). |
| 2 | Alleen de Schoolkaart | Al gedaan in ronde 1 en ongewijzigd. Dit geldt ook bij een oude voorkeur voor de Ontdekkingskaart. **Schoolblad** blijft, de kaartcode blijft bewaard. |
| 3 | Kennismaking één keer opnieuw | Al gedaan in ronde 1 en opnieuw gespeeld (route A). Na herladen wordt het niet nog eens aangeboden. |
| 4 | Eén grote pizzameter | Het pizzawiel is nu 104 px op desktop, 72 px in het antwoordvel en 64 px op schermen tot 420 px. Er is één meter en geen dubbele teller. Bij twee pizza's staat er **Nog één pizza tot je Vespa-rit**. |
| 5 | Ritknop en losse ritpreview | Op de derde doos staat **Start de Vespa-rit**, op de eerste en tweede **Verder**. In de preview speelt **Speel Vespa-rit af** de bestaande animatie, met **Overslaan** en directe aankomst bij verminderde beweging. Voortgang, ritten en opslag blijven gelijk. |
| 6 | Reisboekje zonder scrollbalken | Gemeten in Chrome op 1500×950, 1366×768, 1180×820, 820×1180, 768×1024, 390×844, 375×667 en 320×568 in **Alles vrijgespeeld**. Alle pagina's passen, er is geen horizontale of verticale overloop en elke knop is minstens 44 px hoog. De stempels, aankomststempel, bestemmingslijst en het boekomslag zijn kleiner gemaakt. Gekantelde stempels en postkaarten blijven binnen de pagina. Als laatste vangnet krimpt de pagina tot 0,7 als hij toch overloopt; daar was in de metingen niets meer voor nodig. De boekillustraties worden vooraf geladen, zodat ze bij het bladeren niet stuk voor stuk verschijnen. **Bewaar** en **Annuleren**: daarna bladeren de pijltjestoetsen direct weer. |
| 7 | Achterkant van de postkaarten | Nino's tekst staat op de bestaande achterkant-illustratie, met de vier exacte teksten. **Bekijk achterkant / Bekijk voorkant** wisselt binnen dezelfde kaartruimte; de kaart verschuift niet. De lettergrootte past zich aan: 17–21 px op desktop en iPad, 11–13 px op telefoon, ongeveer 10 px op 320 px. |
| K | Knoppen en uitlijning | Zie hieronder. |
| G | Goudronde | Zie hieronder. |

## Knoppen: gereproduceerd in de gewone app en hersteld

`scripts/qa-nino-controls.mjs` doorloopt in de gewone offline HTML de volgende schermen: start, **Reis → Verder** (met antwoord), **Oefenen → Namen schrijven** (met antwoord), het geopende **☰ Menu**, **Oefenen** en het **Reisboekje**. Dat gebeurt op desktop 1366, iPad staand 820×1180, iPad liggend 1180×820 en telefoon 390 en 320. Voor elk zichtbaar bedieningsonderdeel controleert het script of het echt aanklikbaar is (wat er bovenop ligt), of het binnen het scherm valt, of de tekst niet wordt afgekapt, of het niet overlapt en of het minstens 40 px hoog is.

| | PR71-kandidaat ronde 1 | Deze kandidaat |
| --- | --- | --- |
| Echte problemen | **16** ([log](controls-before.log)) | **0** ([log](controls-after.log)) |

Wat er werkelijk misging in de releaseversie:

- **Volgende plek →** lag op iPad en telefoon onder de tabbalk en was niet aan te tikken. Oorzaak: `focus-mode.js` maakt de leerbalk aan zonder de klasse `focusLearnBar`, waardoor de vaste plaatsing nooit gold en de balk bovenaan in de pagina viel. `focus-mode.js/.css` zijn vastgepind sinds PR51. De klasse wordt daarom vanuit de NINO V2-laag toegevoegd; de balk staat nu onderaan, zoals de bestaande code bedoelde.
- **Aanwijzen** en **Namen schrijven** werden in het geopende menu op 320 px afgekapt ("Aanwijze", "Namen schrijver"), doordat vier knoppen op één rij stonden. Nu passen ze in twee kolommen of meer, afhankelijk van de breedte.
- **Leerroute opnieuw beginnen** was 27 px hoog. Kleine tekstknoppen hebben nu een tikvlak van 44 px.
- Zonder meetfout, maar zichtbaar in beeld: **Ik weet het nog niet** en **Overslaan** zagen eruit als hoofdactie, net als **Controleer**. Ook stond **Kaart vrijmaken** alleen op een eigen rij, raakte **☰ Menu** de bovenrand, en waren knophoogtes en hoeken ongelijk.

Uitvoering in de bestaande componenten (`nino-v2.css` en `nino-v2.js`), in de richting "Nino meets iOS, met een Italiaanse uitstraling":

- Overal dezelfde knophoogte: 44 px voor hulpmiddelen en 48 px voor hoofdacties. De hoeken zijn 12 px.
- Hulpmiddelen zijn crème met donkergroene tekst; een gekozen optie wordt donkergroen. Terracotta `#b9502f` is alleen voor de hoofdactie. Dat geeft 4,94:1 contrast met witte tekst; de vorige koraalkleur `#f16b4c` haalde 3,02:1.
- **Ik weet het nog niet** en **Overslaan** zijn rustig tot er geantwoord is; daarna wordt **Volgende →** de hoofdactie. In het antwoordvel maakt de gebruikte **Controleer** dan plaats.
- Invoerveld en **Controleer** zijn even hoog en schuiven op smalle panelen onder elkaar. **Kaart vrijmaken** staat naast de vraag.
- Er is meer ruimte tussen de kop, **☰ Menu** en de tabbalk.
- Het Nino-artwork is niet aangepast.

Voor en na (links de PR71-kandidaat van ronde 1, rechts deze kandidaat):

- [Menu op 320 px](voor-na/tel320-menu.jpg) · [Oefenen op 390 px: leerbalk onder de tabs](voor-na/tel390-oefenmenu.jpg) · [Namen schrijven op 390 px](voor-na/tel390-schrijven.jpg) · [Na het antwoord op 320 px](voor-na/tel320-schrijvenAntwoord.jpg) · [iPad staand: schrijven](voor-na/ipadStaand-schrijven.jpg) · [iPad liggend: menu](voor-na/ipadLiggend-menu.jpg) · [Desktop: antwoordpaneel](voor-na/desktop-antwoordpaneel.jpg)

## Goudronde

- **★ Goudronde** staat tijdens **Verdien goud** en **Goud nog eens** direct boven de vraag, met een goudaccent op crème. Op telefoon en iPad staat het label op dezelfde plek in het antwoordvel, bij **Aanwijzen** én **Namen schrijven**. Het label staat ook op het pauzescherm na zes vragen.
- Daaronder staat de bestaande voortgangsregel, verplaatst en niet gekopieerd: **Vraag 1 van 12 · Alles goed = goud**. Er is één teller; de statusregel boven de kaart maakt tijdens een goudronde plaats.
- Het label hangt alleen af van `state.route.active?.kind === 'gold'` tijdens een lopende vraag. Een gewone les of opfrissing op een halte die al goud heeft, krijgt het label niet. Na hervatten via **Reis → Verder** komt het label terug.
- Op het resultaat staat één uitkomst met de werkelijke score van de hele goudronde:
  - **Goud verdiend**: "12 van 12 goed. Alle plekken foutloos aangewezen én benoemd."
  - **Je goud blijft staan**: "11 van 12 goed. Je eerder verdiende goud blijft bewaard."
  - **Nog geen goud**: "11 van 12 goed. Voor goud moet alles goed zijn."

  De tellers tonen de hele goudronde in plaats van alleen het laatste blok van zes vragen. De toetsregels en de voortgang zijn niet veranderd.
- Chrome, desktop 1366 en telefoon 320 ([logboek](gold.json)): het label was bij alle 12 vragen zichtbaar, aanklikbaar en stond boven de vraag (6 × Aanwijzen, 6 × Namen schrijven). De uitkomst was **Goud verdiend**, en de opfrisles daarna kreeg geen label. [320 px-overzicht](gold/goudronde-320-overzicht.jpg). De drie uitkomsten en het hervatten zijn ook gecontroleerd in `nino-ux-round.test.mjs`.

## Zelf gespeeld (Chrome 157.0.8103.38, offline `file://`)

`scripts/qa-nino-ux-round.mjs` speelt de routes hieronder: [logboek](chrome-ux-round.json), 0 JS-fouten en 0 externe verzoeken.

- **A. Leeg profiel**: **Overslaan → Reis → Verder → Start meteen → goed antwoord**. Onder **Reis** gaat de meter van 0 naar 1 van 8. Na herladen verschijnt geen aanbieding meer. In het Reisboekje bladeren de pijltjestoetsen na **Bewaar** en na **Annuleren**.
- **B. Demosave vlak voor de derde pizza** (opgenomen): **Nog één pizza tot je Vespa-rit**, dan een goed geschreven antwoord, de doos met **Start de Vespa-rit**, en vertrek, rit en aankomst. Daarna zijn er 3 pizza's en 1 rit. Na herladen wordt niets opnieuw toegekend.
- **C.** Bij verminderde beweging gaat de rit direct naar de aankomst. **D.** **Overslaan** werkt. **E.** De meter is leesbaar op 320, 390, 768, 1024, 1180 en 1500. **F.** F1 Oefenen → Reis → Oefenen.
- **G. Ontwerppreview**: alle boekpagina's en beide kanten van de vier postkaarten op acht schermformaten ([1366](chrome-G-book-1366-01.jpg), [820](chrome-G-book-820-01.jpg), [390](chrome-G-book-390-01.jpg), achterkanten `chrome-G-back-*`). Ook getest: **Eilanden**, **Steden 7–12**, en **Speel Vespa-rit af** (vertrek → rit → aankomst, opslag ongewijzigd, 0 ritten erbij), ook bij verminderde beweging.

## Controles

- `release-check.log`: build, lint, alle testcommando's (63 tests, 0 fouten) en de release-audits zijn geslaagd (`release:check exit 0`). `audit-nino-v2.log`: exit 0.
- `scripts/nino-ux-round.test.mjs` heeft nu 12 tests. Nieuw in ronde 2: achterkanten van de postkaarten, ontwerppreview, knoppen (klasse van de leerbalk en de rustige uitweg tot er geantwoord is) en goudronde.
- `focus-source.mjs` en `playable-source-pins.json`: de hashpins van de gewijzigde NINO-bronnen zijn bijgewerkt. `preservation.json` legt de nieuwe HTML-hash vast.

## Open

- Eigenaarbeoordeling en een onafhankelijke Hermes-review.
- WebKit is niet gedraaid: Playwright 1.58.2 vraagt WebKit-build 2248, geïnstalleerd is 2370. Er is niet getest op echte Safari, een fysieke iPad, het schermtoetsenbord of VoiceOver.
- De tekst op de achterkant van de postkaarten is op 320 px ongeveer 10 px. Dat is leesbaar, maar klein.
- Op telefoon verdwijnt de meter alleen zolang het schermtoetsenbord open staat.
- Na nieuw goud staat onder **Goud verdiend** ook de bestaande stempelkaart **Goud verdiend: \<halte\>** met **Bekijk in Reisboekje**. Dat is het bestaande beloningsmoment; de uitkomst zelf staat er één keer.
- In de ontwerppreview staat de previewbalk op iPad en telefoon onderaan het startscherm, en verdwijnt hij tijdens lessen.
- Nog open uit eerdere rondes: dezelfde aankomstillustratie voor elke bestemming, een waarschuwing in de artwork-audit, het grote appicoon, het echte Pisa-scharnier en echt printen.
- Harness #73/#74 bewust niet aangeraakt.

## Herhalen

```sh
npm ci --ignore-scripts
npm run release:check
node scripts/audit-nino-v2.mjs
export PLAYWRIGHT_MODULE=/pad/naar/playwright/index.mjs
node scripts/qa-nino-ux-round.mjs
node scripts/qa-nino-controls.mjs output/html/NINO-2-Proefversie-2026-11-07-r2.html /tmp/controls shots
node scripts/qa-nino-gold.mjs output/html/NINO-2-Proefversie-2026-11-07-r2.html /tmp/gold
```

`qa-nino-ux-round.mjs` schrijft PNG's. De boekbeelden in deze map zijn omgezet naar JPEG om de repo klein te houden.
