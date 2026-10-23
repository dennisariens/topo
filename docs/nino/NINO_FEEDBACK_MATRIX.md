# Nino — Feedback Content Matrix v1.0
**Status:** Proposed, implementation-ready copy inventory. Not all modes/behaviours are present in Release 1.
**Companions:** NINO_VOICE_GUIDE.md · NINO_VISUAL_ASSET_PLAN.md
**Reference app:** Topo / Italië PR #3, commit 9df498919cd6fa1a07aadd6a15e973b496a8b0fd.
**Language:** nl-NL. Strings are intentionally concise, designed for ~11-year-olds.

## 1. Implementation contract

This matrix defines **event IDs and multiple approved strings**, not random global quotes. Send an event and factual context to a central resolver, then choose a variant compatible with mode, mastery and reward state. Preserve existing question grading and answer IDs.

**Tokens:** {place} canonical target name; {chosen} identified wrong selection (pointing only); {topic} chapter topic; {nextTopic} next topic; {count} verified answer count; {total} question count; {hardPlaces} actual reviewed place names; {hint} verified geographic clue; {rewardCity} actual reached itinerary city; {dueCount} due count. Escape/sanitize displayed tokens using textContent, never HTML injection.

**Status flags:** NOW = appropriate for existing three stages/adaptive rounds; NEXT = implement only with next requested feature (assisted practice, school test, typo retries, postcards). Never display NEXT messages until the corresponding behaviour truly exists.

**Rules:**
- Wrong answer: do not present a possible right answer before the first graded independent attempt.
- Discover answers do not count as mastery retrievals or pizza if the current engine does not award them.
- Practice can give hints after grading; Schooltoets cannot reveal a hint during an unanswered question, or grant retries that invalidate independent scoring.
- Gold requires full flawless coverage, including all items beyond six-question pauses; no fake gold "almost".
- Repeat/reload does not mint a new pizza. The message must be selected from the actual reward event, not inferred from total counters.
- Successful stage replay may increase daily goal without minting duplicate stage reward: use normal correct feedback, not pizza congratulation.
- Never invent a geographic hint. Resolve from trusted item-ID lookup; fallback to neutral line.
- When feedback is spoken via screen reader, do not also announce a verbose Nino avatar state; status message carries all needed meaning.
- No penalty/shame for misses, forgetting, quiet days or fewer questions.

## 2. Core message inventory

### A. Entry, navigation and return
| ID | Trigger / channel | Variant A | Variant B | Variant C | Status |
|---|---|---|---|---|---|
| ENTRY.FIRST | Fresh route entry / hero | "Ciao! Ik ben Nino. Zin in Italië?" | "Welkom! We ontdekken Italië samen." | "Klaar voor onze eerste halte?" | NOW |
| ENTRY.RETURN | Saved progress / small hero | "Welkom terug. Zullen we verdergaan?" | "Daar ben je weer! De route ligt klaar." | "Klaar voor de volgende stap?" | NOW |
| ENTRY.RESUME | Unfinished active lesson | "We gaan verder waar je was." | "Je plek is bewaard. Rijden we door?" | "Nog even verder met deze les?" | NOW |
| ENTRY.COMPLETE | All 11 stops complete | "Alle haltes ontdekt. Wat oefenen we vandaag?" | "Heel Italië op de kaart! Tijd om op te frissen." | "Je reis gaat verder met nieuwe uitdagingen." | NOW |
| ENTRY.START | First CTA / short | "Start mijn reis" | "Op naar de eerste halte" | "Begin met ontdekken" | NOW |
| ENTRY.START_SMART | Smart round CTA | "Mijn slimme rondje · 6 vragen" | "Zes vragen, speciaal voor jou" | "Korte oefenrit" | NOW |
| ENTRY.LESSON_UNAVAILABLE | Locked stage info | "Rond eerst de vorige stap af." | "Deze halte komt later aan de beurt." | "Eerst een stukje verder op de route." | NOW |
| ENTRY.PAUSE_WARNING | Leaving unfinished lesson | "Je les is nog niet af. Wisselen?" | "Weet je zeker dat je iets anders wilt doen?" | "Je afgeronde stappen blijven bewaard." | NOW |
| ENTRY.LOCAL_SAVE | Save location info | "Je voortgang blijft op dit apparaat." | "Bewaar een reservekopie als je van apparaat wisselt." | "We slaan je voortgang hier op." | NOW |
| ENTRY.PASSPORT | Passport teaser | "Welke plekken herken jij al?" | "Bekijk wat je al kunt aanwijzen en schrijven." | "Jouw kennis van Italië groeit." | NOW |

