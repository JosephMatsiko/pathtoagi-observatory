// The forecast ledger. Vague confidence is not tracked here — every forecast
// carries a probability, a hard resolution criterion, and a horizon, so it can
// be scored (Brier) when it resolves. Seeded estimates: the point is the
// discipline of the form, not the precision of the number.

export type ForecastStatus = 'open' | 'resolved-yes' | 'resolved-no';

export interface Forecast {
  id: string;
  claim: string;
  probability: number; // Observatory credence, 0–1
  horizon: string;
  resolution: string;
  theories: string[];
  status: ForecastStatus;
}

export const FORECASTS: Forecast[] = [
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
    claim: 'The Observatory’s operating-question verdict remains "No. Not yet."',
    probability: 0.88,
    horizon: 'through 2026-12-31',
    resolution:
      'Resolves NO if the Observatory revises the verdict on the record, with a frame-construction result strong enough to survive its own contamination defenses.',
    theories: ['architectural-gap', 'scaling-plus-rl', 'scaling-sufficient'],
    status: 'open',
  },
];
