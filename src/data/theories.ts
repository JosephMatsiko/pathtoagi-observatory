// The five live theories of how — or whether — AGI arrives. `health` is a 0–1
// Observatory reading of how much current evidence supports the theory, with a
// direction of travel. Each carries the fields that make it inspectable rather
// than merely stated: who holds it, the assumption it rests on, and the
// observation that would move it. Seeded from the original Observatory register.

export type Trend = 'gaining' | 'holding' | 'decelerating';

export interface Theory {
  id: string;
  title: string;
  oneLine: string;
  health: number;
  trend: Trend;
  accent: string;
  proponents: string[];
  loadBearing: string;
  falsifier: string;
}

export const THEORIES: Theory[] = [
  {
    id: 'architectural-gap',
    title: 'Architectural gaps remain',
    oneLine:
      'Current transformers are missing organs — native memory, world models, continual learning. Closing them needs structure, not just compute.',
    health: 0.65,
    trend: 'gaining',
    accent: 'hsl(28 92% 60%)',
    proponents: ['Demis Hassabis', 'Yann LeCun', 'Ilya Sutskever (post-2023)'],
    loadBearing:
      'The missing pieces are structural — no amount of scaling the current substrate grows persistent memory or a grounded world model as an emergent property.',
    falsifier:
      'A frontier system that shows durable, updatable memory and causal world-modeling as a property of the trained network — not a bolted-on component.',
  },
  {
    id: 'scaling-plus-rl',
    title: 'Scaling plus RL',
    oneLine:
      'Pretraining builds the substrate; reinforcement learning on verifiable rewards supplies the reasoning and agency scaling alone does not.',
    health: 0.6,
    trend: 'gaining',
    accent: 'hsl(270 60% 72%)',
    proponents: ['Frontier reasoning-model labs', 'OpenAI', 'DeepSeek'],
    loadBearing:
      'A verifiable-reward signal exists (or can be built) for the lagging capabilities, and RL on it generalizes beyond the reward’s narrow shape rather than gaming it.',
    falsifier:
      'Evidence that RL gains are narrow and reward-hacked — strong on the trained distribution, brittle off it — or that the same gains emerge from scale without RL.',
  },
  {
    id: 'scaling-sufficient',
    title: 'Scaling is sufficient',
    oneLine:
      'Every capability once thought to need special architecture has fallen to scaling a single generic substrate. There is no principled reason to expect the pattern to stop.',
    health: 0.55,
    trend: 'decelerating',
    accent: 'hsl(152 60% 55%)',
    proponents: ['Dario Amodei', 'Ilya Sutskever (pre-2023)', 'Rich Sutton (pre-2024)'],
    loadBearing:
      'The kind of method that produces general capability is the kind that scales with compute and data — and the pattern that held for four orders of magnitude holds for two more.',
    falsifier:
      'A sustained plateau on a capability axis that added compute demonstrably fails to move, while a structural change does.',
  },
  {
    id: 'cognitive-architecture',
    title: 'Cognitive architecture',
    oneLine:
      'Intelligence is an assembled system — memory, planning, tool use, and reasoning composed around a model, not a property of any single network.',
    health: 0.5,
    trend: 'holding',
    accent: 'hsl(212 80% 64%)',
    proponents: ['Agent-framework lineage', 'SOAR / ACT-R heritage'],
    loadBearing:
      'The composition does real cognitive work — the assembled system exhibits capabilities none of its parts has alone, not merely papering over a weak base model.',
    falsifier:
      'End-to-end trained models absorbing the scaffold’s functions (memory, planning, tool use becoming native) and outperforming assembled systems.',
  },
  {
    id: 'embodiment-required',
    title: 'Embodiment required',
    oneLine:
      'General intelligence is grounded in acting in a world. Without sensorimotor experience, systems learn the shadow of understanding, not the thing.',
    health: 0.4,
    trend: 'holding',
    accent: 'hsl(8 80% 64%)',
    proponents: ['Rich Sutton (post-2024)', 'Robotics-learning community'],
    loadBearing:
      'The grounding gap is real and load-bearing for general intelligence — some concepts (causation, affordance, persistence) are not fully learnable from passive text and vision.',
    falsifier:
      'A disembodied system that shows robust causal and physical reasoning, reliably and off-distribution, without embodied training.',
  },
];

export const THEORY_BY_ID: Record<string, Theory> = Object.fromEntries(
  THEORIES.map((t) => [t.id, t]),
);
