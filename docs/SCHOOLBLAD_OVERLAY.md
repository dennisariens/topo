# Original schoolblad reference overlay — Issue #23

Baseline: PR #17 `c68ace4e44a6e797f536ec1a8d6b517d29167320`, verified unchanged at task start. Feature branch `codex/topo-schoolblad-overlay`; draft target `integration/topo-release-1-2-nino-lakes`. This implements only the schoolblad reference portion of #22. Hermes' separate map-style proof (#24), art/design branches, and the interactive map style are untouched. No merge or deployment.

## Design and behavior

**Schoolblad bekijken** is a secondary utility near the map header, with a matching entry on the route overview and in the tablet/phone lesson dock (the existing map header is hidden in focused lessons at those widths). It opens a warm paper dialog over a dimmed but visible map. On a wide desktop/iPad, the sheet sits to the right and leaves map context visible; smaller layouts use a centered fitted page. **Terug naar mijn kaart** stays above the image viewport, alongside the labelled original/reference status.

The existing `#school` image node is moved into the dialog. Its JPEG data URI is unchanged, appears only once in canonical markup, and is neither redrawn, recropped, recolored nor aligned with the GIS SVG. The photograph's original perspective and pre-existing photographic crop remain visible. The default fits the entire supplied image at its original 890:1235 ratio. `+`, `−`, **Hele blad**, pointer dragging, arrow keys and two-finger pinch provide bounded 1×–4× magnification relative to that fitted page. Orientation changes reflow the viewport without rotating/distorting pixels. There are no clickable places, answer labels, current-task decorations or grading controls on the sheet.

Native `dialog.showModal()` supplies top-layer modality and makes the underlying app inert. The dialog has a visible accessible title, reference description, labelled zoom group/readout, image alt text and focusable pan region. Explicit Tab/Shift+Tab wrapping prevents keyboard leakage; Escape and the visible close button dismiss it. Focus returns to the opener, or to a still-enabled editor with its prior caret/selection when opened by pointer while typing. A previously submitted/disabled editor returns to the opener. Page scroll and the prior overflow style are restored. Escape is contained so it cannot also dismiss an underlying map lens. The restrained 180ms unfold is disabled for reduced motion.

The overlay only owns temporary viewport/focus state. It does not read or mutate the learning `state`, localStorage, question, answer, grading, score, stage, mastery, reward or Gold ledger. The underlying checkbox/photo asset and its original nonmodal behavior remain a progressive fallback when native modal support is absent. The checkbox is hidden only after successful enhancement; older code invoking its handler opens the same reference dialog in supported browsers.

Implementation follows native-dialog behavior and the [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/); [native dialog reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). This is not a claim of physical VoiceOver certification.

## Source and build boundaries

Most code is in `scripts/schoolblad.js` and `scripts/schoolblad.css`. `scripts/embed-schoolblad.mjs` inserts exactly two bounded source blocks into the existing third script/style. It does not add a fourth script or external request. The build runs embedding before canonical preview/standalone packaging; lint checks exact embedded source parity. Both standalone downloads and `dist/index.html` remain byte-identical to canonical HTML.

The dedicated source regression proves that removing those two overlay blocks reproduces pinned Release 1.2 `index.html` **byte-for-byte**. All prior executable code, 45 items, eleven chapters, 27 anchors, lakes, static map fallback, Nino illustrations, reward logic and embedded image bytes are retained. Original print HTML, PDF and appendix/freshness hash remain exact baseline bytes. The source-preservation audit now understands only these bounded overlay additions and writes new results under this feature's evidence folder, without overwriting the historical integration evidence.

## Executed verification

Node **24.15.0**, Chrome **146.0.7680.153**. These are local executed checks, not GitHub CI claims.

| Check | Result |
| --- | --- |
| `npm ci` | PASS, 37 packages installed from unchanged lockfile |
| `npm run lint` | PASS, three inline scripts, exact embedded overlay/art sources and offline parity |
| `npm test` | PASS: all **14 programs**, including existing learning/Gold/save/reward/geography tests, 6 Nino cases and 4 dedicated schoolblad cases |
| `npm run build` | PASS, both downloads regenerated, print freshness unchanged |
| `npm run audit:release-1-2` | PASS, pinned art/lake/engine/print preservation and byte-idempotent rebuild |
| `npm run qa:schoolblad` | PASS, five responsive viewports and actual offline file artifacts |
| `git diff --check` | PASS |

The schoolblad suite covers Learn/Point/Write/Test/route, active route and Gold fixtures, answered/unanswered states, exact state/storage/question/answer preservation, caret recovery, cancel/close, Tab wrapping, native-modal semantics and the unsupported-native fallback. Existing suites still cover all eleven chapters, genuine Gold/replay/daily rewards and saves/migration/import/reset.

The browser suite uses `file://` **with `offline:true`**, disposable contexts and the actual canonical and downloadable HTML. It checks desktop **1440×1000**, iPad portrait **820×1180**, iPad landscape **1180×820**, phones **390×844 / 320×568**. All modes and Gold open/close mid-question without state/storage/map-markup changes. Correct answers are actually submitted for answered-state verification. Checks include active-editor selection, opener focus, exact scroll recovery, Escape/Tab containment, visible close controls, full uncropped default fit, original aspect ratio, zoom buttons, real pointer pan, reduced motion, no horizontal page overflow, simulated two-finger touch gestures, 200% reference text/controls and rotation on iPad. Both standalone files and dist pass offline. Logs contain **zero page errors and zero external requests**.

Physical iPad Safari, the physical on-screen keyboard, VoiceOver and learner feedback remain untested. Native dialog semantics and emulated touch do not establish physical-device acceptance. The owner must approve this reference interaction before combining with a map-style feature.

## Evidence

[Browser results](visual/schoolblad/browser-results.json) · [full test/build output](visual/schoolblad/verification.txt) · [photograph/print preservation](visual/schoolblad/preservation.json) · [source/asset audit](visual/schoolblad/source-preservation.json).

Compact review set (additional five-viewport captures are in [visual/schoolblad](visual/schoolblad)):

| View | Before / fitted overlay | Legibility / accessibility |
| --- | --- | --- |
| iPad landscape | [before](visual/schoolblad/ipad-landscape-before.png) / [fit](visual/schoolblad/ipad-landscape-fit.png) | [200% zoom/pan](visual/schoolblad/ipad-landscape-zoom.png), [large text](visual/schoolblad/ipad-landscape-large-text.png) |
| iPad portrait | [before](visual/schoolblad/ipad-portrait-before.png) / [fit](visual/schoolblad/ipad-portrait-fit.png) | [two-finger pinch](visual/schoolblad/ipad-portrait-pinch.png), [large text](visual/schoolblad/ipad-portrait-large-text.png), [rotation](visual/schoolblad/ipad-portrait-rotated.png) |
| Small phone | [320px fitted sheet](visual/schoolblad/phone-320-fit.png) | [zoom](visual/schoolblad/phone-320-zoom.png) |

```sh
# From this feature checkout, with supported Node 24.15.0:
npm ci
npm run build
npm run lint
npm test
npm run audit:release-1-2
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/chrome npm run qa:schoolblad
```

The browser runner creates before screenshots directly from the pinned baseline Git object and all after screenshots from this checkout. No web server or remote image is needed. The art source audit may need a read-only fetch of owner art commit `047f74390bbb0cc7cfbd1fa3ba4f65fe23e2ec6d` in a fresh clone; normal app/build/tests remain offline after dependency installation. Future integration should retain the two source markers, resolve source changes first, and regenerate downloads rather than hand-merge their contents.
