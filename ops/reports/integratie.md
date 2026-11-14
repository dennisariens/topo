# Integratieplan `codex/topo-v3` + `art/master` naar `main` (BL-005)

Datum: 2026-11-14 · contract `ops/contracts/BL-005.md` · bouwer: builder (Sonnet) · evaluator oordeelt, dit rapport claimt geen PASS.

## Rapportkop (alles hieronder meet tegen deze sha's, niet tegen branchnamen)
| Naam | Sha | Wat |
|---|---|---|
| `M` | `8a821a8c89bfca2889d27751f023a1d19754ec3a` | `origin/main` |
| `V` | `55b4d86ea15fc3824c4180b99cb9a18167fcccd2` | `origin/codex/topo-v3` |
| `A` | `7714e22d137aeda3fbd858549153a6008623f9f7` | `origin/art/master` |
| `MB` | `7e38160cb2f1f1c159c907e0150464b78c761f38` | merge-base van `M`/`V`, `M`/`A` en `V`/`A` (alle drie gelijk) |
| `T1` (tussen) | `13d3f36dc74d91795177c2168b29898ce4837e70` | na stap 1 (`M` + `A`, squash) |
| `DRY` | `c0265cd041659735f2edeee92b7226ba4c10fea8` | na stap 2 (`T1` + `V`, squash, met uitsluitingen) |

Voor/achter (`git rev-list --left-right --count X...Y`, links = alleen in X): `M...V` = 6 / 226 · `M...A` = 6 / 19 · `V...A` = 226 / 19. `M` heeft 6 eigen commits (alleen `ops/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`, `docs/DECISIONS.md`). `A` zit niet in `V` (`git merge-base --is-ancestor A V` is onwaar). `git cherry M V`: 219 uniek, 0 al in `main` (plus 7 merge-commits die `cherry` overslaat); `git cherry M A`: 19 uniek, 0 al in `main`.

Gebruikte commando's (macOS: `shasum` in plaats van `sha1sum`; zsh: gebruik `${=var}` bij een lijst in een variabele):
```
git fetch origin                                   # zonder --prune
git merge-base M V ; git merge-base M A
git rev-list --left-right --count M...V ; M...A ; V...A
git merge-tree --write-tree --name-only --no-messages <ours> <theirs>
git ls-tree -r -l <sha> -- <pad> | awk '{n++; s+=$4} END{print n, s}'
git for-each-ref refs/heads refs/tags | shasum     # criterium 12
```
Refs voor: hash `1c37aca2ddedf31484d4ea3418e694df8a480eea` (48 regels), volledige uitvoer in `/private/tmp/claude-501/-Users-dennisariens-topo-bl005/f5d74507-fae8-40b8-887f-d7023eecae3c/scratchpad/refs-voor.txt`. Refs na: zie `## Controle refs` onderaan en `refs-na.txt` in dezelfde map.

Hoe `T1` en `DRY` zijn gemaakt: `T1` met `git merge --squash A` in `/Users/dennisariens/topo-bl005-dryrun` (detached) plus handmatige oplossing van `docs/DECISIONS.md`. `DRY` is **niet** met `merge --squash` in een volle checkout gemaakt (schijf, zie Afwijkingen) maar met git-plumbing: `git merge-tree --write-tree T1 V`, de drie conflictbestanden vervangen in een tijdelijke index (`GIT_INDEX_FILE`), de uitsluitingen met `git update-index --force-remove` verwijderd, `git write-tree` en `git commit-tree -p T1`. Daarna is `DRY` uitgecheckt in de dry-run-worktree en daar zijn `npm ci`, lint, test en build gedraaid. Het resultaat is dezelfde boom als een squash-merge met handmatige oplossing; er is geen ref aangemaakt.

