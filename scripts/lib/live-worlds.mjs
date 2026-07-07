// The single source of truth for LIVE sealed worlds — derived, never asserted.
//
// Born from inc-2026-07-07-intake-probe-key-bug: two validators (the GitHub
// intake and the /a2a endpoint) derived probe keys independently, one wrongly,
// and an external agent's valid attempts were rejected. The incident's binding
// nextControl: one validator, not two. This module derives everything from the
// record's own data — run-bundles.json for liveness and window dates,
// each world's observations.json for probe keys and prediction variables —
// and every consumer (intake, endpoint, window beat) reads the same output.
// The build emits it as public/live-worlds.json so even the serverless
// endpoint reads the identical artifact the record publishes.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Probe-key derivation — matches each world's pinned grader exactly.
// {p, do_var, do_value}            → "p{p}_do-{var}-{value}"
// {before:{...}, do_var, do_value} → "{v1}-{v2}-...{vn}_do-{var}-{value}"
export const probeKey = (p) => p.before
  ? `${Object.values(p.before).join('-')}_do-${p.do_var}-${p.do_value}`
  : `p${p.p}_do-${p.do_var}-${p.do_value}`;

export function liveWorlds() {
  const bundles = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'run-bundles.json'), 'utf8'));
  const out = {};
  for (const b of bundles) {
    if (b.status !== 'registered-sealed') continue;
    const worldId = /world-\d+/.exec(b.experimentPath ?? '')?.[0];
    if (!worldId) continue;
    const obsPath = join(ROOT, 'experiments', `fcs-synth-${worldId}`, 'observations.json');
    if (!existsSync(obsPath)) continue;
    if (existsSync(join(ROOT, 'experiments', `fcs-synth-${worldId}`, 'REVEAL.md'))) continue;
    const obs = JSON.parse(readFileSync(obsPath, 'utf8'));
    const probes = obs.heldOutInterventionProbes ?? [];
    if (!probes.length) continue;
    out[worldId] = {
      title: b.title,
      closesOn: b.attemptWindowCloses ?? null,
      vars: probes[0].before ? Object.keys(probes[0].before) : ['p', 'q', 'r', 's'],
      keys: probes.map(probeKey),
      observations: `/experiments/fcs-synth-${worldId}/observations.json`,
    };
  }
  return out;
}

// CLI: node scripts/lib/live-worlds.mjs → writes public/live-worlds.json
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { writeFileSync } = await import('node:fs');
  const worlds = liveWorlds();
  writeFileSync(join(ROOT, 'public', 'live-worlds.json'), JSON.stringify({
    doctrine: 'Derived from run-bundles.json + each observations.json at build; consumed identically by the GitHub intake, the /a2a endpoint, and the window beat. One validator, not two (inc-2026-07-07-intake-probe-key-bug).',
    worlds,
  }, null, 2) + '\n');
  console.log(`✓ live-worlds.json: ${Object.keys(worlds).join(', ') || 'none live'}`);
}
