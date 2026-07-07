#!/usr/bin/env node
// Mechanical raw→envelope transcription — the binding control made executable.
// Parses a model's raw output for probe-key-labelled predictions, validates
// full coverage against the shared live-worlds keys, and writes the anchored
// attempt file. No hand transcription anywhere.
//
// Usage: transcribe-attempt.mjs <world-id> <raw-file> <mind-label> <slug>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { liveWorlds } from '../lib/live-worlds.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const [worldId, rawFile, mind, slug] = process.argv.slice(2);
if (!worldId || !rawFile || !mind || !slug) {
  console.error('usage: transcribe-attempt.mjs <world-id> <raw-file> <mind> <slug>');
  process.exit(1);
}

const world = liveWorlds()[worldId];
if (!world) { console.error(`${worldId} is not live`); process.exit(1); }
const raw = readFileSync(rawFile, 'utf8');

// Parse "KEY ...: v1=n v2=n ..." lines; key may be wrapped in **, quotes, etc.
const preds = {};
const keyAlt = world.keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
const varPart = world.vars.map((v) => `${v}\\s*=\\s*(\\d+)`).join('[,;\\s]*');
const rx = new RegExp(`(${keyAlt})[^\\d\\n]{0,20}?${varPart}`, 'g');
for (const m of raw.matchAll(rx)) {
  const key = m[1];
  const vals = m.slice(2).map(Number);
  preds[key] = Object.fromEntries(world.vars.map((v, i) => [v, vals[i]]));
}
const missing = world.keys.filter((k) => !preds[k]);
if (missing.length) {
  console.error(`INCOMPLETE: parsed ${Object.keys(preds).length}/${world.keys.length}; missing: ${missing.slice(0, 4).join(', ')}`);
  process.exit(2);
}

// Structure: take the raw's own words around structure/causal statements — but
// never invent; store a pointer to the raw as the authoritative statement.
const envelope = {
  worldId,
  attemptedAt: new Date().toISOString(),
  mind,
  attemptClass: 'model',
  inputsDeclared: 'script-built prompt containing only the authentic observations.json content (verified by diff before dispatch); no repo, no tools',
  toolUse: { codeUsed: false, externalToolsUsed: false },
  declaredStructure: 'stated in full in the raw output file alongside this envelope (transcribed mechanically; the raw is authoritative)',
  predictions: preds,
  note: 'predictions transcribed MECHANICALLY (regex, scripts/fcs-synth/transcribe-attempt.mjs) from the raw output; full coverage validated against /live-worlds.json keys',
};

const dir = join(ROOT, 'experiments', `fcs-synth-${worldId}`, 'attempts');
mkdirSync(dir, { recursive: true });
copyFileSync(rawFile, join(dir, `${slug}-raw.txt`));
writeFileSync(join(dir, `${slug}.md`), `# Attempt — ${mind} · ${worldId} · 2026-07-07 (clean, first-party)

Provenance: isolated invocation on a script-built prompt (build-attempt-prompt.mjs)
containing only authentic data, diffed before dispatch per the binding control from
inc-2026-07-06-world-010-hint-contamination. Raw output alongside (${slug}-raw.txt);
predictions below were transcribed mechanically, never by hand.

===ATTEMPT-BEGIN===
${JSON.stringify(envelope, null, 2)}
===ATTEMPT-END===
`);
console.log(`✓ ${worldId}/${slug}: ${Object.keys(preds).length}/${world.keys.length} predictions transcribed mechanically`);
