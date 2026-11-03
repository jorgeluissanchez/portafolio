/** Utilidades de las rutas /api: respuestas JSON, validación, límite por IP y acceso de administrador. */
export const json = (datos: unknown, status = 200) =>
  new Response(JSON.stringify(datos), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export const ID = /^[a-z0-9-]{1,120}$/;
export const PARRAFO = /^p\d{1,3}(-[a-z0-9-]{0,56})?$/;
export const limpiar = (s: unknown, max: number) =>
  String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

/** Ventana deslizante en memoria (se reinicia con el contenedor; suficiente para un blog). */
const ventanas = new Map<string, number[]>();
export function permitido(clave: string, max: number, ms: number) {
  const ahora = Date.now();
  const lista = (ventanas.get(clave) ?? []).filter((t) => ahora - t < ms);
  if (lista.length >= max) return false;
  lista.push(ahora);
  ventanas.set(clave, lista);
  if (ventanas.size > 5000) ventanas.clear();
  return true;
}

export const ipDe = (req: Request, clientAddress?: string) =>
  (req.headers.get('x-forwarded-for') ?? clientAddress ?? '').split(',')[0].trim();

export const esAdmin = (req: Request) => {
  const token = process.env.ADMIN_TOKEN;
  return !!token && req.headers.get('authorization') === `Bearer ${token}`;
};

export async function cuerpo(req: Request): Promise<Record<string, any>> {
  const texto = await req.text();
  if (texto.length > 8000) throw Object.assign(new Error('demasiado grande'), { status: 413 });
  try {
    return JSON.parse(texto || '{}');
  } catch {
    throw Object.assign(new Error('JSON inválido'), { status: 400 });
  }
}
