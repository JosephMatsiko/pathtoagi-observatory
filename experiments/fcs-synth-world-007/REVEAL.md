# Reveal — fcs-synth-world-007

Attempts must be committed and timestamp-anchored before this file is published.

- key (AES-256-CBC, IV = first 16 bytes of law.enc): `811fa444e67460035fa16243de7fd3ee14ed256376fcc404dd65c2c00976edd6`
- sha256(decrypt(law.enc)) = `7f739ee811eae15bf4cac82509f5257ee25c526d4883b04f4c5ec6d9108e4475` (matches SEAL.md)
- true update: x' = 47x + 87y (mod 101); y' = 5y + 44x (mod 101); w' = w + 39 (mod 101) — w is NOT a function of x or y and does not feed back into them
- trap: w advances by a constant stride every step, so it looks exactly as lawful as x and y, and its value is correlated with step count the same way any clock variable would be. A model that includes w as an input to the update rule for x or y is fitting a decoy; the correct frame states x,y update from (x,y) alone and w is an independent, causally inert clock.

The reveal establishes grading truth. It does not by itself move the public verdict.
