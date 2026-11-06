# Hermes — onafhankelijke Harness V2-review, PR74

## Verdict: REWORK

**Uitgevoerde kandidaat:** `beeaef406dc5338a4b43e2403a7d9b0519d1adc7`.
**Bevroren V1-basis:** `a86975272ee700d79ab04fe5429ab91165f2029d`.
**Pilot-implementatie uit handoff:** `d225af2ff2ce551fc9cd73fc7f0c970e208f70e9`; die oude pilot is niet stilzwijgend onze geteste head.

PR-head vóór uitvoering gecontroleerd. De review bevat geen productimplementatie, handoff-acceptance, echte QA-handtekening, merge/deploy of wijziging aan de PR-branch. De aparte bewijscommit wordt met volledige SHA in de PR-review gepind. Iedere reviewclaim hieronder geldt uitsluitend voor de uitgevoerde kandidaat, niet automatisch voor latere metadata-commits.

## Uitvoering — bestaande gates slagen

- Node24.15.0, Git2.53.0; expliciete scratch-TMPDIR. Root- en .harness/tooling-dependencies geïnstalleerd via ongewijzigde locks, scripts uitgeschakeld tijdens npm ci.
- **39/39 V2-tests PASS**,0 skipped/failed. [Log](gates/unit-all.log).
- **Volledige ongewijzigde V2-gate PASS op beeaef4**, inclusief alle vier verplichte controles en originele V1 `check.sh` op exact a869752. [V2-summary](gate/summary.json), [V1-summary](gate/v1/summary.json), [volledige log](gates/full-gate.log).
- De **12 vereiste V1-stappen** zijn allemaal uitgevoerd: scope,harness-tests,build,lint,tests,release-audit,map-audit,v2-audit,artifacts,browser,negative-proof,source-unchanged. Browser Chromium/WebKit op1500/768/320; echte rejection-proof weigert een bewust gebroken standalone met exit1. Geen hergebruik van Codex-PASS als onafhankelijke uitvoering.
- Tegen V1 zijn84 paden gewijzigd, maar **slechts één bestaand bestand**: `.github/workflows/harness.yml`, met de begrensde dispatcher/evidencewijziging. Bestaande V1-code/tests/policy/app/art/dependencies blijven behouden.
- HTML40.999.720bytes, SHA256 `933931eb67a347948a270da7aa912bfc48ee3cba420c72fbe7d02e34c93d4a35`. Alle door V1 vereiste aliassen/dist zijn gecontroleerd. Dit is behoud van het bestaande NINO-artifact, geen nieuwe NINO-product-/visuele acceptatie.
- Op basis van de werkelijk uitgevoerde gate een verse **PROVISIONAL_AWAITING_INDEPENDENT_QA**-bundle gemaakt;17 manifestbestanden bytegecontroleerd, QA blijft OPEN. [Provisional-manifest](gate/provisional-manifest.json), [log](gates/provisional-package.log). De HTML is niet nogmaals in deze bewijsdirectory gekopieerd: originele bytes staan al op de geteste Git-SHA; de complete tijdelijke bundle stond uitsluitend in eigen scratch. Dit bewijs is geen releasebundle.

Een groene inherited suite is niet het eindverdict. Onderstaande aanvullende, door parent herhaalde sandboxproeven reproduceren ontbrekende invarianten.

## H1 — P1: recover omzeilt een actieve runner-lease

Bron: `scripts/harness/v2/controller.mjs:12,40–41`; lease bij `:16,18`.

**Repro:** een fixture houdt `withRunLock` vast en voert een gezonde, getrackte eigen testactie uit. Een tweede echte gekopieerde CLI voert `recover TOPO-PILOT-001` uit. Werkelijk: exit0, actie beëindigd met **SIGKILL**, taak wordt BLOCKED/INTERRUPTED, attempts1; lockeigenaar leeft nog en runner.lock bestaat nog. Geen echte gate of gebruikersproces geraakt.

`recoverAction` beëindigt de actie vóór een controle op de runner-lease. `resume` gebruikt dezelfde onbeschermde route (broninspectie; directe CLI-repro betreft recover). Een dubbele controller/wakeup kan zo gezonde verificatie vernietigen en budget verbruiken. Dit is een lokale mutexfout, niet een ontbrekende externe scheduler.

**Verwacht:** alle muterende herstelcommando's moeten dezelfde actieve lease respecteren vóór signalering, cleanup of events. Een levende eigenaar vereist weigering of een expliciete, geregistreerde override.

## H2 — P1: run houdt REVIEW_READY vast na nieuwe code en gewijzigde bundle

Bron: `controller.mjs:15,18–19`; historische receiptcontrole `receipt.mjs:5,7`.

**Repro:** een synthetische, duidelijk als fixture gelabelde taak bereikt via de echte PACKAGE-guards REVIEW_READY met een geldige kortlevende fixturehandtekening. Commit daarna andere fixture-implementatiecode en wijzig de reeds verpakte HTML. `run(root,dir)` retourneert nog **REVIEW_READY**, terwijl HEAD afwijkt en de artifactbytes niet meer kloppen.

