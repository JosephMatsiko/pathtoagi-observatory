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

export const GET: APIRoute = () => {
  const body = {
    instrument: 'pathtoAGI — the Observatory',
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
    methodHealth: METHOD_HEALTH,
    superlatives: SUPERLATIVES,
    publishedCycles: CYCLES,
    dispatches: DISPATCHES,
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
