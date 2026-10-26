# Functional iPad update — PR #47

Baseline: exact PR #40 `71b33fd973c7b650c63e7921af3e7bf6aab5f79f`. Reuses draft PR #47 / `fix/afternoon-ipad-blockers-20261026`. No new artwork, passport, rewards, merge or production deployment.

## Changes

- **Apennijnen / area-c:** connected DEM-guided mainland corridor through18 published pass/peak coordinates, Cadibona→Ligurian/Tuscan/Emilian→central→southern→Pollino/Sila/Serre→Aspromonte near Messina. Only this target shape changes; other44 complete records,27 anchors,6 lakes and original projection remain exact. **Educational zone, not a surveyed mountain boundary.**
- **Zoom op hoofdstuk** genuinely disabled with explanation for all45/mixed/no specific context. Heel Italië and manual zoom remain available. Guarded `disabled` writes prevent the MutationObserver starvation found during QA.
- **Heel Italië / Zoom op hoofdstuk / Kaartstijl**, aligned inline layers icon, no external fonts/icons.
- Original primary study actions first; printing and backups behind **Instellingen en meer**. One canonical quiz/input/check and existing handlers.
- Print source,35-page PDF and source hash regenerated. Historical guards allow only the exact signed area-c correction and original Kaartstijl module/CSS; no broad geometry/engine exclusions.

## Geography proof

[Filled-area result](visual/ipad-update-47/apennines-filled-area.json): polygon difference against the largest connected canonical Italy component, **not boundary sampling alone**. Original PR40: **19.6197% outside mainland**; corrected polygon: **0%**, valid and connected. Old quadratic curves flattened at200 segments per curve; corrected398-vertex polygon measured directly. Areas are SVG projected units, not geodesic km².

[DEM overlay](visual/ipad-update-47/apennines-dem-overlay.png): red=PR40, blue=corrected; dots=sourced Cadibona/Aspromonte. All63 original Terrarium tile hashes rechecked. [Provenance](geography/apennines-provenance.json) records18 source URLs and recipe: elevation-biased routing near reference segments,10-unit corridor,2-unit mainland inset. Original DEM/raster is unchanged. Signed path SHA256 `e5216860fead38464ae54f22fbec0b868e164b9d17e9a978db90be76d8dbdcd2`.

Extent: [Treccani](https://www.treccani.it/enciclopedia/appennino/) and [Treccani ragazzi](https://www.treccani.it/enciclopedia/appennini_(Enciclopedia-dei-ragazzi)/), conventional Cadibona to the Strait of Messina. Archived Wikipedia coordinate responses locate reference peaks/passes; registered DEM guides intervening ridges. No official perimeter/GIS-survey precision claimed. No submerged ribbon or new Sicily learning target.

## Executed evidence

- `npm ci`:37 packages,0 vulnerabilities. Build/lint/full17-program tests/idempotent source audit pass; final exact-SHA review is recorded separately in PR47 comments.
- Maintained Focus browser:7 viewports; **simulated** keyboard, rotation/draft/caret, actual canonical submission, zero45-ID style-coordinate drift, Schoolblad, full/context, actual wrong→repair→Point→Write→Gold and3pizzas/1trip; both offline HTMLs.
- Existing semantic matrix:8 orientation/style/zoom runs,64 deliberate taps for Tuscany/Plain/Po/wrong answers, plus neutral microstates.
- Additional update matrix:8 orientation/style/zoom runs,32 real Apennines/old-offshore taps. Native disabled/hint at all45 and primary menu tested both iPad orientations. Real UI questions, no expected-answer replacement/direct grading.
-35-page PDF regenerated with unchanged generator; map page visually inspected. Canonical index, both output HTMLs and dist are identical. Native Safari/OS keyboard approval remains **PENDING**; Chromium simulation is not hardware proof.

Raw JSON/screenshots/logs: [visual/ipad-update-47/](visual/ipad-update-47/).

```sh
npm ci
# After intentionally changing print data only (ReportLab/Pillow in isolated Python):
node scripts/generate-print.mjs
python scripts/generate-pdf.py
npm run build && npm run lint && npm test && npm run audit:release-1-2
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs QA_FOCUS_DIR=../docs/visual/ipad-update-47/ npm run qa:focus
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/qa-ipad-update.mjs
```

Geography development helpers require NumPy/Pillow/Shapely and cached Terrarium tiles; they are not runtime dependencies. `qa-apennines.py` verifies/reconstructs the source DEM; `generate-apennines.py` reads committed coordinate snapshots and that cache. No geography network calls occur in the offline app.

## Owner's existing Mac mini server — port8033

Read-only inspection: running `python3 -m http.server 8033 --bind 0.0.0.0 --directory output/html` from **`~/Topo-iPad-Test`**, clean at PR40. LAN IP **192.168.86.156** on `en1`. QA did not modify server/process/learner data.

Use the exact reviewed SHA in the PR47 final comment/delivered update script, not moving branch HEAD:

```sh
cd ~/Topo-iPad-Test
git status --short # STOP if dirty; preserve changes, do not reset/stash blindly
git fetch origin fix/afternoon-ipad-blockers-20261026
git switch --detach <EXACT_REVIEWED_SHA>
cmp index.html output/html/topo-italie-interactief.html
cmp index.html output/html/topo-italie-duolingo.html
shasum -a 256 output/html/topo-italie-{interactief,duolingo}.html
```

**Leave the existing8033 process running.** It serves changed files on the next request; never start a second server on that port. Safari URL: `http://192.168.86.156:8033/topo-italie-interactief.html?v=<REVIEWED_SHA>`. Query busts the page cache without changing origin/progress. Never clear site data to refresh; back up progress or use a disposable private tab. If LAN changes, verify `ipconfig getifaddr en1`.

Owner acceptance: both orientations, true keyboard/rotation/draft/submit/Next; Apennines north/center/south and wrong coastal tap; all45 zoom disabled; Heel Italië; styles/menu; existing route/Gold/pizza behavior. Record exact SHA and iPadOS/Safari. No merge/production deployment approval implied.