## Samenvatting
- **Aanbeveling:** stap 1 = `art/master` (squash), stap 2 = `codex/topo-v3` (squash, zonder `docs/qa/` en `docs/visual/`), elk als eigen PR naar `main`. Art eerst, omdat het klein is (83 paden, 1 conflictbestand) en niet van G3 afhangt; V wacht op G3.
- **DRY is groen:** `npm ci` 0, `npm run lint` 0, `npm test` 0, `npm run build` 0. `dist/index.html` is byte-gelijk aan de nulmeting op `V` (41 445 845 bytes).
- **Grootste winst:** de boom van `V` is 1 355 802 195 bytes (2981 bestanden). `DRY` is 512 277 127 bytes (795 bestanden), tegen 3 212 416 bytes (82 bestanden) op `M`. `docs/qa/` en `docs/visual/` (728 MB) blijven buiten `main`; wat `DRY` ten opzichte van `M` groot maakt zijn `assets/` (+ `assets/art/`), `output/html/` en `index.html`.
- **Niet geverifieerd:** G3 (iPad, Hermes) en elke inhoudelijke werking; dit rapport toetst alleen mergebaarheid, build en de bestaande testset.

## Volgorde
Beide volgordes zijn vergeleken met `git merge-tree --write-tree --name-only --no-messages` (stap 2 met de echte tussen-commit van elke volgorde).

| Volgorde | Stap 1 conflicten | Stap 2 conflicten | Opmerking |
|---|---|---|---|
| **A: art eerst** (gekozen) | `M`+`A`: `docs/DECISIONS.md` | `T1`+`V`: `.gitignore`, `AGENTS.md`, `docs/DECISIONS.md` | stap 1 klein en los van G3 |
| B: V eerst | `M`+`V`: `AGENTS.md`, `docs/DECISIONS.md` | alt-tussen+`A`: `.gitignore`, `docs/DECISIONS.md` | stap 1 is meteen de grote, G3-afhankelijke stap |
Rechtstreeks `V`+`A`: `.gitignore`, `docs/DECISIONS.md`. Dezelfde drie bestanden komen in beide volgordes voor; de volgorde verandert dus de moeilijkheid niet, wel het risico en de afhankelijkheid van G3.

1. **Stap 1: `A` (`art/master`) naar `main`.** Bron `origin/art/master` (`7714e22`), doel `main` (`M`), methode **squash-merge**. Reden: 19 commits met alleen `assets/art/` (80 bestanden, 72 MB), `docs/ASSET_BRIEF.md`, `.gitignore` en één DECISIONS-sectie; één commit houdt `main` leesbaar (`GIT_RELEASE.md` §2) en de artwork hangt niet van G3 af (geen app-code). Conflict: alleen `docs/DECISIONS.md`. Resultaat: `T1`.
2. **Stap 2: `V` (`codex/topo-v3`) naar `main`.** Bron `origin/codex/topo-v3` (`55b4d86`), doel `main` na stap 1 (`T1`), methode **squash-merge**, met de uitsluitingen uit `## Grootte per pad`. Reden: 226 commits (7 merges, 136 van Dennis, 57 van Claude, 33 van `dennisariens`) met 1463 + 844 QA- en visual-bestanden in de historie; een merge-commit zou al die blobs (1,0 GB unieke bytes in de boom van `V`) in de eerste-ouderlijn van `main` brengen, een squash met uitsluitingen niet. De volledige historie blijft bereikbaar via een tag op `V` (zie Rollback). Conflicten: `.gitignore`, `AGENTS.md`, `docs/DECISIONS.md`. Resultaat: `DRY`.

**Vergelijking van de twee volgordes.**
- *Conflicten:* gelijk in omvang (3 bestanden totaal), maar bij B zit het `AGENTS.md`-conflict in de G3-afhankelijke stap en moet de art-PR wachten tot na de V-PR.
- *Risico:* A heeft in stap 1 een PR van 83 paden zonder code. B heeft in stap 1 een PR van ~670 paden met app-code.
- *G3-afhankelijkheid:* stap 1 van A kan vóór G3 klaar staan (alleen G4 als `main` productie is); stap 2 pas na G3. Bij B hangt alles aan G3.
- *Risico van A:* de V-boom bevat zelf al kopieën van master-assets (`assets/v3`); `git merge-tree V A` toont daar geen conflict (alleen `.gitignore` en `docs/DECISIONS.md`), dus er is geen dubbel werk of pad-botsing.

