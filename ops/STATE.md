# STATE — huidige stand

> Max. 60 regels. Overschrijven, niet aanvullen. Historie staat in `RUNLOG.md`.
> Bijgewerkt: 2026-11-13 · door: Claude (setup + besluiten Dennis)

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

## Besloten 13-11
- Roadmap M0–M3: GO
- B2C én B2B · hoofddoel: leren op een leuke manier · testkinderen groep 7 (10–11)
- FR-code gepauzeerd tot M1. FR-data, research en art mogen parallel op Codex (OPERATING_MODEL §5, 🟡)

## Open beslissingen voor Dennis
1. Domein: `ninotopo.nl` wordt gekocht door Dennis (13-11). Internationale domeinstrategie: BL-011
2. Branch-opruiming na BL-001 (`ops/reports/branches.md`), kies: (a) alle 95 `archive`-rijen taggen en daarna verwijderen · (b) eerst lokale `main` bijwerken en `git cherry` draaien (vervolgtaak), dan pas verwijderen · (c) per rij doorlopen met Claude. Rapport: 107 branches, 0 `delete`, 95 `archive`, 3 `merge`, 9 `keep`. **Aanbeveling: (b)**: tags maken mag al zonder akkoord, en 29 lokale `pr*` zijn dubbelen van remote-branches (alleen `pr7`/`pr70` uniek)

## Bekende risico's
- Artwork-goedkeuring is de bottleneck voor elk land
- M0-deadline krap: na BL-001 nog 2 M-taken (BL-004, BL-005) plus iPad-test Dennis in 6 dagen. Nog niet verschoven; check bij de volgende planning, voorstel dan: portal-preview naar M1
- `index.html` van 41 MB en een preview van 50 MB: geheugen op iPad 9
