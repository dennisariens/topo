# Overdracht — voorbereiding V3-runtime

**Code- en bewijscommit:** `4c14824c832e124abdf084d80f932fc327aa85a5` ([GitHub](https://github.com/dennisariens/topo/commit/4c14824c832e124abdf084d80f932fc327aa85a5)). Deze overdracht is een daaropvolgende documentatiecommit op `arch/v3-runtime`.

**Basis:** nieuwste opgehaalde `codex/topo-v3` bij start, `68bb5ae9a8f195898fee49445c6151b5c2518b48`. De visuele branch ontwikkelt parallel verder; deze audit blijft bewust op die pin staan. Geen merge/rebase van lopend visueel werk, deploy of publicatie/release. Alleen deze voorbereidingsbranch wordt gepusht.

## Levering en controles

- [Architectuurvoorstel](../../v3/ARCHITECTUUR.md): compact, twee logische pagina’s (835 woorden), modulegrenzen, herkomst van V2-code, verdwijnende DOM/chrome, offline build, kleine migratiestappen en meetbare risico’s.
- [Karakterisering](../../../tests/characterization/README.md): 22 tests via de echte globals, vaste UTC-klok en seed, echte V3-modules; geen demo-state of nieuwe runtime.
- `npm run test:characterization`: 22/22 groen. Twee extra TAP-runs hebben dezelfde 22 groene uitkomsten; een test vergelijkt toetsvolgorde, modes, resultaat en opgeslagen voortgang tussen twee geïsoleerde starts exact.
- `npm run lint`, volledige `npm test` en `npm run build`: exit 0. Node 26.7.0, bestaande dependencies en lockfile. [Verificatie](verification.txt), [TAP 1](characterization-run-1.tap), [TAP 2](characterization-run-2.tap), [npm-script](npm-characterization.log), [lint](lint.log), [regressies](regression.log), [build](build.log).
- Onafhankelijke read-only review van testdekking, harnas en ontwerp: geen blokkades; ook de extra prompt-/zichtbaarheids-/slotjesasserties beoordeeld.
- `index.html` blijft SHA256 `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a`. Bestaande `scripts/v3/` en `docs/v3/` zijn byte-gelijk aan de basis. Alleen de gevraagde nieuwe `docs/v3/ARCHITECTUUR.md` is daar toegevoegd.

## Wat vastligt

| Gebied | Getest contract |
| --- | --- |
| Data/beoordeling | Alle 45 IDs, namen, codes, groepen en geografie tegen MAP_SYSTEM-manifesten; 11 hoofdstukken; aliassen/normalisatie en afwijzing van foutspelling/codes; 22 CSS px tolerantie op zoom/pan en onveranderd 44 px rivierhitpad. |
| Leren/belonen | Alle drie stappen per hoofdstuk, slotjes, gespreid terugkerende fouten, stage-/goudreplay en tokenledger, foutloos goud/behoud, pauze na zes vragen, answered reload, 1/3/7/14-dagenplanning, smart pool, 8 punten/pizza en 3 pizza’s/rit. |
| Toets | Echte 7/10 met fouten/overslaan, 80-tekengrens, gedeelde clipboard/mailtekst, fouten oefenen; dagdoel telt, `good`/pizza/rit/goud veranderen niet, ook bij de 24e-puntgrens. |
| Opslag | Progress schema 3, route 1→2, profiel schema 1, envelope versie 1; legacy-meter; uitslagen schema 1 onder `topo-v3-toetsen-v1`, maximaal tien nieuwste eerst. Echte Blob-export en import V3→V2→V3 én V3→V3, oude kopie zonder `v3Toetsen`, ongeldige extra’s/progress, quota/rollback, beide resets. |
| Continuïteit/presentatie | Reis→Verder en Oefenen→Reis→Oefenen: dezelfde zichtbare vraag, tekst, selectie en save; V2-kennis-paspoort en V3-beheerst-drempel (beide streaks ≥3, due strikt in de toekomst), boek/schoolblad, schoolbladblokkade toets/goud, kennismaking/eenmalig heraanbod. |

De exacte scenario’s en bronorakels staan bij de tests; geen tweede kaartdataset of beoordelaar. Een toekomstige runtime krijgt een andere bootadapter tegen dezelfde verwachtingen. De vaste index-hash blijft de referentie bewaken, niet de nieuwe kandidaat verbieden.

## Grenzen en open vragen

1. **Bevestigd bestaand defect — import annuleren:** `scripts/v3/toets.js` gebruikt de tekst van `#backupStatus` als bewijs van een geslaagde import. Na een eerdere succesvolle import kan een geannuleerde nieuwe import daardoor tóch `v3Toetsen` vervangen. Voortgang zelf blijft intact. De groene **observed quirk**-test beschrijft huidig, ongewenst gedrag; dat is geen acceptatie-eis. Laat de V3-eigenaar dit in een afzonderlijke fix beslissen/herstellen. Dan expliciet de verwachting wijzigen naar behoud bij annuleren. De nieuwe opslaggrens moet een echte commituitkomst teruggeven, geen DOM-tekst uitlezen.
2. **Resetbeleid:** huidig “Wis voortgang” bewaart zowel profiel als de afzonderlijke toetsgeschiedenis. “Begin helemaal opnieuw” verwijdert ook profiel, intro en uitslagen en start de kennismaking. Dit is vastgelegd. Moet de eerste reset óók uitslagen wissen? Dat vraagt een expliciet productbesluit, geen stille migratiewijziging.
3. **Apparaatgrens:** welk iPad/Safari-model is de ondergrens en welk piekgeheugen/startbudget hoort daarbij? Nog niet gemeten. [Baseline-maten](baseline-metrics.json): V2 41.445.845 bytes, bestaande V3-preview 50.255.820 bytes; dit zijn geen heapmetingen. Geen nieuw runtimebestand meegeleverd; alleen de bestaande preview is lokaal herbouwd voor deze nulmeting.
4. **Geen browser-/devicecertificaat:** beeldpayloads worden in het harnas vervangen, layout/modal/scroll/clipboard/file-API’s gedeeltelijk geadapteerd. Geen echte SVG-fill/stroke-uitvoering, touch/vertrouwde pointerevents, IME, fysieke iPad, printpaginering, VoiceOver, multi-tabconflicten of uitputtende quota-/corruptiedekking. Die blijven bestaande browser/device-QA plus aanvullende regressies bij de migratie. De bestaande regressieketen blijft verplicht naast dit aparte npm-script.

## Startadvies

**Na geaccepteerde V3.0, visuele stabilisatie en Hermes-hertest**, op één vastgelegde commit; eerst deze tests opnieuw draaien op die pin en het importdefect afhandelen. Begin met de zuivere kaartdata-/leer-/beloningsextractie, niet met een gelijktijdige UI-herbouw. Schermmigratie volgt de goedgekeurde V3-componenten en houdt bestaande saves/back-ups bruikbaar bij iedere stap. Verwijder verborgen V2-DOM pas nadat referentie én kandidaat dezelfde contracten en echte browserflows doorstaan. Niet wachten op of alvast vooruitbouwen aan V3.1-profielen/leraarsmodus. Deze levering is voorbereiding, geen runtime- of integratie-GO.
