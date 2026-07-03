# Seal — fcs-synth-world-003 (Omnibus tranche-2)

- world id: `world-003`
- law sha256: `40c6078ccc237134fbe063f451b90ca7099e2e9159828215bbb37e5b9f13b9ff`
- controls: W3 wrong-frame attractor; W6 underdetermined negative control; code-ablated solver protocol; human baseline and independent-scoring hooks required before verdict impact.
- sealed: law.enc (AES-256-CBC, IV prepended); key held off-repository.
- protocol: attempts timestamp-anchored BEFORE the key is published; on reveal, verify sha256(decrypt(law.enc)) == the hash above; grade with scripts/fcs-synth/grade-world-003.mjs.
- generated 2026-07-02T21:01:08.321Z.
