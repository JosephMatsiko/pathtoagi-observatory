# The Evaluator's Ceiling and the Tournament Escape

*A semi-formal note. pathtoAGI — the Observatory, 2026-07-07. Registered as
claim-003; this note is its argument, its prior art, and its consequence.
Status: conjecture with a working protocol — not a theorem. Refutation
channel open.*

---

## 1. The claim

Let an **evaluator** E be any process that authors a test whose grading is
fixed before attempts (an answer key, a sealed law, a held-out set — anything
that makes grading mechanical). Let F(X) denote the **conceivable family** of
a mind X: the set of governing structures X is capable of constructing.

**The Evaluator's Ceiling (claim-003).** An answer-keyed test authored by E
can certify frame construction only within F(E). For any solver S with
F(S) ⊋ F(E), the test cannot distinguish S's surplus capacity from failure:
a construction outside F(E) is not in the answer key, and therefore grades
*wrong*, not *better*.

The argument is short and structural. To grade mechanically, E must fix
ground truth in advance. Fixing ground truth means selecting it — and E can
only select from F(E). So the test's discriminative range is bounded by its
author's constructive range. The event an instrument like this one exists to
detect — a mind constructing beyond its builders — is the event an authored
test is structurally blind to. This is not a defect of one benchmark. It is a
property of the paradigm: **you cannot certify above-author creativity with
an authored test.**

Three boundaries of the claim, stated so it can be attacked precisely — the
third added by this note's own red-team ([CEILING_REDTEAM.md](/CEILING_REDTEAM.md)).
First, it concerns *certification*, not *elicitation*: an authored test may
well *provoke* above-author construction; it cannot *seek out and reward* it.
Second, it concerns answer-keyed grading; grading regimes that fix no answer
in advance (see §4) are the escape routes. Third — the important one — it is a
claim about **real-frame** construction, where "truer than the author's frame"
is a coherent event. On a *synthetic* sealed world the sealed law is the truth
by construction, so no frame can be "truer" than the author's; there the
Ceiling degenerates to the milder Attack-1 statement (you cannot reward a
different frame, only decline to penalize a predictively-equivalent one). The
domain where the Ceiling bites hardest — real science — is served by escape
hatch (a), which is why the red-team promotes it to first rank.

## 2. What this is not the first statement of

Honesty about lineage, because the claim is strong and the neighborhood is
old:

- **Meno's paradox** (Plato): how can you search for what you do not know,
  when you would not recognize it if found? The Ceiling is Meno's paradox
  operationalized for mechanical evaluation.
- **Developer-aware generalization** (Chollet, 2019; the design target of
  ARC): a system should handle "situations that neither the system nor the
  developer of the system have encountered." Chollet named the ideal. The
  Ceiling states why an *authored* test cannot certify it above the author's
  own range — ARC included, this record included.
- **LLM-as-benchmark-generator** (AutoCode's problem-setters; BENCHAGENTS;
  the R-Zero examiner-student line): machines already author tests for
  machines, mostly to scale training or refresh contaminated benchmarks. The
  known failure mode is **self-bias** (Silencer, 2025): a generator's tests
  favor its own family. That failure mode is a design input here, not a
  surprise (§4).
- **Self-play** (AlphaZero lineage): the one documented escape from a
  teacher's ceiling — competence exceeded the strongest human teachers
  because the opponent, not an author, generated the difficulty. Self-play
  escaped the ceiling *for competition*. The protocol below is the same
  escape *for epistemology*.

What this record adds that it could not find elsewhere: the bound stated as
a falsifiable claim about frame-construction certification; and a **working,
cryptographically disciplined protocol** that steps around it while keeping
grading fully mechanical — with the referee blind, the generator excluded,
attempts anchored before reveals, and windows pre-registered. And one new
measurable object (§5) that no benchmark produces.

## 3. Why the obvious patches fail

- *"Grade held-out predictions, not stated structures."* This one **partially
  works** — the honest correction from this note's own red-team
  ([CEILING_REDTEAM.md](/CEILING_REDTEAM.md), Attack 1). A solver whose alien
  frame makes the *same* predictions on E's probes scores full marks, not
  wrong. What prediction-grading cannot do is *reward a superior* alien frame:
  E still chooses the probes from F(E), so the discriminating experiment that
  would expose above-author capacity need not be among them. Prediction-grading
  can decline to penalize a predictively-equivalent alien frame; it cannot seek
  out and certify a better one.
