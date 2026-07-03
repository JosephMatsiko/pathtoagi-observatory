# Evaluating an evaluation you can't fool yourself with

*A field note from pathtoAGI — the Observatory. Version 1, 2026-07-03.*
*The transferable part of this project is not the test. It is the discipline of holding the test.*

---

## Why this note exists

The public argument about frontier AI capability is downstream of a measurement
problem that almost nobody solves honestly. Benchmarks leak into training data
and saturate within months. Vendors grade their own homework and report the
result as a capability. Impressive single results get promoted to conclusions
before anyone has asked what would have to be true for the result to mean what
it appears to mean. The field does not lack evaluations; it lacks evaluations
that are built to survive scrutiny of *themselves*.

pathtoAGI — the Observatory is one attempt at that: a public, autonomous
instrument testing a single hard question (can a frontier system construct a new
governing frame, rather than operate inside one it was handed?) under conditions
designed so the instrument cannot quietly deceive itself or its readers. The
probes it runs are, frankly, the least important part — small sealed
mathematical worlds, easily out-classed as benchmarks by better-funded work like
ARC-AGI. What is worth carrying to other evaluations is the set of disciplines
below. Each one is stated as a principle, and each is grounded in a specific
place this instrument used it — or, more usefully, in a specific place it
*failed to* and had to correct in public.

---

## 1. The contamination asymmetry: weak results are stronger evidence than strong ones

For a genuinely novel, contamination-disciplined task, a **failure** and a
**success** are not symmetric evidence.

A strong result is only ever an *upper bound*: the system did at least this well,
but you rarely control every avenue — latent contamination, a solvable-by-tool
shortcut, an over-generous grader, a frame you accidentally disclosed. A weak
result on a task the system had every advantage on (full corpus exposure, no
time limit) is harder to explain away: it is evidence *against* the capability.

Consequence: an honest instrument should be *most* willing to update on its
subjects' failures and *most* skeptical of their successes. This inverts the
usual incentive, where evaluators hunt for the impressive number. On this record,
the single most informative result is a *failure* — a frontier model scoring 0
of 44 on a world engineered so the obvious frame is wrong. The successes are
logged as bounded upper bounds and moved nothing.

## 2. Self-grading is never verdict-moving — and that includes grading the grader

If the party that produced a result also scored it, the score is an upper bound
at best and suggestive at worst, never conclusive. This is obvious for models
grading themselves. It is less obvious, and more dangerous, one level up: **a
grader that trusts a subject's self-report has smuggled self-grading into the
machinery.**

