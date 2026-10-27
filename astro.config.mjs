// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';

// Fecha real del último cambio (Google solo usa <lastmod> si es confiable): último commit que tocó src/ o public/.
const lastmod = (() => {
  try {
    return execSync('git log -1 --format=%cI -- src public', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || undefined;
  } catch {
    return undefined;
  }
})();

// URL pública del portafolio (canonical, Open Graph y sitemap).
const SITE = process.env.SITE_URL ?? 'https://jorgesanchez.engineer';
const font = (name, cssVariable, fallbacks, variants) => ({
  provider: fontProviders.local(),
  name,
  cssVariable,
  fallbacks,
  options: { variants: variants.map(([file, weight, style = 'normal']) => ({ src: [`./src/assets/fonts/${file}`], weight, style })) },
});

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  compressHTML: true,
  integrations: [
    sitemap({
      // La 404 no va al sitemap; el resto lleva lastmod (sin priority/changefreq: Google los ignora).
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, lastmod: lastmod ?? new Date().toISOString() }),
    }),
  ],
  image: { layout: 'constrained', responsiveStyles: true },
  // Fuentes del diseño en Figma, auto-alojadas (subconjunto latín: tildes, ñ, ¿ y ¡).
  fonts: [
    font('Anton', '--font-anton', ['Impact', 'sans-serif'], [['anton-latin-400-normal.woff2', 400]]),
    font('Instrument Serif', '--font-instrument', ['Georgia', 'serif'], [
      ['instrument-serif-latin-400-normal.woff2', 400],
      ['instrument-serif-latin-400-italic.woff2', 400, 'italic'],
    ]),
    font('Space Grotesk', '--font-grotesk', ['system-ui', 'sans-serif'], [
      ['space-grotesk-latin-400-normal.woff2', 400],
      ['space-grotesk-latin-500-normal.woff2', 500],
    ]),
    font('Mrs Saint Delafield', '--font-mrs', ['cursive'], [['mrs-saint-delafield-latin-400-normal.woff2', 400]]),
  ],
  build: { inlineStylesheets: 'auto' },
  prefetch: true,
});
