# Leerroute: brainstorm, evidence, outcome

**Learner:** Dutch 10–11 year old with a 45-item Italian worksheet. **Need:** see the full route, know the next task, repeat finished content, and understand Vatican within Rome.

## Options considered

- A small route card beside the map: keeps both visible but squeezes eleven stops into a 350 px sidebar and makes the map secondary during navigation. Rejected for the overview; keep the map in the lesson.
- A separate light route screen with locked future stops and replayable completed stages: selected. It keeps one obvious action on mobile and room for meaningful progress. The five existing mode tabs stay available.
- Gold as a compulsory gate: rejected. Four successful learning phases open the next stop; a flawless mixed point/write challenge earns optional gold.
- Daily streaks, gems, surprise chests: rejected. Pizza slices and Vespa destinations are the existing identity, with no pressure to return on a particular day.

## Basis and implementation

Practice retrieval after a short study phase and space reviews apart. Duolingo describes its learning path as a sequence of bite-sized lessons and practice; its design motivates a visible path, not a copy of its visual assets. Retrieval Practice describes how active recall supports learning. The product keeps the worksheet grouping and map geometry as the actual learning content. See https://blog.duolingo.com/new-duolingo-home-screen-design/ and https://www.retrievalpractice.org/why-it-works and `docs/LEARNING_MODEL.md`.

Route: 11 stops × Discover → Point → Write → Worksheet codes. Errors return after other places. A finished stage can always be replayed. On completion, optional flawless gold; later review up to six weak places with increasing intervals. Correct answers earn slices; 8 slices earn pizza; each third pizza moves the Vespa. The next question is never delayed by animation. The route screen lists future gray stops; the map returns for exercises. No copying of Duolingo art, mascots or XP.

## Remaining verification

Automated tests exercise complete standalone HTML, stage unlocks, map events, persistence and awards. Real phone/tablet visual appearance, touch precision and coastline source quality require a device/browser audit.
