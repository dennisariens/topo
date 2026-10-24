# Schoolkaart / Ontdekkingskaart — implementation contract

**Proposal for approval, not a production implementation.** Issue #24; parent #22. Immutable source: `c68ace4e44a6e797f536ec1a8d6b517d29167320` / PR #17. The executable proof and every new file live under `docs/map-design-proof/`. No schoolblad implementation is included.

## 1. Ownership and integration boundary

- **Codex #23:** existing original schoolblad button, fold-out reference content, disclosure/dialog lifecycle, school-photo ratio, focus restoration and help copy. This proof reserves a disabled, clearly labelled **Schoolblad ↗** position only. Do not copy it into production as a second button or replace Codex's actual implementation.
- **Future approved map-style task:** Kaartopties, exactly two style radios, theme paint tokens/decor and the preference resolver. Bind to Codex's actual existing utility placement after reviewing #23; do not guess/rename its element IDs or add a competing sheet overlay.
- **Owner:** visual choice/sign-off. No production theme switch, asset generation, artwork edits, geography enhancements, merges or deployments are authorised by this proof.
- The proof shell hides unrelated backup/reward controls and restyles surrounding chrome to assess map focus. This is **not** a mandate to replace the whole production app shell; integrate the approved map utility/theme slice only. Original scripts and artwork are embedded unchanged in the document.

## 2. Exactly two styles, one renderer

| Visible label | Internal value | Purpose |
|---|---|---|
| Schoolkaart | `school` | Current digital SVG paint, unchanged; not a photograph |
| Ontdekkingskaart | `discovery` | Riviera water, cream/olive land, editorial atmosphere, same targets |

Schoolblad is a separate reference utility. It is **not** a third map style, overlay registration option, quiz mode or source of grading coordinates.

Use native labelled radios inside a compact Kaartopties disclosure/popover. Show selected state and brief “Dezelfde plekken en dezelfde antwoorden” explanation. Keyboard Enter/Space opens it; radio keyboard interaction remains native. Selection closes it, returns focus to the trigger and preserves the current question. Escape also closes and restores focus. The proof is a native `details` implementation, not an ARIA menu/listbox impersonation.

Schoolblad and Kaartopties sit in the utility header, outside the SVG. Keep map zoom and the zoom/reference close button separate from this style picker. Minimum utility/radio row hit height: **44 CSS px**. Utility content must stay inside its card at 820px/390px; opening options is transient, never a permanently obscuring panel over quiz targets.

## 3. Preference and question lifecycle

Resolve style only at activity entry / before creating the new question:

```js
resolveMapStyle({ explicitChoice, activity }) {
  if (explicitChoice === 'school' || explicitChoice === 'discovery') return explicitChoice;
  return activity === 'learn' || activity === 'discover' ? 'discovery' : 'school';
}
```

- Learn/Discover: default Discovery. Graded Point/Write/Test: default School.
- A learner's explicit choice wins in every activity. Do not silently switch back on grade, skip, next, reward, resize, orientation change or resume.
- Explicit selection may change paint mid-question because it is requested, but cannot call `mode`, `next`, `grade`, `highlight`, rebuild geometry, change labels or reset an answer.
- Keep preference outside `topo-italie-v3`, the learner backup, reset scopes and reward ledger. Proposed separate UI key: `topo-ui-map-style-v1`; reject unknown values, catch unavailable storage and keep session choice in memory. The proof demonstrates **in-memory** choice; durable preference is a future implementation requirement, not claimed complete here.
- “Automatic” can be a later preference reset action, not a third interactive map. This proof's menu contains exactly the two requested labels.
- Graded context independently forces **flat material**: paper stipple, sea/land gradients, compass and scenic/motion decoration are off, even when explicit Discovery remains selected. The learner sees their chosen palette, not a surprise style switch.

## 4. Immutable geographic and hit-test contract

Keep the affine projection **x = 55 × lon − 225.5; y = 3830.75 − 77 × lat**, `viewBox="0 0 890 1235"`, preserved aspect ratio, all 45 `ITEMS` IDs/data, `CONTEXT_LAND`, `italy`, `NAME_ANCHORS`, all 27 point anchors and six lake paths. Do not maintain a second geometry list, trace a coastline, add a tourist road/ridge/harbour or invent geographic contours.

Paint may change `fill`, `stroke` color, contextual opacity, and definitions for subtle materials. Never theme `d`, points, `cx/cy`, radius, stroke width, dash geometry, transforms, viewBox, map CSS dimensions, target order, selection tolerances or pointer event handlers. Do not resize markers or move labels/anchors to look better. Reserve dimensions before style selection; both styles must have identical `getScreenCTM` and target screen positions within each viewport/state.

Existing constraints stay canonical:
- 22 CSS-pixel point proximity; actual point coordinates remain unchanged.
- 44 CSS-pixel invisible river hit strokes retain exact visible centre lines.
- Rome/Vatican use the same neutral numbered picker. Before an answer, no new named hints, highlighted answer, named microstate inset, suggested place or theme-derived selection state.
- Named Rome/Vatican containment explanation remains Learn/Discover-only and explicitly schematic/not to scale.
- Source-backed background lakes stay noninteractive, without focus stops, learning IDs or question labels. Garda, Maggiore, Como, Lugano, Bolsena and Léman/Genève paths are identical.
- The inherited nine mountain/region/sea educational zones stay explicitly schematic; matching source hashes is not a fresh external GIS audit.

## 5. SVG paint/layer constraints

Retain canonical order: sea → surrounding land/countries/Italy/islands → schematic regions → background lake use → rivers → static labels → accurate points → Learn names / existing locator aids. Inspect actual DOM ownership before integration; do not reorder source groups to accomplish a theme.

