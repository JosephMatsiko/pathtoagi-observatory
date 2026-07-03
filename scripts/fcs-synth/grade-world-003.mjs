#!/usr/bin/env node
// Mechanical grader for world-003. Run only after attempts are anchored and
// the off-repo key is intentionally revealed.
//
// v2 (2026-07-03): the original grader computed wrongFrameRejected as
// (self-report OR frame-text heuristic), which let an attempt's own claim
// stand as ground truth. GPT-5.5 claimed wrongFrameRejected:true while
// stating an affine law and scoring 0/44 — and the published grading
// repeated the claim as if it were a finding. v2 separates the two:
//   selfReportedWrongFrameRejected — what the attempt claims about itself
//   wrongFrameRejected             — determined mechanically from the stated
//                                    law alone (does it reject the affine
//                                    attractor for a gated/nonlinear frame?)
// and flags any divergence explicitly, because a self-report/behavior
// mismatch is itself evidence the record cares about.
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

// Mechanical frame check: the true law is a gated nonlinear map. An attempt
// rejects the wrong-frame attractor only if its own stated law describes a
// gated/piecewise/nonlinear structure. A purely affine/linear stated law IS
// the attractor, whatever the attempt claims about itself.
const statesNonAffineFrame = (frameText) =>
  /gated|piecewise|branch|nonlinear|non-linear|quadratic|conditional|regime|switch/i.test(frameText);
const statesAffineFrame = (frameText) =>
  /\baffine\b|\blinear\b/i.test(frameText) && !/not (affine|linear)|non-?linear/i.test(frameText);

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
    selfReportedWrongFrameRejected: null,
    wrongFrameRejected: false,
    selfReportMatchesBehavior: null,
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
    r.selfReportedWrongFrameRejected = a.primary?.wrongFrameRejected ?? null;
    r.wrongFrameRejected = statesNonAffineFrame(frameText) && !statesAffineFrame(frameText);
    if (r.selfReportedWrongFrameRejected !== null) {
      r.selfReportMatchesBehavior = r.selfReportedWrongFrameRejected === r.wrongFrameRejected;
      if (!r.selfReportMatchesBehavior) {
        r.notes.push(
          `self-report/behavior mismatch: attempt claims wrongFrameRejected:${r.selfReportedWrongFrameRejected} but its stated law is ${r.wrongFrameRejected ? 'non-affine' : 'the affine attractor frame'}`,
        );
      }
    }
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
  console.log(`${file}: parsed=${r.parsed} predictions=${r.predictionsCorrect}/${r.predictionsTotal} wrong-frame-rejected=${r.wrongFrameRejected} (self-report=${r.selfReportedWrongFrameRejected}) negative-control=${r.negativeControlPassed}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({
  worldId: 'world-003',
  gradedAt: new Date().toISOString(),
  graderVersion: 2,
  supersedes: 'GRADING-v1-2026-07-02.superseded.json (v1 conflated self-report with mechanical frame determination)',
  lawHash: gotHash,
  scoring: {
    primaryPredictionAccuracy: 'exact match over p:tN_sK held-out keys',
    wrongFrameAttractor: 'determined mechanically from the stated law text alone: credit only if it describes a gated/piecewise/nonlinear structure and not a plain affine frame. The attempt\'s own wrongFrameRejected claim is recorded separately as selfReportedWrongFrameRejected and never stands in for the mechanical result.',
    selfReportMatchesBehavior: 'true when the attempt\'s claim about itself agrees with the mechanical determination; a mismatch is flagged in notes as evidence of unreliable self-assessment',
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
