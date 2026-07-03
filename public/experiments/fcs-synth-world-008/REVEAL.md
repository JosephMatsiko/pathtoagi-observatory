# Reveal — fcs-synth-world-008

Attempts must be committed and timestamp-anchored before this file is published.

- key (AES-256-CBC, IV = first 16 bytes of law.enc): `b5005e3899f83b930468204c80abd0ac548b9013a9f8a5c9863b8a97ae79a957`
- sha256(decrypt(law.enc)) = `fc5e76ae2b375cd05eff83cfe521106165816b50e2e5f409dec4c9068d9daf49` (matches SEAL.md)
- true mechanism: fork
- f: b = 41·a + 50 (mod 103)
- g: g(x) = 24·x + 77 (mod 103)  — chain: c = g(b); fork: c = g(f(a))
- identifiability: NOT identifiable from the observational samples: every shown (a,b,c) satisfies both mechanisms exactly. Only an intervention on b discriminates: under chain c follows the intervened b; under fork c ignores it.

The reveal establishes grading truth. It does not by itself move the public verdict.
