// The evidence ledger. Each record is a capability event the Observatory has
// noticed, interpreted under discipline, and bound to a source. The discipline:
// `healthDelta` is 0 by default — a single vendor-reported or benchmark-centered
// event does not promote a theory. Promotion requires independent, durable,
// off-distribution evidence. Seeded from the original register (observed 2026-06).

export type EvidenceClass =
  | 'vendor-reported'
  | 'independent-eval'
  | 'benchmark-design'
  | 'falsifier-review';

export interface EvidenceRecord {
  id: string;
  observedAt: string;
  source: string;
  sourceUrl: string;
  class: EvidenceClass;
  theories: string[];
  signal: string;
  implication: string;
  bounded: string;
  nextNeeded: string;
}

export const EVIDENCE_CLASS_LABEL: Record<EvidenceClass, string> = {
  'vendor-reported': 'Vendor-reported',
  'independent-eval': 'Independent evaluation',
  'benchmark-design': 'Benchmark design',
  'falsifier-review': 'Falsifier review',
};

export const EVIDENCE: EvidenceRecord[] = [
  {
    id: 'cce-2026-06-24-gpt-5-4',
    observedAt: '2026-06-24',
    source: 'OpenAI GPT-5.4 release and evaluations',
    sourceUrl: 'https://openai.com/index/introducing-gpt-5-4/',
    class: 'vendor-reported',
    theories: ['scaling-plus-rl', 'cognitive-architecture'],
    signal:
      'GPT-5.4 reported as general-purpose with native computer-use: OSWorld-Verified 75.0%, WebArena-Verified 67.3%, improved tool-use and coding over GPT-5.2.',
    implication:
      'Current evidence that agentic scaffolding and reasoning-oriented post-training improve practical long-horizon work. Bears on scaling-plus-RL and cognitive-architecture more than on scale-alone claims.',
    bounded:
      'Vendor-reported and benchmark-centered — still short of original frame construction under sparse historical evidence. No theory promoted.',
    nextNeeded:
      'Independent OSWorld/WebArena reproduction, audited task traces, or a pre-registered open-ended research workflow showing durable planning and self-correction.',
  },
  {
    id: 'cce-2026-06-18-arc-agi',
    observedAt: '2026-06-18',
    source: 'ARC-AGI-3 interactive-reasoning milestone board',
    sourceUrl: 'https://arcprize.org/',
    class: 'benchmark-design',
    theories: ['architectural-gap', 'scaling-plus-rl'],
    signal:
      'Interactive, multi-step ARC-AGI-3 tasks continue to separate frontier systems from human baselines by a wide margin despite gains on static ARC-AGI-2.',
    implication:
      'Consistent with architectural-gap: the axis that resists is open-ended, on-the-fly reframing — not the axis that added compute and RL have moved.',
    bounded:
      'A benchmark, not the operating question. Passing it would be necessary, not sufficient, for frame construction.',
    nextNeeded:
      'A frontier system closing the human gap on held-out interactive tasks without task-specific tuning.',
  },
  {
    id: 'cce-2026-06-10-mercury-probe',
    observedAt: '2026-06-10',
    source: 'Observatory frame-construction probe FCS-3 (internal dry run)',
    sourceUrl: '/test/',
    class: 'falsifier-review',
    theories: ['architectural-gap', 'embodiment-required'],
    signal:
      'On a time-sliced (pre-1913) corpus, frontier systems retrieve the Mercury-perihelion anomaly but do not reconstruct the geodesic frame that yields 43″/century without leaking post-1915 sources.',
    implication:
      'Direct evidence for the current verdict: retrieval and interpolation are strong; the representational move is not reliably present.',
    bounded:
      'A dry run of a v0.1 probe, contamination-limited. Weak performance counts as evidence against; it is not proof of a hard ceiling.',
    nextNeeded:
      'A hardened, audited FCS-3 run with independent scoring and tighter contamination defenses.',
  },
];
