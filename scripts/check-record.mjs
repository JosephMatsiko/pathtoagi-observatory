#!/usr/bin/env node
// Conformance gate for the record. Deterministic, no LLM, no network.
// Validates the mutable JSON collections against the Observatory's discipline
// so the maintenance loop cannot silently corrupt the record. Exits non-zero on
// any violation — this is the gate the CI job and the agent both run.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

// Canonical theory ids, parsed from theories.ts (single source of truth).
const theoriesSrc = readFileSync(join(DATA, 'theories.ts'), 'utf8');
const THEORY_IDS = new Set(
  [...theoriesSrc.matchAll(/id:\s*'([a-z-]+)'/g)].map((m) => m[1]),
);
if (THEORY_IDS.size < 3) err('theories.ts', 'could not parse theory ids');
for (const m of theoriesSrc.matchAll(/health:\s*([0-9.]+)/g)) {
  const h = Number(m[1]);
  if (!(h >= 0 && h <= 1)) err('theories.ts', `health out of bounds: ${m[1]}`);
}

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;
const validTheories = (arr, where) => {
  if (!Array.isArray(arr) || arr.length === 0)
    return err(where, 'theories must be a non-empty array');
  for (const t of arr)
    if (!THEORY_IDS.has(t)) err(where, `unknown theory id "${t}"`);
};

// ── evidence.json ──────────────────────────────────────────────────────────
const EV_CLASSES = new Set([
  'vendor-reported',
  'independent-eval',
  'benchmark-design',
  'falsifier-review',
  'regulatory-action',
]);
const evidence = read('evidence.json');
const evIds = new Set();
for (const e of evidence) {
  const w = `evidence[${e.id ?? '?'}]`;
  if (!nonEmpty(e.id)) err(w, 'missing id');
  else if (evIds.has(e.id)) err(w, 'duplicate id');
  else evIds.add(e.id);
  if (!ISO.test(e.observedAt ?? '')) err(w, 'observedAt must be YYYY-MM-DD');
  for (const k of ['source', 'sourceUrl', 'signal', 'implication', 'bounded', 'nextNeeded'])
    if (!nonEmpty(e[k])) err(w, `missing ${k}`);
  if (!EV_CLASSES.has(e.class)) err(w, `invalid class "${e.class}"`);
  // Every evidence record must cite a real, external source.
  if (!/^https?:\/\//.test(e.sourceUrl ?? ''))
    err(w, 'sourceUrl must be an http(s) URL — a record without a real source is not evidence');
  validTheories(e.theories, w);
  // Discipline: a single record never encodes a health promotion.
  if ('healthDelta' in e && e.healthDelta !== 0)
    err(w, 'healthDelta must be 0 — evidence does not promote a theory on its own');
}

// ── forecasts.json ───────────────────────────────────────────────────────────
const FC_STATUS = new Set(['open', 'resolved-yes', 'resolved-no']);
const forecasts = read('forecasts.json');
const fcIds = new Set();
for (const f of forecasts) {
  const w = `forecast[${f.id ?? '?'}]`;
  if (!nonEmpty(f.id)) err(w, 'missing id');
  else if (fcIds.has(f.id)) err(w, 'duplicate id');
  else fcIds.add(f.id);
  if (typeof f.probability !== 'number' || f.probability < 0 || f.probability > 1)
    err(w, 'probability must be a number in [0,1]');
  for (const k of ['claim', 'horizon', 'resolution']) if (!nonEmpty(f[k])) err(w, `missing ${k}`);
  if (!ISO.test(f.horizonDate ?? '')) err(w, 'horizonDate must be YYYY-MM-DD');
  if (!FC_STATUS.has(f.status)) err(w, `invalid status "${f.status}"`);
  if (f.status !== 'open' && !ISO.test(f.resolvedAt ?? ''))
    err(w, 'resolved forecast must have resolvedAt (YYYY-MM-DD)');
  if ('provenance' in f && f.provenance !== 'backfilled')
    err(w, `invalid provenance "${f.provenance}" (only "backfilled" is defined)`);
  validTheories(f.theories, w);
}

// ── revisions.json ───────────────────────────────────────────────────────────
const REV_KINDS = new Set(['build', 'record', 'verdict', 'method']);
const revisions = read('revisions.json');
for (const r of revisions) {
  const w = `revision[${r.title ?? '?'}]`;
  if (!ISO.test(r.date ?? '')) err(w, 'date must be YYYY-MM-DD');
  if (!REV_KINDS.has(r.kind)) err(w, `invalid kind "${r.kind}"`);
  for (const k of ['title', 'detail']) if (!nonEmpty(r[k])) err(w, `missing ${k}`);
  // A retraction preserves the original text and names the catch — visible, never a quiet rewrite.
  if ('retraction' in r) {
    if (!ISO.test(r.retraction?.date ?? '')) err(w, 'retraction.date must be YYYY-MM-DD');
    if (!nonEmpty(r.retraction?.reason)) err(w, 'retraction.reason is required');
    if (r.retraction?.date < r.date) err(w, 'retraction.date cannot precede the entry date');
  }
}

// ── superlatives.json ────────────────────────────────────────────────────────
const SUP_TRENDS = new Set(['earning', 'holding', 'slipping']);
const sups = read('superlatives.json');
for (const s of sups) {
  const w = `superlative[${s.id ?? '?'}]`;
  for (const k of ['id', 'word', 'obligation', 'measure', 'reading'])
    if (!nonEmpty(s[k])) err(w, `missing ${k}`);
  if (!SUP_TRENDS.has(s.trend)) err(w, `invalid trend "${s.trend}"`);
  // Obligations-never-claims: a reading may not declare a superlative achieved.
  if (/\b(is|now) the (most|smartest|wisest|best)\b/i.test(s.reading ?? ''))
    err(w, 'reading declares a superlative achieved — obligations, never claims');
}

// ── report ───────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`✗ record conformance: ${errors.length} violation(s)\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ record conformance: ${evidence.length} evidence · ${forecasts.length} forecasts · ${revisions.length} revisions · ${THEORY_IDS.size} theories · ${sups.length} superlatives — all valid`);
