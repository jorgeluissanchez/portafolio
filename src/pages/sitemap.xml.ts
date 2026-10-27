import type { APIRoute } from 'astro';

/**
 * El sitio anterior publicaba el sitemap en /sitemap.xml (y así está en Search Console y en robots de copias viejas).
 * Esta ruta lo mantiene vivo apuntando al índice que genera @astrojs/sitemap.
 */
export const GET: APIRoute = ({ site }) => {
  const host = new URL(site!).origin;
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${host}/sitemap-0.xml</loc></sitemap></sitemapindex>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
