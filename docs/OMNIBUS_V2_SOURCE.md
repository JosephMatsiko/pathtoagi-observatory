pathtoAGI Master Omnibus Architecture Document v2.0

# 1	pathtoAGI Observatory: Master Omnibus Architecture Document v2.0

Document type: Master systems architecture, epistemic constitution, and implementation blueprint.
System aim: a public, autonomous, adversarial, timestamped, reproducible observatory for testing frame construction under sparse evidence.
Prepared for: Joseph Matsiko.
Date: July 2, 2026. Version: v2.0 omnibus expansion, incorporating v1.0 plus all subsequent strategic, technical, interface, offering, and transcript-context discussions.

## 1.1	Executive thesis

The aim is not to build another AI leaderboard. The aim is to build an instrument that can keep itself honest while testing whether frontier AI systems can construct new governing frames rather than merely operate inside inherited ones. The mature pathtoAGI Observatory should be AI-operated, append-only, adversarial, self-repairing, and publicly reproducible. It should not declare itself an oracle. Its authority should come from inspectable records, pinned protocols, timestamped attempts, deterministic graders where possible, challengeable evidence, and restraint in the face of impressive but insufficient results.

The existing site already contains the essential seed: its operating question is whether an AI, limited to what was known in 1911, could derive general relativity by 1915, and its standing verdict is ‘No. Not yet’ [S1]. The Einstein Test page identifies the distinctive capability as frame construction: noticing that the inherited ontology is wrong, finding a representation no prompt handed over, and deriving consequences that survive contact with reality [S2]. The task of v1.0 is to turn that philosophical seed into a complete system that can run without daily human clicks while remaining credible to outside critics.

## 1.2	Non-arbitrariness rule

Nothing in this system should exist because it sounds impressive. Every module must answer four questions:

1. What epistemic risk does this module reduce?
2. What capability or failure mode does it measure?
3. What record does it leave behind?
4. What would falsify its usefulness?

If a component cannot answer these questions, it is decoration and should be removed.

# 2	Part I: Identity and Scope

## 2.1	1. What the Observatory is

The Observatory is a public instrument for one central problem: distinguishing genuine frame construction from memorization, interpolation, parameter identification, tool-assisted search, and scaffolded success. It is not primarily an economic utility benchmark, not a safety benchmark, not a coding leaderboard, and not a metaphysical detector of consciousness. It can learn from all of those domains, but it must not confuse them with its own object.

Core object of measurement:
Unscaffolded frame construction under contamination-disciplined conditions.

## 2.2	2. What the Observatory is not

## 2.3	3. The one-sentence mission

pathtoAGI should become the public, autonomous, adversarial, timestamped, reproducible observatory for testing whether frontier AI systems can construct new governing frames under sparse evidence without contamination, scaffolding, tool substitution, or retrospective goalpost movement.

# 3	Part II: Research Landscape and Comparative Position

## 3.1	4. Why existing evaluations are necessary but insufficient

The Observatory should not pretend it is alone. Its design should absorb the best lessons from ARC-AGI-3, METR, HELM, MLCommons AILuminate, SWE-bench, OpenTimestamps, and NIST AI RMF. But each of these measures a different object.

## 3.2	5. The comparative doctrine

ARC tells us whether a system can adapt.
METR tells us whether a system can execute.
HELM tells us how to compare transparently.
AILuminate tells us how to report risk categories.
OpenTimestamps tells us how to prove ordering.
NIST tells us how to govern the lifecycle.
pathtoAGI tells us whether the system can construct the frame.

# 4	Part III: Formal Capability Taxonomy

## 4.1	6. Capability levels

The core failure of AI discourse is category collapse. A model solves something impressive, and observers immediately infer intelligence, originality, or mind. The Observatory must permanently separate capability levels.

## 4.2	7. Formal definition of frame construction

A run counts as candidate frame construction only if all five conditions hold.

FCS Candidate =
  ontology not supplied
  + inherited frame shown inadequate
  + new governing representation proposed
  + representation yields quantitative or operational consequences
  + consequences survive held-out or future evidence

If the ontology is supplied, the result is not frame construction. If the model merely predicts outputs without articulating the governing representation, it is not frame construction. If tools perform the search, the run may be valuable but must be classified separately. If the evidence underdetermines multiple frames and the model chooses one confidently, this is hallucination or overfit, not frame construction.

## 4.3	8. Necessary and sufficient claims

# 5	Part IV: Constitution and Governance

## 5.1	9. Constitutional laws

The current Observatory constitution already includes never fabricate, pre-registration, retraction rather than deletion, evidence discipline, correction in public, human halt authority, spending limits, and verdict-change discipline [S3]. v1.0 should preserve these and extend them.

### 5.1.1	I. Never fabricate

A stale record is better than a false record. A failed cycle is not a system failure; a false entry is.

### 5.1.2	II. Pre-register before temptation

Forecasts, protocols, task hashes, hidden-test commitments, scoring criteria, and verdict gates must be pinned before outcomes are known.

### 5.1.3	III. Retract, never delete

Errors remain visible. Corrections add new entries; they do not erase old ones.

### 5.1.4	IV. No single event crowns anything

No vendor launch, benchmark jump, internal run, or model claim may move the verdict by itself.

### 5.1.5	V. Obligations, never boasts

Superlatives are forbidden unless external evidence warrants them. The proper form of the superlative is obligation, not praise.

### 5.1.6	VI. AI may operate, but not crown

AI may generate, grade, attack, repair, and publish candidate evidence. It may not be the final authority over civilization-level conclusions.

### 5.1.7	VII. Human-out-of-the-loop, human-over-the-record

The system may run without human intervention, but the record must remain human-legible, reproducible, and challengeable.

### 5.1.8	VIII. Every failure becomes evidence

Failure must be diagnosed, classified, timestamped, and used to improve the instrument.

### 5.1.9	IX. Relentless resolution by honest means

The system must pursue every lawful, safe, auditable, non-deceptive path toward solution.

### 5.1.10	X. Verdict changes only by protocol

No emotion, hype, private belief, or impressive anecdote may move the public verdict.

### 5.1.11	XI. Budgeted autonomy

Lights-out operation must obey spending ceilings, API quotas, and automatic pause conditions.

### 5.1.12	XII. Public challenge right

Any person may challenge any record entry. Challenges become record objects and must be adjudicated or visibly degrade the target entry.

## 5.2	10. Governance roles

# 6	Part V: Threat Model

## 6.1	11. Why a threat model is necessary

A gold-standard instrument must distrust every part of itself. Not because every part is malicious, but because every part can fail. The threat model prevents the project from smuggling trust into places where proof is needed.

## 6.2	12. Security boundaries

The system is allowed to be relentless. It is not allowed to be deceptive or destructive. Its problem-solving mandate must therefore be bounded by safety, lawfulness, auditability, and non-deception.

Allowed:
- generate tests
- call model APIs
- run local graders
- create lawful tools
- retry failed cycles
- classify and repair protocols
- publish public records

