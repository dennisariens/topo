# V3 golden screen 1 — Reis / hoofdstukkeuze (v3b)

**Kandidaat:** `output/html/TOPO-V3-Reis-Preview.html`, SHA256 `35a0c4696f42abe7555bcb4452540598c493812abc783412b78b9d06ac6a610d`. Wordt niet meer in Git gezet (41 MB per iteratie); reproduceer met `node scripts/build-v3-preview.mjs` op deze commit. Basis: ongewijzigde V2.0.2-`index.html` (`3aced3c3…304f5a`) + `scripts/v3/`.
**Openen:** direct via `file://`. Standen: `#nieuw`, `#bezig`, `#afgerond`, `#alles`; thema `…/viola`; naast elkaar `#naast-bezig`. Demostanden staan alleen in het geheugen.
**Oordeel:** technisch geslaagd · visueel zelf beoordeeld · **eigenaar: open** · Hermes: open. Geen merge, deployment of downloadvervanging.

## Spoor per afspraak

| Afspraak | Bron | Zichtbaar gedrag | Bewijs (`results.json`) | Oordeel |
| --- | --- | --- | --- | --- |
| Huidige hoofdstuk en volgende actie direct zichtbaar | opdracht, GE01 beat 1 | Gekozen hoofdstuk = huidige; titel, lesstaaf, één actie | `primaryAboveFoldAll: true` (5 formaten × 4 standen) | ✓ |
| Indeling volgens de concepten | eigenaar 9-11 | Zijbalk · hoofdstukken · kaart · één actie | [render naast app](vergelijking-render.png) | eigenaar open |
| Geen taglines/hulptekst | principe | Alleen getallen, titels en "Opent na …" | screenshots | ✓ |
| Echte kaart | AGENTS.md, DECISIONS | Kopie van de live kaart, plekken van het hoofdstuk gemarkeerd, geen namen | `mapGeometry: 46/46 gelijk`; `hitsForCurrent` = hoofdstuk-IDs | ✓ |
| Reliëf als schakelaar | eigenaar 9-11 | Schoolkaart / Reliëf | `reliefOn: block`, `reliefOff: none` | ✓ |
| Landthema | eigenaar 9-11 | Italia / Viola, alleen accent wisselt | `theme` | ✓ |
| Echte voortgang en acties via V2 | V2-motor | Slot, ✓, zegel, lesstaaf; acties drukken V2-knoppen | `lockedPrimary: 0`, `replayStarted` | ✓ |
| Reis → Verder geeft dezelfde vraag | DECISIONS 7-11 | **Ga verder · Ontdekken** | `sameQuestion: true` (desktop en telefoon) | ✓ |
| Herhalen op elk formaat | V2 | ↻-knoppen ook op iPad staand en telefoon | flows telefoon | ✓ (fout gevonden en hersteld) |
| Geen overlap, afkapping, woordbreuk; tabbalk dekt niets af | opdracht | — | alle lijsten leeg; `lastRowHiddenByTabBar: []` | ✓ |
| Toetsenbord | V2 | Zijbalk → hoofdstuk 1–11 → kaartstijl → actie; geen focusvallen in de kaartkopie | `keyboard.order` | ✓ (fout gevonden en hersteld) |
| Verminderde beweging | V2 | Geen overgangen | `reducedMotion: 0s` | ✓ |
| Juiste artwork | opdracht | Hoofdstukzegel, pizza, Nino `guide` | bytes == repo | ✓ |
| V2 intact | opdracht | — | `index.html` ongewijzigd; lint, test, build ✓ | ✓ |

Browser: Chrome 153, Linux, headless (`python3 scripts/qa-v3-reis.py`). **Niet getest:** WebKit (download geblokkeerd in deze omgeving), echte iPad Safari, VoiceOver, SF Pro-weergave.

## Open punten
1. **Levendigheid.** De render oogt rijker door een fijn reliëf en een landschapsachtergrond. Een scherper reliëf vraagt fijnere hoogtetegels: een apart spoor met bron, licentie en een groottelimiet. Achtergrondlandschap alleen met canoniek artwork.
2. **Navigatie.** De zijbalk toont alleen wat werkt: Reis, Oefenen, Beloningen (Reisboekje), Instellingen. Gold, Kaart en Voortgang volgen per scherm.
3. **Accent.** Italia of Viola: keuze eigenaar.
4. **Overgang.** Na Reis zie je nog de V2-schil (lessen, Oefenen). Dat verandert pas in stap 2.
5. **Dagdoel, kennis-paspoort, slim rondje** staan niet op Reis; voorstel: Voortgang en Oefenen.
