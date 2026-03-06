// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cafecito-ai.com',
  base: '/magazine',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/overview'),
    }),
  ],
});
