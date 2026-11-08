# NINO 2.0.2: kandidaat voor gerichte Hermes-hercheck

**Status: kandidaat. Niet gepubliceerd. Publicatie volgt pas na de Hermes-hercheck en het releaseakkoord van de eigenaar.**

- Basis: de gepubliceerde `v2.0.1` (`36afafa`).
- Scope: alleen de twee REWORK-bevindingen uit het Hermes-rapport over de publieke v2.0.1.
- Buiten scope: Harness (#73/#74) en V3 (#76).

## Bestanden

De SHA256-sommen staan in `output/installers/SHA256SUMS.txt`.

| Bestand | Bytes | SHA256 |
| --- | ---: | --- |
| `output/html/TOPO-NINO-Computer-Release.html` (gelijk aan `index.html` en de aliassen) | 41.445.845 | `3aced3c31259011b0af2947c78f71965cb4beb2e88c69d1663e61792b0304f5a` |
| `output/installers/NINO-2.0.2-macOS.dmg` | 33.867.832 | `c9509400d431da3e8e3c397789911d5f8ac35d8e5ce96291b515711bd8649301` |
| `output/installers/NINO-2.0.2-Windows.zip` | 31.212.525 | `82621d52f64a989921e90cebf7d5803a704c02c72cbd5f84c9602140d2131990` |

- De Mac-app is versie 2.0.2, build 202. De HTML in de DMG en in de ZIP is bytegelijk aan de losse HTML.
- Bouwen kan alleen op macOS: `npm run build`, daarna `node scripts/package-installers.mjs 2.0.2 202`.
- De installerbronnen staan in `installers/`. De iconen, `Lees mij.txt` en het installatiescript zijn ongewijzigd overgenomen uit de publieke 2.0.1-bestanden; in het Windows-script zijn alleen de HTML-hash en de versie nu sjabloonvelden.

## 1. Mac-app startte niet vanuit Programma's

**Reproductie en oorzaak:** zie [repro-2.0.1-en-oorzaak.log](mac/repro-2.0.1-en-oorzaak.log).

- **Pakket 2.0.1:** de hoofdexecutable `Contents/MacOS/NINO` is een shellscript. Na kopiëren naar `/Applications` gaf `open -n` de fout `-10669`, en via Finder starten installeerde niets. De handtekening was geldig.
- **Oorzaak:**
  - LaunchServices registreert een script-executable met de vlaggen `shell-script` en `forged-arch-priority` en behandelt de app daarmee als Intel-app.
  - Op deze Apple Silicon-Mac stond geen Rosetta. Bij de falende start begon macOS zelf de Rosetta-installatie (CoreServicesUIAgent om 22:56:42). Rosetta was om 22:56:53 geïnstalleerd; volgens `install.log` volgde de installatie na de systeemdialoog. De testdriver heeft niets aangeklikt.
  - Daarna startte hetzelfde publieke 2.0.1-pakket wel.
  - Conclusie: 2.0.1 werkt alleen op een Mac met Rosetta. Hermes' testmachine had geen Rosetta, en veel Apple Silicon-Macs hebben het niet.
- **Fix:** de hoofdexecutable is nu een kleine native universal Mach-O (arm64 en x86_64, [`installers/macos/launcher.c`](../../../installers/macos/launcher.c)). Die voert het ongewijzigde installatiescript `Resources/launch.sh` uit. LaunchServices registreert 2.0.2 zonder `shell-script` en zonder `forged-arch-priority`. `Info.plist` kreeg er `LSMinimumSystemVersion 11.0`, `CFBundleInfoDictionaryVersion` en `CFBundleDevelopmentRegion` bij.
- **Test van de nieuwe DMG** ([install-2.0.2.log](mac/install-2.0.2.log)):
  - DMG gekoppeld en `NINO.app` via Finder naar `/Applications` gekopieerd.
  - Openen via Finder installeerde `~/Library/Application Support/TOPO/NINO/NINO.html` met de juiste hash en opende die in de standaardbrowser ([schermafbeelding](mac/finder-start-opent-nino.png)).
  - `open -n /Applications/NINO.app` gaf exit 0.
  - Er is niets omzeild: geen `xattr`, geen `spctl`-uitzondering, geen rechtsklik-openen.
  - Daarna zijn de test-app en de geïnstalleerde HTML verwijderd.
- **Grens van dit bewijs:** de 2.0.2-test liep nadat Rosetta al was geïnstalleerd. Dat 2.0.2 zonder Rosetta start, volgt hier uit twee dingen: de LaunchServices-registratie en de Mach-O-variant die vóór de Rosetta-installatie wel startte. Er is geen nieuwe run gedaan op een Mac zonder Rosetta. **Hermes: hercheck bij voorkeur op een Apple Silicon-Mac zonder Rosetta.**

### Gatekeeper (aparte waarneming)

`spctl --assess --type execute` wijst zowel 2.0.1 als 2.0.2 af. De app is ad hoc gesigneerd, zonder Team ID, en op deze Mac staat geen Developer ID-identiteit.

Een via de browser gedownloade DMG krijgt een quarantainemarkering. Gatekeeper blokkeert de app dan bij de eerste start. **Voor normale distributie zijn daarom een Developer ID Application-handtekening en notarisatie nodig, met de notarisatie vastgeniet aan de DMG (staple).** Daarvoor is een Apple Developer-account nodig. Dat valt buiten deze patch.

## 2. Nino overlapte het toetsresultaat

**Oorzaak:**
- `TopoArt.create` levert een `<figure class="ninoArtSlot">` zonder hoogte.
- Daardoor verwees `.examArt img{height:100%}` naar een automatische hoogte, en de afbeelding kreeg bij de volle breedte haar natuurlijke hoogte (circa 633 px).
- Het vak eromheen (142 px) knipte niets af.

**Fix** (`scripts/nino-exam-result.css`): het vak knipt af (`overflow:hidden`, `contain:paint`), de figure vult precies het vak, en de afbeelding blijft `object-fit:contain` binnen dat vak. De beeldverhouding blijft behouden.

**Bewijs** ([exam-result.json](exam-result/exam-result.json), driver `scripts/qa-nino-202-exam-result.mjs`):
- Gespeelde route: Oefenen → Steden 1–6 → Toets → Alleen namen schrijven, met 1 fout en 5 goed ("5 van 6 goed").
- Gemeten nadat alle animaties waren afgelopen (`getAnimations().finished`, daarna 1,5 s rust), in Chrome 157 en WebKit 27.2, op 1300×950 en 768×1024.
- Gecontroleerd: het werkelijk getekende beeld (na `object-fit`) moet binnen het vak blijven, met de natuurlijke beeldverhouding (afwijking minder dan 1%), en mag titel, score, groep, aanmoediging en knoppen niet raken.

| | Chrome 1300 | Chrome 768 | WebKit 1300 | WebKit 768 |
| --- | --- | --- | --- | --- |
| publieke 2.0.1 | FAIL ([beeld](exam-result/voor-2.0.1-chrome-1300.png)) | FAIL | FAIL ([beeld](exam-result/voor-2.0.1-webkit-1300.png)) | FAIL |
| 2.0.2 | PASS ([beeld](exam-result/na-2.0.2-chrome-1300.png)) | PASS ([beeld](exam-result/na-2.0.2-chrome-768.png)) | PASS ([beeld](exam-result/na-2.0.2-webkit-1300.png)) | PASS ([beeld](exam-result/na-2.0.2-webkit-768.png)) |

Bij 2.0.1 overlapte het beeld score, groep, aanmoediging en knoppen; bij 2.0.2 niets. In geen enkele run waren er JS-fouten of externe verzoeken.

## Controles

- `npm run release:check` slaagt (66 tests, 0 fouten, exit 0); zie [release-check.log](release-check.log). Na deze herbouw is de HTML-hash ongewijzigd `3aced3c3…`, dus de DMG en de ZIP bevatten precies deze HTML.
- `node scripts/audit-nino-v2.mjs` slaagt (exit 0); zie [audit-nino-v2.log](audit-nino-v2.log).
- Nieuwe tests in `scripts/nino-ux-round.test.mjs`: de begrenzing van het toetsresultaat en de installerbronnen.

## Niet getest

- **Windows-installatie: NIET GETEST.** Er is geen Windows-omgeving beschikbaar. De ZIP is op de Mac uitgepakt en vergeleken met 2.0.1: dezelfde vijf bestanden, met als enige verschillen de HTML, de HTML-hash in `Installeer NINO.cmd` en de versie in de snelkoppeling.
- Native Safari, een fysieke iPad, een Mac zonder Rosetta na de fix (zie hierboven), en Gatekeeper met een quarantainemarkering.
