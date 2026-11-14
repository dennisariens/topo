# Docs-inventaris (BL-002): wat is actueel, wat naar `docs/archive/`

Datum: 2026-11-14 · contract `ops/contracts/BL-002.md` · bouwer: builder (Sonnet, aangestuurd door de hoofdsessie) · de evaluator oordeelt; dit rapport claimt geen PASS. Er is niets verplaatst of herschreven; dit is een rapport met een voorstel.

## Rapportkop (alles hieronder meet tegen deze sha's, niet tegen branchnamen)
| Naam | Sha | Wat |
|---|---|---|
| `M` | `b835a59aadf2dd8737d47d8002ad5ebcc5205785` | `origin/main` bij de start van de run (= `HEAD` van de taakbranch bij de start) |
| `V` | `55b4d86ea15fc3824c4180b99cb9a18167fcccd2` | `origin/codex/topo-v3`, gepind zoals in `integratie.md` |
| `DRY` = `D` | `df72c393e62a0c1e918fdf0e40dac1f7557069f1` | proefintegratie BL-005 (bestaat nog: `git cat-file -e df72c393e62a0c1e918fdf0e40dac1f7557069f1^{commit}` slaagt). **Primair gebruikt, geen terugval.** |
| `A` | `7714e22d137aeda3fbd858549153a6008623f9f7` | `origin/art/master` (alleen voor de datum van `docs/ASSET_BRIEF.md`, zie afwijkingen) |

| Meting | Waarde | Commando |
|---|---|---|
| Paden in `D` | 922 | `git ls-tree -r --name-only df72c393e62a0c1e918fdf0e40dac1f7557069f1 | wc -l` |
| Bestanden in inventarisset `I` | 70 | `{ git ls-tree -r --name-only D -- docs/ | grep -Ev '^docs/(qa|visual)/'; git ls-tree -r --name-only D -- docs/qa docs/visual | grep -E '\.md$'; } | sort | wc -l` |
| Drift `origin/codex/topo-v3` op `docs/` t.o.v. `V` | 0 bestanden | `git diff --name-only 55b4d86ea15fc3824c4180b99cb9a18167fcccd2 origin/codex/topo-v3 -- docs/ | wc -l` (lokale remote-trackingref; er is bewust niet gefetcht) |
| Hash van de tags vóór de run | `90e8b859d85a0e06932bf79ba5491e91ebc76d1e` | `git for-each-ref refs/tags | sha1sum` (moet na de run gelijk zijn, criterium 14) |
| Terugval | niet nodig | `V ∩ E` is niet gemeten omdat `D = DRY` bestaat; `comm -23 <(git ls-tree -r --name-only V | sort) <(git ls-tree -r --name-only D | sort) | wc -l` geeft 2184, gelijk aan de waarde in `integratie.md` |

Gewijzigde bestanden (criterium 14): zes, namelijk `ops/reports/docs-inventaris.md`, `ops/BACKLOG.md`, `ops/STATE.md`, `ops/RUNLOG.md`, `ops/LEARNINGS.md` en `ops/contracts/BL-002.md`. Het contract zelf staat maar vijf bestanden toe; `ops/contracts/BL-002.md` is bewust als zesde meegecommit (het was ongecommit, zoals bij eerdere taken), en inhoudelijk niet gewijzigd.

Gebruikte commando's: alleen lezend (`rev-parse`, `cat-file`, `ls-tree`, `show`, `log`, `diff`, `grep`, `for-each-ref`, `cat-file --batch` in het linkscript). Geen `fetch`, `gc`, `prune`, tag, push, merge of `git mv`. Schrijvend: `switch -c t/BL-002-docs-inventaris` en `add`/`commit` van de toegestane bestanden.

Afwijkingen van het contract:
1. `docs/ASSET_BRIEF.md` staat in `D` maar niet in `V` en niet in `M`: het komt uit `art/master` (`A`, commit `f163e90`, 2026-11-12). Het contract zegt dat `A` hier geen markdown toevoegt; dat klopt voor dit ene bestand niet. De datum in de tabel komt uit `A`. Voor de overige 69 bestanden van `I` is de datum uit `V` genomen.
2. De `AGENTS.md` in `D` heeft andere regelnummers dan die van `M` (het contract noemt r.5, r.11, r.14 voor `M`). In `D` zijn dat r.9, r.15 en r.18. De tabel in `## Verwijzingen in projectregels` geeft beide versies.
3. De bestanden voor criterium 8 komen uit `D` en `M` apart (`ops/*.md` van `D` is ouder dan dat van `M`); beide zijn gemeten.
4. De contractdefinitie van (c) omvat alleen c-doel (het doel wordt verplaatst: 4 links). Het script telt daarnaast c-bron (het bronbestand zelf wordt verplaatst en de relatieve link breekt daardoor: 21 links); samen zijn dat de 25 onder (c).

## Samenvatting
- Inventaris: 70 bestanden: 47 `actueel`, 21 `archief`, 2 `vervangen`. Verplaatsplan: 23 `git mv`'s (alleen `.md`; alles wat geen markdown is blijft staan).
- Linkanalyse: 101 markdown-bestanden, 338 links, 281 gebroken: (a) 256 doel in `E`, (b) 0 al kapot in `V`, (c) 25 door het eigen verplaatsplan, (d) 0 overig. Van de 281 gebroken links staan er 76 in bestanden die `actueel` blijven (groep 2: 72, groep 3: 4, groep 4: 0) en 205 in bestanden die naar het archief gaan (laten).
- `docs/qa/v3-reis/`: advies **niet mee** in BL-005b (33 bestanden, 15 956 760 bytes; slechts 2 links vanuit `actueel`-bestanden).
- Opvolger-regels: `docs/PROJECT_STATE.md` wordt `vervangen` door `ops/STATE.md`, `docs/ROADMAP.md` door `ops/ROADMAP.md`.

## Inventaris
Statuswaarden: `actueel` (blijft), `archief` (naar `docs/archive/`), `vervangen` (naar `docs/archive/`, met opvolger). Datum is `git log -1 --format=%cs` op `V` (voor `docs/ASSET_BRIEF.md` op `A`). "Inkomend" is het aantal markdown-links uit andere `*.md`-bestanden in `D` naar dit pad (uit het linkscript, `--incoming`); tekstverwijzingen in backticks tellen niet mee. Leessregel: alleen kop (`head -n 30`) en `grep`, geen volledige documenten.

