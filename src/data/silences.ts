// Silence audits — absence as first-class evidence. The record only seeing
// events is half-blind: if capability releases keep arriving and the specific
// capability the operating question isolates keeps not arriving, that pattern
// is evidence. Each quarter the instrument must state what conspicuously did
// not happen, under the same discipline as any other record.
import raw from './silences.json';

export interface SilenceAbsence {
  absence: string;
  bearsOn: string[];
  reading: string;
  likelihoods?: Record<string, number>;
}

export interface SilenceAudit {
  id: string;
  period: string; // e.g. 2026-Q2
  date: string;
  absences: SilenceAbsence[];
  nextDue: string;
}

export const SILENCES: SilenceAudit[] = raw as SilenceAudit[];