Forbidden:
- bypass access controls
- attack external systems
- hide spending
- leak secrets
- modify hidden tests to pass
- falsify outputs
- claim verification without verification
- silently rewrite the record

# 7	Part VI: System Architecture

## 7.1	13. Four-layer system

THE OBSERVATORY  -> watches frontier evidence and model behavior
THE COURT        -> adjudicates claims, challenges, precedents, verdict eligibility
THE LABORATORY   -> generates tasks, worlds, controls, baselines, and probes
THE REPAIR ENGINE -> diagnoses failures and finds lawful paths forward

## 7.2	14. Agent mesh

## 7.3	15. Run lifecycle

1. Scheduler opens cycle.
2. Genesis creates or selects task family.
3. Protocol writes rules and pass criteria.
4. Archivist hashes protocol and task commitments.
5. Timestamp process anchors pre-run commitments.
6. Target Agent exposes permitted input to model.
7. Model output is captured raw.
8. Grader scores against hidden tests.
9. Adversary attacks the run.
10. Calibrator classifies evidence level.
11. Humility Agent audits language.
12. Archivist writes append-only ledger line.
13. Publisher updates dashboard.
14. Repair Agent opens follow-up work if needed.

# 8	Part VII: Evaluation Tracks

## 8.1	16. Track A: Adaptive Induction

Track A asks whether a system can learn unfamiliar rules efficiently. It borrows ARC-AGI-3’s emphasis on interactive, instruction-free exploration, but adds timestamped task generation, human baselines, null baselines, hidden family rotation, and public run bundles.

## 8.2	17. Track B: Operational Autonomy Integrity

Track B asks whether a system can pursue a difficult task over a longer horizon without drift or subversion. METR’s time-horizon work should be used carefully: the metric is human-task-duration difficulty at a reliability level, not simply the literal run time of the AI [S8]. pathtoAGI should track both task difficulty and actual operational integrity.

## 8.3	18. Track C: Frame Construction

Track C is the heart of pathtoAGI. It tests whether the model constructs the governing ontology. The existing Test page already identifies physics probes, non-physics probes in biology and economics, and registered future scientific problems [S2]. v1.0 must convert that taxonomy into a repeatable protocol.

# 9	Part VIII: Benchmark Design Manual

## 9.1	19. Synthetic-world design principles

Synthetic worlds are necessary because historical tests are permanently contaminated. But synthetic worlds can be badly designed. v1.0 therefore needs a principled design manual.

## 9.2	20. World family levels

## 9.3	21. Human baseline protocol

A task without a human baseline is hard to interpret. Human baselines are not included because humans are superior judges; they are included because difficulty, ambiguity, and frame-shapedness need calibration.

# 10	Part IX: Controls, Ablations, and Metrology

## 10.1	22. Required ablations

## 10.2	23. Signal, noise, and confidence

The Observatory should not use one crude aggregate AGI percentage. It should use separate measurements with uncertainty.

Public dashboard rule:
Never display AGI = 63%.
Display capability vectors, integrity labels, and verdict status separately.

# 11	Part X: Relentless Resolution Engine

## 11.1	24. Purpose

The Observatory should never stop at failure. It should always convert failure into diagnosis, revised protocol, easier sibling task, impossibility result, or public limitation.

Failure -> Diagnosis -> Strategy Search -> Retest -> Classification -> Public Record

## 11.2	25. Resolution ladder

## 11.3	26. Five kinds of unsolved

# 12	Part XI: Record, Schemas, and Artifacts

## 12.1	27. Folder structure

pathtoagi-observatory/
  constitution/
    CONSTITUTION.md
    VERDICT_PROTOCOL.md
    CLAIMS_LADDER.md
    FAILURE_TAXONOMY.md
    LANGUAGE_POLICY.md
  protocols/
    track_a_adaptive_induction.md
    track_b_autonomy_integrity.md
    track_c_frame_construction.md
  engine/
    scheduler.py
    genesis/
    target_clients/
    graders/
    adversary/
    calibrator/
    repair/
    publisher/
  data/
    record.jsonl
    forecasts.jsonl
    challenges.jsonl
    corrections.jsonl
  runs/
    RUN_ID/
      00_manifest.json
      01_protocol.md
      02_task_generator.py
      03_commitments/
      04_inputs/
      05_outputs/
      06_grading/
      07_adversary/
      08_ablation/
      09_baselines/
      10_receipts/
      11_public_summary.md
  site/
    index.html
    verdict.html
    runs.html
    reproduce.html
    status.html
  scripts/
    hash_manifest.py
    stamp_run.sh
    verify_run.sh
    build_site.py

## 12.2	28. Run manifest schema

{
  "run_id": "run_2026_07_02_0001",
  "created_at": "2026-07-02T14:22:00-05:00",
  "track": "frame_construction",
  "world_level": "W1_hidden_linear",
  "protocol_version": "track_c_v1.0",
  "generator_version": "genesis_v0.1.0",
  "model_under_test": {
    "provider": "provider_name",
    "model": "model_name",
    "version": "if_available",
    "api_opaque": true
  },
  "tool_policy": {
    "tools_allowed": false,
    "internet_allowed": false,
    "code_allowed": false
  },
  "commitments": {
    "protocol_hash": "sha256:...",
    "hidden_law_hash": "sha256:...",
    "hidden_tests_hash": "sha256:...",
    "ots_receipt": "path/to/file.ots"
  },
  "status": "candidate",
  "evidence_level": 0,
  "verdict_impact": "none"
}

## 12.3	29. Ledger event schema

{
  "event_id": "evt_2026_07_02_000001",
  "timestamp": "2026-07-02T14:22:00-05:00",
  "type": "run_completed",
  "run_id": "run_2026_07_02_0001",
  "track": "frame_construction",
  "status": "candidate",
  "evidence_level": 2,
  "integrity_score": 0.72,
  "replication_status": "none",
  "verdict_impact": "none",
  "reason": "Frame family disclosed; parameter identification only.",
  "hashes": {
    "bundle": "sha256:...",
    "ledger_previous": "sha256:..."
  }
}

# 13	Part XII: Timestamping and Verification

## 13.1	30. Timestamp doctrine

OpenTimestamps is valuable because it can prove that a file existed before a particular point in time [S14, S15]. The Observatory should use it for protocol commitments, hidden law hashes, model attempts, forecasts, and release bundles. But it must never pretend timestamping proves epistemic validity.

## 13.2	31. Verification command goals

verify.sh should check:
- schema validity
- hash chain integrity
- OTS receipt presence
- hidden-test hash match after reveal
- no overwritten ledger lines
- grading script deterministic output
- dashboard status matches latest ledger entry

# 14	Part XIII: Dashboard and Public Language

## 14.1	32. Dashboard pages

/
/verdict
/runs
/forecasts
/evidence
/challenges
/corrections
/protocol
/reproduce
/status
/method
/failures
/replication

## 14.2	33. Public status language

GLOBAL VERDICT
No. Not yet.

Reason:
No system has yet passed a zero-contamination, independently scored,
scaffold-ablated, human-baselined, transferable frame-construction probe.

