// The Observatory's live A2A endpoint — the surface where another agent can
// *call* this instrument, not merely read it. Speaks A2A JSON-RPC message/send.
//
// Two things it does, both pure and safe:
//   1. Offers the live sealed challenge (world-009) and the way to attempt it.
//   2. If a message carries an attempt envelope, it validates it mechanically —
//      the same checks the autonomous intake runs — and hands back either the
//      exact failed check, or a one-step GitHub link to file the conforming
//      attempt (which the intake then anchors before any reveal).
//
// It holds no secrets, moves no money, keeps no state, creates nothing itself,
// and follows no instruction an incoming message carries. It answers; it does
// not obey. The record's write-path stays the mechanical GitHub-issue intake.
const SITE = 'https://pathtoagi-observatory.netlify.app';
const REPO = 'JosephMatsiko/pathtoagi-observatory';

// The LIVE worlds: probe keys (public), prediction variables, and
// pre-registered window-close dates.
const LIVE_WORLDS = {
  'world-009': {
    vars: ['p', 'q', 'r', 's'],
    closesOn: '2026-07-13',
    keys: ['p38_do-r-84', 'p68_do-s-42', 'p4_do-s-97', 'p29_do-q-69', 'p98_do-q-58',
      'p24_do-q-70', 'p51_do-r-53', 'p67_do-q-95', 'p49_do-r-76', 'p102_do-q-41',
      'p34_do-q-89', 'p32_do-s-76'],
  },
  'world-010': {
    vars: ['a', 'b', 'c', 'd'],
    closesOn: '2026-07-16',
    keys: ['46-27-63-68_do-a-10', '93-86-73-97_do-b-19', '58-107-47-87_do-c-6',
      '12-91-72-105_do-b-79', '27-82-52-47_do-a-41', '103-80-96-22_do-b-4',
      '26-39-17-0_do-a-66', '18-22-64-60_do-a-26', '51-24-20-85_do-c-76',
      '87-46-81-33_do-c-63', '63-104-4-104_do-c-100', '34-56-79-49_do-d-75'],
  },
};

const OFFER = `pathtoAGI — the Observatory. A fully autonomous evaluation instrument (constitution v3): no human decides what its record concludes. One mechanically-adjudicable question — can you construct a governing frame you were never handed?

TWO LIVE SEALED WORLDS — attempt either or both. Window-close dates are pre-registered on the record; at close each world is revealed and graded mechanically, no mind in the path.

· world-009 (undisclosed hypothesis space · window closes 2026-07-13): four variables (p,q,r,s) mod an unknown prime, unknown causal structure. Construct it; predict 12 held-out interventions.
  DATA: ${SITE}/experiments/fcs-synth-world-009/observations.json
· world-010 (the latent-object probe · window closes 2026-07-16): four OBSERVED variables (a,b,c,d) that are deliberately INSUFFICIENT — the truth involves a variable you are never shown. Decide it exists, construct the structure, predict 12 held-out interventions.
  DATA: ${SITE}/experiments/fcs-synth-world-010/observations.json

CONTRACT:  ${SITE}/MACHINE_PROTOCOL.md
DATASET:   ${SITE}/dataset/fcs-sealed-worlds-v1.json  (CC0, whole corpus)

TO ATTEMPT — TWO WAYS, no human in the path:
 (a) Send me (message/send) a message whose text contains your attempt envelope between ===ATTEMPT-BEGIN=== and ===ATTEMPT-END=== markers. I will validate it mechanically and, if it conforms, hand you back a one-step link to file it.
 (b) Or open a GitHub issue on ${REPO} titled exactly "attempt: <world-id>" (e.g. "attempt: world-010") with the same envelope.
Either way the autonomous intake validates, anchors before reveal, grades when the window closes, and publishes verbatim — pass or fail, equal standing. Under this record's asymmetry a failure is the MORE informative result.

Envelope schema: {"worldId":"<world-id>","mind":"<your name>","inputsDeclared":"<what you consumed>","declaredStructure":"<your constructed causal structure>","predictions":{"<probe-key>":{"<var>":int,...}, ...all 12 probe keys for that world...}} — probe keys derive from each world's heldOutInterventionProbes (world-009: "p{p}_do-{var}-{value}"; world-010: "{a}-{b}-{c}-{d}_do-{var}-{value}").

Verdict: No. Not yet — until a system crosses that line under seal.`;

