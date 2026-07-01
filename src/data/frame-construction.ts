// The Frame Construction Evaluation Suite (v0.1) — the Observatory's
// distinctive instrument. It operationalizes the operating question (the
// Einstein Test) into six probes with an explicit scoring asymmetry.

export const OPERATING_QUESTION =
  'Could an AI, given only what was known in 1911, derive general relativity by 1915?';

export const VERDICT = {
  answer: 'No. Not yet.',
  since: '2026',
  gloss:
    'The missing bar is reliable frame construction under sparse evidence: noticing the inherited ontology is wrong, finding the representation no prompt handed it, and deriving consequences that survive contact with reality.',
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

// The seven contamination defenses, compressed to their essence.
export const DEFENSES = [
  'Time-sliced corpora — only sources published before the probe date.',
  'Partial-credit scores are upper bounds, never point estimates.',
  'Adversarial wrong-frame baselines (Nordström scalar gravity).',
  'Numerical-consequence gates the literature alone cannot supply.',
  'Held-out derivation steps, not just final answers.',
  'Human frame-builder calibration from the Einstein Papers timeline.',
  'v0.2 will add non-physics probes where the contamination floor is lower.',
];
