# PR #59 — owner-requested geographic chooser revision

This is the revised implementation on `codex/issue-58-legible-map-picker`,
not the rejected `d55e9de` or an accepted learner release. Owner preview comes
before a new independent Hermes exact-SHA review. No merge/deployment/release
attachment replacement or iPad server update was performed.

## What changed

- Rome: larger **illustrative city circle**, tiny Vatican diamond **inside** it
  in the exact source-relative WNW position; two different capped leader ends,
  one at the Rome centre outside Vatican and one at Vatican. The dashed city
  circle and state glyph are explicitly **symbols, not surveyed boundaries**.
  A persistent regional coastline locator and north remain visible. Broad
  candidate sets retain the nested relation in a local inset.
- Regional choices: one original source map with coastlines, islands, six lakes,
  rivers, mountain/region zones and neutral neighbouring place symbols. Cities
  use circles, volcanoes summit-anchored triangular mountain glyphs, and small
  states symbolic diamonds. No generic extreme-dot panels or invented streets.
- Fitted width **and height**: all candidate glyphs, capped leader ends, numbered
  badges, orientation and >=44px answer/cancel controls are present at first
  opening. Compact answer grids preserve map space in up-to-seven-way choices.
  There is no scroll-to-reveal a missing candidate. Resize retains numbering.
- Sea/area comparisons keep complete original outlines, original land masks and
  one shared extent/scale; all panels now fit together on the initial screen.
- Source audit locks PR51's exact resolver/shuffle/grader, geographic click
  handler and every byte outside the embedded chooser in canonical HTML.
  Engines, 45 items/27 anchors/11 chapters, six lakes, saves, rewards, art,
  Focus, print and PDF are unchanged. Generated HTML files are byte-identical.

## Original-pixel browser screenshots

**These are actual offline running-app screenshots**, never generated diagrams.
For directly comparable named scenes, requested-question and candidate-set
fixtures open the real renderer and real controls. They are explicitly layout/
grading fixtures, not claims that each isolated pair is reachable at every
viewport/zoom. Actual physical resolver taps are recorded separately below.
Before = PR51 `bd1e57bc48e55a065cbbccb68acea196a64a187c`;
rejected = `d55e9deb2adfa7985bc33a3251402860f95a0b46`.
Revised screenshots use the rebuilt `output/html/TOPO-Italie-Computer.html`.

Open PNG links at **100% actual pixels** for review. Each capture is the initial
open state; no scroll was used to expose a candidate.

### desktop — 1500×1000

| Scene | PR51 before | Rejected PR59 | Revised Schoolkaart | Revised Ontdekkingskaart |
|---|---|---|---|---|
| Rome / Vatican | [PNG](before-desktop-rome.png) | [PNG](rejected-desktop-rome.png) | [PNG](revised-desktop-school-rome.png) | [PNG](revised-desktop-discovery-rome.png) |
| Naples / Vesuvius | [PNG](before-desktop-naples.png) | [PNG](rejected-desktop-naples.png) | [PNG](revised-desktop-school-naples.png) | [PNG](revised-desktop-discovery-naples.png) |
| Catania / Etna | [PNG](before-desktop-etna.png) | [PNG](rejected-desktop-etna.png) | [PNG](revised-desktop-school-etna.png) | [PNG](revised-desktop-discovery-etna.png) |
| Bologna / Modena | [PNG](before-desktop-bologna.png) | [PNG](rejected-desktop-bologna.png) | [PNG](revised-desktop-school-bologna.png) | [PNG](revised-desktop-discovery-bologna.png) |
| Milan / Varese | [PNG](before-desktop-milan.png) | [PNG](rejected-desktop-milan.png) | [PNG](revised-desktop-school-milan.png) | [PNG](revised-desktop-discovery-milan.png) |
| Florence / San Marino | [PNG](before-desktop-san-marino.png) | [PNG](rejected-desktop-san-marino.png) | [PNG](revised-desktop-school-san-marino.png) | [PNG](revised-desktop-discovery-san-marino.png) |
| Ligurian / Tyrrhenian seas | [PNG](before-desktop-sea.png) | [PNG](rejected-desktop-sea.png) | [PNG](revised-desktop-school-sea.png) | [PNG](revised-desktop-discovery-sea.png) |

### landscape — 1180×820

