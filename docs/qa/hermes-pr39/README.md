# Hermes independent QA — PR #39

## Verdict: PASS (scoped code QA; physical device acceptance pending)

**Tested candidate:** `fc8f5be4dc77c8b1adb71aae3931a1c134389cf5`.
**Compared baseline:** PR #30 `f67027d42202d1bd2a78f1d82dd02aa7fba41a91`.

A separate checkout and fresh, offline Chromium 156.0.8078.4 contexts were used. This is independently authored and executed Hermes evidence, not a restatement of Codex's browser results. No candidate implementation changes, PR #30 modifications, merges or deployments.

## Findings

No blocking finding in the bounded semantic-selection fix.

- An independent whole-app comparison restored only the exact replaced legacy block and found every other index byte identical. Both generated HTML builds equal canonical index. Engines, Discovery materials/terrain, Schoolblad, dependency lock, print/PDF, all geography and original art are preserved. Hashes: [independent-source.json](independent-source.json).
- Candidate selection uses coordinates plus static feature class, never requested ID. Tuscany and Po Plain share a class; wrong region and wrong river taps actually fail with no reward. Picker identities remain stable despite shuffled display indices. The second read-only source/geometry reviewer found no concrete release blocker; their unsuccessful Node invocation/approval-blocked assertion is **not** counted as executed test evidence. The parent independently installed the locked dependencies and executed the complete chain.
- **16** viewport/style/zoom combinations, **160** explicit physical touchscreen taps: **128 correct / 32 deliberately wrong**, each starting from an unanswered real UI question. No forced grading result or current-question replacement was used for this matrix. Three Tuscany interiors; Po Plain over/away from Po; Po itself; wrong Tuscany-for-plain and wrong Po-for-Adige. Desktop 1440×1000, iPad 1180×820 / 820×1180 and phone 390×844; both paints, 100%/200%, actual zoom controls and pan.
- **27** original point anchors physically tapped, including San Marino, both volcanoes and Rome/Vatican. **17** ambiguous anchor cases: correct option first in **8**, non-first in **9**. Separate 24-opening native-crypto Rome test: correct first **13**, second **11**; choosing first was rejected in those **11** wrong cases without reward. No test override of crypto/order. Both first/second correct Vatican positions were additionally observed; wrong-first Vatican choice was rejected. Order remained stable while each popup was open.
- **Two complete real region-stop flows**, one per iPad orientation: Discover → intentional wrong region → reload/resume saved answered state → Next → spaced repair → stage completion → Write → Gold → full Gold replay. Only predecessor stops were pre-unlocked in normalized disposable fixtures; the tested region stop started at stage zero and all its completion/answers came through UI controls and actual taps/typing. After point repair: 2 eligible answers / 2 slices, one wrong. After writing: 4 / 4. After first Gold: 8 correct / 1 pizza / 0 slices. Gold replay preserved counters, tokens and gold timestamp. Repeated physical taps after grading granted nothing.
- Six independent formal-Test cases cover region/river selection in both paints; no pre-answer map names, atmospheric terrain hidden. Gold quietness checked during real route tasks. Both actual standalone HTML downloads work offline in both paints at 200%, with real Tuscany/plain/river grading.
- Learn selection changes no reward; Schoolblad open/Escape preserves task/progress. Six lake paths remain pointer-inert. Actual overlapping seas use **Gebied**, not **Stip**; wrong area choice and hidden inland sea fill are rejected. Eight additional river-offset probes agree with original SVG-rendered hit geometry across both paints/zooms.
- A separate fresh session made **24 actual correct retrievals with no reward counters preloaded**: retrieval 8 produced `[good=8,pizzas=1,slices=0,trips=0]`; retrieval 24 produced `[24,3,0,1]`. Duplicate taps did not increment counters.
- Zero page errors and zero external runtime requests in the final independent runs.

## Independently executed commands

Node 24.15.0, in the pristine candidate checkout:

```sh
npm ci
npm run lint
npm test                   # complete 16-program chain
npm run build
npm run audit:release-1-2
```

Own browser runner, not `scripts/qa-map-hit.mjs`:

```sh
ONLY=matrix QA_DIR=./final-matrix/ node independent-browser.mjs
ONLY=routes QA_DIR=./final-routes/ node independent-browser.mjs
ONLY=extra QA_DIR=./final-extra/ node independent-browser.mjs
node complement.mjs        # formal tests, Learn/Schoolblad/lakes, real 8/24 rewards
node edges.mjs             # Vatican positions and original river-renderer parity
```