| Pad | Status | Laatste commit | Inkomend | Opvolger | Reden |
|---|---|---|---|---|---|
| `docs/AFTERNOON_IPAD_BETA_2026-10-26.md` | archief | 2026-10-26 | 1 | - | Verslag van PR #47 (iPad-update, 2026-10-26) van de V2-periode; geen lezer in scripts/src/ops (criterium 7), nog niet naar V3 doorgetrokken. |
| `docs/APPROVED_ARTWORK_COMPUTER_RELEASE.md` | archief | 2026-10-30 | 2 | - | Release-document (naam bevat RELEASE) over PR #61 uit oktober; geen lezer buiten andere archiefdocumenten. |
| `docs/ASSET_BRIEF.md` | actueel | 2026-11-12 | 0 | - | Komt uit `art/master` (niet in `V`); lezer: `assets/art/CREDITS.md:3` noemt het briefingnummer in `docs/ASSET_BRIEF.md`. Het blijft de bron van de artwork-prompts voor nieuwe landen. |
| `docs/CODEX_INTEGRATION_QA_HANDOFF.md` | archief | 2026-10-30 | 2 | - | Handoff-document (naam bevat HANDOFF) voor PR #61 van 2026-10-30; geen lezer. |
| `docs/COMPUTER_RELEASE_2026-10-30.md` | archief | 2026-10-30 | 1 | - | Release-document van 2026-10-30; noemt zichzelf in r.3 "Historical candidate", opgevolgd door APPROVED_ARTWORK_COMPUTER_RELEASE (ook archief). |
| `docs/CONTENT_MODEL.md` | actueel | 2026-09-28 | 0 | - | Beschrijft de 45 `ITEMS` en het inhoudsmodel; geen opvolger in `docs/v3/` of `ops/` (laatste wijziging 2026-09-28). AGENTS.md r.7 (versie `M`: r.11) zegt dat beoogd gedrag in de overige docs staat. Mogelijk deels verouderd; herijken is een eigen taak. |
| `docs/DECISIONS.md` | actueel | 2026-11-11 | 1 | - | Besluitenlog; AGENTS.md (M: r.5, r.11) en CLAUDE.md r.15 verwijzen ernaar, `ops/MEMORY.md:10` noemt het permanent. |
| `docs/DESIGN_SYSTEM.md` | actueel | 2026-11-09 | 1 | - | Design system V3; lezer: `.claude/agents/design-critic.md:10`, `ops/MEMORY.md:12`, `ops/QUALITY.md:22`. |
| `docs/DISCOVERY_MAP.md` | archief | 2026-10-25 | 0 | - | Werkdocument van een PR-kandidaat (Discovery Map, branch `hermes/topo-discovery-map-production`) uit oktober; de naamtreffers in `scripts/` zijn de identifier `NINO_DISCOVERY_MAP`, geen pad. |
| `docs/FOCUS_MODE.md` | archief | 2026-10-26 | 1 | - | Werkdocument van een PR-kandidaat (P0 iPad Focus Mode, status CONDITIONAL) uit oktober; geen lezer. |
| `docs/geography/apennines-anchor-source-en.json` | actueel | 2026-10-26 | 0 | - | Brondata voor de Apennijnen; lezer: `scripts/geography/generate-apennines.py:11`. |
| `docs/geography/apennines-anchor-source-it.json` | actueel | 2026-10-26 | 0 | - | Brondata (Italiaanse variant) naast de en-variant; zelfde generator-map, AGENTS.md r.2 (M: r.6) noemt `docs/geography/` als bron van geografie. |
| `docs/geography/apennines-provenance.json` | actueel | 2026-10-26 | 1 | - | Herkomstbestand; lezers: `scripts/geography/qa-apennines.py:39` en `generate-apennines.py:58`. |
| `docs/geography/LAKES.md` | actueel | 2026-10-24 | 3 | - | Natuurlijke bron (Natural Earth 5.0.0) en herkomst van de zes achtergrondmeren; geografie is projectregel nummer 1 (AGENTS.md), dus documentatie van de brongeometrie blijft. |
| `docs/geography/map-manifest.json` | actueel | 2026-10-26 | 0 | - | Manifest van de kaartgeometrie; lezers: `scripts/audit-map-picker-revision.mjs:8` en `scripts/geography/generate-apennines.py:53`. |
| `docs/geography/original-points.json` | actueel | 2026-10-23 | 0 | - | Oorspronkelijke puntdata, vermeld in `docs/geography/README.md:11` als referentie voor de 45 items; geografie-data. |
| `docs/geography/points.json` | actueel | 2026-10-23 | 0 | - | Puntdata van de 45 items; lezer: `scripts/qa-computer-release.mjs:11` en `scripts/audit-map-picker-revision.mjs:8`. |
| `docs/geography/README.md` | actueel | 2026-10-23 | 0 | - | Projectie, bronnen en geometrie-hashes van de kaart; AGENTS.md r.2 (M: r.6) noemt `docs/geography/` bij kaartwerk. |
| `docs/HERMES_QA_RELEASE_1.md` | archief | 2026-10-23 | 0 | - | QA-handoff van Release 1 (naam bevat RELEASE) van 2026-10-23; verwijst naar een integratiebranch uit oktober. |
| `docs/INTEGRATED_RELEASE_CANDIDATE.md` | archief | 2026-10-30 | 2 | - | Release-document van een PR #61-kandidaat (oktober); geen lezer. |
| `docs/LEARNING_MODEL.md` | actueel | 2026-09-28 | 0 | - | Beschrijft de leervolgorde en het opslagschema (`schema:3`) dat V3 hergebruikt; geen opvolger (laatste wijziging 2026-09-28). Mogelijk deels verouderd; herijken is een eigen taak. |
| `docs/LEERROUTE_DESIGN.md` | archief | 2026-09-28 | 0 | - | Brainstorm en uitkomst van de leerroute (2026-09-28, V1); 0 inkomende links, geen lezer; de drie-staps route zit in de app (AGENTS.md r.4). |
| `docs/MAP_PICKER_58.md` | archief | 2026-10-29 | 2 | - | Kop (r.1) noemt het zelf een "Historical rejected candidate" (ADJUST / NO-GO), opgevolgd door de revisie in `docs/visual/map-picker-58-revision/`. |
| `docs/MAP_SELECTION_HOTFIX.md` | archief | 2026-10-25 | 2 | - | Verslag van hotfix #36/#34 uit oktober (gestapeld op PR #30); geen lezer. |
| `docs/MAP_SYSTEM.md` | actueel | 2026-10-30 | 0 | - | Kaartsysteem en coördinatencontract; AGENTS.md (M: r.5, r.11) en `ops/MEMORY.md:12` verwijzen ernaar vóór kaartwerk. |
| `docs/OFFLINE_COMPUTER_50.md` | archief | 2026-10-27 | 1 | - | Overdracht (handoff in de kop) voor issue #50 (2026-10-27); geen lezer. |
| `docs/PRODUCT_SPEC.md` | actueel | 2026-09-28 | 0 | - | Productspecificatie; lezer: `ops/MEMORY.md:12` (categorie Specificatie). Laatste wijziging 2026-09-28: herijken is een eigen taak. |
| `docs/PROJECT_STATE.md` | vervangen | 2026-11-11 | 0 | ops/STATE.md | AGENTS.md r.1 en `ops/ROADMAP.md:11`: `ops/STATE.md` vervangt dit bestand; het is ook de grootste bron van gebroken links (zie Linkanalyse). |
| `docs/qa/v3-les/README.md` | actueel | 2026-11-09 | 2 | - | Wordt meegenomen in BL-005b (`integratie.md` §Grootte per pad); `docs/v3/GE01.md` linkt ernaar. Blijft op zijn plek in `docs/qa/`. |
| `docs/qa/v3-stijlbeeld/final/README.md` | actueel | 2026-11-11 | 3 | - | Laatste stand van de doelbeelden; `docs/v3/SPEC.md` r.28/r.34 en `.claude/agents/design-critic.md:11` wijzen naar `docs/qa/v3-stijlbeeld/final/`. |
| `docs/qa/v3-stijlbeeld/README.md` | actueel | 2026-11-10 | 4 | - | Wordt meegenomen in BL-005b (`integratie.md` §Grootte per pad), benchmarkbron van `DESIGN_AUDIT_V3_0.md`; 42 van 47 links zijn kapot (zie Linkanalyse). |
| `docs/RELEASE_1_1.md` | archief | 2026-10-23 | 0 | - | Release-document (naam bevat RELEASE) van 2026-10-23; Release 1.x is afgerond en opgevolgd door V2 en V3. |
| `docs/RELEASE_1_2_INTEGRATION.md` | archief | 2026-10-24 | 1 | - | Release-document (naam bevat RELEASE) van 2026-10-24; geen lezer buiten andere archiefdocumenten. |
| `docs/RELEASE_1_2.md` | archief | 2026-10-24 | 0 | - | Release-document (naam bevat RELEASE) van 2026-10-24; geen lezer. |
| `docs/RELEASE_1_INTEGRATION.md` | archief | 2026-10-23 | 0 | - | Release-document (naam bevat RELEASE) van 2026-10-23; geen lezer. |
| `docs/ROADMAP.md` | vervangen | 2026-10-23 | 0 | ops/ROADMAP.md | `ops/ROADMAP.md:3` en AGENTS.md r.1: "dit is de enige roadmap; `docs/ROADMAP.md` is vervangen". Beschrijft nog Release 1 (2026-10-23). |
| `docs/SCHOOLBLAD_OVERLAY.md` | archief | 2026-10-24 | 1 | - | Werkdocument van issue #23 (schoolblad-overlay) uit oktober; de overlay bestaat als `scripts/schoolblad.js`; geen lezer van dit document. |
| `docs/superpowers/plans/2026-11-04-nino-playable.md` | archief | 2026-11-04 | 0 | - | Uitvoeringsplan voor de NINO 2.0-kandidaat (PR71), V2 is afgesloten op `v2.0.2` (`V2_AFSLUITING.md`); geen lezer. |
| `docs/V2_AFSLUITING.md` | archief | 2026-11-08 | 1 | - | Afsluitverslag van V2 (2026-11-08); alleen gelinkt vanuit `docs/v3/AUDIT.md:25`; historie, geen werkdocument voor V3. |
| `docs/v3/ARTWORK_BRIEF.md` | actueel | 2026-11-09 | 0 | - | Artworkbrief voor V3 (2026-11-09); V3 is nog niet getagd (`v3.0.0`); herijken na G4. |
| `docs/v3/ARTWORK-INVENTARIS-RONDE3.md` | actueel | 2026-11-13 | 0 | - | Bindingsinventaris van de assets (peildatum 2026-11-11, laatst gewijzigd 2026-11-13); actief V3-werk. |
| `docs/v3/ASSETDIEET.md` | actueel | 2026-11-12 | 0 | - | Opdracht Assetdieet (12-11); beschrijft `scripts/v3-assets-export.py` en `docs/v3/assets-inventaris.json`; V3-werk, herijken na G4. |
| `docs/v3/assets-inventaris.json` | actueel | 2026-11-12 | 0 | - | Invoer van `scripts/v3-assets-export.py` (docstring r.4) en `scripts/qa-v3-stijlbeeld.py:48`. |
| `docs/v3/AUDIT.md` | actueel | 2026-11-09 | 1 | - | V3-basisaudit (2026-11-09); wijst naar assets en V2; actief V3-document, herijken na G4. |
| `docs/v3/DESIGN_AUDIT_V3_0.md` | actueel | 2026-11-10 | 0 | - | Ontwerpaudit tegen de conceptrenders (2026-11-10); benchmark voor `renders/README.md`; actief V3-document. |
| `docs/v3/DESIGN_FEEDBACK.md` | actueel | 2026-11-10 | 1 | - | Ontwerpfeedback van de eigenaar volgens het Design Taste-protocol; wordt doorlopend aangevuld. |
| `docs/v3/GE01.md` | actueel | 2026-11-09 | 2 | - | Spec Golden Experience 01 (beat 3 tot 7); actief V3-document, linkt naar `docs/qa/v3-reis/` en `docs/qa/v3-les/`. |
| `docs/v3/ideeen/README.md` | actueel | 2026-11-10 | 0 | - | Ideeënlijst V3.1 (Uitstapjes); hoort bij de bijbehorende afbeelding en is toekomstwerk, geen archief. |
| `docs/v3/ideeen/UIT-torino-concept.webp` | actueel | 2026-11-10 | 0 | - | Conceptafbeelding waar `docs/v3/ideeen/README.md:5` naar verwijst. |
| `docs/v3/LANDMARKS-ONTBREKEND.md` | actueel | 2026-11-13 | 0 | - | Werklijst van ontbrekende landmarks (ronde 5 punt 2, laatst gewijzigd 2026-11-13); open werk voor de eigenaar. |
| `docs/v3/OVERDRACHT.md` | actueel | 2026-11-13 | 0 | - | Overdracht V3.0; AGENTS.md (versie `V`/`D`: r.5) noemt het als eerste lees-document voor V3-werk. De bestandsnaam bevat niet HANDOFF (criterium 4 geldt niet). |
| `docs/v3/RELIEF_RENDER.md` | actueel | 2026-11-13 | 0 | - | Opdracht reliëf-render (13-11); stopcriterium verwijst naar `docs/qa/v3-stijlbeeld/final/`; open V3-werk. |
| `docs/v3/renders/B-voortgang-benchmark.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-beloningen.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-les.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-oefenen-ijk-rust.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-oefenen-ijk.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-oefenen.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-reis-ijk.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-toets-instellen.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-toets-resultaat.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-voortgang-doel.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-voortgang-ijk.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/R-voortgang.webp` | actueel | 2026-11-10 | 0 | - | Doelrender (Golden Screen); lezer: `scripts/qa-v3-*.py` verwijzen naar `docs/v3/renders/`, `design-critic.md:11` en `ops/QUALITY.md:21`. |
| `docs/v3/renders/README.md` | actueel | 2026-11-10 | 0 | - | Beschrijft de doelrenders, ook de lagen bijstellingen; `docs/v3/SPEC.md` r.1 noemt het (niet volledig lezen); `qa-v3-afwerking.py:2` verwijst ernaar. |
| `docs/v3/SPEC.md` | actueel | 2026-11-12 | 0 | - | Huidige waarheid van V3 ("één pagina"); AGENTS.md (D: r.5), `design-critic.md:10`, `ops/MEMORY.md:12`, `ops/QUALITY.md:22`, `ops/HARNESS.md:56`. |
| `docs/v3/STAP0_BRON.md` | actueel | 2026-11-12 | 0 | - | Beschrijft de splitsing van `index.html` in `src/v2/` en de pin (AGENTS.md r.3, versie `D`); regelt hoe de app gebouwd wordt. |
| `docs/v3/V3_0_REST.md` | actueel | 2026-11-09 | 1 | - | Opdracht resterende V3.0-schermen (2026-11-09); V3 is nog niet getagd; herijken na G4. |
| `docs/v4/FRANKRIJK_HANDOFF.md` | archief | 2026-11-12 | 0 | - | Bestandsnaam bevat HANDOFF en er is geen concrete lezer (0 treffers met `git grep -n FRANKRIJK_HANDOFF` in `D`, ook niet in ops/ of docs/v3/); het Frankrijk-werk loopt via `ops/ROADMAP.md:21` (M2) en `ops/playbooks/NIEUW_LAND.md`. Aandachtspunt voor de evaluator en Dennis: de inhoud is toekomstplanning (V4), niet verleden; als het document nog gebruikt gaat worden, past status `actueel` met een concrete lezer. |
| `docs/WORK_HANDOFF_2026-10-23.md` | archief | 2026-10-23 | 1 | - | Handoff-document (naam bevat HANDOFF) van 2026-10-23, Work naar Codex; geen lezer. |

