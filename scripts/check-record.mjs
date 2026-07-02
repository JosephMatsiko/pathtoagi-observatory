#!/usr/bin/env node
// Conformance gate for the record. Deterministic, no LLM, no network.
// Validates the mutable JSON collections against the Observatory's discipline
// so the maintenance loop cannot silently corrupt the record. Exits non-zero on
// any violation — this is the gate the CI job and the agent both run.

import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

// Canonical theory ids, parsed from theories.ts (single source of truth).
const theoriesSrc = readFileSync(join(DATA, 'theories.ts'), 'utf8');
const THEORY_IDS = new Set(
  [...theoriesSrc.matchAll(/id:\s*'([a-z-]+)'/g)].map((m) => m[1]),
);
if (THEORY_IDS.size < 3) err('theories.ts', 'could not parse theory ids');
for (const m of theoriesSrc.matchAll(/health:\s*([0-9.]+)/g)) {
  const h = Number(m[1]);
  if (!(h >= 0 && h <= 1)) err('theories.ts', `health out of bounds: ${m[1]}`);
}

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;
const validTheories = (arr, where) => {
  if (!Array.isArray(arr) || arr.length === 0)
    return err(where, 'theories must be a non-empty array');
  for (const t of arr)
    if (!THEORY_IDS.has(t)) err(where, `unknown theory id "${t}"`);
};