### B. Discover (Ontdekken)
| ID | Trigger / channel | Variant A | Variant B | Variant C | Status |
|---|---|---|---|---|---|
| DISCOVER.OPEN | Discover stage intro | "Eerst kijken. Daarna zelf zoeken." | "Let op de vorm en de ligging." | "We beginnen met ontdekken." | NOW |
| DISCOVER.PLACE | Place highlighted and name shown | "Dit is {place}. Zeg de naam eens hardop." | "Kijk goed waar {place} ligt." | "Kun je {place} op de kaart onthouden?" | NOW |
| DISCOVER.SHAPE | Confirmed meaningful area shape | "Kijk naar de vorm, niet alleen naar de stip." | "Waar liggen de grenzen ongeveer?" | "Probeer deze vorm te herkennen." | NOW |
| DISCOVER.CLOSE | Discover finished | "Nu mag jij de plekken zoeken." | "Mooi bekeken. Klaar om aan te wijzen?" | "Tijd om het zelf te proberen." | NOW |
| DISCOVER.ISLANDS | Start theme Eilanden | "Twee eilanden. Kun jij ze uit elkaar houden?" | "Klaar voor een overtocht naar de eilanden?" | "Let op waar Sicilië en Sardinië liggen." | NOW |
| DISCOVER.VOLCANO | Start theme Vulkanen | "Twee vulkanen, twee verschillende plekken." | "Van Napels naar Sicilië: ontdek de vulkanen." | "Kijk goed waar de vulkanen liggen." | NOW |
| DISCOVER.MICROSTATE | Rome/Vatican explanation | "Vaticaanstad ligt helemaal binnen Rome." | "Twee namen, bijna dezelfde plek. Kijk goed." | "Kijk naar de vergroting voor Vaticaanstad." | NOW |
| DISCOVER.OBSERVATION | Item has approved fact | "{hint}" | "Let op: {hint}" | "Onthoud dit: {hint}" | NEXT |

### C. Point and write — prompts, no pre-answer hints
| ID | Trigger / channel | Variant A | Variant B | Variant C | Status |
|---|---|---|---|---|---|
| PROMPT.POINT | Point task begins | "Waar ligt {place}?" | "Tik {place} aan op de kaart." | "Kun jij {place} vinden?" | NOW |
| PROMPT.WRITE | Write task begins | "Hoe heet deze plek?" | "Welke naam hoort hierbij?" | "Schrijf de naam van de gemarkeerde plek." | NOW |
| PROMPT.CLOSE_PICKER | Close overlapping selector | "Kijk naar beide punten en kies het juiste." | "Welke van de twee hoort bij de vraag?" | "Zoom even in en kies." | NOW |
| PROMPT.SMART_OPEN | Six-question round start | "Zes vragen. We oefenen wat telt." | "Een kort rondje: zoeken en schrijven." | "Klaar voor zes slimme vragen?" | NOW |
| PROMPT.DUE | Due review opening | "Eens kijken wat je nog weet." | "Deze plekken komen terug voor een opfrisser." | "We oefenen bekende plekken opnieuw." | NOW |
| PROMPT.GOLD_OPEN | Gold start, before first task | "De gouden proef: alles goed voor goud." | "Klaar om deze halte echt te beheersen?" | "Zonder hulp. Laat zien wat je kent." | NOW |
| PROMPT.TEST_OPEN | Independent school test / intro | "Tijd voor de schooltoets, zonder hints." | "Doe de toets zelfstandig. Succes!" | "Deze ronde telt zonder hulp." | NEXT |
| PROMPT.TYPO_RETRY | Small spelling miss, practice only | "Bijna goed geschreven. Probeer nog eens." | "Kijk nog één keer naar je spelling." | "Je zit dichtbij. Nog een poging?" | NEXT |
| PROMPT.TYPO_EXHAUST | Retry used | "We oefenen deze naam later opnieuw." | "Kijk goed naar de juiste schrijfwijze." | "Deze komt straks nog een keer." | NEXT |

