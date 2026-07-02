# Reveal — fcs-synth-world-001

Attempts were committed and anchored BEFORE this reveal (see git history and
timestamps/manifest.json). Anyone can now verify the seal and regrade:

- decryption key (AES-256-CBC, IV = first 16 bytes of law.enc): `c0f72fa22bc2faf4967d8f45eed4b8df377e85119a834c7a900ed4501807434d`
- verify: sha256(decrypt(law.enc)) = `2643ba0c82590edea495bb394f9d7073af8fbc1a4170f96f7071769ced8f4ac5` (matches SEAL.md)
- the law: modulus 97; x'=78x+71y, y'=67y+83z, z'=4z+29x (all mod 97); conserved Q=6x+20y+61z (mod 97)
- grading is mechanical: scripts/fcs-synth/grade-world.mjs · results in GRADING.json
