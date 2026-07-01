// The forecast ledger. Vague confidence is not tracked here — every forecast
// carries a probability, a hard resolution criterion, and a horizon, so it can
// be scored (Brier) when it resolves. Resolved forecasts keep their original
// probability on the record, so the calibration score includes the misses.
//
// Records live in forecasts.json so the maintenance loop can resolve them and
// append new ones without touching code. This module types them and provides
// the Brier scoring.
import raw from './forecasts.json';

export type ForecastStatus = 'open' | 'resolved-yes' | 'resolved-no';

export interface Forecast {
  id: string;
  claim: string;
  probability: number; // Observatory credence at time of forecast, 0–1
  horizon: string;
  horizonDate: string; // ISO date the horizon lapses (for due detection)
  resolution: string;
  theories: string[];
  status: ForecastStatus;
  resolvedAt?: string;
  resolvedNote?: string;
  // 'backfilled' = authored after its resolution date (2026-07-01 self-audit).
  // Backfilled resolutions are shown on the record but excluded from
  // calibration — a forecast you cannot lose is not a forecast.
  provenance?: 'backfilled';
}

export const FORECASTS: Forecast[] = raw as Forecast[];

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

// Calibration counts ONLY live resolutions — forecasts that were open on the
// record before their outcome was known. Backfilled entries are excluded.
export function calibration(forecasts: Forecast[]) {
  const live = forecasts.filter(
    (f) => outcomeOf(f) !== null && f.provenance !== 'backfilled',
  );
  const scores = live.map((f) => brierOf(f)!) as number[];
  const mean =
    scores.length === 0
      ? null
      : scores.reduce((s, v) => s + v, 0) / scores.length;
  const backfilled = forecasts.filter((f) => f.provenance === 'backfilled').length;
  return { resolvedCount: live.length, backfilled, meanBrier: mean, baseline: 0.25 };
}