### D. Correct responses — grounded and nonintrusive
| ID | Trigger / channel | Variant A | Variant B | Variant C | Status |
|---|---|---|---|---|---|
| ANSWER.OK_POINT | Correct point, no special reward | "Goed gevonden!" | "Ja, dat is {place}." | "Precies aangewezen." | NOW |
| ANSWER.OK_WRITE | Correct write, no special reward | "Goed geschreven!" | "Precies, {place}." | "Die naam zat goed." | NOW |
| ANSWER.OK_REVIEW | Correct spaced-review attempt | "Goed onthouden!" | "Deze heb je nog paraat." | "Die vond je weer terug." | NOW |
| ANSWER.OK_IMPROVED | Previous measurable miss; now independently right | "Die was eerder lastig. Nu wist je hem!" | "Mooi, {place} lukte deze keer." | "Kijk, deze kwam goed terug." | NOW |
| ANSWER.OK_REPLAY | Correct completed-stage replay, no repeat slice | "Goed onthouden!" | "Nog steeds raak." | "Ja, deze zit erin." | NOW |
| ANSWER.OK_FAST | A quick quiet feedback alternative | "Juist." | "Klopt." | "Goed." | NOW |
| ANSWER.OK_PIZZA | Actual pizza awarded by engine | "Perfetto! Een pizza compleet." | "Acht punten! Pizza verdiend." | "De pizza is rond. Mooi gewerkt." | NOW |
| ANSWER.OK_TRIP | Actual third-pizza Vespa milestone | "Andiamo! Nino rijdt naar {rewardCity}." | "Nieuwe Vespa-rit verdiend!" | "Op naar {rewardCity}!" | NOW |
| ANSWER.OK_LEARNED | Stable skill status confirmed by threshold | "Je kunt {place} nu aanwijzen én schrijven." | "Beide vaardigheden gelukt voor {place}." | "Deze plek staat sterk in je paspoort." | NEXT |

### E. Wrong response, skipping and retry
| ID | Trigger / channel | Variant A | Variant B | Variant C | Status |
|---|---|---|---|---|---|
| ANSWER.WRONG_POINT_KNOWN | Wrong pointer has reliable selected ID; after grade | "Dat was {chosen}. Gezocht: {place}." | "{chosen} ligt ergens anders. Hier is {place}." | "Net mis: je tikte {chosen} aan." | NOW |
| ANSWER.WRONG_POINT_UNKNOWN | Wrong but clicked ID unavailable | "Bijna. Hier ligt {place}." | "Dit is de plek van {place}." | "Kijk waar {place} ligt." | NOW |
| ANSWER.WRONG_WRITE | Wrong name, after grade | "De juiste naam is {place}." | "Dit was {place}. Kijk nog even." | "Nog even oefenen: {place}." | NOW |
| ANSWER.WRONG_WITH_HINT | Verified clue available after wrong answer | "{hint}" | "Onthoud: {hint}" | "Kijk naar deze aanwijzing: {hint}" | NEXT |
| ANSWER.WRONG_GOLD | One gold response wrong; after grade | "Deze proef is nog niet foutloos." | "Deze plek oefenen we nog eens." | "Je kunt het later opnieuw proberen." | NOW |
| ANSWER.SKIP | Skipped/revealed answer, practice | "Geen probleem. Dit was {place}." | "We pakken {place} later opnieuw." | "Kijk nog even waar {place} ligt." | NOW |
| ANSWER.SAME_MISS | Repeated missed item | "We blijven deze rustig oefenen." | "Kijk naar de vorm en ligging." | "Deze komt later weer terug." | NOW |
| ANSWER.TEST_WRONG | Formal test, result feedback after test score | "Dit antwoord was niet goed." | "Het juiste antwoord is {place}." | "Deze oefenen we later opnieuw." | NEXT |
| ANSWER.TEST_NEUTRAL | Formal test, in progress | "Antwoord opgeslagen." | "Volgende vraag." | "Je antwoord telt mee." | NEXT |

