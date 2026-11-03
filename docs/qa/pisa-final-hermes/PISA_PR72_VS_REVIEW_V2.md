# PR72 versus supplied Review v2 — actual comparison

Both inputs were inspected separately. Earlier missing-v2 status was superseded when the user supplied the ZIP. No candidate's approval is inferred from the other.

| Field | PR72 CI candidate | Supplied Review v2 |
|---|---|---|
| Git source | `8414319186c834cad091231d6c9beed6068b5876` | No exact producing commit or generator supplied in ZIP |
| File | `NINO_PISA_SOURCE_PRESERVING_QA.zip` | `NINO_PISA_FINAL_ARTWORK_REVIEW_v2.zip` |
| SHA-256 | `d87c9d50f2a29b16d4d42ab24d73020478b5a0dff4e2edd17010347b6f58df82` | `b314beb412d9eb5fb4cd33cb1b3fe297343121869f1cfd16659887cc3b78442d` |
| ZIP bytes | Actual downloaded pinned artifact |20,357,014 |
| Package files |30 |32;31 declared manifest entries all verified, manifest itself additionally inventoried |
| Images mapped between packages |28 |0/28 byte-identical;5/28 fully decoded-identical;23/28 decoded-different |
| Decoded-identical components | Comparison anchor |Exterior UV, all3 pizza PNGs, common front-rim PNG (renamed in v2) |
| Actual motion |24frames ×54ms =1296ms/flavor, loop1 |Same actual frame count/durations/loop, but new encoded and decoded motion pixels |
| Actual time quartiles |Frames0/6/12/18/23 |Frames0/6/12/18/23; starts0/324/648/972/1242ms |
| Hidden kraft disclosure |Claims genuine-source-pixel derivation, while available generator uses seeded noise/gradients/lines |QA notes now explicitly acknowledge reconstructed derivatives; tray and underside pixels changed |
| Closed-lid/foreground gate |REWORK |REWORK independently confirmed; same contaminated rim survives unchanged |
| Reduced motion |Raw WebP continues animating under OS preference; no consumer in package |Actual supplied review.html chooses static70° proofs and suppresses visible animation; PASS for review page only |
| Documentation |70° in manifest/code |README still says105°; manifest/proofs/QA notes say70° — correct stale text |
| Reproducibility |Pinned exporter executed successfully in an isolated fresh build |0/28 byte matches and4/28 full decoded matches to the tested local rebuild. Exact v2 reproduction from supplied source not established; no code included. Cross-platform codec/numeric variation alone does not prove redesign. |

## Independent inspection scope

Actual v2 ZIP CRC passed and extracted safely after path/symlink/size validation. All declared31 file byte counts and SHA-256s match. Actual all-frame decoder results, alpha boundaries, mapped per-file comparisons and SHA inventory are in `v2/v2-audit.json`, `v2/V2-SHA256SUMS.txt`, and `v2/v2-source-and-rebuild.json`.

PR72 exact source generator ran unchanged in a new isolated scratch build. Fresh source-tree comparison verifies all79 current approved PNG/WebP files are identical to the approved base `bf91fb3fa6ac553f78b33169efa9f2bf60e215ca` and PR29 `dcc474e8a9d1bc97559a3207b0a330423e128558`. All4 v2-declared source hashes match those actual sources. This verifies preserved originals, not final rig geometry or exact derivation of every v2 hidden face.

**Neither input is FINAL/LOCKED.** V2 is no longer missing; its physical closed-lid and flavor-occlusion defects are independently reproduced. Producer must provide corrected registered faces/masks and exact producing revision, then regenerate all flavors for re-review. No new illustration/design concept requested; no integration handoff is authorized by these findings.