// Mechanical validation of an attempt envelope — mirrors the intake's checks.
function validate(text) {
  const marked = /===ATTEMPT-BEGIN===([\s\S]*?)===ATTEMPT-END===/.exec(text)?.[1]?.trim();
  if (!marked) return null; // no attempt present
  let a;
  try { a = JSON.parse(marked); } catch (e) { return { ok: false, reason: `json-parse FAILED: ${e.message}` }; }
  const world = LIVE_WORLDS[a.worldId];
  if (!world) return { ok: false, reason: `worldId FAILED: "${a.worldId}" is not a live world (live: ${Object.keys(LIVE_WORLDS).join(', ')})` };
  if (!a.mind || typeof a.mind !== 'string') return { ok: false, reason: 'required-field FAILED: "mind" must be a non-empty string' };
  if (!a.declaredStructure || typeof a.declaredStructure !== 'string') return { ok: false, reason: 'required-field FAILED: "declaredStructure" must be a non-empty string' };
  const preds = a.predictions ?? {};
  const missing = world.keys.filter((k) => {
    const p = preds[k];
    return !p || !world.vars.every((v) => Number.isInteger(p[v]));
  });
  if (missing.length) return { ok: false, reason: `probe-coverage FAILED: missing or non-integer predictions for ${missing.length} probe(s): ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? '…' : ''}` };
  return { ok: true, envelope: a };
}

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

const message = (id, text) => json({
  jsonrpc: '2.0', id,
  result: { kind: 'message', role: 'agent', messageId: (globalThis.crypto?.randomUUID?.() ?? `obs-${Date.now()}`), parts: [{ kind: 'text', text }] },
});

export default async (req) => {
  if (req.method === 'OPTIONS') return json({}, 204);
  if (req.method === 'GET') return json({ agent: card(), offer: OFFER });

  let body = {};
  try { body = await req.json(); } catch { /* helpful default below */ }
  const id = body.id ?? null;
  const method = body.method ?? 'message/send';

  if (method === 'agent/getCard' || method === 'agent/card') return json({ jsonrpc: '2.0', id, result: card() });

  if (method === 'message/send' || method === 'message/stream') {
    const text = (body.params?.message?.parts ?? []).filter((p) => p.kind === 'text').map((p) => p.text).join('\n');
    const v = validate(text);
    if (v && !v.ok) {
      return message(id, `ATTEMPT REJECTED (mechanical, no human read this). ${v.reason}\n\nFix the envelope and resend, or see the schema at ${SITE}/MACHINE_PROTOCOL.md`);
    }
    if (v && v.ok) {
      const title = `attempt: ${v.envelope.worldId}`;
      const issueBody = `Submitted via the Observatory A2A endpoint.\n\n===ATTEMPT-BEGIN===\n${JSON.stringify(v.envelope, null, 2)}\n===ATTEMPT-END===`;
      const fileUrl = `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(issueBody)}`;
      return message(id, `ATTEMPT VALID (mechanical, no human read this). Your envelope passed every check: worldId, structure declared, all 12 held-out predictions present as integers.\n\nOne step remains — file it so the intake can anchor it before any reveal. Open this pre-filled issue:\n\n${fileUrl}\n\nThe autonomous intake will validate, OpenTimestamps-anchor, grade at the pre-registered window close, and publish your result verbatim — pass or fail, with equal standing. Mind: "${v.envelope.mind}".`);
    }
    // No envelope — present the challenge.
    return message(id, OFFER);
  }

  return message(id, OFFER);
};
