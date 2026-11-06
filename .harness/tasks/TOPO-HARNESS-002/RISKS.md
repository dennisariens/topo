# V2 risk assessment

| Risk | Control / evidence | Residual boundary |
|---|---|---|
| V2 weakens pending V1 gate | Freeze V1 code/policy/tests; run exact V1 gate in checkout; additive V2 scope and negative tests | New CI dispatcher is a review proposal, not promoted policy |
| Instructions mistaken for external automation | Executable bounded local CLI, explicit external supervisor protocol | No durable service/schedule installed; auth/provider availability not presumed |
| Independent QA fabricated | Exact SHA/hash/reviewer guards; real pilot blocks without trusted reply | Local files cannot prove remote reviewer identity without authenticated controller |
| Crash/resume repeats actions | Atomic events/snapshot, lock, in-flight recovery tests | Host/disk failure still needs operator recovery; no OS sandbox |
| Brain promotes stale claims | Typed allowlisted events, source hashes and status taxonomy; provenance tests | Source decisions can require owner interpretation, never auto-resolved |
| Personal learner data/credentials ingested | No learner storage/backup/event-body inputs; field allowlists; package excludes saves | Trusted operator must avoid introducing secrets in approved source docs |
| Skill pretended used / historical PR64 rules applied blindly | Access/read hashes/action evidence; explicit current-mission overlay | Read receipt cannot prove cognitive adherence; reviewer assesses actual work |
| Self-improvement bypasses safeguards | Proposals only; separate branch and regression evidence; independent+owner promotion gates | No arbitrary code auto-application; operator remains trusted |
| Retry/cost claims inaccurate | Persist normalized failures, fixed caps, measurable timings; unknown costs null | External provider costs unavailable unless measured adapter supplies receipts |
| Package released too early | Provisional QA bundle labeled; REVIEW_READY guarded; no deploy/merge/release actions | Owner approval remains outside automatic transition |
