#!/bin/sh
set -eu
# Run from a clean authenticated checkout of dennisariens/topo, art source branch only.
REPO="$(git rev-parse --show-toplevel)"
cd "$REPO"
[ "$(git remote get-url origin | grep -c 'dennisariens/topo')" -gt 0 ] || { echo 'Wrong Git remote'; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo 'Working tree dirty; refusing to copy'; exit 1; }
[ "$(git branch --show-current)" = 'art/nino-travel-stamps-v2-20261026' ] || { echo 'Checkout owner art source branch first'; exit 1; }
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
[ -f "$HERE/README_FIRST.md" ] || { echo 'Run from unpacked handoff'; exit 1; }
# Copy NEW files only (no overwrite existing). Python is used for explicit same-path source matching.
python3 - "$HERE" "$REPO" <<'PYINNER'
from pathlib import Path
import sys,shutil
src=Path(sys.argv[1]); dst=Path(sys.argv[2]); paths=[p for p in (src/'assets').rglob('*') if p.is_file()]
for p in paths:
 d=dst/p.relative_to(src)
 if d.exists(): raise SystemExit('Refusing to overwrite existing path: '+str(d))
for p in paths:
 d=dst/p.relative_to(src);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,d)
print('Copied',len(paths),'additive assets. QA docs stay in handoff and must be reviewed before promotion.')
PYINNER
git add assets/nino/travel-passport
git status --short
printf '\nReview staged files; commit manually after verifying exact binary hashes.\n'
