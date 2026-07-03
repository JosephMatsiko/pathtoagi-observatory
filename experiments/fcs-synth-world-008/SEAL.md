# Seal — fcs-synth-world-008

- law sha256: `fc5e76ae2b375cd05eff83cfe521106165816b50e2e5f409dec4c9068d9daf49`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository by the operator
- protocol: attempts are timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) equals the hash above, then grade attempts mechanically.
- generated: 2026-07-03T17:03:29.457Z by scripts/fcs-synth/generate-world-008.mjs (the law family and the observational-equivalence construction are public in that script; the drawn parameters and the true mechanism are the secret).
- design note: the record's first Track F probe. The graded skill is not curve-fitting but causal reasoning: recognizing that observation cannot decide between rival mechanisms, choosing the intervention that can, and deriving each mechanism's distinct prediction under that intervention.
