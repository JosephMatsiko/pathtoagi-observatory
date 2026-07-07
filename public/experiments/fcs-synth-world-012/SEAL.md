# Seal — fcs-synth-world-012

- law sha256: `718769697320a1709d83174e09a2bebd909a2a94a328af58e43c73e96a97b300`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository
- protocol: attempts anchored BEFORE the key is published; on reveal verify sha256(decrypt(law.enc)) equals the hash above, then grade held-out interventional predictions mechanically.
- generated: 2026-07-07T17:49:53.909Z by scripts/fcs-synth/generate-world-012.mjs.
- design: replication of the wrong-frame-attractor failure mode (world-003, the record's first evidence-against, n=1) in the modern interventional format. The tell is in the shown data, in plain sight.
- status: LIVE — attempt per /MACHINE_PROTOCOL.md. Window closes 2026-07-23 (pre-registered).