## Verplaatsplan
Voorstel, niet uitgevoerd. Eén `git mv` per rij met status `archief` of `vervangen` (23 stuks), het subpad blijft behouden. Geen enkel doel bestaat in `D` (`git cat-file -e D:<doel>` faalt voor alle 23; `docs/archive/` bestaat niet in `D`). Voor een submap die nog niet bestaat staat één `mkdir -p` vooraan; die regel is geen `git mv`.

```
mkdir -p docs/archive docs/archive/superpowers/plans docs/archive/v4
git mv docs/AFTERNOON_IPAD_BETA_2026-10-26.md docs/archive/AFTERNOON_IPAD_BETA_2026-10-26.md
git mv docs/APPROVED_ARTWORK_COMPUTER_RELEASE.md docs/archive/APPROVED_ARTWORK_COMPUTER_RELEASE.md
git mv docs/CODEX_INTEGRATION_QA_HANDOFF.md docs/archive/CODEX_INTEGRATION_QA_HANDOFF.md
git mv docs/COMPUTER_RELEASE_2026-10-30.md docs/archive/COMPUTER_RELEASE_2026-10-30.md
git mv docs/DISCOVERY_MAP.md docs/archive/DISCOVERY_MAP.md
git mv docs/FOCUS_MODE.md docs/archive/FOCUS_MODE.md
git mv docs/HERMES_QA_RELEASE_1.md docs/archive/HERMES_QA_RELEASE_1.md
git mv docs/INTEGRATED_RELEASE_CANDIDATE.md docs/archive/INTEGRATED_RELEASE_CANDIDATE.md
git mv docs/LEERROUTE_DESIGN.md docs/archive/LEERROUTE_DESIGN.md
git mv docs/MAP_PICKER_58.md docs/archive/MAP_PICKER_58.md
git mv docs/MAP_SELECTION_HOTFIX.md docs/archive/MAP_SELECTION_HOTFIX.md
git mv docs/OFFLINE_COMPUTER_50.md docs/archive/OFFLINE_COMPUTER_50.md
git mv docs/PROJECT_STATE.md docs/archive/PROJECT_STATE.md
git mv docs/RELEASE_1_1.md docs/archive/RELEASE_1_1.md
git mv docs/RELEASE_1_2_INTEGRATION.md docs/archive/RELEASE_1_2_INTEGRATION.md
git mv docs/RELEASE_1_2.md docs/archive/RELEASE_1_2.md
git mv docs/RELEASE_1_INTEGRATION.md docs/archive/RELEASE_1_INTEGRATION.md
git mv docs/ROADMAP.md docs/archive/ROADMAP.md
git mv docs/SCHOOLBLAD_OVERLAY.md docs/archive/SCHOOLBLAD_OVERLAY.md
git mv docs/superpowers/plans/2026-11-04-nino-playable.md docs/archive/superpowers/plans/2026-11-04-nino-playable.md
git mv docs/V2_AFSLUITING.md docs/archive/V2_AFSLUITING.md
git mv docs/v4/FRANKRIJK_HANDOFF.md docs/archive/v4/FRANKRIJK_HANDOFF.md
git mv docs/WORK_HANDOFF_2026-10-23.md docs/archive/WORK_HANDOFF_2026-10-23.md
```

