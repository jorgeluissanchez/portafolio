/** GET /api/reacciones?articulo=slug&visitante=uuid → { likes, comentarios, misLikes } */
import type { APIRoute } from 'astro';
import { ID, json, limpiar } from '@/lib/api';
import { reacciones } from '@/lib/reacciones-db';
export const prerender = false;
export const GET: APIRoute = ({ url }) => {
  const articulo = url.searchParams.get('articulo') ?? '';
  if (!ID.test(articulo)) return json({ error: 'artículo inválido' }, 400);
  return json(reacciones(articulo, limpiar(url.searchParams.get('visitante'), 64)));
};
