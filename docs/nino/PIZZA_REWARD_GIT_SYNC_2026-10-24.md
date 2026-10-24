# TOPO — Pizza Reward V2 Git sync handoff
**Date:** 2026-10-24  
**Repository:** `dennisariens/topo`  
**Art branch:** `art/nino-pizza-rewards-20261024`  
**Parent branch:** `art/nino-chapters-20261024`  
**Artifact:** `TOPO_PIZZA_REWARDS_GIT_SYNC_2026-10-24.zip` (created from this design conversation)

## Status
**Design is approved.** The art-branch and this handoff document are in GitHub. **The new binary pizza assets are packaged and checksum-verified locally but NOT yet uploaded to the GitHub branch.** After using `PUSH_TO_GITHUB.sh`, verify the GitHub tree contains `assets/nino/rewards/pizza/manifest.json` and all referenced assets. Never claim the artwork was pushed merely because this document exists.

## Locked reward contract
- 8 eligible correct answers → one pizza; 3 completed pizzas → one Nino Vespa journey.
- Pizza flavor cycles `Margherita → Salami → Quattro Formaggi → Margherita`, selected based on already-earned pizza count. No new persistent rewards or user preferences.
- Gold Mastery is separate from pizza collection.
- Preserve anti-replay, eligible retrieval semantics, existing save schema and resets; mistakes do not take pizza away.
- Reuse the one existing official Nino on red Vespa art. Remove the duplicate generic scooter icon/emoji.

## Art asset inventory
Eight PNG sources:
- `masters/pizza-margherita.png`
- `masters/pizza-salami.png`
- `masters/pizza-quattro-formaggi.png`
- `board/pizza-board-wood.png`
- `boxes/pizza-box-closed-pisa.png`
- `boxes/pizza-box-open-pisa-margherita.png`
- `boxes/pizza-box-open-pisa-salami.png`
- `boxes/pizza-box-open-pisa-quattro-formaggi.png`

Additional artifacts:
- 8 cropped individual source-pixel wedges + 8 full-canvas aligned wedges per pizza (24 of each in total).
- One small slice icon per pizza.
- 11 alpha-preserving optimized WebP exports for possible runtime use.
- QA previews and 48/64/120px icon checks.
- `assets/nino/rewards/pizza/manifest.json`: SHA-256, byte length, dimensions, alpha, source provenance, quality checks.

All 8 slices for EACH flavor reconstruct the native source master pixel-exact with zero channel difference and no pixel overlap. Master dimensions are ~1254 pixels, **not** native 2048 pixels: never describe them otherwise.

## Git upload
Open the ZIP in a Mac environment with existing access to the private repository and run:

```bash
bash PUSH_TO_GITHUB.sh
```

The script verifies SHA-256 for all 85 packaged assets, clones ONLY `art/nino-pizza-rewards-20261024`, copies source masters/board/boxes/slices/exports/previews, creates one new art commit and pushes ONLY this branch. It does not merge or deploy. `TOPO_REPO_URL` can override HTTPS with the owner's SSH remote.

## Engineering acceptance (Codex)
- Identify all usage of old pizza wheel, wedge SVGs, and the duplicate scooter visual and perform site-wide unified visual replacements only after checking actual asset availability in branch.
- Derive flavor from existing earned pizza progression; show board at 0/8, exact aligned slices at 1–7/8, whole pizza at true 8/8 completion.
- Display a short box-opening micro-celebration; **static open/closed renders are not an animatable hinged-lid layer stack**. First extract or author independent aligned lid/base/pizza layers; if exact extraction is not practical, ask Design for the specific missing layer. Never fake a proper hinge with an obvious morph/crossfade.
- Reuse the same closed Pisa box for all flavors; only the inside pizza changes. True third-completed-pizza event triggers approved Nino Travel.
- Preserve fully offline self-contained HTML; produce compact optimized runtime assets and verify responsive/reduced-motion presentation.
- No auto-merge or deployment.

## Independent QA (Hermes)
Check iPad-size/phone/desktop, 0–8 slices on each flavor, pixel/alpha alignment at small sizes, no broken images, event-trigger/reload/replay, third-pizza transition, accessibility, reduced motion, offline standalone HTML, no change to 45 geography items, original maps, route, saves, Gold or scoring. A physical iPad Safari check is still an external acceptance item, not covered by desktop browser screenshots alone.

## Subsequent art
Once Codex has reviewable pizza assets, Design proceeds with eleven coordinated chapter icons, followed by a profile-linked travel passport/stamp/collectible concept. No additional illustration regeneration without a specific visual defect.
