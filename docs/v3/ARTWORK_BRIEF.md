# V3 — Artworkbrief: renderniveau

**Doel:** TOPO V3 op het niveau van de conceptrenders van de eigenaar (9 november 2026): een rustige app die zweeft boven een Italiaans landschap, met een levende reliëfkaart, rijke hoofdstukbeelden, Nino als portret en kleine kleurrijke iconen. Besluit: `DECISIONS.md` 2026-11-09 › Renderniveau.

**Vaste regels**
- Vaste Nino-kenmerken: gezicht, groene helm met bril, rode sjaal, blauw bovenstuk, rugzak, rode Vespa. Snit van shirt of jasje mag per scène variëren; het portret is exact canoniek (gesloten blauw werkshirt).
- Bronresolutie van de beeldgenerator (±1586 px breed) is geaccepteerd; budgetten in KiB.
- De kaart blijft echte geografie: reliëf uit gemeten hoogtedata, nooit een gegenereerd beeld als kaart. Geen genummerde pins op de kaart.
- Nino komt alleen vanaf de canonieke referenties (`assets/nino/exports/nino-*.webp`, `assets/nino/references/`). Elk nieuw Nino-beeld wordt naast de referentie gelegd en apart goedgekeurd: gezicht, haar, helm met bril, rode sjaal, blauw shirt, rugzak.
- Stijl: de #75-hoofdstukscènes zijn de stijlreferentie (warm, helder, zacht licht, 3D-geschilderd).
- Geen tekst in beelden, behalve bestaande borden in de #75-scènes.
- Levering: masters als PNG; runtime-exports als WebP met vaste maten en SHA256; elk beeld met bron, maker en datum in een manifest. Status per beeld: concept → eigenaar akkoord → Hermes QA → ingebouwd.

## 1. Achtergronden zonder Nino (nieuw)

| ID | Onderwerp | Maat master / export | Budget | Gebruik |
| --- | --- | --- | --- | --- |
| BG-01 | Toscaanse heuvels met cipressen en dorp, gouden uur | 3840×2400 / 2880×1800 | ≤ 450 KB | standaard achter de app |
| BG-02 | Meer met bergen en een dorp aan het water (Como/Garda-sfeer) | idem | ≤ 450 KB | alternatief, ochtend |
| BG-03 | Kust met citroenbomen en zee (Amalfi-sfeer) | idem | ≤ 450 KB | alternatief, middag |

Midden rustig en laag in contrast (daar staat het venster); interesse aan de randen. Geen Nino, geen tekst, geen herkenbare echte gebouwen als hoofdonderwerp.

## 2. Hoofdstukbeelden

| Hoofdstuk | Bron |
| --- | --- |
| Steden 1–6 | #75 `topo-steden-firenze` |
| Steden 7–12 | **nieuw** — Roma (stad) |
| Extra steden 13–18 | **nieuw** — Venezia (kanaal) |
| Extra steden 19–23 | **nieuw** — Napoli met Vesuvius op de achtergrond |
| Eilanden | #75 `topo-eilanden-v2` |
| Bergen | #75 `topo-bergen-dolomieten` |
| Vulkanen | #75 `topo-vulkanen-etna` |
| Streken | #75 `topo-streken-toscana` |
| Landen | #75 `topo-landen-italie-slovenie` |
| Zeeën | #75 `topo-zeeen-amalfi` |
| Rivieren | #75 `topo-rivieren-po` |

Nieuwe scènes: 1672×941 zoals de #75-scènes, Nino met Vespa in dezelfde stijl en compositie. Exports per scène: **kop** 1672×941 WebP (≤ 400 KB) en **miniatuur** 480×270, uitgesneden op het landschap zonder Nino (≤ 40 KB).

## 3. Nino-portret (nieuw)

Hoofd-en-schouderportret (borst mag), kijkt de kijker aan, vriendelijke glimlach, helm met bril op het hoofd, rode sjaal. Transparante achtergrond. Master 2048×2048, export 512×512 WebP (≤ 120 KB). Varianten later: blij (goed antwoord), denkend (lege staat).

## 4. Iconen (nieuw)

Kleine, kleurrijke 3D-iconen in de stijl van de renders: zacht licht, geen omtreklijn, transparant, leesbaar op 24 px.

| ID | Onderwerp |
| --- | --- |
| IC-pizza | pizzapunt (margherita) |
| IC-vespa | rode Vespa, zijaanzicht, zonder Nino |
| IC-gold | gouden zegel of ster |
| IC-stamp | stempel |
| IC-postcard | postkaart |
| IC-done | groen vinkje (alleen als de systeemversie niet volstaat) |

Master 1024×1024 PNG; exports 96×96 en 48×48 WebP. Plus **VE-01**: grote losse rode Vespa voor Beloningen, 1200×900, transparant.

Navigatie blijft bij de bestaande lijniconen.

## 5. Kaart (geen artwork, wel stijl)

Codex-spoor `v3/relief-z8`: dezelfde gemeten hoogtedata met het renderpalet. Groen laagland, geel-oker heuvels, bruin gebergte, wit boven circa 2500 m. Sterke hillshade, helderblauwe zee met een lichtere kustzone, een witte kustrand van 1,5 px en een zachte schaduw onder het land. Geregistreerd op exact het 890×1235-frame.

## Volgorde

1. **Stijlbeeld** (Claude Code) — gebouwd en door de eigenaar akkoord bevonden op 9-11, accent Italia ([bewijs](../qa/v3-stijlbeeld/README.md)) met wat er is: de #75-scènes, het V2-panorama als tijdelijke achtergrond en het reliëf in renderkleuren. Italia en Viola naast elkaar. → eigenaar beoordeelt.
2. Na akkoord: eerst Codex `v3/relief-z8` en BG-01 (grootste winst), daarna 3 nieuwe scènes, het portret, de iconen en VE-01.
3. Hermes: QA van de #75-scènes en alle nieuwe exports (maat, bytes, alfa, modelconsistentie van Nino).
