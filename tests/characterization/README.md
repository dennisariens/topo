# Gedragskarakterisering voor één V3-runtime

Referentie: `codex/topo-v3` @ `68bb5ae9a8f195898fee49445c6151b5c2518b48`, met de ongewijzigde V2.0.2 `index.html` (SHA256 `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a`). Geen nieuwe runtime of tweede implementatie van beoordelings-/beloningsregels.

```sh
npm ci
npm run test:characterization
```

Node 26.7.0 en jsdom 30.1.1 zijn gebruikt (bestaande dependency/lockfile). De suite staat bewust in een apart npm-script: de bestaande `npm test`-keten blijft ongewijzigd. Geen netwerk in de tests; geen preview-demostaat.

`support.mjs` laadt de echte HTML en vervolgens de zeven bestaande V3-scripts in de volgorde van `build-v3-preview.mjs`. Data en functies worden niet geëxtraheerd/nagebouwd. Alleen base64-beeldpayloads worden klein gemaakt; rolmetadata, scripts, DOM, kaartgeometrie en handlers blijven. Clock: 10 november 2026 12:00 UTC; Math.random en crypto.getRandomValues gebruiken een vaste LCG-seed. rAF wordt gecontroleerd afgehandeld; native modal-, scroll-, download- en clipboardeffecten zijn testadapters. De normale 0-ms bootfase wordt afgewacht. Iedere test krijgt geïsoleerde opslag en sluit zijn DOM. Een extra twee-boot-test vergelijkt toetsvolgorde/modes/uitslag/opslag exact.

| Bestand | Orakel en dekking |
| --- | --- |
| `data-grading.test.mjs` | 45 IDs/namen/codes/ankers/vormen tegen `docs/geography/map-manifest.json` (MAP_SYSTEM); groepen, 11 hoofdstukken, context/Italy/name-ankerhashes; alle gedeclareerde aliassen, normalisatie, geen fuzzy spelling/codes/blanko beoordeling; 22 CSS px op meerdere zoom/pan-CTM's; 44 px rivierhitpad; Rome ≠ Vaticaan. |
| `route-rewards.test.mjs` | Echte TopoRoute/TopoLearning/TopoPizza: alle 11 sloten en drie stappen, fouten na tussenliggende plekken, bounded tokenbeloning, goud foutloos aanwijzen én schrijven, behoud/replay/migratie, skill- en hoofdstukplanning, smart pool, 8/3-economie en cosmetische smaak. |
| `continuity-mastery.test.mjs` | Reis→Verder en Oefenen→Reis→Oefenen behouden vraag/concept/selectie; stage replay/dagdoel, 12-vragen-goud met pauze en answered reload; paspoort en V3-drempel uit DECISIONS; TopoBook/Schoolblad; legacy beloningen en eenmalig vernieuwd introaanbod. |
| `exam-storage.test.mjs` | Echte V3-toets: 7/10, fouten/overslaan/80 tekens, gedeelde clipboard/mailtekst, dagdoel maar geen beloningen; 11 echte toetsen bewijzen laatste 10 nieuwste eerst; validators; werkelijke Blob-export en imports V3→V2→V3 en V3→V3; corrupte import/quota/rollback; beide resets en onboarding na reload; herhaalbare seed/clock. |

`baseline.json` bevat alleen hashes en hoofdstukmetadata, geen tweede kaart. De verwachtingen zijn éénmalig vastgelegd op de genoemde pin; nooit automatisch opnieuw genereren om een falende test groen te maken. Opzettelijke contractwijzigingen krijgen eigenaarbesluit, broncontrole en gerichte aanpassing. Bij een nieuwe runtime verandert de bootadapter, niet het verwachte gedrag; de bevroren index-hash controleert de referentie, niet de toekomstige kandidaat.

## Bekende afwijking is geen gewenste specificatie

De groene test met naam **observed quirk** legt een bestaand defect vast: als `#backupStatus` nog een eerdere geslaagde import meldt, kan een geannuleerde import toch geldige `v3Toetsen` overnemen. Voortgang blijft intact, uitslagen kunnen verdwijnen. Die test verhindert dat het defect stilzwijgend als compatibiliteit wordt meegenomen: zie de overdracht voor de vereiste besluit-/herstelstap. Dit is geen goedkeuring van dit gedrag.

## Grenzen

Geen echte browserpixels, beeldkwaliteit, Safari/iPad-geheugen, IME of vertrouwde pointerevents. Voor de afstandscontrole wordt uitsluitend CTM/DOMPoint aangeleverd; de echte resolver rekent zelf. SVG-fill/stroke-uitvoering, echte ambiguity-pickergeometrie, touch en print-A4-paginering blijven browser/device-QA. De suite controleert rivierbreedte en bronpad, niet de native stroke-hitengine. Multi-tabconflicten, echte browserquota, alle ongeldige importcombinaties en legacy browser/OS-varianten zijn niet uitputtend getest. De bestaande tests blijven daarnaast verplicht.
