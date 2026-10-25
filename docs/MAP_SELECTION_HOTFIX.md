# P0 semantic map selection — #36 / #34

## Scope and baseline

Isolated branch `codex/topo-semantic-map-hotfix`, stacked on PR #30 at **`f67027d42202d1bd2a78f1d82dd02aa7fba41a91`**, which already includes PR #27 and integration PR #17. This is the reported repository baseline, not a claim that the exact binary/URL on the learner's physical iPad has been identified; that build identifier was not supplied. The reproduced faults below occur in the immutable PR #30 HTML.

The only production application change is the replaced map tap/picker block. No styling, terrain, coordinates, projection, 45 IDs, 27 anchors, six lakes, quiz/route/reward engine, save schema or original artwork changes. Hermes' `discovery-map.js/css` and schoolblad sources remain byte-identical. PR #29 and all Hermes/owner branches are untouched. The PR targets PR #30's branch as an explicit dependency; it does not merge any PR or publish a deployment. Apennines geometry/terrain accuracy remains #37; this patch only makes the existing mountain polygon selectable as a corridor.

## Reproduced causes

1. **Unconditional point capture.** The map's capture-phase click handler searched all city, volcano and microstate anchors within 22 CSS px for every task. It intercepted clicks before the actual polygon handler, without checking the question's feature class. At the Tuscany interior `(380,485)`, the native SVG target is the Tuscany polygon, yet the capture handler opens “Welke stip bedoel je?”. Another interior `(420,500)` is graded as Florence in the fit-map reproduction. Areas are particularly affected when the map is small: a 22px halo covers many geographic units.
2. **River paint/hit order.** When no point candidate intercepted, the transparent 44 CSS px Po hit stroke above the region handled the click. In a genuine `Streken → Aanwijzen` session at 200% zoom, `(335,375)` is inside the unchanged Po Plain polygon; `elementFromPoint` returns `data-hit-id="water-G"`. Tapping it produces **“Dat was Po. Gezocht: de Povlakte.”** The repair queue retains the Po Plain as pending.
3. **Distance-first chooser bias.** Existing candidates were sorted by distance from the tap. This commonly made the requested point option 1 at marker taps, although the browser reproduction also has a non-first case. No expected-answer-ID sorting was found. This is not evidence that option 1 was correct for arbitrary wrong locations. The baseline enumeration at 1180×820 records option 1 correct in 16 of 17 ambiguous exact-anchor cases. The new tests enumerate all 27 anchors and use deterministic random fixtures to reproduce both correct-first and correct-nonfirst outcomes with identical candidates across prompts, rather than relying on hardcoded Rome/Vatican indices.
4. **Apparent route deadlock.** The route engine itself can advance after a wrong answer and schedules a later repair. Repeatedly treating a geographically valid Po Plain tap as the Po keeps that repair unresolved. No new engine recovery rule is needed. The fix makes that location pass and tests wrong→Next→spaced repair→actual stage completion, without bypassing a lesson or inventing credit.

[Original fit-map probes](visual/map-hit-hotfix/before.json) · [Actual before-route trace](visual/map-hit-hotfix/before-route.json) · [Legacy dot-order measurements](visual/map-hit-hotfix/before-dot-order.json)

## Bounded implementation

`scripts/map-hit.js` is embedded in the third existing script; there is no runtime request, dependency or second engine. The resolver receives **only screen coordinates and a semantic feature class**, then checks all features in that class:

- Cities, volcanoes and microstates: original projected anchors, 22 CSS px proximity.
- Countries, islands, regions/plains, mountains and seas: actual existing SVG fill containment (`isPointInFill`), with distinct static content categories. Sea fills remain clipped for selection by the existing source land silhouettes, matching their visible paint composition: hidden inland portions of a sea zone cannot become correct sea answers. The requested Tuscany/Po Plain IDs are never candidate filters: they share the same `regions` class.
- Rivers: original source centre line and existing 44 CSS px non-scaling hit corridor, queried with `isPointInStroke`.

Fresh `getScreenCTM().inverse()` conversion uses the element's actual transform, including map zoom and scroll/pan. The native topmost element, invisible hit stroke and point radius cannot override another class. A miss on the graded map is a real incorrect selection with the existing feedback/Next/repair flow; it does not fall back to a city/river DOM handler. Learn has no requested feature class: genuinely overlapping features can be inspected with the same neutral dialog. Coordinate-free keyboard activation retains the focused SVG feature and the neutral Rome/Vatican trigger.

Only actual spatial ambiguity opens the existing picker. Point candidates use numbered dots; areas and rivers use their actual outlines and appropriate neutral wording. No names or expected-target highlighting appear before selection. Candidate display order uses a copied Fisher–Yates shuffle independent of distance, question, answer ID, score and route stage. It is computed once per popup and does not move beneath the learner's finger. Native crypto randomness avoids consuming the learning engine's random sequence, with `Math.random` as a compatibility fallback. Buttons carry stable feature IDs for grading/tests; their displayed index has no grading meaning. Old index-based tests now select stable IDs.

## Verification

Node 24.15.0, existing dependencies only:

```sh
npm ci
npm run build
npm run lint
npm test
npm run audit:release-1-2
python3 -m http.server 8036
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs npm run qa:map-hit
```

