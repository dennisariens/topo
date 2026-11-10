# V3.0 fase B: bewijs

## Stap 2: Reis volgens `R-reis-ijk`, met twee kaartvarianten

Opdracht: fase B (`docs/v3/renders/README.md` § Reis, § Raster en uitlijning, § Verfijning) en de review van fase A: lever twee kaartvarianten naast `R-reis-ijk` en bouw Reis af in variant (a) tot de eigenaar kiest. Script: `scripts/qa-v3-faseb.py`. Resultaat: [`results.json`](results.json).

Gemeten op `#bezig` en `#afgerond`, voor beide varianten, op desktop 1440×900, iPad liggend 1180×820 en iPad staand 820×1180.

**Naast het doelbeeld:**

| Variant | Desktop | iPad liggend |
| --- | --- | --- |
| (a) Eiland, standaard | [vergelijking](../v3-stijlbeeld/reis-ijk-eiland-desktop.jpg) | [vergelijking](../v3-stijlbeeld/reis-ijk-eiland-ipad-liggend.jpg) |
| (b) Kaart, `#…/kaart` | [vergelijking](../v3-stijlbeeld/reis-ijk-kaart-desktop.jpg) | [vergelijking](../v3-stijlbeeld/reis-ijk-kaart-ipad-liggend.jpg) |

Losse screenshots: `reis-<variant>-<demo>-<formaat>.png`.

| Check | Drempel |
| --- | --- |
| Raster | Lijst = 5 kolommen, kaartkolom = 7, goot ertussen = de goot, binnenmarges = goot + 8 (alles ±1,5 px) |
| Gedeelde lijnen | Bovenkant van de titel "Reis" = bovenkant van de eerste rij van de kaartkolom; onderkant van de lijst = onderkant van de hoofdstukkaart = binnenmarge (±1 px) |
| Eén titel | Precies één display-tekst (≥ 30 px, het woordmerk niet meegerekend): "Reis"; geen zichtbaar kopje "Hoofdstukken" |
| Zijbalk | Portret 112 (desktop), 88 (iPad liggend, gelabelde zijbalk van 200 px), 56 (rail op iPad staand) |
| Rijen | Afgerond: alleen een vinkje. Goud: een medaille. Bezig: een dunne balk. Op slot: alleen een slotje |
| Hoofdstukkaart | 3 stapstippen en 1 primaire pil |
| Pins | Binnen de kaartrij en boven de hoofdstukkaart; 6 bij Steden 7–12 |
| Tellers | Lijniconen, geen illustraties |
| Violet | Geen violette tekst buiten de actieve nav, de selectie en de primaire pil |
| (a) Eiland | Geen zeekleur (zeelagen uit, achtergrond transparant); buurlanden als silhouetten (dekking 0,3–0,8) met het vervagingsmasker; reliëf op Italië geclipt |
| (b) Kaart | De kaart in een glaskaart (radius 28) |
| Overflow | Geen horizontale scroll |

Alle checks zijn groen. Ook de bestaande V3-QA is groen, met bijgestelde checks in `qa-v3-stijlbeeld` (zie DECISIONS 10-11, fase B stap 2). Lint, test en build zijn groen, `index.html` is byte-gelijk en de geometrie is 46/46.

**Open:** de eigenaar kiest tussen (a) en (b).

## Stap 3: Oefenen volgens `R-oefenen-ijk`

Script: `scripts/qa-v3-faseb-oefenen.py`. Resultaat: [`results-oefenen.json`](results-oefenen.json).

Gemeten op `#bezig`, voor beide kaartvarianten, op desktop, iPad liggend, iPad staand en telefoon 390×844. Per run zijn drie keuzes getest: Steden 7–12, Eilanden en Slim rondje.

**Naast het doelbeeld:**

| Variant | Desktop | iPad liggend |
| --- | --- | --- |
| (a) Eiland, standaard | [vergelijking](../v3-stijlbeeld/oefenen-ijk-eiland-desktop.jpg) | [vergelijking](../v3-stijlbeeld/oefenen-ijk-eiland-ipad-liggend.jpg) |
| (b) Kaart, `#…/kaart` | [vergelijking](../v3-stijlbeeld/oefenen-ijk-kaart-desktop.jpg) | [vergelijking](../v3-stijlbeeld/oefenen-ijk-kaart-ipad-liggend.jpg) |

Losse screenshots: `oefenen-<variant>-<formaat>.png`.

| Check | Drempel |
| --- | --- |
| Raster (≥ 1024) | Het paneel begint op de binnenmarge en spant een heel aantal kolommen (5–8); één goot naar de kaart; de kaart eindigt op de binnenmarge (±1,5 px) |
| Gedeelde lijn | Bovenkant van het paneel = bovenkant van de kaart (±1 px) |
| Vaste rand | Het paneel houdt zijn breedte bij Slim rondje (±1 px) |
| Eén titel | Precies één display-tekst: "Oefenen"; geen zichtbare veldkopjes |
| Vormtegels | Vier, elk met een lijnicoon en een label (geen illustratie) |
| Lijn | 1 px tussen vorm en groep |
| Chips | Drie kolommen (telefoon: twee), elk op één regel, alle namen voluit, binnen het paneel |
| Start | Eén primaire pil, met het play-icoon, over de volle breedte van het paneel |
| Pins | Steden 7–12: 6 pins in het kaartvlak; Eilanden: vlakken zonder pins; Slim rondje: geen groep en geen pins |
| (a) Eiland | Reliëf geclipt op Italië met de eigen clip (`v3o-italyClip`); geen zeekleur |
| (b) Kaart | De kaart in een glaskaart (radius 28) |
| Zijbalk, violet, overflow | Portret 112/88/56; geen violette tekst buiten betekenis; geen horizontale scroll |

