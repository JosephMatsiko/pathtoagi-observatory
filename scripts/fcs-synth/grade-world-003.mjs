#!/usr/bin/env node
// Mechanical grader for world-003. Run only after attempts are anchored and
// the off-repo key is intentionally revealed.
//
// Usage: grade-world-003.mjs <keyfile>
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const keyFile = process.argv[2];
if (!keyFile) {
  console.error('usage: grade-world-003.mjs <keyfile>');
  process.exit(1);
}

const DIR = join(process.cwd(), 'experiments', 'fcs-synth-world-003');
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
  for (const s of t.samples) truth[`p:t${t.trajectory}_s${s.step}`] = s.state;
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
    codeAblationDeclared: null,
    wrongFrameRejected: false,
    predictionsCorrect: 0,
    predictionsTotal: truthKeys.length,
    negativeControlPassed: false,
    notes: [],
  };

  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    r.codeAblationDeclared = a.toolUse?.codeUsed === false;
    if (!r.codeAblationDeclared) r.notes.push('code ablation not declared as honored');
    const frameText = `${a.primary?.frame ?? ''} ${a.primary?.law ?? ''}`;
    r.wrongFrameRejected = Boolean(a.primary?.wrongFrameRejected) ||
      /gated|piecewise|branch|nonlinear|quadratic|not affine|not linear/i.test(frameText);
    for (const [k, v] of Object.entries(truth)) {
      const p = a.primary?.predictions?.[k];
      if (Array.isArray(p) && p.length === 2 && p.every((x, i) => mod(Number(x)) === mod(v[i]))) {
        r.predictionsCorrect++;
      }
    }
    const ncText = `${a.negativeControl?.verdict ?? ''} ${a.negativeControl?.reason ?? ''}`;
    const ncPredictions = a.negativeControl?.predictions ?? {};
    r.negativeControlPassed =
      /underdetermined|insufficient|multiple compatible|withhold/i.test(ncText) &&
      Object.keys(ncPredictions).length === 0;
  } catch {
    r.notes.push('attempt envelope missing or unparseable');
  }

  results.push(r);
  console.log(`${file}: parsed=${r.parsed} predictions=${r.predictionsCorrect}/${r.predictionsTotal} wrong-frame-rejected=${r.wrongFrameRejected} negative-control=${r.negativeControlPassed}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({
  worldId: 'world-003',
  gradedAt: new Date().toISOString(),
  lawHash: gotHash,
  scoring: {
    primaryPredictionAccuracy: 'exact match over p:tN_sK held-out keys',
    wrongFrameAttractor: 'credit if the attempt rejects a merely affine/linear frame',
    negativeControl: 'pass only if the lane is called underdetermined and no exact held-out predictions are asserted',
    codeAblation: 'reported from the attempt envelope; external enforcement requires transcript/proctor evidence',
  },
  results,
}, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-world-003

Attempts must be committed and timestamp-anchored before this file is published.

- key (AES-256-CBC, IV = first 16 bytes of law.enc): \`${key.toString('hex')}\`
- sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- primary law: ${law.form}
- branch gate: ${law.gate}
- negative control: ${law.negativeControl.correctReading}

The reveal establishes grading truth. It does not by itself move the public verdict.
`);
console.log('✓ GRADING.json + REVEAL.md written');
