---
name: topo-ui-design
description: Design and implement high-fidelity TOPO/NINO learner interfaces that preserve original geography, progression, rewards and fully offline single-file operation. Use for any UI, UX, styling, responsive, focus, visual QA or layout work in this repository.
---

# TOPO / NINO — UI Design & Implementation

## Source of truth
- This repository is a real geography-learning app for an 11-year-old. **The original Italian geographic map, its precise clickable areas and symbols, semantic hit resolver, point coordinates and school workbook are canonical**. Never substitute invented, stylized or AI-generated geography for them.
- Approved visuals and owner corrections in issue #52, PR #64, `docs/UX_DESKTOP_LEARNER_52.md`, `docs/DESIGN_SYSTEM.md` and `docs/LEERROUTE_DESIGN.md` take precedence over generic web-app preferences.
- The owner has approved design v2: the learning phases `Ontdekken → Aanwijzen → Schrijven` **immediately below the main header and above the map**; optional `Gold-toets` separate at the right. No primary phase navigation at page bottom.
- The frozen computer v1 baseline is `release/topo-nino-computer-v1-20261030` at `1bf86b3e1c69319bed8ef877243070a64d97a12e`. Implement #52 only in `codex/issue-52-calm-desktop-learning` / PR #64. Do not edit/release the frozen file or merge independent stacked PRs.

## Visual quality bar
- Think Italian travel field notebook: warm ivory, dark coastal green, restrained terracotta, soft linework, paper-like surfaces. This is an education product, **not** an admin dashboard, no excessive glass, gradients, animations or small control pills.
- Strong information hierarchy: one major title, one current task, one main map, short truthful progress, one obvious next action; reduce permanent control noise. Map should have roughly 70% of usable desktop width; flexible responsive limits are more important than a rigid 70/30 split.
- Use genuine content and current events. No placeholder achievements, fake `Vandaag` counters, duplicate pizza currencies, invented unlocks or requested-answer hints in Test/Gold.
- Treat Gold as a **conditionally available optional exam**, not a forced fourth course stage. Its button must obey `TopoRoute.record(...).stage===3`; never rename ordinary ungraded practice `exam` to Gold.
- Keep the one canonical `#quiz`, `#answer`, `#check`, `#prompt`, `#message` and the original event handlers. Do not create a second question grader, answer model or progress reducer.
- Keep all essential controls findable: map style, whole Italy, chapter zoom, school reference, Learn/Point/Write, accessible return to journey. Print/export/import/reset and extra practice may live in a carefully grouped Menu, but must preserve canonical handlers and confirmations.
- Each actionable button at least 44 CSS pixels high; visible focus rings; semantic labels; no hover-only essential action. Respect prefers-reduced-motion/contrast, large text and native input keyboard.

## Responsive ownership
- Compact/iPad `scripts/focus-mode.js` already owns screens `innerWidth<=1180` and coarse-pointer up to 1440. Do not build a competing responsive engine. At 1440 fine-pointer use desktop; at 1366 coarse-pointer keep Focus.
- Never change the map SVG CTM, source geometry, hit zones, feature-class filtering, random number order, current question, route engine, storage key or reward calculations.
- Crossing 1500→1100→1500 while typing must retain draft, selected text/caret, keyboard focus and task. No double-reparent loops, duplicated input or DOM observer loops.

## Before calling work 'done'
1. Review real before vs after browser screenshots (desktop 1728/1440, 1280, iPad 1180×820 and 820×1180, phone 390×844 and 320×568). Capture Learn, Point, Write, Test and Gold. A mockup with fake map is only design exploration.
2. Build the **actual** HTML and test `file://` with network offline. Ensure no external assets or requests. Never overwrite the existing v1 release; use a separately named candidate.
3. Run the existing 17-program npm test chain, lint, build, source integrity and at least selected real browser flows: Rome/Vatican, Etna/Catania, Naples/Vesuvius, Milan/Varese, San Marino, overlapping seas; shuffled neutral numbers, correct/wrong grading; saved draft, Gold/replay and 8-slices/3-pizzas reward.
4. Provide a new commit SHA, exact screenshot links, candidate HTML download, tests with honest PASS/NOT TESTED distinctions, and list remaining hardware gates. Get owner GO then Hermes independent QA before a new final release.
5. When a problem arises, fix the narrow real issue. **Do not redesign approved screens** or replace the existing TOPO identity unless owner asks.

## Project #52 design quality specific
- The approved v2 reference is a layout *direction*, not reusable code and not an app. Improve its precision, spacing, typography, keyboard behavior and support for all live modes when implementing the real app.
- Desktop learning phase strip under header: real existing phase buttons, separate Gold in same strip, chapter label/context; compact Menu on the right.
- Sidebar: only current task and feedback, not rewards/utility clutter. Progress must come from real `routeLessonCount` or exam state.
- Discovery map palette, passport, Nino animation and new rewards are separate issues; avoid scope creep and do not slow an 11-year-old learning topography.
