// Eight capability axes that span "human-level cognitive capabilities" per
// Hassabis' working definition of AGI. Each axis is scored 0–1 where:
//   0.0 = absent / no progress
//   0.5 = task-specific or narrow demos
//   0.7 = robust within a single substrate (e.g. text-only)
//   0.9 = robust across substrates / domains
//   1.0 = human-level breadth and reliability
//
// Carried over from the original Observatory. The axes slice "AGI" along the
// dimensions Hassabis himself names as gaps. Capability moves slower than
// benchmark scores; frontier maxima per axis change slowly.

export const CAPABILITY_AXES = [
  {
    id: 'perception',
    label: 'Perception',
    short: 'Perc',
    description: 'Multimodal grounding — vision, audio, text, video. Robust scene understanding.',
    accent: 'hsl(188 88% 56%)',
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    short: 'Reas',
    description: 'Step-by-step inference. Math, code, formal logic, deductive chains.',
    accent: 'hsl(270 60% 72%)',
  },
  {
    id: 'planning',
    label: 'Planning',
    short: 'Plan',
    description: 'Long-horizon goal pursuit. Multi-step search, hierarchical decomposition.',
    accent: 'hsl(34 96% 60%)',
  },
  {
    id: 'memory',
    label: 'Memory',
    short: 'Mem',
    description: 'Persistent episodic + semantic memory across days/weeks/years; not just context window.',
    accent: 'hsl(212 80% 64%)',
  },
  {
    id: 'world-models',
    label: 'World Models',
    short: 'World',
    description: 'Causal physical simulation. Predictive models of dynamics, objects, agents.',
    accent: 'hsl(152 60% 55%)',
  },
  {
    id: 'embodiment',
    label: 'Embodiment',
    short: 'Emb',
    description: 'Acting in real or simulated worlds. Sensorimotor competence.',
    accent: 'hsl(28 92% 60%)',
  },
  {
    id: 'generalization',
    label: 'Generalization',
    short: 'Gen',
    description: 'Transfer across tasks, domains, and distributions without retraining.',
    accent: 'hsl(8 80% 64%)',
  },
  {
    id: 'creativity',
    label: 'Creativity',
    short: 'Crea',
    description: 'Origination of new frameworks, hypotheses, strategies — "could it invent Go?"',
    accent: 'hsl(320 70% 68%)',
  },
] as const;

export type CapabilityId = (typeof CAPABILITY_AXES)[number]['id'];

export type CapabilityVector = Record<CapabilityId, number>;

// Observatory seed estimate of the 2026 frontier maximum per axis. These are
// starting values for the clean rebuild — deliberately conservative and meant
// to be revised against evidence, not treated as measured fact. The shape
// encodes the current answer: strong perception/reasoning, weak memory,
// world-models, embodiment, and creativity (frame construction).
export const FRONTIER_2026: CapabilityVector = {
  perception: 0.72,
  reasoning: 0.68,
  planning: 0.45,
  memory: 0.32,
  'world-models': 0.4,
  embodiment: 0.3,
  generalization: 0.5,
  creativity: 0.35,
};

// A human-competent reference profile, for contrast.
export const HUMAN_REFERENCE: CapabilityVector = {
  perception: 0.9,
  reasoning: 0.85,
  planning: 0.85,
  memory: 0.9,
  'world-models': 0.9,
  embodiment: 0.95,
  generalization: 0.95,
  creativity: 0.9,
};
