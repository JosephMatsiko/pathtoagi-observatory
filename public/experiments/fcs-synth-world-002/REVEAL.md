# Reveal — fcs-synth-world-002 (hardened, v0.4)

Attempts were committed and anchored BEFORE this reveal (git history + timestamps/manifest.json).

- key (AES-256-CBC, IV = first 16 bytes of law.enc): `400bbff2383005e1eac249f3ac3f08a7ae800a0a25f34c08c39dffe3b8abceba`
- sha256(decrypt(law.enc)) = `98bb0924b2f04e37122e0c82100c3ed7a829c97c0810c8b36c20563ad1c49320` (matches SEAL.md)
- the law (mod 101), on basis {1, x, y, x^2, xy, y^2}:
  - x' = 12 + 29x + 21y + 56x^2 + 94xy + 78y^2
  - y' = 10 + 84x + 20y + 66x^2 + 92xy + 66y^2
- frame family was WITHHELD from solvers; grading is held-out prediction accuracy (scripts/fcs-synth/grade-world-002.mjs).
