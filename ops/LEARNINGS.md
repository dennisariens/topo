# LEARNINGS — het zelflerende deel

Dit is waar het systeem slimmer wordt. Elke FAIL, elke correctie van Dennis en elke onnodig dure run levert één regel op.

## Regels
1. **Vastleggen:** na elke run met FAIL, correctie of verspilling volgt één les in het formaat hieronder. Geen les betekent niets toevoegen.
2. **Promoveren:** komt dezelfde les **2×** voor, dan wordt hij een regel op de plek waar hij effect heeft:
   - gedrag van agents → `CLAUDE.md` / `AGENTS.md`
   - kwaliteitseis → `ops/QUALITY.md` of een test
   - procedure → het betreffende playbook
   - toetsbare eis → **bij voorkeur een test of lint-check**. Een test vergeet niets, een tekstregel wel.
   Markeer de les dan als `→ gepromoveerd naar <bestand/test>`.
3. **Snoeien:** de maandelijkse retro verwijdert regels uit `CLAUDE.md` die niets meer doen (het model maakt die fout niet meer, of de test vangt het al). Elke regel in `CLAUDE.md` kost credits in elke sessie.
4. **Correcties van Dennis** wegen zwaarder: die worden direct gepromoveerd, niet pas na de tweede keer.

## Formaat
`YYYY-MM-DD | bron (FAIL/correctie/verspilling) | wat ging mis | waarom | les | status`

---
2026-11-13 | analyse | Een week werk zonder versie die af is | 6 parallelle werkstromen, main staat sinds 28-09 stil, overdrachten via chats | Eén actieve mijlpaal, max. 5 open branches, integreren naar main is onderdeel van "klaar" | → gepromoveerd naar `GIT_RELEASE.md` §1
2026-11-13 | analyse | Credits snel op | Parallelle Opus-agents plus Codex op dezelfde scope, lange docs elke sessie herlezen | Modelrouting en één bouwer per scope, CLAUDE.md kort | → gepromoveerd naar `HARNESS.md` §4
2026-11-14 | FAIL | Evaluator-criterium vereiste shell/git cherry, maar de nachtrun-sandbox weigerde scripts en losse git-aanroepen | contract ging uit van shelltoegang die niet gecontroleerd was | Check bij contract schrijven dat bouwer en evaluator de benodigde read-only git-commando's mogen draaien; gebruik %(ahead-behind:) in for-each-ref als enkelvoudig commando; vergelijk tegen origin/main, niet lokale main | open
2026-11-14 | FAIL (nacht 1) | Nachtrun stopte na 1 taak, cherry-check onmogelijk | allowlist per Bash-commando te smal (pipes/samengestelde git geweigerd) en lokale main verouderd | Worktree met bypassPermissions + harde deny-lijst; lokale main fetchen; vergelijken met origin/main | → gepromoveerd naar `ops/scripts/nightly.sh`
2026-11-14 | FAIL (BL-005 run 1) | Plan schreef `merge -X theirs` voor om een langlopende branch na een squash te synchroniseren; dat overschrijft stil nieuwer werk | na een squash schuift de merge-base niet op, en de regel was alleen getoetst op de huidige tip | Langlopende branch (`art/master`) komt als merge-commit op `main`; toets elke sync-regel met het scenario "nieuwere commit op de bronbranch" | open, vastleggen in `GIT_RELEASE.md` via BL-005d
2026-11-14 | correctie (BL-005 run 2) | Rapport claimde "alle verwijzingen beoordeeld" na een grep op het absolute pad; ±240 relatieve links gemist | grep op `docs/qa` vindt `../qa/` niet | Toets een uitsluiting op gebroken links in de hele boom, inclusief relatieve links | open
2026-11-14 | verspilling (BL-005) | Build op de volle boom liep vast op ENOSPC, bouwer moest uitwijken naar sparse-checkout en plumbing | schijf van de Mac mini had 4 GB vrij bij een boom van 1,3 GB per checkout | Contract noemt de benodigde vrije schijfruimte; check `df` vóór de start van een taak met extra worktrees | open
2026-11-14 | correctie (BL-002) | Contract ging uit van "A voegt geen markdown toe aan docs/", maar `docs/ASSET_BRIEF.md` komt alleen uit `art/master` | uitgangspunt niet gemeten op de boom `DRY` | Meet zo'n aanname met `git ls-tree` op de doelboom vóór je hem als regel in een contract zet | open
