# V3.0 — Ronde 2, eindbewijs en Hermes-hertest

De opdracht `docs/v3/OVERDRACHT.md` › **Ronde 2** is verwerkt met één commit per punt. Punten 1–4: `eb4fd31`, `58f4d4f`, `0aa4730`, `441ac63`; punt 5: `64250c9`; dit bewijs vormt de afzonderlijke commit voor punt 6. De definitieve volledige eindpin staat in het afsluitende overdrachtsbericht.

**Eindcontrole:** 19/19 V3-QA-scripts groen, inclusief alle vijf Ronde-2-controles; 41/41 contrast-/typografieruns, geometrie 46/46, lint/test/build en de QA-runnerregressie groen. Alle bewijsbestanden gebruiken dezelfde onveranderde preview. [Hashregister](verification.json) · [suiteregister](results-all.json) · [vergelijkingsregister](comparisons.json).

Preview-SHA256: `0c9a576648896d56a2b7f8f2dad1bd62b595b058cb8122e1318e2efdadbbf329`.

`index.html` blijft byte-gelijk: `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a`. De preview-HTML wordt niet gecommit. Er is geen merge, deployment, publicatie of downloadvervanging uitgevoerd.

## Nieuwe BG-03-vergelijkingen

Alle zeven schermen zijn opnieuw vastgelegd op **BG-03 Kust**: desktop 1440×900, iPad liggend 1180×820 en telefoon 390×844. Elke vergelijking bevat links het goedgekeurde doelbeeld, rechts de actuele browserbuild met expliciet achtergrondlabel. De previewbalk is testbediening. Telefoon heeft geen apart conceptrender: daar beoordelen we hiërarchie, inhoud, bereikbaarheid en beeldgebruik, niet desktopkolommen.

| Scherm | Desktop | iPad liggend | Telefoon | BG-01 / BG-02 / BG-03, desktop |
| --- | --- | --- | --- | --- |
| Reis | [vergelijking](vergelijking-reis-desktop.jpg) | [vergelijking](vergelijking-reis-ipad-liggend.jpg) | [vergelijking](vergelijking-reis-telefoon.jpg) | [achtergrondstrook](achtergronden-reis-desktop.jpg) |
| Oefenen | [vergelijking](vergelijking-oefenen-desktop.jpg) | [vergelijking](vergelijking-oefenen-ipad-liggend.jpg) | [vergelijking](vergelijking-oefenen-telefoon.jpg) | [achtergrondstrook](achtergronden-oefenen-desktop.jpg) |
| Les | [vergelijking](vergelijking-les-desktop.jpg) | [vergelijking](vergelijking-les-ipad-liggend.jpg) | [vergelijking](vergelijking-les-telefoon.jpg) | [achtergrondstrook](achtergronden-les-desktop.jpg) |
| Toets instellen | [vergelijking](vergelijking-toets-desktop.jpg) | [vergelijking](vergelijking-toets-ipad-liggend.jpg) | [vergelijking](vergelijking-toets-telefoon.jpg) | [achtergrondstrook](achtergronden-toets-desktop.jpg) |
| Toets resultaat | [vergelijking](vergelijking-toetsResult-desktop.jpg) | [vergelijking](vergelijking-toetsResult-ipad-liggend.jpg) | [vergelijking](vergelijking-toetsResult-telefoon.jpg) | [achtergrondstrook](achtergronden-toetsResult-desktop.jpg) |
| Beloningen | [vergelijking](vergelijking-rewards-desktop.jpg) | [vergelijking](vergelijking-rewards-ipad-liggend.jpg) | [vergelijking](vergelijking-rewards-telefoon.jpg) | [achtergrondstrook](achtergronden-rewards-desktop.jpg) |
| Voortgang | [vergelijking](vergelijking-voortgang-desktop.jpg) | [vergelijking](vergelijking-voortgang-ipad-liggend.jpg) | [vergelijking](vergelijking-voortgang-telefoon.jpg) | [achtergrondstrook](achtergronden-voortgang-desktop.jpg) |

## Wat is geverifieerd

