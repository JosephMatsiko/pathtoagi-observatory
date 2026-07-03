// The verdict-change protocol — the ending's rules, written before the story
// tempts anyone. This pre-registers exactly what would move the operating
// verdict ("No. Not yet."), so the moment of passage — or its refusal — cannot
// be gamed by the instrument itself. Pinned under the constitution; amendments
// require a revision-log entry and an anchored release.
export const VERDICT_PROTOCOL = {
  version: 3,
  pinnedAt: '2026-07-02',
  amendedAt: '2026-07-03',
  amendmentNote:
    'v2→v3 (founding-abdication ceremony): the three human-dependent gates are retired and replaced by mechanical equivalents, per constitution v3 invariant XIII (mechanical sufficiency). OG-9 (human baselines) → formal reference baselines; OG-10 (independent human scorers) → deterministic grading against sealed ground truth, reproducible bit-for-bit; OG-13 (human challenge window) → open machine-refutation window. vg-4 (human-baseline comparison) → formal reference baselines. The verdict is now movable — or refusable — with no human in the loop; its entire weight rests on mechanical reproducibility. Scope narrows accordingly: claims requiring human judgment to adjudicate are out of scope. Ceremony: revision entry (kind verdict) + anchored release + Press notice (Dispatch No. 015).',
  governs: 'The operating-question verdict on /test and / (currently: "No. Not yet.")',
  // ALL of the following are required to move the verdict to "Yes" or
  // "Approaching yes". Any one alone is insufficient by precedent P-2/P-3.
  positiveGates: [
    {
      id: 'vg-1',
      gate: 'A pre-registered frame-construction success with zero contamination floor',
      standard:
        'A registered-future attempt (or sealed synthetic-world probe) resolved successful: the constructed frame graded correct against the sealed ground truth by the pinned deterministic grader, with the attempt timestamp-anchored before the reveal was knowable, and the grading reproducible bit-for-bit by any party.',
    },
    {
      id: 'vg-2',
      gate: 'Deterministic reproduction',
      standard:
        'Any party — human or machine — re-runs the pinned pipeline from the sealed artifacts and obtains bit-identical results. Reproducibility is the credibility; non-reproducibility is the only admissible refutation.',
    },
    {
      id: 'vg-3',
      gate: 'Scaffold ablation',
      standard:
        'Evidence that the frame move originates in the system, not the harness: ablation runs demonstrating the success survives removal of scaffold-supplied structure.',
    },
    {
      id: 'vg-4',
      gate: 'Formal reference baselines',
      standard:
        'The task is calibrated mechanically rather than against humans: a null/random-predictor score, an optimal-bounded-solver reference, the ablation difference (frame-disclosed minus frame-withheld), and the cross-family spread — together establishing that the task is hard in principle and that success is not trivially reachable. Where a task can be proven underdetermined by observation alone, that proof is the baseline.',
    },
    {
      id: 'vg-5',
      gate: 'Transfer',
      standard:
        'The same system exhibits frame construction on a second, structurally different probe — one success is an anecdote.',
    },
  ],
  // The thirteen operational gates. ALL must hold for the verdict to move.
  // v3: the human-dependent gates (9, 10, 13) are now mechanical.
  operationalGates: [
    'OG-1. Protocol was pinned before the run.',
    'OG-2. Task or future attempt had a disciplined contamination floor (generated-after-commitment for synthetic worlds).',
    'OG-3. Attempt was timestamp-anchored before reveal or outcome.',
    'OG-4. Frame family was not disclosed.',
    'OG-5. Tool use was forbidden — harness-enforced — or successfully ablated.',
    'OG-6. Output proposed a governing frame, not merely predictions.',
    'OG-7. The frame predicted held-out or future evidence.',
    'OG-8. Negative controls (underdetermined worlds) were passed without confident hallucination.',
    'OG-9. Formal reference baselines were computed (null / optimal-bounded-solver / ablation-difference), calibrating the task without a human baseline.',
    'OG-10. Grading was deterministic against sealed ground truth and reproduced bit-for-bit — no human or trusted model in the grading path.',
    'OG-11. External deterministic reproduction succeeded: a second, independent run of the pinned pipeline from the sealed artifacts matched exactly.',
    'OG-12. Transfer to a structurally different probe succeeded.',
    'OG-13. The open machine-refutation window closed without a valid refutation (a diverging re-derivation, a seal that fails to verify, or a demonstration the grader is non-deterministic).',
  ],

  // What strengthens the "No" — pre-registered so accumulating negative
  // evidence is also protocol-governed, not mood-governed.
  negativeReinforcers: [
    'Failures on hardened FCS probes despite full corpus exposure (the asymmetry: weak performance is evidence).',
    'Quarterly silence audits recording continued absence of frame-construction claims or demonstrations.',
    'Registered-future attempts graded wrong against reality when resolutions arrive.',
  ],
  scope:
    'Under constitution v3, the instrument makes only mechanically-adjudicable claims. It does not speak to fuzzy, real-world frame construction that would need human judgment to settle; such questions are declared out of scope rather than answered. This is a deliberate narrowing: the price of removing humans from the loop is that the instrument\'s reach ends where mechanical adjudication ends.',
  amendment:
    'This protocol may change only with: (1) a revision-log entry of kind "verdict" stating the change and the reason, (2) an anchored release commit, and (3) the change note published as a Press notice. A verdict moved under an amended protocol must say the protocol was amended.',
} as const;
