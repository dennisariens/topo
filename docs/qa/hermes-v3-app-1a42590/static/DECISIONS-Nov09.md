## 2026-11-09 — V3 start als presentatielaag, Reis eerst

- **Basis:** `codex/topo-v3` vanaf `f53dc0b`. V2.0.2 blijft de afgesloten release; `index.html` verandert niet tot een V3-kandidaat is goedgekeurd.
- **Bouwwijze:** V3-schermen zijn lagen in `scripts/v3/` die de canonieke staat lezen en nooit schrijven. Acties drukken de bestaande V2-knop in, zodat het gedrag dat in de klikonderschepping van NINO V2 zit (kennismaking, Reis → Verder, bevestiging) behouden blijft. Geen tweede route-, beloning- of opslaglogica.
- **Reis:** één kaart met de huidige halte en één hoofdactie, boven de vouw op alle geteste formaten; de route als verhalend slingerpad (geen landkaart, zie 2026-11-06); detail van een andere halte in de routekaart, met alleen secundaire acties.
- **Ontwerpregels:** `docs/v3/DESIGN_RULES.md`, tokens in `scripts/v3/tokens.css`, gescoped tot `.v3`. Voorstel; eigenaarsakkoord open.
- **Harness:** #74 niet overgenomen (Hermes-REWORK open). Bestaande `npm`-checks plus `scripts/qa-v3-reis.py` op de exacte HTML.
- **Status:** kandidaat ter beoordeling. Geen merge, deployment of downloadvervanging.


## 2026-11-09 — Reis v3b: conceptrichting, landthema's, reliëf

- **Richting:** de conceptrenders van de eigenaar zijn de V3-richting voor structuur en rust (zijbalk · lijst · kaart · één actie), niet voor inhoud: echte elf hoofdstukken, echte kaartgeometrie, canonieke artwork. **Supersedes** de gestapelde kaarten en het verhalende slingerpad van Reis v1 van vandaag.
- **Principe:** de letterlijke eigenaarstekst (Linear / Apple Notes; geen taglines, hulpteksten of bijlabels; UX, DX en AX tegelijk) staat bovenaan `DESIGN_SYSTEM.md` V3.
- **Kaart op Reis:** kopie van de live kaart, gelijke geometrie, zonder namen en zonder interactie; plekken van het gekozen hoofdstuk gemarkeerd. Dit is geen ritkaart en verklapt niets wat Ontdekken niet al toont; het besluit van 6 november over de verhalende rit blijft voor de Vespa-rit gelden.
- **Reliëf:** terug als schakelaar met een leerfunctie (Bergen, Vulkanen, Apennijnen, Povlakte). Schoolkaart blijft standaard en de lesvorm. Een scherper reliëf is een apart spoor met bron en groottelimiet.
- **Landthema's:** neutrale structuur voor elk land; een thema zet alleen accent en vlag. Italia standaard, Viola ter vergelijking. Keuze accent: eigenaar.
- **Ontwerpregels:** `docs/v3/DESIGN_RULES.md` is opgegaan in `docs/DESIGN_SYSTEM.md` V3 (**supersedes** de regel daarover van vanochtend). Verminderde beweging: decoratieve en overgangsbeweging uit, functionele feedback blijft.
- **Preview-HTML** gaat niet meer in Git; buildscript en checksum wel.
- **Status:** kandidaat ter beoordeling. Geen merge, deployment of downloadvervanging.



## 2026-11-09 — Eigenaar: Reis v3b akkoord, Italia, kaartkader

- **Reis v3b** is akkoord als richting; door naar de route hoofdstuk → kaartles → feedback → beloning → Reisboekje.
- **Thema:** Italia is de standaard. Viola blijft alleen als vergelijkingsthema in de preview.
- **Kaartkader:** de vervaging aan de rand mag het referentiekader niet wegnemen. De leerling moet zien wat eromheen ligt (buurlanden, zeeën, eilanden). Minder fade, ruimer kader.
- **Werkverdeling:** implementatie gaat naar Claude Code op de Mac mini (of Codex), via een overdracht in Git; dit gesprek blijft voor product- en ontwerpbesluiten.


## 2026-11-09 — Reis: kaartkader verwerkt

