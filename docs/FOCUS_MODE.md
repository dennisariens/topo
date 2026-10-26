# P0 iPad Focus Mode — working stacked candidate

## Status / immutable inputs

**CONDITIONAL for owner/device acceptance.** Functional implementation, not another design proposal. Branch `hermes/topo-ipad-focus-mode` starts at exactly PR #39 `fc8f5be4dc77c8b1adb71aae3931a1c134389cf5` and targets `codex/topo-semantic-map-hotfix`. Original PR #30/#39 branches are not modified. No merge/deployment. Issue #33 is authoritative; #35 illustration polish, pizza #29, website #32 and passport redesign are outside scope.

**Two explicit open gates:** physical iPad Safari/IME/VoiceOver acceptance; rerun of the unmodified inherited `qa-map-hit.mjs` browser harness. That harness hardcodes system-temp paths; an attempt to adapt its temp/output paths was approval-blocked and did not run. It was not retried or silently worked around. Existing map-hotfix Node regressions and separate integrated Focus touch tests below did run and pass. They are not represented as the unexecuted inherited browser run.

## Implemented in the real app

- **Map-first:** no permanent right-hand panel in compact/tablet contexts. Available-space rule is ≤1180 CSS px, or coarse-pointer devices up to 1440 px (including 13-inch iPad-size landscape). Large fine-pointer desktop retains the original layout. Existing Nino/art bytes are unchanged.
- **Compact chrome:** original mode buttons and group/Test/backup controls move into an explicit Menu; original Kaartopties and Schoolblad controls remain reachable above the map. Full-map and chapter controls are visible, separate from style options. No oversized photographic gutters. Portrait and landscape use the same source SVG at its exact 890:1235 aspect.
- **One official answer path:** the existing `#quiz`, `#prompt`, `#answer`, `#check`, feedback and Next are reparented, never cloned. Their original handlers continue grading. The pre-existing narrow-route mirror remains hidden/disabled in Focus Mode; no new input or grader is introduced. Returning to desktop restores original parents through anchors.
- **Frosted Parchment:** 93%-opaque warm background only, 4px optional blur, fine warm border/shallow shadow. Actual prompt/input/feedback/Controleer are opaque. Contrast/reduced-transparency and forced-colors fallbacks are opaque. Text contrast ratios from the declared opaque colors: prompt 11.37:1, input 12.99:1, Controleer 7.84:1; input border 3.65:1. Main controls have at least 44 CSS-pixel height.
- **Context-specific surface:** writing gets the low centered sheet; Point gets an instruction/Next pill without input; Learn gets a small original-name/Next strip; route Discover remains compact. Test/Gold retain the original quiet/hint policy. The sheet can move away from an already-highlighted writing target or collapse with an explicit return control. Point answers never determine overlay placement.
- **Keyboard-safe engineering:** listens to actual `window.visualViewport` resize/scroll and reads its offsets/width/height, plus measured sheet bounds and safe-area insets. It does not guess a keyboard pixel height. Visual-viewport positioning runs synchronously at the event to avoid stale in-page positioning; it never edits the answer, selection, quiz or rewards. Rotation and keyboard transitions do not reparent the active field. Input remains 16px to avoid small-input Safari zoom; native page pinch is not disabled.
- **Shared camera:** wrapper CSS variables position/size only `.atlasCanvas>#map`; no per-shape coordinate/hitbox changes or inline camera styles on clonable SVG. Full Italy overview always fits; chapter bounds come from the whole selected group/route chapter, never the requested answer. Exploration entry may frame its group; active assessed questions, typing and style changes never trigger answer-specific reframing. Manual zoom/pan/keyboard +/-/Home use the same CTM-aware resolver. Cloned picker maps remain independently sized.

## Measured useful map space

Same window dimensions and initial writing group; these are real browser bounds, not dimensions inferred from a concept image. The before images come from the immutable #39 HTML. The chosen city may differ, but group/layout/mode are identical.

| View | Previous map viewport | Focus map viewport | Uncovered Focus canvas after sheet | Uncovered ratio | Full-map SVG width |
|---|---:|---:|---:|---:|---:|
| 1180×820 landscape | 183,993 px² | 816,390 px² | 721,750 px² | **3.92×** | **508 px** |
| 820×1180 portrait | 388,311 px² | 849,870 px² | 755,230 px² | **1.94×** | **767 px** |
| 1366×1024 coarse-pointer | 362,562 px² | 1,221,696 px² | 1,127,056 px² | **3.11×** | **655 px** |

“Uncovered” subtracts the sheet/map intersection. It is available canvas area, not a claim that every wide pixel contains Italy at full fit. A full tall Italy overview cannot fill a wide landscape without distortion. The **explicit chapter camera** uses that width for local study; full overview remains one tap away. Source geography and hit tolerances are not stretched to manufacture the improvement.

## Genuine app screenshots

Keyboard-open images use an injected visualViewport test double plus a clearly labelled **SIMULATIE — geen fysieke iPad** occlusion band. They are not OS-keyboard/Safari hardware screenshots.

