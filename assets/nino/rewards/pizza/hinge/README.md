# Pisa hinged-lid animation — owner art direction + bounded QA candidate

**30 October 2026 · NO PRODUCTION ACCEPTANCE**

The owner likes the new seven-state Pisa storyboard and approves its **art direction**. It is not a registered, physically correct animation. The new storyboard is an opaque RGB design sheet in the ChatGPT conversation; **it has NOT been uploaded as a binary to this Git branch**. Do not claim it exists here or as transparent per-layer PNGs.

## Reused original art (unchanged)

Canonical source branch: `art/nino-pizza-rewards-20261024` (the base of this branch). Preserve original masters and these approved runtime exports:

| Source export | SHA256 |
|---|---|
| `assets/nino/rewards/pizza/exports/pizza-box-closed-pisa.webp` | `6e47559c8eea4932fa4516fea324ee85fbe386ab7c3df26034f820a8c4860d3c` |
| `.../pizza-box-open-pisa-margherita.webp` | `742a5d39843dc84b6a8b781678edcb3ce6643a60bde1c8ae67c1e0567125f7d7` |
| `.../pizza-box-open-pisa-salami.webp` | `9f3795b47f6b60a975f3f83af6edb07981739cc2a55c0d4de1b7cb66f2b184aa` |
| `.../pizza-box-open-pisa-quattro-formaggi.webp` | `1b317d38980873756276ffaedeca3843a30c386233e83ecf846a1563f99903b2` |

The same original approved pizza art and print (Leaning Tower, olive/cypress, warm kraft and BUON APPETITO!) must be retained; do **not** regenerate a different pizza or Pisa branding.

## Attempted technique and actual finding

`scripts/build_pisa_hinge_qa.py` creates **33 1024×1024 transparent candidate frames** (11 stops × three flavors) from those source exports using a fixed tray mask, one rectified lid print and a consistently anchored planar perspective warp.

The author generated and inspected real samples. The result is **NOT** production quality:

- Lettering on the printed lid reverses orientation in parts of the opening.
- Pizza becomes visible beneath the lid prematurely; the closed front no longer properly occludes the contents.
- Missing real lid underside, thickness and rear hinge flap; the original open/closed art was independently painted with differing perspective.
- Correctly registered physical rotation cannot be proven from a single flattened storyboard or a guessed 2D mask.

**Therefore do not commit these computed frames to any production allowlist.** A mathematical frame sequence is not evidence of a coherent physical cardboard hinge. All original closed/open static reward screens remain the safe fallback.

The three flavor QA ZIPs plus a five-stage checkerboard contact sheet were generated in the owner conversation as review artifacts, **not** automatically uploaded to the repository; there is no permanent Git link for them.

### How to reproduce or inspect

From a checkout with those approved runtime exports already present:

```bash
python3 -m pip install pillow numpy opencv-python
python3 scripts/build_pisa_hinge_qa.py
```

Build-only Python requirements are **not** app/runtime dependencies. Outputs live under `out/qa/pisa-hinge-20261030/`; do not include them in a production release.

## What a real completed animation must supply

Issue [#31](https://github.com/dennisariens/topo/issues/31) remains OPEN. A genuine final artifact requires:

1. One camera, one canonical exact-size canvas; stationary kraft tray and front occlusion mask.
2. A fully registered exterior printed lid and **kraft interior underside** (same rear hinge and thickness), both with correct 3D orientation through rotation; no physically impossible mirrored artwork.
3. 3 matched approved pizza interiors positioned on the tray; no regenerated flavors.
4. Real rear-hinge endpoints, visible flap thickness, 0/25/50/75/100% proof frames, edge alpha tests on warm/dark/checker.
5. Source+derivative manifest, hashes/native pixel sizes, independent Hermes visual QA, then a narrow Codex PR implementing 1–1.5-second opening; prefers-reduced-motion static fallback.

Do **not** fake a hinge by crossfading the complete closed and open photographs. Do not disable the existing fully functional pizza rewards while fixing this optional visual effect.

### Acceptance status

| Component | Verdict |
|---|---|
| Existing Pisa branding | **PASS / PRESERVE** |
| Seven-state moodboard | **VISUAL REFERENCE ONLY** |
| Generated registered projection source | **REPRODUCIBLE QA CANDIDATE** |
| 33 frames | **REWORK / DO NOT INTEGRATE** |
| Genuine hinge animation | **BLOCKED — REGISTERED SOURCE LAYERS** |
| Static reward fallback | **KEEP** |

This commit is documentation and experimental generation only, not an implementation or a production acceptance claim.