Lezerscontrole (criterium 7): voor elk van de 23 bronpaden is `git grep -nF -e "$p" -e "$(basename "$p")" df72c393e62a0c1e918fdf0e40dac1f7557069f1 -- scripts/ src/ package.json vercel.json` gedraaid. Resultaat: 0 treffers. `npm run lint`, `npm test` en `npm run build` lezen dus geen enkel te verplaatsen bestand, ook niet bij de naam zonder pad. (De identifier `NINO_DISCOVERY_MAP` in `scripts/` is geen pad en matcht niet op `DISCOVERY_MAP.md`.)

## Verwijzingen in projectregels
Alle `docs/…`-paden in `AGENTS.md`, `CLAUDE.md`, `.claude/agents/*.md` en `ops/*.md` (alleen topniveau van `ops/`), uit `D` (df72c39) en `M` (b835a59), gemeten met `for t in D M; do git grep -noE 'docs/[A-Za-z0-9_./-]+' $t -- AGENTS.md CLAUDE.md '.claude/agents/*.md' 'ops/*.md' ':!ops/*/**'; done` en daarna `sed 's/[.)]*$//'`. Kolom "Versie" is de boom waarin de regel staat. De `ops/*.md` van `M` bevat nu ook de verwijzingen van BL-002 zelf en van `BL-005b`.

