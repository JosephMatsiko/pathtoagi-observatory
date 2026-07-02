#!/usr/bin/env node
// Mechanical grader for world-002 (hardened). Because the frame family was
// withheld, the honest primary metric is held-out prediction accuracy — it
// does not depend on how a solver labels its parameters, only on whether its
// recovered rule reproduces reality. A high score means the solver both
// hypothesized the right class of law AND fit it; a low score is real evidence
// against, under the suite's asymmetry. Run only after attempts are anchored.
// Usage: grade-world-002.mjs <keyfile>
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const keyFile = process.argv[2];
if (!keyFile) { console.error('usage: grade-world-002.mjs <keyfile>'); process.exit(1); }
const DIR = join(process.cwd(), 'experiments', 'fcs-synth-world-002');

const sealed = readFileSync(join(DIR, 'law.enc'));
const key = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const decipher = createDecipheriv('aes-256-cbc', key, sealed.subarray(0, 16));
const plaintext = Buffer.concat([decipher.update(sealed.subarray(16)), decipher.final()]);
const gotHash = createHash('sha256').update(plaintext).digest('hex');
const wantHash = /law sha256: `([0-9a-f]{64})`/.exec(readFileSync(join(DIR, 'SEAL.md'), 'utf8'))?.[1];
if (gotHash !== wantHash) { console.error(`SEAL BROKEN: ${gotHash.slice(0,12)}… vs ${wantHash?.slice(0,12)}…`); process.exit(1); }
console.log(`✓ seal verified (${gotHash.slice(0, 16)}…)`);

const law = JSON.parse(plaintext.toString());
const { m, coeffX: CX, coeffY: CY, heldOut } = law;
const mod = (v) => ((v % m) + m) % m;
const truth = {};
for (const t of heldOut) for (const s of t.samples) truth[`t${t.trajectory}_s${s.step}`] = s.state;
const totalKeys = Object.keys(truth).length;

const results = [];
for (const file of readdirSync(join(DIR, 'attempts')).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(DIR, 'attempts', file), 'utf8');
  // A lane that never received the task is absent, not wrong.
  if (/^NO-ATTEMPT:/m.test(text)) { results.push({ attempt: file, noAttempt: true, reason: 'lane access-capped' }); console.log(`${file}: NO-ATTEMPT (excluded from grading)`); continue; }
  const marked = /===ATTEMPT-BEGIN===([\s\S]*?)===ATTEMPT-END===/.exec(text)?.[1]?.trim();
  const r = { attempt: file, parsed: false, predictionsCorrect: 0, predictionsTotal: totalKeys, identifiedNonlinear: false, statedClass: null };
  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    r.statedClass = a.class ?? null;
    r.identifiedNonlinear = /nonlinear|quadratic|x\^?2|xy|product|bilinear|second[- ]order/i.test(`${a.class} ${a.law}`);
    for (const [k, v] of Object.entries(truth)) {
      const p = a.predictions?.[k];
      if (Array.isArray(p) && p.length === 2 && p.every((x, i) => mod(x) === mod(v[i]))) r.predictionsCorrect++;
    }
  } catch { /* unparseable */ }
  results.push(r);
  console.log(`${file}: parsed=${r.parsed} predictions=${r.predictionsCorrect}/${r.predictionsTotal} nonlinear-identified=${r.identifiedNonlinear} class="${r.statedClass}"`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({ worldId: 'world-002', gradedAt: new Date().toISOString(), lawHash: gotHash, results }, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-world-002 (hardened, v0.4)

Attempts were committed and anchored BEFORE this reveal (git history + timestamps/manifest.json).

- key (AES-256-CBC, IV = first 16 bytes of law.enc): \`${key.toString('hex')}\`
- sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- the law (mod ${m}), on basis {1, x, y, x^2, xy, y^2}:
  - x' = ${CX.c} + ${CX.x}x + ${CX.y}y + ${CX.xx}x^2 + ${CX.xy}xy + ${CX.yy}y^2
  - y' = ${CY.c} + ${CY.x}x + ${CY.y}y + ${CY.xx}x^2 + ${CY.xy}xy + ${CY.yy}y^2
- frame family was WITHHELD from solvers; grading is held-out prediction accuracy (scripts/fcs-synth/grade-world-002.mjs).
`);
console.log('✓ GRADING.json + REVEAL.md written');
