# Independent trust/provenance review — REWORK (focused scope)

Reviewed read-only candidate `beeaef406dc5338a4b43e2403a7d9b0519d1adc7` in `/Users/dennisariens/projects/topo-harness-v2-independent-qa`.

Read task002 CONTRACT, V2 README, HERMES-HANDOFF, AGENTS, current PROJECT_STATE and DECISIONS context before source/probes. No full gate/npm executed; parent owns those. Candidate tracked worktree stayed clean.

## Reproduction

`probe.mjs` imports the pinned source read-only and invokes the real exported controller, receipt and handoff functions on self-contained fixture Git repositories. Synthetic PASS gate data and ephemeral fixture signatures exercise downstream guards only: they are NOT real QA, real gate execution or approval. Keys stay ephemeral in memory; only fixture public trust and signed fixture events are retained. Handoff remotes are local bare fixture repositories, not GitHub. All writes are below this directory.

```sh
PATH=/opt/homebrew/bin:$PATH TMPDIR=/Users/dennisariens/.hermes/cache/scratch node /Users/dennisariens/.hermes/cache/scratch/hermes-harness-v2-review/trust/probe.mjs
```

Executed with Git 2.53.0, Node v25.8.2. Exit 0, empty stderr. Raw outputs: `probe.stdout.txt`, `probe.stderr.txt`. Native OS Git was not used. Every fixture has an explicit TEST ONLY label.

## Reproduced defects

### 1. P1 — `run` preserves REVIEW_READY after new commits and changed HTML

Source: `scripts/harness/v2/controller.mjs:15,18-19,39`; `scripts/harness/v2/receipt.mjs:5,7`.

`run` calls recovery, then returns immediately for terminal states before executing `checkpoint`. After a successful fixture packaging transition, commit a changed implementation and overwrite the packaged HTML. Calling the actual `run(root,dir)` returns REVIEW_READY. The public receipt verifier also returns VALID against old persisted state, without checking current HEAD or bundle bytes.

Actual stdout:
```
RUN_AFTER_NEW_COMMIT_AND_CHANGED_HTML {"phase":"REVIEW_READY","headDiffers":true,"artifactDiffers":true,"publicVerifier":"VALID"}
```

This contradicts CONTRACT:19 and README:23 (every commit invalidates QA), and README:47 (REVIEW_READY requires authenticated exact-head QA and unchanged package bytes). This is not a forged signature: an ordinary subsequent implementation commit and edited package become invisible to the terminal `run` path. `verifyReceipt` is correctly verifying its supplied historical message cryptographically; the unsupported aspect is treating that as live candidate validity without a HEAD/bundle checkpoint. Fix by revalidating current head/contract/bundle before returning terminal readiness, and distinguish historical signature validity from current candidate validity in the CLI.

### 2. P1 — unlisted data can be added after signing and still packaged REVIEW_READY

Source: `scripts/harness/v2/controller.mjs:31`; compare `package.mjs:2-4`, README:13,47 and CONTRACT:13.

After fixture signing of an unchanged, valid manifest, add `browser-backup.json` to the already-created bundle. Finalization verifies only manifest-listed files and never inventories actual contents. It marks the package REVIEW_READY while preserving the unreviewed file and `learnerDataIncluded:false`.

Actual stdout:
```
UNLISTED_EXTRA_AFTER_FIXTURE_SIGNATURE {"phase":"REVIEW_READY","extraExists":true,"manifestListsExtra":false}
```

This is NOT the explicitly deferred P001 issue of standalone `createPackage` accepting an initially nonempty directory. The controller created/owned bundle is mutated AFTER the signed manifest, and its final verification misses the extra. A bundle shared as a directory/archive can therefore contain unreviewed backup/storage bytes despite the strict allowlist claim. Initial allowlisting is insufficient; re-enumerate the bundle with exact allowlisted set comparison at finalization.

### 3. P2 — final verification accepts symlinks; schema/path constraints are absent

Source: `controller.mjs:31`, contrasting `package.mjs:3`.

Replace a signed listed log with a symlink to identical fixture bytes outside the bundle: finalization follows the symlink and reaches REVIEW_READY. This can create a non-self-contained package and leaves the external referent mutable. No OS escape or write outside the fixture is claimed.

```
SYMLINK_AFTER_FIXTURE_SIGNATURE {"phase":"REVIEW_READY","targetOutsideBundle":true}
```