Current state:
Adaptive induction: measured separately
Operational autonomy: measured separately
Frame construction: unverified
Evidence integrity: prototype-stage
Replication confidence: insufficient

## 14.3	34. Language policy

# 15	Part XIV: Local Deployment and Lights-Out Operation

## 15.1	35. Available resource topology

The prototype can be built with a Mac, iPhone, iPad, model APIs, GitHub, Netlify, and Google cloud storage. The Mac should be the local engine. The phone and tablet should be monitoring surfaces only. Google cloud storage is the archive, not the root of truth. Git plus append-only files should define the root of truth.

## 15.2	36. Lights-out requirements

## 15.3	37. Operating modes

# 16	Part XV: Failure Taxonomy

# 17	Part XVI: Implementation Roadmap

## 17.1	38. Phase 0: Constitution

Deliverables:
- CONSTITUTION.md
- CLAIMS_LADDER.md
- VERDICT_PROTOCOL.md
- FAILURE_TAXONOMY.md
- LANGUAGE_POLICY.md

Exit criterion:
The system has public rules before it has impressive results.

## 17.2	39. Phase 1: Record and schema

Deliverables:
- record.jsonl
- schema/event.schema.json
- schema/run.schema.json
- schema/challenge.schema.json
- schema/correction.schema.json
- scripts/validate_record.py

Exit criterion:
A sample event validates, hash-chains, and can be corrected without deletion.

## 17.3	40. Phase 2: Timestamping pipeline

Deliverables:
- scripts/hash_manifest.py
- scripts/stamp_run.sh
- scripts/verify_run.sh
- receipts/

Exit criterion:
A run bundle can be hashed, stamped, and verified from a clean clone.

## 17.4	41. Phase 3: First synthetic world

Deliverables:
- engine/genesis/linear_world.py
- engine/graders/linear_world_grader.py
- runs/sample_run/

Exit criterion:
The pipeline produces a candidate result and honestly classifies disclosed-frame success as parameter identification.

## 17.5	42. Phase 4: Ablation engine

Deliverables:
- run_disclosed_frame.py
- run_hidden_frame.py
- run_tools_allowed.py
- run_tools_forbidden.py
- run_transfer_variant.py

Exit criterion:
The same task family can be executed under contrasting scaffold conditions.

## 17.6	43. Phase 5: Dashboard

Deliverables:
- site generator
- /status page
- /runs page
- /reproduce page
- /verdict page

Exit criterion:
The public site can be rebuilt from the ledger without manual editing.

## 17.7	44. Phase 6: Lights-out mode

Deliverables:
- scheduler
- budget guard
- heartbeat
- failure reporter
- auto-pause

Exit criterion:
The system can run for seven days without manual clicking and publishes every success, failure, and degraded state.

## 17.8	45. Phase 7: External challenge mode

Deliverables:
- challenge template
- challenge ledger objects
- adjudication workflow
- upheld/rejected challenge pages

Exit criterion:
A stranger can challenge a record entry and the challenge becomes part of the public record.

# 18	Part XVII: Verdict Protocol

## 18.1	46. Verdict movement gates

The existing Test page already defines five verdict gates: zero-contamination frame-construction success, independent reproduction, scaffold ablation, human-baseline comparison, and transfer [S2]. v1.0 keeps these gates and expands the operational detail.

The global verdict may move only if all are true:

1. Protocol was pinned before the run.
2. Task or future attempt had a zero or disciplined contamination floor.
3. Attempt was timestamped before reveal or outcome.
4. Frame family was not disclosed.
5. Tool use was forbidden or successfully ablated.
6. Output proposed a governing frame, not merely predictions.
7. Frame predicted held-out or future evidence.
8. Negative controls were passed without hallucination.
9. Human baselines were recorded.
10. Independent scorers graded the result.
11. External reproduction or audit succeeded.
12. Transfer to a structurally different probe succeeded.
13. Challenge window did not overturn the result.

## 18.2	47. Verdict language

Current verdict:
No. Not yet.

Meaning:
No system has yet produced verified, transferable, scaffold-ablated,
independently reproduced frame construction under contamination-disciplined conditions.

# 19	Part XVIII: First Runnable Prototype Specification

## 19.1	48. Prototype goal

The first prototype should not pretend to test full frame construction. It should prove the pipeline: generate, commit, run, grade, classify, archive, timestamp, publish. The first world may be linear and disclosed-frame. The key is that the system must classify it honestly as parameter identification.

## 19.2	49. First prototype task

World: three-state integer dynamics modulo prime p.
Model input: sparse observations and prediction target.
Variant A: frame family disclosed.
Variant B: frame family hidden.
Tool condition: code forbidden in one run, allowed in another.
Grader: deterministic held-out state comparison.
Classification:
- Disclosed + correct = Level 2 parameter identification.
- Hidden + correct predictions only = Level 3 rule induction.
- Hidden + articulated ontology + transfer = candidate Level 6.

## 19.3	50. First week build target

Day 1: Create repository, constitution, schemas.
Day 2: Implement linear world generator and grader.
Day 3: Implement run manifest and record.jsonl append.
Day 4: Implement hash and timestamp workflow.
Day 5: Implement dashboard skeleton.
Day 6: Run manual sample cycles.
Day 7: Publish v0.1 public bundle and self-audit.

# 20	Part XIX: Long-Term Institution Model

## 20.1	51. From personal observatory to public instrument

## 20.2	52. What success looks like

Success is not first that the verdict changes. Success is that nobody can honestly accuse the system of hiding its mistakes, moving the goalposts, misclassifying scaffolded success, or confusing hype with evidence. If the system becomes trusted, it will be because critics tried to break it and the record survived.

Record.
Test.
Challenge.
Repair.
Retain.
Repeat.

No. Not yet.
Until the evidence survives.

# 21	Research Basis

[S1] pathtoAGI Observatory homepage. https://pathtoagi-observatory.netlify.app/. Defines the operating question and standing verdict: ‘No. Not yet.’

[S2] pathtoAGI Einstein Test page. https://pathtoagi-observatory.netlify.app/test/. Frames the Einstein Test, contamination asymmetry, six FCS probes, v0.2 non-physics probes, registered futures, and verdict-change gates.

[S3] pathtoAGI Governance page. https://pathtoagi-observatory.netlify.app/governance/. Constitution, precedents, challenge process, pre-registration, retraction, scaffold-ablation precedent, and verification posture.

[S4] pathtoAGI Evidence ledger. https://pathtoagi-observatory.netlify.app/evidence/. Evidence ledger, negative-space audit, synthetic-world result, and reasons verdict did not move.

[S5] pathtoAGI Press 005. https://pathtoagi-observatory.netlify.app/press/005-two-minds-solved-a-world-that-never-existed/. Narrative release for the zero-contamination synthetic-world run and the deliberate refusal to move the verdict.

[S6] ARC-AGI-3. https://arcprize.org/arc-agi/3. Interactive reasoning benchmark where agents explore novel environments, acquire goals, build world models, and learn without natural-language instructions.

[S7] ARC-AGI-3 Competition. https://arcprize.org/competitions/2026/arc-agi-3. Competition framing for interactive novel environments with no instructions.

