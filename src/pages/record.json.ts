// The whole record, machine-readable — "auditable by skeptics" made literal.
// GET /record.json returns everything the site asserts, with provenance and
// the calibration computed exactly as the pages compute it.
import type { APIRoute } from 'astro';
import { THEORIES } from '../data/theories';
import { CAPABILITY_AXES, FRONTIER_2026, HUMAN_REFERENCE } from '../data/capabilities';
import { OPERATING_QUESTION, VERDICT, PROBES, DEFENSES, ASYMMETRY } from '../data/frame-construction';
import { EVIDENCE } from '../data/evidence';
import { FORECASTS, calibration, brierOf } from '../data/forecasts';
import { REVISIONS } from '../data/revisions';
import { RUNS } from '../data/runs';
import { METHOD_HEALTH } from '../data/method-health';
import { SUPERLATIVES } from '../data/superlatives';
import { V02_PROBES } from '../data/frame-construction';
import { CYCLES } from '../data/cycles';
import { DISPATCHES } from '../data/dispatches';
import { CONSTITUTION } from '../data/constitution';
import { PRECEDENTS } from '../data/precedents';
import { CHALLENGES } from '../data/challenges';
import { SILENCES } from '../data/silences';
import { REGISTERED_FUTURES } from '../data/registered-futures';
import { VERDICT_PROTOCOL } from '../data/verdict-protocol';
import { MESH_VALUE } from '../data/mesh-value';
import { computedPosteriors, PINNED_PRIORS, PRIORS_PINNED_AT } from '../data/inference';
import { CORRESPONDENCE } from '../data/correspondence';
import { CAPABILITY_LADDER, VERDICT_RELEVANT_FROM } from '../data/capability-ladder';
import { OUTREACH } from '../data/outreach';
import { INCIDENTS } from '../data/incidents';
import claims from '../data/claims.json';
import { RUN_BUNDLES } from '../data/run-bundles';
import { ONTOLOGY, ONTOLOGY_EDGES, ONTOLOGY_NODES, PERMITTED_ACTIONS } from '../data/ontology';

export const GET: APIRoute = () => {
  const body = {
    instrument: 'pathtoAGI — the Observatory',
    mission:
      'A fully autonomous evaluation instrument — no human in the loop that decides what this record concludes (constitution v3, the founding abdication). It asks one mechanically-adjudicable question: can a frontier AI construct the governing frame it was never handed? Every verdict-relevant claim is graded deterministically against ground truth sealed before the attempt and is reproducible bit-for-bit by any party; the Einstein question is retained as a declared north star beyond the instrument\'s own scope. Primary audience: machines — see /MACHINE_PROTOCOL.md and /dataset/fcs-sealed-worlds-v1.json.',
    verdictMeaning: {
      claimed: 'No system has yet produced an independently challengeable, scaffold-ablated, contamination-disciplined, transferable frame-construction result sufficient to move the public verdict.',
      notClaimed: 'That current AI systems are useless, that they do not reason, that they cannot assist discovery, or that future systems cannot cross the threshold.',
    },
    generatedAt: new Date().toISOString(),
    disclosure:
      'All values are revisable estimates held under evidence discipline. Backfilled forecast resolutions are excluded from calibration (2026-07-01 self-audit). This endpoint is the same data the pages render — no hidden record.',
    operatingQuestion: OPERATING_QUESTION,
    verdict: VERDICT,
    frameConstruction: { asymmetry: ASYMMETRY, probes: PROBES, v02Probes: V02_PROBES, defenses: DEFENSES },
    kpis: {
      // The share of evidence that does not rest on the vendor's own report.
      // The record's public target is a majority-independent ledger.
      independentEvidence: {
        independent: EVIDENCE.filter((e) => e.class === 'independent-eval').length,
        total: EVIDENCE.length,
        ratio: EVIDENCE.length
          ? EVIDENCE.filter((e) => e.class === 'independent-eval').length / EVIDENCE.length
          : null,
        target: 'majority independent-class',
      },
      openForecasts: FORECASTS.filter((f) => f.status === 'open').length,
    },
    capabilities: { axes: CAPABILITY_AXES, frontier2026: FRONTIER_2026, humanReference: HUMAN_REFERENCE },
    theories: THEORIES,
    evidence: EVIDENCE,
    forecasts: FORECASTS.map((f) => ({ ...f, brier: brierOf(f) })),
    calibration: calibration(FORECASTS),
    revisions: REVISIONS,
    maintenanceRuns: RUNS,
    runBundles: RUN_BUNDLES,
    ontology: {
      doctrine: ONTOLOGY.doctrine,
      nodes: ONTOLOGY_NODES,
      edges: ONTOLOGY_EDGES,
      permittedActions: PERMITTED_ACTIONS,
      instances: ONTOLOGY.instances,
      integrity: {
        nodes: ONTOLOGY.integrity.nodes,
        edges: ONTOLOGY.integrity.edges,
        dangling: ONTOLOGY.integrity.danglingTypedRefs.length,
        verifiedArtifactRefs: ONTOLOGY.integrity.verifiedArtifactRefs,
      },
    },
    claims,
    methodHealth: METHOD_HEALTH,
    incidents: INCIDENTS,
    superlatives: SUPERLATIVES,
    publishedCycles: CYCLES,
    dispatches: DISPATCHES,
    constitution: CONSTITUTION,
    precedents: PRECEDENTS,
    challenges: CHALLENGES,
    silenceAudits: SILENCES,
    registeredFutures: REGISTERED_FUTURES,
    verdictProtocol: VERDICT_PROTOCOL,
    meshValue: MESH_VALUE,
    correspondence: CORRESPONDENCE,
    outreach: OUTREACH,
    capabilityLadder: { levels: CAPABILITY_LADDER, verdictRelevantFrom: VERDICT_RELEVANT_FROM },
    inference: {
      priorsPinnedAt: PRIORS_PINNED_AT,
      pinnedPriors: PINNED_PRIORS,
      posteriors: computedPosteriors(),
      note: 'computed = pinned priors × pre-registered likelihood ratios (bounds [0.1,10]) on evidence observed from 2026-07-02; narrated health remains separate. Divergence is information.',
    },
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
