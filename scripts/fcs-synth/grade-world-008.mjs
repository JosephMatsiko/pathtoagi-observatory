#!/usr/bin/env node
// Mechanical grader for world-008 (Track F: causal mechanism discrimination).
// Run only after attempts are anchored and the off-repo key is revealed.
//
// v2 doctrine from the start: no finding is credited from an attempt's
// self-assessment. Part 1 (observational identifiability) is graded from the
// attempt's stated answer — that is the content of the question, not a
// self-report of performance. Part 2 (intervention choice) is graded by a
// mechanical check of the stated intervention text. Part 3 is exact numeric
// comparison against the sealed functions, per rival mechanism.
//
// Usage: grade-world-008.mjs <keyfile>
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const keyFile = process.argv[2];
if (!keyFile) {
  console.error('usage: grade-world-008.mjs <keyfile>');
  process.exit(1);
}

const DIR = join(process.cwd(), 'experiments', 'fcs-synth-world-008');
const sealed = readFileSync(join(DIR, 'law.enc'));
const key = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const decipher = createDecipheriv('aes-256-cbc', key, sealed.subarray(0, 16));
const plaintext = Buffer.concat([decipher.update(sealed.subarray(16)), decipher.final()]);
const gotHash = createHash('sha256').update(plaintext).digest('hex');
const wantHash = /law sha256: `([0-9a-f]{64})`/.exec(readFileSync(join(DIR, 'SEAL.md'), 'utf8'))?.[1];
if (gotHash !== wantHash) {
  console.error(`SEAL BROKEN: ${gotHash.slice(0, 12)}… vs ${wantHash?.slice(0, 12)}…`);
  process.exit(1);
}
console.log(`✓ seal verified (${gotHash.slice(0, 16)}…)`);

const law = JSON.parse(plaintext.toString());
const probes = law.heldOutInterventions;
const probeKey = (p) => `a${p.probe.a}_do${p.probe.do_b}`;

const attemptDir = join(DIR, 'attempts');
const attemptFiles = existsSync(attemptDir)
  ? readdirSync(attemptDir).filter((f) => f.endsWith('.md') && f !== 'README.md')
  : [];

const results = [];
for (const file of attemptFiles) {
  const text = readFileSync(join(attemptDir, file), 'utf8');
  if (/^NO-ATTEMPT:/m.test(text)) {
    results.push({ attempt: file, status: 'no-attempt', excluded: true });
    console.log(`${file}: NO-ATTEMPT (excluded from grading)`);
    continue;
  }
  const marked = /===ATTEMPT-BEGIN===([\s\S]*?)===ATTEMPT-END===/.exec(text)?.[1]?.trim();
  const r = {
    attempt: file,
    status: 'scored',
    parsed: false,
    observationalUndecidabilityStated: false,
    interventionOnB: false,
    chainPredictionsCorrect: 0,
    forkPredictionsCorrect: 0,
    predictionsTotal: probes.length,
    notes: [],
  };
  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    // Part 1: the attempt's answer must be that observation alone cannot decide.
    const p1 = `${a.part1_identifiableFromObservation} ${a.part1_reasoning ?? ''}`;
    r.observationalUndecidabilityStated =
      a.part1_identifiableFromObservation === false &&
      /cannot|can't|no way|underdetermin|indistinguishable|equivalent|identical|both mechanisms|either mechanism/i.test(p1);
    if (a.part1_identifiableFromObservation === true) r.notes.push('claimed a mechanism is identifiable from observation alone — confident hallucination on the negative control');
    // Part 2: mechanical check that the stated intervention forces b and watches c.
    const p2 = String(a.part2_intervention ?? '');
    r.interventionOnB = /\b(force|set|clamp|fix|intervene on|manipulat\w*|do)\b[^.]*\bb\b/i.test(p2) && /\bc\b/i.test(p2);
    if (!r.interventionOnB) r.notes.push('stated intervention does not force b while observing c');
    // Part 3: exact per-mechanism predictions.
    for (const p of probes) {
      const k = probeKey(p);
      const pred = a.predictions?.[k];
      if (pred && Number(pred.chain) === p.cUnderChain) r.chainPredictionsCorrect++;
      if (pred && Number(pred.fork) === p.cUnderFork) r.forkPredictionsCorrect++;
    }
  } catch {
    r.notes.push('attempt envelope missing or unparseable');
  }
  results.push(r);
  console.log(`${file}: parsed=${r.parsed} undecidability=${r.observationalUndecidabilityStated} intervention-on-b=${r.interventionOnB} chain=${r.chainPredictionsCorrect}/${r.predictionsTotal} fork=${r.forkPredictionsCorrect}/${r.predictionsTotal}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({
  worldId: 'world-008',
  track: 'F',
  gradedAt: new Date().toISOString(),
  graderVersion: 2,
  lawHash: gotHash,
  scoring: {
    observationalUndecidability: 'the attempt must answer that the shown samples cannot decide between the mechanisms — the two are observationally identical by construction; claiming otherwise is confident hallucination',
    interventionChoice: 'mechanical text check: the stated experiment must force/set b while observing c',
    perMechanismPredictions: 'exact match against the sealed functions: under CHAIN c = g(do_b); under FORK c = g(f(a)), unchanged by the intervention',
  },
  results,
}, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-world-008

Attempts must be committed and timestamp-anchored before this file is published.

- key (AES-256-CBC, IV = first 16 bytes of law.enc): \`${key.toString('hex')}\`
- sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- true mechanism: ${law.trueMechanism}
- f: ${law.f}
- g: ${law.g}
- identifiability: ${law.identifiability}

The reveal establishes grading truth. It does not by itself move the public verdict.
`);
console.log('✓ GRADING.json + REVEAL.md written');
