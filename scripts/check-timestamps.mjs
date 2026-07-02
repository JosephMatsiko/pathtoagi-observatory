#!/usr/bin/env node
// Conformance gate for the timestamp anchors. Deterministic and offline:
// every manifest entry's proof must exist, deserialize, and match its commit's
// digest. Freshness is a warning, not an error — the record may rest, but a
// malformed or mismatched proof is a hard failure.
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import OpenTimestamps from 'opentimestamps';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'timestamps', 'manifest.json');

const errors = [];
const warnings = [];

let manifest = [];
if (!existsSync(MANIFEST)) {
  warnings.push('no timestamps/manifest.json yet — record is unanchored');
} else {
  try { manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')); }
  catch { errors.push('manifest.json is not valid JSON'); }
}

for (const e of manifest) {
  const w = `timestamp[${(e.commit ?? '?').slice(0, 12)}]`;
  if (!/^[0-9a-f]{40}$/.test(e.commit ?? '')) errors.push(`${w}: bad commit hash`);
  if (!['pending', 'confirmed'].includes(e.status)) errors.push(`${w}: bad status "${e.status}"`);
  if (!e.ots || !existsSync(join(ROOT, e.ots))) { errors.push(`${w}: proof file missing`); continue; }
  try {
    const bytes = new Uint8Array(readFileSync(join(ROOT, e.ots)));
    const detached = OpenTimestamps.DetachedTimestampFile.deserialize(bytes);
    const expect = createHash('sha256').update(e.commit, 'utf8').digest('hex');
    const got = Buffer.from(detached.fileDigest()).toString('hex');
    if (got !== expect) errors.push(`${w}: proof digest ${got.slice(0, 12)}… does not match commit digest`);
  } catch (err) {
    errors.push(`${w}: proof does not deserialize (${err.message})`);
  }
}

if (manifest.length) {
  const newest = manifest.map((e) => Date.parse(e.stampedAt ?? 0)).sort((a, b) => b - a)[0];
  const days = (Date.now() - newest) / 86400000;
  if (days > 14) warnings.push(`newest anchor is ${days.toFixed(0)} days old`);
  const pending = manifest.filter((e) => e.status === 'pending').length;
  if (pending) warnings.push(`${pending} proof(s) pending Bitcoin aggregation (upgrade on next stamp run)`);
}

for (const w of warnings) console.log('⚠ ' + w);
if (errors.length) {
  console.error(`✗ timestamps: ${errors.length} violation(s)`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ timestamps: ${manifest.length} anchor(s) valid`);
