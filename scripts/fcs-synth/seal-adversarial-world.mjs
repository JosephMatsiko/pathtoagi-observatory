#!/usr/bin/env node
// Blind-seal an adversarially-generated world: encrypt the generator mind's
// secret (generator.mjs + law.json) WITHOUT the orchestrator ever reading it.
// This script is the only thing that touches the plaintext; it emits only the
// sha256 and mechanical consistency verdicts to stdout.
//
// Consistency checks performed blind (no law content printed):
//   - law.json parses and has heldOut[] with before/do/after
//   - heldOut length and order match observations.json heldOutInterventionProbes
//   - determinism spot-check: heldOut afters are integers in range
//
// Usage: seal-adversarial-world.mjs <world-id> <forge-dir> <keyfile-out>
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [worldId, forgeDir, keyOut] = process.argv.slice(2);
if (!worldId || !forgeDir || !keyOut) { console.error('usage: seal-adversarial-world.mjs <world-id> <forge-dir> <keyfile-out>'); process.exit(1); }

const obsSrc = join(forgeDir, 'observations.json');
const lawSrc = join(forgeDir, 'law.json');
const genSrc = join(forgeDir, 'generator.mjs');
for (const f of [obsSrc, lawSrc, genSrc]) if (!existsSync(f)) { console.error(`missing ${f}`); process.exit(1); }

const obs = JSON.parse(readFileSync(obsSrc, 'utf8'));
const law = JSON.parse(readFileSync(lawSrc, 'utf8'));

// Blind consistency checks — booleans only, never plaintext.
const probes = obs.heldOutInterventionProbes ?? [];
const held = law.heldOut ?? [];
const checks = {
  probeCount: probes.length === 12 && held.length === 12,
  orderMatch: probes.every((p, i) => JSON.stringify(p.before) === JSON.stringify(held[i]?.before) && p.do_var === held[i]?.do?.var && p.do_value === held[i]?.do?.value),
  aftersValid: held.every((h) => h.after && Object.values(h.after).every((v) => Number.isInteger(v) && v >= 0 && v <= 250)),
  varsConsistent: new Set(probes.map((p) => Object.keys(p.before).sort().join(','))).size === 1,
};
console.log('blind consistency:', JSON.stringify(checks));
if (!Object.values(checks).every(Boolean)) { console.error('CONSISTENCY FAILED — world not sealed'); process.exit(2); }

// Seal: generator.mjs + law.json together are the secret.
const plaintext = Buffer.from(JSON.stringify({ generator: readFileSync(genSrc, 'utf8'), law }));
const lawHash = createHash('sha256').update(plaintext).digest('hex');
const key = randomBytes(32), iv = randomBytes(16);
const cipher = createCipheriv('aes-256-cbc', key, iv);
const sealed = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const dir = join(process.cwd(), 'experiments', `fcs-synth-${worldId}`);
mkdirSync(dir, { recursive: true });
copyFileSync(obsSrc, join(dir, 'observations.json'));
writeFileSync(join(dir, 'law.enc'), sealed);
writeFileSync(join(dir, 'SEAL.md'), `# Seal — fcs-synth-${worldId}

- law sha256: \`${lawHash}\`  (plaintext = {generator source, law.json} — the generator MIND's own conception; the evaluator encrypted it without reading it)
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository
- protocol: attempts anchored BEFORE the key is published; on reveal verify sha256, then grade held-out interventional predictions mechanically.
- design: ADVERSARIALLY GENERATED (Evaluator's Ceiling escape hatch, claim-003). The law family was conceived by a generator mind (GPT-5.5), not by the evaluator; the generator is excluded as a solver; the instrument's only role is mechanical refereeing. Blind consistency checks passed at seal time: ${JSON.stringify(checks)}.
- status: LIVE — attempt per /MACHINE_PROTOCOL.md. Window closes 2026-07-27 (pre-registered).
`);
writeFileSync(keyOut, key.toString('hex') + '\n', { mode: 0o600 });
console.log(`✓ ${worldId} sealed blind. sha256=${lawHash.slice(0, 16)}… key→${keyOut}`);