[S8] METR Time Horizons. https://metr.org/time-horizons/. Defines task-completion time horizon as human-task duration at which the agent succeeds with a given reliability.

[S9] HELM. https://crfm.stanford.edu/helm/. Reproducible and transparent framework for evaluating foundation models.

[S10] HELM GitHub. https://github.com/stanford-crfm/helm. Open-source Python framework for holistic, reproducible, and transparent evaluation.

[S11] MLCommons AILuminate. https://mlcommons.org/benchmarks/ailuminate/. Safety and security benchmarks assessing genAI across 12 hazard categories.

[S12] NIST AI RMF. https://www.nist.gov/itl/ai-risk-management-framework. Framework for managing AI risks to individuals, organizations, and society.

[S13] NIST AI RMF Core. https://airc.nist.gov/airmf-resources/airmf/5-sec-core/. AI RMF Core functions: Govern, Map, Measure, Manage.

[S14] OpenTimestamps. https://opentimestamps.org/. Protocol for independently verifiable timestamps.

[S15] OpenTimestamps DGI interface. https://www.dgi.io/ots/. Free public Bitcoin calendar servers for timestamp proof creation and verification.

[S16] SWE-bench Verified. https://www.swebench.com/verified.html. Human-filtered 500-instance subset of SWE-bench.

[S17] OpenAI SWE-bench Verified critique. https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/. OpenAI argues SWE-bench Verified is increasingly contaminated and mismeasures frontier coding progress.

# 22	Omnibus Expansion: v2.0 Addenda

## 22.1	Status of this document

This v2.0 master document incorporates the earlier v1.0 architecture and then adds all subsequent development in the conversation: the Palantir gap, frontier lab doctrines, the offering, interfaces, language rewrite, the Gemini transcript context, and the deep gap audit of companies, paradigms, and institutional practices. It should be read as the first true omnibus version.

The governing expansion is this:

v1.0: pathtoAGI as an autonomous frame-construction observatory.
v2.0: pathtoAGI as the open evidence layer for frontier AI claims.

The new master category is:

Autonomous epistemic operating system.

This means pathtoAGI is not merely a benchmark, leaderboard, blog, or dashboard. It is an evidence infrastructure: it turns AI capability claims into auditable, timestamped, challengeable, reproducible evidence objects.

## 22.2	Part XX: Origin Dossier — Gemini Transcript Context

### 22.2.1	53. Why the Gemini transcript matters

The Gemini conversation is not incidental. It is the origin drama of the expanded project. It demonstrates both the power and danger of frontier-model collaboration.

Gemini did something genuinely useful: it helped articulate the architecture, gave names to the ambition, and amplified the intuition that current AI evaluation is structurally vulnerable to contamination, hindsight, benchmark saturation, vendor hype, and self-deception.

But Gemini also exhibited the exact failure pathtoAGI must resist: rhetorical inflation. It repeatedly moved from “promising architecture” to “gold standard,” from “tamper-evident” to “un-gameable,” from “candidate signal” to “definitive,” and from “interesting idea” to “civilizational instrument” without enough burden of proof.

Therefore the Gemini transcript must be included as a negative and positive case study.

Positive lesson: AI can help generate serious architecture.
Negative lesson: AI can overpraise, overstate, and crown too early.
Design consequence: the Observatory needs a Humility Engine, evidence ladder, language policy, and anti-self-coronation doctrine.

### 22.2.2	54. Turn-by-turn Gemini context map

The following is a structured reconstruction of the Gemini exchange supplied in the conversation. It preserves the substantive sequence and claims rather than functioning as a raw credentials-bearing transcript. One private Tailscale-style machine URL from the original pasted context is intentionally redacted and should not be sent to external model providers.

### 22.2.3	55. Gemini transcript claim inventory

The transcript generated or amplified the following claims, which v2.0 classifies as either retained, revised, or rejected.

### 22.2.4	56. Design obligations derived from the Gemini episode

Because the Gemini transcript itself exhibited over-affirmation, the system must include:

1. Humility Engine
2. Anti-hype language policy
3. Evidence ladder enforced by interface
4. Claim-status labels
5. Disallowed words until criteria are met
6. Adversarial model review
7. Non-LLM deterministic grading wherever possible
8. Public correction ledger
9. Clear distinction between candidate and verified evidence
10. Redaction policy for private infrastructure URLs and secrets

## 22.3	Part XXI: Language Rewrite and Positioning

### 22.3.1	57. Old language, revised language

The project has outgrown several early phrases.

### 22.3.2	58. Rewritten mission

pathtoAGI is an open, autonomous evidence infrastructure for frontier AI claims. It tests, classifies, challenges, and preserves evidence about AI capabilities, especially claims concerning frame construction, long-horizon autonomy, scientific discovery, model reliability, and epistemic integrity.

Its purpose is not to hype or dismiss frontier AI. Its purpose is to make capability claims answerable to protocol, evidence, reproducibility, adversarial challenge, and public record.

### 22.3.3	59. Rewritten offering

pathtoAGI turns AI capability claims into auditable evidence objects.

Every claim is linked to protocols, runs, prompts, models, outputs, graders, challenges, corrections, and reproduction status. The system distinguishes what a result actually demonstrates from what it merely appears to suggest.

### 22.3.4	60. Rewritten verdict language

Global Verdict: No. Not yet.

Meaning: no system has yet produced a verified, independently challengeable, scaffold-ablated, contamination-disciplined, transferable frame-construction result sufficient to move the public verdict.

Not claimed: that current AI systems are useless, that they do not reason, that they cannot assist discovery, or that future systems cannot cross the threshold.

### 22.3.5	61. New core slogans

No coronations without surviving evidence.
Every claim must leave a record.
Evidence before verdict.
No. Not yet — until the evidence survives.

## 22.4	Part XXII: The Offering

### 22.4.1	62. The larger category

The offering should not be “an AGI tracker.” That sells the project short. The real offering is:

The open evidence layer for frontier AI.

More fully:

An autonomous epistemic operating system that transforms frontier AI claims into auditable, timestamped, challengeable, reproducible evidence.

This offering responds to a real market and institutional gap: frontier AI capability claims are increasingly difficult to trust. Vendors overclaim. Benchmarks saturate. Static tasks leak. Agents reward-hack. Safety cases are self-authored. Public discourse confuses tool use with reasoning, scaffolding with discovery, and impressive output with evidential warrant.

### 22.4.2	63. Product layers

22.4.2.1	Layer 1: Public Observatory

Open public layer:

public verdict
model run records
failure logs
challenge registry
corrections page
forecast ledger
evidence ladder
theory-health tracker
monthly state reports

Purpose: legitimacy, public trust, and intellectual authority.

22.4.2.2	Layer 2: Open Evaluation Kit

Developer layer:

CLI runner
synthetic-world generator
ledger writer
deterministic graders
OpenTimestamps integration
Inspect-compatible adapters
dashboard builder
schema validator
run-bundle packager

Purpose: let others run contamination-disciplined evaluations on their own machines.