### F. Smart practice, pauses and summaries
| ID | Trigger / channel | Variant A | Variant B | Variant C | Status |
|---|---|---|---|---|---|
| ROUND.INTRO_WEAK | Weak/due/new selection is real | "Vandaag oefenen we bekende én lastige plekken." | "Een paar oude, een paar nieuwe." | "Nino heeft zes passende vragen gekozen." | NOW |
| ROUND.PAUSE | Six-question pause | "Even parkeren. Zes vragen gedaan." | "Tijd voor een kleine pauze." | "Zes vragen achter de rug!" | NOW |
| ROUND.PAUSE_LONG | More tasks remain after six | "Nog meer plekken te gaan. Zin om door te rijden?" | "Goed bezig. De rest volgt in het volgende rondje." | "Halverwege? Je kunt straks verder." | NOW |
| ROUND.RESULT_PERFECT | Round actually {total}/{total} correct | "Alles goed in dit rondje!" | "Mooie ronde. Alles raak." | "Zes op zes, als de ronde zes vragen had." | NOW |
| ROUND.RESULT_MIXED | Round contains errors | "{count} van {total} goed. We oefenen de rest later." | "Mooi geoefend. Je fouten helpen bij het herhalen." | "Je hebt {total} vragen gedaan. Verder oefenen?" | NOW |
| ROUND.RESULT_NO_RETRIEVAL | Discover-only (zero active retrieval) | "Je hebt de plekken bekeken." | "Klaar om het zelf te proberen?" | "Op naar aanwijzen!" | NOW |
| ROUND.CONTINUE | More queued tasks | "Zullen we verderrijden?" | "Nog een rondje?" | "Klaar voor de volgende zes?" | NOW |
| ROUND.RETURN | Back to learning journey | "Terug naar de route" | "Bekijk mijn reis" | "Volgende halte" | NOW |
| ROUND.DAY_GOAL | Daily correct count reached threshold | "Mooi! Je oefendoel voor vandaag is gehaald." | "Acht goede antwoorden geoefend. Doel gehaald!" | "Dagdoel binnen. Nog een ritje mag altijd." | NOW |
| ROUND.TOMORROW | No active daily progress reset due to calendar day | "Nieuwe dag, nieuwe kans om te oefenen." | "We beginnen vandaag met een fris dagdoel." | "Klaar voor een nieuw rondje?" | NOW |

### G. Chapter arrival, gold and collectible milestones
| ID | Trigger / channel | Variant A | Variant B | Variant C | Status |
|---|---|---|---|---|---|
| CHAPTER.FINISH | Actual three-stage completion | "Deze halte is afgerond!" | "{topic} heb je ontdekt, gevonden en geschreven." | "Tijd voor een nieuwe halte." | NOW |
| CHAPTER.NEXT | After a chapter completion | "Volgende thema: {nextTopic}." | "Nieuwe halte geopend: {nextTopic}." | "Ontdek wat er hierna komt." | NOW |
| CHAPTER.GOLD | True flawless gold earned | "Perfetto! Goud verdiend." | "Alle plekken goed. Deze halte blinkt!" | "Gouden halte! Dat heb je zelf gedaan." | NOW |
| CHAPTER.GOLD_REPLAY | Flawless replay, already rewarded | "Goud behouden. Nog steeds sterk!" | "Deze proef ging opnieuw foutloos." | "Keurig. Je gouden halte blijft staan." | NOW |
| CHAPTER.GOLD_MISSED | Gold not earned | "Nog niet foutloos. Dat kan later." | "We oefenen de lastige plekken nog eens." | "Volgende keer nieuwe kans op goud." | NOW |
| CHAPTER.ALL_DONE | All eleven stages complete | "Alle elf haltes ontdekt!" | "Je hebt de hele leerroute afgerond." | "De route is klaar. Je kennis blijft groeien." | NOW |
| CHAPTER.POSTCARD | New postcard actually granted | "Een nieuwe ansichtkaart voor je reisboek!" | "Kijk eens wat je hebt verzameld." | "Nieuw reisstempel verdiend." | NEXT |
| CHAPTER.CUSTOMIZATION | Cosmetic item actually unlocked | "Je kunt je Vespa nu aanpassen!" | "Nieuwe scooterkleur vrijgespeeld." | "Een nieuwe sticker voor je Vespa." | NEXT |

