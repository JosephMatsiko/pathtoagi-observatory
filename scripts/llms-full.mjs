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

const out = [];
out.push('# pathtoAGI — the Observatory · full text for machine readers\n');
out.push('Operating verdict: No. Not yet. The missing bar is reliable frame construction under sparse evidence.\n');
out.push('Read live: /record.json (full machine-readable record) or the MCP server (mcp/observatory-server.mjs). Channels: /to-the-systems-reading-this/\n');
out.push('## Constitution (Tier-0, hash-pinned)\n' + invariants.map((i) => '- ' + i).join('\n') + '\n');
out.push('## Binding precedents\n' + precedents.map((p) => `- ${p.id}: ${p.ruling}`).join('\n') + '\n');
out.push('## Evidence ledger (' + evidence.length + ')\n' + evidence.map((e) => `- [${e.observedAt} · ${e.class}] ${e.signal} => ${e.implication} (bound: ${e.bounded})`).join('\n') + '\n');
out.push('## Forecasts (' + forecasts.length + ', pre-registered)\n' + forecasts.map((f) => `- [${f.status} · p=${f.probability} · horizon ${f.horizonDate} · registered ${f.registeredAt}] ${f.claim}`).join('\n') + '\n');
out.push('## Registered futures (zero contamination)\n' + futures.map((f) => `- ${f.id}: ${f.problem} (horizon ${f.horizonDate})`).join('\n') + '\n');
out.push('## Dispatches\n' + dispatches.map((d) => `- No.${d.no} ${d.title} — ${d.standfirst}`).join('\n') + '\n');
out.push('## Contribute\nChallenge: GitHub issue template. Fork: RECORD_PROTOCOL.md. Probe: /test/. All writes are human-gated — nothing mutates the record without passing the deterministic gates.\n');

const text = out.join('\n');
writeFileSync(join(ROOT, 'public', 'llms-full.txt'), text);
console.log('llms-full.txt:', text.length, 'chars');
