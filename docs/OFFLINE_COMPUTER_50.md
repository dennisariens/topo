# Offline computer handoff — issue #50

## Runtime choice and scope

On 2026-10-27, remote PR #47 HEAD matched the issue pin exactly:
`b111ed2abfed15c97106e3d755fcff33c704215f`. This dedicated branch starts there,
not main or PR #49. No runtime blocker was found; index.html, both original
standalone files, geography, grading, rewards, saves and artwork remain byte unchanged.
Only packaging adds the canonical learner filename; browser harnesses accept this
file as their input. No merge, production deployment or iPad server change.

## Download

[Download TOPO-Italie-Computer.html](https://github.com/dennisariens/topo/releases/download/offline-computer-issue-50/TOPO-Italie-Computer.html)

Click the link, then double-click the downloaded HTML on your Mac. It needs no
other files, account, internet, terminal or server. This is a QA prerelease artifact
for the draft PR, not a production deployment. Keep the same filename/location
and browser for local progress. Local-file storage is browser-specific; moving or
renaming the file or clearing browser data may isolate/remove saves. Use the
existing progress JSON export/import for backups or transfer.

Canonical repository path: `output/html/TOPO-Italie-Computer.html`.
Size: **3,133,692 bytes**. SHA-256 (independently recomputed for all three outputs):
`89464c6686ff90eeaa9cd1274cb39f5881a1905b1b49211427a8f352c5d96c31`.
The exact delivery commit and downloaded-byte verification are recorded on the PR.

## Executed QA

Actual macOS (`darwin`) Chromium **145.0.7632.6**, local `file://` paths,
Playwright contexts with `offline:true`; no HTTP server. No external requests,
page exceptions, console errors or missing decoded image assets in the desktop
smoke. Same-path localStorage survived reload with progress semantically intact.
These are automated desktop-browser observations, not a physical iPad test.

- `npm test`: full 17-program chain PASS; learning/route migration, backups,
  reset scopes, deterministic 8-slice/24-answer reward rollovers, all 45 target
  definitions, geographic/source guards and button flows.
- `npm run lint` and `npm run build`: PASS; rebuild retained original runtime bytes.
- `qa-focus-mode.mjs` with `QA_FOCUS_HTML=output/html/TOPO-Italie-Computer.html`:
  PASS. Seven responsive viewports, fine-pointer desktop breakpoint behavior,
  64 semantic region/river taps, neutral microstate picking, correct/wrong grading,
  genuine Discover→Point→Write→Gold route with wrong→repair, three pizzas/one trip,
  both map styles, schoolblad, controls, and both historical output filenames.
  Keyboard occlusion is simulated, not an OS keyboard.
- `qa-ipad-update.mjs` against canonical HTML: PASS. Eight orientation/style/zoom
  runs, 32 Apennines interior/old-offshore taps, all-45 chapter zoom disabling,
  overview and learner menu. Physical Safari is not implied by viewport names.
- `qa-offline-computer.mjs`: PASS. 1500×1000 desktop, 45 unique IDs partitioned
  into 11 chapters, images, learning/writing, wrong vs correct reward, persisted
  progress, actual pizza/full reset controls. Harness development caught hidden
  quiz controls after reload and JSON key reordering; navigation and semantic
  comparison corrected those test assumptions; runtime unchanged.

Raw results, screenshots and gate logs: [visual/offline-computer](visual/offline-computer/).
Reproduction requires the development-only Playwright module via `PLAYWRIGHT_MODULE`.
No development tool is needed by the learner. Node 24.13.1 completed all checks;
npm ci warned that jsdom's declared range starts at 24.15.0 (or 22.22.2/26).
Physical Safari/IME and independent Hermes verification remain pending.
