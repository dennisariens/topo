#!/bin/bash
# Lead integration verification. This is NOT independent Codex QA.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
: "${PLAYWRIGHT_MODULE:?Set PLAYWRIGHT_MODULE to a development Playwright index.mjs}"
if [[ -z "${CHROME_PATH:-}" && -x '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ]]; then
  export CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
fi
OUT='docs/qa/integration-lead-20261030'
mkdir -p "$OUT/gates" "$OUT/physical" "$OUT/selection" "$OUT/sessions" "$OUT/offline" "$OUT/focus" "$OUT/fidelity"
run(){ local name="$1";shift;printf 'RUN %s\n' "$name"; "$@" > "$OUT/gates/$name.txt" 2>&1; printf 'PASS %s\n' "$name"; }
run release-check env QA_PRESERVATION_FILE="$OUT/preservation.json" npm run release:check
run fidelity env QA_FIDELITY_DIR="$OUT/fidelity/" node scripts/qa-approved-selection-artwork.mjs
run all45 env QA_INTEGRITY_DIR="$OUT/integrity/" node scripts/qa-computer-release.mjs
run webkit-all45 env QA_BROWSER=webkit QA_INTEGRITY_DIR="$OUT/webkit/" node scripts/qa-computer-release.mjs
run backup-transfer node scripts/qa-integrated-backup-transfer.mjs
run daily-import env TOPO_URL="file://$ROOT/output/html/TOPO-NINO-Computer-Release.html" QA_OUTPUT="$OUT/daily-import" node scripts/qa-findings-browser.mjs
run selectors env QA_REVISION_SKIP_HISTORY=1 QA_OUTPUT="../$OUT/selection/" node scripts/qa-map-picker-revision.mjs
run sessions env QA_OUTPUT="../$OUT/sessions/" node scripts/qa-map-picker-sessions.mjs
run physical-overlaps env QA_OUTPUT="../$OUT/physical/" node scripts/qa-map-picker-revision-taps.mjs
run offline env TOPO_OFFLINE_FILE='../output/html/TOPO-NINO-Computer-Release.html' QA_OUTPUT="../$OUT/offline/" node scripts/qa-offline-computer.mjs
run focus env QA_FOCUS_HTML='output/html/TOPO-NINO-Computer-Release.html' QA_FOCUS_DIR="../$OUT/focus/" node scripts/qa-focus-mode.mjs
# Browser actually downloads the separate existing candidate prerelease, then reopens it offline.
DOWNLOAD_DIR="${QA_DOWNLOAD_DIR:-$HOME/.hermes/cache/scratch/topo-integrated-release-download}"
run published-download env TOPO_DOWNLOAD_URL='https://github.com/dennisariens/topo/releases/download/topo-nino-computer-approved-artwork-rc-20261030/TOPO-NINO-Computer-Release.html' QA_DOWNLOAD_DIR="$DOWNLOAD_DIR" node scripts/qa-computer-download.mjs
mkdir -p "$OUT/download"
cp "$DOWNLOAD_DIR/verification.json" "$DOWNLOAD_DIR/downloaded-offline.png" "$OUT/download/"
printf 'Lead integration checks complete; native Safari and independent Codex gates remain separate.\n'
