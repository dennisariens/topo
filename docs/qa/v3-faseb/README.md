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