| Scene | PR51 before | Rejected PR59 | Revised Schoolkaart | Revised Ontdekkingskaart |
|---|---|---|---|---|
| Rome / Vatican | [PNG](before-landscape-rome.png) | [PNG](rejected-landscape-rome.png) | [PNG](revised-landscape-school-rome.png) | [PNG](revised-landscape-discovery-rome.png) |
| Naples / Vesuvius | [PNG](before-landscape-naples.png) | [PNG](rejected-landscape-naples.png) | [PNG](revised-landscape-school-naples.png) | [PNG](revised-landscape-discovery-naples.png) |
| Catania / Etna | [PNG](before-landscape-etna.png) | [PNG](rejected-landscape-etna.png) | [PNG](revised-landscape-school-etna.png) | [PNG](revised-landscape-discovery-etna.png) |
| Bologna / Modena | [PNG](before-landscape-bologna.png) | [PNG](rejected-landscape-bologna.png) | [PNG](revised-landscape-school-bologna.png) | [PNG](revised-landscape-discovery-bologna.png) |
| Milan / Varese | [PNG](before-landscape-milan.png) | [PNG](rejected-landscape-milan.png) | [PNG](revised-landscape-school-milan.png) | [PNG](revised-landscape-discovery-milan.png) |
| Florence / San Marino | [PNG](before-landscape-san-marino.png) | [PNG](rejected-landscape-san-marino.png) | [PNG](revised-landscape-school-san-marino.png) | [PNG](revised-landscape-discovery-san-marino.png) |
| Ligurian / Tyrrhenian seas | [PNG](before-landscape-sea.png) | [PNG](rejected-landscape-sea.png) | [PNG](revised-landscape-school-sea.png) | [PNG](revised-landscape-discovery-sea.png) |

### portrait — 820×1180

| Scene | PR51 before | Rejected PR59 | Revised Schoolkaart | Revised Ontdekkingskaart |
|---|---|---|---|---|
| Rome / Vatican | [PNG](before-portrait-rome.png) | [PNG](rejected-portrait-rome.png) | [PNG](revised-portrait-school-rome.png) | [PNG](revised-portrait-discovery-rome.png) |
| Naples / Vesuvius | [PNG](before-portrait-naples.png) | [PNG](rejected-portrait-naples.png) | [PNG](revised-portrait-school-naples.png) | [PNG](revised-portrait-discovery-naples.png) |
| Catania / Etna | [PNG](before-portrait-etna.png) | [PNG](rejected-portrait-etna.png) | [PNG](revised-portrait-school-etna.png) | [PNG](revised-portrait-discovery-etna.png) |
| Bologna / Modena | [PNG](before-portrait-bologna.png) | [PNG](rejected-portrait-bologna.png) | [PNG](revised-portrait-school-bologna.png) | [PNG](revised-portrait-discovery-bologna.png) |
| Milan / Varese | [PNG](before-portrait-milan.png) | [PNG](rejected-portrait-milan.png) | [PNG](revised-portrait-school-milan.png) | [PNG](revised-portrait-discovery-milan.png) |
| Florence / San Marino | [PNG](before-portrait-san-marino.png) | [PNG](rejected-portrait-san-marino.png) | [PNG](revised-portrait-school-san-marino.png) | [PNG](revised-portrait-discovery-san-marino.png) |
| Ligurian / Tyrrhenian seas | [PNG](before-portrait-sea.png) | [PNG](rejected-portrait-sea.png) | [PNG](revised-portrait-school-sea.png) | [PNG](revised-portrait-discovery-sea.png) |

### phone — 390×844

| Scene | PR51 before | Rejected PR59 | Revised Schoolkaart | Revised Ontdekkingskaart |
|---|---|---|---|---|
| Rome / Vatican | [PNG](before-phone-rome.png) | [PNG](rejected-phone-rome.png) | [PNG](revised-phone-school-rome.png) | [PNG](revised-phone-discovery-rome.png) |
| Naples / Vesuvius | [PNG](before-phone-naples.png) | [PNG](rejected-phone-naples.png) | [PNG](revised-phone-school-naples.png) | [PNG](revised-phone-discovery-naples.png) |
| Catania / Etna | [PNG](before-phone-etna.png) | [PNG](rejected-phone-etna.png) | [PNG](revised-phone-school-etna.png) | [PNG](revised-phone-discovery-etna.png) |
| Bologna / Modena | [PNG](before-phone-bologna.png) | [PNG](rejected-phone-bologna.png) | [PNG](revised-phone-school-bologna.png) | [PNG](revised-phone-discovery-bologna.png) |
| Milan / Varese | [PNG](before-phone-milan.png) | [PNG](rejected-phone-milan.png) | [PNG](revised-phone-school-milan.png) | [PNG](revised-phone-discovery-milan.png) |
| Florence / San Marino | [PNG](before-phone-san-marino.png) | [PNG](rejected-phone-san-marino.png) | [PNG](revised-phone-school-san-marino.png) | [PNG](revised-phone-discovery-san-marino.png) |
| Ligurian / Tyrrhenian seas | [PNG](before-phone-sea.png) | [PNG](rejected-phone-sea.png) | [PNG](revised-phone-school-sea.png) | [PNG](revised-phone-discovery-sea.png) |

### small-phone — 320×568

