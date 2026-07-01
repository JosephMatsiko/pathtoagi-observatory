---
id: architectural-gap
title: Architectural gaps remain
accent: hsl(28 92% 60%)
health: 0.65
updated: 2026-06-30
---

## The strongest version

Current transformer-based systems are missing organs. The strong version is not "transformers will plateau." It is the specific claim that at least three architectural primitives — native long-term memory, learnable world models, and continual learning — are absent from current frontier systems, that the absences are not quantitative engineering problems, and that closing them requires structural changes that pretraining-plus-RL pipelines do not produce as side effects.

## Who holds it

Demis Hassabis is the most public defender: the "75% of the way to AGI" claim is interesting for what it puts in the remaining 25% — not more compute, but components not yet built and integrated. Yann LeCun's JEPA family is the academic exemplar, motivated by the claim that autoregressive next-token prediction cannot produce systems that learn the way humans and animals do.

## The load-bearing assumption

That the missing pieces are *structural* — that no amount of scaling the current substrate produces persistent memory or a grounded world model as an emergent property.

## Falsifiers

A frontier system that demonstrates durable, updatable memory and causal world-modeling **without** a bolted-on external component — as a genuine property of the trained network — would move health sharply down. So far, the gains have come from scaffolding, not from the substrate growing the organ.
