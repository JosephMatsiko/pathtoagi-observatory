// Method health — the instrument watching the quality of its own seeing. This
// is the honest, bounded form of recursive self-improvement: the system tracks
// where its own instruments (probes, axes, calibration, framing) are decaying
// and names the next improvement. Every change stays gated and human-reviewable.
import raw from './method-health.json';

export type MethodStatus = 'ok' | 'watch' | 'act';

export interface MethodHealth {
  id: string;
  method: string;
  reading: string;
  status: MethodStatus;
  nextImprovement: string;
}

export const METHOD_STATUS_LABEL: Record<MethodStatus, string> = {
  ok: 'Holding',
  watch: 'Watch',
  act: 'Improve',
};

export const METHOD_STATUS_COLOR: Record<MethodStatus, string> = {
  ok: 'var(--color-affirm)',
  watch: 'hsl(34 96% 60%)',
  act: 'var(--color-accent)',
};

export const METHOD_HEALTH: MethodHealth[] = raw as MethodHealth[];
