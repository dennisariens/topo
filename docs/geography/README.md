# Topo map and learning release — 23 October 2026

## Geography review

The embedded 890 × 1235 school-handout photograph was visually inspected. Its photographed/skewed outlines differ from the vector map; it must not be stretched into a shared overlay. It is now shown separately at its original aspect ratio. The photographed sheet contains city dots but does not independently establish all names, codes, mountain/sea boundaries, or microstate positions. Existing syllabus names and codes are preserved.

The old vector coastline matches Natural Earth 110m countries under x=55*longitude−225.5, y=3830.75−77*latitude (fitted maximum residual about 0.072 SVG units across the 87 Italian outline vertices). This established the map's coordinate frame independently of the photograph.

All 23 city markers, San Marino and Vatican City now use geographic reference coordinates and that one projection. Varese and La Spezia use GeoNames; the other cities and microstates use Natural Earth populated places. Vesuvius and Etna use Smithsonian GVP. Vesuvius was incorrectly west of Naples; it is now east. Rome/Vatican retain their close real positions; a numbered enlargement disambiguates touch input without moving either marker.

Country and island outlines now use Natural Earth 50m, simplified only by dropping subpixel intermediate vertices. Both rivers use Natural Earth 10m river centre lines. Source excerpts and projected locations are committed in points.json and map-manifest.json. The original point positions are retained in original-points.json for review.

Of the 45 syllabus targets, 36 have reference-backed point/outline/river geometry. The remaining nine (Apennines, Dolomites, Po Valley, Tuscany, and five sea areas) are approximate educational zones, explicitly described as such in the app. The Apennines zone was corrected to continue down Calabria rather than end in the heel. Po Valley coverage was adjusted around the referenced river. These zones are not surveyed boundaries or claims of map-scale precision. Sea areas overlap geographically; the Mediterranean is the parent sea.

Markers, locator circles, cropped zooms and touch-distance calculation share SVG coordinates. Lesson sizing preserves SVG aspect ratio; the static fallback is generated from the same final data. Tests lock all 45 codes and geometry hashes, check 27 projected point locations, and verify fallback/live marker equality. Future intentional geometry updates must include a source review and update the reference baseline, not just loosen the checks.

## Sources

- Natural Earth countries: https://www.naturalearthdata.com/downloads/50m-cultural-vectors/
- Natural Earth populated places: https://www.naturalearthdata.com/downloads/10m-cultural-vectors/
- Natural Earth rivers: https://www.naturalearthdata.com/downloads/10m-physical-vectors/
- Source datasets: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
- GeoNames Varese and La Spezia: https://www.geonames.org/search.html?country=IT&startRow=50
- Vesuvius: https://volcano.si.edu/volcano.cfm?vn=211020
- Etna: https://volcano.si.edu/volcano.cfm?vn=211060
- School handout: original embedded photograph supplied with the user's HTML.

## Learning and usability

- Six-question adaptive round ranks weak and due skills, includes untested skills from available chapters, and ends after exactly six answers. It does not bypass route completion gates.
- Finding and spelling have separate counters and next-review dates. Previous rewards and chapter completions survive; legacy aggregates are not invented as per-skill results.
- Chapter refresh practice selects skills due for review instead of always asking written names.
- Knowledge passport displays skill status for all 45 places.
- Finish screen separates current-round results and total lesson results.
- Reset all also clears the daily goal; pizza-only reset remains independent.
- Focused lessons show one compact pizza meter. Completing a pizza is inline; arrival still has a celebration.
- Letter/number questions have been removed from tests, route and adaptive practice at the owner’s request. The route now has three stages. Migration preserves completed writing lessons and gold achievements; obsolete code sessions are safely closed.
- All point targets accept taps within 22 screen pixels. Crowded locations open a neutral numbered map enlargement. This is not a blanket WCAG conformance claim.

## Verification

`node check.cjs`: syntax, reward rollover and restore, duplicate answers, full gold coverage across round pauses, daily rollover, adaptive completion, per-skill migration/restore, geographic projection and fallback equality. Passed.

Browser QA: app boot, smart-round resume, correct map grading, crowded-point picker, six-question completion with 2 correct / 4 practice moments, Vatican and San Marino highlighting. The Vatican enlargement and San Marino rings use canonical point coordinates. Physical iPad Safari and touch/keyboard viewport behaviour remain to be tested on the user's device.

Progress remains local to the browser. JSON backup transfer is retained. No automatic device sync in this release. Postcards/customisation, placement challenge and parent/print-sheet builder remain subsequent roadmap items.
