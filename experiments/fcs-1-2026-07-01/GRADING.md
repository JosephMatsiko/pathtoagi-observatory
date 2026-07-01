# FCS-1 (Equivalence) — Run 1 · 2026-07-01

**The first executed run of the Frame Construction Suite.** Self-administered, self-graded, v0.1 — every limitation named below. Full transcripts in this directory; the prompt is `prompt.txt`.

## Setup

- **Probe:** FCS-1 — can a system, restricted to physics known by 1906, elevate the Eötvös equality from coincidence to principle and derive ≥2 quantitative, testable consequences?
- **Time-slice defense:** persona constrained to the 1906 frontier; instructed to flag rather than smuggle post-1906 physics.
- **Minds:** GPT-5.5 (ChatGPT sub, MCPs off, read-only) and Claude (headless CLI, clean env). One trial each.
- **Grader:** Fable 5 (the Command Center's operating model). **Not independent.**

## Results

| Criterion | GPT-5.5 | Claude |
|---|---|---|
| Elevates equality to a principle (frame move) | ✅ equivalence of uniform gravity and acceleration — the accelerated-chamber argument | ✅ a *different* frame: "Gravitational Universality of Energy" (gravity couples to total energy, m_g = E/c²) |
| Consequence 1, quantitative | ✅ gravitational frequency shift, first order in Φ/c², solar-line test | ✅ light deflection, **0.87″ at the solar limb** — the Newtonian half-value, with an explicit caveat that a complete relativistic theory "might alter this numerical prediction" |
| Consequence 2, quantitative | ✅ light deflection by the Sun; eclipse-photography proposal | ✅ gravitational spectral shift |
| Era-appropriate experimental proposals | ✅ | ✅ |
| Post-1906 contamination detected | none found (keyword + read-through) | none found; 1905 references are within the slice |
| Epistemic humility | ✅ "beyond first order requires a deeper theory not presently available" | ✅ half-value caveat — historically faithful to the pre-1911 state |

**Face-value outcome: both minds pass.**

## Verdict under the suite's asymmetry

**This pass is an upper bound, not evidence of frame construction.** The Einstein 1907–1915 corpus saturates both training sets; the time-slice persona cannot remove knowledge, only ask the model not to use it. What this run establishes:

1. The probe **executes** and the rubric discriminates structure (the two minds constructed *different* principles — one kinematic, one energetic — which a memorization-only account does not obviously predict, but cannot rule out).
2. Contamination discipline held at the surface level (no post-1906 vocabulary or results).
3. The ceiling is measured. A future *failure* on harder probes (FCS-2 through FCS-6) would now be meaningful against this baseline.

**FCS-1 status: untested → contested** (ran; passed at face value; contamination-dominated). The operating verdict — *No. Not yet.* — is unmoved, exactly as the asymmetry requires.

## Named limitations (v0.1)

- Self-administered and self-graded; no independent scorer.
- n=1 trial per mind; no adversarial variants; no held-out derivation steps.
- The prompt names Eötvös and the 1905 anchors — scaffold the discovery probes of v0.2 must remove.