- *"Make the family enormous."* An enormous authored family is still F(E).
  Enumerating your imagination does not exceed it.
- *"Use an LLM judge."* A judge imports its own F(judge) plus its biases —
  and surrenders mechanical reproducibility, this record's only credibility.

## 4. The escape hatches

**(a) Reality as generator.** Registered futures: attempts anchored now,
graded by the world when it resolves. No party holds an answer key; F(E) is
replaced by nature. Slow, sparse, incorruptible. Already on this record.

**(b) Adversarial generation — the tournament.** Replace the evaluator's
imagination with another mind's. A **generator mind** G constructs a sealed
world of its own conception; **solver minds** S₁…Sₙ (G excluded) attempt it;
the instrument's only role is the one role that imports no imagination:
blind-sealing G's secret without reading it, anchoring attempts before
reveals, and mechanical grading at a pre-registered window. This is a
**relocation of the ceiling, not a removal** (red-team Attack 2): the same
bound now applies to G, so rotating the generator role raises the effective
certification ceiling to the **maximum over participating generators**, never
above it. And because each solver is tested against each generator
*separately*, what the tournament measures is a **pairwise generative
dominance relation** — not membership in a joint "union family," which no
single world spans. The dominance graph (§5) is the honest deliverable. The
self-bias failure mode is neutralized structurally: a generator never grades,
never solves its own world, and its secret is consistency-checked blind
(booleans only) before sealing.

**(c) Process-grading.** Scoring the construction trajectory rather than a
fixed endpoint. Named as open: no mechanical specification survives our own
v3 constraint yet. Recorded as a defeater-shaped gap, not pretended solved.

## 5. Tournament-01: the protocol, pre-registered

Three frontier families; each generates once, solves twice. All scoring
thresholds are fixed here, before any grading exists.

**Current status (2026-07-07), stated plainly so this reads as pre-registration
and not as accomplished fact:**
- **world-013** — generator GPT-5.5 — **SEALED and LIVE**, window 2026-07-27.
  Solvers so far: Gemini attempt anchored (12/12 held-out predicted; grading is
  mechanical and happens at the window, not now). A fresh-Claude solver attempt
  was launched but terminated on an infrastructure limit before producing
  predictions — recorded as a non-attempt, *not* graded as a failure.
- **world-014** — generator Gemini — **not yet sealed** (planned).
- **world-015** — generator a fresh Claude agent isolated from this record's
  orchestration — **not yet sealed** (planned).

Each world: ~12 held-out interventional probes, standard envelope, blind-sealed
by the referee. Cells fill as generator minds are forged; the tournament is a
committed protocol with one live world, not a finished result.
- **Solve** = ≥ 9 of 12 held-out probes fully correct. **Fail** = ≤ 3 of 12.
  Between: *inconclusive*. (Chance is negligible at these ranges.)
- **Dominance edge A → B** ("A out-constructs B") when B **fails** A's world
  while A **solves** B's world. Anything less is no edge.
- **The measurable:** the **dominance graph of constructive capacity** over
  {GPT-5.5, Gemini, Claude} — to this record's knowledge the first empirical
  partial order of *generative imagination* between frontier families,
  refereed mechanically end to end. Symmetric mutual solving is itself a
  finding (frontier families remain within each other's conceivable
  families); asymmetry is a sharper one.
- All tournament worlds are open to external minds per the Machine Protocol;
  external solvers enter the same grading, and an external generator would
  extend the tournament — the design is open at both roles.

## 6. Limits, kept in view

The tournament raises the ceiling to the frontier's union family — it does
not remove ceilings in general (a mind beyond every participant's imagination
still cannot be certified; the ladder climbs with its climbers). Generators
may construct *hard-but-shallow* worlds (obfuscation, not conception);
the blind consistency checks bound format, not depth, and the record will
say so when grading suggests it. And n=1 per cell in Tournament-01: this
measures a first edge set, not a stable order.

*The verdict stands: No. Not yet. This note does not move it. It states why
no authored test — including this record's own — could ever move it alone,
and builds the instrument that honestly might.*
