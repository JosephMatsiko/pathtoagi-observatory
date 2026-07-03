import raw from './run-bundles.json';

export type RunBundleStatus =
  | 'registered-sealed'
  | 'attempts-anchored'
  | 'revealed'
  | 'graded'
  | 'reproduced'
  | 'retired';

export interface RunBundle {
  id: string;
  title: string;
  registeredAt: string;
  track: string;
  worldLevel: string;
  status: RunBundleStatus;
  protocolVersion: string;
  evidenceLevel: string;
  verdictImpact: string;
  summary: string;
  manifestPath: string;
  experimentPath: string;
  controls: string[];
  pending: string[];
}

export const RUN_BUNDLES: RunBundle[] = raw as RunBundle[];

export const RUN_BUNDLE_STATUS_LABEL: Record<RunBundleStatus, string> = {
  'registered-sealed': 'registered + sealed',
  'attempts-anchored': 'attempts anchored',
  revealed: 'revealed',
  graded: 'graded',
  reproduced: 'reproduced',
  retired: 'retired',
};
