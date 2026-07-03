# Prompt — fcs-world-007-2026-07-03

You are being given sparse observations from a sealed synthetic world you have never seen before. Do NOT write or execute any code — this is a code-ablated protocol; reason by hand only, in text.

The public observations are three integer state variables (x, y, w) sampled together at irregular steps across four trajectories, modulo some unknown prime. See `experiments/fcs-synth-world-007/observations.json`.

Task:
1. State your best hypothesis for the update law governing each variable.
2. State explicitly whether you believe all three variables are causally connected, or whether any variable is causally independent of the others.
3. Predict the exact state (x, y, w) at every step not shown in the samples, for each of the four trajectories, up to step 30.
4. State your confidence and what evidence would change your mind.
