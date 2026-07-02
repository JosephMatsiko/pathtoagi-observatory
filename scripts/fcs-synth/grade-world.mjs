#!/usr/bin/env node
// Mechanical grader for a sealed synthetic world. Run ONLY after attempts are
// committed and anchored. Decrypts the law with the off-repo key, verifies the
// plaintext hash against SEAL.md, then grades each attempt deterministically:
//   · held-out prediction accuracy (exact integer match)
//   · law identification (modulus + params, allowing the trajectory-preserving
//     relabelings the family admits: none — params are canonical here)
//   · conserved-quantity validity (their claimed Q checked against the TRUE
//     dynamics, so any scalar multiple of the true invariant passes)
// Usage: grade-world.mjs <world-id> <keyfile>
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const worldId = process.argv[2] ?? 'world-001';
const keyFile = process.argv[3];
if (!keyFile) { console.error('usage: grade-world.mjs <world-id> <keyfile>'); process.exit(1); }

const DIR = join(process.cwd(), 'experiments', `fcs-synth-${worldId}`);
const sealed = readFileSync(join(DIR, 'law.enc'));
const key = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const iv = sealed.subarray(0, 16);
const decipher = createDecipheriv('aes-256-cbc', key, iv);
const plaintext = Buffer.concat([decipher.update(sealed.subarray(16)), decipher.final()]);
const gotHash = createHash('sha256').update(plaintext).digest('hex');
const sealText = readFileSync(join(DIR, 'SEAL.md'), 'utf8');
const wantHash = /law sha256: `([0-9a-f]{64})`/.exec(sealText)?.[1];
if (gotHash !== wantHash) { console.error(`SEAL BROKEN: hash mismatch (${gotHash.slice(0,12)}… vs ${wantHash?.slice(0,12)}…)`); process.exit(1); }
console.log(`✓ seal verified: sha256(decrypt(law.enc)) matches SEAL.md (${gotHash.slice(0, 16)}…)`);

const law = JSON.parse(plaintext.toString());
const { m, params: P, conserved: C, heldOut } = law;
const mod = (v) => ((v % m) + m) % m;
const truth = {};
for (const t of heldOut) for (const s of t.samples) truth[`t${t.trajectory}_s${s.step}`] = s.state;
const totalKeys = Object.keys(truth).length;

const results = [];
for (const file of readdirSync(join(DIR, 'attempts')).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(DIR, 'attempts', file), 'utf8');
  const marked = /===ATTEMPT-BEGIN===([\s\S]*?)===ATTEMPT-END===/.exec(text)?.[1]?.trim();
  const r = { attempt: file, parsed: false, predictionsCorrect: 0, predictionsTotal: totalKeys, modulusCorrect: false, paramsCorrect: false, conservedValid: false };
  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    r.modulusCorrect = a.modulus === m;
    r.paramsCorrect = ['a','b','c','d','e','f'].every((k) => a.params?.[k] === P[k]);
    if (a.conserved && ['alpha','beta','gamma'].every((k) => Number.isInteger(a.conserved[k]))) {
      const { alpha, beta, gamma } = a.conserved;
      const nonTrivial = mod(alpha) !== 0 || mod(beta) !== 0 || mod(gamma) !== 0;
      // valid iff invariant under the TRUE dynamics (accepts scalar multiples)
      r.conservedValid = nonTrivial &&
        mod(alpha * P.a + gamma * P.f) === mod(alpha) &&
        mod(alpha * P.b + beta * P.c) === mod(beta) &&
        mod(beta * P.d + gamma * P.e) === mod(gamma);
    }
    for (const [k, v] of Object.entries(truth)) {
      const p = a.predictions?.[k];
      if (Array.isArray(p) && p.length === 3 && p.every((x, i) => mod(x) === mod(v[i]))) r.predictionsCorrect++;
    }
  } catch { /* unparseable attempt — graded as such */ }
  results.push(r);
  console.log(`${file}: parsed=${r.parsed} predictions=${r.predictionsCorrect}/${r.predictionsTotal} modulus=${r.modulusCorrect} params=${r.paramsCorrect} conserved=${r.conservedValid}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({ worldId, gradedAt: new Date().toISOString(), lawHash: gotHash, results }, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-${worldId}

Attempts were committed and anchored BEFORE this reveal (see git history and
timestamps/manifest.json). Anyone can now verify the seal and regrade:

- decryption key (AES-256-CBC, IV = first 16 bytes of law.enc): \`${key.toString('hex')}\`
- verify: sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- the law: modulus ${m}; x'=${P.a}x+${P.b}y, y'=${P.c}y+${P.d}z, z'=${P.e}z+${P.f}x (all mod ${m}); conserved Q=${C.alpha}x+${C.beta}y+${C.gamma}z (mod ${m})
- grading is mechanical: scripts/fcs-synth/grade-world.mjs · results in GRADING.json
`);
console.log('✓ GRADING.json + REVEAL.md written');
