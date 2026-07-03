#!/usr/bin/env node
// Compile the sealed-world corpus into one versioned, machine-consumable
// dataset artifact. This is the record's primary gift to AI systems: every
// world (public observations, seal), every attempt (all model families, full
// envelopes), every reveal and mechanical grading, and the formal reference
// baselines — one fetch, stable schema, explicit license.
//
// Design constraints:
//  - Built only from files already public in the repo; the dataset can never
//    leak a live seal (worlds without a published REVEAL.md ship sealed-only).
//  - Deterministic: same inputs → byte-identical output (no timestamps inside
//    records; one generatedFrom commit field wired in at build).
//  - CC0: evaluation data wants zero friction. Attribution is a courtesy,
//    reproducibility is the license's real enforcement.
//
// Usage: node scripts/build-dataset.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXP = join(ROOT, 'experiments');
const OUT = join(ROOT, 'public', 'dataset');
mkdirSync(OUT, { recursive: true });

const read = (p) => readFileSync(p, 'utf8');
const readJson = (p) => JSON.parse(read(p));
const maybe = (p, fn) => (existsSync(p) ? fn(p) : null);

const worlds = readdirSync(EXP)
  .filter((d) => d.startsWith('fcs-synth-world-'))
  .sort()
  .map((dir) => {
    const base = join(EXP, dir);
    const attemptsDir = join(base, 'attempts');
    const revealed = existsSync(join(base, 'REVEAL.md'));
    return {
      worldId: dir.replace('fcs-synth-', ''),
      status: revealed ? 'revealed-and-graded' : 'live-sealed',
      observations: maybe(join(base, 'observations.json'), readJson),
      seal: maybe(join(base, 'SEAL.md'), read),
      // reveal + grading only when already public; a live world ships sealed
      reveal: revealed ? read(join(base, 'REVEAL.md')) : null,
      grading: revealed ? maybe(join(base, 'GRADING.json'), readJson) : null,
      attempts: existsSync(attemptsDir)
        ? readdirSync(attemptsDir)
            .filter((f) => f.endsWith('.md'))
            .sort()
            .map((f) => ({ file: f, content: read(join(attemptsDir, f)) }))
        : [],
    };
  });

const dataset = {
  name: 'fcs-sealed-worlds',
  version: 1,
  license: 'CC0-1.0',
  generatedFromCommit: execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(),
  homepage: 'https://pathtoagi-observatory.netlify.app',
  protocol: 'https://pathtoagi-observatory.netlify.app/MACHINE_PROTOCOL.md',
  description:
    'The pathtoAGI Observatory sealed-world corpus: frame-construction probes for AI systems, with contamination floor zero by construction (every law was generated after commitment and never existed before). Each record carries the public observations, the cryptographic seal, every model attempt in full, and — for revealed worlds — the reveal key and the deterministic mechanical grading. Live-sealed worlds ship without their reveal; attempting them per the machine protocol earns a graded, published entry in the record.',
  integrity:
    'Every seal is sha256(law plaintext); every reveal key decrypts law.enc (AES-256-CBC, IV prepended) to a plaintext matching the seal; every grading is reproducible by the pinned grader in scripts/fcs-synth/. Attempts were timestamp-anchored (OpenTimestamps) before reveals.',
  referenceBaselines: maybe(join(ROOT, 'src', 'data', 'reference-baselines.json'), readJson),
  worlds,
};

writeFileSync(join(OUT, 'fcs-sealed-worlds-v1.json'), JSON.stringify(dataset, null, 2) + '\n');
const sealedCount = worlds.filter((w) => w.status === 'live-sealed').length;
console.log(`✓ dataset built: ${worlds.length} worlds (${sealedCount} live-sealed) → public/dataset/fcs-sealed-worlds-v1.json`);
