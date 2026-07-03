// The failure taxonomy (Omnibus Part XV + §114) — a typed vocabulary for
// classifying what went wrong, so "it didn't work" always resolves to one of
// a fixed, named set with a prescribed corrective action.
import raw from './failure-taxonomy.json';

export interface FailureType {
  type: string;
  definition: string;
  action: string;
}

export const FAILURE_TAXONOMY: FailureType[] = raw as FailureType[];
