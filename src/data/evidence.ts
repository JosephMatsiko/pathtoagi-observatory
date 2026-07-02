// The evidence ledger. Each record is a capability event the Observatory has
// noticed, interpreted under discipline, and bound to a source. The discipline:
// `healthDelta` is 0 by default — a single vendor-reported or benchmark-centered
// event does not promote a theory. Promotion requires independent, durable,
// off-distribution evidence.
//
// Records live in evidence.json so the maintenance loop can append to them
// without touching code. This module types and re-exports them.
import raw from './evidence.json';

export type EvidenceClass =
  | 'vendor-reported'
  | 'independent-eval'
  | 'benchmark-design'
  | 'falsifier-review'
  | 'regulatory-action';

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
  /** Multimodal artifacts backing the record — archived images/audio/video.
   *  Paths must be public (in-repo /archive/ or /media/, or http(s)). */
  media?: { type: 'image' | 'audio' | 'video'; path: string; caption: string }[];
  likelihoods?: Record<string, number>;
}

export const EVIDENCE_CLASS_LABEL: Record<EvidenceClass, string> = {
  'vendor-reported': 'Vendor-reported',
  'independent-eval': 'Independent evaluation',
  'benchmark-design': 'Benchmark design',
  'falsifier-review': 'Falsifier review',
  'regulatory-action': 'Regulatory action',
};

export const EVIDENCE: EvidenceRecord[] = raw as EvidenceRecord[];
