# V3.0 doelrenders

Conceptrenders van 10 november 2026 (ChatGPT, prompts in de chat; benchmark in `docs/qa/v3-stijlbeeld/vergelijking-r*`). **Een render bepaalt de stijl en de opbouw, niet de inhoud.** De kaart, de plekken, de hoofdstukken en de getallen komen altijd uit de app. Een scherm is klaar als de render en de build naast elkaar in `docs/qa/v3-stijlbeeld/` staan en de eigenaar daarvoor akkoord heeft gegeven.

## Gedeelde stijl (uit alle zes)

- **Canvas:** het artwork vult het hele scherm. Geen witte plaat; losse glaspanelen, radius ±28, doorschijnend wit met blur en een zachte schaduw.
- **Zijbalk:** zwevend glaspaneel. Bovenaan het woordmerk TOPO (violet, zwaar, rond) met de driekleur, dan het portret, dan de nav-items in violet tekst op gewicht 700. Het actieve item is een lavendel pil. Onderaan alleen een tandwiel.
- **Nav-iconen (vast):** Reis = kaart · Oefenen = baret · Toets = klembord · Beloningen = beker · Voortgang = staafjes · Instellingen = tandwiel.
- **Typografie:** display violet op gewicht 800–900 (Oefenen, Toets, 7/10); labels violet-zwart op gewicht 700. Ronde schreefloze letter; SF Pro Rounded als die er is, anders een ingebedde ronde fallback (te bepalen bij de bouw).
- **Knoppen:**
  - primair: een violette pil met verloop, icoon links en pijl rechts;
  - secundair: een witte glaspil;
  - selectie: een lavendel vulling met een violette rand.
- **Kaart:** zweeft vrij boven het artwork met een slagschaduw en zonder kader of waas. Bij Oefenen, Toets en Beloningen is het reliëf standaard; bij Les en Voortgang de schoolkaart. Buurlanden staan altijd in landkleur.
- **Status-iconen:** groen vinkje = klaar · gouden lauwerkrans = goud · pizzapunt = bezig · rood × = fout.

## Ingetogenheid: wat de benchmark voorheeft (eigenaar, 10-11)

De zes renders zijn een grote stap, maar halen het niveau van de benchmark nog niet: ze ogen als een spel en niet als Apple of Linear. **Bij een conflict gaan deze regels voor de renders.**

1. **Eén luid element per scherm.** Dat is de kaart, of de held (boek, score). De rest is stil.
2. **Typografie:**
   - display (gewicht 800) alleen voor de schermtitel of de score;
   - verder 15–17 px op gewicht 500–600, in donkere inkt (niet violet);
   - geen hoofdletters als nadruk.
3. **Violet alleen voor betekenis:** de primaire actie, de actieve nav, selectie en voortgang. Geen violette lopende tekst en geen violette labels.
4. **UI-iconen:** dunne lijniconen in één set (in de stijl van SF Symbols), monochroom. Illustraties (3D of geschilderd) alleen als inhoud: Nino, boek, Vespa, pizza, hoofdstukbeelden. Niet in tegels, knoppen of chips.
5. **Achtergrond:** het artwork zit aan de randen en is rustig achter de panelen. Een zachte, lichte wash en verminderde verzadiging achter de UI-zone. Nooit op de kaart zelf.
6. **Glas:**
   - één niveau, met een fijne binnenrand van 1 px (licht) en een kleine, zachte schaduw;
   - geen gestapelde kaarten in kaarten;
   - groepen scheiden met witruimte, niet met extra panelen.
7. **Ruimte:** 8-pt-raster, ruime marges en minder elementen. Liever één rij minder dan een volle tegel.
8. **Kleurtemperatuur:** pastel, met lavendel en zacht zonlicht zoals in de benchmark. Het reliëf mag rijk zijn, maar harmonieert met het palet (geen neongroen).
9. **Beweging en glans:** geen glow onder knoppen en geen decoratieve streepjes of sparkles.

**Toets:** zet een scherm in grijstinten naast de benchmark. Klopt de hiërarchie (één luid element, de rest rustig), dan klopt het ontwerp.

## IJkpunt stijl: `R-oefenen-ijk` (eigenaar, 10-11)

Na de ingetogenheidsronde staat **`R-oefenen-ijk.webp`** voor de stijl van alle schermen. Wat erin vastligt:

- **Opbouw:** een smal glaspaneel met de nav, één hoofdpaneel en de kaart als enige luide element.
- **Achtergrond:** de wash en het pastel van `R-oefenen-ijk-rust.webp` (de rustigste variant).
- **Woordmerk TOPO** in donkere inkt met de driekleur. De titel is het enige display-element, in inkt (niet violet).
- **Selectie:** een lavendel vulling met violette rand en violette tekst, voor tegels, chips en de nav. **Massief violet alleen voor de primaire actie** (Start).
- **Vormtegels:**
  - vier op één rij, met een lijnicoon en een label;
  - de iconen: Ontdekken = verrekijker, Aanwijzen = vizier, Namen schrijven = potlood, Slim rondje = shuffle;
  - het boek-icoon niet gebruiken, want dat botst met Schoolblad en Reisboekje.
- **Scheiding:** een dunne lijn tussen vorm en groep; geen extra paneel.
- **Chips:**
  - drie kolommen, op één regel, altijd met de volledige namen (nooit afkortingen als "Extra 13–18");
  - de breedte van het paneel volgt de langste chip.
- **Startknop:** een pil met een open play-icoon en een pijl, zonder glow.
- **Pins:** alleen de plekken van de gekozen groep, als violette pins op het reliëf.

`R-oefenen.webp` (eerste ronde) is daarmee voor Oefenen vervangen. Voor de andere schermen blijven de renders van de eerste ronde gelden voor de opbouw, en `R-oefenen-ijk` met de ingetogenheidsregels voor de stijl.

## Voortgang: doelbeeld `R-voortgang-doel` (eigenaar, 10-11)

De eigenaar vond `R-voortgang-doel.webp` het sterkst; ter vergelijking staan `R-voortgang-ijk.webp` en de benchmark `B-voortgang-benchmark.webp` erbij. Daarmee vervalt `R-voortgang.webp`.

**Waarom het werkt:**
- de kaart en het getal (32/45) staan samen in één kaart en vormen het enige luide element;
- veel lucht, kleine en heldere typografie;
- violet alleen als data;
- het artwork alleen aan de randen.