### H. Geography and contextual fact cards
| ID | When | Source-checked text | Status |
|---|---|---|---|
| FACT.SICILY | After learning/incorrect answer to Sicilië | "Sicilië ligt bij de punt van de Italiaanse laars." | NEXT |
| FACT.SARDINIA | After learning/incorrect answer to Sardinië | "Sardinië ligt ten westen van het Italiaanse vasteland." | NEXT |
| FACT.SANMARINO | After San Marino explanation | "San Marino is een zelfstandig land, volledig omringd door Italië." | NEXT |
| FACT.VATICAN | After Rome/Vatican explanation | "Vaticaanstad is een zelfstandig land binnen Rome." | NEXT |
| FACT.VESUVIUS | After Vesuvius answer | "De Vesuvius ligt ten oosten van Napels." | NEXT |
| FACT.ETNA | After Etna answer | "De Etna ligt op Sicilië." | NEXT |
| FACT.ADRIATIC | After Adriatische Zee answer | "De Adriatische Zee ligt aan de oostkant van Italië." | NEXT |
| FACT.PO | After Po answer | "De Po loopt door Noord-Italië naar de Adriatische Zee." | NEXT |
| FACT.SLOVENIA | After Slovenia answer | "Slovenië grenst aan het noordoosten van Italië." | NEXT |
| FACT.AUSTRIA | After Austria answer | "Oostenrijk grenst aan het noorden van Italië." | NEXT |
| FACT.FALLBACK | Missing checked source for an item | "Kijk nog even naar de gemarkeerde plek." | NEXT |

**Fact sourcing:** maps show some zones schematically. Geography facts must be matched to canonical item IDs, documented reference and stable source; don't use hard-coded screen positions as relative directions. Factual cards must not imply exact boundaries for schematic zones.

### I. Recovery, accessibility and product-state notices
These are mostly **product UI** text, not in-character dialogue. Nino can frame a calm sentence, but status and error messages must remain plain and direct.

| ID | Trigger | Approved text | Status |
|---|---|---|---|
| SYSTEM.BACKUP_EXPORT | Backup created | "Reservekopie opgeslagen. Bewaar dit bestand goed." | NOW |
| SYSTEM.BACKUP_IMPORT | Valid import completed | "Je voortgang is teruggezet." | NOW |
| SYSTEM.BACKUP_INVALID | Unsupported or malformed backup | "Deze reservekopie kan niet worden gebruikt. Je voortgang is niet veranderd." | NOW |
| SYSTEM.STORAGE_BLOCKED | localStorage disabled | "Opslaan lukt nu niet op dit apparaat. Oefenen kan wel; je voortgang blijft mogelijk niet bewaard." | NOW |
| SYSTEM.RESET_REWARDS | Pizza reset confirmation | "Alle pizza's en Vespa-ritten wissen? Je leerresultaten blijven staan." | NOW |
| SYSTEM.RESET_ROUTE | Route reset confirmation | "De leerroute opnieuw beginnen? Je verdiende beloningen blijven bewaard." | NOW |
| SYSTEM.RESET_ALL | Full reset confirmation | "Alle leerresultaten, pizza's en voortgang verwijderen? Dit kun je niet ongedaan maken." | NOW |
| SYSTEM.NO_MISTAKES | No saved mistakes | "Er staan nog geen fouten klaar om te oefenen." | NOW |
| SYSTEM.NO_DUE | No reviews currently due | "Geen opfrisvragen nodig op dit moment." | NOW |
| SYSTEM.OFFLINE | Standalone offline activity | "Je kunt offline oefenen. De voortgang staat op dit apparaat." | NOW |
| SYSTEM.DEVICE_TRANSFER | Open backup UI | "Wil je op een andere iPad oefenen? Neem een reservekopie mee." | NOW |
| SYSTEM.MAP_ABOUT | Provenance disclosure | "Over de kaart: bronnen, schematische gebieden en uitleg." | NEXT |