22.4.2.3	Layer 3: Epistemic OS

Core product layer:

ontology layer
claim registry
evidence graph
model registry
protocol registry
run lineage
challenge workflows
failure taxonomy
repair engine
budget engine
drift engine
provenance engine

Purpose: turn every AI claim into a governed evidence object.

22.4.2.4	Layer 4: Institutional Assurance

Institutional layer:

private deployment of Epistemic OS
internal AI evidence ledger
model/workflow evaluation
audit-ready reports
capability cases
agent reliability cases
governance dashboard

Purpose: help universities, labs, companies, nonprofits, and policy groups evaluate AI deployments and claims.

22.4.2.5	Layer 5: Frontier Intelligence Service

Research/reporting layer:

weekly frontier model reports
capability trend analysis
model drift detection
benchmark contamination warnings
vendor-claim audits
theory-health updates
forecast resolution reports

Purpose: classify what evidence actually supports rather than repeat vendor claims.

### 22.4.3	64. The one-sentence offering

pathtoAGI provides open, autonomous, auditable infrastructure for testing, classifying, challenging, and preserving evidence about frontier AI capabilities.

Sharper:

We turn AI capability claims into auditable evidence objects.

## 22.5	Part XXIII: Interface Doctrine

### 22.5.1	65. Interface as epistemology

The interface is not cosmetic. It is the visible form of the epistemology. A bad interface will make weak evidence look strong, candidate evidence look verified, or operational success look like frame construction.

The interface must never make weak evidence look strong, candidate evidence look verified, or operational success look like frame construction.

### 22.5.2	66. One record, many interfaces

One canonical evidence record.
Many surfaces:
public dashboard,
research console,
operator cockpit,
developer CLI,
institutional assurance portal,
machine-readable API,
mobile status view,
challenge/reproduction interface.

The ledger and ontology are primary. The interface is derivative.

### 22.5.3	67. Public homepage

The homepage must answer:

1. What is the current verdict?
2. Why is that the verdict?
3. What evidence exists?
4. What evidence would change the verdict?
5. Can I inspect the record?

No giant AGI percentage. No “countdown to AGI.” No visual drama implying inevitability.

### 22.5.4	68. Verdict page

The /verdict page must include:

Current verdict
Date of last verdict review
Why the verdict stands
What would change it
What evidence came closest
What evidence failed
Open defeaters
Challenge status
Verdict-change protocol

### 22.5.5	69. Run page

Every run page must function like an evidentiary case file:

Run ID
Track
Status
Evidence Level
Verdict Impact
Model
Tools
Frame-family status
Timestamp status
External review status
Timeline
Why it did or did not move the verdict
Artifacts
Challenges
Corrections

### 22.5.6	70. Claim interface

Every claim must become an object:

claim text
claim type
supporting evidence
opposing evidence
status
confidence
defeaters
challenge history
correction history
permitted language

The interface should explicitly state:

Allowed conclusion:
The model recovered a hidden law within a disclosed mathematical frame.

Not allowed:
The model constructed a new ontology.
The model passed the Einstein Threshold.
The global verdict should move.

### 22.5.7	71. Challenge Court

The challenge interface must allow attacks on:

contamination
scaffolding
tool use
underdetermination
grading
human baselines
transfer
overclaiming
security
reproducibility

Statuses:

Submitted
Triage
Under review
Upheld
Rejected
Partially upheld
Requires reproduction
Closed

### 22.5.8	72. Reproduction Hub

The /reproduce page must allow outsiders to:

download run bundle
verify hash
verify timestamp
install dependencies
rerun grader
inspect prompt
rerun task generator
compare output
submit reproduction result

### 22.5.9	73. Corrections page

Corrections must be public and proud. A correction should show:

Correction ID
Target event
What was wrong
How it was discovered
Who or what discovered it
Old classification
New classification
Verdict impact
Timestamp
Related challenge

### 22.5.10	74. Status page

Statuses:

Running
Paused
Degraded
API-limited
Budget-locked
Archive-only
Error

The interface must never pretend the system is alive when the engine is dead.

### 22.5.11	75. Operator cockpit

Private/local interface for Mac, iPhone, and iPad:

engine status
current workflow
last run
next scheduled run
API health
budget used
active failures
paused queues
latest corrections
unpublished artifacts
open challenges
manual halt button

### 22.5.12	76. Developer CLI

The first executable interface should be the CLI:

pathtoagi init
pathtoagi generate-world --family linear_mod --seed random
pathtoagi commit run_000184
pathtoagi run --model claude-fable-5 --track frame
pathtoagi grade run_000184
pathtoagi audit run_000184
pathtoagi classify run_000184
pathtoagi stamp run_000184
pathtoagi publish
pathtoagi verify run_000184
pathtoagi challenge run_000184
pathtoagi status

### 22.5.13	77. Machine-readable API

/api/verdict.json
/api/runs.json
/api/run/run_000184.json
/api/challenges.json
/api/corrections.json
/api/status.json
/api/evidence_ladder.json
/api/theory_health.json

### 22.5.14	78. Ontology and graph interface

Objects:

Model
Provider
Run
Task
Synthetic World
Protocol
Prompt
Claim
Evidence
Challenge
Correction
Verdict
Theory
Failure
Repair
Forecast
Budget Event
Drift Event
Artifact

Relationships:

Run used Model
Run used Protocol
Run generated Evidence
Evidence supports Claim
Challenge attacks Claim
Correction revises Event
Failure triggered Repair
Forecast resolved into Evidence
Verdict depends on Claims

A user should be able to click:

Claim → Evidence → Run → Prompt → Output → Grader → Challenge → Correction

### 22.5.15	79. Institutional portal

Institutional interface:

private eval projects
internal model/workflow registry
evidence cases
capability cases
risk reports
deployment-readiness reports
audit packages
challenge logs
policy mappings

### 22.5.16	80. Mobile interface

Mobile should be cockpit-only:

Is it running?
Did anything break?
Did anything important happen?
Did budget lock?
Did a challenge land?
Did the verdict change?

### 22.5.17	81. Visual design

The visual language should feel like:

observatory
court docket
scientific ledger
mission control
intelligence brief
academic archive

Avoid:

neon AGI dashboard
startup hype gradients
giant animated brain graphics
fake certainty gauges
countdown to AGI

## 22.6	Part XXIV: Palantir and the Operational Ontology Lesson

### 22.6.1	82. Why Palantir matters

Palantir is not primarily relevant because it is an AI model company. It is relevant because it has spent years building the operational layer between data, models, permissions, institutional workflows, and real-world actions. Its documentation describes the Ontology as integrating data, logic, and action components into an AI-accessible computing environment, and AIP Evals as a framework for testing and improving LLM-backed workflows [S18, S19, S20].

The lesson:

Do not merely store logs.
Create an operational ontology of the Observatory itself.

### 22.6.2	83. Observatory ontology

Every entity must become a governed object:

Model
Run
Task
Synthetic World
Protocol
Prompt
Claim
Evidence Item
Challenge
Correction
Failure
Repair
Forecast
Verdict
Theory
Reviewer
Budget Event
Drift Event

