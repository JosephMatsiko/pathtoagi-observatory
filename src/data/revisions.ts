// The revision log. When the record changes, the change goes here — visibly,
// with a reason. This is "revision in public" made into a surface: past
// positions are superseded on the record, never quietly rewritten.

export type RevisionKind = 'build' | 'record' | 'verdict' | 'method';

export interface Revision {
  date: string;
  kind: RevisionKind;
  title: string;
  detail: string;
}

export const REVISION_KIND_LABEL: Record<RevisionKind, string> = {
  build: 'Build',
  record: 'Record',
  verdict: 'Verdict',
  method: 'Method',
};

export const REVISIONS: Revision[] = [
  {
    date: '2026-06-30',
    kind: 'method',
    title: 'Forecast ledger gains Brier scoring',
    detail:
      'Resolved forecasts now keep their original probability and contribute a Brier score to a public calibration panel. The misses stay counted — that is the point.',
  },
  {
    date: '2026-06-30',
    kind: 'build',
    title: 'Clean-room rebuild published',
    detail:
      'pathtoAGI — the Observatory rebuilt as a lean spine: the operating question, the frame-construction suite, the capability frontier, five theories, an evidence ledger under healthΔ-0 discipline, and scoreable forecasts.',
  },
  {
    date: '2026-06-24',
    kind: 'record',
    title: 'GPT-5.4 computer-use logged; no theory promoted',
    detail:
      'OSWorld-Verified 75.0% recorded in the evidence ledger. Interpreted as bearing on scaling-plus-RL and cognitive-architecture, but healthΔ held at 0 — vendor-reported and benchmark-centered evidence does not move a theory on its own.',
  },
  {
    date: '2026-06-18',
    kind: 'record',
    title: 'ARC-AGI-3 interactive gap holds',
    detail:
      'The human–frontier gap on interactive reasoning stayed wide despite static-benchmark gains. Read as consistent with architectural-gap, and used to resolve a Q2 forecast NO — a correctly skeptical call.',
  },
  {
    date: '2026-06-10',
    kind: 'verdict',
    title: 'Operating-question verdict reaffirmed: "No. Not yet."',
    detail:
      'An FCS-3 dry run showed frontier systems retrieving the Mercury anomaly but not reconstructing the geodesic frame without leaking post-1915 sources. The verdict stands — held open to revision the moment a hardened probe passes.',
  },
];
