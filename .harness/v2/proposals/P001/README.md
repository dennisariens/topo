# P001 — refuse nonempty standalone review output

Status: PROPOSED; independent verification OPEN; owner approval OPEN. Separate branch only; NOT promoted into V2.
Observed defect: the baseline collector filters its inputs but standalone createPackage can retain an unrelated storage.json already present in an existing output folder. The actual V2 pilot uses a newly initialized supervised task folder and starts with no existing bundle; this proposal hardens direct library callers and future reuse.
Regression: seed a nonempty output with storage.json; require refusal before writing HTML and preservation of the preexisting file. red.log observes Missing expected exception against4f71f69; green.log verifies rejection plus the entire V2 unit suite.
Change: require output directory to be fresh/empty and nonsymlink. No cleanup or replacement of existing output; no app, V1, permissions, tests weakened. Does not promote itself or claim independent QA.
Next: Hermes reviews this exact branch commit and owner approves before any cherry-pick/merge or safety-policy promotion. No extra PR, merge, deployment or release created.
