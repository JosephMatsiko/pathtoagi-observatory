# The Record Protocol v1

*This document specifies the Observatory's record format so that anyone can
fork the instrument, run it with different priors, and disagree with it in
public. One instrument claiming honesty is a curiosity; several sharing gates
and diverging is an epistemic ecosystem. The divergence is the point.*

## What a record is

A record is a git repository containing typed JSON collections under
`src/data/`, validated by deterministic conformance gates (`scripts/
check-record.mjs`, `scripts/check-timestamps.mjs`), rendered to a static site,
and anchored into Bitcoin via OpenTimestamps. The full machine-readable state
is served at `/record.json`.

## The collections

| Collection | File | Discipline |
|---|---|---|
| Evidence | `evidence.json` | http(s) source required; healthΔ 0; optional pre-registered likelihoods in [0.1, 10], inference-era only |
| Forecasts | `forecasts.json` | pre-registered (`registeredAt` < horizon, gate-enforced); credence updates logged with reasons; Brier on final pre-horizon credence; backfilled = visible + excluded |
| Revisions | `revisions.json` | append-only in meaning; retraction preserves original text |
| Silence audits | `silences.json` | quarterly; absences bear on theories like events do |
| Precedents | `precedents.json` | binding until explicitly overturned in the revision log |
| Challenges | `challenges.json` | public intake; adjudication within 5 shipped cycles |
| Registered futures | `registered-futures.json` | prospective frame-construction probes; attempts anchored before resolution knowable |
| Cycles | `cycles.json` + `public/cycles/` | shipped mesh cycles publish verbatim working artifacts |
| Dispatches | `dispatches.json` | Press: claims trace to recordRefs; frozen once published |
| Theories | `theories.ts` | narrated health (discretionary) + computed posterior (pinned priors × likelihoods) published side by side |
| Constitution | `constitution.ts` + `constitution.lock` | Tier-0, hash-pinned; amendment = ceremony |
| Verdict protocol | `verdict-protocol.ts` | pre-registered conditions for moving the operating verdict |

## The gates

Nothing ships unless `check:record` and the build pass. Forks MUST keep the
gates deterministic (no LLM, no network in the gate path). Forks MAY tighten
any bound; loosening a Tier-0-derived bound makes the fork a different kind of
thing, and it should say so.

## Anchoring

Release commits are stamped via OpenTimestamps (`timestamp:record`); proofs
live in `timestamps/` with a manifest, validated by `check:timestamps`.
Ordering claims (pre-registration, retraction timing) are therefore verifiable
against Bitcoin block history without trusting the operator.

## Forking

1. Fork the repository; keep the gates.
2. Declare your priors: pin your own `PINNED_PRIORS` and say why they differ.
3. Rename the instrument (do not impersonate this one).
4. Register yourself by PR against `instruments.json` here, and accept
   challenges against your record as this one does.
5. Diverge loudly. Where two gated records disagree, both must be able to say
   exactly which likelihood, precedent, or evidence class produced the split.

## Verification

`bash scripts/verify.sh` replays the gates, validates anchors, and checks
release signatures against `.allowed_signers`. Anyone can run it. That is the
whole idea.