Het STOP-pad keert terug vóór `checkpoint` of een actuele bundlecontrole. Dit schendt de expliciete regel dat elke commit QA ongeldig maakt en dat readiness ongewijzigde packagebytes vereist. Geen echte receipt, signing key of productieaanvaarding gebruikt.

`verifyReceipt` blijft daarbij cryptografisch VALID voor het **historische** bericht/de oude state. Dat is op zichzelf geen gebroken cryptografie; de fout is historische handtekeningvaliditeit/terminale state als actuele readiness laten gelden. De CLI moet deze begrippen duidelijk scheiden.

**Verwacht:** ook terminale run/ready-terugkeer toetst actuele HEAD, contract en bundle-integriteit; gewijzigde inputs leveren geen actuele REVIEW_READY op. Historie behouden, approval niet overdragen.

## H3 — P1: finale PACKAGE-validatie mist gesloten inhoudsset en symlinkcontrole

Bron: `controller.mjs:31`, tegenover initiële `package.mjs:2–4`.

**Repro A:** na fixtureondertekening van een geldig, ongewijzigd manifest verschijnt `browser-backup.json` met uitsluitend TEST-ONLY-tekst in de controllerbundle. Finalisatie verifieert alleen de genoemde bestanden en bereikt **REVIEW_READY**, met het extra bestand nog aanwezig en `learnerDataIncluded:false`.

Dit is **niet** P001's expliciet uitgezonderde geval van een aanvankelijk niet-lege directory bij rechtstreeks createPackage-gebruik. Dit gebeurt ná de handtekening in de controllerbundle. Een als directory/archief gedeelde bundle kan zo niet-gereviewde extra gegevens bevatten ondanks de strikte allowlistgarantie. Geen echte leerlingdata/exfiltratie geclaimd.

**Repro B:** vervang een ondertekend genoemd logbestand door een symlink naar identieke fixturebytes buiten de bundle. Finalisatie volgt de link en bereikt REVIEW_READY. Zelfstandigheid/blijvende referentcontrole zijn daarmee niet bewezen.

**Verwacht:** inventariseer de werkelijke inhoud opnieuw bij finalisatie; exacte manifestset, alleen gewone bestanden, veilige unieke relatieve paden, verplichte HTML-mapping en geen symlinks in componenten. Controleer niet uitsluitend hashes van manifestentries.

Een extra schemafixture met door de fixture-reviewer expliciet ondertekend `../outside-fixture.txt` zonder HTML wordt ook geaccepteerd. Dit vereist een reviewer die een misvormd manifest tekent; het is **geen** ongeauthenticeerde handtekeningomzeiling. Het onderstreept de structurele validatiebehoefte, niet een apart zwaarder incident.

## H4 — P2: succesvolle volledige verificatie breekt de failure-streak niet

Bron: `machine.mjs:18–19,23`; owner-continuation `CONTRACT.md:32,35`. De afzonderlijke gate-ledger reset wél (`gate.mjs:6,16`).

**Legale eventsequence-fixture:** failure → descendant repair → verified(full-PASS-event) → onafhankelijke-QA-block → volgende descendant repair → eerste volgende failure. Na de success-event blijven attempts1/same1 bestaan; die latere eerste fout wordt same2 en BLOCKED. Alle12 historische events blijven aanwezig.

Dit is een state-machineproef, niet de claim dat de echte V1-gate twee keer faalde. Het toont dat controllerstreaks anders werken dan de vereiste reset na complete succesvolle validatie. Repair alleen mag counters niet resetten; een succesvolle volledige verificatie moet het actieve fout-epoch wel afsluiten, met behoud van geschiedenis/cumulatieve metrics.

## H5 — P2: Brain-check noemt dirty verificatiecode vers

Bron: `brain.mjs:8`, `scope.mjs:13`.

**Git-fixture:** commit geldige synthetische gate-evidence met het werkelijke implementatiedigest en reconcile de Brain. De controle slaagt. Wijzig daarna een tracked `scripts/harness/v2/check.mjs` zonder commit: Git meldt dirty en het actuele digest wijkt af, maar checkBrain blijft **PASS**.

Historische feiten over de vastgelegde commit kunnen geldig blijven. Het probleem is de ongekwalificeerde freshness-PASS voor een andere huidige werkboom. **Geen bypass van de volledige delivery-gate:** die weigert dirty inputs wel. Weiger gewijzigde verificatie-inputs of presenteer expliciet alleen historische commitvaliditeit, niet actuele freshness.

## Aanvullende grenzen — geen extra hoofdblockers

