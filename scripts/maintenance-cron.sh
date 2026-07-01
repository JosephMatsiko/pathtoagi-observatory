#!/usr/bin/env bash
# Hourly maintenance heartbeat for pathtoAGI — the Observatory.
#
# DEFAULT (safe, free): deterministic only. Pulls, runs the status check, and if
# the loop has real work it notifies you — no Max tokens, no commits. Most hours
# this is a fast organic no-op.
#
# OPT-IN (full autonomy): set OBSERVATORY_AUTONOMOUS=1 to also run the judgment
# cycle on your Claude Max plan via `claude -p`. It follows MAINTENANCE.md, opens
# a PR for review, and never merges or deploys itself.
set -uo pipefail

REPO="${OBSERVATORY_REPO:-/Users/josephmatsiko/Projects/observatory}"
LOG="$REPO/.maintenance.log"
cd "$REPO" || { echo "repo not found: $REPO"; exit 1; }

ts()  { date "+%Y-%m-%d %H:%M:%S"; }
log() { echo "[$(ts)] $*" >> "$LOG"; }
notify() { osascript -e "display notification \"$1\" with title \"pathtoAGI — the Observatory\"" 2>/dev/null || true; }

log "heartbeat start"
git checkout main >/dev/null 2>&1 || true
git pull --ff-only >/dev/null 2>&1 || log "pull skipped/failed"

STATUS="$(npm run --silent maintain:status 2>&1)"
echo "$STATUS" >> "$LOG"

if echo "$STATUS" | grep -q "ATTENTION"; then
  log "ATTENTION — the loop has work"
  notify "Maintenance work is due — open the Control Room or run a cycle."
  if [ "${OBSERVATORY_AUTONOMOUS:-0}" = "1" ]; then
    log "autonomous cycle: invoking claude (Max)"
    claude -p "$(cat "$REPO/MAINTENANCE.md")

---
Run exactly one maintenance cycle now, following the runbook above. Act only on real, citable signal; if nothing is genuinely resolvable, stop with no changes (a clean no-op is success). Open a PR for review. Never push to main, never merge, never deploy." \
      --dangerously-skip-permissions >> "$LOG" 2>&1 || log "autonomous cycle errored (see log)"
    log "autonomous cycle done"
  else
    log "autonomous mode off — left for human review"
  fi
else
  log "nothing due — organic no-op"
fi
log "heartbeat end"
