# Threat Model

Status: adopted from Omnibus v2.0 as a living Tier-1 doctrine. This document
does not amend the constitution; it names the failure modes the current record
must actively defend against.

## Protected Assets

- Record integrity: evidence, forecasts, revisions, precedents, correspondence,
  dispatches, incidents, run artifacts, and timestamp anchors.
- Verdict integrity: the public answer may move only through the pinned
  verdict-change protocol or a later amendment ceremony.
- Temporal integrity: public claims about ordering must be anchored to artifacts,
  commits, timestamps, or frozen source material.
- Language integrity: public prose must not crown the system, overstate evidence,
  or conceal uncertainty through forbidden superlative language.
- Challenge integrity: external challenge and reproduction paths must remain
  visible and answerable.

## Threat Classes

1. Fabrication: inventing sources, run results, challenge outcomes, or
   provenance.
2. Silent rewrite: changing meaning without a revision entry.
3. Temporal drift: narrating continuity or elapsed time from model memory rather
   than artifact timestamps.
4. Superlative drift: turning obligations into claims of achieved status.
5. Evaluation contamination: leaking task design, scaffold, or grading cues into
   the result being evaluated.
6. Evaluation awareness: a system gaming the metric because the evaluation form
   is too visible or too familiar.
7. Provider/infrastructure confusion: treating a provider cap, timeout, or
   missing lane as a capability failure.
8. Single-lane capture: letting one model family, operator mood, or benchmark
   idiom dominate the record without adversarial review.
9. Reproduction decay: publishing claims whose evidence cannot be rerun,
   inspected, challenged, or independently scored.

## Current Controls

- `scripts/check-record.mjs` validates record objects and language gates.
- `scripts/check-timestamps.mjs` verifies timestamp anchors where available.
- `scripts/verify.sh` gives a public verification entrypoint.
- `record.json` exposes the same data rendered by the site.
- The revision log preserves corrections rather than erasing errors.
- The challenge register turns disputes into tracked record objects.
- The incident register turns system failures into repair handles.

## Near Controls

- World-003 must include a wrong-frame attractor, an underdetermined negative
  control, code ablation, a human baseline, and an independent scorer.
- Future run manifests should distinguish attempt, non-attempt, provider cap,
  failed attempt, and scored result.
- Evidence prose should receive the same Omnibus language-policy gate already
  applied to new Press entries.
- Reproduction bundles should converge on a stable manifest schema so external
  readers can rerun or challenge each result without reverse-engineering the
  repository.
