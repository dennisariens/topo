# Reproduce the exact artwork review

Use a full clone of the review commit; pinned historical source Git objects must
be present. Production does not depend on Python, OpenCV, Pillow or Playwright.
Build environment: Python3.8.2, Pillow10.4.0, numpy1.24.4,
opencv-python-headless4.10.0.84; Node24.15.0, external Playwright1.64.1 and installed
Chrome. Archive checksums are authoritative for reviewed bytes; codec version
changes require a new package and exact-SHA review.

```sh
python3 -m venv /tmp/nino-build
/tmp/nino-build/bin/python -m pip install --upgrade pip
/tmp/nino-build/bin/python -m pip install Pillow==10.4.0 numpy==1.24.4 opencv-python-headless==4.10.0.84
/tmp/nino-build/bin/python scripts/collect_nino_final_exports.py
/tmp/nino-build/bin/python scripts/build_pisa_final.py
/tmp/nino-build/bin/python scripts/inventory-nino-artwork-67.py
/tmp/nino-build/bin/python scripts/qa_nino_final.py
npm ci --ignore-scripts --no-audit --no-fund
npm run release:check
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs CHROME_PATH=/absolute/path/to/chrome node scripts/qa-nino-final-browser.mjs
```

Existing Issue67 exports were already independently codec-verified and are
retained, not unnecessarily regenerated. If reproducing those earlier derivatives,
run `scripts/build_venezia_postcard.py --out assets/nino/travel-passport/postcards/exports`
and `scripts/close-nino-artwork-67.py` with the same Pillow pin; compare to original
`export-verification.json` and Venezia export manifest.

After review-producing sources/evidence are committed, run
`python scripts/package_nino_final.py`; it records that producing SHA. Re-running
on the later packaging commit changes its producing-SHA metadata intentionally.
To reproduce the same ZIP, check out the recorded producing commit. No network
request is needed by `review.html`; open it directly with file://.

Package members use paths relative to repository root; preview is at
`assets/nino/rewards/pizza/hinge-review/review.html` inside the extracted ZIP.
