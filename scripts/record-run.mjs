#!/usr/bin/env node
// Append a maintenance run to the run log (src/data/runs.json) so the Control
// Room shows the loop working. Deterministic; called at the end of a cycle.
//
// Usage:
//   node scripts/record-run.mjs --trigger manual --actor "you + Claude (Max)" \
//     --note "…" --action "did X" --action "did Y"

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const runsPath = join(DATA, 'runs.json');
const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));

// ── parse args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const actions = args.reduce((acc, a, i) => {
  if (a === '--action' && args[i + 1]) acc.push(args[i + 1]);
  return acc;
}, []);

const today = process.env.OBSERVATORY_TODAY || new Date().toISOString().slice(0, 10);

// ── derive current calibration ───────────────────────────────────────────────
const forecasts = read('forecasts.json');
// Live resolutions only — backfilled entries are excluded from calibration.
const resolved = forecasts.filter(
  (f) => f.status !== 'open' && f.provenance !== 'backfilled',
);
const meanBrier = resolved.length
  ? Number(
      (
        resolved.reduce(
          (s, f) => s + (f.probability - (f.status === 'resolved-yes' ? 1 : 0)) ** 2,
          0,
        ) / resolved.length
      ).toFixed(3),
    )
  : null;

// ── build the run ────────────────────────────────────────────────────────────
const runs = read('runs.json');
const run = {
  id: `run-${today}-${opt('trigger', 'manual')}`,
  at: today,
  trigger: opt('trigger', 'manual'),
  actor: opt('actor', 'operator + Claude (Max)'),
  meanBrierAfter: meanBrier,
  gatePassed: opt('gate', 'true') === 'true',
  actions: actions.length ? actions : ['(no actions recorded)'],
  note: opt('note', 'Maintenance cycle.'),
};

runs.unshift(run);
writeFileSync(runsPath, JSON.stringify(runs, null, 2) + '\n');
console.log(`✓ recorded ${run.id} — Brier ${meanBrier ?? '—'} — ${run.actions.length} action(s)`);