- **Kader:** Italië en de plekken van het hoofdstuk met 14% marge, verruimd tot de vorm van het kaartvlak binnen het kaartcanvas; herberekend bij formaatwijziging. **Supersedes** het krappe kader (6%) en de radiale rand-fade van Reis v3b.
- **Zee en rand:** de echte zeekleur van de kaart vult het vlak; alleen een smalle randfade (4%). Buiten het canvas lopen de echte landvormen door; geen nieuwe geometrie.
- **Schakelaar** Schoolkaart/Reliëf staat onderaan het kaartvlak (op zee), zodat hij geen buurland afdekt.
- **Check:** `qa-v3-reis.py` meet per formaat en stand of buurlanden, eilanden, Noord-Afrika en zeeën ≥ 80% van hun contrast houden (`mapFrameShort`).


## 2026-11-09 — Golden Experience 01, beat 3–7 als V3-laag

- **Besluit:** de les (Ontdekken → Aanwijzen → Namen schrijven → Feedback → beloning → Reisboekje) krijgt V3 als presentatielaag (`scripts/v3/les.js`, `les.css`) over de ongewijzigde V2-les. De canonieke `#quiz`, `#message`, `#next`, kaart en handlers blijven de enige les; V3 leest `state`, schrijft niets en drukt V2-knoppen. Geen tweede beoordelaar, geen nieuwe beloningsregels. Spec: `docs/v3/GE01.md`.
- **Focus Mode blijft eigenaar** van iPad en telefoon. V3-regels voor de lesbalk hangen aan `data-focus-shell` (ook bij pauze en afronding), de kaartverschuiving aan `data-focus-mode`.
- **Reis na een les** kiest het hoofdstuk van de les of het volgende, niet een eerdere rijkeuze.
- **Les:** een `:focus`-regel die de lettergrootte veranderde, liet op telefoon de tik op **Bekijk in Reisboekje** verloren gaan (knop schoof 59 px). Regel: focus verandert nooit de maat; check `bookTapLandsOnButton`.
- **Check:** `qa-v3-les.py` speelt hoofdstuk 2 met echte tikken op vijf formaten; bewijs in `docs/qa/v3-les/`.


## 2026-11-09 — GE01: eigenaarskeuzes les

- **Sheet na antwoord:** gaat vanzelf open. V3 drukt bij de overgang naar "beantwoord" eenmalig de V2-knop **Antwoord openen** als het kind de sheet had ingeklapt; geen wijziging in Focus Mode of `index.html`. Check `sheetOpensAfterAnswer`.
- **Teller** volgt de V2-wachtrij; herhaalde vragen tellen mee.
- **Les zonder hulpregels en "Samen met Nino"**; oefenmodi alleen via Oefenen.


## 2026-11-09 — Beloningen: richting B, rustig kader en rijk boek

