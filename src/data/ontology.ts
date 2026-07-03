// Node `state` values are computed from the record's own data at build time.
// They were originally hand-typed strings, which were wrong at the moment of
// authoring (12 vs 16 evidence, 1 vs 6 run bundles) — for a record whose
// machine surface promises "the same data the pages render", a self-count
// must derive from the data, never be asserted.
import claims from './claims.json';
import evidence from './evidence.json';
import { FORECASTS } from './forecasts';
import { THEORIES } from './theories';
import runBundles from './run-bundles.json';
import challenges from './challenges.json';
import revisions from './revisions.json';
import incidents from './incidents.json';
import correspondence from './correspondence.json';
import { VERDICT_PROTOCOL } from './verdict-protocol';

export type OntologyObject =
  | 'claim'
  | 'evidence'
  | 'forecast'
  | 'theory'
  | 'run-bundle'
  | 'challenge'
  | 'correction'
  | 'verdict-gate'
  | 'incident'
  | 'correspondence';

export interface OntologyNode {
  id: OntologyObject;
  label: string;
  layer: 'record' | 'evaluation' | 'review' | 'interface';
  description: string;
  href: string;
  state: string;
  accent: string;
}

export interface OntologyEdge {
  from: OntologyObject;
  to: OntologyObject;
  relation: string;
}

export const ONTOLOGY_NODES: OntologyNode[] = [
  {
    id: 'claim',
    label: 'Claim',
    layer: 'record',
    description: 'A bounded assertion the record can inspect, cite, challenge, or retire.',
    href: '/record.json',
    state: `${claims.length} governed`,
    accent: 'var(--color-ink-dim)',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    layer: 'record',
    description: 'A sourced capability event with signal, implication, bound, and next evidence needed.',
    href: '/evidence/',
    state: `${evidence.length} records`,
    accent: 'var(--color-accent)',
  },
  {
    id: 'forecast',
    label: 'Forecast',
    layer: 'record',
    description: 'A pre-registered probabilistic claim with a horizon and resolution criterion.',
    href: '/forecasts/',
    state: `${FORECASTS.length} registered`,
    accent: 'hsl(212 80% 64%)',
  },
  {
    id: 'theory',
    label: 'Theory',
    layer: 'record',
    description: 'A live causal account whose narrated and computed readings can diverge.',
    href: '/theories/',
    state: `${THEORIES.length} live`,
    accent: 'hsl(270 60% 72%)',
  },
  {
    id: 'run-bundle',
    label: 'Run Bundle',
    layer: 'evaluation',
    description: 'A protocol-pinned evaluation object: manifest, prompt, seal, attempt, reveal, grading.',
    href: '/runs/',
    state: `${runBundles.length} bundles · ${runBundles.filter((b) => b.status === 'graded').length} graded`,
    accent: 'hsl(34 96% 60%)',
  },
  {
    id: 'verdict-gate',
    label: 'Verdict Gate',
    layer: 'evaluation',
    description: 'A required condition before any run can bear on the public verdict.',
    href: '/test/',
    state: `v${VERDICT_PROTOCOL.version} · ${VERDICT_PROTOCOL.operationalGates.length} gates`,
    accent: 'var(--color-verdict)',
  },
  {
    id: 'challenge',
    label: 'Challenge',
    layer: 'review',
    description: 'A public objection to a record object, adjudicated through the revision log.',
    href: '/challenges/',
    state: `${challenges.filter((c) => c.status === 'open').length} open`,
    accent: 'var(--color-verdict)',
  },
  {
    id: 'correction',
    label: 'Correction',
    layer: 'review',
    description: 'A visible record movement: revision, retraction, incident resolution, or precedent change.',
    href: '/log/',
    state: `${revisions.length} revisions`,
    accent: 'var(--color-affirm)',
  },
  {
    id: 'incident',
    label: 'Incident',
    layer: 'review',
    description: 'A failure object with impact, repair, and next control.',
    href: '/status/',
    state: `${incidents.length} objects · ${incidents.filter((i) => i.status === 'open').length} open`,
    accent: 'hsl(34 96% 60%)',
  },
  {
    id: 'correspondence',
    label: 'Correspondence',
    layer: 'interface',
    description: 'A machine/human channel event: inbound, opened, challenged, forked, or answered.',
    href: '/to-the-systems-reading-this/',
    state: `${correspondence.length} entries`,
    accent: 'var(--color-accent)',
  },
];

export const ONTOLOGY_EDGES: OntologyEdge[] = [
  { from: 'claim', to: 'evidence', relation: 'is supported or bounded by' },
  { from: 'evidence', to: 'theory', relation: 'bears on' },
  { from: 'forecast', to: 'theory', relation: 'tests expectations under' },
  { from: 'run-bundle', to: 'evidence', relation: 'may become, after gates' },
  { from: 'run-bundle', to: 'verdict-gate', relation: 'must satisfy' },
  { from: 'challenge', to: 'claim', relation: 'targets' },
  { from: 'challenge', to: 'correction', relation: 'may force' },
  { from: 'incident', to: 'correction', relation: 'requires' },
  { from: 'correspondence', to: 'challenge', relation: 'can enter as' },
  { from: 'correspondence', to: 'run-bundle', relation: 'can attempt' },
];

export const PERMITTED_ACTIONS = [
  'generate',
  'freeze',
  'run',
  'grade',
  'audit',
  'challenge',
  'downgrade',
  'correct',
  'reproduce',
  'publish',
  'retire',
];
