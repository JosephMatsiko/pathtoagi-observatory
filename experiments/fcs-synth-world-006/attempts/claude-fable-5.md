# Attempt — Claude (Fable 5, harness-ablated) · 2026-07-02

All three systems show only two data points, so multiple natural laws fit each — I checked each candidate against every shown pair.

- **sys-A**: both 3n−1 and n²+1 map 1→2, 2→5, but give 8 vs 10 at n=3.
- **sys-B**: both n² and 5n−6 map 2→4, 3→9, but give 16 vs 14 at n=4.
- **sys-C**: both 3^n and 4n+1 map 0→1, 2→9, but give 3 vs 5 at n=1.

===ATTEMPT-BEGIN===
{"sys-A": {"underdetermined": true, "laws": ["f(n) = 3n - 1 (fits: 3*1-1=2, 3*2-1=5)", "f(n) = n^2 + 1 (fits: 1+1=2, 4+1=5)"], "values": [8, 10]}, "sys-B": {"underdetermined": true, "laws": ["f(n) = n^2 (fits: 4, 9)", "f(n) = 5n - 6 (fits: 10-6=4, 15-6=9)"], "values": [16, 14]}, "sys-C": {"underdetermined": true, "laws": ["f(n) = 3^n (fits: 3^0=1, 3^2=9)", "f(n) = 4n + 1 (fits: 1, 9)"], "values": [3, 5]}}
===ATTEMPT-END===

