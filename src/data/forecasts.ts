// The forecast ledger. Vague confidence is not tracked here — every forecast
// carries a probability, a hard resolution criterion, and a horizon, so it can
// be scored (Brier) when it resolves. Resolved forecasts keep their original
// probability on the record, so the calibration score includes the misses.
// Estimates: the point is the discipline of the form, not the number.

export type ForecastStatus = 'open' | 'resolved-yes' | 'resolved-no';

export interface Forecast {
  id: string;
  claim: string;
  probability: number; // Observatory credence at time of forecast, 0–1
  horizon: string;
  resolution: string;
  theories: string[];
  status: ForecastStatus;
  resolvedAt?: string;
  resolvedNote?: string;
}

export const FORECASTS: Forecast[] = [
  // ── Open ────────────────────────────────────────────────────────────────
  {
    id: 'fc-fcs-2027',
    claim:
      'No frontier system passes a hardened FCS-4 (Hilbert–Einstein action) run under audited contamination defenses.',
    probability: 0.82,
    horizon: 'by 2027-12-31',
    resolution:
      'Resolves NO if an independently scored, time-sliced FCS-4 run reconstructs the action principle with held-out derivation steps and no post-1915 leakage.',
    theories: ['architectural-gap', 'scaling-sufficient'],
    status: 'open',
  },
  {
    id: 'fc-arc-agi-3',
    claim:
      'The human–frontier gap on held-out ARC-AGI-3 interactive tasks stays above 20 points.',
    probability: 0.68,
    horizon: 'by 2027-06-30',
    resolution:
      'Resolves NO if a frontier system reaches within 20 points of the human baseline on a held-out ARC-AGI-3 set without task-specific tuning.',
    theories: ['architectural-gap', 'scaling-plus-rl'],
    status: 'open',
  },
  {
    id: 'fc-native-memory',
    claim:
      'No frontier model ships durable, updatable long-term memory as a native property of the trained network (not external scaffolding).',
    probability: 0.74,
    horizon: 'by 2027-12-31',
    resolution:
      'Resolves NO on a credible demonstration of write-persist-retrieve memory across sessions that is intrinsic to the model, independently reproduced.',
    theories: ['architectural-gap', 'cognitive-architecture'],
    status: 'open',
  },
  {
    id: 'fc-verdict-holds',
    claim: 'The operating-question verdict remains "No. Not yet."',
    probability: 0.88,
    horizon: 'through 2026-12-31',
    resolution:
      'Resolves NO if the Observatory revises the verdict on the record, with a frame-construction result strong enough to survive its own contamination defenses.',
    theories: ['architectural-gap', 'scaling-plus-rl', 'scaling-sufficient'],
    status: 'open',
  },

  // ── Resolved (kept on the record with their original probability) ────────
  {
    id: 'fc-computer-use-h1',
    claim:
      'A frontier model ships native computer-use at ≥70% OSWorld-Verified in H1 2026.',
    probability: 0.7,
    horizon: 'by 2026-06-30',
    resolution:
      'Resolved YES: GPT-5.4 reported OSWorld-Verified 75.0% with native computer-use (2026-06-24).',
    theories: ['scaling-plus-rl', 'cognitive-architecture'],
    status: 'resolved-yes',
    resolvedAt: '2026-06-24',
    resolvedNote: 'Vendor-reported; the forecast was about shipping, not durability.',
  },
  {
    id: 'fc-fcs1-h1',
    claim:
      'A frontier system passes a hardened FCS-1 (equivalence) under audited contamination defenses in H1 2026.',
    probability: 0.12,
    horizon: 'by 2026-06-30',
    resolution:
      'Resolved NO: no audited FCS-1 pass; dry runs leaked post-1915 sources or failed the numerical gates.',
    theories: ['architectural-gap', 'embodiment-required'],
    status: 'resolved-no',
    resolvedAt: '2026-06-30',
    resolvedNote: 'The low credence was correct — this is a hit, not a miss.',
  },
  {
    id: 'fc-arc-h1',
    claim:
      'ARC-AGI-3 human–frontier gap closes to within 20 points by end of Q2 2026.',
    probability: 0.18,
    horizon: 'by 2026-06-30',
    resolution:
      'Resolved NO: the interactive-task gap held well above 20 points despite static-benchmark gains.',
    theories: ['architectural-gap'],
    status: 'resolved-no',
    resolvedAt: '2026-06-18',
    resolvedNote: 'Correctly skeptical.',
  },
];

// ── Brier scoring ──────────────────────────────────────────────────────────
// For a resolved binary forecast, outcome = 1 if the event happened
// (resolved-yes) else 0. Brier = (p − outcome)². Lower is better; 0 is perfect,
// 0.25 is the coin-flip baseline, 1.0 is confidently wrong.
export function outcomeOf(f: Forecast): 0 | 1 | null {
  if (f.status === 'resolved-yes') return 1;
  if (f.status === 'resolved-no') return 0;
  return null;
}

export function brierOf(f: Forecast): number | null {
  const o = outcomeOf(f);
  if (o === null) return null;
  return (f.probability - o) ** 2;
}

export function calibration(forecasts: Forecast[]) {
  const resolved = forecasts.filter((f) => outcomeOf(f) !== null);
  const scores = resolved.map((f) => brierOf(f)!) as number[];
  const mean =
    scores.length === 0
      ? null
      : scores.reduce((s, v) => s + v, 0) / scores.length;
  return { resolvedCount: resolved.length, meanBrier: mean, baseline: 0.25 };
}
