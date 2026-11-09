# V3 Golden Experience 01 — beat 3–7 (les → feedback → beloning → Reisboekje)

**Kandidaat:** `output/html/TOPO-V3-Reis-Preview.html` (naam behouden; bevat nu Reis én les), SHA256 `d948643fe8ea732f7689b13fe7f5fd2bff6020bdc48c34c40252bc5da0eab3e9`. Niet in Git; reproduceer met `node scripts/build-v3-preview.mjs`. Basis: ongewijzigde V2.0.2-`index.html` (`3aced3c3…304f5a`) + `scripts/v3/` (`tokens.css`, `reis.*`, `les.*`).
**Spec:** [docs/v3/GE01.md](../../v3/GE01.md). **Openen:** `file://…#bezig` → **Aanwijzen** (of **↻ Ontdekken**).
**Oordeel:** technisch geslaagd · visueel zelf beoordeeld · **eigenaar: open** · Hermes: open. Geen merge, deployment of downloadvervanging.

## Hoe gemeten

`python3 scripts/qa-v3-les.py` speelt hoofdstuk 2 echt door vanuit de demostand `#bezig` (alleen in het geheugen): Ontdekken (herhaling) → Aanwijzen → Namen schrijven, met één fout antwoord in Aanwijzen en in Schrijven. Aanwijzen gebeurt met een **echte tik/klik** op de canonieke plek; opent V2 zijn neutrale kiezer, dan kiest de QA het juiste genummerde vlak; ligt de plek onder de Focus-sheet, dan eerst **Kaart vrijmaken**. Schrijven via het V2-invoerveld. Niets wordt geïnjecteerd. Vijf formaten: desktop 1440 × 900, iPad liggend 1180 × 820 en staand 820 × 1180, telefoon 390 × 844 en 320 × 640. Chrome 157, macOS, headless. `QA_ONLY=phone` beperkt de run tot één formaat.

## Spoor per afspraak

| Afspraak (GE01) | Zichtbaar gedrag | Bewijs (`results.json › summary`) | Oordeel |
| --- | --- | --- | --- |
| Lesstappen boven de kaart (PR #64) | `1 Ontdekken · 2 Aanwijzen · 3 Namen schrijven`, ★ Goud apart; klaar = ✓ en herhaalbaar | `stepsRight: true`; `currentStepPerBeat` (per moment de actieve stap; na afronding geen) | ✓ |
| Beat 3 — Ontdekken | Plek als titel, Nino-zin, **Bekeken · verder** | `currentStepPerBeat.discover`; screenshot · [desktop](discover-desktop.png) · [telefoon](discover-phone.png) | ✓ |
| Beat 4 — Aanwijzen, de kaart is de handeling | Vraag, geen hulpregel; tik op de kaart | `pointByRealTap`: 30/30 via echte tik (deels via V2-kiezer of na Kaart vrijmaken); `tapsBlockedByV3: []` | ✓ |
| Beat 5 — Namen schrijven | Invoer + **Controleer**; concept blijft bij formaatwissel | `draftSurvivesFormatChange: true` (1440 → 1100 Focus → 1440, focus behouden) | ✓ |
| Beat 6 — Feedback | V2-zin: groen ✓ of rustig rood; **Volgende** als enige hoofdactie | `feedbackFromV2`, `wrongAnswersNotRewarded`, `meterMatchesState`, `oneMainAction: {}` | ✓ |
| Beat 7 — verdiende beloning | Pizza- en Vespa-dialoog alleen bij de echte telling | `rewardMomentsOnRealCount: true`; pizza 1→2, 2→3 en Vespa-rit 0→1 op alle formaten · [pizza](pizza-desktop.png) · [Vespa](vespa-desktop.png) | ✓ |
| Beat 7 — stempel → Reisboekje | **Deze halte is afgerond!**, stempel met **Bekijk in Reisboekje** als hoofdactie; één terugknop | `finishStampAndBook: true` (`stamp:city2`, boek open); `bookTapLandsOnButton: true` · [afronding](finish-desktop.png) · [boek](reisboekje-desktop.png) | ✓ (fout gevonden en hersteld) |
| Terug naar Reis | Volgende hoofdstuk is het huidige | `backToReisNextChapter: true` (`city3`) | ✓ (fout gevonden en hersteld) |
| Tekstbudget | Geen V2-kop, navigatie, oefenmodi, "Samen met Nino", hulpregels | `v2ChromeVisible: {}` | ✓ |
| Layout | Geen overlap in de strook, geen afkapping, doelen ≥ 44 px, geen horizontale scroll | `barOverlaps`, `clipped`, `smallTargets`, `horizontalOverflow` leeg | ✓ |
| Verminderde beweging | Geen overgangen | `reducedMotion: 0s` | ✓ |
| V2 intact | — | `indexUnchanged: true`; `qa-v3-reis.py` groen; lint, test, build ✓ | ✓ |

## Gevonden en hersteld tijdens de QA

1. **Tik op Bekijk in Reisboekje deed niets (telefoon).** De afrondtitel heeft focus (V2) en had in V3 bij focus een grotere letter. Bij het indrukken verloor de titel focus, kromp van twee regels naar één en schoof de knop onder de vinger weg (`pointerdown` op de knop, `pointerup` ernaast). Nu verandert focus nooit de maat; de QA controleert dat de tik op dezelfde knop landt.
2. **Terug naar Reis koos het oude hoofdstuk.** Reis onthield de eerdere rijkeuze; na een les kiest Reis nu het hoofdstuk van de les of het volgende.
3. **Pauze/afronding in de compacte schil.** Focus Mode zet daar `data-focus-mode=false` maar houdt de schil (`data-focus-shell=true`); de strook en het Menu hangen nu aan de schil, de kaartverschuiving aan Focus Mode.

## Niet getest

WebKit en echte iPad Safari (niet beschikbaar in deze omgeving), VoiceOver, fysieke toetsenborden/IME, SF Pro-weergave.

## Open punten

1. **Ingeklapte sheet na antwoord (V2 Focus Mode).** Wie **Kaart vrijmaken** tikt en daarna antwoordt, ziet feedback en **Volgende** pas na **Antwoord openen**. Zo ook in `afb32d1`; Focus Mode is eigenaar. Voorstel: sheet na een antwoord automatisch openen. Productkeuze eigenaar.
2. **Teller na een fout.** De strook telt de V2-wachtrij: na een fout komt die vraag terug, dus `1 / 6` wordt `1 / 7` (eerlijk, maar kan verrassen).
3. **Afrondscherm.** De drie V2-uitslagvakjes ("goed in deze ronde" …) blijven met hun label; een getal zonder label is hier niet duidelijk genoeg. Reisboekje en Vespa-rit blijven V2-composities.
4. Uit de spec: hulpregels en "Samen met Nino" vervallen in een les; oefenmodi alleen via **Oefenen**.