- Complete sixteen-program validation/test chain, lint, build and byte-idempotent source audit pass. Four new Node test groups cover exact bounded source preservation, all 45 semantic classifications, unbiased/copied order and real keyboard chooser grading of both first/second correct and incorrect cases.
- Source audits restore **only the exact replaced legacy resolver** for historical full-app comparisons. All other application bytes still have to equal the pinned baselines; they do not broadly disable preservation assertions. Engine sources/embedded copies, schoolblad, Discovery/terrain, print/PDF, geography, original art and dependency lockfile remain exact.
- Browser automation uses actual touchscreen clicks, picker buttons, existing route start/Next controls, input submission and real grading. Tests cover both map paints, fit/200% zoom with pan, iPad 1180×820 and 820×1180, desktop 1440×1000 and phone 390×844: **16 viewport/style/zoom runs**.
- Multiple Tuscany interiors, Po Plain on and away from the visible Po, independent Po river, incorrect same-class choices, actual mountain corridor, San Marino and Rome/Vatican. All 27 point anchors and all 16 polygon interiors are exercised; genuine visible sea-area overlap uses an area selector and rejects the wrong choice. An inland portion of a source sea fill hidden behind land is rejected, and a Learn tap of Tuscany changes no learning/reward counters.
- Both regions are completed through an actual route stage in each of four viewports after one deliberately wrong region selection. Pending repair clears, stage advances to writing, and exactly two eligible answers earn two slices despite repeated repair filler/duplicate submit attempts.
- Actual formal-Test and free-point handlers, Gold point+write completion and full Gold replay across the two paints retain counters/tokens/Gold timestamp. Open/Escape from schoolblad retains the same task and save.
- Both generated HTML downloads run under offline `file://`, including both paints, zoom, Tuscany/Po Plain/Po and neutral microstate choice. No JS errors or external image/script requests.
- A **read-only compatibility fixture** inserts only the resolver into frozen pizza PR #29 `dcc474e` HTML: a real eighth-answer Po Plain tap still earns Quattro, resets the meter to Margherita and advances the existing third-pizza trip. This is a compatibility smoke check, not a merged release candidate; PR #29 remains unchanged.

[Browser results](visual/map-hit-hotfix/browser-results.json) · [Source preservation](visual/map-hit-hotfix/source-preservation.json) · [Lint](visual/map-hit-hotfix/lint.txt) · [Full tests](visual/map-hit-hotfix/tests.txt) · [Build](visual/map-hit-hotfix/build.txt) · [Audit](visual/map-hit-hotfix/audit.txt) · [Browser run](visual/map-hit-hotfix/browser.txt)

## Before / after evidence

- Po Plain, same Schoolkaart tap and 200% zoom: [before: wrong Po](visual/map-hit-hotfix/before-route-area-g.png) → [after: correct plain](visual/map-hit-hotfix/after-repro-route-area-g.png).
- Tuscany, same Schoolkaart interior at fit: [before: dot popup](visual/map-hit-hotfix/before-route-area-h.png) → [after: correct region](visual/map-hit-hotfix/after-repro-route-area-h.png).
- [iPad portrait: repaired stage completed](visual/map-hit-hotfix/ipad-portrait-stage-complete-after-repair.png) · [iPad landscape](visual/map-hit-hotfix/ipad-landscape-stage-complete-after-repair.png).
- [Wrong neutral point choice rejected](visual/map-hit-hotfix/neutral-picker-wrong-is-rejected.png) · [Neutral overlapping sea areas](visual/map-hit-hotfix/neutral-overlapping-sea-areas.png) · [Gold replay](visual/map-hit-hotfix/gold-replay-no-duplicate-reward.png).
- [Offline interactive HTML](visual/map-hit-hotfix/topo-italie-interactief-offline.png) · [Offline route HTML](visual/map-hit-hotfix/topo-italie-duolingo-offline.png).

## Physical iPad acceptance — about three minutes, still pending

Chromium touch/viewports are **not physical iPad Safari proof**. Independent Hermes review follows this concrete PR; no duplicate Hermes review is claimed.

1. Record the exact candidate SHA and Safari/iPadOS version. A reviewer can serve the checkout on the local network with the command above and open `http://<Mac-LAN-IP>:8036/` on the same Wi-Fi; no production deployment is needed. Confirm both map styles are available.
2. In the unlocked **Streken → Aanwijzen** stage, tap two separated interiors of Tuscany when asked. No dot popup should appear. When asked for the Po Plain, tap inside it on the Po and away from the line: correct plain. Use Next and finish the actual stage.
3. Start/replay the region stage, deliberately tap the other region once. Verify wrong feedback, working Next, later repair and successful completion, with no reward for the wrong or already-rewarded answers.
4. In **Rivieren → Aanwijzen** or free pointing, select the Po on its actual line; an Adige question answered at Po must be wrong. At Rome/Vatican choose by the numbered geography, not “always 1”; verify both choices can succeed/fail as appropriate. Check San Marino.
5. Repeat key taps at 100%/200%, pan the map, rotate portrait/landscape and switch School/Discovery mid-question. Location accuracy must stay the same. Open/close schoolblad and confirm the same question remains. Check that no modal sits under Safari chrome and every choice is finger-reachable.

Remaining limits: actual learner-build identification, physical Safari/touch/VoiceOver and Hermes' independent exact-SHA QA are pending. The Apennines' schematic geographic extent (#37) and Focus Mode layout (#33) are not changed or claimed solved. No merge or deployment.