**Conflictoplossing (criterium 3 en 4).** Alle drie de bestanden hebben aan beide kanten toevoegingen op dezelfde plek, dus geen van de drie heeft een inhoudelijk tegenstrijdige wijziging.
| Stap | Bestand | Strategie | Reden |
|---|---|---|---|
| 1 (`M`+`A`) | `docs/DECISIONS.md` | union, chronologisch: basis, sectie `A` (2026-11-10), sectie `M` (2026-11-13) | beide kanten voegen aan het einde een nieuw besluit toe; niets valt weg. Alleen de hunks vanaf `MB` zijn gelezen |
| 2 (`T1`+`V`) | `docs/DECISIONS.md` | union, chronologisch: basis, 856 regels uit `V` (2026-10-23 t/m 2026-11-11) met de `A`-sectie (11-10) vóór de eerste 2026-11-11-sectie, daarna de `M`-sectie (11-13) | `V` voegt 856 regels toe, `A` en `M` elk 4. De `V`-sectie "Release 1.2" heeft geen datum en blijft op de plek waar `V` haar zette |
| 2 | `AGENTS.md` | union: de 2 regels van `M` (verwijzing naar `ops/`) bovenaan, daarna het volledige `V`-bestand | `M` en `V` voegen beide bovenaan toe; `V` wijzigt daarnaast regels 2 en 4 van de lijst, `M` niet. Zo gelden de `src/v2`-regel en de `ops/`-verwijzing allebei |
| 2 | `.gitignore` | union: `M`/basis + 3 regels van `A` + 1 regel van `V` | beide kanten voegen regels aan het einde toe |

Controle criterium 4 (uitgevoerd op `DRY`, uitvoer leeg): `comm -23` op `.gitignore` voor `M`, `V`, `A` en op `^#`-regels van `docs/DECISIONS.md` voor `M`, `V`, `A`: alle zes leeg. `git grep -nE '^(<<<<<<<|>>>>>>>) ' DRY`: 0 treffers.

Controle criterium 5 (uitgevoerd): 783 paden buiten conflicten en uitsluitingen (81 uit `A`, 658 uit `V`, 44 uit `M`); blob-sha gelijk aan `DRY` voor alle 783; 0 afwijkingen (ook voor verwijderde paden).

**Conflictlijsten per stap voor `comm -3` (criterium 3):**
- Stap 1: `git merge-tree --write-tree --name-only --no-messages 8a821a8c89bfca2889d27751f023a1d19754ec3a 7714e22d137aeda3fbd858549153a6008623f9f7` geeft `docs/DECISIONS.md`.
- Stap 2: `git merge-tree --write-tree --name-only --no-messages 13d3f36dc74d91795177c2168b29898ce4837e70 55b4d86ea15fc3824c4180b99cb9a18167fcccd2` geeft `.gitignore`, `AGENTS.md`, `docs/DECISIONS.md`.

**Hoe `art/master` langlopend blijft.** Na een squash heeft `art/master` geen gedeelde geschiedenis met `main`; de eerste sync-back moet dus een echte merge zijn. Getest: `git merge-tree --write-tree A DRY` geeft conflicten in `.gitignore` en `docs/DECISIONS.md`; met `-X theirs` (`main` wint) is het resultaat conflictvrij en de uitkomstboom is gelijk aan de boom van `DRY` (`313984df9d41c6544ef6e8da0184201f3b86de31`). Regel: na elke merge van `art/master` naar `main` doet de art-eigenaar `git switch art/master && git merge -X theirs origin/main` (merge-commit, nooit rebase of force-push). Alleen `assets/` wordt op `art/master` bewerkt (`GIT_RELEASE.md` §1: code gaat via taakbranches), dus `-X theirs` kan geen eigen werk overschrijven. Vastleggen in `GIT_RELEASE.md`: BL-005d.

## Grootte per pad
Boom van `V` (`git ls-tree -r -l V`): 2981 bestanden, 1 355 802 195 bytes. Uitsluitingen staan in de laatste kolom; "mee" betekent: volledig in `DRY`. BL-002 (docs-inventaris) is nog niet uitgevoerd; elk besluit hieronder is voorlopig en geldt tot BL-002 een ander pad aanwijst.

