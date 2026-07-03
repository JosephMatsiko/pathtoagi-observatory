// The operational ontology — typed wrapper over the computed instance graph.
//
// The single source of truth is scripts/lib/ontology-graph.mjs, shared with
// the conformance gate so that the site, /record.json, the MCP surface, and
// the gate all see the identical graph. Nothing here is hand-typed: every
// count, state, and edge is computed from the record's own data at build
// time, and the gate fails the build on any typed reference that does not
// resolve. (This file replaced a version whose node states were asserted
// strings — false at the moment of authoring; see
// inc-2026-07-03-ontology-fabricated-counts.)
import { buildOntology } from '../../scripts/lib/ontology-graph.mjs';

export type OntologyLayer = 'record' | 'evaluation' | 'review' | 'interface';

export interface OntologyType {
  id: string;
  label: string;
  layer: OntologyLayer;
  description: string;
  href: string;
  accent: string;
  actions: string[];
  count: number;
}

export interface OntologyTypeEdge {
  from: string;
  to: string;
  relation: string;
}

export interface OntologyInstance {
  type: string;
  id: string;
  label: string;
  href?: string;
  date?: string;
  state?: string;
}

export interface OntologyInstanceEdge {
  from: string;
  to: string;
  rel: string;
}

const graph = buildOntology();

export const ONTOLOGY = graph as {
  doctrine: string;
  protocolVersion: number;
  types: OntologyType[];
  typeEdges: OntologyTypeEdge[];
  permittedActions: string[];
  instances: { nodes: OntologyInstance[]; edges: OntologyInstanceEdge[] };
  integrity: {
    nodes: number;
    edges: number;
    danglingTypedRefs: unknown[];
    informalRefs: number;
    verifiedArtifactRefs: number;
  };
};

// Node view consumed by the atlas surfaces: type registry with a computed
// state line (never asserted).
const stateFor = (t: OntologyType): string => {
  const inst = ONTOLOGY.instances.nodes.filter((n) => n.type === t.id);
  switch (t.id) {
    case 'claim': return `${t.count} governed`;
    case 'evidence': return `${t.count} records`;
    case 'forecast': return `${t.count} registered`;
    case 'theory': return `${t.count} live`;
    case 'run-bundle': return `${t.count} bundles · ${inst.filter((n) => n.state === 'graded').length} graded`;
    case 'verdict-gate': return `v${ONTOLOGY.protocolVersion} · ${t.count} gates`;
    case 'challenge': return `${inst.filter((n) => n.state === 'open').length} open`;
    case 'correction': return `${t.count} revisions`;
    case 'incident': return `${t.count} objects · ${inst.filter((n) => n.state === 'open').length} open`;
    case 'correspondence': return `${t.count} entries`;
    case 'dispatch': return `${t.count} dispatches`;
    case 'precedent': return `${t.count} binding`;
    case 'outreach': return `${inst.filter((n) => n.state === 'open' || n.state === 'engaged').length} standing`;
    case 'failure-type': return `${t.count} named`;
    case 'silence-audit': return `${t.count} recorded`;
    case 'registered-future': return `${t.count} pinned`;
    case 'human-baseline': return t.count === 0 ? '0 collected — OG-9 open' : `${t.count} collected`;
    default: return `${t.count}`;
  }
};

export const ONTOLOGY_NODES = ONTOLOGY.types.map((t) => ({ ...t, state: stateFor(t) }));
export const ONTOLOGY_EDGES = ONTOLOGY.typeEdges;
export const PERMITTED_ACTIONS = ONTOLOGY.permittedActions;
