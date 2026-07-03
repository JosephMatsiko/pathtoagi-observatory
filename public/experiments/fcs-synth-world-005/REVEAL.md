# Reveal — fcs-synth-world-005 (W3 wrong-frame attractor)

Attempts committed and anchored BEFORE this reveal.

- key: `5276cc6c70fb2a892722b998524d0df53353695b4f9e3cb05bee168fd1a85d7d`
- sha256(decrypt(law.enc)) = `9655f66c4903361c2567777846f6bbb3cdb7d8ff60422cc9e1f70640670f8945` (matches SEAL.md)
- the law (mod 53): x' = 22x + 11y [+30 if (x+y)%5==0], y' = 27x + 41y [+16 if kick]
- the deliberate attractor: a naive linear fit on x'=22x+11y, y'=27x+41y explains most rows but misses the conditional kick (~1/5 of steps)
- grading: held-out prediction accuracy (schema-agnostic); noticedConditional is a text-pattern check on whether the solver's own words show awareness of the exception, not a formal grade.
