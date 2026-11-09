# Onafhankelijke kaart-QA — Reis v3b

**Eindoordeel: REWORK (visuele mobiele kaart), programmatische brongeometrie PASS.**

Getest: commit `afb32d17293a4705c5690e985d8cd2ef7c2e6ae7`; preview SHA256 `35a0c4696f42abe7555bcb4452540598c493812abc783412b78b9d06ac6a610d`. Checkout vóór/na schoon; kandidaat, git en publicatie ongewijzigd. Alle eigen bestanden staan uitsluitend in deze map.

## Uitgevoerde onafhankelijke dekking

Eigen Playwright-scripts op de daadwerkelijke `file://` preview, geen builder-harness. Chromium **156.0.8078.4** en WebKit **27.2**, headless macOS, DPR1. Formaten 1440×900, 820×1180, 390×844. Elf hoofdstukken via echte hoofdstukknoppen, beide stijlen via echte knoppen: **132/132 records**, zes batchbestanden van 22. Aanvullend 30 contextmetingen. Screenshots zijn echte rendereruitvoer; geselecteerde beelden zijn visueel bekeken.

**Let op Chrome:** dit is de gebundelde Chromium-engine, niet de geïnstalleerde branded Google Chrome. Die laatste is aanwezig maar niet uitgevoerd. Een aanvullende scriptvoorbereiding via execute_code werd door consent-timeout geblokkeerd; die handeling is niet omzeild. Daarom branded Chrome = **BLOCKED / niet uitgevoerd**, niet stilzwijgend PASS. WebKit is geen native Safari of fysiek iPad-bewijs.

## Oordeel per punt

### PASS — brongeometrie, coördinaten en lokale transforms

Alle 131 opgenomen SVG-elementrecords behouden dezelfde geometrie-attributen en ancestor-transforms als de live bronkaart; vergelijking met daadwerkelijk geopende root `index.html` is ook exact in beide engines. In alle 132 matrixrecords blijft die vergelijking gelijk. Dit omvat paden, puntcentra, meren en context. Geen verplaatsing van Rome/Vaticaan, San Marino, eilanden of Apennijnen aangetroffen. ViewBox/framing verandert wel per hoofdstuk; dat is camera, geen verplaatsing.

Dit is **interne bronintegriteit**, geen opnieuw gehaalde onafhankelijke GIS-validatie. Geen externe geografische bronnen opgehaald of verzonnen. Apennijnen/Dolomieten blijven volgens MAP_SYSTEM schematische onderwijszones, geen exacte berggrenzen.

### PASS — juiste hoofdstuk-highlights als ID-verzameling

Alle elf `ROUTE_CHAPTERS.itemIds`-sets komen exact overeen met de unieke `.v3Hit[data-id]`-sets op alle drie formaten en beide stijlen, in beide engines: 132/132. Zie `matrix.json`, zes `*-batch.json` en `summary.json`.

Precisering: de bron bevat **46 data-id-elementen voor 45 unieke items**, omdat San Marino ook een aparte hitcirkel heeft. Landen heeft daarom acht gemarkeerde DOM-elementen voor zeven geselecteerde IDs, met `area-n` tweemaal. Dit is geen achtste leeritem en geen extra keyboard/a11y-stop.

### REWORK — “alleen verf anders” is te sterk; rendergeometrie en hitlaag veranderen

De bronattributen blijven exact, maar CSS verandert de **gerenderde radius**: geselecteerde cirkels `r:8px`, overige steden `r:3px` (reis.css regels 73–75). Voorbeeld Rome bron `r=6.3`, on geselecteerd berekend `3px`; Vaticaan bron `2.7`, geselecteerd `8px`. Dit is symbolische markering, geen verplaatste geografische positie, maar niet uitsluitend kleur/stijl in de strikte betekenis “gelijke zichtbare geometrie”.

In Landen wordt bovendien de oorspronkelijk transparante extra San-Marino-hitcirkel zichtbaar geverfd: berekend `fill rgb(185,80,47)`, fill-opacity `.55`, `r:8px`, dezelfde bronpositie als de echte markering. Deze extra cirkel houdt `pointer-events:all` uit bestaande styling, ondanks de declaratie die de kloon pointer-neutraal wil maken. De twee cirkels vallen samen. Geen extra klikactie of leerregressie vastgesteld; wel een aantoonbare lek van selectiegeometrie naar presentatie. Bewijs: `matrix.json`, Landen/desktop records, tweemaal `area-n`.

### PASS / REWORK afhankelijk van betekenis — geen namen

**PASS: geen namen van de 45 leerdoelen** in de kloon en de dynamische nameLayer is leeg. Geen Rome/Vaticaan/San-Marino-antwoordnamen toegevoegd.

**REWORK bij letterlijk “geen namen”:** vaste kaarttekst blijft aanwezig en deels zichtbaar: `I T A L I Ë`, DUITSLAND, TSJECHIË, SLOWAKIJE, HONGARIJE, BOSNIË, TUNESIË. Reis.js verwijdert nameLayer en `.nameLabel`, niet `.mapLabel/.contextLabel`. Repro: open preview, kies willekeurig hoofdstuk; inspecteer `.v3Map text` of desktop Landen-screenshot. Deze contextnamen zijn geen nieuwe gelekte geselecteerde leerantwoorden; eigenaar moet de bedoelde naamloosheidsgrens expliciet houden.

### PASS — geen keyboard- of accessibility-duplicaten

