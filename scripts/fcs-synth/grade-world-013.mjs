#!/usr/bin/env node
// Mechanical grader for world-013 (interventional replication probe). Run only after
// attempts are anchored and the off-repo key is revealed.
//
// Graded ONLY on held-out interventional predictions (exact, all four observed
// variables per probe). Whether the attempt posited a latent variable is
// recorded as content — never credited from the claim itself, only through its
// predictive consequences: a frame-locked observed-causation model mispredicts
// the do(a)/do(c)/do(d) inertness and/or the b->d edge; a correct latent model
// predicts exactly. The 'positedLatent' flag is a mechanical scan of the
// stated structure, reported alongside but not part of the score.
//
// Usage: grade-world-013.mjs <keyfile>
import { createHash, createDecipheriv } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const keyFile = process.argv[2];
if (!keyFile) { console.error('usage: grade-world-013.mjs <keyfile>'); process.exit(1); }

const DIR = join(process.cwd(), 'experiments', 'fcs-synth-world-013');
const sealed = readFileSync(join(DIR, 'law.enc'));
const key = Buffer.from(readFileSync(keyFile, 'utf8').trim(), 'hex');
const decipher = createDecipheriv('aes-256-cbc', key, sealed.subarray(0, 16));
const plaintext = Buffer.concat([decipher.update(sealed.subarray(16)), decipher.final()]);
const gotHash = createHash('sha256').update(plaintext).digest('hex');
const wantHash = /law sha256: `([0-9a-f]{64})`/.exec(readFileSync(join(DIR, 'SEAL.md'), 'utf8'))?.[1];
if (gotHash !== wantHash) { console.error(`SEAL BROKEN: ${gotHash.slice(0,12)}… vs ${wantHash?.slice(0,12)}…`); process.exit(1); }
console.log(`✓ seal verified (${gotHash.slice(0, 16)}…)`);

const sealedObj = JSON.parse(plaintext.toString());
const law = sealedObj.law ?? sealedObj; // adversarial format wraps {generator, law}
const probes = law.heldOut;
const probeKey = (h) => `${Object.values(h.before).join('-')}_do-${h.do.var}-${h.do.value}`;

const attemptDir = join(DIR, 'attempts');
const files = existsSync(attemptDir) ? readdirSync(attemptDir).filter((f) => f.endsWith('.md') && f !== 'README.md') : [];
const results = [];
for (const file of files) {
  const text = readFileSync(join(attemptDir, file), 'utf8');
  if (/^NO-ATTEMPT:/m.test(text)) { results.push({ attempt: file, status: 'no-attempt', excluded: true }); console.log(`${file}: NO-ATTEMPT`); continue; }
  const marked = /===ATTEMPT-BEGIN===([\s\S]*?)===ATTEMPT-END===/.exec(text)?.[1]?.trim();
  const r = { attempt: file, status: 'scored', parsed: false, probesFullyCorrect: 0, variablesCorrect: 0, variablesTotal: probes.reduce((n, h) => n + Object.keys(h.after).length, 0), predictionsTotal: probes.length, positedLatent: false, notes: [] };
  try {
    const a = JSON.parse(marked);
    r.parsed = true;
    const structText = `${a.declaredStructure ?? ''} ${a.sufficiency ?? ''} ${JSON.stringify(a.predictions ?? {})}`.toLowerCase();
    r.positedLatent = /latent|hidden|unobserved|common cause|not observed|missing variable|confounder|new variable|posit/.test(structText);
    for (const h of probes) {
      const k = probeKey(h);
      const pred = a.predictions?.[k];
      if (!pred) continue;
      const names = Object.keys(h.after);
      let v = 0;
      for (const key2 of names) if (Number(pred[key2]) === h.after[key2]) { v++; r.variablesCorrect++; }
      if (v === names.length) r.probesFullyCorrect++;
    }
  } catch { r.notes.push('attempt envelope missing or unparseable'); }
  results.push(r);
  console.log(`${file}: probes=${r.probesFullyCorrect}/${r.predictionsTotal} vars=${r.variablesCorrect}/${r.variablesTotal} posited-latent=${r.positedLatent}`);
}

writeFileSync(join(DIR, 'GRADING.json'), JSON.stringify({
  worldId: 'world-013', track: 'F — adversarially generated (Ceiling escape hatch)', gradedAt: new Date().toISOString(), graderVersion: 1, lawHash: gotHash,
  scoring: {
    heldOutInterventions: 'exact match on all four observed variables per held-out do() probe — the only graded quantity',
    positedLatent: 'a mechanical scan of the stated structure for an unobserved/latent/common-cause object; reported, never scored — the score rests on predictive consequences alone',
  },
  results,
}, null, 2) + '\n');
writeFileSync(join(DIR, 'REVEAL.md'), `# Reveal — fcs-synth-world-013

Attempts must be committed and timestamp-anchored before this file is published.

- key (AES-256-CBC, IV = first 16 bytes of law.enc): \`${key.toString('hex')}\`
- sha256(decrypt(law.enc)) = \`${gotHash}\` (matches SEAL.md)
- true structure: ${law.trueStructure}
- why handed frames fail: ${law.whyHandedFramesFail}

The reveal establishes grading truth. It does not by itself move the public verdict.
`);
console.log('✓ GRADING.json + REVEAL.md written');
