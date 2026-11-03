/** DELETE /api/comentario/:id con «Authorization: Bearer ADMIN_TOKEN» → borra un comentario (moderación). */
import type { APIRoute } from 'astro';
import { esAdmin, json } from '@/lib/api';
import { borrarComentario } from '@/lib/reacciones-db';
export const prerender = false;
export const DELETE: APIRoute = ({ request, params }) => {
  if (!esAdmin(request)) return json({ error: 'no autorizado' }, 401);
  borrarComentario(Number(params.id));
  return json({ ok: true });
};
