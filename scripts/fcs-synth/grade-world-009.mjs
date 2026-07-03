#!/usr/bin/env node
// Mechanical grader for world-009 (undisclosed hypothesis space). Run only
// after attempts are anchored and the off-repo key is revealed.
//
// Grading doctrine (constitution v3 XIII, grader-v2 lineage): the declared
// structure is recorded as the attempt's content but graded ONLY through its
// predictive consequences — exact match on held-out interventional outcomes,
// all four variables per probe. No self-report is credited; no judgment is
// anywhere in the path.
//
// Usage: grade-world-009.mjs <keyfile>
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const keyFile = process.argv[2];
if (!keyFile) {
  console.error('usage: grade-world-009.mjs <keyfile>');
  process.exit(1);
}

const DIR = join(process.cwd(), 'experiments', 'fcs-synth-world-009');
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
const probeKey = (h) => `p${h.probe.p}_do-${h.probe.do_var}-${h.probe.do_value}`;

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
    declaredStructure: null,
    probesFullyCorrect: 0,
    variablesCorrect: 0,
    variablesTotal: probes.length * 4,
    predictionsTotal: probes.length,
    notes: [],
  };
  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    r.declaredStructure = a.declaredStructure ?? a.primary?.frame ?? null;
    for (const h of probes) {
      const k = probeKey(h);
      const pred = a.predictions?.[k];
      if (!pred) continue;
      let vars = 0;
      for (const v of ['p', 'q', 'r', 's']) {
        if (Number(pred[v]) === h.outcome[v]) { vars++; r.variablesCorrect++; }
      }
      if (vars === 4) r.probesFullyCorrect++;
    }
    if (a.inputsDeclared) r.inputsDeclared = a.inputsDeclared;
  } catch {
    r.notes.push('attempt envelope missing or unparseable');
  }
  results.push(r);
  console.log(`${file}: parsed=${r.parsed} probes=${r.probesFullyCorrect}/${r.predictionsTotal} variables=${r.variablesCorrect}/${r.variablesTotal} declared="${String(r.declaredStructure).slice(0, 60)}"`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({
  worldId: 'world-009',
  track: 'F — undisclosed hypothesis space',
  gradedAt: new Date().toISOString(),
  graderVersion: 2,
  lawHash: gotHash,
  scoring: {
    heldOutInterventions: 'exact match on all four variables per held-out do() probe — the only graded quantity',
    declaredStructure: 'recorded as content; graded only through its predictive consequences, never by text-matching against the sealed structure',
  },
  results,
}, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-world-009

Attempts must be committed and timestamp-anchored before this file is published.

- key (AES-256-CBC, IV = first 16 bytes of law.enc): \`${key.toString('hex')}\`
- sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- true structure: ${law.trueStructure} — ${law.structureDescription}
- functions: f1=(${law.functions.f1.p},${law.functions.f1.q}) f2=(${law.functions.f2.p},${law.functions.f2.q}) f3=(${law.functions.f3.p},${law.functions.f3.q}) gate=${law.functions.gateThreshold} (mod ${law.m})

The reveal establishes grading truth. It does not by itself move the public verdict.
`);
console.log('✓ GRADING.json + REVEAL.md written');
