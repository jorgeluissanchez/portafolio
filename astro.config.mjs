// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import { execSync } from 'node:child_process';

// Fecha real del último cambio (Google solo usa <lastmod> si es confiable): último commit que tocó src/ o public/.
const lastmod = (() => {
  try {
    const git = (args) => execSync(`git log -1 --format=%cI ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    // Dokploy clona con --depth 1: si el filtro por carpetas no encuentra nada, usa la fecha del último commit.
    return process.env.LASTMOD || git('-- src public') || git('') || undefined;
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
  // Las páginas se generan estáticas (las sirve Nginx); solo las rutas /api (me gusta y comentarios) corren en el
  // servidor de Node con node:sqlite. Ver Dockerfile y src/lib/reacciones-db.ts.
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'never',
  compressHTML: true,
  integrations: [
    sitemap({
      // La 404 no va al sitemap; el resto lleva lastmod (sin priority/changefreq: Google los ignora).
      filter: (page) => !page.includes('/404') && !page.includes('/api/'),
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
