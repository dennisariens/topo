# Nino — Character & Voice Guide v1.0
**Status:** Proposed for owner approval, not yet implemented.
**Product:** Topo / Italië · Dutch Group 7, approximately 11 years old
**Based on:** Release 1 integration PR #3 at 9df498919cd6fa1a07aadd6a15e973b496a8b0fd, prior approved original Nino design, and the 2026-10-23 experience audit (Issue #5).
**Companion documents:** NINO_FEEDBACK_MATRIX.md · NINO_VISUAL_ASSET_PLAN.md

## 1. Positioning

**Product** is Topo / Italië. **Character** is Nino. The headline may say "Met Nino door Italië", but Nino does not replace the brand.

Nino is a curious, knowledgeable, slightly witty *Italian travel companion*, not a teacher, baby mascot, judge, celebrity imitation, or manipulative game character. The child is the explorer; Nino provides context, encouragement and directions without taking over.

**One-sentence promise:** "Nino neemt je mee door Italië en helpt je plekken herkennen, terugvinden en onthouden."

### Personality pillars
| Trait | How it sounds | Avoid |
|---|---|---|
| Curious | "Kijk eens waar de rivier eindigt." | Asking vague trivia unrelated to the map |
| Helpful | "De Adriatische Zee ligt aan de oostkant van Italië." | Giving the answer before an independent test |
| Playful but credible | "Even parkeren. Klaar voor nog zes?" | Baby talk, excessive jokes |
| Patient | "Deze oefenen we straks nog een keer." | Shame, guilt, punishment for skipped days |
| Italian but accessible | An occasional "Perfetto!" at a milestone | Italian slang in every answer |
| Independent-learning champion | "Die vond je nu zonder hulp." | Claiming improvement unsupported by actual history |

**Nino's role:** narrator at chapter entry; minimal guide in questions; explainer after meaningful mistakes in practice; visible companion at arrivals and gold; optional quiet presence during intensive tests.

## 2. Audience and language

- Primary writing language **natural Dutch**. Suitable for an independent eleven-year-old; treat the child as capable, not as a toddler.
- Direct address **je/jij**; mostly 4–12 words per feedback line. One fact sentence may follow when it genuinely helps recall.
- Keep names geographically and orthographically correct (Vaticaanstad, San Marino, Sicilië, Sardinië, Vesuvius, Adriatische Zee). Use the accepted name registry in the app, not manual answer aliases in text.
- Italian seasoning sparingly: **Perfetto, Andiamo, Bravo, Ciao, Avanti**. Target max one Italian word in a reward/transition, not every question. Never require the learner to know Italian vocabulary.
- No gendered assumptions; no comments on intelligence, body, parental expectations or school grades.
- Avoid exaggerated praise such as "geniaal" for ordinary clicks. Praise effort, method and retrieval only when factually supported. No invented achievements.
- Punctuation: calm period or short question; exclamation at occasional earned milestones. Default no emoji during questions. A single emoji or small image only in special transitions.

## 3. Voice hierarchy and timing

| Moment | Nino presence | Text budget | Behaviour |
|---|---|---|---|
| First arrival | Hero + one invitation | Headline 4–7 words, supporting line max 18 | One prominent start CTA |
| Return visit | Small avatar + resume line | Max 14 words | Honor saved progress, no guilt about absence |
| Discover | Small guide cue and **one verified observation** | Max 20 words | Target visible; ask to say name / notice shape |
| Point/write question | Optional tiny line or avatar | Max 8 words | **Do not reveal answer** |
| Correct response | Small inline text (mostly without Nino portrait) | 3–10 words, ~1 second | Name target if useful; no blocking modal |
| Wrong response in practice | Text + factual hint + paired highlight if implemented | Up to 2 short sentences, <=28 words | Reveal only **after** graded attempt |
| Near-spelling attempt | Support retry in practice, if implemented | 5–10 words | Don't mark correct prematurely |
| Skipped/revealed | One factual explanation | <=22 words | Count as practice error, schedule review |
| Six-question pause | Avatar + concise summary | Headline + <=18 words | One obvious continue / return choice |
| Chapter arrival | Medium art cameo | Headline + one Italy connection | Stays a few moments; no interruption |
| Gold awarded | Larger Nino + special celebration | <=20 words | Golden state only after actual full success |
| School test | Nino mostly silent | Simple neutral prompt and score | No hints before score, no reaction per error |

**Cadence rules:** never display a new Nino line on every keystroke. Never stack reward toast, skill summary and large modal simultaneously. For repeated correct answers, rotate from a small stable pool and allow quiet feedback (e.g. simple green success label). Reduced-motion preference means no essential information lives in animation.

## 4. Instructional truth rules

1. A correct **retrieval** is different from passive Discover viewing. Don't tell the child "je kent het nu" just for looking.
2. A successful replay may increase daily practice credit while **not** awarding duplicate stage/gold pizza slices. Copy must not imply a new pizza unless the actual reward event happened.
3. A missed answer is not a failure identity. Say what happened, show the right relationship in practice and ask again later.
4. Distinguish **Practice with help** from **Schooltoets zonder hulp**. Until that mode distinction is implemented, do not write UI promises about hints, retries or hidden cues.
5. No schoolcode memorisation. Worksheet numbers/letters are reference metadata only; never describe them as a mastery target.
6. Never display a geographic hint without a checked source or a fact that follows clearly from the canonical map. Nine schematic mountain/region/sea areas must not be described with precise boundaries or unsupported distances.
7. Avoid location-shifting touch suggestions. A tap area may enlarge; the geographic marker must not move.
8. The chapter order is a *learning journey* (11 thematic stops), not a true geographic travel route. No copy implying Nino literally drives from city group to mountains in a geographically sensible linear path.
9. Don't claim "morgen weet je het" or guarantee passing school tests. Do not imply a parental notification, cloud sync or true cross-device persistence; backups are local.
10. Don't use false scarcity, randomized high-pressure rewards, punitive streak resets, leaderboards or purchase triggers.

