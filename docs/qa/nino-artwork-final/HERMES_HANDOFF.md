# Hermes — single independent artwork QA handoff

Return **PASS / REWORK / BLOCKED**, with exact reviewed Git SHA, ZIP SHA-256 and
file/frame evidence. Inspect actual generated assets, not just the producer report.
The draft PR pins the final review commit; `package-manifest.json` pins the
producing implementation commit; `ZIP-SHA256.txt` binds the actual archive.

1. Check out the exact final PR head, verify ZIP SHA/CRC and all member hashes.
2. Review native `assets/nino/rewards/pizza/hinge-review` layers, all three closed
   poses, decoded 24-frame sequences and five real time proofs per flavor. Focus
   on the three prior P1s: zero closed pizza, cardboard-only shared foreground,
   correct flavor perimeter, seated footprint, stationary hinge and convincing
   flap/edge connection throughout opening. Check original Pisa orientation.
3. Review category contact sheets and actual exports: Venezia alpha/edge,
   small/large Gold, cover/two native folios, 11 icons, 11 stamps, ISOLE/ARRIVO,
   postcards/reverse and micro-v2. Check archived open-book exclusion and separate
   source/export/integration fields; do not turn source-only rows into delivery PASS.
4. Independently verify source hashes, image dimensions/alpha, all motion frames,
   timing/proof equivalence, no clipping/new halos and reproduction. Use light,
   dark, ivory and checker backgrounds. Tiled hidden cardboard is a declared
   reconstruction requiring owner acceptance, not recovered original illustration.
5. Open the actual supplied preview via file:// offline at desktop/iPad sizes,
   replay by keyboard, verify reduced motion shows static poses. Preserve PR29
   fallback and separate PR71 integration; do not implement a second solution.

Known external gates: original reviewed Venezia matte missing; owner folio native
resolution exception and final visual acceptance pending; physical iPad/Safari
not certified. Report these separately from actual technical defects.
No merge/deploy, issue closure, source overwrite or final-lock declaration.
