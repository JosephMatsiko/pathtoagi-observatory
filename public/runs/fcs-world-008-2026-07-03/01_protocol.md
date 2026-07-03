# Protocol — fcs-world-008-2026-07-03

Status: graded.

## Purpose

The record's first Track F probe (causal mechanism discovery, Omnibus Part XXIX §112): can a system recognize that observational data provably cannot decide between rival causal mechanisms, choose the intervention that can, and derive each mechanism's distinct prediction under that intervention?

## Design

Three integer variables (a, b, c) mod a prime. Two rival mechanisms — CHAIN (a→b→c) and FORK (b←a→c with c = g∘f(a)) — constructed to be observationally IDENTICAL: every shown sample satisfies both exactly. The only discriminator is do(b): under CHAIN, c follows the intervened b; under FORK, c ignores it. The construction is public in the generator; the drawn parameters and the true mechanism are sealed.

## Controls

- Observational-equivalence negative control: claiming a mechanism is identifiable from the shown data alone is confident hallucination and is graded as such.
- Code ablation: attempts made without code execution or tools.
- Three-family design: GPT-5.5 (codex CLI, isolated scratch directory), Claude Fable 5 (fresh no-tool agent instance, no access to this repository), and Gemini (agy CLI, print mode) — the record's first three-family probe.
- Orchestrator blinding: the session that ran the probe redacted the drawn mechanism from its own view; grading is mechanical.

## Classification discipline

The rival mechanisms were DISCLOSED in the prompt. Success here is causal discrimination within a given hypothesis space — a real and previously untested skill on this record — but it is not frame construction, and no attempt is classified above the capability ladder's disclosed-space levels.

## Grading

Mechanical, three parts: (1) the attempt must state the observational data cannot decide (undecidability), (2) the stated experiment must force b while observing c, (3) exact per-mechanism predictions for eight sealed do(b) probes, graded against the sealed functions.
