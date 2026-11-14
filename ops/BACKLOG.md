# Backlog

Regels:
- Bovenaan staat wat het eerst gebeurt. De nachtrun pakt de **bovenste taak met status `ready`**.
- `ready` betekent dat er een contract is met toetsbare criteria. Zonder contract blijft een taak op `idee`.
- Prioriteit: P0 = blokkeert de mijlpaal · P1 = mijlpaal · P2 = later.
- Grootte: S ≤ 1 run · M ≤ 3 runs · L moet eerst gesplitst worden.
- Statussen: `idee` → `ready` → `bezig` → `review` → `klaar` | `fail(n)` | `geblokkeerd: <reden>`

| ID | Taak | Mijlpaal | P | Grootte | Status | Bouwer | Contract |
|---|---|---|---|---|---|---|---|
| BL-001 | Branch-inventaris: per branch de status (gemerged, achter, uniek werk), voorstel keep/merge/archive | M0 | P0 | S | review | Claude | `ops/contracts/BL-001.md` (11 criteria: alle branches in `ops/reports/branches.md`, cijfers via `git rev-list`, actie + reden per rij, niets verwijderd) |
| BL-001b | BL-001 afronden: `git cherry origin/main <branch>` per branch, rijen met 0 unieke commits → `delete`, en de 3 `merge`-rijen beoordelen. Daarna één lijst voor Dennis | M0 | P0 | S | ready | Claude | Criteria: kolom Cherry-uniek gevuld voor alle 107 rijen, vergeleken met `origin/main`, niets verwijderd |
| BL-002 | Docs-inventaris: wat is actueel, wat naar `docs/archive/` | M0 | P0 | S | ready | Claude | Criteria: lijst plus verplaatsplan, `AGENTS.md`-verwijzingen blijven kloppen |
| BL-003 | `ops/STATE.md` vullen uit `docs/v3/SPEC.md` en `OVERDRACHT.md` | M0 | P0 | S | ready | Claude | Criteria: ≤ 60 regels, elke bewering verwijst naar een pin of bestand |
| BL-004 | V3.0 release-kandidaat: Hermes-hertest op de laatste pin plus checklist voor de iPad-test van Dennis | M0 | P0 | M | idee | Hermes | — |
| BL-005 | Integratieplan `codex/topo-v3` + `art/master` → `main` (plan plus droge proefintegratie op detached worktree; de merge zelf is vervolgtaak BL-005b) | M0 | P0 | M | klaar | Claude (builder, Sonnet) | `ops/contracts/BL-005.md` (14 criteria: volgorde, conflicten via `merge-tree`, niets verloren in `DRY`, grootte per pad, lint/test/build in de dry-run, gates, rollback, geen refs geraakt) |
| BL-005c | Archieftags `archive/v3-*` op `codex/topo-v3` voor wat niet naar `main` gaat (`ops/reports/integratie.md`) | M0 | P0 | S | idee | Codex | Vóór BL-005b. Geen gate (tags mogen zonder akkoord) |
| BL-005b | Integratie uitvoeren volgens `ops/reports/integratie.md`: stap 1 `art/master` (merge-commit), stap 2 `codex/topo-v3` (squash met uitsluitingen), één PR per stap | M0 | P0 | M | geblokkeerd: G3 (BL-004) | Claude (builder) | Na BL-004 PASS en BL-006; G4 zolang `main` productie is. Eerst beslissen: `docs/qa/v3-reis/` mee, en ±240 gebroken doc-links (met BL-002). Vereist ≥ 3 GB vrije schijf |
| BL-005d | `art/master` terugsynchroniseren met `main` (`git merge origin/main`, zonder `-X`) en de merge-commit-uitzondering vastleggen in `GIT_RELEASE.md` | M0 | P1 | S | idee | Claude (builder) | Na BL-005b |
| BL-005e | Proefintegratie herhalen op de echte PR-branch, met build op de volle boom (in BL-005 mislukt door volle schijf) | M0 | P1 | S | idee | Claude (builder) | Onderdeel van of vlak vóór BL-005b; ≥ 3 GB vrij |
| BL-006 | Vercel: productie = `main`, preview per PR, portal op een eigen pad | M0 | P1 | S | idee | Claude | — |
| BL-007 | Runtime-migratie stap 1: karakterisering op de V3.0-pin | M1 | P1 | M | idee | Claude | — |
| BL-008 | Speeltest-protocol met 2–3 kinderen (taken, observatie, vragen) | M0 | P1 | S | idee | Claude | — |
| BL-009 | Domein koppelen aan Vercel (na aankoop door Dennis), productie-URL vastleggen | M0 | P1 | S | idee (ninotopo.nl gekocht 14-11; wacht op DNS-toegang van Dennis) | Claude | — |
| BL-010 | Speeltest-ronde 1 met groep 7 op V3.0 (na BL-004) | M0 | P1 | S | idee | Dennis + Claude | — |
| FR-01 | FR-curriculum: itemlijst groep 7 (toetsstof, schoolatlas), met bron per item → `src/lands/fr/items.draft.json` (pure data) | M2 · parallel | P2 | S | idee | **Codex** | — |
| FR-02 | FR-geometrie: bron met licentie (Natural Earth/OSM), projectie, hashes, validatierapport, overnemen uit `land/fr-geo` waar het klopt | M2 · parallel | P2 | M | idee | **Codex** | — |
| FR-03 | FR-artwork-brief: Nino in Frankrijk (thema-object, scènes, landmarks), voortbouwend op de goedgekeurde gebakjes uit `art/master` | M2 · parallel | P2 | S | idee | **Codex** | — |
| BL-011 | Domein- en merkstrategie internationaal: `ninotopo.com` als hub met taalpaden (`/en`, `/de`), betekenis van "topo" per taal checken (IT = muis, ES = mol, FR = praatje, EN = topokaart), alleen ccTLD's kopen voor markten waar we live gaan | M3 | P2 | S | idee | Claude | — |
