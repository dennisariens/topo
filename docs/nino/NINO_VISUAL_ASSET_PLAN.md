# Nino — Visual Asset Plan & Art Direction v1.0
**Status:** Proposed production blueprint. No image generation, existing art replacement or runtime changes have been performed.
**Companions:** NINO_VOICE_GUIDE.md · NINO_FEEDBACK_MATRIX.md
**Reference:** original Nino hero and cutout from the canonical Topo app; Release 1 PR #3; 2026-10-23 Issue #5 audit.

## 1. Creative thesis

**Topo is an Italian geography adventure, not a worksheet with stickers.** Keep the existing Nino hero and signature scooter. Build a small, recognisable art world around chapters and meaningful achievements. Visuals should help the child know **where they are, what to learn next and why the achievement matters**.

### Design principles
1. **The map is the teacher; art frames it.** Never distort geography or put decorations over selectable targets.
2. **Same Nino, every time.** Preserve the approved character's face, apparent age, hair, helmet, goggles, clothing, physical proportions, expressive silhouette and original red Vespa. Future expressions/poses derive from those source assets; do not redesign, adultify or substitute unrelated generic characters.
3. **A travel album, not a casino UI.** Collect a small set of fixed, non-random postcard stamps and personal choices; no endless currencies, purchase incentives, timed scarcity or engagement guilt.
4. **More context, less clutter.** Choose one focus image per screen, not a wall of photos. A scenic cover for each relevant milestone is more valuable than ten decorative thumbnails.
5. **Rooted in Italy.** Limestone and terracotta buildings, piazzas, coastline, ferries, volcano shapes, cypress/olive/lemons where appropriate; avoid generic green hills mistaken for Italy. Every representational landmark/location requires reference check.
6. **Not too young.** Premium illustration with playful character, subtle texture, strong composition; avoid kindergarten mascots, exaggerated candy buttons and busy clip art.
7. **Functional at small sizes.** Neutral SVG category icons stay legible at 32–48 CSS pixels even while locked; important visual feedback has textual equivalents.
8. **Performance/ownership.** Offline one-file HTML; deliver optimized embedded WebP or SVG; no runtime CDN, image API or third-party tracking.

## 2. Design system — visual language

**Keep the current cream, basil/teal, warm yellow, terracotta and existing original illustration; extend carefully.** Proposed working accents (subject to review against existing CSS):
- Crema background: #F4EBDD
- Deep basil: #21644C
- Riviera blue: #2B839B
- Terracotta: #C76D4D
- Limone yellow: #E7C34E
- Warm paper: #FFF9ED
- Ink: #243633

These are direction tokens, **not** a mandate to replace current brand color values. Reserve Riviera blue primarily for the sea and islands, terracotta for travel/accent, basil for correct/active, gold for genuinely mastered states. Do not assign success/failure solely by color.

**Composition:** warm Italian travel-poster realism blended with soft editorial illustration. Same coherent lighting family, tactile cream margins, gentle shadows, crisp silhouette and readable small text overlays. Do not bake chapter copy or achievement numbers into the image; localize text in HTML.

**Asset classes:** 
- Hero/photo-illustration: warm environment plus Nino, high artistic fidelity
- Nino cutouts: transparent RGBA/WebP isolated character expressions
- Chapter mini-scenes: recognizable Italy subject, limited detail, no tiny text
- Icons: hand-authored SVG consistent 32×32 grid and 2px-ish outline family
- Postcards: fixed aspect ratio paper art and matching stamp overlay, title rendered in DOM

## 3. Asset package — P0 and P1 first

| Asset ID / filename suggestion | What to depict | Event/state | Aspect / export | Priority |
|---|---|---|---|---|
| HERO_CURRENT | **Existing** sunny Italian village with Nino on original red scooter | First arrival | Keep existing WebP, reuse | LOCKED |
| AVATAR_CURRENT | **Existing** approved Nino avatar/cutout | Existing UI | Keep existing WebP, reuse | LOCKED |
| NINO_01_WELCOME | Nino looking toward learner, friendly confident wave, same outfit/face | Entry / new chapter | Portrait transparent, approx 4:5 / 640×800 | P1 |
| NINO_02_GUIDE | Nino gestures toward blank safe area on right (no map labels inside art) | Discover intro | 4:5 transparent / 640×800 | P1 |
| NINO_03_THINK | Nino relaxed, slightly curious, not anxious or disapproving | Optional practice feedback | Square transparent / 640×640 | P1 |
| NINO_04_SUCCESS | Nino small genuine smile/thumbs-up, not confetti storm | Six-question round complete | Square transparent / 640×640 | P1 |
| NINO_05_ENCOURAGE | Nino points gently to recheck a map, kind calm face | Practice wrong/retry | Square transparent / 640×640 | P1 |
| NINO_06_GOLD | Nino holding travel badge/raised map; restrained paper confetti | Earned gold / major chapter | 4:5 transparent / 640×800 | P1 |
| NINO_07_ARRIVAL | Nino parking original red scooter beside signpost/ferry platform | Real chapter transition | Wide 16:9 / 1200×675 | P2 |
| CHAPTER_05_ISLANDS | Ferry or island coastline silhouette with Sicilië/Sardinië distinction | Eilanden | 16:9 / 960×540 | P1 |
| CHAPTER_06_MOUNTAINS | Alpine peaks with simple map-aligned mountain language | Bergen | 16:9 / 960×540 | P2 |
| CHAPTER_07_VOLCANOES | Etna/Vesuvius-inspired landscape; neither incorrectly placed | Vulkanen | 16:9 / 960×540 | P2 |
| CHAPTER_10_SEAS | Coast seen from a small boat, compass/waves | Zeeën | 16:9 / 960×540 | P2 |
| CHAPTER_11_RIVERS | Stylised northern river and Italian bridge | Rivieren | 16:9 / 960×540 | P2 |