The committed QA scripts retain the tested local checkout and external Playwright module paths at their top; adjust those constants for another machine. They do not require application dependencies to change and do not import Codex's browser harness. The app was served directly through `file://` in offline contexts. [Own full suite output](suite.txt); [aggregated results](final-summary.json); raw [matrix](final-matrix/results.json), [routes](final-routes/results.json), [anchors/order/offline](final-extra/results.json), [formal/rewards](evidence/complement.json), [Vatican/river probes](evidence/edges.json).

## Screenshots from the independently exercised app

- [Landscape wrong-region feedback](final-routes/ipad-landscape-wrong-region.png)
- [Landscape actual repair-stage completion](final-routes/ipad-landscape-actual-repair-complete.png)
- [Portrait actual repair-stage completion](final-routes/ipad-portrait-actual-repair-complete.png)
- [Actual Gold / first pizza](final-routes/ipad-landscape-real-gold-pizza.png)
- [Sea ambiguity: area wording](final-extra/sea-ambiguity-not-dot.png)
- [Vatican keyboard choice](final-extra/vatican-neutral-keyboard-correct.png)
- [Quiet formal Test](evidence/independent-formal-test.png)
- [Real 24th retrieval / third pizza / first trip](evidence/actual-24-retrieval-reward.png)
- [Offline interactive export](final-extra/offline-topo-italie-interactief.html.png)
- [Offline route export](final-extra/offline-topo-italie-duolingo.html.png)

## Investigation notes (not hidden product failures)

The initial harness over-constrained native dialog focus: Chromium visits its browser/BODY focus boundary between last and first modal buttons. An immutable-baseline comparison produced the **identical** sequence on PR #30 and the candidate, with no focusable background control reached. Escape and choice activation were then exercised. Physical VoiceOver remains untested. Raw comparison: `evidence/native-focus-baseline.json`.

The first deliberately coarse sea-grid sample lay within a fraction of a CSS pixel of a coast. Touch-generated click coordinates can round across a strict land/fill edge. Final overlap probes used genuine shared interiors with geometric clearance rather than interpreting an idealized fractional point as the physical event. Final matrix traces also record physical event coordinates. River SVG miter joins can extend beyond a naive Euclidean 22px centerline tube; offset tests compare the actual unchanged SVG renderer, not that incorrect alternative oracle. These were harness/oracle refinements, not changes to the candidate or excuses for failing the original reported interior taps.

## Owner physical Safari procedure — approximately 4 minutes, pending

Use a disposable Safari test session/save with Streken unlocked; do not overwrite a learner's progress. Record candidate SHA and iPadOS/Safari version.

1. On the Mac, serve this exact candidate checkout locally (not production):
   `python3 -m http.server 8039 --bind 0.0.0.0 --directory /Users/dennisariens/projects/topo-pr39-independent-qa`.
   On the same Wi-Fi open `http://<Mac-LAN-IP>:8039/` on the physical iPad. Confirm this checkout's canonical HTML is still the tested SHA's bytes.
2. **Streken → Aanwijzen:** answer Tuscany at two separate interiors (one near Florence), and Po Plain on/away from Po. Expect correct region feedback without a dot popup. Deliberately tap the other region once: wrong, no slice; Next works; later repair permits actual completion.
3. **Rivieren → Aanwijzen:** Po on its actual line is correct; Po as an Adige answer is wrong. Rome/Vatican: use the numbered geography, not always option 1; check a deliberately wrong choice and San Marino.
4. Switch School/Discovery mid-question, zoom 100/200%, pan and rotate. Expected: same active task and geographic correctness. Open/close Schoolblad. Check chooser controls remain visible/reachable under Safari chrome and on-screen keyboard. If checking VoiceOver, record actual focus/announcements separately rather than assuming Chromium keyboard results establish it.

**Pending:** physical iPad Safari/touch/VoiceOver/on-screen-keyboard acceptance and the learner's actual deployed build identification. #37 Apennines geometry, #38 full 45-target integrity ledger, #33 Focus Mode and PR #29 pizza integration are separate work and are not declared complete here. PASS is for this exact scoped hotfix, not merge/deployment permission or global release acceptance.
