# Independent provenance / historical-scope review — issue67 / PR70

**Exact candidate:** `2a9dda3d3d8ec567687bc3b61bf9cbde645c752c`.
**Verdict: PASS source/runtime preservation; CONDITIONAL asset-closeout readiness; NOT integrated passport acceptance or release approval.**

Scope: independent Git/source comparison and historical approval reconciliation. No build, npm tests, browser run, binary/image measurement, exports, implementation, commit or external write. Browser and binary review are separate reviewers' gates. Reproduce source checks: `python3 docs/qa/nino-v2-hermes-67/provenance/compare-provenance.py`.

## Verified source / runtime preservation

- `comparison.json` independently compares immutable Git objects, not moving main or exporter HTML-preservation prose. All five changed HTML files are byte-identical to one another; remove exactly one added micro-icon block and each equals its PR61 version (`1bf86b3e1c69319bed8ef877243070a64d97a12e`) byte-for-byte. Candidate HTML is 3,156,792 bytes, SHA256 `3203f1b4cd9b72b60ed5301fdeafc9fd59988d1b12fb75ce22902b130b50b635`.
- Thus embedded geometry, 45 IDs/11 chapters, engines, save/progress/reward/UI logic and existing imagery are unchanged. Separate protected source/print/dependency/test blobs also compare exact; full list in machine evidence. This proves preservation, not new functional correctness or PR61 independent acceptance.
- Build change is one added micro-icon embedding step after Focus assembly, before packaging. Builder validates local manifest hashes and writes ICO +16px +32px data URIs; it does not introduce reward/geometry behavior. Build manifest is not itself an immutable trust anchor: the historical adapter independently hardcodes the three pinned icon SHA256s.
- Historical audit diff retains existing assertions: release audit changes only evidence destination; map audit adds exact favicon normalization and renames the truthful result field. `withoutFocus` additionally removes only the validated exact block. Executed negative probes reject script insertion and altered favicon href bytes inside it. Duplicate exact blocks and arbitrary outside edits remain in normalized text and therefore fail downstream full-source equality, rather than disappear through broad marker stripping. No new arbitrary-content exception or removed teaching/reward assertion found.

## Pinned lineage reconciliation

Current read-only GitHub snapshots match every recorded PR61/63/65/66 head in `pr-snapshot.json`; PR70 head/base are candidate/PR61 respectively. See `github-pr-snapshot.json` and `github-issue67.json`.

- PR61 `1bf86b3e1c69319bed8ef877243070a64d97a12e`: current implementation lineage, not the stale art-branch app. Its independent functional and owner/Safari gates remain separate.
- Art intake `8a704cb23da97baf7197635df7fa12f06b864a24`, reviewed by Hermes at `9e58e756f124ff37d47b4ebcfd274684125d8aeb`: **conditional production artwork acceptance**, not blanket runtime approval. Exact historical README, Gold/folio verdicts, postcard report and parent-ink conditions are copied beside this report for immutable comparison.
- PR63 head `92893ae91a177e4272807d662e2b101ff934017d`, base `bf91fb3fa6ac553f78b33169efa9f2bf60e215ca`: real hinge README explicitly REWORK / DO NOT INTEGRATE, missing registered layers and uncommitted storyboard/frames; static Pisa source remains valid. Head object absent locally, so exact README retrieved read-only via GitHub Contents API (saved `pr63-hinge-README.md`), not guessed from PR prose or fetched into a branch.
- PR65 `5cfcbc37eb6b0266d76d2c05404d993908611410`: actual approved micro binaries, formerly art-only. Candidate really adds their inline HTML links; OS favicon selection/cache, native Safari and owner tiny-size approval are still separate.
- PR66 `cec9fd26ac858bdbcbdf03b5ee6b0ea246e3e02f`: approved original scalloped art direction plus contour/export recipe, not the original reviewed raster matte. Candidate copies recipe/source; authorized reconstruction is not owner-raster identity. Optional oversized Rialto composition feedback is not a required redesign.

### Independent PR66 reference search (not just exporter assertion)

Checked PR66 body, all returned issue comments, reviews, inline review comments and complete non-truncated pinned GitHub tree. **Comments=[], reviews=[], inline comments=[]; no attachment/image/ZIP URL is supplied.** Relevant pinned tree paths are original master PNG, approved-contour SVG and generator; no ZIP or owner-reviewed alpha export identified. Checked the pinned exports README too: it refers to an unspecified original locally delivered ZIP but gives no location/filename/URL. Exact checked handles, API endpoints, paths and source response are in `pr66-reference-search.json` / `pr66-exports-README.md`.

Therefore original matte is **not retrievable from these inspected PR66/Git handles**, not proven nonexistent everywhere. No retrievable reference image found to hand to parent. Candidate-vs-contour-recipe reproducibility can be accepted independently; comparison/identity to original owner-rendered raster remains BLOCKED until its exact file/URL is supplied or owner explicitly accepts reconstruction. The historical 0.1264% alpha-deviation claim is upstream measurement, not independently reproduced here.

## Category release ledger (source / delivery / real use are different)