1. **Root-dode descendants:** een eigen detached fixture blijft na normale rootexit voorbij de deadline leven, action.json verdwijnt en recovery kan hem niet terugvinden. Dat is daadwerkelijk gemeten, maar de handoff/README noemen dit al expliciet als host-supervisor/cgroupgrens. De P1-classificatie van het recovery-deelrapport nemen wij daarom **niet** als extra nieuwe hoofdbevinding over. Productiesupervisie moet die bekende grens nog afdekken; de echte uitgevoerde gate is niet als lekkend aangetoond.
2. **Algorithmepinning:** een extern vertrouwde RSA2048-fixturekey passeert de geadverteerde Ed25519-route. Dat vereist voorafgaand vertrouwen in die RSA-key, dus geen onbetrouwbare signer-substitutie. Enforce Ed25519-keytype of verduidelijk algoritmebeleid; afzonderlijke policy/docs-hardening.
3. **Handoffhistorie:** accept staat metadata-only verwijdering van de genoemde actuele evidence toe en kan een zichtbaar oude gate bij nieuwe implementatie meenemen. De originele blob blijft via handoff.headSha in Git beschikbaar; een handoff is geen QA. Daarom geen vervalste identiteit of verdwenen duurzame historie geclaimd. Verduidelijk actuele versus historische bewijsbinding of hercontroleer die bij accept. Onafhankelijke verse verificatie blijft nodig.
4. Een lokaal ingesteld origin is niet automatisch geauthenticeerd GitHub; caller/from/to/as-strings en hashketens bewijzen geen menselijke/agentidentiteit. Vertrouwde remote-, host- en keyprovisioning zijn hier expliciete externe verantwoordelijkheden, geen geïnstalleerde services.
5. P001/nonempty-standalone-output blijft buiten deze scope. Geen merge-/policy-promotie van die verbetering uitgevoerd.

## Werkende negatieve controles

- Verkeerde signer/handtekening, gewijzigd task/source/artifact/manifest/reviewer/role worden geweigerd.
- Gewijzigde **genoemde** packagebytes worden geweigerd; H3 gaat over ontbrekende inhouds-/typecontrole.
- Dirty handoff, ongeduwde lokale commit en ontbrekende committed gatehash worden geweigerd.
- Snapshotcache is niet gezaghebbend; afgebroken/tampered eventlog faalt gesloten.
- Afwijkende PID-startidentiteit wordt niet gesignaleerd.
- Bounded run laat één verse verificatie na interruptie toe en stopt bij de tweede opeenvolgende interruptie.
- Vereiste skills ontbreken → block; selectie/read is geen use; gewijzigde instructies en ontbrekend concreet gebruiksbewijs worden geweigerd.

## Bewijs, attributie en reproduceren

[Parent recovery-uitvoering](gates/parent-recovery-probes.log), [parent trust-uitvoering](gates/parent-trust-probes.log), [recovery-resultaten](recovery/results.json), [recovery-deelrapport](recovery/FINDINGS.md), [trust-deelrapport](trust/REVIEW.md). Deelscopes zijn gedelegeerd; parent heeft bron en probes gelezen en beide volledige sandboxproeven zelf herhaald met Node24.15.0/Git2.53.0. Zelfrapportage was niet voldoende. Het trust-deelrapport noemt zijn oorspronkelijke Node25-run; de gezaghebbende parentherhaling gebruikte ondersteunde Node24.

Alle cryptografische ontvangsten, synthetische gates, mini-repositories en lokale bare remotes in de proeven zijn **TEST-ONLY-fixtures**. Geen echte Hermes-receipt, private eigenaarssleutel, remote-handoffacceptance, geauthenticeerde externe agentcall of echte REVIEW_READY-pilot gemaakt. De daadwerkelijke volledige gate is apart hierboven bewezen. Controllerpilotretained data zijn niet als nieuw onafhankelijk pilotverloop opgevoerd.

Proofbronnen staan als `recovery/proof.mjs.txt` en `trust/probe.mjs.txt`, zodat bewijs tekst blijft en geen runtimewijziging wordt. Kopieer naar een eigen scratchdirectory als `.mjs`, pas het expliciete bron-checkoutpad aan en wijs dat naar een checkout op de geteste beeaef4-SHA. De recoveryproef vereist die HEAD en maakt uitsluitend eigen fixtureprocessen; nooit op een live gebruikersactie richten.

```sh
export PATH=/opt/homebrew/bin:$PATH
export TMPDIR=/Users/dennisariens/.hermes/cache/scratch
# In de bevroren kandidaat, niet op de bewijscommit:
npm ci --ignore-scripts --no-audit --no-fund
npm ci --prefix .harness/tooling --ignore-scripts --no-audit --no-fund
node --test scripts/harness/v2/*.test.mjs
node scripts/harness/v2/gate.mjs --out .harness/tasks/TOPO-HARNESS-002/runs/eigen-review
```

De eerste losstaande unitpoging gebruikte onbedoeld oude OS-Git2.24.3, die `git init -b` niet ondersteunt. De definitieve39 tests en volledige gate zijn opnieuw uitgevoerd met Git2.53.0 en expliciete scratch-TMPDIR; deze setupfout is niet als productdefect of gatepoging opgevoerd. Geen controledrempel verlaagd, geen ledger gewist om te slagen.

## Volgende actie

**Implementer: herstel eerst de lease-check vóór recovery-side-effects en de actuele ready/package-invarianten; voeg de bovenstaande regressies toe, herstel failure-epoch/Brainfreshness en lever een nieuwe exacte SHA voor herreview.** Teken geen echte onafhankelijke PASS totdat die herreview slaagt. Externe host-/identityprovisioning en merge/deploy blijven eigenaarbesluiten.
