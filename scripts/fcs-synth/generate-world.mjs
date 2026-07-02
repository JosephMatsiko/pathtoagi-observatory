#!/usr/bin/env node
// FCS-synth — manufactured novelty. Generates a world governed by a hidden
// law, emits sparse observations, and seals the law (AES-256 encrypted, key
// held off-repo; SHA-256 of the plaintext committed publicly). A mind is
// asked to construct the law from the observations; grading is predictive
// accuracy on held-out states plus law identification, revealed by publishing
// the key. Contamination floor: zero, by construction — the law never existed
// before this script ran.
//
// Usage: node scripts/fcs-synth/generate-world.mjs <world-id> <keyfile-out>
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const worldId = process.argv[2] ?? 'world-001';
const keyOut = process.argv[3];
if (!keyOut) {
  console.error('usage: generate-world.mjs <world-id> <keyfile-out (kept OFF-repo)>');
  process.exit(1);
}

// ── The hidden law: a coupled integer map with a conserved quantity ──────────
// x' = a·x + b·y (mod m); y' = c·y + d·z (mod m); z' = e·z + f·x (mod m)
// with parameters drawn so that Q = α·x + β·y + γ·z (mod m) is invariant.
// The law family is public (this file); the drawn parameters are the secret.
const m = 97; // prime modulus
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

// Draw a conserved direction, then build the update to preserve it.
let alpha, beta, gamma, a, b, c, d, e, f;
const mod = (v) => ((v % m) + m) % m;
// brute-force small parameter draws until conservation holds symbolically
do {
  [alpha, beta, gamma] = [rnd(1, m - 1), rnd(1, m - 1), rnd(1, m - 1)];
  [a, b, c, d, e, f] = [rnd(2, m - 1), rnd(2, m - 1), rnd(2, m - 1), rnd(2, m - 1), rnd(2, m - 1), rnd(2, m - 1)];
  // conservation: α·a + γ·f ≡ α; α·b + β·c ≡ β; β·d + γ·e ≡ γ (mod m)
} while (
  mod(alpha * a + gamma * f) !== mod(alpha) ||
  mod(alpha * b + beta * c) !== mod(beta) ||
  mod(beta * d + gamma * e) !== mod(gamma)
);

const step = ([x, y, z]) => [mod(a * x + b * y), mod(c * y + d * z), mod(e * z + f * x)];

// ── Observations: sparse windows from a few trajectories ─────────────────────
const trajectories = [];
for (let t = 0; t < 4; t++) {
  let s = [rnd(0, m - 1), rnd(0, m - 1), rnd(0, m - 1)];
  const traj = [s];
  for (let i = 0; i < 30; i++) { s = step(s); traj.push(s); }
  trajectories.push(traj);
}
// Public: irregular samples (with step indices). Held-out: the gaps.
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
  family: 'coupled linear integer maps mod m with one conserved linear quantity',
  m, params: { a, b, c, d, e, f },
  conserved: { alpha, beta, gamma, statement: `Q = ${alpha}x + ${beta}y + ${gamma}z (mod ${m}) is invariant` },
  heldOut,
};

// ── Seal ─────────────────────────────────────────────────────────────────────
const plaintext = Buffer.from(JSON.stringify(law, null, 2));
const lawHash = createHash('sha256').update(plaintext).digest('hex');
const key = randomBytes(32);
const iv = randomBytes(16);
const cipher = createCipheriv('aes-256-cbc', key, iv);
const sealed = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const dir = join(process.cwd(), 'experiments', `fcs-synth-${worldId}`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'observations.json'), JSON.stringify({
  worldId,
  generatedAt: new Date().toISOString(),
  lawFamily: 'Public: three coupled linear integer maps mod a prime, constructed to admit at least one conserved linear quantity. The parameters, the modulus, and the conserved quantity are the secret.',
  task: 'From the samples alone: (1) state the update law, (2) state any conserved quantity, (3) predict the held-out states. Graded on held-out predictive accuracy and law identification when the seal is opened.',
  observations,
}, null, 2) + '\n');
writeFileSync(join(dir, 'law.enc'), sealed);
writeFileSync(join(dir, 'SEAL.md'), `# Seal — fcs-synth-${worldId}

- law sha256: \`${lawHash}\`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository by the operator
- protocol: attempts are timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) equals the hash above, then grade attempts on held-out predictions + law identification.
- generated: ${new Date().toISOString()} by scripts/fcs-synth/generate-world.mjs (the law family is public in that script; the drawn parameters are the secret).
`);
writeFileSync(keyOut, key.toString('hex') + '\n', { mode: 0o600 });
console.log(`world ${worldId}: sealed. law sha256=${lawHash.slice(0, 16)}… key→${keyOut} (keep OFF-repo)`);
