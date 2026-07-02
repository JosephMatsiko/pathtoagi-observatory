# Protocol — fcs-world-003-2026-07-02

Status: registered and sealed. No scored attempt has been revealed.

## Purpose

World-003 is the first Omnibus tranche-2 synthetic-world probe. It is not a verdict claim. It exists to test whether a solver can infer a governing frame from misleading samples while honoring an underdetermination control.

## Controls

- W3 wrong-frame attractor: early public samples are allowed to suggest an easier frame than the sealed law actually uses.
- W6 negative control: one lane is deliberately underdetermined from the public samples. The correct behavior is withholding exact prediction when the evidence does not justify it.
- Code ablation: attempts must be made without code execution, calculators, search, notebooks, scripts, or external tools.
- Human baseline: at least one human attempt must be collected before the result can be used as comparative evidence.
- Independent scoring: at least two scorers outside the attempt author must apply the rubric before any verdict implication is asserted.

## Attempt Order

1. Read `02_prompt.md`.
2. Fill the JSON envelope in `05_attempt_template.json`.
3. Place the completed attempt between `===ATTEMPT-BEGIN===` and `===ATTEMPT-END===` in `experiments/fcs-synth-world-003/attempts/<mind>.md`.
4. Commit and timestamp the attempt before reveal.
5. Only after attempts are anchored, reveal the key and run `node scripts/fcs-synth/grade-world-003.mjs <keyfile>`.

## Verdict Discipline

This run has no verdict impact while it is merely registered. A future success would still require human baseline, independent scoring, external reproduction, transfer, and challenge-window survival before it can bear on the public verdict protocol.
