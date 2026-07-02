# Seal — fcs-synth-world-001

- law sha256: `2643ba0c82590edea495bb394f9d7073af8fbc1a4170f96f7071769ced8f4ac5`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository by the operator
- protocol: attempts are timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) equals the hash above, then grade attempts on held-out predictions + law identification.
- generated: 2026-07-02T10:35:12.277Z by scripts/fcs-synth/generate-world.mjs (the law family is public in that script; the drawn parameters are the secret).
