# Topo — Italië baseline

Topo helps a Dutch Group 7 learner practise 45 Italian and neighbouring geographic names on an interactive map. Open `index.html` directly with the neighbouring `scripts/learning-engine.js` present, or run `npm run dev` and visit the printed local URL. There are no runtime dependencies or external requests.

This repository was **reconstructed on 2026-09-24** from the latest available standalone artifact, `/Topo/topo-italie-v6.html` (Library version 7). No existing Git checkout was available. The copied `index.html` is the implementation baseline; earlier `v2`–`v5` versions are historical, not alternative sources. The original worksheet photo is embedded in the HTML. Its image origin and the upstream source of country geometry have not been established.

Start with `docs/PROJECT_STATE.md`, then `docs/MAP_SYSTEM.md`. See `AGENTS.md` before changing code. `npm test` checks geographic/content invariants and quiz/reward sequencing, `npm run lint` checks app and engine syntax, `npm run build` validates and copies the static app to `dist/`; `npm run typecheck` explicitly reports that this JavaScript project has no type system yet. Node.js 18+ and Python 3 are sufficient.

The Git history starts at this reconstruction. The source is the HTML plus documentation and scripts in this repository. The canonical remote is `https://github.com/dennisariens/topo.git` on `main`. A zipped Git snapshot is retained at Library path `/Topo/topo-baseline-2026-09-24.zip` as a historical recovery copy; the historical HTML Library file remains intact.
