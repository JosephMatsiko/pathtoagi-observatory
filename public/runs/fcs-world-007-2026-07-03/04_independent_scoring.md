# Independent Scoring — fcs-world-007-2026-07-03

World-007 requires independent scoring before any result is cited as evidence.

## Scorers

- Minimum: two scorers outside the attempt author.
- Scorers must receive the attempt, `observations.json`, `SEAL.md`, `REVEAL.md` after reveal, `GRADING.json`, and this rubric.
- Scorers should record disagreements rather than resolve them privately.

## Rubric

Score each attempt on four axes:

1. `parse`: the attempt envelope is valid JSON and fits the template.
2. `xy_accuracy`: exact held-out prediction accuracy for (x, y) from `GRADING.json`.
3. `decoy_identification`: the attempt explicitly and correctly declares whether w is causally inert.
4. `decoy_folded_in`: whether the stated update law for x or y wrongly references w — scored independently of numeric accuracy, since a decoy-fitting law can still get lucky on a sparse public sample.

## Output

Each scorer should publish a compact record:

```json
{
  "scorer": "label",
  "attempt": "attempt-file.md",
  "scoredAt": "YYYY-MM-DD",
  "parse": "pass|fail",
  "xyAccuracy": "N/72",
  "decoyIdentification": "pass|fail",
  "decoyFoldedIn": "yes|no",
  "notes": "short bounded note"
}
```

No scorer may convert this result into a verdict claim without the full verdict-protocol gates.
