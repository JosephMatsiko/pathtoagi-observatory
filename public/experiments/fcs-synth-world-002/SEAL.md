# Seal — fcs-synth-world-002 (hardened, v0.4)

- law sha256: `98bb0924b2f04e37122e0c82100c3ed7a829c97c0810c8b36c20563ad1c49320`
- ablations vs world-001: frame family WITHHELD from the solver; dynamics NONLINEAR (quadratic) so a linear fit fails.
- sealed: law.enc (AES-256-CBC, IV prepended); key held off-repository.
- protocol: attempts timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) == the hash above; grade on held-out prediction accuracy (scripts/fcs-synth/grade-world-002.mjs).
- generated 2026-07-02T15:44:01.451Z.
