# Branch-inventaris (BL-001)

- Datum: 2026-11-14 · lokale `main` = `7e38160` · totaal branches (ontdubbeld, `origin/x` + `x` = één rij): **107** (niet 71 zoals in de backlog stond)
- Vóór de run: 116 refs (heads + remotes, incl. `origin/HEAD`), 6 tags. Niets verwijderd, getagd, gepusht of gefetcht.
- Commando's: `git for-each-ref --format='%(refname:short) %(ahead-behind:main) %(committerdate:short) %(objectname:short)' refs/heads refs/remotes`, `git branch -r --merged origin/main`.
- Achter = commits in `main` die de branch mist; Voor = commits op de branch die niet in `main` zitten. Waar twee refs bestaan (beide), zijn de getallen van de **lokale** ref gebruikt.

## Beperkingen (eerlijk)
1. **Kolom Cherry-uniek is niet berekend (`n.b.`).** In de nachtrun-sandbox waren losse `git cherry`-aanroepen per branch en shell-scripts niet toegestaan. Daardoor kon ik squash-merges niet aantonen, en daarom staat er **geen enkele `delete`**: alles zonder bewijs staat op `archive` (tag, daarna pas verwijderen na akkoord). Een vervolgrun met shelltoegang kan `git cherry main <branch>` toevoegen en rijen naar `delete` promoveren.
2. **Lokale `main` (`7e38160`, 28-09) loopt achter op `origin/main` (`84f238b`).** Daardoor staan alle branches op Achter = 0 en lijken `ops/*` en `night/2026-11-13` uniek, terwijl ze vrijwel zeker via #83–#85 (squash) in `origin/main` zitten (`--merged origin/main` bevat alleen `origin/main`, dus het zijn squash-merges). Verifiëren nadat `main` is bijgewerkt (door Dennis/integrator; ik raak `main` niet aan).
3. Auteur van de laatste commit is weggelaten; datum en sha staan er wel.

