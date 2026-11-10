# Ontwerpaudit V3.0 tegen de conceptrenders

Datum: 10 november 2026. Pin: `0247589`. Benchmark: de conceptrenders van de eigenaar (`docs/qa/v3-stijlbeeld/vergelijking-r1*`, `vergelijking-r5*`). Feedback van de eigenaar staat in `DESIGN_FEEDBACK.md`.

## Oordeel

Functioneel is V3.0 sterk. Visueel haalt het de renders niet. Alleen Reis komt in de buurt; Oefenen, Toets, Voortgang en Beloningen zijn formulieren op een witte plaat. Dit is een **incident**: de correctie "de app zweeft boven het landschap" (9 november) komt voor de tweede keer terug.

**Oorzaak:**
- Alleen Reis had een render als doel; de andere schermen zijn gebouwd vanaf een functionele specificatie.
- De shell is één grote, ondoorzichtige kaart die het artwork bedekt. In de renders ís het artwork het canvas en zweven er losse panelen boven.
- Het QA-bewijs controleerde lay-out en gedrag, maar niet de gelijkenis met een doelbeeld.

## Verschillen met de renders

| Onderdeel | Render | Nu |
| --- | --- | --- |
| Canvas | Artwork overal zichtbaar; de app bestaat uit losse zwevende eilanden | Eén witte plaat van 1392 px die het artwork bedekt; buiten Reis is de achtergrond nauwelijks te zien |
| Panelen | Glas: doorschijnend, blur, zachte schaduw, radius ±24 | Ondoorzichtig wit, dunne rand, plat |
| Kaart | Zweeft vrij over het landschap, zonder kader, met schaduw; levend reliëf, scherpe kust, genummerde pins per hoofdstuk | Rechthoek met mistige rand; het reliëf ligt onder een witte waas; kleine rode punten |
| Typografie | Groot, zwaar en rond: woordmerk TOPO, display ±44/800, rij-titels 17/700 | Systeemfont, middelzwaar; koppen klein voor het formaat; het woordmerk is zwak |
| Knoppen | Pil met icoon en pijl, verloop, zachte gloed | Vlakke rechthoek; secundaire knoppen als grijze omlijning |
| Lijst | Rijen als eigen kaartjes met grote beelden, voortgangsstaaf en status-iconen (pizza, Vespa, vinkje, chevron) | Compacte tabel met kleine beelden en een klein slotje |
| Kleur | Violet primair, lavendel selectie; warm-pastel landschap | Terracotta voelt zwaar en "baksteen"; groen-zwarte chips (Oefenen, Toets) passen nergens bij |
| Les | De kaart op de voorgrond boven het artwork | Volledig scherm met een beige focusmodus en de V2-zoombalk; geen artwork |
| Schoolkaart | Buurlanden in landkleur | Buurlanden deels in zeekleur: dat is een fout, het referentiekader gaat verloren |

## Per scherm

- **Reis:** het dichtst bij de render. Nog nodig: het canvas vrijmaken, de lijst als zwevend glaspaneel, de kaart zonder mist, genummerde hoofdstukpins, zwaardere typografie en pilknoppen.
- **Les:** in de V3-shell over het artwork, met de kaart als zwevend object. Geen beige focusvlak. Zoombediening als compacte glasgroep in de kaarthoek. Vraag en pizza in één glaspaneel.
- **Oefenen:** nu een instellingenformulier. Moet worden: de kaart als hoofdbeeld, met de gekozen groep oplichtend. Vorm als vier grote tegels met beeld. Groep als chips op glas. Eén pilknop Start.
- **Toets:** zelfde opbouw als Oefenen, maar rustiger. Het resultaat is inhoudelijk goed; het moet op glas boven het artwork, met de kaart zonder kader.
- **Beloningen:** artwork als achtergrond. Geen aparte knop "Open Reisboekje": het boek zelf is de knop. Pizza's als rij boven de Vespa. Tellers als echte iconen met display-cijfers, niet als kleine labels. Op de eerste pagina van het boek staat het artwork niet goed uitgelijnd.
- **Voortgang:** artwork als achtergrond, panelen op glas. De hoofdstukken met grote beelden zoals in de Reis-render, met een staaf en een status-icoon in plaats van ✓ en ★ als tekst.
- **Kennismaking:** het sterkste nieuwe scherm. Nog: het dubbele label weg.

## Reliëf: waarom het mistig is

Dat moet Claude Code nog met de DOM bevestigen. Waarschijnlijke oorzaken, in deze volgorde:
1. de randmasker-fade van de kaart (`mask-image`);
2. een witte of doorschijnende laag van de V2-schoolkaart boven `.atlasTerrain`;
3. verlaagde opacity of saturatie van de reliëflaag.

Doel: het reliëf op volle kracht, met een scherpe kustlijn. Het referentiekader (buurlanden en zeeën) blijft zichtbaar zonder wazige rand: de kaart eindigt in een zachte schaduw, niet in mist.

## Kleur: advies

Violet (`viola`) wordt het basisthema; Italië wordt het accent. Redenen:
- violet past bij Linear en Apple en draagt glas en pastel;
- terracotta op terracotta-artwork verdwijnt of wordt zwaar;
- landthema's verschuiven dan naar artwork en een klein landaccent (driekleur, stempels), niet naar een andere primaire kleur.

Dat is ook eenvoudiger: één UI-palet, met het land in het beeld. **Besluit van de eigenaar nodig.**

## Werkwijze vanaf nu

1. **Eerst een render per scherm.** Les, Oefenen, Toets (instellen en resultaat), Beloningen en Voortgang krijgen elk een conceptrender in de stijl van de benchmark. De eigenaar keurt die goed voordat er gebouwd wordt.
2. **Een gedeelde visuele laag**, gebouwd vóór de schermen: canvas, glaspaneel, typografische schaal, pilknop, chip, rij en zwevende kaart. Als tokens en klassen in `tokens.css` en `shell.css`.
3. **Een vergelijkingscheck per scherm.** De render en de build komen naast elkaar, zoals `vergelijking-r5`, in `docs/qa/v3-stijlbeeld/`. Een scherm is pas klaar als de eigenaar die vergelijking goedkeurt.
4. **Nieuwe QA-checks:**
   - de achtergrond is zichtbaar op ≥ 30% van de viewport (desktop en iPad);
   - geen ondoorzichtig paneel breder dan 70% van de viewport;
   - op de kaart geen rand-opacity onder 0,85 binnen 24 px van de kaartrand.
