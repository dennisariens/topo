#!/usr/bin/env bash
set -euo pipefail
root="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
if ! command -v node >/dev/null 2>&1; then
  echo 'GATE: FAIL — Node.js is required (use supported Node 24.15+).' >&2
  exit 1
fi
exec node "$root/scripts/harness/check.mjs" "$@"
