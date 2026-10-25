# Pizza Reward System V2 — implementation for #28

## Review status

Draft implementation against PR #17 integration commit `c68ace4e44a6e797f536ec1a8d6b517d29167320`. The real artwork meters, deterministic flavors, completed-pizza transition, static Pisa box celebration and existing earned Vespa journey are implemented. **The genuine hinged-lid animation remains blocked by missing registered art layers. Do not describe this PR as satisfying that acceptance criterion.** No merge or deployment.

PR #27 remains a separate, unmerged schoolblad overlay at `1c4d00f8d5cf9a293ac0d2643b4163c2eed384d0`. No changes were made to its branch or to Hermes branches. Integration had no commits newer than `c68ace4` when this branch was created. This PR deliberately targets the integration branch, not the schoolblad draft. Both modify the generated HTML and package scripts; retain both feature checks when composing the release, then rebuild the generated downloads. A read-only `git merge-tree` comparison reports no textual conflict in application HTML, downloads, build or syntax gates; it reports conflicts in `package.json`, `docs/DECISIONS.md` and `docs/PROJECT_STATE.md`. Resolve those by retaining both test/QA commands and both documentation entries. [Composition report](visual/pizza-v2/schoolblad-composition.json). This is not a combined runtime verification or a merge. No schoolblad behavior is replaced here.

## Source artwork and offline runtime

All 89 original package files, including the unchanged root manifest, three slice manifests and **85 checksum-listed source assets**, come from owner art commit `15ce46fb556d4e05734d72787b054125f5869cba`. Original PNG masters and unique aligned/cropped slices are retained byte for byte in `assets/nino/rewards/pizza/`. The owner's art branch is untouched. This work generates no new illustration or topping; only source-image composition and WebP compression.