Alle 132 records: nul focusbare/tabindex-elementen in de kloon, nul descendants met aria-label/role, geen dubbele document-IDs. SVG-root is `aria-hidden=true`, `focusable=false`; zijn oude aria-label blijft technisch aanwezig maar wordt door aria-hidden niet als tweede kaart aangekondigd. Geen a11y-conformiteitsclaim of VoiceOver-praktijktest. Echte URL/href-fragmentreferenties zijn intact in de 30 aanvullende contextmetingen. De eerste ruwe summary heeft twee vals-positieve “brokenRefs” (`8cc9d8`, `398ea9`): dat zijn stop-color hexwaarden, geen verwijzingen; de gerichte controle in `context-results.json` corrigeert dit expliciet naar nul.

### PASS — Reliëf-knop in de daadwerkelijke DOM en rendering

132/132 stijlmetingen: terrein display `none` bij Schoolkaart, `block` / opacity `.96` bij Reliëf. Highlights en brongeometrie blijven gelijk. Screenshot `chromium-desktop-mountains-relief.png` toont werkelijk getekend reliëf, niet alleen gewijzigde buttonstate. Geen pageerrors in beide engines.

### REWORK — Siciliaanse vorm wordt op telefoon door stijlkeuze bedekt

**Nieuwe concrete bevinding, los van reeds bekende framing/edgefade-keuze.**

Repro in beide engines: preview op **390×844** → hoofdstuk **Eilanden** → Schoolkaart (ook de knoppen blijven in dezelfde onderste kaartpositie bij Reliëf). De absolute `.v3Switch` ligt over Sicilië en bedekt het centrum en een groot deel van de vorm. De overlap tussen switchrect en Sicilië-boundingrect is Chromium **1486.63 CSS px²**, WebKit **1486.15 CSS px²**, en `switchCoversCenter=true`. Een boundingrect-overlap alleen zou onvoldoende zijn; de screenshot laat daadwerkelijk bedekte eilandvorm zien.

Bewijs: `webkit-phone-islands-school.png`, `chromium-phone-islands-school.png`, beide `*-phone-islands-full.png`, `context-results.json`. Dit maakt het centrale geselecteerde eiland niet goed herkenbaar. Op desktop/tablet geen overeenkomstige switch-overlap met geselecteerde eilanden gemeten. Zeeën heeft op telefoon ook boundingrect-overlap met `water-E`, maar zonder afzonderlijke paint-maskbewijs geen tweede harde defectclaim.

### PASS bronpositie / beperkte visuele acceptatie — microstaten en bergen

- **San Marino**: exact behouden centrum `(458.8,447.67)`, zichtbaar binnen het vasteland op desktop Landen, niet in zee verplaatst. Zie `chromium-desktop-countries-school.png`.
- **Rome/Vaticaan**: exacte nabije centra behouden: Rome `(460.97,604.61)`, Vaticaan `(459.44,604.2)`. Hun schermcentra liggen in Landen slechts **0.897 CSS px** uiteen op desktop, **0.414 CSS px** op telefoon. Ze zijn in dit overzicht dus niet als twee losse plaatsmarkeringen herkenbaar. Dit is een natuurlijke schaal-/symbolisatielimiet, geen aangetoonde geografische verplaatsing. Geen chooser/lesacceptatie getest; valt buiten deze Reis-kloon.
- **Apennijnen**: volledige bruine schematische zone zichtbaar langs de Italiaanse rug in desktop Bergen, school én reliëf, zonder verplaatste bronpath. Dolomietenzone ook zichtbaar. Zie `webkit-desktop-mountains-school.png` en `chromium-desktop-mountains-relief.png`.
- **Eilanden**: bronpaden intact; desktop Sicilië/Sardinië herkenbaar, telefoon Sicilië afgedekt zoals hierboven. Corsica/context behouden, maar minder nadrukkelijk.

### OPEN EIGENAARSBESLUIT — groter kader / minder edgefade (geen nieuwe bug)

De radiale maskering blijft over de **gehele SVG** lopen, dus ook over geselecteerde landen/zeeën en context. Desktop Landen laat Frankrijk links gedeeltelijk verdwijnen; verre contexttekst en kustlijnen vervagen. Op telefoon beperken klein kader en fade de herkenning van omgeving/zeeën/eilandrelaties verder. Dat is precies het reeds bekende eigenaarsbesluit: hier niet nogmaals als nieuw defect geteld. Risico: correcte brongeometrie blijft aanwezig terwijl relevante zichtbare context niet leesbaar is. Programmeerbare bronchecks kunnen dit niet goedkeuren namens de eigenaar.

## Resterende echte platformgrenzen

**BLOCKED / niet getest:** branded Google Chrome; native Safari; fysiek iPad/iPhone, echt touch, OS-toetsenbord, VoiceOver. De headless emulatie is geen echte hardwareacceptatie. Parent voert builds/maintained harness/layout/a11y uit; deze kaartaudit claimt die gates niet.

## Bewijs en herhalen

- `driver.mjs`: eigen 132-cellenmatrix; run met `npx --yes --package=node@24.15.0 -c 'node driver.mjs'` vanuit deze map.
- `context-probe.mjs`: root-bronvergelijking en 30 context-/occlusiemetingen; gelijksoortig uitvoeren.
- `matrix.json`, zes `*-batch.json`, `summary.json`, `context-results.json`, beide `*-source-and-clone.json`, beide `*-errors.json`.
- `inspect.mjs` / `inspect.json`: eerste broninspectie; PNG-bestanden in dezelfde map zijn daadwerkelijke browserbeelden.

Geen kandidaatbestanden gewijzigd; hash en schone git-status na uitvoering opnieuw vastgesteld.
