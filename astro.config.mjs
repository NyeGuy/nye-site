import { defineConfig } from 'astro/config';

// Project Pages: https://nyeguy.github.io/nye-site/
// For a user site (nyeguy.github.io), set site to that URL and drop `base`.
export default defineConfig({
  site: 'https://nyeguy.github.io',
  base: '/nye-site',
  output: 'static',
  trailingSlash: 'always',
});