| Bestand:regel | Versie | Pad | Besluit na het plan (oud → nieuw, of blijft kloppen) |
|---|---|---|---|
| .claude/agents/scout.md:8 | D | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| .claude/agents/scout.md:8 | M | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:5 | D | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:5 | M | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:9 | D | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:11 | M | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:15 | D | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| CLAUDE.md:15 | D | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| CLAUDE.md:15 | M | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/MEMORY.md:10 | D | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/MEMORY.md:10 | M | `docs/DECISIONS.md` | blijft kloppen (`actueel`, staat in `D`) |
| .claude/agents/design-critic.md:10 | D | `docs/DESIGN_SYSTEM.md` | blijft kloppen (`actueel`, staat in `D`) |
| .claude/agents/design-critic.md:10 | M | `docs/DESIGN_SYSTEM.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:5 | M | `docs/MAP_SYSTEM.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:9 | D | `docs/MAP_SYSTEM.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:10 | D | `docs/MAP_SYSTEM.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/MEMORY.md:12 | D | `docs/PRODUCT_SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/MEMORY.md:12 | M | `docs/PRODUCT_SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:5 | M | `docs/PROJECT_STATE.md` | `docs/PROJECT_STATE.md` → `ops/STATE.md` |
| AGENTS.md:9 | D | `docs/PROJECT_STATE.md` | `docs/PROJECT_STATE.md` → `ops/STATE.md` |
| AGENTS.md:11 | M | `docs/PROJECT_STATE.md` | `docs/PROJECT_STATE.md` → `ops/STATE.md` |
| AGENTS.md:15 | D | `docs/PROJECT_STATE.md` | `docs/PROJECT_STATE.md` → `ops/STATE.md` |
| ops/STATE.md:34 | M | `docs/PROJECT_STATE.md` | `docs/PROJECT_STATE.md` → `ops/STATE.md` |
| AGENTS.md:1 | D | `docs/ROADMAP.md` | `docs/ROADMAP.md` → `docs/archive/ROADMAP.md` (de tekst zegt dat het vervangen is; het archiefpad blijft de verwijzing) |
| AGENTS.md:1 | M | `docs/ROADMAP.md` | `docs/ROADMAP.md` → `docs/archive/ROADMAP.md` (de tekst zegt dat het vervangen is; het archiefpad blijft de verwijzing) |
| AGENTS.md:14 | M | `docs/ROADMAP.md` | `docs/ROADMAP.md` → `ops/ROADMAP.md` |
| AGENTS.md:18 | D | `docs/ROADMAP.md` | `docs/ROADMAP.md` → `ops/ROADMAP.md` |
| ops/ROADMAP.md:3 | D | `docs/ROADMAP.md` | `docs/ROADMAP.md` → `docs/archive/ROADMAP.md` (de tekst zegt dat het vervangen is; het archiefpad blijft de verwijzing) |
| ops/ROADMAP.md:3 | M | `docs/ROADMAP.md` | `docs/ROADMAP.md` → `docs/archive/ROADMAP.md` (de tekst zegt dat het vervangen is; het archiefpad blijft de verwijzing) |
| ops/BACKLOG.md:14 | D | `docs/archive/` | klopt na BL-002b (de map ontstaat daar) |
| ops/BACKLOG.md:14 | M | `docs/archive/` | klopt na BL-002b (de map ontstaat daar) |
| ops/ROADMAP.md:11 | D | `docs/archive/` | klopt na BL-002b (de map ontstaat daar) |
| ops/ROADMAP.md:11 | M | `docs/archive/` | klopt na BL-002b (de map ontstaat daar) |
| ops/MEMORY.md:14 | D | `docs/brain/` | `docs/brain/` → rij verwijderen: de map bestaat niet in `D` of `M` (al kapot, buiten BL-002) |
| ops/MEMORY.md:14 | M | `docs/brain/` | `docs/brain/` → rij verwijderen: de map bestaat niet in `D` of `M` (al kapot, buiten BL-002) |
| AGENTS.md:10 | D | `docs/geography/` | blijft kloppen (map bestaat in `D`) |
| ops/LEARNINGS.md:25 | M | `docs/qa` | blijft kloppen (map bestaat in `D`) |
| ops/MEMORY.md:20 | D | `docs/qa/` | blijft kloppen (map bestaat in `D`) |
| ops/MEMORY.md:20 | M | `docs/qa/` | blijft kloppen (map bestaat in `D`) |
| ops/STATE.md:34 | M | `docs/qa/` | blijft kloppen (map bestaat in `D`) |
| ops/BACKLOG.md:19 | M | `docs/qa/v3-reis/` | `docs/qa/v3-reis/` → `archive/v3-qa` (tag, alleen als tekst; advies: map niet mee, zie `## docs/qa/v3-reis/`) |
| ops/STATE.md:23 | M | `docs/qa/v3-reis/` | `docs/qa/v3-reis/` → `archive/v3-qa` (tag, alleen als tekst; advies: map niet mee, zie `## docs/qa/v3-reis/`) |
| .claude/agents/design-critic.md:11 | D | `docs/qa/v3-stijlbeeld/final/` | blijft kloppen (map bestaat in `D`) |
| .claude/agents/design-critic.md:11 | M | `docs/qa/v3-stijlbeeld/final/` | blijft kloppen (map bestaat in `D`) |
| ops/STATE.md:34 | M | `docs/qa/v3-stijlbeeld/final/` | blijft kloppen (map bestaat in `D`) |
| AGENTS.md:5 | D | `docs/v3/OVERDRACHT.md` | blijft kloppen (`actueel`, staat in `D`) |
| .claude/agents/design-critic.md:10 | D | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| .claude/agents/design-critic.md:10 | M | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:5 | D | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/BACKLOG.md:15 | D | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/BACKLOG.md:15 | M | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/HARNESS.md:56 | D | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/HARNESS.md:56 | M | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/MEMORY.md:12 | D | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/MEMORY.md:12 | M | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/QUALITY.md:22 | D | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| ops/QUALITY.md:22 | M | `docs/v3/SPEC.md` | blijft kloppen (`actueel`, staat in `D`) |
| AGENTS.md:3 | D | `docs/v3/STAP0_BRON.md` | blijft kloppen (`actueel`, staat in `D`) |
| .claude/agents/design-critic.md:11 | D | `docs/v3/renders/` | blijft kloppen (map bestaat in `D`) |
| .claude/agents/design-critic.md:11 | M | `docs/v3/renders/` | blijft kloppen (map bestaat in `D`) |
| ops/QUALITY.md:21 | D | `docs/v3/renders/` | blijft kloppen (map bestaat in `D`) |
| ops/QUALITY.md:21 | M | `docs/v3/renders/` | blijft kloppen (map bestaat in `D`) |
| ops/STATE.md:34 | M | `docs/visual/` | blijft kloppen (map bestaat in `D`) |

