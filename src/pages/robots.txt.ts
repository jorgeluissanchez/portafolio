import type { APIRoute } from 'astro';

/** robots.txt: todo abierto (también para los buscadores con IA, que citan el portafolio) y el sitemap. */
export const GET: APIRoute = ({ site }) => {
  const host = new URL(site!).origin;
  return new Response(
    `# Jorge Sánchez — ${host}

User-agent: *
Allow: /

# Rastreadores de IA (ChatGPT, Claude, Perplexity, Gemini): pueden leer y citar el portafolio
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: Google-Extended
Allow: /

Sitemap: ${host}/sitemap-index.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
