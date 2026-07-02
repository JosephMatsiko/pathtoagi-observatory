// The mesh-value ledger — the instrument measuring its own architecture.
// We claim three-mind adversarial review beats a single mind; this ledger is
// where that claim meets data: per shipped cycle, what the adversary and
// calibrator actually changed or blocked. If the mesh adds nothing, this
// record should be the first to say so.
import raw from './mesh-value.json';

export interface MeshValueEntry {
  cycleId: string;
  verdict: string | null; // ACCEPT | REVISE | REJECT (parsed from verdict.md)
  shipped: boolean;
  proposalBytes: number | null;
  note: string;
}

export const MESH_VALUE: MeshValueEntry[] = raw as MeshValueEntry[];
