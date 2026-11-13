# Roadmap

> Status: **GO door Dennis op 13-11-2026.** Dit is de enige roadmap; `docs/ROADMAP.md` is vervangen.
> Regel: steeds maximaal **1 mijlpaal actief**. Deadlines zijn gebaseerd op nachtruns plus overdag 1–2 bouwsessies.

## M0 — Consolidatie · deadline **vr 20 nov**
Doel: `main` is weer de waarheid en Italië V3.0 staat live.
- `ops/` op `main`; branches van 71 naar ≤ 10 (actief ≤ 5), de rest getagd en gearchiveerd
- V3.0 (`codex/topo-v3`) door G3 (Hermes-hertest, iPad-test door Dennis) → `main` → Vercel productie
- Portal/website (`feat/nino-topo-portal-r2`, `art/nino-topo-website-v1`) naar één preview-URL
- `docs/` opruimen: release- en handoff-bestanden naar `docs/archive/`, `ops/STATE.md` vervangt `PROJECT_STATE.md`
- **Exit:** productie-URL werkt, `main` is groen, eerste nachtrun gelogd

## M1 — Eén runtime met landpakket · deadline **vr 11 dec**
Doel: de kern kent geen land, en Italië is het eerste pakket (`ARCHITECTUUR.md` §3, stappen 1–5).
- Karakterisering groen op de referentie én de kandidaat
- `src/lands/it/` plus manifestvalidatie; build maakt één HTML per land
- Opslagmigratie `topo-italie-v3` → `lands.it` zonder dataverlies
- **Exit:** de Italië-build is functioneel gelijk aan V3.0, iPad 9 groen, en een land toevoegen vraagt nul kernwijzigingen

## M2 — Frankrijk via het playbook · deadline **vr 15 jan**
Doel: het eerste land dat volledig via `playbooks/NIEUW_LAND.md` gaat, en het playbook leert ervan.
- `land/fr-geo` en `land/fr-inhoud` omzetten naar `src/lands/fr/`
- Website: pagina per land en landkiezer
- **Exit:** FR live, doorlooptijd gemeten, playbook bijgewerkt met alle lessen

## M3 — Landenfabriek · deadline **vr 12 feb**
Doel: "over 2 weken volgt Duitsland" werkt.
- Generatoren: geometrie-import, hoofdstukindeling, artworkbrief voor Nino, websitepagina
- Artwork-pijplijn: één goedkeurmoment voor Dennis per land in plaats van per batch
- Proef: Duitsland van G0 tot live in ≤ 14 dagen
- **Exit:** DE live binnen 14 dagen met ≤ 3 contactmomenten voor Dennis

## Later (niet plannen vóór M3)
Japan en verder · leerkrachtmodus · meerdere landen in één app · App Store/PWA-verpakking · monetisering
