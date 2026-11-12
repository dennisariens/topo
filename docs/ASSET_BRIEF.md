# TOPO — Assetbriefing fase 1 (ChatGPT-prompts)

Werkwijze: jij genereert in ChatGPT en plaatst de bestanden hier in de chat (of in een gekoppelde map). Ik controleer, hernoem, converteer naar WebP en zet ze in de repo.

## Vooraf in ChatGPT

1. Start **één** chat voor alle Nino-assets, zodat de stijl gelijk blijft.
2. Upload bij de eerste prompt **beide referenties**: `nino-op-de-scooter.webp` en `topo-italie-avontuur.webp` (uit `output/art/`).
3. Plak eerst het **stijlblok** hieronder. Daarna per asset alleen de korte prompt.
4. Eén asset per prompt. Niet vier poses in één beeld: dat moet ik dan knippen en dat kost kwaliteit.
5. Download als **PNG** (niet screenshot). Bestandsnaam maakt niet uit, zet wel het nummer erbij (bijv. `1c.png`).

### Stijlblok (één keer plakken)

```
You are producing a consistent asset set for a children's geography learning app.
Match the attached reference images exactly in character design and render style.

STYLE: premium 3D animated feature-film look, soft global illumination, warm golden-hour light,
rich but natural colors, subtle surface texture (worn paint, fabric weave), friendly and calm.
No text, no letters, no logos, no brand names, no watermarks, unless the prompt asks for a word.

CHARACTER "NINO" (keep identical every time): an 11-year-old boy, dark messy curly hair,
large warm brown eyes, freckles-free olive skin, big friendly smile. Olive-green open-face
vintage helmet with brass aviator goggles on top. Red fringed scarf, small red neckerchief,
short-sleeve faded blue shirt with rolled sleeves, brown leather satchel with shoulder straps,
olive cargo trousers rolled at the calf, worn brown canvas sneakers with white socks.

SCOOTER: classic 1960s Italian-style scooter, glossy cherry-red paint with light wear,
chrome trim, round chrome headlight, small front mudguard, no badges or logos.

Confirm you understand; I will send one asset at a time.
```

## Technische eisen

| Type | Formaat in ChatGPT | Achtergrond | Let op |
| --- | --- | --- | --- |
| Uitsnede (Nino, Vespa, baksels, doos) | 1024×1024 of 1024×1536 staand | **Transparant** | Hele figuur in beeld, ~8% marge rondom, geen grondschaduw |
| Hero | 1536×1024 liggend | Volledig beeld | Belangrijke inhoud in de middelste 55% hoogte (ik snijd bij naar 3:1) |
| Stempels/zegels | 1024×1024 | **Transparant** | Eén inktkleur, plat, geen 3D |
| Hoofdstuktegels | 1024×1024 | Volledig beeld | Onderwerp gecentreerd, geen tekst |
| Paspoort | 1024×1536 staand | Transparant | Recht van voren, geen perspectief |

Voeg bij elke uitsnede toe als het niet vanzelf gebeurt: `transparent background, PNG`.
Krijg je een nep-geblokte achtergrond (grijs/wit dambord in het beeld zelf)? Opnieuw vragen: *"real alpha transparency, not a checkerboard pattern"*.

---

## 1 · Nino master-poses (universeel) — transparant, 1024×1536

Rijdende pose bestaat al (`nino-op-de-scooter.webp`). Nodig: 8 losse poses, **staand, zonder scooter**, tenzij anders vermeld.

