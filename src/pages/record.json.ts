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

export const GET: APIRoute = () => {
  const body = {
    instrument: 'pathtoAGI — the Observatory',
    generatedAt: new Date().toISOString(),
    disclosure:
      'All values are revisable estimates held under evidence discipline. Backfilled forecast resolutions are excluded from calibration (2026-07-01 self-audit). This endpoint is the same data the pages render — no hidden record.',
    operatingQuestion: OPERATING_QUESTION,
    verdict: VERDICT,
    frameConstruction: { asymmetry: ASYMMETRY, probes: PROBES, defenses: DEFENSES },
    capabilities: { axes: CAPABILITY_AXES, frontier2026: FRONTIER_2026, humanReference: HUMAN_REFERENCE },
    theories: THEORIES,
    evidence: EVIDENCE,
    forecasts: FORECASTS.map((f) => ({ ...f, brier: brierOf(f) })),
    calibration: calibration(FORECASTS),
    revisions: REVISIONS,
    maintenanceRuns: RUNS,
    methodHealth: METHOD_HEALTH,
    superlatives: SUPERLATIVES,
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