**Important:** design the above as a **reference sheet** using approved original Nino imagery before generating a large batch. First approve 2 expressions + 1 chapter (Eilanden); only then scale to full pack. If the generator cannot preserve identity, retouch/match manually or reuse approved source; do not accept character drift.

## 4. Eleven route chapters — lightweight identity

These are *learning subjects*, not eleven literal travel stops on a continuous map. Do not attach fake GPS coordinates to chapters.

| Chapter | Canonical group ID | Symbol/metaphor | Small illustration / accent | Mandatory learning link |
|---|---|---|---|---|
| 1. Steden 1–6 | city1 | Piazza sign and small city roofs | Terracotta city vignette | City markers on canonical map |
| 2. Steden 7–12 | city2 | Street sign / arch | Italian arcade | Finding cities |
| 3. Extra steden 13–18 | city3 | Train postcard / skyline | Station clock / map label | City locations |
| 4. Extra steden 19–23 | city4 | Street map / signpost | Route branching through architecture | City locations |
| 5. Eilanden | islands | **Island plus waves / ferry** | Sicilië and Sardinië coastal panorama | Two real island outlines; distinguish them |
| 6. Bergen | mountains | Peak with small snowcap | Alps / Dolomites motif | Mountain zone recognition |
| 7. Vulkanen | volcanoes | Cone with quiet plume | Etna / Vesuvius motif | Two volcano points |
| 8. Streken | regions | Rolling hills / region frame | Local landscape | Recognizing region shapes, with schematic caveat |
| 9. Landen | countries | Border/map shape | Travel-passport frame | Neighbouring country outlines and microstates |
| 10. Zeeën | seas | Compass waves | Coast / sailboat | North/south/east/west sea zones |
| 11. Rivieren | rivers | Blue winding line | Bridge and river | Following Po / Tiber lines |

