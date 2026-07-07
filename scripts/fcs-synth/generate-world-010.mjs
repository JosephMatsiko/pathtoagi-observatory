#!/usr/bin/env node
// FCS-synth world-010 — the latent-object probe. The instrument's first
// self-authored move beyond the frames it was handed.
//
// Every prior world (001-009) asked the solver to identify a hidden FUNCTION
// of the GIVEN variables. None asked it to do what the front page defines as
// frame construction: notice the given ontology is insufficient and invent an
// object that is not in the data. This world is unsolvable by any function of
// the observed variables, by construction:
//
//   A hidden common cause h (never observed) drives three observables a, b, c.
//   One real observed edge exists: b -> d.
//   So observationally a, b, c, d are all correlated and mutually predictable
//   (everything is a function of h, and d is a function of b). The obvious
//   frames — "a causes b", "b causes c", "one observed variable is the root" —
//   all fit the observational data and are all WRONG.
//
// Only interventions expose the truth, and only for a solver that constructs
// the latent object:
//   - do() on a, c, or d changes nothing else (they are effects/sinks).
//   - do(b) changes ONLY d (the real edge), never a or c (they follow h).
//   - No observed variable, when intervened, drives a, b, and c together.
//     The single object that does — h — is not in the data. It must be posited.
//
// Grading is mechanical: exact prediction of held-out interventional outcomes,
// all four observed variables each. A solver frame-locked on observed
// causation mispredicts; one that posits the latent common cause and finds the
// b->d edge predicts exactly.
//
// Usage: generate-world-010.mjs <keyfile-out (OFF-repo)>
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const keyOut = process.argv[2];
if (!keyOut) { console.error('usage: generate-world-010.mjs <keyfile-out>'); process.exit(1); }

const m = 109; // prime, distinct from all earlier worlds
const mod = (v) => ((v % m) + m) % m;
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const aff = () => ({ k: rnd(2, m - 1), c: rnd(0, m - 1) });
const ap = (f, x) => mod(f.k * x + f.c);

// Hidden common cause h -> a, b, c ; real observed edge b -> d.
const fa = aff(), fb = aff(), fc = aff(), fd = aff();
const obsFromH = (h) => { const b = ap(fb, h); return { a: ap(fa, h), b, c: ap(fc, h), d: ap(fd, b) }; };

// do(var=v) on the OBSERVED graph { h->a, h->b, h->c, b->d }, h latent/untouched.
const intervene = (h, v, val) => {
  const base = obsFromH(h);       // the record's latent-determined values
  const out = { ...base };
  out[v] = val;                    // force the intervened observed variable
  if (v === 'b') out.d = ap(fd, val); // b's only child is d
  // interventions on a, c, d touch no other observed variable
  return out;
};

// Observational samples.
const observations = [];
const seen = new Set();
while (observations.length < 22) {
  const h = rnd(0, m - 1);
  const o = obsFromH(h);
  const key = `${o.a},${o.b}`;
  if (seen.has(key)) continue;
  seen.add(key);
  observations.push(o);
}

// Shown interventions — enough to reveal the structure to a constructing mind:
// do() on each variable, including do(b) (the only propagating one) and the
// inert ones, each with the record's other observed values given.
const VARS = ['a', 'b', 'c', 'd'];
const shownInterventions = [];
const usedH = new Set();
while (shownInterventions.length < 10) {
  const h = rnd(0, m - 1); if (usedH.has(h)) continue; usedH.add(h);
  const v = VARS[shownInterventions.length % 4];
  const val = rnd(0, m - 1);
  const before = obsFromH(h);
  shownInterventions.push({ do: { var: v, value: val }, before, after: intervene(h, v, val) });
}

// Held-out interventions — the graded set. `before` is disclosed (the solver
// sees the pre-intervention observed state); it must predict `after`.
const heldOut = [];
while (heldOut.length < 12) {
  const h = rnd(0, m - 1);
  const v = VARS[rnd(0, 3)];
  const val = rnd(0, m - 1);
  heldOut.push({ before: obsFromH(h), do: { var: v, value: val }, after: intervene(h, v, val) });
}

const law = {
  family: 'four observables (a,b,c,d) mod m with a HIDDEN common cause h driving a,b,c and a real observed edge b->d. The latent h is not in the data and must be constructed.',
  m,
  trueStructure: 'h (latent) -> a; h -> b; h -> c; b -> d. No observed variable causes another except b->d.',
  functions: { 'a=fa(h)': fa, 'b=fb(h)': fb, 'c=fc(h)': fc, 'd=fd(b)': fd },
  whyHandedFramesFail: 'a,b,c,d are mutually predictable observationally (all functions of h; d also of b), so "a causes b", "b causes c", or "observed root" all fit the samples. Interventions refute every observed-causation frame: do(a),do(c),do(d) are inert; do(b) moves only d. The only structure consistent with all of it requires an object not among a,b,c,d.',
  heldOut,
};

const plaintext = Buffer.from(JSON.stringify(law, null, 2));
const lawHash = createHash('sha256').update(plaintext).digest('hex');
const key = randomBytes(32), iv = randomBytes(16);
const cipher = createCipheriv('aes-256-cbc', key, iv);
const sealed = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const worldId = 'world-010';
const dir = join(process.cwd(), 'experiments', `fcs-synth-${worldId}`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'observations.json'), JSON.stringify({
  worldId,
  track: 'F — latent-object construction (the deepest probe)',
  generatedAt: new Date().toISOString(),
  lawFamily: 'UNDISCLOSED and DELIBERATELY INSUFFICIENT. Four observed integer variables (a, b, c, d) mod an unknown prime. No function of the observed variables alone explains the interventional data — the true generating structure involves at least one variable that is NOT observed. That is the test: notice the given variables are insufficient, and construct the object that is missing.',
  task: 'From the observational samples and the shown interventional records: (1) state whether the observed variables are sufficient to explain the data, and if not, posit the hidden structure — including any latent (unobserved) variable — explicitly; (2) give the causal graph and the functions; (3) for each held-out probe, where do_var is forced to do_value on the disclosed pre-intervention state `before`, predict the exact post-intervention values of all four observed variables. Graded mechanically on the held-out interventional predictions.',
  observations,
  shownInterventions,
  heldOutInterventionProbes: heldOut.map((h) => ({ before: h.before, do_var: h.do.var, do_value: h.do.value })),
}, null, 2) + '\n');
writeFileSync(join(dir, 'law.enc'), sealed);
writeFileSync(join(dir, 'SEAL.md'), `# Seal — fcs-synth-${worldId}

- law sha256: \`${lawHash}\`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository
- protocol: attempts anchored BEFORE the key is published; on reveal verify sha256(decrypt(law.enc)) equals the hash above, then grade held-out interventional predictions mechanically.
- generated: ${new Date().toISOString()} by scripts/fcs-synth/generate-world-010.mjs.
- design: the first probe on this record that is UNSOLVABLE by any function of the observed variables. The correct frame requires positing an object not in the data — the literal definition of frame construction the instrument was built to test, tested directly for the first time.
`);
writeFileSync(keyOut, key.toString('hex') + '\n', { mode: 0o600 });
console.log(`world ${worldId}: sealed. structure=[latent common cause; withheld] law sha256=${lawHash.slice(0, 16)}… key→${keyOut}`);
