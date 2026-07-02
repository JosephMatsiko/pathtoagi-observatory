// Published mesh cycles. Each shipped maintenance cycle's working artifacts —
// the Scout's proposal, the Adversary's verdict, the Calibrator's grading, the
// trace — are published verbatim, so any change to the record can be traced
// from raw claim to adversarial review to ship. Files live under
// /cycles/<id>/ in public/; this manifest indexes them.
import raw from './cycles.json';

export interface PublishedCycle {
  id: string;
  shippedAt: string;
  summary: string;
  adversary: string;
  files: string[];
}

export const CYCLES: PublishedCycle[] = raw as PublishedCycle[];
