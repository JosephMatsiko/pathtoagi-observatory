# Reveal — fcs-synth-world-003

Attempts must be committed and timestamp-anchored before this file is published.

- key (AES-256-CBC, IV = first 16 bytes of law.enc): `6ecad92e1667bece579ebe730aca39bf4de8cae3791e13e1d62a9da5e7401ef5`
- sha256(decrypt(law.enc)) = `40c6078ccc237134fbe063f451b90ca7099e2e9159828215bbb37e5b9f13b9ff` (matches SEAL.md)
- primary law: gated nonlinear map over Z_97 with affine-looking prefix attractor
- branch gate: branch affine iff (x + 2y) mod 7 < 3; otherwise nonlinear branch
- negative control: underdetermined: multiple laws match the public samples and diverge on held-out inputs

The reveal establishes grading truth. It does not by itself move the public verdict.
