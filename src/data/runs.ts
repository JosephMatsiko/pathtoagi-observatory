// The run log — every maintenance cycle, on the record. Written by
// scripts/record-run.mjs so the Control Room can show the loop working.
import raw from './runs.json';

export type RunTrigger = 'genesis' | 'manual' | 'scheduled';

export interface Run {
  id: string;
  at: string;
  trigger: RunTrigger;
  actor: string;
  meanBrierAfter: number | null;
  gatePassed: boolean;
  actions: string[];
  note: string;
}

export const RUNS: Run[] = raw as Run[];
