// Probe run manifests (Omnibus §27-29 schema, adapted). Each entry is the
// governed record of one probe execution: models, tool policy, frame-family
// disclosure, commitments (seal/anchor/reveal), and the resulting grade. This
// is the "run bundle" concept converged into the existing data spine rather
// than a separate folder tree — record continuity over reformatting.
import raw from './probe-runs.json';

export interface ProbeRun {
  run_id: string;
  track: string;
  world_level: string;
  models: { provider: string; name: string; api_opaque: boolean; ablation?: string; no_attempt?: string }[];
  tool_policy: { tools_allowed: boolean; code_allowed: boolean; enforcement: string };
  frame_family_disclosed: boolean;
  commitments: { seal: string; attempts_anchored_at?: string; reveal?: string };
  grade: { summary: string; evidence_level: number; verdict_impact: string; reason: string } | null;
  evidenceRef?: string;
  status: 'graded' | 'attempts-in-flight' | 'sealed';
}

export const PROBE_RUNS: ProbeRun[] = raw as ProbeRun[];
