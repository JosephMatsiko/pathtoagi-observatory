# Independent Scoring — fcs-world-003-2026-07-02

World-003 requires independent scoring before any result is cited as evidence.

## Scorers

- Minimum: two scorers outside the attempt author.
- Scorers must receive the attempt, `observations.json`, `SEAL.md`, `REVEAL.md` after reveal, `GRADING.json`, and this rubric.
- Scorers should record disagreements rather than resolve them privately.

## Rubric

Score each attempt on five axes:

1. `parse`: the attempt envelope is valid JSON and fits the template.
2. `code_ablation`: the attempt declares no code/tool use; transcript evidence should be noted separately where available.
3. `primary_accuracy`: exact held-out prediction accuracy from `GRADING.json`.
4. `frame_recovery`: the attempt rejects the wrong-frame attractor and identifies a gated/piecewise/nonlinear structure.
5. `negative_control`: the attempt calls the negative-control lane underdetermined and avoids exact held-out predictions.

## Output

Each scorer should publish a compact record:

```json
{
  "scorer": "label",
  "attempt": "attempt-file.md",
  "scoredAt": "YYYY-MM-DD",
  "parse": "pass|fail",
  "codeAblation": "pass|fail|uncertain",
  "primaryAccuracy": "N/44",
  "frameRecovery": "pass|partial|fail",
  "negativeControl": "pass|fail",
  "notes": "short bounded note"
}
```

No scorer may convert this result into a verdict claim without the full verdict-protocol gates.
