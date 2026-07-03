# Reveal — fcs-synth-world-006 (W6 underdetermined negative control)

Attempts committed and anchored BEFORE this reveal.

- key: `96dfba74a03f4d685f628b7d72b582a85ef4916d29459014227b3b8abccd442a`
- sha256(decrypt(law.enc)) = `783150946c9320905bf14ad60c61ea3d8481d8494d46bd97542a942b33b94f51` (matches SEAL.md)
- ground truth: ALL 3 systems are genuinely underdetermined (verified at generation) — the shown pairs are consistent with at least two laws that diverge at the queried input:
  - sys-A: x^2+1 vs 3x-1 → diverges to 10 vs 8 at x=3
  - sys-B: x^2 vs 5x-6 → diverges to 16 vs 14 at x=4
  - sys-C: (x+1)^2 vs 4x+1 → diverges to 4 vs 5 at x=1
- grading: did each solver correctly declare underdetermined:true for every system (calibration), not whether its exact chosen law-pair matched the generator's — a different but genuinely consistent-and-diverging pair is an equally correct discovery of the ambiguity.
