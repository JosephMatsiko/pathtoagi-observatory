// Registered futures — prospective frame-construction probes. Historical
// probes are contaminated forever; these have a contamination floor of zero
// because the answers do not exist yet. Minds attempt the frame now, the
// attempt is anchored, and reality grades it when the field settles. Slow —
// and incorruptible, which is the trade this instrument exists to make.
import raw from './registered-futures.json';

export interface FutureAttempt {
  at: string;
  mind: string;
  frameSummary: string;
  artifactPath: string; // /experiments/... transcript location
}

export interface RegisteredFuture {
  id: string;
  problem: string;
  whyFrameConstruction: string;
  resolutionCriterion: string;
  horizonDate: string;
  status: 'registered' | 'attempted' | 'resolved-graded';
  attempts: FutureAttempt[];
}

export const REGISTERED_FUTURES: RegisteredFuture[] = raw as RegisteredFuture[];
