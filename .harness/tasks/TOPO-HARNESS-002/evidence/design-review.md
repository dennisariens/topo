# Design-skill review of pilot screenshots

Reviewer: Claude Code, not independent QA. Skill used: `topo-ui-design` (overlay and pinned PR64 source). Inputs: pilot bundle at `3b8dfb92a7b36a113496691991cd59d6ee582460`, the journey screen in Chromium 1500, WebKit 768 and WebKit 320, plus one direct Chromium 1500 viewport capture of the real file:// HTML.

Scope limit: fresh-profile journey screen and onboarding only. This does not cover Discover, Point, Write or Gold, both map styles, or the skill's full viewport list. It is not owner visual acceptance. No learner UI was changed.

Observed against the skill:
- One clear next action (`Verder met Steden 1–6`) and short truthful progress at all three widths.
- Learning phases stay in the approved order inside the current stop; later phases are locked.
- Warm notebook identity, Nino and pizza/Vespa rewards are present; no invented counters seen.
- At 320 the stop titles `Extra steden 13–18` and `19–23` wrap inside the number range. Cosmetic; no action proposed.

Finding: `browser/chromium-1500.png` shows blank artwork for stops 3–11. Direct testing did not reproduce it for a learner: all 18 visible images are decoded in Chromium and WebKit at all three widths before and after scrolling, and the artwork renders in a normal viewport behind onboarding. The images use `decoding="async"`, which fits a full-page capture artefact, but the cause is not proven. Effect: a V1 screenshot can show less than the app renders, so it is weaker evidence than it looks. V1 `scripts/harness/browser.mjs` is frozen, so this is recorded as incident I-004 and proposal only.