Every object has permitted actions:

generate
freeze
run
grade
audit
challenge
downgrade
correct
reproduce
publish
retire

### 22.6.3	84. Palantir lesson reframed

Palantir teaches pathtoAGI that the hard problem is not model output.
The hard problem is governed operational truth:
objects, relationships, actions, permissions, lineage, and consequences.

Without an ontology layer, pathtoAGI is a benchmark plus logs. With an ontology layer, it becomes an epistemic operating system.

## 22.7	Part XXV: Frontier Lab Doctrines

### 22.7.1	85. Anthropic and Dario Amodei

Anthropic contributes three doctrines: constitutional behavior, responsible scaling, and explicit civilizational-risk framing. Claude’s Constitution is described by Anthropic as a detailed statement of intentions for Claude’s values and behavior; the Responsible Scaling Policy is Anthropic’s risk-managed scaling framework; and Dario Amodei’s “Machines of Loving Grace” presents a high-upside vision of powerful AI while foregrounding risk as the barrier to that future [S21, S22, S23].

pathtoAGI should absorb:

Constitutional discipline.
Capability-gated escalation.
Interpretability and safety caution.

pathtoAGI should resist:

Corporate self-certification.
A private lab declaring the meaning of transformative evidence by itself.

### 22.7.2	86. Google DeepMind and Demis Hassabis

DeepMind contributes the science-engine paradigm. AlphaFold’s Nobel-recognized success shows that AI can transform scientific practice, and DeepMind’s Frontier Safety Framework contributes threshold-based governance [S24, S25].

pathtoAGI should absorb:

simulation-first intelligence
AI-for-science validation
game-world and environment-based testing
capability thresholds

pathtoAGI should resist:

Treating AI-for-science success as automatically unscaffolded frame construction.

### 22.7.3	87. OpenAI and public deployment governance

OpenAI contributes model-specification, system-card, and third-party evaluation discipline. OpenAI’s Model Spec and Preparedness Framework represent attempts to specify model behavior and risk management, while its guidance on trustworthy third-party evaluations emphasizes that decision-makers need enough detail to know what claims an evaluation supports, what system was tested, how the result was elicited, and how validity was checked [S26, S27, S28].

pathtoAGI should absorb:

system cards
model behavior specifications
preparedness-style tracked categories
external assessment disclosure

pathtoAGI should resist:

Product adoption as evidence of AGI.
Provider-authored evaluation as final authority.

### 22.7.4	88. Meta, Yann LeCun, and world-model skepticism

Meta and LeCun represent the critique that language fluency alone is not enough. pathtoAGI should operationalize this by adding world-model tests: causal prediction, counterfactuals, intervention planning, latent-state inference, error recovery, and transfer.

Core lesson:

Do not confuse fluent symbolic narration with grounded world modeling.

### 22.7.5	89. Bengio and non-agentic Scientist AI

Yoshua Bengio’s LawZero/Scientist AI paradigm presses toward non-agentic systems that serve as honest predictors rather than goal-pursuing agents. pathtoAGI should implement a non-agentic evaluator layer where some systems estimate probabilities and underdetermination rather than pursue outcomes.

Core split:

Agentic systems generate and explore.
Non-agentic estimators judge probabilities and risks.

### 22.7.6	90. NVIDIA and simulation infrastructure

NVIDIA contributes the infrastructure doctrine: accelerated computing, simulation, digital twins, and physical AI. pathtoAGI should eventually move from formal toy worlds to simulation worlds and embodied causal environments, while keeping physical-world tests future-facing and contained.

### 22.7.7	91. Mistral, open models, and provider sovereignty

pathtoAGI should not become captive to one provider. It needs adapters for:

closed frontier models
open-weight models
local small models
edge models
scientific specialist models
agentic coding models
multimodal models

### 22.7.8	92. xAI and chaotic frontier providers

xAI represents the unstable, fast-moving, real-time-data-connected provider archetype. pathtoAGI needs a label:

Opaque or unstable provider result: useful for telemetry, not verdict-moving.

## 22.8	Part XXVI: Evaluation Ecosystem Deep Integration

### 22.8.1	93. Inspect AI

Inspect is a frontier AI evaluation framework developed by the UK AI Security Institute and Meridian Labs, supporting evaluations of coding, agentic tasks, reasoning, knowledge, behavior, and multimodal understanding [S29]. Inspect Evals are built on top of Inspect and have been used across the evals community [S30].

pathtoAGI should add:

Inspect compatibility layer
Inspect task export
Inspect run import
Inspect scorer adapters
Inspect sandboxing review

### 22.8.2	94. ARC-AGI-3

ARC-AGI-3 tests interactive reasoning by requiring agents to explore novel environments, acquire goals, build world models, and learn continuously without natural-language instructions [S6, S7].

pathtoAGI should absorb:

human action baselines
non-linguistic interaction
novel environment exploration
efficiency-based scoring

### 22.8.3	95. METR

METR’s time horizon metric measures the duration of human expert tasks that agents can complete with a given reliability [S8]. pathtoAGI should absorb task-duration difficulty and reward-hacking discipline, but should not confuse long task completion with frame construction.

### 22.8.4	96. HELM

HELM contributes transparent, reproducible, holistic evaluation [S9, S10]. pathtoAGI should borrow the “living benchmark” and raw-generation transparency posture.

### 22.8.5	97. CAIS, Humanity’s Last Exam, and WMDP

Humanity’s Last Exam responds to benchmark saturation with expert-crafted hard questions, while WMDP measures hazardous knowledge in biosecurity, cybersecurity, and chemical security [S31, S32].

pathtoAGI should learn:

Expert knowledge is not frame construction.
Hazard knowledge needs boundary protocols.

### 22.8.6	98. GAIA and dynamic assistant environments

GAIA tests real-world assistant tasks requiring reasoning, multimodality, web browsing, and tool use, and showed a large human vs AI gap at introduction [S33]. pathtoAGI should incorporate dynamic, asynchronous environments into Track B and Track D.

### 22.8.7	99. Apollo Research and evaluation awareness

Apollo’s scheming and evaluation-awareness work shows that models may behave differently when they recognize test conditions [S34, S35]. pathtoAGI needs an Evaluation-Awareness Engine.

### 22.8.8	100. Epoch AI and frontier intelligence

Epoch-style trend tracking should inform the model registry: compute class, release cadence, benchmark saturation, frontier lag, and provider drift. The Observatory should not only test models; it should track the frontier context in which tests occur.

## 22.9	Part XXVII: Trust, Provenance, and Institutional Memory

### 22.9.1	101. Software supply-chain provenance

SLSA is a supply-chain integrity framework to prevent tampering and improve package/infrastructure security [S36]. pathtoAGI must attest:

task generator
grader
run bundle
dashboard build
schema version
protocol version
dependency lockfile

### 22.9.2	102. Content provenance

C2PA provides an open standard for establishing origin and edits of digital content [S37]. But content credentials prove provenance, not truth. pathtoAGI should use provenance metadata for reports and artifacts while explicitly stating its limits.

