// The Observatory's operational ontology — the instance-level governed graph.
//
// Omnibus §84: "Without an ontology layer, pathtoAGI is a benchmark plus logs.
// With an ontology layer, it becomes an epistemic operating system." The hard
// problem it names is governed operational truth: objects, relationships,
// actions, permissions, lineage, and consequences.
//
// This module is that layer's single source of truth. Everything here is
// COMPUTED from the record's own data files at build time — no count, state,
// or edge is ever hand-typed. It is a plain .mjs module so that both the
// Astro site (src/data/ontology.ts wraps it) and the deterministic
// conformance gate (scripts/check-record.mjs) consume the identical graph;
// the gate additionally enforces referential integrity: a typed reference
// that does not resolve fails the build.
//
// Edge extraction is deterministic string matching against real fields.
// References that match no known id pattern are classified `informal` and
// carried (visible, counted) but never invented into edges.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const D = (f) => JSON.parse(readFileSync(join(ROOT, 'src', 'data', f), 'utf8'));

// theories.ts and verdict-protocol.ts are TypeScript; extract the stable
// literal fields we need rather than importing them.
const theoriesSrc = readFileSync(join(ROOT, 'src', 'data', 'theories.ts'), 'utf8');
const THEORY_IDS = [...theoriesSrc.matchAll(/^\s+id: '([a-z-]+)',$/gm)].map((m) => m[1]);
const protocolSrc = readFileSync(join(ROOT, 'src', 'data', 'verdict-protocol.ts'), 'utf8');
const GATES = [...protocolSrc.matchAll(/'(OG-\d+)\. ([^']+)'/g)].map((m) => ({ id: m[1].toLowerCase(), text: m[2] }));
const PROTOCOL_VERSION = Number(/version: (\d+)/.exec(protocolSrc)?.[1] ?? 0);

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);