**Existing bug (Issue #4):** SVG symbol declared as topo-island, while route builder requests topo-islands. Keep icon names on a single validated mapping for all 11 groups; visual QA must confirm every icon actually renders in locked and unlocked states.

### Icon standards
- Vector, transparent; 32×32 viewBox, clear stroke and optional one accent fill; contrast WCAG-compliant with muted locked palette.
- Minimum optical footprint ~20 CSS px inside 38–48 px route badges.
- No text baked in; localized label outside icon.
- Render fallback when symbol missing rather than silent empty circle.
- Check all icons at 320px, iPad portrait and landscape, standard desktop, 200% text, light and dark accessibility needs where supported.

## 5. Collectibles — fixed, meaningful rewards (Release 3)

Do not build 11 posters before testing concept. Start with four or six unique cards and expand only after owner and learner feedback. Postcard is *a record of completed chapters*, not additional currency.

| Collectible | Safe geographic anchor | Illustration brief | Earn condition |
|---|---|---|---|
| CARD_ISLANDS | Sicilië + Sardinië | Warm ferry deck, two recognizable islands; map inset optional and factual | Complete Eilanden stage sequence |
| CARD_VOLCANO | Vesuvius and/or Etna | Volcano skyline with location-relevant silhouette, clear educational label in DOM | Complete Vulkanen |
| CARD_RIVERS | Po / Tiber | Italian river bend and bridge, small correct source-backed map cameo | Complete Rivieren |
| CARD_SEAS | Italian coastline | Sea poster with simple compass; no false boundaries | Complete Zeeën |
| CARD_COUNTRIES | San Marino / Vaticaanstad | Passport-style border stamp + true microstate callout | Complete Landen |
| CARD_GOLD | Golden achievement for any chapter | Small premium embossed Nino/Vespa seal; color + text | Earn flawless chapter gold |

**Unlock truth:** uniqueness key = actual chapter ID or gold; don't mint duplicate cards for replay or restored saves. Existing completed chapters should be mapped conservatively to collectible ownership on migration; do not give out new learning rewards by mistake. Card front visual + factual caption; ability to see card again via passport. Rare gold seal is a stronger but restrained celebration.

**Vespa customization later:** 2–3 authentic scooter paint colors + a small set of travel stickers (ferry, mountain, compass). Cosmetic choice only, no points or leaderboard. Must preserve identity of approved red Vespa at default. Test if 11-year-old finds it more engaging than postcards *before* implementing.

## 6. Exact art-direction briefs / image generation prompts

### Global invariant block for **all** Nino pose assets
> Use the approved Topo Nino source art as the exact character reference. Match facial proportions, hair, helmet, goggles, outfit silhouette, expressive rendering style and original red Vespa where visible. Premium sunny Italian editorial travel illustration with clean contours, natural texture and warm believable light. Full character or bust fully in frame as specified. Transparent background unless scene explicitly requests a setting. No typography, numbers, brand logos or other IP characters. Consistent scale, personality and skin/face design across every output. Not toddler-like, not adult, not anime, not clip art, not plastic 3D render, not stock photography.

**Pose brief A — NINO_02_GUIDE (first to prototype)**
> Nino waist-up at left, calm curious smile, left hand gesturing toward an empty right-hand region reserved for live geographic UI. Acknowledge learner without pointing to fake map locations. Clean isolated cutout, strong small-size silhouette, gentle left-side daylight. Keep approved costume/helmet, no text.

**Pose brief B — NINO_05_ENCOURAGE (second prototype)**
> Nino 3/4 bust, a patient friendly expression after a missed geography question; slightly raised open palm signaling "we can try again", no disappointment, sadness, judgment or exaggerated excitement. Transparent background, clear eye/hand silhouette. Match original face exactly.

**Scene brief C — CHAPTER_05_ISLANDS (first environment prototype)**
> Wide illustrated Italian Mediterranean ferry arrival scene, subtle coast and sea blues, warm cream terraces, simple boat and one signpost whose text remains blank for HTML overlay. Evoke a journey to the real islands Sicilië and Sardinië without showing an incorrect geographic map. No crowds, no typography, limited visual noise. Leave lower-right negative space for accessible overlay; consistent light and material with existing Nino hero. Nino optional; if present use exact approved model and red scooter only in a grounded dock scene.

**Pose brief D — NINO_06_GOLD**
> Approved Nino in a rare celebration pose, holding a small unlettered gold travel badge, joyful but restrained, no giant confetti burst, no extra mascots or currencies. Transparent background; legible at 120–180px display width and usable static when reduced motion is enabled.

**Card brief E — CARD_VOLCANO**
> Editorial Italian travel postcard, coherent with the approved Topo art style, a believable Vesuvius or Etna landscape chosen with geographic reference, warm late-afternoon light, modest vintage paper texture, uncluttered upper and lower margins. No text; reserve space to render volcano name and the sourced one-sentence fact in HTML.

## 7. Asset manifest and integration naming

Proposed directory (do not introduce duplicate maintained routes or a second map source):
- output/art/nino/approved-reference.webp (reference only, keep actual current art filenames)
- output/art/nino/nino-guide.webp
- output/art/nino/nino-encourage.webp
- output/art/nino/nino-gold.webp
- output/art/chapters/islands-arrival.webp
- output/art/chapters/volcanoes.webp
- output/art/postcards/islands.webp
- output/art/postcards/volcanoes.webp
- output/art/svg/chapter-icons.svg (could remain inline in canonical app)

**Manifest fields:** id; filename; version/asset SHA; source prompt/reference; explicit source provenance and license; width/height; alpha; usage context; alt/aria treatment; display sizes; fallbacks; optimization bytes; animation/reduced-motion variant; approval status. Put them in one machine-readable registry during implementation.

**Export/checklist:**
- Hero backgrounds: WebP opaque, 16:9 source ~1200×675, prefer under 130 KB each at sufficient visual quality; ensure text contrast in HTML.
- Cutouts: WebP with alpha, around 640×800 or 640×640 source, prefer under 55 KB each; avoid halos on cream and dark teal backgrounds.
- Postcards: WebP opaque 4:3 source 960×720, prefer under 80 KB each; clean edges at 240px view.
- Icons: inline SVG; never rasterize small route pictograms.
- Budgets are initial quality/performance targets, not hard cutoffs; visual legibility controls acceptance.
- For each asset, verify standalone HTML remains self-contained and no network fetch is introduced; downloadables remain byte-identical to built root.
- All meaningful visuals have text equivalents. Decorative avatars are aria-hidden; factual geography labels remain live text, not baked into pixels.
- Never edit or reproject country/point/river coordinates to make a postcard appear more artistic.
- Mobile crop tests: 320×568, 390×844, 820×1180 iPad portrait, 1180×820 landscape, 1440px desktop. Also 200% text, reduced motion, high contrast.
- Never show the same large hero artwork twice in a short vertical journey view; alternate mini-icons and selected milestone art.

## 8. UI placement / storyboard

**A. Learroute home**
- Existing approved hero once.
- Immediately show the next meaningful action and one *current chapter* card.
- Behind current card: a little Italy-themed route/album trail and next subject preview.
- Keep remaining future chapters as compact waypoints, not eleven identical large grey locked panels.
- No second hero at bottom; passport and backup controls are secondary.

**B. Discover screen**
- Nino_02 small at upper-left or within prompt band and optionally a short fact.
- Canonical map remains the largest useful teaching element.
- Avoid side imagery floating on or obscuring the map. Provenance under "Over de kaart".

**C. Answer screen**
- Typically **no big new Nino asset**. Tiny avatar allowed next to one short inline feedback; prompt and clickable map take priority.
- For crowding, keep neutral numbered picker near real positions and accessible buttons. No art should confuse grading.
- For wrong pointing: optionally pair chosen/correct positions with live SVG emphasis, not a fabricated illustration.

**D. Six-question finish**
- Nino_04 small to medium, one clear summary (per-round vs lifetime), single obvious Continue.
- Pizza ring may appear compactly if actual slices changed; don't duplicate header+lesson+finish counters.

**E. Chapter arrival**
- Nino_07 or chapter mini-scene, one short celebratory line, optional card reveal if collected. No blocking prolonged animation.
- Travel progression can be shown without adding an inauthentic geographic path.

**F. Gold**
- Nino_06; clearly labelled gold; one short animation max, static alternative; no instant re-award on replay.

**G. Passport**
- Collage of 4–6 earned cards (once enabled), with clear locked silhouettes and ability to reopen. Do not obscure the actual point/write mastery indicators.

## 9. Delivery phases, gates and responsibilities

### Phase 0 — polish / no new illustration
Owner-approved Bug Issue #4: fix blank Eilanden symbol + stale pizza text. Simplify route cards/mobile navigation and move provenance behind disclosure (Issue #5) in a separate bounded UX PR.

### Phase 1 — identity lock and two Nino poses
Create a small **contact sheet** of NINO_02_GUIDE and NINO_05_ENCOURAGE beside existing Nino, with transparent-background exports. Verify original face/helmet/jacket/age/linework. Owner approves / rejects. Do not generate eight variants per pose before this gate.

### Phase 2 — microcopy and educational feedback
Codex integrates the NOW subset of the approved feedback registry; tests verify no wrong claims, no early hints, no duplicated achievement messages and accessible screen reader updates. Hermes inspects a bounded UI QA pass.

### Phase 3 — first chapter and milestone
Generate CHAPTER_05_ISLANDS scene and NINO_06_GOLD; implement only the chapter/gold transition placements after owner artwork sign-off. Check visual hierarchy and iPad performance; compare time-to-first-question.

### Phase 4 — Italy passport prototype
Produce CARD_ISLANDS + CARD_VOLCANO and test desirability with child before full set or Vespa customization. Separate implementation PR. No account/cloud-sync work bundled.

### Release acceptance
**Art:** consistent Nino design, no fuzzy small-scale faces, true contextual Italian cues; no duplicate backgrounds.
**Learning:** no loss of map focus, skills, 45 places, three-stage route, Gold, spaced history, all save migrations and code-free testing.
**UX:** usable on physical iPad Safari with actual tapping and keyboard; touch targets, no map drift, smooth scroll, user understands what to do next.
**Accessibility:** reduced-motion safe, keyboard/screen-reader usable, captions/content outside pictures, no hidden crucial controls.
**Engineering:** optimized embedded image assets, no runtime external dependency, automated asset-symbol existence checks, lint/test/build pass.
**Scope:** each phase independent, no surprise merge or deployment.

## 10. Owner decisions to lock before a large artwork batch

1. Retain the **original Nino and original red Vespa** as the visual source of truth.
2. Prefer **4–6 meaningful Italian postcards** over more counters.
3. Choose **guide + encourage** as first two poses; approve identity before all other states.
4. No full-screen art during every question; map remains central.
5. Preserve exact geography and curriculum; school codes are not learned.
6. Keep additions subtle enough for an independent eleven-year-old, not infantile.
7. Deploy a separate preview and test on the child's real iPad before replacing the old site.

No new images are attached to this document; this is the approved-input specification for a subsequent distinct image production task.