`prepare-pizza-art.mjs` checks source checksums, composes each of the eight unique aligned slices at native resolution and compares the final browser-decoded RGBA pixels with the original master. All three flavors have maximum channel difference **0**, overlapping nontransparent pixels **0**. Composing before a single resize avoids independently scaled edge seams. Aspect ratio is preserved, including the nonsquare Salami master. Nine transparent progress frames (0–8, clockwise from 12 o'clock) occupy a 3×3, 960px WebP atlas per flavor. The original wooden board is a separate background beneath those frames. All 27 frames are visible in the contact sheet below.

The ordinary build needs no image tool or new dependency: it checks and embeds the committed atlases, board and approved open-box WebPs. Seven additional runtime WebPs total **1,574,538 bytes**; standalone HTML is **5,208,499 bytes** (about 5.2 MB versus the baseline 3.0 MB). The closed-box WebP remains preserved and checksum checked but is deliberately not embedded as an unused animation frame. All runtime image URLs are `data:` URLs; no network request or sidecar file is needed. Existing approved Nino Arrival/Travel artwork is reused for the journey. Source PNGs are not embedded in the downloads.

Reproduce the one-time derivative preparation with the existing developer browser tooling:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/prepare-pizza-art.mjs
npm run build
```

Chromium's WebP encoder is used at quality 0.92. Original source checksums remain immutable; regenerated runtime outputs intentionally require review of their own `runtime-manifest.json` checksums. Normal builds do not regenerate or recompress artwork.

## Reward contract and presentation

`TopoLearning.award`, both engine sources, their embedded copies, save schemas and anti-replay tokens are unchanged. Rendering reads the real counters only:

- Current flavor: `progress.pizzas % 3` → Margherita, Salami, Quattro Formaggi.
- Just-completed flavor: `(progress.pizzas - 1) % 3`, captured immediately after the existing eligible award, while `slices` has already reset to zero.
- The transient celebration captures the awarded pizza total, trip flag and existing `from`/`to` destination. It never reads `favoritePizza` or writes learner progress.

Route, free-practice and compact lesson meters share the same drawing code, numeric counts and real saved pizza/journey totals. The `.wheelSlice.earned` selector remains metadata for the correct number of unique source sectors; actual pixels come from the precomposited atlas. No wedge is rotated or duplicated.

The visual sequence is a full 8/8 pizza for 320 ms, then the corresponding **static** approved open Pisa box for 900 ms. After the third pizza only, the existing earned Nino Arrival/Travel appears for 1500 ms with the actual destination. This is an honest temporary fallback, **not a lid-opening animation**. Reduced motion immediately displays the static open box, with no movement. No controls or focus are captured; learning can proceed while the presentation runs. Closely spaced completion events queue their own snapshots so flavor/destination cannot change underneath an earlier celebration. Reset/import cancels pending presentation. Reload never recreates it. Replayed Gold produces no completion event because the existing engine rejects its reward tokens.

Passive scooter duplicates and the generic scooter emoji are removed from the audited meter selectors, route tab and pause icon. The earned-trip toast has one approved illustration and hides its previous scooter layer. Branding and the existing route panorama are preserved.

## Precise hinged-lid blocker

Inspected original files:

- `boxes/pizza-box-closed-pisa.png`
- `boxes/pizza-box-open-pisa-margherita.png`
- `boxes/pizza-box-open-pisa-salami.png`
- `boxes/pizza-box-open-pisa-quattro-formaggi.png`

Each is a complete flattened RGBA render. The closed and open views have different lid projection, foreshortening, box outline and registration. Their alpha channels isolate the entire box, not individual pieces. Pixels of the base beneath the pizza, the rear joint/flaps and reverse lid faces are occluded or absent. Cropping the visible lid cannot recover those surfaces or make the supplied two projections the endpoints of one physical rotation. Projectively warping it would also distort the printed Pisa design and reveal gaps. No accurate source-only extraction can supply the missing pixels.

To complete the actual 1–1.5 second hinge, supply a **single registered camera/perspective** layer set:

1. Stationary empty base/inner tray, complete behind the pizza and moving lid.
2. Outer printed lid plus separate inner lid, complete through its edges and rear tabs; both registered to the same hinge edge.
3. The three pizza interiors, separated from the tray and matched to that camera/position.
4. Any overlapping stationary side flaps/foreground rim as separate occlusion layers.
5. Rear hinge endpoints in source pixel coordinates, the closed/open reference poses and a common transparent canvas/scale for every layer.

These are missing source inputs, not permission to regenerate art. Once supplied, animate only the lid around that rear hinge and preserve the current event/snapshot/timing/queue contract. Do not replace the static fallback with a crossfade or rotate a whole flattened box.

## Verification and evidence

Use Node 24.15+ (the existing jsdom dependency's supported range). No added npm dependencies.

```sh
npm ci
npm run lint
npm test
npm run build
python3 -m http.server 8028
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs npm run qa:pizza
```

- Required lint/build and the complete existing test chain pass, including all eleven chapters, map/geography/print parity, Gold/replay, migration, backup rejection and anti-replay. Five new test groups cover checksum/source preservation, all flavors × counts, actual eighth-answer transitions/large totals, queued events/reset and corrupted saves. Existing immediate-trip assertions now advance the full-pizza/box presentation before checking the same earned journey.
- [Browser results](visual/pizza-v2/browser-results.json): twelve scenario groups, zero JavaScript errors, zero external requests. Real answer controls, backup importer with 3,000,002 pizzas, third-pizza destination, reset during pending trip, replay/reload idempotence and continued learning during celebration.
- Desktop 1440×1000; iPad portrait 820×1180, landscape 1180×820; phone 390×844 and 320×568. Keyboard controls, reduced-motion static box, no horizontal overflow and unchanged map aspect ratio. These are Chromium viewports, **not physical iPad Safari or VoiceOver certification**.
- Both generated downloads decode every runtime image and complete a real pizza/box/journey while offline under `file://`. They remain byte-identical to canonical `index.html`.

[Before](visual/pizza-v2/desktop-before.png) · [After](visual/pizza-v2/desktop-after.png) · [All 27 states](visual/pizza-v2/all-flavors-0-through-8.png)

[Margherita 8/8](visual/pizza-v2/margherita-full.png) · [Salami 8/8](visual/pizza-v2/salami-full.png) · [Quattro Formaggi 8/8](visual/pizza-v2/quattro-formaggi-full.png)

[Margherita box](visual/pizza-v2/margherita-open-box-static.png) · [Salami box](visual/pizza-v2/salami-open-box-static.png) · [Quattro box](visual/pizza-v2/quattro-formaggi-open-box-static.png) · [Earned Vespa](visual/pizza-v2/third-pizza-earned-vespa.png)

[Source box comparison](visual/pizza-v2/box-source-layer-blocker.png) · [Recorded event sequence](visual/pizza-v2/box-sequence.json) · [Lint](visual/pizza-v2/lint.txt) · [Tests](visual/pizza-v2/tests.txt) · [Build](visual/pizza-v2/build.txt) · [Browser run](visual/pizza-v2/browser.txt)

There is no fabricated hinge proof: screenshots are explicitly named `open-box-static`. The missing hinge layers and physical iPad/Safari check remain release acceptance limits for independent Hermes review of the exact PR SHA.
