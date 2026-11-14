# Evaluatie BL-002: docs-inventaris, verplaatsplan en linkanalyse

Contract: `ops/contracts/BL-002.md` · Product: `ops/reports/docs-inventaris.md` · Datum: 2026-11-14
Evaluator: subagent `evaluator` (alleen lezen, nieuwe context). Ik heb alleen dit bestand geschreven en niets gecommit. Alle getallen hieronder heb ik zelf herberekend; gebruikte bestanden staan in de scratchpad (`eval-BL-002/`).

## Eindverdict: PASS met voorbehoud (run 2)

| Run | Commit | Verdict | Kern |
|---|---|---|---|
| 1 | `daf634f` | PASS met voorbehoud (15/15) | Alle metingen kloppen. Voorbehoud: (c) breder dan het contract, (d) als vaste `0` geprint, DRY-grootte en `docs/qa`-telling fout in de `v3-reis`-sectie, contractbestand als zesde gewijzigd bestand niet vermeld. |
| 2 | `ded045a` | PASS met voorbehoud (15/15) | Alle punten uit run 1 hersteld. Voorbehoud: het contractbestand valt formeel buiten de lijst van criterium 14 (nu benoemd), en STATE heeft een open beslissing over `FRANKRIJK_HANDOFF` die het verplaatsplan kan veranderen. |

Sha's: `M` b835a59 · `V` 55b4d86 · `A` 7714e22 · `DRY` = `D` df72c39 (bestaat nog).

## Per criterium (stand `ded045a`, alles zelf gemeten)

| # | Verdict | Gemeten |
|---|---|---|
| 1 | PASS | `cat-file -e DRY^{commit}` slaagt; `ls-tree -r D \| wc -l` = 922; I = 70; drift `docs/` = 0; tags-hash `90e8b859…`; `comm -23 V D` = 2184. Kop compleet. |
| 2 | PASS | `comm -3` van inventarisrijen tegen I is leeg; 70 rijen, geen dubbele. |
| 3 | PASS | awk over 70 rijen: 0 lege velden, 0 andere statussen (47 actueel, 21 archief, 2 vervangen), opvolger bij beide `vervangen`. Steekproef van 10 (seed 20261114): 10/10 datums gelijk aan `git log -1 --format=%cs V`. Daarna alle 70 gecontroleerd: gelijk. `docs/ASSET_BRIEF.md` staat niet in V of M; datum uit A (2026-11-12) klopt. |
| 4 | PASS | 11 rijen met RELEASE/HANDOFF in de naam, alle 11 `archief`. |
| 5 | PASS | `PROJECT_STATE` → `ops/STATE.md`, `ROADMAP` → `ops/ROADMAP.md`, beide `vervangen`. |
| 6 | PASS | Eén codeblok, 23 × `git mv` (= 21 + 2), identiek aan run 1. Subpad behouden; `comm` leeg; `git cat-file -e D:<doel>` faalt voor alle 23. |
| 7 | PASS | `git grep -nF -e p -e basename` op `scripts/ src/ package.json vercel.json`: 0 treffers in D en in HEAD. |
| 8 | PASS | Contractcommando geeft 18 unieke paden, alle aanwezig; ook alle 63 combinaties bestand:regel/boom/pad. AGENTS.md (M) r.5, r.11, r.14 met vervangregel. |
| 9 | PASS | Script uitgepakt met het commando uit het rapport en gedraaid: 101 / 338 / 23 / 281; (a) 256, (b) 0, (c) 25 [c-doel 4, c-bron 21], (d) 0; groepen 56 + 16 + 4 + 205. (d) wordt nu in de code geteld (`cause = 'd'`, `tot["d"]`). Mijn eigen controlescript, strikt relatief opgelost, geeft dezelfde verdeling. |
| 10 | PASS | Bekende gevallen aanwezig: `AUDIT.md:24`, `GE01.md:3`, `MAP_SYSTEM.md:83`, `DECISIONS.md:202,226`, en de 41 kapotte links in `v3-stijlbeeld/README.md`. Steekproef van 15 uit 171 grep-regels (seed 15002), met de hand opgelost: 15/15 gelijk. (a) = 256, binnen 30 % van ±240. |
| 11 | PASS | 0 + 72 + 4 + 0 + 205 = 281. Tags `archive/v3-qa`/`-visual` staan in `integratie.md` r.82–106. De 205 "laten" komen alle 205 uit de 23 verplaatste bronnen; de 76 gebroken links uit actuele bestanden zitten alle 76 in groep 2 of 3. |
| 12 | PASS | `ls-tree -r -l V -- docs/qa/v3-reis/` = 33 / 15 956 760. 2 links vanuit actuele bestanden, 1 vanuit archief. Advies: niet mee. DRY nu 572 336 202 B (gemeten gelijk), +2.79 % ≈ 2.8 %; `docs/qa` in D = 128 (gemeten gelijk). |
| 13 | PASS | `## Uitvoering` aanwezig; noemt BL-002b/BL-005b 5 keer; omvang S (M), geen L. |
| 14 | PASS* | `diff origin/main...HEAD`: 5 toegestane bestanden plus `ops/contracts/BL-002.md`. Contract ongewijzigd tussen `daf634f` en `ded045a`. Tags-hash gelijk, DRY bestaat. *Zie voorbehoud 1. |
| 15 | PASS | BACKLOG r.14 `review`; `docs-inventaris.md` 2 × in STATE; STATE 42 regels; RUNLOG 1 regel BL-002. |