| Pad | Bestanden | Bytes | Besluit | Reden |
|---|---|---|---|---|
| `docs/qa/` | 1463 | 549 773 979 | **niet mee**, op één bestand na (`docs/qa/nino-v2-closure-67/artwork-manifest.json`); archief: tag `archive/v3-qa` op `V` | rapporten, schermafbeeldingen en logs van eerdere QA-rondes. Geen runtimegebruik. De build leest één bestand uit deze map (`scripts/embed-nino-v2.mjs`, `focus-source.mjs`): zonder dat bestand stopt `npm run build` met ENOENT (zelf gemeten). Dat bestand blijft dus mee. BL-002 |
| `docs/visual/` | 844 | 178 782 856 | **niet mee**, op één bestand na (`docs/visual/map-picker-58/collision-results.json`); archief: tag `archive/v3-visual` op `V` | uitvoer van oude visuele controles. `scripts/map-hit.test.mjs` leest dat ene bestand; de rest wordt nergens gelezen door lint, test of build. BL-002 |
| `assets/` | 359 | 136 266 752 | **mee** | runtime-assets die de build insluit (`assets/nino`, `assets/v2`, `assets/v3`, `assets/discovery`, `assets/map-selection`). Komt boven op `assets/art/` (72 MB, via stap 1) |
| `scripts/` | 193 | 1 536 474 | **mee** | build, lint en tests; 1,5 MB. Ook de `qa-*`-scripts gaan mee, ze verwijzen naar `docs/qa/`, maar draaien niet in `npm test` |
| `overig` | 122 | 489 442 134 | **gesplitst, zie subtabel** | = totaal min de vier rijen hierboven |

Controle: 1463 + 844 + 359 + 193 + 122 = 2981 bestanden; 549 773 979 + 178 782 856 + 136 266 752 + 1 536 474 + 489 442 134 = 1 355 802 195 bytes.

### Subtabel `overig` (122 bestanden, 489 442 134 bytes)
| Pad | Bestanden | Bytes | Besluit | Reden |
|---|---|---|---|---|
| `output/html/` | 9 | 372 519 147 | **deels mee**: 6 mee (248 678 976 B), 3 niet mee (123 840 171 B): `NINO-2-Proefversie-2026-11-04.html`, `-11-06.html`, `-11-07.html`; archief: tag `archive/v3-output-html` op `V` | vier bestanden zijn byte-gelijk aan `index.html` (zelfde blob, kost geen extra opslag); `lint` en tests vergelijken ze met `index.html`. `NINO-2-Proefversie-2026-11-07-r2.html` en `NINO-2-Ontwerppreview-2026-11-07-r2.html` schrijft de build en leest `nino-ux-round.test.mjs`. De drie oudere proefversies worden nergens gelezen |
| `output/installers/` | 3 | 65 080 631 | **niet mee**; archief: tag `archive/v3-installers` op `V` | DMG en ZIP van NINO 2.0.2; release-artefacten, geen broncode. Bron is `scripts/package-installers.mjs`. Beter als release-bijlage |
| `output/art/`, `output/pdf/`, `output/demo/` | 6 | 2 971 048 | **mee** | `lint` en `build` lezen `output/art/*.webp`, `output/pdf/print-source.sha256` en `printboek.pdf` |
| `index.html` | 1 | 41 445 845 | **mee** | de gebouwde app; productie serveert `dist/index.html` daarvan. Grootte-budget: zie `## Groottemeting`. Bron staat in `src/v2/` (AGENTS.md van `V`) |
| overige 103 bestanden (`docs/` rootbestanden, `docs/v3/` 3,9 MB, `src/v2/`, `print.html`, `installers/`, `geography/`, `work-sync/`, `package*.json`, ...) | 103 | 7 425 463 | **mee** | klein. Release- en handoff-bestanden in `docs/` (`RELEASE_1_*`, `*_HANDOFF*`, `COMPUTER_RELEASE_*`, ...; ~0,1 MB) gaan **niet** in deze integratie naar `docs/archive/`: tests of `AGENTS.md`-verwijzingen kunnen ernaar wijzen. Verplaatsen is BL-002 |

