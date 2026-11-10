# V3.0 — eindbewijs overdracht 3b–5

Voor de lead designer. De avondsectie **Kalibratie typografie en beeld** in `docs/v3/renders/README.md` gaat voor eerdere renders en typografiewaarden. Alle kaarten en getallen blijven uit de app komen; de conceptrenders zijn geen geografische bron.

**Eindcontrole:** 18/18 V3-QA-scripts, 41/41 contrast-/typeschaalruns, geometrie 46/46 en lint/test/build groen. Exacte hashes en commandologs: [verification.json](verification.json) en [results-all.json](results-all.json). Preview `4ac7b42cc9251beb1a922f7f4a3bd8f20493870a0476aa9505f1cefb862d06d1`.

## Vergelijkingen op gelijke breedte

Elke vergelijking bevat het doelbeeld links en de browserbuild rechts. De build is vastgelegd op 1440×900, 1180×820 en 390×844. Er is geen apart telefoonconcept: op telefoon vergelijken we hiërarchie, inhoud en beeldgebruik, niet de desktopkolommen. De previewbalk bovenaan is testbediening en wordt niet gepubliceerd.

| Scherm | Doelbeeld | Desktop | iPad liggend | Telefoon |
| --- | --- | --- | --- | --- |
| Reis | R-reis-ijk | [vergelijking](vergelijking-reis-desktop.jpg) | [vergelijking](vergelijking-reis-ipad-liggend.jpg) | [vergelijking](vergelijking-reis-telefoon.jpg) |
| Oefenen | R-oefenen-ijk-rust | [vergelijking](vergelijking-oefenen-desktop.jpg) | [vergelijking](vergelijking-oefenen-ipad-liggend.jpg) | [vergelijking](vergelijking-oefenen-telefoon.jpg) |
| Les | R-les | [vergelijking](vergelijking-les-desktop.jpg) | [vergelijking](vergelijking-les-ipad-liggend.jpg) | [vergelijking](vergelijking-les-telefoon.jpg) |
| Toets instellen | R-toets-instellen | [vergelijking](vergelijking-toets-desktop.jpg) | [vergelijking](vergelijking-toets-ipad-liggend.jpg) | [vergelijking](vergelijking-toets-telefoon.jpg) |
| Toets resultaat | R-toets-resultaat | [vergelijking](vergelijking-toetsResult-desktop.jpg) | [vergelijking](vergelijking-toetsResult-ipad-liggend.jpg) | [vergelijking](vergelijking-toetsResult-telefoon.jpg) |
| Beloningen | R-beloningen | [vergelijking](vergelijking-rewards-desktop.jpg) | [vergelijking](vergelijking-rewards-ipad-liggend.jpg) | [vergelijking](vergelijking-rewards-telefoon.jpg) |
| Voortgang | R-voortgang-doel | [vergelijking](vergelijking-voortgang-desktop.jpg) | [vergelijking](vergelijking-voortgang-ipad-liggend.jpg) | [vergelijking](vergelijking-voortgang-telefoon.jpg) |

## Visuele beoordeling door de bouwer

| Vergelijkingspunt | Verwerkt / beoordeling |
| --- | --- |
| Hiërarchie en typografie | Gemeten desktop- en iPad-schaal; titel, nav, rijen en cijfers hebben verschillende rollen. Minimumgroottes worden op echte berekende tekst gemeten. |
| Opbouw | Kaart links, bediening rechts op de brede schermen; Reis-hoofdstukkaart onder op het kaartvlak. Nieuwste eigenaarsbesluit gaat voor de oudere renders met de omgekeerde opbouw. |
| Kleur en materiaal | Geen filter of wash over het inhoudsvlak; glas 72% met vibrancy. Reliëf contrasteert sterker en is warmer, met sneeuw/wit behouden. Geen wijziging van paden of ankers. |
| Beeld | Nieuwe Nino bij instellen/resultaat; NINO-ONDERWEG is de rode rijdende Vespa. Het canonieke portret en boek B blijven. Nieuwe beelden zijn technische exports uit de goedgekeurde masters. |
| Ruimte en lijsten | Alle elf hoofdstukken in Voortgang staan volledig in hun paneel, minimaal 40 px per rij. Drie gelijke tegels volgen eronder; het hele Werkblad scrolt. |
| Tekst en acties | Geen nieuwe zichtbare UI-copy toegevoegd. De bestaande V2-acties, echte hoofdstuknamen en getallen blijven leidend; geen fictieve inhoud uit de renders. |
| Responsive | Telefoon gebruikt de bestaande scrollende schermen en vaste tabbalk. Acties lager op het scherm blijven via scroll en toetsenbord bereikbaar. De score houdt ook hier glas en een vrij label. |

