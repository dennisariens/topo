# Nino — 26 Oct functional iPad test update

**PURPOSE:** unblock today's learner test on the actual iPad, using existing PR #40 without adding new art/pizza/passport scope.

**Working branch:** `fix/afternoon-ipad-blockers-20261026` (stacked on exact PR #40 `71b33fd`). Both `output/html/topo-italie-duolingo.html` and `output/html/topo-italie-interactief.html` are committed and point to the same byte-identical revised single-file app as `index.html`.

## Changes limited to reported blockers
1. **Apennijnen:** current SVG `area-c` on-map preview and real 45-ID item list now share a corrected, connected corridor following the mainland peninsula toward Calabria rather than ending in the sea. The coastal constraint was sampled against the existing Italy vector silhouette: **156 polygon vertices and 20 interpolation samples per edge on mapped Italian land**; same ID, kind and school syllabus. Updated `docs/geography/map-manifest.json` geometric source hash. The band remains a *schematic learning zone*, not a geodetic boundary or elevation survey. Physical iPad and educational source QA remain an explicit acceptance gate (#37).
2. **Kaartstijl:** actual map-style selector now says **Kaartstijl** and uses a simple inline map-layers icon instead of the misaligned `▱` glyph. Align icon/label/dropdown arrow; no externally fetched SVG/font.
3. **Camera:** `Volledige kaart` → **Heel Italië**, `Hoofdstuk in beeld` → **Zoom op hoofdstuk**; exposes active state. Zoom becomes genuinely disabled with a concise explanation when `Alle 45`, mixed, or no specific chapter context is chosen, instead of silently resetting to overview. Manual +/−/touch pan still work.
4. **Menu:** study modes stay first; infrequent backup/printing settings move behind **Instellingen en meer**; original accessible buttons, quizzes and single official input unchanged. No added modes, new artwork or reward counters.

## Invariants, tests and review
- The two output HTML files are pinned to exactly the same Git blob as `index.html`, enabling direct LAN testing **without npm rebuild**.
- Maintained source modules updated alongside embedded HTML; explicit Focus source protection test was narrowed to accept *only* the specified Apennines + map-style visual changes; the rest of the verified teaching/score source still compared to PR #39.
- `scripts/validate-map.mjs` now samples the entire visible Apennines polygon boundary on the source Italy vector and rejects offshore crossings.
- `scripts/qa-focus-mode.mjs` updated for camera button renames. **Automated npm/Chromium suites have NOT been executed through this GitHub-only work session**, so do NOT claim full QA PASS before a real runner executes them; the author performed structural source and GIS-contour checks only.
- **Mandatory Codex QA:** `npm ci && npm run build && npm run lint && npm test && npm run audit:release-1-2`, then browser iPad Focus tests where Playwright is set up; review resulting diff after build, identical HTML blobs, all 45 ID unchanged, Gold/reward/backup preservation, actual Apennines learning tap and chapter disabling at all-45. Report exact PASS/FAIL; fix failures in this PR only.
- **Owner physical Safari QA:** iPad landscape/portrait, actual keyboard visibility/draft/submit, Apennines visual and region tapping, Po/Toscane/point picker, Menu/Kaartstijl/Heel Italië/chapter zoom disable; please record any failure and exact version.
- No merge, production deploy, installation or artwork intake in this PR.

## Opened on Mac already serving port 8033

In the isolated local test clone from the earlier instructions:

```sh
cd ~/Topo-iPad-Test
git fetch origin fix/afternoon-ipad-blockers-20261026
git switch --detach origin/fix/afternoon-ipad-blockers-20261026
# If needed, start the local LAN server:
python3 -m http.server 8033 --bind 0.0.0.0 --directory output/html
```

Then in iPad Safari on the same network: `http://192.168.86.156:8033/topo-italie-interactief.html?afternoon=20261026` **only if that is still the Mac's LAN IP**. The local Python server can remain running while the files change; do not start a second server on the same port. Always back up learning progress / use a private Safari tab for test. The URL does not imply a cloud deployment.

**Release status:** functional test candidate, not a QA-certified production GO. Art assets #45 and visual #35 explicitly deferred, as requested.
