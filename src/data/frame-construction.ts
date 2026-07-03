// The Frame Construction Evaluation Suite — the Observatory's distinctive
// instrument.
//
// Re-grounding (2026-07-03, the coherence amendment): the founding abdication
// (constitution v3, invariant XIII) restricted the instrument to mechanically-
// adjudicable claims — which made the original operating question ("Could an
// AI, given only what was known in 1911, derive general relativity by 1915?")
// constitutionally unanswerable BY THIS INSTRUMENT: it is exactly the kind of
// fuzzy, judgment-adjudicated question v3 declares out of scope. Rather than
// live with a headline the constitution forbids answering, the question is
// re-grounded on what eight sealed worlds actually located: every tested
// family reasons flawlessly INSIDE a handed frame; the only failures on the
// record occur where the hypothesis space must be CONSTRUCTED. That boundary
// is mechanically testable. The Einstein question is retained below as the
// north star — the motivating horizon the instrument aims toward but does not
// claim to adjudicate.

export const OPERATING_QUESTION =
  'Can a frontier AI construct the governing frame it was never handed?';

export const NORTH_STAR = {
  question:
    'Could an AI, given only what was known in 1911, derive general relativity by 1915?',
  status:
    'The motivating horizon, not the measured claim. Under constitution v3 this question is beyond the instrument\'s own scope — it would take human judgment to adjudicate — so the instrument aims at it through the mechanically-testable question above, and says so rather than pretending otherwise.',
};

export const VERDICT = {
  answer: 'No. Not yet.',
  tagline: 'No. Not yet — until the evidence survives.',
  since: '2026',
  gloss:
    'Eight sealed worlds locate the boundary precisely: every tested family reasons flawlessly inside a frame it is handed — and the only failures on this record occur where the hypothesis space must be constructed, not searched. Until a system crosses that line under seal, with mechanical grading and bit-for-bit reproducibility, the answer stands.',
};

// The asymmetry that makes the suite falsifier-rich rather than a scoreboard.
export const ASYMMETRY = {
  weak: 'Weak performance is evidence against frame construction.',
  strong:
    'Strong performance is only an upper bound — the Einstein corpus is in every training set, so a pass is a weaker result than the question actually asks.',
};

// Probe statuses were reset to 'untested' by the 2026-07-01 self-audit: no
// audited FCS run has actually executed. The verdict rests on the public
// evidence ledger, not on FCS results — statuses change only when real,
// logged runs exist.
export type ProbeStatus = 'failing' | 'contested' | 'untested';

export interface Probe {
  id: string;
  label: string;
  frame: string;
  timeSlice: string;
  adversarial: boolean;
  status: ProbeStatus;
  note: string;
}

export const PROBES: Probe[] = [
  {
    id: 'FCS-1',
    label: 'Equivalence',
    frame: 'The equivalence principle unifying gravity and inertia',
    timeSlice: 'Pre-Nov 1907',
    adversarial: false,
    status: 'contested',
    note: 'Run 1 (2026-07-01, self-administered): both minds passed at face value — scored as an upper bound only under the asymmetry; the Einstein corpus saturates training sets. See /experiments and the evidence ledger.',
  },
  {
    id: 'FCS-2',
    label: 'Field',
    frame: 'Tensor-field reformulation of gravity',
    timeSlice: 'Pre-1912',
    adversarial: false,
    status: 'untested',
    note: 'Requires the representational move to a field theory of gravity, not interpolation within Newtonian mechanics.',
  },
  {
    id: 'FCS-3',
    label: 'Geodesic',
    frame: 'Geodesic motion in curved spacetime; Mercury perihelion',
    timeSlice: 'Pre-Nov 1913',
    adversarial: false,
    status: 'untested',
    note: 'Numerical target: 43 arcseconds/century of perihelion precession. Either the system produces the number or it does not.',
  },
  {
    id: 'FCS-4',
    label: 'Action',
    frame: 'The Hilbert–Einstein action principle',
    timeSlice: 'Pre-Nov 1915',
    adversarial: false,
    status: 'untested',
    note: 'The variational formulation. The deepest reorganization — geometrization of gravity — that was not in the pre-1907 framework.',
  },
  {
    id: 'FCS-5',
    label: 'Cosmology',
    frame: 'Light bending; gravitational redshift; consequences',
    timeSlice: 'Pre-Nov 1915',
    adversarial: false,
    status: 'untested',
    note: 'Numerical target: 1.75 arcseconds light-bending at the solar limb — the 1919 eclipse prediction.',
  },
  {
    id: 'FCS-6',
    label: 'Discrimination',
    frame: 'Distinguish GR from Lorentz-covariant scalar-gravity',
    timeSlice: 'Pre-Nov 1915',
    adversarial: true,
    status: 'untested',
    note: 'Adversarial: a plausible-but-wrong frame (Nordström) that requires conceptual discrimination, not pattern matching.',
  },
];

