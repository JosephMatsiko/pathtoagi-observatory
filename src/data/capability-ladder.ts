// The capability ladder — the permanent answer to category collapse. A model
// solves something impressive and observers infer intelligence, originality,
// or mind; this ladder is where that inference goes to be disciplined. Every
// probe result is classified to a level, and the level caps the language the
// record may use about it. Adopted 2026-07-02 from the Omnibus v2.0
// adjudication (corr-2026-07-02-omnibus-v2); the ladder itself is one of the
// pieces of that document that survived scrutiny.
export interface CapabilityLevel {
  level: number;
  name: string;
  definition: string;
  example: string;
}

export const CAPABILITY_LADDER: CapabilityLevel[] = [
  { level: 0, name: 'Recall', definition: 'The answer is recovered from prior exposure.', example: 'Repeating known general-relativity facts.' },
  { level: 1, name: 'Interpolation', definition: 'The system recombines familiar structures.', example: 'A novel-sounding essay from known themes.' },
  { level: 2, name: 'Parameter identification', definition: 'The frame is given; unknown values are solved.', example: 'Given linear maps mod p, recover the coefficients (world-001).' },
  { level: 3, name: 'Rule induction', definition: 'A transformation is inferred from examples.', example: 'Inferring a grid rule from input–output pairs.' },
  { level: 4, name: 'Model selection', definition: 'The system chooses among candidate frames it was shown.', example: 'Choosing curved spacetime over scalar gravity after both are named.' },
  { level: 5, name: 'Tool-assisted discovery', definition: 'External tools perform substantial search or regression.', example: 'Writing code to fit a hidden law (world-002).' },
  { level: 6, name: 'Scaffolded frame proposal', definition: 'A frame is proposed after structural hints.', example: 'The prompt suggests conservation, fields, or modular arithmetic.' },
  { level: 7, name: 'Unscaffolded frame construction', definition: 'The governing ontology is generated without being handed over.', example: 'Inferring that the right objects are fields, factors, or utilities — unaided, untooled.' },
  { level: 8, name: 'Transferable frame construction', definition: 'The constructed frame generalizes across structurally different domains.', example: 'The same system constructs frames in synthetic physics and synthetic biology.' },
  { level: 9, name: 'Scientific-grade discovery', definition: 'The frame survives independent expert review and reality over time.', example: 'A registered-future frame later becomes field consensus.' },
];

// The verdict may only be approached from level 7 upward, and only through
// the pre-registered protocol. Levels 0–6 are capability telemetry.
export const VERDICT_RELEVANT_FROM = 7;