| Category | Independent classification / remaining requirement |
|---|---|
| Six existing runtime poses | READY for preserved current-use scope, subject to separate candidate/browser gate; extra reflect/travel/source poses are not activated. |
| 11 chapter icons | Approved pinned source exports exist; candidate chapter mapping remains unpopulated. INTEGRATION PENDING, not 11 runtime chapter images. |
| 11 ink stamps / corrected ISOLE | Approved sources; exports delivered per ledger, binary parity assessed separately. INTEGRATION PENDING. Only corrected ISOLE is eligible, decorative warm-paper chapter stamp, never assessed map geometry; live labels at64/96, >=160 detail. Old wrong stamp05 stays excluded. |
| ARRIVO | Approved warm-paper source; delivery derivative is not actual trip UI. INTEGRATION PENDING, >=160 detail/240 preferred, live destination and recorded dates only; Rome departure is not earned arrival. |
| Chapter / final Gold | Two distinct source artworks PASS within warm-paper scopes; derivatives need independent binary/visual acceptance. INTEGRATION PENDING. Chapter >=48CSS/prefer64, live chapter label; final compact160 with live title, main >=240/prefer320. Do not turn master PASS into award or runtime approval. |
| Blank folios | Genuine reusable left/right normalized WebP rendering inputs, not original-alpha PNGs or fixed painted content pages. INTEGRATION PENDING plus owner resolution exception: native1086×1448 fails1536×2048 spec, <=543CSS/page atDPR2. Shared scale/full contain/orientation; no mirroring/stretch/crop to hide8/3px asymmetry. “Blank” means no earned/user overlay, not art-free paper: baked scenic/postmark decoration is not travel history. |
| Three original fronts + universal reverse | Source/design PASS only on cream/warm holder; delivery exports do not create postcards/ownership. INTEGRATION PENDING. >=240×160 preview +live caption, >=480wide detail, contain and real front/back state. Reverse's lines/empty stamp box are decorative; no fabricated author/message/date/visit. |
| Venezia B | Technical reconstruction delivered, exact owner rendering EXPORT/REFERENCE PENDING; INTEGRATION PENDING independently. Parent binary/edge/native composite review and owner reconstructed-edge decision remain. Do not substitute the old rectangular diagnostic (scallops lost) for approved B. |
| Micro-v2 | READY for actual inline favicon delivery/use, not OS installation/device approval.24/48/64 references are not asserted install targets; existing large icon preserved. |
| Static Pisa boxes | READY **asset fallback only**; candidate still uses existing pizza wedges. Not an integrated Pisa box reward screen. If issue67 requires an in-app box presentation, bounded follow-up integration/owner scope decision remains. Raw asset screenshot is insufficient. |
| Hinge, ornament, fixed-page concepts, optional stories | OPTIONAL DEFERRED / excluded. No required redesign, phantom blocker, additional chapter or reward. Hinge REWORK and ornament REWORK remain real but nonessential. |

## Gold earning / absent passport: honest boundaries

Existing Gold **earning exists**: `scripts/route-engine.js:159–164` restricts Gold to completed stage3; `:216–229` advances only after queue completion and requires zero wrong answers, sets first `goldAt` once and `goldEarned` only on first acquisition. `index.html:1048,1081,1088` counts real chapter Gold and offers actual Gold trials; preserve this rather than claiming Gold is absent because seal artwork is not displayed. This source review does not replace real interaction acceptance.

There is **no five-spread/10-page earned art-passport**, chapter-seal/final-seal mapping, or postcard ownership implementation. Existing `Mijn kennis-paspoort` (`index.html:1284`) is a mastery details/grid, not that art-book. Normal chapter stamps must later derive exact canonical `stage===3`; Chapter Gold exact chapter `goldAt>0`; final seal all11 canonical positives, never a new boolean, stage count, arbitrary progress total or repeated chapter image. ARRIVO follows actual trip events, not counters fabricated for a screenshot. Exporter browser script exercises pizza/trip/reload, not Gold earning or blank-book interaction; native Gold/folio boards are diagnostics, not earned UI evidence.

## Concrete defects / owner decisions

1. **Machine-ledger misclassification (medium):** `assets/nino/travel-passport/book/masters/passport-open-book.png` is `status: READY` despite preserved historical `qa: REWORK` / `ARCHIVAL REFERENCE` and note “Not a blank runtime base: old baked postmark/content.” Generator applies generic masters→READY (`scripts/inventory-nino-artwork-67.py:68–76`), overlooking this retired base. Should be OPTIONAL DEFERRED / archival excluded, not a ready folio. It is not delivered/integrated, so no current runtime regression. Exact conflicting row is captured in `comparison.json`.
2. **Status aggregation ambiguity (low):** 239 rows classify53 READY /72 INTEGRATION PENDING /83 EXPORT PENDING /31 OPTIONAL DEFERRED;41 READY and28 INTEGRATION PENDING rows are source-only, absent from delivery. README's explicit caveat saves source availability claims, but these are not release-ready counts. Some generic dependencies even label the old1586×992 book as1086×1448. Use exact row dimensions/approval scope and delivered/integrated fields, not status totals, for release decisions.
3. **Owner gates:** bounded folio resolution exception and reconstruction-edge acceptance/reference supply remain unresolved. Original-rendering comparison is blocked by checked reference availability, not grounds to regenerate approved painting. Native Safari/physical device/accessibility/owner final visual acceptance remain separate. PR61 independent gate remains intact.
4. **Scope gate:** issue67 asks relevant reward/passport real-browser captures. Current art delivery cannot fulfill nonexistent passport/box views; honest absence is correct, but absent implementation is not a passed integration gate. Owner must accept asset-only closeout or authorize separate integration; do not silently relabel it OPTIONAL DEFERRED as with hinge/stories.

Evidence-only writes are confined to this provenance directory. No tracked source/test/app changes, export, commit, branch move, merge, release, deployment or GitHub mutation.
