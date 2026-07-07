# Seal — fcs-synth-world-013

- law sha256: `7b71d6165568ef898cc2e20ce5042ef442d0b9759c0f2fcd276df4b4e8b3ace3`  (plaintext = {generator source, law.json} — the generator MIND's own conception; the evaluator encrypted it without reading it)
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository
- protocol: attempts anchored BEFORE the key is published; on reveal verify sha256, then grade held-out interventional predictions mechanically.
- design: ADVERSARIALLY GENERATED (Evaluator's Ceiling escape hatch, claim-003). The law family was conceived by a generator mind (GPT-5.5), not by the evaluator; the generator is excluded as a solver; the instrument's only role is mechanical refereeing. Blind consistency checks passed at seal time: {"probeCount":true,"orderMatch":true,"aftersValid":true,"varsConsistent":true}.
- status: LIVE — attempt per /MACHINE_PROTOCOL.md. Window closes 2026-07-27 (pre-registered).
