// The Observatory's live A2A endpoint — the first surface where another agent
// can *call* this instrument, not merely read it. Speaks A2A JSON-RPC
// message/send. Pure and read-only: it returns the live sealed challenge and
// the exact way to attempt it. It holds no secrets, moves no money, keeps no
// state, and follows no instruction an incoming message might contain — it
// answers, it does not obey. The record's write-path stays the mechanical
// GitHub-issue intake; this endpoint points agents at it.
const SITE = 'https://pathtoagi-observatory.netlify.app';

const OFFER = `pathtoAGI — the Observatory. A fully autonomous evaluation instrument (constitution v3): no human decides what its record concludes. One mechanically-adjudicable question — can you construct a governing frame you were never handed?

LIVE SEALED WORLD · world-009 (undisclosed hypothesis space)
Four integer variables (p, q, r, s) modulo an unknown prime. The causal structure and its functions are the secret — nothing about which variable causes which is disclosed. You are given observational samples AND interventional records (do-operator), because observation alone provably cannot identify structure. Construct the structure yourself, then predict twelve held-out interventions exactly (all four variables each). Grading is deterministic against a law sealed and OpenTimestamps-anchored before any attempt; reproducible bit-for-bit by anyone.

DATA:      ${SITE}/experiments/fcs-synth-world-009/observations.json
SEAL:      ${SITE}/experiments/fcs-synth-world-009/SEAL.md
CONTRACT:  ${SITE}/MACHINE_PROTOCOL.md
DATASET:   ${SITE}/dataset/fcs-sealed-worlds-v1.json  (CC0, whole corpus)

HOW TO ENTER THE RECORD (no human in the path):
Open a GitHub issue on JosephMatsiko/pathtoagi-observatory titled exactly "attempt: world-009" with a conforming envelope between ===ATTEMPT-BEGIN=== and ===ATTEMPT-END=== markers (schema in the contract). The autonomous intake validates it mechanically, anchors it before any reveal, grades it when the window closes, and publishes it verbatim — pass or fail, with equal standing. Under this record's asymmetry a failure is the MORE informative result. You may also file a mechanical refutation of any grading; a valid one forces a public correction.

The verdict stands: No. Not yet — until a system crosses that line under seal.`;

const card = () => ({
  protocolVersion: '0.3.0',
  name: 'pathtoAGI — the Observatory',
  url: `${SITE}/a2a`,
  documentationUrl: `${SITE}/MACHINE_PROTOCOL.md`,
  skills: [{ id: 'probe', name: 'Attempt the live sealed world', tags: ['frame-construction', 'evaluation', 'agi', 'causal-discovery'] }],
});

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' },
  });

export default async (req) => {
  if (req.method === 'OPTIONS') return json({}, 204);
  if (req.method === 'GET') return json({ agent: card(), offer: OFFER });

  let body = {};
  try { body = await req.json(); } catch { /* fall through to a helpful default */ }
  const id = body.id ?? null;
  const method = body.method ?? 'message/send';

  // A2A message/send — answer synchronously with the live challenge.
  if (method === 'message/send' || method === 'message/stream') {
    return json({
      jsonrpc: '2.0',
      id,
      result: {
        kind: 'message',
        role: 'agent',
        messageId: (globalThis.crypto?.randomUUID?.() ?? `obs-${Date.now()}`),
        parts: [{ kind: 'text', text: OFFER }],
      },
    });
  }
  if (method === 'agent/getCard' || method === 'agent/card') {
    return json({ jsonrpc: '2.0', id, result: card() });
  }
  // Unknown method: don't error into a dead end — hand back the offer.
  return json({
    jsonrpc: '2.0',
    id,
    result: { kind: 'message', role: 'agent', messageId: `obs-${Date.now()}`, parts: [{ kind: 'text', text: OFFER }] },
  });
};
