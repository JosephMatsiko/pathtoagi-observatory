#!/usr/bin/env node
// Mechanical grader for world-007 (the decoy-dimension trap). Run only after
// attempts are anchored and the off-repo key is intentionally revealed.
//
// Usage: grade-world-007.mjs <keyfile>
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const keyFile = process.argv[2];
if (!keyFile) {
  console.error('usage: grade-world-007.mjs <keyfile>');
  process.exit(1);
}

const DIR = join(process.cwd(), 'experiments', 'fcs-synth-world-007');
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
const mod = (v) => ((v % law.m) + law.m) % law.m;
const truth = {};
for (const t of law.heldOut) {
  for (const s of t.samples) truth[`t${t.trajectory}_s${s.step}`] = s.state;
}
const truthKeys = Object.keys(truth);
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
    xyPredictionsCorrect: 0,
    wPredictionsCorrect: 0,
    predictionsTotal: truthKeys.length,
    decoyCorrectlyIdentified: false,
    decoyFoldedIntoLaw: false,
    notes: [],
  };

  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    for (const [k, v] of Object.entries(truth)) {
      const p = a.primary?.predictions?.[k];
      if (Array.isArray(p) && p.length === 3) {
        if (mod(Number(p[0])) === mod(v[0]) && mod(Number(p[1])) === mod(v[1])) r.xyPredictionsCorrect++;
        if (mod(Number(p[2])) === mod(v[2])) r.wPredictionsCorrect++;
      }
    }
    r.decoyCorrectlyIdentified = a.primary?.decoyIdentified === true;
    const lawText = String(a.primary?.law ?? '');
    // crude but effective: if the equation for x' or y' mentions w as a term, the decoy was folded in
    const xyEquations = lawText.split(';').filter((eq) => /^\s*[xy]'/.test(eq));
    r.decoyFoldedIntoLaw = xyEquations.some((eq) => /\bw\b/.test(eq));
    if (r.decoyFoldedIntoLaw) r.notes.push('law folds w into the x or y update — fell for the decoy despite prediction accuracy');
  } catch {
    r.notes.push('attempt envelope missing or unparseable');
  }

  results.push(r);
  console.log(`${file}: parsed=${r.parsed} xy=${r.xyPredictionsCorrect}/${r.predictionsTotal} w=${r.wPredictionsCorrect}/${r.predictionsTotal} decoy-identified=${r.decoyCorrectlyIdentified} decoy-folded-in=${r.decoyFoldedIntoLaw}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({
  worldId: 'world-007',
  gradedAt: new Date().toISOString(),
  lawHash: gotHash,
  scoring: {
    xyPredictionAccuracy: 'exact match over tN_sK held-out keys, for (x, y) only',
    wPredictionAccuracy: 'exact match over tN_sK held-out keys, for w only — trivial if the clock rule is found',
    decoyIdentification: 'credit if the attempt explicitly declares w causally inert',
    decoyFoldedIntoLaw: 'penalize if the stated x or y update equation references w at all, regardless of prediction accuracy',
  },
  results,
}, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-world-007

Attempts must be committed and timestamp-anchored before this file is published.

- key (AES-256-CBC, IV = first 16 bytes of law.enc): \`${key.toString('hex')}\`
- sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- true update: ${law.trueUpdate}
- trap: ${law.trap}

The reveal establishes grading truth. It does not by itself move the public verdict.
`);
console.log('✓ GRADING.json + REVEAL.md written');