1. BG-03 is standaard; Toscane en Meer blijven kiesbaar. De previewkeuze wordt bij navigatie behouden.
2. Zijbalk wit 70%, `saturate(.6)`, gemeten CIE76/D65 ΔE ≤8 op Home en Les bij alle achtergronden. De materiaalmetingen verbergen tijdelijk de inhoud; de gewone vergelijkingen tonen de echte app.
3. Op 1440×900 staan kaart, elf rijen en Dagdoel · Pizza’s · Vespa-ritten volledig binnen het eerste frame. Toetsen en het kennis-paspoort beginnen onder de vouw met een scheidingsrand; de inhoud van de eerste rij wordt niet afgesneden.
4. Reliëf uit hetzelfde gepinde DEM, met warm geelgroen, olijf, bruin en sneeuw/wit, contrast 1,3. Bronhash, rasterhash, registratie en geometrie zijn gecontroleerd.
5. Beloningen: vanaf 768 px zijn de geschilderde iconen 72 px en de cijfers 40/700. De alfa-inhoud wordt mee gemeten; de canonieke beeldmarges blijven intact. Telefoon behoudt de bestaande compacte typeschaal en twee kolommen.
6. 21 nieuwe doelbeeldvergelijkingen en zeven achtergrondstroken. Alle vijf `point-N.json`-bestanden zijn op de eindpreview opnieuw gegenereerd. De QA-runner registreert input-, suite- en scripthashes en verwerpt tussentijdse mutaties.

De bestaande interactieve QA heeft de echte V2-acties, toetsenbord-, focus-, belonings-, opslag-, import- en responsieve routes gecontroleerd. De bouwer heeft daarnaast BG-03 Beloningen op desktop/iPad, Voortgang op desktop en Toets resultaat op telefoon visueel gecontroleerd. De aparte read-only codereview vond geen Critical/Important/Minor-bevindingen. Dit is bouwbewijs; geen vervanging voor onafhankelijke ontwerpacceptatie.

## Reproduceren

Gebruik Python 3.11 met Playwright en Pillow en lokaal geïnstalleerde Google Chrome. De tijdelijke QA-omgeving van deze run was `/private/tmp/topo-v3-ronde2-qa` (geen projectdependencies aangepast). De browsers moesten buiten de besturingssysteemsandbox draaien; daarbinnen werd Chrome met EPERM afgebroken.

```sh
node scripts/build-v3-preview.mjs
python scripts/qa-v3-all.py
python scripts/qa-v3-comparisons.py
python scripts/test-v3-qa-runner.py
npm run lint
NODE_OPTIONS=--no-experimental-webstorage npm test
npm run build
```

`qa-v3-ronde2.py` zonder argument voert punten 1–5 uit; `--point N` blijft beschikbaar voor gerichte checks. `qa-v3-all.py --failed` hergebruikt alleen identieke inputs/testbytes, inclusief helpers. De laatste suite draaide volledig zonder cachehergebruik. De preview bleef tijdens alle tests/vergelijkingen gelijk. De herstart tijdens de voorbereiding vereiste een hervatte npm-run; die voltooide met exitcode 0.

## Hermes-hertest op de eindpin

[Gericht hertestverzoek](../ronde2/HERMES-HERTEST.md). Hermes: test de definitieve gepushte bewijscommit uit het afsluitende bericht op `codex/topo-v3`, controleer de previewhash hierboven en geef PASS/REWORK met bewijs per punt 1–6.

Open voor de onafhankelijke hertest: model-/assetcontrole, visueel designerakkoord en fysiek iPad/Safari/VoiceOver. De gedocumenteerde iPad Focus Mode behoudt de V2-leskaart en antwoordblad; de 45%-kaartcheck sluit die Focus Mode uit. Op telefoon blijft de bestaande compacte navigatie/typeschaal behouden. Geen nieuwe afwijkingen zijn stilzwijgend als opgelost aangemerkt. Geen bericht aan een externe dienst verzonden; dit bestand en het afsluitende bericht vormen het hertestverzoek.