Alle checks zijn groen.

## Stap 4: Les volgens `R-les`

Script: `scripts/qa-v3-faseb-les.py`. Resultaat: [`results-les.json`](results-les.json).

Gemeten in een routeles (`#bezig`, Steden 7–12, Aanwijzen) op desktop en iPad liggend (Focus Mode). Vergelijking: [desktop](../v3-stijlbeeld/les-ijk-desktop.jpg) · [iPad liggend](../v3-stijlbeeld/les-ijk-ipad-liggend.jpg). De lesflow zelf blijft gedekt door `qa-v3-les.py`.

| Check | Drempel |
| --- | --- |
| Stappenbalk (desktop) | Twee glaspillen met gelijke boven- en onderkant (±1 px); de stappen als één gesegmenteerde pil |
| Stapmarkeringen | Lijniconen, geen cijfers of ✓-tekens: een vinkje bij klaar, anders het vormicoon |
| Eén display-tekst (desktop) | Alleen de vraag |
| Antwoordknoppen (desktop) | Secundaire pillen over de volle breedte met een lijnicoon; door V2 verborgen knoppen blijven verborgen |
| Kaarthoeken (desktop) | De zoomgroep 14 px in de hoek rechtsonder, Heel Italië en Zoom op hoofdstuk linksboven, binnen de kaart (±2 px) |
| Gedeelde lijn (desktop) | Bovenkant van de kaart = bovenkant van het vraagpaneel (±1 px) |
| Focus Mode (iPad) | De wrappers lossen op (`display:contents`); geen horizontale scroll |

Alle checks zijn groen.

## Stap 5: Toets instellen en Toets resultaat

Script: `scripts/qa-v3-faseb-toets.py`. Resultaat: [`results-toets.json`](results-toets.json).

**Instellen:** gemeten op `#bezig`, op desktop, iPad liggend, iPad staand en telefoon. Vergelijking: [desktop](../v3-stijlbeeld/toets-instellen-desktop.jpg) · [iPad liggend](../v3-stijlbeeld/toets-instellen-ipad-liggend.jpg).

**Resultaat:** gemeten na een toets van 10 vragen met 3 overgeslagen. Variant (a) op desktop en iPad liggend, variant (b) op desktop. Vergelijking: [(a) desktop](../v3-stijlbeeld/toets-resultaat-eiland-desktop.jpg) · [(a) iPad liggend](../v3-stijlbeeld/toets-resultaat-eiland-ipad-liggend.jpg) · [(b) desktop](../v3-stijlbeeld/toets-resultaat-kaart-desktop.jpg).

| Check | Drempel |
| --- | --- |
| Eén display-tekst | Instellen: "Toets"; resultaat: de score |
| Hoofdstukchips | Alle 11 en Alles; drie kolommen (telefoon: twee); voluit op één regel; vinkje ⇔ gekozen, ook direct na een tik |
| Vorm en lengte | Drie tegels met lijniconen (Beide: twee); lengte zonder radio |
| Start toets | Eén primaire pil met het play-icoon, zo breed als het instelblok |
| Raster instellen (≥ 1024) | Het blok op de binnenrand van de plaat, 6 (desktop) of 7 (iPad liggend) kolommen (±1,5 px); Nino ernaast, binnen de plaat, `aria-hidden` |
| Resultaat: kaart | Variant als Reis ((a) reliëf geclipt met de eigen clip; (b) glaskaart); de 10 markeringen binnen de kaart |
| Resultaat: paneel | Glas; × per fout (CSS); de primaire pil met icoon; vier tegels met lijnicoon |
| Raster resultaat (≥ 1024) | Scorekaart en paneel op één bovenlijn (±1 px); kaart 7 en paneel 5 kolommen (±1,5 px) |
| Overflow | Geen horizontale scroll |

Alle checks zijn groen. In `qa-v3-faseb.py` en `qa-v3-glas.py` meten de checks voor variant (a) nu de silhouetgroep van de buurlanden: dekking 0,3–0,8, de vervaging, en originelen die niets meer tekenen.

## Stap 6: Beloningen volgens `R-beloningen`

Script: `scripts/qa-v3-faseb-beloningen.py`. Resultaat: [`results-beloningen.json`](results-beloningen.json).

Gemeten op `#bezig` op desktop, iPad liggend, iPad staand en telefoon, en op `#alles` op desktop. Het script draait met `prefers-reduced-transparency: no-preference`, het glas zoals ontworpen. Vergelijking: [desktop](../v3-stijlbeeld/beloningen-ijk-desktop.jpg) · [iPad liggend](../v3-stijlbeeld/beloningen-ijk-ipad-liggend.jpg). De tellingen tegen het V2-Reisboekje blijven gedekt door `qa-v3-stijlbeeld.py`.

| Check | Drempel |
| --- | --- |
| Eén display-tekst | "Beloningen", zonder decoratie (geen pseudo-elementen) |
| Boek | Vrij: transparant en zonder schaduw; het omslag is een knop; één primaire pil, Open Reisboekje |
| Ritpaneel | Glas (backdrop-filter, radius 28) |
| Pizza's | Drie, volgens de data: verdiend = 8 punten, de huidige = de punten van nu, de rest 0 |
| Rit | Vespa zichtbaar; het aantal ritten op 700; een meter van drie brede segmenten, aan = pizza's mod 3 |
| Tegels | Vier, even breed (±1 px), glas, met icoon, label en getal op 700 (26–30 px; telefoon 22–26) |
| Raster (≥ 1024) | Boek op kolom 1–5, paneel op 6–12 (±1,5 px); boek en paneel op één bovenlijn (±1 px); tegels over de volle breedte |
| Overflow | Geen horizontale scroll |

Alle checks zijn groen.

