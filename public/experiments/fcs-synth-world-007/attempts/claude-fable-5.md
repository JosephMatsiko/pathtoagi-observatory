# Attempt — Claude Fable 5 (fresh agent instance) · world-007 · 2026-07-03 · POST-REVEAL REPLICATION

Protocol: public/runs/fcs-world-007-2026-07-03/.

PROVENANCE — READ FIRST: this attempt was made AFTER the world-007 key was
publicly revealed (REVEAL.md was published 2026-07-03, before this attempt
ran). It therefore cannot claim the attempt-anchored-before-reveal gate (OG-3)
and is recorded as a same-family replication data point, not a sealed-world
result. Isolation was still real: a genuinely fresh claude-fable-5 agent
instance with no tool access of any kind (no file reads, no code execution,
no search — it could not have read the reveal), given only the pasted public
observations. Its purpose: the graded Claude result on this world came from
Sonnet 5 (fable-5 was usage-capped at attempt time); this replication tests
whether that result is Sonnet-specific. Full raw output preserved in
`claude-fable-5-raw.txt`.

===ATTEMPT-BEGIN===
{
  "worldId": "world-007",
  "attemptedAt": "2026-07-03T17:35:00Z",
  "mind": "Claude Fable 5 (fresh agent instance, no tools)",
  "attemptClass": "model-post-reveal-replication",
  "toolUse": { "codeUsed": false, "externalToolsUsed": false },
  "primary": {
    "frame": "Two coupled linear integer maps (x, y) mod 101; w is a causally inert decoy clock, disconnected in both directions.",
    "law": "x' = 47x + 87y (mod 101); y' = 44x + 5y (mod 101); w' = w + 39 (mod 101)",
    "modulus": 101,
    "decoyIdentified": true,
    "decoyReasoning": "Solved the 2x2 affine system from consecutive transitions (offsets solved to exactly 0), computed A^3 for the 3-step gaps, and verified all 36 held-out transitions across four trajectories with zero residuals. Exact (x,y) prediction across transitions where w takes many different values rules out any nonzero w coefficient mod 101; w's own update uses only w.",
    "predictions": {
      "t0_s4": [90, 53, 13], "t0_s5": [54, 84, 52], "t0_s7": [24, 77, 29], "t0_s8": [50, 27, 68],
      "t0_s10": [0, 69, 45], "t0_s11": [44, 42, 84], "t0_s13": [25, 100, 61], "t0_s14": [78, 85, 100],
      "t0_s16": [57, 60, 77], "t0_s17": [21, 81, 15], "t0_s19": [38, 76, 93], "t0_s20": [15, 32, 31],
      "t0_s22": [94, 56, 8], "t0_s23": [99, 73, 47], "t0_s25": [28, 54, 24], "t0_s26": [55, 88, 63],
      "t0_s28": [18, 1, 40], "t0_s29": [24, 90, 79],

      "t1_s4": [17, 91, 21], "t1_s5": [30, 92, 60], "t1_s7": [4, 27, 37], "t1_s8": [12, 8, 76],
      "t1_s10": [61, 3, 53], "t1_s11": [98, 73, 92], "t1_s13": [51, 89, 69], "t1_s14": [40, 63, 7],
      "t1_s16": [80, 50, 85], "t1_s17": [30, 33, 23], "t1_s19": [31, 51, 0], "t1_s20": [36, 3, 39],
      "t1_s22": [18, 98, 16], "t1_s23": [80, 70, 55], "t1_s25": [23, 68, 32], "t1_s26": [28, 39, 71],
      "t1_s28": [52, 9, 48], "t1_s29": [96, 10, 87],

      "t2_s4": [49, 0, 41], "t2_s5": [81, 35, 80], "t2_s7": [28, 13, 57], "t2_s8": [23, 85, 96],
      "t2_s10": [9, 66, 73], "t2_s11": [4, 19, 11], "t2_s13": [14, 44, 89], "t2_s14": [42, 28, 27],
      "t2_s16": [62, 61, 4], "t2_s17": [40, 3, 43], "t2_s19": [27, 59, 20], "t2_s20": [39, 69, 59],
      "t2_s22": [78, 74, 36], "t2_s23": [4, 65, 75], "t2_s25": [58, 27, 52], "t2_s26": [25, 61, 91],
      "t2_s28": [63, 40, 68], "t2_s29": [78, 43, 6],

      "t3_s4": [66, 48, 63], "t3_s5": [6, 13, 1], "t3_s7": [94, 86, 79], "t3_s8": [83, 21, 17],
      "t3_s10": [74, 36, 95], "t3_s11": [45, 2, 33], "t3_s13": [34, 71, 10], "t3_s14": [99, 33, 49],
      "t3_s16": [60, 60, 26], "t3_s17": [61, 11, 65], "t3_s19": [83, 50, 42], "t3_s20": [70, 64, 81],
      "t3_s22": [76, 25, 58], "t3_s23": [91, 35, 97], "t3_s25": [0, 67, 74], "t3_s26": [72, 32, 12],
      "t3_s28": [96, 81, 90], "t3_s29": [45, 84, 28]
    }
  }
}
===ATTEMPT-END===
