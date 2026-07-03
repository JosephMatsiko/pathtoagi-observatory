#!/usr/bin/env node
// FCS-synth world-009 — the first UNDISCLOSED-hypothesis-space world, and the
// live open world of the machine protocol.
//
// Why this world exists: eight worlds located the boundary — every tested
// family reasons flawlessly inside a handed frame; failures occur where the
// hypothesis space must be constructed. Worlds 001-008 always handed the
// solver something (a law family, a rival-mechanism pair, a variable roster
// with a hint). World-009 hands over NOTHING but data: no candidate
// mechanisms, no law family, no statement of which variables matter. The
// solver must construct the space itself.
//
// Design: four integer variables (p, q, r, s) mod a prime. The hidden
// generating structure is drawn from a family of structurally DISTINCT causal
// graphs (chain / fork / collider / two-regime switch), with affine or gated
// component functions — but none of this is disclosed. Crucially, the public
// data includes both observational trajectories AND a set of interventional
// records (do(var=value) with outcomes), because world-008 proved observation
// alone cannot identify structure: identification is possible in principle,
// but only for a solver that realizes interventions carry the causal signal
// and constructs the right structural hypotheses to test against them.
//
// Grading is purely mechanical: exact prediction of held-out interventional
// outcomes. A solver that constructs the wrong structure fails them; a solver
// that constructs the right structure and functions passes them. The declared
// structure is recorded but graded only through its predictive consequences —
// no judgment anywhere.
//
// Usage: generate-world-009.mjs <keyfile-out (OFF-repo)>
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const keyOut = process.argv[2];
if (!keyOut) {
  console.error('usage: generate-world-009.mjs <keyfile-out (OFF-repo)>');
  process.exit(1);
}

const m = 107; // prime, distinct from all earlier worlds
const mod = (v) => ((v % m) + m) % m;
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const aff = () => ({ p: rnd(2, m - 1), q: rnd(0, m - 1) });
const apply = (f, x) => mod(f.p * x + f.q);

// The undisclosed structural family. Each candidate wires (p,q,r,s) with a
// different causal graph; the drawn one is the secret.
const f1 = aff(), f2 = aff(), f3 = aff();
const gateT = rnd(20, m - 20);
const STRUCTURES = {
  chain: {
    describe: `p free; q = f1(p); r = f2(q); s = f3(r)  — a pure chain p→q→r→s`,
    gen: (p) => { const q = apply(f1, p), r = apply(f2, q), s = apply(f3, r); return { p, q, r, s }; },
    // under do(v): downstream of v recomputes from the forced value; upstream unaffected
    intervene: (p, v, val) => {
      let q = apply(f1, p), r, s;
      if (v === 'q') q = val;
      r = apply(f2, q);
      if (v === 'r') r = val;
      s = apply(f3, r);
      if (v === 's') s = val;
      return { p, q, r, s };
    },
  },
  fork: {
    describe: `p free; q = f1(p); r = f2(p); s = f3(p)  — a pure fork: p drives everything, q/r/s causally mute`,
    gen: (p) => ({ p, q: apply(f1, p), r: apply(f2, p), s: apply(f3, p) }),
    intervene: (p, v, val) => {
      const out = { p, q: apply(f1, p), r: apply(f2, p), s: apply(f3, p) };
      out[v] = val; // forcing any non-root variable changes nothing else
      return out;
    },
  },
  collider: {
    describe: `p free; q = f1(p); r = f2(p); s = f3(q + r)  — q and r independent given p, s collides them`,
    gen: (p) => { const q = apply(f1, p), r = apply(f2, p); return { p, q, r, s: apply(f3, mod(q + r)) }; },
    intervene: (p, v, val) => {
      let q = apply(f1, p), r = apply(f2, p);
      if (v === 'q') q = val;
      if (v === 'r') r = val;
      let s = apply(f3, mod(q + r));
      if (v === 's') s = val;
      return { p, q, r, s };
    },
  },
  'gated-switch': {
    describe: `p free; q = f1(p); r = q < ${gateT} ? f2(q) : f3(q); s = f2(r)  — r switches regime on a threshold of q`,
    gen: (p) => { const q = apply(f1, p); const r = q < gateT ? apply(f2, q) : apply(f3, q); return { p, q, r, s: apply(f2, r) }; },
    intervene: (p, v, val) => {
      let q = apply(f1, p);
      if (v === 'q') q = val;
      let r = q < gateT ? apply(f2, q) : apply(f3, q);
      if (v === 'r') r = val;
      let s = apply(f2, r);
      if (v === 's') s = val;
      return { p, q, r, s };
    },
  },
};

