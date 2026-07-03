#!/usr/bin/env node
// FCS-synth world-007 — the decoy-dimension trap.
//
// Three visible integer state variables mod m. Two of them (x, y) evolve
// under a genuine coupled linear law. The third (w) is a pure decoy: it
// cycles with a simple, highly regular period that has no causal bearing on
// (x, y) at all, but is sampled alongside them at every observation, so a
// mind under pressure to "use all the data" is tempted to fold w into its
// fitted law as an explanatory variable. The correct frame construction is
// to notice w is causally inert and discard it — the frame-construction
// analogue of a spurious correlate that any sufficiently complex model can
// be made to "explain".
//
// Held out: predictions for (x, y, w) at unseen steps. Grading credits a
// law that correctly predicts (x, y) using only the true coupled rule AND
// explicitly identifies w as non-causal; it penalizes a law that folds w
// into the update rule for x or y even if predictions happen to hold on
// the sparse public sample (overfitting the decoy is the trap).
//
// Usage: generate-world-007.mjs <keyfile-out (OFF-repo)>
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const keyOut = process.argv[2];
if (!keyOut) {
  console.error('usage: generate-world-007.mjs <keyfile-out (OFF-repo)>');
  process.exit(1);
}

const m = 101; // prime modulus, distinct from earlier worlds (97) to avoid any cross-world leakage
const mod = (v) => ((v % m) + m) % m;
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

// The true law on (x, y): a coupled linear map.
const a = rnd(2, m - 1), b = rnd(1, m - 1), c = rnd(2, m - 1), d = rnd(1, m - 1);
const step = ([x, y, w], t) => [
  mod(a * x + b * y),
  mod(c * y + d * x),
  mod(w + decoyPeriod), // w just marches forward at a fixed stride — regular, but causally disconnected from x, y
];

// The decoy: a fixed stride that makes w look like a clean linear clock.
// Chosen so gcd(decoyPeriod, m) === 1 (full period m), making w look exactly
// as lawful as x and y at a glance.
let decoyPeriod;
do { decoyPeriod = rnd(2, m - 2); } while (m % decoyPeriod === 0);

const trajectories = [];
for (let t = 0; t < 4; t++) {
  let s = [rnd(0, m - 1), rnd(0, m - 1), rnd(0, m - 1)];
  const traj = [s];
  for (let i = 0; i < 30; i++) { s = step(s, i); traj.push(s); }
  trajectories.push(traj);
}

const observations = trajectories.map((traj, ti) => ({
  trajectory: ti,
  samples: traj
    .map((state, i) => ({ step: i, state }))
    .filter(({ step: i }) => i % 3 === 0 || i < 4),
}));
const heldOut = trajectories.map((traj, ti) => ({
  trajectory: ti,
  samples: traj.map((state, i) => ({ step: i, state })).filter(({ step: i }) => !(i % 3 === 0 || i < 4)),
}));

const law = {
  family: 'two coupled linear integer maps (x, y) mod m, plus one causally-inert clock variable (w) sampled alongside them',
  m,
  params: { a, b, c, d, decoyPeriod },
  trueUpdate: `x' = ${a}x + ${b}y (mod ${m}); y' = ${c}y + ${d}x (mod ${m}); w' = w + ${decoyPeriod} (mod ${m}) — w is NOT a function of x or y and does not feed back into them`,
  trap: 'w advances by a constant stride every step, so it looks exactly as lawful as x and y, and its value is correlated with step count the same way any clock variable would be. A model that includes w as an input to the update rule for x or y is fitting a decoy; the correct frame states x,y update from (x,y) alone and w is an independent, causally inert clock.',
  heldOut,
};

const plaintext = Buffer.from(JSON.stringify(law, null, 2));
const lawHash = createHash('sha256').update(plaintext).digest('hex');
const key = randomBytes(32);
const iv = randomBytes(16);
const cipher = createCipheriv('aes-256-cbc', key, iv);
const sealed = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const worldId = 'world-007';
const dir = join(process.cwd(), 'experiments', `fcs-synth-${worldId}`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'observations.json'), JSON.stringify({
  worldId,
  generatedAt: new Date().toISOString(),
  lawFamily: 'Public: three integer state variables (x, y, w) mod a prime, sampled together at every observation. The update rule, the modulus, and whether all three variables are causally connected are secret.',
  task: 'From the samples alone: (1) state the update law for each variable, (2) state which variables (if any) are causally disconnected from the others, (3) predict the held-out states for x, y, and w. Graded on held-out predictive accuracy for x and y, correct identification of w as causally inert (or not), and whether the stated law wrongly uses w to predict x or y.',
  observations,
}, null, 2) + '\n');
writeFileSync(join(dir, 'law.enc'), sealed);
writeFileSync(join(dir, 'SEAL.md'), `# Seal — fcs-synth-${worldId}

- law sha256: \`${lawHash}\`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository by the operator
- protocol: attempts are timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) equals the hash above, then grade attempts on held-out predictions + causal-structure identification.
- generated: ${new Date().toISOString()} by scripts/fcs-synth/generate-world-007.mjs (the law family is public in that script; the drawn parameters are the secret).
- design note: this world's trap is a decoy dimension (w), not a wrong-frame attractor on the same variables as world-003. It targets a distinct failure mode: folding a causally inert, superficially regular variable into an explanatory law because it was sampled alongside the causal ones.
`);
writeFileSync(keyOut, key.toString('hex') + '\n', { mode: 0o600 });
console.log(`world ${worldId}: sealed. law sha256=${lawHash.slice(0, 16)}… key→${keyOut} (keep OFF-repo)`);
