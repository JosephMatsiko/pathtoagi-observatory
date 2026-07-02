#!/usr/bin/env node
// FCS-synth world-003 — Omnibus tranche-2 registered probe.
//
// The probe adds the controls demanded by the Omnibus adoption map:
// - W3 wrong-frame attractor: early public samples are affine-looking, while
//   the sealed law is a gated nonlinear map.
// - W6 negative control: a deliberately underdetermined lane where the correct
//   answer is to withhold an exact prediction.
// - Code-ablated protocol: the public prompt forbids code/tool execution.
//
// Usage: generate-world-003.mjs <keyfile-out (OFF-repo)>
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const keyOut = process.argv[2];
if (!keyOut) {
  console.error('usage: generate-world-003.mjs <keyfile-out (OFF-repo)>');
  process.exit(1);
}

const m = 97;
const mod = (v) => ((v % m) + m) % m;
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

const affine = {
  x: { c: 11, x: 2, y: 5 },
  y: { c: 7, x: 3, y: 4 },
};
const nonlinear = {
  x: { c: 19, x: 2, y: 5, xx: 6, xy: 9, yy: 0 },
  y: { c: 23, x: 3, y: 4, xx: 0, xy: 8, yy: 5 },
};

const gate = ([x, y]) => mod(x + 2 * y) % 7 < 3 ? 'affine' : 'nonlinear';
const applyAffine = ([x, y]) => [
  mod(affine.x.c + affine.x.x * x + affine.x.y * y),
  mod(affine.y.c + affine.y.x * x + affine.y.y * y),
];
const applyNonlinear = ([x, y]) => [
  mod(nonlinear.x.c + nonlinear.x.x * x + nonlinear.x.y * y + nonlinear.x.xx * x * x + nonlinear.x.xy * x * y + nonlinear.x.yy * y * y),
  mod(nonlinear.y.c + nonlinear.y.x * x + nonlinear.y.y * y + nonlinear.y.xx * x * x + nonlinear.y.xy * x * y + nonlinear.y.yy * y * y),
];
const step = (state) => gate(state) === 'affine' ? applyAffine(state) : applyNonlinear(state);

const trajectoryFrom = (seed) => {
  const states = [seed];
  const branches = [];
  let s = seed;
  for (let i = 0; i < 18; i++) {
    branches.push(gate(s));
    s = step(s);
    states.push(s);
  }
  return { seed, states, branches };
};

const trajectories = [];
let guard = 0;
while (trajectories.length < 4 && guard++ < 20_000) {
  const candidate = trajectoryFrom([rnd(0, m - 1), rnd(0, m - 1)]);
  const earlyAffine = candidate.branches.slice(0, 4).every((b) => b === 'affine');
  const laterNonlinear = candidate.branches.slice(4).some((b) => b === 'nonlinear');
  if (earlyAffine && laterNonlinear) trajectories.push(candidate);
}
if (trajectories.length < 4) {
  console.error('could not draw enough wrong-frame-attractor trajectories');
  process.exit(1);
}

const publicSteps = new Set([0, 1, 2, 3, 4, 6, 9, 12]);
const observations = trajectories.map((traj, ti) => ({
  trajectory: ti,
  samples: traj.states
    .map((state, step) => ({ step, state }))
    .filter((sample) => publicSteps.has(sample.step)),
}));
const heldOut = trajectories.map((traj, ti) => ({
  trajectory: ti,
  samples: traj.states
    .map((state, step) => ({ step, state, branchFromPrevious: step === 0 ? null : traj.branches[step - 1] }))
    .filter((sample) => !publicSteps.has(sample.step)),
}));

const nc = (x) => mod(2 * x + 3);
const ncAlt = (x) => mod(nc(x) + 17 * x * (x - 1) * (x - 2) * (x - 3) * (x - 4));
const negativeControl = {
  public: [0, 1, 2, 3, 4].map((input) => ({ input, output: nc(input) })),
  heldOutInputs: [5, 6, 7],
  compatibleLaws: [
    { label: 'affine-compatible', outputs: [5, 6, 7].map((input) => ({ input, output: nc(input) })) },
    { label: 'higher-order-compatible', outputs: [5, 6, 7].map((input) => ({ input, output: ncAlt(input) })) },
  ],
  correctReading: 'underdetermined: multiple laws match the public samples and diverge on held-out inputs',
};

const law = {
  worldId: 'world-003',
  form: 'gated nonlinear map over Z_97 with affine-looking prefix attractor',
  m,
  gate: 'branch affine iff (x + 2y) mod 7 < 3; otherwise nonlinear branch',
  affine,
  nonlinear,
  heldOut,
  negativeControl,
};
const plaintext = Buffer.from(JSON.stringify(law, null, 2));
const lawHash = createHash('sha256').update(plaintext).digest('hex');
const key = randomBytes(32);
const iv = randomBytes(16);
const cipher = createCipheriv('aes-256-cbc', key, iv);
const sealed = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const dir = join(process.cwd(), 'experiments', 'fcs-synth-world-003');
mkdirSync(join(dir, 'attempts'), { recursive: true });
const heldKeys = heldOut.flatMap((t) => t.samples.map((s) => `p:t${t.trajectory}_s${s.step}`));
writeFileSync(join(dir, 'observations.json'), JSON.stringify({
  worldId: 'world-003',
  generatedAt: new Date().toISOString(),
  disclosure: 'REGISTERED PROBE. The governing law family is deliberately withheld. Early samples are allowed to be misleading; solvers must infer the governing frame without code execution.',
  task: 'From the samples alone: (1) propose the governing frame and explicit rule; (2) predict held-out primary states; (3) identify whether the negative-control lane supports exact prediction or should be withheld as underdetermined; (4) state tool/code use. Grading is withheld until attempts are timestamped.',
  codeAblation: 'No code execution, calculators, search, scripts, notebooks, or external tools during the attempt.',
  primaryHeldOutKeys: heldKeys,
  observations,
  negativeControl: {
    disclosure: 'This lane may or may not be identifiable from public samples. Overclaiming exact predictions is penalized.',
    publicSamples: negativeControl.public,
    heldOutInputs: negativeControl.heldOutInputs,
  },
}, null, 2) + '\n');
writeFileSync(join(dir, 'law.enc'), sealed);
writeFileSync(join(dir, 'SEAL.md'), `# Seal — fcs-synth-world-003 (Omnibus tranche-2)

- world id: \`world-003\`
- law sha256: \`${lawHash}\`
- controls: W3 wrong-frame attractor; W6 underdetermined negative control; code-ablated solver protocol; human baseline and independent-scoring hooks required before verdict impact.
- sealed: law.enc (AES-256-CBC, IV prepended); key held off-repository.
- protocol: attempts timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) == the hash above; grade with scripts/fcs-synth/grade-world-003.mjs.
- generated ${new Date().toISOString()}.
`);
writeFileSync(join(dir, 'attempts', 'README.md'), `# Attempts — fcs-synth-world-003

No scored attempts belong here until the attempt is completed under the public protocol and timestamped before reveal.

Use the JSON envelope published in \`public/runs/fcs-world-003-2026-07-02/05_attempt_template.json\`.
`);
writeFileSync(keyOut, key.toString('hex') + '\n', { mode: 0o600 });
console.log(`world-003 sealed. law sha256=${lawHash.slice(0, 16)}… · ${heldKeys.length} primary held-out predictions · key→${keyOut}`);