## 5. Context and intensity states

| State ID | Character behaviour | Placement |
|---|---|---|
| welcome | inviting, relaxed, ready to travel | hero |
| guide | clear pointer/gesture, low excitement | stage introduction |
| focus | mostly invisible/quiet | active question |
| success | small happy glance | end of round / selected correct moments |
| encourage | empathic, calm; never disappointed/shaming | mistakes, retry |
| revisit | lightly recognises a previously difficult item only if recorded | due review |
| arrival | pleased at a genuine chapter transition | between chapters |
| gold | rare strongest emotional beat | fully earned gold |
| quiet_test | invisible or passive emblem | formal test |

Do not infer an emotional state from personal data. State simply derives from current app event, mode and validated learning/reward history.

## 6. Good versus bad examples

| Bad | Replace with | Why |
|---|---|---|
| "Jammer! Helemaal fout!" | "Dat was Slovenië. Oostenrijk ligt ten noorden van Italië." | Correction plus location, not shame |
| "Wow! Jij bent een genie!" | "Goed gevonden. Dat is Sardinië." | Specific and believable |
| "Kom terug, anders raak je je reeks kwijt!" | "Zin in nog zes vragen?" | No pressure |
| "Je kent alles van Italië!" after six easy questions | "Zes vragen afgerond. Kijk wat je al herkent." | Accurate scope |
| "Goed! Pizza verdiend!" for replay without reward | "Goed onthouden!" | Match actual reward event |
| "Deze is rechtsboven" | "Slovenië ligt ten noordoosten van Italië." | Geography, not screen-relative coordinates |
| "We rijden van de landen rechtstreeks naar de zeeën" | "Volgende thema: de zeeën rond Italië." | Avoid fake literal travel path |
| "Schrijf code b" | "Hoe heet dit eiland?" | Curriculum requirement |

## 7. Factual hint bank — only after practice attempt

A starter set; verify against the source map before shipping. Hint IDs and text templates belong to the content matrix; selection must be by stable geographic item ID, not by a random wrong selection.

| Place | Optional verified clue |
|---|---|
| Sicilië | "Het grote eiland bij de punt van de Italiaanse laars." |
| Sardinië | "Het eiland ten westen van het Italiaanse vasteland." |
| San Marino | "Een klein zelfstandig land binnen Italië, niet aan zee." |
| Vaticaanstad | "Een zelfstandig land dat helemaal binnen Rome ligt." |
| Vesuvius | "Deze vulkaan ligt ten oosten van Napels." |
| Etna | "Deze vulkaan ligt op Sicilië." |
| Adriatische Zee | "Deze zee ligt aan de oostkant van Italië." |
| Po | "Deze rivier loopt door Noord-Italië naar de Adriatische Zee." |
| Slovenië | "Dit land grenst aan het noordoosten van Italië." |
| Oostenrijk | "Dit land grenst aan het noorden van Italië." |

Where there is no verified clue, use **"Kijk naar de gemarkeerde plek. Deze komt later terug."** and show the canonical outline/location. Never invent a clue at runtime.

## 8. Selection and variation contract

- **Events first, words second:** app sends structured event (mode, result, location ID, mastery/due, reward event, chapter); content resolver chooses a compatible key, then a variant.
- Reuse a short set of 3–5 variants per common event. Avoid two identical variants in the last three occasions when alternative text exists. Persisting copy-rotation history is optional; don't persist unnecessary child data.
- **Priority:** independent test neutrality > correctness and accessibility > verified hint > variation > personality.
- A named wrong place may appear only when known from a graded pointing selection. Don't falsely claim what the child tapped when no reliable ID exists.
- Delay expensive scenes to chapter arrival and gold. A normal answer should not move the map, scroll, steal focus or block the next action.
- Put all text and references in maintainable content, not scattered string concatenations. Use one source of truth for Nino feedback keys.
- If the avatar fails to render, text plus native status still makes full sense. Announce concise result text via existing accessible status; no duplicate screen-reader announcements.
- User feedback and school-test results can be phrased neutrally without Nino; Nino is not obligated to speak.

## 9. Validation with the actual learner

Run a bounded session with a child (~11) rather than assuming preferred humour or graphics:
- Can they explain who Nino is after one minute?
- Do they understand what to do without parental instruction?
- Which Nino lines are funny/helpful/annoying?
- Can they finish a six-question round without text or art delays?
- What helps them recover from wrong answers?
- Do they choose another round voluntarily?
- Can they recall difficult locations the next day, separately for pointing and writing?

Acceptance: no inaccurate feedback, no premature clues in Test or Gold, no overlong text, no duplicate rewards, no accessibility regressions. Preserve all existing progression, geography, save/migration and print tests.

## 10. Handoff

Codex implements a small content resolver, mode gating and tests in bounded PRs; Hermes audits educational truth, regression and UI accessibility. Owner approves character imagery and art direction before assets are replaced. The historical Work snapshot, current Nino hero and downloadable single-file app are not edited by this documentation PR.
