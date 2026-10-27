# TOPO / NINO — L'Atlante di Nino
## Discovery map visual direction based on passport art
**Date:** 27 October 2026  
**Decision status:** owner-approved **design direction for one prototype**, NOT approval to integrate or alter the map.  
**Related:** #35 (Discovery map visual finish), #33 (iPad map-first Focus), #38 (45 learning objects), PR #30, PR #40, PR #47, passport #21.

## 1. Core idea
Use the premium vintage Italian travel passport's **visual language**, not its full painted paper image, around the existing accurate Discovery map. Same imaginative world as Nino, Vespa, souvenirs, compass and passport; map itself remains a proper readable **geographic learning instrument**.

**Principle: MAP FIRST.** The genuine Italy learning map retains current pixel footprint or grows, never shrinks to create a decorative border. Genuine source-backed coastline, relief (DEM), six lakes, paths, point/area/river hit geometry, projection and all 45 targets are not changed by this visual proposal.

## 2. Visual layers
- **Map:** actual registered terrain. Green lowlands with more nuanced olive/lush natural variance, distinct Po plain, Alps/Apennines depth from the same DEM. Seas rich but restrained Mediterranean blue. Do not paint aged parchment over the educational map surface, change coastlines, fake borders or place picturesque invented landforms on answer-relevant areas.
- **Off-map atlas environment:** light cream parchment paper outside the map, thin sepia cartographic linework, subtle olive/lemons/cypress/fine antique compass, small original illustrative margin ornaments from the passport style. Avoid clipped/generic photographic panels or colorful scenery which encroaches on hit targets.
- **Nino presence:** modest original Nino character feedback and authentic Vespa route where available; contextual overlays are brief, skippable and visually subordinate. No fictitious rewards/progress.
- **UI:** existing iPad map-first Focus overlay, readable question + fully opaque answer controls, clear Heel Italië / Zoom op hoofdstuk / Kaartstijl; no excessive right-hand toolbar. No stealing vertical space from map. Out-of-test exploratory mode only.
- **Test/Gold/Schoolkaart:** keep sober neutral/cream cartography without visual noise or revealed answers; the two interactive map themes remain aligned in viewBox/hit-testing.

## 3. Prototype before code
Build **one** landscape design proof using a screenshot from the then-current verified map application, side by side with the screenshot benchmark `docs/visual/discovery-map/owner-benchmark.png` from PR #30:
1. Original Discovery map viewport at exact same zoom/camera/45 overlays.
2. Proposed 'L'Atlante di Nino' frame using only external spare margins; minimal authentic foliage/compass and warmer parchment controls.
3. Quiet test view showing every decorative atlas element disabled.

Compare visible map-area percentage, target legibility (especially Apennines/Tuscany/Po Plain/Rome-Vatican/San Marino), contrast/keyboard/focus, screenshot fidelity and no camera drift. A generated **concept image may express atmosphere only**; it is not an implementable or accurate geographic layer.

Owner first decides **GO / ADJUST** on side-by-side proof. If GO, export **separate small transparent decorative margin assets**, not a full-screen wallpaper. Limit art to truly missing elements; reuse approved assets. Codex/Hermes implement after P0 #38 and iPad release; no duplicate branch or overlapping agent assignments. Hermes independently checks visual QA and geometry freeze.

## 4. Acceptance
- Map screen area never smaller than accepted Focus Mode baseline.
- All 45 canonical target hitboxes, lakes, DEM, map styles, grades, flow/saves and offline HTML unchanged.
- Scenic decorations do not touch map/answers; respect portrait, landscape, 320px, split view, native keyboard, reduced motion/high contrast.
- Compare actual screenshots at equal camera; readably labeled, touch-safe controls.
- Educational fidelity is above illustration. Decorative route/map motifs may not imply false geography or earned visits.

## 5. Relationship to passport masters
The **left/right blank passport folios** are reusable book background assets. Aesthetic direction and perhaps independently extracted olive/compass art can be reused, but **never embed whole folio raster behind the main learning map** or mirror a geographic Italy print backwards. Atlas margin assets are distinct exports subject to transparency/color/size QA.

**Release sequencing:** current P0 functional HTML + all-45 audit first, passport/optional atlas artwork work may proceed without modifying canonical learning logic, user approves prototype before integration.
