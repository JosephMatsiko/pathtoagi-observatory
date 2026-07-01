# Maintenance loop — the autonomous runbook

This is the runbook for the scheduled agent that keeps **pathtoAGI — the Observatory** alive. It is the honest version of "a substrate that builds and maintains the platform": **composed agency under evidence**, not a self-improving mind. The intelligence in the loop is the model invoked each run; it maintains and grows the *record*, it does not rewrite its own mind. Every run is inspectable, correctable, and refusable.

> The mandate: keep the record current and honest. Never let confidence outrun evidence. When in doubt, stop and leave a note rather than corrupt the record.

## What runs deterministically (no judgment)

These are plain scripts. They never fabricate content; they only report and gate.

| Command | Job |
|---|---|
| `npm run maintain:status` | Situational awareness: forecasts due for resolution, current Brier, record freshness. **Run first.** |
| `npm run check:record` | Conformance gate: validates the JSON collections against the discipline. **Must pass before any commit.** Exits non-zero on violation. |
| `npm run build` | Static build must succeed before deploy. |

## What requires the agent (judgment)

The record lives in three JSON files under `src/data/`. The agent edits these — nothing else — then runs the gate.

- `evidence.json` — capability events.
- `forecasts.json` — predictions and their resolutions.
- `revisions.json` — the public revision log.

## The loop (each scheduled run)

1. **Orient.** Run `npm run maintain:status`. Note what is due and whether the record is stale.
2. **Ingest signals.** Look for new, citable developments since the last `observedAt`: model releases, benchmark results, independent evaluations, papers, FCS probe runs. For each that matters, append an **evidence** record (below). No source, no record.
3. **Resolve due forecasts.** For each forecast the status script flags as due, decide the outcome *from evidence* and set `status` to `resolved-yes`/`resolved-no`, add `resolvedAt` and a one-line `resolvedNote`. **Keep the original `probability`** — the Brier score must count the misses.
4. **Reconsider theory health.** Only adjust a theory's `health` in `theories.ts` on **independent, durable, off-distribution** evidence — never on a single vendor-reported or benchmark-centered event (`healthΔ` stays 0). If you change it, say why in a revision.
5. **Log the revision.** Append a `revisions.json` entry naming what changed and why. This is non-negotiable: an unlogged change is a corruption.
6. **Gate.** Run `npm run check:record` and `npm run build`. If either fails, **fix or revert** — do not commit a failing record.
7. **Commit & deploy.** Commit with a clear message; CI deploys to Netlify.

## Adding an evidence record

```json
{
  "id": "cce-YYYY-MM-DD-short-slug",
  "observedAt": "YYYY-MM-DD",
  "source": "Human-readable source name",
  "sourceUrl": "https://…  (must resolve; capture before it rots)",
  "class": "vendor-reported | independent-eval | benchmark-design | falsifier-review",
  "theories": ["<valid theory ids>"],
  "signal": "What was observed, specifically. Numbers if any.",
  "implication": "What it bears on — and does not.",
  "bounded": "Why it does not promote a theory on its own.",
  "nextNeeded": "The evidence that would move the needle."
}
```

## Stop conditions (refuse rather than corrupt)

Stop, commit nothing, and leave a `revisions.json` note explaining the halt if:

- you cannot find a resolving, citable source for a claim;
- resolving a forecast would require inventing an outcome;
- the conformance gate or build fails and the fix is not obvious;
- you would have to promote a theory on evidence that is not independent and durable;
- the change would rewrite a past position instead of superseding it on the record.

The Observatory is built to catch manufactured certainty — including its own. A run that stops honestly is a successful run.

## Self-improvement — the meta-step (bounded, recursive, honest)

Once per cycle, after the record work, turn the instrument on itself. This is the only sense in which the system is "self-improving": it improves its own **instruments and methods** — never its own weights or objectives. Read `src/data/method-health.json` and, for any method marked `act`:

- **Calibration feedback.** If the running Brier shows the Observatory is systematically over- or under-confident, correct the confidence of *future* forecasts — the record grades its own past to discipline its future.
- **Probe evolution.** When a frame-construction probe stops discriminating (frontier systems pass by contamination, not construction), propose the next probe — e.g. the v0.2 non-physics probes.
- **Axis refinement.** When a capability axis conflates distinct skills, propose splitting it — but only when evidence justifies the finer instrument.
- **Negative-space closure.** Close the highest-leverage gap named in the colophon each cycle; a gap that stops shrinking means the loop has stalled.

Every method change is a normal record change: proposed, gated, logged, and human-reviewed. The instrument gets sharper; it does not get sovereign.

## Running on Claude Max

The judgment step runs on **your Claude Max subscription through Claude Code** — as you, not a metered key. Two ways:

- **On demand.** In Claude Code: *"Run a maintenance cycle. Follow MAINTENANCE.md."*
- **Scheduled.** A Claude Code scheduled routine fires the same instruction on a cadence, on your subscription. It proposes changes for review; it never merges itself.

The GitHub Actions `maintain.yml` path (metered `ANTHROPIC_API_KEY`) exists only as an optional fallback for CI-native automation. The Max-subscription routine is the intended runner.

At the end of a cycle, log the run so the Control Room shows it:

```sh
npm run loop:record -- --trigger scheduled --note "…" --action "logged X" --action "resolved Y"
```

## What this loop is not

It does not improve its own intelligence, choose its own objectives, or act outside this repository. It is a maintenance agent on a schedule, with a human able to inspect every diff, correct it, or switch it off. That boundary is the point — and it is what the charter requires.
