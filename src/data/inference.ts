// The inference layer — the record stops narrating inference and starts
// computing it. Each theory's health has two published readings:
//
//   narrated  — the discretionary health in theories.ts (the pre-2026-07-02
//               regime, still governed by healthΔ-0 discipline), and
//   computed  — a posterior: pinned priors × pre-registered likelihood ratios
//               carried by evidence records from 2026-07-02 forward.
//
// The two are shown side by side; their divergence is itself information.
// Likelihoods are chosen when evidence enters the record — before it is known
// how the question resolves — bounded to [0.1, 10] by the gate, and anchored
// with the release. Records observed before 2026-07-02 are the pre-inference
// era and may never be assigned likelihoods retroactively (that would be
// backfilling; precedent P-4 applies in spirit).
import { EVIDENCE } from './evidence';
import { SILENCES } from './silences';
import { THEORIES } from './theories';

export const INFERENCE_ERA_START = '2026-07-02';
export const LR_MIN = 0.1;
export const LR_MAX = 10;

// Priors pinned at the inference era's start = the narrated healths of
// 2026-07-02, declared here as constants so the posterior's starting point
// never silently tracks later narration.
export const PINNED_PRIORS: Record<string, number> = Object.fromEntries(
  THEORIES.map((t) => [t.id, t.health]),
);
export const PRIORS_PINNED_AT = '2026-07-02';

const odds = (p: number) => p / (1 - p);
const fromOdds = (o: number) => o / (1 + o);
const clamp = (p: number) => Math.min(0.99, Math.max(0.01, p));

export interface TheoryPosterior {
  theoryId: string;
  prior: number;
  posterior: number;
  evidenceApplied: number;
  logOddsShift: number;
}

// Evidence (and silence-audit absences) may carry `likelihoods`:
//   { [theoryId]: number }  — P(observation | theory) / P(observation | not-theory)
export function computedPosteriors(): TheoryPosterior[] {
  const carriers: { observedAt: string; likelihoods?: Record<string, number> }[] = [
    ...EVIDENCE.map((e: any) => ({ observedAt: e.observedAt, likelihoods: e.likelihoods })),
    ...SILENCES.flatMap((s: any) =>
      (s.absences ?? []).map((a: any) => ({ observedAt: s.date, likelihoods: a.likelihoods })),
    ),
  ];
  return Object.entries(PINNED_PRIORS).map(([theoryId, prior]) => {
    let o = odds(clamp(prior));
    let applied = 0;
    for (const c of carriers) {
      if (!c.likelihoods || c.observedAt < INFERENCE_ERA_START) continue;
      const lr = c.likelihoods[theoryId];
      if (typeof lr === 'number') {
        o *= lr;
        applied += 1;
      }
    }
    const posterior = clamp(fromOdds(o));
    return {
      theoryId,
      prior,
      posterior,
      evidenceApplied: applied,
      logOddsShift: Math.log(o / odds(clamp(prior))),
    };
  });
}