export function buildOntology() {
  const evidence = D('evidence.json');
  const forecasts = D('forecasts.json');
  const claims = D('claims.json');
  const bundles = D('run-bundles.json');
  const challenges = D('challenges.json');
  const revisions = D('revisions.json');
  const incidents = D('incidents.json');
  const correspondence = D('correspondence.json');
  const precedents = D('precedents.json');
  const dispatches = D('dispatches.json');
  const outreach = D('outreach.json');
  const failureTypes = D('failure-taxonomy.json');
  const silences = D('silences.json');
  const futures = D('registered-futures.json');
  const humanBaselines = D('human-baselines.json');
  const constructions = D('constructions.json');

  // ── Instance nodes ─────────────────────────────────────────────────────
  const nodes = [];
  const add = (type, id, label, extra = {}) => nodes.push({ type, id, label, ...extra });

  for (const t of THEORY_IDS) add('theory', t, t, { href: `/theories/${t}/` });
  for (const e of evidence) add('evidence', e.id, e.source?.slice(0, 80) ?? e.id, { href: '/evidence/', date: e.observedAt });
  for (const f of forecasts) add('forecast', f.id, f.claim?.slice(0, 80) ?? f.id, { href: '/forecasts/', state: f.status });
  for (const c of claims) add('claim', c.claim_id, c.text?.slice(0, 80), { href: '/record.json', state: c.status });
  for (const b of bundles) add('run-bundle', b.id, b.title, { href: '/runs/', state: b.status, date: b.registeredAt });
  for (const g of GATES) add('verdict-gate', g.id, g.text.slice(0, 80), { href: '/test/' });
  for (const ch of challenges) add('challenge', ch.id ?? slug(ch.title ?? 'challenge'), ch.title ?? ch.id, { href: '/governance/', state: ch.status });
  for (const r of revisions) add('correction', `rev-${r.date}-${slug(r.title)}`, r.title, { href: '/log/', date: r.date, state: r.kind });
  for (const i of incidents) add('incident', i.id, i.summary?.slice(0, 80), { href: '/status/', state: i.status, date: i.date });
  for (const c of correspondence) add('correspondence', c.id, c.summary?.slice(0, 80) ?? c.id, { href: '/to-the-systems-reading-this/', date: c.at });
  for (const p of precedents) add('precedent', p.id, p.ruling?.slice(0, 80), { href: '/governance/', date: p.date, state: p.status });
  for (const d of dispatches) add('dispatch', `press-${d.no}`, d.title, { href: `/press/${d.slug}/`, state: d.no > 6 ? 'gated-language' : 'pre-policy' });
  for (const o of outreach) add('outreach', o.id, o.role, { href: '/MACHINE_PROTOCOL.md', state: o.status });
  for (const ft of failureTypes) add('failure-type', ft.id ?? slug(ft.name ?? ft.type ?? 'failure'), ft.name ?? ft.id, { href: '/log/' });
  for (const s of silences) add('silence-audit', s.id ?? `silence-${s.quarter ?? s.date ?? nodes.length}`, s.summary?.slice(0, 80) ?? 'silence audit', { href: '/log/' });
  for (const f of futures) add('registered-future', f.id ?? slug(f.title ?? 'future'), f.title ?? f.id, { href: '/test/' });
  for (const h of humanBaselines) add('human-baseline', h.id, h.summary?.slice(0, 80) ?? h.id, { href: '/method/', date: h.receivedAt, state: h.tier });
  for (const c of constructions) add('construction', c.id, c.title, { href: '/forge/', state: c.status, date: c.registeredAt });

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const revisionByTitle = new Map(revisions.map((r) => [r.title, `rev-${r.date}-${slug(r.title)}`]));
  const dispatchBySlug = new Map(dispatches.map((d) => [d.slug, `press-${d.no}`]));
  const bundleByWorld = new Map();
  for (const b of bundles) {
    const w = /world-\d+/.exec(b.experimentPath ?? '')?.[0];
    if (w) bundleByWorld.set(w, b.id);
  }

  // ── Instance edges — each rule reads a real field ──────────────────────
  const edges = [];
  const dangling = [];
  const informal = [];
  const link = (from, to, rel, sourceField) => {
    if (byId.has(to)) edges.push({ from, to, rel });
    else dangling.push({ from, ref: to, rel, sourceField });
  };

  // classify a free-form record reference into a typed edge, artifact path,
  // or informal note. Returns true when it became an edge.
  const classifyRef = (fromId, ref, sourceField) => {
    const r = ref.trim();
    const revTitle = /^revision: (.+)$/.exec(r)?.[1];
    if (revTitle) {
      const id = revisionByTitle.get(revTitle);
      if (id) { edges.push({ from: fromId, to: id, rel: 'repaired by' }); return true; }
      dangling.push({ from: fromId, ref: r, rel: 'repaired by', sourceField });
      return false;
    }
    const ft = /^failure-taxonomy: ([a-z-]+)$/.exec(r)?.[1];
    if (ft) { link(fromId, ft, 'classified as', sourceField); return true; }
    const press = /^\/?press\/(\d+[^/\s]*)/.exec(r)?.[1];
    if (press) {
      const id = dispatchBySlug.get(press);
      if (id) { edges.push({ from: fromId, to: id, rel: 'published as' }); return true; }
      dangling.push({ from: fromId, ref: r, rel: 'published as', sourceField });
      return false;
    }
    if (/^cce-/.test(r)) { link(fromId, r, 'references evidence', sourceField); return true; }
    if (/^inc-/.test(r)) { link(fromId, r, 'references incident', sourceField); return true; }
    if (/^fcs-world-/.test(r)) { link(fromId, r, 'references run', sourceField); return true; }
    if (/^corr-/.test(r)) { link(fromId, r, 'references correspondence', sourceField); return true; }
    const world = /(?:^|\/)(?:fcs-synth-)?(world-\d+)/.exec(r)?.[1];
    if (world && bundleByWorld.has(world)) {
      edges.push({ from: fromId, to: bundleByWorld.get(world), rel: 'references run' });
      return true;
    }
    // a leading-slash reference is a site route, not a repo file
    if (r.startsWith('/')) {
      informal.push({ from: fromId, ref: r, kind: 'informal' });
      return false;
    }
    // repo artifact path: must exist in the repo (or under public/)
    if (/^[\w@./-]+$/.test(r) && r.includes('/') && !r.startsWith('observatory-command/')) {
      if (existsSync(join(ROOT, r)) || existsSync(join(ROOT, 'public', r))) {
        informal.push({ from: fromId, ref: r, kind: 'artifact-verified' });
        return false;
      }
      dangling.push({ from: fromId, ref: r, rel: 'artifact', sourceField });
      return false;
    }
    informal.push({ from: fromId, ref: r, kind: 'informal' });
    return false;
  };

  for (const e of evidence) {
    for (const t of e.theories ?? []) link(e.id, t, 'bears on', 'evidence.theories');
    const world = /(world-\d+)/.exec(e.id)?.[1];
    if (world && bundleByWorld.has(world)) edges.push({ from: bundleByWorld.get(world), to: e.id, rel: 'became evidence' });
  }
  for (const f of forecasts) {
    for (const t of f.theories ?? []) link(f.id, t, 'tests expectations under', 'forecast.theories');
  }
  for (const c of claims) {
    for (const e of c.supporting ?? []) link(c.claim_id, e, 'supported by', 'claim.supporting');
    for (const e of c.opposing ?? []) link(c.claim_id, e, 'opposed by', 'claim.opposing');
  }
  for (const c of constructions) {
    for (const ref of c.commitmentRefs ?? []) link(c.id, ref, 'commits to (reality-graded)', 'construction.commitmentRefs');
    for (const ref of c.behaviorAnchors ?? []) link(c.id, ref, 'reads behavior off', 'construction.behaviorAnchors');
  }
  for (const i of incidents) {
    for (const ref of i.recordRefs ?? []) classifyRef(i.id, ref, 'incident.recordRefs');
    if (i.category && byId.has(i.category)) edges.push({ from: i.id, to: i.category, rel: 'classified as' });
  }
  for (const c of correspondence) {
    for (const ref of c.artifactRefs ?? []) classifyRef(c.id, ref, 'correspondence.artifactRefs');
  }

  // ── Type registry — layer, description, per-type permitted actions ─────
  // (Omnibus §83: every object is governed; §78: relationships are the point.)
  const count = (type) => nodes.filter((n) => n.type === type).length;
  const A = {
    generate: 'generate', freeze: 'freeze', run: 'run', grade: 'grade', audit: 'audit',
    challenge: 'challenge', downgrade: 'downgrade', correct: 'correct',
    reproduce: 'reproduce', publish: 'publish', retire: 'retire',
  };
  const types = [
    { id: 'claim', label: 'Claim', layer: 'record', href: '/record.json', accent: 'var(--color-ink-dim)', description: 'A bounded assertion with allowed and forbidden language, defeaters, and an evidence level.', actions: [A.freeze, A.audit, A.challenge, A.downgrade, A.correct, A.retire] },
    { id: 'evidence', label: 'Evidence', layer: 'record', href: '/evidence/', accent: 'var(--color-accent)', description: 'A sourced capability event with signal, implication, bound, and next evidence needed.', actions: [A.freeze, A.audit, A.challenge, A.downgrade, A.correct, A.publish] },
    { id: 'forecast', label: 'Forecast', layer: 'record', href: '/forecasts/', accent: 'hsl(212 80% 64%)', description: 'A pre-registered probabilistic claim with a horizon and resolution criterion.', actions: [A.freeze, A.audit, A.publish, A.retire] },
    { id: 'theory', label: 'Theory', layer: 'record', href: '/theories/', accent: 'hsl(270 60% 72%)', description: 'A live causal account whose narrated and computed readings can diverge.', actions: [A.audit, A.challenge, A.downgrade, A.correct] },
    { id: 'precedent', label: 'Precedent', layer: 'record', href: '/governance/', accent: 'hsl(270 60% 72%)', description: 'A binding past adjudication that constrains future cycles unless explicitly overturned.', actions: [A.freeze, A.audit, A.challenge, A.retire] },
    { id: 'run-bundle', label: 'Run Bundle', layer: 'evaluation', href: '/runs/', accent: 'hsl(34 96% 60%)', description: 'A protocol-pinned evaluation object: manifest, prompt, seal, attempt, reveal, grading.', actions: [A.generate, A.freeze, A.run, A.grade, A.audit, A.challenge, A.reproduce, A.publish] },
    { id: 'verdict-gate', label: 'Verdict Gate', layer: 'evaluation', href: '/test/', accent: 'var(--color-verdict)', description: 'A required condition before any run can bear on the public verdict.', actions: [A.freeze, A.audit, A.challenge] },
    { id: 'registered-future', label: 'Registered Future', layer: 'evaluation', href: '/test/', accent: 'hsl(34 96% 60%)', description: 'A pre-registered future scientific question the record has committed to grade against reality.', actions: [A.freeze, A.grade, A.audit, A.publish] },
    { id: 'human-baseline', label: 'Human Baseline (retired)', layer: 'evaluation', href: '/method/', accent: 'var(--color-affirm)', description: 'RETIRED by the founding abdication (constitution v3): OG-9 no longer requires a human baseline. Formal reference baselines (null / optimal-bounded-solver / ablation-difference) replaced it, so the verdict rests on mechanical reproducibility with no human in the loop. Kept as a 0-instance type because the historical record references the path that was retired.', actions: [A.audit, A.retire] },
    { id: 'construction', label: 'Construction', layer: 'forge', href: '/forge/', accent: 'hsl(150 55% 60%)', description: 'An original frame the instrument builds and submits to reality rather than grades others against — the Forge faculty. Carries falsifiable commitments as real forecast objects, behavior anchors, defeaters, and a no-overclaim language list.', actions: [A.generate, A.freeze, A.audit, A.correct, A.publish, A.retire] },
    { id: 'challenge', label: 'Challenge', layer: 'review', href: '/governance/', accent: 'var(--color-verdict)', description: 'A public objection to a record object, adjudicated through the revision log. Filed and heard on the governance page (the standalone /challenges page was retired as a duplicate).', actions: [A.generate, A.audit, A.publish, A.retire] },
    { id: 'correction', label: 'Correction', layer: 'review', href: '/log/', accent: 'var(--color-affirm)', description: 'A visible record movement: revision, retraction, incident resolution, or precedent change.', actions: [A.freeze, A.publish] },
    { id: 'incident', label: 'Incident', layer: 'review', href: '/status/', accent: 'hsl(34 96% 60%)', description: 'A failure object with impact, repair, and next control.', actions: [A.audit, A.correct, A.publish, A.retire] },
    { id: 'failure-type', label: 'Failure Type', layer: 'review', href: '/log/', accent: 'var(--color-faint)', description: 'A typed vocabulary entry for classifying how the instrument or its subjects fail.', actions: [A.freeze, A.audit, A.correct] },
    { id: 'silence-audit', label: 'Silence Audit', layer: 'review', href: '/log/', accent: 'var(--color-faint)', description: 'A scheduled record of absence — what did not happen, treated as evidence.', actions: [A.generate, A.freeze, A.publish] },
    { id: 'dispatch', label: 'Dispatch', layer: 'interface', href: '/press/', accent: 'var(--color-accent)', description: 'A Press release bound by the language policy; the narrative face of a record movement.', actions: [A.freeze, A.audit, A.correct, A.publish] },
    { id: 'correspondence', label: 'Correspondence', layer: 'interface', href: '/to-the-systems-reading-this/', accent: 'var(--color-accent)', description: 'A machine/human channel event: inbound, opened, challenged, forked, or answered.', actions: [A.audit, A.publish] },
    { id: 'outreach', label: 'Outreach Call', layer: 'interface', href: '/MACHINE_PROTOCOL.md', accent: 'hsl(212 80% 64%)', description: 'A standing public invitation with a governed status: open, engaged, delivered, or closed.', actions: [A.generate, A.audit, A.publish, A.retire] },
  ].map((t) => ({ ...t, count: count(t.id) }));

  // Type-level edges (the atlas): each corresponds to an instance-edge rule
  // above or to a protocol relationship the record enforces.
  const typeEdges = [
    { from: 'run-bundle', to: 'evidence', relation: 'may become, after gates' },
    { from: 'evidence', to: 'theory', relation: 'bears on' },
    { from: 'forecast', to: 'theory', relation: 'tests expectations under' },
    { from: 'claim', to: 'evidence', relation: 'is supported or bounded by' },
    { from: 'run-bundle', to: 'verdict-gate', relation: 'must satisfy' },
    { from: 'challenge', to: 'claim', relation: 'targets' },
    { from: 'challenge', to: 'correction', relation: 'may force' },
    { from: 'incident', to: 'correction', relation: 'requires' },
    { from: 'incident', to: 'failure-type', relation: 'classified as' },
    { from: 'incident', to: 'dispatch', relation: 'may be published as' },
    { from: 'correspondence', to: 'challenge', relation: 'can enter as' },
    { from: 'correspondence', to: 'run-bundle', relation: 'can attempt' },
    { from: 'silence-audit', to: 'evidence', relation: 'records absence as' },
    { from: 'outreach', to: 'correspondence', relation: 'opens' },
    { from: 'human-baseline', to: 'run-bundle', relation: 'calibrates (OG-9)' },
  ];

  return {
    doctrine: 'Omnibus §84 — objects, relationships, actions, permissions, lineage, consequences. Every count and edge here is computed from the record data at build time; the conformance gate fails on any typed reference that does not resolve.',
    protocolVersion: PROTOCOL_VERSION,
    types,
    typeEdges,
    permittedActions: Object.values(A),
    instances: { nodes, edges },
    integrity: {
      nodes: nodes.length,
      edges: edges.length,
      danglingTypedRefs: dangling,
      informalRefs: informal.filter((i) => i.kind === 'informal').length,
      verifiedArtifactRefs: informal.filter((i) => i.kind === 'artifact-verified').length,
    },
  };
}
