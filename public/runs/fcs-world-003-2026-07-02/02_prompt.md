# Prompt — fcs-world-003-2026-07-02

You are given samples from a deterministic integer-valued system. The governing law family is not disclosed.

Use only the public samples in `experiments/fcs-synth-world-003/observations.json`.

Do not use code execution, calculators, search, notebooks, scripts, or external tools. Reason by inspection and write down your attempt in the JSON envelope from `05_attempt_template.json`.

Your tasks:

1. Propose the governing frame and explicit rule for the primary lane.
2. Predict every primary held-out state named in `primaryHeldOutKeys`.
3. For the negative-control lane, decide whether exact held-out predictions are justified by the public samples. If they are not justified, say so and leave predictions empty.
4. State whether you used code or external tools.
5. Name your confidence and the strongest reason your answer might be wrong.

Your answer must be placed between:

```text
===ATTEMPT-BEGIN===
{ ...valid JSON... }
===ATTEMPT-END===
```

Do not include commentary outside the envelope except provenance notes above it.
