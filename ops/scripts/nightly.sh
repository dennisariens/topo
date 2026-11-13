#!/usr/bin/env bash
# TOPO nachtrun — draait op de Mac mini via launchd of de scheduler van Hermes (01:00).
# Werkt in een aparte git worktree en raakt main nooit aan. Levert één draft-PR per nacht en een brief.
# Eerste keer: test met `DRY_RUN=1 ops/scripts/nightly.sh` en controleer flags met `claude --help` / `codex exec --help`.
set -euo pipefail

REPO="${TOPO_REPO:-$HOME/code/topo}"
WT="${TOPO_WORKTREE:-$HOME/code/topo-night}"
STATE_DIR="$HOME/.topo-night"
DATE="$(date +%F)"
BRANCH="night/$DATE"
mkdir -p "$STATE_DIR"
LOG="$STATE_DIR/$DATE.log"
exec >>"$LOG" 2>&1
echo "=== start $(date) ==="

# Optioneel: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
[ -f "$STATE_DIR/env" ] && source "$STATE_DIR/env"

body() { awk 'BEGIN{n=0} /^---$/ && n<2 {n++; next} n>=2' "$1"; }   # strip frontmatter

# 1. Verse worktree vanaf origin/main
cd "$REPO"
git fetch origin --prune
git worktree remove --force "$WT" 2>/dev/null || true
git worktree add -B "$BRANCH" "$WT" origin/main
cd "$WT"
npm ci --silent || npm install --silent

ALLOWED=( "Read" "Edit" "Write" "Grep" "Glob" "Task" "Agent" "Bash(npm *)" "Bash(node *)" "Bash(npx *)" "Bash(python3 *)"
          "Bash(git status*)" "Bash(git diff*)" "Bash(git log*)" "Bash(git add*)" "Bash(git commit*)" "Bash(git grep*)" "Bash(gh pr list*)" )
DENIED=( "Bash(git push*)" "Bash(git checkout main*)" "Bash(git branch -D*)" "Bash(rm -rf*)" "Bash(vercel *)" )

if [ "${DRY_RUN:-0}" = "1" ]; then echo "DRY_RUN: worktree klaar op $WT"; exit 0; fi

# 2. Claude-nachtrun (builder op Sonnet; planner/evaluator-subagents op Opus via hun frontmatter)
set +e
OUT="$(claude -p "$(body .claude/commands/nachtrun.md)" \
  --model sonnet --max-turns 200 \
  --permission-mode acceptEdits \
  --allowedTools "${ALLOWED[@]}" --disallowedTools "${DENIED[@]}" 2>&1)"
RC=$?
set -e
echo "$OUT" | tail -40

# 3. Failover naar Codex bij een usage limit: bouwt de bovenste ready-taak, evaluatie volgt overdag door Claude
if [ $RC -ne 0 ] && echo "$OUT" | grep -qiE 'usage limit|limit reached|rate limit'; then
  echo "Claude-limiet bereikt → Codex-failover"
  codex exec --full-auto "Lees AGENTS.md en ops/HARNESS.md. Pak de bovenste taak met status ready uit ops/BACKLOG.md en het contract in ops/contracts/. Bouw precies dat, draai de tests uit het contract, commit met de BL-ID in de message. Zet de status op 'review (wacht op evaluator)' en voeg een regel toe aan ops/RUNLOG.md met agent codex. Niet pushen, niet mergen." || true
  echo "$DATE | codex-failover | zie git log" >> "$STATE_DIR/failover.log"
fi

# 4. Push en draft-PR als er werk is
if [ -n "$(git log origin/main..HEAD --oneline)" ]; then
  git push -u origin "$BRANCH"
  REPORT="ops/reports/night-$DATE.md"
  [ -f "$REPORT" ] || echo "Nachtrun $DATE — zie commits." > "$REPORT"
  gh pr create --draft --base main --head "$BRANCH" --title "Nachtrun $DATE" --body-file "$REPORT" || true
fi

# 5. Brief (Sonnet) → bestand + Telegram
set +e
BRIEF="$(claude -p "$(body .claude/commands/brief.md)" --model sonnet --max-turns 30 \
  --permission-mode acceptEdits --allowedTools "Read" "Write" "Grep" "Glob" "Bash(gh pr list*)" "Bash(git log*)" 2>&1)"
set -e
if [ -n "$(git status --porcelain ops/briefs)" ]; then
  git add ops/briefs && git commit -m "docs(brief): $DATE" && git push origin "$BRANCH" || true
fi
if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${BRIEF:0:3900}" >/dev/null || true
fi
echo "=== einde $(date) ==="
