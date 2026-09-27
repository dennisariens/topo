# Topo — Italië baseline

Topo helps a Dutch Group 7 learner practise 45 Italian and neighbouring geographic names on an interactive map. Open `index.html` directly with the neighbouring `scripts/learning-engine.js` present, or run `npm run dev` and visit the printed local URL. There are no runtime dependencies or external requests.

**Direct downloads:** `output/html/topo-italie-interactief.html` runs by itself. `print.html` is a standalone, printable group selector with learning cards, code → name and name → code practice, and a choice of clean map or photographed school sheet. `output/pdf/topo-italie-printboek.pdf` contains all 11 groups in those three formats on numbered A4 pages. The PDF pages use the photographed school sheet. All outputs are generated from the same 45 worksheet items.

This repository was **reconstructed on 2026-09-24** from the latest available standalone artifact, `/Topo/topo-italie-v6.html` (Library version 7). No existing Git checkout was available. The copied `index.html` is the implementation baseline; earlier `v2`–`v5` versions are historical, not alternative sources. The original worksheet photo is embedded in the HTML. Its image origin and the upstream source of country geometry have not been established.

Start with `docs/PROJECT_STATE.md`, then `docs/MAP_SYSTEM.md`. See `AGENTS.md` before changing code. `npm test` checks geography, print data, exam flow and rewards; `npm run lint` checks app, print and engine syntax; `npm run build` regenerates the standalone files and builds `dist/`; `python3 scripts/generate-pdf.py` regenerates the booklet (requires ReportLab). `npm run typecheck` explicitly reports that this JavaScript project has no type system yet. Node.js 18+ and Python 3 are sufficient for the app.

The Git history starts at this reconstruction. The source is the HTML plus documentation and scripts in this repository. The canonical remote is `https://github.com/dennisariens/topo.git` on `main`. A zipped Git snapshot is retained at Library path `/Topo/topo-baseline-2026-09-24.zip` as a historical recovery copy; the historical HTML Library file remains intact.