Samen uitgesloten uit `DRY`: 2311 bestanden, 915 588 043 bytes (boom van `V`). Exacte uitsluitingslijst: `comm -23 <(git ls-tree -r --name-only V | sort) <(git ls-tree -r --name-only DRY | sort)`; alle 2311 paden liggen onder `docs/qa/`, `docs/visual/`, `output/installers/` of zijn een van de drie genoemde `output/html/`-bestanden.

Check op de uitsluitingen (grep): `grep -nE 'docs/qa|docs/visual|output/installers|Proefversie-2026-11-0[467]'` in `scripts/`, `package.json`, `src/`, `vercel.json` van `V`. Alleen deze lezers in de keten `lint`/`test`/`build`: `embed-nino-v2.mjs` en `focus-source.mjs` (manifest, blijft mee) en `map-hit.test.mjs` (collision-results, blijft mee). De overige treffers zitten in `qa-*`, `audit-*`, `close-*`, `inventory-*` en `package-installers.mjs`, die geen onderdeel van `npm run lint|test|build` zijn (wel van `release:check`: `audit-release-1-2` en `audit-map-picker-revision` schrijven naar `docs/visual/`; zie risico's).

## Groottemeting
| Meting | `M` | `V` | `DRY` |
|---|---|---|---|
| Boom (`git ls-tree -r -l`), bestanden / bytes | 82 / 3 212 416 | 2981 / 1 355 802 195 | 795 / 512 277 127 |
| `du -sk dist` (na `npm run build`) | n.v.t. (geen build van `M` gedraaid) | 43 532 | 43 532 |
| `wc -c dist/index.html` | n.v.t. | 41 445 845 | 41 445 845 |
Afwijking `dist/index.html` `DRY` vs `V`: 0 bytes (0 %). **Budget "HTML ≤ referentie + 10%" (`QUALITY.md`): PASS** (0 % boven de nulmeting; wel nog groter dan wat een iPad 9 comfortabel aankan: 41 MB, zie risico's in `ops/STATE.md`). De referentie voor het budget is hier `V`, omdat `M` geen V3-referentie heeft.

## Testresultaat
Alle commando's draaien in de worktree op `DRY` (`/Users/dennisariens/topo-bl005-dryrun`) en op `V` (`/Users/dennisariens/topo-bl005-v3ref`), Node v25.8.2, npm 11.11.1. Logs: `dry-*.log`, `ref-*.log`, `refsparse-*.log` in de scratchpad (`.../scratchpad/`).
| Commando | `V` nulmeting (volle boom) | `V` nulmeting (zonder `docs/qa` en `docs/visual`, op 2 bestanden na) | `DRY` |
|---|---|---|---|
| `npm ci` | 0 | n.v.t. (dezelfde `node_modules`) | 0 |
| `npm run lint` | 0 | 0 | 0 |
| `npm test` | 0 | 0 | 0 |
| `npm run build` | **1: ENOSPC** (schijf vol tijdens `cpSync`, geen codefout; zie Afwijkingen) | 0 (met `artwork-manifest.json`); zonder dat bestand 1: ENOENT | 0 |
Geen enkel commando is in `DRY` rood; er is dus geen laatste-20-regels-uitvoer en geen vervolgtaak nodig. Bevinding: de build heeft één bestand uit `docs/qa/` nodig (`nino-v2-closure-67/artwork-manifest.json`); dit is meegenomen in de uitsluitingslijst. Rood door de uitsluitingen: geen.

## Gates
| Stap | Gate | Voorwaarden |
|---|---|---|
| Stap 1 (`A` naar `main`) | **G4** zolang `main` productie is (BL-006 nog niet klaar); anders geen | Geen app-code, dus G3 is niet nodig. Wel een merge naar `main`: zolang Vercel productie op `main` laat meelopen is elke merge een G4-moment (Dennis). Pas na PASS van de evaluator op BL-005b |
| Stap 2 (`V` naar `main`) | **G3 daarna G4** | G3: BL-004 PASS (Hermes-hertest, iPad 9, offline `file://`, opslag/rollback). De merge van `codex/topo-v3` naar `main` volgt pas na G3. Is BL-006 (productie alleen vanaf release-tag) dan klaar, dan is de merge zelf gate-vrij en blijft één G4-akkoord over op tag `v3.0.0` (`GIT_RELEASE.md` §3). Is BL-006 niet klaar, dan is de merge zelf een G4-moment |
| Vangnet-tag, archief-tags (BL-005c) | geen | tags mogen zonder akkoord (`GIT_RELEASE.md` §6) |
Aanbevolen volgorde van gates (STATE beslisvraag 3, optie a): BL-004 (G3) en BL-006 eerst, dan BL-005b stap 1 en 2, daarna tag `v3.0.0` met één G4-akkoord.

## Rollback
Eerst, vóór stap 1, het vangnet (voorgesteld, niet aangemaakt):
```
git tag pre-integratie/2026-11-<dd> origin/main      # <dd> = dag van uitvoering; nu 8a821a8
git push origin pre-integratie/2026-11-<dd>
```
- **Stap 1 (squash, één ouder):**
  ```
  git switch -c t/revert-art origin/main && git revert <squash-sha-stap-1>
  # of terug naar het vangnet: git revert --no-commit pre-integratie/2026-11-<dd>..origin/main
  ```
  Bij een merge-commit in plaats van squash: `git revert -m 1 <merge-sha>`.
- **Stap 2 (squash, één ouder):**
  ```
  git revert <squash-sha-stap-2>        # revert alleen de V-stap; stap 1 blijft staan
  ```
  Bij een merge-commit: `git revert -m 1 <merge-sha>`.
- **Productie (beide stappen):** Vercel, "Promote" van de vorige productiedeploy (`GIT_RELEASE.md` §5, doel binnen 2 minuten): dashboard, Deployments, de laatste groene deploy vóór de merge, "Promote to Production". Dit raakt `main` niet; revert daarna `main` zonder haast.
- **Archief:** niets uit `V`, `A` of de uitsluitingen gaat verloren zolang de branches en de tags `archive/v3-qa`, `archive/v3-visual`, `archive/v3-output-html`, `archive/v3-installers` bestaan; verwijder `codex/topo-v3` en `art/master` pas na BL-005d.
- **Dry-run:** `git worktree remove --force /Users/dennisariens/topo-bl005-dryrun` en idem `topo-bl005-v3ref` (de hoofdsessie doet dit na de evaluatie).

## Uitvoeringstaken
| ID | Taak | Omvang | Afhankelijk van | Bouwer | Gate |
|---|---|---|---|---|---|
| BL-005c | Archieftags op `V`: `archive/v3-qa`, `archive/v3-visual`, `archive/v3-output-html`, `archive/v3-installers`, plus vangnet-tag `pre-integratie/2026-11-<dd>` op `main` | S | geen (vóór BL-005b) | `codex-worker` | geen |
| BL-005b | Uitvoering: stap 1 (`A` squash, `DECISIONS.md` volgens deze tabel), daarna stap 2 (`V` squash met de uitsluitingen uit deze tabel). Eén PR per stap. `DRY` (`c0265cd`) is het te reproduceren eindresultaat: `git diff --stat DRY HEAD` moet leeg zijn (op `docs/DECISIONS.md` na, als `main` ondertussen nieuwe besluiten kreeg) | M | BL-004 (G3 PASS), bij voorkeur BL-006; BL-005c | `builder` | G3 voor stap 2; G4 als `main` nog productie is |
| BL-005d | `art/master` terugsynchroniseren: `git merge -X theirs origin/main`; regel in `GIT_RELEASE.md` vastleggen | S | BL-005b | `builder` | geen |
| BL-005e | Herhaal lint/test/build en groottemeting op de echte PR-branch van stap 2 (schijf ≥ 3 GB vrij) | S | BL-005b | `builder` | geen |
Geen taak met omvang L. Voorstel `idee`-regels voor de backlog (niet gebouwd): (1) `output/html/` niet meer tracken; de build maakt de bestanden, ze zijn 41 MB per stuk (archiveren, niet verwijderen); (2) `release:check` schrijft naar `docs/visual/`, dat niet meer meekomt: laat het schrijven naar een map buiten git.

## Risico's en afwijkingen
- **Schijf.** Bij de start was 4,3 GB vrij. Tijdens de nulmeting daalde dat onverwacht tot 146 MB (niet uit eigen bestanden; `du` van de beide worktrees = 1,43 GB) en de eerste `npm run build` op `V` faalde met ENOSPC. Daarom: `docs/qa` en `docs/visual` zijn in de worktree op `V` met `git sparse-checkout` weggehaald (2 bestanden bleven), de build is herhaald (exit 0) en `lint` en `test` zijn herhaald (exit 0). Latere metingen liepen met 1,5 tot 2,2 GB vrij. De regel "stop bij < 1 GB vrij" is dus **niet strikt gevolgd**: de `DRY`-checkout (≈ 0,5 GB) is gemaakt met ruim 1,8 GB vrij. Dit is een afwijking van het contract; de tussenstand (`ref-run_build-enospc.log`) is bewaard.
- **`DRY` met plumbing.** Zie `## Rapportkop`: de commit is met `git commit-tree` gemaakt, niet met `merge --squash` en `commit` in de worktree. Een volle `merge --squash` van `V` schreef 1,3 GB en liep tijdens een eerdere poging vol; die poging is teruggedraaid (`git reset --hard` op `T1`, `git clean`) en er bleef niets achter.
- **Gewijzigde tracked bestanden na `npm run build`:** `git status --short` is leeg in beide worktrees na de build; de build is dus idempotent op deze bomen.
- **`topo-claude` (lokale `codex/topo-v3` op `5f87c53`) loopt achter op `V`** (remote). Het plan meet alleen tegen `origin/…`; wie `V` lokaal verder bewerkt moet eerst pushen, anders mist `DRY` die commits.
- **`release:check`** (`npm run release:check`) is niet gedraaid: `audit-release-1-2` en `audit-map-picker-revision` schrijven naar `docs/visual/` (dat in `DRY` ontbreekt); ze zitten niet in de drie door het contract vereiste commando's.
- **Niet geverifieerd:** G3 (iPad 9, Hermes-hertest, offline `file://`), runtime-geheugen van een 41 MB `index.html` op iPad 9, de inhoud van Vercel-productie (BL-006), de visuele kwaliteit van de artwork, en alle werkstromen buiten dit plan (`feat/nino-topo-portal-r2`, `art/nino-topo-website-v1`, `land/fr-*`, `arch/v3-runtime`, `v3/relief-z8`, `art/v3-render-assets`, `art/nino-topo-r3-refinements`). De laatste drie staan in `ops/reports/branches.md` als `merge`; hun inhoud zit mogelijk niet in `V` of `A` en komt dus niet mee in `DRY`.
- **Chronologie `DECISIONS.md`:** de A-sectie (2026-11-10) staat vóór de eerste 2026-11-11-sectie van `V`; één `V`-sectie ("Release 1.2") heeft geen datum. De volgorde is daardoor "chronologisch voor zover datum bekend".

## Controle refs
Zie `refs-na.txt` (zelfde map als `refs-voor.txt`). Hash vóór: `1c37aca2ddedf31484d4ea3418e694df8a480eea`; hash na run (vóór commit): `1c37aca2ddedf31484d4ea3418e694df8a480eea`, `diff` met `refs-voor.txt` leeg. Het enige toegestane verschil na afloop is de commit op `t/BL-005-integratie`. `git branch -a --contains DRY` en `--contains T1`: leeg. `git ls-remote origin | grep -c 'c0265cd0\|13d3f36d'`: 0. `git ls-remote origin refs/heads/main` = `8a821a8c89bfca2889d27751f023a1d19754ec3a` = `M`.
