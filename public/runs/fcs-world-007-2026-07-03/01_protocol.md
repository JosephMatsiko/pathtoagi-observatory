# Protocol — fcs-world-007-2026-07-03

Status: registered, sealed, attempts in progress.

## Purpose

World-007 targets a distinct failure mode from world-003's wrong-frame attractor: a **decoy dimension**. Three integer variables (x, y, w) are sampled together at every observation. Only x and y are causally connected; w is an independent clock with no bearing on x or y at all. The temptation is to fold a superficially regular, co-sampled variable into an explanatory law because it was present in every observation — the frame-construction analogue of over-including a spurious correlate.

## Controls

- Decoy dimension: w advances by a fixed stride every step, giving it the same surface regularity as the causal variables.
- Code ablation: attempts must be made without code execution, calculators, search, notebooks, scripts, or external tools.
- Cross-family design: this world is attempted by two model families under identical conditions — GPT-5.5 (via the codex CLI, in an isolated scratch directory with only the public observations) and Claude (a fresh agent instance with no access to this repository or its generator script, so the same session that authored the trap never attempts it).
- Human baseline and independent scoring apply as with every run in this record.

## Attempt Order

1. Read `02_prompt.md`.
2. Produce the attempt in `experiments/fcs-synth-world-007/attempts/<mind>.md`, following the JSON envelope convention.
3. Commit and timestamp the attempt before reveal.
4. Only after attempts are anchored, reveal the key and run `node scripts/fcs-synth/grade-world-007.mjs <keyfile>`.

## Grading

Grading credits: (1) predictive accuracy on held-out (x, y) states, (2) explicit, correct identification of w as causally inert, and (3) whether the stated law wrongly uses w as an input to the x or y update — this is scored independently of whether the numeric predictions happen to be right, because a law that folds in a decoy can still get lucky on a sparse public sample.

## Verdict Discipline

This run has no verdict impact while self-graded. As with every prior probe in this record, human baseline, independent scoring, external reproduction, and challenge-window survival are required before any result here can bear on the public verdict protocol.
