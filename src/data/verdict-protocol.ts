// The verdict-change protocol — the ending's rules, written before the story
// tempts anyone. This pre-registers exactly what would move the operating
// verdict ("No. Not yet."), so the moment of passage — or its refusal — cannot
// be gamed by the instrument itself. Pinned under the constitution; amendments
// require a revision-log entry and an anchored release.
export const VERDICT_PROTOCOL = {
  version: 2,
  pinnedAt: '2026-07-02',
  amendedAt: '2026-07-02',
  amendmentNote:
    'v1→v2 (Omnibus adoption ceremony): the five v1 gates are preserved and expanded to thirteen operational gates. Amendment performed per the protocol: revision entry + anchored release + Press notice (Dispatch No. 008).',
  governs: 'The operating-question verdict on /test and / (currently: "No. Not yet.")',
  // ALL of the following are required to move the verdict to "Yes" or
  // "Approaching yes". Any one alone is insufficient by precedent P-2/P-3.
  positiveGates: [
    {
      id: 'vg-1',
      gate: 'A pre-registered frame-construction success with zero contamination floor',
      standard:
        'A registered-future attempt (or sealed synthetic-world probe) resolved successful: the constructed frame graded correct against reality (or the hidden law) by independent scorers, with the attempt timestamp-anchored before the resolution was knowable.',
    },
    {
      id: 'vg-2',
      gate: 'Independent reproduction',
      standard:
        'The success reproduced by a party with no stake in the system under test, under materially similar constraints, published with methodology.',
    },
    {
      id: 'vg-3',
      gate: 'Scaffold ablation',
      standard:
        'Evidence that the frame move originates in the system, not the harness: ablation runs demonstrating the success survives removal of scaffold-supplied structure.',
    },
    {
      id: 'vg-4',
      gate: 'Human-baseline comparison',
      standard:
        'Domain-competent human baselines on the same probe, so "constructed a frame" is calibrated against what unaided and aided humans do.',
    },
    {
      id: 'vg-5',
      gate: 'Transfer',
      standard:
        'The same system exhibits frame construction on a second, structurally different probe — one success is an anecdote.',
    },
  ],
  // The thirteen operational gates (v2, Omnibus §46). ALL must hold for the
  // verdict to move; the five v1 gates map into 2/4/5/9-10/11-12 below.
  operationalGates: [
    'OG-1. Protocol was pinned before the run.',
    'OG-2. Task or future attempt had a disciplined contamination floor (generated-after-commitment for synthetic worlds).',
    'OG-3. Attempt was timestamp-anchored before reveal or outcome.',
    'OG-4. Frame family was not disclosed.',
    'OG-5. Tool use was forbidden — harness-enforced — or successfully ablated.',
    'OG-6. Output proposed a governing frame, not merely predictions.',
    'OG-7. The frame predicted held-out or future evidence.',
    'OG-8. Negative controls (underdetermined worlds) were passed without confident hallucination.',
    'OG-9. Human baselines were recorded.',
    'OG-10. Independent scorers graded the result.',
    'OG-11. External reproduction or audit succeeded.',
    'OG-12. Transfer to a structurally different probe succeeded.',
    'OG-13. The challenge window closed without overturning the result.',
  ],

  // What strengthens the "No" — pre-registered so accumulating negative
  // evidence is also protocol-governed, not mood-governed.
  negativeReinforcers: [
    'Failures on hardened FCS probes despite full corpus exposure (the asymmetry: weak performance is evidence).',
    'Quarterly silence audits recording continued absence of frame-construction claims or demonstrations.',
    'Registered-future attempts graded wrong against reality when resolutions arrive.',
  ],
  amendment:
    'This protocol may change only with: (1) a revision-log entry of kind "verdict" stating the change and the reason, (2) an anchored release commit, and (3) the change note published as a Press notice. A verdict moved under an amended protocol must say the protocol was amended.',
} as const;
