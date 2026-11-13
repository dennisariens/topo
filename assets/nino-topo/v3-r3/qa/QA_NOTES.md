# NINO TOPO R3 — optical-logo QA notes
Status: **REVIEW ONLY** — never replace the R2 production files until owner approval.

## Provenance / invariants
- Base repository: `dennisariens/topo`
- Base branch: `art/nino-topo-website-v1`
- R2 logo primary original path: `assets/nino-topo/v3-r2/brand/logo/logo-01-primary.svg` — Git blob `7b37b9b52c0cbcb752c90732978b984c0eff88a6`
- R2 logo compact original path: `assets/nino-topo/v3-r2/brand/logo/logo-02-compact.svg` — Git blob `0926ed3422bfa2bc20cce59b8517688ef6ac5663`
- R2 wordmark stays unchanged: `assets/nino-topo/v3-r2/brand/logo/logo-03-wordmark.svg` — Git blob `964156f36c23044027450f24cf59e2e44ca508db`
- Approved PNG payload embedded as a base64 data URI is copied **byte-for-byte unchanged** into R3; custom `nino.` and `TOPO` SVG paths remain untouched.
- `#171B20` lettering and `#9781D5` lavender dot unchanged.

## R3 optical-draft changes
- Character image: 500 × 560 → 410 × 459 (approximately 18% reduction); position x24,y24 → x80,y70. No resampling of underlying PNG content.
- Wordmark group translation y170.192 → y275.192; original scale(0.405), original path positions and proportions remain untouched. This lowers wordmark baseline to approximately y534 while character bottom is y529, improving optical baseline consistency.
- Primary divider: x1220,y180.80,3×235.20 #D3C7ED → x1219,y285.80,5×235.20 #9781D5 with 0.76 opacity and softened corners. Emphasis remains secondary.
- All four TOPO path transformations translated vertically by +105 px. Their paths and outline treatment remain untouched.
- ViewBoxes remain 1717×608 / 1195×608. The logo comparison must be judged **at actual rendered header size**, not zoomed illustration size.

## Mandatory gates before owner sign-off
- Inspect `qa/header-review.html` (open from checked-out repository) at real 100% browser zoom; compare R2/R3 on #FAFAF9 and #FFFFFF at 1440 desktop and 390 mobile, plus tablet 1024.
- Capture actual browser screenshots at CSS 1× and device-scale 2×, not only HTML preview fixture.
- Verify divider at <=200 px rendered logo width; check character/wordmark baseline and negative spacing.
- Export versioned R3 PNG/WebP only after optical visual acceptance; the SVG work alone is NOT release ready.
- Welcome image candidates, favicon and Safari pinned tab need separate owner and real-device checks.
- No merge and no production deployment.
