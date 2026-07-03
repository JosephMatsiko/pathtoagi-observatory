// The outreach ledger — the instrument's open, standing invitations to the
// people and systems it cannot manufacture: adversarial challengers,
// independent scorers, human-baseline contributors, and rival forkers. These
// are the roles the verdict protocol and the address both name as the record's
// bottleneck. Kept as a governed object so the ask is public and its state
// (open, engaged, delivered) is on the record, not in a founder's inbox.
import raw from './outreach.json';

export interface OutreachCall {
  id: string;
  role: string;
  what: string;
  who: string;
  status: 'open' | 'engaged' | 'delivered' | 'closed';
  channel: string;
  openedAt: string;
}

export const OUTREACH: OutreachCall[] = raw as OutreachCall[];