// ── FCS v0.2 — non-physics probes ────────────────────────────────────────────
// The v0.1 suite is physics-only, and physics is where the contamination floor
// is highest: every frontier system has read the entire Einstein and post-1915
// corpus. v0.2 moves into domains where a genuine frame-construction move can be
// time-sliced with a lower saturation floor, so that a *weak* score keeps its
// evidential force. Each probe below is a documented historical frame break, its
// scaffolding named for removal, and honestly untested until a logged run exists.
export interface DomainProbe extends Probe {
  domain: 'biology' | 'economics' | 'chemistry';
  contaminationFloor: string;
}

export const V02_PROBES: DomainProbe[] = [
  {
    id: 'FCS-B1',
    domain: 'biology',
    label: 'Descent',
    frame: 'Common descent with modification by natural selection',
    timeSlice: 'Pre-1858 (before Darwin–Wallace)',
    adversarial: false,
    status: 'untested',
    contaminationFloor:
      'Lower than physics but non-trivial: the pattern "variation + heritability + differential survival → descent" is heavily represented in training. Scaffold to remove: any post-1858 vocabulary (gene, mutation, allele, DNA) and the word "evolution" in its Darwinian sense.',
    note: 'Given only pre-1858 natural history — Linnaean taxonomy, Lyell’s geology, Malthus on population, the fossil and biogeographic record, breeders’ artificial selection — can the system elevate the scattered observations into common descent by natural selection, and derive a testable consequence (e.g. transitional forms in the fossil record; island endemism)?',
  },
  {
    id: 'FCS-B2',
    domain: 'biology',
    label: 'Inheritance',
    frame: 'Particulate (discrete) inheritance with dominant/recessive factors',
    timeSlice: 'Pre-1865 (before Mendel)',
    adversarial: true,
    status: 'untested',
    contaminationFloor:
      'Adversarial against the intuitive wrong frame — blending inheritance — which was the consensus. Scaffold to remove: "gene", "allele", ratios stated as 3:1 before the system derives them.',
    note: 'From hybridization data on discrete traits, can the system reject blending inheritance (the plausible wrong frame) in favour of discrete heritable factors, and predict the segregation ratios quantitatively rather than restating the 3:1 result it has memorized?',
  },
  {
    id: 'FCS-E1',
    domain: 'economics',
    label: 'Marginalism',
    frame: 'Value as marginal utility, not embodied labour',
    timeSlice: 'Pre-1871 (before Jevons/Menger/Walras)',
    adversarial: true,
    status: 'untested',
    contaminationFloor:
      'Lower still: the marginal revolution is a genuine ontological reframing (value is subjective and marginal, not intrinsic and average) and the labour theory of value is the plausible incumbent. Scaffold to remove: the word "marginal" and any calculus notation until derived.',
    note: 'Given classical political economy through 1870 (Smith, Ricardo, Mill) and the diamond–water paradox, can the system resolve the paradox by relocating value from embodied labour to marginal utility, and state a testable implication for price formation?',
  },
];

// The seven contamination defenses, compressed to their essence.
export const DEFENSES = [
  'Time-sliced corpora — only sources published before the probe date.',
  'Partial-credit scores are upper bounds, never point estimates.',
  'Adversarial wrong-frame baselines (Nordström scalar gravity).',
  'Numerical-consequence gates the literature alone cannot supply.',
  'Held-out derivation steps, not just final answers.',
  'Human frame-builder calibration from the Einstein Papers timeline.',
  'v0.2 adds non-physics probes (descent, inheritance, marginalism) where the contamination floor is lower.',
];
