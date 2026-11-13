#!/bin/bash
# Installeert de TOPO-nachtrun op de Mac mini. Veilig om opnieuw te draaien.
# Gebruik (vanuit de topo-repo, op elke branch):
#   git fetch origin main && git show origin/main:ops/scripts/install-nightly.sh | bash
set -euo pipefail

REPO="$(git rev-parse --show-toplevel 2>/dev/null || echo "$HOME/topo-claude")"
STATE_DIR="$HOME/.topo-night"
LABEL="com.colddesert.topo-night"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
mkdir -p "$STATE_DIR" "$HOME/Library/LaunchAgents"

echo "▶ Repo: $REPO"
git -C "$REPO" remote get-url origin | grep -qi 'dennisariens/topo' || { echo "✗ $REPO is niet de topo-repo"; exit 1; }

echo "▶ Tools"
MISSING=0
for t in git gh claude node npm; do
  if p="$(command -v $t)"; then echo "  ✓ $t  $p"; else echo "  ✗ $t ontbreekt"; MISSING=1; fi
done
command -v codex >/dev/null && echo "  ✓ codex (failover)" || echo "  · codex niet gevonden: failover staat uit"
[ $MISSING = 0 ] || { echo "✗ Installeer de ontbrekende tools en draai opnieuw."; exit 1; }
gh auth status >/dev/null 2>&1 && echo "  ✓ gh ingelogd" || echo "  ! gh niet ingelogd: draai 'gh auth login' (nodig voor PR's)"

# PATH vastleggen zoals hij nu in deze shell is (launchd kent de shell-PATH niet)
TOOLPATH="$(for t in git gh claude node npm codex; do command -v $t 2>/dev/null | xargs -I{} dirname {}; done | awk '!s[$0]++' | paste -sd: -)"

echo "▶ $STATE_DIR/env"
if [ ! -f "$STATE_DIR/env" ]; then
  cat > "$STATE_DIR/env" <<ENV
TOPO_REPO="$REPO"
TOPO_WORKTREE="$HOME/topo-night"
export PATH="$TOOLPATH:/usr/bin:/bin:/usr/sbin:/sbin"
# Optioneel, voor de ochtendbrief via Telegram:
# TELEGRAM_BOT_TOKEN=""
# TELEGRAM_CHAT_ID=""
ENV
  echo "  aangemaakt"
else
  echo "  bestaat al, ongewijzigd"
fi
source "$STATE_DIR/env"

echo "▶ launchd ($PLIST), dagelijks 01:00"
cat > "$PLIST" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-c</string>
    <string>source "$STATE_DIR/env"; cd "$REPO" &amp;&amp; git fetch -q origin main &amp;&amp; git show origin/main:ops/scripts/nightly.sh &gt; "$STATE_DIR/nightly.sh" &amp;&amp; /bin/bash "$STATE_DIR/nightly.sh"</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>1</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>$STATE_DIR/launchd.out</string>
  <key>StandardErrorPath</key><string>$STATE_DIR/launchd.err</string>
</dict>
</plist>
PL
plutil -lint "$PLIST" >/dev/null && echo "  ✓ plist geldig"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl print "gui/$(id -u)/$LABEL" >/dev/null && echo "  ✓ geladen"

echo "▶ Proefdraai (DRY_RUN: alleen worktree en npm, geen agents)"
git -C "$REPO" show origin/main:ops/scripts/nightly.sh > "$STATE_DIR/nightly.sh"
DRY_RUN=1 /bin/bash "$STATE_DIR/nightly.sh" || true
tail -5 "$STATE_DIR/$(date +%F).log"

echo "▶ Claude headless-check (1 korte call)"
claude -p "Antwoord alleen: OK" --model haiku --max-turns 1 2>&1 | tail -1

echo
echo "✓ Klaar. Eerste nachtrun: vannacht 01:00. Logs: $STATE_DIR/"
echo "  Nu meteen een echte run starten: launchctl kickstart gui/$(id -u)/$LABEL"
