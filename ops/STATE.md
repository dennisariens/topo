# STATE — huidige stand

> Max. 60 regels. Overschrijven, niet aanvullen. Historie staat in `RUNLOG.md`.
> Bijgewerkt: 2026-11-14 · door: Claude (afsluiting BL-005)

## Mijlpaal
M0 Consolidatie, deadline vr 20 nov · **GO 13-11**

## Productie
- `main` @ `7e38160` (28-09), oude stand. Wat er op Vercel staat moet nog geverifieerd worden (BL-006).

## Actieve werkstromen (moeten samenkomen)
| Branch | Wat | Laatst |
|---|---|---|
| `codex/topo-v3` | V3.0 app plus landmarks | 13-11 |
| `art/master` | Artwork Italië | 13-11 |
| `feat/nino-topo-portal-r2` / `art/nino-topo-website-v1` | Portal en website | 13-11 |
| `land/fr-geo` / `land/fr-inhoud` | Frankrijk | 12/13-11 |
| `arch/v3-runtime` | Migratievoorstel en landpakket | 10-11 |

## Volgende taak
BL-001 staat in `review` (PASS met voorbehoud C4, shell ontbrak). Daarna: BL-002 docs-inventaris. Vervolg BL-001: tegen `origin/main` opnieuw draaien met `git cherry` (shelltoegang nodig)
BL-005 is `klaar` (PASS met voorbehoud, PR #91; plan in `ops/reports/integratie.md`). Volgende: BL-002 docs-inventaris (`ready`; neemt de ±240 gebroken doc-links en `docs/qa/v3-reis/` uit BL-005 mee), daarna BL-005c (archieftags). BL-005b wacht op G3 (BL-004) en BL-006

## Besloten 13-11
- Roadmap M0–M3: GO
- B2C én B2B · hoofddoel: leren op een leuke manier · testkinderen groep 7 (10–11)
- FR-code gepauzeerd tot M1. FR-data, research en art mogen parallel op Codex (OPERATING_MODEL §5, 🟡)

## Open beslissingen voor Dennis
1. Domein: `ninotopo.nl` wordt gekocht door Dennis (13-11). Internationale domeinstrategie: BL-011
2. Branch-opruiming na BL-001 (`ops/reports/branches.md`), kies: (a) alle 95 `archive`-rijen taggen en daarna verwijderen · (b) eerst lokale `main` bijwerken en `git cherry` draaien (vervolgtaak), dan pas verwijderen · (c) per rij doorlopen met Claude. Rapport: 107 branches, 0 `delete`, 95 `archive`, 3 `merge`, 9 `keep`. **Aanbeveling: (b)**: tags maken mag al zonder akkoord, en 29 lokale `pr*` zijn dubbelen van remote-branches (alleen `pr7`/`pr70` uniek)

3. Integratie V3.0 + art naar `main` (BL-005; plan en proefintegratie in `ops/reports/integratie.md`, evaluator: PASS met voorbehoud, `ops/reports/eval-BL-005.md`; let op: de uitsluitingen breken ±240 doc-links, o.a. in `docs/PROJECT_STATE.md`, op te lossen in BL-005b/BL-002). Gekozen volgorde: eerst `art/master` als merge-commit (bewuste uitzondering op squash: art blijft langlopend en synct dan zonder `-X`), dan `codex/topo-v3` als squash. Uitgesloten uit `main`: het grootste deel van `docs/qa/` en `docs/visual/` (op 129 bestanden na, o.a. `docs/qa/v3-stijlbeeld/final/`), `output/installers/` en drie oude `output/html/`-proefversies (samen 2184 bestanden, 856 MB; tags `archive/v3-*` voorgesteld). Proefintegratie `DRY` `df72c39`: lint, test en build alle drie exit 0, `dist/index.html` 41 445 845 B (gelijk aan V). De uitvoering (BL-005b) raakt G3/G4 zolang `main` productie is. Kies: (a) BL-005b pas na G3 (BL-004 PASS) én BL-006 (productie alleen vanaf tag); dan blijft er één G4-akkoord over, op tag `v3.0.0` · (b) als (a), en Dennis keurt daarnaast `ops/reports/integratie.md` vooraf goed · (c) direct na het plan naar `main`, met de merge als G4. **Aanbeveling: (a)**: één contactmoment, en de merge is omkeerbaar zonder productie te raken. **Stand 14-11: Dennis heeft niet anders gekozen, we werken volgens (a)**
4. M0-scope: **besloten 14-11 door Dennis: de portal schuift niet naar M1, die "kan al eerder klaar zijn"**. Gelezen als optie (c), niets schuiven; deadline M0 blijft vr 20 nov. Controleer bij de volgende planning of de portal-preview daarmee binnen M0 past

## Bekende risico's
- Artwork-goedkeuring is de bottleneck voor elk land
- M0-deadline dreigt te schuiven: na BL-005 volgen nog BL-004 (M), BL-005b (M, na G3), BL-006 (S) en de iPad-test van Dennis, in 6 dagen tot vr 20 nov. Niets geschoven (beslissing 4)
- `index.html` van 41 MB en een preview van 50 MB: geheugen op iPad 9
- Schijf Mac mini: Dennis heeft 14-11 ruimte gemaakt (ongeveer 12 GB vrij). BL-005b/e hebben ≥ 3 GB nodig; check `df` vóór de start, de schijf liep tijdens BL-005 vol
