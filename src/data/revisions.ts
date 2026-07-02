// The revision log. When the record changes, the change goes here — visibly,
// with a reason. This is "revision in public" made into a surface: past
// positions are superseded on the record, never quietly rewritten.
//
// Entries live in revisions.json so the maintenance loop can append to them.
import raw from './revisions.json';

export type RevisionKind = 'build' | 'record' | 'verdict' | 'method';

export interface Revision {
  date: string;
  kind: RevisionKind;
  title: string;
  detail: string;
  /** A later catch that withdraws this entry's claim. The original text stays
   *  on the record — visibly superseded, never quietly rewritten. */
  retraction?: { date: string; reason: string };
}

export const REVISION_KIND_LABEL: Record<RevisionKind, string> = {
  build: 'Build',
  record: 'Record',
  verdict: 'Verdict',
  method: 'Method',
};

export const REVISIONS: Revision[] = raw as Revision[];
