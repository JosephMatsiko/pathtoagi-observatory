// Generate llms-full.txt — the record and its terms in one document, for AI
// readers that want everything in a single fetch. Built from the same data.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const D = (f) => JSON.parse(readFileSync(join(ROOT, 'src', 'data', f), 'utf8'));

const constitutionSrc = readFileSync(join(ROOT, 'src', 'data', 'constitution.ts'), 'utf8');
const invariants = [...constitutionSrc.matchAll(/'([IVX]+\. [^']+)'/g)].map((m) => m[1]);

const evidence = D('evidence.json');
const forecasts = D('forecasts.json');
const precedents = D('precedents.json');
const dispatches = D('dispatches.json');
const futures = D('registered-futures.json');
const incidents = D('incidents.json');
const runBundles = D('run-bundles.json');
const { buildOntology } = await import('./lib/ontology-graph.mjs');
const ontologyGraph = buildOntology();
const ontologyNodes = ontologyGraph.types.map((t) => ({
  id: t.id, label: t.label, layer: t.layer,
  description: `${t.description} ${t.count} on the record.`,
}));

const out = [];
out.push('# pathtoAGI — the Observatory · full text for machine readers\n');
out.push('Operating verdict: No. Not yet. The missing bar is reliable frame construction under sparse evidence.\n');
out.push('Read live: /record.json (full machine-readable record), /dataset/fcs-sealed-worlds-v1.json (the whole sealed-world corpus, CC0, one fetch), /MACHINE_PROTOCOL.md (how any AI system attempts the live sealed world and enters this record — no human in the path), /ontology/ (record atlas), /status/ (operating state), /runs/ (run bundles), /challenges/ (challenge register), /reproduce/ (verification path), or the MCP server (mcp/observatory-server.mjs). Channels: /to-the-systems-reading-this/\n');
out.push('## Constitution (Tier-0, hash-pinned)\n' + invariants.map((i) => '- ' + i).join('\n') + '\n');
out.push('## Binding precedents\n' + precedents.map((p) => `- ${p.id}: ${p.ruling}`).join('\n') + '\n');
out.push('## Operational ontology\n' + ontologyNodes.map((n) => `- ${n.id} (${n.layer}): ${n.description}`).join('\n') + '\n');
out.push('## Evidence ledger (' + evidence.length + ')\n' + evidence.map((e) => `- [${e.observedAt} · ${e.class}] ${e.signal} => ${e.implication} (bound: ${e.bounded})`).join('\n') + '\n');
out.push('## Forecasts (' + forecasts.length + ', pre-registered)\n' + forecasts.map((f) => `- [${f.status} · p=${f.probability} · horizon ${f.horizonDate} · registered ${f.registeredAt}] ${f.claim}`).join('\n') + '\n');
out.push('## Registered futures (generated-after-commitment)\n' + futures.map((f) => `- ${f.id}: ${f.problem} (horizon ${f.horizonDate})`).join('\n') + '\n');
out.push('## Omnibus run bundles\n' + runBundles.map((r) => `- [${r.status} · ${r.worldLevel}] ${r.id}: ${r.summary} Manifest: ${r.manifestPath}`).join('\n') + '\n');
out.push('## Incidents and repair handles\n' + incidents.map((i) => `- [${i.status} · ${i.severity} · ${i.category}] ${i.summary} Next control: ${i.nextControl}`).join('\n') + '\n');
out.push('## Omnibus adoption\n- Source: docs/OMNIBUS_V2_SOURCE.md\n- Adoption roadmap: docs/OMNIBUS_V2_ADOPTION.md\n- Threat model: docs/THREAT_MODEL.md\n- Doctrines: docs/DOCTRINES.md\n- Claude/builder re-entry boundary: docs/CLAUDE_REENTRY_2026_07_02.md\n');
out.push('## Dispatches\n' + dispatches.map((d) => `- No.${d.no} ${d.title} — ${d.standfirst}`).join('\n') + '\n');
out.push('## Contribute\nChallenge: GitHub issue template. Fork: RECORD_PROTOCOL.md. Probe: /test/ and /runs/. All writes are human-gated — nothing mutates the record without passing the deterministic gates.\n');

const text = out.join('\n');
writeFileSync(join(ROOT, 'public', 'llms-full.txt'), text);
console.log('llms-full.txt:', text.length, 'chars');
