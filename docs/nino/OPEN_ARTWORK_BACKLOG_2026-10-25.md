# TOPO / NINO — Artwork & integration roadmap checklist
**Verified:** 2026-10-25. **Branch:** `art/nino-pizza-rewards-20261024`. No merge or deploy authorized.

## Completed design & artwork
- [x] 7 reusable Nino character PNGs + Arrival scene present on the earlier Nino art branch (Welcome, Guide, Encourage, Success, Gold, Travel, Reflect; verify any final QA notes before app use).
- [x] 8 chapter-wide landscape scenes in the existing Nino art branch (islands, volcanoes, mountains, cities, seas, rivers, countries, regions).
- [x] 11 individual premium round chapter icons generated and visually reviewed together. Native 1254×1254 RGBA, matte cream edge.
- [x] Small-size visual review: clear at 64–96; at 32px route text or matching canonical SVG must accompany these images.
- [x] Three Pizza Masters, 8 unique source slices each, shared board, Pisa closed/open boxes (Margherita, Salami, Quattro Formaggi).
- [x] **Pizza art binaries have now reached this branch**: `assets/nino/rewards/pizza/` contains source masters, 24 slices, PNG boxes, optimized WebPs and manifest, contrary to the earlier handoff's *historical* no-binary status.
- [x] Chapter icon QA doc: `docs/nino/CHAPTER_ICONS_VISUAL_QA_2026-10-25.md`.

## P0 — Git asset release (NEXT)
- [ ] Upload ALL 11 chapter icon source PNGs + WebP exports + manifest to `assets/nino/chapter-icons/` using the 6 smaller ZIP parts and QA manifest from the design chat.
- [ ] Verify SHA256, alpha transparency, file dimensions, complete original-image fidelity and 11 filenames in actual GitHub tree.
- [ ] Check 32/48/64/96px real UI display and keep original route text/icon fallbacks. Avoid claiming PNG is production SVG.
- [ ] Create reviewable art-only PR if needed; no merge/deploy without owner approval.

## P1 — Passport / stamp book (design)
- [ ] Premium hinged personal Italian travel passport cover.
- [ ] Open inner-page master with 11 correctly associated chapter stamp positions.
- [ ] Profile identity panel with user-entered name and favorite pizza as dynamic UI content; do not bake personal text into art.
- [ ] Empty, earned, Gold variants, postcard pockets; profile storage/interaction owned by Codex.
- [ ] iPad and desktop composition and small-viewport accessibility review.

## P2 — 11 travel stamps + Gold
- [ ] Eleven geographically characteristic ink emblems matched to chapter ID.
- [ ] Separate genuine Gold Mastery embossed stamp/seal.
- [ ] Empty/locked and earned stamped treatment; subtle realistic placement on chapter illustration or passport.
- [ ] Stamped transitions under 1s, reduced-motion static alternative; wire to real chapter completions only.

## P3 — Postcards/collectibles pilot
- [ ] Sicilië
- [ ] Sardinië
- [ ] Napoli & Vesuvio
- [ ] Venezia
- [ ] Shared card reverse/paper border and profile-linked travel album behavior.
- [ ] Additional destinations only after owner/learner review; avoid reward currencies or duplicates.

## P4 — App icon/QA release
- [ ] Finalize original Nino red scooter iPad/iPhone/macOS icon from previously approved direction, verified at 32/60/180.
- [ ] Export/implement app icon, touch icon, favicon and installable assets (Codex).
- [ ] Independent Hermes QA on real iPad Safari, mobile, desktop and offline standalone.
- [ ] Owner review before merge/deploy.

## Parallel engineering — do not duplicate in design branch
- [x] **Codex PR #29 (draft):** three-flavor Pizza Reward V2 integrated in a separate app branch, eight source slices, progression, anti-replay, offline builds, visual QA. Head `dcc474e8` as checked on Oct 25. NOT merged.
- [ ] True 3D/2D hinged lid animation: **blocked on missing registered separate base, inner/outer lid, occlusions and consistent camera**, reported in PR #29. The draft currently shows honest static open boxes instead of a deceptive crossfade. New art layers only if design source extraction can preserve appearance.
- [ ] Independent Hermes QA and physical iPad Safari acceptance for #29.
- [ ] Schoolblad (PR #27) and Discovery atlas (PR #30) remain separate open development branches; don't assume they are merged or deployed.
- [ ] Integrate icons/paspoort/stamps/postcards in focused PRs after production-ready art assets exist, not simultaneously with unrelated geometry or map changes.

## Recommended execution order
1. **NOW:** push 11 chapter icon files, verify their branch tree/manifest.
2. **NEXT DESIGN:** passport cover + open spread for owner review.
3. Stamp system (11 chapter + Gold), then a 4-postcard collectible pilot.
4. Final Nino app-icon delivery, compatibility and device QA.
5. Codex/Hermes do app wiring and QA independently, no duplicate work or unapproved production actions.