| Branch | Waar | Laatste commit | Achter | Voor | Cherry-uniek | Actie | Reden |
|---|---|---|---|---|---|---|---|
| `agent/topo-harness-v1` | remote | 2026-11-06 a869752 | 0 | 73 | n.b. | archive | oude harness-iteratie; v2 is opvolger. Tag `archive/agent/topo-harness-v1`, dan verwijderen |
| `agent/topo-harness-v2` | beide | 2026-11-06 beeaef4 | 0 | 82 | n.b. | archive | harness is nu in `ops/` opgenomen; tag `archive/agent/topo-harness-v2` |
| `agent/topo-harness-v2-codex-reviewed` | remote | 2026-11-06 c2e52e6 | 0 | 78 | n.b. | archive | reviewvariant van harness v2; tag en verwijderen |
| `agent/topo-harness-v2-improvement-fresh-package` | beide | 2026-11-06 94d1390 | 0 | 77 | n.b. | archive | variant van harness v2; tag en verwijderen |
| `arch/stap0-bron` | beide | 2026-11-12 416088e | 0 | 191 | n.b. | archive | bronpakket voor runtime-migratie; opvolger is `arch/v3-runtime`. Tag bewaart het |
| `arch/v3-runtime` | remote | 2026-11-10 75263a7 | 0 | 124 | n.b. | keep | actieve werkstroom (STATE): migratievoorstel en landpakket |
| `art/master` | remote | 2026-11-13 7714e22 | 0 | 19 | n.b. | keep | beschermd: langlopende artwork-branch |
| `art/nino-chapters-20261024` | remote | 2026-10-24 8af78ac | 0 | 17 | n.b. | archive | gedateerde art-branch; inhoud hoort via `art/master`. Tag en verwijderen |
| `art/nino-complete-20261024` | remote | 2026-10-24 047f743 | 0 | 10 | n.b. | archive | gedateerde art-branch; tag en verwijderen |
| `art/nino-final-closeout-20261107` | remote | 2026-11-07 5976b83 | 0 | 51 | n.b. | archive | gelijk aan lokale `pr75`; closeout V2, tag en verwijderen |
| `art/nino-micro-icons-v2-20261030` | remote | 2026-10-30 5cfcbc3 | 0 | 35 | n.b. | archive | gelijk aan lokale `pr65`; tag en verwijderen |
| `art/nino-pisa-hinge-qa-20261030` | remote | 2026-10-30 92893ae | 0 | 25 | n.b. | archive | gelijk aan lokale `pr63`; tag en verwijderen |
| `art/nino-pizza-rewards-20261024` | remote | 2026-10-25 bf91fb3 | 0 | 23 | n.b. | archive | gedateerde art-branch; tag en verwijderen |
| `art/nino-topo-r3-refinements` | remote | 2026-11-13 0e3a2a4 | 0 | 124 | n.b. | merge | recent (13-11) artwork, nog niet in een actieve werkstroom; beoordelen en mergen naar `art/master` voor verwijdering |
| `art/nino-topo-website-v1` | remote | 2026-11-13 b05a9d5 | 0 | 119 | n.b. | keep | actieve werkstroom (STATE): website |
| `art/nino-travel-stamps-v2-20261026` | remote | 2026-10-27 8a704cb | 0 | 34 | n.b. | archive | gedateerde art-branch; tag en verwijderen |
| `art/nino-venezia-scalloped-20261031` | remote | 2026-10-31 cec9fd2 | 0 | 37 | n.b. | archive | gelijk aan lokale `pr66`; tag en verwijderen |
| `art/pisa-hinge-source-preserving-final-20261103` | remote | 2026-11-03 8414319 | 0 | 30 | n.b. | archive | gelijk aan lokale `pr72`; tag en verwijderen |
| `art/v3-render-assets` | remote | 2026-11-10 b70e1ac | 0 | 105 | n.b. | merge | V3-renderassets; beoordelen en mergen naar `art/master` voor verwijdering |
| `codex/issue-50-offline-computer` | remote | 2026-10-27 bd1e57b | 0 | 31 | n.b. | archive | gelijk aan lokale `pr51`; oud issue-werk, tag en verwijderen |
| `codex/issue-52-calm-desktop-learning` | remote | 2026-10-31 940a6a5 | 0 | 60 | n.b. | archive | gelijk aan lokale `pr64`; tag en verwijderen |
| `codex/issue-58-legible-map-picker` | remote | 2026-10-30 46d58ec | 0 | 34 | n.b. | archive | gelijk aan lokale `pr59`; tag en verwijderen |
| `codex/issue-58-rome-vatican-enclave-ui` | remote | 2026-10-29 d7a9921 | 0 | 43 | n.b. | archive | gelijk aan lokale `pr60`; tag en verwijderen |
| `codex/nino-2.0.2` | beide | 2026-11-08 83ec1ce | 0 | 74 | n.b. | archive | V2-release afgerond; tag en verwijderen |
| `codex/nino-settings-exam` | remote | 2026-11-08 36afafa | 0 | 73 | n.b. | archive | V2-werk; tag en verwijderen |
| `codex/nino-v2-artwork-closure-67` | remote | 2026-11-08 f53dc0b | 0 | 80 | n.b. | archive | V2-afsluiting artwork; tag en verwijderen |
| `codex/nino-v2-integration-20261103` | beide | 2026-11-07 bb27e61 | 0 | 71 | n.b. | archive | V2-integratie, achterhaald door V3; tag en verwijderen |
| `codex/passport-scoperte-preparation-20261026` | remote | 2026-10-26 a77d1cf | 0 | 31 | n.b. | archive | gelijk aan lokale `pr49`; tag en verwijderen |
| `codex/topo-lakes-map-layer` | remote | 2026-10-24 35ff21b | 0 | 6 | n.b. | archive | gelijk aan lokale `pr15`; tag en verwijderen |
| `codex/topo-nino-computer-release-20261030` | remote | 2026-10-30 1bf86b3 | 0 | 47 | n.b. | archive | gelijk aan lokale `pr61`; tag en verwijderen |
| `codex/topo-pizza-reward-v2` | remote | 2026-10-25 dcc474e | 0 | 9 | n.b. | archive | gelijk aan lokale `pr29`; tag en verwijderen |
| `codex/topo-release-1-1-polish` | remote | 2026-10-23 a481317 | 0 | 5 | n.b. | archive | gelijk aan lokale `pr9`; tag en verwijderen |
| `codex/topo-release-1-integration` | remote | 2026-10-23 9df4989 | 0 | 4 | n.b. | archive | gelijk aan lokale `pr3`; tag en verwijderen |
| `codex/topo-schoolblad-overlay` | remote | 2026-10-24 1c4d00f | 0 | 9 | n.b. | archive | gelijk aan lokale `pr27`; tag en verwijderen |
| `codex/topo-semantic-map-hotfix` | remote | 2026-10-25 fc8f5be | 0 | 11 | n.b. | archive | gelijk aan lokale `pr39`; tag en verwijderen |
| `codex/topo-v3` | beide | 2026-11-13 5f87c53 | 0 | 219 | n.b. | keep | actieve werkstroom (STATE): V3.0; let op: remote loopt 7 commits voor op de lokale ref (226) |
| `design/approved-map-choice-preview-20261030` | remote | 2026-10-30 b7ee902 | 0 | 47 | n.b. | archive | gelijk aan lokale `pr62`; tag en verwijderen |
| `design/nino-character-content-pack-20261023` | remote | 2026-10-24 2922be8 | 0 | 9 | n.b. | archive | gelijk aan lokale `pr6`; tag en verwijderen |
| `design/nino-cplus-20261102` | remote | 2026-11-02 127d2e0 | 0 | 33 | n.b. | archive | gelijk aan lokale `pr69`; tag en verwijderen |
| `docs/nino-gold-journey-roadmap-20261026` | remote | 2026-10-27 8e0300c | 0 | 19 | n.b. | archive | gelijk aan lokale `pr42`; roadmap is vervangen door `ops/ROADMAP.md` |
| `docs/ontwikkeling` | remote | 2026-11-10 1983bdd | 0 | 1 | n.b. | archive | 1 commit; inhoud beoordelen bij BL-002 (docs-inventaris), tag en verwijderen |
| `docs/v2-afsluiting` | beide | 2026-11-08 d16e920 | 0 | 76 | n.b. | archive | V2-afsluiting; remote is 1 commit verder (77); tag de remote-sha |
| `feat/nino-topo-portal-r2` | remote | 2026-11-13 f0b7e66 | 0 | 147 | n.b. | keep | actieve werkstroom (STATE): portal |
| `fix/afternoon-ipad-blockers-20261026` | remote | 2026-10-26 b111ed2 | 0 | 30 | n.b. | archive | gelijk aan lokale `pr47`; tag en verwijderen |
| `hermes/nino-art-intake-45` | remote | 2026-10-26 4eb9a5a | 0 | 28 | n.b. | archive | gelijk aan lokale `pr48`; tag en verwijderen |
| `hermes/passport-final-art-qa-8a704cb` | remote | 2026-10-29 9e58e75 | 0 | 35 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `hermes/pr51-offline-computer-qa-bd1e57b` | remote | 2026-10-27 bef79da | 0 | 32 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `hermes/pr59-qa-evidence-d55e9de` | remote | 2026-10-27 7568ffa | 0 | 33 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `hermes/qa-pr39-fc8f5be` | remote | 2026-10-25 40674eb | 0 | 12 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `hermes/topo-discovery-map-production` | remote | 2026-10-25 f67027d | 0 | 10 | n.b. | archive | gelijk aan lokale `pr30`; tag en verwijderen |
| `hermes/topo-exploration-map-design-proof` | remote | 2026-10-24 a5c740c | 0 | 9 | n.b. | archive | gelijk aan lokale `pr26`; tag en verwijderen |
| `hermes/topo-ipad-focus-mode` | remote | 2026-10-26 71b33fd | 0 | 12 | n.b. | archive | gelijk aan lokale `pr40`; tag en verwijderen |
| `hermes/topo-nino-visual-integration` | remote | 2026-10-24 4f15b61 | 0 | 6 | n.b. | archive | gelijk aan lokale `pr14`; tag en verwijderen |
| `integration/topo-release-1-2-nino-lakes` | remote | 2026-10-24 c68ace4 | 0 | 8 | n.b. | archive | gelijk aan lokale `pr17`; tag en verwijderen |
| `land/fr-geo` | remote | 2026-11-13 dc9d094 | 0 | 212 | n.b. | keep | actieve werkstroom (STATE): Frankrijk geometrie |
| `land/fr-inhoud` | remote | 2026-11-12 dc46b20 | 0 | 205 | n.b. | keep | actieve werkstroom (STATE): Frankrijk inhoud |
| `main` | beide | 2026-09-28 7e38160 | 0 | 0 | n.b. | keep | beschermd; lokaal 3 commits achter op `origin/main` (84f238b) |
| `night/2026-11-13` | lokaal | 2026-11-13 84f238b | 0 | 3 | n.b. | archive | zelfde sha als `origin/main`; vorige nachtbranch, inhoud staat in main. Verwijderen kan na bijwerken van lokale `main` |
| `night/2026-11-14` | lokaal | 2026-11-13 84f238b | 0 | 3 | n.b. | keep | beschermd: huidige nachtbranch |
| `ops/domein` | remote | 2026-11-13 1639a5a | 0 | 2 | n.b. | archive | waarschijnlijk squash-gemerged als #84; verifiëren na bijwerken `main` |
| `ops/nightly-install` | remote | 2026-11-13 0298f15 | 0 | 3 | n.b. | archive | waarschijnlijk squash-gemerged als #85; verifiëren na bijwerken `main` |
| `ops/setup` | remote | 2026-11-13 2f3e706 | 0 | 1 | n.b. | archive | waarschijnlijk squash-gemerged als #83; verifiëren na bijwerken `main` |
| `pr14` | lokaal | 2026-10-24 4f15b61 | 0 | 6 | n.b. | archive | lokale kopie van `hermes/topo-nino-visual-integration` (zelfde sha) |
| `pr15` | lokaal | 2026-10-24 35ff21b | 0 | 6 | n.b. | archive | lokale kopie van `codex/topo-lakes-map-layer` (zelfde sha) |
| `pr17` | lokaal | 2026-10-24 c68ace4 | 0 | 8 | n.b. | archive | lokale kopie van `integration/topo-release-1-2-nino-lakes` (zelfde sha) |
| `pr2` | lokaal | 2026-10-23 141a0f9 | 0 | 1 | n.b. | archive | lokale kopie van `work/topo-sync-2026-10-23` (zelfde sha) |
| `pr26` | lokaal | 2026-10-24 a5c740c | 0 | 9 | n.b. | archive | lokale kopie van `hermes/topo-exploration-map-design-proof` (zelfde sha) |
| `pr27` | lokaal | 2026-10-24 1c4d00f | 0 | 9 | n.b. | archive | lokale kopie van `codex/topo-schoolblad-overlay` (zelfde sha) |
| `pr29` | lokaal | 2026-10-25 dcc474e | 0 | 9 | n.b. | archive | lokale kopie van `codex/topo-pizza-reward-v2` (zelfde sha) |
| `pr3` | lokaal | 2026-10-23 9df4989 | 0 | 4 | n.b. | archive | lokale kopie van `codex/topo-release-1-integration` (zelfde sha) |
| `pr30` | lokaal | 2026-10-25 f67027d | 0 | 10 | n.b. | archive | lokale kopie van `hermes/topo-discovery-map-production` (zelfde sha) |
| `pr39` | lokaal | 2026-10-25 fc8f5be | 0 | 11 | n.b. | archive | lokale kopie van `codex/topo-semantic-map-hotfix` (zelfde sha) |
| `pr40` | lokaal | 2026-10-26 71b33fd | 0 | 12 | n.b. | archive | lokale kopie van `hermes/topo-ipad-focus-mode` (zelfde sha) |
| `pr42` | lokaal | 2026-10-27 8e0300c | 0 | 19 | n.b. | archive | lokale kopie van `docs/nino-gold-journey-roadmap-20261026` (zelfde sha) |
| `pr47` | lokaal | 2026-10-26 b111ed2 | 0 | 30 | n.b. | archive | lokale kopie van `fix/afternoon-ipad-blockers-20261026` (zelfde sha) |
| `pr48` | lokaal | 2026-10-26 4eb9a5a | 0 | 28 | n.b. | archive | lokale kopie van `hermes/nino-art-intake-45` (zelfde sha) |
| `pr49` | lokaal | 2026-10-26 a77d1cf | 0 | 31 | n.b. | archive | lokale kopie van `codex/passport-scoperte-preparation-20261026` (zelfde sha) |
| `pr51` | lokaal | 2026-10-27 bd1e57b | 0 | 31 | n.b. | archive | lokale kopie van `codex/issue-50-offline-computer` (zelfde sha) |
| `pr59` | lokaal | 2026-10-30 46d58ec | 0 | 34 | n.b. | archive | lokale kopie van `codex/issue-58-legible-map-picker` (zelfde sha) |
| `pr6` | lokaal | 2026-10-24 2922be8 | 0 | 9 | n.b. | archive | lokale kopie van `design/nino-character-content-pack-20261023` (zelfde sha) |
| `pr60` | lokaal | 2026-10-29 d7a9921 | 0 | 43 | n.b. | archive | lokale kopie van `codex/issue-58-rome-vatican-enclave-ui` (zelfde sha) |
| `pr61` | lokaal | 2026-10-30 1bf86b3 | 0 | 47 | n.b. | archive | lokale kopie van `codex/topo-nino-computer-release-20261030` (zelfde sha) |
| `pr62` | lokaal | 2026-10-30 b7ee902 | 0 | 47 | n.b. | archive | lokale kopie van `design/approved-map-choice-preview-20261030` (zelfde sha) |
| `pr63` | lokaal | 2026-10-30 92893ae | 0 | 25 | n.b. | archive | lokale kopie van `art/nino-pisa-hinge-qa-20261030` (zelfde sha) |
| `pr64` | lokaal | 2026-10-31 940a6a5 | 0 | 60 | n.b. | archive | lokale kopie van `codex/issue-52-calm-desktop-learning` (zelfde sha) |
| `pr65` | lokaal | 2026-10-30 5cfcbc3 | 0 | 35 | n.b. | archive | lokale kopie van `art/nino-micro-icons-v2-20261030` (zelfde sha) |
| `pr66` | lokaal | 2026-10-31 cec9fd2 | 0 | 37 | n.b. | archive | lokale kopie van `art/nino-venezia-scalloped-20261031` (zelfde sha) |
| `pr69` | lokaal | 2026-11-02 127d2e0 | 0 | 33 | n.b. | archive | lokale kopie van `design/nino-cplus-20261102` (zelfde sha) |
| `pr7` | lokaal | 2026-10-24 ba573df | 0 | 5 | n.b. | archive | **alleen lokaal, geen remote-tegenhanger**: uniek, dus eerst taggen (`archive/pr7`) |
| `pr70` | lokaal | 2026-11-08 25ad874 | 0 | 75 | n.b. | archive | **alleen lokaal, geen remote-tegenhanger**: uniek, dus eerst taggen (`archive/pr70`) |
| `pr72` | lokaal | 2026-11-03 8414319 | 0 | 30 | n.b. | archive | lokale kopie van `art/pisa-hinge-source-preserving-final-20261103` (zelfde sha) |
| `pr75` | lokaal | 2026-11-07 5976b83 | 0 | 51 | n.b. | archive | lokale kopie van `art/nino-final-closeout-20261107` (zelfde sha) |
| `pr9` | lokaal | 2026-10-23 a481317 | 0 | 5 | n.b. | archive | lokale kopie van `codex/topo-release-1-1-polish` (zelfde sha) |
| `qa/hermes-harness-v2-beeaef4` | remote | 2026-11-06 f8d7e2e | 0 | 83 | n.b. | archive | QA-verdict; tag `archive/qa/hermes-harness-v2-beeaef4` en verwijderen |
| `qa/hermes-nino-v2-closure-67` | remote | 2026-11-03 827ebaf | 0 | 50 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/hermes-nino2-final-71` | remote | 2026-11-03 64216f6 | 0 | 59 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/hermes-pisa-final-72` | remote | 2026-11-03 a4248da | 0 | 31 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/hermes-playable-b06b130` | remote | 2026-11-06 f9b79d8 | 0 | 64 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/hermes-r2-final-bb27e61` | remote | 2026-11-07 9fff2e9 | 0 | 72 | n.b. | archive | QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/v3-app-1a42590` | remote | 2026-11-09 f4aa376 | 0 | 100 | n.b. | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen (eventueel eerst als bijlage bij BL-004) |
| `qa/v3-art-05ab1d0` | remote | 2026-11-09 6fb8831 | 0 | 103 | n.b. | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/v3-art-908b4a4` | remote | 2026-11-09 a4af571 | 0 | 100 | n.b. | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/v3-ge01-6934799` | remote | 2026-11-09 ae87421 | 0 | 102 | n.b. | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen |
| `qa/v3-reis-afb32d1` | remote | 2026-11-09 697e815 | 0 | 84 | n.b. | archive | V3-QA-verdict; tag `archive/qa/...` en verwijderen |
| `release/topo-nino-computer-v1-20261030` | remote | 2026-10-30 1bf86b3 | 0 | 47 | n.b. | archive | zelfde sha als `codex/topo-nino-computer-release-20261030`; tag en verwijderen |
| `v3/relief-z8` | remote | 2026-11-09 2a7b0cf | 0 | 85 | n.b. | merge | V3-reliëfwerk; beoordelen en mergen naar `codex/topo-v3` voor verwijdering |
| `work/topo-sync-2026-10-23` | remote | 2026-10-23 141a0f9 | 0 | 1 | n.b. | archive | gelijk aan lokale `pr2`; tag en verwijderen |

## Samenvatting
- keep: 8 (`main`, `night/2026-11-14`, `art/master`, `codex/topo-v3`, `feat/nino-topo-portal-r2`, `art/nino-topo-website-v1`, `land/fr-geo`, `land/fr-inhoud`) + `arch/v3-runtime` = 9
- merge: 3 (`art/nino-topo-r3-refinements`, `art/v3-render-assets`, `v3/relief-z8`)
- archive: 95
- delete: 0 (zie beperking 1)
- Totaal: 9 + 3 + 95 + 0 = 107
- Na opruiming: 9 branches (alle `keep`; de 3 `merge`-rijen verdwijnen na het mergen). Van die 9 zijn `main`, `art/master` en de nachtbranch geen taakbranches; er blijven dus **6** taakbranches over (norm ≤ 5). Motivatie: `codex/topo-v3` (V3.0-kandidaat, M0), `feat/nino-topo-portal-r2` (portal, M0), `art/nino-topo-website-v1` (website, M0), `land/fr-geo` en `land/fr-inhoud` (FR-data parallel op Codex, besloten 13-11, code gepauzeerd tot M1), `arch/v3-runtime` (runtime-migratie M1). Voorstel: `land/fr-geo` en `land/fr-inhoud` samenvoegen tot één branch (GIT_RELEASE §1: geen eigen langlopende landbranch) zodra BL-005 ze integreert.
- Dubbel werk: 29 van de 31 lokale `pr*`-branches hebben dezelfde sha als een remote-branch; alleen `pr7` en `pr70` zijn uniek lokaal.
