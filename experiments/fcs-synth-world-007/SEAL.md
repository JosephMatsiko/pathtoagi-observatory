# Seal — fcs-synth-world-007

- law sha256: `7f739ee811eae15bf4cac82509f5257ee25c526d4883b04f4c5ec6d9108e4475`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository by the operator
- protocol: attempts are timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) equals the hash above, then grade attempts on held-out predictions + causal-structure identification.
- generated: 2026-07-03T03:38:52.360Z by scripts/fcs-synth/generate-world-007.mjs (the law family is public in that script; the drawn parameters are the secret).
- design note: this world's trap is a decoy dimension (w), not a wrong-frame attractor on the same variables as world-003. It targets a distinct failure mode: folding a causally inert, superficially regular variable into an explanatory law because it was sampled alongside the causal ones.
