# Evaluatie BL-005 — integratieplan `codex/topo-v3` + `art/master` → `main`

Contract: `ops/contracts/BL-005.md` · Product: `ops/reports/integratie.md` · Datum: 2026-11-14
Evaluator: subagent `evaluator` (read-only, nieuwe context per run). Dit verslag is door de hoofdsessie overgenomen uit de twee evaluatorverslagen; de evaluator schrijft zelf geen bestanden.

## Eindverdict: PASS met voorbehoud (run 2)

| Run | Commit | Verdict | Kern |
|---|---|---|---|
| 1 | `05e8920` | FAIL (13/14) | Criterium 11: de sync-regel `git merge -X theirs origin/main` na een squash overschrijft stil een nieuwere art-commit. Gereproduceerd in een wegwerprepo. |
| 2 | `1cc4ca8` | PASS met voorbehoud (14/14) | Stap 1 is een merge-commit, sync zonder `-X`. Voorbehoud: de onderbouwing van de uitsluitingen was onvolledig (gebroken links). |

Sha's: `M` 8a821a8 · `V` 55b4d86 · `A` 7714e22 · `MB` 7e38160 · `T1` 3bf2d99 (ouders `M` en `A`) · `DRY` df72c39 (ouder `T1`).

## Per criterium (run 2, alles door de evaluator zelf gemeten)

| # | Verdict | Gemeten |
|---|---|---|
| 1 | PASS | Sha's en merge-base gelijk aan de rapportkop. Voor/achter 6/226 en 6/19. `DRY` bestaat. |
| 2 | PASS | Twee stappen met bron, doel, methode en reden. Beide volgordes vergeleken, ook op G3. |
| 3 | PASS | Stap 1: `docs/DECISIONS.md`. Stap 2: `.gitignore`, `AGENTS.md`, `docs/DECISIONS.md`. `comm -3` leeg. |
| 4 | PASS | Alle `comm -23` leeg voor `M`, `V`, `A`. 0 conflictmarkers. Alle niet-lege DECISIONS-regels staan in `DRY`. |
| 5 | PASS | 910 paden, 0 afwijkingen. Alle 2184 verschillen `V`→`DRY` vallen onder de genoemde uitsluitingen. Uit `A` en `M` ontbreekt niets. |
| 6 | PASS* | qa 1463 / 549 773 979 · visual 844 / 178 782 856 · assets 359 / 136 266 752 · scripts 193 / 1 536 474 · overig 122 / 489 442 134 · totaal 2981 / 1 355 802 195. Exact gelijk. *Zie voorbehoud. |
| 7 | PASS | `M` 82 / 3 212 416 B · `DRY` 922 / 572 336 202 B · `dist` 43 532 KB en `dist/index.html` 41 445 845 B in beide worktrees. Afwijking 0 %. |
| 8 | PASS | Lint, test en build exit 0 in de dryrun-worktree; `git status` daarna leeg. |
| 9 | PASS | G3, G4, BL-004 en BL-006 staan in `## Gates`. |
| 10 | PASS | Vangnet-tag, `revert -m 1` bij stap 1 (merge-commit), `revert` zonder `-m` bij stap 2 (squash), Vercel Promote. |
| 11 | PASS | BL-005b/c/d/e, geen L. Sync-regel overal zonder `-X`. Scenario's nagespeeld met echte data: nieuwere art-commit blijft behouden, een echt conflict stopt de merge. |
| 12 | PASS | Enige bewogen ref: `t/BL-005-integratie`. `--contains` leeg, 0 treffers in `ls-remote`, remote `main` = `M`. |
| 13 | PASS | Alleen `ops/STATE.md` en `ops/reports/integratie.md` gewijzigd (stand `1cc4ca8`). |
| 14 | PASS | Beslisvraag 3 verwijst naar het rapport, met volgorde, testuitkomst en meerkeuze. 39 regels. |

Extra getoetst: het recept voor BL-005b levert met plumbing exact de tree van `DRY` op. GitHub staat merge-commits toe, er zijn geen rulesets en `main` is niet beschermd (`gh api`, alleen lezen).

## Voorbehoud en bevindingen

1. **Middel (het voorbehoud).** Het rapport zei dat alle verwijzingen vanuit `docs/v3/` beoordeeld waren. De grep miste relatieve links: twee in `docs/v3/` (`AUDIT.md:24`, `GE01.md:3` → `docs/qa/v3-reis/`, 33 bestanden, 16 MB) en ongeveer 240 links elders (o.a. `docs/PROJECT_STATE.md`, `docs/MAP_SYSTEM.md`). Geen ervan raakt app, lint, test of build.
   **Afhandeling:** de hoofdsessie heeft na de evaluatie de bewering in het rapport gecorrigeerd en het risico toegevoegd onder `## Risico's en afwijkingen`. Die correctie is zelf niet opnieuw geëvalueerd. Of `docs/qa/v3-reis/` meegaat is een open punt voor BL-005b en BL-002; `DRY` is er niet op aangepast.
2. **Laag.** Sync-scenario D toont in het rapport alleen `AA x.bin`; de echte uitvoer is ook `UU a.txt`. De conclusie blijft geldig.
3. **Laag.** Op zes plekken volgt een tekstregel direct op een tabel; GitHub toont die als tabelrij.
4. **Info.** `git sparse-checkout` heeft `extensions.worktreeConfig=true` gezet in de gedeelde git-config. Niet teruggezet.
5. **Info.** Een PR van een branch die zelf al een merge-commit bevat, geeft twee merge-commits op `main`. Meenemen in BL-005d.

## Niet getoetst
- Een build op de volle boom van `V`: nooit geslaagd (schijf vol, ENOSPC). De nulmeting is sparse, zonder het grootste deel van `docs/qa` en `docs/visual`. Gedekt door BL-005e (≥ 3 GB vrij).
- `npm ci` niet herhaald in run 2; de nulmeting op `V` niet opnieuw gebouwd.
- Vercel en CI met een merge-commit; G3 en de iPad-test (BL-004).