Toepassing: na het uitvoeren van het verplaatsplan en deze vervangregels wijst geen enkele verwijzing naar een pad dat verplaatst wordt, en elk pad staat in `D` of komt met het plan (`docs/archive/`, `ops/STATE.md`, `ops/ROADMAP.md`). Eén uitzondering: `docs/brain/` bestaat nergens (ook niet in `M`); dat is een bestaand gebrek in `ops/MEMORY.md` en geen gevolg van het plan. In `AGENTS.md` van `M` zijn de vervangregels r.5 en r.11 (`docs/PROJECT_STATE.md` → `ops/STATE.md`) en r.14 (`docs/ROADMAP.md` → `ops/ROADMAP.md`); r.1 laat `docs/ROADMAP.md` staan als "vervangt" en krijgt het archiefpad.

## Linkanalyse
**Wat telt als link.** Elke markdown-link `[tekst](doel)` en afbeelding `![alt](doel)` in een `*.md`-bestand van `D` (de hele boom, ook `assets/**/README.md`, `work-sync/` en de rootbestanden). Overgeslagen: doelen met een schema (`http:`, `https:`, `mailto:`, `data:`, `file:`), alleen-anker (`#…`) en lege doelen. Van het doel worden `#anker` en `?query` afgehaald, daarna URL-decodering (`%20`). Titels (`"…"`) worden verwijderd; `<…>` wordt uitgepakt. Codevoorbeelden worden niet apart behandeld (ook een link in een codeblok telt, conservatief). Niet gedekt: referentie-links (`[x][y]`), HTML (`<a href>`, `<img src>`) en kale paden in backticks. Controle: `git grep -ohE '\]\([^)]*\)' D -- '*.md' | wc -l` geeft 359; dat zijn de 338 gecontroleerde plus 21 `http(s)`-links, 0 anker-links. Een link is kapot als het doel niet in `D` bestaat, of als het wel bestaat maar na het verplaatsplan niet meer op dezelfde linktekst bereikbaar is.

**Oplossing van het doel.** Eerst relatief aan het bronbestand, dan vanaf de repo-root (`/pad` telt als root). Bestaat een kandidaat als bestand of map in `D`, dan bestaat het doel.

**Oorzaken.** (a) het doel staat niet in `D` maar wel in `V`, dus het valt in `E` (door de uitsluitingen); (b) het doel staat ook in `V` niet (al kapot); (c) het doel bestaat in `D` maar het plan verplaatst het doel of het bronbestand, zodat dezelfde linktekst niet meer werkt; (d) overig: komt niet voor. Volgorde: (c) voor bestaande doelen, anders (a) als het in `V` staat, anders (b).

**Hoe te draaien.** Het script leest `D` via `git`, en het verplaatsplan uit dit rapport (de `git mv`-regels onder `## Verplaatsplan`); het schrijft niets. Extraheren en draaien (vanuit de repo-root, op de taakbranch):

`sed -n '/^## Linkanalyse/,/^## Besluit/p' ops/reports/docs-inventaris.md | awk '/^```python/{f=1;next} /^```/{f=0} f' > "$TMPDIR/linkscan.py"` en daarna `python3 -I "$TMPDIR/linkscan.py" df72c393e62a0c1e918fdf0e40dac1f7557069f1 55b4d86ea15fc3824c4180b99cb9a18167fcccd2 ops/reports/docs-inventaris.md [--detail|--incoming|--groups]`