- **1a Welkom** — `Nino standing, full body, front three-quarter view, waving hello with his right hand, open welcoming smile. Transparent background.`
- **1b Wijst** — `Nino standing, full body, pointing to the left side of the frame with his whole arm extended, curious excited face, looking at where he points. Transparent background.`
- **1c Juicht** — `Nino jumping with both fists in the air, celebrating, mouth open in joy, scarf flying. Full body, transparent background.`
- **1d Denkt** — `Nino standing, full body, one finger on his chin, eyes looking up, thinking, slight puzzled smile. Transparent background.`
- **1e Schrijft** — `Nino standing, full body, writing in a small brown notebook with a pencil, concentrated tongue-out expression. Transparent background.`
- **1f Met paspoort** — `Nino standing, full body, proudly holding up an open small travel passport booklet toward the viewer, the pages show colorful blank stamp areas (no readable text). Transparent background.`
- **1g Aanmoediging** — `Nino standing, full body, giving a thumbs up with a kind encouraging smile, slight head tilt, as if saying "try again, you can do it". Transparent background.`
- **1h Gold** — `Nino standing, full body, holding a shiny golden medal-like seal above his head with both hands, triumphant, warm sparkles around the seal only. Transparent background.`

## 2 · Vespa-set (universeel) — transparant

- **2a Zijaanzicht** (1536×1024) — `The red scooter alone, no rider, exact side view facing right, parked, kickstand down. Transparent background.`
- **2b Icoon** (1024×1024) — `The red scooter alone, front three-quarter view, simplified and compact so it reads clearly at 48 pixels, slightly chunkier proportions, same colors. Transparent background.`
- **2c Rijdend** (1536×1024) — `Nino riding the red scooter, exact side view facing right, motion pose, scarf streaming back, small dust puffs behind the rear wheel. Transparent background.`
- **2d Met bagage** (1536×1024) — `Nino riding the red scooter in side view facing right, with a worn brown leather suitcase strapped on the rear rack and a rolled map sticking out of his satchel, ready for a long journey. Transparent background.`

## 3 · Paspoort / reisboekje (universeel) — transparant, 1024×1536

- **3a Cover** — `A small children's travel passport booklet, closed, front view, flat-on with no perspective, deep teal cloth cover with worn corners, a gold-embossed emblem of a small scooter inside a circle, gold border line. No text. Transparent background.`
- **3b Binnenpagina** — `The same passport opened flat, front view, cream paper pages with subtle guilloche security pattern, empty: a grid of six blank rounded stamp areas on the right page and one larger blank area on the left page. No text, no stamps. Transparent background.`

> 4 (UI-componenten) en 5 (kaart) genereer je **niet**: die bouw ik als SVG in code. De kaart komt uit geografische brondata.

## Status (12 nov 2026)

Universeel klaar: 1a–1h (+ 1b-variant), 2a–2d, 3a–3b, met masters. Frankrijk: nog niets.
Bijgewerkt na de V4-besluiten: Frankrijk heeft **11 hoofdstukken** (per kopje op het schoolblad) en de beloning is een **gebakjesdoos met 6 Franse gebakjes; 3 volle dozen = een Vespa-rit**. De bakkerijvitrine en de 5 regio-stempels uit de eerste versie vervallen.

Volgorde Frankrijk: 6 → 7a/7b → 8 → 9. (6, 7a–7h en 8 zijn klaar.) Stempels en tegels per hoofdstuk (10) pas na de oefenkaart.

## 6 · Hero Frankrijk — 1536×1024

Upload als extra referentie `vespa-zij` (2a), zodat de scooter gelijk blijft.

- **6 Hero** — `Wide cinematic scene: Nino rides the red scooter toward the viewer on a sunny country road entering France, right third of the frame. At the roadside a small blue-and-white enamel road sign reads exactly "France". Background: gentle rolling fields with lavender rows, a stone farmhouse with blue shutters, distant poplar trees, a small village with a church spire on a hill, soft summer sky. Same render style and light as the Italian harbour reference. Keep Nino, the sign and horizon within the middle band of the image; plenty of plain sky on top and road at the bottom for cropping.`

Controleer zelf het bord: alleen "France", correct gespeld. Anders opnieuw.

## 7 · Gebakjesdoos + 6 gebakjes (Frankrijk) — transparant

De doos is de voortgangsbalk: elk vakje vult zich met een gebakje. Daarom moeten doos en gebakjes exact op elkaar passen: eerst de doos, dan de gebakjes in dezelfde chat.

