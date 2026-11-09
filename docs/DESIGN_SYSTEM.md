# Design system V3 (voorstel, 9 november 2026)

## Principe (eigenaar, letterlijk)

> I want this to be as perfect as Linear's website or Apple Notes: simple purpose, simple architecture, simple design, simple implementation. Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout. Every decision should elevate the user experience (UX), developer experience (DX) and agent experience (AX) at once, without breaking anything.

Productrichting: een reis door Italië waarin je topografie leert. Rust van Apple Notes, precisie van Linear, onmiskenbaar Nino's Italië, de kaart eerst. Ook vastgelegd in issue #76 (Product principle).

## Structuur
- **Eén vaste opbouw** op groot scherm: zijbalk (merk, Nino, navigatie, instellingen) · lijst (hoofdstukken) · inhoud (tellers, kaart, titel, één actie).
- **iPad liggend en kleine desktop (< 1280 px):** zijbalk met alleen iconen; labels blijven voor schermlezers.
- **iPad staand (< 1024 px):** titel en actie boven de kaart.
- **Venster (stijlbeeld, ≥ 768 px):** de app zweeft als matglas (80% oppervlak, blur 26, hoeken 24, zachte schaduw, 24 px rondom) boven een landschap: BG-01 (Toscane); BG-02/BG-03 alleen als alternatief in de preview. Elke hoofdstukrij heeft een miniatuur (scène zonder Nino); de gekozen scène staat als kop (16:9) boven de titel, niet op telefoon. Bij verminderde transparantie is het venster ondoorzichtig.
- **Beloningen (V3-laag):** vanuit de zijbalk (Reis en les). Reisboekje (omslag + **Open Reisboekje**, de enige hoofdactie) · Vespa-ritten (VE-01, teller, 3 pizza's tot de volgende rit) · vier tegels: pizza (IC-pizza, stukjes / 8), stempels, goud en postkaarten. Alle getallen komen uit V2; het boek opent het V2-Reisboekje.
- **Telefoon (< 768 px):** één kolom (tellers, titel, actie, kaart, lijst) met een tabbalk onderaan.
- **Getallen in plaats van zinnen:** "3 / 11", "14 / 24". Geen taglines, hulpteksten of bijlabels. Uitzondering: een reden die de leerling anders niet ziet ("Opent na Bergen").
- **Eén duidelijke hoofdactie, waar een handeling nodig is.** Bij Aanwijzen is de kaart zelf de handeling.

## Kaart
- Altijd de echte geometrie: in Reis een kopie van de live kaart, met gelijke paden (gecontroleerd: 46/46), zonder namen en zonder interactie.
- De plekken van het gekozen hoofdstuk dragen het accent; de rest treedt terug.
- **Referentiekader:** het kader toont wat om Italië heen ligt (buurlanden, zeeën, Corsica, Noord-Afrika). Kader = Italië en de hoofdstukplekken + 14% marge, verruimd tot de vorm van het kaartvlak binnen het canvas (890 × 1235). Echte zee, alleen een smalle randfade (4%), geen radiale vervaging. Gecontroleerd door `mapFrameShort`.
- **Stijlbeeld (9 november, eigenaar open):** in Reis staat **Reliëf** standaard aan: het gemeten z8-reliëf in het renderpalet (Codex), met de lagen zee → landschaduw → reliëf → witte kustrand (1,5 px). Buurlanden zijn gedempt, de zee loopt zacht (halve sterkte, brede kustgloed). Kaartlabels zijn alleen contextnamen, nooit een van de 45 leerplek-namen (check). De lessen houden hun eigen kaart.
- **Schoolkaart** is de lesvorm. **Reliëf** is een schakelaar met een leerfunctie (Bergen, Vulkanen, Apennijnen, Povlakte). Het reliëf komt uit gemeten hoogtedata, geregistreerd op hetzelfde frame (zie DISCOVERY_MAP.md). Nooit AI-beeld als kaart.

## Les (Golden Experience 01, beat 3–7)
- **Opbouw desktop:** zijbalk (Reis actief) · lesstappen boven de kaart · kaart · taakpaneel rechts (vraag, invoer, feedback, één hoofdactie, pizzameter onderaan).
- **iPad en telefoon:** Focus Mode blijft eigenaar. V3 zet een vaste lesbalk bovenaan (‹ Reis · stappen · teller; Menu als ☰); de kaart en de Focus-sheet schuiven eronder. Geen tabbalk tijdens een les.
- **Lesstappen** (PR #64): `1 Ontdekken · 2 Aanwijzen · 3 Namen schrijven`, ★ Goud apart. Nu = accent + `aria-current="step"`, klaar = ✓ (herhaalbaar), later = grijs en uit. < 1024 px alleen de naam van de huidige stap; < 768 px geen titel en geen Goud; < 360 px alleen nummers.
- **Eén hoofdactie per moment:** Volgende · de kaart · Controleer · Volgende · Bekijk in Reisboekje. Na een antwoord wordt Controleer stil.
- **Feedback** is de V2-zin: goed groen met ✓, fout rustig rood. Beloningen zijn alleen de V2-momenten (pizza, Vespa-rit, stempel); V3 voegt geen teller of regel toe.
- **Focus verandert nooit de maat.** Een `:focus`-regel mag alleen ring of kleur zetten, geen font, padding of hoogte; anders schuift de knop onder de vinger weg (gevonden op het afrondscherm). Check `bookTapLandsOnButton`.

## Tokens (`scripts/v3/tokens.css`, binnen `.v3` en `body.v3Les`)
| Groep | Waarde |
| --- | --- |
| Type | platformfont; 34/41 · 22/28 · 17/22 · 15/20 · 13/18 |
| Ruimte | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 |
| Radius | knop 12 (besluit 7 november) · kaart 16 · schil 24 |
| Neutraal | canvas `#f4f1ea`, oppervlak `#fffdf9`, inkt `#1d2523`, secundair `#66706d`, lijn 9% inkt |
| Status | klaar `#2f9a5b` met ✓ · goud alleen voor Gold, met zegel · op slot grijs met slot-icoon |
| Focus | 3 px `#1d6fd8` |
| Geografie | kaartkleuren blijven buiten de tokens (vergrendeld) |

## Landthema's
Structuur, type en neutralen zijn voor elk land gelijk. Een thema zet alleen accent, zacht accent en vlagstreep (`data-theme`).

| Thema | Accent | Status |
| --- | --- | --- |
| `italia` (standaard) | terracotta `#b9502f`, vlag groen-wit-rood | voorstel |
| `viola` | paars `#5b45e0` (uit de concepten) | ter vergelijking |

Een nieuw land is een nieuw tokenblok, geen nieuwe component.

## Beweging
Alleen om een verandering uit te leggen. Bij verminderde beweging gaat decoratieve en overgangsbeweging uit; functionele feedback blijft zichtbaar.

## Beeld
Alleen canonieke artwork, per doel gebruikt. Nino in de zijbalk is NINO-PORTRET (render-assets; vroeger de `guide`-uitsnede). Iconen: IC-slice bij de pizzateller, IC-vespa bij de ritten, IC-pizza/stamp/gold/postcard in Beloningen. Elk ingebed beeld wordt bij de build tegen de SHA256 uit zijn manifest gecontroleerd. Conceptrenders zijn richting, geen assets.

## Anti-patronen (bij elke review)
Too much · Too little · Boxed · Flat · Bland · Off-model Nino · Invented geography. Toegankelijkheid en pedagogiek zijn aparte toetsen.

---

# Historisch: V1/V2 (hieronder, ongewijzigd)

# Design system: current and target

Current CSS lives inline in `index.html`: system UI font, large compact headings, warm paper background `#f5f2e9`, sea `#c8e2ed`, surrounding land `#dce4cf`, Italy `#efcd93`, rust cities `#a44336`, teal accent `#087887`, white cards. Selected state is orange; feedback green for correct and pale red for wrong. Tabs include five text buttons; the map and learning panel form two columns on desktop and one column below 950 px. The first city group has six names. Progress header shows good/streak/pizzas; reset is text-button plus confirmation. All styles are current implementation, not an approved external brand system.

**Target principles (ACTIVE):** friendly, contemporary, calm and polished; playful enough for a child, without cartoons competing with geography. Give map and labels visual priority. Keep categories differentiated but limit competing colors; text and controls readable on mobile. Never conceal map details with effects or oversized zones. Maintain high contrast for labels and feedback; indicate state with words and shapes in addition to color. Quiz targets should work with keyboard focus and touch; selected feature and answer must be perceivable. Keep tap tolerances physically generous without visibly growing countries or microstates. Check SVG scaling at phone, tablet and desktop widths.

Use consistent spacing (existing ~8–24 px rhythm), clear prompt hierarchy, an obvious next action, visible mistakes/progress, accessible confirmation text and short localized Dutch feedback. Vespa/pizza celebration is 1.4 seconds, nonblocking and suppressed by `prefers-reduced-motion`; keep that behavior. Avoid dashboards, heavy gradients, unrelated navigation, and permanent motion. No new brand font or complex illustration set is selected.

**Current microstate interaction:** Vatican is a very small point near Rome. The shared invisible target opens an inset with separate Rome and Vaticaanstad buttons on hover/focus/tap; both retain separate answer IDs. A real touch-device and keyboard audit is still required. The lens illustration is schematic, while the visible map point stays in its mapped location.

## Guided route visual behavior (2026-09-28)

The route uses a separate light paper screen so eleven stops and their locked successors are understandable at a glance. A gentle staggered path alternates stop cards; green marks the next actionable phase, checked stages stay clickable, gray locked phases are disabled with a lock icon, and a golden star denotes the optional mastery challenge. The worksheet map returns as the lesson surface. Navigation remains accessible above both screens and horizontally scrolls on narrow phones. The pizza disk shows slices and the scooter marks the next Italian stop; small positive motion appears only on an earned trip. Topo keeps its warm map palette, typography and distinct Vespa/pizza identity rather than reusing Duolingo mascot or currency imagery. Validate real touch layout before claiming phone readiness.

**Original artwork (2026-09-28; scenic header superseded):** A bright, tactile animated coastal-village scene with the original character Nino and his red scooter now leads the route hero. Every one of the eight pizza wedges lights up as a slice is earned. Each chapter badge depicts its category (city, islands, mountains, volcanoes, regions, countries, seas or rivers); every phase has an eye, location pin, pencil or code card icon, with a check for replayable stages and a lock for future stages. Phase icons and pizza segments remain inline SVG, with words alongside icons; Nino appears at the current stop, beside guided and free lessons, and at Vespa milestones. The panoramic WebP and transparent character WebP reside in `output/art/` and are embedded in the self-contained HTML, requiring no network request. Neither overlays the learning map. The preceding dusk-green vector panorama was removed. Keep contrast, focus indication and reduced-motion support.

**Current palette:** coastal blue-teal for the next action, terracotta for the active stop and scooter, pale warm paper for surfaces, sunflower yellow for gold, and neutral gray for locked lessons. Preserve the source map’s separate geographic sea/land colors. Nino provides continuity without adding a game-like currency or animation while answering.
