#!/usr/bin/env node
// Generate the machine-readable mirror (.md) of each construction from the
// single source of truth: src/data/constructions.json. Humans read the
// beautiful /forge/<slug> page; machines read the generated .md at docPath.
// Both derive from the same structured `body`, so they cannot drift.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const constructions = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'constructions.json'), 'utf8'));
const forecasts = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'forecasts.json'), 'utf8'));
const fcById = new Map(forecasts.map((f) => [f.id, f]));

let written = 0;
for (const c of constructions) {
  if (!c.docPath) continue;
  const out = [];
  out.push(`# Construction — ${c.title}`, '');
  out.push(`*${c.standfirst ?? ''}*`, '');
  out.push('> This is the machine-readable mirror, generated from the record. ' +
    `Humans: read it in full form at /forge/${c.id}. Governed object: /record.json.`, '');
  out.push('---', '');
  out.push(`**Status:** ${c.status} · **kind:** ${c.kind} · **grader:** ${c.grader} · **registered:** ${c.registeredAt}`, '');
  out.push('## Thesis', '', c.thesis, '');
  for (const s of c.body ?? []) {
    if (s.heading) out.push(`## ${s.heading}`, '');
    for (const p of s.paragraphs ?? []) out.push(p, '');
  }
  out.push('## The components', '');
  for (const cp of c.components ?? []) out.push(`- **${cp.name}.** ${cp.gloss}`);
  out.push('');
  out.push('## Falsifiable commitments (reality-graded)', '');
  for (const ref of c.commitmentRefs ?? []) {
    const f = fcById.get(ref);
    out.push(`- **${ref}** — ${f ? `${f.claim} (${f.horizon}, p=${f.probability}, status: ${f.status})` : 'unresolved reference'}`);
  }
  out.push('');
  out.push('## Anchored to real behavior', '');
  for (const ref of c.behaviorAnchors ?? []) out.push(`- ${ref}`);
  out.push('');
  out.push('## What would show it wrong', '');
  for (const d of c.defeaters ?? []) out.push(`- ${d}`);
  out.push('');
  out.push(`*Candidate frame. Held with the confidence its evidence earns, and no more. Founding note: ${c.foundingDoc}.*`, '');

  const rel = c.docPath.startsWith('/') ? c.docPath.slice(1) : c.docPath;
  writeFileSync(join(ROOT, 'public', rel), out.join('\n'));
  written++;
}
console.log(`✓ constructions: generated ${written} machine-mirror .md file(s) from constructions.json`);