- **7a Doos leeg** (1536×1024) — `An open French pâtisserie box seen from straight above (top-down, no perspective): cream cardboard with a thin gold edge, lid folded open at the top edge, inside a 3×2 grid of six empty round paper cups with crisp white doilies, evenly spaced. No text, no logos. Transparent background.`
- **7b Doos vol** (1536×1024) — `The exact same box, same top-down angle, size and position, now with one pastry in each cup: croissant, pain au chocolat, pink macaron, chocolate éclair, strawberry tartlet, madeleine. Transparent background.`
- **7c–7h Gebakjes: niet genereren.** Ze zijn rond uitgesneden uit 7b, zodat ze exact in de vakjes van 7a passen. Oorspronkelijke prompt, alleen nodig voor extra gebakjes — `A single [GEBAKJE] seen from straight above, sitting in a round paper cup with a white doily, same light and style as the box. Transparent background, readable at 64 pixels.`

| # | [GEBAKJE] |
| --- | --- |
| 7c | golden flaky croissant |
| 7d | pain au chocolat with two chocolate stripes visible |
| 7e | pastel pink macaron |
| 7f | chocolate éclair with glossy icing |
| 7g | small strawberry tartlet with glazed strawberries |
| 7h | shell-shaped golden madeleine |

Zelfde camera-afstand en licht voor 7c–7h.

## 8 · Gouden doos (Gold, Frankrijk) — transparant, 1024×1024

- **8 Gouden doos** — `The same pâtisserie box closed, three-quarter view, now made of shiny gold card with a cream satin ribbon and bow, a warm glow and a few sparkles. No text. Transparent background.`

## 9 · Landstempel + Gold-zegel (Frankrijk) — transparant, 1024×1024

Plat, geen 3D. Dit is "inkt op papier". Past in de stempelvakken van het reisboekje (3b).

- **9a Landstempel** — `A flat rubber-stamp ink impression, single color dark navy blue ink, slightly imperfect with uneven ink and tiny gaps as if stamped by hand, circular with a double border. Inside: a simple line drawing of the Eiffel Tower and a small scooter. Around the border the word "FRANCE" at the top. Transparent background, no paper.`
- **9b Gold-zegel** — `A flat embossed gold wax-seal style emblem, round with scalloped edge, single gold color with subtle highlights, a simple rooster silhouette in the center and a small star above. No text. Transparent background.`

## 10 · Hoofdstukstempels + tegels (later)

Volgt na de oefenkaart, afgestemd op de 11 hoofdstukken in `data/fr/items.draft.json`. Prompts komen dan.

---

## Wat ik controleer bij elke upload

- Nino gelijk aan de referentie: gezicht, haar, helm met bril, sjaal, kleding, rode scooter
- Echte transparantie (geen nep-dambord), geen afgesneden ledematen of wielen
- Geen tekst of logo's, behalve "France" op 6 en 9a, correct gespeld
- Formaat en marge; leesbaar op klein formaat (iconen, baksels)
- Serie-consistentie: zelfde licht, schaal en camera binnen 7a–7h

Afgekeurd → ik zeg kort wat er mis is en geef een correctieprompt.

## Hoe het in de repo komt

```
assets/art/
├── universal/
│   ├── nino/        nino-welkom.webp, nino-wijst.webp, …
│   ├── vespa/       vespa-zij.webp, vespa-icoon.webp, …
│   └── paspoort/    paspoort-cover.webp, paspoort-binnen.webp
└── fr/
    ├── hero/        fr-hero.webp
    ├── rewards/     doos-leeg.webp, doos-vol.webp, croissant.webp, doos-goud.webp, …
    ├── stempels/    fr-land.webp, fr-gold.webp, fr-parijs.webp, …
    └── tegels/      fr-h0-welkom.webp … fr-h6-finale.webp
```

- WebP, uitsneden op ware grootte (Nino ~600 px hoog, baksels 256 px, stempels 512 px, hero 1680×560), plus een lijst met bron en prompt per asset (`assets/art/CREDITS.md`).
- Originele PNG's (ongeschaald, met alfa) als master in `assets/art/masters/`, zelfde naam als de WebP.
- Bestaande Italië-art blijft in `output/art/` totdat het platform de nieuwe map gebruikt.