| Scene | PR51 before | Rejected PR59 | Revised Schoolkaart | Revised Ontdekkingskaart |
|---|---|---|---|---|
| Rome / Vatican | [PNG](before-small-phone-rome.png) | [PNG](rejected-small-phone-rome.png) | [PNG](revised-small-phone-school-rome.png) | [PNG](revised-small-phone-discovery-rome.png) |
| Naples / Vesuvius | [PNG](before-small-phone-naples.png) | [PNG](rejected-small-phone-naples.png) | [PNG](revised-small-phone-school-naples.png) | [PNG](revised-small-phone-discovery-naples.png) |
| Catania / Etna | [PNG](before-small-phone-etna.png) | [PNG](rejected-small-phone-etna.png) | [PNG](revised-small-phone-school-etna.png) | [PNG](revised-small-phone-discovery-etna.png) |
| Bologna / Modena | [PNG](before-small-phone-bologna.png) | [PNG](rejected-small-phone-bologna.png) | [PNG](revised-small-phone-school-bologna.png) | [PNG](revised-small-phone-discovery-bologna.png) |
| Milan / Varese | [PNG](before-small-phone-milan.png) | [PNG](rejected-small-phone-milan.png) | [PNG](revised-small-phone-school-milan.png) | [PNG](revised-small-phone-discovery-milan.png) |
| Florence / San Marino | [PNG](before-small-phone-san-marino.png) | [PNG](rejected-small-phone-san-marino.png) | [PNG](revised-small-phone-school-san-marino.png) | [PNG](revised-small-phone-discovery-san-marino.png) |
| Ligurian / Tyrrhenian seas | [PNG](before-small-phone-sea.png) | [PNG](rejected-small-phone-sea.png) | [PNG](revised-small-phone-school-sea.png) | [PNG](revised-small-phone-discovery-sea.png) |

### Crowded small-phone choices

- [Original pixels: area-e_area-o_city-21_city-6_city-9 ](revised-small-phone-multi-area-e_area-o_city-21_city-6_city-9.png)
- [Original pixels: area-e_city-1_city-17_city-6 ](revised-small-phone-multi-area-e_city-1_city-17_city-6.png)
- [Original pixels: city-12_city-18_city-2_city-20_city-4_city-5_city-8 ](revised-small-phone-multi-city-12_city-18_city-2_city-20_city-4_city-5_city-8.png)

## Reproducible evidence

- [Lint](gates/lint.log), [full 17-program test chain](gates/test.log),
  [build](gates/build.log), [source/HTML preservation audit](preservation.json).
- [Browser layout/grading evidence](browser-results.json), [browser log](gates/browser.log),
  [nine focused regression tests](gates/picker-tests.log): **280** named-case
  checks across five sizes × two styles × both number orders × both requested
  targets; selected-ID correct/wrong grading and identical renderer markup
  independent of requested answer. **280 distinct viewport/candidate-set layout
  checks** cover all sets from the recorded collision inventory, including
  multi-way and tiny-state sets. Assertions cover actual painted bounds against
  every clipping ancestor, inset occlusion, missing endpoints, crossed leaders,
  button sizes, name leakage and scroll overflow. Finite recorded matrix, not
  a proof of all continuous zooms, arbitrary candidate sets or future devices.
- [Actual physical-tap evidence](physical-results.json), [log](gates/physical.log): **799** previously
  enumerated resolver cells retested at overview, 2× chapter-equivalent and 3×
  panned cameras, both styles and five sizes. **679** cells open by real mouse
  and pass same-XY target independence, correct/wrong answer-button grading
  and first-open visibility (**1,358 physical taps**). **120 country shared-edge
  cells have no addressable integer-pixel tap** after settling; neither passes
  nor demonstrated chooser failures. The previous 22 small-phone entries now
  open after layout settles. Focus intentionally reopens on a changed question;
  the harness settles and collapses it for both requests before repeating XY.
  Chapter-equivalent fixed 2× is not called an actual chapter-button exercise.
- [12 Point/Test/Gold sessions](session-results.json), [session log](gates/sessions.log):
  both number orders and correct/wrong choices; keyboard activation, Escape
  session invariance and restored focus; phone/desktop resize preserves order
  and focus; interrupted Gold reload and duplicate-credit guards. Gold starts
  with explicitly unlocked prerequisite chapters, then traverses real questions
  using UI controls. This is not claimed as a newly earned full course run.
- Browser/version, HTML byte hash, raw positions, options, viewports, network/
  page errors and limitations are in the JSON. Actual `file://`, `offline:true`;
  no external requests or page errors. The artifact hash in `preservation.json`
  identifies exactly the candidate bytes; no release asset was replaced.

The old >=24px-only gate is intentionally replaced: real geographic context,
nested containment, distinct marker semantics and visible noncrossing callout
ends matter as well. Dense city choices may have less than 24px separation at
320px; the raw minimum and every marker position are retained in JSON rather
than relabelled as a uniform >=24px pass. This does **not** substitute for the
owner's child-level recognisability decision. Human owner review at 100%,
independent Hermes QA **of the new SHA**, physical iPad Safari, actual child and
screen-reader acceptance remain pending. No owner GO or independent QA PASS is
claimed by Codex.

Commands from the repository root (Node 24, installed jsdom, Playwright supplied
via `PLAYWRIGHT_MODULE` when not installed locally):

```sh
npm run build
npm run lint
npm test
node scripts/audit-map-picker-revision.mjs
node scripts/qa-map-picker-revision.mjs
node scripts/qa-map-picker-revision-taps.mjs
node scripts/qa-map-picker-revision-extra.mjs
node scripts/qa-map-picker-sessions.mjs
```

The historical session runner writes to `map-picker-58/session-results.json`;
this run's output is copied here and the historical rejected evidence retained.
