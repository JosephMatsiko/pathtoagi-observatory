// The claims registry (Omnibus §70/§117) — claims as governed objects,
// distinct from the evidence that supports them. A claim states what a run
// actually demonstrates, in language the gate itself will enforce: every
// claim carries permitted and forbidden vocabulary, so nobody — including
// the mesh — can quietly upgrade "candidate" into "verified" in prose.
import raw from './claims.json';

export interface Claim {
  claim_id: string;
  text: string;
  claim_type: 'capability' | 'risk' | 'methodological';
  status: 'candidate' | 'audited' | 'verified' | 'rejected';
  evidence_level: number;
  supporting: string[];
  opposing: string[];
  defeaters: string[];
  allowed_language: string[];
  forbidden_language: string[];
}

export const CLAIMS: Claim[] = raw as Claim[];
