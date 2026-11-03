# Independent QA runtime checkpoint — NOT a final verdict

Tested snapshot: **2a9dda3d3d8ec567687bc3b61bf9cbde645c752c** (PR70).
Evidence-only worktree branch: `qa/hermes-nino-v2-closure-67`.
No application/artwork/exporter/production test changes. No merge/deployment.

## Executed independently

- Fresh npm ci under Node24.15.0; build/lint/all17 test programs/release and map preservation audits PASS. Raw `gates/independent-release-check.txt`.
- Maintained all45 current-question browser fixture harness PASS (installed Chrome156) in both themes; separate actual 45-row ledger and summary under `all45/`. This is not a natural all45 playthrough.
- Independently authored `browser-qa.mjs`: Chrome156 and Playwright WebKit27.2 PASS, seven cases per engine. Fresh offline file:// contexts only, no learner storage.
- 1500x1000 /800x900 /390x844 startup and breakpoint drafts; all three inline favicons decoded, decorative Nino alt/aria verified, no overflow or unearned Gold at startup.
- Actual invalid data-image decode invokes the existing original-Nino fallback without progress/storage change. Expected injected-resource console failures kept separate from clean-startup errors.
- Genuine first-stop Discover→Point→Write and Gold via actual UI/mouse/chooser/typing: first8 correct=1pizza,24correct=3pizzas=1trip. Nino Gold only after actual earned Gold. Actual exported pre-Gold backup restored to a fresh context; a completed mixed/wrong Gold run grants no Gold and shows encouragement, not medal art.
- Parsed persisted progress survives reload with only the documented canonical ordering of the reward-token set normalized; duplicate tokens are separately rejected. No other fields omitted.
- Final browser runs record zero unexpected console/page errors or external network requests.

## QA-driver corrections (not app fixes)

Retained failed attempt logs in `gates/*attempt*.txt`: initial guessed `#finishArt` selector did not exist (real summary artwork is inside dynamically created `#finishScreen`); raw reload equality needed canonical token ordering; diagnostic access needed an optional guard when no summary exists. A manual mouse helper initially omitted document-level scroll and tried a target at screen y=-2.08 after backup restore. Corrected by scrolling the actual SVG target into view before layout-settled coordinate calculation. No grading call, expected-answer replacement or app source patch was used for the natural first-stop flows. Genuine correct/wrong results are still asserted through the engine's normal UI.

## Not implied by these results

Passport/folio stamping, chapter pictures/ink stamps, collectible postcards and the two new Gold seal exports are NOT INTEGRATED. Their earning/display acceptance is NOT TESTED, not PASS from diagnostic sheets. Native Safari, OS favicon cache/selection, physical devices, IME and VoiceOver are not tested. PR61 retains its independent functional release gate.

Binary239-row reconciliation, historical approval scopes, source comparisons, original-size composites and final issue67 verdict remain separate workstreams; this checkpoint is not package closure or owner approval.
