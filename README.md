# Topo — Italië

A self-contained Dutch geography learning app for Group 7: 45 places, eleven guided stops, original Nino artwork, and **Ontdekken → Aanwijzen → Namen schrijven**. Smart six-question practice tracks pointing and writing separately. Progress, mistakes, pizza/Vespa rewards, reviews and gold challenges stay in local browser storage. No worksheet-code memorisation or cloud account.

GitHub `dennisariens/topo` is the canonical source. Start with `AGENTS.md`, `docs/PROJECT_STATE.md` and `docs/MAP_SYSTEM.md`. The frozen October 23 Work ZIP is provenance, not an alternative app. Release 1 integration requires owner acceptance before merge/deployment.

```sh
npm ci
npm run dev
# Open http://127.0.0.1:8000/
npm run lint
npm test
npm run build
```

For the jsdom 30 test toolchain use Node 24.15+ (or another version satisfying its engine constraint); this Mac's Node 24.13.1 runs the complete suite but emits dependency engine warnings. The browser app itself has no runtime package dependency. `npm run typecheck` is explicitly a no-op: the app is JavaScript.

Root `index.html` embeds all runtime scripts, map content and images. Engine extracts must exactly match its first two scripts. Build generates byte-identical downloads under `output/html/` and a static `dist/` directory. Serve `dist/` over HTTP(S); GitHub raw links or iOS file previews do not establish interactive browser operation.

## Printing

`print.html` offers reference sheets, marked-place naming and named-place locating for all eleven groups. Temporary V-labels identify questions only. The booklet has 35 A4 pages including contents and an original school-photo appendix. Canonical vector geography is used for the exercises; the perspective-skewed photo remains a separate reference.

After changes affecting print source:

```sh
node scripts/generate-print.mjs
python3 scripts/generate-pdf.py
npm run build
```

PDF generation requires ReportLab and Pillow, plus DejaVu Sans on Linux or Arial on macOS. A temporary Python environment is recommended. On this Mac's old Python 3.8/OpenSSL, regeneration used ReportLab 3.6.12 and Pillow 9.5.0; use a current supported Python and compatible ReportLab for ongoing development. Build/tests reject a booklet with a stale print-source hash. Do not manually edit generated files.

Browser QA: see `docs/HERMES_QA_RELEASE_1.md` and `scripts/qa-release-1.mjs` (Playwright path/browser can be supplied by environment or command options). Physical iPad Safari and actual printer acceptance remain separate checks.