**Overnemen:**
- een grote kaartkaart met "Italië", het getal, een balk en de legenda;
- rechts een rustige lijst met hoofdstukken (nummer, naam, status of balk; geen foto's, die horen bij Reis);
- onderaan een rij tegels met lijnicoon, label en getal.

**Corrigeren:**
- **geen begroeting** ("Buongiorno Nino": Nino is de gids, niet de leerling, en het is een tagline);
- **geen offline-badge**;
- **geen streak** (eerder afgewezen); daar komt **Dagdoel 3/8**;
- **alle 11 hoofdstukken** met echte namen; past dat niet, dan compacte rijen of een eigen scroll;
- **"Recent geoefend" wordt "Toetsen":** de laatste uitslagen (datum, hoofdstukken, score), en een tik opent de lijst van 10;
- **onderste tegels:** Dagdoel · Pizza's · Vespa's, met de echte data (3 pizza's per rit);
- **legenda:** Beheerst · Bezig · Nog niet, met de drempel uit DECISIONS;
- **de kaart kleurt de 45 plekken** (steden als stip, rivieren als lijn, eilanden, zeeën, bergen, en regio's alleen voor het hoofdstuk Streken), niet alle regio's.

**Nuance op de regel "geen witte plaat":** het doelbeeld en de benchmark-lijst gebruiken wel een rustige, lichte plaat. Het probleem van V3.0 was de plaat *zonder* artwork, lucht en hiërarchie. Daarom twee oppervlakken:
- **Landschap** (Reis, Oefenen, Les, Toets resultaat, Beloningen): het artwork als canvas, met zwevende glaspanelen.
- **Werkblad** (Voortgang, Toets instellen, Instellingen): één lichte plaat met ±92% dekking, het artwork zichtbaar langs de randen en onder de zijbalk, en kaarten met veel lucht.

De QA-check "geen paneel breder dan 70%" geldt alleen voor Landschap. Voor Werkblad geldt: het artwork blijft zichtbaar op ≥ 12% van de viewport.

## Raster en uitlijning (eigenaar, 10-11, naar `R-voortgang-doel`)

De kracht van het doelbeeld is de uitlijning. Die geldt voor alle schermen:

- **Eén frame:**
  - op elk scherm is het buitenframe identiek: dezelfde marge tot de viewport (desktop 28 px, iPad 20 px) en dezelfde buitenradius (28 px);
  - wisselen van tab laat niets verspringen.
- **De zijbalk is de linkerkolom van dat frame** (vaste breedte, 240 px op desktop): transparant glas, waardoor het artwork onderaan doorschijnt. Het is geen los eiland meer; dat vervangt de zwevende zijbalk uit `R-oefenen-ijk`.
- **Het inhoudsvlak** rechts van de zijbalk:
  - Werkblad: een lichte plaat (±92%);
  - Landschap: transparant, zodat het artwork zichtbaar is, met de panelen zwevend binnen dezelfde randen.
- **Raster:**
  - 12 kolommen binnen het inhoudsvlak, met één vaste goot (24 px desktop, 16 px iPad) en een binnenmarge gelijk aan de goot plus 8;
  - elk blok begint en eindigt op een kolomlijn.
- **Gedeelde lijnen:**
  - de bovenkant van de titel, het eerste blok links en het eerste blok rechts liggen op één lijn;
  - de onderkanten van de blokken in dezelfde rij ook;
  - de onderste rij tegels overspant exact dezelfde breedte als de blokken erboven, en de tegels zijn even breed en even hoog;
  - de onderste rand van de laatste rij ligt op de binnenmarge van het frame.
- **Verdeling:**
  - links ±7/12 (de kaart), rechts ±5/12 (de lijst en daaronder een kaart);
  - onderaan 3 gelijke tegels over 12 kolommen.
- **QA-check:** blokken in dezelfde rij hebben gelijke boven- en onderkanten (±1 px), de goten zijn overal gelijk (±1 px) en het frame is op alle tabs identiek (±1 px).

## Per render: overnemen en afwijken

| Render | Overnemen | Niet overnemen / afwijken |
| --- | --- | --- |
| `R-les` | opbouw: een stappenbalk als glaspil, Schoolblad en 1/6 rechtsboven, de vraag in een glaspaneel, een compacte pizzameter, de zoomgroep in de kaarthoek, en de schoolkaart met buurlanden in landkleur | stijl van zijbalk en woordmerk (zwart): gelijktrekken met de andere renders; de nav-iconen volgens de vaste set |
| `R-oefenen` | vier vormtegels met illustratie, chips in drie kolommen, één Start-pil, reliëfkaart met alleen de groep als pins | AI-kaart en pinposities (echte geometrie gebruiken) |
| `R-toets-instellen` | één paneel met drie groepen; Nino op ware grootte met klembord rechts op het landschap | toon alle 11 hoofdstukken als chips (geselecteerd = vinkje), niet alleen vier; Lengte als chips zonder radiorondjes |
| `R-toets-resultaat` | score in een glaskaart, Nino met duim omhoog, reliëfkaart met ✓/×-pins en labels bij fouten, het paneel Fouten en een rij icoonpillen | "overgeslagen" alleen waar het echt overgeslagen is; bij een fout antwoord bij Aanwijzen niets |
| `R-beloningen` | groot boek als knop, pizza's boven de Vespa, vier tegels met icoon en display-cijfers | **boek:** het goedgekeurde omslag (B) houden, niet het nieuwe omslag met titel en gesp (**besluit eigenaar, 10-11**); **pizza's:** volgen de data (3 per rit); **decoratieve streepjes** bij de titel weg |
| `R-voortgang` | titelbalk met 23/45 en een balk, een grote kaart met beheersingskleuren en legenda, hoofdstukrijen met foto, balk en status-icoon, dagdoel met stippen | **kaart:** kleur de **45 plekken** (steden, bergen, rivieren …), niet regio's; regiovlakken alleen voor het hoofdstuk Streken. **Lijst:** alle 11 hoofdstukken met de echte namen; past niet alles, dan krijgt het paneel een eigen scroll. **Decoratieve streepjes** weg |

## Nieuw artwork nodig

| ID | Wat | Gebruik |
| --- | --- | --- |
| NINO-DUIM | Nino ten voeten uit, duim omhoog (uniform: gesloten blauw werkshirt, rode sjaal, helm met bril, rugzak) | Toets resultaat, alles of bijna alles goed |
| NINO-AANMOEDIGING | Nino ten voeten uit, bemoedigend gebaar | Toets resultaat, veel fouten |
| NINO-KLEMBORD | Nino ten voeten uit, schrijft op een klembord | Toets instellen |
| IC-ontdekken | verrekijker | vormtegel |
| IC-aanwijzen | kaart met pin | vormtegel |
| IC-schrijven | potlood | vormtegel |
| IC-slim | kompas | vormtegel |

Voor de bouw rendert Claude Code tijdelijk de bestaande V2-poses en lijniconen. Het definitieve artwork volgt de pijplijn van `art/v3-render-assets`.
