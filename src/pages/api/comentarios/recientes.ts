/** GET /api/comentarios/recientes con «Authorization: Bearer ADMIN_TOKEN» → últimos 100, para moderar. */
import type { APIRoute } from 'astro';
import { esAdmin, json } from '@/lib/api';
import { comentariosRecientes } from '@/lib/reacciones-db';
export const prerender = false;
export const GET: APIRoute = ({ request }) => (esAdmin(request) ? json(comentariosRecientes()) : json({ error: 'no autorizado' }, 401));
