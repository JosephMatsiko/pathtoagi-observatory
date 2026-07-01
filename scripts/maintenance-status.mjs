#!/usr/bin/env node
// Situational awareness for the maintenance loop. Deterministic, no LLM.
// Reports what needs judgment (forecasts due for resolution), the current
// calibration (Brier), and how stale the record is. The loop reads this first;
// it never auto-resolves a forecast, because resolution requires judgment.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));

const today = process.env.OBSERVATORY_TODAY || new Date().toISOString().slice(0, 10);
const daysBetween = (a, b) =>
  Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

const forecasts = read('forecasts.json');
const evidence = read('evidence.json');
const revisions = read('revisions.json');

// ── Forecasts due for resolution ─────────────────────────────────────────────
const due = forecasts.filter(
  (f) => f.status === 'open' && f.horizonDate <= today,
);

// ── Calibration (Brier) ──────────────────────────────────────────────────────
const resolved = forecasts.filter((f) => f.status !== 'open');
const brier = (f) => (f.probability - (f.status === 'resolved-yes' ? 1 : 0)) ** 2;
const meanBrier = resolved.length
  ? resolved.reduce((s, f) => s + brier(f), 0) / resolved.length
  : null;

// ── Freshness ────────────────────────────────────────────────────────────────
const latest = (rows, key) =>
  rows.map((r) => r[key]).sort().at(-1) ?? null;
const lastEvidence = latest(evidence, 'observedAt');
const lastRevision = latest(revisions, 'date');
const STALE_DAYS = Number(process.env.OBSERVATORY_STALE_DAYS || 14);
const evAge = lastEvidence ? daysBetween(lastEvidence, today) : Infinity;
const revAge = lastRevision ? daysBetween(lastRevision, today) : Infinity;

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`pathtoAGI — the Observatory · maintenance status · ${today}\n`);

console.log(`Calibration:`);
console.log(
  `  mean Brier ${meanBrier === null ? '—' : meanBrier.toFixed(3)} over ${resolved.length} resolved (baseline 0.25)\n`,
);

console.log(`Freshness:`);
console.log(`  last evidence  ${lastEvidence ?? '—'} (${evAge}d ago)`);
console.log(`  last revision  ${lastRevision ?? '—'} (${revAge}d ago)`);
if (evAge > STALE_DAYS || revAge > STALE_DAYS)
  console.log(`  ⚠ record is stale (> ${STALE_DAYS}d) — ingest new signals\n`);
else console.log(`  record is fresh\n`);

console.log(`Forecasts due for resolution (${due.length}):`);
if (due.length === 0) console.log('  none');
for (const f of due)
  console.log(`  ⤷ ${f.id} — horizon ${f.horizonDate} — ${f.claim}`);

// Signal to the loop/CI: nonzero-worthy conditions are surfaced, not fatal.
const attention = due.length > 0 || evAge > STALE_DAYS || revAge > STALE_DAYS;
console.log(`\n${attention ? 'ATTENTION: the loop has work to do.' : 'Nothing due.'}`);