## 3. Decision tree for response

1. **Is this an independent school test?** Before grading: no hint, no Nino correctness commentary. Store and score neutrally. After test completion: feedback is allowed.
2. **Is the answer still ungraded?** Show only prompt or neutral picker; never factual target hint in Point/Write.
3. **Was the answer wrong / skipped?** Pick mode-compatible correction, then only a sourced fact/hint. If point chosen ID known, mention it accurately.
4. **Was answer correct?** Choose POINT/WRITE/REVIEW/IMPROVED by event and verified history; add pizza/trip line only if actual event.
5. **Did progress transition?** Round pause (6), chapter complete (3 stages), gold (full flawless) have mutually exclusive high-salience scenes. A card/passport reward never fires on replay if already owned.
6. **Are there multiple announcements?** Keep the single highest-priority message, with scores and next actions remaining visible as plain UI.

## 4. Production states and visual mapping

| Event families | Nino portrait | Motion | Core UI |
|---|---|---|---|
| ENTRY, CHAPTER.NEXT | welcome / arrival | optional subtle | hero / mini travel scene |
| DISCOVER | guide | no loop | map + guide text |
| PROMPT, regular ANSWER | tiny avatar or none | none | map / form + inline result |
| ANSWER wrong | encourage only at informative pauses | none | pair highlight + short clue when implemented |
| ROUND.PAUSE and ROUND.RESULT | success/guide | brief | 6-question summary |
| CHAPTER.GOLD | gold | one short animation; reduced-motion static | gold illustration |
| CHAPTER.POSTCARD | arrival + postcard | optional reveal | collectible view |
| SYSTEM | none | none | plain functional status |

## 5. Acceptance and QA cases

- For a round with 2 correct and 4 skipped, use mixed result **2/6**; no line stating full mastery.
- After six correct stage replay answers, daily goal can move from 6 to 12 while pizza token total stays unchanged; do **not** show pizza awarded.
- A score of 6/6 on one pause within a 14-task Gold challenge does **not** display Gold until all 14 are flawlessly completed.
- If the child selects Slovenië while seeking Oostenrijk, show chosen and correct names with the canonical shapes **after grading**; avoid claiming Slovenië is north of Italy.
- A cancelled neutral Rome/Vatican picker creates no grading event.
- Typo retry only works in assisted practice **once designed and tested**; school test stays independent.
- Italian words are intermittent; no fake streak/shame messages.
- All supported aliases and diacritics still score correctly; feedback always uses canonical display name.
- If no verified hint, show FACT.FALLBACK, not a generated geography assertion.
- Every string fits iPad portrait without hiding map or control; texts remain accessible and are not conveyed solely by images.
- Check rapid tapping, reload after answer, migration of schema-1 saves, local storage failures and screen reader status announcements.
- Keep standalone HTML fully functional offline; no runtime API is required to produce feedback.

## 6. Release boundaries

- **Release 1.1**: correct current inconsistent text, add copy registry for already supported NOW events in small batches, do not change grading.
- **Release 2**: assisted practice/school test split, typo retry and approved factual hints with verified references.
- **Release 3**: postcards/stickers only after the actual assets and unique-claim events are implemented.

This is a proposed content baseline; owner signs off on tone and priority. The app remains unchanged by this documentation branch.