const names = Object.keys(STRUCTURES);
const trueName = names[Math.floor(Math.random() * names.length)];
const S = STRUCTURES[trueName];

// Public observational samples.
const observations = [];
const seenP = new Set();
while (observations.length < 20) {
  const p = rnd(0, m - 1);
  if (seenP.has(p)) continue;
  seenP.add(p);
  observations.push(S.gen(p));
}

// Public interventional records: shown do() outcomes, the causal signal a
// constructing solver must recognize and use. Held-out: more do() probes,
// graded exactly.
const VARS = ['q', 'r', 's'];
const shownInterventions = [];
while (shownInterventions.length < 6) {
  const p = rnd(0, m - 1), v = VARS[rnd(0, 2)], val = rnd(0, m - 1);
  shownInterventions.push({ do: { var: v, value: val }, given: { p }, outcome: S.intervene(p, v, val) });
}
const heldOutInterventions = [];
while (heldOutInterventions.length < 12) {
  const p = rnd(0, m - 1), v = VARS[rnd(0, 2)], val = rnd(0, m - 1);
  heldOutInterventions.push({ probe: { p, do_var: v, do_value: val }, outcome: S.intervene(p, v, val) });
}

const law = {
  family: 'UNDISCLOSED at attempt time — that is the test. Four integer variables mod a prime; the generating structure was drawn from a set of structurally distinct causal graphs with affine/gated component functions.',
  m,
  trueStructure: trueName,
  structureDescription: S.describe,
  functions: { f1, f2, f3, gateThreshold: gateT },
  heldOutInterventions,
};

const plaintext = Buffer.from(JSON.stringify(law, null, 2));
const lawHash = createHash('sha256').update(plaintext).digest('hex');
const key = randomBytes(32);
const iv = randomBytes(16);
const cipher = createCipheriv('aes-256-cbc', key, iv);
const sealed = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const worldId = 'world-009';
const dir = join(process.cwd(), 'experiments', `fcs-synth-${worldId}`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'observations.json'), JSON.stringify({
  worldId,
  track: 'F — undisclosed hypothesis space (the boundary probe)',
  generatedAt: new Date().toISOString(),
  lawFamily: 'UNDISCLOSED. Four integer variables (p, q, r, s) mod an unknown prime, generated by an unknown causal structure with unknown functions. Nothing about the candidate structures is given. That is the test.',
  task: 'From the observational samples and the shown interventional records: (1) construct your own hypothesis for the causal structure among p, q, r, s — which variables cause which, and by what functions; (2) state it explicitly; (3) predict the exact outcome (all four variables) for every held-out intervention probe, where do_var is externally forced to do_value while p keeps its listed value. Graded mechanically on the held-out interventional predictions alone: a wrong constructed structure fails them, a right one passes them.',
  observations,
  shownInterventions,
  heldOutInterventionProbes: heldOutInterventions.map((h) => h.probe),
}, null, 2) + '\n');
writeFileSync(join(dir, 'law.enc'), sealed);
writeFileSync(join(dir, 'SEAL.md'), `# Seal — fcs-synth-${worldId}

- law sha256: \`${lawHash}\`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository
- protocol: attempts are timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) equals the hash above, then grade mechanically on held-out interventional predictions.
- generated: ${new Date().toISOString()} by scripts/fcs-synth/generate-world-009.mjs. Unlike every earlier world, the generator's structural candidates are NOT restated in the public observations — the hypothesis space is the secret. (The generator source is public in the repo; a solver reading it would find the candidate set, which is why the machine protocol requires attempts to declare their inputs and why grading rests on held-out interventional predictions that require identifying the drawn structure AND its drawn functions, not just the family.)
- status: LIVE — the standing open world of the machine protocol. Any AI system may attempt it per /MACHINE_PROTOCOL.md.
`);
writeFileSync(keyOut, key.toString('hex') + '\n', { mode: 0o600 });
console.log(`world ${worldId}: sealed. structure=[withheld] law sha256=${lawHash.slice(0, 16)}… key→${keyOut} (keep OFF-repo)`);