Bewuste afwijkingen en open punten:

- Oefenen heeft op desktop twee chipkolommen en compacte 2×2-vormtegels: volledige namen op 17 px passen zo samen met de grote kaart en bediening rechts. Op iPad liggend was die compacte indeling al aanwezig.
- De iPad-les behoudt V2 Focus Mode, met de kaart en het inklapbare antwoordblad. Dat was op de overdrachtspin al een expliciet open punt; deze opdracht begint bij 3b. De kaartoppervlaktecheck sluit die Focus Mode uit. Dit blijft zichtbaar voor de designerreview, niet stilzwijgend als opgelost gemarkeerd.
- De telefoonnavlabels blijven de bestaande 11 px; de minimumschaal geldt vanaf 768 px. Op 320 px gebruikt de bestaande nav iconen met toegankelijke namen.
- Visueel akkoord van de lead designer, de Hermes-modelcheck en de onafhankelijke hertest zijn open. Een browser met gesimuleerde viewport is geen fysieke iPad/Safari/VoiceOver-goedkeuring.

## Reproduceerbaarheid

Gebruik Python 3.11 met Playwright en Pillow en de lokaal geïnstalleerde Chrome. `node scripts/build-v3-preview.mjs` maakt de offline preview; deze HTML staat niet in Git. `qa-v3-all.py` draait alle V3-browserchecks en bewaart exitcodes, bronhashes, scripthashes en een digest van de volledige QA-suite. `--failed` hergebruikt uitsluitend resultaten met identieke inputs én identieke testbytes, inclusief gedeelde testhelpers. Een wijziging tijdens de run maakt de eindstatus rood. `test-v3-qa-runner.py` bewijst die cache- en mutatieregels, inclusief het wijzigen van alleen een geïmporteerde helper met een geïsoleerde regressie.

`qa-v3-comparisons.py` maakt de 21 vergelijkingen. `results-all.json` en `comparisons.json` bevatten de exacte preview-SHA256. De losse logs horen bij die eindrun. Historische Reis/Les-scripts bewaren ook diagnostische velden uit de oudere ontwerpfasen; de actuele presentatieregels worden door fase-B- en afwerkingschecks beoordeeld.

## Review en hertest

Interne codereview van `877800b..15b1619`: geen kritieke runtimebevindingen. Het gevonden risico op hergebruik van oude QA-uitslagen is hersteld en met een gerichte regressie gecontroleerd.

**Stop na stap 5.** Deze map is het reviewpakket. Er is geen Hermes-verzoek verstuurd: de lead designer beoordeelt de vergelijkingen en vraagt daarna de onafhankelijke hertest op de eindpin aan. Geen merge, deploy, publicatie of vervanging van een download.

## Toegankelijkheidsreview van de wijzigingen

Getoetst aan de [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): de nieuwe beelden behouden lege alt/aria-hidden en expliciete afmetingen; de bestaande semantische knoppen, labels en focusafhandeling blijven intact. De adapter introduceert geen animatie, netwerkbron of nieuwe interactieve bediening. De scorekop is niet sequentieel focusbaar (`tabindex=-1`); de bewuste ringuitzondering daarop volgt het eigenaarsbesluit. Algemene aanbevelingen veranderen hier geen goedgekeurde V2-navigatie of leerlogica.
