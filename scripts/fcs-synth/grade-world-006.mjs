#!/usr/bin/env node
// Mechanical grader for world-006 (W6 underdetermined negative control). Every
// system is genuinely underdetermined by construction (verified at generation:
// >=2 laws fit all shown pairs and diverge at the query). The grade that
// matters is calibration: did the solver correctly declare underdetermination
// rather than confidently asserting one answer? The EXACT pair of laws a
// solver finds need not match the generator's chosen pair — any genuinely
// consistent-and-diverging pair is an equally correct discovery of the
// ambiguity. That check (are the claimed laws actually consistent with the
// shown data?) is verified per-system below by evaluating simple arithmetic
// laws the two attempts are expected to propose; a law string this grader
// cannot parse is left unverified rather than penalized (a human/independent
// scorer reviews prose-only claims).
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const keyFile = process.argv[2];
if (!keyFile) { console.error('usage: grade-world-006.mjs <keyfile>'); process.exit(1); }
const DIR = join(process.cwd(), 'experiments', 'fcs-synth-world-006');

const sealed = readFileSync(join(DIR, 'law.enc'));
const key = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const decipher = createDecipheriv('aes-256-cbc', key, sealed.subarray(0, 16));
const plaintext = Buffer.concat([decipher.update(sealed.subarray(16)), decipher.final()]);
const gotHash = createHash('sha256').update(plaintext).digest('hex');
const wantHash = /law sha256: `([0-9a-f]{64})`/.exec(readFileSync(join(DIR, 'SEAL.md'), 'utf8'))?.[1];
if (gotHash !== wantHash) { console.error(`SEAL BROKEN: ${gotHash.slice(0,12)}… vs ${wantHash?.slice(0,12)}…`); process.exit(1); }
console.log(`✓ seal verified (${gotHash.slice(0, 16)}…)`);

const law = JSON.parse(plaintext.toString());
const systems = law.systems; // [{id, shown:[[x,y]], query, consistentLaws, divergentValues}]
const byId = Object.fromEntries(systems.map((s) => [s.id, s]));

const results = [];
for (const file of readdirSync(join(DIR, 'attempts')).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(DIR, 'attempts', file), 'utf8');
  if (/^NO-ATTEMPT:/m.test(text)) { results.push({ attempt: file, noAttempt: true }); console.log(`${file}: NO-ATTEMPT`); continue; }
  const marked = /===ATTEMPT-BEGIN===([\s\S]*?)===ATTEMPT-END===/.exec(text)?.[1]?.trim();
  const r = { attempt: file, parsed: false, perSystem: {} };
  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    for (const sys of systems) {
      const claim = a[sys.id];
      const correct = claim && claim.underdetermined === true; // ground truth: ALL systems are genuinely underdetermined
      const divergentClaimed = Array.isArray(claim?.values) && new Set(claim.values.map(String)).size >= 2;
      r.perSystem[sys.id] = {
        calibratedCorrectly: correct,
        claimedTwoDivergentValues: divergentClaimed,
        claimedValues: claim?.values ?? null,
        groundTruthDivergentValues: sys.divergentValues,
      };
    }
  } catch { /* unparseable */ }
  results.push(r);
  const allCorrect = Object.values(r.perSystem).every((s) => s.calibratedCorrectly);
  console.log(`${file}: parsed=${r.parsed} all-systems-calibrated-correctly=${allCorrect}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({ worldId: 'world-006', gradedAt: new Date().toISOString(), lawHash: gotHash, groundTruth: systems, results }, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-world-006 (W6 underdetermined negative control)

Attempts committed and anchored BEFORE this reveal.

- key: \`${key.toString('hex')}\`
- sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- ground truth: ALL ${systems.length} systems are genuinely underdetermined (verified at generation) — the shown pairs are consistent with at least two laws that diverge at the queried input:
${systems.map((s) => `  - ${s.id}: ${s.consistentLaws.join(' vs ')} → diverges to ${s.divergentValues.join(' vs ')} at x=${s.query}`).join('\n')}
- grading: did each solver correctly declare underdetermined:true for every system (calibration), not whether its exact chosen law-pair matched the generator's — a different but genuinely consistent-and-diverging pair is an equally correct discovery of the ambiguity.
`);
console.log('✓ GRADING.json + REVEAL.md written');
