# PASS — onafhankelijke QA Reis v3b / flows

Exacte commit: afb32d17293a4705c5690e985d8cd2ef7c2e6ae7
HTML SHA256: 35a0c4696f42abe7555bcb4452540598c493812abc783412b78b9d06ac6a610d

## Uitkomst
- Chromium1248 en WebKit2370: alle 11 hoofdstukken in alle vier hashstanden (#nieuw, #bezig, #afgerond, #alles). Per engine 44 statusgevallen en 68 beschikbare hoofd-/herhaalacties, samen 224 geslaagde matrixgevallen. Ook exacte statuslabels en drie lesbalksegmenten gecontroleerd. Sloten hebben geen lesactie. Alle beschikbare acties zijn werkelijk geklikt en starten het verwachte canonieke V2 hoofdstuk/kind. Inclusief Opfrissen, Verdien goud, Goud nog eens en drie herhalingen.
- Deze matrix begint expliciet met ingebouwde fixture/demo-voortgang. Dit is niet door spelen verdiende voortgang.
- Apart echt gespeeld vanaf #nieuw: per engine Ontdekken 6 UI-stappen, Aanwijzen 6 correcte toetsenbordactivaties van de echte SVG-doelen, Namen schrijven 6 correcte getypte antwoorden, Goud 12 correcte UI-antwoorden. Geen grade(), TopoRoute.answer(), start()-aanroepen of mutaties van leer-/voortgangsstaat. Read-only canonieke namen/vragen gebruikt als antwoordoracle.
- Volgende ronde na 6 goudvragen werkelijk bediend; alle 12 goudvragen afgerond. Pizza-/doos- en Vespa-dialogen via hun eigen UI afgehandeld. Resultaat: eerste hoofdstuk echt goud, tweede hoofdstuk open, 1 Vespa-rit.
- Reis → Ga verder tijdens de echt bereikte schrijfles: zelfde vraag/id/mode, concept Florxyzence en selectie 2–7 met richting backward behouden, in beide engines. Alleen native inputselectie via setSelectionRange ingesteld; geen appstaatmutatie.

## Bewijs
- [Matrix](matrix.json), [echt spel](gameplay.json), [getelde samenvatting](summary.json).
- [Chromium schrijfles hersteld](chromium-real-writing-restored.png), [WebKit schrijfles hersteld](webkit-real-writing-restored.png).
- [Chromium echt verdiend goud](chromium-real-gold-home.png), [WebKit echt verdiend goud](webkit-real-gold-home.png).
- Drivers: driver.mjs (fixturematrix), gameplay.mjs (echt spel), summarize.mjs (telling/controle).

## Beperkingen en issues
Geen browsergereproduceerde productbevinding in dit subtaakbereik. Initiële driverpogingen liepen vast omdat dezelfde file/hash niet opnieuw laadde en omdat normale beloningsdialogen/rondepauzes expliciet bediend moeten worden; driver gecorrigeerd en beide engines volledig opnieuw geslaagd. *-real-failure.png zijn achtergebleven diagnostische beelden van die eerdere driverpogingen, geen actuele productfout.
Fysieke Safari/iPad/OS-toetsenbord niet getest; dit is engine-QA. Layout/kaart/a11y/bouwchecks vallen bij de hoofdreviewer. Bekend eigenaarverzoek ruimer kaartkader/minder fade is geen nieuwe bevinding. Geen tweede implementatie, bronwijziging, gitwijziging, publicatie of taaksluiting. Checkout bij eindcontrole schoon, SHA en HTML-checksum ongewijzigd.