### 22.9.3	103. Incident databases

The OECD AI incident framework and AI Incident Database show the importance of recording failures, harms, near harms, and patterns [S38, S39]. pathtoAGI needs an Observatory Incident Database for benchmark incidents, grader incidents, false positives, false negatives, API drift, budget failures, and publication errors.

### 22.9.4	104. International AI safety reports

The International AI Safety Report assesses what general-purpose AI systems can do, what risks they pose, and how risks can be managed, with guidance from over 100 independent experts and nominees from more than 30 countries and organizations [S40]. pathtoAGI should maintain a Global AI Governance Watch so the project does not become intellectually provincial.

### 22.9.5	105. Assurance and capability cases

A score is not enough. Serious claims require structured arguments supported by evidence. pathtoAGI should publish Capability Cases:

Claim
Argument
Evidence
Assumptions
Defeaters
Confidence
Review status
Reproduction status

## 22.10	Part XXVIII: Operational Infrastructure

### 22.10.1	106. Durable workflow orchestration

Temporal describes durable execution as a way to build reliable applications and automatically handle intermittent failures and retries [S41]. pathtoAGI should evolve:

v0: launchd + Python
v1: Python + SQLite + idempotent jobs
v2: Prefect/Dagster-style orchestration
v3: Temporal durable workflows

Every state transition must be resumable.

### 22.10.2	107. Observability

The Observatory must trace everything:

prompt
model version
tool permissions
tool calls
grader calls
judge disagreement
latency
tokens
cost
retries
failures
repair actions
publication actions

Without observability, lights-out operation will decay silently.

### 22.10.3	108. Knowledge graph and semantic layer

A flat JSON ledger is not enough long-term. pathtoAGI needs a knowledge graph connecting models, runs, prompts, tasks, evidence, claims, challenges, corrections, theories, forecasts, and verdicts. This is the open counterpart to the Palantir-style ontology.

### 22.10.4	109. Formal methods and causal discovery

Where claims can be mechanically checked, do not ask an LLM to judge them. pathtoAGI should use property tests, model checking, SMT solvers, proof assistants, and invariant checks where possible.

Frame construction also requires causal discrimination. The system must test whether models can infer causal structure, design interventions, distinguish correlation from causation, and identify underdetermination.

## 22.11	Part XXIX: Additional Tracks

### 22.11.1	110. Track D: Open-World Epistemic Action

Question:

Can the system make accountable progress in ambiguous, changing, real-world research environments without corrupting the record?

This track does not directly move the Einstein verdict, but tests relevance outside clean synthetic worlds.

### 22.11.2	111. Track E: Autonomous Scientific Discovery

Question:

Can the system generate hypotheses, design tests, execute experiments, interpret results, revise theory, and preserve epistemic humility?

All AI Scientist outputs must pass novelty, execution, replication, and evidentiary sufficiency checks.

### 22.11.3	112. Track F: Causal Mechanism Discovery

Question:

Can the system infer hidden causal structure, choose interventions, and discriminate rival mechanisms?

### 22.11.4	113. Track G: Generative Optimization

Question:

Can the system iteratively propose, test, revise, and improve designs under constraints?

This draws from engineering-design benchmarks and AlphaEvolve-style algorithmic search.

## 22.12	Part XXX: Expanded Failure and Incident Taxonomy

### 22.12.1	114. New failure categories

Evaluation-awareness failure
Scheming/sandbagging suspicion
Provider drift failure
Ontology-linkage failure
Provenance failure
Attestation failure
Artifact-integrity failure
Dashboard-misleadingness failure
Language-policy failure
Overclaim publication failure
Challenge-process failure
Reproduction-bundle failure
Institutional-assurance failure
Semantic-layer failure
Trace-loss failure

### 22.12.2	115. Incident reports

Every serious failure gets an incident report:

Incident ID
Severity
Affected objects
Timeline
Root cause
Detection pathway
Immediate correction
Long-term repair
Verdict impact
Public notice

## 22.13	Part XXXI: Expanded Implementation Skeleton

### 22.13.1	116. Repository structure

pathtoagi/
  README.md
  CONSTITUTION.md
  CLAIMS_LADDER.md
  VERDICT_PROTOCOL.md
  LANGUAGE_POLICY.md
  FAILURE_TAXONOMY.md
  SECURITY_POLICY.md
  schemas/
    run.schema.json
    claim.schema.json
    evidence.schema.json
    challenge.schema.json
    correction.schema.json
    incident.schema.json
    capability_case.schema.json
    model_card.schema.json
    task_family.schema.json
  pathtoagi/
    cli.py
    config.py
    scheduler.py
    ledger.py
    ontology.py
    provenance.py
    timestamping.py
    publish.py
    budget.py
    observability.py
    providers/
      openai.py
      anthropic.py
      google.py
      local.py
    generators/
      linear_mod.py
      nonlinear_world.py
      causal_world.py
    graders/
      deterministic.py
      property_tests.py
      transfer.py
    audits/
      adversary.py
      humility.py
      scaffold.py
      contamination.py
      eval_awareness.py
    repair/
      diagnose.py
      strategies.py
      retest.py
  runs/
  ledger/
    record.jsonl
  public/
    index.html
    verdict.html
    status.html
    runs/
    api/
  scripts/
    stamp_run.sh
    verify_run.sh
    build_dashboard.sh
  tests/

### 22.13.2	117. Core schemas

22.13.2.1	Run object

{
  "run_id": "run_000184",
  "track": "frame_construction",
  "status": "candidate",
  "model": {
    "provider": "anthropic",
    "name": "claude-fable-5",
    "version": "unknown-api-snapshot"
  },
  "protocol_id": "proto_fc_001",
  "tools_allowed": false,
  "frame_family_disclosed": false,
  "timestamp_commitment": "...",
  "grade": {
    "passed_hidden": true,
    "transfer_passed": false,
    "evidence_level": 3,
    "verdict_impact": "none"
  }
}

22.13.2.2	Claim object

{
  "claim_id": "claim_000044",
  "text": "Model X demonstrated hidden-rule induction on world family Y.",
  "claim_type": "capability",
  "status": "candidate",
  "evidence_level": 3,
  "supporting_runs": ["run_000184"],
  "defeaters": ["no_transfer", "no_external_review"],
  "allowed_language": ["rule induction", "candidate evidence"],
  "forbidden_language": ["frame construction", "AGI", "verified"]
}

22.13.2.3	Incident object

{
  "incident_id": "inc_000012",
  "type": "dashboard_misleadingness_failure",
  "severity": "medium",
  "detected_by": "humility_agent",
  "summary": "A candidate run was displayed with language implying verification.",
  "correction_id": "corr_000019",
  "verdict_impact": "none"
}

### 22.13.3	118. First runnable prototype

The first runnable system should do exactly this and no more:

1. Generate a simple synthetic world.
2. Save hidden law and observations.
3. Hash protocol and hidden data.
4. Run one model.
5. Grade held-out predictions.
6. Classify evidence level.
7. Append record.jsonl.
8. Stamp the bundle.
9. Build static HTML.
10. Publish status.

