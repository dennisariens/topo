# V3 golden screen 1 — Reis / hoofdstukkeuze

**Kandidaat:** `output/html/TOPO-V3-Reis-Preview.html`, SHA256 `c2a7dd09a6e56f26c89779806eb51d7bf7e900dcb7bdc31656f815e7ecd854dd`. Opgebouwd uit de ongewijzigde V2.0.2-`index.html` (`3aced3c3…304f5a`) plus de V3-laag (`scripts/v3/`) en demostanden: `node scripts/build-v3-preview.mjs`.
**Openen:** direct via `file://`. Demostanden: `#nieuw`, `#bezig`, `#afgerond`, `#alles`. Naast elkaar (desktop + telefoon): `#naast-bezig` enzovoort. Demostanden staan alleen in het geheugen; echte opslag wordt niet gelezen of geschreven.
**Oordeel:** technisch geslaagd · visueel zelf beoordeeld (Claude) · **eigenaar: open** · Hermes: open. Geen merge, geen deployment, geen vervanging van downloads.

## Spoor per afspraak

| Afspraak | Bron | Zichtbaar gedrag | Bewijs uit deze HTML | Oordeel |
| --- | --- | --- | --- | --- |
| Huidige halte en volgende actie meteen vindbaar | opdracht, #76 | Kaart "Halte N van 11" met drie lesstappen en één terracotta knop | `results.json` → `primaryAboveFoldAll: true` op 5 viewports × 4 standen. V2 had de knop op ±1000 px ([vergelijking](vergelijking-desktop.png), [telefoon](vergelijking-telefoon.png)) | technisch ✓, visueel ✓, eigenaar open |
| Echte voortgang | V2-motor | Stand, stappen, slot, goud en pizza komen uit `state.route` / `TopoRoute` | flows: afgeronde halte opent ↻-lessen + goud; vergrendelde halte "Opent als je Bergen afrondt", 0 acties | ✓ |
| Acties via V2-gedrag | DECISIONS 7-11 | Elke V3-knop drukt de bestaande V2-knop in | `replayStarted: city2/discover, mode route` | ✓ |
| Reis → Verder geeft dezelfde vraag | DECISIONS 7-11 | Terug naar Reis, dan **Ga verder · Ontdekken** | `questionBefore == reisVerderSameQuestion.id` (`city-10`), tab **Reis** blijft `aria-current=page` (desktop en telefoon) | ✓ |
| Geen overlappende of afgesneden knoppen, lange labels | opdracht | "Extra steden 13–18" op twee regels, "7–12" onbreekbaar | `overlaps`, `clipped`, `brokenWords`, `smallTargets`, `horizontalOverflow`: alle leeg | ✓ |
| Toetsenbord | V2-afspraak | Volgorde: hoofdactie → haltes 1–11 → beloningen; Enter opent detail; 3 px ring | `keyboard` in `results.json` | ✓ |
| Verminderde beweging | V2-afspraak | Geen schaal- of detailanimatie | `reducedMotion: 0s` | ✓ |
| Route verklapt geen ligging | DECISIONS 6-11 | Slingerpad, volgorde 1→11, geen kaart | screenshots | ✓ |
| Juiste artwork per doel | opdracht | Iconen, Nino, zegel, pizza | 18/18 ingebedde bytes == repo-bestand ([artwork-used.json](artwork-used.json)) | ✓ |
| V2 blijft intact | opdracht | — | `index.html` ongewijzigd; `npm run lint`, `npm test`, `npm run build` slagen | ✓ |

Browser: Chrome 153 (Linux, headless) via Playwright, `python3 scripts/qa-v3-reis.py`. **Niet getest:** echte iPad Safari, VoiceOver, Mac-Safari. Op Linux rendert een ander font dan SF Pro; regelafbreking op Apple-apparaten moet nog met eigen ogen worden gecontroleerd.

## Screenshots
`<stand>-<viewport>.png` voor `nieuw`, `bezig`, `afgerond`, `alles` × `desktop`, `ipad-portrait`, `ipad-landscape`, `phone`, `phone-small`. Flows: `flow-detail-*.png`, `flow-lesson-*.png`.

## Open punten (voor de eigenaar)
1. **Header-statistieken** (Goed / Reeks / Pizza's) en de V2-navigatie staan er nog. Ze horen bij de navigatiebeslissing (Oefenen / Kaart / Gold / Beloningen / Voortgang), die nog getoetst moet worden.
2. **Uit Reis verplaatst, niet weg:** dagdoel, kennis-paspoort en de oude resetknop worden op Reis niet meer getoond. Ze staan nog in de DOM. Reset zit al in het instellingenmenu. Dagdoel en kennis-paspoort horen bij **Voortgang**.
3. **Slim rondje** staat als stille link op Reis. Hoort het bij Oefenen?
4. **Nino-zin** komt ongewijzigd uit V2 (`ENTRY.*`).
5. Bij "Alles af" is het beeld Esploratore d'oro; het verdiende goudmoment zelf blijft V2.
