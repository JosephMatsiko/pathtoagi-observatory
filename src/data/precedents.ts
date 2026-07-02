// The precedent register — stare decisis for the mesh. Past adjudications
// bind future cycles unless explicitly overturned in the revision log. An
// institution that re-litigates what it already decided will eventually
// contradict itself, and a contradiction it doesn't notice is a fabrication
// it didn't intend. Injected into the mesh's memory every cycle.
import raw from './precedents.json';

export interface Precedent {
  id: string;
  ruling: string;
  from: string;
  date: string;
  status: 'binding' | 'overturned';
  overturnedBy?: string;
}

export const PRECEDENTS: Precedent[] = raw as Precedent[];
