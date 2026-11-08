# V2-afsluiting, 8 november 2026

**Release:** v2.0.1 is tag `v2.0.1`, commit `36afafa`, met de release-HTML `TOPO-NINO-Computer-Release.html`. Die HTML is byte-identiek aan `index.html` op de tag.
**Waar staat het:** `main` staat nog op `7e38160`. De V2-lijn loopt via `codex/nino-v2-artwork-closure-67` (#70), waarin #71 en #77 zijn gemerged.
**Inventaris:** het manifest uit #75 (`docs/qa/nino-v2-closure-67/artwork-manifest.json` op `5976b83`, 268 regels), naast elkaar gelegd met de tree en de HTML van v2.0.1.
- 147 regels staan bytegelijk in v2.0.1.
- 121 regels staan alleen in #75: masters, Pisa-scharnier, scènes, concepten en referenties.
- De release-HTML gebruikt 47 afbeeldingen.

**Statuswoorden:** het manifest is opgesteld vóór de integratie. Daardoor staat bij veel exports nog "INTEGRATION PENDING", terwijl ze wel in de HTML zitten. Voor de vraag wat is uitgebracht, telt deze notitie, niet dat statusveld.

## Per onderdeel

| Onderdeel | Uitgebracht in v2.0.1 | Beschikbaar als bron | Nog te beoordelen |
| --- | --- | --- | --- |
| Hoofdstukiconen | 11 WebP-exports | 11 PNG-masters (alleen #75) | — |
| Nino-poses | welcome, guide, encourage, success, gold, arrival; travel als header | PNG's in `characters/` en `nino-reflect.webp` (alleen #75) | — |
| Scènes per hoofdstuk | geen | 8 scène-PNG's en WebP-exports (alleen #75) | Wil je ze gebruiken? Zie V3 (#76). |
| Reisboekje | omslag, linker en rechter folio | masters (v2.0.1) | **Folioresolutie:** de folio's zijn 1086×1448, dus maximaal 543 CSS-px per pagina op DPR 2. Dit vraagt een uitzondering van de eigenaar. |
| Stempels | 11 exports | masters, QA-kandidaten en 1 rework | — |
| Goud | zegel (64) en Esploratore d'oro (480), WebP | native-, 128- en 240-versies, PNG en WebP (v2.0.1) | — |
| Postkaarten | Sicilia, Sardegna, Napoli, Venezia (tight) en de universele achterkant | Venezia full PNG/WebP en de SVG-contour (v2.0.1) | **Venezia-rand:** gereconstrueerd uit 572 punten. De oorspronkelijk beoordeelde matte ontbreekt, dus vergelijken met het origineel kan niet. Je kunt de reconstructie accepteren of de matte aanleveren. |
| Aankomst | `arrivo-travel` voor elke bestemming | — | Elke bestemming krijgt nu hetzelfde aankomstbeeld (bekend open punt). |
| **Pizza: statische Pisa-dozen** | **open Pisa-doos voor margherita, quattro formaggi en salami, plus de drie pizza-illustraties** | dichte doos, plank, punticonen en 63 punten (v2.0.1) | — |
| **Pizza: Pisa-scharnier** | **niet uitgebracht** (geen scharnieranimatie in de HTML) | #75: lagen, drie animaties, tijdsbewijzen en een ZIP van 89 MB (`54f862dc…9f29`) | **Aparte kandidaat.** Hermes geeft PASS, REWORK of BLOCKED, en de eigenaar beoordeelt het uiterlijk. Pas daarna kan de integratie volgen, als losse stap. |
| Favicon | de N, 16 en 32 px | `app-icon/favicon-n/`; `micro-v2/` (PR65) blijft als geschiedenis | Retina, Safari en het iPad-beginscherm zijn niet getest. |
| **Premium-appicoon** | **niet uitgebracht.** De header toont tijdelijk de goedgekeurde Travel-cutout. | **ontbreekt:** de 1024-px-PNG uit `topo-nino-app-icon-v1.zip` (#8) is nergens in Git of lokaal gevonden | De eigenaar moet de bron aanleveren. Specificatie: `docs/nino/APP_ICON_SPEC.md` in #6. |

## Open artwork-PR's

- **#70**: de inhoud (`2a9dda3`) zit volledig in de lijn van v2.0.1. De PR65-favicons uit #70 zijn intussen vervangen door de N. De branch bevat nu ook #71 en #77, dus hij is feitelijk de releaselijn geworden. Of hij gemerged wordt (en waarin), vraagt een apart besluit.
- **#75**: twee commits bovenop `2a9dda3` die niet in v2.0.1 zitten. Daarin staan de Pisa-scharnier-review, de hoofdstukmasters, de Nino-masters en de scènes. **Houd hem open** voor de beoordeling door Hermes en de eigenaar.

## Oude PR's die door de release zijn ingehaald

Dit is een advies. **Sluiten of mergen gebeurt pas na een apart besluit.**

| PR | Stand ten opzichte van v2.0.1 | Advies |
| --- | --- | --- |
| #3, #9, #14, #15, #17, #27, #30, #39, #40, #47, #51, #60, #61 | Alle commits zitten in de geschiedenis van v2.0.1. | Archiveren; er gaat niets verloren. |
| #2 Work-snapshot | De `work-sync`-bestanden staan in v2.0.1; alleen de commit verschilt. | Archiveren. |
| #59 kaartkeuze | Samen met #60 verwerkt in #61. | Archiveren. |
| #69 C+ | Overgezet als vastgepinde `nino-cplus.css` (`c84a151`). | Archiveren. |
| #29 Pizza Reward V2 | Geïntegreerd (volgens `PROJECT_STATE`); 1 eigen commit, 41 bestanden alleen in de PR. | Archiveren nadat is nagelopen of die 41 bestanden nog nodig zijn. |
| #65 micro-iconen | De bestanden staan in v2.0.1; het favicon is vervangen door de N. | Archiveren. |
| #66 Venezia | De exports staan in v2.0.1. | Behouden tot het besluit over de Venezia-rand. |
| #63, #72 Pisa-scharnier | Ingehaald door #75. | Archiveren zodra #75 is beoordeeld. |
| #48 art-intake | #75 neemt de hoofdstukexports en de paspoortomslag over uit #48. Er staan nog 129 bestanden alleen in #48. | Archiveren zodra #75 is beoordeeld. |
| #6, #26, #42, #49, #62, #64 | Docs en voorstellen die niet in v2.0.1 staan: app-icoonspecificatie, kaartontwerp, roadmap, Scoperte, kaartkeuzeschema's en UX52. | Behouden als bron voor V3 (#76). |
| #7 eilandenbadge | De test uit de PR ontbreekt in v2.0.1, dus de fix is niet aantoonbaar meegekomen. | Eerst nagaan. |

## Buiten deze afsluiting

- **Harness #73/#74 zijn geparkeerd.** De Hermes-review op #74 (REWORK) blijft staan voor wanneer die automatisering weer wordt opgepakt.
- **Nieuwe productideeën** staan bij V3-issue #76.
