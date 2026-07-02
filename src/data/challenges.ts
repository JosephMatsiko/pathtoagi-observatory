// Public challenges — the record submits to cross-examination. Anyone may
// file against any record entry (see /governance for how); a challenge is a
// record object the mesh must adjudicate within five shipped cycles. An
// unanswered challenge past its deadline visibly degrades the entry it
// targets. Authority-through-inspectability matures into
// authority-through-survivable-cross-examination.
import raw from './challenges.json';

export interface Challenge {
  id: string;
  filedAt: string;
  source: string; // e.g. the GitHub issue URL
  targets: string; // record entry id/path challenged
  claim: string;
  status: 'open' | 'upheld' | 'rejected' | 'partially-upheld';
  deadlineCycles: number;
  adjudication?: { at: string; note: string; revisionRef?: string };
}

export const CHALLENGES: Challenge[] = raw as Challenge[];