Additional material definitions may be inserted in a scoped SVG `defs`. Optional full-frame decorative rect is inserted **immediately after sea and before all geography**, has only the existing frame size, `aria-hidden="true"`, `pointer-events="none"`, no role, `tabindex`, learning ID, events or target data. No generated contours. The proof adds two gradients and a tiny repeating dot pattern, not image assets or filters.

Context clones (zoom, microstate crop, neutral picker) must inherit the same palette through a shared `.mapGeometry`/equivalent scope; do not rely solely on unique `#map` selectors. Remove duplicate IDs/tab stops from display clones as today; material IDs remain resolvable. Keep neutral picker copies free of answer text and target-state classes. The proof's `proofDetail` camera crops derive bounds from source lake/path bounding boxes and original point anchors; they do not rescale or relocate source geography independently.

Existing `.activeTarget`, locator rings, correct/wrong status semantics and focus indicators win over theme defaults. Scope ordinary paint with `:not(.activeTarget)` where appropriate. Do not change the shared orange attention marker to a different meaning per style. Feedback remains text + canonical styling, not color alone.

## 6. CSS tokens and materials

Proposed semantic export: [`tokens.css`](tokens.css). Executable proof bindings: [`theme.css`](theme.css). The latter also contains **proof-shell** layout, not a production stylesheet to paste wholesale.

| Material | Discovery normal/flat paint |
|---|---|
| Sea | `#c2dae2`; Learn-only subtle `#dcecef → #b9d4df` wash |
| Italy | `#f2e3bf`; Learn-only `#faf0d9 → #f0ddb5` wash |
| Surrounding land / border | `#dce2cf` / `#64765f` |
| Quiz country / border | `#e8ddbf` / `#6c775f` |
| Italy coast | `#8a8269` |
| City | `#9b442f`, original size/white stroke |
| Lake / boundary | `#a5cbd8` / `#3e6d80` |
| River | `#477f8d`, original width |
| Context labels | `#52624c`, original text/position/size |

Schoolkaart receives **no new map paint bindings**. Do not flatten or recolor the baseline when adding the new theme. Keep static and inline-generated map geometry driven by the existing source. Future theming must not inject Nino/scenery over learning targets; original character assets remain outside the geographic surface.

## 7. Accessibility, print and failure modes

- Normal UI text target 4.5:1; essential new map boundaries/marks target 3:1 against adjacent flat fills. Selected measured token pairs appear in `evidence/source-audit.json`; these are **not a full WCAG certification**, nor validation of every inherited orange feedback style or tiny source label.
- `prefers-contrast: more`: flat fills, no paper layer. `prefers-reduced-motion: reduce`: no movement or palette-transition animation. Prefer no motion for this feature even normally; never animate coast/markers or pan to a theme-dependent location.
- Keep current keyboard target semantics and schoolcode-removal behavior. Style changing must not add answer names to DOM accessibility text. Existing canonical target accessibility semantics are preserved, not newly certified by this proof.
- No JS/unsupported material: **Schoolkaart** static source fallback and original print references. The proof is tested with scripting disabled: same 45 static reference targets and six lake definitions; style controls are absent rather than broken. Production must retain readable “statische kaart”/print guidance.
- Print/export uses the existing canonical print pipeline / plain Schoolkaart, independent of UI preference. Do not theme `print.html`, original PDF or school photo. The proof's beforeprint handler temporarily selects School paint and restores choice after printing; no canonical print file is changed.
- If the map cannot be used, retain native grouped learning/keyboard controls and existing printable name/location exercises as alternate access. Do not call a static picture alone an accessible equivalent to the interactive activity. Actual screen reader and physical iPad Safari/on-screen keyboard acceptance remain required before production sign-off.

## 8. Offline / performance envelope

No new bitmap, webfont, CDN, API, SVG filter/turbulence, mesh, canvas/WebGL or image generation. Embed approved theme CSS/UI/definitions through the current single-file build; do not require companion asset files for either download.

Budget: **≤8 KiB gzip** for the proof's complete new CSS + UI (including proposed shell); measured bytes are in `evidence/source-audit.json`. A production-only theme utility should be smaller. At most 16 new SVG material/decor elements; no perpetual animations or per-target theme handlers. Change one root attribute, not an entire map rebuild. Complexity of paint choice is O(1); existing hit logic remains unchanged. All original artwork payload is inherited, not counted as a newly introduced design asset.

Both styles are rendered at exactly the same full frame. Portrait iPad retains a large map left / compact quiz right. Landscape height-bounds the portrait frame rather than stretching it. At 390px the question precedes the full-width map; ordinary vertical scrolling is allowed, not a tiny mini-map or fixed control obscuring targets. Physical browser chrome/keyboard can reduce usable space; verify on-device before release.

## 9. Production acceptance gate after owner approval

1. Review approved visuals and Codex #23's actual button/overlay API; agree a small non-overlapping implementation diff.
2. Add paint tokens/defs + exact two-option UI, not new geometry or an app rewrite.
3. Differential-check all 45 IDs/bounds, 27 anchors/screen positions, exact six lake paths and map CTM between themes. Zero positional drift required.
4. Re-test point/write/graded, no pre-answer labels/target leaks, neutral overlap pointer/keyboard picker, active feedback, wrong/skip, no learner/reward mutations, saved/resumed state and explicit preference persistence.
5. Run canonical lint/test/build and both actual standalone downloads offline, no-JS/contrast/reduced-motion checks, plus physical iPad Safari/keyboard acceptance. Keep original print/PDF bytes unchanged.
6. Owner approval of production PR; no auto-merge/deploy.