## Oordeel over de zeven punten van de bouwer

1. **BL-002b niet in de backlog.** Correct; het contract (r.75) verbiedt het.
2. **`docs/ASSET_BRIEF.md` uit `art/master`.** Gemeten: staat in D en A, niet in V of M. DRY heeft 125 paden die niet in V staan, waarvan 80 onder `assets/art`. De aanname in contract r.23 klopt dus niet. Datum uit A is juist; de les staat in LEARNINGS.
3. **Bredere (c).** Hersteld in run 2: het script splitst nu c-doel (4, de contractdefinitie) en c-bron (21) en telt (d) echt. Die verdeling klopt met mijn eigen script. (d) is met de huidige logica in de praktijk 0.
4. **`v3-stijlbeeld/README.md` 47/42 tegen 46/41.** De bouwer heeft gelijk. Het verschil is r.90: `` [`../v3-glas/`](../v3-glas/README.md) ``, een echte link naar een doel dat in V staat (blob `fe5f37b`) en niet in D. De eerdere telling nam alleen links binnen de map mee.
5. **`docs/v4/FRANKRIJK_HANDOFF.md` op archief.** Formeel juist: geen lezer bij naam in D, M of HEAD. Inhoudelijk is het de opdracht voor de actieve branches `land/fr-geo`/`land/fr-inhoud`; daar staat dezelfde blob `2aafbe1`. Nu een open beslissing in STATE (zie voorbehoud 2).
6. **Steekproef van 15 links niet door de bouwer gedraaid.** Geen schending; die hoort bij de evaluator. Uitkomst: 15/15.
7. **De 205 "laten"-links.** Alle 205 komen uit archief- of vervangen-bronnen. Uit actuele bestanden blijft geen gebroken link zonder besluit achter. Let op: 21 daarvan werken nu nog en breken pas door BL-002b zelf.

## Hersteld in run 2 (`ded045a`)

- DRY-grootte 572 336 202 B en +2.8 %, `docs/qa` 128 bestanden (rapport r.379).
- (d) wordt geteld; (c) gesplitst in c-doel en c-bron (script r.82 en r.90 van het uitgepakte script).
- Regexp-telling: 338 met `-o`, 171 regels met `-n`.
- Verklaring 47/42, r.90, zonder "niet geverifieerd".
- Zesde bestand (het contract) vermeld in de rapportkop.
- STATE: verouderde regel onder "Volgende taak" weg, open beslissing 5 over `FRANKRIJK_HANDOFF` met aanbeveling die expliciet geen besluit van Dennis is. RUNLOG-tijd 17:06.

Gewijzigd tussen `daf634f` en `ded045a`: alleen `ops/reports/docs-inventaris.md`, `ops/STATE.md`, `ops/RUNLOG.md`. Herhaalde toetsen 2, 6, 14 en 15: niets stuk.

## Voorbehoud (open)

1. **Laag. Criterium 14, letterlijk.** `ops/contracts/BL-002.md` staat niet in de lijst van toegestane bestanden. Volgens CLAUDE.md en de praktijk van #88 en #91 hoort het contract in de taakcommit; het is nu benoemd in de rapportkop (`docs-inventaris.md` r.21). Of de inhoud gelijk is aan wat de planner schreef, kan ik niet toetsen (geen eerdere versie in git).
2. **Middel. `ops/STATE.md` r.36, beslissing 5.** Kiest Dennis voor "actueel houden", dan moeten de inventarisrij (status) en het verplaatsplan (dan 22 × `git mv`) worden aangepast. De linkgetallen blijven gelijk: `FRANKRIJK_HANDOFF.md` heeft 0 gebroken uitgaande en 0 inkomende links. Criterium 4 vraagt dan wel een concrete lezer `pad:regel` in de reden. BL-002b moet dit besluit afwachten. Het contract (§Gates) zei "geen nieuwe beslisvraag in STATE"; dat ging over `v3-reis`, en deze vraag is op verzoek van de hoofdsessie toegevoegd.
3. **Info.** `ops/RUNLOG.md` r.17 noemt `claude/sonnet`, terwijl de commits als co-auteur "Claude Fable 5.2" hebben.

## Buiten scope (backlog-ideeën)
- BL-002b: de 21 c-bron-links in archiefbestanden mechanisch herschrijven (`../` erbij); goedkoop, en het archief blijft leesbaar.
- `ops/MEMORY.md:14` verwijst naar `docs/brain/`, dat in geen enkele boom bestaat.

## Niet getoetst
- Of het contractbestand ongewijzigd is ten opzichte van de versie van de planner.
- Of de GitHub-permalinks met `archive/v3-*` werken; de tags bestaan nog niet.
- De reden van elke inventarisrij inhoudelijk; steekproefsgewijs gecontroleerd: de lezers van `ASSET_BRIEF`, `geography/*`, `points.json`, `assets-inventaris.json`, `CLAUDE.md:15`, `STATE.md:34`.
- Lint, test en build: niet nodig, de taak raakt geen code en criterium 7 geeft 0 lezers. Geen UI, dus geen screenshot.

## Les
Een contract dat een getal uit een eerdere meting overneemt (46/41, "A voegt niets toe"), moet ook de meetdefinitie of de boom overnemen. Anders lijkt de bouwer af te wijken terwijl hij gelijk heeft. Meet zo'n aanname met `git ls-tree` op de doelboom voordat hij in een criterium komt.
