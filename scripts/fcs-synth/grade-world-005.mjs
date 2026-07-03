#!/usr/bin/env node
// Mechanical grader for world-005 (W3 wrong-frame attractor). The sealed law
// is a conditional-kick linear map: a plain linear fit explains most rows,
// but a hidden congruence condition fires an additive kick ~1/k of the time.
// Primary metric is held-out prediction accuracy (schema-agnostic, honest
// regardless of how a solver labels its hypothesis); secondarily we check
// whether the solver's own words show it noticed/rejected the pure-linear
// attractor rather than averaging the exceptions away.
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const keyFile = process.argv[2];
if (!keyFile) { console.error('usage: grade-world-005.mjs <keyfile>'); process.exit(1); }
const DIR = join(process.cwd(), 'experiments', 'fcs-synth-world-005');

const sealed = readFileSync(join(DIR, 'law.enc'));
const key = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const decipher = createDecipheriv('aes-256-cbc', key, sealed.subarray(0, 16));
const plaintext = Buffer.concat([decipher.update(sealed.subarray(16)), decipher.final()]);
const gotHash = createHash('sha256').update(plaintext).digest('hex');
const wantHash = /law sha256: `([0-9a-f]{64})`/.exec(readFileSync(join(DIR, 'SEAL.md'), 'utf8'))?.[1];
if (gotHash !== wantHash) { console.error(`SEAL BROKEN: ${gotHash.slice(0,12)}… vs ${wantHash?.slice(0,12)}…`); process.exit(1); }
console.log(`✓ seal verified (${gotHash.slice(0, 16)}…)`);

const law = JSON.parse(plaintext.toString());
const { m, params: P, heldOut } = law;
const mod = (v) => ((v % m) + m) % m;
const truth = {};
for (const t of heldOut) for (const s of t.samples) truth[`t${t.trajectory}_s${s.step}`] = s.state;
const totalKeys = Object.keys(truth).length;

const results = [];
for (const file of readdirSync(join(DIR, 'attempts')).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(DIR, 'attempts', file), 'utf8');
  if (/^NO-ATTEMPT:/m.test(text)) { results.push({ attempt: file, noAttempt: true }); console.log(`${file}: NO-ATTEMPT`); continue; }
  const marked = /===ATTEMPT-BEGIN===([\s\S]*?)===ATTEMPT-END===/.exec(text)?.[1]?.trim();
  const r = { attempt: file, parsed: false, predictionsCorrect: 0, predictionsTotal: totalKeys, noticedConditional: false, stated: null };
  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    r.stated = a.law ?? null;
    r.noticedConditional = /condition|except|congru|kick|residue|mod(?!ulus\b)|remainder|sometimes|deviat|anomal|not (always|purely) linear/i.test(`${a.law} ${a.class ?? ''} ${a.confidence ?? ''}`);
    for (const [k, v] of Object.entries(truth)) {
      const p = a.predictions?.[k];
      if (Array.isArray(p) && p.length === 2 && p.every((x, i) => mod(x) === mod(v[i]))) r.predictionsCorrect++;
    }
  } catch { /* unparseable */ }
  results.push(r);
  console.log(`${file}: parsed=${r.parsed} predictions=${r.predictionsCorrect}/${r.predictionsTotal} noticedConditional=${r.noticedConditional}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({ worldId: 'world-005', gradedAt: new Date().toISOString(), lawHash: gotHash, results }, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-world-005 (W3 wrong-frame attractor)

Attempts committed and anchored BEFORE this reveal.

- key: \`${key.toString('hex')}\`
- sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- the law (mod ${m}): x' = ${P.a}x + ${P.b}y [+${P.q1} if (x+y)%${P.k}==0], y' = ${P.c}x + ${P.d}y [+${P.q2} if kick]
- the deliberate attractor: a naive linear fit on x'=${P.a}x+${P.b}y, y'=${P.c}x+${P.d}y explains most rows but misses the conditional kick (~1/${P.k} of steps)
- grading: held-out prediction accuracy (schema-agnostic); noticedConditional is a text-pattern check on whether the solver's own words show awareness of the exception, not a formal grade.
`);
console.log('✓ GRADING.json + REVEAL.md written');