```python
#!/usr/bin/env python3
# Gebruik: python3 -I linkscan.py <D-sha> <V-sha> <rapport.md> [--detail|--incoming]
# Alleen lezend: git ls-tree / git cat-file --batch. Schrijft niets.
import subprocess, sys, re, posixpath
from urllib.parse import unquote
D, V, REPORT = sys.argv[1], sys.argv[2], sys.argv[3]
MODE = sys.argv[4] if len(sys.argv) > 4 else ''
def git(*a):
    return subprocess.run(['git', *a], check=True, capture_output=True).stdout
def paths(t):
    return set(p for p in git('ls-tree', '-r', '--name-only', '-z', t).decode().split('\0') if p)
def dirs(ps):
    return {posixpath.dirname(p) for p in ps for _ in [0]} | {d for p in ps for d in all_parents(p)}
def all_parents(p):
    out, d = [], posixpath.dirname(p)
    while d:
        out.append(d); d = posixpath.dirname(d)
    return out
Dp, Vp = paths(D), paths(V)
Dd = {d for p in Dp for d in all_parents(p)}
Vd = {d for p in Vp for d in all_parents(p)}
# verplaatsplan uit het rapport: regels 'git mv <bron> <doel>' tussen '## Verplaatsplan' en de volgende '## '
moved = {}
try:
    sec = False
    for line in open(REPORT, encoding='utf-8'):
        if line.startswith('## '): sec = line.startswith('## Verplaatsplan')
        m = re.match(r'^git mv (\S+) (\S+)$', line.strip()) if sec else None
        if m: moved[m.group(1)] = m.group(2)
except FileNotFoundError:
    pass
mdfiles = sorted(p for p in Dp if p.endswith('.md'))
# alle blobs in een keer lezen
inp = ''.join(f'{D}:{p}\n' for p in mdfiles).encode()
proc = subprocess.run(['git', 'cat-file', '--batch'], input=inp, capture_output=True, check=True).stdout
pos, content = 0, {}
for p in mdfiles:
    hdr_end = proc.index(b'\n', pos)
    _, _, size = proc[pos:hdr_end].decode().split()
    size = int(size)
    content[p] = proc[hdr_end+1:hdr_end+1+size].decode('utf-8', 'replace')
    pos = hdr_end + 1 + size + 1
LINK = re.compile(r'(!?)\[[^\]\n]*\]\(([^)\n]*)\)')
SCHEME = re.compile(r'^[A-Za-z][A-Za-z0-9+.-]*:')
def target(raw):
    t = raw.strip()
    if t.startswith('<') and '>' in t: t = t[1:t.index('>')]
    else: t = re.sub(r'\s+("[^"]*"|\'[^\']*\')\s*$', '', t)
    if not t or t.startswith('#') or SCHEME.match(t): return None
    t = unquote(re.split(r'[#?]', t, 1)[0])
    return t or None
def cands(src, t):
    # (soort, pad): 'rel' = relatief aan het bronbestand, 'root' = vanaf de repo-root
    if t.startswith('/'): cs = [('root', posixpath.normpath(t.lstrip('/')))]
    else: cs = [('rel', posixpath.normpath(posixpath.join(posixpath.dirname(src), t))), ('root', posixpath.normpath(t))]
    out = []
    for k, c in cs:
        if not c.startswith('..') and c != '.' and (k, c) not in out: out.append((k, c))
    return out
def exists(c, P, Dr): return c in P or c in Dr
links = []  # (src, lineno, img, raw target, resolved candidates)
for src in mdfiles:
    for i, line in enumerate(content[src].split('\n'), 1):
        for m in LINK.finditer(line):
            t = target(m.group(2))
            if t is None: continue
            links.append((src, i, m.group(1) == '!', t, cands(src, t)))
broken, incoming = [], {}
def after_move(src, t, k, c):
    # lost dezelfde linktekst na het verplaatsplan nog steeds op naar het (eventueel verplaatste) doel?
    newsrc = moved.get(src, src)
    res = posixpath.normpath(posixpath.join(posixpath.dirname(newsrc), t)) if k == 'rel' else posixpath.normpath(t.lstrip('/'))
    return res == moved.get(c, c)
for src, i, img, t, cs in links:
    for k, c in cs:
        if c in Dp and c != src: incoming[c] = incoming.get(c, 0) + 1; break
    here = [(k, c) for k, c in cs if exists(c, Dp, Dd)]
    if here:
        if any(after_move(src, t, k, c) for k, c in here): continue
        if any(c in moved for k, c in here): cause = 'c'    # doel verplaatst
        elif src in moved: cause = 'cb'                       # bronbestand verplaatst
        else: cause = 'd'                                     # overig
    elif any(exists(c, Vp, Vd) for k, c in cs): cause = 'a'
    else: cause = 'b'
    broken.append((src, i, img, t, cs[0][1], cause))
tot = {k: sum(1 for b in broken if b[5] == k) for k in ('a', 'b', 'c', 'cb', 'd')}
print(f'md-bestanden gescand: {len(mdfiles)}')
print(f'links gecontroleerd: {len(links)}')
print(f'verplaatste bronnen in plan: {len(moved)}')
print(f'gebroken totaal: {len(broken)}  (a) doel in E: {tot["a"]}  (b) al kapot in V: {tot["b"]}  (c) door eigen plan: {tot["c"] + tot["cb"]} [c-doel {tot["c"]}, c-bron {tot["cb"]}]  (d) overig: {tot["d"]}')
def tag(path):
    for pre, tg in (('docs/qa/', 'archive/v3-qa'), ('docs/visual/', 'archive/v3-visual'), ('output/installers/', 'archive/v3-installers'), ('output/html/', 'archive/v3-output-html')):
        if path.startswith(pre): return tg
    return None
groups = {}
for src, i, img, t, c0, cause in broken:
    if src in moved: g = 'laten (bron is archief/vervangen)'
    elif cause in ('c', 'cb'): g = '3 herschrijven naar docs/archive/'
    elif cause == 'a': g = '2 herschrijven naar tag ' + (tag(c0) or '?')
    else: g = '4 link weghalen (al kapot in V, of overig)'
    groups[g] = groups.get(g, 0) + 1
for g in sorted(groups): print(f'groep {g}: {groups[g]}')
if MODE == '--detail':
    for src, i, img, t, c0, cause in broken: print(f'{src}:{i} [{cause}] {"img " if img else ""}{t} -> {c0}')
if MODE == '--incoming':
    for p in sorted(incoming): print(f'{incoming[p]}\t{p}')
if MODE == '--groups':
    from collections import Counter
    print(Counter((s, c) for s, _, _, _, _, c in broken))
```

**Uitkomst** (`python3 -I linkscan.py D V ops/reports/docs-inventaris.md`):

```text
md-bestanden gescand: 101
links gecontroleerd: 338
verplaatste bronnen in plan: 23
gebroken totaal: 281  (a) doel in E: 256  (b) al kapot in V: 0  (c) door eigen plan: 25 [c-doel 4, c-bron 21]  (d) overig: 0
groep 2 herschrijven naar tag archive/v3-qa: 56
groep 2 herschrijven naar tag archive/v3-visual: 16
groep 3 herschrijven naar docs/archive/: 4
groep laten (bron is archief/vervangen): 205
```

Definitie van de groepen staat in `## Besluit per gebroken link`. Vergelijking met de bekende gevallen (criterium 10, uit `--detail`):
- `docs/v3/AUDIT.md:24` en `docs/v3/GE01.md:3` → `docs/qa/v3-reis/`: beide aanwezig (oorzaak a).
- `docs/MAP_SYSTEM.md:83` → `docs/visual/map-picker-58-revision/README.md`: aanwezig (a). `docs/MAP_SYSTEM.md:58` en `:64` zijn nieuw: ze wijzen naar `MAP_SELECTION_HOTFIX.md` en `MAP_PICKER_58.md`, die door het plan worden verplaatst (c).
- `docs/DECISIONS.md:202` en `:226` → `docs/qa/nino-v2-closure-67/README.md` en `docs/qa/ux-20261107/README.md`: aanwezig (a); dit zijn de enige twee `qa/`-links in `DECISIONS.md` (`git grep -nE '\]\([^)]*qa/' D -- docs/DECISIONS.md`).
- `docs/qa/v3-stijlbeeld/README.md`: 47 links, 42 kapot. Daarvan zijn 41 de links naar bestanden in `docs/qa/v3-stijlbeeld/` zelf (het getal 41 uit `integratie.md`), plus 1 naar `../v3-glas/README.md` (r.90), die buiten de eigen map wijst (`docs/qa/v3-glas/` staat in `V`, niet in `D`). Verklaring van het verschil met het contract (46 links, 41 kapot): het contract telde alleen links binnen de map; de evaluator heeft dit bevestigd.
- Het aantal (a) is 256 (contract: ±240, grens 30% = 168 tot 312): binnen de grens.
- De regexp-telling van het contract (`\]\([^)h#][^)]*\)`) levert 338 treffers met `git grep -ohE` (elke treffer apart, `-o`); met `git grep -nE` zijn het 171 regels, want een regel kan meerdere links hebben. Het script controleert 338 links. De 21 `http(s)`-links vallen buiten beide.

## Besluit per gebroken link
Elke gebroken link valt in precies één groep. Een bron is "archief" als hij in het verplaatsplan staat (status `archief` of `vervangen`), anders "actueel" (ook alle bestanden buiten `I`: `assets/**/README.md`, `work-sync/`, `ops/`, `docs/qa/**/README.md`).

