// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// The Observatory is a static, inspectable record. Astro for the content spine,
// React islands only where the surface is genuinely interactive.
export default defineConfig({
  site: 'https://observatory.example',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