- **Besluit eigenaar:** Beloningen volgt richting B uit het ontwerpcanvas (https://claude.ai/artifact/KyM6Dx5UmJ26cPLU4BaqmH). De V3-schil (zijbalk, tellers, typografie) blijft strak. Het Reisboekje staat als rijk middelpunt op een rustig vlak, met de bestaande folio's, stempels, goudzegels en postkaarten.
- **Principe:** rustig kader, rijke inhoud. Het renaissance-schetsboek is het materiaal van het boek, niet van de interface; lessen, kaart en toets blijven er vrij van. Nino blijft overal Nino.
- **Niet:** het boek als donker venster over de app (richting A), of stempels als vlakke tegels zonder perkament (richting C).
- **Open:** folio's in hogere resolutie (nu maximaal 543 CSS-px per pagina); Venezia-rand; idee: per land een eigen kunsttraditie voor het boek (later).
- **Status:** richting gekozen; nog te bouwen als V3-laag, na de les (GE01).


## 2026-11-09 — Renderniveau: V3 gaat naar de kwaliteit van de conceptrenders

- **Besluit eigenaar:** V3 moet het visuele niveau van de conceptrenders halen. Nieuw artwork (achtergronden, hoofdstukbeelden, Nino-portret, iconen, losse Vespa) is dat waard. **Supersedes** "geen nieuw artwork" in de opdrachten van vandaag voor Reis en Beloningen; Beloningen richting B blijft gelden.
- **Wat blijft:** echte geografie (reliëf uit gemeten data in het renderpalet, geen beeld als kaart), de echte elf hoofdstukken, geen streak, en Nino alleen vanaf de canonieke referenties.
- **Bron:** de 8 hoofdstukscènes uit #75 zijn de stijlreferentie en de eerste hoofdstukbeelden. Specificatie: `docs/v3/ARTWORK_BRIEF.md`.
- **Volgorde:** eerst één stijlbeeld met bestaand materiaal (accent Italia en Viola naast elkaar opnieuw te toetsen), dan pas artwork produceren, met QA door Hermes.


## 2026-11-09 — Stijlbeeld Reis (renderniveau, bestaand materiaal)

- **Gebouwd ter beoordeling:** het V2-panorama staat tijdelijk full-bleed achter de app (tot BG-01). Op ≥ 768 px zweeft het app-venster erboven: matglas, hoeken 24, zachte schaduw. Telefoon heeft geen achtergrond. De #75-scènes zijn de hoofdstukminiaturen, uitgesneden zonder Nino (`assets/v3/scenes/manifest.json`); ontbrekende scènes tonen het hoofdstukicoon.
- **Kaart:** het reliëf staat standaard aan (**supersedes** Schoolkaart als standaard in Reis v3b; Schoolkaart blijft één tik). Het renderpalet is een SVG-kleurfilter op het bestaande raster tot `v3/relief-z8`, met witte kustrand, kustzone en landschaduw uit kopieën van dezelfde paden. Geometrie gelijk (46/46).
- **Toegankelijkheid:** bij "Verminder transparantie" of meer contrast wordt het venster ondoorzichtig.
- **Check:** `scripts/qa-v3-stijlbeeld.py`; bewijs in `docs/qa/v3-stijlbeeld/`. Oordeel eigenaar open; geen nieuwe beelden gegenereerd.


## 2026-11-09 — Stijlbeeld akkoord; accent Italia

- **Besluit eigenaar:** de richting van het stijlbeeld is akkoord (zwevend venster boven landschap, hoofdstukbeelden, reliëf in renderpalet, één hoofdactie). Het verschil met de renders zit in het materiaal, niet in de opbouw.
- **Accent:** Italia (terracotta) blijft standaard; dit bevestigt de keuze van 9 november na de hertoetsing uit "Renderniveau". Viola blijft alleen ter vergelijking in de preview.
- **Volgorde artwork:** eerst het reliëf `v3/relief-z8` (Codex) en BG-01, daarna de drie stedenscènes (Roma, Venezia, Napoli), het Nino-portret, de iconen en VE-01. Alles met Hermes-QA volgens `docs/v3/ARTWORK_BRIEF.md`.


## 2026-11-09 — Hermes V3-01: contextnamen op de Reis-kaart blijven

- **Besluit eigenaar:** de contextnamen in de kaartkopie (zoals ITALIË, DUITSLAND, BOSNIË) blijven staan. Ze geven het referentiekader dat de leerling nodig heeft. Voorwaarde: een automatische check faalt zodra een label een van de 45 leerplek-namen toont. Leerplekken zelf blijven naamloos op Reis.
- **Artwork:** BG-01, het Nino-portret en de scène Roma hebben het akkoord van de eigenaar (`art/v3-render-assets`). De modelcheck van Hermes staat nog open; daarna inbouwen.


## 2026-11-09 — Hermes-REWORK afb32d1 verwerkt; reliëf z8 in V3

- **V3-01:** contextnamen blijven (besluit eigenaar). `qa-v3-reis.py` faalt (`labelsWithLearningName`) zodra een kaartlabel een van de 45 leerplek-namen of hun aliassen bevat, ongeacht accenten en letterafstand. Een negatieve controle bewijst dat de check vangt.
- **V3-02:** de schakelaar staat op telefoon onder de kaart (sinds `4b2c323`). `switchCoversPlace` meet per hoofdstuk en per kaartstijl of een gekozen plek wordt bedekt. Op `afb32d1` geeft dezelfde meting voor Sicilië 948 px², nu 0.
- **V3-03:** na het kiezen van een hoofdstuk op telefoon gaat de focus naar de titel (`tabindex=-1`). Focus verandert de maat niet.
- **Reliëf:** Reis gebruikt de z8-renderlagen van Codex (`v3/relief-z8` @ `2a7b0cf`, SHA256 gecontroleerd tegen de provenance) in de laagvolgorde van Codex. Buurlanden zijn gedempt, de zee loopt zachter (halve sterkte, brede kustgloed). **Supersedes** het SVG-kleurfilter op z7 uit het stijlbeeld. Alleen in de Reis-kopie: de lessen en `index.html` blijven z7. De kustdiscrepantie die Codex meldde (≤ 2,84 SVG px bij de eilanden) blijft open.


## 2026-11-09 — Renderassets ingebouwd in V3 Reis

- **Bron:** `art/v3-render-assets` @ `908b4a4`, alleen `assets/v3/render/exports/` en `manifest.json`, byte-gelijk gekopieerd (23 exports, SHA256 = manifest). Masters blijven op de art-branch. Er zijn geen beelden aangepast.
- **Gebruik:** BG-01 is de standaardachtergrond (**supersedes** het V2-panorama uit het stijlbeeld). BG-02 en BG-03 zijn alleen in de preview schakelbaar (`#…/bg02`, `/bg03`). NINO-PORTRET staat in de zijbalk (**supersedes** de `guide`-uitsnede). SCENE-ROMA, -VENEZIA en -NAPOLI vullen Steden 7–23 (**supersedes** het hoofdstukicoon als vervanger). Alle 11 hoofdstukken hebben een miniatuur in de lijst en een kop bij de titel (niet op telefoon). IC-slice en IC-vespa staan bij de tellers.
- **Beloningen:** er is een V3-scherm gebouwd (richting B noemde het nog als te bouwen). Het toont het Reisboekje (opent het V2-boek), VE-01 met de ritten, en tegels voor IC-pizza, IC-stamp, IC-gold en IC-postcard. Alle getallen leest het uit V2 en het schrijft niets. Postkaarten volgen de regel van het V2-boek.
- **Build:** elk ingebed beeld wordt tegen zijn manifest-SHA256 gecontroleerd. De preview groeit met 7,44 MB (+17%). `index.html` blijft byte-gelijk.
- **Open:** de Hermes-modelcheck, en voor meerdere assets het oordeel van de eigenaar (status in het manifest). Hermes-hertest op de pin van deze commit.


## 2026-11-09 — Artwork: visuele kwaliteit boven bestandsgrootte; Nino-kenmerken

- **Achtergronden:** BG-01, BG-02 en BG-03 blijven alle drie in de app. Visuele kwaliteit gaat voor; de groei van het bestand (+7,4 MB) lossen we technisch op: eerst meten op een echte iPad, daarna zo nodig AVIF in plaats van WebP en decoderen wanneer zichtbaar. De bronresolutie van 1586×992 (maximum van de beeldgenerator) is een vastgelegde uitzondering op de brief. Budgetten gelden in KiB.
- **Nino-model:** vast zijn gezicht, groene helm met bril, rode sjaal, blauw bovenstuk, rugzak en rode Vespa. De precieze snit van shirt of jasje mag per scène wat variëren. Uitzondering: het portret (altijd zichtbaar in de zijbalk) moet exact canoniek zijn: gesloten blauw werkshirt.
- **Gevolg voor Hermes 908b4a4:** BG-01 t/m BG-03 vallen onder de uitzondering. Roma en Napoli zijn binnen de modelregel geaccepteerd. Het portret gaat terug voor het shirt; de uitsnede (hoofd en schouders) en de lichte haarrand op donker zijn geaccepteerd.


## 2026-11-09 — Nino draagt overal hetzelfde shirt

- **Besluit eigenaar:** Nino draagt in elk beeld het gesloten blauwe werkshirt uit de canonieke referenties, dichtgeknoopt met kraag, zonder wit shirt eronder. **Supersedes** de regel van vandaag dat de snit per scène mag variëren.
- **Gevolg:** portret, scène Roma en scène Napoli gaan terug voor het shirt (Hermes 908b4a4); Venezia en de #75-scènes blijven.


## 2026-11-09 — Vernieuwde renderassets (05ab1d0) in V3

- Portret, scène Roma en scène Napoli met het gesloten blauwe werkshirt, van `art/v3-render-assets` @ `05ab1d0`. Byte-gelijk overgenomen, SHA256 volgens het manifest. **Supersedes** dezelfde drie exports van `908b4a4`. De drie achtergronden blijven (besluit 9-11).
- Preview 50.199.445 bytes (+7,42 MB t.o.v. vóór de renderassets); `index.html` blijft byte-gelijk. Klaar voor de Hermes-hertest op de pin van deze commit.