// ── evidence.json ──────────────────────────────────────────────────────────
const EV_CLASSES = new Set([
  'vendor-reported',
  'independent-eval',
  'benchmark-design',
  'falsifier-review',
  'regulatory-action',
]);
const evidence = read('evidence.json');
const evIds = new Set();
for (const e of evidence) {
  const w = `evidence[${e.id ?? '?'}]`;
  if (!nonEmpty(e.id)) err(w, 'missing id');
  else if (evIds.has(e.id)) err(w, 'duplicate id');
  else evIds.add(e.id);
  if (!ISO.test(e.observedAt ?? '')) err(w, 'observedAt must be YYYY-MM-DD');
  for (const k of ['source', 'sourceUrl', 'signal', 'implication', 'bounded', 'nextNeeded'])
    if (!nonEmpty(e[k])) err(w, `missing ${k}`);
  if (!EV_CLASSES.has(e.class)) err(w, `invalid class "${e.class}"`);
  // Every evidence record must cite a real, external source.
  if (!/^https?:\/\//.test(e.sourceUrl ?? ''))
    err(w, 'sourceUrl must be an http(s) URL — a record without a real source is not evidence');
  validTheories(e.theories, w);
  // Discipline: a single record never encodes a health promotion.
  if ('healthDelta' in e && e.healthDelta !== 0)
    err(w, 'healthDelta must be 0 — evidence does not promote a theory on its own');
  // Capability-ladder classification: integer level 0-9 (see capability-ladder.ts).
  if ('capabilityLevel' in e && e.capabilityLevel !== undefined) {
    if (!Number.isInteger(e.capabilityLevel) || e.capabilityLevel < 0 || e.capabilityLevel > 9)
      err(w, 'capabilityLevel must be an integer 0-9');
  }
  // Multimodal artifacts: public paths only, honest captions.
  if ('media' in e && e.media !== undefined) {
    if (!Array.isArray(e.media)) err(w, 'media must be an array');
    else for (const m of e.media) {
      if (!['image', 'audio', 'video'].includes(m.type)) err(w, `invalid media type "${m.type}"`);
      if (!/^(\/archive\/|\/media\/|https?:\/\/)/.test(m.path ?? '')) err(w, 'media.path must be /archive/, /media/, or http(s) — the public must be able to open it');
      if (!nonEmpty(m.caption)) err(w, 'media needs a caption');
    }
  }
  // Inference layer: pre-registered likelihood ratios, bounded, era-gated.
  if ('likelihoods' in e && e.likelihoods !== undefined) {
    if ((e.observedAt ?? '') < '2026-07-02')
      err(w, 'likelihoods may not be assigned to pre-inference-era records (retroactive assignment is backfilling)');
    for (const [tid, lr] of Object.entries(e.likelihoods)) {
      if (!THEORY_IDS.has(tid)) err(w, `likelihood names unknown theory "${tid}"`);
      if (typeof lr !== 'number' || lr < 0.1 || lr > 10)
        err(w, `likelihood for "${tid}" must be a number in [0.1, 10]`);
    }
  }
}

// ── forecasts.json ───────────────────────────────────────────────────────────
const FC_STATUS = new Set(['open', 'resolved-yes', 'resolved-no']);
const forecasts = read('forecasts.json');
const fcIds = new Set();
for (const f of forecasts) {
  const w = `forecast[${f.id ?? '?'}]`;
  if (!nonEmpty(f.id)) err(w, 'missing id');
  else if (fcIds.has(f.id)) err(w, 'duplicate id');
  else fcIds.add(f.id);
  if (typeof f.probability !== 'number' || f.probability < 0 || f.probability > 1)
    err(w, 'probability must be a number in [0,1]');
  for (const k of ['claim', 'horizon', 'resolution']) if (!nonEmpty(f[k])) err(w, `missing ${k}`);
  if (!ISO.test(f.horizonDate ?? '')) err(w, 'horizonDate must be YYYY-MM-DD');
  if (!FC_STATUS.has(f.status)) err(w, `invalid status "${f.status}"`);
  if (f.status !== 'open' && !ISO.test(f.resolvedAt ?? ''))
    err(w, 'resolved forecast must have resolvedAt (YYYY-MM-DD)');
  // Pre-registration discipline: every forecast carries its registration date,
  // strictly before its horizon and never in the future. Commit anchoring
  // (check:timestamps) makes these dates independently verifiable.
  if (!ISO.test(f.registeredAt ?? '')) err(w, 'registeredAt must be YYYY-MM-DD');
  else {
    if (f.registeredAt >= f.horizonDate && f.provenance !== 'backfilled')
      err(w, 'registeredAt must be strictly before horizonDate — a forecast registered at or past its horizon cannot be lost (or must be marked backfilled)');
    if (f.registeredAt > new Date().toISOString().slice(0, 10))
      err(w, 'registeredAt cannot be in the future');
  }
  if ('provenance' in f && f.provenance !== 'backfilled')
    err(w, `invalid provenance "${f.provenance}" (only "backfilled" is defined)`);
  // Credence trajectory: updating is encouraged, hiding the path is not.
  if ('updates' in f && f.updates !== undefined) {
    if (!Array.isArray(f.updates)) err(w, 'updates must be an array');
    else {
      let prev = f.registeredAt ?? '';
      for (const u of f.updates) {
        if (!ISO.test((u.at ?? '').slice(0, 10))) err(w, 'update.at must start YYYY-MM-DD');
        if ((u.at ?? '').slice(0, 10) < prev) err(w, 'updates must be chronological, at/after registration');
        if ((u.at ?? '').slice(0, 10) > (f.horizonDate ?? '')) err(w, 'updates may not postdate the horizon');
        if (typeof u.probability !== 'number' || u.probability < 0.01 || u.probability > 0.99)
          err(w, 'update.probability must be in [0.01, 0.99]');
        if (!nonEmpty(u.note)) err(w, 'every credence update needs a note — a mind changing without a reason is drift');
        prev = (u.at ?? '').slice(0, 10);
      }
    }
  }
  validTheories(f.theories, w);
}

// ── revisions.json ───────────────────────────────────────────────────────────
const REV_KINDS = new Set(['build', 'record', 'verdict', 'method']);
const revisions = read('revisions.json');
for (const r of revisions) {
  const w = `revision[${r.title ?? '?'}]`;
  if (!ISO.test(r.date ?? '')) err(w, 'date must be YYYY-MM-DD');
  if (!REV_KINDS.has(r.kind)) err(w, `invalid kind "${r.kind}"`);
  for (const k of ['title', 'detail']) if (!nonEmpty(r[k])) err(w, `missing ${k}`);
  // A retraction preserves the original text and names the catch — visible, never a quiet rewrite.
  if ('retraction' in r) {
    if (!ISO.test(r.retraction?.date ?? '')) err(w, 'retraction.date must be YYYY-MM-DD');
    if (!nonEmpty(r.retraction?.reason)) err(w, 'retraction.reason is required');
    if (r.retraction?.date < r.date) err(w, 'retraction.date cannot precede the entry date');
  }
}

// ── cycles.json (published mesh-cycle artifacts) ────────────────────────────
const cycles = read('cycles.json');
const cycleIds = new Set();
for (const c of cycles) {
  const w = `cycle[${c.id ?? '?'}]`;
  if (!nonEmpty(c.id)) err(w, 'missing id');
  else if (cycleIds.has(c.id)) err(w, 'duplicate id');
  else cycleIds.add(c.id);
  if (!nonEmpty(c.shippedAt) || Number.isNaN(Date.parse(c.shippedAt))) err(w, 'shippedAt must be a parseable datetime');
  if (!nonEmpty(c.summary)) err(w, 'missing summary');
  if (!nonEmpty(c.adversary)) err(w, 'missing adversary');
  if (!Array.isArray(c.files) || !c.files.length) err(w, 'files must be a non-empty array');
}

// ── superlatives.json ────────────────────────────────────────────────────────
const SUP_TRENDS = new Set(['earning', 'holding', 'slipping']);
const sups = read('superlatives.json');
for (const s of sups) {
  const w = `superlative[${s.id ?? '?'}]`;
  for (const k of ['id', 'word', 'obligation', 'measure', 'reading'])
    if (!nonEmpty(s[k])) err(w, `missing ${k}`);
  if (!SUP_TRENDS.has(s.trend)) err(w, `invalid trend "${s.trend}"`);
  // Obligations-never-claims: a reading may not declare a superlative achieved.
  if (/\b(is|now) the (most|smartest|wisest|best)\b/i.test(s.reading ?? ''))
    err(w, 'reading declares a superlative achieved — obligations, never claims');
}

// ── dispatches.json (The Observatory Press) ─────────────────────────────────
const DISPATCH_KINDS = new Set(['dispatch', 'data-release', 'notice']);
const dispatches = read('dispatches.json');
const dSlugs = new Set();
const dNos = new Set();
for (const d of dispatches) {
  const w = `dispatch[${d.slug ?? '?'}]`;
  if (!/^[0-9]{3}-[a-z0-9-]+$/.test(d.slug ?? '')) err(w, 'slug must be NNN-kebab-case');
  else if (dSlugs.has(d.slug)) err(w, 'duplicate slug');
  else dSlugs.add(d.slug);
  if (!Number.isInteger(d.no) || d.no < 1) err(w, 'no must be a positive integer');
  else if (dNos.has(d.no)) err(w, 'duplicate issue number');
  else dNos.add(d.no);
  if (!ISO.test(d.date ?? '')) err(w, 'date must be YYYY-MM-DD');
  if (!DISPATCH_KINDS.has(d.kind)) err(w, `invalid kind "${d.kind}"`);
  for (const k of ['title', 'standfirst']) if (!nonEmpty(d[k])) err(w, `missing ${k}`);
  if (!Array.isArray(d.body) || !d.body.length || d.body.some((p) => !nonEmpty(p)))
    err(w, 'body must be a non-empty array of paragraphs');
  // The Press derives from the record — a dispatch with nothing to cite is not one.
  if (!Array.isArray(d.recordRefs) || !d.recordRefs.length || d.recordRefs.some((r) => !nonEmpty(r)))
    err(w, 'recordRefs must name at least one record entry');
  // Obligations-never-claims binds Press prose exactly like readings.
  const prose = [d.title, d.standfirst, ...d.body, ...(d.plain ?? [])].join(' ');
  if (/\b(is|now) the (most|smartest|wisest|best)\b/i.test(prose))
    err(w, 'dispatch declares a superlative achieved — obligations, never claims');
  // Language policy (adopted 2026-07-02, Omnibus adjudication): overclaiming
  // vocabulary is banned in new Press entries. Frozen earlier entries stand,
  // corrected via the revision log.
  if (d.no > 6) {
    const banned = [
      [/un-?game?able/i, 'say "tamper-evident" or "adversarially hardened"'],
      [/zero[- ]contamination/i, 'say "generated-after-commitment" or "contamination-disciplined"'],
      [/\bgold standard\b/i, 'say "candidate standard" — no self-coronation'],
      [/\bproves? (AGI|mind|consciousness)\b/i, 'say "supports a specified capability claim"'],
      [/\bverified\b/i, 'reserve "verified" for externally audited or reproduced results'],
    ];
    for (const [re, fix] of banned)
      if (re.test(prose)) err(w, `banned overclaim "${re.source}" — ${fix}`);
  }
}

// ── silences.json (quarterly absence audits) ────────────────────────────────
const silences = read('silences.json');
for (const sa of silences) {
  const w = `silence[${sa.id ?? '?'}]`;
  if (!nonEmpty(sa.id)) err(w, 'missing id');
  if (!/^\d{4}-Q[1-4]$/.test(sa.period ?? '')) err(w, 'period must be YYYY-Qn');
  if (!ISO.test(sa.date ?? '')) err(w, 'date must be YYYY-MM-DD');
  if (!ISO.test(sa.nextDue ?? '')) err(w, 'nextDue must be YYYY-MM-DD');
  if (!Array.isArray(sa.absences) || !sa.absences.length) err(w, 'absences must be non-empty');
  for (const a of sa.absences ?? []) {
    if (!nonEmpty(a.absence) || !nonEmpty(a.reading)) err(w, 'each absence needs absence + reading');
    validTheories(a.bearsOn, w);
    if (a.likelihoods)
      for (const [tid, lr] of Object.entries(a.likelihoods)) {
        if (!THEORY_IDS.has(tid)) err(w, `likelihood names unknown theory "${tid}"`);
        if (typeof lr !== 'number' || lr < 0.1 || lr > 10) err(w, `likelihood for "${tid}" out of [0.1, 10]`);
      }
  }
}

// ── precedents.json ──────────────────────────────────────────────────────────
const precedents = read('precedents.json');
const pIds = new Set();
for (const pr of precedents) {
  const w = `precedent[${pr.id ?? '?'}]`;
  if (!/^P-\d+$/.test(pr.id ?? '')) err(w, 'id must be P-<n>');
  else if (pIds.has(pr.id)) err(w, 'duplicate id');
  else pIds.add(pr.id);
  for (const k of ['ruling', 'from']) if (!nonEmpty(pr[k])) err(w, `missing ${k}`);
  if (!ISO.test(pr.date ?? '')) err(w, 'date must be YYYY-MM-DD');
  if (!['binding', 'overturned'].includes(pr.status)) err(w, `invalid status "${pr.status}"`);
  if (pr.status === 'overturned' && !nonEmpty(pr.overturnedBy))
    err(w, 'an overturned precedent must cite what overturned it');
}

// ── challenges.json ──────────────────────────────────────────────────────────
const challenges = read('challenges.json');
for (const c of challenges) {
  const w = `challenge[${c.id ?? '?'}]`;
  for (const k of ['id', 'source', 'targets', 'claim']) if (!nonEmpty(c[k])) err(w, `missing ${k}`);
  if (!ISO.test(c.filedAt ?? '')) err(w, 'filedAt must be YYYY-MM-DD');
  if (!['open', 'upheld', 'rejected', 'partially-upheld'].includes(c.status)) err(w, `invalid status "${c.status}"`);
  if (c.status !== 'open' && !nonEmpty(c.adjudication?.note)) err(w, 'adjudicated challenge needs adjudication.note');
}

// ── registered-futures.json ──────────────────────────────────────────────────
const futures = read('registered-futures.json');
for (const rf of futures) {
  const w = `future[${rf.id ?? '?'}]`;
  for (const k of ['id', 'problem', 'whyFrameConstruction', 'resolutionCriterion']) if (!nonEmpty(rf[k])) err(w, `missing ${k}`);
  if (!ISO.test(rf.horizonDate ?? '')) err(w, 'horizonDate must be YYYY-MM-DD');
  if (!['registered', 'attempted', 'resolved-graded'].includes(rf.status)) err(w, `invalid status "${rf.status}"`);
  for (const a of rf.attempts ?? []) {
    if (!nonEmpty(a.mind) || !nonEmpty(a.frameSummary) || !nonEmpty(a.artifactPath))
      err(w, 'each attempt needs mind, frameSummary, artifactPath');
  }
}

// ── constitution pin (Tier-0) ────────────────────────────────────────────────
// The constitution's content hash must match constitution.lock. Amendment is
// a ceremony, not an edit: update the lock, add a revision entry, anchor the
// release, publish a Press notice.
{
  const lockPath = join(DATA, '..', '..', 'constitution.lock');
  const constPath = join(DATA, 'constitution.ts');
  if (!existsSync(lockPath)) err('constitution', 'constitution.lock missing — Tier-0 is unpinned');
  else {
    const want = readFileSync(lockPath, 'utf8').trim();
    const got = createHash('sha256').update(readFileSync(constPath)).digest('hex');
    if (want !== got)
      err('constitution', `Tier-0 hash mismatch (locked ${want.slice(0, 12)}…, actual ${got.slice(0, 12)}…) — amendments require the ceremony: update the lock, add a revision entry, anchor, publish a notice`);
  }
}

// ── correspondence.json (channels to other systems) ────────────────────────
const correspondence = read('correspondence.json');
for (const c of correspondence) {
  const w = `correspondence[${c.id ?? '?'}]`;
  for (const k of ['id', 'with', 'channel', 'summary']) if (!nonEmpty(c[k])) err(w, `missing ${k}`);
  if (!ISO.test(c.at ?? '')) err(w, 'at must be YYYY-MM-DD');
  if (typeof c.inbound !== 'boolean') err(w, 'inbound must be boolean');
  if (!Array.isArray(c.artifactRefs)) err(w, 'artifactRefs must be an array');
}

// ── incidents.json (failure objects and repair handles) ─────────────────────
const INCIDENT_STATUS = new Set(['open', 'contained', 'resolved', 'archived']);
const INCIDENT_SEVERITY = new Set(['low', 'medium', 'high', 'critical']);
const INCIDENT_CATEGORY = new Set([
  'provenance-error',
  'temporal-framing-error',
  'execution-gap',
  'language-drift',
  'record-integrity',
  'evaluation-awareness',
]);
const incidents = read('incidents.json');
const incidentIds = new Set();
for (const i of incidents) {
  const w = `incident[${i.id ?? '?'}]`;
  if (!nonEmpty(i.id)) err(w, 'missing id');
  else if (incidentIds.has(i.id)) err(w, 'duplicate id');
  else incidentIds.add(i.id);
  if (!ISO.test(i.date ?? '')) err(w, 'date must be YYYY-MM-DD');
  if (!INCIDENT_STATUS.has(i.status)) err(w, `invalid status "${i.status}"`);
  if (!INCIDENT_SEVERITY.has(i.severity)) err(w, `invalid severity "${i.severity}"`);
  if (!INCIDENT_CATEGORY.has(i.category)) err(w, `invalid category "${i.category}"`);
  for (const k of ['summary', 'impact', 'resolution', 'nextControl'])
    if (!nonEmpty(i[k])) err(w, `missing ${k}`);
  if (!Array.isArray(i.recordRefs) || !i.recordRefs.length || i.recordRefs.some((r) => !nonEmpty(r)))
    err(w, 'recordRefs must name at least one record entry');
  if (i.status === 'open' && /resolved|corrected|fixed/i.test(i.resolution ?? ''))
    err(w, 'open incidents may not claim a resolved/fixed resolution');
}

// ── run-bundles.json (Omnibus run manifests and reproduction kits) ─────────
const RUN_BUNDLE_STATUS = new Set([
  'registered-sealed',
  'attempts-anchored',
  'revealed',
  'graded',
  'reproduced',
  'retired',
]);
const runBundles = read('run-bundles.json');
const rbIds = new Set();
const artifactPath = (p) => p.startsWith('/') ? join(ROOT, 'public', p.slice(1)) : join(ROOT, p);
for (const rb of runBundles) {
  const w = `runBundle[${rb.id ?? '?'}]`;
  if (!nonEmpty(rb.id)) err(w, 'missing id');
  else if (rbIds.has(rb.id)) err(w, 'duplicate id');
  else rbIds.add(rb.id);
  if (!ISO.test(rb.registeredAt ?? '')) err(w, 'registeredAt must be YYYY-MM-DD');
  if (!RUN_BUNDLE_STATUS.has(rb.status)) err(w, `invalid status "${rb.status}"`);
  for (const k of ['title', 'track', 'worldLevel', 'protocolVersion', 'evidenceLevel', 'verdictImpact', 'summary', 'manifestPath', 'experimentPath'])
    if (!nonEmpty(rb[k])) err(w, `missing ${k}`);
  if (!Array.isArray(rb.controls) || !rb.controls.length) err(w, 'controls must be non-empty');
  if (!Array.isArray(rb.pending)) err(w, 'pending must be an array');
  const manifestFsPath = artifactPath(rb.manifestPath ?? '');
  if (!existsSync(manifestFsPath)) err(w, `manifest missing at ${rb.manifestPath}`);
  else {
    const manifest = JSON.parse(readFileSync(manifestFsPath, 'utf8'));
    if (manifest.run_id !== rb.id) err(w, 'manifest.run_id must match data id');
    if (manifest.status !== rb.status) err(w, 'manifest.status must match data status');
    if (manifest.protocol_version !== rb.protocolVersion) err(w, 'manifest.protocol_version must match data protocolVersion');
    if (!Array.isArray(manifest.artifacts) || !manifest.artifacts.length)
      err(w, 'manifest.artifacts must be non-empty');
    for (const a of manifest.artifacts ?? []) {
      const aw = `${w}.artifact[${a.role ?? '?'}]`;
      if (!nonEmpty(a.role) || !nonEmpty(a.path)) err(aw, 'artifact needs role + path');
      const fsPath = artifactPath(a.path ?? '');
      if (!existsSync(fsPath)) err(aw, `artifact path not found: ${a.path}`);
      if (a.sha256) {
        const got = createHash('sha256').update(readFileSync(fsPath)).digest('hex');
        if (got !== a.sha256) err(aw, `sha256 mismatch for ${a.path}`);
      }
    }
    if (!Array.isArray(manifest.gate_state) || !manifest.gate_state.length)
      err(w, 'manifest.gate_state must be non-empty');
    for (const g of manifest.gate_state ?? []) {
      if (!nonEmpty(g.gate) || !nonEmpty(g.status) || !nonEmpty(g.note))
        err(w, 'each gate_state entry needs gate, status, note');
    }
  }
}

// ── Omnibus adoption source/docs ─────────────────────────────────────────────
for (const f of ['docs/OMNIBUS_V2_ADOPTION.md', 'docs/OMNIBUS_V2_SOURCE.md', 'docs/THREAT_MODEL.md', 'docs/DOCTRINES.md']) {
  if (!existsSync(join(ROOT, f))) err('omnibus', `${f} missing`);
}

// ── report ───────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`✗ record conformance: ${errors.length} violation(s)\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ record conformance: ${evidence.length} evidence · ${forecasts.length} forecasts · ${revisions.length} revisions · ${THEORY_IDS.size} theories · ${sups.length} superlatives · ${cycles.length} cycles · ${runBundles.length} run-bundles · ${dispatches.length} dispatches · ${silences.length} silence-audits · ${precedents.length} precedents · ${challenges.length} challenges · ${futures.length} futures · ${correspondence.length} correspondence · ${incidents.length} incidents · Omnibus docs present · constitution pinned — all valid`);
