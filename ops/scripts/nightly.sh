#!/usr/bin/env bash
# TOPO nachtrun — draait op de Mac mini via launchd (01:00), geïnstalleerd met ops/scripts/install-nightly.sh.
# Werkt in een aparte git worktree en raakt main nooit aan. Levert één draft-PR per nacht en een brief.
# launchd haalt dit script elke nacht vers van origin/main, dus wijzigingen via een PR werken automatisch door.
set -euo pipefail

STATE_DIR="$HOME/.topo-night"
# Paden, PATH en optioneel TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID (geschreven door install-nightly.sh)
[ -f "$STATE_DIR/env" ] && source "$STATE_DIR/env"
REPO="${TOPO_REPO:-$HOME/topo-claude}"
WT="${TOPO_WORKTREE:-$HOME/topo-night}"
DATE="$(date +%F)"
BRANCH="night/$DATE"
mkdir -p "$STATE_DIR"
LOG="$STATE_DIR/$DATE.log"
exec >>"$LOG" 2>&1
echo "=== start $(date) ==="


body() { awk 'BEGIN{n=0} /^---$/ && n<2 {n++; next} n>=2' "$1"; }   # strip frontmatter

# 1. Verse worktree vanaf origin/main
cd "$REPO"
git fetch origin --prune
git worktree remove --force "$WT" 2>/dev/null || true
git fetch origin main:main 2>/dev/null || true   # lokale main bijwerken (lukt alleen als main niet uitgecheckt is)
git worktree add -B "$BRANCH" "$WT" origin/main
cd "$WT"
npm ci --silent || npm install --silent

# Agents draaien in een eigen worktree zonder vragen (bypassPermissions), maar met harde verboden.
# Een allowlist per commando bleek te smal: pipes en samengestelde git-commando's werden geweigerd (nacht 14-11).
DENIED=( "Bash(git push*)" "Bash(git checkout main*)" "Bash(git switch main*)" "Bash(git reset --hard*)" "Bash(git branch -D*)"
         "Bash(git branch -d*)" "Bash(git push --delete*)" "Bash(git tag -d*)" "Bash(git worktree remove*)" "Bash(rm -rf*)"
         "Bash(vercel*)" "Bash(gh pr merge*)" "Bash(gh api*)" "Bash(gh repo*)" "Bash(launchctl*)" )

if [ "${DRY_RUN:-0}" = "1" ]; then echo "DRY_RUN: worktree klaar op $WT"; exit 0; fi

# 2. Claude-nachtrun: hoofdsessie orkestreert (Opus; override met TOPO_MAIN_MODEL in ~/.topo-night/env),
#    subagents draaien op hun eigen model (frontmatter in .claude/agents/)
set +e
OUT="$(claude -p "$(body .claude/commands/nachtrun.md)" \
  --model "${TOPO_MAIN_MODEL:-opus}" --max-turns 300 \
  --permission-mode bypassPermissions \
  --disallowedTools "${DENIED[@]}" \
  --append-system-prompt "Vergelijk altijd met origin/main (lokale main is bijgewerkt maar origin/main is de waarheid). Read-only git (for-each-ref, rev-list, cherry, merge-base, show, ls-tree) en pipes zijn toegestaan." 2>&1)"
RC=$?
set -e
echo "$OUT" | tail -40

# 3. Failover naar Codex bij een usage limit: bouwt de bovenste ready-taak, evaluatie volgt overdag door Claude
if [ $RC -ne 0 ] && echo "$OUT" | grep -qiE 'usage limit|limit reached|rate limit'; then
  echo "Claude-limiet bereikt → Codex-failover"
  codex exec --full-auto "Lees AGENTS.md en ops/HARNESS.md. Pak de bovenste taak met status ready uit ops/BACKLOG.md en het contract in ops/contracts/. Bouw precies dat, draai de tests uit het contract, commit met de BL-ID in de message. Zet de status op 'review (wacht op evaluator)' en voeg een regel toe aan ops/RUNLOG.md met agent codex. Niet pushen, niet mergen." || true
  echo "$DATE | codex-failover | zie git log" >> "$STATE_DIR/failover.log"
fi

# 4. Machine-feiten in het nachtrapport (de brief rapporteert limiet/failover anders als "onbekend")
REPORT="ops/reports/night-$DATE.md"
FAILOVER=nee; grep -q "^$DATE" "$STATE_DIR/failover.log" 2>/dev/null && FAILOVER=ja
LIMIT=nee; echo "$OUT" | grep -qiE 'usage limit|limit reached|rate limit' && LIMIT=ja
{ echo; echo "<!-- script -->"; echo "Claude exit-code: $RC · limiet geraakt: $LIMIT · failover Codex: $FAILOVER · duur: $SECONDS s"; } >> "$REPORT"
git add "$REPORT" && git commit -qm "docs(night): machine-feiten $DATE" || true

# 5. Push en draft-PR als er werk is
if [ -n "$(git log origin/main..HEAD --oneline)" ]; then
  git push -u origin "$BRANCH"
  gh pr create --draft --base main --head "$BRANCH" --title "Nachtrun $DATE" --body-file "$REPORT" || true
fi

# 6. Brief (Sonnet) → bestand + Telegram
set +e
BRIEF="$(claude -p "$(body .claude/commands/brief.md)" --model sonnet --max-turns 30 \
  --permission-mode bypassPermissions --disallowedTools "${DENIED[@]}" 2>&1)"
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
