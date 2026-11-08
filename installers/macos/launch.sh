#!/bin/sh
set -eu
resources="$(cd "$(dirname "$0")/../Resources" && pwd)"
destination="$HOME/Library/Application Support/TOPO/NINO"
mkdir -p "$destination"
if ! cmp -s "$resources/NINO.html" "$destination/NINO.html"; then
 temporary="$(mktemp "$destination/.NINO.XXXXXXXX")"
 trap 'rm -f "$temporary"' EXIT
 cp "$resources/NINO.html" "$temporary"
 mv -f "$temporary" "$destination/NINO.html"
fi
if [ "${1:-}" != "--install-only" ]; then
 /usr/bin/open "$destination/NINO.html"
fi
