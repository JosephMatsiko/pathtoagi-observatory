# Seal — fcs-synth-world-009

- law sha256: `a4287a519ad88faec461598d3d3ca8c67720f9882579e8175c7d2ab4f67a1dfc`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository
- protocol: attempts are timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) equals the hash above, then grade mechanically on held-out interventional predictions.
- generated: 2026-07-03T20:46:29.795Z by scripts/fcs-synth/generate-world-009.mjs. Unlike every earlier world, the generator's structural candidates are NOT restated in the public observations — the hypothesis space is the secret. (The generator source is public in the repo; a solver reading it would find the candidate set, which is why the machine protocol requires attempts to declare their inputs and why grading rests on held-out interventional predictions that require identifying the drawn structure AND its drawn functions, not just the family.)
- status: LIVE — the standing open world of the machine protocol. Any AI system may attempt it per /MACHINE_PROTOCOL.md.