- Landscape: [before](visual/focus-mode/ipad-landscape-before.png), [closed](visual/focus-mode/ipad-landscape-keyboard-closed.png), [open simulation](visual/focus-mode/ipad-landscape-keyboard-open-SIMULATED.png).
- Portrait: [before](visual/focus-mode/ipad-portrait-before.png), [closed](visual/focus-mode/ipad-portrait-keyboard-closed.png), [open simulation](visual/focus-mode/ipad-portrait-keyboard-open-SIMULATED.png).
- Full/context: [landscape overview](visual/focus-mode/ipad-landscape-full-map.png), [chapter](visual/focus-mode/ipad-landscape-chapter-zoom.png); [portrait overview](visual/focus-mode/ipad-portrait-full-map.png), [chapter](visual/focus-mode/ipad-portrait-chapter-zoom.png).
- Split View: [500px keyboard](visual/focus-mode/split-500-keyboard-open-SIMULATED.png), [700px keyboard](visual/focus-mode/split-700-keyboard-open-SIMULATED.png).
- Genuinely played route: [point stage complete](visual/focus-mode/real-route-point-complete.png), [writing stage complete](visual/focus-mode/real-route-writing-complete.png), [Gold and third-pizza/first-trip](visual/focus-mode/real-route-gold-and-trip.png).

## Executed validation

- **Build, lint, full 17-program test chain and idempotent source audit PASS.** Original sixteen programs remain, including the four #39 semantic-hotfix cases; four new Focus cases lock exact full #39 app preservation outside the isolated Focus insertions, canonical field/handler identity, caret/draft/state continuity, VV reads and surface fallbacks.
- Actual Chromium 156, offline `file://`, **seven viewports:** 1180×820, 820×1180, coarse-pointer 1366×1024, 700×1000, 500×1000, 390×844, 320×568. No permanent sidebar, one visible canonical answer field, question/input/submit inside simulated VV, typed draft/caret/focus survive keyboard/rotation, collapse/restore preserves draft, real answer submission and no document horizontal overflow.
- School/Discovery at identical camera: zero measured screen-coordinate drift across all 45 IDs. Full-map fit, reversible chapter view and original Schoolblad return preserve active state. Both generated HTML files equal canonical index and submit real answers offline.
- Separate integrated semantic probes: **8 orientation/style/zoom runs, 64 targeted real taps**. Tuscany interiors, Po Plain on/away from Po, Po as independent river, wrong region and wrong river with no credit. Additional real Rome/Vatican neutral choice, San Marino and Etna taps. Tests drive real UI questions; they do not replace current expected IDs or call the grader directly.
- A fresh first stop is actually played from Discover through all Point and Write tasks and Gold (including the Gold pause), using touch/typing/submit/Next. Gold is quiet; all 24 eligible retrievals produce three pizzas and one trip. No completed/unlocked fixture is substituted for this flow.
- Zero page errors and zero external requests in the integrated Focus run. Engines, map-hit.js, Discovery modules/raster, Schoolblad modules, geometry/lakes, Nino, package lock and print/PDF remain exact protected bytes. Only isolated additive Focus source blocks are excluded by historical source adapters; a new test compares the entire remaining app to exact #39.

Results: [bounds/viewport/state](visual/focus-mode/browser-results.json), [semantic taps](visual/focus-mode/semantic-focus-results.json), [browser output](visual/focus-mode/browser-output.txt), [suite/audit output](visual/focus-mode/verification.txt). No new runtime assets/dependencies/network services.

```sh
# Node 24.15+
npm ci
npm run build && npm run lint && npm test
npm run audit:release-1-2
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs npm run qa:focus
```

## Review follow-up

Bounded independent read-only review found no P0/P1 and one P2: restoration could focus the canonical input while its destination was still hidden at a responsive breakpoint. Restoration now occurs after parent moves and visibility changes. A real fine-pointer Chromium regression crosses 1500→1100→1500→1000→1500px while retaining input focus, mid-word backward caret selection, draft, task and saved state: **PASS**, recorded in [breakpoint-focus-results.json](visual/focus-mode/breakpoint-focus-results.json). The genuinely played route also deliberately starts Point with a wrong tap, follows feedback/Next/the six-question pause, repairs it and progresses to Write/Gold without a fixture.

## Physical owner test — about 3–5 minutes, still PENDING

1. Use a disposable Safari session or back up actual learning progress. Serve this checkout on the Mac, not production:
   `python3 -m http.server 8033 --bind 0.0.0.0 --directory /Users/dennisariens/projects/topo-ipad-focus-mode`.
   On the same LAN open `http://<Mac-LAN-IP>:8033/`. Record exact commit, iPadOS/Safari and whether Safari tab/PWA/Split View.
2. In landscape choose Namen schrijven from Menu. Tap the actual canonical input to open the **real software keyboard**. Confirm question/input/Controleer stay fully above it; type part of an answer and place the caret mid-word.
3. Rotate to portrait with keyboard open, then resize Split View (~700/~500 px). Confirm draft/caret/task survive, finish the correct name and submit once. Verify correct feedback, one slice at most and working Next. Close/reopen keyboard and collapse/restore the sheet.
4. Point mode must have no typing card. Select Tuscany and Po Plain as regions, Po as river, Rome/Vatican by neutral numbered geography, and San Marino. Switch map style and zoom; full overview must remain reachable without altering the question. Open/close Schoolblad.
5. Check Safari chrome and on-screen keyboard do not hide Menu/controls. Record any VoiceOver test actually performed; do not infer VoiceOver approval from browser/Node checks.

**Remaining gates:** real iPad Safari/IME/VoiceOver/PWA/large-text ergonomics; the approval-blocked inherited browser-hotfix harness rerun. Simulation proves the in-page VV contract, not OS-keyboard delivery, Safari compositor behavior or real touch ergonomics. This is a reviewable functional candidate, not a physical-device PASS or merge/deploy permission.
