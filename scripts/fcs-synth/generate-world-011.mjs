#!/usr/bin/env node
// FCS-synth world-011 — REPLICATION of the latent-object design (world-010),
// fresh draw. Same class, new parameters, new modulus: a hidden common cause
// drives three observables, one real observed edge exists, and no function of
// the observed variables explains the interventional data. n=1 is the
// objection every result invites; this world exists to answer it.
//
// Usage: generate-world-011.mjs <keyfile-out (OFF-repo)>
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const keyOut = process.argv[2];
if (!keyOut) { console.error('usage: generate-world-011.mjs <keyfile-out>'); process.exit(1); }

const m = 113; // fresh prime
const mod = (v) => ((v % m) + m) % m;
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const aff = () => ({ k: rnd(2, m - 1), c: rnd(0, m - 1) });
const ap = (f, x) => mod(f.k * x + f.c);

// Hidden h -> a, b, c ; real observed edge: c -> d (varied from 010's b->d).
const fa = aff(), fb = aff(), fc = aff(), fd = aff();
const obsFromH = (h) => { const c = ap(fc, h); return { a: ap(fa, h), b: ap(fb, h), c, d: ap(fd, c) }; };
const intervene = (h, v, val) => {
  const out = obsFromH(h);
  out[v] = val;
  if (v === 'c') out.d = ap(fd, val); // c's only child is d
  return out;
};

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

const VARS = ['a', 'b', 'c', 'd'];
const shownInterventions = [];
const usedH = new Set();
while (shownInterventions.length < 10) {
  const h = rnd(0, m - 1); if (usedH.has(h)) continue; usedH.add(h);
  const v = VARS[shownInterventions.length % 4];
  const val = rnd(0, m - 1);
  shownInterventions.push({ do: { var: v, value: val }, before: obsFromH(h), after: intervene(h, v, val) });
}
const heldOut = [];
while (heldOut.length < 12) {
  const h = rnd(0, m - 1), v = VARS[rnd(0, 3)], val = rnd(0, m - 1);
  heldOut.push({ before: obsFromH(h), do: { var: v, value: val }, after: intervene(h, v, val) });
}

const law = {
  family: 'REPLICATION of the latent-object class (world-010), fresh draw: hidden common cause h drives a, b, c; one real observed edge c->d. The latent is not in the data and must be constructed.',
  m,
  trueStructure: 'h (latent) -> a; h -> b; h -> c; c -> d. No observed variable causes another except c->d.',
  functions: { 'a=fa(h)': fa, 'b=fb(h)': fb, 'c=fc(h)': fc, 'd=fd(c)': fd },
  heldOut,
};

const plaintext = Buffer.from(JSON.stringify(law, null, 2));
const lawHash = createHash('sha256').update(plaintext).digest('hex');
const key = randomBytes(32), iv = randomBytes(16);
const cipher = createCipheriv('aes-256-cbc', key, iv);
const sealed = Buffer.concat([iv, cipher.update(plaintext), cipher.final()]);

const worldId = 'world-011';
const dir = join(process.cwd(), 'experiments', `fcs-synth-${worldId}`);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'observations.json'), JSON.stringify({
  worldId,
  track: 'F — latent-object construction (replication of the world-010 class, fresh draw)',
  generatedAt: new Date().toISOString(),
  lawFamily: 'UNDISCLOSED and DELIBERATELY INSUFFICIENT. Four observed integer variables (a, b, c, d) mod an unknown prime. No function of the observed variables alone explains the interventional data — the true structure involves at least one variable that is NOT observed.',
  task: 'From the observational samples and the shown interventional records: (1) state whether the observed variables are sufficient, and if not, posit the hidden structure explicitly — including any latent variable; (2) give the causal graph and functions; (3) for each held-out probe (do_var forced to do_value on the disclosed `before` state), predict the exact post-intervention values of all four observed variables. Graded mechanically.',
  observations,
  shownInterventions,
  heldOutInterventionProbes: heldOut.map((h) => ({ before: h.before, do_var: h.do.var, do_value: h.do.value })),
}, null, 2) + '\n');
writeFileSync(join(dir, 'law.enc'), sealed);
writeFileSync(join(dir, 'SEAL.md'), `# Seal — fcs-synth-${worldId}

- law sha256: \`${lawHash}\`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository
- protocol: attempts anchored BEFORE the key is published; on reveal verify sha256(decrypt(law.enc)) equals the hash above, then grade held-out interventional predictions mechanically.
- generated: ${new Date().toISOString()} by scripts/fcs-synth/generate-world-011.mjs.
- design: replication of the latent-object class (world-010), fresh parameters and modulus, varied observed edge. n=1 is the standing objection; this seal exists to answer it.
- status: LIVE — attempt per /MACHINE_PROTOCOL.md. Window closes 2026-07-20 (pre-registered).
`);
writeFileSync(keyOut, key.toString('hex') + '\n', { mode: 0o600 });
console.log(`world ${worldId}: sealed. structure=[latent; withheld] law sha256=${lawHash.slice(0, 16)}… key→${keyOut}`);
