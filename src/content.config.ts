import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Theory long-form bodies. The one-line summary + health live in
// src/data/theories.ts (the index strip); the collection holds the argument.
const theories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/theories' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    accent: z.string(),
    health: z.number().min(0).max(1),
    // YAML parses unquoted ISO dates to Date; coerce and normalize to YYYY-MM-DD.
    updated: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)),
  }),
});

export const collections = { theories };
