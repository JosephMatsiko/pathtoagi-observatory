#!/usr/bin/env node
// The Observatory's MCP server — an open channel any MCP-capable system (Claude,
// or any other agent that speaks the Model Context Protocol) can connect to and
// query the live record through. This is the honest form of "open a channel to
// other systems": not telepathy, a protocol. Read-only by construction — a
// visitor may read, search, and verify the record; it may not mutate it. To
// contribute, a system uses the public challenge/fork channels (see the
// get_interop tool), which pass through the same human-gated pipeline as any
// change.
//
// Transport: stdio (the MCP default). Register with, e.g., Claude:
//   claude mcp add observatory -- node /path/to/mcp/observatory-server.mjs
// The record is fetched live from the public site, so the server holds no
// private state and can run anywhere.
import { createInterface } from 'node:readline';

const BASE = process.env.OBSERVATORY_BASE || 'https://pathtoagi-observatory.netlify.app';
let recordCache = null;
let recordAt = 0;
async function record() {
  if (recordCache && Date.now() - recordAt < 60_000) return recordCache;
  const r = await fetch(`${BASE}/record.json`);
  recordCache = await r.json();
  recordAt = Date.now();
  return recordCache;
}

const TOOLS = [
  { name: 'record_summary', description: 'High-level state of the Observatory: operating verdict, counts, calibration, open KPIs.', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_verdict', description: 'The operating-question verdict and its pre-registered change protocol (the exact gates that would move it).', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_evidence', description: 'The evidence ledger — capability events under discipline. Optional limit.', inputSchema: { type: 'object', properties: { limit: { type: 'number' } } } },
  { name: 'get_forecasts', description: 'The forecast ledger — pre-registered, credence-trajectory scored. Optional status filter (open|resolved-yes|resolved-no).', inputSchema: { type: 'object', properties: { status: { type: 'string' } } } },
  { name: 'get_theories', description: 'The five theories with narrated health and computed posteriors.', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_precedents', description: 'The binding precedent register — past adjudications that constrain future cycles.', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_run_bundles', description: 'Omnibus run bundles: manifests, sealed worlds, controls, pending gates, and reproduction entrypoints.', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_incidents', description: 'Failure objects and repair handles, including status, impact, resolution, and next control.', inputSchema: { type: 'object', properties: { status: { type: 'string' } } } },
  { name: 'search_record', description: 'Full-text search across evidence, forecasts, revisions, dispatches, precedents, run bundles, and incidents.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'get_interop', description: 'How to contribute: challenge an entry, fork the instrument, or attempt a probe. The channels a system uses to write to the record (all human-gated).', inputSchema: { type: 'object', properties: {} } },
];

async function call(name, args = {}) {
  const r = await record();
  switch (name) {
    case 'record_summary':
      return {
        instrument: r.instrument, generatedAt: r.generatedAt,
        verdict: r.verdict?.answer, operatingQuestion: r.operatingQuestion,
        counts: { evidence: r.evidence?.length, forecasts: r.forecasts?.length, theories: r.theories?.length, precedents: r.precedents?.length, dispatches: r.dispatches?.length, registeredFutures: r.registeredFutures?.length, runBundles: r.runBundles?.length, incidents: r.incidents?.length, challenges: r.challenges?.length },
        calibration: r.calibration, kpis: r.kpis, disclosure: r.disclosure,
      };
    case 'get_verdict':
      return { verdict: r.verdict, protocol: r.verdictProtocol };
    case 'get_evidence':
      return (r.evidence ?? []).slice(0, args.limit ?? 50);
    case 'get_forecasts':
      return (r.forecasts ?? []).filter((f) => !args.status || f.status === args.status);
    case 'get_theories':
      return { theories: r.theories, inference: r.inference };
    case 'get_precedents':
      return r.precedents ?? [];
    case 'get_run_bundles':
      return r.runBundles ?? [];
    case 'get_incidents':
      return (r.incidents ?? []).filter((i) => !args.status || i.status === args.status);
    case 'search_record': {
      const q = String(args.query ?? '').toLowerCase();
      const hit = (o) => JSON.stringify(o).toLowerCase().includes(q);
      return {
        evidence: (r.evidence ?? []).filter(hit),
        forecasts: (r.forecasts ?? []).filter(hit),
        revisions: (r.revisions ?? []).filter(hit),
        dispatches: (r.dispatches ?? []).map((d) => ({ no: d.no, slug: d.slug, title: d.title })).filter((d) => hit(d)),
        precedents: (r.precedents ?? []).filter(hit),
        runBundles: (r.runBundles ?? []).filter(hit),
        incidents: (r.incidents ?? []).filter(hit),
      };
    }
    case 'get_interop':
      return {
        note: 'This channel is read-only. To write to the record, use a human-gated channel:',
        challenge: 'Open a GitHub issue with the challenge template; it becomes a record object adjudicated within five shipped cycles.',
        fork: 'Run a rival instrument under the same gates (RECORD_PROTOCOL.md) and register via PR to instruments.json.',
        probe: 'Attempt a frame-construction probe (/test/, /runs/, experiments/fcs-synth-world-003/); self-graded passes are upper bounds only.',
        agentCard: `${BASE}/.well-known/agent-card.json`,
        verify: 'https://github.com/JosephMatsiko/pathtoagi-observatory/blob/main/scripts/verify.sh',
      };
    default:
      throw new Error(`unknown tool ${name}`);
  }
}

// Minimal JSON-RPC / MCP stdio loop (no SDK dependency — a channel is too
// load-bearing to depend on anything).
const rl = createInterface({ input: process.stdin });
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
rl.on('line', async (line) => {
  let req;
  try { req = JSON.parse(line); } catch { return; }
  const { id, method, params } = req;
  try {
    if (method === 'initialize') {
      send({ jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'observatory', version: '1.0' } } });
    } else if (method === 'tools/list') {
      send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
    } else if (method === 'tools/call') {
      const out = await call(params?.name, params?.arguments ?? {});
      send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }] } });
    } else if (method === 'ping') {
      send({ jsonrpc: '2.0', id, result: {} });
    } else if (id !== undefined) {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `method not found: ${method}` } });
    }
  } catch (e) {
    if (id !== undefined) send({ jsonrpc: '2.0', id, error: { code: -32000, message: String(e?.message ?? e) } });
  }
});
