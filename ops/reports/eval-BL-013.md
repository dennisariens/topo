# Evaluatie BL-013 — Portal R3 als site-root

Branch `t/BL-013-portal-r3` @ `7becc1f` · evaluator · 2026-11-14

VERDICT: FAIL

| # | Criterium | Methode | Resultaat | Bewijs |
|---|---|---|---|---|
| 1 | Site-indeling klopt | `npm run build && npm run build:site` (zelf gedraaid) | PASS | exit 0; "Site: dist/ (portal, 24 assets) + dist/italie/ (app)", "Site-check: OK"; `dist/index.html` = portal (9975 B), `dist/italie/index.html` titel "Topo Italië · leer de kaart" |
| 2 | App ongewijzigd | `git diff origin/main -- index.html print.html scripts/learning-engine.js scripts/route-engine.js` (na `git fetch`) | PASS | 0 bytes diff. Overige niet-ops/asset-wijzigingen t.o.v. main: alleen `package.json`, `vercel.json`, `scripts/build-site.mjs`, `scripts/verify-site.mjs` |
| 3 | Bestaande tests groen | `npm run lint && npm test` (zelf gedraaid) | PASS | exit 0; syntax OK, 9 testscripts OK (map, print, learning-engine, route-engine, exam-flow, ui-smoke, route-dom) |
| 4 | Geen kapotte verwijzingen | Playwright + Chrome, `python3 -m http.server` op `dist/`, 4 viewports, lazy→eager, scroll | PASS | Portal: 18 img, 0 kapot, 0 HTTP ≥ 400, 0 requestfailed, 0 console-fouten/-waarschuwingen op 1440×900, 1080×810, 810×1080, 390×844. `/italie/` ook: 0 fouten op alle 4 |
| 5 | Geen horizontale scroll, Nino overlapt geen kaart | zelfde run + eigen screenshots | FAIL (zie redenen) | Letterlijk OK: scrollWidth = innerWidth op alle 4; mascotte (x 24–244) raakt geen kaart (kaarten vanaf x 253), verborgen ≤ 820 px. **Maar** op 1080×810 en 810×1080 worden landnamen in de Binnenkort-kaarten afgesneden door de pil: "Spanj", "Duitsl", "Neder" / "Span", "Duits", "Nede" |
| 6 | Italië-knop werkt | klik "Start leren", Enter na Tab, klik op kaartafbeelding | PASS | alle drie → `http://127.0.0.1:8765/italie/`, titel "Topo Italië · leer de kaart"; screenshot app geladen. Tab-volgorde: skip-link → logo → "Start Italië leren" (focusring zichtbaar) |
| 7 | R3-assets byte-gelijk aan `art/master` | `sha256sum -c` tegen `art/master:assets/nino-topo/v3-r3/SHA256SUMS.txt` (b9e4a38) | PASS met kanttekening | 10/10 aanwezige bestanden OK, in werkmap én in `dist/`. Letterlijk `sha256sum -c` geeft exit 1: 4 bestanden uit de lijst niet overgenomen (`nino-welcome-r3.png`, `favicon-r3-master-1024.png/.webp`, `manifest-upload.json`). Geen enkele mismatch |
| 8 | Frankrijk zonder verzonnen route | bron + DOM | PASS | `routes={italy:'./italie/',france:null}` in `dist/index.html`; Frankrijk-kaart heeft geen `<a>`, toont `<span>` "Leeromgeving volgt"; enige links op de pagina: `#landen`, `./`, `./italie/` |
| 9 | Contrast knoppen | `verify-site.mjs` + eigen meting van berekende kleuren | PASS met kanttekening | verify-site OK. Zelf gemeten: Start leren #FFF/#7B66B7 4,74:1; hover #FFF/#6A539F 6,27:1; Leeromgeving volgt #685398/#F1EDFA 5,56:1. Pil "Binnenkort" #7761AD/#F1EDFA = **4,45:1** (< 4,5, niet-interactief label, valt niet onder de check van verify-site) |

Hover-test (1440×900): hover op Spanje verandert alleen Spanje (schaduw, alt-beeld 0,73, scale 1,025); andere vier kaarten ongewijzigd. Hover op Frankrijk: alleen Frankrijk.

## FAIL-redenen (concreet, reproduceerbaar)
1. **Afgesneden landnamen op iPad-viewports (contractviewports 1080×810 en 810×1080).** In `.future .bottom` krimpt `.title` (min-width:0) tot 83 px resp. 75 px, terwijl de heading 108–138 px nodig heeft; de "Binnenkort"-pil ligt over de tekst. Gemeten overlap met de pil: 1080×810 Spanje 11, Duitsland 33, Nederland 41 px; 810×1080 Spanje 19, Duitsland 40, Nederland 49 px. Ook 1024×768 (Duitsland 20, Nederland 29) en 768×1024 (33/54/63). Reproduceer: build, serveer `dist/`, open op 1080×810, kijk naar de onderste rij. iPad 9 is de ondergrens (AGENTS.md, QUALITY G3 "geen afgesneden tekst"); dit breekt later zeker. Het gedrag is overgenomen uit portal-r2 (zelfde CSS), maar zit nu in deze levering.
2. (Meeliften bij de fix) "Binnenkort"-pil 4,45:1 op 12 px tekst haalt AA net niet. Kleine kleurcorrectie volstaat.

## Buiten scope opgemerkt (→ backlog-idee)
- **Merge-conflict met `origin/main`**: main is na de aftakking verder gegaan (#95, `953a1c5`); `git merge-tree` meldt conflicten in `ops/BACKLOG.md` en `ops/RUNLOG.md`. Rebasen vóór PR.
- **Design-gate G1 zal falen op anti-patroon "tekst onder 13 px"**: tagline 10 px, footer 11 px, knoppen/pillen 12 px.
- Contrast onder AA buiten knoppen: tagline #92929A/#FAFAF9 2,96:1; footer #9999A3/#FAFAF9 2,70:1.
- Geen Golden Screen/render van het portal in `docs/v3/renders/`; visuele vergelijking niet mogelijk, G1 staat nog open.
- Gewicht portal: `dist/assets` ≈ 6,0 MB (destinations 4,0 MB, R3-brand 1,9 MB). Beide logo-SVG's (538 KB elk, ingebedde raster) worden geladen, ook de verborgen variant. iPad-budget nog niet vastgesteld.
- Frankrijk-kaart krijgt de hover-lift van een actieve kaart, maar heeft geen actie (affordance zonder doel).
- In `dist/index.html` staat na de omzetting het commentaar "build-site.mjs zet dit om naar './italie/'" naast `'./italie/'`; cosmetisch.
- Afgeleid, niet getest: `build-site.mjs` twee keer draaien zonder tussenliggende `npm run build` verwijdert `dist/italie/` en verplaatst het portal erin; `verify-site` vangt dat op (faalt luid). Op Vercel geen probleem.
- Afgeleid, niet getest: gedrag van `/italie` zonder slash op Vercel. Lokaal 301 → `/italie/`; de app heeft geen relatieve `src`/`href` (gecontroleerd), dus laag risico.
- Lokale remote-tracking `origin/art/master` stond op `7714e22`; `git ls-remote` toont `b9e4a38` op de remote. Geen probleem voor de levering.

## Les
Contractcriterium 5 ("geen horizontale scroll, geen overlap Nino") dekt afgesneden tekst niet. Een portalcontract moet expliciet "geen afgesneden tekst op alle viewports" bevatten en meetbaar maken (bijv. tekstrange-breedte ≤ containerbreedte). Contrastchecks moeten alle pillen/labels meten, niet twee CSS-tokens.
