# Issue #58 — legible neutral map selection (draft review candidate)

## Baseline and bounded change

Remote PR51 was checked on 2026-10-27 and remained
`bd1e57bc48e55a065cbbccb68acea196a64a187c`. This isolated branch starts there.
The source geometry, 45 IDs/11 chapters, 27 projected point anchors, six lakes,
class-aware resolver/22px tolerance, Po Plain fix, answer grader, learning/Gold,
8-slice/third-pizza rewards, save/backup schemas and artwork remain unchanged.
The exact resolver prefix (including choose/grade) and geographic-click handler
are tested byte-for-byte against the reviewed source. Historical source guards
normalise only the embedded chooser source; they still compare the rest of the
canonical HTML and protected files exactly.

The old actual browser chooser places Rome/Vatican endpoints only about 7.68 CSS
pixels apart on desktop (see [pinned before telemetry](visual/map-picker-58/before/results.json)).
The 80-source-unit minimum crop magnifies the same tiny marks inadequately.

## Design

- Context overview plus explicitly annotated geographic crops of the **same source
  anchors**, constant-pixel endpoints, separate numbered badges and dark 2px leaders.
  Source-space distance/bearing is preserved exactly; the crop changes scale.
  Layout plans require >=32px between endpoint centres, >=44px between badges and
  noncrossing connectors. Broad sets split into linked crops when necessary.
- No invented neighbourhood boundary or relocated city/state point. At extreme
  magnification (<30 source units), coarse country-scale river/zone paths are
  omitted from the close-up rather than presented as street-level evidence.
  Markers explicitly represent places, not their boundaries; crop frames are locators.
- Rome/Vatican enclosure explanation appears only in Learn. The source point
  excerpts already establish their bearing. Vatican's enclave relationship was
  independently checked against [the Holy See's geographic description](https://www.vatican.va/roman_curia/secretariat_state/documents/informazione_generale/sp_ss_scv_info-generale_en.html).
  No new boundary dataset or geographic feature was introduced.
- Non-point overlaps show complete original outlines/centrelines in individual
  maps with **one shared extent/scale**. Sea overlays mask out the original land,
  preserving the resolver's exclusion of hidden inland sea fill. Number captions
  refer to the whole outline, avoiding indistinguishable central callouts.
- Shuffling still happens once per opening, independent of expected ID, distance,
  geometry sorting or position. Resize reflows the same number assignment. No
  answer name, requested-target paint or first-option autofocus enters assessment.
- >=44px neutral buttons, spatial screen-reader descriptions, initial focus on
  cancellation, Escape without grading and restored invoker focus. The map area
  scrolls separately so answer buttons remain visible on small screens. Window
  resize handles rotation; no DOM resize-observer feedback loop.

## Executed QA

All browser evidence is automated macOS Chromium 145.0.7632.6, actual local
`file://` HTML with `offline:true`, never an HTTP-server substitute. Viewports:
1500×1000 desktop, 1180×820 landscape, 820×1180 portrait, 390×844 phone,
320×568 small phone. Schoolkaart and Ontdekkingskaart are exercised separately.

- `npm test`, lint and build PASS. All 17 test programs retained. Chooser tests
  include both random index orders, correct/wrong stable-ID grading and all 351
  point pairs plus the complete 27-point cluster at four layout widths, checking
  source-anchor preservation and minimum separation. Historical Focus audit now
  explicitly permits only the bounded chooser replacement and checks resolver/
  grading-handler preservation separately.
- Point/Test/real Gold: **12** actual session runs with both orders and correct/
  wrong choices, Escape cancellation, invoker focus, stable assignment/focus during
  desktop↔phone resize, interrupted Gold reload, and duplicate-credit guards.
- Integrated Focus suite: seven responsive sizes, real chapter-zoom control,
  overview/map styles/schoolblad, draft/caret, 64 semantic region/river taps,
  microstates and real Discover→Point→Write→Gold with three pizzas/one trip.
  Keyboard occlusion is simulated, not an OS keyboard.
- Collision matrix: every integer CSS-pixel tap in the union of all 27 hit disks
  is enumerated at each documented scale; native raster masks at 1 CSS px plus
  vector-boundary samples enumerate non-point overlap sets. Each physical
  representative is verified through the unchanged SVG resolver and actual mouse
  tap, then repeated against a different requested target of the same class.
  Source-only shared borders without an addressable pixel are explicitly recorded
  as **NOT ADDRESSABLE**, never counted as rendered passes.
- Rendered geometry checks enforce >=24 CSS-pixel endpoint separation, zero
  connector crossings, >=44px buttons within the viewport, complete outline ID
  coverage, no answer-name leakage and cancellation/session invariance. Full
  per-tap IDs, coordinates, number mapping, positions, class, scale, viewport,
  camera, style and PASS/non-addressable status are retained in raw JSON.

Matrix stats and gallery are appended below after the final run. Fixed 2× zoom
is labelled chapter-equivalent in matrix metadata, not misrepresented as a button
press; the separate Focus suite exercises the actual chapter control. Zoom 3×
centres/scroll-pans to every physical representative. No finite matrix proves all
continuous zooms, all browsers or subpixel-only area slivers; source geometry
checks plus the general layout guard complement this sampled coverage.

## Review and release gate

Real before/after screenshots are browser runtime captures, with explicit test
fixtures setting the requested question for answer-independence checks. They
are not generated maps or diagrams. AI inspection of selected full-size images
is supplementary; **human review at 100% pixels, owner GO/ADJUST, independent
Hermes geographic/design verification and physical touch Safari remain PENDING**.
No claim that emulation establishes child/device acceptance.

Do not replace the existing issue-50 child download or publish a child-facing
release until that visual gate is satisfied. This implementation remains a draft;
no merge, deployment, owner iPad server or artwork branch change is authorised.

Canonical candidate: `output/html/TOPO-Italie-Computer.html` (self-contained);
all three output filenames remain byte-identical to `index.html` after build.

Candidate bytes: **3,143,245**. SHA256: `84bf071e52f917832f0dfa67a1e33e0b394a037378cf3cbfaceef2ef02f434d5`.

## Final matrix counts and known limits

**799 enumerated entries**, including **657 physical-tap rendered
entries** (627 point; 30 sea), representing
**154 distinct candidate-ID sets**. The smallest measured endpoint separation
is **32.02 CSS px**; zero measured connector crossings. Up to
**7 options** occurred. All rendered answer controls met the >=44px and
on-screen checks.

**120 country shared-edge entries** have no addressable integer-pixel chooser tap;
these are not visual passes. **22 small-phone overview entries** are occluded by
the inherited Focus controls for one or both requested targets. Those cells are
covered separately by explicitly supplied recorded-candidate→chooser layout fixtures, not passed off
as physical taps. Their existing Focus occlusion remains unresolved in this
bounded chooser change; the desktop priority path is unaffected. No genuine
river/region/mountain/island multi-choice sets were found in this documented
matrix. This is not proof that no other continuous-scale/boundary case exists.

[Before/after screenshot gallery](visual/map-picker-58/README.md) ·
[Raw matrix](visual/map-picker-58/collision-results.json) ·
[Summary](visual/map-picker-58/summary.json).

An additional **48 actual taps at exactly identical CSS coordinates** compare
Rome/Vatican, Bologna/Modena and the real sea overlap against different requested
targets, across desktop/landscape/portrait/phone and both index orders. Candidate
sets and number assignment remain identical; selecting the same ID grades correct
for that ID and wrong for the other. See `same-tap-results.json`.