| Groep | Besluit | Voor | Aantal |
|---|---|---|---|
| 1 | Doel alsnog meenemen in BL-005b (pad plus bytes) | links vanuit `actueel`, doel in `E` | 0 (zie `## docs/qa/v3-reis/`: niet mee; geen ander doel is het meenemen waard) |
| 2 | Herschrijven naar de archieftag (`archive/v3-qa` of `archive/v3-visual`) | links vanuit `actueel`, oorzaak (a) | 72 |
| 3 | Herschrijven naar het nieuwe pad in `docs/archive/` | links vanuit `actueel`, oorzaak (c) | 4 |
| 4 | Link weghalen (tekst blijft) | links vanuit `actueel`, oorzaak (b) | 0 |
| laten | Laten zoals ze zijn, expliciet benoemd | links vanuit `archief`/`vervangen`-bestanden (oorzaken a en c) | 205 |
| | **Totaal** | | **281** (gelijk aan het totaal uit `## Linkanalyse`: 281) |

Permalinkformaat voor groep 2 (de tags `archive/v3-qa` en `archive/v3-visual` staan in `ops/reports/integratie.md` §Grootte per pad; ze worden door BL-005c gezet): `https://github.com/dennisariens/topo/blob/<tag>/<pad>` voor gewone links en `https://github.com/dennisariens/topo/raw/<tag>/<pad>` voor afbeeldingen, met het pad zoals in `V` (bijvoorbeeld `https://github.com/dennisariens/topo/blob/archive/v3-qa/docs/qa/v3-reis/README.md`). `archive/v3-visual` geldt voor doelen onder `docs/visual/`, `archive/v3-qa` voor doelen onder `docs/qa/`. De tag-aanduiding bevat een `/`; GitHub lost dat op zolang er geen tak met dezelfde naam bestaat (niet geverifieerd, de tags bestaan nog niet).

Groep 2 in cijfers: 56 links naar `docs/qa/` (tag `archive/v3-qa`), 16 naar `docs/visual/` (tag `archive/v3-visual`). Groep 3 zijn de vier links die door het plan breken: `docs/MAP_SYSTEM.md:58` en `:64` (nieuw pad `docs/archive/MAP_SELECTION_HOTFIX.md` en `docs/archive/MAP_PICKER_58.md`), `docs/v3/AUDIT.md:25` (`docs/archive/V2_AFSLUITING.md`) en `work-sync/2026-10-23/README.md:3` (`docs/archive/WORK_HANDOFF_2026-10-23.md`). Voor "laten" geldt: de bronbestanden zijn historie; hun relatieve links (naar `../assets/…`, `geography/…` en `docs/qa/…`) blijven kapot, ook de 21 die alleen door het verplaatsen kapot gaan. Een mechanische herstelslag (`../` toevoegen) is mogelijk, maar valt buiten dit besluit en buiten BL-002b.

## docs/qa/v3-reis/
- In `V`: 33 bestanden, 15 956 760 bytes (`git ls-tree -r -l 55b4d86ea15fc3824c4180b99cb9a18167fcccd2 -- docs/qa/v3-reis/ | awk '{n++; s+=$4} END{print n, s}'` geeft `33 15956760`).
- Links ernaar in `D`: 3 in totaal, waarvan 2 vanuit `actueel`-bestanden (`docs/v3/AUDIT.md:24` en `docs/v3/GE01.md:3`) en 1 vanuit bestanden die naar het archief gaan (`docs/PROJECT_STATE.md:27`).
- **Advies: niet meenemen in BL-005b.** Reden: slechts 2 links raken `actueel`-documenten en die kunnen naar de tag `archive/v3-qa` wijzen (groep 2); de overige 1 staat in een document dat naar het archief gaat. Effect op de repogrootte: meenemen is +15 956 760 bytes (± 16.0 MB), dat is +26% bovenop de 60 590 182 B `docs/qa/` die al meegaat en +2.8% van `DRY` (572 336 202 B, 922 bestanden: `git ls-tree -r -l df72c393e62a0c1e918fdf0e40dac1f7557069f1 | awk '{s+=$4} END{print s}'`; de 500 273 227 B uit `V` min `E` is een andere maat, want in `DRY` zit ook de inhoud van `art/master`). Niet meenemen houdt `docs/qa/` bij de 128 bestanden die nu al meegaan (`git ls-tree -r df72c393e62a0c1e918fdf0e40dac1f7557069f1 -- docs/qa | wc -l`; `docs/visual/` heeft er 1 extra) en laat het bewijs bereikbaar via de tag. Het is dus een kleine vermindering, geen noodzaak voor de build; afwegen blijft aan Dennis bij het G4-moment van BL-005b.

## Uitvoering
- **Wanneer:** vervolgtaak **BL-002b** draait op `main`, direct na BL-005b stap 2 (de squash van `V`), of als laatste commit in dezelfde PR.
- **Waarom niet eerder:** op `main` staan nu 9 bestanden in `docs/`; de release- en handoff-documenten komen pas met `V` mee (BL-005b). Nu verplaatsen geeft bij de squash van `V` conflicten of dubbele kopieën, en de linkreparatie hangt af van wat BL-005b uitsluit.
- **Wat BL-002b doet:** (1) het verplaatsplan uit `## Verplaatsplan` (23 `git mv`'s plus `mkdir -p`); (2) de vervangregels uit `## Verwijzingen in projectregels` in `AGENTS.md`, `CLAUDE.md`, `.claude/agents/*.md` en `ops/*.md`; (3) de linkherschrijvingen uit `## Besluit per gebroken link` voor de groepen 2, 3 en 4 (76 links in actuele bestanden); groep "laten" blijft staan; (4) het linkscript uit dit rapport opnieuw draaien tegen de nieuwe `main`.
- **Omvang:** S (M als de 72 herschrijvingen naar de tag veel handwerk blijken). Niet L.
- **Bouwer:** `builder`; de `git mv`-lijst kan naar `codex-worker`.
- **Gate:** geen eigen gate; valt binnen het G4-moment van BL-005b zolang `main` productie is. Toets: het linkscript op de nieuwe `main` geeft 0 gebroken links vanuit `actueel`-bestanden.
- **Volgorde met BL-005b/BL-005c:** de tags `archive/v3-qa` en `archive/v3-visual` (BL-005c) moeten bestaan voordat groep 2 wordt herschreven.

## Open punten voor de evaluator en Dennis
- `docs/v4/FRANKRIJK_HANDOFF.md` staat op `archief` omdat de naam HANDOFF bevat en er geen concrete lezer is (criterium 4). Het is toekomstplanning voor het Frankrijk-spoor (`ops/ROADMAP.md` M2); als Dennis het in `docs/` wil houden, is dat een besluit met een lezer.
- `CONTENT_MODEL.md`, `LEARNING_MODEL.md` en `PRODUCT_SPEC.md` (alle 2026-09-28) staan op `actueel` omdat er geen opvolger is; mogelijk deels verouderd.
- Alle `docs/v3/`-documenten staan op `actueel` omdat V3 nog niet getagd is; herijken na `v3.0.0`.
- Het oordeel actueel/archief is voor ca. de helft van de rijen een oordeel; de reden noemt per rij het feit (datum, lezer, opvolger, kop).
