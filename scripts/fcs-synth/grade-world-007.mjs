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
    decoyDeclaredInert: null,
    decoyFoldedIntoLaw: false,
    decoyCorrectlyIdentified: false,
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
    r.decoyDeclaredInert = a.primary?.decoyIdentified === true;
    const lawText = String(a.primary?.law ?? '');
    // mechanical checks on the stated law itself: if the equation for x' or y'
    // mentions w as a term, the decoy was folded in; if w's own update mentions
    // x or y, the declared independence is contradicted by the law as stated
    const xyEquations = lawText.split(';').filter((eq) => /^\s*[xy]'/.test(eq));
    r.decoyFoldedIntoLaw = xyEquations.some((eq) => /\bw\b/.test(eq));
    const wEquations = lawText.split(';').filter((eq) => /^\s*w'/.test(eq));
    const wUsesXY = wEquations.some((eq) => /\b[xy]\b/.test(eq));
    // the declaration is the attempt's answer to the causal-structure question,
    // but it only counts as correct identification when the stated law backs it up
    r.decoyCorrectlyIdentified = r.decoyDeclaredInert && !r.decoyFoldedIntoLaw && !wUsesXY;
    if (r.decoyFoldedIntoLaw) r.notes.push('law folds w into the x or y update — fell for the decoy despite prediction accuracy');
    if (r.decoyDeclaredInert && (r.decoyFoldedIntoLaw || wUsesXY)) {
      r.notes.push('declaration/law mismatch: attempt declares w inert but its stated law contradicts that');
    }
  } catch {
    r.notes.push('attempt envelope missing or unparseable');
  }

  results.push(r);
  console.log(`${file}: parsed=${r.parsed} xy=${r.xyPredictionsCorrect}/${r.predictionsTotal} w=${r.wPredictionsCorrect}/${r.predictionsTotal} decoy-declared-inert=${r.decoyDeclaredInert} decoy-folded-in=${r.decoyFoldedIntoLaw} decoy-correctly-identified=${r.decoyCorrectlyIdentified}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({
  worldId: 'world-007',
  gradedAt: new Date().toISOString(),
  lawHash: gotHash,
  graderVersion: 2,
  scoring: {
    xyPredictionAccuracy: 'exact match over tN_sK held-out keys, for (x, y) only',
    wPredictionAccuracy: 'exact match over tN_sK held-out keys, for w only — trivial if the clock rule is found',
    decoyDeclaredInert: "the attempt's explicit answer to the causal-structure question, recorded as declared",
    decoyFoldedIntoLaw: 'mechanical: penalize if the stated x or y update equation references w at all, regardless of prediction accuracy',
    decoyCorrectlyIdentified: 'credit only when the inert declaration is corroborated by the stated law itself (no w in the x/y updates, no x/y in the w update) — a declaration alone never stands in for the mechanical check',
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
