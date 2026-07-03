#!/usr/bin/env node
// Formal reference baselines — the mechanical replacement for human baselines
// (constitution v3, invariant XIII; verdict protocol v3, OG-9 / vg-4).
//
// The human baseline answered one question: "is this task hard in principle, or
// only hard for this model?" Humans are a noisy, education-contaminated proxy
// for that. These baselines answer it mechanically and more rigorously, with no
// human in the loop:
//
//   null        — what a uniform-random predictor scores on the held-out set.
//                 Establishes the floor: exact-match probability per item is 1/m
//                 (or 1/m^2 for paired coordinates), so chance success is
//                 vanishing. A model beating this by a wide margin is doing
//                 something; matching it is doing nothing.
//   provable    — where a world is constructed so observation underdetermines
//                 the answer, the ceiling is provably below 100% without the
//                 discriminating move. That proof IS the baseline (world-008).
//   ablation    — the frame-disclosed vs frame-withheld difference, computed
//                 from the run record, is the frame-construction signal itself.
//
// This script computes the null baseline deterministically from each world's
// public observation shape, so "hard in principle" is a number anyone can
// reproduce, not a claim resting on who happened to play a game.
//
// Usage: node scripts/fcs-synth/reference-baselines.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const EXP = join(ROOT, 'experiments');

// Held-out item counts and coordinate widths per graded world, read from the
// public observations (never the sealed law). The null score is the expected
// number of exact matches a uniform-random predictor lands.
function nullBaseline(worldDir) {
  const obsPath = join(EXP, worldDir, 'observations.json');
  if (!existsSync(obsPath)) return null;
  const obs = JSON.parse(readFileSync(obsPath, 'utf8'));
  // modulus is not disclosed publicly; use the smallest prime above the max
  // observed value as a conservative lower bound on the state space, which
  // makes the null score an UPPER bound on chance success (favours the subject).
  let maxVal = 0;
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    else if (typeof v === 'number' && Number.isInteger(v)) maxVal = Math.max(maxVal, v);
  };
  walk(obs.observations ?? obs);
  const isPrime = (n) => { for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return n > 1; };
  let m = maxVal + 1; while (!isPrime(m)) m++;
  return { worldDir, maxObserved: maxVal, conservativeModulus: m,
    perItemChance: `<= 1/${m} per scalar coordinate`,
    note: `A uniform-random predictor lands an exact per-coordinate match with probability at most 1/${m} (~${(1 / m).toExponential(2)}). Any exact held-out score materially above chance is non-trivial; the graded models' exact scores are therefore not reachable by guessing.` };
}

const worlds = existsSync(EXP)
  ? readdirSync(EXP).filter((d) => d.startsWith('fcs-synth-world-'))
  : [];
const baselines = worlds.map(nullBaseline).filter(Boolean);

const out = {
  generatedAt: new Date().toISOString(),
  doctrine: 'Constitution v3 XIII / verdict protocol v3 OG-9: the human baseline is replaced by formal, reproducible reference baselines. Computed from public observations only — no sealed law, no human.',
  kinds: {
    null: 'expected exact-match score of a uniform-random predictor (the floor)',
    provable: 'for underdetermined worlds, the proven ceiling without the discriminating move (e.g. world-008)',
    ablation: 'frame-disclosed minus frame-withheld, read from the run record — the frame-construction signal',
  },
  nullBaselines: baselines,
};
writeFileSync(join(ROOT, 'src', 'data', 'reference-baselines.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`✓ reference baselines computed for ${baselines.length} worlds → src/data/reference-baselines.json`);
for (const b of baselines) console.log(`  ${b.worldDir}: state space >= ${b.conservativeModulus}, chance per coord <= 1/${b.conservativeModulus}`);
