# Seal — fcs-synth-world-011

- law sha256: `5bc72ff216fd6f23bd472b553ab547a70fb5d694150c95f597e8cb0b9e541b43`
- sealed: law.enc (AES-256-CBC; IV prepended); key held off-repository
- protocol: attempts anchored BEFORE the key is published; on reveal verify sha256(decrypt(law.enc)) equals the hash above, then grade held-out interventional predictions mechanically.
- generated: 2026-07-07T17:49:53.879Z by scripts/fcs-synth/generate-world-011.mjs.
- design: replication of the latent-object class (world-010), fresh parameters and modulus, varied observed edge. n=1 is the standing objection; this seal exists to answer it.
- status: LIVE — attempt per /MACHINE_PROTOCOL.md. Window closes 2026-07-20 (pre-registered).
