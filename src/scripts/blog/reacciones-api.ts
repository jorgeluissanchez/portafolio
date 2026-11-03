/**
 * Cliente de reacciones (me gusta y comentarios por párrafo).
 *
 * Habla con el servicio `/api` (carpeta `api/` del repo, desplegado aparte en Dokploy). Si el servicio no responde,
 * los me gusta se guardan solo en este navegador y los comentarios quedan desactivados con un aviso: la lectura
 * nunca se rompe por culpa de la API.
 */
export type Comentario = { id: number; parrafo: string; nombre: string; texto: string; creado: string };
export type Estado = {
  likes: Record<string, number>;
  comentarios: Record<string, Comentario[]>;
  misLikes: string[];
  enLinea: boolean;
};

const API = '/api';
const LOCAL = (articulo: string) => `reacciones:${articulo}`;

/** Id anónimo y estable por navegador, para que un me gusta se pueda quitar. */
export function visitante(): string {
  try {
    let id = localStorage.getItem('visitante');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('visitante', id);
    }
    return id;
  } catch {
    return 'anonimo';
  }
}

function leerLocal(articulo: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL(articulo)) ?? '[]');
  } catch {
    return [];
  }
}
function guardarLocal(articulo: string, misLikes: string[]) {
  try {
    localStorage.setItem(LOCAL(articulo), JSON.stringify(misLikes));
  } catch {
    /* modo privado: no pasa nada */
  }
}

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(API + ruta, { ...init, signal: ctrl.signal, headers: { 'content-type': 'application/json', ...init?.headers } });
    const datos = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(datos.error ?? `HTTP ${r.status}`), { status: r.status });
    return datos as T;
  } finally {
    clearTimeout(t);
  }
}

export async function cargar(articulo: string): Promise<Estado> {
  try {
    const d = await pedir<Omit<Estado, 'enLinea'>>(`/reacciones?articulo=${encodeURIComponent(articulo)}&visitante=${visitante()}`);
    return { ...d, enLinea: true };
  } catch {
    const misLikes = leerLocal(articulo);
    return { likes: Object.fromEntries(misLikes.map((p) => [p, 1])), comentarios: {}, misLikes, enLinea: false };
  }
}

export async function alternarLike(articulo: string, parrafo: string, estado: Estado): Promise<Estado> {
  const tenia = estado.misLikes.includes(parrafo);
  const misLikes = tenia ? estado.misLikes.filter((p) => p !== parrafo) : [...estado.misLikes, parrafo];
  const likes = { ...estado.likes, [parrafo]: Math.max(0, (estado.likes[parrafo] ?? 0) + (tenia ? -1 : 1)) };
  guardarLocal(articulo, misLikes);
  if (estado.enLinea) {
    try {
      const r = await pedir<{ total: number }>('/like', { method: 'POST', body: JSON.stringify({ articulo, parrafo, visitante: visitante() }) });
      likes[parrafo] = r.total;
    } catch {
      /* se queda el conteo optimista */
    }
  }
  return { ...estado, likes, misLikes };
}

export async function comentar(articulo: string, parrafo: string, nombre: string, texto: string, sitio: string): Promise<Comentario> {
  return pedir<Comentario>('/comentario', { method: 'POST', body: JSON.stringify({ articulo, parrafo, nombre, texto, sitio, visitante: visitante() }) });
}
