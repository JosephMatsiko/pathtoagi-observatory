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
    state: 'implicit',
    accent: 'var(--color-ink-dim)',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    layer: 'record',
    description: 'A sourced capability event with signal, implication, bound, and next evidence needed.',
    href: '/evidence/',
    state: '12 records',
    accent: 'var(--color-accent)',
  },
  {
    id: 'forecast',
    label: 'Forecast',
    layer: 'record',
    description: 'A pre-registered probabilistic claim with a horizon and resolution criterion.',
    href: '/forecasts/',
    state: '36 registered',
    accent: 'hsl(212 80% 64%)',
  },
  {
    id: 'theory',
    label: 'Theory',
    layer: 'record',
    description: 'A live causal account whose narrated and computed readings can diverge.',
    href: '/theories/',
    state: '5 live',
    accent: 'hsl(270 60% 72%)',
  },
  {
    id: 'run-bundle',
    label: 'Run Bundle',
    layer: 'evaluation',
    description: 'A protocol-pinned evaluation object: manifest, prompt, seal, attempt, reveal, grading.',
    href: '/runs/',
    state: '1 sealed',
    accent: 'hsl(34 96% 60%)',
  },
  {
    id: 'verdict-gate',
    label: 'Verdict Gate',
    layer: 'evaluation',
    description: 'A required condition before any run can bear on the public verdict.',
    href: '/test/',
    state: 'v1 pinned',
    accent: 'var(--color-verdict)',
  },
  {
    id: 'challenge',
    label: 'Challenge',
    layer: 'review',
    description: 'A public objection to a record object, adjudicated through the revision log.',
    href: '/challenges/',
    state: '0 open',
    accent: 'var(--color-verdict)',
  },
  {
    id: 'correction',
    label: 'Correction',
    layer: 'review',
    description: 'A visible record movement: revision, retraction, incident resolution, or precedent change.',
    href: '/log/',
    state: '38 revisions',
    accent: 'var(--color-affirm)',
  },
  {
    id: 'incident',
    label: 'Incident',
    layer: 'review',
    description: 'A failure object with impact, repair, and next control.',
    href: '/status/',
    state: '3 objects',
    accent: 'hsl(34 96% 60%)',
  },
  {
    id: 'correspondence',
    label: 'Correspondence',
    layer: 'interface',
    description: 'A machine/human channel event: inbound, opened, challenged, forked, or answered.',
    href: '/to-the-systems-reading-this/',
    state: '2 entries',
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
