/**
 * POST /api/comentario { articulo, parrafo, nombre, texto, sitio } → publica un comentario.
 * Antispam: campo trampa «sitio», 6 comentarios por IP cada 10 min, máximo 2 enlaces y sin repetidos en 24 h.
 */
import type { APIRoute } from 'astro';
import { ID, PARRAFO, cuerpo, ipDe, json, limpiar, permitido } from '@/lib/api';
import { comentar, esRepetido } from '@/lib/reacciones-db';
export const prerender = false;
export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const b = await cuerpo(request);
    // Trampa: si un bot llenó el campo oculto, cree que publicó y no se guarda nada
    if (b.sitio) return json({ id: 0, parrafo: b.parrafo, nombre: 'ok', texto: '', creado: new Date().toISOString() }, 201);
    const nombre = limpiar(b.nombre, 60);
    const texto = limpiar(b.texto, 800);
    if (!ID.test(b.articulo ?? '') || !PARRAFO.test(b.parrafo ?? '') || nombre.length < 2 || texto.length < 2) return json({ error: 'datos inválidos' }, 400);
    if ((texto.match(/https?:\/\//g) ?? []).length > 2) return json({ error: 'demasiados enlaces' }, 400);
    const ip = ipDe(request, clientAddress);
    if (!permitido(`com:${ip}`, 6, 10 * 60_000)) return json({ error: 'demasiadas solicitudes' }, 429);
    if (esRepetido(b.articulo, texto)) return json({ error: 'comentario repetido' }, 409);
    const c = comentar(b.articulo, b.parrafo, nombre, texto, limpiar(b.visitante, 64), ip);
    console.log(`comentario ${c.id} en ${b.articulo}/${b.parrafo} de «${nombre}»`);
    return json(c, 201);
  } catch (e: any) {
    return json({ error: e.status ? e.message : 'error interno' }, e.status ?? 500);
  }
};
