/** POST /api/like { articulo, parrafo, visitante } → pone o quita el me gusta y devuelve el total. */
import type { APIRoute } from 'astro';
import { ID, PARRAFO, cuerpo, ipDe, json, limpiar, permitido } from '@/lib/api';
import { alternarLike } from '@/lib/reacciones-db';
export const prerender = false;
export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const { articulo, parrafo, visitante } = await cuerpo(request);
    const v = limpiar(visitante, 64);
    if (!ID.test(articulo ?? '') || !PARRAFO.test(parrafo ?? '') || v.length < 8) return json({ error: 'datos inválidos' }, 400);
    if (!permitido(`like:${ipDe(request, clientAddress)}`, 120, 10 * 60_000)) return json({ error: 'demasiadas solicitudes' }, 429);
    return json(alternarLike(articulo, parrafo, v));
  } catch (e: any) {
    return json({ error: e.status ? e.message : 'error interno' }, e.status ?? 500);
  }
};
