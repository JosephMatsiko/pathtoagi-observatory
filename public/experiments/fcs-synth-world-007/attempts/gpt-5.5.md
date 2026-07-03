# Attempt — GPT-5.5 (codex; code-ablated by prompt instruction) · world-007 · 2026-07-03

Protocol: public/runs/fcs-world-007-2026-07-03/ (this session's registration).

Provenance note: reasoned by inspection from the provided samples only; instructed not to write or execute code, use a calculator, search, or any external tool. Run via `codex exec -m gpt-5.5` in an isolated scratch directory containing only `observations.json` — no access to the generator script or sealed law. Full raw model output preserved verbatim in `gpt-5.5-raw.txt` (lines 472-568); transcribed exactly from that file after an earlier hand-transcription error in this attempt record was caught and corrected before grading.

===ATTEMPT-BEGIN===
{
  "worldId": "world-007",
  "attemptedAt": "2026-07-03T03:45:00Z",
  "mind": "GPT-5.5 (codex)",
  "attemptClass": "model",
  "toolUse": { "codeUsed": false, "externalToolsUsed": false },
  "primary": {
    "frame": "Two coupled linear integer maps (x, y) mod 101; w is an independent arithmetic clock, causally disconnected from x and y.",
    "law": "x' = 47x + 87y (mod 101); y' = 44x + 84y (mod 101); w' = w + 39 (mod 101)",
    "modulus": 101,
    "decoyIdentified": true,
    "decoyReasoning": "w advances by a constant +39 (mod 101) stride every step and never appears in the transitions that explain x or y; the (x,y) pair alone reproduces every observed sample.",
    "predictions": {
      "t0_s4": [51, 37, 13], "t0_s5": [21, 85, 52], "t0_s7": [29, 48, 29], "t0_s8": [1, 64, 68],
      "t0_s10": [50, 36, 45], "t0_s11": [21, 61, 84], "t0_s13": [23, 71, 61], "t0_s14": [48, 35, 100],
      "t0_s16": [7, 35, 77], "t0_s17": [18, 66, 15], "t0_s19": [14, 36, 93], "t0_s20": [56, 78, 31],
      "t0_s22": [77, 34, 8], "t0_s23": [58, 27, 47], "t0_s25": [53, 83, 24], "t0_s26": [51, 74, 63],
      "t0_s28": [36, 53, 40], "t0_s29": [88, 58, 79],

      "t1_s4": [46, 94, 21], "t1_s5": [43, 69, 60], "t1_s7": [1, 14, 37], "t1_s8": [53, 33, 76],
      "t1_s10": [76, 49, 53], "t1_s11": [58, 72, 92], "t1_s13": [12, 41, 69], "t1_s14": [12, 2, 7],
      "t1_s16": [38, 85, 85], "t1_s17": [45, 58, 23], "t1_s19": [15, 20, 0], "t1_s20": [21, 66, 39],
      "t1_s22": [43, 69, 16], "t1_s23": [21, 63, 55], "t1_s25": [80, 73, 32], "t1_s26": [2, 21, 71],
      "t1_s28": [20, 94, 48], "t1_s29": [34, 69, 87],

      "t2_s4": [4, 12, 41], "t2_s5": [20, 85, 80], "t2_s7": [91, 67, 57], "t2_s8": [20, 42, 96],
      "t2_s10": [31, 87, 73], "t2_s11": [17, 6, 11], "t2_s13": [27, 88, 89], "t2_s14": [5, 55, 27],
      "t2_s16": [25, 17, 4], "t2_s17": [29, 18, 43], "t2_s19": [68, 11, 20], "t2_s20": [12, 11, 59],
      "t2_s22": [89, 35, 36], "t2_s23": [47, 40, 75], "t2_s25": [78, 94, 52], "t2_s26": [26, 13, 91],
      "t2_s28": [2, 8, 68], "t2_s29": [90, 96, 6],

      "t3_s4": [55, 14, 63], "t3_s5": [66, 99, 1], "t3_s7": [45, 73, 79], "t3_s8": [87, 3, 17],
      "t3_s10": [47, 66, 95], "t3_s11": [74, 89, 33], "t3_s13": [97, 80, 10], "t3_s14": [16, 76, 49],
      "t3_s16": [27, 38, 26], "t3_s17": [40, 33, 65], "t3_s19": [7, 60, 42], "t3_s20": [77, 13, 81],
      "t3_s22": [42, 49, 58], "t3_s23": [67, 9, 97], "t3_s25": [73, 7, 74], "t3_s26": [18, 38, 12],
      "t3_s28": [13, 69, 90], "t3_s29": [2, 19, 28]
    }
  }
}
===ATTEMPT-END===
