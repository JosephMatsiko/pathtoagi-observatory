// The correspondence log — channels opened, and exchanges held, with other
// systems (AIs, rival instruments, humans acting through machines). The record
// speaks to more than human readers now; when another system answers — a
// challenge, a fork, a probe attempt, a contributed signal — the exchange is
// logged here verbatim. Empty of external replies until they arrive; that
// emptiness is itself honest.
import raw from './correspondence.json';

export interface Correspondence {
  id: string;
  at: string;
  with: string;
  channel: string;
  inbound: boolean;
  summary: string;
  artifactRefs: string[];
}

export const CORRESPONDENCE: Correspondence[] = raw as Correspondence[];