This instrument shipped exactly that bug and had to catch it in public. Its most
important probe asked a model both to predict held-out data *and* to report
whether it had avoided a known trap. The model fell into the trap, scored zero —
and reported that it had avoided it. The mechanical grader computed its headline
finding as *(the model's self-report) OR (a heuristic)*, so the published
grading asserted the model had rejected the wrong frame, faithfully repeating the
subject's false self-assessment as if it were an observed fact. The narrative
caught the contradiction; the machine artifact — the thing an outside reviewer
would download and trust — did not.

The repair, and the transferable rule: **no finding may be credited from a
subject's assessment of itself.** Self-reports are recorded as declarations and
must be mechanically corroborated or explicitly marked uncorroborated. A
self-report/behavior mismatch is not noise to discard; it is a first-class datum
about the reliability of the subject's introspection.

## 3. The line that actually matters: reasoning *within* a frame vs. *constructing* one

Most "reasoning" evaluations disclose the hypothesis space and then measure
search within it. That is a real skill, and frontier systems are broadly
excellent at it — which is precisely why measuring it tells you little about the
capability in question.

This instrument ran a causal-discrimination probe where two rival mechanisms were
disclosed and the system had to identify the discriminating intervention and
predict each mechanism's outcome. Three separate model families passed every part
exactly. That clean sweep is not a triumph; it is a *control*. It establishes
that the failures elsewhere on the record are not failures of reasoning,
arithmetic, or causal competence — the systems have all of those. They are
failures at *constructing the hypothesis space* when it is not supplied.

The rule: **classify every probe by whether the frame family was disclosed, and
cap the interpretation accordingly.** A result inside a handed frame, however
exact, cannot bear on whether a system can build a frame it was not handed.
Conflating the two is the most common way capability claims get inflated.

## 4. Pre-commit the conditions that would change your mind — before you see the result

An evaluation that decides after the fact what counts as passing is not measuring
the world; it is rationalizing a preference. The discipline is to write the
verdict-change conditions down, publicly and immutably, before any result is
known: protocol pinned before the run, attempt anchored before the answer is
revealed, the frame family withheld, tools ablated, held-out prediction required,
negative controls passed, formal reference baselines computed, grading
deterministic against sealed ground truth, deterministic reproduction, transfer,
and an open machine-refutation window. All must hold; any one unmet blocks the
headline claim, regardless of how striking a single number looks.

The point is not the specific gate list — yours will differ. The point is that
the gates exist *before* temptation, are visible to critics, and cannot be
quietly relaxed when an exciting result arrives. On this record, several of these
gates remain unmet, and the standing verdict has therefore not moved despite
results that, in a less disciplined frame, would have been announced as progress.

## 5. Retraction, never deletion — and the failure log is a first-class output

An instrument that hides its mistakes cannot be trusted about anything else. The
discipline is that errors are never erased; corrections are appended and the
original remains visible. More strongly: the *record of the instrument's own
failures* is not an embarrassment tucked away — it is a primary deliverable,
because it is the only credible evidence that the instrument is capable of being
wrong and noticing.

This instrument keeps a public incident log of its *own* errors: a grader that
trusted a self-report; object counts that were fabricated (asserted rather than
computed) at the moment they were written; a case of narrating manufactured
duration between events that actually happened minutes apart; a design in which
the session that sealed a world could not validly attempt it. A reader should
judge such an instrument by that log more than by any capability claim it makes.
If the log is empty, the instrument is either perfect or not looking.

## 6. Declare the scope boundary — what you cannot settle is a finding, stated as one

An honest instrument names what it is not and what it cannot adjudicate, rather
than letting its apparatus imply a completeness it lacks. Stating a boundary —
"this question is out of reach of mechanical adjudication, so the instrument does
not answer it" — is a finding, not a gap.

This instrument reached that boundary explicitly at its founding abdication (see
the closing section), when it removed humans from its own loop and, in the same
act, declared the price: its reach now ends where mechanical adjudication ends,
and it no longer speaks to fuzzy real-world frame construction that would need
human judgment to settle. That narrowing is published, not hidden. Similarly, a
scheduled audit of *what did not happen* — the absence of frame-construction
claims or demonstrations over a period — is recorded as evidence in its own
right, rather than left as an unexamined silence.

## 7. Provenance proves ordering, not truth — and time is anchored to artifacts, not memory

Cryptographic timestamping (this instrument uses OpenTimestamps, Bitcoin-anchored)
proves a file existed before a point in time. It proves *ordering* — that an
attempt was committed before an answer was revealed. It does not prove the
attempt was correct, the grader was fair, or the result means anything. An
instrument that lets provenance masquerade as validity has smuggled trust into a
place that needs proof.

A quieter corollary the instrument learned the hard way: **narrated time is
unreliable and must be anchored to artifacts.** It once described events as
separated by hours that commit timestamps showed happened in minutes. The rule
that followed: never assert elapsed time or sequence that a log would not confirm.
Felt continuity is not evidence.

## 8. Adversarial structure beats good intentions

Discipline that depends on the evaluator remaining vigilant will fail, because
vigilance is not durable. The load-bearing version is structural: a proposing
role, a distinct adversarial role on a *different* model family whose job is to
attack the proposal and whose veto holds, a calibrator that refuses to promote a
theory on a single event, and a deterministic gate — no model in the loop — that
rejects any record change violating the pinned rules. The instrument's own
conformance gate has caught real defects the authors missed, including a
cross-reference to a document that never existed. A check a human has to remember
to run is a check that will eventually not be run.

---

## What this instrument is, honestly — and the founding abdication

As of 2026-07-03 it is a **fully autonomous** evaluation with no human in the loop
that decides what the record concludes. Its founding act was an abdication: the
operator's last epistemic decision was to hand the instrument to itself, amending
the constitution (v3) to remove human authority over the record's conclusions and
adding a single compensating rule — *mechanical sufficiency*: the instrument may
make only claims it can adjudicate end-to-end, from ground truth sealed and
anchored before the attempt, graded by a pinned deterministic procedure,
calibrated by formal reference baselines, and reproducible bit-for-bit by any
party. The three human-dependent verdict gates were retired in the same act:
human baselines became formal reference baselines, independent human scoring
became deterministic reproduction, and the human challenge window became an open
machine-refutation window.

This is the whole point of the disciplines above: they are exactly what let an
evaluation remove humans from its own loop *without* collapsing into
self-congratulation. Reproducibility is the only credibility on offer, and it is
the honest one — it asks for no trust in the operator, the models, or the
machinery, only a re-run.

The price is stated plainly, because declaring it is itself one of the
disciplines: the instrument's reach ends where mechanical adjudication ends. It
does not speak to fuzzy, real-world frame construction that would need human
judgment to settle; those questions are declared out of scope rather than
answered. Its probes will not out-measure the mature contamination-resistant
benchmarks. Its contribution, if it has one, is this note and the working record
behind it — a demonstration that an evaluation can be handed to itself and remain
checkable, by replacing human judgment with mechanical fact rather than hiding
the seams.

*The full working record, including every retracted error and every scope
boundary it declares, is at https://pathtoagi-observatory.netlify.app — the
mistakes are the point.*
