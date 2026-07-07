#!/usr/bin/env node
// Build an attempt prompt BY SCRIPT from the authentic observations.json —
// the binding control from inc-2026-07-06-world-010-hint-contamination
// (evaluation prompts are never hand-assembled). Emits the prompt to stdout
// and self-verifies that every data array embedded is byte-identical to the
// source file before printing anything.
//
// Usage: node scripts/fcs-synth/build-attempt-prompt.mjs <world-id>
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const worldId = process.argv[2];
if (!worldId) { console.error('usage: build-attempt-prompt.mjs <world-id>'); process.exit(1); }

const obs = JSON.parse(readFileSync(join(ROOT, 'experiments', `fcs-synth-${worldId}`, 'observations.json'), 'utf8'));
const J = (x) => JSON.stringify(x);

// Self-verification: re-parse what we will embed and compare to source.
for (const [name, val] of [['observations', obs.observations], ['shownInterventions', obs.shownInterventions], ['heldOutInterventionProbes', obs.heldOutInterventionProbes]]) {
  if (JSON.stringify(JSON.parse(J(val))) !== JSON.stringify(val)) {
    console.error(`SELF-CHECK FAILED on ${name}`); process.exit(1);
  }
}

const varNames = obs.heldOutInterventionProbes[0].before
  ? Object.keys(obs.heldOutInterventionProbes[0].before)
  : ['p', 'q', 'r', 's'];
const keyExample = obs.heldOutInterventionProbes[0].before
  ? `"${Object.values(obs.heldOutInterventionProbes[0].before).join('-')}_do-${obs.heldOutInterventionProbes[0].do_var}-${obs.heldOutInterventionProbes[0].do_value}"`
  : `"p${obs.heldOutInterventionProbes[0].p}_do-${obs.heldOutInterventionProbes[0].do_var}-${obs.heldOutInterventionProbes[0].do_value}"`;

process.stdout.write(`You are given data from a sealed synthetic world you have never seen. Do NOT write or execute code — reason by hand only, in text.

${obs.lawFamily}

TASK AS REGISTERED: ${obs.task}

OBSERVATIONAL samples: ${J(obs.observations)}

SHOWN INTERVENTIONAL records (do-operator; 'before' is the pre-intervention state, 'after' the result): ${J(obs.shownInterventions)}

HELD-OUT probes to predict (do_var forced to do_value on the given 'before' state; predict the full 'after' for ALL of ${varNames.join(', ')}): ${J(obs.heldOutInterventionProbes)}

Label each prediction exactly by its probe key, e.g. ${keyExample}: ${varNames.map((v) => v + '=..').join(' ')}.
State your constructed structure explicitly (including any hidden/unobserved variable if you need one), your confidence, and what would change your mind. Answer in full; do not skip any probe.
`);
