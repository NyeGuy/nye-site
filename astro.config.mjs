import { defineConfig } from 'astro/config';

// GitHub project Pages keeps /nye-site/. A Vercel build (VERCEL=1) is served at /.
const onVercel = process.env.VERCEL === '1';
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export default defineConfig({
  site: onVercel && vercelHost ? `https://${vercelHost}` : 'https://nyeguy.github.io',
  base: onVercel ? '/' : '/nye-site',
  output: 'static',
  trailingSlash: 'always',
  // Lets a public preview host reach `astro preview`. Does not change the Pages build.
  server: {
    allowedHosts: true,
  },
});
