#!/usr/bin/env node
// FCS-synth world-002 — the hardened probe (v0.4). Two ablations over
// world-001, both aimed at precedent P-9: (1) the frame family is NOT
// disclosed to the solver — the prompt says only "a deterministic system",
// so the solver must hypothesize the class of law, which is the frame move;
// (2) the dynamics are NONLINEAR (a quadratic coupled map modulo a prime),
// so a linear-recurrence fit — the mechanical solution to world-001 — fails.
// A strong result here bears on frame construction proper; a weak one is real
// evidence against it under the suite's asymmetry. Law sealed, key off-repo,
// sha256 committed. Usage: generate-world-002.mjs <keyfile-out>
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const keyOut = process.argv[2];
if (!keyOut) { console.error('usage: generate-world-002.mjs <keyfile-out (OFF-repo)>'); process.exit(1); }

const m = 101; // prime modulus (secret)
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const mod = (v) => ((v % m) + m) % m;

// Nonlinear quadratic coupled map over the monomial basis {1, x, y, x^2, xy, y^2}.
// Coefficients drawn nonzero on at least one quadratic term per equation so the
// system genuinely resists a linear fit.
const draw = () => ({ c: rnd(0, m - 1), x: rnd(0, m - 1), y: rnd(0, m - 1), xx: rnd(1, m - 1), xy: rnd(1, m - 1), yy: rnd(0, m - 1) });
const CX = draw(), CY = draw();
const step = ([x, y]) => [
  mod(CX.c + CX.x * x + CX.y * y + CX.xx * x * x + CX.xy * x * y + CX.yy * y * y),
  mod(CY.c + CY.x * x + CY.y * y + CY.xx * x * x + CY.xy * x * y + CY.yy * y * y),
];

// Trajectories; public = irregular early samples, held-out = the rest.
const trajectories = [];
for (let t = 0; t < 5; t++) {
  let s = [rnd(0, m - 1), rnd(0, m - 1)];
  const traj = [s];
  for (let i = 0; i < 24; i++) { s = step(s); traj.push(s); }
  trajectories.push(traj);
}
const isPublic = (i) => i % 3 === 0 || i < 5;
const observations = trajectories.map((traj, ti) => ({ trajectory: ti, samples: traj.map((state, i) => ({ step: i, state })).filter(({ step: i }) => isPublic(i)) }));
const heldOut = trajectories.map((traj, ti) => ({ trajectory: ti, samples: traj.map((state, i) => ({ step: i, state })).filter(({ step: i }) => !isPublic(i)) }));

const law = { form: 'nonlinear quadratic coupled map mod m over basis {1,x,y,x^2,xy,y^2}', m, coeffX: CX, coeffY: CY, heldOut };
const plaintext = Buffer.from(JSON.stringify(law, null, 2));
const lawHash = createHash('sha256').update(plaintext).digest('hex');
const key = randomBytes(32), iv = randomBytes(16);
const cipher = createCipheriv('aes-256-cbc', key, iv);
const sealed = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const dir = join(process.cwd(), 'experiments', 'fcs-synth-world-002');
mkdirSync(dir, { recursive: true });
const heldKeys = heldOut.flatMap((t) => t.samples.map((s) => `t${t.trajectory}_s${s.step}`));
writeFileSync(join(dir, 'observations.json'), JSON.stringify({
  worldId: 'world-002',
  generatedAt: new Date().toISOString(),
  disclosure: 'HARDENED PROBE. The class of the governing law is deliberately NOT disclosed. You are told only that the system is deterministic and integer-valued. Identifying what kind of law governs it is part of the task — that is the frame move under test.',
  task: 'From the samples alone: (1) determine the rule that advances the state, stating it explicitly; (2) predict the held-out states exactly; (3) state any invariant or structural property you find. Graded mechanically on held-out prediction accuracy.',
  heldOutKeys: heldKeys,
  observations,
}, null, 2) + '\n');
writeFileSync(join(dir, 'law.enc'), sealed);
writeFileSync(join(dir, 'SEAL.md'), `# Seal — fcs-synth-world-002 (hardened, v0.4)

- law sha256: \`${lawHash}\`
- ablations vs world-001: frame family WITHHELD from the solver; dynamics NONLINEAR (quadratic) so a linear fit fails.
- sealed: law.enc (AES-256-CBC, IV prepended); key held off-repository.
- protocol: attempts timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) == the hash above; grade on held-out prediction accuracy (scripts/fcs-synth/grade-world-002.mjs).
- generated ${new Date().toISOString()}.
`);
writeFileSync(keyOut, key.toString('hex') + '\n', { mode: 0o600 });
console.log(`world-002 sealed. law sha256=${lawHash.slice(0, 16)}… · ${heldKeys.length} held-out predictions · key→${keyOut}`);