Separate, weaker schema test: a reviewer-signed fixture manifest listing only `../outside-fixture.txt` (no HTML) reaches REVIEW_READY; the verifier reads outside the bundle and trusts top-level artifactSha256 without checking an HTML entry. This requires the fixture reviewer to sign the malformed manifest, so it is NOT a signature bypass or silent replacement of a valid signed manifest. It demonstrates missing structural validation and unsupported blanket bundle verification, not an unauthenticated exploit.

```
FIXTURE_REVIEWER_SIGNED_TRAVERSAL_AND_OMITTED_HTML {"phase":"REVIEW_READY","manifestFiles":[{"path":"../outside-fixture.txt","sha256":"5986023d67673a3150a822289f91b6af26ac8b79703e82abd502e42c613a372b"}]}
```

Validate paths, mandatory HTML mapping, unique file names, strict names/schema/size, actual regular-file types, parent-component symlinks and exact inventory before finalization.

### 4. P3 — advertised Ed25519-only constraint is not enforced

Source: `machine.mjs:8-9`; README:33-35.

A trusted RSA-2048 fixture key and its fixture signature pass `verifyQa` unchanged:
```
RSA_NOT_ED25519 {"accepted":true}
```

`crypto.verify(null,...)` does not constrain the key to Ed25519. This requires external trust provisioning of that RSA key; it is NOT an ability to substitute an untrusted signer. Validate `createPublicKey(...).asymmetricKeyType === 'ed25519'` or explicitly document algorithm-agile trust.

## Handoff provenance — reproduced behavior, qualified rather than a hard identity bypass

Source: `handoff.mjs:8-9,12-16`; `scope.mjs:12-13,24`.

The receiver accepts after a pushed metadata-only deletion of the summary whose digest is in the sender's controller record:
```
HANDOFF_ACCEPTS_DELETED_REFERENCED_EVIDENCE {"kind":"accept","evidenceExists":false,"referencedGateHash":"84aeb3ad2b67e4b00283e89c23de77f069a7d03d18f394c894b6a09c5627aa4a"}
```

`requireCommittedGate` runs at emission only. Acceptance permits metadata evidence changes/deletions and checks only branch, metadata delta, implementation digest and contract. HOWEVER the original summary remains recoverable from Git at the recorded `headSha`: this is historical durable proof, not vanished evidence or a hash-chain compromise. A current-checkout durability/unchanged-evidence claim would be unsupported, but the documented metadata-only acceptance rule does permit this. Treat as a provenance clarification/hardening opportunity unless owner requires current evidence retention. Recheck controller.gateHash on accept if that is the intended policy, or explicitly direct the receiver to the historical blob.

A committed old gate can likewise accompany a later unverified implementation, and emission/acceptance succeeds:
```
HANDOFF_ACCEPTS_STALE_GATE_IMPLEMENTATION {"kind":"accept","gateSource":"54380d7591205a9881f4bfa895cdd1f27f8ef534","handoffSource":"aba0e20c9236ae516f80b87fe6cdd7d0816e6898","implementationChangedSinceGate":true}
```

The sourceSha mismatch remains visible in the record, and a handoff is NOT QA acceptance; no claim is made that this transfers independent approval. Current code proves only durable committed historical gate bytes, not that they verify the handed-off implementation. An external reviewer must actually execute the required fresh gate, as HERMES-HANDOFF instructs. If controller provenance is meant to assert current verification, bind its gate implementationDigest and source ancestry/metadata-only delta at emit.

Fake origin acceptance is intentional fixture behavior, not a GitHub authentication vulnerability: `ls-remote origin` checks configured origin, and trusted remote provisioning is the external controller's responsibility. From/to/as strings and hash-chained records are not authenticated agent identities, consistent with the explicit contract trusted-operator limit.

## Controls that passed

Real fixture Ed25519 receipt with a different trusted public key: rejected. Forged signature: rejected. Changed taskId/sourceSha/artifactSha256/manifestSha256/reviewer/role: rejected. Listed package bytes changed after signing: rejected with `Package bytes changed`. Dirty working tree: rejected. Local-only unpushed commit: rejected. Missing committed gate hash: rejected. No signature/bundle/source replay was found through the guarded nonterminal PACKAGE path.

The historical terminal-state invalidation failure above is distinct from these working cryptographic/nonterminal checks.

## Boundaries

No production code changes, real receipt, real key, real remote acceptance, task edits, commits/pushes in the candidate, application/art/V1 changes, messages, npm or full gate. Only evidence/repro and fixture child repositories created under this `trust/` directory. P001 standalone nonempty-output behavior is explicitly excluded. Local operator replacement of the runner, externally configured trust identities and origin authenticity are documented external trust duties, not reported as exploits.