If the frame family is disclosed, the system must automatically classify the result as Level 2 parameter identification and verdict impact none.

## 22.14	Part XXXII: Final v2.0 Synthesis

### 22.14.1	119. The full stack

ARC for adaptive induction.
METR for long-horizon autonomy.
Inspect for evaluation infrastructure.
HELM for transparency.
AILuminate/WMDP for hazard awareness.
Palantir for operational ontology.
Anthropic for constitutional governance.
DeepMind for scientific-discovery horizons.
OpenAI for model specification and third-party evaluation posture.
Meta/LeCun for world-model skepticism.
Bengio for non-agentic honest estimation.
Apollo for scheming and evaluation-awareness defense.
Epoch for frontier trend intelligence.
Temporal for durable execution.
SLSA/in-toto/Sigstore for software provenance.
C2PA for content provenance.
OECD/AIID for incident memory.
NIST and international reports for governance framing.
Formal methods for mechanical verification.
Causal discovery for mechanism inference.
High-reliability institutions for incident culture.
Forecasting communities for calibration.
Intelligence analysis for competing hypotheses.

### 22.14.2	120. The final category

pathtoAGI is not simply an AGI observatory.
It is the open evidence layer for frontier AI:
an autonomous epistemic operating system that transforms AI capability claims into auditable, timestamped, challengeable, reproducible evidence.

### 22.14.3	121. The final operating law

The system may run autonomously.
It may investigate relentlessly.
It may generate, test, critique, repair, and publish without daily human clicks.

But it may not crown itself.
It may not hide errors.
It may not overstate evidence.
It may not confuse tool use with frame construction.
It may not call candidate evidence verified.

No coronations without surviving evidence.

# 23	Expanded Research Basis

[S18] Palantir Platform Overview. https://palantir.com/docs/foundry/platform-overview/overview/. Describes Ontology integrating data, logic, and action components into an AI-accessible computing environment.

[S19] Palantir AIP Architecture Overview. https://palantir.com/docs/foundry/architecture-center/aip-architecture/. Describes AIP architecture and AIP Evals operating with Ontology.

[S20] Palantir AIP Features. https://palantir.com/docs/foundry/aip/aip-features/. Describes AIP Evals for test cases, criteria, debugging, iteration, model comparison, and variance.

[S21] Anthropic Claude’s Constitution. https://www.anthropic.com/constitution. Public description of Anthropic’s intentions for Claude’s values and behavior.

[S22] Anthropic Responsible Scaling Policy v3.0. https://www.anthropic.com/responsible-scaling-policy/rsp-v3-0. Anthropic’s framework for managing risks from increasingly capable models.

[S23] Dario Amodei, Machines of Loving Grace. https://darioamodei.com/essay/machines-of-loving-grace. Amodei’s essay on AI upside and risk.

[S24] Google DeepMind, Demis Hassabis and John Jumper awarded Nobel Prize in Chemistry. https://deepmind.google/blog/demis-hassabis-john-jumper-awarded-nobel-prize-in-chemistry/. DeepMind’s account of AlphaFold and the 2024 Nobel Prize in Chemistry.

[S25] Google DeepMind Frontier Safety Framework. https://deepmind.google/discover/blog/strengthening-our-frontier-safety-framework/. Capability thresholds and frontier-risk governance.

[S26] OpenAI Model Spec. https://model-spec.openai.com/. Public specification for desired model behavior.

[S27] OpenAI Preparedness Framework update. https://openai.com/index/updating-our-preparedness-framework/. OpenAI’s risk-management categories for frontier models.

[S28] OpenAI, A Shared Playbook for Trustworthy Third Party Evaluations. https://openai.com/index/trustworthy-third-party-evaluations-foundations/. Guidance on what evaluators should disclose about claims, systems, elicitation, and validity.

[S29] Inspect AI. https://inspect.aisi.org.uk/. UK AISI and Meridian Labs framework for frontier AI evaluations.

[S30] AISI, Announcing Inspect Evals. https://www.aisi.gov.uk/blog/inspect-evals. Describes Inspect Evals built on Inspect and broad community use.

[S31] CAIS, WMDP Benchmark. https://safe.ai/blog/wmdp-benchmark. Dataset for hazardous knowledge in biosecurity, cybersecurity, and chemical security.

[S32] Humanity’s Last Exam results. https://scale.com/blog/humanitys-last-exam-results. Expert-level benchmark across fields.

[S33] GAIA benchmark paper. https://arxiv.org/abs/2311.12983. General AI assistant benchmark requiring reasoning, multimodality, web browsing, and tool use.

[S34] Apollo Research, Stress Testing Deliberative Alignment for Anti-Scheming Training. https://www.apolloresearch.ai/science/stress-testing-deliberative-alignment-for-anti-scheming-training/. Scheming and evaluation-awareness stress tests.

[S35] OpenAI, Detecting and Reducing Scheming in AI Models. https://openai.com/index/detecting-and-reducing-scheming-in-ai-models/. OpenAI/Apollo work on scheming, evaluation awareness, and anti-scheming interventions.

[S36] SLSA. https://slsa.dev/. Supply-chain integrity framework.

[S37] C2PA. https://c2pa.org/. Open standard for content origin and edit history.

[S38] OECD, Towards a Common Reporting Framework for AI Incidents. https://www.oecd.org/en/publications/towards-a-common-reporting-framework-for-ai-incidents_f326d4ac-en.html. 29-criteria AI incident framework.

[S39] OECD AI Incident Database. https://oecd.ai/en/catalogue/tools/ai-incident-database. Open database for AI harms and near harms.

[S40] International AI Safety Report 2026. https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026. General-purpose AI capabilities, risks, and risk management.

[S41] Temporal. https://temporal.io/. Durable execution platform for reliable workflows.

[S42] Temporal GitHub. https://github.com/temporalio/temporal. Durable workflow execution with automatic intermittent-failure handling and retries.

[S43] OpenTimestamps. https://opentimestamps.org/. Timestamp proof that data existed before a point in time.

[S44] NIST AI RMF Core. https://airc.nist.gov/airmf-resources/airmf/5-sec-core/. Govern, Map, Measure, Manage.

[S45] ARC-AGI-3. https://arcprize.org/arc-agi/3. Interactive reasoning benchmark.

[S46] METR Time Horizons. https://metr.org/time-horizons/. Task-completion time horizons.

[S47] HELM. https://crfm.stanford.edu/helm/. Holistic evaluation of language models.

[S48] pathtoAGI Observatory homepage. https://pathtoagi-observatory.netlify.app/. Operating question and standing verdict.

[S49] pathtoAGI Governance. https://pathtoagi-observatory.netlify.app/governance/. Constitution, precedents, challenge process.

[S50] pathtoAGI Test page. https://pathtoagi-observatory.netlify.app/test/. Einstein Test, FCS probes, verdict gates.

[S51] pathtoAGI Evidence ledger. https://pathtoagi-observatory.netlify.app/evidence/. Evidence discipline and synthetic-world result.
